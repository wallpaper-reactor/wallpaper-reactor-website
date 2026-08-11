# Blog post guidelines

House rules for writing posts under `src/content/blog/`. Derived from direction given while
writing the first post (`wallpaper-engine-for-mac.mdx`). This file lives outside `src/pages/`,
so it is not a route — it is a working document, not a page.

## Workflow

Every post goes through these steps in order. There are two approval gates, and neither is
optional.

1. **Ideas.** Present a set of article ideas with the reasoning behind each.
2. **Topic chosen.** Kyle picks one. Don't start on an idea that hasn't been picked.
3. **Outline.** Produce an outline, plus the media it should carry — screenshots, video,
   diagrams — and flag anything that needs sourcing, re-encoding or permission.
4. **Gate 1: outline approved.** Kyle approves or asks for revisions. Revise and re-present
   until it's approved. No prose before this point.
5. **Write.** Produce the article and **send the full final text in chat for review** — not a
   summary, not a diff, the text itself.
6. **Gate 2: text approved.** Kyle approves or asks for revisions.
7. **Publish.** Only now does it go public: commit, push to `main`, and confirm the deploy.

**Nothing is published without an explicit approval of the final text.** Building it locally,
committing it on a branch and screenshotting it are all fine before Gate 2 — pushing to `main`
is not, because that deploys straight to the live site.

## Process

**Agree the bullet points before writing prose.** Settle the thesis, the pillars, and the
claims first. Writing a full draft and then reshaping it wastes effort — the structure is
the decision, the prose is just execution.

**Ask about product capabilities instead of inferring them.** `src/data/features.ts` and `src/pages/index.astro`
describe tiers and formats, but they don't answer questions like "is the web renderer
genuinely interactive" or "does Godot work on the Mac build." Get those confirmed. Flag
any claim that couldn't be verified so it can be checked before publishing.

**Verify before publishing, not after.** Build the site, screenshot the rendered page, and
confirm the layout holds. Cosmetic defects that ship are visible to every visitor.

## Length and scope

**Keep posts tight.** Target 400–1000 words. One thesis, a handful of sections, a short FAQ,
a CTA. Length should be earned: the upper end is for posts carrying something substantial —
cited source, measured numbers, a real walkthrough — not for padding a thin idea. If a post is
long because it explains something specific that nobody else has explained, that's the right
kind of long.

**Every post carries at least one piece of media.** A screenshot, a diagram, a photo, or a
short video. It has to do work the prose can't: proof that something happens, a shape that's
easier to see than describe, or the thing itself. Decorative stock imagery doesn't count.
Media is also usually where errors surface — drawing a 1080p frame inside a 4K one is what
caught a wrong multiplier that had already survived a full read-through.

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

**Don't use `<StoreButtons />`** in a post CTA. It renders all three store badges including
the App Store Lite one. Use `<CtaButton href="/releases/" icon="apple">` instead.

## Page conventions

Frontmatter for a post in `src/content/blog/<slug>.mdx` (schema enforced by
`src/content.config.ts`):

```yaml
---
title: <keyword-led title>
description: <one to two sentences; the meta description and the blog index blurb>
publishDate: 2026-08-10
updatedDate: 2026-08-10   # optional
draft: false              # optional; drafts are excluded from build
---
```

- The URL is `/blog/<filename>/`. Renaming a published file changes its URL — don't.
- `BlogPostLayout` renders the `title` as the `<h1>` and emits `Article` JSON-LD. Don't
  repeat the title as a heading in the body.
- Use `<Faq items={[...]} />` for FAQs. It renders the accordion and the `FAQPage` JSON-LD
  from one array, so the copy and structured data can't drift.
- Use `<CtaButton href="/releases/" icon="apple">` for download CTAs. It is self-contained
  and doesn't inherit ambient styles.
- In MDX, write apostrophes as real characters inside JS strings — `&apos;` renders
  literally in attribute values rather than being decoded.
