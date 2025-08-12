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
{% assign macos_assets = "" | split: "," %}
{% assign windows_assets = "" | split: "," %}

{% for asset in rel.assets %}
  {% assign name_lower = asset.name | downcase %}
  {% if name_lower contains '.apk' or name_lower contains 'android' %}
    {% assign android_assets = android_assets | push: asset %}
  {% elsif name_lower contains 'mac' or name_lower contains 'macos' or name_lower contains 'darwin' %}
    {% assign macos_assets = macos_assets | push: asset %}
  {% elsif name_lower contains 'windows' or name_lower contains 'win' or name_lower contains '.msi' or name_lower contains '.exe' %}
    {% assign windows_assets = windows_assets | push: asset %}
  {% endif %}
{% endfor %}

{% if android_assets.size > 0 %}
#### Android
{% for asset in android_assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }})
{% endfor %}
{% endif %}

{% if macos_assets.size > 0 %}
#### macOS (Experimental)
{% for asset in macos_assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }})
{% endfor %}
{% endif %}

{% if windows_assets.size > 0 %}
#### Windows (Experimental)
{% for asset in windows_assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }})
{% endfor %}
{% endif %}
