---
idx: 13
title: "In the AI Era, Code Is Cheap. Reputation Isn’t."
date: "2026-03-04T21:01:29Z"
slug: "in-the-ai-era-code-is-cheap-reputation-isnt-3482"
tags: ["ai", "opensource", "programming", "software"]
excerpt: "AI makes open source contribution mechanically easy but reputationally hard. As agents flood repos with PRs, reputation becomes the thing that scales."
draft: false
featured: false
canonicalUrl: "https://abcdev.netlify.app/in-the-ai-era-code-is-cheap-reputation-isnt-3482"
devtoUrl: "https://dev.to/kaleman15/in-the-ai-era-code-is-cheap-reputation-isnt-3482"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fm0b25t9rnk2hseb0o8qx.png"
---

In the era of AI it's easier than ever to be an Open Source contributor!

But, at the same time, and quite paradoxically, it's harder than ever.

Why? Because it's now *mechanically easier, but reputationally harder*

Previously, you competed against other incredibly smart volunteers, or maybe against employed developers that contributed their expertise and free time to open source, or against newcomers. Now, you compete against all of that and an army of AI agents generating pull requests, issues, refactors and vulnerability reports faster than what any human can do.

It's pretty tempting. Using an LLM can reduce significantly the cognitive work you have to do to understand a codebase, and even to produce a valuable change request. Things that were previously "very hard" to do are now a few prompts away, and that lowered the entry barrier for contributions, which is great! But also created a massive increase in volume, which is flooding repositories.

What's the problem? 
*Maintainer capacity did not increase*
*Review cost did not decrease*

These two truths have already led maintainer to resort to drastic measures, like what happened with `curl`:

