# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes, followed by project-specific instructions.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Project-specific instructions (ICT Option website)

## Stack and commands
- React 18 + Vite 5, **JavaScript/JSX only. No TypeScript.**
- `npm install`, `npm run dev`, `npm run build` (client build, server build, then `prerender.js` writes every page to `dist/`), `npm run preview`.
- Every page must stay prerendered (crawlable HTML). Do not make content depend on client-only rendering.
- There are no automated tests. Verify with `npm run build` (must end with "Prerendered N pages"), then check for broken `/assets/...` and internal links in `dist/`.

## Where things live
- `src/routes.jsx`: every route with its SEO title, description, breadcrumbs and schema. New pages go here.
- `src/pages/Pages.jsx`: one wrapper per page. `src/components/Imported.jsx` renders page content from `src/content/imported.json`; `Widgets.jsx` holds the quiz, tech-gap, chat, phones, before/after and gallery; `forms.jsx` the validated forms; `Layout.jsx` header, footer and cookie banner.
- `src/content/*.json`: copy and lists. `[[text]]` renders as an amber placeholder for content management must supply.
- `src/styles/`: `tokens.css`, `base.css`, `site.css`, `imported.css`, `motion.css`, `landing.css`.
- `src/motion/site.js`: site-wide animation. `src/landing/`: the separate `/landing` page with its own motion (`motion.js`).

## Rules for this project
- Design system: neon blue on deep navy (see `tokens.css`). **No red anywhere**; coral `#FF6B7A` is for form validation only.
- Landing CSS is scoped under `.ld` and its colliding class names carry an `ld-` prefix. Keep it isolated; do not add landing rules outside `.ld`.
- Respect reduced motion: every animation must be skipped when `prefers-reduced-motion: reduce` is set.
- Sample content (names, numbers, reviews, partners, prices, projects, hours) is marked "Sample content" while `markSamples` is true in `src/content/site.json`. Never invent new facts, numbers or reviews. Real content comes from management.
- Forms send only when `formEndpoint` is set in `site.json`. Every form needs a consent checkbox and the honeypot field.
- Change only what is asked. Mention, do not fix, unrelated problems (known: large main JS bundle from `imported.json`).
