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
const GIVE_KINDS = [
  ["points", "✦ Points"], ["xp", "⚡ XP"], ["badge", "🏅 A badge"], ["badge-removed", "🔒 Remove a badge"],
  ["rank", "🎖️ A rank"], ["streak", "🔥 Day streak"], ["months", "📅 Extra paid time"],
];

function giveFormHTML(key) {
  const badgeOpts = (typeof GAME_BADGES !== "undefined" ? GAME_BADGES : []).map((b) => `<option value="${b.id}">${b.icon} ${esc(b.name)}</option>`).join("");
  return `
    <div class="give-box" data-give="${key}">
      <div class="give-grid">
        <div><label class="field" for="gk-${key}">Give</label>
          <select id="gk-${key}" class="give-kind">${GIVE_KINDS.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></div>
        <div class="give-f give-amount-f"><label class="field" for="ga-${key}">Amount</label>
          <input type="number" id="ga-${key}" class="give-amount" value="100" step="1">
          <span class="muted small give-hint">Use a minus number to take some away.</span></div>
        <div class="give-f give-badge-f hidden"><label class="field" for="gb-${key}">Badge</label><select id="gb-${key}" class="give-badge">${badgeOpts}</select></div>
        <div class="give-f give-rank-f hidden"><label class="field" for="gr-${key}">Rank</label>
          <select id="gr-${key}" class="give-rank">${XP_LEVELS.map((l) => `<option value="${esc(l.name)}">${l.icon} ${esc(l.name)} (${l.min} XP)</option>`).join("")}</select></div>
        <div class="give-f give-months-f hidden"><label class="field" for="gm-${key}">Time</label>
          <select id="gm-${key}" class="give-months">${[1, 2, 3, 6, 12].map((m) => `<option value="${m}">${m} month${m === 1 ? "" : "s"}</option>`).join("")}</select></div>
      </div>
      <div><label class="field" for="gn-${key}">Message <span class="muted">(optional, shown with the gift)</span></label>
        <input type="text" id="gn-${key}" class="give-note" maxlength="120" placeholder="e.g. Great work on your test!"></div>
      <div class="row"><button class="btn sm" type="button" data-give-go="${key}">🎁 Give</button><span class="small muted give-status"></span></div>
    </div>`;
}

// Shows only the boxes that suit what's being given.
function wireGiveForm(box) {
  const kind = $(".give-kind", box);
  const draw = () => {
    const k = kind.value;
    $(".give-amount-f", box).classList.toggle("hidden", !["points", "xp", "streak"].includes(k));
    $(".give-hint", box).classList.toggle("hidden", k === "streak");
    $(".give-badge-f", box).classList.toggle("hidden", !k.startsWith("badge"));
    $(".give-rank-f", box).classList.toggle("hidden", k !== "rank");
    $(".give-months-f", box).classList.toggle("hidden", k !== "months");
    if (k === "streak" && +$(".give-amount", box).value === 100) $(".give-amount", box).value = 7;
  };
  kind.addEventListener("change", draw);
  draw();
}

function readGiveForm(box) {
  return {
    kind: $(".give-kind", box).value,
    amount: parseInt($(".give-amount", box).value, 10) || 0,
    badge: $(".give-badge", box).value,
    rank: $(".give-rank", box).value,
    months: +$(".give-months", box).value,
    note: $(".give-note", box).value.trim(),
  };
}

// Gives one thing to one account. Returns the profile fields that changed.
async function adminGive(account, g) {
  const { data, error } = await sb.from("profiles").select("game_data, points, xp, paid_until").eq("id", account.id).single();
  if (error) throw error;
  const game = { ...(data.game_data || {}) };
  const gift = { kind: g.kind, at: new Date().toISOString(), from: me.name, ...(g.note ? { note: g.note } : {}) };
  const update = {};
  switch (g.kind) {
    case "points": update.points = Math.max(0, (data.points || 0) + g.amount); gift.amount = g.amount; break;
    case "xp": update.xp = Math.max(0, (data.xp || 0) + g.amount); gift.amount = g.amount; break;
    case "badge": {
      game.badges = { ...(game.badges || {}), [g.badge]: gift.at };
      const r = { ...(game.removed || {}) }; delete r[g.badge]; game.removed = r; gift.badge = g.badge; break;
    }
    case "badge-removed": {
      const b = { ...(game.badges || {}) }; delete b[g.badge]; game.badges = b;
      game.removed = { ...(game.removed || {}), [g.badge]: gift.at }; gift.badge = g.badge; break;
    }
    case "rank": update.xp = XP_LEVELS.find((l) => l.name === g.rank)?.min ?? data.xp; gift.rank = g.rank; break;
    case "streak": game.streak = { streak: Math.max(0, g.amount), last: todayStr() }; gift.amount = Math.max(0, g.amount); break;
    case "months": {
      const from = data.paid_until && new Date(data.paid_until) > new Date() ? new Date(data.paid_until) : new Date();
      from.setMonth(from.getMonth() + g.months);
      update.paid_until = from.toISOString(); update.has_paid = true; gift.amount = g.months; break;
    }
  }
  game.gifts = [...(Array.isArray(game.gifts) ? game.gifts : []), gift].slice(-30);
  update.game_data = game;
  const { error: e2 } = await sb.from("profiles").update(update).eq("id", account.id);
  if (e2) throw e2;
  if (account.id === authUser.id) saveGameSoon(); // giving yourself something: show it now
  return update;
}

const giveLabel = (g) => giftLine({ ...g, amount: g.kind === "months" ? g.months : g.amount }).replace(/^\S+\s/, "");
const GAME_DATA_SQL_HINT = "Run supabase/game-data.sql in Supabase first (it adds the game_data column).";
