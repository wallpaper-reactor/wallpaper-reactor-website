/**
 * Visual parity harness for the Jekyll -> Astro migration.
 *
 *   node _screenshots/compare.mjs baseline <dir>   capture reference shots from a built Jekyll site
 *   node _screenshots/compare.mjs current  <dir>   capture shots from the built Astro site
 *   node _screenshots/compare.mjs diff             compare current against baseline
 *
 * <dir> is a directory of static files; it gets served locally for the run.
 * Output goes to _screenshots/{baseline,current,diff}/ (all gitignored — these
 * are large binaries and only meaningful within one migration session).
 */
import { createServer } from 'node:http';
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const URLS = JSON.parse(await readFile(new URL('./urls.json', import.meta.url), 'utf8'));

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.riv': 'application/octet-stream',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

/** Serve a static directory, resolving /foo/ to /foo/index.html like GitHub Pages does. */
function serve(root, port) {
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path.endsWith('/')) path += 'index.html';
    const file = join(root, path);
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok(server)));
}

const slug = (url) => (url === '/' ? 'home' : url.replace(/^\/|\/$/g, '').replace(/\//g, '_'));

async function capture(mode, root) {
  const outDir = resolve('_screenshots', mode);
  await mkdir(outDir, { recursive: true });

  const port = 4399;
  const server = await serve(resolve(root), port);
  const browser = await chromium.launch();

  for (const url of URLS) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      // Freeze the animated background blobs so shots are deterministic.
      await page.addStyleTag({
        content: '*,*::before,*::after{animation:none!important;transition:none!important}',
      }).catch(() => {});
      await page.goto(`http://127.0.0.1:${port}${url}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({
        content: '*,*::before,*::after{animation:none!important;transition:none!important}',
      });
      await page.screenshot({ path: join(outDir, `${slug(url)}--${vp.name}.png`), fullPage: true });
      await page.close();
    }
    console.log(`captured ${url}`);
  }

  await browser.close();
  server.close();
  console.log(`\n${URLS.length * VIEWPORTS.length} shots written to _screenshots/${mode}/`);
}

async function diff() {
  const baseDir = resolve('_screenshots/baseline');
  const curDir = resolve('_screenshots/current');
  const outDir = resolve('_screenshots/diff');
  await mkdir(outDir, { recursive: true });

  const shots = (await readdir(baseDir)).filter((f) => f.endsWith('.png'));
  const rows = [];

  for (const shot of shots) {
    const curPath = join(curDir, shot);
    if (!existsSync(curPath)) {
      rows.push({ shot, status: 'MISSING', pct: null });
      continue;
    }
    const a = PNG.sync.read(await readFile(join(baseDir, shot)));
    const b = PNG.sync.read(await readFile(curPath));

    if (a.width !== b.width || a.height !== b.height) {
      rows.push({ shot, status: `SIZE ${a.width}x${a.height} -> ${b.width}x${b.height}`, pct: null });
      continue;
    }

    const out = new PNG({ width: a.width, height: a.height });
    const differing = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: 0.1 });
    const pct = (differing / (a.width * a.height)) * 100;
    if (pct > 0.1) {
      const { writeFile } = await import('node:fs/promises');
      await writeFile(join(outDir, shot), PNG.sync.write(out));
    }
    rows.push({ shot, status: pct > 0.1 ? 'DIFF' : 'ok', pct });
  }

  rows.sort((x, y) => (y.pct ?? Infinity) - (x.pct ?? Infinity));
  for (const r of rows) {
    const pct = r.pct === null ? '' : `${r.pct.toFixed(2)}%`;
    console.log(`${r.status.padEnd(10)} ${pct.padStart(8)}  ${r.shot}`);
  }
}

const [mode, dir] = process.argv.slice(2);
if (mode === 'baseline' || mode === 'current') {
  if (!dir) throw new Error(`usage: node _screenshots/compare.mjs ${mode} <dir>`);
  await capture(mode, dir);
} else if (mode === 'diff') {
  await diff();
} else {
  console.error('usage: compare.mjs baseline|current <dir> | diff');
  process.exit(1);
}
