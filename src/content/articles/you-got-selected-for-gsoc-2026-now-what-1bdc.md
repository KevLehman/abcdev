---
idx: 14
title: "You got selected for GSoC 2026, now what?"
date: "2026-05-04T04:35:06Z"
slug: "you-got-selected-for-gsoc-2026-now-what-1bdc"
tags: ["opensource", "gsoc", "software", "webdev"]
excerpt: "Accepted into GSoC 2026? Here is how to make the most of it: what mentors actually expect, how to work in the open, and how not to waste a rare seat."
draft: false
featured: false
canonicalUrl: "https://abcdev.netlify.app/you-got-selected-for-gsoc-2026-now-what-1bdc"
devtoUrl: "https://dev.to/kaleman15/you-got-selected-for-gsoc-2026-now-what-1bdc"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzcem945ddycp6hv28ln0.png"
---

So your inbox lit up yesterday with the email. The proposal worked, the interviews worked, the late-night drafts worked. Take a moment, breathe, tell your family, post the screenshot. You earned it 🎉
Now, the actual fun part begins.

GSoC is, at its core, a few months of getting paid to learn from people who have spent years figuring out how to build software that thousands (sometimes millions) of strangers depend on. Think of it as an internship, but instead of a single company, your "office" is the entire open source world, and your "coworkers" are engineers who chose to spend their free time making things better for everyone. That's a rare seat at the table. Don't waste it.

Here are a few things to keep in mind so you make the most of it.

## What a mentor looks for from you

### They want to mentor, not babysit.

Mentors signed up to guide you, answer the hard questions, and unblock you when the codebase fights back. What they did not sign up for is reading the README on your behalf. The heavy lifting, exploring the codebase, running it locally, breaking it, fixing it, writing code that smells like the rest of the repo, that's on you. 

> A good rule: if you can find the answer in 30 minutes of digging, dig. If you've dug for two hours and you're more confused than when you started, ping them.

> Note 2: at Rocket.Chat, we have an internal meme called `:call-the-police:` that would fit perfectly above. Sadly, due to GDPR and other international laws, I cannot share above. End of the note.

### Honesty is everything.

LLMs are great at giving you _an answer_. They're not great at giving you the answer for this specific repo, with this specific history, with that one weird workaround that's there because of a bug from 2019 nobody wants to revisit. When you step into that kind of fog, just say so. **Mentors respect "I don't get why this is here" way more than a confident wrong guess**. That said, don't ask for permission to breathe. There's a middle ground between "I'm stuck on every line" and "I haven't said anything in two weeks", and that's where you want to live.

### Let git do some of the talking.

In a lot of open source repos, the git history is the real diary of the project. Match the style: if they squash, you squash; if they write essays in commit messages, you do too. **Use commits as a steady drumbeat of progress, and save your mentor's inbox for the moments that actually need a human**. Adding a translation? That's a commit. Untangling a nasty bug and finding a creative fix? That's worth a "hey, look at this" message.

## What you can ask from your mentor

### Treat them like human documentation.

Mentors are walking archives. They know why a function is named weirdly, which refactor everyone is afraid to touch, and that one PR from 2021 that explains everything. Tap into that, but don't drain the well. Try to find the answer yourself first, give it a responsible amount of time, and if you're still spinning, ask. **The deadline is fixed**, and running in circles is the most expensive thing you can do with your summer.

### Ask about the politics the proposal couldn't see.

When you wrote the proposal, you were looking at the project from the outside. Now you're inside, and you'll start spotting things: tech debt, weird coupling, decisions that look wrong until someone explains they're load-bearing. Bring those up. Sometimes the answer will be "yes, let's fix it as part of your work." Other times it'll be "leave it, that rabbit hole eats summers." _Both are useful answers, and only your mentor can give them to you._

## How to deliver on the proposal you already submitted

### The proposal is the map, not the territory.

You can't redraw it: the timeline, the deliverables, the headline goals are pretty much locked. But there's plenty of room inside the lines: code style, data shapes, security choices, edge cases, testing strategy. **Talk those out with your mentor early**. The earlier the better, because rework in week 10 hurts a lot more than rework in week 2.

### Once you've aligned, write a plan.

Break the proposal into weekly chunks, with a rough idea of what "done" looks like for each one. Then, and this is the important part, don't die by the plan. **Plans that are too tight have no room to absorb the inevitable**: a flu, a flaky test, a rabbit hole, that one dependency that decides to deprecate itself the week you need it. _If something can go wrong, it will go wrong_. Plan for it.

{% embed https://en.wikipedia.org/wiki/Murphy%27s_law %}

## When to use AI (and when to put your hands on the keyboard)

### Use AI to plan, not to know.

AI is genuinely great for getting your bearings in a new codebase: "what does this module do", "where is X handled", "give me a tour of this folder". The trap is that it'll happily give you confident answers that feel like understanding without actually being understanding. Always review the plan it gives you. Always question its assumptions. **At the end of the summer, nobody is evaluating the LLM. They're evaluating you**.

### Don't let AI eat your learning. 

![distracted boyfriend meme](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i78w9b46kc1qu3x8xstf.png)

This is the part I want you to take most seriously. GSoC is one of the safest spaces you'll ever get to make mistakes: you have a mentor, a stipend, and explicit permission to be a beginner. If you outsource the thinking to an LLM, you're trading the most valuable thing about the program for some saved keystrokes. Especially when it comes to understanding issues: sit with the problem first. Read the code. Form your own theory. Then maybe ask the AI for a second opinion. **AI already "knows" a lot of stuff. The whole point of the summer is: what do you know?**

> Balance check: we don't want you to feel we (or I) hate AI. AI is really cool and I'm very happy on using it. But as prof. Oak liked to say: "There's a place and time for everything". AI is cool, but the human using it is cooler.

### Maintainers can smell it.

I've reviewed enough PRs to tell you this isn't a cute claim: it's true. Code that's 100% AI and 0% human reads differently. The variable names are too generic, the comments explain things nobody would explain, the solution is technically correct but doesn't fit the shape of the codebase, the PR title and/or the code make no sense. Mentors will spot it. And we, the mentors, want you to learn, that's the whole point of GSoC. We want more maintainers for the future. You can be one of them if you use this opportunity.

![bro think he slick meme](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w2n0h7w190dphxhl9pv6.png)

## Wrapping up

You'll quickly realize getting selected was the easiest part. **This summer is the real thing**. Drive your own work, ask the smart questions, ship the small stuff, keep AI as a tool and not as a crutch and you'll come out the other side a much better engineer than the one who opened that email yesterday.

See you at the final eval 👋
