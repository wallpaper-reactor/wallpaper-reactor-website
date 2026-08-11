# Blog todo

Backlog of article ideas and their status. Working document — it sits outside `src/pages/`,
so it is not a route. Process for taking anything off this list is in `BLOG_GUIDELINES.md`:
ideas → topic chosen → outline + media approved → full text approved → publish.

Each entry records what it still needs, because "needs measurements from Kyle" and "can be
written today" are very different kinds of ready.

## Published

- **Wallpaper Engine for Mac** — `/blog/wallpaper-engine-for-mac/`
- **Do live wallpapers work on Android Desktop Mode?** — `/blog/android-desktop-mode-live-wallpapers/`

## Next up

### Dual-screen handhelds: AYN Thor and Anbernic RG DS

Live wallpapers on both screens of a dual-display Android handheld.

Why it's worth doing:
- These devices have small, engaged communities that share findings hard, and almost nobody
  writes about the second screen beyond emulator layouts. Very little competition.
- It is the natural companion to the Desktop Mode piece and gives the cross-platform pillar a
  concrete, unusual proof point.
- Wallpaper Reactor already carries the machinery: `isSecondaryDisplay()` in
  `WallpaperReactorLiveWallpaperService.kt`, per-display configs, and the secondary-display
  FileWatcher.

**The angle worth checking first, because it could make the piece:** the Android 17 block we
documented is gated on the device being eligible for the *desktop experience*
(`isWallpaperDesktopExperienceEnabled`). A dual-screen handheld is not a desktop session, so
the code should fall through to `connection.mInfo.supportsMultipleDisplays()` instead — the
ordinary multi-display path. If that holds, these handhelds are one of the few places a
third-party live wallpaper legitimately runs on a second screen today, which is a much better
story than a straight how-to.

Needs:
- Confirmation of which of these devices you have and can record.
- A test: does the wallpaper actually attach to display 1, and does each screen get its own
  wallpaper or a stretched copy?
- Video or photo of both screens running. A photo of the physical device is likely stronger
  than a screen capture here.
- Confirmation of how per-display config selection presents on these devices.

### Live wallpaper not showing on your external display?

The wider-audience version of the Desktop Mode article. The block landed in an Android 16
point release, so it affects any Android 16+ phone driving a monitor, not only people who
deliberately enabled Desktop Mode. Different intent too — people hit this by accident.

Needs: nothing. Research and citations are already verified from the Desktop Mode piece.

### Do live wallpapers drain your battery? We measured it.

The biggest objection in the category, and nobody answers it with real numbers. Original data
is also the most linkable thing the site can publish.

Needs: actual measurements from you.

## Assets on hand

- `src/assets/cross-platform-macos-windows-android.jpg` — the same wallpaper (PSP Wallpaper by
  ParkingLotGames) running at once on a MacBook, a Windows laptop and an Android handheld.
  A single photo that proves the cross-platform pillar better than any screenshot could.
  Metadata stripped. Best used on `/features/`, the homepage, or any post that leans on
  "one library, every device" — note it shows three *platforms*, not a dual-screen device, so
  it does not illustrate the handheld article below.

## Candidates

| Idea | Why | Needs |
|---|---|---|
| How to make a clip loop seamlessly | The ffmpeg material cut from the video article, given a home where the depth fits; the kind of page forums link to | Nothing |
| Put a live web page on your desktop | "Any Website Wallpaper" is an unusual capability and "website as wallpaper" is a real query | Shipped-UI screenshots |
| How Android live wallpapers work, and why yours restarts | Explains a genuinely confusing behaviour; positions us as the people who know it | Nothing |
| Does a live wallpaper slow down your games? | Objection-killer, answerable by mechanism | Nothing |
| Different wallpapers on lock screen and home screen | Real query, supported since Android 14 | Shipped-UI screenshots |
| Live wallpaper file formats explained | Ranks across long-tail queries, doubles as creator onboarding | Links into existing docs |
| Why is my live wallpaper blurry or cropped? | Common complaint, reduces support load | Shipped-UI screenshots |
| Live wallpapers on a foldable | Almost no competition; we have topology and geometry tests | A foldable to test |
| Why your live wallpaper stops on Samsung and Xiaomi | High volume | Crowded query, much of the fix is generic |
| Best free live wallpapers for Windows 11 | Easy traffic | Gallery captures; weak intent |

## Shelved

- **Turn a Shadertoy shader into a live wallpaper.** Outlined and ready to write, but the
  shader editor is still in progress and we don't want screenshots of WIP surfaces published.
  Revisit when it ships. The strong angle is the converter's `clean` / `approximate` / `hand` /
  `impossible` classification and its plain-English failure messages — nobody else can write
  an honest "what won't convert" section.
- **Wallpaper Engine for Android.** An official Android app exists, so this is a comparison
  rather than a gap. Weaker than it first looked.
