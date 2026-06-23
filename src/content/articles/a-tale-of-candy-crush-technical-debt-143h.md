---
idx: 4
title: "A tale of Candy Crush & Technical debt"
date: "2020-03-30T03:50:17Z"
slug: "a-tale-of-candy-crush-technical-debt-143h"
tags: ["programming", "techdebt", "scrum", "agile"]
excerpt: "Candy Crush chocolate multiplies when you ignore it — exactly like technical debt in an agile project. What the game taught me about paying it down."
draft: false
featured: false
canonicalUrl: "https://abcdev.netlify.app/a-tale-of-candy-crush-technical-debt-143h"
devtoUrl: "https://dev.to/kaleman15/a-tale-of-candy-crush-technical-debt-143h"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Faaqq9bag9dkshcx7pq5b.jpeg"
---

One day, when I was playing Candy Crush (Soda Saga, to be specific) I came across a very interesting but difficult level. Personally, I hate all the Chocolate-related levels on the game, but, well, a game is a game. 
In case you had never played Candy Crush before, this is what I'm talking about: 
![A candy crush chocolate level](https://dev-to-uploads.s3.amazonaws.com/i/ax28z62367a253mn3tth.jpg)
The objective in those levels is to destroy all the chocolate on the screen with the movements you have. This is not so difficult until you discover that when in a move you don't destroy any chocolate block, they multiply leaving you with less space to move, converting a peaceful level in a kind of race where you have to keep destroying or end up flooded in chocolate.

This situation made me think about a real-life scenario: Agile projects & technical Debt. So, how does technical debt assimilates to one of those levels? Let's discover!

## Chocolate multiplies as well as Technical Debt
First of all, let's state something: it's almost impossible to have an agile project without having technical debt at some point.
Having said that, let's think about chocolate. You start a level with a predefined amount of chocolate. If you don't do anything to clear them quickly, they will increase in number to the point where all on your screen is chocolate.
The same happens with tech debt. If your project doesn't have a plan to reduce the amount of TD, your entire project will convert into it and this will leave you in a point where it is easier to rebuild everything from scratch than fix the existing code base.
![An screen almost full of chocolate blocks](https://dev-to-uploads.s3.amazonaws.com/i/9s3fbvh9881z9yga483s.png)

## If you don't have a strategy, you will lose.
That kind of levels have something in common: you should think your movements before doing them. 
When debating about tech debt the same happens: You should know what you're doing. For example, if someone tells you that to reduce tech debt you should refactor every piece of code, yes, that could reduce tech debt, but at the same time, you are removing battle-tested code with something that probably won't work for all cases the old code did, introducing new tech debt & bugs. On the other hand, if the tech debt is not in the code per se, but on the way the project is architectured, you can end with more troubles than solutions by blindly changing current architecture. So, you should have a plan to fix tech debt, or you'll end up in a worse state.
![Game over screen](https://dev-to-uploads.s3.amazonaws.com/i/xqpro3anpibs5a3ms1og.jpg)
Good strategies to reduce the Tech debt in a project are described here in this DZone's [blog post](https://dzone.com/articles/how-to-reduce-tech-debt-a-practical-experience-gui-1)

## There are pieces of chocolate harder than others
As in real life, there are pieces of code, architecture decisions, product deadlines that are very difficult (or nearly impossible) to change! Let's write a dummy piece of code that will represent a tech debt:
```javascript
async function evaluateUser(user) {
  if(user.act && !user.isNew && !user.company.name === 'fancy company') { 
     /* do something really difficult here */
  }
}
```
Maybe there was a project deadline that the team had to meet so they decided to hard-code the company's name. And this works! Until the time the client says: `I want users from the company `"bla"` to be excluded too, but only new users`. As easy as this change may look, the team should be careful not to affect how the users from `"fancy company"` are evaluated and, if possible, make changes to this piece of code easier in the future (pay the tech debt). This situation makes changes to take longer and to be more error-prone.

## Chocolate is not always bad
When talking about tech debt, some people tend to touch it with a stick from the distance, avoiding all contact like if tech debt was the plague. But, that's not realistic. We all have tech debt. In this topic, I really like Squarespace's [blog post](https://engineering.squarespace.com/blog/2019/three-kinds-of-good-tech-debt) regarding good types of tech debt. In summary, tech debt is good when you know it is there. When it's intentional. Because that kind of tech debt can be paid, the one you are aware of. You can't pay what you don't know you owe!!
So, evergreen advice for dealing with this is to always document what your tech debt is, keep that document updated & involve your management team in this!

In conclusion, if I was able to pass that level, you can pay your technical debt!!
![You won! Screen](https://dev-to-uploads.s3.amazonaws.com/i/gqa0s5oaa2adfgjw90qu.png)

