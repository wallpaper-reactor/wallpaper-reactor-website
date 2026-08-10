# Blog post guidelines

House rules for writing posts under `blog/`. Derived from direction given while writing
the first post (`blog/wallpaper-engine-for-mac.md`). Excluded from the built site via
`exclude:` in `_config.yml` — it is a working document, not a page.

## Process

**Agree the bullet points before writing prose.** Settle the thesis, the pillars, and the
claims first. Writing a full draft and then reshaping it wastes effort — the structure is
the decision, the prose is just execution.

**Ask about product capabilities instead of inferring them.** `features.md` and `index.md`
describe tiers and formats, but they don't answer questions like "is the web renderer
genuinely interactive" or "does Godot work on the Mac build." Get those confirmed. Flag
any claim that couldn't be verified so it can be checked before publishing.

**Verify before publishing, not after.** Build the site, screenshot the rendered page, and
confirm the layout holds. Cosmetic defects that ship are visible to every visitor.

## Length and scope

**Keep posts short.** Target 400–600 words. One thesis, two or three sections, a short
FAQ, a CTA. Comprehensive-guide length is not the goal.

**Don't explain competitors' technical internals.** No deep dives into how another product
renders, why it can't be ported, or what its file formats contain. It's off-topic and it
sells their product's sophistication.

**No comparison tables.** They invite fact-checking of claims about products we don't
control, and they read as defensive.

**Don't name competitors.** Refer to the category ("most Mac live wallpaper apps are video
players"). This keeps the piece from becoming a competitor roundup and removes the risk
that comes with comparative claims.

**No pricing.** Prices and tier contents belong on `/features/`. Link there. Duplicated
pricing goes stale the moment anything changes.

**Don't concede features we lack.** If a capability is missing, leave it out rather than
raising it to look even-handed. Same for catalogue-size apologetics — state what we have.

## Voice

**Make the claim directly.** "Wallpaper Reactor is the only Mac app with truly interactive
wallpapers" — assert it as a heading. Hedged, balanced framing reads as weakness.

**Avoid "x, not y" antithesis.** Constructions like "real input, not a looping clip" or
"one setup instead of three" are a verbal tic. Let each claim stand on its own:
"interactive web wallpapers that respond to your input."

**Lead with the answer.** The reader arrived with a question. Answer it in the first two
sentences, then build.

## The two things worth selling

Every post should reinforce at least one:

1. **True interactivity** — web scenes take real input, shaders render live, Godot scenes
   run on the desktop. This is the core differentiator; most alternatives only play video.
2. **Cross-platform** — macOS, Windows, and Android from one library, with favorites and
   settings sync. Every competing app is single-platform.

## CTAs

**Link to direct downloads only** (`/releases/`). Never send blog traffic to the Mac App
Store — that build is "Lite" and blocks sign-in, sync, uploads, and performance settings,
which are exactly what the posts describe.

**Don't use `_includes/store-buttons.html`** in a post CTA. It renders all three store
badges including the App Store Lite one.

## Page conventions

Front matter for a post:

```yaml
---
title: <keyword-led title>
layout: default
parent: Blog
nav_order: <n>
permalink: /blog/<slug>/
description: <one to two sentences; becomes the meta description and the blog index blurb>
---
```

- `blog/index.md` sets `has_toc: false` so just-the-docs doesn't render a duplicate child
  listing beneath the hand-written post list.
- Wrap FAQ `<details>` blocks in `<div class="faq-section" markdown="0">`. That class in
  `_sass/custom/custom.scss` hides the native disclosure marker and styles the `▾` arrow —
  without it you get two arrows per row.
- Include `FAQPage` JSON-LD matching the visible FAQ, for rich results.
- **Don't use `<h2>` inside a CTA box.** just-the-docs injects anchor links into headings
  and will reuse the previous heading's id, producing a link that jumps up the page. Use a
  styled `<div>`.
- **Style CTA buttons inline.** `.btn-primary` and `.btn-icon` are scoped to the hero and
  404 contexts in `custom.scss`; reusing them elsewhere picks up partial styles. Apply the
  gradient, padding, and radius directly, and invert icon SVGs with
  `filter: brightness(0) invert(1)`.

## Local preview

No Ruby toolchain on this machine (system Ruby is too old and lacks headers), so build in
a container:

```bash
docker run --rm -v "$PWD":/srv/jekyll -w /srv/jekyll ruby:3.3-slim bash -c \
  "apt-get update -qq && apt-get install -y -qq build-essential && \
   gem install bundler --no-document && bundle config set --local path vendor/bundle && \
   bundle install && bundle exec jekyll build --destination /srv/jekyll/_site"

(cd _site && python3 -m http.server 4321 --bind 127.0.0.1)
```

Screenshots via headless Chrome in Docker:

```bash
docker run --rm --network host -v /tmp/shots:/shots --entrypoint chromium-browser \
  zenika/alpine-chrome --headless=old --no-sandbox --disable-gpu --hide-scrollbars \
  --virtual-time-budget=8000 --screenshot=/shots/page.png --window-size=1100,1900 \
  http://127.0.0.1:4321/blog/<slug>/
```

## After publishing

The sitemap picks up new posts automatically, but submitting the URL in Search Console
gets it crawled far sooner than waiting for a natural crawl.
