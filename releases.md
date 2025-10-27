---
title: Releases
layout: default
nav_order: 3
redirect_from:
  - /releases.html
---

<div class="section-header" markdown="0">
  <h2>Official Releases</h2>
</div>

<div class="modern-card" style="text-align: center; margin: 2rem 0;" markdown="0">
  <h3 style="margin-bottom: 1.5rem; color: #f5f5f5;">Install via App Stores</h3>
  {% include store-buttons.html %}
  <p style="color: #a3a3a3; margin-top: 1.5rem; font-size: 0.9rem;">
    <strong>Note:</strong> The Mac App Store version is "Wallpaper Reactor Lite" with limited features. See the <a href="/docs/features/">features documentation</a> for more information about version differences, or download the full macOS version below.
  </p>
</div>

{% assign rel = site.data.latest_release %}

<div class="section-header" style="margin-top: 4rem;" markdown="0">
  <h2>Other Install Files</h2>
</div>

<div style="text-align: center; margin: 2rem 0;" markdown="1">

### {{ rel.name }} ({{ rel.tag_name }})
**Published on** {{ rel.published_at | date: "%B %-d, %Y" }}

</div>

{% assign android_assets = "" | split: "," %}
{% assign macos_assets = "" | split: "," %}
{% assign windows_assets = "" | split: "," %}

{% for asset in rel.assets %}
  {% assign name_lower = asset.name | downcase %}
  {% if name_lower contains '.apk' or name_lower contains 'android' %}
    {% assign android_assets = android_assets | push: asset %}
  {% elsif name_lower contains 'mac' %}
    {% assign macos_assets = macos_assets | push: asset %}
  {% elsif name_lower contains 'windows' or name_lower contains '.msix' %}
    {% assign windows_assets = windows_assets | push: asset %}
  {% endif %}
{% endfor %}

| Operating System | Build | Recommended | Link |
|-----------------|-------|-------------|------|
| **🍎 macOS** | Apple Silicon | ✅ | {% for asset in macos_assets %}{% if asset.name contains 'aarch64' and asset.name contains '.zip' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| | Intel | ✅ | {% for asset in macos_assets %}{% if asset.name contains 'amd64' and asset.name contains '.zip' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| | Mac App Store<br>(Apple Silicon) | ❌ | <a href="https://apps.apple.com/us/app/wallpaper-reactor-lite/id6751447022" target="_blank" rel="noopener">Mac App Store</a> |
| **🪟 Windows** | Microsoft Store<br>(Intel/AMD) | ✅ | <a href="https://apps.microsoft.com/detail/9n4302crdqrl" target="_blank" rel="noopener">Microsoft Store</a> |
| | Direct Install<br>(Intel/AMD & ARM) | ❌ | {% for asset in rel.assets %}{% if asset.name contains '.exe' %}[Download]({{ asset.browser_download_url }}){% endif %}{% endfor %} |
| **🤖 Android** | Google Play | ✅ | <a href="https://play.google.com/store/apps/details?id=app.wallpaperreactor" target="_blank" rel="noopener">Google Play</a> |
| | Universal APK | ❌ | {% for asset in android_assets %}[Download]({{ asset.browser_download_url }}){% break %}{% endfor %} |
