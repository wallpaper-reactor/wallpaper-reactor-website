/**
 * GA4 events for the site, all through this one module. Links are classified by tagged attributes
 * (`data-download-*`) or, failing that, by URL pattern, so links written in markdown/MDX are tracked
 * without any markup. One delegated click listener (`Analytics.astro`) sends them. Nothing here cancels
 * a click, and everything is a silent no-op when `gtag` is missing (ad blocker, script not loaded).
 *
 * GA4's automatic `file_download` misses .dmg, .msi, .deb, .apk and .flatpak, and store buttons are
 * plain outbound links. Enhanced measurement already sends `page_view`, `scroll` (90%) and a generic
 * outbound `click`, so none of those are repeated here. See docs/ANALYTICS.md for the full event list.
 *
 * Self-contained (no imports): the browser test injects this file's source into a blank page.
 */

const PLATFORMS = ['android', 'windows', 'macos', 'linux'];
const CHANNELS = ['play', 'microsoft-store', 'app-store', 'direct'];
/** `transport_type: 'beacon'` lets the hit survive the page navigating away. */
const BEACON = { transport_type: 'beacon' };

/** The web app's host; `site.ts` builds `WEB_APP` from it. */
export const WEB_APP_HOST = 'web.wallpaperreactor.app';

/** Store hosts -> [platform, channel]. The one place that knows which URL is which store. */
const STORE_HOSTS = {
  'play.google.com': ['android', 'play'],
  'apps.microsoft.com': ['windows', 'microsoft-store'],
  'apps.apple.com': ['macos', 'app-store'],
};

/** Release-asset extension -> platform, for GitHub release links that carry no tags. */
const ASSET_PLATFORMS = {
  apk: 'android', exe: 'windows', msi: 'windows', msix: 'windows', dmg: 'macos', pkg: 'macos',
  deb: 'linux', rpm: 'linux', flatpak: 'linux', appimage: 'linux',
};

const SOCIAL_HOSTS = {
  'discord.gg': 'discord', 'discord.com': 'discord', 'x.com': 'x', 'twitter.com': 'x', 'github.com': 'github',
};

/** Seconds on an article before reaching its end counts as a read (skimmers jump straight down). */
const READ_MIN_SECONDS = 20;
/** Wait for typing to settle before a search counts. */
const SEARCH_DEBOUNCE_MS = 800;

/** The data attributes for a tagged link; `channel` defaults to a direct file. */
export function downloadAttrs(platform, channel = 'direct') {
  return { 'data-download-platform': platform, 'data-download-channel': channel };
}

const parse = (href, base) => {
  try {
    return new URL(href, base);
  } catch {
    return null;
  }
};

