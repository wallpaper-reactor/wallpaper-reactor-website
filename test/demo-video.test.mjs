import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setUpDemoVideos } from '../src/scripts/demo-video.js';

function fakeVideo() {
  const attrs = new Set(['autoplay']);
  const sources = [{ dataset: { src: '/a.webm' }, src: undefined }, { dataset: { src: '/a.mp4' }, src: undefined }];
  return {
    sources, controls: false, played: 0, paused: 0, loaded: 0,
    removeAttribute: (a) => attrs.delete(a),
    hasAttribute: (a) => attrs.has(a),
    querySelectorAll: () => sources,
    load() { this.loaded++; },
    play() { this.played++; return Promise.resolve(); },
    pause() { this.paused++; },
  };
}
const srcs = (v) => v.sources.map((s) => s.src);
const docOf = (videos) => ({ querySelectorAll: () => videos });
function winOf({ reduce, io = true }) {
  const observers = [];
  const win = { matchMedia: (q) => ({ matches: q.includes('reduce') && reduce }), observers };
  if (io) win.IntersectionObserver = class {
    constructor(cb, opts) { this.cb = cb; this.opts = opts; this.seen = []; this.unobserved = []; observers.push(this); }
    observe(v) { this.seen.push(v); }
    unobserve(v) { this.unobserved.push(v); }
  };
  return win;
}

test('nothing downloads until the video is near the viewport', () => {
  const v = fakeVideo();
  const win = winOf({ reduce: false });
  setUpDemoVideos(docOf([v]), win);
  assert.deepEqual(srcs(v), [undefined, undefined]);
  assert.equal(v.loaded, 0);
  assert.deepEqual(win.observers[0].seen, [v]);
  assert.ok(win.observers[0].opts.rootMargin, 'a margin so it is ready as it scrolls in');
});

test('normal motion: on first sight the sources are set and it loads; it then plays and pauses with visibility', () => {
  const v = fakeVideo();
  const win = winOf({ reduce: false });
  setUpDemoVideos(docOf([v]), win);
  const [obs] = win.observers;
  obs.cb([{ target: v, isIntersecting: true }]);
  assert.deepEqual(srcs(v), ['/a.webm', '/a.mp4']);
  assert.equal(v.loaded, 1);
  assert.equal(v.played, 1);
  obs.cb([{ target: v, isIntersecting: false }]);
  assert.equal(v.paused, 1);
  obs.cb([{ target: v, isIntersecting: true }]);
  assert.equal(v.loaded, 1, 'sources are set once');
  assert.equal(v.played, 2);
  assert.equal(v.controls, false);
});

test('reduced motion: no autoplay, controls shown, sources set only when near, and it is never played for the visitor', () => {
  const v = fakeVideo();
  const win = winOf({ reduce: true });
  setUpDemoVideos(docOf([v]), win);
  assert.equal(v.hasAttribute('autoplay'), false);
  assert.equal(v.controls, true);
  assert.deepEqual(srcs(v), [undefined, undefined]);
  const [obs] = win.observers;
  obs.cb([{ target: v, isIntersecting: true }]);
  assert.deepEqual(srcs(v), ['/a.webm', '/a.mp4']);
  assert.equal(v.played, 0);
  obs.cb([{ target: v, isIntersecting: false }]);
  assert.equal(v.paused, 0);
});

test('without IntersectionObserver the sources are set at once so the video still works', () => {
  const v = fakeVideo();
  setUpDemoVideos(docOf([v]), winOf({ reduce: false, io: false }));
  assert.deepEqual(srcs(v), ['/a.webm', '/a.mp4']);
  assert.equal(v.loaded, 1);
});
