# ABCDev — Kevin Aleman's blog

A personal blog about life, engineering, and games. Built with [Astro](https://astro.build),
styled with a custom "Engineering Logbook" editorial design, and deployed to Netlify.

## Stack

- **Astro** (static output) with content collections for articles and talks
- Hand-written CSS design tokens (no Tailwind) — light mode, three typefaces
  (Space Grotesk / Newsreader / JetBrains Mono) self-hosted via `@fontsource`
- **Shiki** for code highlighting, `remark-reading-time` for read times
- RSS via `@astrojs/rss`; contact form via Netlify Forms

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
2. `DEVTO_API_KEY=xxx SITE_URL=https://your-site npm run import:devto`
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
and Node 20.
