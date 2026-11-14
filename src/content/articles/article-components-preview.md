---
idx: 28
title: "Article components: a preview"
date: 2026-11-14
slug: "article-components-preview"
tags: ["design"]
excerpt: "A preview of the notes, lists, tables and text charts available in the logbook."
draft: false
unlisted: true
featured: false
---

These examples show the components available for articles. The release and numbers below are fictional.

## Note

Use a note for context that helps the reader without interrupting the main point.

> [!NOTE] A little context
>
> The preview uses the same colors and type as the rest of the logbook. It also follows the selected theme.

## Tip

Use a tip for a practical suggestion.

> [!TIP] Keep it close
>
> Put a figure next to the paragraph it supports, where the reader needs it.

## Warning

Use a warning when a detail could change the outcome.

> [!WARNING] Check the source
>
> A chart can make a number easier to read, but it can't tell you whether the number is right.

## Steps

Use steps for a sequence with a clear order.

> [!STEPS] Before shipping
>
> 1. Reproduce the problem.
> 2. Make the smallest useful change.
> 3. Check the result and share the evidence.

## Timeline

Use a timeline for events in order.

> [!TIMELINE] A fictional release
>
> - **Monday:** Reproduce the bug.
> - **Tuesday:** Review the fix.
> - **Wednesday:** Ship and monitor.

## Table

Use a table when the reader needs to compare details across options.

> [!TABLE] Choosing a format
>
> | Format | Best for | Example |
> | --- | --- | --- |
> | Steps | A procedure | How to reproduce a bug |
> | Timeline | Events over time | A release history |
> | Table | Comparing details | Options and trade-offs |

## Chart

Use a text chart for a small set of values. Include the numbers so the meaning doesn't depend on the bars alone.

> [!CHART] Fictional build times in seconds
>
> ```text
> Before  ████████████  60 s
> After   ████████      40 s
> ```
>
> The example build takes 20 seconds less after the change.

## Quote

> [!QUOTE] A thought on debugging
>
> The first explanation is a hypothesis. The next step is to test it.
>
> — A fictional engineer

## Terminal

> [!TERMINAL] A shell session
>
> ```text
> $ npm test
> ✓ 12 tests passed
> ```

## Changelog

> [!CHANGELOG] Version 1.2
>
> - Added: a search shortcut.
> - Changed: clearer error messages.
> - Fixed: an empty result state.

## Decision

> [!DECISION] Where to store drafts
>
> - **Markdown files** — easy to review with the code.
> - A database — useful when multiple people need an editor.

## Chat

> [!CHAT] Review notes
>
> - Reviewer: Can we reproduce the failure?
> - Author: Yes. The test now includes the failing input.

## Environment

> [!ENV] Local settings
>
> ```text
> API_URL=http://localhost:3000
> LOG_LEVEL=info
> ```

## Endpoint

> [!ENDPOINT] Get an article
>
> `GET /api/articles/:slug`
>
> | Parameter | Meaning |
> | --- | --- |
> | slug | The article identifier |

## Keys

> [!KEYS] Shortcuts
>
> - `⌘ K`: open search
> - `Esc`: close search

## FAQ

> [!FAQ] About these examples
>
> **Are the numbers real?** No. The values on this page are illustrative.
>
> **Do figures need JavaScript?** No. They render when the article is built.

## Flow

> [!FLOW] Request path
>
> Browser → Router → Handler → Response

## Tree

> [!TREE] Project files
>
> - src
>   - components
>   - content
>     - articles

## Board

> [!BOARD] Release work
>
> - **Now**
>   - Review the fix
> - **Next**
>   - Test the release
> - **Later**
>   - Write the follow-up

## Stat

> [!STAT] A fictional week
>
> - **12** reviews
> - **8** fixes
> - **3** releases

## Spec

> [!SPEC] Article page
>
> - Format: Markdown
> - Output: Static HTML
> - Theme: Follows the site

## Check

> [!CHECK] Ready to ship
>
> - [x] Reproduce the issue
> - [x] Review the change
> - [ ] Monitor the release

## Diff

> [!DIFF] Package contents
>
> - Added: one focused test
> - Removed: an unused helper
> - Kept: the existing API

## Compare

> [!COMPARE] Storage options
>
> | | File | Database |
> | --- | --- | --- |
> | Version control | Yes | Requires export |
> | Concurrent editing | Limited | Yes |

## Rank

The bars are generated from the values in the list.

> [!RANK] Fictional page views
>
> - Articles: 120
> - About: 60
> - Talks: 30

## Meter

> [!METER] Example progress
>
> 75% of the checklist complete

## Sparkline

> [!SPARK] Fictional daily reads
>
> 2 4 3 6 5 8 7

## Waffle

> [!WAFFLE] Example coverage
>
> 73% of the cases checked
