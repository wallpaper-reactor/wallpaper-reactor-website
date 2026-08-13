# Blog todo

Backlog of article ideas and their status. Working document — it sits outside `src/pages/`,
so it is not a route. Process for taking anything off this list is in `BLOG_GUIDELINES.md`:
ideas → topic chosen → outline + media approved → full text approved → publish.

Each entry records what it still needs, because "needs measurements from Kyle" and "can be
written today" are very different kinds of ready.

## Published

- **Wallpaper Engine for Mac** — `/blog/wallpaper-engine-for-mac/`
- **Do live wallpapers work on Android Desktop Mode?** — `/blog/android-desktop-mode-live-wallpapers/`
- **How to Set Any Video as a Live Wallpaper** — `/blog/set-any-video-as-live-wallpaper/`
- **Live wallpapers on an old or cheap Android phone** — `/blog/live-wallpapers-old-android-phone/`
- **How to set a live wallpaper on Windows 11** — `/blog/how-to-set-live-wallpaper-windows-11/`
- **How to set a live wallpaper on Mac** — `/blog/how-to-set-live-wallpaper-mac/`
- **How to set a live wallpaper on Android** — `/blog/how-to-set-live-wallpaper-android/`
- **AYN Thor and Anbernic RG DS** — `/blog/live-wallpaper-ayn-thor-anbernic-rg-ds/`

## Next up

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

- `cross-platform-macos-windows-android.jpg` — the same wallpaper running at once on a MacBook,
  a Windows laptop and an Android handheld. Proves the cross-platform pillar better than any
  screenshot. Note it shows three *platforms*, not a dual-screen device.
- `older-android-phone.jpg` — a 2018-era Android phone, CC0, no attribution needed.
- `resolution-1080p-vs-4k.png` — a to-scale diagram of a 1080p frame inside a 4K one.
- `rg-ds-dual-screen-live-wallpaper.webp` — animated, an RG DS running Matrix Rain on both
  screens. Served from `public/` because resizing an animated WebP inflates it.
- `set-wallpaper-desktop-{1,2}-*.png` and `set-wallpaper-android-{1,2,3}-*.png` — the annotated
  Browse / Download / Set walkthrough, desktop at 1280x720 and phone at 400x711.
- `quick-wallpaper-step{1,2}-*.png` — the Create tab and Quick Wallpaper import.
- `dual-screen-{1,2}-*.png` — Multi-Monitor Mode in settings, and the Monitor 1 / Monitor 2
  picker. Captured on the `ayn_thor_dual` AVD, since the setting only appears with two displays.

Raw captures live in `_screenshots/raw/` with their annotation specs in
`_screenshots/annotations/`, so any of them can be regenerated or nudged.

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
