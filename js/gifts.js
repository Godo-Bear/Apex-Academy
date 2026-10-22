/* =========================================================
   JINtelligence — game data in the cloud, and admin gifts
   · Badges, game best scores and the day streak are saved to your account
     (profiles.game_data), so they follow you to any device.
   · Admins can give (or take away) points, XP, badges, a rank, a day streak
     and extra paid time — to one person or everyone. The person sees a
     "🎁 You got a gift!" pop-up.
   Needs supabase/game-data.sql (one new column). Without it, everything
   still works on this device only.
========================================================= */

let cloudGame = false; // set at login once we know the game_data column exists
let gameSyncTimer = null;

const giftBadge = (id) => (typeof GAME_BADGES !== "undefined" ? GAME_BADGES.find((b) => b.id === id) : null);
const bestIsLower = (key) => key.startsWith("boss:");

async function fetchGameData(id = authUser.id) {
  const { data, error } = await sb.from("profiles").select("game_data").eq("id", id).single();
  if (error) throw error;
  return data?.game_data || {};
}

// Merges this device's badges, best scores and streak with the account's, applies any gifts,
// saves the result in both places, and returns the gifts that were waiting.
async function syncGame() {
  if (!cloudGame || !authUser) return [];
  let cloud;
  try { cloud = await fetchGameData(); } catch (e) { return []; }
  const gifts = Array.isArray(cloud.gifts) ? cloud.gifts : [];

  const badges = { ...(cloud.badges || {}), ...(store(gameKey("badges")) || {}) };
  gifts.forEach((g) => { if (g.kind === "badge" && g.badge) badges[g.badge] ||= g.at || todayStr(); });
  // Badges an admin removed stay removed on every device, unless earned again in a game afterwards.
  const removed = { ...(cloud.removed || {}) };
  Object.entries(removed).forEach(([id, when]) => {
    if (badges[id] && String(badges[id]) <= when) delete badges[id];
    else if (badges[id]) delete removed[id];
  });

  const best = { ...(cloud.best || {}) };
  Object.entries(store(gameKey("best")) || {}).forEach(([k, v]) => {
    if (best[k] == null || (bestIsLower(k) ? v < best[k] : v > best[k])) best[k] = v;
  });

  // Streak: an admin's gift wins; otherwise keep whichever was played more recently.
  const local = store(streakKey()) || {};
  let streak = cloud.streak && (!local.last || cloud.streak.last > local.last || (cloud.streak.last === local.last && cloud.streak.streak > local.streak)) ? cloud.streak : local;
  const streakGift = [...gifts].reverse().find((g) => g.kind === "streak");
  if (streakGift) streak = { streak: Math.max(0, streakGift.amount | 0), last: todayStr() };

  store(gameKey("badges"), badges);
  store(gameKey("best"), best);
  if (streak.last) store(streakKey(), streak);
  try {
    await sb.from("profiles").update({ game_data: { ...cloud, badges, best, streak, removed, gifts: [] } }).eq("id", authUser.id);
  } catch (e) { /* try again next time */ }

  // Points, XP, rank and paid time are changed on the account directly: reload them.
  if (gifts.some((g) => ["points", "xp", "rank", "months"].includes(g.kind))) {
    const { data } = await sb.from("profiles").select("points, xp, paid_until").eq("id", authUser.id).single();
    if (data) { me.points = data.points || 0; me.xp = data.xp || 0; me.paidUntil = data.paid_until || me.paidUntil; }
  }
  renderMeBox();
  return gifts;
}

// Saves soon (after a game ends or the streak changes), and shows any gifts that arrived.
function saveGameSoon() {
  clearTimeout(gameSyncTimer);
  gameSyncTimer = setTimeout(async () => { const gifts = await syncGame(); if (gifts.length) showGifts(gifts); }, 800);
}

function giftLine(g) {
  const n = Math.abs(g.amount | 0), took = (g.amount | 0) < 0;
  switch (g.kind) {
    case "points": return took ? `➖ ${n} points taken away` : `✦ +${n} points`;
    case "xp": return took ? `➖ ${n} XP taken away` : `⚡ +${n} XP`;
    case "badge": { const b = giftBadge(g.badge); return `${b?.icon || "🏅"} New badge: ${b?.name || g.badge}`; }
    case "badge-removed": { const b = giftBadge(g.badge); return `🔒 Badge removed: ${b?.name || g.badge}`; }
    case "rank": return `🏅 Your rank is now ${g.rank}`;
    case "streak": return `🔥 Your day streak is now ${n} day${n === 1 ? "" : "s"}`;
    case "months": return `📅 +${n} month${n === 1 ? "" : "s"} of access`;
    default: return "🎁 A gift";
  }
}

