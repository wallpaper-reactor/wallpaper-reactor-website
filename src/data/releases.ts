import release from './latest_release.json';
import { pickAssets, type AssetLike } from './releaseAssets';

/**
 * Typed view over the GitHub release payload that .github/workflows/fetch-latest-release.yml
 * writes to src/data/latest_release.json.
 *
 * Replaces the Liquid asset bucketing that used to live in releases.md.
 */

export type ReleaseAsset = AssetLike;

const assets: ReleaseAsset[] = release.assets as ReleaseAsset[];

export const LATEST = {
  name: release.name,
  tag: release.tag_name,
  publishedAt: new Date(release.published_at),
  htmlUrl: release.html_url,
};

/**
 * Direct-download builds surfaced in the install table. The name patterns live in
 * `releaseAssets.ts`, which `scripts/release-assets.test.mjs` holds to the app's asset-name table.
 */
export const DOWNLOADS = pickAssets(assets);

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
