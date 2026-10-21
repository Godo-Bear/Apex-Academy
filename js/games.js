/* =========================================================
   JINtelligence — Games
   Pick a subject (or General = every subject mixed) and a mode:
   · Against the clock: choose how many questions and how long you get.
   · 3 Lives: questions get harder as you go; three wrong answers ends the game.
   Uses the same questions, marking and points as Practice.
========================================================= */

const GAME_SUBJECTS = [
  { id: "general", name: "General", icon: "🌐", desc: "Every subject mixed together" },
  { id: "maths", name: "Maths", icon: "➗", desc: "Numbers, algebra, shapes and more" },
  { id: "english", name: "English", icon: "📖", desc: "Grammar, reading and words" },
  { id: "science", name: "Science", icon: "🔬", desc: "Forces, space, living things and more" },
];
const GAME_MODES = [
  { id: "clock", name: "Against the clock", icon: "⏱️", desc: "Pick how many questions and how long you get. Beat the timer!" },
  { id: "lives", name: "3 Lives", icon: "❤️", desc: "Questions get harder and harder. Three wrong answers and it's game over." },
];
const GAME_COUNTS = [5, 10, 15, 20, 30, 50];
// "q" = seconds for each question, "t" = seconds for the whole game.
const GAME_TIMES = [
  { v: "q10", label: "10 seconds a question" }, { v: "q20", label: "20 seconds a question" },
  { v: "q30", label: "30 seconds a question" }, { v: "q60", label: "1 minute a question" },
  { v: "t60", label: "1 minute in total" }, { v: "t120", label: "2 minutes in total" },
  { v: "t180", label: "3 minutes in total" }, { v: "t300", label: "5 minutes in total" }, { v: "t600", label: "10 minutes in total" },
];
const LIVES = 3;
const LEVEL_UP_EVERY = 3; // correct answers needed to move up a difficulty
const LEVEL_NAMES = { 1: "Easy", 2: "Medium", 3: "Hard" };

const gameSettingsKey = () => `apex-game-settings-${authUser.id}`;
const gameBestKey = () => `apex-game-best-${authUser.id}`;
const timeLabel = (v) => (GAME_TIMES.find((t) => t.v === v) || GAME_TIMES[1]).label;
const bestId = (s) => (s.mode === "lives" ? `lives:${s.subject}` : `clock:${s.subject}:${s.count}:${s.time}`);

// Every bank question for a subject ("general" = all), except written answers, which need the AI to mark.
function gamePool(subject) {
  return QUIZ_TOPICS.filter((t) => subject === "general" || t.subject === subject)
    .flatMap((topic) => topic.questions.filter((q) => q.answerType !== "written").map((q) => ({ q, topic })));
}

