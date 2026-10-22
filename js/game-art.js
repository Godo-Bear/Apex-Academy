/* =========================================================
   JINtelligence — character art for the Boss battle (hand-drawn SVG).
   The hero faces right; bosses face left. Parts with class "arm" swing
   when throwing, and "eyes" blink.
========================================================= */

const GAME_PLAYER_SVG = `
<svg viewBox="0 0 100 140" aria-hidden="true">
  <ellipse cx="50" cy="134" rx="26" ry="5" fill="rgba(0,0,0,.18)"/>
  <path d="M28 64 Q14 98 22 118 L46 106 Z" fill="#F2BE48"/>
  <path d="M28 64 Q20 92 25 110 L36 104 Z" fill="#D9A03A"/>
  <rect x="35" y="100" width="12" height="28" rx="5" fill="#2D2F45"/>
  <rect x="53" y="100" width="12" height="28" rx="5" fill="#2D2F45"/>
  <path d="M33 126 h17 a5 5 0 0 1 0 8 h-17 z" fill="#1B1B28"/>
  <path d="M51 126 h18 a5 5 0 0 1 0 8 h-18 z" fill="#1B1B28"/>
  <rect x="24" y="66" width="11" height="30" rx="5.5" fill="#6E1530"/>
  <circle cx="29.5" cy="97" r="6" fill="#E8B48C"/>
  <path d="M29 62 Q50 52 71 62 L73 104 Q50 111 27 104 Z" fill="#8A1C3C"/>
  <path d="M40 62 Q50 70 60 62" fill="none" stroke="#6E1530" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 76 l2.6 5.3 5.8.8 -4.2 4.1 1 5.8 -5.2-2.7 -5.2 2.7 1-5.8 -4.2-4.1 5.8-.8 z" fill="#F2BE48"/>
  <circle cx="52" cy="38" r="24" fill="#F4C9A3"/>
  <path d="M27 36 Q28 12 53 12 Q78 13 78 34 Q68 24 55 27 Q45 20 37 32 Q33 28 27 36 Z" fill="#2B1D16"/>
  <path d="M30 30 Q52 22 76 30 L76 35 Q52 27 30 36 Z" fill="#F2BE48"/>
  <path d="M30 32 L18 26 L22 36 Z" fill="#F2BE48"/>
  <g class="eyes" style="transform-origin: 63px 41px">
    <ellipse cx="58" cy="41" rx="3.2" ry="4" fill="#1B1B28"/><circle cx="59.2" cy="39.6" r="1.1" fill="#fff"/>
    <ellipse cx="70" cy="41" rx="3" ry="3.8" fill="#1B1B28"/><circle cx="71.1" cy="39.7" r="1" fill="#fff"/>
  </g>
  <path d="M54 34 l8 -2 M67 32 l7 1" stroke="#2B1D16" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="52" cy="48" r="3.4" fill="#F29B8F" opacity=".55"/>
  <path d="M60 50 Q65 54 70 50" fill="none" stroke="#8A3B2E" stroke-width="2.2" stroke-linecap="round"/>
  <g class="arm" style="transform-origin: 67px 68px">
    <rect x="62" y="64" width="11" height="31" rx="5.5" fill="#8A1C3C"/>
    <circle cx="67.5" cy="96" r="6.2" fill="#F4C9A3"/>
  </g>
</svg>`;

