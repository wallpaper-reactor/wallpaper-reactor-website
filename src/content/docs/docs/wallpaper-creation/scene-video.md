---
title: Videos Inside a Scene
description: A Scene wallpaper that embeds its own video must use VP9 in a WebM container. How to encode it with ffmpeg before you upload.
---

A **Scene** is a web page (an HTML file, or a folder with an `index.html`) that Wallpaper Reactor renders exactly as you wrote it. If your Scene plays its own video, that video must be **VP9 in a WebM container**. Wallpaper Reactor refuses to create the wallpaper otherwise.

## Why the rule exists

- A Scene is rendered as authored. The app cannot swap your page's `<video>` element for a player it controls.
- The desktop engine ships without the H.264 and H.265 decoders, so those videos would show as a black rectangle.
- AV1 plays in the desktop engine, but macOS decodes it only on recent Apple silicon, so on many Macs it would also show as a black rectangle.
- VP9 plays on every desktop platform, but on macOS only inside WebM. VP9 in an MP4 is refused for that reason.

This rule applies only to videos **inside a Scene**. A plain [Video wallpaper](/docs/creating-a-wallpaper/#video) is unaffected, and H.264 in MP4 stays the recommended format there.

## Encode your video

Run this before you add the video to your Scene:

```bash
ffmpeg -i clip.mp4 -c:v libvpx-vp9 -b:v 0 -crf 31 -c:a libopus clip.webm
```

- `-c:v libvpx-vp9 -b:v 0 -crf 31` encodes constant-quality VP9. Lower the `-crf` number for higher quality and a larger file.
- `-c:a libopus` encodes the audio as Opus, the audio codec WebM carries. Add `-an` instead if the video has no sound you need.

Then point your page at the `.webm` file, and make sure the old `.mp4` is no longer in the folder.

## What Wallpaper Reactor checks

The check reads the bytes of every video file in your Scene, so renaming a file's extension does not get past it. If a video does not qualify, creation stops and shows the file name, what it found (for example `H.264/MP4`), and the same ffmpeg command with your file's name filled in. The app checks for VP9 in WebM; a VP8 WebM also passes.

If you see this error, run the command it shows and add the new `.webm` file to your Scene.

## Related

- [Creating a wallpaper](/docs/creating-a-wallpaper/#scene) for the full Scene requirements
- [Customizable User Settings](/docs/wallpaper-creation/settings-json-tutorial/) to give your Scene options
- [Wallpaper Upload Guidelines](/docs/wallpaper-creation/wallpaper-guidelines/)