function pageGames(view) {
  const saved = store(gameSettingsKey()) || {};
  const s = {
    subject: GAME_SUBJECTS.some((x) => x.id === saved.subject) ? saved.subject : "general",
    mode: GAME_MODES.some((x) => x.id === saved.mode) ? saved.mode : "clock",
    count: GAME_COUNTS.includes(saved.count) ? saved.count : 10,
    time: GAME_TIMES.some((t) => t.v === saved.time) ? saved.time : "q20",
  };
  const best = store(gameBestKey()) || {};

  view.innerHTML = `
    <div class="page-head"><h1>Games</h1><p>Pick a subject and a game. Every right answer earns points, just like Practice.</p></div>
    <div class="card stack game-setup">
      <div>
        <label class="field">1. Choose a subject</label>
        <div class="game-pick cols-4" id="g-subjects">
          ${GAME_SUBJECTS.map((x) => `<button type="button" class="game-opt" data-subject="${x.id}" aria-pressed="false">
            <span class="g-ico">${x.icon}</span><b>${x.name}</b><span class="muted small">${x.desc}</span></button>`).join("")}
        </div>
      </div>
      <div>
        <label class="field">2. Choose a game</label>
        <div class="game-pick cols-2" id="g-modes">
          ${GAME_MODES.map((x) => `<button type="button" class="game-opt" data-mode="${x.id}" aria-pressed="false">
            <span class="g-ico">${x.icon}</span><b>${x.name}</b><span class="muted small">${x.desc}</span></button>`).join("")}
        </div>
      </div>
      <div id="g-clock-opts" class="grid game-opts">
        <div><label class="field" for="g-count">Number of questions</label>
          <select id="g-count">${GAME_COUNTS.map((n) => `<option value="${n}"${n === s.count ? " selected" : ""}>${n} questions</option>`).join("")}</select></div>
        <div><label class="field" for="g-time">Time</label>
          <select id="g-time">
            <optgroup label="For each question">${GAME_TIMES.filter((t) => t.v[0] === "q").map((t) => `<option value="${t.v}"${t.v === s.time ? " selected" : ""}>${t.label}</option>`).join("")}</optgroup>
            <optgroup label="For the whole game">${GAME_TIMES.filter((t) => t.v[0] === "t").map((t) => `<option value="${t.v}"${t.v === s.time ? " selected" : ""}>${t.label}</option>`).join("")}</optgroup>
          </select></div>
      </div>
      <div id="g-lives-opts" class="game-rules">
        <span>❤️❤️❤️ You start with 3 lives.</span>
        <span>📈 Every ${LEVEL_UP_EVERY} right answers, the questions level up: Easy → Medium → Hard.</span>
        <span>💀 Lose all 3 lives and the game ends. How far can you get?</span>
      </div>
      <div class="row between">
        <span class="muted small" id="g-best"></span>
        <button class="btn" type="button" id="g-start">Start game →</button>
      </div>
    </div>`;

  const draw = () => {
    $$("[data-subject]", view).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.subject === s.subject)));
    $$("[data-mode]", view).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === s.mode)));
    $("#g-clock-opts", view).classList.toggle("hidden", s.mode !== "clock");
    $("#g-lives-opts", view).classList.toggle("hidden", s.mode !== "lives");
    const b = best[bestId(s)];
    $("#g-best", view).textContent = b == null ? "No best score yet for this game." :
      s.mode === "lives" ? `🏆 Your best: ${b} right` : `🏆 Your best: ${b}/${s.count}`;
  };
  $$("[data-subject]", view).forEach((b) => b.addEventListener("click", () => { s.subject = b.dataset.subject; draw(); }));
  $$("[data-mode]", view).forEach((b) => b.addEventListener("click", () => { s.mode = b.dataset.mode; draw(); }));
  $("#g-count", view).addEventListener("change", (e) => { s.count = +e.target.value; draw(); });
  $("#g-time", view).addEventListener("change", (e) => { s.time = e.target.value; draw(); });
  $("#g-start", view).addEventListener("click", () => { store(gameSettingsKey(), s); playGame(view, { ...s }); });
  draw();
}

