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

// XP ranks — XP is earned alongside points and never spent.
const XP_LEVELS = [
  { name: "Rookie", min: 0, icon: "🌱" },
  { name: "Apprentice", min: 100, icon: "📘" },
  { name: "Scholar", min: 300, icon: "🎓" },
  { name: "Ace", min: 600, icon: "⭐" },
  { name: "Master", min: 1000, icon: "🏅" },
  { name: "Grandmaster", min: 2000, icon: "👑" },
  { name: "Legend", min: 4000, icon: "💎" },
];
const ADMIN_RANK_ICON_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:1em; height:1em; vertical-align:-0.15em; overflow:visible;">
  <defs>
    <radialGradient id="inevGlow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#FFF6D8" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#FFD34D" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#FFD34D" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="inevGold" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FFEBA8"/>
      <stop offset="50%" stop-color="#F0B23A"/>
      <stop offset="100%" stop-color="#B87A15"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="42" r="46" fill="url(#inevGlow)"/>
  <g stroke="#FFD34D" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
    <line x1="50" y1="42" x2="50" y2="4"/>
    <line x1="50" y1="42" x2="80" y2="14"/>
    <line x1="50" y1="42" x2="96" y2="40"/>
    <line x1="50" y1="42" x2="88" y2="68"/>
    <line x1="50" y1="42" x2="20" y2="14"/>
    <line x1="50" y1="42" x2="4" y2="40"/>
    <line x1="50" y1="42" x2="12" y2="68"/>
  </g>
  <rect x="33" y="66" width="34" height="18" rx="5" fill="url(#inevGold)" stroke="#7A4E10" stroke-width="2.5"/>
  <rect x="33" y="70" width="34" height="4" fill="#7A4E10" opacity="0.4"/>
  <rect x="27" y="38" width="46" height="32" rx="12" fill="url(#inevGold)" stroke="#7A4E10" stroke-width="2.5"/>
  <circle cx="37" cy="34" r="9" fill="url(#inevGold)" stroke="#7A4E10" stroke-width="2.5"/>
  <circle cx="50" cy="30" r="10" fill="url(#inevGold)" stroke="#7A4E10" stroke-width="2.5"/>
  <circle cx="63" cy="34" r="9" fill="url(#inevGold)" stroke="#7A4E10" stroke-width="2.5"/>
  <path d="M22 46 Q14 44 14 54 Q14 63 24 64 L28 64 L28 46 Z" fill="url(#inevGold)" stroke="#7A4E10" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`;
const ADMIN_RANK = { name: "Inevitable", icon: ADMIN_RANK_ICON_SVG };

function levelInfo(xp, isAdmin) {
  if (isAdmin) return { current: ADMIN_RANK, next: null, pct: 100 };
  let i = 0;
  while (i + 1 < XP_LEVELS.length && xp >= XP_LEVELS[i + 1].min) i++;
  const current = XP_LEVELS[i];
  const next = XP_LEVELS[i + 1] || null;
  const pct = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;
  return { current, next, pct };
}

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
    // AI-generated test questions have no topic id, so they earn points but don't count toward mastery.
    if (topic.id) {
      const p = (me.progress[topic.id] ||= { correct: 0, attempted: 0 });
      p.attempted += 1;
      if (correct) p.correct += 1;
    }
    if (correct) earned += pointsFor(q, topic);
  });
  me.points += earned;
  me.xp += earned;
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
    const base = { points: me.points, xp: me.xp, progress: me.progress };
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
  if (name === "feedback") loadMyFeedback();
}

// Shows the user's past messages and any admin replies inside the feedback modal.
async function loadMyFeedback() {
  const box = $("#my-feedback");
  const { data, error } = await sb.from("feedback").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }).limit(10);
  if (error || !data?.length) { box.innerHTML = ""; return; }
  box.innerHTML = `<div class="section-label" style="margin-top:8px;">Your messages</div>` + data.map((f) => `
    <div class="list-row" style="display:block;">
      <div class="row between"><span class="tag ${f.completed ? "good" : ""}">${f.completed ? "Resolved" : "Pending"}</span><span class="muted small">${new Date(f.created_at).toLocaleDateString()}</span></div>
      <div class="small" style="margin-top:4px; white-space:pre-wrap;">${esc(f.message)}</div>
      ${f.admin_reply ? `<div class="explain"><strong>Reply:</strong> ${esc(f.admin_reply)}</div>` : ""}
    </div>`).join("");
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
  toast("Thanks — feedback sent!");
  loadMyFeedback();
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
    .select("username, has_paid, paid_until, points, xp, test_points, progress, friends, is_admin")
    .eq("id", user.id).single();
  if (error && error.code !== "PGRST116") {
    // Older databases may not have test_points yet.
    ({ data: profile, error } = await sb.from("profiles")
      .select("username, has_paid, paid_until, points, xp, progress, friends, is_admin")
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
    xp: profile.xp || 0,
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
  const { current } = levelInfo(me.xp, me.isAdmin);
  $("#me-name").textContent = me.name;
  $("#me-rank").innerHTML = `${current.icon} ${esc(current.name)} · ${me.xp} XP`;
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
    <div style="margin-top:12px;">${rankCard()}</div>

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
function rankCard() {
  const { current, next, pct } = levelInfo(me.xp, me.isAdmin);
  return `
    <div class="card rank-card">
      <span class="rank-icon">${current.icon}</span>
      <div style="flex:1;">
        <div class="row between"><strong>${esc(current.name)}</strong><span class="muted small">${me.xp} XP</span></div>
        <div class="bar" style="margin:8px 0 4px;"><span style="width:${pct}%"></span></div>
        <div class="muted small">${next ? `${next.min - me.xp} XP to ${next.icon} ${next.name}` : "Top rank reached"}</div>
      </div>
    </div>`;
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

  const worked = t.workedExample ? [1, 2, 3].filter((d) => t.workedExample[d]) : [];
  view.innerHTML = `
    <a class="back" href="#/practice">← All topics</a>
    <div class="page-head">
      <h1>${t.icon} ${esc(t.name)}</h1>
      <p>${esc(t.recap || t.blurb || "")}</p>
    </div>
    <div class="segmented" id="tabs" style="margin-bottom:16px;">
      <button type="button" data-tab="learn">📖 Learn</button>
      <button type="button" data-tab="practice">✏️ Practice</button>
    </div>

    <div id="tab-learn" class="stack">
      ${lessonHTML(t.id)}
      ${t.example || t.diagram ? `
        <div class="card lesson">
          <h3>In real life</h3>
          ${t.example ? `<p>${esc(t.example)}</p>` : ""}
          ${t.diagram ? `<div class="diagram-box">${t.diagram}</div>` : ""}
        </div>` : ""}
      ${worked.length ? `
        <div class="card lesson">
          <h3>Worked examples</h3>
          ${worked.map((d) => `
            <p style="margin:14px 0 6px;"><span class="tag">${DIFF_NAMES[d]}</span> ${esc(t.workedExample[d].question)}</p>
            <div class="explain" style="margin-top:0;">${esc(t.workedExample[d].walkthrough)}</div>`).join("")}
        </div>` : ""}
      <button class="btn block" type="button" id="go-practice">Start practising →</button>
    </div>

    <div class="card" id="tab-practice">
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

  function showTab(name) {
    $$("#tabs button", view).forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    $("#tab-learn", view).classList.toggle("hidden", name !== "learn");
    $("#tab-practice", view).classList.toggle("hidden", name !== "practice");
    if (name === "practice") $("#qset input", view)?.focus();
  }
  $$("#tabs button", view).forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));
  $("#go-practice", view).addEventListener("click", () => { showTab("practice"); window.scrollTo(0, 0); });

  function newSet() {
    $$("#diff button", view).forEach((b) => b.classList.toggle("active", +b.dataset.d === difficulty));
    set = nextPracticeSet(t, difficulty);
    $("#pts-each", view).textContent = set.length ? `+${pointsFor(set[0], t)} pts each` : "";

    const form = $("#qset", view);
    if (!set.length) { form.innerHTML = `<p class="muted">No questions at this level yet — try another.</p>`; return; }
    form.innerHTML = set.map((q, i) => questionHTML(q, i)).join("") +
      `<div class="row" style="margin-top:18px;">
        <button class="btn" type="submit" id="check">Check answers</button>
        <button class="btn secondary" type="button" id="skip-set">New set ↻</button>
      </div>`;
    $("#skip-set", form).addEventListener("click", () => {
      const typed = $$("input", form).some((i) => i.value.trim());
      if (typed && !confirm("Get new questions? Your answers here won't be checked.")) return;
      newSet();
    });
    if (!$("#tab-practice", view).classList.contains("hidden")) $("input", form)?.focus();
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
  showTab(topicStats(t.id).attempted ? "practice" : "learn");
}

