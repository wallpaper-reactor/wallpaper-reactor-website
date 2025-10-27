---
title: Releases
layout: default
nav_order: 3
---

# Releases

<section style="padding: 3rem 0; max-width: 1280px; margin: 0 auto;" markdown="0">
  <div style="padding: 0 1rem;">
    <h2 style="font-size: 1.875rem; font-weight: 600; margin-bottom: 0.5rem; text-align: center;">Download from App Stores</h2>
    <p style="color: #a3a3a3; text-align: center; margin-bottom: 3rem; max-width: 48rem; margin-left: auto; margin-right: auto;">Get Wallpaper Reactor on your favorite platform. Fast, secure, and auto‑updating.</p>

    <div style="margin-bottom: 3rem;">
      {% include store-buttons.html %}
    </div>

    <div style="background: rgba(59, 130, 246, 0.05); border-left: 3px solid #3b82f6; padding: 1rem 1.5rem; border-radius: 0.5rem; max-width: 48rem; margin: 0 auto;">
      <p style="color: #a3a3a3; margin: 0; font-size: 0.9rem;">
        <strong style="color: #e5e5e5;">Note:</strong> The Mac App Store version is "Wallpaper Reactor Lite" with limited features. See the <a href="/features/" style="color: #3b82f6; text-decoration: none;">features documentation</a> for version differences, or download the full macOS version below.
      </p>
    </div>
  </div>
</section>

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
