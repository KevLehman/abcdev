---
idx: 27
title: "Cross-posting to DEV with an agent skill"
date: 2026-11-12
slug: "cross-posting-to-dev-with-an-agent-skill"
tags: ["ai", "devto", "writing", "automation"]
excerpt: "A small agent skill for publishing an article on DEV while keeping the original on your own site."
draft: false
unlisted: true
featured: false
---

Publishing an article on my blog is only part of the work. I also want to share it on DEV, which means copying the article, checking the links and making sure DEV points back to the original. It's not complicated, but it's the kind of thing that's easy to get wrong when you repeat it for every post.

So I made [a skill for publishing to DEV](https://github.com/KevLehman/agent-skills/tree/main/publish-devto). A skill is a set of instructions an agent can follow for a particular task. In this case, I can ask the agent to prepare a DEV draft or publish an article, and the skill gives it a workflow for doing that through the [Forem API](https://developers.forem.com/api/v1).

![An article travels from a writer's desk to a community board, with a thread connecting the two copies.](/images/dev-cross-posting-skill.webp)

## One original, two places to read it

My blog is the original, and DEV is another place to read the article. For a cross-post, the skill checks that the original URL is publicly accessible and sets it as DEV's canonical URL. That tells search engines which URL is the preferred original; it doesn't guarantee how they'll index either page.

The skill also checks the account's existing drafts and published articles before creating anything. If the article is already there, the agent should update the matching post instead of creating another copy. It converts relative links and images to public URLs too, so a link that works on my blog doesn't accidentally point somewhere else on DEV.

## A draft is still a draft

The skill needs a [DEV API key](https://dev.to/settings/extensions), supplied through `DEVTO_API_KEY` in the environment or an ignored `.env` file. Keep that key private. The agent checks the account and reports the resulting URL and publication state after a write.

You can ask for a draft first. Asking for a draft doesn't authorize publishing it; asking to publish does. I'd still read the DEV version before sharing it: the skill can handle the repetitive steps, but I want to see that the article and its links look right where readers will find them.
