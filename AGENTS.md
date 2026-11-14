# Project rules

Apply these rules to all writing and editing for this project, including articles, titles, excerpts, captions, documentation and user-facing replies. See [README.md](README.md) for project commands and content conventions.

## Writing voice

- Be concise, with impact. Use concrete language and direct statements; cut padding before cutting substance. Keep a natural rhythm instead of turning every sentence into a short punchline.
- Match the author's recent published work. Useful references: `src/content/articles/the-future-after-ai-2767.md`, `src/content/articles/i-used-ai-to-cheat-my-way-to-a-156-day-reading-streak.md` and `src/content/articles/proof-driven-development.md`. Read relevant passages when needed, not the whole archive.
- Write like an engineer working through a real problem: practical, conversational, skeptical and willing to take responsibility. Use humor only where it comes naturally; don't manufacture jokes or personal experiences.
- Open with a concrete event, observation or technical dilemma. Avoid staged conversations, invented reactions such as "Great, close the ticket", and generic stories about what AI can do.
- State the point directly. Remove preambles such as "It's also a good example of something I think gets lost" and defensive passages arguing against a position nobody raised.
- Let evidence carry the argument. Don't follow every example with another version of the same lesson. Keep necessary transitions; remove repeated summaries.
- Prefer short, specific titles and conversational headings that fit the article's actual scope. Avoid vague phrases such as "solving code" and claims broader than the evidence.
- End with a brief, clear position or decision. Avoid a full recap, generic advice, a forced slogan or a separate punchline added just to sound memorable.
- Approved example of tone: "I'd use AI to find the bug and help fix it. But if I can't explain why the patch works, I'm not ready to ship it." Follow its directness, not its wording as a reusable template.

## Claims and technical accuracy

- Check factual claims against primary sources. Verify dates, counts, versions and attribution; place links near the claims they support. Keep opinions distinguishable from reported facts.
- Preserve qualifications when shortening prose. Don't turn "some", "under these conditions" or "for the cases discussed" into universal claims.
- Distinguish a suspected flaw, a reproducible failure, a working exploit, a verified patch and a deployed fix. State relevant starting assumptions, such as an already compromised process.
- Distinguish what an organization observed itself from reports it cited, and exploitation attempts from successful compromise. Date statements about exploitation status.
- Explain what a benchmark actually tests, which models and version it used, and what its score means. Don't present secure implementation tasks as vulnerability-repair tasks or older results as current model failure rates.
- Avoid unsupported claims that only humans can investigate or verify something. Describe the evidence required and who is responsible for accepting it.
- Review runnable code examples for correctness; use the narrowest meaningful test when tests are in scope. Label pseudocode and simplified examples, including material assumptions. Don't claim a source review reproduced an exploit.

## Editing and delivery

- For article figures, use Markdown blockquotes starting with `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!STEPS]`, `[!TIMELINE]`, `[!TABLE]`, or `[!CHART]` and an optional title. Follow the marker with a blank quoted line and ordinary Markdown: prose for notes, lists for steps and timelines, tables for comparisons, or labeled text for charts. Use figures only when they clarify the adjacent text; retain real values and a readable text alternative.
- Make the smallest complete edit. Preserve existing public slugs and publication flags (`draft`, `unlisted`, `featured`) unless the user asks to change them. A request to push prose does not mean to list an unlisted article.
- Search before reading; use `rg`, focused ranges and existing repository patterns. Prefer LSP for symbols and ast-grep for structural changes. Don't use Python for routine scripts.
- Before broad reading or editing, run `code-deep explore "<goal, paths and data flow or blast radius>" --path /absolute/git/root --detail minimal`. After changes, run `code-deep review /absolute/git/root --detail minimal --json`; add both `--base <ref>` and `--head <ref>` for a commit range. If unavailable, use `npx -y @team-harness/code-deep@3.0.2` in place of `code-deep`.
- Process code-deep review items by descending risk. Follow omissions, low confidence or warnings with targeted exploration; use `--detail standard` for bounded context. Scores are leads, not proven defects: verify concrete failure paths against the diff before reporting them.
- When a change consists solely of Markdown files or images, omit tests. Keep the applicable diff and build checks below.
- For article edits, run `git diff --check` and `npm run build`, then confirm the relevant text appears in the generated article. Instruction-only edits need a diff review, not an application build or new tests.
- Review and commit only the intended files. Leave unrelated work and generated exploration artifacts out. Use an explicit commit range for code-deep review when untracked work would otherwise pollute the result.
- When pushing is authorized, finish the checks, commit and push without asking again. Report what changed, what passed and any relevant unchecked outcome; don't claim a live deployment was verified from a successful push alone.
