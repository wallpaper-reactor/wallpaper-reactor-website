import { test } from 'node:test';
import assert from 'node:assert/strict';
import { videoObjectSchema, isoDuration, clipUrls } from '../src/data/videoObject.js';

const clip = {
  id: 'demo',
  name: 'A demo',
  description: 'What it shows.',
  uploadDate: '2026-10-18',
  durationSeconds: 12.4,
  width: 1280,
  height: 800,
};
const SITE = 'https://wallpaperreactor.app';

test('isoDuration rounds to whole seconds and handles minutes', () => {
  assert.equal(isoDuration(12.4), 'PT12S');
  assert.equal(isoDuration(12.6), 'PT13S');
  assert.equal(isoDuration(75), 'PT1M15S');
  assert.equal(isoDuration(60), 'PT1M');
});

test('isoDuration refuses a non-positive or non-finite length', () => {
  for (const bad of [0, -1, NaN, Infinity, undefined]) assert.throws(() => isoDuration(bad));
});

test('clipUrls: the files live under /assets/videos/demo/', () => {
  assert.deepEqual(clipUrls('demo'), {
    mp4: '/assets/videos/demo/demo.mp4',
    webm: '/assets/videos/demo/demo.webm',
    poster: '/assets/videos/demo/demo.webp',
  });
});

test('videoObjectSchema has what Google needs, with absolute URLs', () => {
  const s = videoObjectSchema(clip, SITE);
  assert.equal(s['@context'], 'https://schema.org');
  assert.equal(s['@type'], 'VideoObject');
  assert.equal(s.name, 'A demo');
  assert.equal(s.description, 'What it shows.');
  assert.deepEqual(s.thumbnailUrl, [`${SITE}/assets/videos/demo/demo.webp`]);
  assert.equal(s.contentUrl, `${SITE}/assets/videos/demo/demo.mp4`);
  assert.equal(s.uploadDate, '2026-10-18');
  assert.equal(s.duration, 'PT12S');
  assert.equal(s.width, 1280);
  assert.equal(s.height, 800);
});

test('videoObjectSchema refuses a clip missing a required field', () => {
  for (const k of ['id', 'name', 'description', 'uploadDate', 'durationSeconds']) {
    assert.throws(() => videoObjectSchema({ ...clip, [k]: undefined }, SITE), new RegExp(k));
  }
});
