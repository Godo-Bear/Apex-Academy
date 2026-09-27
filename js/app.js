/* =========================================================
   Apex Learning Academy — app logic
   Pages: Home · Practice · Test · Tutor · Progress · Admin
   Accounts, progress and the AI tutor live in Supabase.
========================================================= */

// ---------------- Supabase ----------------
const SUPABASE_URL = "https://dozlkmoaaskaulejkiiw.supabase.co";
const SUPABASE_KEY = "sb_publishable_yEYj6LwjIAzXkTfgJx9v6w_DTnZqXk_";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- Constants ----------------
const DIFF_POINTS = { 1: 10, 2: 20, 3: 30 };
const DIFF_NAMES = { 1: "Easy", 2: "Medium", 3: "Hard" };
const PRACTICE_SET_SIZE = 5;

const NAV = [
  { route: "home", label: "Home", icon: "🏠" },
  { route: "practice", label: "Practice", icon: "📚" },
  { route: "test", label: "Test", icon: "📝" },
  { route: "tutor", label: "Tutor", icon: "🤖" },
  { route: "progress", label: "Progress", icon: "📈" },
];

// ---------------- Topics ----------------
YEAR_LEVELS.forEach((y) => y.topics.forEach((t) => { t.subject = "maths"; t.yearId = y.id; }));
ENGLISH_TOPICS.forEach((t) => { t.subject = "english"; });
const MATHS_TOPICS = YEAR_LEVELS.flatMap((y) => y.topics);
const ALL_TOPICS = [...MATHS_TOPICS, ...ENGLISH_TOPICS];
const QUIZ_TOPICS = ALL_TOPICS.filter((t) => !t.special);
const findTopic = (id) => ALL_TOPICS.find((t) => t.id === id);

function pointsFor(q, topic) {
  const mult = topic.yearId ? yearMultiplier(topic.yearId) : 1;
  return Math.round(DIFF_POINTS[q.difficulty] * mult);
}

// ---------------- Helpers ----------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function store(key, value) {
  try {
    if (value === undefined) return JSON.parse(localStorage.getItem(key));
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { return null; }
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function setMsg(el, text, kind) {
  el.className = kind;
  el.textContent = text;
  show(el);
}

function isAnswerCorrect(q, raw) {
  if (q.answerType === "text") {
    if (typeof raw !== "string" || raw.trim() === "") return false;
    const normalized = raw.trim().toLowerCase();
    const accepted = Array.isArray(q.answer) ? q.answer : [q.answer];
    return accepted.some((a) => String(a).trim().toLowerCase() === normalized);
  }
  const val = parseFloat(String(raw).replace(/,/g, ""));
  const tol = q.tolerance ?? 0.01;
  return !isNaN(val) && Math.abs(val - q.answer) <= tol;
}
const displayAnswer = (q) => (Array.isArray(q.answer) ? q.answer[0] : q.answer);

function cleanTutorAnswer(text) {
  return text
    .replace(/\$\$(.*?)\$\$/g, "$1")
    .replace(/\$(.*?)\$/g, "$1")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdot/g, "×")
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/---+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function askTutor(body) {
  const { data, error } = await sb.functions.invoke("ask-tutor", { body: typeof body === "string" ? { question: body } : body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  if (!data?.answer) throw new Error("Empty answer");
  return cleanTutorAnswer(data.answer);
}

// ---------------- User state ----------------
let authUser = null; // { id, email }
let me = null;       // { name, points, testPoints, progress, friends, isAdmin }

function topicStats(topicId) {
  return me.progress[topicId] || { correct: 0, attempted: 0 };
}
function totals() {
  let correct = 0, attempted = 0;
  Object.values(me.progress).forEach((p) => { correct += p.correct || 0; attempted += p.attempted || 0; });
  return { correct, attempted, accuracy: attempted ? Math.round((correct / attempted) * 100) : 0 };
}
function mastery(topicId) {
  const s = topicStats(topicId);
  return s.attempted ? Math.round((s.correct / s.attempted) * 100) : 0;
}

// Streak is kept on this device (the database has no streak column).
function streakKey() { return "apex-streak-" + authUser.id; }
function currentStreak() {
  const s = store(streakKey()) || {};
  return s.last === todayStr() || s.last === yesterdayStr() ? s.streak || 0 : 0;
}
function bumpStreak() {
  const s = store(streakKey()) || {};
  if (s.last === todayStr()) return;
  store(streakKey(), { streak: s.last === yesterdayStr() ? (s.streak || 0) + 1 : 1, last: todayStr() });
}

function recordResults(results, { isTest = false } = {}) {
  // results: [{ q, topic, correct }]
  let earned = 0;
  results.forEach(({ q, topic, correct }) => {
    const p = (me.progress[topic.id] ||= { correct: 0, attempted: 0 });
    p.attempted += 1;
    if (correct) { p.correct += 1; earned += pointsFor(q, topic); }
  });
  me.points += earned;
  if (isTest) me.testPoints += earned;
  bumpStreak();
  saveProgress();
  renderMeBox();
  return earned;
}

let syncTimer = null;
function saveProgress() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    const base = { points: me.points, progress: me.progress };
    const { error } = await sb.from("profiles").update({ ...base, test_points: me.testPoints, last_seen: new Date().toISOString() }).eq("id", authUser.id);
    if (error) {
      console.error("Apex: full sync failed, retrying with core fields —", error);
      const { error: e2 } = await sb.from("profiles").update(base).eq("id", authUser.id);
      if (e2) { console.error("Apex: sync failed —", e2); toast("Couldn't save progress — check your connection."); }
    }
  }, 400);
}

// ---------------- Screens ----------------
function showScreen(name) {
  ["loading", "auth", "paywall", "app"].forEach((s) => $(`#screen-${s}`).classList.toggle("hidden", s !== name));
}

document.querySelectorAll("[data-logo]").forEach((el) => {
  el.prepend($("#logo-tpl").content.cloneNode(true));
});

// ---------------- Theme ----------------
function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("apex-theme", next); } catch (e) {}
}
$("#theme-toggle").addEventListener("click", toggleTheme);
$("#theme-toggle-m").addEventListener("click", toggleTheme);

