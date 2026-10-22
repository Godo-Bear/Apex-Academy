/* =========================================================
   JINtelligence — character art for the Boss battle (hand-drawn SVG, shaded).
   The hero faces right; bosses face left. Parts with class "arm" swing
   when throwing, "eyes" blink, "smoke" puffs and "bot-light" flashes.
========================================================= */

(() => {
  const f = (n) => n.toFixed(1);
  // Small repeatable "random" numbers, so the fur and scales look the same every time.
  const rand = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // A soft, tufty blob (fur): points round an ellipse, bulging out between them.
  function furBlob(cx, cy, rx, ry, n, jag, rot = 0) {
    let d = "";
    const r = (rot * Math.PI) / 180;
    const pt = (a, k) => {
      const x = Math.cos(a) * (rx + k), y = Math.sin(a) * (ry + k);
      return [cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)];
    };
    for (let i = 0; i <= n; i++) {
      const [x, y] = pt((i / n) * Math.PI * 2, 0);
      const [qx, qy] = pt(((i - 0.5) / n) * Math.PI * 2, jag);
      d += i === 0 ? `M${f(x)} ${f(y)}` : ` Q${f(qx)} ${f(qy)} ${f(x)} ${f(y)}`;
    }
    return d + " Z";
  }
  // Short curved strokes for fur texture inside an ellipse.
  function furStrokes(cx, cy, rx, ry, count, seed, color) {
    const R = rand(seed);
    let s = "";
    for (let i = 0; i < count; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 0.85;
      const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
      s += `<path d="M${f(x)} ${f(y)} q${f(-3 + R() * 2)} ${f(4 + R() * 3)} ${f(-1 + R() * 2)} ${f(8 + R() * 3)}"/>`;
    }
    return `<g fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round" opacity=".8">${s}</g>`;
  }
  // Rows of little scale arcs.
  function scales(x0, y0, cols, rows, size, color) {
    let s = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = x0 + c * size + (r % 2) * size / 2, y = y0 + r * size * 0.7;
      s += `<path d="M${f(x)} ${f(y)} q${f(size / 2)} ${f(size * 0.6)} ${f(size)} 0"/>`;
    }
    return `<g fill="none" stroke="${color}" stroke-width="1" opacity=".55">${s}</g>`;
  }
  const star = (cx, cy, r, fill) => {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
      d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
    }
    return `<path d="${d}Z" fill="${fill}" stroke="#B07A12" stroke-width=".6"/>`;
  };

  // ---------------- The hero (a student in a JIN hoodie, cape and headband) ----------------
  const PLAYER = `
<svg viewBox="0 0 100 160" aria-hidden="true">
  <defs>
    <linearGradient id="p-hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B82D55"/><stop offset=".6" stop-color="#8A1C3C"/><stop offset="1" stop-color="#5E1129"/></linearGradient>
    <linearGradient id="p-jeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#45577D"/><stop offset="1" stop-color="#222C44"/></linearGradient>
    <radialGradient id="p-skin" cx=".62" cy=".38" r=".75"><stop offset="0" stop-color="#FAD9B8"/><stop offset="1" stop-color="#D49A72"/></radialGradient>
    <linearGradient id="p-cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8D06A"/><stop offset="1" stop-color="#B9800F"/></linearGradient>
    <linearGradient id="p-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A3E2E"/><stop offset="1" stop-color="#1E140D"/></linearGradient>
  </defs>
  <ellipse cx="52" cy="155" rx="30" ry="4.5" fill="rgba(0,0,0,.22)"/>
  <path d="M38 52 Q20 92 15 138 Q28 129 38 136 Q41 112 50 96 Z" fill="url(#p-cape)" stroke="#8C5F0C" stroke-width="1"/>
  <path d="M30 100 Q27 118 26 132" stroke="#C99419" stroke-width="1.2" fill="none" opacity=".7"/>
  <path d="M41 96 L37 144 L48 144 L51 104 Z" fill="url(#p-jeans)" stroke="#151C2E" stroke-width="1"/>
  <path d="M33 144 Q33 139 39 139 L48 139 Q53 141 54 146 L54 149 L33 149 Z" fill="#F6F6F8" stroke="#8E949E" stroke-width="1"/>
  <path d="M33 147.5 h21 v2 h-21 z" fill="#8A1C3C"/>
  <path d="M52 98 L58 144 L69 144 L63 96 Z" fill="url(#p-jeans)" stroke="#151C2E" stroke-width="1"/>
  <path d="M60 120 l2 10" stroke="#5E709A" stroke-width="1" opacity=".6"/>
  <path d="M55 144 Q55 139 61 139 L71 139 Q76 141 77 146 L77 149 L55 149 Z" fill="#F6F6F8" stroke="#8E949E" stroke-width="1"/>
  <path d="M55 147.5 h22 v2 h-22 z" fill="#8A1C3C"/>
  <path d="M38 56 Q29 72 31 92 L39 93 Q40 76 45 64 Z" fill="#651331" stroke="#3E0A1B" stroke-width="1"/>
  <ellipse cx="35" cy="95.5" rx="4.6" ry="5" fill="url(#p-skin)" stroke="#B57C5A" stroke-width=".7"/>
  <path d="M37 54 Q51 46 65 53 Q69 74 67 100 Q52 104 37 100 Q35 76 37 54 Z" fill="url(#p-hood)" stroke="#3E0A1B" stroke-width="1.2"/>
  <path d="M44 60 Q42 78 44 96" stroke="#5E1129" stroke-width="1" fill="none" opacity=".6"/>
  <path d="M40 52 Q51 43 63 51 Q57 58 51 58 Q45 58 40 52 Z" fill="#651331"/>
  <path d="M42 84 Q52 81 62 84 L61 94 Q52 96 43 94 Z" fill="#761734" stroke="#3E0A1B" stroke-width=".8"/>
  <path d="M47 56 Q46 62 47 68 M56 56 Q57 61 56 67" stroke="#F2BE48" stroke-width="1.4" stroke-linecap="round" fill="none"/>
  ${star(52, 73, 5.5, "#F2BE48")}
  <path d="M37 98 Q52 102 67 98 L67 101.5 Q52 105.5 37 101.5 Z" fill="#4E0D22"/>
  <path d="M49 44 h9 v9 h-9 z" fill="#C98D66"/>
  <path d="M40 30 Q40 12 56 11 Q70 11 71 27 Q72 36 69 42 Q65 50 56 50 Q46 50 42 42 Q40 37 40 30 Z" fill="url(#p-skin)" stroke="#B57C5A" stroke-width="1"/>
  <ellipse cx="44" cy="32" rx="3.2" ry="4.5" fill="#E7B18A" stroke="#B57C5A" stroke-width=".8"/>
  <path d="M43.5 30.5 q1.5 1.5 0 3" stroke="#B57C5A" stroke-width=".8" fill="none"/>
  <path d="M39 30 Q36 12 53 8 Q67 5 73 18 Q75 24 71 29 Q66 20 58 21 Q52 15 47 22 Q45 26 46 31 Q42 28 39 30 Z" fill="url(#p-hair)"/>
  <path d="M49 11 Q56 8 63 12 M44 17 Q49 12 56 13 M60 15 Q66 15 70 20" stroke="#7A5641" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M41 24 Q56 18 71.5 23 L71.5 27.5 Q56 22.5 41 29 Z" fill="#F2BE48" stroke="#B9800F" stroke-width=".7"/>
  <path d="M42 26 Q29 20 21 27 Q30 28 32 33 Q37 28 43 29 Z" fill="#E9AF33" stroke="#B9800F" stroke-width=".6"/>
  <path d="M56 28 Q60 25.6 63.4 27.4 M66 27.4 Q68.6 26.4 70.4 27.6" stroke="#2B1D16" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <g class="eyes" style="transform-origin: 64px 32px">
    <ellipse cx="60.2" cy="32.2" rx="2.7" ry="3.1" fill="#fff"/><circle cx="61.2" cy="32.5" r="1.8" fill="#4A3020"/><circle cx="61.2" cy="32.5" r=".9" fill="#120B07"/><circle cx="61.8" cy="31.6" r=".6" fill="#fff"/>
    <ellipse cx="68.2" cy="32.2" rx="2.1" ry="2.9" fill="#fff"/><circle cx="68.9" cy="32.5" r="1.5" fill="#4A3020"/><circle cx="68.9" cy="32.5" r=".75" fill="#120B07"/><circle cx="69.4" cy="31.7" r=".5" fill="#fff"/>
  </g>
  <path d="M66.5 34 Q70 38.2 66.6 39.6" stroke="#B57C5A" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M58 43 Q63 46.5 67.5 42.6" stroke="#8A3B2E" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="56.5" cy="39" rx="3.2" ry="1.9" fill="#F29B8F" opacity=".35"/>
  <g class="arm" style="transform-origin: 62px 58px">
    <path d="M58 55 Q69 58 71 74 Q72 84 69 92 L62.5 91 Q63.5 80 60.5 70 Z" fill="url(#p-hood)" stroke="#3E0A1B" stroke-width="1"/>
    <path d="M62 89 L70 91 L69 94.5 L61.5 92.5 Z" fill="#4E0D22"/>
    <ellipse cx="66" cy="97.5" rx="4.7" ry="5.3" fill="url(#p-skin)" stroke="#B57C5A" stroke-width=".8"/>
    <path d="M63.5 96 q2 -1 4 0" stroke="#B57C5A" stroke-width=".7" fill="none"/>
  </g>
</svg>`;

  // ---------------- Frost Yeti ----------------
  const YETI = `
<svg viewBox="0 0 180 200" aria-hidden="true">
  <defs>
    <radialGradient id="y-fur" cx=".42" cy=".32" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E3EEF5"/><stop offset="1" stop-color="#A9C2D4"/></radialGradient>
    <radialGradient id="y-face" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#B4E2F8"/><stop offset="1" stop-color="#3F86BA"/></radialGradient>
    <linearGradient id="y-horn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#C2AE80"/><stop offset="1" stop-color="#F6EFD9"/></linearGradient>
  </defs>
  <ellipse cx="92" cy="194" rx="62" ry="6" fill="rgba(0,0,0,.2)"/>
  <path d="${furBlob(70, 176, 21, 13, 12, 3)}" fill="url(#y-fur)" stroke="#97B0C4" stroke-width="1.2"/>
  <path d="${furBlob(116, 176, 21, 13, 12, 3)}" fill="url(#y-fur)" stroke="#97B0C4" stroke-width="1.2"/>
  <ellipse cx="66" cy="186" rx="18" ry="6" fill="#6F8DA6"/><ellipse cx="112" cy="186" rx="18" ry="6" fill="#6F8DA6"/>
  <path d="M52 185 l-3 4 M59 187 l-2 4 M66 188 l-1 4 M98 185 l-3 4 M105 187 l-2 4" stroke="#2C3E50" stroke-width="2.2" stroke-linecap="round"/>
  <path d="${furBlob(146, 128, 14, 36, 14, 4, -14)}" fill="url(#y-fur)" stroke="#97B0C4" stroke-width="1.2"/>
  <path d="M150 160 q2 6 -1 10 M156 158 q3 6 0 10 M162 155 q3 5 1 9" stroke="#2C3E50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="${furBlob(94, 120, 52, 58, 28, 7)}" fill="url(#y-fur)" stroke="#97B0C4" stroke-width="1.5"/>
  <ellipse cx="88" cy="134" rx="30" ry="36" fill="#F7FBFD" opacity=".7"/>
  ${furStrokes(94, 122, 46, 50, 46, 7, "#B7CCDB")}
  <path d="M48 36 Q30 20 36 2 Q42 14 52 22 Q58 28 60 38 Z" fill="url(#y-horn)" stroke="#9C885C" stroke-width="1"/>
  <path d="M40 12 q5 2 6 6 M44 20 q5 1 7 5 M48 28 q4 1 6 4" stroke="#9C885C" stroke-width="1" fill="none"/>
  <path d="M118 34 Q136 18 132 0 Q126 12 116 20 Q108 26 106 36 Z" fill="url(#y-horn)" stroke="#9C885C" stroke-width="1"/>
  <path d="M128 10 q-5 2 -6 6 M124 18 q-5 1 -7 5 M120 26 q-4 1 -6 4" stroke="#9C885C" stroke-width="1" fill="none"/>
  <path d="${furBlob(84, 62, 40, 35, 22, 6)}" fill="url(#y-fur)" stroke="#97B0C4" stroke-width="1.4"/>
  <path d="M50 76 Q46 90 56 96 Q60 84 58 76 Z M110 74 Q116 88 106 96 Q102 84 104 74 Z" fill="#EEF5FA"/>
  <path d="M54 64 Q56 46 78 46 Q100 46 104 64 Q106 84 92 94 Q80 100 68 94 Q54 86 54 64 Z" fill="url(#y-face)" stroke="#2F6E9D" stroke-width="1.2"/>
  <path d="M56 60 Q66 52 78 58 Q88 52 102 60 Q92 58 80 64 Q68 58 56 60 Z" fill="#2F6E9D"/>
  <g class="eyes" style="transform-origin: 78px 66px">
    <ellipse cx="67" cy="66" rx="7" ry="5.5" fill="#FFF7D6"/><circle cx="64.5" cy="66.5" r="3.6" fill="#E3A21A"/><circle cx="64" cy="66.5" r="1.8" fill="#0E1626"/><circle cx="63" cy="65.3" r=".9" fill="#fff"/>
    <ellipse cx="90" cy="66" rx="7" ry="5.5" fill="#FFF7D6"/><circle cx="87.5" cy="66.5" r="3.6" fill="#E3A21A"/><circle cx="87" cy="66.5" r="1.8" fill="#0E1626"/><circle cx="86" cy="65.3" r=".9" fill="#fff"/>
  </g>
  <path d="M58 61 L74 64 M100 61 L84 64" stroke="#1C4E75" stroke-width="3" stroke-linecap="round"/>
  <path d="M72 72 Q78 70 82 72 Q80 78 77 78 Q74 78 72 72 Z" fill="#1C2E44"/>
  <circle cx="75" cy="75" r="1.1" fill="#4A6A88"/><circle cx="79.5" cy="75" r="1.1" fill="#4A6A88"/>
  <path d="M62 82 Q78 96 96 82 Q90 92 78 93 Q66 92 62 82 Z" fill="#3A0E1A" stroke="#1C2E44" stroke-width="1"/>
  <path d="M68 88 Q78 93 88 88 Q82 92 78 92 Q73 92 68 88 Z" fill="#E86A8A"/>
  <path d="M65 83.5 l3 7 l3 -5.5 Z M91 83.5 l-3 7 l-3 -5.5 Z" fill="#FFFFFF" stroke="#C9D6E0" stroke-width=".5"/>
  <path d="M74 85.5 l1.6 3 l1.6 -2.6 Z M80 85.5 l1.6 3 l1.6 -2.6 Z" fill="#FFFFFF"/>
  <g class="arm" style="transform-origin: 52px 98px">
    <path d="${furBlob(42, 130, 14, 36, 14, 4, 14)}" fill="url(#y-fur)" stroke="#97B0C4" stroke-width="1.2"/>
    ${furStrokes(42, 130, 10, 28, 10, 21, "#B7CCDB")}
    <path d="M28 158 q-3 6 0 10 M34 161 q-2 6 1 10 M40 162 q-1 6 2 9" stroke="#2C3E50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

  // ---------------- Ember Dragon ----------------
  const spikes = [[92, 80], [104, 82], [116, 88], [126, 98], [134, 110], [140, 124]]
    .map(([x, y], i) => `<path d="M${x} ${y} l${8 - i * 0.4} ${-10 + i} l2 ${12 - i}" fill="#7A160D"/>`).join("");
  const DRAGON = `
