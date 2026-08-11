/**
 * Runs axe-core over every page in the built site and fails on WCAG A/AA violations.
 *
 *   npm run build && node scripts/a11y-check.mjs
 *
 * Pages come from the generated sitemap, so new posts are covered automatically and
 * nobody has to remember to add them to a list. /404.html is added by hand because it
 * is deliberately not in the sitemap.
 *
 * This exists because a text colour shipped at 3.7:1 against its background — below the
 * 4.5:1 AA floor — and sat there unnoticed through several articles. Contrast is the sort
 * of thing that is invisible until someone with worse eyesight or a worse screen than
 * yours tries to read it.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const DIST = resolve('dist');
const PORT = 4487;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain',
  '.riv': 'application/octet-stream', '.woff2': 'font/woff2',
};

function serve(root, port) {
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path.endsWith('/')) path += 'index.html';
    try {
      const body = await readFile(join(root, path));
      res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok(server)));
}

const sitemap = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
const paths = [
  ...new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  ),
  '/404.html',
];

const server = await serve(DIST, PORT);
const browser = await chromium.launch();
// axe-core/playwright requires a context-backed page, not browser.newPage().
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const failures = [];

for (const path of paths) {
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' });

  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  if (violations.length) {
    failures.push({ path, violations });
    console.log(`\n✗ ${path}`);
    for (const v of violations) {
      console.log(`    [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node(s))`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`        ${node.target.join(' ')}`);
        if (node.failureSummary) {
          console.log(`        ${node.failureSummary.split('\n').slice(1).join(' ').trim()}`);
        }
      }
    }
  } else {
    console.log(`✓ ${path}`);
  }

  await page.close();
}

await browser.close();
server.close();

if (failures.length) {
  const total = failures.reduce((n, f) => n + f.violations.length, 0);
  console.error(`\n${total} violation(s) across ${failures.length} page(s).`);
  process.exit(1);
}
console.log(`\nNo WCAG A/AA violations across ${paths.length} pages.`);