const GAME_BOSSES = [
  {
    name: "Frost Yeti",
    svg: `
<svg viewBox="0 0 160 180" aria-hidden="true">
  <ellipse cx="82" cy="174" rx="52" ry="6" fill="rgba(0,0,0,.18)"/>
  <ellipse cx="60" cy="166" rx="18" ry="9" fill="#9DB8CC"/><ellipse cx="104" cy="166" rx="18" ry="9" fill="#9DB8CC"/>
  <path d="M30 150 Q22 120 30 96 Q26 76 40 64 Q40 42 62 36 Q80 24 100 36 Q124 42 126 66 Q140 80 134 100 Q142 126 130 150 Q116 168 82 168 Q46 168 30 150 Z" fill="#F4F8FB" stroke="#CFE0EA" stroke-width="3"/>
  <path d="M44 120 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0" fill="none" stroke="#DCE8F0" stroke-width="3" stroke-linecap="round"/>
  <path d="M48 44 Q34 22 44 8 Q46 26 60 36 Z" fill="#E8DCC0"/><path d="M112 44 Q128 24 120 8 Q116 26 102 36 Z" fill="#E8DCC0"/>
  <ellipse cx="74" cy="76" rx="36" ry="30" fill="#7FC0E6"/>
  <g class="eyes" style="transform-origin: 74px 70px">
    <ellipse cx="60" cy="70" rx="8" ry="9" fill="#fff"/><circle cx="57" cy="71" r="4.4" fill="#16213A"/><circle cx="55.6" cy="69.4" r="1.4" fill="#fff"/>
    <ellipse cx="86" cy="70" rx="8" ry="9" fill="#fff"/><circle cx="83" cy="71" r="4.4" fill="#16213A"/><circle cx="81.6" cy="69.4" r="1.4" fill="#fff"/>
  </g>
  <path d="M50 58 L68 63 M96 58 L78 63" stroke="#16213A" stroke-width="4" stroke-linecap="round"/>
  <path d="M56 88 Q74 102 94 88 Q74 94 56 88 Z" fill="#16213A"/>
  <path d="M62 90 l4 7 l3 -6 Z M84 90 l-4 7 l-3 -6 Z" fill="#fff"/>
  <path d="M120 96 Q144 104 146 128 Q138 134 130 126 Q128 110 116 108 Z" fill="#F4F8FB" stroke="#CFE0EA" stroke-width="3"/>
  <g class="arm" style="transform-origin: 40px 100px">
    <path d="M40 96 Q16 102 14 126 Q22 134 30 126 Q32 112 44 110 Z" fill="#F4F8FB" stroke="#CFE0EA" stroke-width="3"/>
  </g>
</svg>`,
  },
  {
    name: "Ember Dragon",
    svg: `
<svg viewBox="0 0 160 180" aria-hidden="true">
  <ellipse cx="84" cy="174" rx="54" ry="6" fill="rgba(0,0,0,.18)"/>
  <path d="M112 70 Q150 30 156 70 Q146 62 142 80 Q134 70 126 88 Z" fill="#7B3FA0"/>
  <path d="M124 140 Q154 146 152 120 Q160 150 128 158 Z" fill="#C9372C"/>
  <ellipse cx="66" cy="166" rx="16" ry="8" fill="#8E241B"/><ellipse cx="106" cy="166" rx="16" ry="8" fill="#8E241B"/>
  <path d="M50 160 Q38 120 54 96 Q64 80 88 80 Q120 82 126 112 Q132 146 112 162 Q84 172 50 160 Z" fill="#D9442F"/>
  <path d="M64 156 Q58 126 70 104 Q84 98 96 106 Q104 130 98 158 Z" fill="#F6C453"/>
  <path d="M66 116 h30 M64 128 h34 M64 140 h34" stroke="#E0A83A" stroke-width="2.5"/>
  <path d="M60 92 Q40 86 30 70 Q20 56 34 44 Q52 30 72 40 Q88 48 86 66 Q84 84 60 92 Z" fill="#D9442F"/>
  <path d="M30 70 Q16 72 10 62 Q12 52 24 50 Z" fill="#D9442F"/>
  <circle cx="16" cy="58" r="2" fill="#5B140E"/>
  <path d="M44 40 Q42 22 52 14 Q52 28 58 36 Z M64 38 Q68 22 80 18 Q74 30 74 40 Z" fill="#F6E7C1"/>
  <g class="eyes" style="transform-origin: 48px 54px">
    <ellipse cx="46" cy="54" rx="7" ry="8" fill="#FFE27A"/><ellipse cx="44" cy="55" rx="2.4" ry="5.5" fill="#2B0D08"/>
  </g>
  <path d="M38 44 L54 49" stroke="#5B140E" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M14 66 Q28 76 44 72" fill="none" stroke="#5B140E" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M22 68 l3 5 l3 -4 Z M32 70 l3 5 l3 -4 Z" fill="#fff"/>
  <g class="arm" style="transform-origin: 62px 112px">
    <path d="M62 108 Q42 112 40 128 Q46 134 52 128 Q54 120 66 120 Z" fill="#D9442F"/>
  </g>
</svg>`,
  },
  {
    name: "Glitch Bot",
    svg: `
<svg viewBox="0 0 160 180" aria-hidden="true">
  <ellipse cx="80" cy="174" rx="50" ry="6" fill="rgba(0,0,0,.18)"/>
  <rect x="44" y="150" width="30" height="18" rx="6" fill="#4A5568"/><rect x="86" y="150" width="30" height="18" rx="6" fill="#4A5568"/>
  <rect x="58" y="136" width="10" height="16" fill="#718096"/><rect x="92" y="136" width="10" height="16" fill="#718096"/>
  <rect x="40" y="84" width="80" height="58" rx="12" fill="#A0AEC0" stroke="#718096" stroke-width="3"/>
  <rect x="54" y="96" width="52" height="30" rx="6" fill="#2D3748"/>
  <circle cx="66" cy="111" r="5" fill="#F56565"/><circle cx="80" cy="111" r="5" fill="#ECC94B"/><circle cx="94" cy="111" r="5" fill="#48BB78"/>
  <line x1="80" y1="22" x2="80" y2="36" stroke="#718096" stroke-width="4"/>
  <circle class="bot-light" cx="80" cy="18" r="6" fill="#F56565"/>
  <rect x="36" y="34" width="88" height="52" rx="16" fill="#CBD5E0" stroke="#718096" stroke-width="3"/>
  <rect x="46" y="44" width="68" height="32" rx="8" fill="#1A202C"/>
  <g class="eyes" style="transform-origin: 80px 58px">
    <path d="M54 52 L70 58 L54 62 Z" fill="#F56565"/><path d="M106 52 L90 58 L106 62 Z" fill="#F56565"/>
  </g>
  <path d="M62 70 h36" stroke="#F56565" stroke-width="3" stroke-dasharray="4 3"/>
  <rect x="26" y="50" width="10" height="20" rx="4" fill="#718096"/><rect x="124" y="50" width="10" height="20" rx="4" fill="#718096"/>
  <path d="M122 96 L140 108 L136 130" fill="none" stroke="#718096" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="arm" style="transform-origin: 40px 96px">
    <path d="M40 96 L22 108 L24 130" fill="none" stroke="#718096" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24" cy="132" r="7" fill="#4A5568"/>
  </g>
</svg>`,
  },
];
