/* Visual and interactive questions.

   A question can carry `visual: { type, ... }`.
   - Diagrams (plane, numberline, fraction, bars, dotplot, spinner, marbles, angle, triangle, lineAngles,
     pointAngles, parallel, polygon, rect, tri, para, trap, circle, prism, lshape, house, balance, machine,
     table, pattern, array, pv, ruler) are drawn above a normal typed or multiple-choice answer.
   - Answer widgets (plot, place, shade, angleMake, order, match, tapword) ARE the answer: the student
     plots, places, shades, turns, orders, matches or taps, and the widget fills the question's hidden input.
   Questions with answerType "point" get two boxes, ( x , y ), for reading coordinates. */
(function () {
  "use strict";

  const h = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v, d = 0) => (v !== null && v !== "" && Number.isFinite(+v) ? +v : d);
  const rnd = (n) => Math.round(n * 1e6) / 1e6;
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (n) => (Number.isFinite(n) ? (rnd(n) < 0 ? "−" : "") + Math.abs(rnd(n)) : "");
  const rad = (d) => (d * Math.PI) / 180;
  const shuffled = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // A shuffle that never leaves the items already in their correct order.
  const scramble = (n) => {
    const idx = [...Array(n).keys()];
    if (n < 2) return idx;
    let out;
    do { out = shuffled(idx); } while (out.every((v, i) => v === i));
    return out;
  };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const fracLabel = (k, d) => {
    if (k === 0) return "0";
    const g = gcd(k, d), n = k / g, m = d / g;
    return m === 1 ? fmt(n) : `${n < 0 ? "−" : ""}${Math.abs(n)}/${m}`;
  };

  const COLORS = { red: "#E0524A", blue: "#3B82C4", green: "#3E9E5E", yellow: "#E8B931", purple: "#8B5CC2", orange: "#E8873A",
    pink: "#E46FA6", black: "#3A3A3A", white: "#F2F2F2", grey: "#9AA3AD", gray: "#9AA3AD", brown: "#8B5E3C", teal: "#2FA3A3" };
  const PALETTE = ["#3B82C4", "#E8873A", "#3E9E5E", "#E0524A", "#8B5CC2", "#E8B931", "#E46FA6", "#2FA3A3"];
  const colorOf = (c, i = 0) => COLORS[String(c || "").toLowerCase().trim()] || (/^#[0-9a-f]{3,8}$/i.test(String(c || "")) ? c : PALETTE[i % PALETTE.length]);

  const svgOpen = (w, ht, label, max, cls = "") =>
    `<svg class="vz-svg ${cls}" viewBox="0 0 ${r1(w)} ${r1(ht)}" style="max-width:${Math.round(max || w)}px" role="img" aria-label="${h(label || "Diagram")}">`;
  const txt = (x, y, s, cls = "vz-t", anchor = "middle") =>
    `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">${h(s)}</text>`;
  const line = (x1, y1, x2, y2, cls = "vz-ink") => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}"/>`;
  const arrowHead = (x, y, deg, cls = "vz-ink-fill", size = 7) => {
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
    const p = (dx, dy) => `${r1(x + dx * c - dy * s)},${r1(y + dx * s + dy * c)}`;
    return `<polygon points="${p(0, 0)} ${p(-size, -size * 0.55)} ${p(-size, size * 0.55)}" class="${cls}"/>`;
  };
  // Arc for an angle at (cx, cy) from screen-angle a1 to a2 (degrees, counter-clockwise, maths orientation).
  const arcPath = (cx, cy, r, a1, a2) => {
    let sweep = a2 - a1;
    while (sweep < 0) sweep += 360;
    const p = (a) => `${r1(cx + r * Math.cos(rad(a)))} ${r1(cy - r * Math.sin(rad(a)))}`;
    if (sweep >= 359.9) return `M ${p(a1)} A ${r} ${r} 0 1 0 ${p(a1 + 180)} A ${r} ${r} 0 1 0 ${p(a1)}`;
    return `M ${p(a1)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${p(a1 + sweep)}`;
  };
  const sectorPath = (cx, cy, r, a1, a2) => {
    const p = (a) => `${r1(cx + r * Math.cos(rad(a)))} ${r1(cy - r * Math.sin(rad(a)))}`;
    let sweep = a2 - a1;
    while (sweep < 0) sweep += 360;
    if (sweep >= 359.9) return `M ${r1(cx - r)} ${cy} A ${r} ${r} 0 1 0 ${r1(cx + r)} ${cy} A ${r} ${r} 0 1 0 ${r1(cx - r)} ${cy} Z`;
    return `M ${cx} ${cy} L ${p(a1)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${p(a2)} Z`;
  };
  const rightMark = (x, y, dx1, dy1, dx2, dy2, s = 10) =>
    `<polyline points="${r1(x + dx1 * s)},${r1(y + dy1 * s)} ${r1(x + dx1 * s + dx2 * s)},${r1(y + dy1 * s + dy2 * s)} ${r1(x + dx2 * s)},${r1(y + dy2 * s)}" class="vz-ink-thin"/>`;
  // Labels a point with text pushed away from (ox, oy).
  const awayLabel = (x, y, ox, oy, s, dist = 16, cls = "vz-t") => {
    const dx = x - ox, dy = y - oy, len = Math.hypot(dx, dy) || 1;
    return txt(x + (dx / len) * dist, y + (dy / len) * dist + 4, s, cls);
  };
  const unitLabel = (n, unit) => (typeof n === "string" ? n : `${fmt(n)}${unit ? " " + unit : ""}`);

  // ---------------------------------------------------------------- Cartesian plane
  function planeGeom(v) {
    const xmin = Math.floor(num(v.xmin ?? v.min, -6)), xmax = Math.ceil(num(v.xmax ?? v.max, 6));
    const ymin = Math.floor(num(v.ymin ?? v.min, -6)), ymax = Math.ceil(num(v.ymax ?? v.max, 6));
    const span = Math.max(xmax - xmin, ymax - ymin, 1);
    const cell = Math.max(15, Math.min(28, Math.floor(330 / span)));
    const pad = 26;
    return { xmin, xmax, ymin, ymax, cell, pad, W: (xmax - xmin) * cell + pad * 2, H: (ymax - ymin) * cell + pad * 2,
      X: (x) => pad + (x - xmin) * cell, Y: (y) => pad + (ymax - y) * cell };
  }
  function planeBase(g) {
    const { xmin, xmax, ymin, ymax, X, Y } = g;
    const every = Math.max(xmax - xmin, ymax - ymin) > 24 ? 5 : Math.max(xmax - xmin, ymax - ymin) > 12 ? 2 : 1;
    let s = `<rect x="${X(xmin)}" y="${Y(ymax)}" width="${X(xmax) - X(xmin)}" height="${Y(ymin) - Y(ymax)}" class="vz-board"/>`;
    for (let x = xmin; x <= xmax; x++) s += line(X(x), Y(ymin), X(x), Y(ymax), "vz-grid");
    for (let y = ymin; y <= ymax; y++) s += line(X(xmin), Y(y), X(xmax), Y(y), "vz-grid");
    const y0 = Math.min(Math.max(0, ymin), ymax), x0 = Math.min(Math.max(0, xmin), xmax);
    s += line(X(xmin) - 6, Y(y0), X(xmax) + 10, Y(y0), "vz-axis") + arrowHead(X(xmax) + 12, Y(y0), 0);
    s += line(X(x0), Y(ymin) + 6, X(x0), Y(ymax) - 10, "vz-axis") + arrowHead(X(x0), Y(ymax) - 12, -90);
    s += txt(X(xmax) + 6, Y(y0) - 8, "x", "vz-t vz-i") + txt(X(x0) + 10, Y(ymax) - 10, "y", "vz-t vz-i", "start");
    for (let x = xmin; x <= xmax; x++) if (x !== x0 && x % every === 0) s += txt(X(x), Y(y0) + 14, fmt(x), "vz-t vz-sm");
    for (let y = ymin; y <= ymax; y++) if (y !== y0 && y % every === 0) s += txt(X(x0) - 5, Y(y) + 4, fmt(y), "vz-t vz-sm", "end");
    s += txt(X(x0) - 5, Y(y0) + 14, x0 === 0 && y0 === 0 ? "0" : "", "vz-t vz-sm", "end");
    return s;
  }
  function clipLine(g, m, c) {
    const pts = [];
    const add = (x, y) => { if (x >= g.xmin - 1e-9 && x <= g.xmax + 1e-9 && y >= g.ymin - 1e-9 && y <= g.ymax + 1e-9) pts.push([x, y]); };
    add(g.xmin, m * g.xmin + c); add(g.xmax, m * g.xmax + c);
    if (m !== 0) { add((g.ymin - c) / m, g.ymin); add((g.ymax - c) / m, g.ymax); }
    if (pts.length < 2) return null;
    pts.sort((a, b) => a[0] - b[0]);
    return [pts[0], pts[pts.length - 1]];
  }
  const ptLabel = (g, x, y, label) => {
    const right = x < g.xmax - 1, up = y < g.ymax - 0.5;
    return txt(g.X(x) + (right ? 8 : -8), g.Y(y) + (up ? -8 : 16), label, "vz-t vz-lbl", right ? "start" : "end");
  };
  function planeContent(g, v) {
    let s = "";
    const polys = v.polys || (v.poly ? [v.poly] : []);
    polys.forEach((poly) => {
      if (Array.isArray(poly) && poly.length > 1) s += `<polygon points="${poly.map(([x, y]) => `${r1(g.X(x))},${r1(g.Y(y))}`).join(" ")}" class="vz-shape"/>`;
    });
    (v.lines || []).forEach((l) => {
      let seg = null;
      if (l.x !== undefined) seg = [[num(l.x), g.ymin], [num(l.x), g.ymax]];
      else seg = clipLine(g, num(l.m), num(l.c));
      if (seg) s += line(g.X(seg[0][0]), g.Y(seg[0][1]), g.X(seg[1][0]), g.Y(seg[1][1]), "vz-line");
      if (seg && l.label) {
        const ex = g.X(seg[1][0]), ey = g.Y(seg[1][1]), room = ex < g.W - 90;
        s += txt(ex + (room ? 8 : -6), ey + (seg[1][1] >= g.ymax - 0.1 ? 14 : -8), l.label, "vz-t vz-lbl", room ? "start" : "end");
      }
    });
    (v.segs || []).forEach(([x1, y1, x2, y2]) => { s += line(g.X(x1), g.Y(y1), g.X(x2), g.Y(y2), "vz-line"); });
    (v.points || []).forEach((p) => {
      const x = num(p.x), y = num(p.y);
      s += `<circle cx="${r1(g.X(x))}" cy="${r1(g.Y(y))}" r="5.5" class="vz-dot"${p.color ? ` style="fill:${colorOf(p.color)}"` : ""}/>`;
      const label = [p.label, p.showCoords ? `(${fmt(x)}, ${fmt(y)})` : ""].filter(Boolean).join(" ");
      if (label) s += ptLabel(g, x, y, label);
    });
    return s;
  }
  function planeSVG(v, dyn = false) {
    const g = planeGeom(v);
    return svgOpen(g.W, g.H, describe(v), Math.min(g.W, dyn ? 380 : 330)) + planeBase(g) + planeContent(g, v) +
      (dyn ? `<g class="vz-dyn"></g><g class="vz-ghost"></g><rect class="vz-hit" x="0" y="0" width="${g.W}" height="${g.H}"/>` : "") + `</svg>`;
  }

  // ---------------------------------------------------------------- Number line
  function nlGeom(v) {
    let min = num(v.min, 0), max = num(v.max, 10);
    if (max <= min) max = min + 10;
    let step = num(v.step, 0);
    if (!(step > 0) || (max - min) / step > 60) step = niceStep((max - min) / 10);
    const W = 360, pad = 24, y = v.type === "place" ? 66 : 54;
    return { min, max, step, W, H: y + 34, pad, y, X: (val) => pad + ((val - min) / (max - min)) * (W - 2 * pad) };
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const m = raw / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
  }
  function nlBase(g, v) {
    const n = Math.round((g.max - g.min) / g.step);
    const every = v.labels === "ends" ? n : num(v.labelEvery, n <= 12 ? 1 : Math.ceil(n / 10));
    let s = line(g.pad - 12, g.y, g.W - g.pad + 12, g.y, "vz-axis") + arrowHead(g.W - g.pad + 16, g.y, 0) + arrowHead(g.pad - 16, g.y, 180);
    for (let i = 0; i <= n; i++) {
      const val = rnd(g.min + i * g.step);
      const major = i % every === 0 || i === n;
      s += line(g.X(val), g.y - (major ? 8 : 5), g.X(val), g.y + (major ? 8 : 5), "vz-axis");
      if (major && (v.labels !== "ends" || i === 0 || i === n)) {
        const label = v.denom ? fracLabel(Math.round(val * v.denom), v.denom) : fmt(val);
        s += txt(g.X(val), g.y + 24, label, "vz-t vz-sm");
      }
    }
    return s;
  }
  function nlContent(g, v) {
    let s = "";
    (v.jumps || []).forEach((j) => {
      const x1 = g.X(num(j.from)), x2 = g.X(num(j.to)), mid = (x1 + x2) / 2, hgt = Math.min(34, 12 + Math.abs(x2 - x1) / 5);
      s += `<path d="M ${r1(x1)} ${g.y - 6} Q ${r1(mid)} ${r1(g.y - 6 - hgt * 2)} ${r1(x2)} ${g.y - 6}" class="vz-jump"/>`;
      s += arrowHead(x2, g.y - 6, x2 > x1 ? 60 : 120, "vz-warm-fill", 7);
      if (j.label) s += txt(mid, g.y - 10 - hgt, j.label, "vz-t vz-warm-t");
    });
    (v.marks || []).forEach((m, i) => {
      const x = g.X(num(m.v));
      s += `<circle cx="${r1(x)}" cy="${g.y}" r="5.5" class="vz-dot"${m.color ? ` style="fill:${colorOf(m.color, i)}"` : ""}/>`;
      if (m.label) s += txt(x, g.y - 13, m.label, "vz-t vz-lbl");
    });
    if (v.arrow !== undefined) {
      const x = g.X(num(v.arrow));
      s += line(x, g.y - 34, x, g.y - 12, "vz-warm") + arrowHead(x, g.y - 10, 90, "vz-warm-fill", 8) + txt(x, g.y - 38, v.arrowLabel || "?", "vz-t vz-warm-t");
    }
    return s;
  }
  function nlSVG(v, dyn = false) {
    const g = nlGeom(v);
    return svgOpen(g.W, g.H, describe(v), 420, dyn ? "vz-drag" : "") + nlBase(g, v) + nlContent(g, v) +
      (dyn ? `<g class="vz-dyn"></g><rect class="vz-hit" x="0" y="0" width="${g.W}" height="${g.H}"/>` : "") + `</svg>`;
  }

  // ---------------------------------------------------------------- Fractions (bar, circle, grid)
  function fracParts(v, ox = 0, oy = 0) {
    const shape = v.shape || "bar";
    const n = Math.max(1, Math.min(100, Math.round(num(v.parts, 4))));
    const parts = [];
    if (shape === "circle") {
      const r = 70, cx = ox + 80, cy = oy + 80;
      for (let i = 0; i < n; i++) {
        const a1 = 90 - (i * 360) / n, a2 = 90 - ((i + 1) * 360) / n;
        parts.push(n === 1 ? `<circle cx="${cx}" cy="${cy}" r="${r}"` : `<path d="${sectorPath(cx, cy, r, a2, a1)}"`);
      }
      return { parts, W: 160, H: 160 };
    }
    if (shape === "grid") {
      const cols = Math.max(1, Math.round(num(v.cols, Math.ceil(Math.sqrt(n))))), rows = Math.ceil(n / cols);
      const size = Math.min(34, Math.floor(300 / cols));
      for (let i = 0; i < n; i++) {
        parts.push(`<rect x="${ox + 4 + (i % cols) * size}" y="${oy + 4 + Math.floor(i / cols) * size}" width="${size}" height="${size}"`);
      }
      return { parts, W: cols * size + 8, H: rows * size + 8 };
    }
    const W = 320, w = (W - 8) / n;
    for (let i = 0; i < n; i++) parts.push(`<rect x="${r1(ox + 4 + i * w)}" y="${oy + 4}" width="${r1(w)}" height="48"`);
    return { parts, W, H: 56 };
  }
  function fractionSVG(v) {
    const items = Array.isArray(v.items) && v.items.length ? v.items : [v];
    if (items.length === 1) {
      const it = items[0], f = fracParts(it);
      const on = new Set(Array.isArray(it.shadedIdx) ? it.shadedIdx : [...Array(Math.round(num(it.shaded, 0))).keys()]);
      return svgOpen(f.W, f.H, describe(v), f.W) + f.parts.map((p, i) => `${p} class="vz-part${on.has(i) ? " on" : ""}"/>`).join("") + `</svg>`;
    }
    let s = "", y = 4;
    const W = 380, left = items.some((it) => it.label) ? 74 : 4, bw = W - left - 4;
    items.forEach((it) => {
      const n = Math.max(1, Math.min(40, Math.round(num(it.parts, 4)))), k = Math.round(num(it.shaded, 0)), w = bw / n;
      if (it.label) s += txt(left - 8, y + 29, it.label, "vz-t", "end");
      for (let i = 0; i < n; i++) s += `<rect x="${r1(left + i * w)}" y="${y}" width="${r1(w)}" height="44" class="vz-part${i < k ? " on" : ""}"/>`;
      y += 56;
    });
    return svgOpen(W, y, describe(v), W) + s + `</svg>`;
  }

  // ---------------------------------------------------------------- Charts
  function barsSVG(v) {
    const labels = (v.labels || []).map(String), values = (v.values || []).map((x) => num(x));
    const n = Math.max(1, Math.min(labels.length, values.length));
    const top = Math.max(1, ...values.slice(0, n));
    const step = num(v.step, niceStep(top / 5));
    const max = Math.ceil(top / step) * step;
    const W = 360, H = 240, L = 44, B = 200, T = v.title ? 30 : 14, R = 10;
    const Y = (val) => B - ((B - T) * val) / max;
    let s = v.title ? txt(W / 2, 18, v.title, "vz-t vz-title") : "";
    for (let val = 0; val <= max + 1e-9; val += step) {
      s += line(L, Y(val), W - R, Y(val), "vz-grid") + txt(L - 6, Y(val) + 4, fmt(rnd(val)), "vz-t vz-sm", "end");
    }
    const bw = (W - L - R) / n;
    for (let i = 0; i < n; i++) {
      const x = L + i * bw + bw * 0.18, w = bw * 0.64;
      s += `<rect x="${r1(x)}" y="${r1(Y(values[i]))}" width="${r1(w)}" height="${r1(B - Y(values[i]))}" class="vz-bar" style="fill:${colorOf(v.colors?.[i], v.multi ? i : 0)}"/>`;
      if (v.showValues) s += txt(x + w / 2, Y(values[i]) - 4, fmt(values[i]), "vz-t vz-sm");
      s += txt(x + w / 2, B + 15, labels[i].length > 9 ? labels[i].slice(0, 8) + "…" : labels[i], "vz-t vz-sm");
    }
    s += line(L, T - 4, L, B, "vz-axis") + line(L, B, W - R, B, "vz-axis");
    if (v.yLabel) s += `<text x="12" y="${(T + B) / 2}" class="vz-t vz-sm" text-anchor="middle" transform="rotate(-90 12 ${(T + B) / 2})">${h(v.yLabel)}</text>`;
    if (v.xLabel) s += txt((L + W) / 2, B + 33, v.xLabel, "vz-t vz-sm");
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }
  function dotplotSVG(v) {
    const vals = (v.values || []).map((x) => Math.round(num(x)));
    const min = Math.round(num(v.min, Math.min(...vals))), max = Math.round(num(v.max, Math.max(...vals)));
    const counts = {};
    vals.forEach((x) => { counts[x] = (counts[x] || 0) + 1; });
    const tallest = Math.max(1, ...Object.values(counts));
    const W = 340, pad = 30, B = 26 + tallest * 22, H = B + 34;
    const X = (x) => pad + ((x - min) / Math.max(1, max - min)) * (W - 2 * pad);
    let s = line(pad - 10, B, W - pad + 10, B, "vz-axis");
    for (let x = min; x <= max; x++) {
      s += line(X(x), B, X(x), B + 6, "vz-axis") + txt(X(x), B + 20, fmt(x), "vz-t vz-sm");
      for (let k = 0; k < (counts[x] || 0); k++) s += `<circle cx="${r1(X(x))}" cy="${B - 12 - k * 20}" r="8" class="vz-dot"/>`;
    }
    if (v.xLabel) s += txt(W / 2, H - 2, v.xLabel, "vz-t vz-sm");
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }
  function spinnerSVG(v) {
    const secs = (v.sections || []).map((x) => (typeof x === "object" ? x : { label: String(x), color: x }));
    const n = Math.max(1, secs.length), cx = 90, cy = 96, r = 78;
    let s = "";
    secs.forEach((sec, i) => {
      const a1 = 90 - (i * 360) / n, a2 = 90 - ((i + 1) * 360) / n;
      s += `<path d="${sectorPath(cx, cy, r, a2, a1)}" class="vz-sector" style="fill:${colorOf(sec.color, i)}"/>`;
      const am = (a1 + a2) / 2, lx = cx + r * 0.62 * Math.cos(rad(am)), ly = cy - r * 0.62 * Math.sin(rad(am));
      if (sec.label) s += txt(lx, ly + 4, sec.label.length > 8 ? sec.label.slice(0, 7) + "…" : sec.label, "vz-t vz-on-color");
    });
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" class="vz-rim"/>`;
    s += `<polygon points="${cx},${cy - r + 26} ${cx - 7},${cy} ${cx + 7},${cy}" class="vz-ink-fill"/><circle cx="${cx}" cy="${cy}" r="6" class="vz-ink-fill"/>`;
    return svgOpen(180, 184, describe(v), 200) + s + `</svg>`;
  }
  function marblesSVG(v) {
    const balls = [];
    (v.items || []).forEach((it, i) => { for (let k = 0; k < Math.min(30, Math.round(num(it.count))); k++) balls.push(colorOf(it.color, i)); });
    const cols = 6, rows = Math.ceil(balls.length / cols) || 1, W = 220, H = 70 + rows * 26;
    let s = `<path d="M 30 26 Q 30 14 44 14 L 176 14 Q 190 14 190 26 L 196 ${H - 18} Q 196 ${H - 6} 182 ${H - 6} L 38 ${H - 6} Q 24 ${H - 6} 24 ${H - 18} Z" class="vz-jar"/>`;
    balls.forEach((c, i) => {
      const row = Math.floor(i / cols), col = i % cols, inRow = Math.min(cols, balls.length - row * cols);
      const x = 110 - ((inRow - 1) * 26) / 2 + col * 26, y = H - 26 - row * 26;
      s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="11" class="vz-ball" style="fill:${c}"/>`;
    });
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }

  // ---------------------------------------------------------------- Angles
  function angleSVG(v) {
    const deg = num(v.deg, 60), reflex = deg > 180;
    const W = 260, H = reflex ? 240 : 150, cx = 130, cy = reflex ? 120 : 126, R = 100;
    let s = "";
    if (v.protractor) s += protractor(cx, cy, R + 6, reflex ? 360 : 180);
    const ex = cx + R * Math.cos(rad(deg)), ey = cy - R * Math.sin(rad(deg));
    s += `<path d="${sectorPath(cx, cy, 30, 0, deg)}" class="vz-angle-fill"/><path d="${arcPath(cx, cy, 30, 0, deg)}" class="vz-arc"/>`;
    if (Math.abs(deg - 90) < 0.01 && !v.protractor) s += rightMark(cx, cy, 1, 0, 0, -1, 14);
    s += line(cx, cy, cx + R, cy, "vz-arm") + line(cx, cy, ex, ey, "vz-arm") + `<circle cx="${cx}" cy="${cy}" r="4" class="vz-ink-fill"/>`;
    const lab = v.label ?? (v.showDeg ? `${fmt(deg)}°` : "");
    if (lab) { const am = deg / 2; s += txt(cx + 50 * Math.cos(rad(am)), cy - 50 * Math.sin(rad(am)) + 4, lab, "vz-t vz-lbl"); }
    return svgOpen(W, H, describe(v), 280) + s + `</svg>`;
  }
  function protractor(cx, cy, R, upTo) {
    let s = upTo >= 360 ? `<circle cx="${cx}" cy="${cy}" r="${R}" class="vz-prot"/>` : `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z" class="vz-prot"/>`;
    for (let a = 0; a < upTo + (upTo >= 360 ? 0 : 1); a += 5) {
      const len = a % 30 === 0 ? 12 : a % 10 === 0 ? 8 : 4;
      const c = Math.cos(rad(a)), sn = Math.sin(rad(a));
      s += line(cx + R * c, cy - R * sn, cx + (R - len) * c, cy - (R - len) * sn, "vz-prot-tick");
      if (a % 30 === 0) s += txt(cx + (R - 22) * c, cy - (R - 22) * sn + 3.5, String(a), "vz-t vz-xs");
    }
    return s;
  }

  // Triangle with angle labels at the corners: angles = [bottom-left, bottom-right, top].
  function triangleSVG(v) {
    const labels = (v.angles || ["", "", ""]).map((a) => (a === null || a === undefined ? "" : String(a)));
    const known = (a) => (/^\d+(\.\d+)?°?$/.test(a.trim()) ? parseFloat(a) : NaN);
    let A = known(labels[0]), B = known(labels[1]);
    const C = known(labels[2]);
    if (Array.isArray(v.sizes)) [A, B] = v.sizes.map((x) => num(x));
    else if (!Number.isFinite(A) && Number.isFinite(B) && Number.isFinite(C)) A = 180 - B - C;
    else if (!Number.isFinite(B) && Number.isFinite(A) && Number.isFinite(C)) B = 180 - A - C;
    if (!(A > 5 && B > 5 && A + B < 175)) { A = 60; B = 60; }
    // Base 0..1, apex where the base angles meet.
    const tA = Math.tan(rad(A)), tB = Math.tan(rad(B));
    const px = tB / (tA + tB), py = px * tA;
    const pts = [[0, 0], [1, 0], [px, py]];
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), maxY = Math.max(...ys);
    const scale = Math.min(250 / (maxX - minX), 150 / maxY);
    const W = 320, H = 210, ox = (W - (maxX - minX) * scale) / 2 - minX * scale, oy = 180;
    const P = pts.map(([x, y]) => [ox + x * scale, oy - y * scale]);
    let s = `<polygon points="${P.map((p) => p.map(r1).join(",")).join(" ")}" class="vz-shape"/>`;
    P.forEach((p, i) => {
      const a = P[(i + 1) % 3], b = P[(i + 2) % 3];
      const ua = [a[0] - p[0], a[1] - p[1]], ub = [b[0] - p[0], b[1] - p[1]];
      const la = Math.hypot(...ua), lb = Math.hypot(...ub);
      const bis = [ua[0] / la + ub[0] / lb, ua[1] / la + ub[1] / lb], lbis = Math.hypot(...bis) || 1;
      const theta = Math.acos(Math.max(-1, Math.min(1, (ua[0] * ub[0] + ua[1] * ub[1]) / (la * lb))));
      if (/^90°?$/.test(labels[i])) s += rightMark(p[0], p[1], ua[0] / la, ua[1] / la, ub[0] / lb, ub[1] / lb, 12);
      if (!labels[i]) return;
      const dist = Math.max(26, Math.min(64, 15 / Math.sin(theta / 2)));
      s += txt(p[0] + (bis[0] / lbis) * dist, p[1] + (bis[1] / lbis) * dist + 4, labels[i], `vz-t vz-lbl${/\?|x/.test(labels[i]) ? " vz-unknown" : ""}`);
    });
    if (v.equal) {
      const sides = v.equal === "all" ? [[0, 1], [1, 2], [2, 0]] : [[0, 2], [1, 2]];
      sides.forEach(([a, b]) => {
        const mx = (P[a][0] + P[b][0]) / 2, my = (P[a][1] + P[b][1]) / 2, dx = P[b][0] - P[a][0], dy = P[b][1] - P[a][1], len = Math.hypot(dx, dy);
        const nx = -dy / len, ny = dx / len;
        s += line(mx - nx * 7, my - ny * 7, mx + nx * 7, my + ny * 7, "vz-ink");
      });
    }
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }
  // Angles on a straight line (sum 180) or around a point (sum 360): sizes drive the drawing, labels are shown.
  function anglesAtPoint(v, full) {
    const sizes = (v.sizes || []).map((x) => num(x));
    const labels = (v.labels || sizes.map((x) => `${x}°`)).map(String);
    const right = full === "right";
    const W = 300, H = full === true ? 260 : right ? 200 : 170, cx = right ? 90 : 150, cy = full === true ? 130 : right ? 175 : 140, R = full === true ? 105 : right ? 150 : 120;
    let s = "", a = full === true ? 90 : 0;
    if (right) s += line(cx, cy, cx + R, cy, "vz-arm") + line(cx, cy, cx, cy - R, "vz-arm");
    else if (!full) s += line(cx - R - 10, cy, cx + R + 10, cy, "vz-arm");
    const rays = [];
    sizes.forEach((sz, i) => {
      const r = 30 + (i % 2) * 12;
      s += `<path d="${sectorPath(cx, cy, r, a, a + sz)}" class="vz-angle-fill" style="fill:${PALETTE[i % PALETTE.length]}"/>`;
      const am = a + sz / 2;
      s += txt(cx + (r + 24) * Math.cos(rad(am)), cy - (r + 24) * Math.sin(rad(am)) + 4, labels[i] || "", `vz-t vz-lbl${/\?|x/.test(labels[i] || "") ? " vz-unknown" : ""}`);
      if (Math.abs(sz - 90) < 0.01) s += rightMark(cx, cy, Math.cos(rad(a)), -Math.sin(rad(a)), Math.cos(rad(a + 90)), -Math.sin(rad(a + 90)), 12);
      a += sz;
      rays.push(a);
    });
    (full === true ? [90, ...rays] : rays.slice(0, -1)).forEach((ang) => { s += line(cx, cy, cx + R * Math.cos(rad(ang)), cy - R * Math.sin(rad(ang)), "vz-arm"); });
    s += `<circle cx="${cx}" cy="${cy}" r="4" class="vz-ink-fill"/>`;
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }
  // Two parallel lines cut by a transversal, with two marked angles.
  function parallelSVG(v) {
    const t = Math.max(25, Math.min(80, num(v.size, 60)));
    const W = 330, H = 220, y1 = 70, y2 = 160, mid = 165;
    const dx = (y2 - y1) / Math.tan(rad(t));
    const P = [mid + dx / 2, y1], Q = [mid - dx / 2, y2];
    let s = line(20, y1, W - 20, y1, "vz-arm") + line(20, y2, W - 20, y2, "vz-arm");
    [y1, y2].forEach((y) => { s += `<polyline points="${W - 70},${y - 6} ${W - 62},${y} ${W - 70},${y + 6}" class="vz-ink-thin"/>`; });
    const ext = 60, ux = Math.cos(rad(t)), uy = Math.sin(rad(t));
    s += line(Q[0] - ux * ext, Q[1] + uy * ext, P[0] + ux * ext, P[1] - uy * ext, "vz-arm");
    // positions: ar = above-right (t), al = above-left (180-t), bl = below-left (t), br = below-right (180-t)
    const spans = { ar: [0, t], al: [t, 180], bl: [180, 180 + t], br: [180 + t, 360] };
    const kinds = { corresponding: [["P", "ar"], ["Q", "ar"]], alternate: [["P", "bl"], ["Q", "ar"]], "co-interior": [["P", "br"], ["Q", "ar"]],
      vertical: [["P", "ar"], ["P", "bl"]] };
    const marks = kinds[v.kind] || kinds.corresponding;
    const labels = v.labels || ["", ""];
    marks.forEach(([pt, pos], i) => {
      const [cx, cy] = pt === "P" ? P : Q, [a1, a2] = spans[pos];
      s += `<path d="${sectorPath(cx, cy, 22, a1, a2)}" class="vz-angle-fill" style="fill:${PALETTE[i]}"/><path d="${arcPath(cx, cy, 22, a1, a2)}" class="vz-arc"/>`;
      const am = (a1 + a2) / 2;
      s += txt(cx + 42 * Math.cos(rad(am)), cy - 42 * Math.sin(rad(am)) + 4, labels[i] || "", `vz-t vz-lbl${/\?|x/.test(labels[i] || "") ? " vz-unknown" : ""}`);
    });
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }
  function polygonSVG(v) {
    const n = Math.max(3, Math.min(12, Math.round(num(v.n, 5))));
    const cx = 110, cy = 110, R = 86;
    const P = [...Array(n).keys()].map((i) => { const a = 90 + (i * 360) / n + (n % 2 === 0 ? 180 / n : 0); return [cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a))]; });
    let s = `<polygon points="${P.map((p) => p.map(r1).join(",")).join(" ")}" class="vz-shape"/>`;
    if (v.diagonals) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) s += line(P[i][0], P[i][1], P[j][0], P[j][1], "vz-ink-thin vz-dash");
    if (v.symmetry) {
      const k = n % 2 === 0 ? n : n;
      for (let i = 0; i < k; i++) {
        const a = 90 + (i * 180) / n + (n % 2 === 0 ? 180 / n : 0);
        s += line(cx - (R + 14) * Math.cos(rad(a)), cy + (R + 14) * Math.sin(rad(a)), cx + (R + 14) * Math.cos(rad(a)), cy - (R + 14) * Math.sin(rad(a)), "vz-warm vz-dash");
      }
    }
    P.forEach((p) => { s += `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="3.5" class="vz-ink-fill"/>`; });
    if (v.label) s += txt(cx, cy + 5, v.label, "vz-t vz-lbl");
    return svgOpen(220, 220, describe(v), 220) + s + `</svg>`;
  }

  // ---------------------------------------------------------------- Measurement shapes
  // Fits a w × h (in units) box into the drawing area, keeping extreme shapes readable.
  function fit(w, hgt, maxW = 230, maxH = 130) {
    const ratio = Math.max(0.25, Math.min(4, w / hgt));
    let W = maxW, H = W / ratio;
    if (H > maxH) { H = maxH; W = H * ratio; }
    return { W, H };
  }
  function rectSVG(v) {
    const w = num(v.w, 6), hh = num(v.h, v.w ?? 4), unit = v.unit || "";
    const { W, H } = fit(w, hh);
    const x = (360 - W) / 2 - 12, y = 30;
    const wl = v.wLabel ?? unitLabel(w, unit), hl = v.hLabel ?? unitLabel(hh, unit);
    let s = `<rect x="${r1(x)}" y="${y}" width="${r1(W)}" height="${r1(H)}" class="vz-shape"/>` + rightMark(x, y + H, 1, 0, 0, -1);
    if (v.grid) {
      for (let i = 1; i < w; i++) s += line(x + (W * i) / w, y, x + (W * i) / w, y + H, "vz-grid-in");
      for (let j = 1; j < hh; j++) s += line(x, y + (H * j) / hh, x + W, y + (H * j) / hh, "vz-grid-in");
    }
    if (wl) s += txt(x + W / 2, y - 9, wl, `vz-t vz-lbl${wl === "?" ? " vz-unknown" : ""}`);
    if (hl && (v.w !== v.h || v.hLabel !== undefined || !v.square)) s += txt(x + W + 8, y + H / 2 + 4, hl, `vz-t vz-lbl${hl === "?" ? " vz-unknown" : ""}`, "start");
    if (v.inside) s += txt(x + W / 2, y + H / 2 + 5, v.inside, "vz-t vz-lbl");
    return svgOpen(360, H + 52, describe(v), 360) + s + `</svg>`;
  }
  function triAreaSVG(v) {
    const b = num(v.base, 8), hh = num(v.height, 5), unit = v.unit || "";
    const { W, H } = fit(b, hh, 230, 130);
    const x = 70, y = 20 + H, apex = x + W * (v.apex ?? 0.35);
    let s = `<polygon points="${x},${y} ${r1(x + W)},${y} ${r1(apex)},${r1(y - H)}" class="vz-shape"/>`;
    s += line(apex, y - H, apex, y, "vz-ink-thin vz-dash") + rightMark(apex, y, 1, 0, 0, -1, 9);
    s += txt(x + W / 2, y + 18, v.baseLabel ?? unitLabel(b, unit), "vz-t vz-lbl") + txt(apex + 7, y - H / 3 + 4, v.heightLabel ?? unitLabel(hh, unit), "vz-t vz-lbl", "start");
    return svgOpen(380, H + 50, describe(v), 380) + s + `</svg>`;
  }
  function paraSVG(v) {
    const b = num(v.base, 10), hh = num(v.height, 5), unit = v.unit || "";
    const { W, H } = fit(b, hh, 200, 120);
    const off = Math.min(60, H * 0.5), x = 70, y = 20 + H;
    let s = `<polygon points="${x},${y} ${r1(x + W)},${y} ${r1(x + W + off)},${r1(y - H)} ${r1(x + off)},${r1(y - H)}" class="vz-shape"/>`;
    s += line(x + off, y - H, x + off, y, "vz-ink-thin vz-dash") + rightMark(x + off, y, 1, 0, 0, -1, 9);
    s += txt(x + W / 2, y + 18, v.baseLabel ?? unitLabel(b, unit), "vz-t vz-lbl") + txt(x + off + 6, y - H / 2 + 4, v.heightLabel ?? unitLabel(hh, unit), "vz-t vz-lbl", "start");
    return svgOpen(380, H + 50, describe(v), 380) + s + `</svg>`;
  }
  function trapSVG(v) {
    const a = num(v.a, 6), b = num(v.b, 10), hh = num(v.h, 4), unit = v.unit || "";
    const { W, H } = fit(b, hh, 230, 120);
    const top = (W * a) / b, x = 70, y = 30 + H, tx = x + (W - top) / 2;
    let s = `<polygon points="${x},${y} ${r1(x + W)},${y} ${r1(tx + top)},${r1(y - H)} ${r1(tx)},${r1(y - H)}" class="vz-shape"/>`;
    s += line(tx, y - H, tx, y, "vz-ink-thin vz-dash") + rightMark(tx, y, 1, 0, 0, -1, 9);
    s += txt(tx + top / 2, y - H - 8, unitLabel(a, unit), "vz-t vz-lbl") + txt(x + W / 2, y + 18, unitLabel(b, unit), "vz-t vz-lbl") + txt(tx + 7, y - H / 2 + 4, unitLabel(hh, unit), "vz-t vz-lbl", "start");
    return svgOpen(380, H + 58, describe(v), 380) + s + `</svg>`;
  }
  function circleSVG(v) {
    const cx = 120, cy = 100, R = 78, unit = v.unit || "";
    let s = `<circle cx="${cx}" cy="${cy}" r="${R}" class="vz-shape"/><circle cx="${cx}" cy="${cy}" r="3.5" class="vz-ink-fill"/>`;
    if (v.d !== undefined) s += line(cx - R, cy, cx + R, cy, "vz-arm") + txt(cx, cy - 8, `d = ${unitLabel(num(v.d), unit)}`, "vz-t vz-lbl");
    else if (v.r !== undefined) s += line(cx, cy, cx + R * Math.cos(rad(30)), cy - R * Math.sin(rad(30)), "vz-arm") + txt(cx + 20, cy - 30, `r = ${unitLabel(num(v.r), unit)}`, "vz-t vz-lbl");
    if (v.sector) s += `<path d="${sectorPath(cx, cy, R, 0, num(v.sector))}" class="vz-angle-fill"/>`;
    return svgOpen(240, 200, describe(v), 240) + s + `</svg>`;
  }
  function prismSVG(v) {
    const l = num(v.l, 6), w = num(v.w, 3), hh = num(v.h, 4), unit = v.unit || "";
    const { W, H } = fit(l, hh, 170, 110);
    const d = Math.max(22, Math.min(60, (W * w) / l * 0.6)), x = 60, y = 40 + H;
    const f = [[x, y], [x + W, y], [x + W, y - H], [x, y - H]], o = [d, -d * 0.7];
    let s = `<polygon points="${f.map((p) => p.map(r1).join(",")).join(" ")}" class="vz-shape"/>`;
    s += `<polygon points="${r1(x)},${r1(y - H)} ${r1(x + o[0])},${r1(y - H + o[1])} ${r1(x + W + o[0])},${r1(y - H + o[1])} ${r1(x + W)},${r1(y - H)}" class="vz-shape vz-shape-2"/>`;
    s += `<polygon points="${r1(x + W)},${r1(y)} ${r1(x + W + o[0])},${r1(y + o[1])} ${r1(x + W + o[0])},${r1(y - H + o[1])} ${r1(x + W)},${r1(y - H)}" class="vz-shape vz-shape-3"/>`;
    s += line(x, y, x + o[0], y + o[1], "vz-ink-thin vz-dash") + line(x + o[0], y + o[1], x + W + o[0], y + o[1], "vz-ink-thin vz-dash") + line(x + o[0], y + o[1], x + o[0], y - H + o[1], "vz-ink-thin vz-dash");
    s += txt(x + W / 2, y + 18, unitLabel(l, unit), "vz-t vz-lbl") + txt(x - 7, y - H / 2 + 4, unitLabel(hh, unit), "vz-t vz-lbl", "end");
    s += txt(x + W + o[0] / 2 + 8, y + o[1] / 2 + 8, unitLabel(w, unit), "vz-t vz-lbl", "start");
    return svgOpen(330, H + 64, describe(v), 330) + s + `</svg>`;
  }
  // Two rectangles: the first along the bottom, the second standing on its left end (an L-shape or a stack).
  function lshapeSVG(v) {
    const [p1, p2] = v.parts || [{ w: 10, h: 4 }, { w: 4, h: 6 }];
    const unit = v.unit || "";
    const totalW = Math.max(num(p1.w), num(p2.w)), totalH = num(p1.h) + num(p2.h);
    const sc = Math.min(220 / totalW, 150 / totalH);
    const x = 70, y = 20 + totalH * sc;
    const w1 = num(p1.w) * sc, h1 = num(p1.h) * sc, w2 = num(p2.w) * sc, h2 = num(p2.h) * sc;
    const pts = w1 === w2
      ? [[x, y], [x + w1, y], [x + w1, y - h1 - h2], [x, y - h1 - h2]]
      : [[x, y], [x + w1, y], [x + w1, y - h1], [x + w2, y - h1], [x + w2, y - h1 - h2], [x, y - h1 - h2]];
    let s = `<polygon points="${pts.map((p) => p.map(r1).join(",")).join(" ")}" class="vz-shape"/>`;
    s += line(x, y - h1, x + Math.min(w1, w2), y - h1, "vz-ink-thin vz-dash");
    s += txt(x + w1 / 2, y + 18, unitLabel(num(p1.w), unit), "vz-t vz-lbl") + txt(x + w1 + 7, y - h1 / 2 + 4, unitLabel(num(p1.h), unit), "vz-t vz-lbl", "start");
    s += txt(x + w2 / 2, y - h1 - h2 - 8, unitLabel(num(p2.w), unit), "vz-t vz-lbl") + txt(x - 7, y - h1 - h2 / 2 + 4, unitLabel(num(p2.h), unit), "vz-t vz-lbl", "end");
    return svgOpen(380, totalH * sc + 52, describe(v), 380) + s + `</svg>`;
  }
  function houseSVG(v) {
    const w = num(v.w, 8), hh = num(v.h, 5), th = num(v.th, 4), unit = v.unit || "";
    const sc = Math.min(200 / w, 150 / (hh + th)), W = w * sc, H = hh * sc, TH = th * sc, x = 80, y = 26 + H + TH;
    let s = `<polygon points="${x},${y} ${r1(x + W)},${y} ${r1(x + W)},${r1(y - H)} ${r1(x + W / 2)},${r1(y - H - TH)} ${x},${r1(y - H)}" class="vz-shape"/>`;
    s += line(x, y - H, x + W, y - H, "vz-ink-thin vz-dash") + line(x + W / 2, y - H - TH, x + W / 2, y - H, "vz-ink-thin vz-dash");
    s += txt(x + W / 2, y + 18, unitLabel(w, unit), "vz-t vz-lbl") + txt(x + W + 7, y - H / 2 + 4, unitLabel(hh, unit), "vz-t vz-lbl", "start") + txt(x + W / 2 + 6, y - H - TH / 2 + 4, unitLabel(th, unit), "vz-t vz-lbl", "start");
    return svgOpen(380, H + TH + 52, describe(v), 380) + s + `</svg>`;
  }
  function rulerSVG(v) {
    const max = Math.round(num(v.max, 10)), len = num(v.length, 6.5), start = num(v.start, 0);
    const W = 360, pad = 20, sc = (W - 2 * pad) / max, y = 70;
    let s = `<rect x="${pad - 8}" y="${y}" width="${W - 2 * pad + 16}" height="42" rx="4" class="vz-ruler"/>`;
    for (let mm = 0; mm <= max * 10; mm++) {
      const x = pad + (mm / 10) * sc, len2 = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 11 : 6;
      s += line(x, y, x, y + len2, "vz-ink-thin");
      if (mm % 10 === 0) s += txt(x, y + 30, String(mm / 10), "vz-t vz-sm");
    }
    s += txt(W - pad, y + 39, "cm", "vz-t vz-xs", "end");
    s += `<rect x="${r1(pad + start * sc)}" y="${y - 30}" width="${r1(len * sc)}" height="18" rx="9" class="vz-object"/>`;
    s += `<polygon points="${r1(pad + (start + len) * sc)},${y - 30} ${r1(pad + (start + len) * sc + 14)},${y - 21} ${r1(pad + (start + len) * sc)},${y - 12}" class="vz-object-tip"/>`;
    return svgOpen(W, 120, describe(v), 420) + s + `</svg>`;
  }

  // ---------------------------------------------------------------- Algebra helpers
  function balanceSVG(v) {
    const sideItems = (side) => (Array.isArray(side) ? side : String(side ?? "").split(/\s*\+\s*/)).map(String).filter(Boolean);
    const L = sideItems(v.left), R = sideItems(v.right);
    const W = 340, H = 166, cx = 170, beamY = 86;
    const block = (items, x0) => {
      let s = "", widths = items.map((t) => Math.max(30, 14 + t.length * 9)), total = widths.reduce((a, b) => a + b, 0) + (items.length - 1) * 6;
      let x = x0 - total / 2;
      items.forEach((t, i) => {
        const w = widths[i], isX = /[a-z]/i.test(t);
        s += `<rect x="${r1(x)}" y="${beamY - 40}" width="${w}" height="30" rx="6" class="${isX ? "vz-xblock" : "vz-nblock"}"/>` + txt(x + w / 2, beamY - 20, t, "vz-t vz-block-t");
        x += w + 6;
      });
      return s;
    };
    let s = `<polygon points="${cx},${beamY + 4} ${cx - 22},${H - 14} ${cx + 22},${H - 14}" class="vz-stand"/>`;
    const tilt = num(v.tilt, 0);
    s += `<g class="vz-tilt" style="transform: rotate(${tilt}deg); transform-origin: ${cx}px ${beamY}px;"><rect x="30" y="${beamY - 4}" width="${W - 60}" height="8" rx="4" class="vz-beam"/>`;
    s += block(L, 95) + block(R, W - 95) + `</g>` + txt(cx, beamY - 22, tilt ? (tilt < 0 ? ">" : "<") : "=", "vz-t vz-eq");
    return svgOpen(W, H, describe(v), W) + s + `</svg>`;
  }
  function machineHTML(v) {
    const steps = (v.steps || []).map((s) => `<span class="vz-arrow">→</span><span class="vz-op">${h(s)}</span>`).join("");
    return `<div class="vz-machine" role="img" aria-label="${h(describe(v))}"><span class="vz-io">${h(v.input ?? "in")}</span>${steps}<span class="vz-arrow">→</span><span class="vz-io out">${h(v.output ?? "?")}</span></div>`;
  }
  function tableHTML(v) {
    const rows = (v.rows || []).map((r) => (Array.isArray(r) ? r : [r]));
    const head = v.headers ? `<tr>${v.headers.map((c) => `<th>${h(c)}</th>`).join("")}</tr>` : "";
    const body = rows.map((r) => `<tr>${r.map((c, i) => (i === 0 && v.rowHeaders !== false && !v.headers ? `<th>${h(c)}</th>` : `<td${String(c) === "?" ? ' class="vz-unknown"' : ""}>${h(c)}</td>`)).join("")}</tr>`).join("");
    return `<div class="vz-table-wrap"><table class="vz-table">${head}${body}</table></div>`;
  }
  function patternSVG(v) {
    const stages = Math.max(1, Math.min(4, Math.round(num(v.stages, 3)))), tri = v.kind === "triangles", u = 22;
    let s = "", x = 14;
    for (let n = 1; n <= stages; n++) {
      const y = 96;
      if (tri) {
        for (let k = 0; k < n; k++) {
          const bx = x + k * u;
          s += `<polyline points="${bx},${y} ${bx + u / 2},${y - u * 0.87} ${bx + u},${y}" class="vz-stick"/>`;
          s += line(bx, y, bx + u, y, "vz-stick");
        }
        for (let k = 0; k < n - 1; k++) s += line(x + k * u + u / 2, y - u * 0.87, x + (k + 1) * u + u / 2, y - u * 0.87, "vz-stick");
        s += txt(x + (n * u) / 2, y + 22, `Shape ${n}`, "vz-t vz-sm");
        x += n * u + 26;
      } else {
        for (let k = 0; k < n; k++) {
          const bx = x + k * u;
          s += line(bx, y, bx + u, y, "vz-stick") + line(bx, y - u, bx + u, y - u, "vz-stick") + line(bx + u, y, bx + u, y - u, "vz-stick");
        }
        s += line(x, y, x, y - u, "vz-stick");
        s += txt(x + (n * u) / 2, y + 22, `Shape ${n}`, "vz-t vz-sm");
        x += n * u + 30;
      }
    }
    return svgOpen(Math.max(220, x), 130, describe(v), Math.max(220, x)) + s + `</svg>`;
  }
  function arraySVG(v) {
    const rows = Math.max(1, Math.min(12, Math.round(num(v.rows, 3)))), cols = Math.max(1, Math.min(12, Math.round(num(v.cols, 4))));
    const g = 24, W = cols * g + 20, H = rows * g + 20;
    let s = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<circle cx="${10 + g / 2 + c * g}" cy="${10 + g / 2 + r * g}" r="8" class="vz-dot"/>`;
    return svgOpen(W, H, describe(v), Math.min(W, 330)) + s + `</svg>`;
  }
  function pvHTML(v) {
    const str = String(v.number ?? "");
    const [whole, dec = ""] = str.split(".");
    const NAMES_W = [["O", "ones"], ["T", "tens"], ["H", "hundreds"], ["Th", "thousands"], ["TTh", "ten thousands"], ["HTh", "hundred thousands"], ["M", "millions"]];
    const NAMES_D = [["t", "tenths"], ["h", "hundredths"], ["th", "thousandths"], ["tth", "ten-thousandths"]];
    const cols = [...whole].map((d, i) => ({ d, name: NAMES_W[whole.length - 1 - i] || "" })).concat([...dec].map((d, i) => ({ d, name: NAMES_D[i] || "" })));
    const hi = num(v.highlight, -1);
    return `<div class="vz-table-wrap"><table class="vz-table vz-pv"><tr>${cols.map((c, i) => `<th title="${h(c.name[1] || "")}"${i === whole.length ? ' class="vz-dec"' : ""}>${h(c.name[0] || "")}</th>`).join("")}</tr>
      <tr>${cols.map((c, i) => `<td class="${i === hi ? "vz-hi" : ""}${i === whole.length ? " vz-dec" : ""}">${h(c.d)}</td>`).join("")}</tr></table></div>
      <p class="vz-legend">${cols.map((c) => `<b>${h(c.name[0] || "")}</b> ${h(c.name[1] || "")}`).join(" · ")}</p>`;
  }

  // ---------------------------------------------------------------- Describe (for the AI and screen readers)
  function describe(v) {
    if (!v) return "";
    const list = (a) => (a || []).join(", ");
    switch (v.type) {
      case "plane": case "plot": {
        const g = planeGeom(v);
        const pts = (v.points || []).map((p) => `${p.label || "point"} (${fmt(num(p.x))}, ${fmt(num(p.y))})`);
        const lines = (v.lines || []).map((l) => (l.x !== undefined ? `the line x = ${l.x}` : `the line y = ${l.m}x + ${l.c}`));
        return `Cartesian plane from x = ${g.xmin} to ${g.xmax} and y = ${g.ymin} to ${g.ymax}${pts.length ? ` showing ${list(pts)}` : ""}${lines.length ? `, ${list(lines)}` : ""}${(v.polys || v.poly) ? ", with a shaded shape" : ""}`;
      }
      case "numberline": case "place": {
        const g = nlGeom(v);
        const marks = (v.marks || []).map((m) => `${m.label || "a dot"} at ${fmt(num(m.v))}`);
        const jumps = (v.jumps || []).map((j) => `a jump from ${fmt(num(j.from))} to ${fmt(num(j.to))}`);
        return `Number line from ${fmt(g.min)} to ${fmt(g.max)} with marks every ${fmt(g.step)}${marks.length ? `, ${list(marks)}` : ""}${jumps.length ? `, ${list(jumps)}` : ""}${v.arrow !== undefined ? `, an arrow pointing at ${fmt(num(v.arrow))}` : ""}`;
      }
      case "fraction": case "shade":
        if (Array.isArray(v.items)) return `Fraction bars: ${list(v.items.map((it) => `${it.label || ""} ${it.shaded || 0} of ${it.parts} parts shaded`))}`;
        return `A ${v.shape || "bar"} split into ${v.parts} equal parts${v.type === "fraction" ? `, ${v.shaded || 0} shaded` : ""}`;
      case "bars": return `Bar chart${v.title ? ` "${v.title}"` : ""}: ${list((v.labels || []).map((l, i) => `${l} ${v.values?.[i]}`))}`;
      case "dotplot": return `Dot plot of the values ${list(v.values)}`;
      case "spinner": return `Spinner with ${(v.sections || []).length} equal sections: ${list((v.sections || []).map((s) => (typeof s === "object" ? s.label || s.color : s)))}`;
      case "marbles": return `A jar with ${list((v.items || []).map((it) => `${it.count} ${it.color}`))} marbles`;
      case "angle": return `An angle of ${v.label && !/\d/.test(v.label) ? "unknown size" : `${v.deg}°`}${v.protractor ? " on a protractor" : ""}`;
      case "angleMake": return "A protractor with an arm you can turn";
      case "triangle": return `Triangle with angles ${list((v.angles || []).map((a) => a || "unmarked"))}`;
      case "lineAngles": return `Angles on a straight line: ${list(v.labels || (v.sizes || []).map((s) => `${s}°`))}`;
      case "pointAngles": return `Angles around a point: ${list(v.labels || (v.sizes || []).map((s) => `${s}°`))}`;
      case "rightAngles": return `A right angle split into two angles: ${list(v.labels || (v.sizes || []).map((s) => `${s}°`))}`;
      case "parallel": return `Two parallel lines cut by a transversal with ${v.kind || "corresponding"} angles marked ${list(v.labels)}`;
      case "polygon": return `A regular polygon with ${v.n} sides`;
      case "rect": return `Rectangle ${v.wLabel ?? unitLabel(num(v.w), v.unit)} by ${v.hLabel ?? unitLabel(num(v.h ?? v.w), v.unit)}`;
      case "tri": return `Triangle with base ${unitLabel(num(v.base), v.unit)} and height ${unitLabel(num(v.height), v.unit)}`;
      case "para": return `Parallelogram with base ${unitLabel(num(v.base), v.unit)} and height ${unitLabel(num(v.height), v.unit)}`;
      case "trap": return `Trapezium with parallel sides ${unitLabel(num(v.a), v.unit)} and ${unitLabel(num(v.b), v.unit)} and height ${unitLabel(num(v.h), v.unit)}`;
      case "circle": return `Circle with ${v.d !== undefined ? `diameter ${unitLabel(num(v.d), v.unit)}` : `radius ${unitLabel(num(v.r), v.unit)}`}`;
      case "prism": return `Rectangular prism ${unitLabel(num(v.l), v.unit)} × ${unitLabel(num(v.w), v.unit)} × ${unitLabel(num(v.h), v.unit)}`;
      case "lshape": return `Composite shape made of a ${(v.parts || []).map((p) => `${p.w} × ${p.h}`).join(" and a ")} rectangle`;
      case "house": return `A ${v.w} × ${v.h} rectangle with a triangle of height ${v.th} on top`;
      case "ruler": return `A ruler in centimetres with an object ${v.length} cm long`;
      case "balance": return `A balance scale: ${[].concat(v.left).join(" + ")} = ${[].concat(v.right).join(" + ")}`;
      case "machine": return `Function machine: ${v.input} → ${list(v.steps)} → ${v.output ?? "?"}`;
      case "table": return `Table: ${(v.rows || []).map((r) => [].concat(r).join(" | ")).join("; ")}`;
      case "pattern": return `Growing pattern of ${v.kind === "triangles" ? "matchstick triangles" : "matchstick squares"}, shapes 1 to ${v.stages || 3}`;
      case "array": return `An array of ${v.rows} rows and ${v.cols} columns of dots`;
      case "pv": return `Place value chart for ${v.number}`;
      case "order": return `Items to put in order: ${list(v.items)}`;
      case "match": return `Pairs to match: ${list((v.pairs || []).map((p) => `${p[0]} ↔ ${p[1]}`))}`;
      case "tapword": return `Sentence: ${String(v.text || "").replace(/\*/g, "")}`;
      default: return EXTRA_DESCRIBE[v.type] ? EXTRA_DESCRIBE[v.type](v) : "";
    }
  }

  // ---------------------------------------------------------------- Static diagram dispatcher
  const DIAGRAMS = {
    plane: (v) => planeSVG(v), numberline: (v) => nlSVG(v), fraction: fractionSVG, bars: barsSVG, dotplot: dotplotSVG,
    spinner: spinnerSVG, marbles: marblesSVG, angle: angleSVG, triangle: triangleSVG, lineAngles: (v) => anglesAtPoint(v, false),
    pointAngles: (v) => anglesAtPoint(v, true), rightAngles: (v) => anglesAtPoint(v, "right"), parallel: parallelSVG, polygon: polygonSVG, rect: rectSVG, tri: triAreaSVG,
    para: paraSVG, trap: trapSVG, circle: circleSVG, prism: prismSVG, lshape: lshapeSVG, house: houseSVG, ruler: rulerSVG,
    balance: balanceSVG, machine: machineHTML, table: tableHTML, pattern: patternSVG, array: arraySVG, pv: pvHTML,
  };
  const INPUTS = new Set(["plot", "place", "shade", "angleMake", "order", "match", "tapword"]);
  // Extra diagrams and answer widgets added by other files (e.g. sci-visuals.js) through registerVisuals().
  const EXTRA_DESCRIBE = {};

  // ---------------------------------------------------------------- Tap-the-word tokens
  function tapTokens(text) {
    const tokens = [];
    String(text || "").split(/(\*[^*]+\*)/).forEach((seg) => {
      if (!seg) return;
      if (/^\*[^*]+\*$/.test(seg)) { tokens.push({ t: seg.slice(1, -1).trim(), target: true, tap: true }); return; }
      seg.split(/\s+/).forEach((w) => {
        if (!w) return;
        const tap = /[\p{L}\p{N}]/u.test(w);
        // Punctuation stuck to the previous token (e.g. "*barked*," → "barked" + ",").
        if (!tap && tokens.length) { tokens[tokens.length - 1].after = (tokens[tokens.length - 1].after || "") + w; return; }
        tokens.push({ t: w, target: false, tap });
      });
    });
    return tokens;
  }
  const tapTargets = (v) => tapTokens(v.text).map((tk, i) => (tk.target ? i : -1)).filter((i) => i >= 0);

  // ---------------------------------------------------------------- Widget markup
  function widgetHTML(q) {
    const v = q.visual;
    switch (v.type) {
      case "plot": {
        const n = (v.targets || []).length;
        return `<div class="vz-widget" data-w="plot">${planeSVG(v, true)}<p class="vz-hint">${n > 1 ? `Tap the grid to plot ${n} points. Tap a point again to remove it.` : "Tap the grid to plot the point. Tap it again to remove it."}</p></div>`;
      }
      case "place":
        return `<div class="vz-widget" data-w="place">${nlSVG(v, true)}<p class="vz-hint">Tap or drag on the number line to place your answer.</p></div>`;
      case "shade": {
        const f = fracParts(v);
        return `<div class="vz-widget" data-w="shade">${svgOpen(f.W, f.H, describe(v), f.W)}${f.parts.map((p, i) => `${p} class="vz-part vz-tap" data-i="${i}"/>`).join("")}</svg>
          <p class="vz-hint">Tap the parts to shade them. <span class="vz-count"></span></p></div>`;
      }
      case "angleMake":
        return `<div class="vz-widget" data-w="angleMake">${svgOpen(300, 300, describe(v), 300, "vz-drag")}${protractor(150, 150, 128, 360)}
          <line x1="150" y1="150" x2="270" y2="150" class="vz-arm"/><g class="vz-dyn"></g><circle cx="150" cy="150" r="4" class="vz-ink-fill"/>
          <rect class="vz-hit" x="0" y="0" width="300" height="300"/></svg>
          <p class="vz-hint">Drag the orange arm around the protractor to make the angle.</p></div>`;
      case "order": {
        const order = scramble(v.items.length);
        return `<div class="vz-widget" data-w="order" data-order="${order.join(",")}">
          <div class="vz-order-ends"><span>${h(v.first || "First")}</span><span>${h(v.last || "Last")}</span></div>
          <div class="vz-order-row vz-chosen"></div>
          <div class="vz-order-row vz-pool"></div>
          <p class="vz-hint">Tap the items in order. Tap one in the top row to put it back.</p></div>`;
      }
      case "match": {
        const order = scramble(v.pairs.length);
        return `<div class="vz-widget" data-w="match" data-order="${order.join(",")}">
          <div class="vz-match">
            <div class="vz-mcol">${v.pairs.map((p, i) => `<button type="button" class="vz-mitem" data-l="${i}"><span class="vz-badge"></span>${h(p[0])}</button>`).join("")}</div>
            <div class="vz-mcol">${order.map((i) => `<button type="button" class="vz-mitem" data-r="${i}"><span class="vz-badge"></span>${h(v.pairs[i][1])}</button>`).join("")}</div>
          </div>
          <p class="vz-hint">Tap an item on the left, then its match on the right.</p></div>`;
      }
      case "tapword": {
        const toks = tapTokens(v.text), n = toks.filter((t) => t.target).length;
        return `<div class="vz-widget" data-w="tapword"><div class="vz-words">${toks.map((tk, i) => (tk.tap
          ? `<button type="button" class="vz-word" data-i="${i}">${h(tk.t)}</button>${tk.after ? `<span class="vz-punct">${h(tk.after)}</span>` : ""}`
          : `<span class="vz-punct">${h(tk.t)}${h(tk.after || "")}</span>`)).join(" ")}</div>
          <p class="vz-hint">${n > 1 ? `Tap ${n} words.` : "Tap one word."}</p></div>`;
      }
      default: return W[v.type]?.html ? `<div class="vz-widget" data-w="${h(v.type)}">${W[v.type].html(v, q)}</div>` : "";
    }
  }

  // ---------------------------------------------------------------- Widget behaviour
  function svgPoint(svg, e) {
    const m = svg.getScreenCTM();
    if (!m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  // Each widget: draw(el, q, state, result?) + events. `state` is rebuilt from the raw answer when marking.
  const W = {
    plot: {
      parse: (raw) => String(raw || "").split(";").filter(Boolean).map((p) => p.split(",").map(Number)).filter((p) => p.length === 2 && p.every(Number.isFinite)),
      raw: (pts) => pts.map((p) => p.join(",")).join(";"),
      draw(el, q, pts, result) {
        const v = q.visual, g = planeGeom(v);
        const want = (v.targets || []).map((t) => `${num(t[0])},${num(t[1])}`);
        let s = "";
        if (result) want.forEach((t) => {
          const [x, y] = t.split(",").map(Number);
          s += `<circle cx="${r1(g.X(x))}" cy="${r1(g.Y(y))}" r="11" class="vz-ring"/>` + ptLabel(g, x, y, `(${fmt(x)}, ${fmt(y)})`);
        });
        pts.forEach(([x, y], i) => {
          const ok = want.includes(`${x},${y}`);
          s += `<circle cx="${r1(g.X(x))}" cy="${r1(g.Y(y))}" r="7" class="vz-pt${result ? (ok ? " ok" : " bad") : ""}"/>`;
          if (!result && v.labels?.[i]) s += ptLabel(g, x, y, v.labels[i]);
          if (result && !ok) s += ptLabel(g, x, y, `(${fmt(x)}, ${fmt(y)})`);
        });
        el.querySelector(".vz-dyn").innerHTML = s;
      },
      wire(el, q, set) {
        const v = q.visual, g = planeGeom(v), svg = el.querySelector("svg"), n = Math.max(1, (v.targets || []).length);
        let pts = [];
        const snap = (e) => {
          const p = svgPoint(svg, e);
          if (!p) return null;
          const x = Math.round(g.xmin + (p.x - g.pad) / g.cell), y = Math.round(g.ymax - (p.y - g.pad) / g.cell);
          return x < g.xmin || x > g.xmax || y < g.ymin || y > g.ymax ? null : [x, y];
        };
        svg.addEventListener("click", (e) => {
          if (el.dataset.locked) return;
          const p = snap(e);
          if (!p) return;
          const at = pts.findIndex((q2) => q2[0] === p[0] && q2[1] === p[1]);
          if (at >= 0) pts.splice(at, 1);
          else { if (pts.length >= n) pts.shift(); pts.push(p); }
          W.plot.draw(el, q, pts);
          set(W.plot.raw(pts));
        });
        svg.addEventListener("pointermove", (e) => {
          if (el.dataset.locked || e.pointerType !== "mouse") return;
          const p = snap(e), ghost = el.querySelector(".vz-ghost");
          ghost.innerHTML = p ? `<circle cx="${r1(g.X(p[0]))}" cy="${r1(g.Y(p[1]))}" r="7" class="vz-pt vz-ghost-pt"/>` : "";
        });
        svg.addEventListener("pointerleave", () => { el.querySelector(".vz-ghost").innerHTML = ""; });
      },
      result(el, q, raw) { el.querySelector(".vz-ghost").innerHTML = ""; W.plot.draw(el, q, W.plot.parse(raw), true); },
    },

    place: {
      draw(el, q, val, result) {
        const v = q.visual, g = nlGeom(v);
        const pin = (x, cls, label) => line(x, g.y - 30, x, g.y, `vz-pin-line ${cls}`) + `<circle cx="${r1(x)}" cy="${g.y - 34}" r="8" class="vz-pin ${cls}"/>` + (label ? txt(x, g.y - 47, label, `vz-t vz-lbl ${cls}-t`) : "");
        const label = (x) => (v.denom ? fracLabel(Math.round(x * v.denom), v.denom) : fmt(x));
        let s = "";
        if (result) {
          const ok = Number.isFinite(val) && W.place.ok(v, val);
          if (!ok) s += pin(g.X(num(v.target)), "ok", label(num(v.target)));
          if (Number.isFinite(val)) s += pin(g.X(val), ok ? "ok" : "bad", ok ? label(val) : "");
        } else if (Number.isFinite(val)) s += pin(g.X(val), "", "");
        el.querySelector(".vz-dyn").innerHTML = s;
      },
      ok: (v, val) => Math.abs(val - num(v.target)) <= num(v.tol, 0) + 1e-6,
      wire(el, q, set) {
        const v = q.visual, g = nlGeom(v), svg = el.querySelector("svg");
        const snapStep = num(v.snap, g.step) || g.step;
        let dragging = false;
        const update = (e) => {
          const p = svgPoint(svg, e);
          if (!p) return;
          let val = g.min + ((p.x - g.pad) / (g.W - 2 * g.pad)) * (g.max - g.min);
          val = rnd(Math.round((val - g.min) / snapStep) * snapStep + g.min);
          val = Math.min(g.max, Math.max(g.min, val));
          W.place.draw(el, q, val);
          set(String(val));
        };
        svg.addEventListener("pointerdown", (e) => { if (el.dataset.locked) return; dragging = true; svg.setPointerCapture?.(e.pointerId); update(e); e.preventDefault(); });
        svg.addEventListener("pointermove", (e) => { if (dragging) update(e); });
        const stop = () => { dragging = false; };
        svg.addEventListener("pointerup", stop);
        svg.addEventListener("pointercancel", stop);
      },
      result(el, q, raw) { W.place.draw(el, q, raw === "" || raw === undefined ? NaN : Number(raw), true); },
    },

    shade: {
      draw(el, q, on, result) {
        const target = Math.round(num(q.visual.target));
        $all(el, ".vz-part").forEach((p, i) => p.classList.toggle("on", on.has(i)));
        const c = el.querySelector(".vz-count");
        if (c) c.textContent = result ? "" : `Shaded: ${on.size} of ${$all(el, ".vz-part").length}`;
        if (result) el.querySelector("svg").classList.add(on.size === target ? "vz-all-ok" : "vz-all-bad");
      },
      wire(el, q, set) {
        const on = new Set();
        $all(el, ".vz-part").forEach((p) => p.addEventListener("click", () => {
          if (el.dataset.locked) return;
          const i = +p.dataset.i;
          on.has(i) ? on.delete(i) : on.add(i);
          W.shade.draw(el, q, on);
          set(on.size ? [...on].sort((a, b) => a - b).join(",") : "");
        }));
        W.shade.draw(el, q, on);
      },
      result(el, q, raw) {
        const on = new Set(String(raw || "").split(",").filter((x) => x !== "").map(Number));
        W.shade.draw(el, q, on, true);
      },
    },

    angleMake: {
      draw(el, q, deg, result) {
        const v = q.visual, cx = 150, cy = 150, R = 120;
        const arm = (d, cls) => {
          const ex = cx + R * Math.cos(rad(d)), ey = cy - R * Math.sin(rad(d));
          return line(cx, cy, ex, ey, `vz-arm2 ${cls}`) + `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="10" class="vz-handle ${cls}"/>`;
        };
        let s = "";
        if (Number.isFinite(deg) && deg > 0) s += `<path d="${sectorPath(cx, cy, 34, 0, deg)}" class="vz-angle-fill"/>`;
        if (result) {
          const ok = Number.isFinite(deg) && W.angleMake.ok(v, deg);
          if (!ok && v.target !== undefined) s += arm(num(v.target), "ok") + txt(cx + 70 * Math.cos(rad(num(v.target) / 2)), cy - 70 * Math.sin(rad(num(v.target) / 2)) + 4, `${fmt(num(v.target))}°`, "vz-t vz-lbl ok-t");
          if (Number.isFinite(deg)) s += arm(deg, ok ? "ok" : "bad");
          if (ok) s += txt(cx + 70 * Math.cos(rad(deg / 2)), cy - 70 * Math.sin(rad(deg / 2)) + 4, `${fmt(deg)}°`, "vz-t vz-lbl ok-t");
        } else s += arm(Number.isFinite(deg) ? deg : 0, "");
        el.querySelector(".vz-dyn").innerHTML = s;
      },
      ok(v, d) {
        if (Array.isArray(v.range)) return d >= num(v.range[0]) && d <= num(v.range[1]);
        return Math.abs(d - num(v.target)) <= num(v.tol, 2) + 1e-6;
      },
      wire(el, q, set) {
        const v = q.visual, svg = el.querySelector("svg");
        const snapStep = num(v.snap, v.target !== undefined && num(v.target) % 5 !== 0 ? 1 : 5);
        let dragging = false;
        const update = (e) => {
          const p = svgPoint(svg, e);
          if (!p || Math.hypot(p.x - 150, p.y - 150) < 12) return;
          let d = (Math.atan2(150 - p.y, p.x - 150) * 180) / Math.PI;
          if (d < 0) d += 360;
          d = Math.round(d / snapStep) * snapStep % 360;
          W.angleMake.draw(el, q, d);
          set(d ? String(d) : "");
        };
        svg.addEventListener("pointerdown", (e) => { if (el.dataset.locked) return; dragging = true; svg.setPointerCapture?.(e.pointerId); update(e); e.preventDefault(); });
        svg.addEventListener("pointermove", (e) => { if (dragging) update(e); });
        const stop = () => { dragging = false; };
        svg.addEventListener("pointerup", stop);
        svg.addEventListener("pointercancel", stop);
        W.angleMake.draw(el, q, NaN);
      },
      result(el, q, raw) { W.angleMake.draw(el, q, raw === "" || raw === undefined ? NaN : Number(raw), true); },
    },

    order: {
      draw(el, q, chosen, result) {
        const items = q.visual.items, order = el.dataset.order.split(",").map(Number);
        const chip = (i, cls = "") => `<button type="button" class="vz-chip ${cls}" data-i="${i}">${h(items[i])}</button>`;
        el.querySelector(".vz-chosen").innerHTML = chosen.length
          ? chosen.map((i, k) => chip(i, result ? (i === k ? "ok" : "bad") : "")).join(`<span class="vz-sep">›</span>`)
          : `<span class="vz-empty">Tap the items below in order</span>`;
        el.querySelector(".vz-pool").innerHTML = result
          ? `<div class="vz-correct">Correct order: ${items.map(h).join(" › ")}</div>`
          : order.filter((i) => !chosen.includes(i)).map((i) => chip(i)).join("");
      },
      wire(el, q, set) {
        const chosen = [], n = q.visual.items.length;
        el.addEventListener("click", (e) => {
          const b = e.target.closest(".vz-chip");
          if (!b || el.dataset.locked) return;
          const i = +b.dataset.i, at = chosen.indexOf(i);
          if (at >= 0) chosen.splice(at, 1); else chosen.push(i);
          W.order.draw(el, q, chosen);
          set(chosen.length === n ? chosen.join(",") : chosen.length ? "partial:" + chosen.join(",") : "");
        });
        W.order.draw(el, q, chosen);
      },
      result(el, q, raw) {
        const chosen = String(raw || "").replace(/^partial:/, "").split(",").filter((x) => x !== "").map(Number);
        W.order.draw(el, q, chosen, true);
      },
    },

    match: {
      draw(el, q, pairs, sel, result) {
        const colors = PALETTE;
        $all(el, "[data-l]").forEach((b) => {
          const l = +b.dataset.l, r = pairs[l];
          b.classList.toggle("sel", sel.l === l);
          b.classList.toggle("paired", r !== undefined);
          b.style.setProperty("--pair", r !== undefined ? colors[l % colors.length] : "");
          b.querySelector(".vz-badge").textContent = r !== undefined ? l + 1 : "";
          if (result) b.classList.add(r === l ? "ok" : "bad");
        });
        $all(el, "[data-r]").forEach((b) => {
          const r = +b.dataset.r, l = Object.keys(pairs).find((k) => pairs[k] === r);
          b.classList.toggle("sel", sel.r === r);
          b.classList.toggle("paired", l !== undefined);
          b.style.setProperty("--pair", l !== undefined ? colors[l % colors.length] : "");
          b.querySelector(".vz-badge").textContent = l !== undefined ? +l + 1 : "";
        });
        if (result && !el.querySelector(".vz-correct")) {
          const wrong = q.visual.pairs.filter((p, i) => pairs[i] !== i);
          if (wrong.length) el.insertAdjacentHTML("beforeend", `<div class="vz-correct">Correct matches: ${q.visual.pairs.map((p) => `${h(p[0])} → ${h(p[1])}`).join(" · ")}</div>`);
        }
      },
      wire(el, q, set) {
        const pairs = {}, sel = {}, n = q.visual.pairs.length;
        const commit = () => {
          W.match.draw(el, q, pairs, sel);
          const done = Object.keys(pairs).length === n;
          set(done ? [...Array(n).keys()].map((i) => pairs[i]).join(",") : Object.keys(pairs).length ? "partial" : "");
        };
        el.addEventListener("click", (e) => {
          const b = e.target.closest(".vz-mitem");
          if (!b || el.dataset.locked) return;
          if (b.dataset.l !== undefined) {
            const l = +b.dataset.l;
            if (pairs[l] !== undefined) { delete pairs[l]; delete sel.l; return commit(); }
            sel.l = sel.l === l ? undefined : l;
          } else {
            const r = +b.dataset.r, owner = Object.keys(pairs).find((k) => pairs[k] === r);
            if (owner !== undefined) { delete pairs[owner]; delete sel.r; return commit(); }
            sel.r = sel.r === r ? undefined : r;
          }
          if (sel.l !== undefined && sel.r !== undefined) { pairs[sel.l] = sel.r; delete sel.l; delete sel.r; }
          commit();
        });
        commit();
      },
      result(el, q, raw) {
        const pairs = {};
        String(raw || "").split(",").forEach((r, l) => { if (r !== "" && Number.isFinite(+r) && raw !== "partial") pairs[l] = +r; });
        W.match.draw(el, q, pairs, {}, true);
      },
    },

    tapword: {
      draw(el, q, on, result) {
        const targets = new Set(tapTargets(q.visual));
        $all(el, ".vz-word").forEach((b) => {
          const i = +b.dataset.i;
          b.classList.toggle("on", on.has(i));
          if (result) {
            b.classList.toggle("ok", targets.has(i));
            b.classList.toggle("bad", on.has(i) && !targets.has(i));
            b.classList.toggle("missed", targets.has(i) && !on.has(i));
          }
        });
      },
      wire(el, q, set) {
        const on = new Set(), n = tapTargets(q.visual).length;
        el.addEventListener("click", (e) => {
          const b = e.target.closest(".vz-word");
          if (!b || el.dataset.locked) return;
          const i = +b.dataset.i;
          if (on.has(i)) on.delete(i);
          else { if (n === 1) on.clear(); on.add(i); }
          W.tapword.draw(el, q, on);
          set(on.size ? [...on].sort((a, b2) => a - b2).join(",") : "");
        });
      },
      result(el, q, raw) {
        W.tapword.draw(el, q, new Set(String(raw || "").split(",").filter((x) => x !== "").map(Number)), true);
      },
    },
  };
  const $all = (root, sel) => [...root.querySelectorAll(sel)];

  // ---------------------------------------------------------------- Checking and answer text
  function visualCorrect(q, raw) {
    const v = q.visual;
    raw = String(raw ?? "");
    switch (v.type) {
      case "plot": {
        const got = W.plot.parse(raw).map((p) => p.join(",")).sort();
        const want = (v.targets || []).map((t) => `${num(t[0])},${num(t[1])}`).sort();
        return got.length === want.length && got.every((p, i) => p === want[i]);
      }
      case "place": return raw !== "" && W.place.ok(v, Number(raw));
      case "shade": return raw !== "" && raw.split(",").filter((x) => x !== "").length === Math.round(num(v.target));
      case "angleMake": return raw !== "" && W.angleMake.ok(v, Number(raw));
      case "order": return raw === [...Array(v.items.length).keys()].join(",");
      case "match": return raw === [...Array(v.pairs.length).keys()].join(",");
      case "tapword": return raw === tapTargets(v).join(",");
      default: return W[v.type]?.correct ? !!W[v.type].correct(v, raw) : false;
    }
  }
  function visualAnswerText(q) {
    const v = q.visual;
    switch (v.type) {
      case "plot": return (v.targets || []).map((t) => `(${fmt(num(t[0]))}, ${fmt(num(t[1]))})`).join(" and ");
      case "place": return v.denom ? fracLabel(Math.round(num(v.target) * v.denom), v.denom) : fmt(num(v.target));
      case "shade": return `${Math.round(num(v.target))} of the ${Math.round(num(v.parts))} parts shaded`;
      case "angleMake": return Array.isArray(v.range) ? `any angle from ${v.range[0]}° to ${v.range[1]}°` : `${fmt(num(v.target))}°`;
      case "order": return v.items.join(" › ");
      case "match": return v.pairs.map((p) => `${p[0]} → ${p[1]}`).join(", ");
      case "tapword": { const toks = tapTokens(v.text); return tapTargets(v).map((i) => `"${toks[i].t}"`).join(", "); }
      default: return W[v.type]?.answer ? W[v.type].answer(v) : "";
    }
  }
  function visualYourAnswer(q, raw) {
    const v = q.visual;
    raw = String(raw ?? "");
    if (!raw) return "(blank)";
    switch (v.type) {
      case "plot": return W.plot.parse(raw).map((p) => `(${fmt(p[0])}, ${fmt(p[1])})`).join(" and ");
      case "place": return v.denom ? fracLabel(Math.round(Number(raw) * v.denom), v.denom) : fmt(Number(raw));
      case "shade": return `${raw.split(",").length} parts shaded`;
      case "angleMake": return `${fmt(Number(raw))}°`;
      case "order": return raw.startsWith("partial") ? "(not finished)" : raw.split(",").map((i) => v.items[+i]).join(" › ");
      case "match": return raw === "partial" ? "(not finished)" : "your matches";
      case "tapword": { const toks = tapTokens(v.text); return raw.split(",").map((i) => `"${toks[+i]?.t ?? ""}"`).join(", "); }
      default: return W[v.type]?.yours ? W[v.type].yours(v, raw) : raw;
    }
  }

  // ---------------------------------------------------------------- Sanitising visuals written by the AI
  const n0 = (x) => (Number.isFinite(+x) ? +x : null);
  function cleanVisual(v) {
    if (!v || typeof v !== "object" || typeof v.type !== "string") return null;
    const t = v.type;
    const strs = (a, max = 12) => (Array.isArray(a) ? a.slice(0, max).map((x) => String(x ?? "").slice(0, 120)) : []);
    const range = (o) => {
      const r = {};
      ["min", "max", "xmin", "xmax", "ymin", "ymax"].forEach((k) => { if (n0(o[k]) !== null) r[k] = Math.max(-20, Math.min(20, Math.round(n0(o[k])))); });
      return r;
    };
    switch (t) {
      case "plot": {
        const r = range(v), g = planeGeom(r);
        const targets = (Array.isArray(v.targets) ? v.targets : v.target ? [v.target] : []).slice(0, 4)
          .map((p) => (Array.isArray(p) ? p : [p?.x, p?.y]).map(n0)).filter((p) => p.length === 2 && p.every((x) => x !== null && Number.isInteger(x)) && p[0] >= g.xmin && p[0] <= g.xmax && p[1] >= g.ymin && p[1] <= g.ymax);
        if (!targets.length) return null;
        return { type: t, ...r, targets, points: cleanPoints(v.points, g), lines: cleanLines(v.lines), labels: strs(v.labels, 4) };
      }
      case "plane": {
        const r = range(v), g = planeGeom(r);
        return { type: t, ...r, points: cleanPoints(v.points, g), lines: cleanLines(v.lines),
          polys: Array.isArray(v.polys || v.poly) ? [].concat(v.poly ? [v.poly] : v.polys).slice(0, 3).map((p) => (Array.isArray(p) ? p.map((xy) => (Array.isArray(xy) ? xy.map((z) => n0(z) ?? 0) : [0, 0])) : [])) : undefined };
      }
      case "place": case "numberline": {
        const min = n0(v.min) ?? 0, max = n0(v.max) ?? 10;
        if (!(max > min) || max - min > 1e6) return null;
        const out = { type: t, min, max, step: n0(v.step) > 0 ? n0(v.step) : undefined, labels: v.labels === "ends" ? "ends" : undefined,
          denom: Number.isInteger(n0(v.denom)) && n0(v.denom) > 1 && n0(v.denom) <= 20 ? n0(v.denom) : undefined };
        if (t === "place") {
          const target = n0(v.target);
          if (target === null || target < min || target > max) return null;
          out.target = target;
          // The target must be reachable by snapping to the ticks (or a finer step).
          const g = nlGeom(out), reach = (st) => st > 0 && Math.abs(Math.round((target - g.min) / st) * st + g.min - target) < 1e-6;
          let snap = reach(n0(v.snap)) ? n0(v.snap) : reach(g.step) ? g.step : null;
          if (!snap) for (const k of [2, 4, 5, 10, 100]) if (reach(g.step / k)) { snap = g.step / k; break; }
          if (!snap) return null;
          out.snap = snap === g.step ? undefined : snap;
        } else {
          out.marks = Array.isArray(v.marks) ? v.marks.slice(0, 6).map((m) => ({ v: n0(m?.v) ?? 0, label: String(m?.label ?? "").slice(0, 12) })) : undefined;
          out.jumps = Array.isArray(v.jumps) ? v.jumps.slice(0, 4).map((j) => ({ from: n0(j?.from) ?? 0, to: n0(j?.to) ?? 0, label: String(j?.label ?? "").slice(0, 10) })) : undefined;
          if (n0(v.arrow) !== null) out.arrow = n0(v.arrow);
        }
        return out;
      }
      case "shade": case "fraction": {
        const parts = Math.round(n0(v.parts) ?? 0);
        if (parts < 1 || parts > 40) return null;
        const shape = ["bar", "circle", "grid"].includes(v.shape) ? v.shape : "bar";
        if (t === "shade") {
          const target = Math.round(n0(v.target) ?? -1);
          if (target < 0 || target > parts) return null;
          return { type: t, shape, parts, target, cols: n0(v.cols) || undefined };
        }
        return { type: t, shape, parts, shaded: Math.max(0, Math.min(parts, Math.round(n0(v.shaded) ?? 0))) };
      }
      case "angleMake": {
        const target = n0(v.target);
        if (Array.isArray(v.range) && v.range.length === 2) return { type: t, range: v.range.map((x) => Math.max(0, Math.min(359, n0(x) ?? 0))) };
        if (target === null || target <= 0 || target >= 360) return null;
        return { type: t, target: Math.round(target) };
      }
      case "order": {
        const items = strs(v.items, 8).filter(Boolean);
        if (items.length < 2 || new Set(items).size !== items.length) return null;
        return { type: t, items, first: String(v.first || "First").slice(0, 20), last: String(v.last || "Last").slice(0, 20) };
      }
      case "match": {
        const pairs = (Array.isArray(v.pairs) ? v.pairs : []).slice(0, 6).filter((p) => Array.isArray(p) && p.length >= 2).map((p) => [String(p[0]).slice(0, 80), String(p[1]).slice(0, 80)]);
        if (pairs.length < 2 || new Set(pairs.map((p) => p[1])).size !== pairs.length) return null;
        return { type: t, pairs };
      }
      case "tapword": {
        const text = String(v.text || "").slice(0, 400);
        return tapTargets({ text }).length ? { type: t, text } : null;
      }
      case "bars": {
        const labels = strs(v.labels, 8), values = (Array.isArray(v.values) ? v.values : []).slice(0, 8).map((x) => Math.max(0, n0(x) ?? 0));
        if (!labels.length || labels.length !== values.length) return null;
        return { type: t, labels, values, title: v.title ? String(v.title).slice(0, 60) : undefined, yLabel: v.yLabel ? String(v.yLabel).slice(0, 30) : undefined };
      }
      case "spinner": return Array.isArray(v.sections) && v.sections.length >= 2 ? { type: t, sections: strs(v.sections, 12) } : null;
      case "triangle": return { type: t, angles: strs(v.angles, 3) };
      case "angle": { const deg = n0(v.deg); return deg > 0 && deg < 360 ? { type: t, deg, label: v.label ? String(v.label).slice(0, 10) : undefined, protractor: !!v.protractor } : null; }
      case "rect": return n0(v.w) > 0 ? { type: t, w: n0(v.w), h: n0(v.h) || n0(v.w), unit: String(v.unit || "").slice(0, 6) } : null;
      case "circle": return n0(v.r) > 0 || n0(v.d) > 0 ? { type: t, r: n0(v.r) || undefined, d: n0(v.d) || undefined, unit: String(v.unit || "").slice(0, 6) } : null;
      case "dotplot": return Array.isArray(v.values) && v.values.length ? { type: t, values: v.values.slice(0, 40).map((x) => Math.round(n0(x) ?? 0)) } : null;
      case "table": return Array.isArray(v.rows) ? { type: t, rows: v.rows.slice(0, 6).map((r) => strs([].concat(r), 8)), headers: v.headers ? strs(v.headers, 8) : undefined } : null;
      default: return null;
    }
  }
  function cleanPoints(points, g) {
    return Array.isArray(points) ? points.slice(0, 8).map((p) => ({ x: n0(p?.x) ?? 0, y: n0(p?.y) ?? 0, label: String(p?.label ?? "").slice(0, 8) }))
      .filter((p) => p.x >= g.xmin && p.x <= g.xmax && p.y >= g.ymin && p.y <= g.ymax) : undefined;
  }
  function cleanLines(lines) {
    return Array.isArray(lines) ? lines.slice(0, 3).map((l) => (n0(l?.x) !== null ? { x: n0(l.x) } : { m: n0(l?.m) ?? 0, c: n0(l?.c) ?? 0, label: String(l?.label ?? "").slice(0, 16) })) : undefined;
  }


  // ---------------------------------------------------------------- "Try it" explorers for the Learn tab
  const slider = (id, label, min, max, val, step = 1) =>
    `<label class="vz-slider"><span>${h(label)}</span><input type="range" data-s="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${h(label)}"><output data-o="${id}">${fmt(val)}</output></label>`;
  const angleName = (d) => (d === 0 ? "no turn yet" : d < 90 ? "an acute angle (less than 90°)" : d === 90 ? "a right angle (exactly 90°)" : d < 180 ? "an obtuse angle (between 90° and 180°)"
    : d === 180 ? "a straight angle (exactly 180°)" : "a reflex angle (between 180° and 360°)");
  const quadrant = (x, y) => (x === 0 && y === 0 ? "the origin" : x === 0 ? "on the y-axis" : y === 0 ? "on the x-axis"
    : `in the ${x > 0 ? (y > 0 ? "1st" : "4th") : (y > 0 ? "2nd" : "3rd")} quadrant`);
  const EXPLORERS = {
    plane: {
      hint: "Tap anywhere on the grid to see the point's coordinates and which quadrant it's in.",
      html: () => `<div class="vz-input">${planeSVG({}, true)}</div>`,
      wire(el) {
        const g = planeGeom({}), svg = el.querySelector("svg"), out = el.querySelector(".vz-readout");
        svg.addEventListener("click", (e) => {
          const p = svgPoint(svg, e);
          if (!p) return;
          const x = Math.round(g.xmin + (p.x - g.pad) / g.cell), y = Math.round(g.ymax - (p.y - g.pad) / g.cell);
          if (x < g.xmin || x > g.xmax || y < g.ymin || y > g.ymax) return;
          el.querySelector(".vz-dyn").innerHTML = (x ? line(g.X(0), g.Y(0), g.X(x), g.Y(0), "vz-warm vz-dash") : "") + (y ? line(g.X(x), g.Y(0), g.X(x), g.Y(y), "vz-warm vz-dash") : "")
            + `<circle cx="${r1(g.X(x))}" cy="${r1(g.Y(y))}" r="7" class="vz-pt"/>` + ptLabel(g, x, y, `(${fmt(x)}, ${fmt(y)})`);
          const across = x ? `${Math.abs(x)} ${x > 0 ? "right" : "left"}` : "0 across", up = y ? `${Math.abs(y)} ${y > 0 ? "up" : "down"}` : "0 up or down";
          out.innerHTML = `<b>(${fmt(x)}, ${fmt(y)})</b> — from the origin go ${across}, then ${up}. It's ${quadrant(x, y)}.`;
        });
      },
    },
    jump: {
      hint: "Move the sliders to start somewhere and jump. Jumps to the right add, jumps to the left subtract.",
      html: () => slider("a", "Start", -10, 10, -3) + slider("b", "Jump", -10, 10, 5) + `<div class="vz-ex-out"></div>`,
      draw(el, s) {
        const end = s.a + s.b, min = Math.min(-10, end), max = Math.max(10, end);
        el.querySelector(".vz-ex-out").innerHTML = nlSVG({ type: "numberline", min, max, step: 1, labelEvery: 5,
          marks: [{ v: s.a, label: "start" }, ...(s.b ? [{ v: end, label: fmt(end), color: "orange" }] : [])],
          jumps: s.b ? [{ from: s.a, to: end, label: `${s.b > 0 ? "+" : "−"}${Math.abs(s.b)}` }] : [] });
        return `<b>${fmt(s.a)} ${s.b >= 0 ? "+" : "−"} ${Math.abs(s.b)} = ${fmt(end)}</b>`;
      },
    },
    fraction: {
      hint: "Choose how many equal parts, then tap parts to shade them.",
      html: () => slider("n", "Equal parts", 2, 12, 8) + `<div class="vz-ex-out vz-input"></div>`,
      draw(el, s, changed) {
        const out = el.querySelector(".vz-ex-out");
        if (changed !== "tap") {
          s.on = new Set();
          const f = fracParts({ parts: s.n });
          out.innerHTML = `${svgOpen(f.W, f.H, "Fraction bar", f.W)}${f.parts.map((p, i) => `${p} class="vz-part vz-tap" data-i="${i}"/>`).join("")}</svg>`;
          out.querySelectorAll(".vz-part").forEach((p) => p.addEventListener("click", () => {
            const i = +p.dataset.i;
            s.on.has(i) ? s.on.delete(i) : s.on.add(i);
            p.classList.toggle("on", s.on.has(i));
            el.querySelector(".vz-readout").innerHTML = EXPLORERS.fraction.draw(el, s, "tap");
          }));
        }
        const k = s.on.size, n = s.n, g = gcd(k, n);
        if (!k) return "Tap the parts to shade them.";
        return `<b>${k}/${n}</b>${g > 1 ? ` = <b>${k / g}/${n / g}</b>` : ""} shaded = <b>${fmt(Math.round((k / n) * 1000) / 1000)}</b> = <b>${fmt(Math.round((k / n) * 1000) / 10)}%</b>`;
      },
    },
    angle: {
      hint: "Drag the orange arm around the protractor and watch the angle change.",
      html: () => `<div class="vz-input">${svgOpen(300, 300, "Protractor", 300, "vz-drag")}${protractor(150, 150, 128, 360)}
        <line x1="150" y1="150" x2="270" y2="150" class="vz-arm"/><g class="vz-dyn"></g><circle cx="150" cy="150" r="4" class="vz-ink-fill"/>
        <rect class="vz-hit" x="0" y="0" width="300" height="300"/></svg></div>`,
      wire(el) {
        const svg = el.querySelector("svg"), out = el.querySelector(".vz-readout");
        const draw = (d) => {
          const ex = 150 + 120 * Math.cos(rad(d)), ey = 150 - 120 * Math.sin(rad(d));
          el.querySelector(".vz-dyn").innerHTML = (d ? `<path d="${sectorPath(150, 150, 40, 0, d)}" class="vz-angle-fill"/><path d="${arcPath(150, 150, 40, 0, d)}" class="vz-arc"/>` : "")
            + line(150, 150, ex, ey, "vz-arm2") + `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="10" class="vz-handle"/>`
            + (d ? txt(150 + 62 * Math.cos(rad(d / 2)), 150 - 62 * Math.sin(rad(d / 2)) + 4, `${d}°`, "vz-t vz-lbl") : "");
          out.innerHTML = `<b>${d}°</b> — ${angleName(d)}.`;
        };
        let dragging = false;
        const update = (e) => {
          const p = svgPoint(svg, e);
          if (!p || Math.hypot(p.x - 150, p.y - 150) < 12) return;
          let d = Math.round((Math.atan2(150 - p.y, p.x - 150) * 180) / Math.PI);
          if (d < 0) d += 360;
          draw(d % 360);
        };
        svg.addEventListener("pointerdown", (e) => { dragging = true; svg.setPointerCapture?.(e.pointerId); update(e); e.preventDefault(); });
        svg.addEventListener("pointermove", (e) => { if (dragging) update(e); });
        svg.addEventListener("pointerup", () => { dragging = false; });
        svg.addEventListener("pointercancel", () => { dragging = false; });
        draw(60);
      },
    },
    decimal: {
      hint: "Tap or drag on the number line. See the decimal, the fraction, and what it rounds to.",
      html: () => `<div class="vz-input">${nlSVG({ type: "place", min: 0, max: 1, step: 0.1 }, true)}</div>`,
      wire(el) {
        const g = nlGeom({ type: "place", min: 0, max: 1, step: 0.1 }), svg = el.querySelector("svg"), out = el.querySelector(".vz-readout");
        const draw = (v) => {
          const x = g.X(v);
          el.querySelector(".vz-dyn").innerHTML = line(x, g.y - 30, x, g.y, "vz-pin-line") + `<circle cx="${r1(x)}" cy="${g.y - 34}" r="8" class="vz-pin"/>` + txt(x, g.y - 47, v.toFixed(2), "vz-t vz-lbl");
          const hundredths = Math.round(v * 100), gg = gcd(hundredths, 100);
          out.innerHTML = `<b>${v.toFixed(2)}</b> = <b>${hundredths}/100</b>${gg > 1 && hundredths ? ` = ${hundredths / gg}/${100 / gg}` : ""} · rounds to <b>${(Math.round(v * 10) / 10).toFixed(1)}</b> (1 decimal place)`;
        };
        let dragging = false;
        const update = (e) => {
          const p = svgPoint(svg, e);
          if (!p) return;
          const v = Math.min(1, Math.max(0, Math.round(((p.x - g.pad) / (g.W - 2 * g.pad)) * 100) / 100));
          draw(v);
        };
        svg.addEventListener("pointerdown", (e) => { dragging = true; svg.setPointerCapture?.(e.pointerId); update(e); e.preventDefault(); });
        svg.addEventListener("pointermove", (e) => { if (dragging) update(e); });
        svg.addEventListener("pointerup", () => { dragging = false; });
        svg.addEventListener("pointercancel", () => { dragging = false; });
        draw(0.37);
      },
    },
    machine: {
      hint: "Build a rule with the sliders, then change the input to see what comes out.",
      html: () => slider("m", "Multiply by", 1, 5, 2) + slider("c", "Then add", -5, 5, 3) + slider("x", "Input x", -10, 10, 4) + `<div class="vz-ex-out"></div>`,
      draw(el, s) {
        const y = s.m * s.x + s.c, add = s.c >= 0 ? `+ ${s.c}` : `− ${-s.c}`;
        el.querySelector(".vz-ex-out").innerHTML = machineHTML({ input: fmt(s.x), steps: [`× ${s.m}`, add], output: fmt(y) });
        return `Rule: <b>y = ${s.m === 1 ? "" : s.m}x ${add}</b>. When x = ${fmt(s.x)}: ${s.m} × ${fmt(s.x)} ${add} = <b>${fmt(y)}</b>`;
      },
    },
    balance: {
      hint: "Find x! Move the slider until the scale balances. Then try a new equation.",
      html: () => slider("x", "Try x =", 0, 15, 0) + `<div class="vz-ex-out"></div><div class="row" style="justify-content:center;"><button type="button" class="btn ghost sm" data-new>New equation</button></div>`,
      init: (s) => { s.a = 4; s.ans = 6; },
      draw(el, s) {
        const b = s.a + s.ans, left = s.x + s.a, diff = left - b;
        el.querySelector(".vz-ex-out").innerHTML = balanceSVG({ left: ["x", String(s.a)], right: [String(b)], tilt: Math.max(-14, Math.min(14, -diff * 2.5)) });
        return diff === 0 ? `🎉 <b>Balanced!</b> x + ${s.a} = ${b}, so <b>x = ${s.x}</b>.`
          : `x + ${s.a} = ${s.x} + ${s.a} = <b>${left}</b>, which is ${diff < 0 ? "lighter" : "heavier"} than ${b}. Try a ${diff < 0 ? "bigger" : "smaller"} x.`;
      },
      wire(el, s, redraw) {
        el.querySelector("[data-new]").addEventListener("click", () => {
          s.a = 1 + Math.floor(Math.random() * 9);
          s.ans = 1 + Math.floor(Math.random() * 12);
          s.x = 0;
          el.querySelector('[data-s="x"]').value = 0;
          redraw();
        });
      },
    },
    rect: {
      hint: "Change the width and height. Count the squares for the area; walk around the edge for the perimeter.",
      html: () => slider("w", "Width", 1, 12, 6) + slider("h", "Height", 1, 10, 4) + `<div class="vz-ex-out"></div>`,
      draw(el, s) {
        el.querySelector(".vz-ex-out").innerHTML = rectSVG({ w: s.w, h: s.h, wLabel: `${s.w} units`, hLabel: `${s.h} units`, grid: true });
        return `Area = ${s.w} × ${s.h} = <b>${s.w * s.h} square units</b> · Perimeter = 2 × (${s.w} + ${s.h}) = <b>${2 * (s.w + s.h)} units</b>`;
      },
    },
    multiples: {
      hint: "Pick a number to light up its multiples on the hundred grid.",
      html: () => slider("n", "Multiples of", 2, 12, 3) + `<div class="vz-ex-out"></div>`,
      draw(el, s) {
        let g = "";
        for (let k = 1; k <= 100; k++) {
          const x = ((k - 1) % 10) * 32 + 2, y = Math.floor((k - 1) / 10) * 26 + 2, on = k % s.n === 0;
          g += `<rect x="${x}" y="${y}" width="30" height="24" rx="4" class="vz-cell${on ? " on" : ""}"/>` + txt(x + 15, y + 16, String(k), `vz-t vz-cell-t${on ? " on" : ""}`);
        }
        el.querySelector(".vz-ex-out").innerHTML = svgOpen(324, 264, `Hundred grid showing multiples of ${s.n}`, 360) + g + `</svg>`;
        const list = [...Array(Math.floor(100 / s.n)).keys()].map((i) => (i + 1) * s.n);
        return `Multiples of ${s.n}: <b>${list.slice(0, 8).join(", ")}${list.length > 8 ? ", …" : ""}</b> — ${list.length} of them up to 100.`;
      },
    },
    spinner: {
      hint: "Choose how many sections are red, then spin. Compare what happens with what should happen.",
      html: () => slider("r", "Red sections (out of 8)", 0, 8, 3) + `<div class="vz-ex-out"></div>
        <div class="row" style="justify-content:center;"><button type="button" class="btn sm" data-spin="1">Spin</button><button type="button" class="btn secondary sm" data-spin="10">Spin 10 times</button><button type="button" class="btn ghost sm" data-spin="0">Reset</button></div>`,
      init: (s) => { s.red = 0; s.blue = 0; s.turn = 0; },
      draw(el, s, changed) {
        if (changed === "r") { s.red = 0; s.blue = 0; }
        const cx = 90, cy = 96, r = 78;
        let g = "";
        for (let i = 0; i < 8; i++) {
          const a1 = 90 - i * 45, a2 = 90 - (i + 1) * 45;
          g += `<path d="${sectorPath(cx, cy, r, a2, a1)}" class="vz-sector" style="fill:${i < s.r ? COLORS.red : COLORS.blue}"/>`;
        }
        const out = el.querySelector(".vz-ex-out");
        if (!out.querySelector(".vz-spin")) out.innerHTML = `<div class="vz-spin">${svgOpen(180, 184, "Spinner", 200)}<g class="vz-secs"></g><circle cx="${cx}" cy="${cy}" r="${r}" class="vz-rim"/>
          <g class="vz-arrow-g" style="transform-origin:${cx}px ${cy}px;"><polygon points="${cx},${cy - r + 22} ${cx - 7},${cy} ${cx + 7},${cy}" class="vz-ink-fill"/></g><circle cx="${cx}" cy="${cy}" r="6" class="vz-ink-fill"/></svg></div>`;
        out.querySelector(".vz-secs").innerHTML = g;
        out.querySelector(".vz-arrow-g").style.transform = `rotate(${s.turn}deg)`;
        const total = s.red + s.blue, pct = (n) => (total ? Math.round((n / total) * 100) : 0);
        return `Spins: <b>${total}</b> · Red <b>${s.red}</b>${total ? ` (${pct(s.red)}%)` : ""} · Blue <b>${s.blue}</b>${total ? ` (${pct(s.blue)}%)` : ""}<br><span class="muted">Theory: P(red) = ${s.r}/8 = ${fmt(Math.round((s.r / 8) * 1000) / 10)}%</span>`;
      },
      wire(el, s, redraw) {
        el.querySelectorAll("[data-spin]").forEach((b) => b.addEventListener("click", () => {
          const n = +b.dataset.spin;
          if (!n) { s.red = 0; s.blue = 0; return redraw(); }
          for (let k = 0; k < n; k++) {
            const stop = Math.random() * 360;
            s.turn = Math.ceil(s.turn / 360) * 360 + 720 + stop;
            Math.floor(stop / 45) < s.r ? s.red++ : s.blue++;
          }
          redraw();
        }));
      },
    },
    area: {
      hint: "Split each number into tens and ones. The four rectangles are the parts you add up.",
      html: () => slider("a", "First number", 11, 39, 23) + slider("b", "Second number", 11, 39, 14) + `<div class="vz-ex-out"></div>`,
      draw(el, s) {
        const at = Math.floor(s.a / 10) * 10, ao = s.a % 10, bt = Math.floor(s.b / 10) * 10, bo = s.b % 10;
        const sc = Math.min(260 / s.a, 170 / s.b), x0 = 54, y0 = 24, cols = [[at, 0], [ao, at]], rows = [[bt, 0], [bo, bt]];
        let g = "", parts = [];
        rows.forEach(([hgt, yo], ri) => cols.forEach(([wid, xo], ci) => {
          if (!wid || !hgt) return;
          const x = x0 + xo * sc, y = y0 + yo * sc, w = wid * sc, hh = hgt * sc;
          g += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(hh)}" class="vz-shape" style="fill:${PALETTE[ri * 2 + ci]};fill-opacity:.22"/>`;
          if (w > 20 && hh > 14) g += txt(x + w / 2, y + hh / 2 + 5, String(wid * hgt), "vz-t vz-lbl");
          parts.push(wid * hgt);
        }));
        cols.forEach(([wid, xo]) => { if (wid) g += txt(x0 + (xo + wid / 2) * sc, y0 - 7, String(wid), "vz-t vz-sm"); });
        rows.forEach(([hgt, yo]) => { if (hgt) g += txt(x0 - 7, y0 + (yo + hgt / 2) * sc + 4, String(hgt), "vz-t vz-sm", "end"); });
        el.querySelector(".vz-ex-out").innerHTML = svgOpen(340, s.b * sc + 34, "Area model", 380) + g + `</svg>`;
        return `${s.a} × ${s.b} = ${parts.join(" + ")} = <b>${s.a * s.b}</b>`;
      },
    },
  };
  const TOPIC_EXPLORERS = { "y7-computation": "area", "y7-numberprops": "multiples", "y7-fdp": "fraction", "y7-algebra": "machine", "y7-decimals": "decimal",
    "y7-negatives": "jump", "y7-cartesian": "plane", "y7-geometry": "angle", "y7-statsprob": "spinner", "y7-equations": "balance", "y7-measurement": "rect" };

  function explorerHTML(topicId) {
    const kind = TOPIC_EXPLORERS[topicId], ex = EXPLORERS[kind];
    if (!ex) return "";
    return `<div class="card lesson vz-explore" data-kind="${kind}"><h3>🧪 Try it</h3><p class="muted small" style="margin-top:0;">${h(ex.hint)}</p>
      ${ex.html()}<p class="vz-readout" aria-live="polite"></p></div>`;
  }
  function wireExplorer(root) {
    const el = root.querySelector(".vz-explore");
    if (!el) return;
    const ex = EXPLORERS[el.dataset.kind], s = {};
    el.querySelectorAll("[data-s]").forEach((inp) => { s[inp.dataset.s] = Number(inp.value); });
    ex.init?.(s);
    const out = el.querySelector(".vz-readout");
    const redraw = (changed) => {
      el.querySelectorAll("[data-o]").forEach((o) => { o.textContent = fmt(s[o.dataset.o]); });
      if (ex.draw) out.innerHTML = ex.draw(el, s, changed);
    };
    el.querySelectorAll("[data-s]").forEach((inp) => inp.addEventListener("input", () => { s[inp.dataset.s] = Number(inp.value); redraw(inp.dataset.s); }));
    ex.wire?.(el, s, redraw);
    if (ex.draw) redraw();
  }

  // ---------------------------------------------------------------- Public API
  function isVisualInput(q) { return !!(q && q.visual && INPUTS.has(q.visual.type)); }
  function visualHTML(q) {
    if (!q || !q.visual) return "";
    // An answer widget can carry a picture to look at too: visual.fig = { type: "<diagram>", ... }.
    const fig = q.visual.fig && DIAGRAMS[q.visual.fig.type] ? `<div class="vz-fig">${DIAGRAMS[q.visual.fig.type](q.visual.fig)}</div>` : "";
    if (isVisualInput(q)) return `<div class="vz vz-input">${fig}${widgetHTML(q)}</div>`;
    const draw = DIAGRAMS[q.visual.type];
    return draw ? `<div class="vz">${draw(q.visual)}</div>` : "";
  }
  function pointInputHTML(q) {
    return `<input type="hidden" data-qid="${h(q.id)}" value="">
      <div class="pt-input">( <input type="text" class="pt-x" inputmode="text" aria-label="x-coordinate" placeholder="x" autocomplete="off"> ,
        <input type="text" class="pt-y" inputmode="text" aria-label="y-coordinate" placeholder="y" autocomplete="off"> )</div>`;
  }
  const parseNum = (s) => {
    const t = String(s ?? "").trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
    return t === "" || !/^-?\d*\.?\d+$/.test(t) ? NaN : Number(t);
  };
  function pointCorrect(q, raw) {
    const [x, y] = String(raw || "").split(",").map(parseNum);
    const [ax, ay] = q.point || String(q.answer).replace(/[()\s]/g, "").replace(/[−–]/g, "-").split(",").map(Number);
    return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - ax) < 1e-9 && Math.abs(y - ay) < 1e-9;
  }

  // Wires a rendered question: multiple choice, ( x , y ) boxes and interactive visuals all write to the hidden input.
  function wireQuestion(row, q) {
    const hidden = row.querySelector(`input[type=hidden][data-qid]`);
    const set = (val) => {
      if (!hidden) return;
      hidden.value = val;
      hidden.dispatchEvent(new Event("input", { bubbles: true }));
    };
    if (q.options) {
      row.querySelectorAll(".mc-opt input[type=radio]").forEach((r) => r.addEventListener("change", () => set(r.value)));
    }
    if (q.answerType === "point") {
      const xs = row.querySelector(".pt-x"), ys = row.querySelector(".pt-y");
      const update = () => set(xs.value.trim() && ys.value.trim() ? `${xs.value.trim()},${ys.value.trim()}` : "");
      xs.addEventListener("input", update);
      ys.addEventListener("input", update);
    }
    if (isVisualInput(q)) {
      const el = row.querySelector(".vz-widget");
      if (el) W[q.visual.type].wire(el, q, set);
    }
  }
  function markVisual(row, q, raw, correct) {
    if (q.answerType === "point") {
      const [x = "", y = ""] = String(raw || "").split(",");
      row.querySelectorAll(".pt-x, .pt-y").forEach((inp) => { inp.disabled = true; inp.classList.add(correct ? "correct" : "wrong"); });
      const xs = row.querySelector(".pt-x"), ys = row.querySelector(".pt-y");
      if (xs && !xs.value) xs.value = x;
      if (ys && !ys.value) ys.value = y;
      return;
    }
    if (!isVisualInput(q)) return;
    const el = row.querySelector(".vz-widget");
    if (!el) return;
    el.dataset.locked = "1";
    el.classList.add("locked");
    el.querySelectorAll(".vz-hint").forEach((x) => x.remove());
    W[q.visual.type].result(el, q, raw);
  }

  // Lets another file add diagrams ({ name: (v) => svg }), descriptions and answer widgets
  // ({ name: { html(v, q), wire(el, q, set), result(el, q, raw), correct(v, raw), answer(v), yours(v, raw) } }).
  function registerVisuals({ diagrams = {}, describe: desc = {}, inputs = {} } = {}) {
    Object.assign(DIAGRAMS, diagrams);
    Object.assign(EXTRA_DESCRIBE, desc);
    Object.entries(inputs).forEach(([name, w]) => { W[name] = w; INPUTS.add(name); });
    window.VISUAL_TYPES = [...Object.keys(DIAGRAMS), ...INPUTS];
  }
  const VZ_KIT = { h, num, r1, fmt, rad, svgOpen, txt, line, arrowHead, colorOf, PALETTE, scramble, shuffled, describe, all: (root, sel) => [...root.querySelectorAll(sel)] };

  Object.assign(window, {
    registerVisuals, VZ_KIT,
    isVisualInput, visualHTML, pointInputHTML, wireQuestion, markVisual, visualCorrect, pointCorrect,
    visualAnswerText, visualYourAnswer, describeVisual: describe, cleanVisual, tapTokens, explorerHTML, wireExplorer,
    VISUAL_TYPES: [...Object.keys(DIAGRAMS), ...INPUTS],
  });
})();