{% embed https://daniel.haxx.se/blog/2025/07/14/death-by-a-thousand-slops/ %}

So, how do you become a valuable Open Source contributor in the era of infinite code generation? Here are a few tips learned from dealing with a large volume of contributions:

## 1. Think. Then think again

AI can produce great code, but it can also produce the worst code ever seen by the humanity. This depends a lot on:

- The _prompt_ that you use
- The _quality_ of the LLM
- The _context_ being shared

And the most important one:
- Your own coding abilities.

Why do you need to know how to code before using LLMs to contribute to open source?

Well, *because an LLM cannot know everything.*
For example, we had a PR that attempted to change this:

Previous:
```typescript
		} catch (error) {
			console.error('Some error:', error);
		}
```
After
```typescript
		} catch (error) {
			logger.error('Some error:', error);
		}
```

You would say: that is a valid change, we want to use `logger` instead of `console`! What's the problem?

The problem was that the LLM didn't know (and didn't check, cause it wasn't asked to) that we recently changed the typings on our `logger` instances, rendering the change invalid.

What a valid change would have looked like:

```typescript
		} catch (err) {
			logger.error({ msg: 'Some error', err });
		}
```

But, the LLM didn't know this, and it would have required quite some context for it to know. Good LLMs (Claude, Codex, etc) would have caught, but others would not, unless you asked them. How would you ask something that you didn't know? There's where your coding abilities enter into play.

Here's the key point: *You cannot prompt what you don't know exists*

Someone that wants to be a contributor doesn't trust blindly on what the LLM produces. Knows how to use the tooling (typecheck, in this case) to catch those issues, reads the code to understand current conventions, caveats, etc.
For this programmers, *LLMs become a powerful tool*, cause it helps you with the mechanical task of coding and gives you enough time to think.

This also protects your reputation. If maintainers see a pattern of low-signal PRs from you, they’ll eventually stop reviewing them. Or worse.

LLMs make contribution faster, but they don’t replace your brain unless you let them.

## 2. Respect volume. Review is not free.

You are happy. We're also happy that you want to contribute to open source. It's a noble endeavor and it's something that helps the repository to be safer & you to be better. It's a win-win!

But, maintainers have:
- Limited capacity. 
- Limited time. 
- _Limited patience._

We understand, you are happy you created your new PR, and we understand the joy in you of doing that. We've all being there. You want, for sure, your PR to be merged so you can say with honor: "I contributed to X!"

But, be reasonable:

- The cost of opening a PR is now near zero.
- The cost of *reviewing* it is not.

This asymmetry is the real tension of the AI era.

If you:

- comment “please review” repeatedly,
- ping maintainers aggressively,
- demand merging timelines,

You’re increasing the cognitive cost of your contribution. Even if your PR is valid.

And here’s the harsh truth:

*Maintainers are human.*

If interacting with you feels expensive, they may subconsciously deprioritize your work. That means fewer reviews, fewer merges, fewer release notes mentions.

This is specially important when you use LLMs or Agents as they are fast, way faster than humans, so you could end up doing 100 PRs that you think are valid, and maybe they are! But if the maintainers don't have the capacity to review them all, they just won't.

That's the definition of a DoS (Denial of Service): you send more requests than what the server (maintainers) can process.


## 3. Quality that doesn't cut corners (pls don't sue me Wendy's)

Maintainer capacity is low. We closed around 700 issues (stale, invalid, fixed) in the past month, but at the same time, we received 300 new issues. Some of those issues were valid, some of them were not. The problem is we don't know beforehand, *we have to check them all*. You cannot trust an LLM to confirm if something is slop... cause the check may be slop too!

Related link, `curl` fighting against AI slop vulnerability reports:

[HackerOne Curl report](https://hackerone.com/reports/3516186)

As you see, maintainers won't be happy if you waste their time, cause they have stuff to do. The link above, as well as this beautiful list

{% embed https://gist.github.com/bagder/07f7581f6e3d78ef37dfbfc81fd1d1cd %}

have something in common: they look legit, until they don't. However, for realising something is slop you have to check manually, and that is time/effort wasted.

So you have to be human, respect the times maintainers have and respect their work. How you do that? *Helping the maintainers reduce the cost of reviewing your code*:

Before submitting:

- Did you reproduce the issue yourself?
- Did you run CI locally?
- Did you include screenshots for UI changes?
- Did you provide benchmarks for performance claims?
- Did you include a PoC for security reports?
- Did you check if a feature request already exists?

If you claim a performance improvement, *show numbers*.
If you fix a bug, *explain the root cause*.
If you propose a feature, *ask first*.

High quality contributions get reviewed faster.
Low signal contributions accumulate.

In the AI era, *reputation compounds*. If maintainers can trust you, your PRs will be reviewed faster, and you will feel happier. Win-win!

## 4. Bundle trivial changes.

Typos happen. Smol mistakes happen. For example 

Before:
```typescript
		if (!sub) {
			throw new Error('subsciption not found');
		}
```

After
```typescript
		if (!sub) {
			throw new Error('subscription not found');
		}
```

Do you spot the bug? Yep, a missing `r` on `subscription`. The contribution is valid, yes, we want to write correct words in english.

Does it deserve a PR? Not by itself, maybe if you combine a few more. Think if you find 10 of those misspellings. What's easier for maintainers? 1 PR with 10 changes or 10 PRs with 1 change? Hehe.

*If you were the maintainer, what would you prefer?*

Every PR has overhead: CI runs, notifications, review time, merge time, mental context switch, etc. Reduce the overhead by batching trivial work.

AI can find an enormous list of fixes like this in a codebase, and if you use an agent like Claude or Clawd you can tell "Hey for each issue create a PR" and then become the most hated contributor on the project :(

Don't do that. Please. Be mindful. *Be human*.

## LLMs are fun, but human work is better.

We're on the AI era, we cannot fight AIs anymore, they're here to stay. What we can fight is how we use them.

For GSoC for example, we value human contributions. That's the point of the program: more humans converting to open source contributors!

We need new generations of maintainers, of smart people that will use LLMs wisely. You can do amazing stuff with them if you use them properly, but nothing will replace your ability to do amazing stuff as a human. You have to remember that.

It's easier to contribute, but harder to stand out from the crowd.
Reputation matters.
Trust is earned.
You build it by doing good work.


As a final note, this is pretty much personal experience. Some projects may have different rules. Some may like to receive 1000 PRs a day (?) idk.

But, the main point is: AI is not human, but maintainers and contributors are. So remember that.

Welcome to Open Source!

If u want to read more:
{% embed https://www.jeffgeerling.com/blog/2026/ai-is-destroying-open-source/ %}




