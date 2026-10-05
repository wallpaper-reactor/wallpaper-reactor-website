---
title: Getting Started
description: Install Wallpaper Reactor on Android, Windows, macOS or Linux (KDE Plasma), and set your first wallpaper.
---

Wallpaper Reactor runs live wallpapers on **Android**, **Windows**, **macOS** and **Linux (KDE Plasma 6)**. This page covers installing it and setting your first wallpaper. For the other pages in this guide, see [Documentation](/docs/).

For the builds, version numbers and checksums, see [Releases](/releases/). For what each edition includes, see [Features & Pricing](/features/).

## Install

### Android

- **Google Play**: install **Wallpaper Reactor** from the [Play Store](https://play.google.com/store/apps/details?id=app.wallpaperreactor). Play keeps it updated.
- **Direct download**: the Android APK is on the [Releases](/releases/) page. You update it by installing the next APK.

Requires Android 9 or newer.

### Windows

- **Microsoft Store**: install from the [Microsoft Store](https://apps.microsoft.com/detail/9n4302crdqrl). The Store keeps it updated.
- **Direct download**: download the installer (`…-windows-x64-setup.exe`) from [Releases](/releases/) and run it. The installer is per machine, so Windows asks for an administrator's password. If SmartScreen shows a warning for the downloaded installer, choose **More info**, then **Run anyway**.

Updates to the direct download install over the existing copy and also need an administrator.

### macOS

- **Mac App Store**: the [Mac App Store edition](https://apps.apple.com/us/app/wallpaper-reactor-lite/id6751447022) is **Wallpaper Reactor Lite**. It has fewer features than the direct download. For example, it cannot sell Pro. See [Features & Pricing](/features/) for the differences.
- **Direct download**: download the `.dmg` from [Releases](/releases/), open it, and drag **Wallpaper Reactor** to **Applications**. It is a universal build for Apple silicon and Intel Macs.

Requires macOS 14 (Sonoma) or newer. The first time you set a wallpaper, macOS may ask to let Wallpaper Reactor access data from other apps. Allow it, or wallpapers cannot be applied. See [Troubleshooting](/docs/troubleshooting/#macos-is-waiting-for-permission).

### Linux

Linux is supported on **KDE Plasma 6 only** (Wayland or X11), on x86_64. On any other desktop the app opens, but **Set wallpaper** is refused with a message naming your desktop. See [Troubleshooting](/docs/troubleshooting/#linux-wallpaper-control-isnt-supported-yet).

Download one of these from the GitHub release page linked at the bottom of [Releases](/releases/):

- **`.deb`** (Debian, Ubuntu and derivatives): `…-linux-amd64.deb`.

  ```bash
  sudo apt install ./wallpaper-reactor-<version>-linux-amd64.deb
  ```

- **Flatpak** (SteamOS, Fedora and everything else): `…-linux-amd64.flatpak`.

  ```bash
  flatpak install --user ./wallpaper-reactor-<version>-linux-amd64.flatpak
  flatpak run app.wallpaperreactor.WallpaperReactor
  ```

  The Flatpak's runtime comes from Flathub, so Flathub must be set up as a remote on your system.

Neither package updates itself. The app tells you when a newer version exists and links the new file; install it over the old one.

On a Steam Deck, use **Desktop Mode**. Gaming Mode has no desktop to put a wallpaper on.

## Set your first wallpaper

1. Open **Browse** and pick a wallpaper. Use **Search**, **Sort**, and the **Type**, **Colors** and **Tags** filters to narrow the list.
2. Open it and choose **Download**. The files stay on your device.
3. Choose **Set wallpaper**.
   - **Desktop**: the wallpaper appears behind your windows and icons. With several screens, see [Applying and managing](/docs/applying-and-managing/#several-screens-on-desktop).
   - **Android**: Android opens its own live wallpaper screen. Confirm it there. See [the Android picker](/docs/applying-and-managing/#on-android-the-live-wallpaper-picker).

Browsing, downloading and setting wallpapers need no account. Sign in to sync favorites and to publish your own wallpapers.

## Use your own file

Open **Create** and use **Quick Wallpaper** to apply a file from your device right away, with no account and nothing published. See [Creating a wallpaper](/docs/creating-a-wallpaper/).

## Next

- [Creating a wallpaper](/docs/creating-a-wallpaper/)
- [Applying and managing wallpapers](/docs/applying-and-managing/)
- [Troubleshooting](/docs/troubleshooting/)
