# 10X Shop — Final Report

## Planned vs delivered

Work started on October 26, so the project had 11 days instead of three weeks. I followed the plan's main rule: finish all CORE requirements first, then add FULL features.

### CORE — all done

| Module       | Requirement                                                                        | Status |
| ------------ | ---------------------------------------------------------------------------------- | ------ |
| React        | Components, props, children, callback props                                        | ✅     |
| React        | useState / useEffect, map + stable keys, conditional rendering                     | ✅     |
| React        | Router: `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, `*`                  | ✅     |
| React        | AuthContext + controlled login form with validation                                | ✅     |
| React        | Checkout redirect for guests, return after login                                   | ✅     |
| React        | CartContext with immutable updates, cart page with totals                          | ✅     |
| React        | Controlled checkout form, validation, local order confirmation                     | ✅     |
| TypeScript   | Strict mode, typed props / state / API data, typecheck = 0 errors                  | ✅     |
| Tailwind     | v4 integration, utility styling, flex / grid, responsive, hover / focus / disabled | ✅     |
| Optimization | Responsive at 375px, error boundary, debug log, Lighthouse report                  | ✅     |
| Process      | README, PLAN, REPORT, deploy, real Git history                                     | ✅     |

### FULL — partly done

| Done                                                                  | Not done                                 |
| --------------------------------------------------------------------- | ---------------------------------------- |
| Search with debounce (`useDebounce` custom hook)                      | Reviews, related products                |
| Category filter, sorting, pagination                                  | Promo code                               |
| All filters stored in the URL                                         | Orders and profile pages                 |
| `AbortController` for stale requests                                  | Formik + Yup                             |
| Route-level code splitting (`React.lazy`)                             | ApiClient / ApiError / OOP classes       |
| Toast notifications                                                   | Dark mode (BONUS)                        |
| Tailwind `@theme` design tokens                                       | GitHub Issues / Projects / pull requests |
| TypeScript: generics, type guards, discriminated union, utility types | Weekly progress notes, demo video        |
| 6 debug log entries                                                   |                                          |

**Why some FULL items were skipped:** with the late start, I chose the features with the most value for the time: catalog search and filters (the largest FULL React item), performance work and a stable, accessible CORE. I decided against adding dark mode in the last days because it touches almost every component and could have broken a working UI right before submission.

## Metrics

### Lighthouse (deployed site, incognito, Mobile)

| Metric         | Before | After | What changed                                      |
| -------------- | ------ | ----- | ------------------------------------------------- |
| Performance    | 90     | 88    | No change in code; the score varies between runs  |
| Accessibility  | 100    | 100   | —                                                 |
| Best Practices | 100    | 100   | —                                                 |
| SEO            | 83     | 100   | Added a meta description and a real `robots.txt`  |
| CLS            | —      | 0.068 | Target < 0.1 met (images have `width` / `height`) |

Reports: `docs/lighthouse/before.png`, `docs/lighthouse/after.png`

**Possible improvement:** LCP is 3.7 s on mobile. The first product images use `loading="lazy"` even though they are visible right away; loading them eagerly with `fetchPriority="high"` should lower LCP.

### Bundle size (gzip)

|         | Before code splitting | After code splitting |
| ------- | --------------------- | -------------------- |
| Main JS | 88.03 kB              | 84.82 kB             |
| Files   | 1                     | 1 main + 9 chunks    |

Most of the main bundle is React, React DOM and React Router. Pages are small (1.5–2 kB each), so the gain grows as more pages are added.

### Process

| Metric                 | Value                         |
| ---------------------- | ----------------------------- |
| Commits                | 42                            |
| Pull requests / Issues | 0 (worked directly on `main`) |
| Hours                  | Not tracked precisely         |

## Compatibility

Tested the full flow (catalog → product → cart → login → checkout → confirmation) in:

| Browser | Desktop | Mobile (375px emulation) |
| ------- | ------- | ------------------------ |
| Chrome  | ✅      | ✅                       |
| Firefox | ✅      | ✅                       |

## Three hardest problems

1. **Stale responses in the catalog.** When filters change quickly, an older request can finish after a newer one and overwrite the results. I cancel the previous request with `AbortController` in the `useEffect` cleanup and tag each result with the request it belongs to, so loading is derived from state instead of stored separately.

2. **Keeping filters in the URL.** Storing search, category, sort and page in `useState` would lose them on refresh and break the back button. I made the URL the single source of truth with `useSearchParams`. Search was tricky: updating the URL on every key worked for the input, so I debounced the _request_ (not the input) and used `replace` so each typed letter does not create a history entry.

3. **Problems that only appear after deploy.** Refreshing `/products/5` returned 404 on Vercel until I added an SPA rewrite. Later the same rewrite made `/robots.txt` return HTML, which lowered the SEO score; a real file in `public/` fixed it. A file name that differed only in letter case worked on Windows but would have failed on Vercel's Linux build. Details are in `DEBUG-LOG.md`.

## What I would do differently

- Start on day one. Losing the first week meant skipping some FULL features.
- Track hours per task from the start.
- Use GitHub Issues and feature branches with pull requests, even when working alone.
- Write each debug log entry right after fixing the bug, with the commit link.

## AI usage

I used Claude as a tutor and pair programmer. For each step I asked for the concept first and then the code, which I applied as small find-and-replace changes, checked with `typecheck` and `lint`, and tested in the browser before committing. I made the decisions about scope, design (I chose the neo-brutalist style from a reference) and order of work, and wrote every commit myself. I decided against some suggestions and ideas, such as adding a chatbot (outside the requirements) and dark mode right before the deadline (risk to a working UI). AI-generated code also had to be debugged: errors such as a missing import usage and a file-casing conflict were found by me through TypeScript and testing.
