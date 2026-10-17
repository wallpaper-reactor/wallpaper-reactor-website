/**
 * Download tracking for GA4. Links carry `data-download-platform` and `data-download-channel`; one
 * delegated click listener (`DownloadTracking.astro`) turns them into events. GA4's automatic
 * `file_download` misses .dmg, .msi, .deb, .apk and .flatpak, and store buttons are plain outbound links.
 *
 * Self-contained (no imports): the browser test injects this file's source into a blank page.
 */

const PLATFORMS = ['android', 'windows', 'macos', 'linux'];
const CHANNELS = ['play', 'microsoft-store', 'app-store', 'direct'];

/** The data attributes for a tagged link; `channel` defaults to a direct file. */
export function downloadAttrs(platform, channel = 'direct') {
  return { 'data-download-platform': platform, 'data-download-channel': channel };
}

/**
 * Attributes -> `[eventName, params]` pairs to send. Empty for an unknown platform or channel, a missing
 * href, or a direct link that isn't a file, so a mistagged link sends nothing rather than junk.
 * `download` goes out for every download; direct files also send GA4's recommended `file_download`.
 */
export function downloadEvents({ platform, channel = 'direct', href }) {
  if (!PLATFORMS.includes(platform) || !CHANNELS.includes(channel) || !href) return [];
  const fileName = decodeURIComponent(href.split(/[?#]/)[0].split('/').pop() ?? '');
  const dot = fileName.lastIndexOf('.');
  const extension = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : '';
  const direct = channel === 'direct';
  if (direct && !extension) return [];
  // `beacon` lets the hit survive the page navigating away.
  const base = { link_url: href, transport_type: 'beacon' };
  const events = [['download', { platform, channel, file_type: direct ? extension : 'store', ...base }]];
  if (direct) events.push(['file_download', { file_extension: extension, file_name: fileName, ...base }]);
  return events;
}

/**
 * One delegated listener. Never cancels the click, and does nothing when `gtag` is missing
 * (ad blocker, or the script hasn't loaded).
 */
export function trackDownloads(doc) {
  doc.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[data-download-platform]') : null;
    if (!link || typeof window.gtag !== 'function') return;
    const { downloadPlatform: platform, downloadChannel: channel } = link.dataset;
    for (const [name, params] of downloadEvents({ platform, channel, href: link.href })) {
      window.gtag('event', name, params);
    }
  });
}