function playGame(view, s) {
  const subject = GAME_SUBJECTS.find((x) => x.id === s.subject);
  const pool = gamePool(s.subject);
  if (!pool.length) { toast("No questions for that subject yet."); return pageGames(view); }

  const lives = s.mode === "lives";
  const perQ = !lives && s.time[0] === "q" ? +s.time.slice(1) : 0;
  const total = !lives && s.time[0] === "t" ? +s.time.slice(1) : 0;
  // Against the clock: a fixed, shuffled list. 3 Lives: a shuffled queue for each difficulty.
  const list = lives ? null : shuffle(pool).slice(0, s.count);
  const queues = lives ? { 1: [], 2: [], 3: [] } : null;
  if (lives) shuffle(pool).forEach((x) => (queues[x.q.difficulty] || queues[2]).push(x));

  const state = { i: 0, right: 0, lives: LIVES, level: 1, results: [], answers: [], over: false, current: null };
  let tick = null, left = 0, totalLeft = total, waiting = false, nextTimer = null;
  leaveWarning = "Leave the game? Your score won't be saved.";

  view.innerHTML = `
    <div class="game-hud card">
      <div class="g-title"><span class="g-ico">${lives ? "❤️" : "⏱️"}</span><div><b>${lives ? "3 Lives" : "Against the clock"}</b><span class="muted small">${subject.icon} ${subject.name}</span></div></div>
      <div class="g-stats" id="g-stats"></div>
    </div>
    <div class="time-bar hidden" id="g-bar"><div></div></div>
    <form class="card game-card" id="g-form" autocomplete="off"></form>
    <div class="row between" style="margin-top:12px;">
      <button class="btn ghost" type="button" id="g-quit">End game</button>
      <span class="muted small" id="g-hint">Press Enter to check your answer.</span>
    </div>`;
  const form = $("#g-form", view), stats = $("#g-stats", view), bar = $("#g-bar", view);

  const clock = (sec) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, "0")}`;
  function drawStats() {
    stats.innerHTML = lives
      ? `<span class="hearts" aria-label="${state.lives} lives left">${"❤️".repeat(state.lives)}<span class="lost">${"🖤".repeat(LIVES - state.lives)}</span></span>
         <span class="pill-stat">Level <b>${LEVEL_NAMES[state.level]}</b></span>
         <span class="pill-stat">Score <b>${state.right}</b></span>`
      : `<span class="pill-stat">Question <b>${Math.min(state.i + 1, list.length)}/${list.length}</b></span>
         <span class="pill-stat">Score <b>${state.right}</b></span>
         <span class="timer pill-stat${(perQ ? left : totalLeft) <= 5 ? " low" : ""}" id="g-clock">⏱ ${clock(perQ ? left : totalLeft)}</span>`;
  }
  function drawBar() {
    const frac = perQ ? left / perQ : total ? totalLeft / total : 0;
    $("div", bar).style.width = `${Math.max(0, frac) * 100}%`;
    bar.classList.toggle("low", frac <= 0.25);
  }

  // Next question for 3 Lives: from the current level, or the nearest level that still has questions.
  function nextLives() {
    for (const lv of [state.level, state.level + 1, state.level - 1, 3, 2, 1]) if (queues[lv]?.length) return queues[lv].shift();
    return null;
  }
  function nextQuestion() {
    clearTimeout(nextTimer);
    waiting = false;
    if (state.over) return;
    const item = lives ? nextLives() : list[state.i];
    if (!item) return endGame(lives ? "You answered every question. Legend!" : "");
    state.current = item;
    form.classList.remove("flash-good", "flash-bad");
    form.innerHTML = `
      ${questionHTML(item.q, state.results.length, `${item.topic.icon || ""} ${item.topic.name} · ${DIFF_NAMES[item.q.difficulty]}`, !!item.q.passage)}
      <div class="row" style="margin-top:14px;" id="g-actions"><button class="btn" type="submit" id="g-check">Check</button></div>`;
    wireQuestions(form, [item.q]);
    $(FOCUS_SEL, form)?.focus({ preventScroll: true });
    if (perQ) { left = perQ; show(bar); }
    if (total) show(bar);
    drawStats(); drawBar();
  }

  function answerOf() { return $("input[data-qid], textarea[data-qid]", form)?.value ?? ""; }
  function check(timedOut = false) {
    if (waiting || state.over || !state.current) return;
    const raw = answerOf();
    if (!timedOut && !String(raw).trim()) { toast("Pick or type an answer first."); return; }
    waiting = true;
    const { q, topic } = state.current;
    const correct = !timedOut && isAnswerCorrect(q, raw);
    state.results.push({ q, topic, correct });
    state.answers.push(raw);
    if (correct) state.right += 1;
    const row = $(".question", form);
    markQuestion(row, q, correct, { yourAnswer: raw });
    if (timedOut) $(".q-result", row).textContent = `⏰ Time's up! The answer is ${displayAnswer(q)}`;
    form.classList.add(correct ? "flash-good" : "flash-bad");
    if (lives) {
      if (!correct) state.lives -= 1;
      else if (state.right % LEVEL_UP_EVERY === 0 && state.level < 3) { state.level += 1; toast(`Level up! Now ${LEVEL_NAMES[state.level]} ⬆️`); }
    } else state.i += 1;
    drawStats();
    const done = lives ? state.lives <= 0 : state.i >= list.length;
    const actions = $("#g-actions", form);
    actions.innerHTML = `<button class="btn" type="button" id="g-next">${done ? "See results →" : "Next question →"}</button>`;
    $("#g-next", form).addEventListener("click", () => (done ? endGame(lives ? "Out of lives!" : "") : nextQuestion()));
    $("#g-next", form).focus({ preventScroll: true });
    // Right answers move on by themselves; wrong ones wait so you can read the answer.
    if (correct && !done) nextTimer = setTimeout(nextQuestion, 900);
  }
  form.addEventListener("submit", (e) => { e.preventDefault(); waiting ? $("#g-next", form)?.click() : check(); });

  tick = setInterval(() => {
    if (state.over) return;
    if (total) {
      totalLeft -= 1; // the whole-game clock keeps running, even while you read an answer
      if (totalLeft <= 0) { drawStats(); drawBar(); return endGame("Time's up!"); }
    }
    if (perQ && !waiting) {
      left -= 1;
      if (left <= 0) { left = 0; check(true); }
    }
    drawStats(); drawBar();
  }, 1000);
  cleanup = () => { clearInterval(tick); clearTimeout(nextTimer); };

  $("#g-quit", view).addEventListener("click", () => {
    if (!state.results.length) { leaveWarning = null; return route(); }
    if (confirm("End the game now? You'll still get points for what you've answered.")) endGame("You ended the game.");
  });

  function endGame(message) {
    if (state.over) return;
    state.over = true;
    clearInterval(tick); clearTimeout(nextTimer);
    leaveWarning = null;
    flushPendingAnnouncement();
    const answered = state.results.length;
    const earned = answered ? recordResults(state.results) : 0;
    const score = state.right;
    const best = store(gameBestKey()) || {};
    const key = bestId(s), prev = best[key];
    const isBest = answered > 0 && (prev == null || score > prev);
    if (isBest) { best[key] = score; store(gameBestKey(), best); }
    const pct = answered ? Math.round((score / answered) * 100) : 0;
    const headline = lives ? `${score} right` : `${score}/${list.length}`;

    view.innerHTML = `
      <div class="page-head"><h1>${lives ? "Game over" : "Finished!"}</h1><p>${esc(message || (lives ? "" : "Nice work."))}</p></div>
      <div class="card game-over">
        <div class="g-big">${headline}</div>
        ${isBest ? `<div class="g-best">🏆 New best score!</div>` : prev != null ? `<div class="muted">Your best: ${lives ? prev + " right" : `${prev}/${list.length}`}</div>` : ""}
        ${lives ? `<div class="muted">You reached <b>${LEVEL_NAMES[state.level]}</b> level.</div>` : ""}
      </div>
      <div class="grid cols-3" style="margin:16px 0;">
        ${statCard("Answered", answered)}
        ${statCard("Accuracy", pct + "%")}
        ${statCard("Points" + (earned ? boostNote(false) : ""), "+" + earned)}
      </div>
      <div class="row" style="margin-bottom:16px;">
        <button class="btn" type="button" id="g-again">↻ Play again</button>
        <button class="btn secondary" type="button" id="g-change">Change game</button>
      </div>
      ${answered ? `<h2 style="margin-top:8px;">Your answers</h2><div class="card" id="g-review">
        ${state.results.map(({ q, topic }, i) => questionHTML(q, i, topic.name, !!q.passage)).join("")}</div>` : ""}`;

    state.results.forEach(({ q, correct }, i) => {
      const row = $$("#g-review .question", view)[i];
      const input = $("input[data-qid], textarea[data-qid]", row);
      if (input) input.value = state.answers[i];
      markQuestion(row, q, correct, { yourAnswer: state.answers[i] });
    });
    $("#g-again", view).addEventListener("click", () => playGame(view, s));
    $("#g-change", view).addEventListener("click", () => pageGames(view));
    window.scrollTo(0, 0);
  }

  nextQuestion();
}
