---
title: Releases
layout: default
nav_order: 4
redirect_from:
  - /releases.html
---

# Official Releases

## Install via App Stores (Automatic Updates)

{% include store-buttons.html %}

**Note:** The Mac App Store version is "Wallpaper Reactor Lite" with limited features. See the [features documentation]({{ site.baseurl }}/docs/features) for more information about version differences, or download the full macOS version below.

{% assign rel = site.data.latest_release %}

---

## Other Install Files

### {{ rel.name }} ({{ rel.tag_name }})
**Published on** {{ rel.published_at | date: "%B %-d, %Y" }}

{% assign android_assets = "" | split: "," %}
{% assign macos_assets = "" | split: "," %}
{% assign windows_assets = "" | split: "," %}

{% for asset in rel.assets %}
  {% assign name_lower = asset.name | downcase %}
  {% if name_lower contains '.apk' or name_lower contains 'android' %}
    {% assign android_assets = android_assets | push: asset %}
  {% elsif name_lower contains 'mac' %}
    {% assign macos_assets = macos_assets | push: asset %}
  {% elsif name_lower contains 'windows' %}
    {% assign windows_assets = windows_assets | push: asset %}
  {% endif %}
{% endfor %}

| Operating System | Build | Recommended | Link |
|-----------------|-------|-------------|------|
| **🍎 macOS** | Apple Silicon | ✅ | {% for asset in macos_assets %}{% if asset.name contains 'arm64' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| | Intel | ✅ | {% for asset in macos_assets %}{% if asset.name contains 'x64' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| | Mac App Store | ❌ | <a href="https://apps.apple.com/us/app/wallpaper-reactor-lite/id6751447022" target="_blank" rel="noopener">Mac App Store</a> |
| **🪟 Windows** | Microsoft Store | ✅ | <a href="https://apps.microsoft.com/detail/9n4302crdqrl" target="_blank" rel="noopener">Microsoft Store</a> |
| | Intel/AMD | ❌ | {% for asset in windows_assets %}{% if asset.name contains 'x64' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| | ARM | ❌ | {% for asset in windows_assets %}{% if asset.name contains 'arm64' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| **🤖 Android** | Google Play | ✅ | <a href="https://play.google.com/store/apps/details?id=app.wallpaperreactor" target="_blank" rel="noopener">Google Play</a> |
| | Universal APK | ❌ | {% for asset in android_assets %}[Download]({{ asset.browser_download_url }}){% break %}{% endfor %} |
