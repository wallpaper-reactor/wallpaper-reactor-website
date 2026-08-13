/**
 * Strips camera metadata (EXIF/XMP/IPTC) from images in the repo.
 *
 *   node scripts/clean-image-metadata.mjs          strip in place
 *   node scripts/clean-image-metadata.mjs --check  report only, exit 1 if any found
 *
 * Why this exists, and what it is NOT for:
 *
 * Images imported through `astro:assets` are re-encoded by sharp at build time,
 * and that already drops metadata — the published variants are clean without any
 * help. Two gaps remain, and this covers both:
 *
 *   1. `public/` is copied verbatim. Anything dropped there ships exactly as it
 *      was, metadata included. This is the one that can actually leak.
 *   2. Masters in `src/assets/` keep their metadata in git history even though
 *      the built output doesn't.
 *
 * Phone photos are the risk. A Pixel shot carries make, model, capture time and
 * a GPS block — and "my desk" is usually "my home address".
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOTS = ['src/assets', 'public/assets/images', 'public/assets/videos'];
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff']);

const checkOnly = process.argv.includes('--check');

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // directory may not exist yet
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(e.name).toLowerCase())) yield p;
  }
}

/** Metadata worth stripping. ICC profiles are left alone — they affect colour. */
function dirtyFields(meta) {
  return ['exif', 'xmp', 'iptc'].filter((k) => meta[k]);
}

const found = [];
const cleaned = [];

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const meta = await sharp(file).metadata();
    const dirty = dirtyFields(meta);
    if (dirty.length === 0) continue;

    found.push(`${file} (${dirty.join(', ')})`);
    if (checkOnly) continue;

    // Re-encoding an animation through sharp's default path keeps only the first
    // frame. Rather than silently flatten a carefully tuned animated WebP, skip it
    // and say so — these are hand-encoded and a human should decide.
    if ((meta.pages ?? 1) > 1) {
      console.warn(`  ! ${file} is animated (${meta.pages} frames) — skipped, strip it at encode time`);
      continue;
    }

    const before = (await stat(file)).size;
    // Re-encode without metadata. Passing the buffer avoids reading and writing
    // the same path concurrently.
    const input = await readFile(file);
    const out = await sharp(input).rotate().toBuffer(); // rotate() bakes in orientation before EXIF is dropped
    await writeFile(file, out);
    const after = (await stat(file)).size;
    cleaned.push(`${file}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
  }
}

if (found.length === 0) {
  console.log('No image metadata found.');
  process.exit(0);
}

if (checkOnly) {
  console.error(`Image metadata found in ${found.length} file(s):`);
  found.forEach((f) => console.error('  ' + f));
  console.error('\nRun: npm run images:clean');
  process.exit(1);
}

console.log(`Stripped metadata from ${cleaned.length} file(s):`);
cleaned.forEach((c) => console.log('  ' + c));
