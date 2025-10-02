---
layout: default
title: Rive Animations
parent: Wallpaper Creation
nav_order: 2
---

# Creating Rive Wallpapers

Wallpaper Reactor supports **Rive animations** (.riv files) as live wallpapers. Rive is a powerful real-time animation tool that creates lightweight, interactive animations perfect for wallpapers.

## What are Rive Animations?

Rive files are vector-based animations that:
- Run at 60+ FPS with minimal CPU/GPU usage
- Support interactive state machines for dynamic wallpapers
- Scale perfectly to any resolution without quality loss
- Have file sizes typically under 1MB

## How Wallpaper Reactor Plays Rive Files

1. **Automatic Playback**: The app automatically detects and plays your animation's default state machine or animation
2. **Performance Optimization**: Frame rate and resolution can be capped to save resources

## Creating Your Own Rive Wallpapers

**Best Practices:**
- Keep animations smooth and looping
- Avoid excessive particle effects or complex meshes
- Test at different resolutions
- Keep essential content in the center of the animation to allow scaling on protrait mode phones and ultrawide desktops
- Use state machines named "State Machine 1" for automatic playback

## Troubleshooting

### Animation Not Playing

- Ensure your file has at least one animation or state machine
- Check that state machines are properly named
- Verify the .riv file isn't corrupted
