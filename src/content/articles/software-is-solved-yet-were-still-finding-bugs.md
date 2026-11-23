---
idx: 31
title: "If software is solved, why do we keep finding bugs?"
date: 2026-11-18
slug: "software-is-solved-yet-were-still-finding-bugs"
tags: ["ai", "programming", "softwareengineering", "testing"]
excerpt: "Materialize found bugs by looking through old commits. A team building a C compiler found regressions as it went. A new bug report can mean either."
draft: true
unlisted: false
featured: false
---

<!-- IMAGE PLACEHOLDER — cover, 2:1. Raking peach light crosses a smooth blue sheet of handmade paper and reveals the tiny dents already pressed into it. Watercolor and colored pencil, no text or characters. -->

Sixteen Claude agents wrote a C compiler that could build Linux on x86. I would've guessed that meant it could compile the little bit of 16-bit code Linux needs to boot, too. [Nicholas Carlini explains what happened there](https://www.anthropic.com/research/building-c-compiler): the agents' compiler produced over 60 KB of startup code, but Linux only had room for 32 KB. Fortunately for the new C compiler, the old one was still around. GCC built the startup code small enough to fit.

{% embed https://www.anthropic.com/research/building-c-compiler %}

## When did the bug get there?

[Materialize](https://materialize.com/blog/finding-bugs-using-llms/) sent agents back through commits that had already landed. Across those reviews and its other searches, the team found hundreds of bugs its tests had missed. The backlog could grow without anybody shipping a line of new code.

{% embed https://materialize.com/blog/finding-bugs-using-llms/ %}

Carlini found bugs that really were new. Features and fixes in the compiler sometimes broke programs it used to compile. In the old Materialize commits, the search had changed. Here, the software had.

## What did the Linux build tell us?

Getting Linux to boot showed that the agents' compiler could handle most of the x86 build. It didn't show that the compiler could replace GCC for the startup code, because GCC was still doing that job. The 32 KB limit made the shortcoming easy to measure. Meeting it was another matter.

Other mistakes are harder for an agent to see. Carlini tracked down failures involving *pairs of files*. The kernel worked when the new compiler handled either file and GCC handled the other. It failed when the new compiler handled both. An agent testing the files one at a time could get two passes on the broken compiler. Nothing in either result would send it back to the code.

<!-- IMAGE PLACEHOLDER — inline, 2:1. Two translucent sheets of drafting paper, each with a single graphite arc. Where they overlap, the arcs form a dark, uneven seam. Watercolor and pencil, no labels or characters. -->

## What would convince me it's a bug?

At Materialize, Dennis Felsing caught an agent introducing the very bug it claimed to have reproduced. It had changed which path the program took. For some reports, Felsing had a simpler check: run the SQL query himself and see whether the database returned the wrong answer.

When a bug report lands on my next rewrite, I'll run the same input through both versions. If only the new one gets it wrong, I know where to start looking. If they agree, I still want to know what the answer should have been. The old version might have had the same bug all along.