// ---------------- Modals ----------------
function openModal(name) {
  $$(".modal").forEach(hide);
  show($(`#modal-${name}`));
}
document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-open]");
  if (opener) { e.preventDefault(); openModal(opener.dataset.open); return; }
  if (e.target.closest("[data-close]") || e.target.classList.contains("modal")) {
    const modal = e.target.closest(".modal");
    if (modal) hide(modal);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") $$(".modal").forEach(hide);
});
$("#menu-admin").addEventListener("click", () => hide($("#modal-menu")));

$("#feedback-send").addEventListener("click", async () => {
  const message = $("#feedback-message").value.trim();
  if (!message) return toast("Write a message first.");
  const btn = $("#feedback-send");
  btn.disabled = true;
  const { error } = await sb.from("feedback").insert({
    user_id: authUser.id, username: me.name, avatar: "🎓",
    category: $("#feedback-category").value, message, completed: false,
  });
  btn.disabled = false;
  if (error) { console.error(error); return toast("Couldn't send — try again."); }
  $("#feedback-message").value = "";
  hide($("#modal-feedback"));
  toast("Thanks — feedback sent!");
});

// ---------------- Auth ----------------
let authMode = "login";
$$("[data-auth-mode]").forEach((btn) => btn.addEventListener("click", () => {
  authMode = btn.dataset.authMode;
  $$("[data-auth-mode]").forEach((b) => b.classList.toggle("active", b === btn));
  const signup = authMode === "signup";
  $("#auth-name-field").classList.toggle("hidden", !signup);
  $("#auth-terms-field").classList.toggle("hidden", !signup);
  $("#auth-submit").textContent = signup ? "Create account" : "Log in";
  $("#auth-password").autocomplete = signup ? "new-password" : "current-password";
  hide($("#auth-msg"));
}));

$("#auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#auth-email").value.trim();
  const password = $("#auth-password").value;
  const name = $("#auth-name").value.trim();
  const msg = $("#auth-msg");
  const btn = $("#auth-submit");
  hide(msg);

  if (authMode === "signup") {
    if (name.length < 3) return setMsg(msg, "Display name needs at least 3 characters.", "error");
    if (!$("#auth-terms").checked) return setMsg(msg, "Please agree to the Terms & Conditions.", "error");
  }

  btn.disabled = true;
  try {
    if (authMode === "signup") {
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session && data.user) {
        await sb.from("profiles").insert({ id: data.user.id, email, username: name, has_paid: false, agreed_to_terms: true });
        await handleAuthenticatedUser(data.user);
      } else {
        $$("[data-auth-mode]")[0].click();
        setMsg(msg, "Account created! Check your email to confirm it, then log in.", "success");
      }
    } else {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await handleAuthenticatedUser(data.user);
    }
  } catch (err) {
    setMsg(msg, err.message || "Something went wrong.", "error");
  }
  btn.disabled = false;
});

function showAuthPanel(which) {
  $("#auth-main").classList.toggle("hidden", which !== "main");
  $("#forgot-form").classList.toggle("hidden", which !== "forgot");
  $("#reset-form").classList.toggle("hidden", which !== "reset");
  showScreen("auth");
}
$("#forgot-link").addEventListener("click", () => showAuthPanel("forgot"));
$("#forgot-back").addEventListener("click", () => showAuthPanel("main"));

$("#forgot-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("#forgot-msg");
  const { error } = await sb.auth.resetPasswordForEmail($("#forgot-email").value.trim(), {
    redirectTo: location.origin + location.pathname,
  });
  if (error) setMsg(msg, "Couldn't send a reset email — check the address and try again.", "error");
  else setMsg(msg, "Check your email for a reset link.", "success");
});

$("#reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { error } = await sb.auth.updateUser({ password: $("#reset-password").value });
  if (error) return setMsg($("#reset-msg"), "The reset link may have expired — request a new one.", "error");
  history.replaceState(null, "", location.pathname);
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) handleAuthenticatedUser(session.user);
  else showAuthPanel("main");
});

async function logout() {
  await sb.auth.signOut();
  authUser = null;
  me = null;
  $$(".modal").forEach(hide);
  history.replaceState(null, "", location.pathname);
  showAuthPanel("main");
}
$("#logout").addEventListener("click", logout);
$("#logout-m").addEventListener("click", logout);
$("#paywall-logout").addEventListener("click", logout);
$("#paywall-recheck").addEventListener("click", async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) handleAuthenticatedUser(session.user);
  else showAuthPanel("main");
});

async function handleAuthenticatedUser(user) {
  authUser = { id: user.id, email: user.email };
  let { data: profile, error } = await sb.from("profiles")
    .select("username, has_paid, paid_until, points, test_points, progress, friends, is_admin")
    .eq("id", user.id).single();
  if (error && error.code !== "PGRST116") {
    // Older databases may not have test_points yet.
    ({ data: profile, error } = await sb.from("profiles")
      .select("username, has_paid, paid_until, points, progress, friends, is_admin")
      .eq("id", user.id).single());
  }
  if (error?.code === "PGRST116") {
    await sb.from("profiles").insert({ id: user.id, email: user.email, has_paid: false, points: 0, progress: {} });
    return showPaywall();
  }
  if (error) { console.error("Apex: profile fetch failed —", error); return showPaywall(); }

  const active = profile.has_paid && (!profile.paid_until || new Date(profile.paid_until) > new Date());
  if (!active) return showPaywall();

  me = {
    name: (profile.username || "").trim() || user.email.split("@")[0],
    points: profile.points || 0,
    testPoints: profile.test_points || 0,
    progress: profile.progress || {},
    friends: profile.friends || [],
    isAdmin: !!profile.is_admin,
  };
  await loadCustomQuestions();
  enterApp();
}

function showPaywall() {
  $("#paywall-email").textContent = authUser?.email || "";
  showScreen("paywall");
}

async function loadCustomQuestions() {
  QUIZ_TOPICS.forEach((t) => { t.questions = t.questions.filter((q) => !q.isCustom); });
  const { data, error } = await sb.from("custom_questions").select("id, topic_id, prompt, answer, explanation, difficulty");
  if (error) return; // table is optional
  (data || []).forEach((row) => {
    const topic = QUIZ_TOPICS.find((t) => t.id === row.topic_id);
    if (!topic) return;
    topic.questions.push({
      id: `custom-${row.id}`, prompt: row.prompt, answer: row.answer, explanation: row.explanation || "",
      difficulty: row.difficulty, answerType: "text", isCustom: true,
    });
  });
}

