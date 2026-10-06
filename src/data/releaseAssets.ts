/**
 * Which release asset is which, by file name. No imports, so `scripts/release-assets.test.mjs`
 * can load it under plain Node.
 *
 * The authority for current names is the app repo's `crates/wr-paths/src/release.rs`, the one
 * table that release staging and the app's updater both read. A published name is
 * `wallpaper-reactor-<tag>-<os>[-<arch>]<tail>`, so each pattern below is one row of that table's
 * `<os>[-<arch>]<tail>` suffix. If the table changes, the test fails until these follow
 * (`npm test`, and `WR_APP_REPO=<checkout> npm test` to compare against the table itself).
 */

export interface AssetLike {
  name: string;
  browser_download_url: string;
  size: number;
}

export type AssetKey =
  | 'macUniversal'
  | 'macArm'
  | 'macIntel'
  | 'windowsX64'
  | 'windowsArm'
  | 'androidApk'
  | 'linuxDeb'
  | 'linuxFlatpak';

/** Tag-independent: `wallpaper-reactor-<tag>-` followed by the table's suffix. */
const NAME = '^wallpaper-reactor-.+-';

/** The 1.0 names. Each is one asset type from the table, spelled as release staging names it. */
export const CURRENT_PATTERNS: Record<AssetKey, RegExp> = {
  macUniversal: new RegExp(`${NAME}macos-universal\\.dmg$`, 'i'),
  macArm: new RegExp(`${NAME}macos-arm64\\.dmg$`, 'i'),
  macIntel: new RegExp(`${NAME}macos-x64\\.dmg$`, 'i'),
  windowsX64: new RegExp(`${NAME}windows-x64-setup\\.exe$`, 'i'),
  windowsArm: new RegExp(`${NAME}windows-arm64-setup\\.exe$`, 'i'),
  androidApk: new RegExp(`${NAME}android\\.apk$`, 'i'),
  linuxDeb: new RegExp(`${NAME}linux-amd64\\.deb$`, 'i'),
  linuxFlatpak: new RegExp(`${NAME}linux-amd64\\.flatpak$`, 'i'),
};

/**
 * Compose-era releases (up to 0.28.x), which the page shows until the first 1.0 release is the
 * latest. Only keys that existed then; `android` and `linux` names happen to match the 1.0 ones.
 */
export const LEGACY_PATTERNS: Partial<Record<AssetKey, RegExp>> = {
  macArm: /^wallpaper-reactor-.+-mac-aarch64\.zip$/i,
  macIntel: /^wallpaper-reactor-.+-mac-amd64\.zip$/i,
  windowsX64: /^wallpaper-reactor\.exe$/i,
  androidApk: /\.apk$/i,
};

/**
 * Table entries the install page deliberately does not list: the updater payload `.app.tar.gz`,
 * the `.msi`, and the two store-only files (`.pkg` is never public, `.aab` goes to Play).
 */
export const NOT_LISTED: readonly string[] = [
  'macos-universal.app.tar.gz',
  'macos-arm64.app.tar.gz',
  'macos-x64.app.tar.gz',
  'macos-universal-app-store.pkg',
  'macos-arm64-app-store.pkg',
  'macos-x64-app-store.pkg',
  'android.aab',
];

export function matchesAny(name: string): boolean {
  return Object.values(CURRENT_PATTERNS).some((p) => p.test(name));
}

export function pickAssets<T extends AssetLike>(assets: readonly T[]): Record<AssetKey, T | undefined> {
  const find = (re: RegExp | undefined) => (re ? assets.find((a) => re.test(a.name)) : undefined);
  const out = {} as Record<AssetKey, T | undefined>;
  for (const key of Object.keys(CURRENT_PATTERNS) as AssetKey[]) {
    out[key] = find(CURRENT_PATTERNS[key]) ?? find(LEGACY_PATTERNS[key]);
  }
  return out;
}
