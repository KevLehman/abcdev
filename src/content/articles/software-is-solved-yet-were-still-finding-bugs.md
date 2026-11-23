---
idx: 31
title: "If software is solved, why do we keep finding bugs?"
date: 2026-11-18
slug: "software-is-solved-yet-were-still-finding-bugs"
tags: ["ai", "programming", "softwareengineering", "testing"]
excerpt: "Materialize found bugs by looking through old commits. A team building a C compiler found regressions as it went. A new bug report can mean either."
draft: false
unlisted: true
featured: false
featuredImage: "../../assets/images/bugs-raking-light.webp"
---

Sixteen Claude agents wrote a C compiler that could build Linux on x86. I would've guessed that meant it could compile the little bit of 16-bit code Linux needs to boot, too. [Nicholas Carlini explains what happened there](https://www.anthropic.com/research/building-c-compiler): the agents' compiler produced over 60 KB of startup code, but Linux only had room for 32 KB. Fortunately for the new C compiler, the old one was still around. GCC built the startup code small enough to fit and everyone was happy after, except for the agents.

{% embed https://www.anthropic.com/research/building-c-compiler %}

On a separate occasion, [Materialize](https://materialize.com/blog/finding-bugs-using-llms/) sent agents back through commits that had already landed, allegedly tested. Across those reviews and its other searches, the team found hundreds of bugs its tests had missed. But why?

{% embed https://materialize.com/blog/finding-bugs-using-llms/ %}

Carlini created something new, with bugs. Materialize tried to find bugs on existing code and found some. However, we keep hearing every now and then that "software has been solved" and that we're gonna lose our jobs in a few months, right?

## Is software _really_ solved?

Getting Linux to boot showed that the agents' compiler could handle most of the x86 build. It didn't show that the compiler could replace GCC for the startup code, because GCC was still doing that job. The 32 KB limit made the shortcoming easy to measure. Meeting it was another matter. This doesn't mean coding with agents is bad, or that agents that code are bad. LLMs are really powerful and very much capable of doing all of that.

That also doesn't mean GCC is perfect. The only perfect software is TempleOS.

But there's an interesting limitation. Think about this: suppose you want to learn how to bake a pizza, for the first time (been there). You get the materials, high-quality ones. And you get someone that helps you do it. Your output will be heavily influenced by the trainer if you have no prior experience. If the trainer uses a certain technique, you're very likely to use the same.

That tells us something about the _current_ state of models: they're not trained on _perfect_ code. We, humans, like to talk about how good the pre-AI software was, but the reality is that it was as buggy as it is right now. We cannot produce perfect code. So, it's expected that current agents training on imperfect code produce imperfect results.

> Not every past time was better

## Not every problem is in the training data

There's a 2nd layer of issues, also related to humans, that also affect the output of models: humans don't know what they want. Tell me, when was the last time you built a feature only to realize that a small *something* you did was not quite the thing your client expected? It happens. And it will continue happening. We keep adding things. Customers keep asking for changes. _Humans are never satisfied_.

So it's expected that an agent cannot produce perfect code that satisfies humans.

Think of a coffee machine. Mine (a Ninja Luxe, btw) has a bunch of presets for doing coffee. They're all trash (to me), but when I invite people over, they love it... That's not a machine's problem. That's a human's problem: we have different tastes, different preferences, etc. We're different.

That makes _solving_ software a difficult problem. It's like saying that because we have a bunch of machines that produce food we have solved it...

And that's not the only problem. There are some issues that are just hard to spot. Carlini, for example, tracked down failures involving *certain pairs of files*. The compiler worked for single files, but, when a pair of files was provided, the new compiler just broke apart. Why? Well, maybe the agent just tested its work with single files, which, if you ask me, is full AGI cause that's exactly what a regular developer would do. So, there could be issues the agent just doesn't think about, and the code it builds it's just not prepared for.

![The kernel boots when either file uses the new compiler and the other uses GCC, but fails when both use the new compiler.](/images/compiler-pair-outcomes.svg)

## Ok, so, is software solved?

Maybe not yet. But I don't think It won't be solved in the following years. There's still some "human" factor inside how AIs think that's limiting them. They're capable of great things, like [helping prove the Riemann hypothesis](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/), but they can also create some incredible ugly slop. But that depends a lot on the human, the setup, the harness, etc. There's still _too many_ factors that can affect a model's performance, one of them is the humans using it.

Some day, we'll be bathing in the sun while our AI does everything for us.

Just kidding. Some day we'll be forced to buy tokens for survive :ahhhhhh: and the only work available will be to apply WD-40 to the bot's joints.
