/**
 * Draws step pointers onto a screenshot: numbered callouts, boxes around UI, arrows.
 *
 *   node scripts/annotate-screenshot.mjs <spec.json>
 *
 * Spec:
 * {
 *   "in":  "/tmp/shot.png",
 *   "out": "src/assets/whatever.png",
 *   "steps": [
 *     { "box": [x0, y0, x1, y1], "label": "1  Browse",
 *       "labelAt": [x, y], "arrowFrom": [x, y], "arrowTo": [x, y], "radius": 22 }
 *   ]
 * }
 *
 * Every field except `box` is optional — a step can be a bare box, a bare label, or both.
 * Coordinates are pixels in the source image.
 *
 * The visual language is deliberately fixed (see BLOG_GUIDELINES.md): white fill, near-black
 * text, drop shadow. The app is dark and blue, so anything blue reads as part of the UI rather
 * than as annotation — an earlier pass used the brand colour and the pointers disappeared into
 * the interface they were pointing at.
 *
 * Font size scales with image width, so a 400px phone shot and a 1280px desktop shot come out
 * looking like the same system.
 */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const WHITE = '#ffffff';
const INK = '#0a0a0a';
const SHADOW = 'rgba(0,0,0,0.45)';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function arrowHead(x1, y1, x2, y2, size, stroke, colour) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return [2.6, -2.6]
    .map((s) => {
      const hx = x2 + size * Math.cos(a + s);
      const hy = y2 + size * Math.sin(a + s);
      return `<line x1="${x2}" y1="${y2}" x2="${hx}" y2="${hy}" stroke="${colour}" stroke-width="${stroke}" stroke-linecap="round"/>`;
    })
    .join('');
}

async function annotate(spec) {
  const meta = await sharp(spec.in).metadata();
  const W = meta.width;
  const H = meta.height;

  // One scale factor drives everything, so output looks consistent across sizes.
  const k = W / 1280;
  const fontSize = Math.max(16, Math.round(26 * k));
  const stroke = Math.max(3, Math.round(5 * k));
  const pad = Math.round(14 * k);
  const off = Math.max(2, Math.round(3 * k));

  const parts = [];

  for (const step of spec.steps) {
    if (step.box) {
      const [x0, y0, x1, y1] = step.box;
      const r = Math.round((step.radius ?? 12) * k);
      const rect = (dx, dy, colour) =>
        `<rect x="${x0 + dx}" y="${y0 + dy}" width="${x1 - x0}" height="${y1 - y0}" rx="${r}" ry="${r}" fill="none" stroke="${colour}" stroke-width="${stroke}"/>`;
      parts.push(rect(off, off, SHADOW), rect(0, 0, WHITE));
    }

    if (step.arrowFrom && step.arrowTo) {
      const [x1, y1] = step.arrowFrom;
      const [x2, y2] = step.arrowTo;
      const head = Math.round(18 * k);
      for (const [dx, dy, colour] of [
        [off, off, SHADOW],
        [0, 0, WHITE],
      ]) {
        parts.push(
          `<line x1="${x1 + dx}" y1="${y1 + dy}" x2="${x2 + dx}" y2="${y2 + dy}" stroke="${colour}" stroke-width="${stroke}" stroke-linecap="round"/>`,
          arrowHead(x1 + dx, y1 + dy, x2 + dx, y2 + dy, head, stroke, colour)
        );
      }
    }

    if (step.label) {
      const [lx, ly] = step.labelAt ?? [0, 0];
      // Rough advance width for the bold face; good enough to size the pill.
      const textW = step.label.length * fontSize * 0.62;
      const boxW = Math.round(textW + pad * 2);
      const boxH = Math.round(fontSize + pad * 1.4);
      if (lx + boxW > W) {
        console.warn(`  ! label "${step.label}" overflows the right edge — nudge labelAt`);
      }
      const r = Math.round(10 * k);
      const pill = (dx, dy, fill) =>
        `<rect x="${lx + dx}" y="${ly + dy}" width="${boxW}" height="${boxH}" rx="${r}" ry="${r}" fill="${fill}"/>`;
      parts.push(
        pill(off, off, SHADOW),
        pill(0, 0, WHITE),
        `<text x="${lx + pad}" y="${ly + boxH / 2}" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="${fontSize}" font-weight="700" fill="${INK}" dominant-baseline="central" xml:space="preserve">${esc(step.label)}</text>`
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${parts.join('')}</svg>`;
  await sharp(spec.in)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(spec.out);

  console.log(`${spec.out}  (${W}x${H}, ${spec.steps.length} step(s))`);
}

const specPath = process.argv[2];
if (!specPath) {
  console.error('usage: node scripts/annotate-screenshot.mjs <spec.json>');
  process.exit(1);
}
const spec = JSON.parse(await readFile(specPath, 'utf8'));
for (const one of Array.isArray(spec) ? spec : [spec]) await annotate(one);
