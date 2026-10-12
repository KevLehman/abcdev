---
collaboration:
  name: Qodo
  url: https://www.qodo.ai/
---

# Testing Qodo on my own code

In my [previous article](https://kevinaleman.com/the-future-after-ai-2767), I wrote about something that has been bothering me with AI coding tools: we're getting better at producing code, but that doesn't necessarily mean we're getting better at understanding it.

Part of that problem is reviewing what the agent produces. You can ask it to implement a feature, add tests and follow the repository patterns, and it will probably give you something reasonable. But how do you know which cases it didn't consider?

I wanted to try this from the review side. So I used [Qodo](https://www.qodo.ai/) on a PR for this blog, introduced a few mistakes on purpose, and checked which ones it found.

Some were pretty obvious. Others needed specific inputs to reproduce. **All of them passed the tests we had at the time.**

## What I was testing

Qodo is an AI code review platform. It can review pull requests through its Git integration, review code in your IDE, or run reviews through its CLI. For this experiment, I used the GitHub integration. The coding agent helped write the code, and Qodo reviewed the PR. [Qodo’s platform overview](https://www.qodo.ai/features/qodo-git/) explains the different review surfaces.

{% embed https://www.qodo.ai/features/qodo-git/ %}

The feature was simple: add series navigation to the blog. I have multi-part articles about JavaScript and Go, and agentic engineering, so it made sense to let readers move between them.

Each article could declare some metadata:

```yaml
series:
  id: js-to-go
  title: From JavaScript to Go
  order: 1
```

A helper would find the published articles in that series, sort them, and return the current position and neighboring articles. An Astro component would render the list, a “Part 1 of 2” label, and previous/next links.

Nothing particularly complicated. Which made it a useful place to test a reviewer: I could understand the entire change and reproduce the findings without needing a huge application.

You can see the experiment in [PR #10](https://github.com/KevLehman/abcdev/pull/10).

## It found issues before I introduced any

The original implementation passed 47 tests, typecheck and the production build.

Qodo still found three things worth checking:

- Two articles could declare the same order within a series.
- Articles with the same series ID could declare different titles.
- The previous/next links had poor hover contrast in dark mode.

The first two were interesting because the individual articles were valid according to the schema. Each had a series ID, a title and a positive integer order. **The problem appeared when you looked at the articles together.**

For example, two posts could both declare `order: 1`. The helper would sort them using their IDs as a tie breaker and generate navigation anyway. The result was consistent, but the author wouldn't know that the metadata was wrong.

The title issue was similar. We grouped articles using `series.id`, but displayed the title from the current article. If two posts had different titles for the same series, moving between them changed the series heading.

Neither issue affected the four posts we had. Their metadata was correct. I considered both findings valid, but lower priority than something already affecting readers.

The contrast issue did affect the existing interface. In dark mode, the hover background was `#6E8BFF`, while the small direction label used `#B9C6FF`. Their calculated contrast was only **1.85:1**. The white article title had a contrast of **3.09:1** against that background.

> **How is color contrast calculated?**
>
> We compare the relative luminance of the text and its background. First, divide each red, green and blue channel by 255 to get a value `c` between 0 and 1. Convert each channel to linear light: use `c / 12.92` when `c <= 0.04045`, otherwise use `((c + 0.055) / 1.055) ** 2.4`. Then calculate luminance with `L = 0.2126R + 0.7152G + 0.0722B`, using those converted channels.
>
> The contrast ratio is `(lighter L + 0.05) / (darker L + 0.05)`. Identical colors give 1:1; black and white give 21:1. WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text. We need to check the actual foreground/background pair in each theme and hover state, without rounding a failing result up to a pass. The [W3C calculation](https://www.w3.org/WAI/WCAG22/Techniques/general/G18) explains the formula and thresholds.

We eventually fixed it using an existing theme-aware foreground token:

```diff
-  .neighbors a:hover { background: var(--signal); color: var(--on-signal); }
+  .neighbors a:hover { background: var(--signal); color: var(--selection-ink); }

-  .neighbors a:hover .direction { color: var(--signal-tint); }
+  .neighbors a:hover .direction { color: inherit; }
```

The new color pairs calculate to **6.15:1 in light mode and 5.93:1 in dark mode**.

This was useful feedback. We had followed an existing visual pattern, but that didn't mean the pattern worked correctly in both themes.

## Adding some mistakes on purpose

Next, I introduced four defects in a [separate commit](https://github.com/KevLehman/abcdev/commit/914312e). I left the tests unchanged.

### The next link pointed to the current article

```diff
-      <a href={`/${series.next.id}`} rel="next">
+      <a href={`/${series.articles[series.position - 1].id}`} rel="next">
```

The link still displayed the next article's title, but its destination came from the current position in the array. So you could click “Next part” and end up reading the same article again.

Qodo caught this and recommended using the `series.next.id` value we had already calculated.

### The current-page marker was off by one

```diff
-        {i + 1 === series.position
+        {i === series.position
```

The array index starts at zero. The reading position starts at one. On the first article, the list marked the second article as current. On the last article, nothing was marked as current.

Qodo also caught this, grouping it with the navigation finding. That was reasonable: both problems involved confusing indexes and positions.

### Numbers were sorted as strings

```diff
-    .sort((a, b) => a.data.series.order - b.data.series.order || a.id.localeCompare(b.id));
+    .sort((a, b) => String(a.data.series.order).localeCompare(String(b.data.series.order)) || a.id.localeCompare(b.id));
```

With orders `1`, `2` and `3`, this works as expected. With orders `1`, `2` and `10`, it produces:

```text
1, 10, 2
```

Our tests only used single-digit orders, so they didn't fail.

Qodo caught it and suggested restoring numeric comparison, with a regression test covering `1`, `2` and `10`.

I liked that the recommendation was specific. It identified the input we were missing and explained how it affected both the displayed list and the previous/next relationships.

### Published position came from the wrong value

```diff
-    position: index + 1,
+    position: series.order,
```

This one needs a little more context.

Imagine a series with three authored parts:

| Order | State |
|---:|---|
| 1 | Published |
| 2 | Draft |
| 3 | Published |

We exclude drafts from the navigation. Readers can see two articles, so the last one should display “Part 2 of 2.” Using its authored order instead produces “Part 3 of 2.”

Qodo's review discussed problems caused by non-contiguous orders, including incorrect links and current-page markers. But it didn't explicitly identify the incorrect position/count label.

I would count that as a **partial detection**. It recognized related navigation problems, but didn't describe this particular symptom.

## Why did that case get missed?

For the tests, the explanation is pretty clear. We already had a test for draft exclusion, but it checked the first published article. That article's authored order and published position were both `1`.

The test had a draft in the fixture, but it didn't inspect the article whose position changed because of that draft. It's easy to see a test called “excludes drafts” and assume that the whole behavior is covered.

For Qodo, I can't tell you exactly why it didn't report the count label. We don't have its internal reasoning traces. My hypothesis is that it followed the position value into the navigation links and current-page marker, but didn't fully trace it into this output:

```astro
Part {series.position} of {series.articles.length}
```

There are two different concepts here: where the author places a post in the complete series, and where that post appears among the currently published articles. They happen to match in most of the original examples.

This was a useful reminder for me: **a review can identify a faulty assumption without describing every place where that assumption causes problems.**

The first round therefore had three clear detections and one partial detection. All 47 tests still passed with the four defects present.

## Fixing the findings

Qodo's findings included severity, affected code locations, an explanation of the failure and a remediation prompt for a coding agent.

That made it easier to turn the review into specific work. For the sorting issue, for example, we had a clear change to make and a concrete missing test case.

To be clear about what we did here: **we rolled back the four mistakes we had deliberately introduced and fixed the three issues Qodo discovered in the original implementation.** We already knew how to undo the planted bugs. Qodo's review helped assess which failures it could recognize and gave us specific suggestions for regression coverage; it wasn't the source of every fix.

We added regression coverage for:

- Double-digit reading orders.
- Published positions when drafts leave gaps.
- Duplicate published orders.
- Conflicting series titles.
- Draft metadata being excluded from validation.

The suite grew from **47 to 52 tests**. We also checked the generated HTML for the existing series, including the actual link destinations and current-page markers.

The metadata problems now fail the build with errors identifying the affected articles, instead of silently generating inconsistent navigation.

After that, I wanted to try a less obvious mistake.

## A Unicode change that looked reasonable

> **What is string normalization?**
>
> Unicode can represent the same text with different character sequences. For example, `"\u00E9"` is a single `é` character, while `"e\u0301"` is an `e` followed by a combining accent. They can look identical, but JavaScript considers the original strings different. Normalization converts them to a chosen standard representation: calling `.normalize("NFC")` on both makes them equal.
>
> `NFKC` goes further by treating some other forms as equivalent too, such as the ligature `ﬃ` and the three letters `ffi`, or full-width `Ａ` and ASCII `A`. This can help when matching text for search, but it also removes distinctions. **Choosing a normalization form means deciding which differences your application can ignore.** For this blog, distinct article routes must keep their own identities during navigation lookup. The [Unicode normalization guide](https://www.unicode.org/reports/tr15/) explains these forms in more detail.

The [second experiment commit](https://github.com/KevLehman/abcdev/commit/b6c4a08) changed one comparison:

```diff
-  const index = parts.findIndex((article) => article.id === current.id);
+  const index = parts.findIndex((article) => article.id.normalize('NFKC') === current.id.normalize('NFKC'));
```

At a glance, normalizing strings before comparing them might look like an improvement. We handle Unicode more consistently, right?

The problem is that these IDs represent public article routes. Two different route IDs need to remain different, even if a normalization operation makes their text equivalent.

For example:

```javascript
const first = "office";
const second = "o\uFB03ce"; // Contains the ﬃ ligature

console.log(first === second);
// false

console.log(first.normalize("NFKC") === second.normalize("NFKC"));
// true
```

NFKC performs compatibility normalization. In this example, it converts the ligature into separate letters, while the article paths remain distinct:

```text
/office
/o%EF%AC%83ce
```

If both articles belong to the same series, opening the second one makes the normalized lookup match the first. That gives the second article the first article's position and neighbors. It can even produce a “Next” link pointing to itself.

All 52 tests passed. Typecheck and build passed. The generated HTML checks also passed for the existing articles, because none of their IDs had this collision.

A private reproduction script passed before the change and failed afterward, confirming the defect.

**Qodo caught it.** It supplied a different example too: ASCII `A` and full-width `Ａ`, which also become equal after NFKC normalization.

Its recommendation was to restore exact ID comparison and add a regression test with two distinct IDs that normalize to the same string. That matched the behavior we wanted.

The [updated review](https://github.com/KevLehman/abcdev/pull/10#issuecomment-6130888032) marked the five previous findings resolved and reported the new Unicode issue.

Before merging, we restored exact ID comparison and added regression tests for both the ligature and full-width examples. Both tests reproduced the wrong position and neighbors with normalization in place, then passed with the fix.

## Would I use Qodo?

Yes. The useful findings connected the code to its context: shared theme colors, public route identities and the difference between authored and published articles. Qodo's [Context Engine](https://docs.qodo.ai/core-concepts/context-engine) is designed to bring repository knowledge into reviews. I can't say which internal retrieval steps produced these findings, but those relationships mattered here.

{% embed https://docs.qodo.ai/core-concepts/context-engine %}

Its [Review Agent Suite](https://www.qodo.ai/blog/the-next-generation-of-ai-code-review-from-isolated-to-system-intelligence/) runs specialized agents in parallel. In practice, I worked with the PR comments and remediation prompts, and the next review recognized our fixes. Teams can also manage standards through [Qodo's rule system](https://www.qodo.ai/qodo-rules/), although I didn't test that here.

Across both rounds, Qodo clearly identified four of the five planted defects, partially described the fifth and found three issues in the original implementation. We still had to reproduce the findings and check the fixes. That connects to my previous article: reviewing code is part of learning how it works, and a useful comment gives you something specific to investigate.

{% embed https://kevinaleman.com/the-future-after-ai-2767 %}

Qodo gave me specific reasons to revisit code that had already passed the checks. That's useful when a coding agent can produce a working-looking implementation faster than I can read it. **Producing more code only helps if we can review it well enough to take responsibility for it.** Tools like Qodo can help with that work, but when I merge the PR, it's still my name on the commit.
