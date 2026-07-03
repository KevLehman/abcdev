---
idx: 17
title: "Gotta Earn 'Em All: The Gym Badges of Agentic Engineering (Part 2)"
date: "2026-07-03T02:35:20Z"
slug: "gotta-earn-em-all-the-gym-badges-of-agentic-engineering-part-2-5a11"
tags: ["ai", "agents", "programming", "career"]
excerpt: "Last time we earned four badges: bedrock, context, scoped speed, and the patience to garden instead..."
draft: false
featured: false
canonicalUrl: "https://abcdev.netlify.app/gotta-earn-em-all-the-gym-badges-of-agentic-engineering-part-2-5a11"
devtoUrl: "https://dev.to/kaleman15/gotta-earn-em-all-the-gym-badges-of-agentic-engineering-part-2-5a11"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fy0qtcf1i8pnaxof99enq.webp"
---

Last time we earned four badges: bedrock, context, scoped speed, and the patience to garden instead of shaking a vending machine. If you missed it, it's linked above. The guard at the gate hasn't moved. But you did.

Quick refresher if you're just walking in: by *"agentic engineering"* I mean using AI agents like Claude Code or Copilot to build real software, not just tab-complete. And fair warning, one of today's badges comes with receipts. 211 million lines of code worth.

The first four gyms give you the basics. Useful! But nobody becomes Champion by learning just the basics. Past Celadon the game changes: it stops being about doing the work and starts being about *not getting fooled by it.*

Let's finish this.

![Nintendo Pokemon Fire Red Koga Battle](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/fncif7hc2wi0gcfa8jz2.png)

## Badge 5: Soul Badge: learn to taste poison

Koga. Poison type. His gym is a maze of invisible walls, so you spend twenty minutes walking face-first into nothing while ninjas watch you. Foreshadowing.

This might be THE badge of the agent era, and the hardest to teach. Not spotting code that's *wrong*. Spotting code that's wrong while looking completely, beautifully right.

```javascript
// looks done. runs. passes the demo.
users.forEach(async (user) => {
  await sendNotification(user);
});
console.log("All notifications sent!");
```

```javascript
// what actually waits
for (const user of users) {
  await sendNotification(user);
}
console.log("All notifications sent!");
```

Every line in the first block is real, and the 3-user demo works. But `forEach` ignores your `await`: the log prints before a single notification goes out, and if one fails, the error evaporates into the void. Nothing is broken enough to fail. Everything is broken enough to hurt you in two weeks.

That's what poison tastes like. Not bitter. Slightly, *slightly* off.

And you can't outsource the taste test: asking an LLM "is this slop?" can produce slop in the answer. Tasting is a human skill, and you earn it by having eaten some poison before. (Hello again, Badge 1.)

If you can't tell legit from slightly-off, the agent is driving and you're asleep in the passenger seat. Don't offload your life to the agents. Control them. You are the human in charge.


![Nintendo Pokemon Fire Red Sabrina Battle](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/ka4e4viterojmwimjfeg.png)


## Badge 6: Marsh Badge: it's not telepathy

At some point the agent finishes your thought, matches your style, and your brain quietly files it under "understands me."

It doesn't. What actually happens when you get good is way less mystical: **you build a mental model of how it screws up.** It invents APIs with total confidence. It knows nothing newer than its training. And it will happily agree with a wrong premise if you say it like you mean it:

```plaintext
// what most people send
"since the bug is in the cache layer, fix the cache invalidation"
```

```plaintext
// what you could be doing
"users report stale data after profile updates.
here's the request flow and the cache config.
where would YOU look first, and why?"
```

State it with enough conviction and the agent will find you a bug in the cache, whether one lives there or not. Ask it to reason first and it suddenly can.

Prompting is talking to a very smart coworker with amnesia about your project and a habit of bluffing. Internalize that and half your prompts fix themselves for free.

There's plenty of "skills" that would help you on this matter. A few examples:

https://github.com/multica-ai/andrej-karpathy-skills


