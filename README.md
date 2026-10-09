# Apex Learning Academy

Year 7 Victorian Curriculum maths, English and science practice.

A cleaner rebuild of the original single-file site (kept in `legacy/index.html` for reference).
It uses the same Supabase project, so existing accounts, points and progress carry over.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: login, paywall, app layout, modals |
| `css/styles.css` | All styling (light and dark themes) |
| `js/data.js` | Topics, questions, diagrams and writing prompts |
| `js/lessons.js` | The "Learn" explanation for each topic |
| `js/visuals.js` | Diagrams and interactive answers (Cartesian plane, number lines, shading, protractor, order, match, tap-the-word) plus the Learn tab's "Try it" explorers |
| `js/sci-visuals.js` | Science diagrams (particles, Moon phases, seasons, tides, forces, levers, pulleys, lab equipment, separating set-ups, chromatograms, food webs, keys…) plus the tap-the-picture and sort answer widgets |
| `js/science.js` | The 8 Year 7 science topics (Science toolkit, Classification, Ecosystems, Resources, Earth Sun and Moon, Forces, Particle theory, Mixtures) with lessons and ~45 questions each |
| `js/uploads.js` | File uploads for making tests: reads PDFs, Word, PowerPoint, text and photos in the browser and sends their text and pictures to the AI |
| `js/public-tests.js` | Public tests: share a test so everyone can find and take it (the `public_tests` table — run `supabase/public-tests.sql`); bank questions are shared by reference, AI questions are cleaned when opened |
| `js/ai-memory.js` | AI memory: saved AI tutor chats (the tutor sees earlier messages, and you can go back to old chats) and short notes the AI remembers about each student, used by every AI chat; managed in Settings (the `ai_chats` and `ai_memory` tables — run `supabase/ai-memory.sql`), with a device-only fallback |
| `js/calendar.js` | Calendar on the Notes & calendar page: tests, assignments, reminders and notes by date, "Quick add" with the AI, practice test / flashcards / study plan buttons, a "Coming up" pop-up at log-in and card on Home; the AI sees what's coming up (the `calendar_events` table — run `supabase/calendar.sql`), with a device-only fallback |
| `js/notes.js` | My notes: named notes for each topic, in a panel next to the questions and on the Notes & calendar page (saved to the `notes` table — run `supabase/notes.sql` — with a copy on the device) |
| `js/bank.js` | Upgrades to the question bank: tap-to-answer choices, diagrams on existing questions, new interactive questions, and the Cartesian Plane topic |
| `js/study.js` | The Test page's AI modes: AI test chat, flashcards, and info & ideas pages |
| `js/app.js` | App logic: auth, routing, pages, Supabase sync |

To add or edit questions, change `js/data.js` (plain questions) or `js/bank.js` (interactive/visual ones — any question can have a `visual: { type, … }`; see the top of `js/visuals.js`). Questions in the `custom_questions` table are still loaded too.

## Pages

- **Home**: stats, XP rank, a suggested next topic, shortcuts
- **Practice**: topic list → a Learn tab explaining the topic (maths topics also have a "Try it" interactive explorer), then sets of 5 questions — many are interactive (plot points, place on a number line, shade, turn an angle, order, match, tap a word) or have a diagram (Easy / Medium / Hard), explanations, AI step-by-step; creative and essay writing with a timer and AI feedback. Every piece saves automatically to "My writing". Writing has a Plan stage and a Write stage, each with its own customisable timer (preset or custom minutes, adjustable with −1/+1 while running). Essays can be customised (type, number of body paragraphs, target length, paragraph boxes); persuasive essays pick a side (for/against) and get 4 AI-generated pieces of evidence for each side
- **Test & study** — four modes:
  - *Pick topics*: pick topics, difficulty, question count and time limit, then review marked answers. Optionally paste example questions and the AI writes a test in the same style
  - *AI test*: chat with the AI about any subject and question types; it writes questions (including interactive ones) straight into a test you can keep adding to or changing, then start
  - *Flashcards*: the AI makes decks you can flip, swipe, sort into "got it" / "still learning", shuffle, edit and quiz yourself on (practice only — no points)
  - *Info & ideas*: the AI makes an interactive page on anything (sections, diagrams, tap-to-reveal key terms, facts, a quick check), which can be turned into flashcards or a test
  Flashcard decks and info pages are saved on the device (localStorage)
- **Tutor**: AI chat, with optional photo of working
- **Progress**: XP rank and rank list, mastery by topic, leaderboard (everyone / friends)
- **Admin** (only for `is_admin` accounts): site stats; per account add/set points and XP, renew 6 months, make/remove admin, reset progress, kick/unkick, delete; reply to, resolve and clear feedback; bulk-import questions

## Where it's hosted

- Cloudflare Workers: https://apex-academy.jaydennarayan5.workers.dev (settings in `wrangler.jsonc`; `.assetsignore` keeps non-site files offline)
- GitHub Pages: https://godo-bear.github.io/Apex-Academy/

Both update automatically from the `main` branch.

## Running locally

It's a static site, so open `index.html` or serve the folder, for example `npx serve .`.

## Saving writing across devices

Writing is saved in the browser automatically. To also save it to Supabase (so it follows a student to other devices),
run `supabase/writings.sql` once in the Supabase SQL Editor.

## Announcements

Admins can send an announcement to everyone from the Admin page. Run `supabase/announcements.sql`
once in the Supabase SQL Editor to turn this on.

## Events

Admins can run boost events (Double Points, Triple XP, tests-only or practice-only boosts) from the
Admin page. Everyone sees a banner while one is on. Run `supabase/events.sql` once in the Supabase
SQL Editor to turn this on.