// ---------------- App shell & routing ----------------
function enterApp() {
  const items = me.isAdmin ? [...NAV, { route: "admin", label: "Admin", icon: "🛠" }] : NAV;
  $("#nav").innerHTML = items.map((n) =>
    `<a class="nav-link" href="#/${n.route}" data-route="${n.route}"><span class="ico">${n.icon}</span><span>${n.label}</span></a>`).join("");
  $("#tabbar").innerHTML = NAV.map((n) =>
    `<a href="#/${n.route}" data-route="${n.route}"><span class="ico">${n.icon}</span><span>${n.label}</span></a>`).join("");
  $("#menu-admin").classList.toggle("hidden", !me.isAdmin);
  renderMeBox();
  showScreen("app");
  route();
}

function renderMeBox() {
  const line = `✦ ${me.points} pts · 🔥 ${currentStreak()}`;
  $("#me-name").textContent = me.name;
  $("#me-stats").textContent = line;
  $("#me-stats-mobile").textContent = line;
}

let cleanup = null;      // called before leaving the current page (stops timers)
let leaveWarning = null; // set while a test is running
let lastHash = "";

window.addEventListener("hashchange", () => {
  if (!me) return;
  if (leaveWarning && location.hash !== lastHash) {
    if (!confirm(leaveWarning)) { history.replaceState(null, "", lastHash); return; }
    leaveWarning = null;
  }
  route();
});
window.addEventListener("beforeunload", (e) => { if (leaveWarning) { e.preventDefault(); e.returnValue = ""; } });

