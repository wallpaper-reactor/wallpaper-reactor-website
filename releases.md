---
title: Releases
layout: default
nav_order: 4
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
{% for asset in rel.assets %}
  {% assign ext = asset.name | split:'.' | last | downcase %}
  {% case ext %}
    {% when 'apk' %}
      {% assign label = 'Android' %}
    {% when 'msi' %}
      {% assign label = 'Windows' %}
    {% when 'zip' %}
      {% if asset.name contains 'mac-aarch64' or asset.name contains 'mac-amd64' %}
        {% assign label = 'macOS Experimental' %}
      {% else %}
        {% assign label = ext %}
      {% endif %}
    {% else %}
      {% assign label = ext %}
  {% endcase %}
- [{{ asset.name }}]({{ asset.browser_download_url }}) ({{ label }})
{% endfor %}
