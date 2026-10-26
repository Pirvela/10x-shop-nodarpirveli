# 10X Shop — Project Plan

## Goal

An online shop SPA built with React + TypeScript + Tailwind CSS v4, using the DummyJSON API.
Priority: complete all CORE requirements first, then FULL features if time allows.

## Scope

| Module       | CORE (must)                                                                                                   | FULL (if time allows)                                |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| React        | Components, props/children, useState/useEffect, Router, Context (Auth, Cart), controlled Login/Checkout forms | Search/category/sort/pagination in URL, custom hooks |
| TypeScript   | Strict mode, typed props/state/API data, typecheck = 0 errors                                                 | Generics, type guards, ApiClient/ApiError            |
| Tailwind CSS | v4 integration, utility styling, flex/grid, responsive, hover/focus/disabled                                  | @theme design tokens                                 |
| Optimization | Responsive pages, Error Boundary, DEBUG-LOG, basic debugging                                                  | Lazy routes, Lighthouse before/after                 |
| Process      | README, PLAN, REPORT, deploy, real Git history                                                                | —                                                    |

## Timeline

**Week 2**
| Epic | Tasks | Est. hours |
|---|---|---|
| Setup | Vite, TS strict, Tailwind v4, ESLint, GitHub repo, PLAN.md | 2 |
| Layout | Types, Router, Layout/Header, 404, early deploy | 3 |
| Catalog | Fetch products, loading/error/empty, ProductCard/Grid | 4 |
| Product | Product details page, Add to cart | 3 |
| Cart | CartContext, Cart page (quantity, remove, total) | 4 |
| Auth | AuthContext, Login form, Checkout redirect | 3 |

**Week 3**
| Epic | Tasks | Est. hours |
|---|---|---|
| Checkout | Controlled form, validation, order confirmation | 3 |
| Quality | Responsive (375px), interaction states, Error Boundary, a11y | 4 |
| Quality | Typecheck/lint/build clean, deploy SPA refresh check | 2 |
| Docs | README (EN), REPORT.md, DEBUG-LOG.md | 3 |
| FULL | Search/category/sort/pagination, @theme (optional) | 4 |
| Submit | Final QA and submission (before Nov 6, 23:59) | 1 |

## Risks

1. **Short timeline (started late).** Mitigation: CORE first, FULL only after the full CORE flow works.
2. **DummyJSON API unavailable or slow.** Mitigation: clear error state in the UI; app never crashes on API failure.
3. **SPA routes break on refresh after deploy.** Mitigation: deploy early (day 2) and add the SPA rewrite config right away.
4. **Gaps in React/TypeScript knowledge.** Mitigation: learn each concept before implementing it; review before the Nov 5 quiz.

## Definition of Done (each task)

- Works in the browser according to the PRD acceptance criteria
- `npm run typecheck`, `npm run lint` and `npm run build` pass
- Looks correct at 375px and on desktop
- Committed with a meaningful message