// Deals practice questions like a shuffled deck: every question at a difficulty
// is shown once before any repeats. The deck is remembered on this device.
function nextPracticeSet(t, difficulty) {
  const pool = t.questions.filter((q) => q.difficulty === difficulty);
  const key = `apex-deck-${authUser.id}`;
  const decks = store(key) || {};
  const deckId = `${t.id}-${difficulty}`;
  const ids = new Set(pool.map((q) => q.id));
  let deck = (decks[deckId] || []).filter((id) => ids.has(id));
  const set = [];
  while (set.length < Math.min(PRACTICE_SET_SIZE, pool.length)) {
    if (!deck.length) {
      // Reshuffle, keeping this set's questions out of the start of the new deck.
      const taken = new Set(set.map((q) => q.id));
      deck = shuffle(pool.filter((q) => !taken.has(q.id)).map((q) => q.id));
      if (!deck.length) break;
    }
    const id = deck.shift();
    set.push(pool.find((q) => q.id === id));
  }
  decks[deckId] = deck;
  store(key, decks);
  return set;
}

// Renders a topic's lesson sections from TOPIC_LESSONS (js/lessons.js).
function lessonHTML(topicId, { flat = false } = {}) {
  const sections = (typeof TOPIC_LESSONS !== "undefined" && TOPIC_LESSONS[topicId]) || [];
  return sections.map((sec) => `
    <div class="${flat ? "lesson" : "card lesson"}">
      <h3>${esc(sec.title)}</h3>
      ${sec.text ? `<p>${esc(sec.text)}</p>` : ""}
      ${sec.points ? `<ul>${sec.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` : ""}
      ${sec.tip ? `<div class="tip">💡 ${esc(sec.tip)}</div>` : ""}
    </div>`).join("");
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

// ---------------- Saved writing ----------------
// Pieces are always kept on this device. If the Supabase `writings` table exists
// (see supabase/writings.sql) they're saved there too, so they follow the student
// between devices.
let cloudWritings = true;
const writingsKey = () => `apex-writings-${authUser.id}`;
const localWritings = () => store(writingsKey()) || [];
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : "w-" + Date.now() + "-" + Math.random().toString(16).slice(2));

function writingText(piece) {
  return piece.parts ? piece.parts.map((p) => p.trim()).filter(Boolean).join("\n\n") : piece.text || "";
}
const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

function putLocalWriting(piece) {
  store(writingsKey(), [piece, ...localWritings().filter((p) => p.id !== piece.id)].slice(0, 200));
}

async function saveWriting(piece) {
  piece.updatedAt = new Date().toISOString();
  piece.text = writingText(piece);
  putLocalWriting(piece);
  if (!cloudWritings) return;
  const { error } = await sb.from("writings").upsert({
    id: piece.id, user_id: authUser.id, topic_id: piece.topicId, prompt: piece.prompt,
    text: piece.text, parts: piece.parts || null, settings: { ...piece.settings, evidence: piece.evidence || null }, feedback: piece.feedback || null,
    word_count: countWords(piece.text), created_at: piece.createdAt, updated_at: piece.updatedAt,
  });
  if (error) { cloudWritings = false; console.warn("Apex: writings table unavailable, saving on this device only —", error.message); }
}

async function listWritings(topicId) {
  const byId = new Map(localWritings().map((p) => [p.id, p]));
  if (cloudWritings) {
    const { data, error } = await sb.from("writings").select("*").eq("user_id", authUser.id);
    if (error) cloudWritings = false;
    else (data || []).forEach((r) => {
      const local = byId.get(r.id);
      if (local && local.updatedAt >= r.updated_at) return;
      byId.set(r.id, {
        id: r.id, topicId: r.topic_id, prompt: r.prompt, text: r.text, parts: r.parts || undefined,
        settings: r.settings || {}, evidence: r.settings?.evidence || undefined,
        feedback: r.feedback || "", createdAt: r.created_at, updatedAt: r.updated_at,
      });
    });
  }
  const all = [...byId.values()].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  store(writingsKey(), all.slice(0, 200));
  return topicId ? all.filter((p) => p.topicId === topicId) : all;
}

async function deleteWriting(id) {
  store(writingsKey(), localWritings().filter((p) => p.id !== id));
  if (cloudWritings) await sb.from("writings").delete().eq("id", id);
}

// ---------------- Writing (creative + essay) ----------------
const ESSAY_TYPES = {
  persuasive: { label: "Persuasive", hint: "argue for one side" },
  discussion: { label: "Discussion", hint: "weigh up both sides" },
  informative: { label: "Informative", hint: "explain a topic clearly" },
};
const DEFAULT_WRITING_SETTINGS = {
  "essay-writing": { essayType: "persuasive", paragraphs: 3, target: 350, minutes: 20, planner: true },
  "creative-writing": { target: 300, minutes: 10 },
};

function writingFeedbackPrompt(t, piece) {
  const s = piece.settings || {};
  const text = writingText(piece);
  const target = s.target ? ` They were aiming for about ${s.target} words and wrote ${countWords(text)}.` : "";
  if (t.special === "creative-writing") {
    return `You are an encouraging Year 7 English teacher marking a piece of creative writing. The writing prompt was: "${piece.prompt}".${target}

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

Keep it friendly, specific, and easy for a Year 7 student to understand. Use short paragraphs or a simple list, not markdown formatting.`;
  }
  const type = ESSAY_TYPES[s.essayType] || ESSAY_TYPES.persuasive;
  return `You are an encouraging Year 7 English teacher marking a piece of essay writing. The essay prompt was: "${piece.prompt}"

The student chose to write a ${type.label.toLowerCase()} essay (${type.hint})${s.side === "for" ? ", arguing FOR the topic" : s.side === "against" ? ", arguing AGAINST the topic" : ""}, with an introduction, ${s.paragraphs || 3} body paragraph${s.paragraphs === 1 ? "" : "s"} and a conclusion.${target}

Here is the student's essay:
"""
${text}
"""

Give feedback a teacher would give on an essay, covering:
1. Structure — did they follow the structure they chose (introduction, ${s.paragraphs || 3} body paragraph${s.paragraphs === 1 ? "" : "s"}, conclusion)?
2. Thesis/argument — is their position or main point clear and consistent, and does it suit a ${type.label.toLowerCase()} essay?
3. Paragraphing — does each paragraph focus on one main idea, with a topic sentence?
4. Evidence and reasoning — do they support their points with examples or reasons, not just opinions?
5. Punctuation, capital letters, and spelling — point out any clear errors with brief examples.
6. Sentence variety and word choice — suggest a few stronger words or sentence structures.
7. One or two things they did well, to be encouraging.
8. One clear, specific suggestion for how to improve the essay overall.

Keep it friendly, specific, and easy for a Year 7 student to understand. Use short paragraphs or a simple list, not markdown formatting.`;
}

function pageWriting(view, t) {
  const isEssay = t.special === "essay-writing";
  const settingsKey = `apex-writing-settings-${t.special}`;
  const settings = { ...DEFAULT_WRITING_SETTINGS[t.special], ...(store(settingsKey) || {}) };

  // One-time move of the old single draft into the saved-writing list.
  const oldDraftKey = `apex-draft-${authUser.id}-${t.id}`;
  const oldDraft = store(oldDraftKey);
  if (oldDraft?.text) {
    const now = new Date().toISOString();
    saveWriting({ id: newId(), topicId: t.id, prompt: oldDraft.prompt, text: oldDraft.text, settings: { ...settings, planner: false }, createdAt: now });
  }
  if (oldDraft) store(oldDraftKey, null);

  view.innerHTML = `
    <a class="back" href="#/practice">← All topics</a>
    <div class="page-head"><h1>${t.icon} ${esc(t.name)}</h1><p>${esc(t.recap || "")}</p></div>
    ${lessonHTML(t.id) ? `
      <details class="card" style="margin-bottom:16px;">
        <summary>📖 How to write ${isEssay ? "a strong essay" : "a great story"}</summary>
        <div class="stack" style="margin-top:12px;">${lessonHTML(t.id, { flat: true })}</div>
      </details>` : ""}
    <div class="segmented" id="w-tabs" style="margin-bottom:16px;">
      <button type="button" data-tab="new">✏️ New piece</button>
      <button type="button" data-tab="mine">📁 My writing <span id="w-count"></span></button>
    </div>
    <div id="writing"></div>`;
  const root = $("#writing", view);
  const setTab = (name) => $$("#w-tabs button", view).forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  $$("#w-tabs button", view).forEach((b) => b.addEventListener("click", () => {
    if (cleanup) { cleanup(); cleanup = null; }
    b.dataset.tab === "new" ? setup() : mine();
  }));
  const refreshCount = async () => {
    const n = (await listWritings(t.id)).length;
    const el = $("#w-count", view);
    if (el) el.textContent = n ? `(${n})` : "";
  };

  const option = (value, label, current) => `<option value="${value}" ${String(value) === String(current) ? "selected" : ""}>${label}</option>`;

  // ----- Step 1: settings + prompt -----
  function setup() {
    setTab("new");
    root.innerHTML = `
      <div class="card stack">
        <h3>1. Set it up</h3>
        <div class="grid settings-grid">
          ${isEssay ? `
            <div><label class="field" for="s-type">Essay type</label>
              <select id="s-type">${Object.entries(ESSAY_TYPES).map(([k, v]) => option(k, v.label, settings.essayType)).join("")}</select>
              <div class="muted small" id="s-type-hint" style="margin-top:4px;"></div></div>
            <div><label class="field" for="s-paras">Body paragraphs</label>
              <select id="s-paras">${[1, 2, 3, 4, 5, 6].map((n) => option(n, n, settings.paragraphs)).join("")}</select></div>` : ""}
          <div><label class="field" for="s-target">Target length</label>
            <select id="s-target">${option(0, "No target", settings.target)}${[150, 250, 300, 350, 500, 750, 1000].map((n) => option(n, `${n} words`, settings.target)).join("")}</select></div>
          <div><label class="field" for="s-mins">Timer</label>
            <select id="s-mins">${option(0, "No timer", settings.minutes)}${[5, 10, 15, 20, 30, 45, 60].map((n) => option(n, `${n} minutes`, settings.minutes)).join("")}</select></div>
        </div>
        ${isEssay ? `
          <label class="small" style="display:flex; gap:8px; align-items:center;">
            <input type="checkbox" id="s-planner" ${settings.planner ? "checked" : ""}>
            Use the paragraph planner (a separate box for the introduction, each body paragraph and the conclusion)
          </label>` : ""}
      </div>
      <div class="card stack" style="margin-top:16px;">
        <h3>2. Pick a prompt</h3>
        <div class="prompt-list">${t.prompts.map((p, i) => `<button type="button" data-i="${i}">${esc(p)}</button>`).join("")}</div>
        <div>
          <label class="field" for="own-prompt">Or write your own</label>
          <div class="row" style="flex-wrap:nowrap;">
            <input type="text" id="own-prompt" placeholder="Your own prompt…">
            <button class="btn" id="own-go">Start</button>
          </div>
        </div>
      </div>`;

    const readSettings = () => {
      if (isEssay) {
        settings.essayType = $("#s-type", root).value;
        settings.paragraphs = +$("#s-paras", root).value;
        settings.planner = $("#s-planner", root).checked;
      }
      settings.target = +$("#s-target", root).value;
      settings.minutes = +$("#s-mins", root).value;
      store(settingsKey, settings);
    };
    const drawTypeHint = () => {
      const el = $("#s-type-hint", root);
      if (el) el.textContent = `You ${ESSAY_TYPES[$("#s-type", root).value].hint}${$("#s-type", root).value === "persuasive" ? " — you'll pick for or against" : ""}.`;
    };
    $$("select, input[type=checkbox]", root).forEach((el) => el.addEventListener("change", () => { readSettings(); drawTypeHint(); }));
    drawTypeHint();

    const start = (prompt) => {
      readSettings();
      const s = { ...settings };
      const piece = { id: newId(), topicId: t.id, prompt, settings: s, feedback: "", createdAt: new Date().toISOString() };
      if (isEssay && s.planner) piece.parts = Array(s.paragraphs + 2).fill("");
      else piece.text = "";
      if (isEssay && s.essayType === "persuasive") return chooseSide(piece);
      if (isEssay && s.essayType === "discussion") piece.settings.side = "both";
      write(piece, { isNew: true });
    };
    $$(".prompt-list button", root).forEach((b) => b.addEventListener("click", () => start(t.prompts[+b.dataset.i])));
    $("#own-go", root).addEventListener("click", () => {
      const p = $("#own-prompt", root).value.trim();
      if (p) start(p);
    });
  }

  // ----- Persuasive essays: pick a side -----
  function chooseSide(piece) {
    root.innerHTML = `
      <div class="card stack" style="text-align:center;">
        <div class="writing-prompt">${esc(piece.prompt)}</div>
        <p class="muted" style="margin:0;">Which side will you argue? You'll get 4 strong pieces of evidence for each side to help you plan.</p>
        <div class="side-pick">
          <button class="btn" data-side="for">👍 For</button>
          <button class="btn secondary" data-side="against">👎 Against</button>
        </div>
        <button class="btn ghost" id="side-back">← Pick a different prompt</button>
      </div>`;
    $$("[data-side]", root).forEach((b) => b.addEventListener("click", () => {
      piece.settings.side = b.dataset.side;
      write(piece, { isNew: true });
    }));
    $("#side-back", root).addEventListener("click", setup);
  }

  // Asks the tutor for 4 pieces of evidence on each side of the prompt.
  async function fetchEvidence(prompt) {
    const raw = await askTutor(`A Year 7 student is writing an essay on this topic:
"${prompt}"

Give exactly 4 strong pieces of evidence FOR the statement/position and exactly 4 strong pieces of evidence AGAINST it. Each piece should be one or two sentences a Year 7 student can understand and use in a paragraph: a clear reason backed by a concrete example, fact or real-world situation. Only use well-known, accurate facts — don't invent statistics, studies or quotes. If the topic isn't really a for/against question, interpret "for" as supporting the main idea and "against" as challenging it.

Respond with ONLY valid JSON, no other text, in exactly this format:
{"for": ["...", "...", "...", "..."], "against": ["...", "...", "...", "..."]}`);
    const json = raw.replace(/```json/gi, "").replace(/```/g, "");
    const parsed = JSON.parse(json.slice(json.indexOf("{"), json.lastIndexOf("}") + 1));
    const clean = (arr) => (Array.isArray(arr) ? arr.map((x) => String(x).trim()).filter(Boolean).slice(0, 4) : []);
    const evidence = { for: clean(parsed.for), against: clean(parsed.against) };
    if (!evidence.for.length || !evidence.against.length) throw new Error("Missing evidence");
    return evidence;
  }

  // ----- Step 2: the editor -----
  function write(piece, { isNew = false } = {}) {
    setTab("new");
    const s = piece.settings || {};
    let secondsLeft = (s.minutes || 0) * 60;
    let timer = null;
    let saveTimer = null;
    let saved = !isNew;

    const partLabel = (i, n) => (i === 0 ? "Introduction" : i === n - 1 ? "Conclusion" : `Body paragraph ${i}`);
    const partHint = (i, n) => (i === 0
      ? "Hook the reader, give some background, and state your main argument (thesis)."
      : i === n - 1
        ? "Restate your thesis in new words, sum up your points, and finish with a strong final thought."
        : "Topic sentence → Explain → Evidence (an example or fact) → Link back to your thesis.");
    const summary = [
      isEssay ? `${(ESSAY_TYPES[s.essayType] || ESSAY_TYPES.persuasive).label} essay` : "",
      isEssay ? `${s.paragraphs} body paragraph${s.paragraphs === 1 ? "" : "s"}` : "",
      s.side === "for" ? "Arguing FOR" : s.side === "against" ? "Arguing AGAINST" : "",
      s.target ? `aim for ${s.target} words` : "",
    ].filter(Boolean);

    root.innerHTML = `
      <div class="card stack">
        <div>
          <div class="writing-prompt">${esc(piece.prompt)}</div>
          ${summary.length ? `<div class="row" style="gap:6px; margin-top:8px;">${summary.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>` : ""}
        </div>
        ${s.side ? `<details class="evidence" open><summary>🧾 Evidence bank</summary><div id="evidence"></div></details>` : ""}
        <div class="row between">
          <div class="row">
            ${s.minutes ? `<span class="timer" id="clock"></span><button class="btn secondary sm" id="clock-btn">Start timer</button>` : ""}
          </div>
          <span class="muted small" id="save-state"></span>
        </div>
        <div id="editor-area">
          ${piece.parts
            ? piece.parts.map((_, i) => `
                <div class="planner-part">
                  <label class="field" for="part-${i}">${partLabel(i, piece.parts.length)}</label>
                  <div class="muted small" style="margin-bottom:6px;">${partHint(i, piece.parts.length)}</div>
                  <textarea id="part-${i}" data-part="${i}" rows="5"></textarea>
                </div>`).join("")
            : `<textarea class="editor" id="editor" placeholder="Start writing…"></textarea>`}
        </div>
        <div>
          <div class="row between small"><span id="words"></span><span class="muted" id="target-note"></span></div>
          ${s.target ? `<div class="bar" style="margin-top:6px;"><span id="target-bar"></span></div>` : ""}
        </div>
        <div class="row between">
          <button class="btn ghost" id="back">← My writing</button>
          <div class="row">
            <button class="btn secondary" id="copy">Copy text</button>
            <button class="btn" id="get-fb">Get AI feedback</button>
          </div>
        </div>
        <div id="fb" class="explain ${piece.feedback ? "" : "hidden"}"></div>
      </div>`;

    const drawEvidence = (state) => {
      const box = $("#evidence", root);
      if (!box) return;
      if (state === "loading") { box.innerHTML = `<p class="muted small">Finding evidence for both sides…</p>`; return; }
      if (state === "error") {
        box.innerHTML = `<p class="muted small">Couldn't load evidence right now. <button class="btn ghost sm" id="ev-retry">Try again</button></p>`;
        $("#ev-retry", root).addEventListener("click", loadEvidence);
        return;
      }
      const col = (side, title) => `
        <div class="ev-col ${s.side === side ? "mine" : ""}">
          <strong>${title}${s.side === side ? " — your side" : ""}</strong>
          <ol>${piece.evidence[side].map((e) => `<li>${esc(e)}</li>`).join("")}</ol>
        </div>`;
      box.innerHTML = `<div class="ev-grid">${col("for", "👍 For")}${col("against", "👎 Against")}</div>
        <p class="muted small" style="margin:8px 0 0;">Tip: use your side's evidence in your body paragraphs, and knock down the strongest point from the other side.</p>`;
    };
    async function loadEvidence() {
      drawEvidence("loading");
      try {
        piece.evidence = await fetchEvidence(piece.prompt);
        if (!document.body.contains(root)) return;
        drawEvidence();
        if (saved || countWords(writingText(piece))) saveNow();
      } catch (err) {
        console.error("Apex: evidence request failed —", err);
        if (document.body.contains(root)) drawEvidence("error");
      }
    }

    const boxes = piece.parts ? $$("[data-part]", root) : [$("#editor", root)];
    if (piece.parts) boxes.forEach((b, i) => { b.value = piece.parts[i] || ""; });
    else boxes[0].value = piece.text || "";
    if (piece.feedback) $("#fb", root).textContent = piece.feedback;
    boxes[0].focus();

    const collect = () => {
      if (piece.parts) piece.parts = boxes.map((b) => b.value);
      else piece.text = boxes[0].value;
    };
    const drawWords = () => {
      const n = countWords(writingText(piece));
      $("#words", root).textContent = `${n} words`;
      if (s.target) {
        $("#target-note", root).textContent = n >= s.target ? "Target reached ✓" : `${s.target - n} to go`;
        $("#target-bar", root).style.width = Math.min(100, Math.round((n / s.target) * 100)) + "%";
      }
    };
    const saveState = (text) => { const el = $("#save-state", root); if (el) el.textContent = text; };
    const saveNow = async () => {
      clearTimeout(saveTimer);
      saveTimer = null;
      if (!countWords(writingText(piece)) && !piece.feedback) return; // don't save empty pieces
      await saveWriting(piece);
      saved = true;
      saveState(cloudWritings ? "Saved ✓" : "Saved on this device ✓");
      refreshCount();
    };
    drawWords();
    saveState(saved ? "Saved ✓" : "");
    if (s.side) piece.evidence ? drawEvidence() : loadEvidence();

    boxes.forEach((b) => b.addEventListener("input", () => {
      collect();
      drawWords();
      saveState("Saving…");
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveNow, 800);
    }));

    const clock = $("#clock", root);
    const drawClock = () => {
      if (!clock) return;
      clock.textContent = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;
      clock.classList.toggle("low", secondsLeft <= 60);
    };
    const stop = () => { clearInterval(timer); timer = null; const b = $("#clock-btn", root); if (b) b.textContent = "Start timer"; };
    drawClock();
    $("#clock-btn", root)?.addEventListener("click", () => {
      if (timer) return stop();
      $("#clock-btn", root).textContent = "Pause";
      timer = setInterval(() => {
        secondsLeft = Math.max(0, secondsLeft - 1);
        drawClock();
        if (secondsLeft === 0) { stop(); toast("Time's up! Finish your sentence and get feedback."); }
      }, 1000);
    });
    cleanup = () => { stop(); if (saveTimer) saveNow(); };

    $("#back", root).addEventListener("click", async () => { cleanup(); cleanup = null; mine(); });
    $("#copy", root).addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(writingText(piece)); toast("Copied to clipboard"); }
      catch (e) { toast("Couldn't copy — select the text and copy it instead."); }
    });
    $("#get-fb", root).addEventListener("click", async () => {
      if (countWords(writingText(piece)) < 15) return toast("Write a few more sentences first.");
      const btn = $("#get-fb", root);
      const box = $("#fb", root);
      btn.disabled = true;
      btn.textContent = "Reading…";
      show(box);
      box.textContent = "Reading your writing…";
      try {
        piece.feedback = await askTutor(writingFeedbackPrompt(t, piece));
        box.textContent = piece.feedback;
        await saveNow();
      } catch (err) {
        console.error(err);
        box.textContent = "Couldn't get feedback right now — try again in a moment.";
      }
      if (document.body.contains(btn)) { btn.disabled = false; btn.textContent = "Get AI feedback"; }
    });
  }

  // ----- My writing list -----
  async function mine() {
    setTab("mine");
    root.innerHTML = `<div class="card"><p class="muted">Loading…</p></div>`;
    const pieces = await listWritings(t.id);
    refreshCount();
    if (!document.body.contains(root)) return;
    if (!pieces.length) {
      root.innerHTML = `<div class="card"><p class="muted" style="margin:0;">Nothing saved yet. Start a new piece and it will save here automatically.</p></div>`;
      return;
    }
    root.innerHTML = `<div class="card">${pieces.map((p) => {
      const s = p.settings || {};
      const words = countWords(writingText(p));
      const bits = [
        new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
        `${words} word${words === 1 ? "" : "s"}${s.target ? ` / ${s.target}` : ""}`,
        isEssay && s.essayType ? `${(ESSAY_TYPES[s.essayType] || {}).label}${s.side === "for" ? " (for)" : s.side === "against" ? " (against)" : ""} · ${s.paragraphs} body ¶` : "",
      ].filter(Boolean);
      return `
        <div class="list-row">
          <div class="grow">
            <strong>${esc(p.prompt)}</strong>
            <div class="muted small">${bits.map(esc).join(" · ")} ${p.feedback ? `<span class="tag good">Has feedback</span>` : ""}</div>
          </div>
          <button class="btn secondary sm" data-piece="${p.id}">Open</button>
          <button class="btn ghost sm" data-del="${p.id}" title="Delete">Delete</button>
        </div>`;
    }).join("")}</div>`;
    $$("[data-piece]", root).forEach((b) => b.addEventListener("click", () => write(pieces.find((p) => p.id === b.dataset.piece))));
    $$("[data-del]", root).forEach((b) => b.addEventListener("click", async () => {
      if (!confirm("Delete this piece? This can't be undone.")) return;
      await deleteWriting(b.dataset.del);
      mine();
    }));
  }

  refreshCount();
  setup();
}