function showGifts(gifts, next) {
  const notes = gifts.filter((g) => g.note).map((g) => g.note);
  const box = document.createElement("div");
  box.className = "modal";
  box.innerHTML = `
    <div class="card stack gift-card" role="dialog" aria-modal="true" aria-labelledby="gift-title">
      <div class="gift-ico" aria-hidden="true">🎁</div>
      <h2 id="gift-title" style="margin:0;">${gifts.length > 1 ? "You got gifts!" : "You got a gift!"}</h2>
      <ul class="gift-list">${gifts.map((g) => `<li>${esc(giftLine(g))}</li>`).join("")}</ul>
      ${notes.length ? `<div class="gift-note">${notes.map((n) => `“${esc(n)}”`).join("<br>")}<span class="muted small"> — from ${esc(gifts.find((g) => g.note)?.from || "an admin")}</span></div>` : ""}
      <button class="btn" type="button">Awesome!</button>
    </div>`;
  document.body.appendChild(box);
  $("button", box).focus();
  $("button", box).addEventListener("click", () => {
    box.remove();
    if (!leaveWarning && !document.querySelector("#g-form")) route(); // show the new points, rank and streak on the page
    next?.();
  });
}

// Login: sync, then show gifts after the other notices. Also checks every minute for new gifts.
function giftsNotice(next) {
  syncGame().then((gifts) => (gifts.length ? showGifts(gifts, next) : next()), () => next());
}
setInterval(async () => {
  if (!me || !cloudGame || document.hidden || document.querySelector(".gift-card")) return;
  try {
    const g = await fetchGameData();
    if ((g.gifts || []).length) saveGameSoon();
  } catch (e) { /* offline */ }
}, 60 * 1000);

// ---------------- Admin: give things ----------------
// The give box is a checklist: tick as many things as you like, then give them all at once.
const GIVE_ROWS = [
  { kind: "points", label: "✦ Points", hint: "Use a minus number to take some away." },
  { kind: "xp", label: "⚡ XP", hint: "Use a minus number to take some away." },
  { kind: "badge", label: "🏅 Give badges" },
  { kind: "badge-removed", label: "🔒 Take badges away" },
  { kind: "rank", label: "🎖️ Set rank" },
  { kind: "streak", label: "🔥 Set day streak" },
  { kind: "months", label: "📅 Extra paid time" },
];

function giveFormHTML(key) {
  const badgeChips = (kind) => (typeof GAME_BADGES !== "undefined" ? GAME_BADGES : []).map((b) =>
    `<label class="chip-check sm"><input type="checkbox" class="give-badge" value="${b.id}"> ${b.icon} ${esc(b.name)}</label>`).join("");
  const control = (r) => {
    const id = `g-${r.kind}-${key}`;
    if (r.kind === "points" || r.kind === "xp") return `<input type="number" id="${id}" class="give-amount" value="100" step="1" aria-label="${r.label} amount">`;
    if (r.kind === "streak") return `<input type="number" id="${id}" class="give-amount" value="7" min="0" step="1" aria-label="Days"> <span class="muted small">days</span>`;
    if (r.kind === "rank") return `<select id="${id}" class="give-rank" aria-label="Rank">${XP_LEVELS.map((l) => `<option value="${esc(l.name)}">${l.icon} ${esc(l.name)} (${l.min} XP)</option>`).join("")}</select>`;
    if (r.kind === "months") return `<select id="${id}" class="give-months" aria-label="Extra time">${[1, 2, 3, 6, 12].map((m) => `<option value="${m}">${m} month${m === 1 ? "" : "s"}</option>`).join("")}</select>`;
    return `<span class="muted small give-closed">Tick to choose badges</span><div class="checklist give-badges">${badgeChips(r.kind)}</div>`;
  };
  return `
    <div class="give-box" data-give="${key}">
      <span class="field" style="margin:0;">Tick everything you want to give or take away</span>
      ${GIVE_ROWS.map((r) => `
        <div class="give-row" data-kind="${r.kind}">
          <label class="give-tick"><input type="checkbox" class="give-on"> ${r.label}</label>
          <div class="give-ctl">${control(r)}${r.hint ? `<span class="muted small give-hint">${r.hint}</span>` : ""}</div>
        </div>`).join("")}
      <div><label class="field" for="gn-${key}">Message <span class="muted">(optional, shown with the gift)</span></label>
        <input type="text" id="gn-${key}" class="give-note" maxlength="120" placeholder="e.g. Great work on your test!"></div>
      <div class="row"><button class="btn sm" type="button" data-give-go="${key}">🎁 Give</button><span class="small muted give-status"></span></div>
    </div>`;
}

