import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { DEMO_CLIPS } from '../src/data/demoClips.js';
import { clipUrls, videoObjectSchema } from '../src/data/videoObject.js';

const file = (url) => `public${url}`;
const hasFfprobe = (() => {
  try { execFileSync('ffprobe', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; }
})();

test('every clip has its mp4, webm and poster, and builds a VideoObject', () => {
  for (const [id, clip] of Object.entries(DEMO_CLIPS)) {
    for (const url of Object.values(clipUrls(id))) assert.ok(existsSync(file(url)), `${id}: ${url} is missing`);
    assert.doesNotThrow(() => videoObjectSchema({ id, ...clip }, 'https://wallpaperreactor.app'), id);
    assert.ok(clip.caption.length > 0, `${id}: no caption`);
  }
});

test('each video stays under 3 MB', () => {
  for (const id of Object.keys(DEMO_CLIPS)) {
    for (const url of [clipUrls(id).mp4, clipUrls(id).webm]) {
      assert.ok(statSync(file(url)).size < 3_000_000, `${url} is over 3 MB`);
    }
  }
});

test('the recorded duration matches the file', { skip: !hasFfprobe && 'no ffprobe' }, () => {
  for (const [id, clip] of Object.entries(DEMO_CLIPS)) {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file(clipUrls(id).mp4)]);
    assert.ok(Math.abs(Number(out) - clip.durationSeconds) < 0.5, `${id}: file is ${out.toString().trim()} s, registry says ${clip.durationSeconds}`);
  }
});

test('captions say where the clip was recorded', () => {
  for (const [id, clip] of Object.entries(DEMO_CLIPS)) assert.match(clip.caption, /VM/, `${id}: caption does not say it is a VM`);
});
