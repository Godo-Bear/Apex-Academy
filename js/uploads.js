/* Upload files for the AI to make test questions from.
   Reads PDFs, Word (.docx), PowerPoint (.pptx), text files and photos in the browser:
   - text is pulled out of documents and sent to the AI with the request;
   - photos (and scanned PDF pages with no text) are shrunk and joined into one picture the AI can look at.
   The PDF and Word/PowerPoint readers load from cdnjs only when such a file is picked.
   Uses helpers from app.js ($, $$, esc, toast). */

const UPLOAD_LIMITS = { files: 8, textChars: 20000, images: 6, pdfPages: 30, scanPages: 4 };
const UPLOAD_ACCEPT = ".pdf,.docx,.pptx,.txt,.md,.csv,.rtf,image/*";

const loadedScripts = {};
function loadScript(src) {
  if (!loadedScripts[src]) loadedScripts[src] = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => { delete loadedScripts[src]; reject(new Error("Couldn't load the file reader — check your internet connection.")); };
    document.head.appendChild(s);
  });
  return loadedScripts[src];
}
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const JSZIP = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";

const decodeXml = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const tidy = (s) => s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

// Draws an image (or canvas) shrunk to fit `max` pixels, as a JPEG data URL.
function shrinkToJpeg(src, w, h, max = 1400) {
  const k = Math.min(1, max / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
  g.drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That picture couldn't be opened."));
    img.src = url;
  });
}

async function readPdf(file) {
  await loadScript(PDFJS);
  const lib = window.pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = Math.min(pdf.numPages, UPLOAD_LIMITS.pdfPages);
  let text = "";
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    content.items.forEach((it) => { line += it.str + (it.hasEOL ? "\n" : " "); });
    text += `\n[Page ${i}]\n${line}`;
  }
  const images = [];
  // Little or no text means it's probably scanned: look at the pages as pictures instead.
  if (text.replace(/\[Page \d+\]|\s/g, "").length < 40 * pages) {
    for (let i = 1; i <= Math.min(pdf.numPages, UPLOAD_LIMITS.scanPages); i++) {
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: 1.6 });
      const c = document.createElement("canvas");
      c.width = vp.width; c.height = vp.height;
      await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
      images.push(shrinkToJpeg(c, c.width, c.height));
    }
    text = "";
  }
  return { text: tidy(text), images, summary: `${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"}${images.length ? " · read as pictures" : ""}` };
}