function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  leaveWarning = null;
  lastHash = location.hash;
  const [page = "home", arg] = location.hash.replace(/^#\/?/, "").split("/");
  const view = $("#view");
  const pages = { home: pageHome, practice: pagePractice, test: pageTest, tutor: pageTutor, progress: pageProgress, admin: pageAdmin };
  const render = pages[page] || pageHome;
  const navRoute = pages[page] ? page : "home";
  $$("[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === navRoute));
  view.innerHTML = "";
  render(view, arg);
  window.scrollTo(0, 0);
}

// ---------------- Home ----------------
function suggestTopic() {
  const attempted = QUIZ_TOPICS.filter((t) => topicStats(t.id).attempted >= 5);
  const weak = attempted.filter((t) => mastery(t.id) < 70).sort((a, b) => mastery(a.id) - mastery(b.id))[0];
  if (weak) return { topic: weak, reason: `Your accuracy here is ${mastery(weak.id)}% — a bit more practice will help.` };
  const fresh = QUIZ_TOPICS.find((t) => topicStats(t.id).attempted === 0);
  if (fresh) return { topic: fresh, reason: "You haven't tried this topic yet." };
  const lowest = [...QUIZ_TOPICS].sort((a, b) => mastery(a.id) - mastery(b.id))[0];
  return { topic: lowest, reason: "Your lowest-scoring topic — keep it sharp." };
}

function pageHome(view) {
  const t = totals();
  const { topic, reason } = suggestTopic();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  view.innerHTML = `
    <div class="page-head">
      <h1>${greet}, ${esc(me.name)}</h1>
      <p>Pick up where you left off, or try something new.</p>
    </div>
    <div class="grid cols-3">
      ${statCard("Points", me.points)}
      ${statCard("Accuracy", t.accuracy + "%")}
      ${statCard("Day streak", currentStreak())}
    </div>

    <div class="section-label">Suggested next</div>
    <div class="card suggest">
      <div class="row" style="gap:14px;">
        <span class="emoji">${topic.icon}</span>
        <div><h3 style="margin:0;">${esc(topic.name)}</h3><div class="muted small">${esc(reason)}</div></div>
      </div>
      <a class="btn" href="#/practice/${topic.id}">Practise →</a>
    </div>

    <div class="section-label">Jump in</div>
    <div class="grid topics">
      ${quickCard("#/practice", "📚", "Practice", "Work through topics at your own pace.")}
      ${quickCard("#/test", "📝", "Take a test", "Mix topics against the clock.")}
      ${quickCard("#/tutor", "🤖", "Ask the tutor", "Stuck? Get a friendly explanation.")}
    </div>
  `;
}
const statCard = (label, value) => `<div class="card stat"><div class="label">${label}</div><div class="value">${value}</div></div>`;
const quickCard = (href, icon, title, text) => `
  <a class="card topic-card" href="${href}">
    <div class="title"><span class="emoji">${icon}</span>${title}</div>
    <div class="muted small">${text}</div>
  </a>`;

// ---------------- Practice ----------------
function topicCard(t) {
  const s = topicStats(t.id);
  const footer = t.special
    ? `<div class="muted small">Writing practice with AI feedback</div>`
    : `<div class="bar"><span style="width:${mastery(t.id)}%"></span></div>
       <div class="muted small">${s.attempted ? `${mastery(t.id)}% · ${s.attempted} answered` : "Not started"}</div>`;
  return `
    <a class="card topic-card" href="#/practice/${t.id}">
      <div class="title"><span class="emoji">${t.icon}</span>${esc(t.name)}</div>
      ${footer}
    </a>`;
}

function pagePractice(view, topicId) {
  if (topicId) {
    const t = findTopic(topicId);
    if (!t) { location.hash = "#/practice"; return; }
    return t.special ? pageWriting(view, t) : pageTopic(view, t);
  }
  view.innerHTML = `
    <div class="page-head"><h1>Practice</h1><p>Choose a topic. Each set has ${PRACTICE_SET_SIZE} questions.</p></div>
    ${YEAR_LEVELS.map((y) => `
      <div class="section-label">Maths · ${esc(y.label)}</div>
      <div class="grid topics">${y.topics.map(topicCard).join("")}</div>`).join("")}
    <div class="section-label">English</div>
    <div class="grid topics">${ENGLISH_TOPICS.map(topicCard).join("")}</div>
  `;
}

function pageTopic(view, t) {
  let difficulty = 1;
  let set = [];

  view.innerHTML = `
    <a class="back" href="#/practice">← All topics</a>
    <div class="page-head">
      <h1>${t.icon} ${esc(t.name)}</h1>
      <p>${esc(t.recap || t.blurb || "")}</p>
    </div>
    ${t.diagram || t.example ? `
      <details class="card" style="margin-bottom:16px;">
        <summary>Show diagram &amp; example</summary>
        ${t.example ? `<p class="small" style="margin-top:10px;"><strong>Real-life example:</strong> ${esc(t.example)}</p>` : ""}
        ${t.diagram ? `<div class="diagram-box">${t.diagram}</div>` : ""}
        <div id="worked-example"></div>
      </details>` : ""}
    <div class="card">
      <div class="row between" style="margin-bottom:18px;">
        <div class="segmented" id="diff">
          ${[1, 2, 3].map((d) => `<button type="button" data-d="${d}">${DIFF_NAMES[d]}</button>`).join("")}
        </div>
        <span class="muted small" id="pts-each"></span>
      </div>
      <form id="qset" autocomplete="off"></form>
    </div>
  `;

  $$("#diff button", view).forEach((b) => b.addEventListener("click", () => { difficulty = +b.dataset.d; newSet(); }));

  function newSet() {
    $$("#diff button", view).forEach((b) => b.classList.toggle("active", +b.dataset.d === difficulty));
    const pool = t.questions.filter((q) => q.difficulty === difficulty);
    set = shuffle(pool).slice(0, PRACTICE_SET_SIZE);
    $("#pts-each", view).textContent = set.length ? `+${pointsFor(set[0], t)} pts each` : "";
    const we = t.workedExample?.[difficulty];
    const weBox = $("#worked-example", view);
    if (weBox) weBox.innerHTML = we ? `<p class="small" style="margin-top:12px;"><strong>Worked example:</strong> ${esc(we.question)}</p><div class="explain">${esc(we.walkthrough)}</div>` : "";

    const form = $("#qset", view);
    if (!set.length) { form.innerHTML = `<p class="muted">No questions at this level yet — try another.</p>`; return; }
    form.innerHTML = set.map((q, i) => questionHTML(q, i)).join("") +
      `<div class="row" style="margin-top:18px;"><button class="btn" type="submit" id="check">Check answers</button></div>`;
    $("input", form)?.focus();
  }

  $("#qset", view).addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.dataset.checked === "true") return;
    const blanks = set.filter((q) => !$(`input[data-qid="${q.id}"]`, form).value.trim()).length;
    if (blanks && !confirm(`You've left ${blanks} blank. Check anyway?`)) return;
    form.dataset.checked = "true";

    const results = set.map((q) => {
      const input = $(`input[data-qid="${q.id}"]`, form);
      const correct = isAnswerCorrect(q, input.value);
      markQuestion(input.closest(".question"), q, correct);
      return { q, topic: t, correct };
    });
    const right = results.filter((r) => r.correct).length;
    const earned = recordResults(results);
    const kind = right === set.length ? "good" : right === 0 ? "bad" : "info";
    const actions = $(".row:last-child", form);
    actions.innerHTML = `
      <div class="banner ${kind}" style="flex:1;">${right}/${set.length} correct · +${earned} points</div>
      <button class="btn" type="button" id="next-set">Next set →</button>`;
    $("#next-set", form).addEventListener("click", () => { delete form.dataset.checked; newSet(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  });

  newSet();
}

function questionHTML(q, i, topicLabel = "") {
  return `
    <div class="question" data-qid="${q.id}">
      ${topicLabel ? `<div class="tag" style="display:inline-block; margin-bottom:6px;">${esc(topicLabel)}</div>` : ""}
      <div class="prompt"><span class="num">${i + 1}.</span>${esc(q.prompt)}</div>
      <input type="text" data-qid="${q.id}" placeholder="Your answer" inputmode="${q.answerType === "text" ? "text" : "decimal"}">
      <div class="q-feedback"></div>
    </div>`;
}

// Shows right/wrong, plus explanation and AI step-by-step buttons.
function markQuestion(row, q, correct, { yourAnswer } = {}) {
  const input = $("input", row);
  if (input) { input.disabled = true; input.classList.add(correct ? "correct" : "wrong"); }
  const fb = $(".q-feedback", row);
  const yours = yourAnswer !== undefined ? `You answered: ${esc(yourAnswer || "(blank)")}. ` : "";
  fb.innerHTML = `
    <div class="q-result ${correct ? "correct" : "wrong"}">${correct ? "✓ Correct" : `✕ ${yours}The answer is ${esc(displayAnswer(q))}`}</div>
    <div class="q-tools">
      ${q.explanation ? `<button type="button" class="btn ghost sm" data-act="explain">Explanation</button>` : ""}
      <button type="button" class="btn ghost sm" data-act="steps">Step-by-step (AI)</button>
    </div>
    <div class="explain hidden" data-box="explain">${esc(q.explanation)}</div>
    <div class="explain hidden" data-box="steps"></div>`;

  $$("[data-act]", fb).forEach((btn) => btn.addEventListener("click", async () => {
    const box = $(`[data-box="${btn.dataset.act}"]`, fb);
    box.classList.toggle("hidden");
    if (btn.dataset.act !== "steps" || box.dataset.loaded || box.classList.contains("hidden")) return;
    box.textContent = "Working through the steps…";
    btn.disabled = true;
    try {
      box.textContent = await askTutor(`You are a friendly Year 7 tutor. Give a clear, numbered, step-by-step walkthrough for solving this question:
"${q.prompt}"

The correct answer is: "${displayAnswer(q)}"

Break the solution into short numbered steps a Year 7 student could follow easily. Keep it concise, no markdown formatting.`);
      box.dataset.loaded = "1";
    } catch (err) {
      console.error(err);
      box.textContent = "Couldn't reach the tutor — try again in a moment.";
    }
    btn.disabled = false;
  }));
}

// ---------------- Writing (creative + essay) ----------------
const WRITING_FEEDBACK = {
  "creative-writing": (prompt, text) => `You are an encouraging Year 7 English teacher marking a piece of creative writing. The writing prompt was: "${prompt}"

Here is the student's writing:
"""
${text}
"""

Give feedback a teacher would give on a creative writing piece, covering:
1. Punctuation and capital letters — point out any missing or incorrect ones with brief examples.
2. Spelling — flag any misspelled words.
3. Sentence variety and flow — are sentences too repetitive or choppy?
4. Word choice — suggest a few stronger or more interesting words to replace plain ones.
5. One or two things they did well, to be encouraging.
6. One clear, specific suggestion for how to improve the piece overall.

Keep it friendly, specific, and easy for a Year 7 student to understand. Use short paragraphs or a simple list, not markdown formatting.`,
  "essay-writing": (prompt, text) => `You are an encouraging Year 7 English teacher marking a piece of essay writing. The essay prompt was: "${prompt}"

Here is the student's essay:
"""
${text}
"""

Give feedback a teacher would give on an essay, covering:
1. Structure — does it have a clear introduction, body paragraphs, and conclusion?
2. Thesis/argument — is their position or main point clear and consistent throughout?
3. Paragraphing — does each paragraph focus on one main idea, with topic sentences?
4. Evidence and reasoning — do they support their points with examples or reasons, not just opinions?
5. Punctuation, capital letters, and spelling — point out any clear errors with brief examples.
6. Sentence variety and word choice — suggest a few stronger or more interesting words or sentence structures.
7. One or two things they did well, to be encouraging.
8. One clear, specific suggestion for how to improve the essay overall.

Keep it friendly, specific, and easy for a Year 7 student to understand. Use short paragraphs or a simple list, not markdown formatting.`,
};

function pageWriting(view, t) {
  const draftKey = `apex-draft-${authUser.id}-${t.id}`;
  const defaultMins = t.special === "essay-writing" ? 20 : 10;

  view.innerHTML = `
    <a class="back" href="#/practice">← All topics</a>
    <div class="page-head"><h1>${t.icon} ${esc(t.name)}</h1><p>${esc(t.recap || "")}</p></div>
    <div id="writing"></div>`;
  const root = $("#writing", view);

  function choose() {
    const draft = store(draftKey);
    root.innerHTML = `
      ${draft?.text ? `
        <div class="card suggest" style="margin-bottom:16px;">
          <div><h3 style="margin:0;">Continue your draft</h3><div class="muted small">${esc(draft.prompt)}</div></div>
          <button class="btn" id="resume">Continue →</button>
        </div>` : ""}
      <div class="card stack">
        <h3>Pick a prompt</h3>
        <div class="prompt-list">${t.prompts.map((p, i) => `<button type="button" data-i="${i}">${esc(p)}</button>`).join("")}</div>
        <div>
          <label class="field" for="own-prompt">Or write your own</label>
          <div class="row" style="flex-wrap:nowrap;">
            <input type="text" id="own-prompt" placeholder="Your own prompt…">
            <button class="btn" id="own-go">Start</button>
          </div>
        </div>
      </div>`;
    $("#resume", root)?.addEventListener("click", () => write(draft.prompt, draft.text));
    $$(".prompt-list button", root).forEach((b) => b.addEventListener("click", () => write(t.prompts[+b.dataset.i], "")));
    $("#own-go", root).addEventListener("click", () => {
      const p = $("#own-prompt", root).value.trim();
      if (p) write(p, "");
    });
  }

  function write(prompt, text) {
    let secondsLeft = defaultMins * 60;
    let timer = null;
    root.innerHTML = `
      <div class="card stack">
        <div class="writing-prompt">${esc(prompt)}</div>
        <div class="row between">
          <div class="row">
            <span class="timer" id="clock"></span>
            <select id="mins" style="width:auto;">
              ${[5, 10, 15, 20, 30, 45].map((m) => `<option value="${m}" ${m === defaultMins ? "selected" : ""}>${m} min</option>`).join("")}
            </select>
            <button class="btn secondary sm" id="clock-btn">Start timer</button>
          </div>
          <span class="muted small" id="words"></span>
        </div>
        <textarea class="editor" id="editor" placeholder="Start writing…"></textarea>
        <div class="row between">
          <button class="btn ghost" id="change">← Change prompt</button>
          <div class="row">
            <button class="btn secondary" id="finish">Finish &amp; clear</button>
            <button class="btn" id="get-fb">Get AI feedback</button>
          </div>
        </div>
        <div id="fb" class="explain hidden"></div>
      </div>`;

    const editor = $("#editor", root);
    editor.value = text;
    const clock = $("#clock", root);
    const words = () => (editor.value.trim() ? editor.value.trim().split(/\s+/).length : 0);
    const drawClock = () => {
      clock.textContent = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;
      clock.classList.toggle("low", secondsLeft <= 60);
    };
    const drawWords = () => { $("#words", root).textContent = `${words()} words`; };
    const stop = () => { clearInterval(timer); timer = null; $("#clock-btn", root).textContent = "Start timer"; };
    drawClock(); drawWords();
    editor.focus();

    editor.addEventListener("input", () => { drawWords(); store(draftKey, { prompt, text: editor.value }); });
    $("#mins", root).addEventListener("change", (e) => { stop(); secondsLeft = +e.target.value * 60; drawClock(); });
    $("#clock-btn", root).addEventListener("click", () => {
      if (timer) return stop();
      $("#clock-btn", root).textContent = "Pause";
      timer = setInterval(() => {
        secondsLeft = Math.max(0, secondsLeft - 1);
        drawClock();
        if (secondsLeft === 0) { stop(); toast("Time's up! Finish your sentence and get feedback."); }
      }, 1000);
    });
    cleanup = stop;

    $("#change", root).addEventListener("click", () => { stop(); choose(); });
    $("#finish", root).addEventListener("click", () => {
      if (editor.value.trim() && !confirm("Clear this piece and start fresh?")) return;
      stop();
      store(draftKey, null);
      choose();
    });
    $("#get-fb", root).addEventListener("click", async () => {
      if (words() < 15) return toast("Write a few more sentences first.");
      const btn = $("#get-fb", root);
      const box = $("#fb", root);
      btn.disabled = true;
      btn.textContent = "Reading…";
      show(box);
      box.textContent = "Reading your writing…";
      try {
        box.textContent = await askTutor(WRITING_FEEDBACK[t.special](prompt, editor.value.trim()));
      } catch (err) {
        console.error(err);
        box.textContent = "Couldn't get feedback right now — try again in a moment.";
      }
      btn.disabled = false;
      btn.textContent = "Get AI feedback";
    });
  }

  choose();
}

// ---------------- Test ----------------
function pageTest(view) {
  const checklist = (topics) => topics.map((t) =>
    `<label class="chip-check"><input type="checkbox" value="${t.id}"> ${t.icon} ${esc(t.name)}</label>`).join("");
  const englishQuiz = ENGLISH_TOPICS.filter((t) => !t.special);

  view.innerHTML = `
    <div class="page-head"><h1>Test</h1><p>Build a test from any topics. Questions are marked when you submit.</p></div>
    <div class="card stack" id="builder">
      <div>
        <div class="row between"><label class="field">Maths topics</label><button class="btn ghost sm" data-all="maths">Select all</button></div>
        <div class="checklist" data-group="maths">${checklist(MATHS_TOPICS)}</div>
      </div>
      <div>
        <div class="row between"><label class="field">English topics</label><button class="btn ghost sm" data-all="english">Select all</button></div>
        <div class="checklist" data-group="english">${checklist(englishQuiz)}</div>
      </div>
      <div>
        <label class="field">Difficulty</label>
        <div class="checklist" id="t-diff">
          ${[1, 2, 3].map((d) => `<label class="chip-check"><input type="checkbox" value="${d}" checked> ${DIFF_NAMES[d]}</label>`).join("")}
        </div>
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr;">
        <div><label class="field" for="t-count">Questions</label><input type="number" id="t-count" min="1" max="50" value="10"></div>
        <div><label class="field" for="t-time">Time limit</label>
          <select id="t-time">
            <option value="0">No limit</option>
            ${[5, 10, 15, 20, 30, 45, 60].map((m) => `<option value="${m}" ${m === 20 ? "selected" : ""}>${m} minutes</option>`).join("")}
          </select>
        </div>
      </div>
      <div id="t-error" class="error hidden"></div>
      <button class="btn block" id="t-start">Start test →</button>
    </div>`;

  $$("[data-all]", view).forEach((btn) => btn.addEventListener("click", () => {
    const boxes = $$(`[data-group="${btn.dataset.all}"] input`, view);
    const allOn = boxes.every((b) => b.checked);
    boxes.forEach((b) => { b.checked = !allOn; });
    btn.textContent = allOn ? "Select all" : "Clear";
  }));

  $("#t-start", view).addEventListener("click", () => {
    const topicIds = $$("[data-group] input:checked", view).map((b) => b.value);
    const diffs = $$("#t-diff input:checked", view).map((b) => +b.value);
    const count = Math.max(1, Math.min(50, parseInt($("#t-count", view).value, 10) || 10));
    const minutes = +$("#t-time", view).value;
    const err = $("#t-error", view);
    if (!topicIds.length) return setMsg(err, "Pick at least one topic.", "error");
    if (!diffs.length) return setMsg(err, "Pick at least one difficulty.", "error");

    const pool = topicIds.flatMap((id) => {
      const topic = findTopic(id);
      return topic.questions.filter((q) => diffs.includes(q.difficulty)).map((q) => ({ q, topic }));
    });
    if (!pool.length) return setMsg(err, "No questions match those choices.", "error");
    runTest(view, shuffle(pool).slice(0, count), minutes);
  });
}

function runTest(view, items, minutes) {
  let secondsLeft = minutes * 60;
  let timer = null;
  leaveWarning = "Leave the test? Your answers won't be saved.";

  view.innerHTML = `
    <div class="page-head row between">
      <div><h1 style="margin:0;">Test</h1><p id="answered"></p></div>
      <span class="timer" id="t-clock"></span>
    </div>
    <form class="card" id="t-form" autocomplete="off">
      ${items.map(({ q, topic }, i) => questionHTML(q, i, topic.name)).join("")}
      <div class="row between" style="margin-top:18px;">
        <button class="btn ghost" type="button" id="t-quit">Quit</button>
        <button class="btn" type="submit">Submit test</button>
      </div>
    </form>`;

  const form = $("#t-form", view);
  const drawAnswered = () => {
    const n = $$("input", form).filter((i) => i.value.trim()).length;
    $("#answered", view).textContent = `${n} of ${items.length} answered`;
  };
  drawAnswered();
  form.addEventListener("input", drawAnswered);

  const clock = $("#t-clock", view);
  if (minutes) {
    const draw = () => {
      clock.textContent = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;
      clock.classList.toggle("low", secondsLeft <= 60);
    };
    draw();
    timer = setInterval(() => {
      secondsLeft -= 1;
      draw();
      if (secondsLeft <= 0) { toast("Time's up!"); finish(); }
    }, 1000);
  }
  cleanup = () => clearInterval(timer);
  $("input", form)?.focus();
  $("#t-quit", view).addEventListener("click", () => {
    if (confirm(leaveWarning)) route(); // route() clears the timer and warning
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const blanks = $$("input", form).filter((i) => !i.value.trim()).length;
    if (blanks && !confirm(`You've left ${blanks} blank. Submit anyway?`)) return;
    finish();
  });

  function finish() {
    clearInterval(timer);
    leaveWarning = null;
    const answers = items.map(({ q }) => $(`input[data-qid="${q.id}"]`, form).value);
    const results = items.map(({ q, topic }, i) => ({ q, topic, correct: isAnswerCorrect(q, answers[i]) }));
    const right = results.filter((r) => r.correct).length;
    const earned = recordResults(results, { isTest: true });
    const pct = Math.round((right / items.length) * 100);

    view.innerHTML = `
      <div class="page-head"><h1>Results</h1></div>
      <div class="grid cols-3" style="margin-bottom:16px;">
        ${statCard("Score", `${right}/${items.length}`)}
        ${statCard("Percent", pct + "%")}
        ${statCard("Points", "+" + earned)}
      </div>
      <div class="card" id="review">
        ${items.map(({ q, topic }, i) => questionHTML(q, i, topic.name)).join("")}
      </div>
      <div class="row" style="margin-top:16px;"><a class="btn" href="#/test" id="again">Build another test</a></div>`;

    items.forEach(({ q }, i) => {
      const row = $(`.question[data-qid="${q.id}"]`, view);
      $("input", row).value = answers[i];
      markQuestion(row, q, results[i].correct, { yourAnswer: answers[i] });
    });
    // Already on #/test, so re-render the builder directly.
    $("#again", view).addEventListener("click", (e) => { e.preventDefault(); route(); });
    window.scrollTo(0, 0);
  }
}

// ---------------- Tutor ----------------
const tutorLog = []; // kept for the session so switching pages doesn't wipe the chat

function pageTutor(view) {
  let pendingImage = null;
  view.innerHTML = `
    <div class="page-head"><h1>AI Tutor</h1><p>Ask any maths or English question and get a friendly explanation.</p></div>
    <div class="card">
      <div class="chat" id="chat"></div>
      <div class="attach-preview hidden" id="attach"><img alt=""><button class="btn ghost sm" id="attach-x">Remove photo</button></div>
      <form class="chat-form" id="chat-form" autocomplete="off">
        <button type="button" class="btn secondary" id="photo" title="Add a photo of your working">📷</button>
        <input type="file" id="photo-input" accept="image/*" class="hidden">
        <input type="text" id="ask" placeholder="Ask a question…">
        <button class="btn" type="submit" id="send">Ask</button>
      </form>
    </div>`;

  const chat = $("#chat", view);
  const draw = () => {
    if (!tutorLog.length) {
      const examples = ["How do I simplify 12/18?", "What's the difference between their, there and they're?", "How do I find the area of a triangle?"];
      chat.innerHTML = `<div class="chat-empty">What would you like help with?
        <div class="chips">${examples.map((x) => `<button type="button" class="btn secondary sm">${esc(x)}</button>`).join("")}</div></div>`;
      $$(".chips button", chat).forEach((b) => b.addEventListener("click", () => { $("#ask", view).value = b.textContent; $("#chat-form", view).requestSubmit(); }));
      return;
    }
    chat.innerHTML = tutorLog.map((m) =>
      `<div class="bubble ${m.role}">${m.image ? `<img src="${m.image}" alt="Your photo">` : ""}${esc(m.text)}</div>`).join("");
    chat.scrollTop = chat.scrollHeight;
  };
  draw();

  $("#photo", view).addEventListener("click", () => $("#photo-input", view).click());
  $("#photo-input", view).addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please choose an image.");
    if (file.size > 5 * 1024 * 1024) return toast("Image must be under 5MB.");
    const reader = new FileReader();
    reader.onload = () => {
      pendingImage = { base64: reader.result, mimeType: file.type };
      $("#attach img", view).src = reader.result;
      show($("#attach", view));
    };
    reader.readAsDataURL(file);
  });
  const clearImage = () => { pendingImage = null; $("#photo-input", view).value = ""; hide($("#attach", view)); };
  $("#attach-x", view).addEventListener("click", clearImage);

  $("#chat-form", view).addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("#ask", view);
    const question = input.value.trim();
    if (!question && !pendingImage) return;
    const image = pendingImage;
    tutorLog.push({ role: "me", text: question || "Can you check my working?", image: image?.base64 });
    tutorLog.push({ role: "bot", text: "Thinking…" });
    input.value = "";
    clearImage();
    draw();
    const send = $("#send", view);
    send.disabled = true;

    const body = { question: question || "Please look at the photo of my handwritten working and explain whether it's correct, and how to fix it if not." };
    if (image) { body.image = image.base64; body.imageMimeType = image.mimeType; }
    const pending = tutorLog[tutorLog.length - 1];
    try {
      pending.text = await askTutor(body);
    } catch (err) {
      console.error(err);
      pending.role = "err";
      pending.text = "Sorry, I couldn't reach the tutor. Please try again in a moment.";
    }
    if (document.body.contains(chat)) { draw(); send.disabled = false; input.focus(); }
  });
}

