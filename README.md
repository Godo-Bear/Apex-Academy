# Apex Learning Academy

Year 7 Victorian Curriculum maths and English practice.

A cleaner rebuild of the original single-file site (kept in `legacy/index.html` for reference).
It uses the same Supabase project, so existing accounts, points and progress carry over.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: login, paywall, app layout, modals |
| `css/styles.css` | All styling (light and dark themes) |
| `js/data.js` | Topics, questions, diagrams and writing prompts (copied unchanged) |
| `js/app.js` | App logic: auth, routing, pages, Supabase sync |

To add or edit questions, change `js/data.js`. Questions in the `custom_questions` table are still loaded too.

## Pages

- **Home**: stats, a suggested next topic, shortcuts
- **Practice**: topic list → sets of 5 questions (Easy / Medium / Hard), explanations, AI step-by-step; creative and essay writing with a timer, auto-saved drafts and AI feedback
- **Test**: pick topics, difficulty, question count and time limit, then review marked answers
- **Tutor**: AI chat, with optional photo of working
- **Progress**: mastery by topic, leaderboard (everyone / friends)
- **Admin** (only for `is_admin` accounts): mark accounts paid for 6 months, revoke, read feedback

## Running locally

It's a static site, so open `index.html` or serve the folder, for example `npx serve .`.