- Keep internal links trailing-slashed (`/features/`), matching `trailingSlash: 'always'`.

### Link every post to the others

**Every new post links to at least two existing posts, and at least one existing post gets a
link back to it.** Not a footer list of "related articles" — real links inside sentences, where
the connection is genuine.

Why it matters: an SEO review of the first four posts found that not one of them linked to any
other. Search engines were discovering them through the sitemap alone, with nothing signalling
that they're the same site talking about the same subject, and readers who finished one post had
nowhere to go but the download page.

How to do it well:

- Put the link where a reader would actually want it — at the moment the other post answers the
  question they've just formed, not bolted on at the end.
- Write anchor text that describes the destination: "setting a video as a wallpaper", not
  "click here" or a bare URL.
- Link into `/docs/` when a post touches creating or uploading wallpapers. The docs are otherwise
  orphaned from everything a reader arrives on.
- Two or three links is plenty. A post stuffed with them reads like SEO rather than writing.
- Raster images go in `src/assets/` and use `<Image>` from `astro:assets` with `widths`/`sizes`,
  so mobile isn't downloading a 3000px original. SVGs stay in `public/assets/images/`.
- **Photos carry camera metadata — strip it.** A phone photo embeds make, model, capture time
  and a GPS block, and "my desk" is usually "my home address". `astro:assets` re-encodes and
  drops metadata for anything imported through `<Image>`, but files in `public/` are copied
  verbatim, so that path can leak. Run `npm run images:clean` after adding any photo; CI runs
  `npm run images:check` and fails the build if metadata is found.
### Annotating screenshots

Tutorial screenshots get numbered pointers, drawn by `scripts/annotate-screenshot.mjs` from a
JSON spec. Never hand-draw them per article — the point is that every tutorial on the site
looks like the same system.

```bash
node scripts/annotate-screenshot.mjs _screenshots/annotations/<name>.json
```

The spec lists steps, each with any of `box`, `label` + `labelAt`, and `arrowFrom` + `arrowTo`,
in source-image pixels. Raw captures live in `_screenshots/raw/` and the specs in
`_screenshots/annotations/`, so any annotated asset can be regenerated or nudged later without
re-shooting the app.

The visual language is fixed, and each part of it was learned the hard way:

- **White fill, near-black text, drop shadow.** An earlier pass used the brand blue and the
  pointers vanished into the UI they were pointing at — the app is dark and blue, so blue reads
  as interface, not annotation.
- **Numbered labels** (`1  Browse`, `2  Pick a wallpaper`). Readers scan a tutorial by number.
- **Box the target, arrow from the label.** The box says what to click; the arrow says which
  label belongs to it when there are several.
- **Put labels in empty space**, never over content. If a label overflows the frame the script
  warns — move it rather than shrinking the text.
- **Font size scales with image width**, so a 400px phone shot and a 1280px desktop shot come
  out visually consistent.

Capture at a size where the UI is legible, not at the largest size available. Desktop shots at
1280×720 read far better than 1920×1080, where everything is small. Phone shots at 400×711 put
the app in its two-column compact layout, which is what a phone actually shows.

- Screen recordings must be re-encoded before they ship — a raw 1080p60 capture is heavier
  than the whole rest of the page. 720p/30fps at CRF 30 with no audio took one from 12 MB to
  114 KB. Give the `<video>` a poster frame and `autoplay loop muted playsinline`:

  ```bash
  ffmpeg -i raw.mp4 -vf "fps=30,scale=1280:-2" -c:v libx264 -crf 30 -preset slow \
    -pix_fmt yuv420p -an -movflags +faststart public/assets/videos/<name>.mp4
  ffmpeg -ss 2 -i raw.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 6 \
    public/assets/videos/<name>-poster.jpg
  ```

## After publishing

The sitemap picks up new posts automatically, but submitting the URL in Search Console
gets it crawled far sooner than waiting for a natural crawl.
