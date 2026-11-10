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
coverImage: "https://kevinaleman.com/images/formal-verification-cover.webp"
---

You ask an agent to implement a feature. It changes the code, adds tests, runs them and gives you a nice summary. Everything is green. Then you open the pull request and realize you still have to answer a question: **how do I know this actually works?**

The tests help. Reading the code helps. Asking another agent to review it can help too. But a passing test tells us what happened for the cases we ran, and a confident explanation is still an explanation. Neither automatically tells us what happens in all the cases we didn't think to check.

This is where formal verification gets interesting. Not because it's new, or because AI invented it, but because we're producing more code with tools that can also help us reason about it. Having a separate way to check some of the claims about that code sounds pretty useful.

## So, what are we verifying?

Before we can verify that software is correct, we have to say what *correct* means. That sounds obvious, but “the permissions should work” leaves a lot of room for interpretation. Who gets access? To what? What should happen when their membership is removed?

A **specification** makes the behavior we care about precise enough for a tool to reason about it. A **property** is a particular claim we want to check against that specification or the implementation. For example: a user without access to a document must not be allowed to delete it.

Formal verification uses mathematical reasoning to check whether the thing we're examining satisfies those properties, within the model and assumptions used for the check. Sometimes that thing is a design; sometimes it's an implementation or part of one. [NASA's introduction to formal methods](https://shemesh.larc.nasa.gov/fm/fm-what.html) gives a useful overview of the family of techniques behind this work.

{% embed https://shemesh.larc.nasa.gov/fm/fm-what.html %}

## How does a verifier check that?

The verifier needs two things: something to check and a precise rule to check it against. How it does that depends on the tool. A model checker can look at the possible states in a model and how the system moves between them. A program verifier can use a theorem prover to reason about the code and its specification.

For a function, you can describe what must be true before it runs and what it should guarantee afterward. Those are a **precondition** and a **postcondition**. You can also describe an **invariant**: a property that should remain true as the system changes. The [Dafny tutorial](https://dafny.org/v4.8.1/OnlineTutorial/guide) explains these with small examples.

{% embed https://dafny.org/v4.8.1/OnlineTutorial/guide %}

The verifier checks whether the rule holds for the behavior it's examining. Depending on the method, that might mean all the behaviors described by a model, or only a bounded set. If it finds a violation, it may show you a **counterexample**: an input or sequence of events that breaks the rule. That's useful because you get something specific to investigate.

But a failed verification doesn't always mean the code is wrong. Sometimes the tool can't establish the claim with the information it has, or can't complete the proof. You might need to give it more detail before it can tell you either way.

![A mechanical maze with illuminated paths branching through it, representing possible behaviors in a model.](/images/formal-verification-model.webp)

You don't have to verify an entire application to get value from this. A team can focus on a critical decision, algorithm or design where a mistake would be particularly expensive.

## Wait, don't we already have tests?

We do, and we still need them. A test runs the software with particular inputs and checks what happens. Formal verification reasons about properties over the behaviors covered by its model or proof. That can let us make a stronger claim about those properties than a handful of passing examples can.

But the proof has a boundary. If we've verified a function that makes a permission decision, we still need to know whether the rest of the application calls it when it should, and whether it gives the function the right information. A proof of the decision doesn't automatically establish either of those things.

[NIST makes this point when discussing formal methods and testing](https://csrc.nist.gov/Projects/automated-combinatorial-testing-for-software/autonomous-systems-assurance/formal-methods): assumptions used in a proof may not hold when the specification is connected to the implementation and its dependencies. Tests can help us check those connections and exercise the actual application.

![A small mechanism inside a glass enclosure, connected by pipes to a larger machine outside it.](/images/formal-verification-boundary.webp)

This is also why I'd be careful with “the software is verified.” Verified against *what*, and how much of it? Those questions are more useful than the label on its own.

## Where does AI fit in?

Writing specifications and proofs takes work. The verifier needs precise statements, and some properties need more guidance before the tool can establish them. That's a different skill from writing the implementation, and it's one reason this isn't something most of us add to every pull request.

An agent can help with parts of that work: discussing requirements, proposing a specification, writing an implementation and working through feedback from a verifier. The important part is that the verifier checks the formal claim according to its rules. We're not relying only on the agent telling us it got the answer right.

That's the idea that interested me in [Proof Driven Development](/proof-driven-development/). The agent helps produce the work, and a verification tool checks it against an agreed specification. I also [tried proving binary search with Dafny](/proving-binary-search-with-dafny/), which gave me a better appreciation for the amount of detail involved in stating and checking even a familiar algorithm.

But AI doesn't remove the need to review the specification. An agent can help surface missing questions, but it can miss requirements too. If the property never mentions revoked access, a proof of that property won't establish that revocation works. The code can follow the written rule perfectly and still miss what the product needs.

## Is this only for critical systems?

Formal methods are useful in critical systems, but the ideas aren't limited to them. In a [2015 paper on formal methods at AWS](https://www.amazon.science/publications/how-amazon-web-services-uses-formal-methods), the authors describe using a model checker on a DynamoDB design. It found a sequence of failures and recovery steps that could lead to data loss, after the team had already done extensive testing. They were checking a model of the design, not claiming that the whole service had been proved correct.

{% embed https://www.amazon.science/publications/how-amazon-web-services-uses-formal-methods %}

Most of us aren't building DynamoDB. But we do write permission checks, payment flows and other logic where the consequences of a missed case can be significant. Those are places where making a property explicit—and deciding how strongly we need to check it—is worth the discussion.

I don't think every feature needs a formal proof. But as agents make code easier to produce, we need to start thinking about stronger ways to prove the output. We cannot humanly verify everything the agent does, we weren't able to verify everything when we wrote it either, that's why bugs exists and will continue to exist.

The point is: can we take this concept to help us write _better_ software? That's on us.
