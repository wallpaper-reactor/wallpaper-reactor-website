---
title: Customizable User Settings
layout: default
nav_order: 1
parent: Wallpaper Creation
grand_parent: Documentation
has_children: false
---

# Customizable User Settings

Learn how to create custom configuration files for Wallpaper Reactor wallpapers using the `settings.json` format.

## Overview

The `settings.json` file defines the customizable options for your wallpaper, allowing users to personalize colors, animations, text, and other parameters through Wallpaper Reactor's built-in settings interface.

The key/value pairs generated from user options are automatically sent to your wallpaper:
- **Scene wallpapers**: Values are passed as URL parameters
- **Godot wallpapers**: Values are passed as engine arguments
- **Other wallpaper types**: Do not support user customization

## Basic Structure

Every `settings.json` file follows this basic structure:

```json
{
  "disableFpsCap": false,
  "options": [
    // Your configuration options go here
  ]
}
```

### Root Configuration

- **`disableFpsCap`** (optional, default: `false`): Should only be used for scene wallpapers that break when the FPS is capped. Never use otherwise, as it significantly increases resource usage.
- **`options`**: Array containing all customizable wallpaper settings.

## Option Types

### Text Input

Create text input fields for user-customizable strings:

```json
{
  "type": "text",
  "name": "Display Text",
  "key": "displayText",
  "description": "Text that will be displayed on the wallpaper background",
  "defaultValue": "Hello World"
}
```

### Color Picker

Allow users to select colors in various formats:

```json
{
  "type": "color",
  "name": "Background Color",
  "key": "backgroundColor",
  "description": "Primary background color for the wallpaper",
  "defaultValue": "#1a1a1a",
  "format": "hex"
}
```

**Supported color formats:**
- `"hex"`: `"#1a1a1a"` or `"#1a1a1aff"`
- `"rgb"`: `"rgb(255,128,0)"`
- `"rgba"`: `"rgba(255,255,255,0.8)"`
- `"vec3"`: `"0.2,0.4,0.8"` (normalized 0.0-1.0)
- `"vec4"`: `"0.2,0.4,0.8,1.0"` (normalized with alpha)

### Boolean Switch

Create toggle switches for on/off options:

```json
{
  "type": "switch",
  "name": "Enable Animations",
  "key": "enableAnimations",
  "description": "Toggle smooth animations and transitions",
  "defaultValue": true,
  "encodeDefaultValue": true
}
```

- **`encodeDefaultValue`** (optional, default: `true`): Whether to include the parameter when it matches the default value.

### Numeric Slider

Create sliders for numeric values within a range:

```json
{
  "type": "slider",
  "name": "Animation Speed",
  "key": "animationSpeed",
  "description": "Controls the speed of animations (1.0 = normal speed)",
  "defaultValue": 1.0,
  "range": {
    "start": 0.1,
    "end": 3.0
  },
  "isInteger": false
}
```

- **`isInteger`** (optional, default: `false`): When `true`, only allows whole numbers.

### Dropdown Menu

Create dropdown menus with predefined options:

```json
{
  "type": "menu",
  "name": "Animation Style",
  "key": "animationStyle",
  "description": "Choose the animation pattern to use",
  "defaultValue": "smooth",
  "options": [
    {
      "value": "none",
      "name": "No Animation"
    },
    {
      "value": "smooth",
      "name": "Smooth Transitions"
    },
    {
      "value": "bounce",
      "name": "Bouncy Effects"
    }
  ]
}
```

- **`name`** in options is optional - if omitted, it's auto-generated from the value (e.g., `"customPattern"` becomes `"Custom Pattern"`).

### File Selection

Allow users to select files of specific types:

```json
{
  "type": "file",
  "name": "Background Image",
  "key": "backgroundImage",
  "description": "Custom background image file",
  "defaultValue": null,
  "accept": ["png", "jpg", "jpeg", "webp"]
}
```

**Common file types:**
- **Images**: `png`, `jpg`, `jpeg`, `webp`, `gif`, `bmp`
- **Videos**: `mp4`, `webm`, `mov`, `avi`, `mkv`
- **Audio**: `mp3`, `wav`, `ogg`, `m4a`, `flac`
- **Data**: `json`, `xml`, `txt`, `csv`

### Groups

Organize related options into collapsible groups:

```json
{
  "type": "group",
  "name": "Advanced Settings",
  "key": "advancedGroup",
  "description": "Fine-tune advanced wallpaper behavior",
  "options": [
    {
      "type": "switch",
      "name": "Hardware Acceleration",
      "key": "useHardwareAccel",
      "description": "Use GPU acceleration when available",
      "defaultValue": true
    }
  ]
}
```

### Visual Dividers

Add visual separators to organize the settings interface:

```json
{
  "type": "divider"
}
```

## Conditional Visibility

Show or hide options based on other settings using the `visibleIf` property:

### Simple Conditions

```json
{
  "type": "color",
  "name": "Particle Color",
  "key": "particleColor",
  "description": "Color of animated particles",
  "defaultValue": "#ffffff",
  "visibleIf": {
    "type": "equals",
    "key": "enableAnimations",
    "value": true
  }
}
```

### Complex Conditions

Use `and` and `or` to combine multiple conditions:

```json
{
  "type": "slider",
  "name": "Blur Intensity",
  "key": "blurIntensity",
  "description": "Amount of background blur effect",
  "defaultValue": 5,
  "range": { "start": 0, "end": 20 },
  "visibleIf": {
    "type": "or",
    "conditions": [
      {
        "type": "equals",
        "key": "qualityPreset",
        "value": "high"
      },
      {
        "type": "equals",
        "key": "qualityPreset",
        "value": "ultra"
      }
    ]
  }
}
```

**Condition types:**
- `"equals"`: Show when key equals value
- `"notEquals"`: Show when key doesn't equal value
- `"and"`: Show when ALL conditions are true
- `"or"`: Show when ANY condition is true

## Best Practices

### Naming Conventions
- Use **camelCase** for parameter keys: `"backgroundColor"`, `"animationSpeed"`
- Use descriptive, user-friendly names for display labels
- Keep descriptions concise but informative

### Performance Optimization
- Set `"encodeDefaultValue": false` for options that rarely change from default
- Only use `"disableFpsCap": true` for scene wallpapers that break with FPS caps - never otherwise
- Group related options for better organization

### Validation
- Ensure `defaultValue` matches the expected data type
- Menu `defaultValue` must exist in the options array
- Slider ranges should include the `defaultValue`
- File `accept` arrays should contain lowercase extensions only

## Complete Example

Here's a minimal but complete `settings.json` example:

```json
{
  "disableFpsCap": false,
  "options": [
    {
      "type": "text",
      "name": "Title Text",
      "key": "titleText",
      "description": "Main title displayed on the wallpaper",
      "defaultValue": "My Wallpaper"
    },
    {
      "type": "color",
      "name": "Background Color",
      "key": "bgColor",
      "description": "Wallpaper background color",
      "defaultValue": "#2a2a2a",
      "format": "hex"
    },
    {
      "type": "switch",
      "name": "Enable Particles",
      "key": "showParticles",
      "description": "Show animated background particles",
      "defaultValue": true
    },
    {
      "type": "slider",
      "name": "Particle Count",
      "key": "particleCount",
      "description": "Number of background particles",
      "defaultValue": 50,
      "range": { "start": 10, "end": 200 },
      "isInteger": true,
      "visibleIf": {
        "type": "equals",
        "key": "showParticles",
        "value": true
      }
    }
  ]
}
```

This creates a settings interface with customizable title text, background color, and optional animated particles with adjustable count.