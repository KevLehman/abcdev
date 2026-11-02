---
idx: 25
title: "Cracking vulnerabilities and solving code is not that easy, even with frontier models"
date: 2026-10-30
slug: cracking-vulnerabilities-is-not-that-easy
tags: ["ai", "security", "programming", "softwareengineering"]
excerpt: "AI is finding serious vulnerabilities and writing increasingly capable code. PHP2Shell and Firefox show why proving, fixing and shipping those findings is still hard work."
draft: false
unlisted: true
featured: false
featuredImage: "../../assets/images/ai-security-header.webp"
---

There is a story I've been seeing more often lately: an AI model finds a vulnerability, someone mentions that it can lead to remote code execution, and suddenly it sounds like anyone with a prompt can take over the internet.

Then there's another story: the model writes a fix, the tests pass, and we move on to the next ticket.

Both stories skip a lot of work in the middle.

In October, [PHP released emergency security updates](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/) for two critical vulnerabilities known as **PHP2Shell**. They affect the PHP engine itself, and under the right conditions can allow an unauthenticated attacker to execute code on a vulnerable server. [Wiz Research used frontier models](https://www.wiz.io/blog/php2shell-php-rce) while investigating the flaws and developing working exploits against several applications.

That's serious. It's also a good example of something I think gets lost when we talk about what these models can do: **finding a flaw, demonstrating an exploit, fixing the underlying problem and safely deploying that fix are different jobs.** Being good at one doesn't automatically finish the others.

And before anyone puts off updating PHP because an exploit sounds difficult: please don't. Security researchers have demonstrated working attacks, and [NVISO reported targeted exploitation](https://blog.nviso.eu/2026/10/23/php2shell-operational-guidance/) in its October 28 update. Difficulty is not a security patch.

## Ok, but the AI found it. Isn't that the hard part?

It's *a* hard part. And in this case the models helped with more than just finding the bugs.

According to Wiz, the PHP flaws involve what happens when a request runs out of memory during initialization. An interrupted request can leave internal state pointing at memory that has already been released. A later request may interact with that stale state, leading to memory disclosure or corruption.

If that sounds like a lot of conditions for a single sentence, that's because it is.

The story also didn't start with a model finding something nobody had ever noticed. The [PHP Foundation says](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/) that a PHP developer saw the first signs of the out-of-memory problem while fixing an issue from a 2024 security audit. A possible exploit was theorized, but no concrete path to remote code execution had been established at the time.

The team considered several fixes, each with difficult trade-offs around compatibility, denial of service or changes required in third-party extensions. The Foundation describes the stalled decision as a structural failure involving both the team's process and limited resources. Reports from Calif, OpenAI and Wiz in 2026 made the impact clearer, and the security team prioritized a fix across supported PHP versions.

Finding the flaw was just the start. Wiz used AI to develop working exploits across several applications, but each target still required testing, debugging and adaptation to its memory layout. **The model accelerated the work. It didn't make the hard parts disappear.**

![A magnifying glass reveals a crack in a complex brass lock mechanism.](/images/ai-security-finding.webp)

*Finding the crack is a start. The rest of the mechanism still matters.*

The distinction mattered after disclosure too. In its [October 28 guidance](https://blog.nviso.eu/2026/10/23/php2shell-operational-guidance/), NVISO reported that targeted compromise had been demonstrated and at least one public proof of concept worked in a controlled setup, but there was no reliable universal public exploit at that point. It also reported many non-functional tools being circulated.

AWS [identified attempted exploits against its honeypot before public disclosure](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/), but couldn't tell whether they would have succeeded against real systems. When a model generates an exploit, I'd ask the same question: **what shows that it actually works?** Sending a payload or getting a convincing explanation isn't enough. We need to reproduce the result under realistic conditions.

That doesn't make PHP2Shell harmless. Working attacks have been demonstrated, and exposed systems need to be patched.

## Firefox makes the other side of the argument

I don't want to leave the impression that AI is mostly generating bad security reports and humans have to clean up the mess. That would be a pretty convenient argument, but it doesn't match what Mozilla has been seeing.

Mozilla used a security analysis pipeline with Claude Mythos Preview and other models to investigate Firefox. Its engineers reported that Firefox 150 included fixes for **271 vulnerabilities identified with Mythos Preview**. Their [technical write-up](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/) describes findings across different browser components, including some involving sandbox escapes and bugs that had been around for years.

That's a lot of real bugs. Mozilla also says the improvement came from both more capable models and the work it put into the pipeline: steering the models, filtering reports and giving them a way to produce test cases. The pipeline was adapted to Firefox, with feedback from the engineers handling the reports.

But finding hundreds of bugs creates another problem: now someone needs to fix hundreds of bugs. Mozilla says more than 100 people contributed code to the effort, with others involved in triage, testing and releases. In [an interview with TechCrunch](https://techcrunch.com/2026/05/07/how-anthropics-mythos-has-rewritten-firefoxs-approach-to-cybersecurity/), Mozilla's Brian Grinstead said that, for the bugs discussed there, an engineer wrote each patch and another reviewed it. The team also asked AI for suggested patches, but those generally weren't ready to deploy directly.

![A robotic arm places small mechanical parts on a workbench while an engineer carefully repairs another part.](/images/ai-security-repair.webp)

*A finding still has to become a fix people can safely use.*

**AI made finding the bugs much faster. It didn't make the work of fixing and shipping them disappear.** If anything, it made the amount of work waiting for the team more visible.

## What does a working fix actually prove?

Back to PHP. The maintainers weren't just trying to make one proof of concept stop working. They needed to fix a problem in memory management and error handling without breaking existing applications or the extensions built around PHP. Some approaches they considered could introduce denial-of-service risks or require changes across that ecosystem.

An agent could produce a patch that stops one demonstration. That's worth testing, but I'd still want to know: does it address the underlying failure across the affected paths? Does it introduce a different way to exhaust memory? Does it work on the supported versions without breaking extensions? **Passing the test for one exploit isn't proof that we've fixed the whole problem.**

The same question about scope applies to Firefox's findings. Mozilla explains that a number of the sandbox escape reports assume an attacker has already compromised a content process. Escaping from there is a real security problem, but those reports don't by themselves demonstrate a complete attack from a website to control of the browser. That distinction doesn't make the bugs less worth fixing. It tells us what the evidence actually shows.

This is where the agent's explanation can sound more complete than the result. A model can help write the patch, build the reproduction and investigate other paths. We still need to check which conditions were tested, which were assumed and what happens outside that test environment.

## What do the benchmarks tell us?

Researchers have been trying to measure this difference between code that works and code that works *securely*. [SecureVibeBench](https://arxiv.org/abs/2509.22097v5) reconstructs 105 C/C++ coding tasks around real vulnerabilities and checks both functionality and security. In the June 2026 version of the paper, the best tested combination, SWE-agent with Claude Sonnet 4.5, produced solutions that met both criteria on **23.8% of those tasks**.

That number needs context. These were specific, difficult tasks and specific agent/model combinations; the study used models from 2025, not the newer frontier systems in the PHP and Firefox examples above. It is not a current failure rate for every model or every codebase. What I find useful is the question it asks: **did the change meet the functional requirement without introducing or preserving the security problem?** That's a more demanding question than whether the code compiles and the existing tests are green.

Even a general coding benchmark needs interpretation. In February, [OpenAI's analysis of SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) identified possible training-data contamination and flawed tests in an audited subset of tasks. Some tests rejected solutions that could be functionally correct. That doesn't mean benchmarks are useless; it means we need to know what they measure and where the measurement can fail.

For PHP, a benchmark score won't tell us whether a proposed patch handles each affected configuration. For Firefox, it won't tell us whether a sandbox escape starts from an already compromised process. Those answers have to come from the investigation itself.

## So what do we do with the findings?

I'd still use AI to investigate and help fix security issues. The PHP and Firefox work shows why we should take its capabilities seriously. But I'd want the work to produce evidence I can inspect:

- **Separate the claims.** A suspicious code path, a reproducible crash and a working exploit are different findings. Record which one the agent demonstrated and what access it needed.
- **Reproduce the relevant conditions.** PHP versions, configurations and memory layouts mattered to PHP2Shell. For the Firefox sandbox reports, the starting assumption about the compromised process mattered too.
- **Review the fix beyond one demonstration.** Check related paths, supported versions and the effect on legitimate behavior. The PHP team had to consider compatibility and denial-of-service risks as well as the original flaw.
- **Finish the release work.** Identify affected deployments, update the right runtime and verify that running services picked it up. If the issue belongs to someone else's project, follow its security disclosure process and give maintainers evidence they can use.

Frontier models can find and help fix real vulnerabilities. I'll call one solved when we can show what failed, verify the fix and get it to the people running the software.
