---
idx: 25
title: "AI found the vulnerability. Are we done yet?"
date: 2026-10-30
slug: cracking-vulnerabilities-is-not-that-easy
tags: ["ai", "security", "programming", "softwareengineering"]
excerpt: "AI is finding serious vulnerabilities and writing increasingly capable code. PHP2Shell and Firefox show why proving, fixing and shipping those findings is still hard work."
draft: false
unlisted: true
featured: false
featuredImage: "../../assets/images/ai-security-header.webp"
---

What caught my attention about PHP2Shell was [the PHP team's explanation of why fixing it took so long](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/). A developer had noticed signs of the problem back in 2024. They had several possible fixes, but each came with problems: breaking compatibility, creating denial-of-service risks, or requiring changes to third-party extensions.

Imagine knowing there's a security problem in your code and having to choose which other problem you're willing to create to fix it. Now imagine that code is PHP.

[AI helped researchers turn these flaws into working exploits](https://www.wiz.io/blog/php2shell-php-rce). That's a big deal. But reading the maintainers' account, I kept coming back to everything they had to work through before they could ship a fix.

In October, PHP released emergency security updates for two critical vulnerabilities known as **PHP2Shell**. They affect the PHP engine itself, and under the right conditions can allow an unauthenticated attacker to execute code on a vulnerable server.

That's serious. It's also a good example of something I think gets lost when we talk about what these models can do: **finding a flaw, demonstrating an exploit, fixing the underlying problem and safely deploying that fix are different jobs.** Being good at one doesn't automatically finish the others.

And before anyone puts off updating PHP because an exploit sounds difficult: please don't. Security researchers have demonstrated working attacks, and [NVISO's October 28 update cited reports of targeted exploitation](https://blog.nviso.eu/2026/10/23/php2shell-operational-guidance/). Difficulty is not a security patch.

## Ok, but the AI found it. Isn't that the hard part?

It's *a* hard part. And in this case the models helped with more than just finding the bugs.

According to Wiz, the flaws involve how PHP handles fatal errors, especially out-of-memory failures. An interrupted request can leave internal state partially initialized or pointing at freed memory. Later processing may reuse that invalid state, leading to memory disclosure or corruption.

The first signs of the out-of-memory problem appeared while a PHP developer was fixing an issue from a 2024 security audit. A possible exploit was theorized, but no concrete path to remote code execution had been established at the time.

The Foundation describes the stalled decision on a fix as a structural failure involving both the team's process and limited resources. Reports from Calif, OpenAI and Wiz in 2026 made the impact clearer, and the security team prioritized a fix across supported PHP versions.

Wiz says frontier models helped it develop and adapt working exploits across multiple applications **in hours**. Each target still required testing, debugging and adaptation to its memory layout. That's what makes this worrying: the complexity was still there, but the researchers could work through it much faster.

![A magnifying glass reveals a crack in a complex brass lock mechanism.](/images/ai-security-finding.webp)

*Finding the crack is a start. The rest of the mechanism still matters.*

The distinction mattered after disclosure too. In its [October 28 guidance](https://blog.nviso.eu/2026/10/23/php2shell-operational-guidance/), NVISO cited a report of targeted compromise and a successful attack against a challenge server, with a public proof of concept. It had not observed successful exploitation in its own telemetry. There was no reliable universal public exploit at that point, and many non-functional tools were being circulated.

AWS [identified attempted exploits against its honeypot before public disclosure](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/), but couldn't tell whether they would have succeeded against real systems. When a model generates an exploit, I'd ask the same question: **what shows that it actually works?** Sending a payload or getting a convincing explanation isn't enough. We need to reproduce the result under realistic conditions.

## Firefox makes the other side of the argument

I don't want to leave the impression that AI is mostly generating bad security reports and humans have to clean up the mess. That would be a pretty convenient argument, but it doesn't match what Mozilla has been seeing.

Mozilla used a security analysis pipeline with Claude Mythos Preview and other models to investigate Firefox. Its engineers reported that Firefox 150 included fixes for **271 vulnerabilities identified with Mythos Preview**. Their [technical write-up](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/) describes findings across different browser components, including some involving sandbox escapes and bugs that had been around for years.

Some of those sandbox escape reports assume an attacker has already compromised a content process. Escaping the sandbox is a serious vulnerability, but a complete browser attack would also need a way to compromise that process first.

That's a lot of real bugs. Mozilla also says the improvement came from both more capable models and the work it put into the pipeline: steering the models, filtering reports and giving them a way to produce test cases. The pipeline was adapted to Firefox, with feedback from the engineers handling the reports.

But finding hundreds of bugs creates another problem: now someone needs to fix hundreds of bugs. Mozilla says more than 100 people contributed code to the effort, with others involved in triage, testing and releases. In [an interview with TechCrunch](https://techcrunch.com/2026/05/07/how-anthropics-mythos-has-rewritten-firefoxs-approach-to-cybersecurity/), Mozilla's Brian Grinstead said that, for the bugs discussed there, an engineer wrote each patch and another reviewed it. The team also asked AI for suggested patches, but those generally weren't ready to deploy directly.

![A robotic arm places small mechanical parts on a workbench while an engineer carefully repairs another part.](/images/ai-security-repair.webp)

*A finding still has to become a fix people can safely use.*

## What does a working fix actually prove?

With PHP, stopping one proof of concept wasn't enough. The fix had to address memory management and error handling across supported versions.

An agent could produce a patch that stops one demonstration. That's worth testing, but I'd still want to know: does it address the underlying failure across the affected paths? Does it introduce a different way to exhaust memory? Does it work on the supported versions without breaking extensions? **Passing the test for one exploit isn't proof that we've fixed the whole problem.**

## What do the benchmarks tell us?

Researchers have been trying to measure this difference between code that works and code that works *securely*. [SecureVibeBench](https://arxiv.org/abs/2509.22097v5) reconstructs 105 C/C++ implementation tasks from changes that introduced real vulnerabilities. The agents implement the original requirements, rather than patch an already identified bug. In the June 2026 version of the paper, the best tested combination, SWE-agent with Claude Sonnet 4.5, met both the functionality and security criteria on **23.8% of those tasks**.

These were specific, difficult tasks using models from 2025, not the newer frontier systems in the PHP and Firefox examples above. The result doesn't tell us how those newer models would perform. What I find useful is the question the benchmark asks: **did the change meet the functional requirement without introducing a security problem?**

For PHP, a benchmark score won't tell us whether a proposed patch handles each affected configuration. For Firefox, it won't tell us whether a sandbox escape starts from an already compromised process. Those answers have to come from investigating the actual behavior and checking the evidence.

## So what do we do with the findings?

I'd absolutely use an agent for this work. But when it says "fixed", I still want to see what failed, why the patch addresses it, and what else we tested. Then we have to get that fix onto the servers running the software.

Closing the ticket doesn't update PHP.
