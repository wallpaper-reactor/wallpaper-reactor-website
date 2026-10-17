/**
 * End-to-end check of GA4 tracking against a running site (`npm run preview`).
 *
 *   BASE_URL=http://localhost:4321 node scripts/download-tracking-check.mjs
 *
 * Stubs window.gtag, clicks one direct link and one store link per platform on /releases/, plus the
 * hero buttons on / and the store links on /press/, stops each navigation, and asserts the recorded events.
 * Then the other events: download links in docs and blog markdown, /releases/ intent, web app, social,
 * contact, press assets, search, read_post and page_not_found.
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
  // Other events. [name, path, selector, [expected [event, params-subset] pairs]]
  const LINKS = [
    ['docs store link (markdown)', '/docs/getting-started/', 'main a[href*="play.google.com"]', [['download', { platform: 'android', channel: 'play', file_type: 'store' }]]],
    ['docs store link (markdown)', '/docs/getting-started/', 'main a[href*="apps.microsoft.com"]', [['download', { platform: 'windows', channel: 'microsoft-store' }]]],
    ['docs store link (markdown)', '/docs/getting-started/', 'main a[href*="apps.apple.com"]', [['download', { platform: 'macos', channel: 'app-store' }]]],
    ['blog store link (mdx)', '/blog/live-wallpaper-googlebook/', 'article a[href*="play.google.com"]', [['download', { platform: 'android', channel: 'play' }]]],
    ['hero Download Linux', '/', '.download-buttons a[href="/releases/#linux"]', [['download_intent', { platform: 'linux', placement: 'main', link_url: '/releases/#linux' }]]],
    ['header nav Releases', '/features/', 'header a[href="/releases/"]', [['download_intent', { platform: 'any', placement: 'header' }]]],
    ['blog Download CTA', '/blog/live-wallpaper-googlebook/', 'article a[href="/releases/"]', [['download_intent', { placement: 'content' }]]],
    ['hero Open Web App', '/', '.download-buttons a[href^="https://web.wallpaperreactor.app"]', [['web_app_open', { placement: 'main' }]]],
    ['support Discord', '/support/', 'a[href*="discord.gg"]', [['social_click', { network: 'discord' }]]],
    ['support X', '/support/', 'a[href*="x.com"]', [['social_click', { network: 'x' }]]],
    ['support email', '/support/', 'a[href^="mailto:"]', [['contact', { method: 'email', topic: 'general' }]]],
    ['press email', '/press/', 'a[href*="subject=Press"]', [['contact', { method: 'email', topic: 'press' }]]],
    ['press image', '/press/', 'a[href$="phone-browse.png"]', [['press_download', { file_name: 'phone-browse.png', file_type: 'png' }], ['file_download', { file_extension: 'png' }]]],
    ['press icon', '/press/', 'a[href$="wallpaper-reactor-icon.png"]', [['press_download', { file_type: 'png' }], ['file_download', {}]]],
  ];
  const record = async (path, { clock = false } = {}) => {
    const page = await (await browser.newContext()).newPage();
    await page.route(/googletagmanager\.com/, (r) => r.abort());
    await page.addInitScript(() => { window.calls = []; window.gtag = (...a) => window.calls.push(a); });
    if (clock) await page.clock.install();
    await page.goto(BASE + path);
    return page;
  };
  const events = (page) => page.evaluate(() => window.calls.filter((c) => c[0] === 'event').map((c) => [c[1], c[2]]));
  const assertEvents = (got, expected, label) => {
    assert.deepEqual(got.map(([n]) => n), expected.map(([n]) => n), label);
    got.forEach(([, params], i) => {
      assert.equal(params.transport_type, 'beacon', label);
      for (const [k, v] of Object.entries(expected[i][1])) assert.equal(params[k], v, `${label}: ${k}`);
    });
  };
  for (const [label, path, selector, expected] of LINKS) {
    const page = await record(path);
    await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
    await page.locator(selector).first().click();
    assertEvents(await events(page), expected, `${label} ${path} ${selector}`);
    console.log(`ok  ${path.padEnd(32)} ${expected.map(([n]) => n).join('+').padEnd(26)} ${label}`);
    await page.context().close();
  }

  // Search: /search/?q= lands, Pagefind runs, one debounced `search` for the term.
  {
    const page = await record('/search/?q=plasma', { clock: true });
    await page.waitForSelector('#search input');
    await page.clock.fastForward(2000);
    assertEvents(await events(page), [['search', { search_term: 'plasma' }]], 'search');
    console.log('ok  /search/?q=plasma                search                     debounced, once');
    await page.context().close();
  }

  // read_post: scroll to the end marker; nothing before the minimum read time, once after.
  {
    const page = await record('/blog/live-wallpaper-googlebook/', { clock: true });
    await page.locator('[data-read-end]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    assert.deepEqual(await events(page), [], 'read_post fired before the minimum read time');
    await page.clock.fastForward(25000);
    assertEvents(await events(page), [['read_post', { post_slug: 'live-wallpaper-googlebook' }]], 'read_post');
    console.log('ok  /blog/live-wallpaper-googlebook/ read_post                  once, after min time');
    await page.context().close();
  }

  // page_not_found: an unknown path served as the 404 page (query and hash are dropped).
  {
    const page = await record('/no-such-page/?token=secret#x');
    assertEvents(await events(page), [['page_not_found', { page_path: '/no-such-page/' }]], '404');
    console.log('ok  /no-such-page/                   page_not_found');
    await page.context().close();
  }

  // Plain internal links send nothing.
  {
    const page = await record('/features/');
    await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
    await page.locator('main a[href^="/blog/"]').first().click();
    assert.deepEqual(await events(page), []);
    console.log('ok  plain internal link sends nothing');
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
