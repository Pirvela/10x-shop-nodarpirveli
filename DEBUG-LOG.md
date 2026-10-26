# 1. Push rejected on first push

- **Symptom:** `git push -u origin main` failed with "rejected (fetch first)".
- **Reproduction:** Created the GitHub repo with an auto-generated README, then pushed a local repo with its own history.
- **Tool:** Git CLI error output and hints.
- **Root cause:** The remote and local histories were unrelated: the remote had an "Initial commit" that did not exist locally, so the push would have overwritten it.
- **Fix:** Confirmed the remote contained only auto-generated files, then ran `git push --force` to replace it with the local history.
- **What I learned:** Create the remote repo empty when a local project already exists. `--force` is only safe when no one else's work is on the remote.