<svg viewBox="0 0 180 200" aria-hidden="true">
  <defs>
    <linearGradient id="d-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F26A3C"/><stop offset=".55" stop-color="#C8351F"/><stop offset="1" stop-color="#7E170E"/></linearGradient>
    <linearGradient id="d-belly" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE59A"/><stop offset="1" stop-color="#E3A136"/></linearGradient>
    <linearGradient id="d-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A65AD8"/><stop offset="1" stop-color="#3F185E"/></linearGradient>
    <linearGradient id="d-horn" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#C7A76A"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>
    <radialGradient id="d-eye" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#F0A21A"/></radialGradient>
  </defs>
  <ellipse cx="96" cy="194" rx="64" ry="6" fill="rgba(0,0,0,.2)"/>
  <path d="M112 84 Q130 40 172 18 Q166 40 170 52 Q156 52 160 70 Q146 68 148 86 Q134 84 132 104 Z" fill="url(#d-wing)" stroke="#2C0F45" stroke-width="1.4"/>
  <path d="M114 84 L172 18 M124 92 L166 50 M132 102 L158 70 M136 110 L148 86" stroke="#2C0F45" stroke-width="2" stroke-linecap="round"/>
  <path d="M128 162 Q160 170 168 146 Q172 128 160 120 Q166 140 152 150 Q140 156 126 148 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.2"/>
  <path d="M158 120 l10 -10 l2 14 Z" fill="#7A160D"/>
  <path d="M120 150 Q138 156 136 176 Q132 186 118 186 L104 186 Q102 176 112 172 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.2"/>
  <path d="M104 186 l-4 4 M110 187 l-3 5 M116 187 l-2 5" stroke="#F6EAD0" stroke-width="2.4" stroke-linecap="round"/>
  ${spikes}
  <path d="M84 84 Q118 76 132 108 Q142 148 122 172 Q98 184 76 172 Q60 152 64 118 Q68 92 84 84 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.5"/>
  ${scales(92, 96, 5, 7, 9, "#5B0F08")}
  <path d="M72 104 Q90 98 98 108 Q104 136 98 170 Q84 176 76 170 Q66 140 72 104 Z" fill="url(#d-belly)" stroke="#B9771C" stroke-width="1"/>
  <path d="M71 116 Q86 112 100 117 M70 128 Q86 124 101 129 M70 140 Q86 136 101 141 M72 152 Q86 148 100 153 M74 163 Q86 160 99 164" stroke="#C98A2A" stroke-width="1.4" fill="none"/>
  <path d="M72 168 Q60 172 56 186 L74 188 Q82 180 86 172 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.2"/>
  <path d="M56 187 l-5 3 M62 188 l-3 4 M68 188 l-2 5" stroke="#F6EAD0" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M90 90 Q74 70 66 54 L82 44 Q90 62 102 80 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.3"/>
  <path d="M74 66 Q80 62 86 66 M70 58 Q76 54 82 58" stroke="#E3A136" stroke-width="2" fill="none"/>
  <path d="M74 30 Q90 18 102 6 Q98 22 90 34 Z" fill="url(#d-horn)" stroke="#9C7A3E" stroke-width="1"/>
  <path d="M64 30 Q72 14 78 2 Q80 18 74 30 Z" fill="url(#d-horn)" stroke="#9C7A3E" stroke-width="1"/>
  <path d="M84 40 Q82 26 66 26 Q50 24 34 32 Q16 36 10 46 Q8 54 16 58 Q30 64 46 62 Q62 62 74 58 Q86 52 84 40 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.5"/>
  <path d="M12 56 Q30 66 50 62 Q40 72 22 70 Q12 66 12 56 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.2"/>
  <path d="M20 58 l2.5 6 l2.5 -5 Z M30 60 l2.5 6 l2.5 -5 Z M40 60 l2.5 5.5 l2.5 -5 Z" fill="#FFFFFF"/>
  <path d="M14 47 Q18 45 20 48" stroke="#3A0905" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle class="smoke" cx="6" cy="40" r="4" fill="#BFC5CC"/><circle class="smoke s2" cx="2" cy="32" r="3" fill="#D5DADF"/>
  <path d="M50 34 Q62 26 74 32" stroke="#5B0F08" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <g class="eyes" style="transform-origin: 60px 40px">
    <ellipse cx="60" cy="40" rx="7" ry="5" fill="url(#d-eye)" stroke="#5B0F08" stroke-width="1"/>
    <ellipse cx="58.5" cy="40" rx="1.6" ry="4.4" fill="#1A0603"/><circle cx="62" cy="38.3" r="1.1" fill="#fff"/>
  </g>
  <path d="M30 40 q6 -4 12 -2" stroke="#E3A136" stroke-width="1.5" fill="none" opacity=".7"/>
  <g class="arm" style="transform-origin: 80px 104px">
    <path d="M80 100 Q62 108 58 124 Q56 132 62 134 Q66 126 72 120 Q84 116 88 108 Z" fill="url(#d-body)" stroke="#5B0F08" stroke-width="1.2"/>
    <path d="M58 134 l-4 3 M62 136 l-3 4 M66 134 l-1 5" stroke="#F6EAD0" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</svg>`;

  // ---------------- Glitch Bot ----------------
  const rivets = (pts) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#8B97A8" stroke="#4A5568" stroke-width=".6"/>`).join("");
  const wheels = (x0) => [0, 1, 2].map((i) => `<circle cx="${x0 + 9 + i * 13}" cy="183" r="5.5" fill="#4A5568" stroke="#1A202C" stroke-width="1"/><circle cx="${x0 + 9 + i * 13}" cy="183" r="1.8" fill="#A0AEC0"/>`).join("");
  const ROBOT = `
<svg viewBox="0 0 180 200" aria-hidden="true">
  <defs>
    <linearGradient id="r-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F5F9"/><stop offset=".5" stop-color="#AEB9C8"/><stop offset="1" stop-color="#5F6B7D"/></linearGradient>
    <linearGradient id="r-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3342"/><stop offset="1" stop-color="#0D1118"/></linearGradient>
    <radialGradient id="r-core" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E0FDFF"/><stop offset=".45" stop-color="#5BE7F5"/><stop offset="1" stop-color="#0B7285"/></radialGradient>
    <filter id="r-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <ellipse cx="90" cy="194" rx="62" ry="6" fill="rgba(0,0,0,.2)"/>
  <rect x="44" y="172" width="44" height="22" rx="11" fill="#2D3748" stroke="#111827" stroke-width="1.2"/>${wheels(44)}
  <rect x="96" y="172" width="44" height="22" rx="11" fill="#2D3748" stroke="#111827" stroke-width="1.2"/>${wheels(96)}
  <rect x="58" y="148" width="14" height="26" rx="3" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1"/>
  <rect x="112" y="148" width="14" height="26" rx="3" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1"/>
  <path d="M136 96 L150 112 L150 136" fill="none" stroke="#4A5568" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M136 96 L150 112 L150 136" fill="none" stroke="url(#r-metal)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="150" cy="112" r="5" fill="#4A5568"/>
  <path d="M144 136 l6 12 l6 -12 M146 138 l-6 10" stroke="#2D3748" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M46 92 Q46 86 54 86 L130 86 Q138 86 138 92 L134 146 Q134 152 126 152 L58 152 Q50 152 50 146 Z" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1.6"/>
  <path d="M58 98 h68 M60 140 h64" stroke="#7A8698" stroke-width="1"/>
  ${rivets([[54, 92], [130, 92], [56, 146], [128, 146], [92, 92]])}
  <rect x="60" y="102" width="64" height="34" rx="6" fill="url(#r-dark)" stroke="#111827" stroke-width="1"/>
  <circle cx="92" cy="119" r="11" fill="url(#r-core)" filter="url(#r-glow)"/>
  <circle cx="92" cy="119" r="14" fill="none" stroke="#5BE7F5" stroke-width="1.5" opacity=".6"/>
  <path d="M66 108 h12 M66 113 h8 M106 108 h12 M110 113 h8" stroke="#5BE7F5" stroke-width="1.6" opacity=".7"/>
  <path d="M56 146 h72 v6 h-72 z" fill="#F2BE48"/>
  <path d="M60 146 l6 6 M72 146 l6 6 M84 146 l6 6 M96 146 l6 6 M108 146 l6 6 M120 146 l6 6" stroke="#1A202C" stroke-width="3"/>
  <rect x="128" y="82" width="18" height="16" rx="5" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1.2"/>
  <rect x="80" y="74" width="24" height="14" rx="3" fill="#4A5568"/>
  <path d="M84 76 v10 M90 76 v10 M96 76 v10" stroke="#2D3748" stroke-width="1.5"/>
  <line x1="92" y1="16" x2="92" y2="32" stroke="#4A5568" stroke-width="3"/>
  <circle class="bot-light" cx="92" cy="12" r="5.5" fill="#FF4D4D" filter="url(#r-glow)"/>
  <path d="M46 40 Q46 30 58 30 L126 30 Q138 30 138 40 L136 70 Q136 78 126 78 L58 78 Q48 78 48 70 Z" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1.6"/>
  ${rivets([[54, 36], [130, 36], [54, 72], [130, 72]])}
  <rect x="38" y="44" width="10" height="24" rx="4" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1"/>
  <rect x="136" y="44" width="10" height="24" rx="4" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1"/>
  <rect x="56" y="40" width="72" height="24" rx="8" fill="url(#r-dark)" stroke="#111827" stroke-width="1"/>
  <g class="eyes" style="transform-origin: 92px 52px" filter="url(#r-glow)">
    <path d="M62 46 L82 52 L62 57 Z" fill="#FF4D4D"/><path d="M122 46 L102 52 L122 57 Z" fill="#FF4D4D"/>
  </g>
  <path d="M68 70 h48" stroke="#2D3748" stroke-width="3" stroke-dasharray="5 3"/>
  <path d="M60 66 h64" stroke="#FF4D4D" stroke-width="1" opacity=".5" stroke-dasharray="2 4"/>
  <rect x="38" y="82" width="18" height="16" rx="5" fill="url(#r-metal)" stroke="#4A5568" stroke-width="1.2"/>
  <g class="arm" style="transform-origin: 46px 94px">
    <path d="M46 96 L30 112 L30 136" fill="none" stroke="#4A5568" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M46 96 L30 112 L30 136" fill="none" stroke="url(#r-metal)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="30" cy="112" r="5" fill="#4A5568"/>
    <path d="M24 136 l6 12 l6 -12 M26 138 l-6 10" stroke="#2D3748" stroke-width="4" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;

  window.GAME_PLAYER_SVG = PLAYER;
  window.GAME_BOSSES = [
    { name: "Frost Yeti", svg: YETI },
    { name: "Ember Dragon", svg: DRAGON },
    { name: "Glitch Bot", svg: ROBOT },
  ];
})();
