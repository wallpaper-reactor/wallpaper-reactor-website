import { test } from 'node:test';
import assert from 'node:assert/strict';
import { softwareApplicationSchema } from '../src/data/softwareApplication.js';

const schema = softwareApplicationSchema({
  siteUrl: 'https://wallpaperreactor.app',
  imageUrl: 'https://wallpaperreactor.app/_astro/logo.abc.png',
});

test('has the properties Google requires for a SoftwareApplication rich result', () => {
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'SoftwareApplication');
  assert.ok(schema.name);
  assert.ok(schema.applicationCategory);
  assert.ok(schema.operatingSystem);
  assert.equal(schema.offers['@type'], 'Offer');
  assert.equal(schema.offers.price, '0');
  assert.equal(schema.offers.priceCurrency, 'USD');
});

test('points at the site, the logo and the releases page', () => {
  assert.equal(schema.url, 'https://wallpaperreactor.app');
  assert.equal(schema.image, 'https://wallpaperreactor.app/_astro/logo.abc.png');
  assert.equal(schema.downloadUrl, 'https://wallpaperreactor.app/releases/');
  assert.equal(schema.operatingSystem, 'Android, Windows, macOS, Linux');
  assert.equal(schema.applicationCategory, 'LifestyleApplication');
});

test('never invents a rating', () => {
  assert.equal('aggregateRating' in schema, false);
  assert.equal('review' in schema, false);
});

test('round-trips through JSON', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(schema)), schema);
});

test('accepts richer offers for the pricing page without duplicating the entity', () => {
  const offers = [{ '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' }];
  const s = softwareApplicationSchema({ siteUrl: 'https://x.test', imageUrl: 'https://x.test/i.png', offers });
  assert.deepEqual(s.offers, offers);
});
