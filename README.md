# Kev's logbook — Kevin Aleman's blog

A personal blog about life, engineering, and games. Built with [Astro](https://astro.build),
styled with a custom "Engineering Logbook" editorial design, and deployed to Netlify.

## Stack

- **Astro** (static output) with content collections for articles and talks
- Hand-written CSS design tokens (no Tailwind) — light mode, three typefaces
  (Space Grotesk / Newsreader / JetBrains Mono) self-hosted via `@fontsource`
- **Shiki** for code highlighting, `remark-reading-time` for read times
- RSS via `@astrojs/rss`; sitemap via `@astrojs/sitemap`; contact form via Netlify Forms
- Per-article social share cards rendered at build time with **satori** + **resvg**
  (`src/pages/og/[slug].png.js`); `public/og-default.png` covers the non-article pages
- Client-side ⌘K search palette (`SearchPalette.astro`) over an inlined index — no backend
- `/stats` — the log in numbers (entries, words, read time, per-year and tag breakdowns)

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the built site
npm run check     # type-check (astro check)
npm run test      # unit tests (vitest)
```

## Content

Articles live in `src/content/articles/*.md`. Frontmatter:

```yaml
idx: 1                       # stable publication number (ascending by date)
title: "…"
date: 2020-10-02T00:00:00Z
slug: "the-beauty-of-node-streams"   # the URL path (overrides the filename)
tags: ["nodejs", "streams"]
excerpt: "…"
draft: false
featured: false
featuredImage: "../../assets/images/stream.jpg"   # local asset, optional
# coverImage: "https://…"    # remote image (dev.to imports), optional
# canonicalUrl / devtoUrl    # set on imported articles
```

`slug` preserves the article's public URL — do not change it for existing posts.
Talks are listed in `src/content/talks/talks.json`.

## Importing dev.to articles

1. Get your dev.to API key (Settings → Extensions → API Keys).
2. `npm run import:devto # optionally export DEVTO_API_KEY first`
3. Re-run anytime — existing files are skipped when either the slug **or** the
   article title already exists locally, so your hand-migrated posts are not
   duplicated. Pass `-- --force` to overwrite.
   Note: `--force` rewrites existing files and re-assigns `idx` from the current
   max, so it can renumber posts. Prefer the default (skip) for incremental
   imports; only use `--force` for a full re-sync and review the diff.
4. Review the new `src/content/articles/*.md` (and `git status`), then commit.

The blog is the canonical source; imported articles carry a `devtoUrl` that renders
an "also on dev.to ↗" mirror link.

## Analytics

Privacy-friendly, cookieless [GoatCounter](https://www.goatcounter.com/). Set the
`PUBLIC_GOATCOUNTER` environment variable (in the Netlify UI) to your count endpoint,
e.g. `https://abcdev.goatcounter.com/count`. When unset, no analytics script is
emitted, so local dev and previews stay tracking-free. The script also skips
`localhost` on its own. No cookie-consent banner is required.

## Deploy

Pushed to Netlify via CI. `netlify.toml` pins the build (`npm run build` → `dist/`)
and Node 22.

## DEV canonical synchronization

DEV is a syndication channel; publish the original on https://kevinaleman.com.
Create a key at https://dev.to/settings/extensions (DEV Community API Keys).
Set `DEVTO_API_KEY` in your shell environment or an ignored root `.env` file
(`DEVTO_API_KEY=...`). Never commit or share it. Node 22 is required.

```bash
npm run devto:sync             # authenticated dry-run; no writes
npm run devto:sync -- --apply  # explicitly apply reviewed changes
```

Uses the official [Forem v1 API](https://developers.forem.com/api/v1):
`GET /api/articles/me/all` with pagination (including drafts), then
`PUT /api/articles/{id}` with only `{ "article": { "canonical_url": "..." } }`.
No body, title, tags, description, or publication state is sent.

Matching prefers an exact local `devtoUrl`, then an existing canonical path
on the current/old site, then exact DEV slug/local route correspondence, then
an exact title match ignoring case and whitespace. Ambiguous matches, conflicting
explicit links, duplicate targets, and local drafts are skipped as `UNMATCHED`.
Targets come from local `slug` (filename fallback), never from DEV titles.
Every target must return HTML successfully on the primary origin at the same path;
failed checks report `INVALID TARGET`. Rows show title, ID, current/proposed URLs,
and `OK`, `UPDATE`, `UNMATCHED`, or `INVALID TARGET`.

For `UNMATCHED`, verify the original manually and set its local `devtoUrl` to the
exact DEV article URL; rerun the dry-run. Do not change established local slugs.
For future syndication, publish/deploy the local post first, set DEV's canonical
URL to `https://kevinaleman.com/<local-slug>` in its editor, and save its `devtoUrl`
locally. Local pages derive canonical/OG URLs from their actual routes, regardless
of imported canonical metadata. Imports default to the primary domain; do not
set `SITE_URL` to the legacy deployment hostname.

Deploy these changes before applying synchronization. `netlify.toml` redirects
both HTTP and HTTPS requests on `kaleman.netlify.app` permanently to the primary
site, preserving paths and query strings. In Netlify Domain management, verify
`kevinaleman.com` is the primary domain on the same site that owns
`kaleman.netlify.app`. If the old hostname belongs to a separate Netlify site,
deploy the host-specific redirect rules there too. After deploy, check a real
article path with `curl -I https://kaleman.netlify.app/<local-slug>` for a 301 and
matching primary-domain Location; the primary URL must return 200 without a loop.

## Markdown article exports

Each published article is also available at
`https://kevinaleman.com/markdown/<local-slug>.md`. The static export contains
the title, author, publication date, original HTML URL, and unmodified Markdown
body (without internal frontmatter or page navigation). Article HTML advertises
it with a `rel="alternate"` link of type `text/markdown`. Drafts are excluded.
This provides a lightweight format for readers and agents; it does not guarantee
AI discovery, citations, or inclusion in training. Deploy to make exports live.
