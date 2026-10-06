---
title: Applying and Managing Wallpapers
description: Set and stop wallpapers, use several screens on desktop, and control performance mode, frame rate, audio and battery behavior.
---

## Set, stop and delete

Open a wallpaper from **Browse** or **Favorites**:

- **Download** fetches its files to your device. Once they are installed, the same button reads **Set wallpaper**.
- **Set wallpaper** puts it on your screen.
- **Stop wallpaper** stops it.
- **Delete files** removes the downloaded files from this device. If the wallpaper is showing, it is stopped first. The wallpaper stays in the catalogue, and you can download it again.

**Settings → Storage** lists every installed wallpaper and its size, with **Delete** for one and **Delete all wallpapers** for everything. Wallpapers you imported with Quick Wallpaper are counted there too.

A wallpaper's own **Options** (colors, speeds and so on, when its creator added them) appear on its page. They are separate from the app settings below.

### On desktop

- The wallpaper draws behind your windows and icons, and **keeps running after you close the app window**. It starts again when you log in.
- A tray icon (menu bar on macOS) has **Open Wallpaper Reactor**, **Reload wallpaper** and **Close wallpaper**. **Close wallpaper** ends the running wallpaper until your next login. **Stop wallpaper** in the app ends it and puts your previous desktop picture back.
- Changing a wallpaper's settings in the app reaches the running wallpaper without setting it again.

### On Android: the live wallpaper picker

Android only runs a live wallpaper that you confirm yourself.

1. In the app, choose **Set wallpaper**.
2. Android opens its **live wallpaper** screen for Wallpaper Reactor. Confirm it there. Android may ask whether it is for the home screen, the lock screen or both.
3. Return to the app. It confirms with "*name* set as wallpaper." once Android reports Wallpaper Reactor as the active live wallpaper. If you back out of the Android screen, nothing is set and no error is shown.

After Wallpaper Reactor is your live wallpaper, setting another wallpaper in the app switches it without the Android screen. On some phones the picker is a different Android screen (a live wallpaper list). Choose **Wallpaper Reactor** from it.

An **Image** wallpaper is the exception. Android's own crop-and-set screen opens and sets it as an ordinary still wallpaper.

To go back to a different wallpaper, change it in Android's own wallpaper settings.

Android 16 (QPR3) and newer, and Android 17, do not show live wallpapers on a connected external display. See [Troubleshooting](/docs/troubleshooting/#android-live-wallpaper-missing-on-a-connected-display).

## Several screens on desktop

**Settings → Wallpaper Settings → Multi-Screen Mode** controls how wallpapers map to your screens. It appears on desktop, not on Android, and it is greyed out when the app sees only one display.

| Mode | What it does | Where |
| --- | --- | --- |
| **Duplicate** | The same wallpaper on every screen. This is the default. | Windows, macOS, Linux |
| **Expand Across All** | One wallpaper stretched across all screens as a single picture | **Windows only** |
| **Custom** | A different wallpaper on each screen | Windows, macOS, Linux |

On macOS and Linux, choosing **Expand Across All** shows "This platform cannot expand one wallpaper across every display, so that mode was not applied." and the mode stays as it was.

### Custom mode

- With **Custom** on, **Set wallpaper** asks **Select a screen** and lists your screens (**Set wallpaper on** *screen*). The same screen picker appears when you use **Quick Wallpaper**. Pick a screen and that wallpaper goes only there.
- **Settings** then shows one card for each screen, with the wallpaper on it (**None** when empty). Choose a card to clear that screen. A cleared screen shows its own desktop picture again.
- The wallpaper follows the display, not its position: if you rearrange your monitors, each screen keeps its wallpaper.

## Performance, frame rate, audio and battery

These are all under **Settings → Wallpaper Settings**.

### Performance Mode

Performance Mode sets the **frame rate cap** and the **render resolution**. There is no separate frame-rate setting. Pick the mode that matches.

| Mode | Frame rate | Resolution |
| --- | --- | --- |
| **Battery Saver** | 15 fps | 50% |
| **Balanced** (default) | 30 fps | 75% |
| **High FPS** | Uncapped | 75% |
| **High Resolution** | 30 fps | 100% |
| **High Quality** | 60 fps | 90% |
| **Max Quality** | Uncapped | 100% |

Performance Mode is a **Pro** feature. Without Pro, choosing a mode opens the Pro page instead. See [Features & Pricing](/features/). The Mac App Store edition cannot sell Pro, but a Pro account from another platform keeps Pro when you sign in there.

A mode change takes effect on the running wallpaper. A change to the render resolution can reload a web-based wallpaper (Scene, Shader and so on) for a moment. A wallpaper can opt out of the frame-rate cap with `disableFpsCap` in its [settings](/docs/wallpaper-creation/settings-json-tutorial/), but that uses much more power.

### Audio

**Audio** is the on/off switch for wallpaper sound. It is on by default. Turn it off to mute every wallpaper. The change applies immediately.

### Touch Interaction

**Touch Interaction** lets interactive wallpapers (Scenes and Godot wallpapers) respond to touch and mouse input. Turn it off to ignore input.

### Battery

- **Pause on Low Power Mode** (on by default): pauses the wallpaper while the OS's low power or battery saver mode is on.
- **Play on Battery Power** (on by default, desktop only): when it is off, the wallpaper pauses while your computer runs on battery. When it is on, the wallpaper keeps playing on battery but drops to the **Battery Saver** frame rate and resolution (15 fps at 50%).

### When a desktop wallpaper pauses

A desktop wallpaper pauses by itself when nobody can see it:

- the session is locked,
- the display is off,
- a maximized or fullscreen window covers it,
- Low Power Mode is on and **Pause on Low Power Mode** is on,
- you are on battery and **Play on Battery Power** is off.

It resumes when the cause ends.

### Android only: download wallpaper updates

**Download wallpaper updates** chooses when the app fetches a creator's new version of a wallpaper you have installed: **Never**, **On Wi-Fi only**, or **On Wi-Fi or mobile data**. The old version keeps working until the new one is ready. On desktop, updates download automatically.

## Next

- [Troubleshooting](/docs/troubleshooting/)
- [Creating a wallpaper](/docs/creating-a-wallpaper/)
