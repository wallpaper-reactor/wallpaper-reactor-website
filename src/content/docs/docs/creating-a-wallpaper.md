---
title: Creating a Wallpaper
description: Make a wallpaper from your own image, video, shader, Rive animation, Scene or Godot project, and what each source type needs.
---

The **Create** tab has two ways to make a wallpaper.

| | **Quick Wallpaper** | **Create Permanent Wallpaper** |
| --- | --- | --- |
| What it does | Applies a file from your device right away | Publishes a wallpaper that can be shared and synced across devices |
| Account | Not needed | Sign in when you upload |
| Published | Nothing is published | Goes **in review**, then appears in the catalogue |
| Source types | Image, Video, Shader, Rive, Scene (one file), Godot | Image, Video, Shader, Rive |

Choose **Import file** under Quick Wallpaper, pick a file, and it is applied. Quick Wallpaper accepts these extensions: `png`, `jpg`, `jpeg`, `webp`, `gif`, `mp4`, `webm`, `mov`, `avi`, `mkv`, `m4v`, `wmv`, `glsl`, `frag`, `riv`, `html`, `htm`, `pck`. With several screens in **Custom** [Multi-Screen Mode](/docs/applying-and-managing/#several-screens-on-desktop), it asks which screen to use first. A file that is not what its extension says is refused with "isn't a valid wallpaper file of that type".

**Create Permanent Wallpaper** walks you through these steps:

1. **Select Content**: pick the wallpaper type, then **Choose a file** (or **Choose a folder**), then **Continue**.
2. **Processing**: the app checks the file's type, size and contents.
3. **Validation**: a self-check that renders the wallpaper at four sizes and reports problems.
4. **A setup screen**, for two types: **Video options** for a video (below), and the shader editor for a shader. In the editor, **Save** takes you on.
5. **Preview**: the app generates the preview image the catalogue shows. This is a real render and can take up to 45 seconds.
6. **Sign in** if you are not already, then **Upload**.

If you choose **Write a shader**, you start in the editor, and **Save** checks the shader and goes to the preview.

After **Upload** the wallpaper shows **Uploaded — now in review**. A moderator reviews every public wallpaper before anyone else sees it. Read the [Wallpaper Upload Guidelines](/docs/wallpaper-creation/wallpaper-guidelines/) first.

:::note
In this release, the type picker offers **Image**, **Video**, **Shader** and **Rive**. **Scene** and **Application** (Godot) tiles show **Coming Soon**, and **Website** is not offered at all. Scene and Godot files still work through Quick Wallpaper.
:::

## Size limits

| Type | Largest file (or whole folder) |
| --- | --- |
| Image | 25 MB |
| Video | 300 MB |
| Shader | 10 MB per file |
| Rive | 25 MB |
| Scene | 100 MB |
| Godot | 100 MB |

## Image

Accepted: `png`, `jpg`, `jpeg`, `webp`, `gif`.

- A GIF is accepted, and an animated GIF animates.
- An **animated PNG** is refused when you publish: "This is not supported for image wallpapers." Convert it to MP4 and publish it as a Video wallpaper.
- A file that is empty, cut off, damaged, or not actually an image is refused with a message saying which.
- On Android, an Image wallpaper is set through Android's own crop-and-set screen as a regular still wallpaper.

## Video

Accepted: `mp4`, `webm`, `mov`, `avi`, `mkv`, `m4v`, `wmv`. When you publish, the app reads the file itself, and it must be an **MP4, WebM or Matroska** container.

**Use H.264 video with AAC audio in an MP4.** It plays natively on every platform.

On the **Video options** screen (**Configure Video Settings**) you choose:

- **Loop Mode**: **None** (use the video as it is), **Reverse (Ping-Pong)** (play forward, then backward), **Fade In/Out** (fade from and to black), or **Crossfade** (fade the end into the beginning).
- **Remove Audio**: on by default. With it on, the wallpaper plays no sound. Ping-Pong always removes audio.
- **Scaling**: **Cover**, **Contain**, **Fill** or **None**.
- **Playback Rate** (0 to 2), **Volume** (0 to 1) and **Player Controls**.

**Wallpaper Reactor does not re-encode video.** When your choices change the file, the app shows an `ffmpeg` command under **Process Video with FFmpeg** instead:

1. Choose **Copy Command**. **How do I install FFmpeg?** links an install guide.
2. [Install FFmpeg](https://ffmpeg.org/download.html) on a computer, open a terminal in the folder with your video, and run the command. It writes `<name>_processed.mp4`.
3. Create the wallpaper from that processed file.

You can also continue with your original file. Loop effects and removing the audio track only happen in the processed file, but **Remove Audio** still silences the wallpaper because the volume is set to 0.

**On Android there is no terminal.** Process the video on a computer, copy the result to your phone, then create the wallpaper from it. Quick Wallpaper plays a video as it is, with no processing.

## Shader

Accepted: `glsl`, `frag`. A shader is a small GLSL program that draws every frame.

Under **Shader**, choose **Write a shader** to open the editor, or choose a file. The editor:

- Starts you with a working shader. A shader defines `void mainImage(out vec4 fragColor, in vec2 fragCoord)` and can read `iTime` and `iResolution`.
- Has **Start from a template…** with **Getting started**, **Custom options**, **Plasma**, **Noise field** and **Raymarch**. Choosing one replaces what is in the editor.
- Shows compile errors under **Problems**, with line numbers. A shader that does not compile cannot be published ("This shader does not compile").
- Offers **Options…** to turn uniforms in your shader into controls that people can change after installing it. Uniforms you declare appear under **Found in your shader**. See [Customizable User Settings](/docs/wallpaper-creation/settings-json-tutorial/).
- Offers **Import** and **Export**, and **Save** when you are done.

## Rive

Accepted: `riv`. See [Rive Animations](/docs/wallpaper-creation/rive/) for how Rive files play and how to build them.

## Scene

A Scene is a web page: an HTML file, or a folder with an `index.html`. It is rendered exactly as you wrote it, and it can respond to touch and mouse input.

**Choose a file** or **Choose a folder**. Accepted: `html`, `htm`.

- A **single file** must not reference other local files. If your page loads images, scripts or styles from files next to it, choose the whole folder.
- A **folder** must contain `index.html` or `index.htm` in its root. Every local file the page references must be in the folder, and none can sit outside it. Hidden files are ignored.
- **File names** may use letters, numbers, hyphens and underscores, up to 100 characters. Spaces and special characters such as `& # % ( )` are refused, because your page refers to files by name and the app does not rename them.
- A Scene can load scripts, styles, images, media, fonts and data from `https://` and `wss://` addresses. It cannot use plain `http://`, and it cannot embed other sites in frames.
- **Video inside a Scene must be VP9 in a WebM container.** Anything else is refused, and the error shows the ffmpeg command that fixes it. See [Videos Inside a Scene](/docs/wallpaper-creation/scene-video/) and encode before you add the video.
- To let people change settings, add a `settings.json`. See [Customizable User Settings](/docs/wallpaper-creation/settings-json-tutorial/).

## Godot

Godot projects are listed as **Application** in the app. Accepted: `pck`, an exported Godot pack.

- The project must be built on the **Wallpaper Reactor Godot template**, with Godot **4.7.2** exactly. A pack without the template's signature is refused: "This Godot wallpaper wasn't built on the Wallpaper Reactor template."
- **No networking.** A Godot wallpaper cannot connect to the internet or the local network, and a pack that uses networking is refused.
- **No native code.** A pack that carries native code is refused.
- Declare options in the template's `settings.json`. See [Customizable User Settings](/docs/wallpaper-creation/settings-json-tutorial/).

## Website

The app does not offer **Website** wallpapers (a link to an `https://` page) for creation. To make a web wallpaper, build a [Scene](#scene).

## Next

- [Applying and managing wallpapers](/docs/applying-and-managing/)
- [Troubleshooting](/docs/troubleshooting/)
