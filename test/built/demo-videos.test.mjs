// Run after `npm run build` (`npm run test:built`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const opts = { skip: !existsSync(dist) && 'no dist/: run `npm run build` first' };
const read = (p) => readFileSync(resolve(dist, p), 'utf8');

function* pages(dir = dist) {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = resolve(dir, e.name);
		if (e.isDirectory()) yield* pages(p);
		else if (e.name === 'index.html') yield p;
	}
}

const videosIn = (html) => [...html.matchAll(/<video\b[^>]*>[\s\S]*?<\/video>/g)].map((m) => m[0]);
const videoObjects = (html) =>
	[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
		.map((m) => JSON.parse(m[1]))
		.filter((j) => j['@type'] === 'VideoObject');

// A source must not have a plain `src`: the file is named in `data-src` and set when the clip scrolls near.
test('no demo <source> names its file in src (it would download at page load)', opts, () => {
	for (const file of pages()) {
		for (const tag of videosIn(readFileSync(file, 'utf8'))) {
			if (tag.includes('data-demo-video')) assert.doesNotMatch(tag, /<source src=/, file.replace(dist, ''));
		}
	}
});

// The home page's wallpaper loops (VideoShowcase) are wallpapers, not clips of the app: no poster, no schema.
const SHOWCASE = /\/assets\/videos\/[a-z0-9-]+\.mp4/;

test('every demo <video> is muted, playsinline, lazy, with a poster and a webm + mp4 source', opts, () => {
	let seen = 0;
	for (const file of pages()) {
		for (const tag of videosIn(readFileSync(file, 'utf8'))) {
			if (!tag.includes('data-demo-video')) continue;
			seen++;
			const where = file.replace(dist, '');
			assert.match(tag, /\smuted[\s>=]/, `${where}: not muted`);
			assert.match(tag, /\splaysinline[\s>=]/, `${where}: no playsinline`);
			assert.match(tag, /\sloop[\s>=]/, `${where}: no loop`);
			assert.match(tag, /\spreload="none"/, `${where}: preload is not none`);
			assert.match(tag, /\sposter="\/assets\/videos\/[^"]+\.webp"/, `${where}: no poster`);
			assert.match(tag, /<source data-src="[^"]+\.webm" type="video\/webm"/, `${where}: no webm`);
			assert.match(tag, /<source data-src="[^"]+\.mp4" type="video\/mp4"/, `${where}: no mp4`);
		}
	}
	assert.ok(seen >= 6, `expected the Googlebook placements, saw ${seen} demo videos`);
});

test('every demo clip on a page has a matching VideoObject with real files behind it', opts, () => {
	for (const file of pages()) {
		const html = readFileSync(file, 'utf8');
		const clips = videosIn(html).filter((t) => t.includes('data-demo-video'));
		if (!clips.length) continue;
		const where = file.replace(dist, '');
		const objects = videoObjects(html);
		assert.equal(objects.length, clips.length, `${where}: ${clips.length} clips, ${objects.length} VideoObjects`);
		for (const o of objects) {
			for (const k of ['name', 'description', 'thumbnailUrl', 'contentUrl', 'uploadDate', 'duration']) {
				assert.ok(o[k] && o[k].length !== 0, `${where}: VideoObject has no ${k}`);
			}
			assert.match(o.duration, /^PT(\d+M)?(\d+S)?$/);
			for (const url of [o.contentUrl, ...o.thumbnailUrl]) {
				assert.ok(url.startsWith('https://wallpaperreactor.app/assets/videos/'), url);
				const f = resolve(dist, url.replace('https://wallpaperreactor.app/', ''));
				assert.ok(existsSync(f), `${where}: ${url} is not in dist`);
			}
			const src = clips.find((t) => t.includes(o.contentUrl.replace('https://wallpaperreactor.app', '')));
			assert.ok(src, `${where}: no <video> plays ${o.contentUrl}`);
		}
	}
});

test('each clip under public/assets/videos/<id>/ stays under 3 MB', opts, () => {
	const root = resolve(dist, 'assets/videos');
	for (const d of readdirSync(root, { withFileTypes: true })) {
		if (!d.isDirectory()) continue;
		for (const f of readdirSync(resolve(root, d.name))) {
			if (/\.(mp4|webm)$/.test(f)) assert.ok(statSync(resolve(root, d.name, f)).size < 3_000_000, `${d.name}/${f} is over 3 MB`);
		}
	}
});

test('the home page wallpaper loops are untouched by the demo clip rules', opts, () => {
	assert.match(read('index.html'), SHOWCASE);
});
