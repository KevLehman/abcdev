---
idx: 15
title: "Gotta Earn 'Em All: The Gym Badges of Agentic Engineering (Part 1)"
date: "2026-06-17T20:13:57Z"
slug: "gotta-earn-em-all-the-gym-badges-of-agentic-engineering-part-1-5bff"
tags: ["ai", "agents", "programming", "career"]
excerpt: "There's a guy who stands at the entrance to the Indigo Plateau and will not let you through. Level 80..."
draft: false
featured: false
canonicalUrl: "https://abcdev.netlify.app/gotta-earn-em-all-the-gym-badges-of-agentic-engineering-part-1-5bff"
devtoUrl: "https://dev.to/kaleman15/gotta-earn-em-all-the-gym-badges-of-agentic-engineering-part-1-5bff"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8dbl7p43l6racd5q6joi.png"
---

There's a guy who stands at the entrance to the Indigo Plateau and will not let you through. Level 80 Charizard? Doesn't care. Seven gym badges pinned to your jacket? Come back when it's eight. No matter what you do, he won't let you pass until you meet the prerequisites.

Kid-me thought he was the single most pointless NPC ever programmed. I wanted to go right to the action, not spending 5 hours to get all the badges. Replaying FireRed last month (the GOAT, don't @ me) I finally got what he's for. He isn't guarding the fun part. He's making sure that by the time you face the four people who can actually beat you, you've already survived the eight boring things that made you ready for them.

Which is, more or less, my entire complaint about how we're using agents right now.

Everybody wants to fight the Elite Four on day one. "I'll let the agent build the whole feature." "I'll let it refactor the repo while I grab a coffee." "I'll point Claude Code at the thing and vibe." And sometimes it works! Right up until it doesn't, and you genuinely cannot say *why* because there were eight gyms between you and that gate and you strolled past every one.

So here's the case, the way a Game Boy made it to me: before you're actually good with agents, there are badges to earn. Not tools to install, *things you have to know.* Let's go gym by gym.


![Nintendo Pokemon Fire Red Brock Battle](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kof97yqrvc9dgr53ha0s.png)

## Badge 1: Boulder Badge: rock before copilot

Brock. Rock type. The first gym. The place where you thought choosing charmander was a bad call (until you trained enough and it learned Metal Claw which helps a little bit).

This is the badge of knowing how to code *without* the agent holding your hand. The foundations.

I've said this before and I'll keep saying it until they revoke my keyboard: **you cannot prompt what you don't know exists.** If you don't know your project just changed a function's typings, you won't tell the agent, you won't catch it when it gets it wrong, and you'll merrily ship something that *looks* right and isn't. The agent didn't fail there. You showed up to the gym with no Pokémon.

You don't need to know *everything*. You need bedrock. Otherwise every badge after this one is built on sand and you're gonna have a bad time.


![Nintendo Pokemon Fire Red Misty Battle](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f6xzkd46wcpk757aj1jk.png)

## Badge 2: Cascade Badge: the agent only knows what you pour in

Water flows, context flows, you see where I'm going. An agent isn't psychic (we'll get to that gym), it knows *exactly* what's in its context window and nothing else. Not your repo's weird conventions. Not the thing your team decided in Slack last Tuesday. Not the landmine that lives rent-free in one senior dev's brain.

Look at these two and tell me they're getting the same result:

```plaintext
// what most people send
"fix the bug in the user evaluation"
```

```plaintext
// what you could be doing
"In src/users/evaluate.ts we hardcoded a company name to hit a deadline.
Now we ALSO need to exclude new users from company "bla",
WITHOUT touching how "fancy company" users get evaluated.
Here's the file, here's the test that has to stay green,
here's how we name things."
```

Same model. The first one is basically throwing a Poké Ball at a wall. The second one is, you know, *engineering.* Pour the context on purpose and everything downstream gets less cursed.

Don't make your agent drink from a puddle.

There's some cool skills that can make your agent "think" this way, but you have to think that way too, so both agent & you can work together on solving & creating.


![Nintendo Pokemon Fire Red LT Surge Battle](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/94wqmxb7jd54nkdgp4xp.png)

## Badge 3: Thunder Badge: fast is a trap

Here's what nobody warns you about: agents are *fast.* Stupid fast. Faster than you. Faster than me. Faster than anything likely. Issues that would take me a week to solve an agent can find a probable cause in minutes. And speed multiplies whatever you give it, your galaxy-brain ideas and your dumbest ones, at the exact same voltage.

I've ranted about this in open-source land: opening a PR now costs basically nothing, but *reviewing* one still costs a human their actual time and sanity. That gap is a denial-of-service attack wearing a trenchcoat. You tell the agent "do this for every file!!" and now there are 100 changes, some great, some radioactive, and you have to read all 100 because the agent will not tell you which is which. Congrats, you DoS'd yourself.

The badge here is learning to *not grab the lightning with both hands.* Small tasks. Bounded scope. One thing at a time. A fast wrong answer isn't a head start, it just got to being wrong sooner. :(


![Nintendo Pokemon Fire Red Erika Battle](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j333vj5pfhqhhb6jx8ce.png)

## Badge 4: Rainbow Badge: it's gardening, not a vending machine

People treat agents like a vending machine: insert prompt, slot opens, finished feature falls out. Nope. It's *gardening.* You plant a thing, you look at the weird mutant that grew, you prune the cursed branches, you re-prompt, you prune again. Repeat until it's a plant and not a crime scene.

The first output is never the deliverable. It's a sprout. "Good, keep this shape, but the data layer is wrong, redo that part" is the actual loop. The people who look like wizards with agents aren't great prompters, they're patient gardeners who aren't precious about yeeting a bad draft into the sun.

Plant small, prune often, be responsible for what your agent produces cause that's your personal image too.

## Halfway to the League

Four badges down. If you actually have these: bedrock, context, scoped speed, and the patience to garden instead of treating the agent like a vending machine, you're already ahead of most people loudly pretending to be good at this.

Learning is a journey. Enjoy it. Don't let agents & AI remove from you the better part of programming: you getting better at it.

Obviously, life is not Pokemon. You could perfectly bypass all of this and go straight into your terminal right now to get a "product". That's acceptable in some cases.

But... where's the fun in that?
