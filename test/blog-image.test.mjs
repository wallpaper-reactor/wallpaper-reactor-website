import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// A post's social image (front matter `image`) must exist and carry alt text; the Googlebook article
// ships with one because its screenshots are the share card.
const dir = new URL('../src/content/blog/', import.meta.url).pathname;
const front = (file) => readFileSync(join(dir, file), 'utf8').split(/^---$/m)[1] ?? '';
const field = (text, name) => text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].replace(/^['"]|['"]$/g, '');

test('the Googlebook article has a social image that exists, with alt text', () => {
	const f = front('live-wallpaper-googlebook.mdx');
	const image = field(f, 'image');
	assert.ok(image, 'no image: front matter');
	assert.ok(existsSync(join(dir, image)), `${image} does not exist`);
	assert.ok(field(f, 'imageAlt'), 'image needs imageAlt');
});
