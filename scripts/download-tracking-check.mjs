/**
 * End-to-end check of download tracking against a running site (`npm run preview`).
 *
 *   BASE_URL=http://localhost:4321 node scripts/download-tracking-check.mjs
 *
 * Stubs window.gtag, clicks one direct link and one store link per platform on /releases/, plus the
 * hero buttons on / and the store links on /press/, stops each navigation, and asserts the recorded events.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

const CASES = [
  // [page, link selector, expected download params (link_url is checked as the link's own href)]
  ['/releases/', 'a[href$=".dmg"]', { platform: 'macos', channel: 'direct', file_type: 'dmg' }],
  ['/releases/', 'a[href*="apps.apple.com"]', { platform: 'macos', channel: 'app-store', file_type: 'store' }],
  ['/releases/', 'a[href$="setup.exe"]', { platform: 'windows', channel: 'direct', file_type: 'exe' }],
  ['/releases/', 'a[href*="apps.microsoft.com"]', { platform: 'windows', channel: 'microsoft-store', file_type: 'store' }],
  ['/releases/', 'a[href$=".apk"]', { platform: 'android', channel: 'direct', file_type: 'apk' }],
  ['/releases/', 'a[href*="play.google.com"]', { platform: 'android', channel: 'play', file_type: 'store' }],
  ['/releases/', 'a[href$=".deb"]', { platform: 'linux', channel: 'direct', file_type: 'deb' }],
  ['/releases/', 'a[href$=".flatpak"]', { platform: 'linux', channel: 'direct', file_type: 'flatpak' }],
  ['/', '.download-buttons a[href*="play.google.com"]', { platform: 'android', channel: 'play', file_type: 'store' }],
  ['/', '.download-buttons a[href*="apps.microsoft.com"]', { platform: 'windows', channel: 'microsoft-store', file_type: 'store' }],
  ['/', '.download-buttons a[href*="apps.apple.com"]', { platform: 'macos', channel: 'app-store', file_type: 'store' }],
  ['/press/', 'a[href*="play.google.com"]', { platform: 'android', channel: 'play', file_type: 'store' }],
];

const browser = await chromium.launch();
try {
  for (const [path, selector, expected] of CASES) {
    const page = await (await browser.newContext()).newPage();
    // Keep the real analytics script off the network; only the stub should see events.
    await page.route(/googletagmanager\.com/, (r) => r.abort());
    await page.addInitScript(() => {
      window.calls = [];
      window.gtag = (...a) => window.calls.push(a);
    });
    await page.goto(BASE + path);
    // Stop the navigation (and the new tab) so the page stays put; the listener runs first.
    await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
    const link = page.locator(selector).first();
    const href = await link.evaluate((a) => a.href);
    await link.click();
    const calls = await page.evaluate(() => window.calls.filter((c) => c[0] === 'event'));
    const [, name, params] = calls[0];
    assert.equal(name, 'download', `${path} ${selector}`);
    assert.deepEqual(params, { ...expected, link_url: href, transport_type: 'beacon' }, `${path} ${selector}`);
    if (expected.channel === 'direct') {
      const file = href.split('/').pop();
      assert.deepEqual(calls[1].slice(1), ['file_download', { file_extension: expected.file_type, file_name: file, link_url: href, transport_type: 'beacon' }]);
      assert.equal(calls.length, 2);
    } else {
      assert.equal(calls.length, 1);
    }
    console.log(`ok  ${path.padEnd(11)} ${calls.map((c) => c[1]).join('+').padEnd(22)} ${expected.platform}/${expected.channel}  ${href.slice(0, 80)}`);
    await page.context().close();
  }
  // Ad blocker: no gtag at all must not throw.
  const page = await (await browser.newContext()).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e));
  await page.route(/googletagmanager\.com/, (r) => r.abort());
  await page.goto(BASE + '/releases/');
  await page.evaluate(() => { delete window.gtag; document.addEventListener('click', (e) => e.preventDefault()); });
  await page.locator('a[href$=".apk"]').first().click();
  assert.deepEqual(errors, []);
  console.log('ok  no-gtag click is a silent no-op');
} finally {
  await browser.close();
}
