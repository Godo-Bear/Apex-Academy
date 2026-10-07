/* Public tests: students can share a test so everyone with an account can find it and take it.
   Saved in the Supabase "public_tests" table (supabase/public-tests.sql).
   - Questions from the question bank are shared as references (topic + question id), so they always
     show exactly as they are in the bank.
   - AI-made questions are shared as their content, and pass through normaliseAIQuestions() (the same
     clean-up as AI output) when someone opens the test.
   The sharer can remove their own tests; admins can remove any.
   Uses helpers from app.js ($, $$, esc, toast, sb, authUser, me, findTopic, ALL_TOPICS, runTest, …). */

const PUBLIC_SUBJECTS = ["Maths", "English", "Science", "Other"];
const SUBJECT_ICON = { Maths: "➗", English: "📖", Science: "🔬", Other: "🌍" };

// ---------------------------------------------------------------- Packing questions to share
function findBankQuestion(id) {
  for (const t of ALL_TOPICS) {
    const q = (t.questions || []).find((x) => x.id === id && !x.isCustom);
    if (q) return { q, topic: t };
  }
  return null;
}
function packQuestion({ q, topic }) {
  if (topic?.id && findBankQuestion(q.id)) return { ref: q.id };
  const out = {
    prompt: q.prompt, explanation: q.explanation || "", difficulty: q.difficulty || 2,
    topicName: q.topicName || topic?.name || "Question",
  };
  if (q.passage) out.passage = q.passage;
  if (q.visual) out.visual = q.visual;
  if (q.answerType === "written") out.type = "written";
  if (q.answerType === "point") out.type = "point";
  if (q.options) out.options = q.options;
  out.answer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
  return out;
}
function unpackQuestions(list) {
  return (Array.isArray(list) ? list : []).slice(0, 60).map((item) => {
    if (item && typeof item.ref === "string") return findBankQuestion(item.ref);
    const [q] = normaliseAIQuestions([item], 1);
    return q ? { q, topic: { id: null, name: q.topicName, icon: "🌍" } } : null;
  }).filter(Boolean);
}
// A sensible subject guess from the questions' topics.
function guessSubject(items) {
  const counts = {};
  items.forEach(({ topic }) => {
    const s = topic?.subject ? topic.subject[0].toUpperCase() + topic.subject.slice(1) : null;
    if (s) counts[s] = (counts[s] || 0) + 1;
  });
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : "Other";
}

// ---------------------------------------------------------------- Share a test
function openShareTest(items, { minutes = 0, title = "" } = {}) {
  if (!items.length) return toast("Add some questions first.");
  $("#modal-share-test")?.remove();
  const subject = guessSubject(items);
  const modal = document.createElement("div");
  modal.id = "modal-share-test";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="card stack" style="max-width:520px;">
      <div class="row between"><h2 style="margin:0;">🌍 Share this test</h2><button class="btn ghost" data-close>✕</button></div>
      <p class="muted small" style="margin:0;">Everyone with an Apex Academy account will be able to find this test and take it. Don't put personal information in it.</p>
      <div><label class="field" for="sh-title">Test name</label>
        <input type="text" id="sh-title" maxlength="80" value="${esc(title)}" placeholder="e.g. Fractions warm-up"></div>
      <div><label class="field" for="sh-subject">Subject</label>
        <select id="sh-subject">${PUBLIC_SUBJECTS.map((s) => `<option${s === subject ? " selected" : ""}>${s}</option>`).join("")}</select></div>
      <div><label class="field" for="sh-desc">Description <span class="muted">(optional)</span></label>
        <textarea id="sh-desc" maxlength="300" rows="2" style="min-height:60px;" placeholder="What's it about? Who is it for?"></textarea></div>
      <label class="small" style="display:flex; gap:8px; align-items:center;">
        <input type="checkbox" id="sh-name" ${me.showPoints === false ? "" : "checked"}> Show my name (${esc(me.name)}) on it
      </label>
      <p class="muted small" style="margin:0;">${items.length} question${items.length === 1 ? "" : "s"}${minutes ? ` · ${minutes} minute limit` : " · no time limit"}</p>
      <div id="sh-error" class="error hidden"></div>
      <div class="row" style="justify-content:flex-end;">
        <button class="btn ghost" data-close type="button">Cancel</button>
        <button class="btn" id="sh-go" type="button">Share test</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  $("#sh-title", modal).focus();
  $("#sh-go", modal).addEventListener("click", async () => {
    const name = $("#sh-title", modal).value.trim();
    const err = $("#sh-error", modal);
    if (name.length < 3) return setMsg(err, "Give your test a name (at least 3 letters).", "error");
    const btn = $("#sh-go", modal);
    btn.disabled = true; btn.textContent = "Sharing…";
    const questions = items.slice(0, 60).map(packQuestion);
    let error;
    try {
      ({ error } = await sb.from("public_tests").insert({
        user_id: authUser.id,
        author: $("#sh-name", modal).checked ? me.name : "",
        title: name,
        description: $("#sh-desc", modal).value.trim().slice(0, 300),
        subject: $("#sh-subject", modal).value,
        questions, question_count: questions.length, minutes: Math.max(0, Math.min(180, minutes | 0)),
      }));
    } catch (e) { error = e; }
    if (error) {
      console.error("Apex: couldn't share test —", error);
      btn.disabled = false; btn.textContent = "Share test";
      return setMsg(err, /does not exist|schema cache|relation/i.test(error.message || "") ? "Sharing isn't set up yet — ask the site owner to turn on public tests." : "Couldn't share the test — try again.", "error");
    }
    modal.remove();
    toast("🌍 Your test is now public!");
    if (testMode === "public" && switchStudyMode) switchStudyMode("public");
  });
}

