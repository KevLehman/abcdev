---
idx: 21
title: "AI Has a Problem With Functional Programming"
date: 2026-10-15
slug: ai-has-a-problem-with-functional-programming
tags: ["ai", "programming", "softwareengineering", "cleancode"]
excerpt: "AI keeps turning simple code into a guided tour of one-line helpers. The problem isn't functional programming. It's abstractions that don't pay rent."
draft: false
unlisted: false
featured: false
canonicalUrl: "https://kevinaleman.com/ai-has-a-problem-with-functional-programming"
coverImage: "https://kevinaleman.com/images/functional-programming-header.png"
---

There is a pattern I keep seeing in AI-generated code. You ask it to implement something relatively simple and you get this:

```ts
const result = await processRequest(request);

async function processRequest(request) {
  const data = await getData(request);
  return transformData(data);
}

async function getData(request) {
  return repository.get(request.id);
}

function transformData(data) {
  return mapper.transform(data);
}
```

Every function looks perfectly reasonable in isolation. But most of those functions add almost nothing. We've turned two operations into a small guided tour of the codebase.

Very modular. I'm already tired.

And yes, saying **AI has a functional programming problem** is technically unfair. Functional programming isn't the issue. The problem is that LLMs seem unusually comfortable creating **shallow abstractions**: functions whose only purpose is calling another function.

And abstraction isn't free. Every function introduces another name, another place to jump to, another interface you need to keep in your head. You wanted to understand where the data comes from and now you're opening your fourth file.

John Ousterhout describes a similar problem with *shallow modules*: abstractions whose interface is large relative to how much complexity they actually hide. They don't really remove complexity. They move it.

{% embed https://web.stanford.edu/~ouster/cgi-bin/cs190-spring16/lecture.php?topic=modularDesign %}

## Why does AI do this?

There isn't much evidence that LLMs inherently *prefer* functional or modular code.

In fact, an EMNLP 2024 study compared modular and non-modular versions of functionally equivalent code across several code models. Their conclusion was interesting: **modularity itself was not a core factor in improving code-generation performance**.

{% embed https://aclanthology.org/2024.findings-emnlp.676/ %}

So the problem may be less about what the model *wants* and more about what we ask it to produce. We constantly tell AI to write code that is:

- clean
- modular
- reusable
- maintainable
- single-responsibility

Those are good goals. But they are incredibly easy to satisfy mechanically:

> Take these five lines and give them a name.

There you go. Clean code. We can all go home.

The model also doesn't experience the code like we do. Creating another helper costs it almost nothing. A human maintaining the result six months later has to navigate through it, figure out whether the helper does anything special and discover that, no, it just calls the next one.

And we're starting to get actual evidence that **functionally correct LLM code can still have structural quality problems**.

An ICSE 2026 study measured how likely LLM-generated code was to contain code smells and found that generation strategy, model architecture, model size and, importantly, **prompt formulation** influence those smells.

{% embed https://www.microsoft.com/en-us/research/publication/a-causal-perspective-on-measuring-explaining-and-mitigating-smells-in-llm-generated-code/ %}

Another 2026 study looking at real repositories found that code detected as likely AI-generated showed substantial **intra-repository code cloning**. Basically, repeated code inside the same repository. That's another sign that generating locally reasonable code doesn't necessarily produce a cleaner system globally.

{% embed https://arxiv.org/abs/2607.01867 %}

Maintainability research has moved far enough that researchers are now trying to predict the maintainability and code-smell characteristics of generated code **before the model even generates it**. One October 2026 paper, PreMaQ, evaluated 2,695 tasks across four models and found that its predictions correlated meaningfully with the eventual maintainability metrics of the generated code.

{% embed https://arxiv.org/abs/2610.05858 %}

None of these studies proves that AI loves one-line wrappers. They do show that "the code works" doesn't tell you everything about the code you're going to maintain.

## So how do we stop it?

Tell the AI that **abstractions need to pay rent**.

I've started preferring instructions closer to:

> Do not extract a function merely to make another function shorter. Create an abstraction only when it hides meaningful complexity, represents a domain concept, or is genuinely reused. Avoid pass-through functions and one-line wrappers. Prefer fewer concepts and a shorter call path.

The ICSE study above found that prompt formulation materially affects the kinds of code smells models generate, and that targeted mitigation can reduce their occurrence. That doesn't mean this exact prompt has been scientifically blessed. It means being specific about what you want is probably more useful than asking for "clean code" and hoping we all agree on what that means.

One final rule I like:

**If the function's name is basically an English translation of its body, consider deleting it.**

Consider, not automatically delete. A one-liner that expresses a real domain rule can still be useful. But if the only reason it exists is that the other function was getting a little long, maybe we don't need it.

AI is extremely good at producing more code. We're reaching the point where one of the most important skills when using it is asking it to produce less.
