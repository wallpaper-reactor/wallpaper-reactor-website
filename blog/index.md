---
title: Blog
layout: default
nav_order: 5
has_children: true
has_toc: false
description: Guides, comparisons, and technical deep-dives on live wallpapers across Android, Windows, and macOS.
---

# Blog

Guides, comparisons, and technical write-ups about live wallpapers — how they work, how to make them, and how to get them running on every device you own.

<ul>
{% assign posts = site.pages | where: "parent", "Blog" | sort: "nav_order" %}
{% for post in posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    {% if post.description %}<br><span style="color: #a3a3a3; font-size: 0.9rem;">{{ post.description }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
