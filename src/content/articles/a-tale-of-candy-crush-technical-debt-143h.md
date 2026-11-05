---
idx: 4
title: "Candy Crush and technical debt"
date: "2020-03-30T03:50:17Z"
slug: "a-tale-of-candy-crush-technical-debt-143h"
tags: ["programming", "techdebt", "scrum", "agile"]
excerpt: "Candy Crush chocolate multiplies when you ignore it — exactly like technical debt in an agile project. What the game taught me about paying it down."
draft: false
featured: false
canonicalUrl: "https://kevinaleman.com/a-tale-of-candy-crush-technical-debt-143h"
devtoUrl: "https://dev.to/kaleman15/a-tale-of-candy-crush-technical-debt-143h"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Faaqq9bag9dkshcx7pq5b.jpeg"
---

One day I was playing Candy Crush — Soda Saga, specifically — and came across an interesting but difficult level. I hate the chocolate levels, but if you want to keep playing, you have to get through them.

If you've never played, this is what I'm talking about:

![A Candy Crush level with chocolate blocks](https://dev-to-uploads.s3.amazonaws.com/i/ax28z62367a253mn3tth.jpg)

The goal is to destroy all the chocolate on the screen with the moves you have. That doesn't seem too hard until you discover that, if you make a move without destroying any chocolate, it multiplies and leaves you less room. A peaceful level turns into a race: keep clearing chocolate or end up buried in it.

It made me think about something outside the game: agile projects and technical debt. What do they have in common with those levels? Let's see.

## Chocolate multiplies as well as Technical Debt

First, something worth accepting: it's almost impossible to have an agile project without accumulating technical debt at some point.

Think about the chocolate. You start a level with a set amount. If you don't clear it soon, it multiplies until the screen is covered.

Technical debt can work the same way. Without a plan to reduce it, it can spread until rebuilding the project from scratch starts to look easier than fixing the existing code.

![A screen almost full of chocolate blocks](https://dev-to-uploads.s3.amazonaws.com/i/9s3fbvh9881z9yga483s.png)

## If you don't have a strategy, you will lose.

In these levels, you have to think before you move. The same goes for technical debt: you need to know what you're doing.

Someone might tell you to refactor every piece of code to reduce the debt. That could help. But you could also replace battle-tested code with something that doesn't handle all the cases the old code did. The result: more debt and new bugs.

If the problem isn't in the code itself but in the project's architecture, changing it blindly can create more problems than it solves. You need a plan, or you could end up worse off than when you started.

![Game over screen](https://dev-to-uploads.s3.amazonaws.com/i/xqpro3anpibs5a3ms1og.jpg)

This [DZone article](https://dzone.com/articles/how-to-reduce-tech-debt-a-practical-experience-gui-1) describes some strategies for reducing technical debt in a project.

## There are pieces of chocolate harder than others

As in real life, some code, architecture decisions and product deadlines are very difficult — or nearly impossible — to change. Here's a simplified example of technical debt. Assume the user has a company with a name, and the function only processes users who pass this condition:

```javascript
async function evaluateUser(user) {
  if (user.act && user.company.name !== 'fancy company') {
    /* do something really difficult here */
  }
}
```

Maybe the team had a deadline and decided to hard-code the company name. And it works! Until the client says, “I also want to exclude users from `"bla"`, but only the new ones.”

However simple the change looks, the team needs to be careful not to affect how users from `"fancy company"` are evaluated. If possible, it should also make future changes to that code easier: pay down the debt. Otherwise, changes take longer and mistakes become more likely.

## Chocolate is not always bad

Some people treat technical debt like the plague: they look at it from a distance and don't want to touch it with a stick. But that isn't realistic. We all have technical debt.

I like this [Squarespace blog post](https://engineering.squarespace.com/blog/2019/three-kinds-of-good-tech-debt) about kinds of technical debt that can be useful. Debt can be a deliberate choice. When you know it's there, you can plan how to pay it down. You can't pay what you don't know you owe!

{% embed https://engineering.squarespace.com/blog/2019/three-kinds-of-good-tech-debt %}

That's why it's worth documenting your technical debt, keeping that record up to date and involving the management team.

If I could beat that level, you can pay down your technical debt.

![You won! Screen](https://dev-to-uploads.s3.amazonaws.com/i/gqa0s5oaa2adfgjw90qu.png)