{% embed https://claude.com/plugins/superpowers %}


Use them. They're not magic, they're frameworks. You can still produce bad things with them. But they'll help you not to shoot yourself in the foot too frequently.


![Nintendo Pokemon Fire Red Blaine Battle](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/35pns2oorr8xhll7ol6c.png)


## Badge 7: Volcano Badge: the fire doesn't care who wrote the code

Blaine makes you answer quiz questions before he'll even battle you. Which is just debugging with extra steps: you answer the riddles, then you get the fight.

Generating code is the tutorial. This badge is everything *after* it ships, when the thing the agent wrote is live and gently combusting at 2 AM. No clever prompt saves you here. You need logs you can actually read. Traces. The hard-won knowledge that one container's JSON log file can quietly eat a whole disk while you sleep (don't ask how I know. ok, ask, it was bad).

Unlike the other badges, this one has a concrete training regime:

- **Make your logs readable before you need them.** Structured logs with request IDs, not `console.log("here 2")`. Future-you at 2 AM is a dumber person. Write for him.
- **Learn one tracing tool.** Any. "Where did this request die" should be a query, not a vibe.
- **Read your own logs cold.** Trace one request end to end on a normal day. If you can't follow it when nothing's broken, you have zero chance when everything is.
- **Treat your agent as a coworker.** Share with it all the context you would share with a human: stack traces, logs, screenshots, etc. Anything that it can use to understand and help you investigate. That's very useful.

This also means you should *know your product* even if you vibe coded it. If you don't, then when the fire happens and Claude is down (and that happens very often, recently) you will be alone with your thoughts, and with some code that you've never seen in your life...


![Nintendo Pokemon Fire Red Giovanni Battle](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/nqbj6yalhevc4jx83y9n.png)


## Badge 8: Earth Badge: it's your name on the commit

I said I wasn't explaining this one until we got here, so: Giovanni isn't just the eighth gym leader. He's the **boss of Team Rocket.** You spend the whole game dismantling his operation, and the final badge, the one the guard is waiting for, gets handed to you by the villain himself.

Kid-me thought that was a cool twist. Adult-me sees what the twist is actually saying. Think about what Team Rocket *is*: they don't raise Pokémon, they steal them. Their entire philosophy is getting the power without doing the training. And Giovanni is living proof it works: he's rich, he's feared, he runs a whole city. The game puts him, of all people, between you and the League. The final obstacle isn't a stronger trainer. It's the successful guy offering you his way of doing things.

That's why I call it a temptation. The final boss of agentic engineering isn't a gnarly bug. It's the shortcut philosophy, and it *visibly works*, at least at first. Let the agent's judgment quietly replace yours. Ship volume because merging feels like progress. Paste 200 lines you didn't read because it looked right and it was late. Shipping unread agent output is stealing Pokémon instead of training them: same power on paper, none of it yours.

And before you tell me this is a "skill issue" that only happens to juniors: the industry is drifting into it *at scale*, and we have receipts. GitClear analyzed 211 million changed lines of code across five years. Duplicated code blocks jumped 8x in a single year. Copy/pasted lines exceeded refactored ("moved") lines for the first time in the dataset's history. Churn, the code you rewrite within two weeks of committing it because it wasn't right the first time, roughly doubled from its pre-AI baseline. And Google's own DORA report found delivery stability dropped 7.2% as AI adoption went up.

You can watch the same movie at a single company. Spotify's VP of Engineering recently shared that they ship 4,500 production deploys a day, with 73% of PRs now AI-assisted. Genuinely impressive numbers. Meanwhile, their own community forums are an endless scroll of "the app gets slower and worse with every update," and the most viral reaction to those 4,500 deploys was someone asking what in the hell they're all *for*, since the product barely feels different. I'm not saying the AI-assisted PRs caused the complaints, that would be lazy. I'm saying throughput went vertical and perceived quality didn't follow, and that's a problem.

Sources, so you can check me. The 211M lines analysis:


{% embed https://www.gitclear.com/ai_assistant_code_quality_2025_research %}


DORA on delivery stability:


{% embed https://dora.dev/research/2024/dora-report/ %}


Spotify's 4,500 deploys/day and 73% AI-assisted PRs + reaction:


{% embed https://x.com/sporadica/status/2071817938076860432 %}


Everyone is shipping faster. What's shipping is not clearly getting better. Nobody decided this. Millions of developers drifted into it, one skipped review at a time. That's what makes it the boss fight.

The annoying fact that keeps you grounded: **the agent doesn't own the PR. You do.** When it breaks, nobody opens a ticket against the model. Code is cheap now. Your name isn't.

## Eight badges. Now what?

The gate isn't the end. It's a new beginning. As everything in life, once you reached the summit, you realize it was one of many...
