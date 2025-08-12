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

{% assign rel = site.data.latest_release %}

---

## Other Install Files

### {{ rel.name }} ({{ rel.tag_name }})
**Published on** {{ rel.published_at | date: "%B %-d, %Y" }}

{{ rel.body | markdownify }}

### Downloads (Without Automatic Updates)
{% assign android_assets = "" | split: "," %}
{% assign mac_assets = "" | split: "," %}
{% assign windows_assets = "" | split: "," %}
{% assign other_assets = "" | split: "," %}

{% for asset in rel.assets %}
  {% assign ext = asset.name | split:'.' | last | downcase %}
  {% case ext %}
    {% when 'apk' %}
      {% assign android_assets = android_assets | push: asset %}
    {% when 'msi' %}
      {% assign windows_assets = windows_assets | push: asset %}
    {% when 'zip' %}
      {% if asset.name contains 'mac-aarch64' or asset.name contains 'mac-amd64' %}
        {% assign mac_assets = mac_assets | push: asset %}
      {% elsif asset.name contains 'windows' %}
        {% assign windows_assets = windows_assets | push: asset %}
      {% else %}
        {% assign other_assets = other_assets | push: asset %}
      {% endif %}
    {% else %}
      {% assign other_assets = other_assets | push: asset %}
  {% endcase %}
{% endfor %}

{% for asset in android_assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }}) (Android)
{% endfor %}
{% for asset in mac_assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }}) (macOS Experimental)
{% endfor %}
{% for asset in windows_assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }}) (Windows Experimental)
{% endfor %}
{% for asset in other_assets %}
  {% assign ext = asset.name | split:'.' | last | downcase %}
- [{{ asset.name }}]({{ asset.browser_download_url }}) ({{ ext }})
{% endfor %}
