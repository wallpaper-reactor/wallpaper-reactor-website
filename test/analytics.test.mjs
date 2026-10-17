import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import {
  downloadEvents, downloadAttrs, storeDownload, linkEvents, readPostEvent, searchEvent, notFoundEvent, WEB_APP_HOST,
} from '../src/scripts/analytics.js';
import { WEB_APP, STORES, storeAttrs } from '../src/data/site.ts';

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


// --- linkEvents: every other link-shaped event, decided by URL pattern ------------------

const ORIGIN = 'https://wallpaperreactor.app';
const B = { transport_type: 'beacon' };
const ev = (href, extra = {}) => linkEvents({ href, origin: ORIGIN, ...extra });

test('store URLs map to platform and channel in one table, shared with storeAttrs', () => {
  assert.deepEqual(storeDownload(STORES.googlePlay), ['android', 'play']);
  assert.deepEqual(storeDownload(STORES.microsoft), ['windows', 'microsoft-store']);
  assert.deepEqual(storeDownload(STORES.appStoreLite), ['macos', 'app-store']);
  assert.equal(storeDownload('https://example.com/'), null);
  assert.deepEqual(storeAttrs('googlePlay'), downloadAttrs('android', 'play'));
  assert.equal(WEB_APP, `https://${WEB_APP_HOST}`);
});

test('an untagged store link (markdown) is a download, same as a tagged one', () => {
  assert.deepEqual(ev(STORES.googlePlay), downloadEvents({ platform: 'android', channel: 'play', href: STORES.googlePlay }));
  assert.deepEqual(ev('https://apps.microsoft.com/detail/9n4302crdqrl')[0][1].channel, 'microsoft-store');
});

test('an untagged GitHub release asset is a direct download, platform from the file', () => {
  const dl = (name) => ev(`https://github.com/wallpaper-reactor/x/releases/download/0.31.0/${name}`);
  assert.equal(dl('a-setup.exe')[0][1].platform, 'windows');
  assert.equal(dl('a.msi')[0][1].platform, 'windows');
  assert.equal(dl('a.dmg')[0][1].platform, 'macos');
  assert.equal(dl('a.apk')[0][1].platform, 'android');
  assert.equal(dl('a.deb')[0][1].platform, 'linux');
  assert.equal(dl('a.flatpak')[1][0], 'file_download');
  assert.deepEqual(dl('SHA256SUMS.txt'), []);
});

test('tagged attributes win over the URL pattern', () => {
  const [[, params]] = ev(STORES.googlePlay, { platform: 'windows', channel: 'play' });
  assert.equal(params.platform, 'windows');
});

test('a link to /releases/ is download_intent, never download', () => {
  assert.deepEqual(ev(`${ORIGIN}/releases/`, { placement: 'main' }), [
    ['download_intent', { platform: 'any', placement: 'main', link_url: '/releases/', ...B }],
  ]);
  assert.deepEqual(ev(`${ORIGIN}/releases/#linux`, { placement: 'main' })[0][1], {
    platform: 'linux', placement: 'main', link_url: '/releases/#linux', ...B,
  });
  assert.equal(ev(`${ORIGIN}/releases/#nope`)[0][1].platform, 'any');
  assert.deepEqual(ev('https://other.test/releases/'), []);
});

test('the web app is web_app_open, with placement', () => {
  assert.deepEqual(ev(WEB_APP, { placement: 'main' }), [
    ['web_app_open', { placement: 'main', link_url: WEB_APP, ...B }],
  ]);
  assert.equal(ev(`${WEB_APP}/device`)[0][0], 'web_app_open');
});

test('social and community links send social_click with the network', () => {
  assert.deepEqual(ev('https://discord.gg/3MTu59zGH8'), [['social_click', { network: 'discord', link_url: 'https://discord.gg/3MTu59zGH8', ...B }]]);
  assert.equal(ev('https://x.com/LikeEich')[0][1].network, 'x');
  assert.equal(ev('https://github.com/wallpaper-reactor')[0][1].network, 'github');
  assert.equal(ev('https://twitter.com/LikeEich')[0][1].network, 'x');
});

test('mailto sends contact with the topic and never the address', () => {
  assert.deepEqual(ev('mailto:kyle@skylines.sh?subject=Press'), [['contact', { method: 'email', topic: 'press', ...B }]]);
  assert.deepEqual(ev('mailto:kyle@skylines.sh'), [['contact', { method: 'email', topic: 'general', ...B }]]);
});

test('press kit assets send press_download and the recommended file_download', () => {
  const href = `${ORIGIN}/assets/press/screenshots/phone-browse.png`;
  assert.deepEqual(ev(href), [
    ['press_download', { file_name: 'phone-browse.png', file_type: 'png', link_url: '/assets/press/screenshots/phone-browse.png', ...B }],
    ['file_download', { file_extension: 'png', file_name: 'phone-browse.png', link_url: href, ...B }],
  ]);
});