const fileNameOf = (href) => decodeURIComponent(href.split(/[?#]/)[0].split('/').pop() ?? '');
const extensionOf = (fileName) => {
  const dot = fileName.lastIndexOf('.');
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : '';
};

/** `[platform, channel]` for a store URL, or null. */
export function storeDownload(href) {
  const host = parse(href)?.hostname;
  return (host && STORE_HOSTS[host]) || null;
}

/**
 * Attributes -> `[eventName, params]` pairs to send. Empty for an unknown platform or channel, a missing
 * href, or a direct link that isn't a file, so a mistagged link sends nothing rather than junk.
 * `download` goes out for every download; direct files also send GA4's recommended `file_download`.
 */
export function downloadEvents({ platform, channel = 'direct', href }) {
  if (!PLATFORMS.includes(platform) || !CHANNELS.includes(channel) || !href) return [];
  const fileName = fileNameOf(href);
  const extension = extensionOf(fileName);
  const direct = channel === 'direct';
  if (direct && !extension) return [];
  const base = { link_url: href, ...BEACON };
  const events = [['download', { platform, channel, file_type: direct ? extension : 'store', ...base }]];
  if (direct) events.push(['file_download', { file_extension: extension, file_name: fileName, ...base }]);
  return events;
}

const isReleaseAsset = (url) => url.hostname === 'github.com' && url.pathname.includes('/releases/download/');

/** Tagged platform/channel if present, else inferred from a store URL or a GitHub release asset. */
function downloadFor({ platform, channel, href, url }) {
  if (platform) return downloadEvents({ platform, channel, href });
  const store = storeDownload(href);
  if (store) return downloadEvents({ platform: store[0], channel: store[1], href });
  if (isReleaseAsset(url)) {
    const fileName = fileNameOf(href);
    const found = ASSET_PLATFORMS[extensionOf(fileName)];
    return found ? downloadEvents({ platform: found, channel: 'direct', href }) : [];
  }
  return [];
}

/**
 * Everything a click on a link can mean, decided from its URL: a download (tagged, store or release
 * asset), intent to download (a link to /releases/, never a `download`), a press-kit asset, the web app,
 * a social network, or an email. `[]` for anything else, including in-page anchors.
 * `origin` is the site's own origin; `placement` is the page region the link sits in.
 */
export function linkEvents({ href, platform, channel, origin, placement = 'main' }) {
  const url = href ? parse(href) : null;
  if (!url || url.protocol === 'javascript:') return [];
  const sameSite = url.origin === origin;

  const downloads = downloadFor({ platform, channel, href, url });
  if (downloads.length || platform || isReleaseAsset(url)) return downloads;

  if (url.protocol === 'mailto:') {
    const topic = /subject=press/i.test(url.search) ? 'press' : 'general';
    return [['contact', { method: 'email', topic, ...BEACON }]];
  }
  if (sameSite && url.pathname.startsWith('/assets/press/')) {
    const fileName = fileNameOf(href);
    const file_type = extensionOf(fileName);
    return [
      ['press_download', { file_name: fileName, file_type, link_url: url.pathname, ...BEACON }],
      ['file_download', { file_extension: file_type, file_name: fileName, link_url: href, ...BEACON }],
    ];
  }
  if (sameSite && url.pathname === '/releases/') {
    const hash = url.hash.slice(1);
    return [['download_intent', {
      platform: PLATFORMS.includes(hash) ? hash : 'any', placement, link_url: url.pathname + url.hash, ...BEACON,
    }]];
  }
  if (url.hostname === WEB_APP_HOST) return [['web_app_open', { placement, link_url: href, ...BEACON }]];
  const network = SOCIAL_HOSTS[url.hostname];
  if (network) return [['social_click', { network, link_url: href, ...BEACON }]];
  return [];
}

/** An article reached its end after being open for `seconds`. Null without a slug. */
export function readPostEvent({ slug, seconds }) {
  const post_slug = (slug ?? '').split('/').filter(Boolean).pop();
  return post_slug ? ['read_post', { post_slug, seconds, ...BEACON }] : null;
}

/** GA4's recommended `search`; the term is trimmed and lower-cased. Null for a term under 2 characters. */
export function searchEvent(term) {
  const search_term = (term ?? '').trim().toLowerCase();
  return search_term.length >= 2 ? ['search', { search_term, ...BEACON }] : null;
}

/** The missing path only: no query or hash, which can carry tokens. Null without a path. */
export function notFoundEvent(path) {
  const page_path = (path ?? '').split(/[?#]/)[0];
  return page_path ? ['page_not_found', { page_path, ...BEACON }] : null;
}

const placementOf = (link) =>
  link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : link.closest('article') ? 'content' : 'main';

/**
 * Wire up every listener. Never cancels an event, and sends nothing when `gtag` is missing.
 * Page-level events are opted into by markup: `[data-page-not-found]`, `[data-read-end]`.
 */
export function initAnalytics(doc) {
  const win = doc.defaultView;
  const send = (event) => {
    if (event && typeof win.gtag === 'function') win.gtag('event', event[0], event[1]);
  };

  doc.addEventListener('click', (event) => {
    const link = event.target instanceof win.Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const { downloadPlatform: platform, downloadChannel: channel } = link.dataset;
    for (const e of linkEvents({ href: link.href, platform, channel, origin: win.location.origin, placement: placementOf(link) })) {
      send(e);
    }
  });

  // Pagefind's input lives in #search on /search/. It also receives the programmatic ?q= value, so a
  // search from the header box is counted here too, once. Same term twice in a row counts once.
  let searchTimer;
  let lastTerm = '';
  doc.addEventListener('input', (event) => {
    const input = event.target;
    if (!(input instanceof win.HTMLInputElement) || !input.closest('#search')) return;
    win.clearTimeout(searchTimer);
    searchTimer = win.setTimeout(() => {
      const e = searchEvent(input.value);
      if (e && e[1].search_term !== lastTerm) {
        lastTerm = e[1].search_term;
        send(e);
      }
    }, SEARCH_DEBOUNCE_MS);
  });

  if (doc.querySelector('[data-page-not-found]')) send(notFoundEvent(win.location.pathname));

  const end = doc.querySelector('[data-read-end]');
  if (end && 'IntersectionObserver' in win) {
    const opened = win.performance.now();
    const observer = new win.IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const fire = () => send(readPostEvent({ slug: end.dataset.postSlug, seconds: Math.round((win.performance.now() - opened) / 1000) }));
      const wait = READ_MIN_SECONDS * 1000 - (win.performance.now() - opened);
      if (wait > 0) win.setTimeout(fire, wait);
      else fire();
    });
    observer.observe(end);
  }
}
