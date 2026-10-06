import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import {
  parseAuthError,
  describeAuthError,
  stripAuthError,
} from '../src/scripts/auth-error.js';

const DESC = 'PKCE+flow+state+is+expired';

test('parses the query-string form', () => {
  assert.deepEqual(
    parseAuthError(`?error=server_error&error_code=flow_state_expired&error_description=${DESC}`, ''),
    { error: 'server_error', code: 'flow_state_expired', description: 'PKCE flow state is expired' }
  );
});

test('parses the fragment form', () => {
  assert.deepEqual(
    parseAuthError('', '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid'),
    { error: 'access_denied', code: 'otp_expired', description: 'Email link is invalid' }
  );
});

test('query wins over fragment per key, and the two can be combined', () => {
  assert.deepEqual(parseAuthError('?error=a', '#error=b&error_code=c'), {
    error: 'a',
    code: 'c',
    description: '',
  });
});

test('returns null when there is no auth error', () => {
  assert.equal(parseAuthError('', ''), null);
  assert.equal(parseAuthError('?q=1&ref=x', '#main'), null);
  assert.equal(parseAuthError('?error=', '#error_code='), null);
});

test('maps flow_state_expired to the expired message', () => {
  const info = describeAuthError({ error: 'server_error', code: 'flow_state_expired', description: 'x' });
  assert.equal(info.message, 'Your sign-in link expired. Go back to Wallpaper Reactor and sign in again.');
  assert.equal(info.detail, '');
});

test('maps any expired code or description to the expired message', () => {
  const msg = 'Your sign-in link expired. Go back to Wallpaper Reactor and sign in again.';
  assert.equal(describeAuthError({ error: 'access_denied', code: 'otp_expired', description: '' }).message, msg);
  assert.equal(describeAuthError({ error: 'x', code: '', description: 'Link has Expired' }).message, msg);
});

test('maps access_denied to cancelled', () => {
  const info = describeAuthError({ error: 'access_denied', code: '', description: 'User denied' });
  assert.equal(info.message, 'Sign-in was cancelled.');
  assert.equal(info.detail, '');
});

test('maps anything else to the generic message and keeps the provider description as detail', () => {
  const info = describeAuthError({ error: 'server_error', code: 'unexpected_failure', description: 'Boom happened' });
  assert.equal(info.message, "Sign-in didn't finish. Go back to Wallpaper Reactor and try again.");
  assert.equal(info.detail, 'Boom happened');
});

test('strips only the auth params from query and fragment, keeping the rest', () => {
  assert.deepEqual(
    stripAuthError('?ref=x&error=e&error_code=c&error_description=d', '#error=e&section=2'),
    { search: '?ref=x', hash: '#section=2' }
  );
  assert.deepEqual(stripAuthError('?error=e', '#error_code=c&error_description=d'), { search: '', hash: '' });
});

test('leaves a plain anchor fragment alone', () => {
  assert.deepEqual(stripAuthError('?error=e', '#main'), { search: '', hash: '#main' });
});

// --- DOM behaviour, in a real browser -------------------------------------------------

const source = await readFile(new URL('../src/scripts/auth-error.js', import.meta.url), 'utf8');

async function withPage(url, fn) {
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext()).newPage();
    // A real origin is needed for history.replaceState; route it to a blank page.
    await page.route('https://example.test/**', (r) =>
      r.fulfill({ contentType: 'text/html', body: '<!doctype html><body><main id="main"></main></body>' })
    );
    await page.goto(url);
    await page.addScriptTag({ type: 'module', content: source.replace(/^export /gm, '') + '\nshowAuthError(window);' });
    await fn(page);
  } finally {
    await browser.close();
  }
}

test('shows a dismissible notice with a support link and cleans the address bar', async () => {
  await withPage('https://example.test/?error=server_error&error_code=flow_state_expired&keep=1', async (page) => {
    const notice = page.locator('[data-auth-error]');
    await notice.waitFor();
    assert.match(await notice.innerText(), /Your sign-in link expired/);
    assert.equal(await notice.locator('a[href="/support/"]').count(), 1);
    assert.equal(await page.evaluate(() => location.search), '?keep=1');
    await notice.getByRole('button', { name: /dismiss/i }).click();
    assert.equal(await page.locator('[data-auth-error]').count(), 0);
  });
});

test('reads the fragment form in the browser', async () => {
  await withPage('https://example.test/#error=access_denied&error_description=nope', async (page) => {
    assert.match(await page.locator('[data-auth-error]').innerText(), /Sign-in was cancelled/);
    assert.equal(await page.evaluate(() => location.hash), '');
  });
});

test('never injects the provider description as HTML', async () => {
  const evil = encodeURIComponent('<img src=x onerror="window.pwned=1"><b>bold</b>');
  await withPage(`https://example.test/?error=server_error&error_description=${evil}`, async (page) => {
    const notice = page.locator('[data-auth-error]');
    await notice.waitFor();
    assert.equal(await notice.locator('img, b').count(), 0);
    assert.equal(await page.evaluate(() => window.pwned), undefined);
    assert.match(await notice.locator("details").textContent(), /<img src=x onerror=.*<b>bold<\/b>/);
  });
});

test('does nothing on a page without an auth error', async () => {
  await withPage('https://example.test/?q=1', async (page) => {
    assert.equal(await page.locator('[data-auth-error]').count(), 0);
  });
});
