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