// ---------------- Test ----------------
function pageTest(view) {
  const checklist = (topics) => topics.map((t) =>
    `<label class="chip-check"><input type="checkbox" value="${t.id}"> ${t.icon} ${esc(t.name)}</label>`).join("");
  const englishQuiz = ENGLISH_TOPICS.filter((t) => !t.special);

  view.innerHTML = `
    <div class="page-head"><h1>Test</h1><p>Build a test from any topics. Questions are marked when you submit.</p></div>
    <div class="card stack" id="builder">
      <div id="t-bank">
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
      </div>
      <div>
        <label class="field" for="t-examples">Example questions <span class="muted">(optional)</span></label>
        <p class="muted small" style="margin-bottom:8px;">Paste one or more questions and the AI will write a fresh test in the same style. Leave blank to use the question bank.</p>
        <textarea id="t-examples" rows="3" style="min-height:80px;" placeholder="e.g. What is 15% of 240?"></textarea>
        <label class="small" style="display:flex; gap:8px; align-items:center; margin-top:8px;">
          <input type="checkbox" id="t-examples-only"> Base the whole test on my examples only (ignore the topics and difficulty above)
        </label>
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

  const examplesOnly = $("#t-examples-only", view);
  examplesOnly.addEventListener("change", () => {
    $("#t-bank", view).style.opacity = examplesOnly.checked ? ".4" : "";
    $("#t-bank", view).style.pointerEvents = examplesOnly.checked ? "none" : "";
  });

  $("#t-start", view).addEventListener("click", async () => {
    const topicIds = $$("[data-group] input:checked", view).map((b) => b.value);
    const diffs = $$("#t-diff input:checked", view).map((b) => +b.value);
    const count = Math.max(1, Math.min(50, parseInt($("#t-count", view).value, 10) || 10));
    const minutes = +$("#t-time", view).value;
    const examples = $("#t-examples", view).value.trim();
    const err = $("#t-error", view);
    hide(err);

    if (examplesOnly.checked && !examples) return setMsg(err, "Type at least one example question.", "error");
    if (!examplesOnly.checked) {
      if (!topicIds.length) return setMsg(err, "Pick at least one topic.", "error");
      if (!diffs.length) return setMsg(err, "Pick at least one difficulty.", "error");
    }

    if (examples) {
      const btn = $("#t-start", view);
      btn.disabled = true;
      btn.textContent = "Writing your test…";
      try {
        const topics = examplesOnly.checked ? null : topicIds.map(findTopic);
        const qs = await generateAIQuestions(examples, count, topics, diffs);
        if (!qs.length) throw new Error("No usable questions");
        runTest(view, qs.map((q) => ({ q, topic: { id: null, name: q.topicName, icon: "🤖" } })), minutes);
      } catch (e) {
        console.error("Apex: AI test generation failed —", e);
        btn.disabled = false;
        btn.textContent = "Start test →";
        setMsg(err, "Couldn't write a test from those examples. Try rewording them, or clear the box to use the question bank.", "error");
      }
      return;
    }

    const pool = topicIds.flatMap((id) => {
      const topic = findTopic(id);
      return topic.questions.filter((q) => diffs.includes(q.difficulty)).map((q) => ({ q, topic }));
    });
    if (!pool.length) return setMsg(err, "No questions match those choices.", "error");
    runTest(view, shuffle(pool).slice(0, count), minutes);
  });
}

// Asks the tutor for new questions modelled on the student's examples.
// With topics: stays within those topics/difficulties. Without: matches the examples' own subject and level.
async function generateAIQuestions(examples, count, topics, diffs) {
  const rules = `Each question must have ONE short, clearly correct answer (a word, number, phrase, or short mark/symbol) — not an open-ended or essay-style answer, since answers are checked by exact text match.

Respond with ONLY a valid JSON array, no other text, no markdown code fences, in exactly this format:
[{"prompt": "question text", "answer": "the answer", "explanation": "a one-sentence explanation of the answer", "difficulty": 1, "topicName": "the topic"}]`;

  const prompt = topics
    ? `You are writing exam questions for a Year 7 Australian curriculum test covering these topics: ${topics.map((t) => t.name).join(", ")}.
Difficulty level(s) to write at: ${diffs.map((d) => DIFF_NAMES[d].toLowerCase()).join("/")}.

Here are example questions to match the style and structure of:
"""
${examples}
"""

Write exactly ${count} new original questions in that same style, spread across the topics listed above and matching the requested difficulty level(s). Set topicName to whichever listed topic each question belongs to, and difficulty to 1 for easy, 2 for medium, or 3 for hard.

${rules}`
    : `You are writing exam questions based on example questions a student has given you:
"""
${examples}
"""

First, work out what subject/topic these questions belong to and what level they are pitched at — judge this from the questions themselves, not from any assumed year level, and match that same level.

Then write exactly ${count} new original questions on that same subject, at that same level, in a similar style and structure. Set topicName to the subject you identified, and difficulty to 1 (easier than the examples), 2 (about the same) or 3 (harder).

${rules}`;

  const raw = (await askTutor(prompt)).replace(/```json/gi, "").replace(/```/g, "");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end < start) throw new Error("Unexpected AI response");
  const stamp = Date.now();
  return JSON.parse(raw.slice(start, end + 1))
    .filter((q) => q && q.prompt && q.answer !== undefined && q.answer !== null && String(q.answer).trim() !== "")
    .slice(0, count)
    .map((q, i) => {
      const answer = String(q.answer).trim();
      const numeric = /^-?\d+(\.\d+)?$/.test(answer);
      return {
        id: `ai-${stamp}-${i}`,
        prompt: String(q.prompt).trim(),
        answer: numeric ? parseFloat(answer) : answer,
        answerType: numeric ? undefined : "text",
        explanation: q.explanation || "",
        difficulty: [1, 2, 3].includes(Number(q.difficulty)) ? Number(q.difficulty) : 2,
        topicName: String(q.topicName || "AI question"),
      };
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
    <div style="margin-top:12px;">${rankCard()}</div>

    <div class="section-label">Ranks</div>
    <div class="card">
      ${XP_LEVELS.map((l) => {
        const reached = me.xp >= l.min;
        const isCurrent = !me.isAdmin && levelInfo(me.xp).current === l;
        return `<div class="list-row ${isCurrent ? "me" : ""}" style="${reached ? "" : "opacity:.55;"}">
          <span style="font-size:20px;">${l.icon}</span>
          <span class="grow">${l.name}${isCurrent ? " (you)" : ""}</span>
          <span class="muted small">${l.min} XP</span>
        </div>`;
      }).join("")}
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
function timeAgo(iso) {
  if (!iso) return "never";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} hr ago`;
  const days = Math.round(mins / 1440);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
const attemptedOf = (progress) => Object.values(progress || {}).reduce((n, t) => n + (t.attempted || 0), 0);

function pageAdmin(view) {
  if (!me.isAdmin) { location.hash = "#/home"; return; }
  view.innerHTML = `
    <div class="page-head"><h1>Admin</h1><p>Manage accounts, feedback and questions.</p></div>
    <div class="grid cols-3" id="admin-stats"></div>

    <div class="section-label">Accounts</div>
    <div class="card">
      <input type="text" id="acct-search" placeholder="Search name or email" style="margin-bottom:10px;">
      <div id="accts"><p class="muted">Loading…</p></div>
    </div>

    <div class="section-label row between" style="margin-bottom:10px;">
      <span>Feedback</span><button class="btn ghost sm" id="fb-clear">Clear all</button>
    </div>
    <div class="card"><div id="fb-list"><p class="muted">Loading…</p></div></div>

    <div class="section-label">Import questions</div>
    <div class="card stack">
      <p class="small muted" style="margin:0;">Paste rows from a spreadsheet (comma or tab separated), one question per line:
        <code>subject, topic_id, prompt, answer, explanation, difficulty</code>. Subject is <code>maths</code> or <code>english</code>; difficulty is 1, 2 or 3.</p>
      <details><summary>Topic IDs</summary>
        <div class="small muted" style="margin-top:6px;">${QUIZ_TOPICS.map((t) => `<code>${t.id}</code> ${esc(t.name)}`).join("<br>")}</div>
      </details>
      <textarea id="import-text" style="font-family:monospace; font-size:13px;" placeholder="maths,y7-computation,What is 12 + 8?,20,Add the ones then the tens.,1"></textarea>
      <div class="row"><button class="btn" id="import-btn">Import</button><span class="small muted" id="import-status"></span></div>
      <div id="import-errors" class="small error"></div>
    </div>`;

  // ----- Accounts -----
  let accounts = [];
  const open = new Set(); // account ids with their action panel expanded

  function statusTag(a) {
    if (a.deleted) return `<span class="tag bad">Deleted</span>`;
    if (!a.has_paid) return `<span class="tag bad">Not paid</span>`;
    if (!a.paid_until) return `<span class="tag good">Paid</span>`;
    const until = new Date(a.paid_until);
    return until > new Date()
      ? `<span class="tag good">Paid until ${until.toLocaleDateString()}</span>`
      : `<span class="tag bad">Expired ${until.toLocaleDateString()}</span>`;
  }

  function drawStats() {
    const live = accounts.filter((a) => !a.deleted);
    $("#admin-stats", view).innerHTML =
      statCard("Accounts", live.length) +
      statCard("Points awarded", live.reduce((n, a) => n + (a.points || 0), 0)) +
      statCard("Questions answered", live.reduce((n, a) => n + attemptedOf(a.progress), 0));
  }

  function drawAccounts() {
    const q = $("#acct-search", view).value.trim().toLowerCase();
    const list = accounts.filter((a) => !q || (a.username || "").toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q));
    $("#accts", view).innerHTML = list.length ? list.map((a) => {
      const isMe = a.id === authUser.id;
      const btn = (act, label, cls = "secondary") => `<button class="btn ${cls} sm" data-act="${act}" data-id="${a.id}">${label}</button>`;
      return `
        <div class="list-row" style="${a.deleted ? "opacity:.5;" : ""}">
          <div class="grow">
            <strong>${esc(a.username || "(no name)")}</strong>${isMe ? " (you)" : ""}${a.is_admin ? ` <span class="tag">admin</span>` : ""}
            <div class="muted small">${esc(a.email)} · ${a.points || 0} pts · ${a.xp || 0} XP · ${attemptedOf(a.progress)} answered · seen ${timeAgo(a.last_seen)}</div>
          </div>
          ${statusTag(a)}
          <button class="btn ghost sm" data-toggle="${a.id}">${open.has(a.id) ? "Close" : "Manage"}</button>
          ${open.has(a.id) ? `
            <div class="row" style="flex-basis:100%; gap:6px;">
              ${btn("add-points", "+10 pts")}${btn("set-points", "Set pts…")}
              ${btn("add-xp", "+10 XP")}${btn("set-xp", "Set XP…")}
              ${btn("renew", "Renew 6 months")}
              ${btn("toggle-admin", a.is_admin ? "Remove admin" : "Make admin")}
              ${btn("reset", "Reset progress")}
              ${isMe ? "" : btn("kick", a.has_paid ? "Kick" : "Unkick", "ghost")}
              ${isMe ? "" : btn("delete", "Delete account", "ghost")}
            </div>` : ""}
        </div>`;
    }).join("") : `<p class="muted">No accounts found.</p>`;
  }
  $("#acct-search", view).addEventListener("input", drawAccounts);

  const sixMonthsFrom = (d) => { const x = new Date(d); x.setMonth(x.getMonth() + 6); return x.toISOString(); };
  const askNumber = (label) => {
    const val = prompt(label);
    if (val === null) return null;
    const n = parseInt(val, 10);
    if (isNaN(n)) { alert("Please enter a whole number."); return null; }
    return n;
  };

  $("#accts", view).addEventListener("click", async (e) => {
    const toggle = e.target.closest("[data-toggle]");
    if (toggle) {
      const id = toggle.dataset.toggle;
      open.has(id) ? open.delete(id) : open.add(id);
      return drawAccounts();
    }
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const a = accounts.find((x) => x.id === btn.dataset.id);
    const name = a.username || a.email;
    // Your own row may be stale if you've practised since this page loaded.
    if (a.id === authUser.id) { a.points = me.points; a.xp = me.xp; }
    let update = null;

    switch (btn.dataset.act) {
      case "add-points": update = { points: (a.points || 0) + 10 }; break;
      case "set-points": { const n = askNumber(`Set points for ${name}:`); if (n !== null) update = { points: n }; break; }
      case "add-xp": update = { xp: (a.xp || 0) + 10 }; break;
      case "set-xp": { const n = askNumber(`Set XP for ${name}:`); if (n !== null) update = { xp: n }; break; }
      case "renew": {
        // Extend from the later of today or the current expiry.
        const from = a.paid_until && new Date(a.paid_until) > new Date() ? a.paid_until : new Date();
        const until = sixMonthsFrom(from);
        if (confirm(`Renew ${name} until ${new Date(until).toLocaleDateString()}?`)) update = { has_paid: true, paid_until: until, deleted: false };
        break;
      }
      case "toggle-admin":
        if (confirm(`${a.is_admin ? "Remove admin from" : "Make admin:"} ${name}?`)) update = { is_admin: !a.is_admin };
        break;
      case "reset":
        if (confirm(`Reset all points and progress for ${name}? This can't be undone.`)) update = { points: 0, progress: {} };
        break;
      case "kick":
        if (confirm(`${a.has_paid ? "Suspend" : "Reinstate"} ${name}?`)) update = a.has_paid ? { has_paid: false } : { has_paid: true, paid_until: sixMonthsFrom(new Date()) };
        break;
      case "delete":
        if (!confirm(`Delete ${name}'s account? They'll be removed from the leaderboard and lose access.`)) break;
        if (prompt(`To confirm, type "${name}" exactly:`) !== name) { alert("Name didn't match — nothing was deleted."); break; }
        update = { deleted: true, has_paid: false, is_admin: false };
        break;
    }
    if (!update) return;

    btn.disabled = true;
    const { error } = await sb.from("profiles").update(update).eq("id", a.id);
    if (error) { btn.disabled = false; return alert(`Couldn't update ${name}: ${error.message}`); }
    Object.assign(a, update);
    if (a.id === authUser.id) {
      if ("points" in update) me.points = update.points;
      if ("xp" in update) me.xp = update.xp;
      if ("progress" in update) me.progress = {};
      if ("is_admin" in update) { me.isAdmin = update.is_admin; return enterApp(); }
      renderMeBox();
    }
    drawStats();
    drawAccounts();
  });

  (async () => {
    let { data, error } = await sb.from("profiles").select("id, username, email, points, xp, has_paid, paid_until, is_admin, progress, last_seen, deleted");
    if (error) ({ data, error } = await sb.from("profiles").select("id, username, email, points, xp, has_paid, paid_until, is_admin, progress"));
    if (error) { $("#accts", view).innerHTML = `<p class="muted">Couldn't load accounts.</p>`; return; }
    accounts = (data || []).sort((x, y) => (!!x.deleted - !!y.deleted) || (y.points || 0) - (x.points || 0));
    drawStats();
    drawAccounts();
  })();

  // ----- Feedback -----
  async function loadFeedback() {
    const box = $("#fb-list", view);
    const { data, error } = await sb.from("feedback").select("*").order("created_at", { ascending: false });
    if (error) { box.innerHTML = `<p class="muted">Couldn't load feedback.</p>`; return; }
    if (!data.length) { box.innerHTML = `<p class="muted">No feedback yet.</p>`; return; }
    box.innerHTML = data.map((f) => `
      <div class="list-row" style="align-items:flex-start; ${f.completed ? "opacity:.6;" : ""}">
        <input type="checkbox" data-done="${f.id}" ${f.completed ? "checked" : ""} title="Mark done" style="margin-top:4px;">
        <div class="grow">
          <div><span class="tag">${esc(f.category)}</span> <strong>${esc(f.username)}</strong> <span class="muted small">${new Date(f.created_at).toLocaleString()}</span></div>
          <div style="white-space:pre-wrap; margin-top:4px;">${esc(f.message)}</div>
          ${f.admin_reply ? `<div class="explain"><strong>Your reply:</strong> ${esc(f.admin_reply)}</div>` : ""}
          <div class="row" style="flex-wrap:nowrap; margin-top:8px;">
            <input type="text" data-reply-input="${f.id}" placeholder="${f.admin_reply ? "Update your reply…" : "Write a reply…"}">
            <button class="btn secondary sm" data-reply="${f.id}">Reply</button>
          </div>
        </div>
      </div>`).join("");
  }
  $("#fb-list", view).addEventListener("change", async (e) => {
    const cb = e.target.closest("[data-done]");
    if (!cb) return;
    const { error } = await sb.from("feedback").update({ completed: cb.checked }).eq("id", cb.dataset.done);
    if (error) { cb.checked = !cb.checked; return toast("Update failed."); }
    loadFeedback();
  });
  $("#fb-list", view).addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-reply]");
    if (!btn) return;
    const text = $(`[data-reply-input="${btn.dataset.reply}"]`, view).value.trim();
    if (!text) return toast("Write a reply first.");
    btn.disabled = true;
    const { error } = await sb.from("feedback").update({ admin_reply: text, replied_at: new Date().toISOString() }).eq("id", btn.dataset.reply);
    if (error) { btn.disabled = false; return toast("Couldn't send reply."); }
    toast("Reply sent");
    loadFeedback();
  });
  $("#fb-clear", view).addEventListener("click", async () => {
    if (!confirm("Delete all feedback? This can't be undone.")) return;
    const { error } = await sb.from("feedback").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) return toast("Couldn't clear feedback.");
    loadFeedback();
  });
  loadFeedback();

  // ----- Bulk import -----
  $("#import-btn", view).addEventListener("click", async () => {
    const status = $("#import-status", view);
    const errBox = $("#import-errors", view);
    const rows = [];
    const errors = [];
    $("#import-text", view).value.split("\n").map((l) => l.trim()).filter(Boolean).forEach((line, i) => {
      const parts = line.split(line.includes("\t") ? "\t" : ",").map((x) => x.trim());
      const [subject, topic_id, prompt, answer, explanation, diff] = parts;
      const difficulty = parseInt(diff, 10);
      if (parts.length < 6) return errors.push(`Line ${i + 1}: needs 6 columns, found ${parts.length}.`);
      if (!["maths", "english"].includes(subject)) return errors.push(`Line ${i + 1}: subject must be maths or english.`);
      if (!QUIZ_TOPICS.some((t) => t.id === topic_id)) return errors.push(`Line ${i + 1}: unknown topic_id "${topic_id}".`);
      if (![1, 2, 3].includes(difficulty)) return errors.push(`Line ${i + 1}: difficulty must be 1, 2 or 3.`);
      if (!prompt || !answer) return errors.push(`Line ${i + 1}: prompt and answer can't be empty.`);
      rows.push({ subject, topic_id, prompt, answer, explanation: explanation || "", difficulty, created_by: authUser.id });
    });
    errBox.innerHTML = errors.map(esc).join("<br>");
    if (!rows.length) { status.textContent = "No valid rows to import."; return; }
    status.textContent = `Importing ${rows.length}…`;
    const { error } = await sb.from("custom_questions").insert(rows);
    if (error) { console.error(error); status.textContent = "Import failed — see the browser console."; return; }
    status.textContent = `Imported ${rows.length} question${rows.length === 1 ? "" : "s"}.`;
    $("#import-text", view).value = "";
    loadCustomQuestions();
  });
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
