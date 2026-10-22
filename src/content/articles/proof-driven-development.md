---
idx: 22
title: "Proof Driven Development: can the agent prove it works?"
date: 2026-10-21
slug: "proof-driven-development"
tags: ["ai", "programming", "rust", "softwareengineering"]
excerpt: "Microsoft Research's PDD Kit checks generated Rust code against formal specifications. Here's what I'd borrow for JavaScript and our testing work at Rocket.Chat."
draft: false
unlisted: false
featured: false
coverImage: "https://kevinaleman.com/images/pdd-header.webp"
---

One of the problems with using agents is that you can ask them to implement something, add tests, run everything and explain why it works, and still end up with a bug. You can ask another agent to review the result, which helps, but then you have to check whether the review makes sense too. We've made producing code incredibly easy, and now we're trying to figure out how to keep up with checking all of it. Asking the same LLM “are you sure?” a few more times doesn't give us much of a guarantee.

So I found [this announcement from GitHub Next](https://x.com/GitHubNext/status/2112936525457740139) pretty interesting. Microsoft Research is working on **Proof Driven Development Kit**, or PDD Kit, which brings formal verification into the agent's development workflow. The idea is that we can ask for a mathematical proof that the implementation satisfies a specification, and have a separate verifier check that claim. What makes this interesting to me is that the correctness argument has to survive something more demanding than the agent's own explanation of why its code is correct.

{% embed https://x.com/GitHubNext/status/2112936525457740139 %}

## Ok, what are they doing?

According to the announcement, PDD Kit discusses the code with you, figures out what you're trying to achieve and proposes a formal specification. You review that specification, approve it, and the implementation gets checked against it using **Verus**, a verification tool for Rust. The demo follows a login flow from the initial intent to a verified pull request. It also integrates with [Chopin](https://githubnext.com/projects/chopin/), GitHub Next's collaborative planning environment, so the team can work through the plan together. Where formal proof isn't possible, the workflow uses tests and computer-use agents to check the behavior. The announced language support is Rust, and Verus adds syntax for specifications and proofs around the Rust code.

{% embed https://githubnext.com/projects/chopin/ %}

What I like here is that there's something outside the LLM checking the formal claim. The agent can propose an implementation, but it doesn't get to declare its own homework correct just because the explanation sounds convincing. The [Verus documentation](https://verus-lang.github.io/verus/guide/) describes this as static verification: checking that code satisfies the specified properties for all executions covered by the model, without adding runtime checks. Think about the amount of time we spend wondering whether there's some input we forgot to test. For properties we can express and verify this way, that's a much stronger guarantee. But there's a very important word in all of this: **specification**.

## This is where the questions matter

Imagine you're implementing session validation. You want users with valid sessions to access the application, and everyone else to be rejected. You ask the agent to implement the check, and it gives you something like this. I'm using JavaScript here to keep the example familiar; the announced formal verification support in PDD Kit is for Rust.

```javascript
function canUseSession(session, now) {
  return session.signatureValid && now < session.expiresAt;
}
```

Looks reasonable. A valid signature and a session that hasn't expired. You test a valid session, an expired session and an invalid signature. Everything passes. Then a user logs out, you mark the session as revoked, and... the function still accepts it. We never checked `session.revoked`. We could add a test for that. We should. But now imagine we had formally specified the function as: *Accept the session if and only if its signature is valid and it hasn't expired.* The implementation satisfies that rule. We could prove it and still have the exact same bug, because **we forgot revocation in the requirement too**.

This is exactly the kind of gap Chopin and PDD Kit are meant to help us catch. PDD Kit discusses the intended behavior before proposing a formal specification, and [Chopin gives the team a shared place to question the plan](https://githubnext.com/projects/chopin/) and resolve those decisions. For this example, that conversation should include: “Does logging out revoke the session immediately?”, “What happens at the exact expiration time?” and “Should every otherwise valid session be accepted?” The tools can help turn “make session validation work” into a set of explicit decisions, with the answers carried into the specification. That's a useful part of the workflow: **you don't have to arrive with a perfect specification already written.**

After working through those questions, the rule could become: *Accept the session if and only if its signature is valid, it hasn't been revoked, and the current time is strictly before its expiration time.* Now the expiration boundary is settled: at the exact expiration time, access is denied, so an implementation using `<=` would violate the specification. The “if and only if” also requires valid sessions to be accepted. Without that, an implementation returning `false` for everyone could satisfy a narrower rule that only requires invalid sessions to be rejected. Congrats, nobody can log in anymore. This is why the discussion and the proof belong together: the tools help us work out what we mean, then verification checks that the implementation follows what we agreed. The tools can still miss a requirement, but helping us uncover those requirements is part of their value.

![A meticulously built bridge matches its blueprint but ends on an isolated platform before reaching the opposite bank.](/images/pdd-wrong-specification.webp)

*Perfectly built according to the plan. Still doesn't get you across.*

## An admin, but whose admin?

For an application beyond Microsoft's login demo, I'd want to try this workflow on tenant permissions. Imagine you're building a SaaS application and an admin can delete documents. The agent checks whether the user is an active admin, and everything looks fine in your tests because every user and document in the fixtures belongs to the same company. Then someone passes a document ID from another company and discovers that being an admin was apparently a global achievement. Oops. The rule needs to connect the user's membership to the document's tenant. A simplified postcondition in Verus syntax could look like this, assuming those values are already available to the function:

```rust
ensures
    allowed == (
        active_member
        && is_admin
        && member_tenant == document_tenant
    ),
```

Here I'd want the agent to consider an active admin in the right tenant, an active admin in a different tenant, an inactive admin, and a regular member. That second case is the interesting one: the role is valid, but the relationship is wrong. A proof against this contract would have to cover different tenant IDs too, rather than only the company IDs someone happened to put in a test. We still need to establish that the application supplies the actual document tenant and the right membership record. If it passes the user's tenant ID for both arguments, the decision can follow this rule perfectly while the application still leaks access.

## Someone still has to know what to ask

I've said this before: **you cannot prompt what you don't know exists**. If you don't know sessions can be revoked, you probably won't notice that revocation is missing from the specification. This is also a research problem. Microsoft Research calls the translation from informal requirements to checkable specifications [intent formalization](https://www.microsoft.com/en-us/research/publication/intent-formalization-a-grand-challenge-for-reliable-coding-in-the-age-of-ai-agents/). Shuvendu Lahiri's article identifies validating those specifications as a central bottleneck. Someone still needs to establish whether the formal statement matches what the user meant.

{% embed https://www.microsoft.com/en-us/research/publication/intent-formalization-a-grand-challenge-for-reliable-coding-in-the-age-of-ai-agents/ %}

There's another detail in our session example: `signatureValid` is an input. The function doesn't verify a signature. Same with `now`: we give it a timestamp, and it trusts that value. A proof of this decision doesn't establish that the cryptography is correct, that the clock is right, or that every protected endpoint actually calls the function. Those need their own guarantees or checks. So when a PR says “verified”, I'd want to know what was verified. The session decision? The HTTP handler? The whole login flow? Which parts were proved, tested, or assumed? That's where PDD Kit's combination of formal and empirical verification makes sense to me. You can prove a decision follows a rule and still use integration tests to check that the application supplies the right inputs and calls it in the right places.

![An inspected mechanism sits inside a clear enclosure while its input pipes and an unreliable external valve remain outside.](/images/pdd-proof-boundary.webp)

*The proof covers what's inside the boundary. The inputs still have to come from somewhere.*

## How I'd apply this to JavaScript

I don't work in Rust, so Verus isn't something I can apply to my JavaScript projects. But I can borrow **PDD Kit's approach: agree on the contract before generating the implementation**. I'd use [Chopin](https://githubnext.com/projects/chopin/) for the shared plan, questions and decisions, with its MCP server connecting the coding agent. Then turn those agreed rules into unit and integration tests, use [fast-check](https://fast-check.dev/docs/introduction/why-property-based/) to exercise generated input combinations, and add browser checks for the user flow. For our session example, that means explicitly checking revocation, expiration boundaries and valid sessions being accepted. This doesn't give JavaScript the same formal guarantees, but it gives the agent concrete requirements to implement and us something specific to check before merging.

At Rocket.Chat, we're already increasing code coverage significantly, and every new feature has to come with a decent amount of testing. **PDD's approach could help us get more out of that effort by making the expected behavior explicit before we write the tests.** For a room-permissions change, for example, the agent could help us work through who should have access, who shouldn't, and what happens when membership changes. Those agreed rules would give us something concrete to connect to the implementation and its tests during review, and make missing cases easier to spot.

{% embed https://fast-check.dev/docs/introduction/why-property-based/ %}
