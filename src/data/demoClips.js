/**
 * The demo clips: real screen recordings of Wallpaper Reactor, rendered by `DemoVideo.astro` and described to
 * search engines by `videoObject.js`. One entry per clip; its files are `public/assets/videos/<id>/<id>.{mp4,webm,webp}`
 * (made by `scripts/encode-demo-clip.sh`, which prints the duration to put here; `test/demo-clips.test.mjs`
 * checks it against the file).
 *
 * Every Googlebook clip was recorded on Google's Googlebook OS image running in a VM on a Mac, with `adb shell
 * screenrecord` (about 26-30 fps). Wallpapers were applied from local copies of public packages through Quick
 * Wallpaper, so no catalogue install counts moved. Say so in the caption wherever the clip shows an apply.
 */
/** @type {Record<string, { name: string, description: string, caption: string, uploadDate: string, durationSeconds: number, width: number, height: number }>} */
export const DEMO_CLIPS = {
  'googlebook-hero': {
    name: 'Live wallpaper animating behind the Wallpaper Reactor window on a Googlebook',
    description:
      'Googlebook OS running in a virtual machine on a Mac: the PSP Wallpaper live wallpaper animates on the desktop around the Wallpaper Reactor window, which shows Browse with the details sidebar open.',
    caption:
      'Googlebook OS running in a VM on a Mac: the PSP Wallpaper live wallpaper moving behind the Wallpaper Reactor window, with the details sidebar open.',
    uploadDate: '2026-10-18',
    durationSeconds: 15.23,
    width: 1280,
    height: 800,
  },
  'googlebook-browse': {
    name: 'Browsing wallpapers and applying one in Wallpaper Reactor on a Googlebook',
    description:
      'Browsing popular wallpapers in Wallpaper Reactor on Googlebook OS in a virtual machine: the details sidebar follows each selection, then a wallpaper applied from a local file with Quick Wallpaper is shown full screen.',
    caption:
      'Googlebook OS in a VM on a Mac: browsing popular wallpapers, with the details sidebar following each selection. At the cut, Super Mario 64, applied from a local file with Quick Wallpaper, is shown full screen.',
    uploadDate: '2026-10-18',
    durationSeconds: 11.8,
    width: 1280,
    height: 800,
  },
  'googlebook-switching': {
    name: 'Switching between a shader, Rive, video and web wallpaper on a Googlebook',
    description:
      'Four wallpaper types on Googlebook OS in a virtual machine, each animating full screen: a shader, a Rive animation, a video loop and a web page Scene.',
    caption:
      'Googlebook OS in a VM on a Mac: four live wallpapers, each shown full screen after being applied from a local file with Quick Wallpaper. A shader (PSP Wallpaper), a Rive animation (Super Mario 64), a video loop (a Zelda scene) and a Scene (animated web-page balls). The app is minimised and the clips are cut together.',
    uploadDate: '2026-10-18',
    durationSeconds: 14.4,
    width: 1280,
    height: 800,
  },
  'googlebook-lock': {
    name: 'Live wallpaper on the Googlebook lock screen',
    description:
      'The screen of Googlebook OS in a virtual machine switched off and on again: the PSP Wallpaper live wallpaper keeps animating behind the clock on the lock screen.',
    caption:
      'Googlebook OS in a VM on a Mac: screen off, then on. The PSP Wallpaper live wallpaper is moving behind the lock screen clock. The recording pauses while the display is off.',
    uploadDate: '2026-10-18',
    durationSeconds: 12.33,
    width: 1280,
    height: 800,
  },
  'googlebook-resize': {
    name: 'Wallpaper Reactor following its window size on a Googlebook',
    description:
      'The Wallpaper Reactor window on Googlebook OS in a virtual machine resized from wide to narrow and back: the layout changes between the sidebar and the bottom tab bar as the window changes size.',
    caption:
      'Googlebook OS in a VM on a Mac: the window resized from wide to narrow and back, with the layout following it. The resizing was done with adb, not by dragging the window edge.',
    uploadDate: '2026-10-18',
    durationSeconds: 13.87,
    width: 1280,
    height: 800,
  },
};
