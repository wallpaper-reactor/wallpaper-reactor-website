---
title: Releases
layout: default
nav_order: 2
---

{% assign rel = site.data.latest_release %}

## {{ rel.name }} ({{ rel.tag_name }})
**Published on** {{ rel.published_at | date: "%B %-d, %Y" }}

{{ rel.body | markdownify }}

### Downloads
{% for asset in rel.assets %}
- [{{ asset.name }}]({{ asset.browser_download_url }})
{% endfor %}