test('ordinary links, in-page anchors, junk and other origins send nothing', () => {
  for (const href of [`${ORIGIN}/features/`, `${ORIGIN}/blog/x/`, `${ORIGIN}/#plans`, 'https://ffmpeg.org/download.html', 'javascript:void(0)', '', 'not a url', undefined]) {
    assert.deepEqual(ev(href), [], String(href));
  }
});

test('readPostEvent, searchEvent and notFoundEvent', () => {
  assert.deepEqual(readPostEvent({ slug: '/blog/a/', seconds: 42 }), ['read_post', { post_slug: 'a', seconds: 42, ...B }]);
  assert.deepEqual(readPostEvent({ slug: '', seconds: 5 }), null);
  assert.deepEqual(searchEvent('  Plasma Shader '), ['search', { search_term: 'plasma shader', ...B }]);
  assert.equal(searchEvent(' a '), null);
  assert.equal(searchEvent(''), null);
  assert.deepEqual(notFoundEvent('/nope/?utm=1#x'), ['page_not_found', { page_path: '/nope/', ...B }]);
  assert.equal(notFoundEvent(''), null);
});

// --- Listener, in a real browser ------------------------------------------------------

const source = await readFile(new URL('../src/scripts/analytics.js', import.meta.url), 'utf8');
const BODY = `<!doctype html><body>
  <a id="direct" href="https://dl.test/app.msi" data-download-platform="windows" data-download-channel="direct"><span id="inner">Download</span></a>
  <a id="store" href="https://store.test/play" data-download-platform="android" data-download-channel="play">Play</a>
  <a id="plain" href="https://dl.test/other.msi">Other</a>
  <a id="md-store" href="https://play.google.com/store/apps/details?id=app.wallpaperreactor">Play</a>
  <a id="rel" href="/releases/#linux">Releases</a>
  <a id="mail" href="mailto:a@b.test?subject=Press">Mail</a>
  <div id="search"><input id="q" type="text"></div>
  <article><p>text</p><div id="end" data-read-end data-post-slug="/blog/demo/" style="margin-top:3000px"></div></article>
</body>`;

async function withPage({ gtag, body, clock }, fn) {
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext()).newPage();
    await page.route('https://page.test/**', (r) => r.fulfill({ contentType: 'text/html', body: body ?? BODY }));
    await page.route('https://dl.test/**', (r) => r.fulfill({ body: 'x' }));
    await page.route('https://store.test/**', (r) => r.fulfill({ contentType: 'text/html', body: 'store' }));
    if (clock) await page.clock.install();
    await page.goto('https://page.test/');
    if (gtag) await page.evaluate(() => { window.calls = []; window.gtag = (...a) => window.calls.push(a); });
    await page.addScriptTag({ type: 'module', content: source.replace(/^export /gm, '') + '\ninitAnalytics(document);' });
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

test('an untagged store link, /releases/ link and mailto go through the same listener', async () => {
  await withPage({ gtag: true }, async (page) => {
    await page.evaluate(() => { document.addEventListener('click', (e) => e.preventDefault()); });
    for (const id of ['md-store', 'rel', 'mail']) await page.evaluate((i) => document.getElementById(i).click(), id);
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls.map((c) => c[1]), ['download', 'download_intent', 'contact']);
    assert.equal(calls[1][2].platform, 'linux');
  });
});

test('typing in the search box sends one debounced search per distinct term', async () => {
  await withPage({ gtag: true, clock: true }, async (page) => {
    const type = (v) => page.evaluate((x) => { const q = document.getElementById('q'); q.value = x; q.dispatchEvent(new Event('input', { bubbles: true })); }, v);
    await type('pl'); await type('plasma');
    await page.clock.fastForward(1500);
    await type('plasma');
    await page.clock.fastForward(1500);
    const calls = (await page.evaluate(() => window.calls)).filter((c) => c[1] === 'search');
    assert.equal(calls.length, 1);
    assert.equal(calls[0][2].search_term, 'plasma');
  });
});

test('read_post fires once at the end of the article, but not before the minimum read time', async () => {
  await withPage({ gtag: true, clock: true }, async (page) => {
    await page.evaluate(() => document.getElementById('end').scrollIntoView());
    await page.waitForTimeout(300);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => c[1] === 'read_post')), []);
    await page.clock.fastForward(25000);
    const calls = await page.evaluate(() => window.calls.filter((c) => c[1] === 'read_post'));
    assert.equal(calls.length, 1);
    assert.equal(calls[0][2].post_slug, 'demo');
    await page.evaluate(() => { window.scrollTo(0, 0); document.getElementById('end').scrollIntoView(); });
    await page.clock.fastForward(25000);
    assert.equal((await page.evaluate(() => window.calls.filter((c) => c[1] === 'read_post'))).length, 1);
  });
});

test('a page marked data-page-not-found sends page_not_found with the path', async () => {
  await withPage({ gtag: true, body: '<!doctype html><body><div data-page-not-found></div></body>' }, async (page) => {
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls.map((c) => [c[1], c[2].page_path]), [['page_not_found', '/']]);
  });
});
