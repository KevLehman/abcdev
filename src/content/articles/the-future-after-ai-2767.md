---
idx: 18
title: "The future, after AI"
date: "2026-10-08T19:52:28Z"
slug: "the-future-after-ai-2767"
tags: ["ai","programming","career","beginners"]
excerpt: "I've been using AI coding tools for a while now, and the progress is honestly insane. Something that..."
draft: false
featured: false
canonicalUrl: "https://kevinaleman.com/the-future-after-ai-2767"
devtoUrl: "https://dev.to/kaleman15/the-future-after-ai-2767"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Ff80gr9onk582n4s45syx.png"
---

I've been using AI coding tools for a while now, and the progress is honestly insane. Something that would take a junior developer a day can sometimes be done by an agent in 20 minutes, with tests, documentation and probably better error handling than what I would've written on a Friday afternoon. That, alone, is insane: imagine the time you save on writing code and how you can invest that in some other stuff.  

But there's something about this that has been bothering me lately:  
**What happens when producing good code no longer requires understanding how to produce good code?** 
And more importantly: **what happens to the next generation of senior developers?**  
  
## Juniors are becoming very productive  
Imagine you're learning backend development and I ask you to create an endpoint.  
You need to:  
* validate some input  
* query the database  
* handle errors  
* return the proper HTTP codes  
* write tests  

A few years ago, you probably had to learn at least *something* about each of those things to finish the task.  
- Maybe your SQL query was horrible and you learned about indexes because of it.  
- Maybe two requests modified the same thing and you discovered race conditions.  
- Maybe you returned 200 for literally everything because HTTP status codes were still a mystery to you (we've all been there), that’s the point where I learned about [httpcat.com](https://httpcat.com) lol  


Today, you can ask an agent:  
“Implement this endpoint following the patterns in this repository. Add validation and tests.”  
And there's a pretty good chance it will do it correctly. The junior is now more productive. You are more productive. I am more productive. Everyone is happy.  
But did you actually learn why the implementation is correct? That's a different question.  
  
A [2026 study from the Technical University of Munich](https://www.edtech.tum.de/the-dissociation-of-performance-and-learning-in-ai-supported-programming-education/) tested this with 275 programming students. Students using AI performed better on the programming tasks, but that improvement did **not** translate into significantly better conceptual understanding compared with students using traditional resources.  
  
This is interesting for one very important reason: we're getting better at producing the result, but not necessarily better at understanding how we got there. It’s like eating a frozen pizza: you ate a pizza, that’s great. But, *did you learn how to make a pizza*?  
  
## The boring stuff was useful

The problem is that a lot of the annoying parts of learning programming were actually... learning. Spending two hours debugging something stupid sucks, reading documentation because Stack Overflow didn't have your exact answer (or they just threw rocks at you for asking a “dumb” question) sucks, writing a slow database query, discovering it's slow, understanding why and fixing it sucks.  
  
**But you remember those things.**  
  
I've said this before and I'll probably keep saying it until AI replaces me: **You cannot prompt what you don't know exists.**  
And there's a second part to that: **You cannot properly review what you don't understand.**  
  
AI can generate a perfectly reasonable database query. But, **how do you know it's going to murder your database when the table has 20 million rows?  **
  
AI can implement retries. But, **how do you know retrying that specific operation can charge someone twice?**  
  
AI can add caching. But, **how do you know the thing you're caching should not be cached?  **
  
The answer is **experience**. And experience usually comes from doing stuff, breaking stuff and sometimes wondering why the hell production is on fire. If we let AI remove too much of that process, _we may be removing part of the path that creates good engineers.  _
  
There's already some evidence that this isn't only a programming thing. [Microsoft Research surveyed 319 knowledge workers about 936 real uses of generative AI](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/). Higher confidence in AI was associated with less critical thinking effort, while people who were more confident in their own knowledge tended to think more critically about the result. Which makes sense. If you know the topic, **AI is something you supervise**. If you don't, **AI can easily become something you trust.**  
  
## Ok, but they'll learn later... right?  
  
Maybe.

But here's where things get more complicated. We're also starting to need fewer junior developers. [Stanford's Digital Economy Lab](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/?sck=e7755a74-2c92-4599-a31f-d8d04fefbda5%7Cf096abf9-83ca-444a-81b9-d203a2ca0198%7Cfb.1.1790640959475.835605%7C%7Ce7755a74-2c92-4599-a31f-d8d04fefbda5%7C62bb42b7-9eda-4c71-bab2-01af93fa1b00%7Cfb.1.1790640955539.1892144355%7C%7Ce7755a74-2c92-4599-a31f-d8d04fefbda5%7C074ce756-5ebe-442d-876a-eb74bb6841c8%7Cfb.1.1786822140828.566583304%7C) has been tracking employment in occupations exposed to AI using payroll data from millions of workers. Their August 2026 update found something pretty noticeable: employment for workers aged 22–25 in highly AI-exposed occupations was about **19% below** where it would've been if it had followed the same trend as less-exposed occupations. More experienced workers did not show the same gap.  
  
They also found that the difference seems to be coming mostly from **reduced hiring**, not people getting fired. That doesn't mean "AI killed 19% of junior jobs". Labor markets are way more complicated than that and the researchers themselves don't claim that, but the direction is something to take a closer look.  
  
Companies can give experienced developers AI tools and suddenly get a lot more output from them. So why hire five juniors when your existing team can now do more? Economically, that can make perfect sense. **Until it doesn’t.**  
  
## Where do seniors come from?  
  
This is the part I think we're not discussing enough, Senior developers don't spawn with 8 years of experience. Every senior was a junior. Even the ones you see on the web with thousands of followers or the ones that have created truly amazing stuff, they were juniors some day (except from the guy that wrote TempleOS, I think he received his knowledge by divine grace). Every staff engineer wrote stupid code. Every database expert probably created at least one query they're not particularly proud of. You become experienced by accumulating a ridiculous amount of small lessons over many years.  
  
But imagine the direction we're heading:  
* Companies hire fewer juniors.  
* The juniors we hire skip more of the low-level work using AI.  
* Experienced developers become insanely productive using agents.  
* Companies need even fewer developers.  
  
Looks pretty good on an Excel sheet, then 10 years pass and someday you turn around and ask yourself: “Where are the new senior engineers?”. We could end up creating some kind of **experience debt**. Similar to technical debt: you move faster today by borrowing from the future.  
  
Except this time we're borrowing engineers.  
  
## So... should juniors stop using AI?  
  
No. That would be dumb. AI is probably one of the best learning tools we've ever created. You have something available 24/7 that can explain a concept 20 times without getting tired of you.  
  
Use it.  
  
But there's a big difference between: “Build this for me” and “help me understand how to build this”.  
  
There's also a difference between accepting the first implementation and asking: “What can go wrong here?” Or  “Why did you choose this approach?” Or even closing the AI for an hour and trying to solve the damn thing yourself.  
  
We're not going back. AI is here, agents are getting better and software will probably continue becoming cheaper to produce, which is good, but we have to be careful not to optimize the learning out of learning, because in the future the problem may not be that there’s no longer a “programming” career, or that AI finally replaced everyone and now we have to adore Sam Altman for a living.   
  
It might be that we have the most powerful tools available, the better models… but not enough people who actually understand what the hell is going on anymore.  

