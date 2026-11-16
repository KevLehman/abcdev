---
idx: 30
title: "You don't have to let AI think for you"
date: 2026-11-16
slug: "you-dont-have-to-let-ai-think-for-you"
tags: ["ai", "learning", "career"]
excerpt: "LLMs can give us answers in seconds. We can still make room for curiosity, judgment and the satisfaction of figuring things out."
draft: false
unlisted: false
featured: false
devtoUrl: "https://dev.to/kaleman15/you-dont-have-to-let-ai-think-for-you-55k"
featuredImage: "../../assets/images/ai-thinking-cover.webp"
---

You can open an LLM, describe a problem, and have a plausible answer before you've finished thinking about it. It can draft an email, explain a concept, suggest a fix for a bug, or give you a plan for a difficult conversation.

That's useful. It's also a little strange. When an answer is always a prompt away, it's easy to reach for one before you've had a chance to decide what you think.

And I know, we've heard something like this before. When Stack Overflow was on the rise, programmers got the same advice: "Don't just copy and paste the answer. Understand it." Why was that important then, and why does it sometimes seem forgotten now?

I've written about [what happens when developers produce code they don't understand](/the-future-after-ai-2767/). But this goes beyond programming. What happens when we ask a model to organize every thought, settle every uncertainty, and fill every quiet moment with an answer?

I don't think we need to stop using AI. I think we can get better at deciding **which parts of a problem we want to work through ourselves**, and where a model can help us go further.

## Finishing the task isn't the same as learning

Imagine you're trying to understand why a database query is slow. You paste it into an LLM, it suggests an index, and the query gets faster. That's a good outcome. If you were trying to fix an urgent issue, you might be done.

But if you want to understand what happened, you're far from done. There are a bunch of questions you may now have: What can you explain or do the next time the query is different? Why is an index a good solution? What other options are available? Could you use an existing index?

This distinction shows up in a [2025 field experiment with high school math students in Turkey](https://www.pnas.org/doi/10.1073/pnas.2422633122). Students who had access to a GPT-4-based assistant performed better during practice, but the group using a more open-ended version performed worse on a subsequent exam without AI than students who practiced with textbooks and notes. A separate version, designed to give teacher-provided hints and avoid giving away answers, largely mitigated that difference.

{% embed https://www.pnas.org/doi/10.1073/pnas.2422633122 %}

That's one school, one subject, and a short-term result from a particular setup. It doesn't prove that using a chatbot makes everyone worse at thinking. Well, I mean, sometimes chatbots can drive you crazy, especially the customer support ones. But the study does suggest that **getting through practice and learning from it are different outcomes**.

There's encouraging evidence too. In a [2025 study of a Harvard physics course](https://doi.org/10.1038/s41598-025-97652-6), students who used a specially designed AI tutor scored higher on immediate post-lesson tests than students taught the same material in an active-learning classroom. The tutor guided students through problems instead of simply giving them answers. To me, that's an example of what *augmenting* human abilities can look like.

{% embed https://doi.org/10.1038/s41598-025-97652-6 %}

I like what these results leave open: AI can help us learn. It can help us get better.

But how?

## Make a first attempt

![A person draws a branching path from a question toward an idea and an experiment, with a laptop nearby.](/images/ai-thinking-first-attempt.webp)

Before asking for an answer, try to describe the problem in your own words. You don't need a complete solution. Write down what you know, what you suspect, and what you can't explain yet.

For the slow query, that might be: “I think the database is scanning too many rows. I don't know whether an index would help, or which columns it should include.” Now you have something to investigate. You can ask the model to challenge that guess, explain the query plan, or point you toward the documentation. Then check its suggestions against the actual plan and measurements. Even if you're wrong (or very wrong), you can still learn something.

This isn't a rule that says you have to struggle alone for an hour before you're allowed to ask for help. Sometimes you don't have the background to make a useful guess, and asking for an explanation is a perfectly good first step. The point is to notice when you're trying to learn and give yourself a chance to participate in the work.

You don't have to do this every time, either. If you're in a rush or fixing a simple problem, you can leave the learning for later, or skip it altogether.

## Ask for help that leaves you something to do

If you're learning a subject, try asking for a hint instead of the full solution. Or explain your reasoning and ask the model where it might break. You can ask it to quiz you, give you a small example, or offer a counterexample to your idea.

For example:

> I'm learning how database indexes work. Here's my guess about why this query is slow. Ask me one question at a time and give me a hint if I'm stuck. Don't give me the full answer yet.

There are also skills that get an LLM to ask you questions. Matt Pocock's `/grill-me`, for example, interviews you to help clarify a plan or idea. His [`/teach` skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md) is aimed at learning: it creates lessons and keeps track of your progress.

{% embed https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md %}

Then try another problem without looking at the conversation. If you can't explain the idea yet, that's useful information, not a failure. Go back, ask a better question, and try again. A chatbot can still give a bad hint or an incorrect explanation, so check important details against documentation, a working example, or someone who knows the subject. What you learn can help you ask better questions and make better use of the answers.

## Keep your judgment in the loop

![A person uses a magnifying glass to compare a shape on a laptop with a physical object.](/images/ai-thinking-check-evidence.webp)

Thinking isn't only producing an answer from memory. It can also mean asking what evidence would change your mind, comparing options, noticing what's missing, and deciding whether a result fits the situation.

A model can help with that. Ask it for assumptions, alternatives, or ways an idea could fail. But don't treat a confident explanation as proof. An AI-generated citation needs to lead to a real source that supports the claim. A suggested fix needs a test that could actually fail. A plan for a conversation needs to account for the person you know, not just the description you typed into a prompt.

In [Proof Driven Development](/proof-driven-development/), I wrote about why a proof is only as useful as the property being checked. The same idea applies here: even when a model helps you evaluate an answer, you still need to ask whether you're checking the right thing, or if the model is actually answering what you need.

It's easy to treat an LLM's response as authoritative, especially when it sounds confident about a subject we don't know well. But a confident answer can still be wrong. That's true for people, and it's true for LLMs too.

Sometimes that means getting another person involved. A colleague might know a constraint that isn't in the ticket. A friend might hear something in your story that you left out of the prompt. You can use an LLM to prepare for those conversations, but the conversation itself can give you context no model was given.

Remember, your brain has a good context window too. Use it.

## Leave space for your own curiosity

Not every question needs an instant answer. Sometimes it's worth following a thought for a while: read the article instead of only its summary, try the recipe, sketch the idea badly, or take a walk and see what comes to mind.

Those aren't productivity rules. You don't owe anyone an AI-free hobby. The point is that understanding something, making something, or changing your mind can be enjoyable in its own right. We can use a tool to get past the parts we don't care about and still keep the parts that make an activity meaningful to us.

And when you are tired, under pressure, or dealing with a task outside your expertise, using more help is fine. Time and energy aren't distributed equally. The goal isn't to prove that you can do everything unaided; it's to make a deliberate choice when you have one.

An LLM can offer a starting point, explain something in a different way, or help us find a mistake. It can make it easier to explore a question we wouldn't have had the time or confidence to approach alone.

What we want, as humans, is the future where we get *augmented* by AI, not the one where we end up serving an AI overlord cause we don't know how to add or subtract anymore.

Keep curious.
