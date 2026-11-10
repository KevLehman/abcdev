---
idx: 28
title: "What does it mean to formally verify software?"
date: 2026-11-10
slug: "what-does-it-mean-to-formally-verify-software"
tags: ["softwareengineering", "programming", "ai"]
excerpt: "Formal verification checks software against precise properties. Here's how that works and why it matters when AI can write code faster than we can review it."
draft: false
unlisted: false
featured: false
coverImage: "https://kevinaleman.com/images/formal-verification-cover-illustrated.webp"
---

You ask an agent to implement a feature. It changes the code, adds tests, runs them and gives you a nice summary. Everything is green. Then you open the pull request and realize you still have to answer a question: **how do I know this actually works?**

The tests help. Reading the code helps. Asking another agent to review it can help too. But a passing test tells us what happened for the cases we ran, and a confident explanation is still an explanation. Neither automatically tells us what happens in all the cases we didn't think to check.

This is where formal verification gets interesting. Not because it's new, or because AI invented it, but because we're producing more code with tools that can also help us reason about it. Having a separate way to check some of the claims about that code sounds pretty useful.

## So, what are we verifying?

Before anything else, what's *correct*?. Well, as any experienced software developer would say, *it depends*. On what? Well, on you, or your product. *Correct* can mean a lot of things to different people, so before verifying something, we have to be sure that the behavior we're verifying is *the right one*.

For that, let me introduce you to some terms:

1. A **specification** makes the behavior we care about precise enough for a tool to reason about it.
2. A **property** is a particular claim we want to check against that specification or the implementation.

For example: "a user without access to a document must not be allowed to delete it". That contains both: the specification and the property. Now that we have this clear, we can start to verify stuff.

Formal verification uses mathematical reasoning to check whether the thing we're examining satisfies those properties, within the model and assumptions used for the check. Sometimes that "thing" is a design; sometimes it's an implementation; sometimes is an Jira message you received at 3am... Anyways, [NASA's introduction to formal methods](https://shemesh.larc.nasa.gov/fm/fm-what.html) gives a useful overview of the family of techniques behind this work.

{% embed https://shemesh.larc.nasa.gov/fm/fm-what.html %}

## How does a verifier check that?

The verifier needs two things: something to check and a precise rule to check it against. How it does that depends on the tool. A model checker can look at the possible states in a model and how the system moves between them. A program verifier can use a theorem prover to reason about the code and its specification.

For a function, you can describe what must be true before it runs and what it should guarantee afterward. Those are a **precondition** and a **postcondition**. You can also describe an **invariant**: a property that should remain true as the system changes. The [Dafny tutorial](https://dafny.org/v4.8.1/OnlineTutorial/guide) explains these with small examples.

{% embed https://dafny.org/v4.8.1/OnlineTutorial/guide %}

The verifier checks whether the rule holds for the behavior it's examining. Depending on the method, that might mean all the behaviors described by a model, or only a bounded set. If it finds a violation, it may show you a **counterexample**: an input or sequence of events that breaks the rule. That's useful because you get something specific to investigate.

But a failed verification doesn't always mean the code is wrong. Sometimes the tool can't establish the claim with the information it has, or can't complete the proof. You might need to give it more detail before it can tell you either way.

![A hand-drawn network of branching paths, representing possible behaviors in a model.](/images/formal-verification-model-illustrated.webp)

You don't have to verify an entire application to get value from this. A team can focus on a critical decision, algorithm or design where a mistake would be particularly expensive.

## Wait, don't we already have tests?

We do, and if you have a decent testing coverage, then you should be proud. Take a medal (not really). Now, since we already have, what can we gain from Formal Verification? Formal verification reasons about properties over the behaviors covered by its model or proof. That can let us make a stronger claim about those properties than a handful of passing examples can.

But the proof has a boundary. If we've verified a function that makes a permission decision, we still need to know whether the rest of the application calls it when it should, and whether it gives the function the right information. A proof of the decision doesn't automatically establish either of those things. (This may sound very familiar to what a unit test is, but trust me, it's different... a bit).

[NIST makes this point when discussing formal methods and testing](https://csrc.nist.gov/Projects/automated-combinatorial-testing-for-software/autonomous-systems-assurance/formal-methods): assumptions used in a proof may not hold when the specification is connected to the implementation and its dependencies. Tests can help us check those connections and exercise the actual application.

![A checked group of connected nodes inside a rectangle, with other nodes outside it.](/images/formal-verification-boundary-illustrated.webp)

_This is also why I'd be careful with “the software is verified.” Verified against *what*, and how much of it? Those questions are more useful than the label on its own._

## Where does AI fit in?

Writing specifications and proofs takes work. The verifier needs precise statements, and some properties need more guidance before the tool can establish them. That's a different skill from writing the implementation, and it's one reason this isn't something most of us add to every pull request. Just imagine if 5 years ago you had a Jira task for a feature, and then a sub task for unit tests, and then a sub task for a formal verification of your work... Workflows defined by the utterly deranged.

But now, we have agents! An agent can help with parts of that work: discussing requirements, proposing a specification, writing an implementation and working through feedback from a verifier. The important part is that the verifier checks the formal claim according to its rules. We're not relying only on the agent telling us it got the answer right.

That's the idea that interested me in [Proof Driven Development](/proof-driven-development/). The agent helps produce the work, and a verification tool checks it against an agreed specification. I also [tried proving binary search with Dafny](/proving-binary-search-with-dafny/), which gave me a better appreciation for the amount of detail involved in checking one damn function.

But, as everything humans do, Formal Verification would be as good as the people that define what *correct* means. An agent can help you understand a codebase, identify possible issues and ask you questions for scenarios you hadn't thought (sometimes even for scenarios that are only possible in 1 out of 200M universes...). If your property definition never mentions a key detail, or how a special behavior should behave, a proof generated by an agent won't add it magically to your work. The code can follow the written rules perfectly, and the agent may have wrote the most beautiful proof your eyes have seen, but if you didn't know all the details...

![Checked paths inside a circle, with another branch outside the boundary.](/images/formal-verification-missing-requirement-illustrated.webp)

## Is this only for critical systems?

Formal methods are useful in critical systems, but the ideas aren't limited to them. In a [2015 paper on formal methods at AWS](https://www.amazon.science/publications/how-amazon-web-services-uses-formal-methods), the authors describe using a model checker on a DynamoDB design. It found a sequence of failures and recovery steps that could lead to data loss, after the team had already done extensive testing. So there is some value!

{% embed https://www.amazon.science/publications/how-amazon-web-services-uses-formal-methods %}

Most of us aren't building DynamoDB. But we do write permission checks, payment flows and other logic where the consequences of a missed case can be significant. Those are places where making a property explicit—and deciding how strongly we need to check it—is worth the discussion.

I don't think every feature needs a formal proof. But as agents make code easier to produce, we need to start thinking about stronger ways to prove the output. We cannot humanly verify everything the agent does, we weren't able to verify everything when we wrote it either, that's why bugs exists and will continue to exist.

The point is: can we take this concept to help us write _better_ software? That's on us.
