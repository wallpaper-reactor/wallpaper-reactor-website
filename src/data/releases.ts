import release from './latest_release.json';

/**
 * Typed view over the GitHub release payload that .github/workflows/fetch-latest-release.yml
 * writes to src/data/latest_release.json.
 *
 * Replaces the Liquid asset bucketing that used to live in releases.md, which
 * looped every asset and string-matched on filenames inline.
 */

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

const assets: ReleaseAsset[] = release.assets as ReleaseAsset[];

const find = (...needles: string[]): ReleaseAsset | undefined =>
  assets.find((a) => {
    const name = a.name.toLowerCase();
    return needles.every((n) => name.includes(n));
  });

export const LATEST = {
  name: release.name,
  tag: release.tag_name,
  publishedAt: new Date(release.published_at),
  htmlUrl: release.html_url,
};

/** Direct-download builds surfaced in the install table. */
export const DOWNLOADS = {
  macArm: find('mac', 'aarch64', '.zip'),
  macIntel: find('mac', 'amd64', '.zip'),
  /** The bare installer .exe, not the windows-*.zip archives. */
  windowsExe: assets.find((a) => a.name.toLowerCase().endsWith('.exe')),
  androidApk: find('.apk'),
};

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
