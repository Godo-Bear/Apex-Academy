# Apex Learning Academy

Year 7 Victorian Curriculum maths and English practice.

A cleaner rebuild of the original single-file site (kept in `legacy/index.html` for reference).
It uses the same Supabase project, so existing accounts, points and progress carry over.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: login, paywall, app layout, modals |
| `css/styles.css` | All styling (light and dark themes) |
| `js/data.js` | Topics, questions, diagrams and writing prompts |
| `js/lessons.js` | The "Learn" explanation for each topic |
| `js/app.js` | App logic: auth, routing, pages, Supabase sync |

To add or edit questions, change `js/data.js`. Questions in the `custom_questions` table are still loaded too.

## Pages

- **Home**: stats, XP rank, a suggested next topic, shortcuts
- **Practice**: topic list → a Learn tab explaining the topic, then sets of 5 questions (Easy / Medium / Hard), explanations, AI step-by-step; creative and essay writing with a timer and AI feedback. Every piece saves automatically to "My writing". Writing has a Plan stage and a Write stage, each with its own customisable timer (preset or custom minutes, adjustable with −1/+1 while running). Essays can be customised (type, number of body paragraphs, target length, paragraph boxes); persuasive essays pick a side (for/against) and get 4 AI-generated pieces of evidence for each side
- **Test**: pick topics, difficulty, question count and time limit, then review marked answers. Optionally paste example questions and the AI writes a test in the same style (within the chosen topics, or based only on the examples)
- **Tutor**: AI chat, with optional photo of working
- **Progress**: XP rank and rank list, mastery by topic, leaderboard (everyone / friends)
- **Admin** (only for `is_admin` accounts): site stats; per account add/set points and XP, renew 6 months, make/remove admin, reset progress, kick/unkick, delete; reply to, resolve and clear feedback; bulk-import questions

## Running locally

It's a static site, so open `index.html` or serve the folder, for example `npx serve .`.

## Saving writing across devices

Writing is saved in the browser automatically. To also save it to Supabase (so it follows a student to other devices),
run `supabase/writings.sql` once in the Supabase SQL Editor.
