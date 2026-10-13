import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Every post links to related guides (Kyle, 2026-10-13: "cross linking when we can"): the post page
// renders `related` as a "Related guides" block, so a new post cannot ship unlinked.
const dir = new URL('../src/content/blog/', import.meta.url).pathname;
const posts = readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
const ids = new Set(posts.map((f) => f.replace(/\.mdx?$/, '')));

function related(file) {
	const front = readFileSync(join(dir, file), 'utf8').split(/^---$/m)[1] ?? '';
	const block = front.match(/^related:\s*\n((?:\s+-\s+.+\n?)+)/m);
	return block ? [...block[1].matchAll(/-\s+['"]?([^'"\s]+)['"]?/g)].map((m) => m[1]) : [];
}

for (const file of posts) {
	const id = file.replace(/\.mdx?$/, '');
	test(`${id} lists at least two related guides that exist`, () => {
		const list = related(file);
		assert.ok(list.length >= 2, `${id}: related has ${list.length}`);
		for (const other of list) {
			assert.ok(ids.has(other), `${id}: unknown related post ${other}`);
			assert.notEqual(other, id, `${id}: lists itself`);
		}
	});
}

test('every post is someone else’s related guide', () => {
	const linked = new Set(posts.flatMap(related));
	for (const id of ids) assert.ok(linked.has(id), `${id} is never listed as related`);
});
