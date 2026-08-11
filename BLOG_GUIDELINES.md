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
- Raster images go in `src/assets/` and use `<Image>` from `astro:assets` with `widths`/`sizes`,
  so mobile isn't downloading a 3000px original. SVGs stay in `public/assets/images/`.
- **Photos carry camera metadata — strip it.** A phone photo embeds make, model, capture time
  and a GPS block, and "my desk" is usually "my home address". `astro:assets` re-encodes and
  drops metadata for anything imported through `<Image>`, but files in `public/` are copied
  verbatim, so that path can leak. Run `npm run images:clean` after adding any photo; CI runs
  `npm run images:check` and fails the build if metadata is found.
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
