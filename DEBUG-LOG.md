# 1. Push rejected on first push

- **Symptom:** `git push -u origin main` failed with "rejected (fetch first)".
- **Reproduction:** Created the GitHub repo with an auto-generated README, then pushed a local repo with its own history.
- **Tool:** Git CLI error output and hints.
- **Root cause:** The remote and local histories were unrelated: the remote had an "Initial commit" that did not exist locally, so the push would have overwritten it.
- **Fix:** Confirmed the remote contained only auto-generated files, then ran `git push --force` to replace it with the local history.
- **What I learned:** Create the remote repo empty when a local project already exists. `--force` is only safe when no one else's work is on the remote.

## 2. "Unknown at rule @theme" error in VS Code

- **Symptom:** VS Code underlined `@theme` in `src/index.css` with a red squiggle and showed 1 problem ("Unknown at rule @theme").
- **Reproduction:** Added the `@theme { ... }` block with custom design tokens to `src/index.css` and opened the file in VS Code.
- **Tool:** VS Code Problems panel; confirmed with `npm run build`, which completed with no errors and applied the custom colors in the browser.
- **Root cause:** `@theme` is a Tailwind CSS v4 directive, not standard CSS. VS Code's built-in CSS language server does not recognize it. The Tailwind Vite plugin processes the file before the browser sees it, so the code itself was valid.
- **Fix:** Installed the Tailwind CSS IntelliSense extension and associated `*.css` files with the `tailwindcss` language mode in VS Code settings.
- **What I learned:** An editor warning is not always a code error. I check whether the build and the browser actually fail before changing code. The extension also adds autocomplete for my own theme tokens (e.g. `bg-sun`).

## 3. File name casing conflict (ProductCard.tsx vs productcard.tsx)

- **Symptom:** TypeScript error TS1149 on `import ProductCard from "./ProductCard"`: "File name differs from already included file name only in casing."
- **Reproduction:** Created the component file with a lowercase name, then renamed it to `ProductCard.tsx`, while one reference still used the old name.
- **Tool:** VS Code Problems panel and `npm run typecheck`; project-wide search (Ctrl+Shift+F) for `productcard`.
- **Root cause:** Windows file system is case-insensitive, so both names pointed to the same file locally. Vercel builds on Linux, which is case-sensitive, so the wrong casing would break the production build with "Cannot find module".
- **Fix:** Renamed the file to `ProductCard.tsx`, fixed the import to match exactly, and restarted the TS server. (commit link)
- **What I learned:** Import paths must match file names exactly, including letter case. Something that works on Windows can still fail on the deploy server.

## 4. "Add to cart" in the catalog did nothing (caught by TypeScript)

- **Symptom:** TypeScript error TS6133 in `CatalogPage.tsx`: "'addItem' is declared but its value is never read." In the browser, clicking "Add to cart" on a catalog card did not update the cart badge.
- **Reproduction:** After adding `CartContext`, I took `addItem` from `useCart()` in `CatalogPage`, but `handleAdd` still contained the temporary `console.log` from the previous day.
- **Tool:** VS Code Problems panel / `npm run typecheck` (`noUnusedLocals: true` in tsconfig).
- **Root cause:** The placeholder handler was never replaced, so the button only logged to the console.
- **Fix:** Replaced the `console.log` in `handleAdd` with `addItem(product, 1)`. (commit link)
- **What I learned:** Strict compiler options do more than enforce style: an "unused variable" warning pointed to a missing step that would have been a silent bug in production.

## 5. Stray text inside form error messages

- **Symptom:** Every validation error on the login form started with "npm run typecheck", e.g. "npm run typecheckUsername is required".
- **Reproduction:** Submit the login form with empty fields.
- **Tool:** Manual testing in the browser; project-wide search (Ctrl+Shift+F) for the text.
- **Root cause:** A terminal command was accidentally pasted into the JSX of the error `<p>` in `TextField.tsx`. Text between JSX tags is valid, so neither TypeScript nor ESLint reported it.
- **Fix:** Removed the stray text from `TextField.tsx`. (commit link)
- **What I learned:** Type checking and linting do not replace looking at the UI. Every step should be checked in the browser too.

## 6. robots.txt reported as invalid by Lighthouse

- **Symptom:** Lighthouse SEO score was 83 with "robots.txt is not valid".
- **Reproduction:** Run Lighthouse (Mobile) on the deployed site; open `/robots.txt` in the browser — it shows the shop instead of a text file.
- **Tool:** Lighthouse SEO audit; opening the URL directly.
- **Root cause:** The SPA rewrite in `vercel.json` sends every unknown path to `index.html`, including `/robots.txt`, so crawlers received HTML.
- **Fix:** Added a real `public/robots.txt` (Vercel serves existing files before applying rewrites) and a meta description. SEO went from 83 to 100. (commit link)
- **What I learned:** A catch-all rewrite fixes client-side routes but also hides missing static files. Every rewrite rule can have side effects.
