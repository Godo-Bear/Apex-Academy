# Notes for Claude

- The live site (GitHub Pages) deploys from `main`. Make changes on the working branch, never directly on `main`.
- After every change, show the user what changed (screenshots) and remind them to say "publish" when they want it live.
- On "publish": push the working branch to `main` (fast-forward), then confirm the Pages deployment succeeded.
- Before each publish, bump the `?v=` cache-busting value on the CSS/JS links in `index.html` (e.g. `?v=20261001b` → today's date plus a letter) so browsers load the new files instead of cached ones.
- When the Terms and Conditions text changes, bump `TERMS_VERSION` and update `TERMS_CHANGES` in `js/app.js` so every user sees the "terms have changed" pop-up and agrees again.
