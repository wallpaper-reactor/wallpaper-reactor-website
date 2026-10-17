# Analytics (GA4)

All site events go through `src/scripts/analytics.js`, loaded by `src/components/Analytics.astro`
(from `BaseLayout.astro`, and from the Starlight `Head` override for `/docs/`). It sends through the
existing `gtag` from `GoogleAnalytics.astro`: no extra script, cookie or third party. It never calls
`preventDefault`, sends with `transport_type: 'beacon'`, and does nothing if `gtag` is missing.

Links are classified by `data-download-*` attributes when present (`downloadAttrs` / `storeAttrs`), otherwise
by URL pattern, so links written in markdown/MDX need no markup. Store hosts and release-asset extensions are
tables in `analytics.js`; `storeAttrs` in `site.ts` reads the same table.

`npm test` covers the mapping (`test/analytics.test.mjs`). `npm run preview` + `BASE_URL=… npm run tracking:check`
clicks each event on the built site and asserts the recorded `gtag` call.

## Events

| Event | Params | Fires when |
|---|---|---|
| `download` | `platform` (android/windows/macos/linux), `channel` (play/microsoft-store/app-store/direct), `file_type` (`store` or the extension), `link_url` | Click on a store link or a direct release file, anywhere (releases page, hero, store badges, press, docs, blog) |
| `file_download` (GA4 recommended) | `file_extension`, `file_name`, `link_url` | Same click, direct files only (GA4's automatic one misses .dmg/.msi/.deb/.apk/.flatpak) |
| `download_intent` | `platform` (`any`, or linux/windows/… from the `#hash`), `placement` (header/footer/content/main), `link_url` | Click on any internal link to `/releases/`: header nav, hero "Download Linux", blog and docs links. Not a download |
| `web_app_open` | `placement`, `link_url` | Click on a link to `web.wallpaperreactor.app` (hero "Open Web App", the button on `/device`) |
| `social_click` | `network` (discord/x/github), `link_url` | Click on a Discord, X or GitHub link (not release assets) |
| `contact` | `method: email`, `topic` (`press` if the mailto subject is Press, else `general`) | Click on a `mailto:` link. The address is never sent |
| `press_download` | `file_name`, `file_type`, `link_url` | Click on a file under `/assets/press/` (press-kit images and icon). Also sends `file_download` |
| `read_post` | `post_slug`, `seconds` | Blog post: the end-of-article marker is visible **and** 20 s have passed since load. Once per page view |
| `search` (GA4 recommended) | `search_term` (trimmed, lower-cased, ≥ 2 chars) | `/search/` input settles for 800 ms; includes the `?q=` from the header box. The same term twice in a row counts once |
| `page_not_found` | `page_path` (query and hash dropped) | The 404 page loads |

Every event also carries `transport_type: beacon`.

Already covered by GA4 enhanced measurement, so not repeated: `page_view`, `scroll` (90%), generic outbound `click`.
Starlight `/docs/` pages previously loaded no GA at all; they now send `page_view` too (the privacy policy already says the website uses Google Analytics).

## Mark as key events (manual, GA4 admin)

GA4 Admin → Data display → Events → toggle **Mark as key event**. An event appears in that list after its first hit
(up to a day).

1. **`download`**: the conversion. One event for every store or file download.
2. **`web_app_open`**: starts a web-app session.

Optional, only if you want them in conversion reports: `download_intent` (top of funnel; noisy because the header link counts)
and `social_click` filtered to `network = discord` (community join).

Not key events: `read_post`, `search`, `page_not_found`, `contact`, `press_download`, `file_download` (diagnostics).

To use params in reports, register them as custom dimensions (Admin → Custom definitions, event scope):
`platform`, `channel`, `placement`, `network`, `post_slug`, `topic`, `page_path`, `file_type`.

## Adding an event

Write the failing test in `test/analytics.test.mjs`, add the pure mapping to `analytics.js` (a `linkEvents` branch, or a page-level
marker handled in `initAnalytics`), add a case to `scripts/analytics-check.mjs`, then a row to the table above.
