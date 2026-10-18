// Run after `npm run build` (`npm run test:built`): checks the emitted HTML, not the builder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const opts = { skip: !existsSync(dist) && 'no dist/: run `npm run build` first' };

function schemas(path) {
	const html = readFileSync(resolve(dist, path), 'utf8');
	return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) =>
		JSON.parse(m[1])
	);
}

for (const page of ['index.html', 'features/index.html', 'blog/wallpaper-engine-free/index.html']) {
	test(`${page} carries exactly one valid SoftwareApplication`, opts, () => {
		const apps = schemas(page).filter((s) => s['@type'] === 'SoftwareApplication');
		assert.equal(apps.length, 1);
		const [app] = apps;
		for (const key of ['name', 'applicationCategory', 'operatingSystem', 'offers', 'url', 'image', 'downloadUrl'])
			assert.ok(app[key], `${page}: missing ${key}`);
		assert.equal(app.downloadUrl, 'https://wallpaperreactor.app/releases/');
		assert.match(app.image, /^https:\/\//);
		assert.equal('aggregateRating' in app, false);
	});
}

test('the pricing page keeps its paid offer', opts, () => {
	const [app] = schemas('features/index.html').filter((s) => s['@type'] === 'SoftwareApplication');
	assert.ok(app.offers.some((o) => o.price === '3'));
});
