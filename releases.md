---
title: Releases
layout: default
nav_order: 2
---

# Official Releases

<div class="store-buttons">
  <a href="https://play.google.com/store/apps/details?id=app.wallpaperreactor" target="_blank" rel="noopener">
    <img src="{{ '/assets/images/google-play-button.png' | relative_url }}" alt="Get it on Google Play">
  </a>
  <!-- <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener">
    <img src="{{ '/assets/images/apple-store-button.svg' | relative_url }}" alt="Download on the App Store">
  </a>
  <a href="https://www.microsoft.com/store/apps/YOUR_APP_ID" target="_blank" rel="noopener">
    <img src="{{ '/assets/images/microsoft-store-badge.svg' | relative_url }}" alt="Get it from Microsoft">
  </a> -->
</div>

{% assign rel = site.data.latest_release %}

## {{ rel.name }} ({{ rel.tag_name }})
**Published on** {{ rel.published_at | date: "%B %-d, %Y" }}

{{ rel.body | markdownify }}

### Downloads (Without Automatic Updates)
{% for asset in rel.assets %}
  {% assign ext = asset.name | split:'.' | last | downcase %}
  {% case ext %}
    {% when 'apk' %}
      {% assign label = 'Android' %}
    {% when 'pkg' %}
      {% assign label = 'macOS' %}
    {% when 'msi' %}
      {% assign label = 'Windows' %}
    {% else %}
      {% assign label = ext %}
  {% endcase %}
- [{{ asset.name }}]({{ asset.browser_download_url }}) ({{ label }})
{% endfor %}
