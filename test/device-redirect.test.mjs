import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deviceTarget } from '../src/scripts/device-redirect.js';

const APP = 'https://web.wallpaperreactor.app';

test('sends /device/ to the web app\'s approval page', () => {
  assert.equal(deviceTarget('', APP), `${APP}/device`);
});

test('carries a code the CLI put in the link, and nothing else', () => {
  assert.equal(deviceTarget('?code=BCDF-GHJK', APP), `${APP}/device?code=BCDF-GHJK`);
  assert.equal(deviceTarget('?code=bcdfghjk&utm_source=x', APP), `${APP}/device?code=bcdfghjk`);
});

test('drops anything that is not a code', () => {
  assert.equal(deviceTarget('?code=%3Cscript%3E', APP), `${APP}/device`);
  assert.equal(deviceTarget('?code=BCDFGHJKLMNP', APP), `${APP}/device`);
  assert.equal(deviceTarget('?next=https://evil.example', APP), `${APP}/device`);
});
