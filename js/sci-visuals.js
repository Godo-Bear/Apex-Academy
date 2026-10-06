/* Science diagrams and answer widgets, added to the visual engine in visuals.js.

   Diagrams (drawn above a normal answer, or used inside a widget):
     particles, statechange, moons, moonorbit, seasons, tides, forces, magnets, lever, pulley, equipment,
     cylinder, thermometer, setup, chroma, layers, key, pics, pyramid, foodweb, linegraph
   Answer widgets:
     tapfig  — tap the right part(s) of a diagram: { type: "tapfig", on: { type: "foodweb", ... }, target: "Fox" | [..] }
     sort    — put each item in a group:          { type: "sort", cats: ["A", "B"], items: [["thing", 0], ...] }
   Parts of a diagram that can be tapped carry data-hot="key" (see each diagram for its keys). */
(function () {
  "use strict";
  if (typeof registerVisuals !== "function") return;
  const { h, num, r1, rad, svgOpen, txt, line, arrowHead, colorOf, PALETTE, shuffled, all } = VZ_KIT;

  // A tappable part: an invisible halo (shown when tapped) behind the part's drawing.
  const hot = (key, halo, body = "") => `<g class="vz-hs" data-hot="${h(key)}">${halo.replace(/^<(\w+)/, '<$1 class="vz-halo"')}${body}</g>`;
  const circ = (x, y, r) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`;
  const box = (x, y, w, ht, rx = 8) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(ht)}" rx="${rx}"/>`;
  const path = (d, cls) => `<path d="${d}" class="${cls}"/>`;
  const emo = (x, y, e, size = 26) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px">${h(e)}</text>`;
  const cap = (s) => String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1);
  const LETTERS = "ABCDEFGHIJ";
  // Splits text into lines of about `n` characters.
  const wrap = (s, n) => {
    const out = [];
    String(s || "").split(/\s+/).forEach((w) => {
      if (out.length && (out[out.length - 1] + " " + w).length <= n) out[out.length - 1] += " " + w;
      else out.push(w);
    });
    return out;
  };
  const lines = (x, y, arr, cls = "vz-t vz-sm", gap = 13) => arr.map((l, i) => txt(x, y + i * gap - ((arr.length - 1) * gap) / 2, l, cls)).join("");
  // Arrow from (x1,y1) to (x2,y2) with a head at the end.
  const arrow = (x1, y1, x2, y2, cls = "vz-ink", head = "vz-ink-fill", size = 8) =>
    line(x1, y1, x2, y2, cls) + arrowHead(x2, y2, (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI, head, size);
  // Small seeded random numbers so pictures look the same every time.
  const seeded = (seed) => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  // ------------------------------------------------------------ Particles (solid / liquid / gas). Hot keys: the labels.
  function particlesSVG(v) {
    const states = v.states || ["solid", "liquid", "gas"];
    const labels = v.labels || states.map(cap);
    const S = 104, G = 22, W = states.length * S + (states.length - 1) * G + 8, H = S + 34;
    let s = "";
    states.forEach((st, i) => {
      const x0 = 4 + i * (S + G), y0 = 4, rnd = seeded(7 + i * 13), r = 6.4;
      let dots = "";
      const dot = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" class="vz-particle"/>`;
      if (st === "solid") {
        for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) dots += dot(x0 + 14.5 + b * 15, y0 + 14.5 + a * 15);
      } else if (st === "liquid") {
        for (let a = 0; a < 5; a++) for (let b = 0; b < 7; b++) {
          if (rnd() < 0.18) continue;
          dots += dot(x0 + 13 + b * 13 + (rnd() - 0.5) * 5 + (a % 2) * 3, y0 + S - 12 - a * 12.2 + (rnd() - 0.5) * 4);
        }
      } else {
        const spots = [[20, 22], [70, 16], [46, 50], [84, 60], [22, 78], [62, 88], [90, 32]];
        spots.forEach(([px, py], k) => {
          const ang = rnd() * Math.PI * 2;
          dots += line(x0 + px, y0 + py, x0 + px - Math.cos(ang) * 14, y0 + py - Math.sin(ang) * 14, "vz-motion") + dot(x0 + px, y0 + py);
          if (k === 99) dots += "";
        });
      }
      const label = labels[i] ?? cap(st);
      s += hot(label, box(x0 - 3, y0 - 3, S + 6, S + 30, 10),
        `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" rx="6" class="vz-container"/>${dots}${txt(x0 + S / 2, y0 + S + 19, label, "vz-t")}`);
    });
    return svgOpen(W, H, describeSci.particles(v), Math.min(W, 420)) + s + "</svg>";
  }

  // ------------------------------------------------------------ Changes of state. Hot keys: process names.
  function stateChangeSVG(v) {
    const show = v.show || ["melting", "freezing", "evaporating", "condensing"];
    const mode = v.labels || "names"; // names | none | letters
    const hide = new Set(v.hide || []);
    const P = { solid: [70, 210], liquid: [330, 210], gas: [200, 50] };
    const LBL = { melting: [200, 242], freezing: [200, 186], deposition: [86, 122], sublimation: [166, 164], evaporating: [316, 122], condensing: [234, 136] };
    const arrows = {
      melting: ["solid", "liquid", -1], freezing: ["liquid", "solid", -1],
      evaporating: ["liquid", "gas", 1], condensing: ["gas", "liquid", 1],
      sublimation: ["solid", "gas", 1], deposition: ["gas", "solid", 1],
    };
    let s = "";
    Object.entries(P).forEach(([k, [x, y]]) => {
      s += `<rect x="${x - 46}" y="${y - 20}" width="92" height="40" rx="20" class="vz-node"/>${txt(x, y + 5, cap(k), "vz-t")}`;
    });
    show.forEach((name, i) => {
      const [a, b] = arrows[name];
      const [x1, y1] = P[a], [x2, y2] = P[b];
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      // Offset each arrow to one side so the two directions sit side by side.
      const off = 13, nx = -uy * off, ny = ux * off;
      const sx = x1 + ux * 52 + nx, sy = y1 + uy * 30 + ny, ex = x2 - ux * 52 + nx, ey = y2 - uy * 30 + ny;
      const [lx, ly] = LBL[name];
      const label = mode === "letters" ? LETTERS[i] : mode === "none" || hide.has(name) ? "?" : cap(name);
      s += hot(name, `<circle cx="${r1(lx)}" cy="${r1(ly - 4)}" r="24"/>`,
        `<line x1="${r1(sx)}" y1="${r1(sy)}" x2="${r1(ex)}" y2="${r1(ey)}" class="vz-hit-line"/>` +
        arrow(sx, sy, ex, ey, "vz-flow", "vz-flow-fill", 9) + txt(lx, ly, label, `vz-t vz-sm vz-lbl${label === "?" ? " vz-warm-t" : ""}`));
    });
    return svgOpen(400, 256, describeSci.statechange(v), 380) + s + "</svg>";
  }

  // ------------------------------------------------------------ Moon pictures. Hot keys: the labels.
  const PHASES = {
    "new moon": [0, 0], "waxing crescent": [0.22, 1], "first quarter": [0.5, 1], "waxing gibbous": [0.78, 1],
    "full moon": [1, 0], "waning gibbous": [0.78, -1], "last quarter": [0.5, -1], "waning crescent": [0.22, -1],
  };
  // Draws the Moon as seen from the given hemisphere (south by default: waxing = lit on the left).
  function moonFace(cx, cy, r, phase, south = true) {
    const [k, dir] = PHASES[phase] || PHASES["full moon"];
    let s = `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r}" class="vz-moon-dark"/>`;
    if (k >= 1) return s + `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r}" class="vz-moon-lit"/>`;
    if (k <= 0) return s;
    const litRight = south ? dir < 0 : dir > 0;
    const rx = r1(r * Math.abs(1 - 2 * k)), top = `${r1(cx)} ${r1(cy - r)}`, bot = `${r1(cx)} ${r1(cy + r)}`;
    const d = litRight
      ? `M ${top} A ${r} ${r} 0 0 1 ${bot} A ${rx} ${r} 0 0 ${k < 0.5 ? 0 : 1} ${top} Z`
      : `M ${top} A ${r} ${r} 0 0 0 ${bot} A ${rx} ${r} 0 0 ${k < 0.5 ? 1 : 0} ${top} Z`;
    return s + `<path d="${d}" class="vz-moon-lit"/>`;
  }
  function moonsSVG(v) {
    const phases = v.phases || [], n = phases.length, C = 86, W = n * C, H = v.names === false && !v.labels ? 80 : 104;
    const labels = v.labels || phases.map((p) => cap(p));
    let s = "";
    phases.forEach((p, i) => {
      const cx = i * C + C / 2;
      s += hot(labels[i], box(cx - 40, 2, 80, H - 4), moonFace(cx, 40, 30, p, v.hemisphere !== "north") +
        (v.names === false && !v.labels ? "" : lines(cx, 88, wrap(labels[i], 12), "vz-t vz-sm", 12)));
    });
    return svgOpen(W, H, describeSci.moons(v), Math.min(W, 440)) + s + "</svg>";
  }
  // Moon orbit seen from above: sunlight from the left, 8 numbered positions. Hot keys: "1".."8".
  function moonOrbitSVG(v) {
    const ex = 200, ey = 150, R = 100;
    let s = "";
    for (let k = 0; k < 5; k++) s += arrow(8, 50 + k * 50, 46, 50 + k * 50, "vz-sunray", "vz-sun-fill", 7);
    s += `<text x="16" y="34" class="vz-t vz-sm" text-anchor="start">Sunlight</text>`;
    s += `<circle cx="${ex}" cy="${ey}" r="${R}" class="vz-orbit"/>`;
    s += arrowHead(ex + R * Math.cos(rad(292.5)), ey - R * Math.sin(rad(292.5)), -22.5, "vz-ink-fill", 9);
    s += `<circle cx="${ex}" cy="${ey}" r="20" class="vz-earth"/><path d="M ${ex} ${ey - 20} A 20 20 0 0 1 ${ex} ${ey + 20} Z" class="vz-night"/>`;
    s += txt(ex, ey + 36, "Earth", "vz-t vz-xs");
    for (let i = 0; i < 8; i++) {
      const a = Math.PI + (i * Math.PI) / 4, x = ex + R * Math.cos(a), y = ey - R * Math.sin(a);
      const lx = ex + (R + 26) * Math.cos(a), ly = ey - (R + 26) * Math.sin(a);
      const label = v.labels === false ? "" : String(i + 1);
      s += hot(String(i + 1), circ(x, y, 19),
        `<circle cx="${r1(x)}" cy="${r1(y)}" r="12" class="vz-moon-dark"/><path d="M ${r1(x)} ${r1(y - 12)} A 12 12 0 0 0 ${r1(x)} ${r1(y + 12)} Z" class="vz-moon-lit"/>` +
        (label ? txt(lx, ly + 4, label, "vz-t vz-lbl") : ""));
    }
    return svgOpen(340, 300, describeSci.moonorbit(v), 360) + s + "</svg>";
  }

  // ------------------------------------------------------------ Seasons: Earth at two places in its orbit. Hot keys: the labels.
  function seasonsSVG(v) {
    const labels = v.labels || ["A", "B"];
    let s = `<ellipse cx="180" cy="100" rx="128" ry="34" class="vz-orbit"/>`;
    for (let k = 0; k < 12; k++) {
      const a = (k * Math.PI) / 6;
      s += line(180 + 30 * Math.cos(a), 100 + 30 * Math.sin(a), 180 + 40 * Math.cos(a), 100 + 40 * Math.sin(a), "vz-sunray");
    }
    s += `<circle cx="180" cy="100" r="26" class="vz-sun"/>` + txt(180, 104, "Sun", "vz-t vz-sm");
    const tilt = 23.5, t = (tilt * Math.PI) / 180;
    [[52, labels[0], -1], [308, labels[1], 1]].forEach(([x, label, side]) => {
      const y = 100, r = 26, ax = Math.sin(t), ay = -Math.cos(t);
      // The night half faces away from the Sun.
      const night = side < 0 ? `M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x} ${y + r} Z` : `M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x} ${y + r} Z`;
      s += hot(label, circ(x, y, 44),
        `<circle cx="${x}" cy="${y}" r="${r}" class="vz-earth"/><path d="${night}" class="vz-night"/>` +
        line(x - ax * 40, y - ay * 40, x + ax * 40, y + ay * 40, "vz-axis-line") +
        line(x - Math.cos(t) * r, y - Math.sin(t) * r, x + Math.cos(t) * r, y + Math.sin(t) * r, "vz-equator") +
        txt(x + ax * 50, y + ay * 50 + 4, "N", "vz-t vz-sm") + txt(x - ax * 50, y - ay * 50 + 4, "S", "vz-t vz-sm") +
        txt(x, y + 62, label, "vz-t vz-lbl"));
    });
    return svgOpen(360, 180, describeSci.seasons(v), 380) + s + "</svg>";
  }

  // ------------------------------------------------------------ Tides: water bulges towards (and away from) the Moon. Hot keys: A–D.
  function tidesSVG(v) {
    const cx = 120, cy = 112;
    let s = `<ellipse cx="${cx}" cy="${cy}" rx="78" ry="58" class="vz-water"/><circle cx="${cx}" cy="${cy}" r="50" class="vz-land"/>`;
    s += txt(cx, cy + 4, "Earth", "vz-t vz-sm");
    s += `<circle cx="282" cy="${cy}" r="14" class="vz-moon-lit vz-moon-edge"/>` + txt(282, cy + 32, "Moon", "vz-t vz-xs");
    if (v.labels !== false) {
      [["A", cx, cy - 58, 0, -14], ["B", cx + 78, cy, 14, 4], ["C", cx, cy + 58, 0, 22], ["D", cx - 78, cy, -14, 4]].forEach(([k, x, y, dx, dy]) => {
        s += hot(k, circ(x, y, 16), `<circle cx="${x}" cy="${y}" r="4" class="vz-ink-fill"/>` + txt(x + dx, y + dy, k, "vz-t vz-lbl"));
      });
    }
    return svgOpen(310, 230, describeSci.tides(v), 330) + s + "</svg>";
  }

  // ------------------------------------------------------------ Force arrows on an object.
  function forcesSVG(v) {
    const W = 340, H = 220, cx = 170, cy = 110, bw = 70, bh = 56;
    const arrows = v.arrows || [];
    const big = Math.max(1, ...arrows.map((a) => num(a.size, 1)));
    let s = "";
    if (v.ground && !arrows.some((a) => a.dir === "down")) s += line(20, cy + bh / 2, W - 20, cy + bh / 2, "vz-ground");
    s += `<rect x="${cx - bw / 2}" y="${cy - bh / 2}" width="${bw}" height="${bh}" rx="10" class="vz-objbox"/>`;
    s += v.object && /\p{Extended_Pictographic}/u.test(v.object) ? emo(cx, cy, v.object, 34) : txt(cx, cy + 4, v.object || "", "vz-t");
    arrows.forEach((a, i) => {
      const L = 22 + (num(a.size, 1) / big) * 70;
      const d = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }[a.dir] || [1, 0];
      const sx = cx + d[0] * (bw / 2), sy = cy + d[1] * (bh / 2), ex = sx + d[0] * L, ey = sy + d[1] * L;
      const col = colorOf(a.color, i);
      s += `<g style="--fc:${col}">${arrow(sx, sy, ex, ey, "vz-force", "vz-force-fill", 11)}</g>`;
      if (a.label) {
        const lx = d[0] ? ex + d[0] * 6 : ex + 10, ly = d[1] ? ey + d[1] * 14 + (d[1] < 0 ? 0 : 4) : ey - 10;
        s += txt(d[0] ? (ex + sx) / 2 : lx, d[0] ? ly : ly, a.label, "vz-t vz-sm vz-lbl", d[0] ? "middle" : "start");
      }
    });
    return svgOpen(W, H, describeSci.forces(v), 360) + s + "</svg>";
  }

  // ------------------------------------------------------------ Bar magnets.
  function magnetsSVG(v) {
    const mags = v.magnets || [["N", "S"]];
    const bw = 116, bh = 34, gap = v.gap ?? 54, W = mags.length * bw + (mags.length - 1) * gap + 20, H = v.field ? 170 : 70;
    const y = H / 2 - bh / 2;
    let s = "";
    if (v.field && mags.length === 1) {
      const x0 = 10, x1 = 10 + bw;
      [26, 48, 70].forEach((r, i) => {
        s += `<path d="M ${x0 + 6} ${H / 2} C ${x0 - r} ${H / 2 - r * 1.4}, ${x1 + r} ${H / 2 - r * 1.4}, ${x1 - 6} ${H / 2}" class="vz-fieldline"/>`;
        s += `<path d="M ${x0 + 6} ${H / 2} C ${x0 - r} ${H / 2 + r * 1.4}, ${x1 + r} ${H / 2 + r * 1.4}, ${x1 - 6} ${H / 2}" class="vz-fieldline"/>`;
        if (i === 1) s += arrowHead(10 + bw / 2, H / 2 - r * 1.05, mags[0][0] === "N" ? 0 : 180, "vz-field-fill", 7) + arrowHead(10 + bw / 2, H / 2 + r * 1.05, mags[0][0] === "N" ? 0 : 180, "vz-field-fill", 7);
      });
    }
    mags.forEach((m, i) => {
      const x = 10 + i * (bw + gap);
      m.forEach((pole, k) => {
        const cls = pole === "N" ? "vz-pole-n" : pole === "S" ? "vz-pole-s" : "vz-pole-q";
        s += `<rect x="${x + k * (bw / 2)}" y="${y}" width="${bw / 2}" height="${bh}" class="${cls}"/>` + txt(x + k * (bw / 2) + bw / 4, y + bh / 2 + 6, pole, "vz-t vz-on-color");
      });
      s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3" class="vz-rim"/>`;
    });
    return svgOpen(W, H, describeSci.magnets(v), Math.min(W, 380)) + s + "</svg>";
  }

  // ------------------------------------------------------------ Lever. Hot keys: fulcrum, load, effort.
  function leverSVG(v) {
    const X = (p) => 30 + num(p) * 300, by = 120;
    const f = X(v.fulcrum ?? 0.5), l = X(v.load ?? 0.1), e = X(v.effort ?? 0.9);
    const between = (f - l) * (f - e) < 0; // fulcrum between load and effort → push down to lift
    const name = (k, def) => (v.letters ? v.letters[k] : def);
    let s = `<rect x="22" y="${by - 5}" width="316" height="10" rx="3" class="vz-beam-wood"/>`;
    s += hot("fulcrum", circ(f, by + 26, 26), `<polygon points="${f},${by + 5} ${f - 20},${by + 42} ${f + 20},${by + 42}" class="vz-fulcrum"/>` + txt(f, by + 60, name("fulcrum", v.fulcrumLabel || "Fulcrum"), "vz-t vz-sm vz-lbl"));
    s += line(10, by + 42, 350, by + 42, "vz-ground");
    s += hot("load", box(l - 30, by - 70, 60, 66), (v.object ? emo(l, by - 26, v.object, 34) : `<rect x="${l - 22}" y="${by - 46}" width="44" height="41" rx="4" class="vz-load"/>`) +
      txt(l, by - 54, name("load", v.loadLabel || "Load"), "vz-t vz-sm vz-lbl"));
    const ey1 = between ? by - 78 : by - 8, ey2 = between ? by - 8 : by - 78;
    s += hot("effort", box(e - 26, by - 98, 52, 96), `<g style="--fc:${PALETTE[1]}">${arrow(e, ey1, e, ey2, "vz-force", "vz-force-fill", 11)}</g>` +
      txt(e, by - 86, name("effort", v.effortLabel || "Effort"), "vz-t vz-sm vz-lbl"));
    if (v.dLoad || v.dEffort) {
      const dy = by + 78;
      if (v.dLoad) s += line(f, dy, l, dy, "vz-ink-thin") + line(f, dy - 5, f, dy + 5, "vz-ink-thin") + line(l, dy - 5, l, dy + 5, "vz-ink-thin") + txt((f + l) / 2, dy - 5, v.dLoad, "vz-t vz-sm vz-lbl");
      if (v.dEffort) s += line(f, dy + 18, e, dy + 18, "vz-ink-thin") + line(e, dy + 13, e, dy + 23, "vz-ink-thin") + line(f, dy + 13, f, dy + 23, "vz-ink-thin") + txt((f + e) / 2, dy + 13, v.dEffort, "vz-t vz-sm vz-lbl");
    }
    return svgOpen(360, v.dLoad || v.dEffort ? 230 : 190, describeSci.lever(v), 380) + s + "</svg>";
  }

  // ------------------------------------------------------------ Pulleys: `ropes` supporting ropes.
  function pulleySVG(v) {
    const n = Math.max(1, Math.min(4, Math.round(num(v.ropes, 1))));
    let s = `<rect x="40" y="8" width="200" height="10" class="vz-ceiling"/>`;
    if (n === 1) {
      s += line(140, 18, 140, 40, "vz-ink") + `<circle cx="140" cy="54" r="18" class="vz-wheel"/><circle cx="140" cy="54" r="3" class="vz-ink-fill"/>`;
      s += line(122, 54, 122, 170, "vz-rope") + line(158, 54, 158, 140, "vz-rope");
      s += `<rect x="100" y="170" width="44" height="40" rx="4" class="vz-load"/>` + txt(122, 195, v.load || "Load", "vz-t vz-sm vz-on-color");
      s += `<g style="--fc:${PALETTE[1]}">${arrow(158, 140, 158, 190, "vz-force", "vz-force-fill", 10)}</g>` + txt(170, 186, v.effort || "Effort", "vz-t vz-sm", "start");
    } else {
      const top = 34, bot = 140, x0 = 140 - (n - 1) * 9;
      s += line(140, 18, 140, top - 12, "vz-ink") + `<rect x="${x0 - 20}" y="${top - 12}" width="${(n - 1) * 18 + 40}" height="24" rx="12" class="vz-wheel"/>`;
      s += `<rect x="${x0 - 20}" y="${bot - 12}" width="${(n - 1) * 18 + 40}" height="24" rx="12" class="vz-wheel"/>`;
      for (let i = 0; i < n; i++) s += line(x0 - 6 + i * 18 + (n === 2 ? -6 + i * 12 : 0), top + 12, x0 - 6 + i * 18 + (n === 2 ? -6 + i * 12 : 0), bot - 12, "vz-rope");
      const ex = x0 + (n - 1) * 18 + 30;
      s += line(ex - 10, top, ex, top, "vz-rope") + line(ex, top, ex, 150, "vz-rope");
      s += `<g style="--fc:${PALETTE[1]}">${arrow(ex, 150, ex, 196, "vz-force", "vz-force-fill", 10)}</g>` + txt(ex + 10, 192, v.effort || "Effort", "vz-t vz-sm", "start");
      s += line(140, bot + 12, 140, 166, "vz-ink") + `<rect x="116" y="166" width="48" height="40" rx="4" class="vz-load"/>` + txt(140, 191, v.load || "Load", "vz-t vz-sm vz-on-color");
    }
    return svgOpen(280, 216, describeSci.pulley(v), 300) + s + "</svg>";
  }

  // ------------------------------------------------------------ Lab equipment pictures (each in a 90 × 100 cell). Hot keys: item names.
  const EQUIP_NAMES = {
    beaker: "Beaker", cylinder: "Measuring cylinder", testtube: "Test tube", flask: "Conical flask", bunsen: "Bunsen burner",
    "bunsen-safety": "Bunsen (safety flame)", tripod: "Tripod", gauze: "Gauze mat", funnel: "Filter funnel", basin: "Evaporating basin",
    thermometer: "Thermometer", spatula: "Spatula", dropper: "Dropper", stand: "Retort stand", tongs: "Tongs", balance: "Electronic balance",
    stopwatch: "Stopwatch", glasses: "Safety glasses", holder: "Test-tube holder", rack: "Test-tube rack",
  };
  const EQUIP = {
    beaker: () => `<path d="M24 22 L24 86 Q24 92 30 92 L60 92 Q66 92 66 86 L66 22" class="vz-glass"/><path d="M24 60 L66 60 L66 86 Q66 92 60 92 L30 92 Q24 92 24 86 Z" class="vz-liquid"/><path d="M20 20 L26 24" class="vz-ink"/>${[40, 52, 64, 76].map((y) => line(56, y, 64, y, "vz-ink-thin")).join("")}`,
    cylinder: () => `<path d="M36 10 L36 84 L54 84 L54 10" class="vz-glass"/><path d="M36 46 L54 46 L54 84 L36 84 Z" class="vz-liquid"/><path d="M26 84 L64 84 L64 92 L26 92 Z" class="vz-glass"/>${[18, 28, 38, 48, 58, 68, 78].map((y) => line(48, y, 54, y, "vz-ink-thin")).join("")}`,
    testtube: () => `<path d="M37 8 L37 78 A8 8 0 0 0 53 78 L53 8" class="vz-glass"/><path d="M37 56 L53 56 L53 78 A8 8 0 0 1 37 78 Z" class="vz-liquid"/>`,
    flask: () => `<path d="M38 8 L38 36 L18 86 Q16 92 22 92 L68 92 Q74 92 72 86 L52 36 L52 8" class="vz-glass"/><path d="M28 62 L62 62 L72 86 Q74 92 68 92 L22 92 Q16 92 18 86 Z" class="vz-liquid"/>`,
    bunsen: (o = {}) => `${o.safety ? `<path d="M45 4 Q32 26 40 40 Q45 46 50 40 Q58 26 45 4 Z" class="vz-flame-yellow"/>` : `<path d="M45 14 Q37 30 41 40 Q45 44 49 40 Q53 30 45 14 Z" class="vz-flame-blue"/><path d="M45 26 Q41 34 43 40 L47 40 Q49 34 45 26 Z" class="vz-flame-inner"/>`}<rect x="40" y="42" width="10" height="38" class="vz-metal"/><rect x="38" y="62" width="14" height="7" class="vz-collar"/><path d="M24 80 L66 80 L70 92 L20 92 Z" class="vz-metal"/><line x1="66" y1="86" x2="82" y2="86" class="vz-hose"/>`,
    tripod: () => `<rect x="18" y="30" width="54" height="5" class="vz-metal"/><path d="M24 35 L14 92 M45 35 L45 92 M66 35 L76 92" class="vz-metal-line"/>`,
    gauze: () => `<path d="M10 52 L58 40 L82 56 L34 68 Z" class="vz-gauze"/><path d="M28 56 L56 49 L66 56 L38 63 Z" class="vz-gauze-mid"/>`,
    funnel: () => `<path d="M14 18 L76 18 L50 56 L50 92 L40 92 L40 56 Z" class="vz-glass"/>`,
    basin: () => `<path d="M12 44 L78 44 Q74 76 45 76 Q16 76 12 44 Z" class="vz-porcelain"/><path d="M8 44 L18 44" class="vz-ink"/>`,
    thermometer: () => `<rect x="40" y="6" width="10" height="72" rx="5" class="vz-glass"/><rect x="43" y="34" width="4" height="50" class="vz-red-fill"/><circle cx="45" cy="84" r="8" class="vz-red-fill"/>${[14, 24, 34, 44, 54, 64].map((y) => line(50, y, 56, y, "vz-ink-thin")).join("")}`,
    spatula: () => `<rect x="42" y="10" width="6" height="64" rx="2" class="vz-metal"/><path d="M38 74 L52 74 L50 92 L40 92 Z" class="vz-metal"/><path d="M40 6 L50 6 L48 14 L42 14 Z" class="vz-metal"/>`,
    dropper: () => `<path d="M38 10 Q45 -2 52 10 L52 30 L38 30 Z" class="vz-rubber"/><path d="M40 30 L50 30 L47 86 L43 86 Z" class="vz-glass"/><circle cx="45" cy="92" r="2.5" class="vz-liquid"/>`,
    stand: () => `<rect x="14" y="84" width="60" height="8" class="vz-metal"/><rect x="22" y="6" width="5" height="80" class="vz-metal"/><rect x="25" y="28" width="38" height="5" class="vz-metal"/><path d="M60 22 L72 22 L72 38 L60 38" class="vz-metal-line"/>`,
    tongs: () => `<path d="M30 10 L46 70 L42 92 M60 10 L44 70 L48 92" class="vz-metal-line"/><circle cx="45" cy="64" r="3" class="vz-ink-fill"/>`,
    balance: () => `<rect x="10" y="56" width="70" height="34" rx="5" class="vz-metal"/><rect x="18" y="42" width="54" height="10" rx="3" class="vz-metal"/><rect x="20" y="66" width="50" height="14" rx="2" class="vz-display"/><text x="45" y="77" text-anchor="middle" class="vz-display-t">0.00 g</text>`,
    stopwatch: () => `<circle cx="45" cy="54" r="30" class="vz-porcelain"/><rect x="40" y="14" width="10" height="10" class="vz-metal"/>${line(45, 54, 45, 32, "vz-ink")}${line(45, 54, 60, 60, "vz-ink")}`,
    glasses: () => `<rect x="8" y="40" width="34" height="24" rx="10" class="vz-lens"/><rect x="48" y="40" width="34" height="24" rx="10" class="vz-lens"/><path d="M42 48 L48 48 M8 46 L2 40 M82 46 L88 40" class="vz-ink"/>`,
    holder: () => `<rect x="42" y="30" width="6" height="62" rx="2" class="vz-wood"/><path d="M38 30 L38 10 Q45 4 52 10 L52 30" class="vz-metal-line"/>`,
    rack: () => `<rect x="8" y="48" width="74" height="8" class="vz-wood"/><rect x="8" y="84" width="74" height="8" class="vz-wood"/><path d="M12 56 L12 84 M78 56 L78 84" class="vz-metal-line"/>${[24, 45, 66].map((x) => `<path d="M${x - 6} 22 L${x - 6} 74 A6 6 0 0 0 ${x + 6} 74 L${x + 6} 22" class="vz-glass"/>`).join("")}`,
  };
  EQUIP["bunsen-safety"] = () => EQUIP.bunsen({ safety: true });
  function equipmentSVG(v) {
    const items = v.items || [], C = 96, perRow = Math.min(items.length, v.cols || 4), rows = Math.ceil(items.length / perRow);
    const showNames = v.names !== false, CH = showNames || v.labels ? 132 : 104;
    const W = perRow * C, H = rows * CH;
    let s = "";
    items.forEach((it, i) => {
      const x = (i % perRow) * C, y = Math.floor(i / perRow) * CH;
      const label = v.labels ? v.labels[i] : showNames ? EQUIP_NAMES[it] || cap(it) : "";
      s += hot(it, box(x + 2, y + 2, C - 4, CH - 4), `<g transform="translate(${x + 3} ${y + 4})">${(EQUIP[it] || (() => ""))()}</g>` +
        (label ? (() => { const ls = wrap(label, 13); return lines(x + C / 2, y + 110 + (ls.length - 1) * 6, ls, "vz-t vz-sm", 12); })() : ""));
    });
    return svgOpen(W, H, describeSci.equipment(v), Math.min(W, 420)) + s + "</svg>";
  }

  // ------------------------------------------------------------ Measuring cylinder(s) to read.
  function cylinderSVG(v) {
    const cyls = v.cylinders || [v];
    const CW = 130, W = cyls.length * CW, H = 280;
    let s = "";
    cyls.forEach((c, i) => {
      const max = num(c.max ?? v.max, 100), step = num(c.step ?? v.step, 10), minor = num(c.minor ?? v.minor, step / 5);
      const x0 = i * CW + 44, x1 = x0 + 40, top = 26, base = 236;
      const Y = (val) => base - ((base - top - 10) * val) / max;
      s += `<path d="M${x0} ${top} L${x0} ${base} L${x1} ${base} L${x1} ${top}" class="vz-glass"/><rect x="${x0 - 14}" y="${base}" width="${x1 - x0 + 28}" height="10" rx="2" class="vz-glass"/>`;
      if (c.level !== undefined) {
        const ly = Y(num(c.level));
        s += `<path d="M${x0 + 1} ${r1(ly - 3)} Q${(x0 + x1) / 2} ${r1(ly + 4)} ${x1 - 1} ${r1(ly - 3)} L${x1 - 1} ${base - 1} L${x0 + 1} ${base - 1} Z" class="vz-liquid"/>`;
      }
      if (c.rock) s += `<path d="M${x0 + 8} ${base - 4} Q${x0 + 6} ${base - 20} ${x0 + 18} ${base - 22} Q${x1 - 6} ${base - 24} ${x1 - 8} ${base - 10} Q${x1 - 10} ${base - 2} ${x0 + 8} ${base - 4} Z" class="vz-rock"/>`;
      for (let val = 0; val <= max + 1e-9; val += minor) {
        const major = Math.abs(val / step - Math.round(val / step)) < 1e-6;
        s += line(x0, Y(val), x0 + (major ? 12 : 6), Y(val), "vz-ink-thin");
        if (major && val > 0) s += txt(x0 - 6, Y(val) + 4, String(Math.round(val * 100) / 100), "vz-t vz-xs", "end");
      }
      s += txt((x0 + x1) / 2, 16, c.unit || v.unit || "mL", "vz-t vz-xs");
      if (c.label) s += txt((x0 + x1) / 2, 268, c.label, "vz-t vz-sm");
    });
    return svgOpen(W, H, describeSci.cylinder(v), Math.min(W, 300)) + s + "</svg>";
  }

  // ------------------------------------------------------------ Thermometer to read.
  function thermometerSVG(v) {
    const min = num(v.min, 0), max = num(v.max, 100), step = num(v.step, 10), minor = num(v.minor, step / 5);
    const top = 20, base = 230, x = 60;
    const Y = (t) => base - ((base - top) * (t - min)) / (max - min);
    let s = `<rect x="${x - 7}" y="${top - 10}" width="14" height="${base - top + 22}" rx="7" class="vz-glass"/><circle cx="${x}" cy="${base + 22}" r="13" class="vz-red-fill"/>`;
    s += `<rect x="${x - 3}" y="${r1(Y(num(v.value)))}" width="6" height="${r1(base + 14 - Y(num(v.value)))}" class="vz-red-fill"/>`;
    for (let t = min; t <= max + 1e-9; t += minor) {
      const major = Math.abs((t - min) / step - Math.round((t - min) / step)) < 1e-6;
      s += line(x + 8, Y(t), x + (major ? 20 : 14), Y(t), "vz-ink-thin");
      if (major) s += txt(x + 25, Y(t) + 4, `${t < 0 ? "−" : ""}${Math.abs(t)}`, "vz-t vz-xs", "start");
    }
    s += txt(x + 25, top - 8, v.unit || "°C", "vz-t vz-xs", "start");
    return svgOpen(130, 270, describeSci.thermometer(v), 130) + s + "</svg>";
  }

  // ------------------------------------------------------------ Separating set-ups with labelled parts. Hot keys: part keys.
  const SETUPS = {
    filtration: {
      w: 260, h: 260,
      draw: () => `<rect x="196" y="20" width="6" height="226" class="vz-metal"/><rect x="150" y="70" width="50" height="5" class="vz-metal"/>
        <path d="M70 30 L170 30 L128 96 L128 150 L112 150 L112 96 Z" class="vz-glass"/><path d="M78 34 L162 34 L120 92 Z" class="vz-paper"/>
        <path d="M102 76 Q120 70 138 76 L120 92 Z" class="vz-residue"/>${[0, 1, 2].map((k) => `<circle cx="120" cy="${164 + k * 10}" r="2.6" class="vz-liquid"/>`).join("")}
        <path d="M96 150 L96 168 L74 226 Q72 234 80 234 L160 234 Q168 234 166 226 L144 168 L144 150" class="vz-glass"/><path d="M82 210 L158 210 L166 226 Q168 234 160 234 L80 234 Q72 234 74 226 Z" class="vz-liquid"/>
        <rect x="20" y="246" width="210" height="6" class="vz-metal"/>`,
      parts: { "filter paper": [96, 50, 30, 52], residue: [118, 82, 30, 98], funnel: [150, 42, 236, 30], filtrate: [120, 222, 30, 228], "conical flask": [150, 188, 236, 176] },
    },
    evaporation: {
      w: 260, h: 250,
      draw: () => `${[0, 1, 2].map((k) => `<path d="M${100 + k * 26} 50 q-8 -10 0 -20 q8 -10 0 -20" class="vz-steam"/>`).join("")}
        <path d="M70 62 L190 62 Q184 98 130 98 Q76 98 70 62 Z" class="vz-porcelain"/><path d="M76 72 L184 72 Q176 96 130 96 Q84 96 76 72 Z" class="vz-liquid"/>
        <path d="M52 104 L210 104" class="vz-gauze-line"/><rect x="60" y="106" width="140" height="5" class="vz-metal"/><path d="M68 111 L54 236 M130 111 L130 236 M192 111 L206 236" class="vz-metal-line"/>
        <path d="M130 130 Q120 150 124 166 Q130 172 136 166 Q140 150 130 130 Z" class="vz-flame-blue"/><rect x="124" y="168" width="12" height="52" class="vz-metal"/><path d="M108 220 L152 220 L156 236 L104 236 Z" class="vz-metal"/>`,
      parts: { "evaporating basin": [186, 70, 236, 54], solution: [110, 84, 22, 84], "gauze mat": [64, 104, 22, 120], tripod: [196, 170, 236, 170], "Bunsen burner": [136, 200, 236, 214], steam: [126, 26, 22, 26] },
    },
    distillation: {
      w: 340, h: 250,
      draw: () => `<path d="M60 86 L60 110 A40 40 0 1 0 84 110 L84 86" class="vz-glass"/><path d="M38 148 A36 36 0 0 0 106 148 Z" class="vz-liquid"/><rect x="58" y="74" width="28" height="14" class="vz-cork"/>
        <rect x="69" y="30" width="6" height="74" rx="3" class="vz-glass"/><circle cx="72" cy="104" r="4" class="vz-red-fill"/>
        <path d="M84 92 L276 172" class="vz-glass-thick"/><path d="M110 92 L262 156 L254 176 L102 112 Z" class="vz-condenser"/>
        <path d="M244 160 L250 196" class="vz-water-line"/><path d="M118 104 L112 70" class="vz-water-line"/>
        <path d="M262 176 L262 236 L314 236 L314 176" class="vz-glass"/><path d="M262 214 L314 214 L314 236 L262 236 Z" class="vz-liquid"/>
        <path d="M72 196 Q64 212 68 222 Q72 226 76 222 Q80 212 72 196 Z" class="vz-flame-blue"/><rect x="66" y="224" width="12" height="16" class="vz-metal"/>`,
      parts: { thermometer: [72, 40, 20, 26], "flask (mixture)": [52, 150, 20, 190], condenser: [180, 132, 196, 214], "cold water in": [248, 192, 306, 112], "water out": [114, 76, 186, 40], distillate: [288, 226, 330, 246], heat: [72, 214, 20, 234] },
    },
    chromatography: {
      w: 240, h: 260,
      draw: () => `<rect x="60" y="20" width="120" height="6" rx="3" class="vz-metal"/><rect x="100" y="24" width="40" height="190" class="vz-paper"/>
        <path d="M50 70 L50 236 Q50 244 58 244 L182 244 Q190 244 190 236 L190 70" class="vz-glass"/><path d="M50 216 L190 216 L190 236 Q190 244 182 244 L58 244 Q50 244 50 236 Z" class="vz-liquid"/>
        <line x1="100" y1="196" x2="140" y2="196" class="vz-pencil"/><line x1="100" y1="64" x2="140" y2="64" class="vz-front"/>
        <circle cx="120" cy="96" r="6" style="fill:${PALETTE[0]}"/><circle cx="120" cy="132" r="6" style="fill:${PALETTE[3]}"/><circle cx="120" cy="166" r="6" style="fill:${PALETTE[5]}"/>`,
      parts: { "solvent front": [138, 64, 222, 56], "separated dyes": [126, 120, 222, 116], "pencil start line": [138, 196, 222, 186], solvent: [70, 230, 20, 230], "chromatography paper": [102, 44, 20, 40] },
    },
    sieving: {
      w: 260, h: 220,
      draw: () => `<path d="M50 40 L210 40 Q200 100 130 100 Q60 100 50 40 Z" class="vz-mesh"/>${[[90, 70], [118, 80], [146, 74], [170, 62], [104, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" class="vz-rock"/>`).join("")}
        ${[...Array(14)].map((_, k) => `<circle cx="${100 + (k % 7) * 10}" cy="${120 + Math.floor(k / 7) * 14 + (k % 2) * 4}" r="1.8" class="vz-sand"/>`).join("")}
        <path d="M60 150 L200 150 Q194 206 130 206 Q66 206 60 150 Z" class="vz-porcelain"/><path d="M76 184 Q130 172 184 184 Q170 202 130 202 Q90 202 76 184 Z" class="vz-sand-fill"/>`,
      parts: { sieve: [200, 52, 236, 30], "large particles stay": [146, 74, 236, 100], "small particles fall through": [130, 192, 236, 196] },
    },
    magnet: {
      w: 260, h: 220,
      draw: () => `<path d="M100 20 L100 80 A30 30 0 0 0 160 80 L160 20 L140 20 L140 80 A10 10 0 0 1 120 80 L120 20 Z" class="vz-horseshoe"/><rect x="100" y="20" width="20" height="16" class="vz-pole-n"/><rect x="140" y="20" width="20" height="16" class="vz-pole-s"/>
        ${[...Array(10)].map((_, k) => `<line x1="${112 + (k % 5) * 9}" y1="${118 + Math.floor(k / 5) * 8}" x2="${116 + (k % 5) * 9}" y2="${124 + Math.floor(k / 5) * 8}" class="vz-filing"/>`).join("")}
        <path d="M40 200 Q130 150 220 200 Z" class="vz-sand-fill"/>${[...Array(8)].map((_, k) => `<line x1="${80 + k * 14}" y1="${190 - (k % 3) * 3}" x2="${84 + k * 14}" y2="${195 - (k % 3) * 3}" class="vz-filing"/>`).join("")}`,
      parts: { magnet: [160, 60, 236, 50], "iron filings": [130, 124, 236, 124], sand: [70, 192, 22, 170] },
    },
    decanting: {
      w: 280, h: 220,
      draw: () => `<g transform="rotate(-35 110 110)"><path d="M70 50 L70 150 Q70 158 78 158 L132 158 Q140 158 140 150 L140 50" class="vz-glass"/><path d="M70 136 L140 136 L140 150 Q140 158 132 158 L78 158 Q70 158 70 150 Z" class="vz-residue"/><path d="M70 96 L140 108 L140 136 L70 136 Z" class="vz-liquid"/></g>
        <path d="M168 78 Q178 110 184 140" class="vz-pour"/>
        <path d="M156 130 L156 200 Q156 208 164 208 L232 208 Q240 208 240 200 L240 130" class="vz-glass"/><path d="M156 180 L240 180 L240 200 Q240 208 232 208 L164 208 Q156 208 156 200 Z" class="vz-liquid"/>`,
      parts: { sediment: [80, 166, 22, 196], "liquid poured off": [198, 194, 262, 120] },
    },
    centrifuge: {
      w: 300, h: 200,
      draw: () => `<circle cx="90" cy="100" r="66" class="vz-metal-soft"/><circle cx="90" cy="100" r="8" class="vz-ink-fill"/>
        ${[0, 90, 180, 270].map((a) => `<g transform="rotate(${a} 90 100)"><rect x="84" y="42" width="12" height="40" rx="6" class="vz-glass"/></g>`).join("")}
        <path d="M150 60 A70 70 0 0 1 160 110" class="vz-ink"/>${arrowHead(160, 110, 100, "vz-ink-fill", 8)}
        <path d="M222 30 L222 150 A14 14 0 0 0 250 150 L250 30" class="vz-glass"/><path d="M222 60 L250 60 L250 132 L222 132 Z" class="vz-liquid"/><path d="M222 132 L250 132 L250 150 A14 14 0 0 1 222 150 Z" class="vz-residue"/>`,
      parts: { "lighter liquid on top": [250, 90, 290, 60], "heavier solid at the bottom": [236, 150, 290, 186] },
    },
  };
  function setupSVG(v) {
    const S = SETUPS[v.kind] || SETUPS.filtration, mode = v.labels || "names";
    let s = S.draw();
    Object.entries(S.parts).forEach(([key, [ax, ay, lx, ly]], i) => {
      const lab = mode === "letters" ? LETTERS[i] : mode === "none" ? "" : cap(key);
      const left = lx < ax;
      s += hot(key, circ(ax, ay, 15), (mode === "none" ? `<circle cx="${ax}" cy="${ay}" r="4" class="vz-hot-dot"/>` :
        line(ax, ay, lx, ly - 4, "vz-leader") + `<circle cx="${ax}" cy="${ay}" r="2.5" class="vz-ink-fill"/>` +
        (mode === "letters" ? `<circle cx="${lx}" cy="${ly - 4}" r="10" class="vz-letter-bg"/>` + txt(lx, ly, lab, "vz-t vz-sm") :
          lines(lx + (left ? -2 : 2), ly - 4, wrap(lab, 12), "vz-t vz-sm vz-halo-t", 12).replace(/text-anchor="middle"/g, `text-anchor="${left ? "end" : "start"}"`))));
    });
    return svgOpen(S.w + 120, S.h, describeSci.setup(v), S.w + 120) + `<g transform="translate(60 0)">${s}</g></svg>`;
  }

  // ------------------------------------------------------------ Paper chromatogram. Hot keys: sample labels.
  function chromaSVG(v) {
    const samples = v.samples || [], n = samples.length, C = 66, W = n * C + 40, top = 18, start = 190, front = num(v.front, 0.9);
    const Y = (f) => start - f * (start - top - 6);
    let s = `<rect x="14" y="${top - 8}" width="${W - 28}" height="${start + 18 - top}" rx="4" class="vz-paper"/>`;
    s += line(18, Y(front), W - 18, Y(front), "vz-front") + txt(W - 18, Y(front) - 4, "solvent front", "vz-t vz-xs", "end");
    s += line(18, start, W - 18, start, "vz-pencil") + txt(W - 18, start + 14, "start line", "vz-t vz-xs", "end");
    samples.forEach((sm, i) => {
      const x = 20 + i * C + C / 2;
      s += hot(sm.label, box(x - 28, top - 6, 56, start + 44 - top), `<circle cx="${x}" cy="${start}" r="5" class="vz-start-spot"/>` +
        (sm.dots || []).map((d) => `<ellipse cx="${x}" cy="${r1(Y(num(d.h)))}" rx="9" ry="7" style="fill:${colorOf(d.c)}" class="vz-dye"/>`).join("") +
        txt(x, start + 30, sm.label, "vz-t vz-sm"));
    });
    return svgOpen(W, start + 40, describeSci.chroma(v), Math.min(W, 400)) + s + "</svg>";
  }

  // ------------------------------------------------------------ Layers (density column or soil profile). Hot keys: layer labels.
  function layersSVG(v) {
    const L = v.layers || [], ground = v.kind === "ground";
    const W = 330, H = 240, x0 = ground ? 20 : 90, x1 = ground ? 210 : 170, top = ground ? 30 : 40, bottom = 222;
    const lh = (bottom - top) / Math.max(1, L.length);
    let s = ground ? `<path d="M${x0} ${top} ${[...Array(19)].map((_, k) => `L${x0 + 5 + k * 10} ${top - 10 - (k % 2) * 4} L${x0 + 10 + k * 10} ${top}`).join(" ")}" class="vz-grass"/>` : "";
    L.forEach((ly, i) => {
      const y = bottom - (i + 1) * lh;
      const fill = colorOf(ly.c, i);
      s += hot(ly.label, `<rect x="${x0 - 4}" y="${r1(y)}" width="${x1 - x0 + 120}" height="${r1(lh)}"/>`,
        `<rect x="${x0}" y="${r1(y)}" width="${x1 - x0}" height="${r1(lh)}" style="fill:${fill}" class="vz-layer"/>` +
        (ground && ly.rocks ? [...Array(ly.rocks)].map((_, k) => `<ellipse cx="${x0 + 20 + ((k * 47) % (x1 - x0 - 40))}" cy="${r1(y + lh * (0.3 + (k % 3) * 0.2))}" rx="${6 + (k % 3) * 3}" ry="5" class="vz-rock"/>`).join("") : "") +
        line(x1, y + lh / 2, x1 + 14, y + lh / 2, "vz-leader") + txt(x1 + 18, y + lh / 2 + 4, ly.label, "vz-t vz-sm", "start"));
    });
    (v.objects || []).forEach((o, k) => {
      const y = o.sink ? bottom - num(o.at) * lh - 12 : bottom - (num(o.at) + 1) * lh + 10;
      s += emo(x0 + 22 + k * 24, y, o.e || "⚫", 18);
    });
    if (!ground) s += `<path d="M${x0} ${top - 18} L${x0} ${bottom} Q${x0} ${bottom + 6} ${x0 + 6} ${bottom + 6} L${x1 - 6} ${bottom + 6} Q${x1} ${bottom + 6} ${x1} ${bottom} L${x1} ${top - 18}" class="vz-glass"/>`;
    return svgOpen(W, H, describeSci.layers(v), 360) + s + "</svg>";
  }

  // ------------------------------------------------------------ Dichotomous key as a tree. Hot keys: the leaf names.
  function keySVG(v) {
    const leaves = (t) => (typeof t === "string" ? 1 : leaves(t.yes) + leaves(t.no));
    const depth = (t) => (typeof t === "string" ? 0 : 1 + Math.max(depth(t.yes), depth(t.no)));
    const LW = 118, LV = 92, n = leaves(v.tree), D = depth(v.tree), W = n * LW, H = D * LV + 70;
    let s = "", nodes = "";
    const place = (t, x0, lvl) => {
      const w = leaves(t) * LW, cx = x0 + w / 2, cy = 30 + lvl * LV;
      if (typeof t === "string") {
        const [e, ...rest] = /^\p{Extended_Pictographic}/u.test(t) ? t.split(" ") : ["", t];
        const name = e ? rest.join(" ") : t;
        nodes += hot(t, box(cx - 55, cy - 27, 110, 58, 12), `<rect x="${cx - 51}" y="${cy - 23}" width="102" height="50" rx="10" class="vz-leaf"/>` +
          (e ? emo(cx, cy - 6, e, 20) + txt(cx, cy + 18, name, "vz-t vz-sm") : lines(cx, cy + 4, wrap(name, 12), "vz-t vz-sm", 12)));
        return [cx, cy];
      }
      const lw = leaves(t.yes) * LW;
      const [yx, yy] = place(t.yes, x0, lvl + 1), [nx, ny] = place(t.no, x0 + lw, lvl + 1);
      s += line(cx, cy + 20, yx, yy - 22, "vz-ink-thin") + line(cx, cy + 20, nx, ny - 22, "vz-ink-thin");
      s += txt((cx + yx) / 2 - 8, (cy + yy) / 2 + 2, "Yes", "vz-t vz-xs vz-lbl") + txt((cx + nx) / 2 + 8, (cy + ny) / 2 + 2, "No", "vz-t vz-xs vz-lbl");
      const ql = wrap(t.q, Math.max(14, Math.round((w - 20) / 6.6)));
      const bw = Math.min(w - 8, Math.max(...ql.map((l) => l.length)) * 6.6 + 22);
      nodes += `<rect x="${r1(cx - bw / 2)}" y="${cy - 21}" width="${r1(bw)}" height="42" rx="8" class="vz-node"/>` + lines(cx, cy + 4, ql.slice(0, 2), "vz-t vz-sm", 13);
      return [cx, cy];
    };
    place(v.tree, 0, 0);
    return svgOpen(W, H, describeSci.key(v), Math.min(W, 460)) + s + nodes + "</svg>";
  }

  // ------------------------------------------------------------ Picture cards (emoji). Hot keys: the labels.
  function picsSVG(v) {
    const items = v.items || [], perRow = Math.min(items.length, v.cols || 5), C = 84, CH = 96;
    const W = perRow * C, H = Math.ceil(items.length / perRow) * CH;
    let s = "";
    items.forEach((it, i) => {
      const x = (i % perRow) * C, y = Math.floor(i / perRow) * CH;
      s += hot(it.label, box(x + 3, y + 3, C - 6, CH - 6, 12), `<rect x="${x + 5}" y="${y + 5}" width="${C - 10}" height="${CH - 10}" rx="10" class="vz-card"/>` +
        emo(x + C / 2, y + 38, it.e, 36) + lines(x + C / 2, y + 76, wrap(it.label, 11), "vz-t vz-sm", 12));
    });
    return svgOpen(W, H, describeSci.pics(v), Math.min(W, 440)) + s + "</svg>";
  }

  // ------------------------------------------------------------ Energy pyramid. Hot keys: level labels.
  function pyramidSVG(v) {
    const L = v.levels || [], n = L.length, W = 340, H = 40 + n * 42, base = 300, cx = 170;
    let s = "";
    L.forEach((lv, i) => {
      const y = H - 10 - (i + 1) * 42, wB = base * (1 - i / (n + 0.4)), wT = base * (1 - (i + 1) / (n + 0.4));
      s += hot(lv.label, `<rect x="${cx - wB / 2}" y="${y}" width="${wB}" height="42"/>`,
        `<polygon points="${r1(cx - wB / 2)},${y + 42} ${r1(cx + wB / 2)},${y + 42} ${r1(cx + wT / 2)},${y} ${r1(cx - wT / 2)},${y}" style="fill:${colorOf(lv.c, [2, 5, 1, 3, 4][i] ?? i)}" class="vz-layer"/>` +
        txt(cx, y + 20, lv.label, "vz-t vz-sm vz-on-color") + (lv.value ? txt(cx, y + 34, lv.value, "vz-t vz-xs vz-on-color") : ""));
    });
    return svgOpen(W, H, describeSci.pyramid(v), 360) + s + "</svg>";
  }

  // ------------------------------------------------------------ Food web. Levels from the bottom (producers) up. Hot keys: names.
  function foodwebSVG(v) {
    const levels = v.levels || [], emoji = v.emoji || {};
    const W = 360, LV = 84, H = levels.length * LV + 10;
    const pos = {};
    levels.forEach((row, i) => row.forEach((name, k) => { pos[name] = [W * (k + 0.5) / row.length, H - 44 - i * LV]; }));
    let s = "";
    (v.links || []).forEach(([a, b]) => {
      if (!pos[a] || !pos[b]) return;
      const [x1, y1] = pos[a], [x2, y2] = pos[b], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
      const cut = (ux, uy) => Math.min(Math.abs(36 / (ux || 1e-9)), Math.abs(26 / (uy || 1e-9)));
      const c1 = cut(dx / len, dy / len) + 2, c2 = c1 + 4;
      s += arrow(x1 + (dx / len) * c1, y1 + (dy / len) * c1, x2 - (dx / len) * c2, y2 - (dy / len) * c2, "vz-web", "vz-web-fill", 7);
    });
    Object.entries(pos).forEach(([name, [x, y]]) => {
      const e = emoji[name];
      s += hot(name, box(x - 40, y - 28, 80, 56, 12), `<rect x="${x - 36}" y="${y - 24}" width="72" height="48" rx="10" class="vz-card"/>` +
        (e ? emo(x, y - 7, e, 20) + lines(x, y + 15, wrap(name, 11), "vz-t vz-sm", 10) : lines(x, y + 4, wrap(name, 10), "vz-t vz-sm", 12)));
    });
    return svgOpen(W, H, describeSci.foodweb(v), 400) + s + "</svg>";
  }

  // ------------------------------------------------------------ Line graph from points.
  function linegraphSVG(v) {
    const pts = (v.points || []).map((p) => [num(p[0]), num(p[1])]);
    const xmin = num(v.xmin, 0), xmax = num(v.xmax, Math.max(...pts.map((p) => p[0]))), ymin = num(v.ymin, Math.min(0, ...pts.map((p) => p[1]))), ymax = num(v.ymax, Math.max(...pts.map((p) => p[1])));
    const xstep = num(v.xstep, (xmax - xmin) / 5), ystep = num(v.ystep, (ymax - ymin) / 5);
    const W = 360, H = 250, L = 48, R = 12, T = v.title ? 30 : 14, B = 206;
    const X = (x) => L + ((W - L - R) * (x - xmin)) / (xmax - xmin), Y = (y) => B - ((B - T) * (y - ymin)) / (ymax - ymin);
    let s = v.title ? txt(W / 2, 18, v.title, "vz-t vz-title") : "";
    for (let y = ymin; y <= ymax + 1e-9; y += ystep) s += line(L, Y(y), W - R, Y(y), "vz-grid") + txt(L - 6, Y(y) + 4, `${y < 0 ? "−" : ""}${Math.abs(Math.round(y * 100) / 100)}`, "vz-t vz-xs", "end");
    for (let x = xmin; x <= xmax + 1e-9; x += xstep) s += line(X(x), T, X(x), B, "vz-grid") + txt(X(x), B + 14, String(Math.round(x * 100) / 100), "vz-t vz-xs");
    s += line(L, T - 4, L, B, "vz-axis") + line(L, Y(Math.max(ymin, Math.min(0, ymax))), W - R, Y(Math.max(ymin, Math.min(0, ymax))), "vz-axis");
    s += `<polyline points="${pts.map((p) => `${r1(X(p[0]))},${r1(Y(p[1]))}`).join(" ")}" class="vz-line"/>`;
    s += pts.map((p) => `<circle cx="${r1(X(p[0]))}" cy="${r1(Y(p[1]))}" r="3.5" class="vz-dot"/>`).join("");
    (v.notes || []).forEach((n) => { s += txt(X(num(n.x)), Y(num(n.y)) - 9, n.text, "vz-t vz-xs vz-lbl"); });
    if (v.yLabel) s += `<text x="12" y="${(T + B) / 2}" class="vz-t vz-sm" text-anchor="middle" transform="rotate(-90 12 ${(T + B) / 2})">${h(v.yLabel)}</text>`;
    if (v.xLabel) s += txt((L + W) / 2, B + 34, v.xLabel, "vz-t vz-sm");
    return svgOpen(W, H, describeSci.linegraph(v), W) + s + "</svg>";
  }

  // ------------------------------------------------------------ Descriptions (for screen readers and the AI tutor).
  const list = (a) => (a || []).join(", ");
  const describeSci = {
    particles: (v) => `Particle diagrams of: ${list((v.labels || v.states || []).map((l, i) => `${l}${v.labels ? ` (${(v.states || [])[i]})` : ""}`))}`,
    statechange: (v) => `Diagram of changes of state between solid, liquid and gas: ${list(v.show || ["melting", "freezing", "evaporating", "condensing"])}`,
    moons: (v) => `Pictures of the Moon: ${list((v.phases || []).map((p, i) => `${v.labels?.[i] || ""} ${p}`.trim()))}`,
    moonorbit: () => "The Moon's orbit around Earth seen from above, with sunlight from the left and 8 numbered Moon positions (1 between Earth and the Sun, 5 on the far side)",
    seasons: (v) => `Earth at two places in its orbit around the Sun with its axis tilted: ${(v.labels || ["A", "B"])[0]} on the left (south pole tilted away from the Sun), ${(v.labels || ["A", "B"])[1]} on the right (south pole tilted towards the Sun)`,
    tides: () => "Earth with its oceans bulging towards and away from the Moon (on the right); points A (top), B (right), C (bottom), D (left)",
    forces: (v) => `Force diagram of ${v.object || "an object"}: ${list((v.arrows || []).map((a) => `${a.label || a.size} ${a.dir}`))}`,
    magnets: (v) => `Bar magnets: ${list((v.magnets || []).map((m) => m.join("–")))}`,
    lever: (v) => `A lever with the load at ${Math.round(num(v.load ?? 0.1) * 100)}%, fulcrum at ${Math.round(num(v.fulcrum ?? 0.5) * 100)}% and effort at ${Math.round(num(v.effort ?? 0.9) * 100)}% along the beam`,
    pulley: (v) => `A pulley system with ${v.ropes || 1} supporting rope${(v.ropes || 1) > 1 ? "s" : ""}`,
    equipment: (v) => `Lab equipment pictures${v.names === false ? "" : `: ${list((v.items || []).map((i) => EQUIP_NAMES[i] || i))}`}`,
    cylinder: (v) => `Measuring cylinder${v.cylinders ? "s" : ""} showing ${list((v.cylinders || [v]).map((c) => `${c.level} ${c.unit || v.unit || "mL"}${c.rock ? " with a rock" : ""}`))}`,
    thermometer: (v) => `A thermometer reading ${v.value} ${v.unit || "°C"}`,
    setup: (v) => `Equipment set up for ${v.kind}${v.labels === "names" || !v.labels ? `, labelled: ${list(Object.keys((SETUPS[v.kind] || SETUPS.filtration).parts))}` : ""}`,
    chroma: (v) => `Chromatogram: ${list((v.samples || []).map((s) => `${s.label} (${(s.dots || []).map((d) => `${d.c} at ${d.h}`).join(" & ")})`))}`,
    layers: (v) => `${v.kind === "ground" ? "Soil profile" : "Column of layers"} from bottom to top: ${list((v.layers || []).map((l) => l.label))}`,
    key: (v) => { const f = (t) => (typeof t === "string" ? t : `[${t.q} Yes → ${f(t.yes)}; No → ${f(t.no)}]`); return `Dichotomous key: ${f(v.tree)}`; },
    pics: (v) => `Pictures: ${list((v.items || []).map((i) => `${i.label} ${i.e}`))}`,
    pyramid: (v) => `Energy pyramid from the bottom: ${list((v.levels || []).map((l) => `${l.label}${l.value ? ` ${l.value}` : ""}`))}`,
    foodweb: (v) => `Food web (arrows point from food to eater): ${list((v.links || []).map((l) => `${l[0]} → ${l[1]}`))}`,
    linegraph: (v) => `Line graph${v.title ? ` "${v.title}"` : ""}: ${list((v.points || []).map((p) => `(${p[0]}, ${p[1]})`))}`,
    tapfig: (v) => `Tap a part of this picture: ${(describeSci[v.on?.type] || (() => ""))(v.on || {})}`,
    sort: (v) => `Sort into ${list(v.cats)}: ${list((v.items || []).map((i) => i[0]))}`,
  };

  // ------------------------------------------------------------ Widgets
  const targetsOf = (v) => [].concat(v.target).map(String);
  const tapfig = {
    html(v) {
      const draw = DIAGRAMS_LOCAL[v.on?.type];
      const n = targetsOf(v).length;
      return `${draw ? draw(v.on) : ""}<p class="vz-hint">${n > 1 ? `Tap ${n} parts of the picture.` : "Tap the right part of the picture."}</p>`;
    },
    draw(el, v, on, result) {
      const want = new Set(targetsOf(v));
      all(el, ".vz-hs").forEach((g) => {
        const k = g.dataset.hot;
        g.classList.toggle("on", on.has(k));
        if (result) {
          g.classList.toggle("ok", want.has(k) && on.has(k));
          g.classList.toggle("bad", on.has(k) && !want.has(k));
          g.classList.toggle("missed", want.has(k) && !on.has(k));
        }
      });
    },
    wire(el, q, set) {
      const v = q.visual, on = new Set(), n = targetsOf(v).length;
      el.addEventListener("click", (e) => {
        const g = e.target.closest(".vz-hs");
        if (!g || el.dataset.locked) return;
        const k = g.dataset.hot;
        if (on.has(k)) on.delete(k);
        else { if (n === 1) on.clear(); on.add(k); }
        tapfig.draw(el, v, on);
        set(on.size ? [...on].sort().join("|") : "");
      });
    },
    result(el, q, raw) { tapfig.draw(el, q.visual, new Set(String(raw || "").split("|").filter(Boolean)), true); },
    correct: (v, raw) => raw.split("|").filter(Boolean).sort().join("|") === targetsOf(v).sort().join("|"),
    answer: (v) => v.answerText || targetsOf(v).map(cap).join(", "),
    yours: (v, raw) => raw.split("|").filter(Boolean).map(cap).join(", "),
  };
  const sort = {
    html(v) {
      const order = shuffled([...v.items.keys()]);
      return `<div class="vz-sort">${order.map((i) => `<div class="vz-sort-row" data-i="${i}"><span class="vz-sort-item">${h(v.items[i][0])}</span>
        <span class="vz-seg">${v.cats.map((c, k) => `<button type="button" class="vz-sortbtn" data-k="${k}">${h(c)}</button>`).join("")}</span></div>`).join("")}</div>
        <p class="vz-hint">Choose a group for each one.</p>`;
    },
    draw(el, v, state, result) {
      all(el, ".vz-sort-row").forEach((row) => {
        const i = +row.dataset.i, want = v.items[i][1];
        all(row, ".vz-sortbtn").forEach((b) => {
          const k = +b.dataset.k;
          b.classList.toggle("on", state[i] === k);
          if (result) { b.classList.toggle("ok", k === want && state[i] === k); b.classList.toggle("bad", state[i] === k && k !== want); b.classList.toggle("missed", k === want && state[i] !== k); }
        });
      });
    },
    wire(el, q, set) {
      const v = q.visual, state = [];
      el.addEventListener("click", (e) => {
        const b = e.target.closest(".vz-sortbtn");
        if (!b || el.dataset.locked) return;
        state[+b.closest(".vz-sort-row").dataset.i] = +b.dataset.k;
        sort.draw(el, v, state);
        const done = v.items.every((_, i) => state[i] !== undefined);
        set(done ? v.items.map((_, i) => state[i]).join(",") : "partial");
      });
    },
    result(el, q, raw) {
      const state = raw === "partial" ? [] : String(raw || "").split(",").map((x) => (x === "" ? undefined : +x));
      sort.draw(el, q.visual, state, true);
    },
    correct: (v, raw) => raw === v.items.map((it) => it[1]).join(","),
    answer: (v) => v.cats.map((c, k) => `${c}: ${v.items.filter((it) => it[1] === k).map((it) => it[0]).join(", ")}`).join(" · "),
    yours: (v, raw) => (raw === "partial" ? "(not finished)" : "your sorting"),
  };

  const DIAGRAMS_LOCAL = {
    particles: particlesSVG, statechange: stateChangeSVG, moons: moonsSVG, moonorbit: moonOrbitSVG, seasons: seasonsSVG, tides: tidesSVG,
    forces: forcesSVG, magnets: magnetsSVG, lever: leverSVG, pulley: pulleySVG, equipment: equipmentSVG, cylinder: cylinderSVG,
    thermometer: thermometerSVG, setup: setupSVG, chroma: chromaSVG, layers: layersSVG, key: keySVG, pics: picsSVG,
    pyramid: pyramidSVG, foodweb: foodwebSVG, linegraph: linegraphSVG,
  };
  registerVisuals({ diagrams: DIAGRAMS_LOCAL, describe: describeSci, inputs: { tapfig, sort } });
  window.SCI_SETUP_PARTS = Object.fromEntries(Object.entries(SETUPS).map(([k, s]) => [k, Object.keys(s.parts)]));
})();