// ---------------- Progress ----------------
function pageProgress(view) {
  const t = totals();
  view.innerHTML = `
    <div class="page-head"><h1>Progress</h1><p>How you're going, and how you compare.</p></div>
    <div class="grid cols-3">
      ${statCard("Points", me.points)}
      ${statCard("Accuracy", t.accuracy + "%")}
      ${statCard("Answered", t.attempted)}
    </div>

    <div class="section-label">Mastery by topic</div>
    <div class="card">
      ${QUIZ_TOPICS.map((tp) => {
        const s = topicStats(tp.id);
        return `<div class="mastery-row">
          <a href="#/practice/${tp.id}" style="color:inherit; text-decoration:none;">${tp.icon} ${esc(tp.name)}</a>
          <div class="bar"><span style="width:${mastery(tp.id)}%"></span></div>
          <span class="pct">${s.attempted ? mastery(tp.id) + "%" : "—"}</span>
        </div>`;
      }).join("")}
    </div>

    <div class="section-label">Leaderboard</div>
    <div class="card">
      <div class="row between" style="margin-bottom:12px;">
        <div class="segmented" id="lb-mode">
          <button type="button" class="active" data-mode="all">Everyone</button>
          <button type="button" data-mode="friends">Friends</button>
        </div>
      </div>
      <form id="add-friend" class="row hidden" style="flex-wrap:nowrap; margin-bottom:12px;">
        <input type="text" id="friend-name" placeholder="Add a friend by username">
        <button class="btn" type="submit">Add</button>
      </form>
      <div id="lb"><p class="muted">Loading…</p></div>
    </div>`;

  let mode = "all";
  let rows = [];
  $$("#lb-mode button", view).forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    $$("#lb-mode button", view).forEach((x) => x.classList.toggle("active", x === b));
    $("#add-friend", view).classList.toggle("hidden", mode !== "friends");
    drawBoard();
  }));

  function drawBoard() {
    const list = mode === "friends" ? rows.filter((r) => me.friends.includes(r.username) || r.username === me.name) : rows;
    const lb = $("#lb", view);
    if (!list.length) { lb.innerHTML = `<p class="muted">No one here yet.</p>`; return; }
    lb.innerHTML = list.map((r, i) => {
      const isMe = r.username === me.name;
      const pts = isMe ? me.points : r.show_points === false ? "hidden" : `${r.points || 0} pts`;
      return `<div class="list-row ${isMe ? "me" : ""}">
        <span class="rank">${i + 1}</span>
        <span class="grow">${esc(r.username)}${isMe ? " (you)" : ""}</span>
        <span class="muted small">${isMe ? pts + " pts" : pts}</span>
        ${mode === "friends" && !isMe ? `<button class="btn ghost sm" data-unfriend="${esc(r.username)}" title="Remove friend">✕</button>` : ""}
      </div>`;
    }).join("");
    $$("[data-unfriend]", lb).forEach((b) => b.addEventListener("click", () => saveFriends(me.friends.filter((f) => f !== b.dataset.unfriend))));
  }

  async function saveFriends(list) {
    const { error } = await sb.from("profiles").update({ friends: list }).eq("id", authUser.id);
    if (error) return toast("Couldn't update friends.");
    me.friends = list;
    drawBoard();
  }

  $("#add-friend", view).addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#friend-name", view).value.trim();
    if (!name || name === me.name) return;
    if (me.friends.includes(name)) return toast("Already a friend.");
    const { data } = await sb.from("public_profiles").select("username, points, show_points").eq("username", name).maybeSingle();
    if (!data) return toast("No one with that username.");
    if (!rows.some((r) => r.username === name)) rows.push(data);
    $("#friend-name", view).value = "";
    await saveFriends([...me.friends, name]);
    toast(`Added ${name}`);
  });

  (async () => {
    let { data, error } = await sb.from("public_profiles").select("username, points, show_points, deleted").order("points", { ascending: false }).limit(100);
    if (error) ({ data, error } = await sb.from("public_profiles").select("username, points, show_points").order("points", { ascending: false }).limit(100));
    if (error) { $("#lb", view).innerHTML = `<p class="muted">Couldn't load the leaderboard.</p>`; return; }
    rows = (data || []).filter((r) => r.username && !r.deleted);
    drawBoard();
  })();
}

