// Holds src/data/releaseAssets.ts to the app's release asset names.
// `npm test` checks fixed names. `WR_APP_REPO=/path/to/wallpaper-reactor npm test` also reads
// crates/wr-paths/src/release.rs and fails if a table entry matches no pattern and is not listed
// as deliberately unlisted.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CURRENT_PATTERNS,
  LEGACY_PATTERNS,
  NOT_LISTED,
  matchesAny,
  pickAssets,
} from '../src/data/releaseAssets.ts';

const asset = (name) => ({ name, browser_download_url: `https://example.test/${name}`, size: 1 });
const TAG = '1.0.0';
const name = (suffix) => `wallpaper-reactor-${TAG}-${suffix}`;

// `wallpaper-reactor-<tag>-<suffix>`, as crates/wr-paths/src/release.rs `asset_name` builds them.
const EXPECTED = {
  macUniversal: 'macos-universal.dmg',
  macArm: 'macos-arm64.dmg',
  macIntel: 'macos-x64.dmg',
  windowsX64: 'windows-x64-setup.exe',
  windowsArm: 'windows-arm64-setup.exe',
  androidApk: 'android.apk',
  linuxDeb: 'linux-amd64.deb',
  linuxFlatpak: 'linux-amd64.flatpak',
};

test('every pattern finds the name release staging gives it', () => {
  const picked = pickAssets(Object.values(EXPECTED).map((s) => asset(name(s))));
  for (const [key, suffix] of Object.entries(EXPECTED)) {
    assert.equal(picked[key]?.name, name(suffix), key);
  }
});

test('patterns do not cross-match: each name belongs to exactly one key', () => {
  for (const [key, suffix] of Object.entries(EXPECTED)) {
    const hits = Object.entries(CURRENT_PATTERNS).filter(([, re]) => re.test(name(suffix)));
    assert.deepEqual(hits.map(([k]) => k), [key]);
  }
});

test('tag spelling does not matter (0.28.1, 1.0.0, v1.0.0)', () => {
  for (const tag of ['0.28.1', '1.0.0', 'v1.0.0']) {
    assert.ok(CURRENT_PATTERNS.linuxFlatpak.test(`wallpaper-reactor-${tag}-linux-amd64.flatpak`), tag);
  }
});

test('assets the page does not list never match a listed key', () => {
  for (const suffix of NOT_LISTED) assert.equal(matchesAny(name(suffix)), false, suffix);
  assert.equal(matchesAny(name('windows-x64.msi')), false);
  assert.equal(matchesAny(name('linux-amd64.deb.sig')), false);
});

test('a Compose-era release still resolves', () => {
  const legacy = [
    'wallpaper-reactor-0.28.1-mac-aarch64.zip',
    'wallpaper-reactor-0.28.1-mac-amd64.zip',
    'wallpaper-reactor.exe',
    'wallpaper-reactor-v0.28.1-android.apk',
    'wallpaper-reactor-v0.28.1-linux-amd64.deb',
  ].map(asset);
  const p = pickAssets(legacy);
  assert.equal(p.macArm?.name, 'wallpaper-reactor-0.28.1-mac-aarch64.zip');
  assert.equal(p.macIntel?.name, 'wallpaper-reactor-0.28.1-mac-amd64.zip');
  assert.equal(p.windowsX64?.name, 'wallpaper-reactor.exe');
  assert.equal(p.androidApk?.name, 'wallpaper-reactor-v0.28.1-android.apk');
  assert.equal(p.linuxDeb?.name, 'wallpaper-reactor-v0.28.1-linux-amd64.deb');
  assert.equal(p.macUniversal, undefined);
  assert.ok(Object.keys(LEGACY_PATTERNS).length > 0);
});

test('a 1.0 asset wins over a legacy-looking one', () => {
  const p = pickAssets([asset('other.apk'), asset(name('android.apk'))]);
  assert.equal(p.androidApk?.name, name('android.apk'));
});

const repo = process.env.WR_APP_REPO;
test('every entry of the app repo asset table is matched or deliberately unlisted', { skip: !repo }, () => {
  const file = join(repo, 'crates/wr-paths/src/release.rs');
  assert.ok(existsSync(file), `${file} not found`);
  const src = readFileSync(file, 'utf8');
  const entries = [
    ...src.matchAll(/AssetType \{ extension: "([^"]+)", os: "(\w+)", arch: ArchRule::(\w+), tail: "([^"]+)"/g),
  ].map(([, , os, arch, tail]) => ({ os, arch, tail }));
  assert.ok(entries.length >= 9, `expected the table's 9 entries, parsed ${entries.length}`);
  const arches = { Debian: ['amd64', 'arm64'], Mac: ['universal', 'arm64', 'x64'], Windows: ['x64', 'arm64'], None: [null] };
  for (const { os, arch, tail } of entries) {
    for (const a of arches[arch]) {
      const suffix = a ? `${os}-${a}${tail}` : `${os}${tail}`;
      const listed = matchesAny(name(suffix));
      const unlisted = NOT_LISTED.includes(suffix) || suffix === `windows-${a}.msi`;
      const knownUnshipped = (os === 'linux' && a === 'arm64') || (os === 'windows' && a === 'universal');
      assert.ok(listed || unlisted || knownUnshipped, `${suffix} matches no pattern and is not in NOT_LISTED`);
    }
  }
});
