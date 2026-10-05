---
title: Troubleshooting
description: Fixes for the problems people hit most with Wallpaper Reactor, including video processing, Android connected displays, Linux support and Scene video errors.
---

If your problem is not here, open **Settings → Feedback** in the app, or see [Support](/support/). To include diagnostics, open **Settings → Logs**, then **Copy** or **Export**.

## Video

### The video options give me an ffmpeg command

Wallpaper Reactor does not re-encode video itself. When you pick a loop mode or **Remove Audio** on the **Video options** screen, it shows an `ffmpeg` command under **Process Video with FFmpeg**. You run that command yourself in a terminal on your computer, then create the wallpaper from the file it writes (`<name>_processed.mp4`). You need [FFmpeg](https://ffmpeg.org/download.html) installed. See [Creating a wallpaper](/docs/creating-a-wallpaper/#video).

You can skip the command and continue with your original file. **Remove Audio** still silences the wallpaper, and the loop effects only appear in the processed file.

### I am on Android and cannot run the command

Android has no terminal for it. Process the video on a computer, copy the result to your phone, and create the wallpaper from that file. Quick Wallpaper plays a video exactly as it is.

### "This is not a video file"

When you publish a Video wallpaper, the app reads the file and accepts an MP4, WebM or Matroska container. Re-export the video as an **H.264/AAC MP4**, which plays on every platform.

### My Scene refuses a video

A Scene that embeds a video must use **VP9 in a WebM** container, and anything else (H.264, H.265, AV1, or VP9 in an MP4) is refused with the command that fixes it:

```bash
ffmpeg -i clip.mp4 -c:v libvpx-vp9 -b:v 0 -crf 31 -c:a libopus clip.webm
```

See [Videos Inside a Scene](/docs/wallpaper-creation/scene-video/).

## Android

### Android live wallpaper missing on a connected display

On **Android 16 (QPR3) and newer, and Android 17**, Android blocks third-party live wallpapers on a connected external display (a monitor, or desktop mode). This is an Android platform policy, and Wallpaper Reactor cannot change it. The wallpaper still shows on your phone's own screen. If your phone's wallpaper looks right and only the external display is empty, this is why.

### Nothing happened after I chose Set wallpaper

Android opens its own live wallpaper screen, and the wallpaper is only set once you confirm it there. If you go back without confirming, nothing is set and the app shows no error. Choose **Set wallpaper** again and confirm. See [the Android picker](/docs/applying-and-managing/#on-android-the-live-wallpaper-picker).

## Several screens

### Expand Across All did not apply

**Expand Across All** is available on Windows only. On macOS and Linux the app shows "This platform cannot expand one wallpaper across every display, so that mode was not applied." and keeps your previous mode. Use **Duplicate** or **Custom**. See [Several screens on desktop](/docs/applying-and-managing/#several-screens-on-desktop).

### Multi-Screen Mode is greyed out

The setting is available only when the app sees more than one display, and it does not appear on Android.

## Windows

### The installer asks for an administrator

The direct download installs for all users, so it needs an administrator password, and so do updates to it. On a standard account, the update downloads and then nothing installs. Ask an administrator to run the installer, or use the Microsoft Store version, which updates itself.

### My own desktop picture did not come back after I uninstalled (Microsoft Store version)

Uninstalling the Microsoft Store version cannot run anything of ours, so the wallpaper that was showing stays on your desktop as a still picture. Before you uninstall, open the wallpaper in the app and choose **Stop wallpaper**: that ends it and puts your previous desktop picture back. See [Set, stop and delete](/docs/applying-and-managing/#set-stop-and-delete).

If you already uninstalled, choose your picture again in **Settings → Personalization → Background**. The direct download's uninstaller does this for you.

## macOS

### macOS is waiting for permission

If wallpapers cannot be applied, you may see: "Wallpaper Reactor is waiting for macOS to allow access to its shared storage. If a permission prompt is showing, allow it; wallpapers can't be applied until then." Look for the macOS prompt about accessing data from other apps, allow it, and set the wallpaper again.

## Linux

### Linux: wallpaper control isn't supported yet

Wallpaper Reactor sets wallpapers on **KDE Plasma 6** only. On every other desktop you can browse and preview, but **Set wallpaper** is refused with a message such as:

- "Wallpaper control on GNOME isn't supported yet."
- "Wallpaper control on KDE Plasma 5 isn't supported yet."
- "Wallpaper control on this desktop isn't supported yet." (the app could not read the desktop's name)

To use it, log in to a Plasma 6 session. Plasma 6 on Wayland and on X11 are both supported.

### Steam Deck: "Switch to Desktop Mode"

In **Gaming Mode** the app says: "Switch to Desktop Mode to set a wallpaper. Gaming Mode has no desktop to put it on." Switch to Desktop Mode, which is a Plasma 6 session, and set the wallpaper there.

### Do not install both the .deb and the Flatpak

Both installs write their wallpaper plugin into the same Plasma folder, and setting a wallpaper from one removes the other's. Install one of them on a machine.

### Scene previews do not load on Ubuntu 24.04 with the .deb

The app's web view needs unprivileged user namespaces, and Ubuntu 24.04 restricts them by default, so a Scene preview inside the app may be refused. The Flatpak is not affected.

### There is no update button

The `.deb` and the Flatpak cannot update themselves. The app tells you when a newer version exists and links the new file. Install the new `.deb` over the old one, or reinstall the new Flatpak bundle (or run `flatpak update` if it came from a repository).

## My wallpaper stops or looks paused

On desktop a wallpaper pauses when the session is locked, the display is off, a maximized or fullscreen window covers it, or Low Power Mode or battery settings say so. See [When a desktop wallpaper pauses](/docs/applying-and-managing/#when-a-desktop-wallpaper-pauses). **Close wallpaper** in the tray ends the wallpaper until your next login. Use **Set wallpaper** again to bring it back.

## Performance Mode opens the Pro page

Performance Mode is a Pro feature. Without Pro, choosing a mode opens the Pro page, and the mode does not change. See [Features & Pricing](/features/). The default is **Balanced**.

## Creating

### A Godot wallpaper is refused

| Message | Meaning |
| --- | --- |
| "This Godot wallpaper uses networking, which isn't allowed." | Godot wallpapers cannot connect to the internet or the local network. |
| "This Godot wallpaper carries native code, which isn't allowed." | Remove the native extension. |
| "This Godot wallpaper wasn't built on the Wallpaper Reactor template." | Rebuild it on the template. |
| "This Godot wallpaper's file can't be read." | The file is not a readable Godot pack. It may be damaged, truncated or encrypted. |
| "This Godot wallpaper couldn't be checked, so it wasn't used." | Restart the app and try again. |

### A shader does not compile

The editor lists problems with line numbers under **Problems**. A shader that does not compile cannot be saved or published ("This shader does not compile").

### "This is an animated PNG"

Animated PNG is not supported. Use a GIF, or convert it to an MP4 and publish it as a Video wallpaper.

### "File is … and wallpapers of type … may be at most …"

You are over the size limit for that type. See [the limits](/docs/creating-a-wallpaper/#size-limits).

### "Preview generation failed"

The preview is a real render that can take up to 45 seconds. Choose **Generate it again**.

### "Couldn't apply this file" with Quick Wallpaper

Try again, or choose a different file. If the file's contents are not what its extension says, the app says "isn't a valid wallpaper file of that type."

### An upload failed part-way

If the app says part of the upload could not be undone and a listing may still exist in review, do not retry. Contact support with the name you used.