// Ticking a row shows its options; changing an option ticks its row.
function wireGiveForm(box) {
  $$(".give-row", box).forEach((row) => {
    const on = $(".give-on", row), ctl = $(".give-ctl", row);
    const draw = () => { row.classList.toggle("on", on.checked); };
    on.addEventListener("change", draw);
    ctl.addEventListener("input", () => { on.checked = row.dataset.kind.startsWith("badge") ? $$(".give-badge:checked", row).length > 0 || on.checked : true; draw(); });
    ctl.addEventListener("change", () => { if (row.dataset.kind.startsWith("badge") && !$$(".give-badge:checked", row).length) on.checked = false; else on.checked = true; draw(); });
    draw();
  });
}

// Everything ticked, as a list of gifts. Rank goes before XP so "set rank, then +XP" adds on top.
function readGiveForm(box) {
  const items = [];
  $$(".give-row", box).forEach((row) => {
    if (!$(".give-on", row).checked) return;
    const kind = row.dataset.kind;
    if (kind === "points" || kind === "xp" || kind === "streak") items.push({ kind, amount: parseInt($(".give-amount", row).value, 10) || 0 });
    if (kind === "rank") items.push({ kind, rank: $(".give-rank", row).value });
    if (kind === "months") items.push({ kind, months: +$(".give-months", row).value });
    if (kind.startsWith("badge")) $$(".give-badge:checked", row).forEach((b) => items.push({ kind, badge: b.value }));
  });
  items.sort((a, b) => (a.kind === "rank" ? -1 : b.kind === "rank" ? 1 : 0));
  return { items, note: $(".give-note", box).value.trim() };
}

// Gives a list of things to one account in one save. Returns the profile fields that changed.
async function adminGive(account, items, note = "") {
  const { data, error } = await sb.from("profiles").select("game_data, points, xp, paid_until").eq("id", account.id).single();
  if (error) throw error;
  const game = { ...(data.game_data || {}) };
  const update = {};
  let points = data.points || 0, xp = data.xp || 0;
  const at = new Date().toISOString();
  const gifts = items.map((g, i) => {
    const gift = { kind: g.kind, at, from: me.name, ...(note && i === 0 ? { note } : {}) };
    switch (g.kind) {
      case "points": points = Math.max(0, points + g.amount); update.points = points; gift.amount = g.amount; break;
      case "xp": xp = Math.max(0, xp + g.amount); update.xp = xp; gift.amount = g.amount; break;
      case "rank": xp = XP_LEVELS.find((l) => l.name === g.rank)?.min ?? xp; update.xp = xp; gift.rank = g.rank; break;
      case "badge": {
        game.badges = { ...(game.badges || {}), [g.badge]: at };
        const r = { ...(game.removed || {}) }; delete r[g.badge]; game.removed = r; gift.badge = g.badge; break;
      }
      case "badge-removed": {
        const b = { ...(game.badges || {}) }; delete b[g.badge]; game.badges = b;
        game.removed = { ...(game.removed || {}), [g.badge]: at }; gift.badge = g.badge; break;
      }
      case "streak": game.streak = { streak: Math.max(0, g.amount), last: todayStr() }; gift.amount = Math.max(0, g.amount); break;
      case "months": {
        const from = (update.paid_until || data.paid_until) && new Date(update.paid_until || data.paid_until) > new Date() ? new Date(update.paid_until || data.paid_until) : new Date();
        from.setMonth(from.getMonth() + g.months);
        update.paid_until = from.toISOString(); update.has_paid = true; gift.amount = g.months; break;
      }
    }
    return gift;
  });
  game.gifts = [...(Array.isArray(game.gifts) ? game.gifts : []), ...gifts].slice(-40);
  update.game_data = game;
  const { error: e2 } = await sb.from("profiles").update(update).eq("id", account.id);
  if (e2) throw e2;
  if (account.id === authUser.id) saveGameSoon(); // giving yourself something: show it now
  return update;
}

// Short wording for the admin's confirm and "done" messages, e.g. "+100 points, Master rank, On fire badge".
function giveLabel(items) {
  const sign = (n) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`);
  return items.map((g) => {
    const b = giftBadge(g.badge)?.name || g.badge;
    switch (g.kind) {
      case "points": return `${sign(g.amount)} points`;
      case "xp": return `${sign(g.amount)} XP`;
      case "badge": return `${b} badge`;
      case "badge-removed": return `remove ${b} badge`;
      case "rank": return `${g.rank} rank`;
      case "streak": return `${g.amount}-day streak`;
      case "months": return `+${g.months} month${g.months === 1 ? "" : "s"} access`;
      default: return g.kind;
    }
  }).join(", ");
}
const GAME_DATA_SQL_HINT = "Run supabase/game-data.sql in Supabase first (it adds the game_data column).";