// ---------------------------------------------------------------- Browse and take public tests
const publicState = { search: "", subject: "All", sort: "new", mine: false };

function publicTestsMode(view, host, focusId) {
  host.innerHTML = `
    <div class="card stack">
      <div class="pub-bar">
        <input type="text" id="pub-search" enterkeyhint="search" placeholder="Search public tests…" value="${esc(publicState.search)}" aria-label="Search public tests">
        <select id="pub-sort" aria-label="Sort">
          <option value="new"${publicState.sort === "new" ? " selected" : ""}>Newest</option>
          <option value="plays"${publicState.sort === "plays" ? " selected" : ""}>Most played</option>
        </select>
      </div>
      <div class="pub-chips">
        ${["All", ...PUBLIC_SUBJECTS].map((s) => `<button type="button" class="notes-chip${publicState.subject === s ? " on" : ""}" data-subject="${s}">${s === "All" ? "All" : `${SUBJECT_ICON[s]} ${s}`}</button>`).join("")}
        <button type="button" class="notes-chip${publicState.mine ? " on" : ""}" data-mine>👤 Mine</button>
      </div>
      <p class="muted small" style="margin:0;">Want to share your own? Build a test in <b>Pick topics</b> or <b>AI test</b>, then press <b>🌍 Share</b>.</p>
    </div>
    <div id="pub-list" class="stack"><p class="muted">Loading public tests…</p></div>`;

  let rows = [];
  const list = $("#pub-list", host);

  function draw() {
    const term = publicState.search.trim().toLowerCase();
    let shown = rows.filter((r) =>
      (publicState.subject === "All" || r.subject === publicState.subject) &&
      (!publicState.mine || r.user_id === authUser.id) &&
      (!term || `${r.title} ${r.description} ${r.author} ${r.subject}`.toLowerCase().includes(term)));
    shown = shown.sort((a, b) => (publicState.sort === "plays" ? (b.plays || 0) - (a.plays || 0) : 0) || String(b.created_at).localeCompare(String(a.created_at)));
    if (focusId) shown = [...shown.filter((r) => r.id === focusId), ...shown.filter((r) => r.id !== focusId)];
    list.innerHTML = shown.length ? shown.map((r) => `
      <div class="card pub-card${r.id === focusId ? " focus" : ""}" data-id="${esc(r.id)}">
        <div class="row between" style="align-items:flex-start; gap:10px;">
          <div style="min-width:0;">
            <h3 class="pub-title">${SUBJECT_ICON[r.subject] || "🌍"} ${esc(r.title)}</h3>
            <div class="muted small">by ${esc(r.author || "Anonymous")} · ${r.question_count} question${r.question_count === 1 ? "" : "s"} · ${r.minutes ? `⏱ ${r.minutes} min` : "no time limit"} · ▶ played ${r.plays || 0} time${r.plays === 1 ? "" : "s"} · ${fmtDate(r.created_at)}</div>
          </div>
          <span class="tag">${esc(r.subject)}</span>
        </div>
        ${r.description ? `<p class="small" style="margin:8px 0 0; white-space:pre-wrap;">${esc(r.description)}</p>` : ""}
        <div class="pub-preview hidden"></div>
        <div class="row pub-actions">
          <button class="btn sm" data-act="start" type="button">Start test →</button>
          <button class="btn ghost sm" data-act="preview" type="button">👀 Preview</button>
          <button class="btn ghost sm" data-act="link" type="button">🔗 Copy link</button>
          ${r.user_id === authUser.id || me.isAdmin ? `<button class="btn ghost sm" data-act="delete" type="button">🗑 ${r.user_id === authUser.id ? "Remove" : "Remove (admin)"}</button>` : `<button class="btn ghost sm" data-act="report" type="button">🚩 Report</button>`}
        </div>
      </div>`).join("")
      : `<div class="card"><p class="muted" style="margin:0;">${rows.length ? "No public tests match that." : "No public tests yet. Be the first — build a test, then press 🌍 Share."}</p></div>`;
  }

  async function loadQuestions(id) {
    const { data, error } = await sb.from("public_tests").select("questions").eq("id", id).maybeSingle();
    if (error || !data) throw error || new Error("Not found");
    return unpackQuestions(data.questions);
  }

  list.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest(".pub-card"), id = card.dataset.id, row = rows.find((r) => r.id === id);
    const act = btn.dataset.act;
    if (act === "start" || act === "preview") {
      btn.disabled = true;
      let items;
      try { items = await loadQuestions(id); } catch (err) { console.error(err); btn.disabled = false; return toast("Couldn't open that test — try again."); }
      btn.disabled = false;
      if (!items.length) return toast("That test has no questions left that can be shown.");
      if (act === "preview") {
        const box = $(".pub-preview", card);
        box.classList.toggle("hidden");
        box.innerHTML = `<ol class="draft-list">${items.map(({ q }) => `<li><span class="draft-q">${esc(q.prompt)}</span></li>`).join("")}</ol>`;
        return;
      }
      try { await sb.rpc("public_test_played", { test_id: id }); } catch (err) { /* the play count is only a nice-to-have */ }
      runTest(view, items, row.minutes || 0, { again: "Back to public tests", publicId: id });
      return;
    }
    if (act === "link") {
      const url = `${location.origin}${location.pathname}#/test/public/${id}`;
      try { await navigator.clipboard.writeText(url); toast("Link copied — send it to a friend!"); }
      catch (err) { prompt("Copy this link:", url); }
      return;
    }
    if (act === "report") {
      openModal("feedback");
      $("#feedback-category").value = "other";
      $("#feedback-message").value = `Report public test: "${row.title}" (id ${id}). Reason: `;
      $("#feedback-message").focus();
      return;
    }
    if (act === "delete") {
      if (!confirm(`Remove "${row.title}" from public tests? This can't be undone.`)) return;
      const { error } = await sb.from("public_tests").delete().eq("id", id);
      if (error) return toast("Couldn't remove it — try again.");
      rows = rows.filter((r) => r.id !== id);
      draw();
      toast("Test removed");
    }
  });

  $("#pub-search", host).addEventListener("input", (e) => { publicState.search = e.target.value; draw(); });
  $("#pub-sort", host).addEventListener("change", (e) => { publicState.sort = e.target.value; draw(); });
  $$(".pub-chips .notes-chip", host).forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.mine !== undefined) publicState.mine = !publicState.mine;
    else publicState.subject = b.dataset.subject;
    $$(".pub-chips .notes-chip", host).forEach((x) => x.classList.toggle("on", x.dataset.mine !== undefined ? publicState.mine : x.dataset.subject === publicState.subject));
    draw();
  }));

  (async () => {
    let data, error;
    try {
      ({ data, error } = await sb.from("public_tests")
        .select("id, user_id, author, title, description, subject, question_count, minutes, plays, created_at")
        .order("created_at", { ascending: false }).limit(300));
    } catch (e) { error = e; }
    if (!document.body.contains(list)) return;
    if (error) {
      console.warn("Apex: public tests unavailable —", error.message || error);
      list.innerHTML = `<div class="card"><p class="muted" style="margin:0;">Public tests aren't switched on yet.${me.isAdmin ? " (Admin: run <code>supabase/public-tests.sql</code> in Supabase.)" : ""}</p></div>`;
      return;
    }
    rows = data || [];
    draw();
    if (focusId) list.querySelector(".pub-card.focus")?.scrollIntoView({ block: "center" });
  })();
}