async function readOffice(file, kind) {
  await loadScript(JSZIP);
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const textOf = (xml, tag) => xml.split(new RegExp(`</${tag === "w:t" ? "w:p" : "a:p"}>`)).map((para) =>
    [...para.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`, "g"))].map((m) => decodeXml(m[1])).join("")).filter((l) => l.trim()).join("\n");
  if (kind === "docx") {
    const doc = zip.file("word/document.xml");
    if (!doc) throw new Error("That Word file looks empty.");
    return { text: tidy(textOf(await doc.async("string"), "w:t")), images: [], summary: "Word document" };
  }
  const slides = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
  let text = "";
  for (let i = 0; i < slides.length; i++) text += `\n[Slide ${i + 1}]\n${textOf(await zip.file(slides[i]).async("string"), "a:t")}`;
  return { text: tidy(text), images: [], summary: `${slides.length} slide${slides.length === 1 ? "" : "s"}` };
}

async function readImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { text: "", images: [shrinkToJpeg(img, img.naturalWidth, img.naturalHeight)], summary: "photo" };
  } finally { URL.revokeObjectURL(url); }
}

// Reads one file into { text, images, summary }.
async function readStudyFile(file) {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|heic)$/.test(name)) return readImage(file);
  if (name.endsWith(".pdf") || file.type === "application/pdf") return readPdf(file);
  if (name.endsWith(".docx")) return readOffice(file, "docx");
  if (name.endsWith(".pptx")) return readOffice(file, "pptx");
  if (/\.(txt|md|csv|rtf)$/.test(name) || file.type.startsWith("text/")) {
    const text = tidy(await file.text());
    return { text, images: [], summary: `${text.split(/\s+/).filter(Boolean).length} words` };
  }
  if (/\.(doc|ppt|pages|key)$/.test(name)) throw new Error("Save it as a PDF, .docx or .pptx first.");
  throw new Error("That kind of file can't be read. Try a PDF, Word, PowerPoint, text file or photo.");
}

// ---------------------------------------------------------------- What gets sent to the AI
function uploadsReady(files) { return files.filter((f) => f.status === "ready"); }

// The text from all the files, trimmed to fit, for the AI prompt.
function uploadsText(files) {
  const ready = uploadsReady(files).filter((f) => f.text);
  if (!ready.length) return "";
  const each = Math.floor(UPLOAD_LIMITS.textChars / ready.length);
  return ready.map((f) => `--- ${f.name} ---\n${f.text.length > each ? f.text.slice(0, each) + "\n[…the rest was cut to fit]" : f.text}`).join("\n\n");
}

// All the pictures joined top-to-bottom into one image (the AI accepts one image per request).
async function uploadsImage(files) {
  const urls = uploadsReady(files).flatMap((f) => f.images).slice(0, UPLOAD_LIMITS.images);
  if (!urls.length) return null;
  const imgs = await Promise.all(urls.map(loadImage));
  if (imgs.length === 1) return { base64: urls[0], mimeType: "image/jpeg" };
  const W = 1100, gap = 24;
  const hs = imgs.map((im) => Math.round((im.naturalHeight * W) / im.naturalWidth));
  const c = document.createElement("canvas");
  c.width = W; c.height = hs.reduce((a, b) => a + b, 0) + gap * (imgs.length - 1);
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
  let y = 0;
  imgs.forEach((im, i) => { g.drawImage(im, 0, y, W, hs[i]); y += hs[i] + gap; if (i < imgs.length - 1) { g.fillStyle = "#999"; g.fillRect(0, y - gap / 2 - 1, W, 2); } });
  return { base64: c.toDataURL("image/jpeg", 0.8), mimeType: "image/jpeg" };
}

// Adds the files to a request for the AI: their text goes into the prompt, their pictures into `image`.
async function withUploads(prompt, files, intro) {
  const ready = uploadsReady(files);
  if (!ready.length) return { question: prompt };
  const text = uploadsText(files);
  const image = await uploadsImage(files);
  const note = `${intro}
Files: ${ready.map((f) => f.name).join(", ")}.
${text ? `Text from the files:\n"""\n${text}\n"""\n` : ""}${image ? `${text ? "Some of the files are" : "The files are"} pictures (photos or scanned pages), attached as one image${image && ready.filter((f) => f.images.length).length > 1 ? " with the pages stacked top to bottom" : ""}. Read them carefully.\n` : ""}`;
  return { question: `${note}\n${prompt}`, ...(image ? { image: image.base64, imageMimeType: image.mimeType } : {}) };
}

// ---------------------------------------------------------------- The upload box
function uploadBoxHTML(hint) {
  return `
    <div class="upload-box">
      <label class="upload-drop">
        <input type="file" multiple accept="${UPLOAD_ACCEPT}" class="upload-input">
        <span class="upload-ico">📎</span>
        <span><strong>Add files</strong> <span class="muted small">PDF, Word, PowerPoint, text or photos — or drop them here</span>
          ${hint ? `<span class="muted small upload-hint">${esc(hint)}</span>` : ""}</span>
      </label>
      <div class="upload-list"></div>
    </div>`;
}

// `files` is an array kept by the caller (so the files stay while the page is open).
function wireUploadBox(root, files, onChange = () => {}) {
  const box = $(".upload-box", root), input = $(".upload-input", box), list = $(".upload-list", box), drop = $(".upload-drop", box);
  const draw = () => {
    list.innerHTML = files.map((f) => `
      <div class="upload-chip ${f.status}">
        <span class="upload-name">${f.status === "reading" ? "⏳" : f.status === "error" ? "⚠️" : f.images.length && !f.text ? "🖼️" : "📄"} ${esc(f.name)}</span>
        <span class="muted small">${f.status === "reading" ? "Reading…" : f.status === "error" ? esc(f.error) : esc(f.summary)}</span>
        <button type="button" class="btn ghost sm" data-rm="${f.id}" aria-label="Remove ${esc(f.name)}">✕</button>
      </div>`).join("");
    onChange(files);
  };
  async function add(fileList) {
    const incoming = [...fileList];
    if (files.length + incoming.length > UPLOAD_LIMITS.files) toast(`You can add up to ${UPLOAD_LIMITS.files} files.`);
    for (const file of incoming.slice(0, Math.max(0, UPLOAD_LIMITS.files - files.length))) {
      if (file.size > 25 * 1024 * 1024) { toast(`${file.name} is too big (over 25 MB).`); continue; }
      const entry = { id: "f" + Date.now() + Math.random().toString(16).slice(2), name: file.name, status: "reading", text: "", images: [], summary: "" };
      files.push(entry);
      draw();
      try {
        Object.assign(entry, await readStudyFile(file), { status: "ready" });
        if (!entry.text && !entry.images.length) Object.assign(entry, { status: "error", error: "No text found in that file." });
      } catch (e) {
        console.warn("Apex: couldn't read", file.name, e);
        Object.assign(entry, { status: "error", error: e.message || "Couldn't read that file." });
      }
      draw();
    }
    const pics = files.filter((f) => f.status === "ready").reduce((n, f) => n + f.images.length, 0);
    if (pics > UPLOAD_LIMITS.images) toast(`Only the first ${UPLOAD_LIMITS.images} photos or pages are shown to the AI.`);
  }
  input.addEventListener("change", () => { add(input.files); input.value = ""; });
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => { if (e.dataTransfer?.files?.length) add(e.dataTransfer.files); });
  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-rm]");
    if (!b) return;
    const i = files.findIndex((f) => f.id === b.dataset.rm);
    if (i >= 0) files.splice(i, 1);
    draw();
  });
  draw();
  return { busy: () => files.some((f) => f.status === "reading") };
}
