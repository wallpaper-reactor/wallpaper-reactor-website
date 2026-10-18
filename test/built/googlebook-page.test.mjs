// Run after `npm run build` (`npm run test:built`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const opts = { skip: !existsSync(dist) && 'no dist/: run `npm run build` first' };
const read = (p) => readFileSync(resolve(dist, p), 'utf8');

test('/googlebook/ has a title, description, canonical and a FAQPage', opts, () => {
	const html = read('googlebook/index.html');
	assert.match(html, /<title>Live Wallpaper for Googlebook \| Wallpaper Reactor<\/title>/);
	assert.match(html, /<link rel="canonical" href="https:\/\/wallpaperreactor\.app\/googlebook\/"/);
	const desc = html.match(/<meta name="description" content="([^"]+)"/)[1];
	assert.match(desc, /live wallpaper/i);
	assert.match(desc, /animated wallpaper/i);
	assert.ok(desc.length <= 160, `description is ${desc.length} chars`);
	assert.match(html, /"@type":"FAQPage"/);
	assert.match(html, /href="\/blog\/live-wallpaper-googlebook\/"/);
	assert.match(html, /href="\/blog\/wallpaper-engine-for-googlebook\/"/);
	assert.match(html, /href="\/releases\/"/);
});

test('/googlebook/ is in the sitemap and linked from the footer of the home page', opts, () => {
	assert.match(read('sitemap-0.xml'), /<loc>https:\/\/wallpaperreactor\.app\/googlebook\/<\/loc>/);
	assert.match(read('index.html'), /<footer[\s\S]*href="\/googlebook\/"/);
});