// ---------------- Admin ----------------
function pageAdmin(view) {
  if (!me.isAdmin) { location.hash = "#/home"; return; }
  view.innerHTML = `
    <div class="page-head"><h1>Admin</h1><p>Manage accounts and read feedback.</p></div>
    <div class="section-label">Accounts</div>
    <div class="card">
      <input type="text" id="acct-search" placeholder="Search name or email" style="margin-bottom:10px;">
      <div id="accts"><p class="muted">Loading…</p></div>
    </div>
    <div class="section-label">Feedback</div>
    <div class="card"><div id="fb-list"><p class="muted">Loading…</p></div></div>`;

  let accounts = [];
  const paidLabel = (a) => {
    if (!a.has_paid) return `<span class="tag bad">Not paid</span>`;
    if (!a.paid_until) return `<span class="tag good">Paid</span>`;
    const until = new Date(a.paid_until);
    return until > new Date()
      ? `<span class="tag good">Paid until ${until.toLocaleDateString()}</span>`
      : `<span class="tag bad">Expired ${until.toLocaleDateString()}</span>`;
  };

  function drawAccounts() {
    const q = $("#acct-search", view).value.trim().toLowerCase();
    const list = accounts.filter((a) => !q || (a.username || "").toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q));
    $("#accts", view).innerHTML = list.length ? list.map((a) => `
      <div class="list-row">
        <div class="grow"><strong>${esc(a.username || "(no name)")}</strong>${a.is_admin ? ` <span class="tag">admin</span>` : ""}<div class="muted small">${esc(a.email)} · ${a.points || 0} pts</div></div>
        ${paidLabel(a)}
        <button class="btn secondary sm" data-pay="${a.id}">+6 months</button>
        ${a.has_paid ? `<button class="btn ghost sm" data-revoke="${a.id}">Revoke</button>` : ""}
      </div>`).join("") : `<p class="muted">No accounts found.</p>`;
  }
  $("#acct-search", view).addEventListener("input", drawAccounts);

  $("#accts", view).addEventListener("click", async (e) => {
    const pay = e.target.closest("[data-pay]");
    const revoke = e.target.closest("[data-revoke]");
    if (!pay && !revoke) return;
    const id = (pay || revoke).dataset.pay || (pay || revoke).dataset.revoke;
    const acct = accounts.find((a) => a.id === id);
    let update;
    if (pay) {
      // Extend from the later of today or the current expiry.
      const start = acct.paid_until && new Date(acct.paid_until) > new Date() ? new Date(acct.paid_until) : new Date();
      start.setMonth(start.getMonth() + 6);
      update = { has_paid: true, paid_until: start.toISOString() };
    } else {
      if (!confirm(`Revoke access for ${acct.username || acct.email}?`)) return;
      update = { has_paid: false };
    }
    const { error } = await sb.from("profiles").update(update).eq("id", id);
    if (error) return toast("Update failed.");
    Object.assign(acct, update);
    drawAccounts();
  });

  (async () => {
    const { data, error } = await sb.from("profiles").select("id, username, email, points, has_paid, paid_until, is_admin, deleted").order("username");
    if (error) { $("#accts", view).innerHTML = `<p class="muted">Couldn't load accounts.</p>`; return; }
    accounts = (data || []).filter((a) => !a.deleted);
    drawAccounts();
  })();

  (async () => {
    const { data, error } = await sb.from("feedback").select("*").order("created_at", { ascending: false });
    const box = $("#fb-list", view);
    if (error) { box.innerHTML = `<p class="muted">Couldn't load feedback.</p>`; return; }
    if (!data.length) { box.innerHTML = `<p class="muted">No feedback yet.</p>`; return; }
    box.innerHTML = data.map((f) => `
      <div class="list-row" style="align-items:flex-start;">
        <input type="checkbox" data-done="${f.id}" ${f.completed ? "checked" : ""} title="Mark done" style="margin-top:4px;">
        <div class="grow">
          <div><span class="tag">${esc(f.category)}</span> <strong>${esc(f.username)}</strong> <span class="muted small">${new Date(f.created_at).toLocaleString()}</span></div>
          <div style="white-space:pre-wrap; margin-top:4px;">${esc(f.message)}</div>
        </div>
      </div>`).join("");
    $$("[data-done]", box).forEach((cb) => cb.addEventListener("change", async () => {
      const { error: err } = await sb.from("feedback").update({ completed: cb.checked }).eq("id", cb.dataset.done);
      if (err) { cb.checked = !cb.checked; toast("Update failed."); }
    }));
  })();
}

// ---------------- Start ----------------
(function init() {
  sb.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") showAuthPanel("reset");
  });
  if (location.hash.includes("type=recovery")) return showAuthPanel("reset");

  sb.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) handleAuthenticatedUser(session.user);
    else showAuthPanel("main");
  });
})();
