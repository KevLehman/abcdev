---
idx: 24
title: "From Clicks to AI: The Evolution of QA"
date: 2026-10-28
tags: ["testing", "ai", "software"]
excerpt: "Testing has moved from manual exploration to automation and now AI assistance. The tools change, but knowing what to test still matters."
draft: false
unlisted: true
featuredImage: "../../assets/images/qa-evolution-cover.png"
collaboration:
  name: Harmeet Kour
---

There was a time when testing an application meant opening it, clicking around, entering unexpected values and seeing what broke. That still sounds like a useful way to find bugs tho. You would see QAs around the world with long lists of issues they had to perform before approving the release of a product, pretty much like the old car industry.

Then came test automation. Instead of repeating the same regression checks by hand, teams could write them once and run them in CI. Tools like Selenium, Cypress and Playwright made that possible. Of course, the tests also needed maintenance: change a button label or a selector and suddenly the pipeline is red.

Now AI can help generate test cases, suggest edge cases, create test data and investigate failures. It can even help decide which tests to run after a change. But that raises a question I've been thinking about: **how do we know the tests it suggests are the ones that matter?**

## Three stages of testing

Manual testing gives us something that's hard to replace: *curiosity*. A person can notice that a flow feels wrong, question a requirement or try an unexpected sequence of actions. The downside is that repeating the same checks for every release takes time, and people can miss things, get tired and work less effectively too. Automation, in the other hand, gives us repeatability. A reliable regression suite can check important behavior on every change and give the team quick feedback. But more automated tests don't automatically mean better coverage. A test that clicks through a page can often miss other wrong things on the page, which you would have to write tests for, which can lose other wrong stuff on the page, which can lose other wrong stuff...

AI-assisted testing can make parts of both jobs faster. It can propose cases we didn't think of, help write tests and summarize failures. But a generated test is still a proposal. Someone needs to check its assumptions, assertions and relevance to the product. The stages aren't replacements for each other. We still need exploratory testing, and we still need reliable automation. AI adds another tool to that work. And as every other tool, pretty much of the work still depends on who is using the tool.

## Test count is not the same as confidence

This reminds me of the session validation example in my article about [proof-driven development](/proof-driven-development): tests for a valid session, an expired session and an invalid signature can all pass while the application still accepts a revoked session. Passing a suite tells us that the checks we wrote passed. It doesn't tell us what we forgot to check. AI can make that gap wider if we use the number of generated tests as a measure of quality. It can produce many plausible cases from an incomplete requirement, including cases that repeat the same assertion or miss the behavior users actually depend on.

The [Google SRE book makes a similar point](https://sre.google/sre-book/testing-reliability/): passing tests doesn't necessarily prove that a system is reliable. The tests tell us something about the scenarios they cover; they can't tell us everything about the scenarios we didn't consider.

For example, imagine a checkout flow where a discount should only apply once. An AI might generate several tests for valid and invalid coupon codes. Useful! But what happens if a customer sends more than one coupon? Should that be even possible? Or, what happens if the payment fails? Should the coupon be flagged as "used"? Wouldn't that make the human on the other side angry? Here's the human part: *giving context for the decisions made*. That scenario may be less obvious and more expensive to get wrong, so no matter how many tests we write, if the tests are not *testing* the right behaviors, we have created a safety net with enormous holes in it. So, never take the number of tests as a measure of "we're safe". The *quality* of them should be evaluated too.

![A receipt falls toward a hole in a safety net stretched across a gap.](/images/qa-test-coverage.png)

**The question is not just “Can we test this?” It's “What's the most important behaviors we should test?”**

## Where AI can help

I think AI is most useful here as a second set of eyes, not as the person deciding when we're done. Give it the change, relevant requirements and constraints, then ask it to suggest boundaries, negative cases and assumptions. Review those suggestions against the actual product.

It can also help when a test run turns red. Give it the failure logs and it can suggest which failures might share a cause or where to investigate first. But we still need to check whether we're looking at a product bug, a flaky test or an environment problem. As [Google's testing team points out](https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html), a flaky failure can even be a sign of nondeterminism in the product itself. A useful suggestion is a starting point, not a diagnosis.

![A QA engineer examines failure signals while an AI assistant groups them on a screen.](/images/qa-failure-analysis.png)

A few things are still our responsibility:

- **Prioritize by risk.** A payment failure and a typo don't need the same level of coverage. Consider business impact, likelihood and how quickly the problem would be noticed.
- **Check the assertions.** A test should verify meaningful behavior, not just that the page loaded or a button was clicked.
- **Keep regression tests maintainable.** Prefer stable selectors and clear failures. A suite that fails for unrelated UI changes eventually becomes noise.
- **Verify AI output.** Check the generated data, expected results and assumptions. If a requirement is ambiguous, ask someone who knows the domain instead of treating the model's answer as the specification.

## The human part

The exciting part of AI in QA isn't that we can produce 40 test cases in seconds. It's that we can spend less time starting from a blank page and more time asking better questions. What did we assume? Which failure would hurt users most? What would this test miss?

The tools will keep changing. The responsibility to understand what we're shipping stays with us. At the end, if we blindly trust what AI does, then we have replaced ourselves with it.
