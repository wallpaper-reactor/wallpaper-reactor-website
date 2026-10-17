import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { downloadEvents, downloadAttrs } from '../src/scripts/download-tracking.js';

const APK = 'https://github.com/wallpaper-reactor/wallpaper-reactor-website/releases/download/0.31.0/wallpaper-reactor-v0.31.0-android.apk';
const PLAY = 'https://play.google.com/store/apps/details?id=app.wallpaperreactor';

test('a direct file sends download and the recommended file_download', () => {
  assert.deepEqual(downloadEvents({ platform: 'android', channel: 'direct', href: APK }), [
    ['download', { platform: 'android', channel: 'direct', file_type: 'apk', link_url: APK, transport_type: 'beacon' }],
    ['file_download', { file_extension: 'apk', file_name: 'wallpaper-reactor-v0.31.0-android.apk', link_url: APK, transport_type: 'beacon' }],
  ]);
});

test('a store link sends only download, with file_type store', () => {
  assert.deepEqual(downloadEvents({ platform: 'android', channel: 'play', href: PLAY }), [
    ['download', { platform: 'android', channel: 'play', file_type: 'store', link_url: PLAY, transport_type: 'beacon' }],
  ]);
});

test('channel defaults to direct', () => {
  const [[, params]] = downloadEvents({ platform: 'linux', href: 'https://x.test/a/app.flatpak' });
  assert.equal(params.channel, 'direct');
  assert.equal(params.file_type, 'flatpak');
});

test('multi-dot names keep the last extension, and query/hash are ignored', () => {
  const events = downloadEvents({ platform: 'macos', channel: 'direct', href: 'https://x.test/a/app.app.tar.gz?x=1#y' });
  assert.equal(events[0][1].file_type, 'gz');
  assert.equal(events[1][1].file_name, 'app.app.tar.gz');
});

test('unknown platform or channel, or a missing href, sends nothing', () => {
  assert.deepEqual(downloadEvents({ platform: 'beos', channel: 'direct', href: APK }), []);
  assert.deepEqual(downloadEvents({ platform: 'android', channel: 'warez', href: APK }), []);
  assert.deepEqual(downloadEvents({ platform: 'android', channel: 'direct', href: '' }), []);
  assert.deepEqual(downloadEvents({ channel: 'direct', href: APK }), []);
});

test('a direct link with no file extension sends nothing', () => {
  assert.deepEqual(downloadEvents({ platform: 'linux', channel: 'direct', href: 'https://x.test/releases/' }), []);
});

test('downloadAttrs builds the data attributes', () => {
  assert.deepEqual(downloadAttrs('windows', 'microsoft-store'), {
    'data-download-platform': 'windows',
    'data-download-channel': 'microsoft-store',
  });
  assert.deepEqual(downloadAttrs('linux'), { 'data-download-platform': 'linux', 'data-download-channel': 'direct' });
});

// --- Listener, in a real browser ------------------------------------------------------

const source = await readFile(new URL('../src/scripts/download-tracking.js', import.meta.url), 'utf8');
const BODY = `<!doctype html><body>
  <a id="direct" href="https://dl.test/app.msi" data-download-platform="windows" data-download-channel="direct"><span id="inner">Download</span></a>
  <a id="store" href="https://store.test/play" data-download-platform="android" data-download-channel="play">Play</a>
  <a id="plain" href="https://dl.test/other.msi">Other</a>
</body>`;

async function withPage({ gtag }, fn) {
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext()).newPage();
    await page.route('https://page.test/**', (r) => r.fulfill({ contentType: 'text/html', body: BODY }));
    await page.route('https://dl.test/**', (r) => r.fulfill({ body: 'x' }));
    await page.route('https://store.test/**', (r) => r.fulfill({ contentType: 'text/html', body: 'store' }));
    await page.goto('https://page.test/');
    if (gtag) await page.evaluate(() => { window.calls = []; window.gtag = (...a) => window.calls.push(a); });
    await page.addScriptTag({ type: 'module', content: source.replace(/^export /gm, '') + '\ntrackDownloads(document);' });
    await page.evaluate(() => window.__ready = true);
    await fn(page);
  } finally {
    await browser.close();
  }
}

test('clicking a tagged link calls gtag and does not cancel the click', async () => {
  await withPage({ gtag: true }, async (page) => {
    const prevented = await page.evaluate(() => {
      let defaultPrevented = null;
      document.addEventListener('click', (e) => { defaultPrevented = e.defaultPrevented; e.preventDefault(); }, false);
      document.querySelector('#inner').click();
      return defaultPrevented;
    });
    assert.equal(prevented, false);
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls.map((c) => [c[0], c[1]]), [['event', 'download'], ['event', 'file_download']]);
    assert.equal(calls[0][2].platform, 'windows');
    assert.equal(calls[0][2].link_url, 'https://dl.test/app.msi');
    assert.equal(calls[0][2].transport_type, 'beacon');
  });
});

test('store link sends one event', async () => {
  await withPage({ gtag: true }, async (page) => {
    await page.evaluate(() => { document.addEventListener('click', (e) => e.preventDefault()); document.querySelector('#store').click(); });
    const calls = await page.evaluate(() => window.calls);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].slice(0, 2), ['event', 'download']);
    assert.equal(calls[0][2].file_type, 'store');
  });
});

test('untagged links send nothing', async () => {
  await withPage({ gtag: true }, async (page) => {
    await page.evaluate(() => { document.addEventListener('click', (e) => e.preventDefault()); document.querySelector('#plain').click(); });
    assert.deepEqual(await page.evaluate(() => window.calls), []);
  });
});

test('without gtag (ad blocker) a click is a silent no-op', async () => {
  await withPage({ gtag: false }, async (page) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e));
    await page.evaluate(() => { document.addEventListener('click', (e) => e.preventDefault()); document.querySelector('#direct').click(); });
    assert.deepEqual(errors, []);
  });
});
