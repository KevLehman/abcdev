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
devtoUrl: "https://dev.to/kaleman15/cross-posting-to-dev-with-an-agent-skill-31jp"
coverImage: "https://kevinaleman.com/images/dev-cross-posting-skill.webp"
coverDimensions: { width: 1672, height: 941 }
---

I publish articles on my blog, and I also want to share them on DEV. That means copying the post, fixing the links that only work on my site, and remembering to point DEV back to the original. None of that is hard. I just don't want to do it by hand every time.

So I made a [DEV publishing skill](https://github.com/KevLehman/agent-skills/tree/main/publish-devto). It's a set of instructions for an agent: give it an article and ask for a DEV draft or a published post. The agent then uses the [Forem API](https://developers.forem.com/api/v1) to do the work.

## Where's the original?

The original lives on my blog. Before cross-posting it, the skill checks that the original URL is public and sets it as the canonical URL on DEV. That tells search engines which version I prefer them to treat as the original, though they still decide how to index it.

It also checks my existing DEV posts and drafts. If the article is already there, the agent should update that post instead of making a duplicate. And those relative image paths that work on my blog? They need public URLs on DEV, so the skill handles that too.

The same goes for relative links. I'd rather catch those before someone clicks a link in the DEV post and ends up somewhere unexpected.

## How to use it

You'll need a [DEV API key](https://dev.to/settings/extensions), available to the agent as `DEVTO_API_KEY` in your environment or an ignored `.env` file. Keep it private. The skill checks the account before making changes and reports the URL and publication state afterward.

I can ask for a draft if I want to review it first. The agent shouldn't publish it unless I ask it to. Either way, I'll check the DEV version before sharing it. I still want to know what readers are going to see.

You can find this and the others I've been working on in [my skills collection](/skills/).
