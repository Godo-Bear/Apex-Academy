/* Question bank upgrades. Runs after data.js and visuals.js, before app.js.
   1. Questions that list their choices ("Enter 'a' or 'b'", "Which is larger: 0.7 or 0.65?") become tap-to-answer.
   2. Diagrams on existing questions (shapes, angles, spinners, number lines…).
   3. New interactive questions for every maths and English topic (plot, place, shade, turn, order, match, tap, sort), so every topic has at least 15 questions per level.
   4. A new topic: The Cartesian Plane. */
(function () {
  "use strict";
  const MATHS = YEAR_LEVELS[0].topics;
  const topic = (id) => MATHS.find((t) => t.id === id) || ENGLISH_TOPICS.find((t) => t.id === id);
  const byId = {};
  [...MATHS, ...ENGLISH_TOPICS].forEach((t) => (t.questions || []).forEach((q) => { byId[q.id] = q; }));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const accepted = (q) => (Array.isArray(q.answer) ? q.answer : [q.answer]).map((a) => String(a).trim().toLowerCase());

  // ------------------------------------------------------------ 1. Tap-to-answer choices
  // A quoted choice: the opening quote follows a space/start and is followed by text; apostrophes inside words are fine (they're).
  const Q = "'(?=[^\\s'])((?:[^']|'(?=[a-z]))+?)'(?![a-z])";
  const START = "(?:^|[\\s(:\"—])";
  const QUOTED3 = new RegExp(`${START}${Q}\\s*,\\s*${Q}\\s*,?\\s*or\\s+${Q}`, "i");
  const QUOTED2 = new RegExp(`${START}${Q}\\s+or\\s+${Q}`, "i");
  const NUMS = /:\s*(-?\d[\d.]*(?:\s*,\s*-?\d[\d.]*)*,?\s+or\s+-?\d[\d.]*)\s*\?/;
  const WORDS3 = /\b(?:an? )?([a-z]+), (?:an? )?([a-z]+),? or (?:an? )?([a-z]+)(?: [a-z]+)?\?/i;
  const WORDS2 = /\b(?:an? )?([a-z]+) or (?:an? )?([a-z]+)\?\s*(?:Enter|$)/i;
  const ENTER_TAIL = /\s*(?:—\s*)?Enter (?:'|1 |one |just |the |a |it)[^]*$/i;

  function setChoices(q, options, answer, stripPrompt) {
    q.options = options;
    q.answer = answer;
    q.answerType = "text";
    if (stripPrompt) q.prompt = q.prompt.replace(ENTER_TAIL, "").trim();
  }
  function autoChoices(q) {
    if (q.options || q.visual || q.answerType === "written") return;
    const p = q.prompt;
    // "Enter 1 for yes, 0 for no." / "Enter 1 for true, 0 for false."
    const yn = p.match(/Enter 1 for ([^,]+), 0 for ([^.]+)\.?/i);
    if (yn && (q.answer === 1 || q.answer === 0)) {
      const a = cap(yn[1].trim()), b = cap(yn[2].trim());
      setChoices(q, [a, b], q.answer === 1 ? a : b, true);
      q.prompt = q.prompt.replace(/\s*Enter 1 for [^.]+\.?\s*$/i, "").trim();
      return;
    }
    const tryList = (list, strip) => {
      if (!list) return false;
      const opts = list.map((s) => s.trim()).filter(Boolean);
      if (opts.length < 2 || new Set(opts.map((o) => o.toLowerCase())).size !== opts.length) return false;
      const want = accepted(q);
      const hit = opts.find((o) => want.includes(o.toLowerCase()));
      if (!hit) return false;
      setChoices(q, opts, hit, strip);
      return true;
    };
    const enterPart = p.match(/Enter ([^]*)$/i);
    if (enterPart) {
      const m3 = enterPart[1].match(QUOTED3), m2 = enterPart[1].match(QUOTED2);
      // "Which is correct: 'A' or 'B'? Enter 'first' or 'second'." → tap the actual sentences.
      if (m2 && /^first$/i.test(m2[1]) && /^second$/i.test(m2[2])) {
        const both = p.slice(0, enterPart.index).match(QUOTED2);
        const want = accepted(q)[0];
        if (both && (want === "first" || want === "second")) {
          setChoices(q, [both[1], both[2]], want === "first" ? both[1] : both[2], true);
          return;
        }
      }
      if (m3 && tryList(m3.slice(1), true)) return;
      if (m2 && tryList(m2.slice(1), true)) return;
    }
    const m3 = p.match(QUOTED3);
    if (m3 && tryList(m3.slice(1), true)) return;
    const m2 = p.match(QUOTED2);
    if (m2 && tryList(m2.slice(1), true)) return;
    const nums = p.match(NUMS);
    if (nums && typeof q.answer === "number") {
      const list = nums[1].split(/\s*,\s*(?:or\s+)?|\s+or\s+/).filter(Boolean);
      if (list.some((n) => Number(n) === q.answer)) {
        setChoices(q, list, list.find((n) => Number(n) === q.answer), true);
        return;
      }
    }
    const w3 = p.match(WORDS3);
    if (w3 && tryList(w3.slice(1), true)) return;
    const w2 = p.match(WORDS2);
    if (w2 && tryList(w2.slice(1), true)) return;
  }
  [...MATHS, ...ENGLISH_TOPICS].forEach((t) => (t.questions || []).forEach(autoChoices));

  // Punctuation marks: tap the mark (with its name).
  const MARKS = { "?": "? question mark", "!": "! exclamation mark", ",": ", comma", ".": ". full stop", ";": "; semicolon" };
  const markChoice = (id, marks) => {
    const q = byId[id];
    if (!q) return;
    setChoices(q, marks.map((m) => MARKS[m]), MARKS[q.answer], true);
  };
  markChoice("eng-p-e1", ["?", ".", "!"]);
  markChoice("eng-p-e2", [".", "!", "?"]);
  markChoice("eng-p-e3", [",", ".", ";"]);
  markChoice("eng-p-e5", ["!", "?", "."]);
  markChoice("eng-p-m5", [",", ";", "!"]);

  // Figurative language: "which technique?" questions get four choices.
  const TECHNIQUES = ["simile", "metaphor", "personification", "alliteration", "onomatopoeia", "hyperbole", "idiom", "oxymoron"];
  ["eng-f-e3", "eng-f-e5", "eng-f-e10", "eng-f-m2", "eng-f-m7", "eng-f-m8", "eng-f-m9", "eng-f-h1", "eng-f-h4", "eng-f-h5", "eng-f-h7"].forEach((id, k) => {
    const q = byId[id];
    if (!q || q.options) return;
    const others = TECHNIQUES.filter((x) => x !== q.answer);
    const picks = [others[k % others.length], others[(k + 2) % others.length], others[(k + 5) % others.length]];
    const opts = [...picks];
    opts.splice(k % 4, 0, q.answer);
    setChoices(q, opts, q.answer, false);
  });

  // Quadrant questions: tap 1, 2, 3 or 4 — with the point drawn on the grid.
  [["y7-neg20", 3, -2], ["y7-neg28", -5, -1], ["y7-neg40", -4, 6]].forEach(([id, x, y]) => {
    const q = byId[id];
    if (!q) return;
    setChoices(q, ["1", "2", "3", "4"], String(q.answer), false);
    q.visual = { type: "plane", points: [{ x, y, label: "P" }] };
  });

  // Grammar: tap the word in the sentence.
  const tapGrammar = (id, prompt, text) => {
    const q = byId[id];
    if (!q) return;
    Object.assign(q, { prompt, visual: { type: "tapword", text } });
    delete q.answerType;
    delete q.options;
    q.answer = visualAnswerText(q);
  };
  tapGrammar("eng-g-e1", "Tap the noun in this sentence.", "The *dog* barked loudly.");
  tapGrammar("eng-g-e2", "Tap the verb in this sentence.", "Sam *kicked* the ball.");
  tapGrammar("eng-g-e3", "Tap the adjective in this sentence.", "The *tall* girl ran.");
  tapGrammar("eng-g-e7", "Tap the adverb in this sentence.", "She sang *beautifully*.");
  tapGrammar("eng-g-m4", "Tap the word that shows who the project belongs to.", "The students finished *their* project.");
  tapGrammar("eng-g-m6", "Tap all the adjectives in this sentence.", "The *fluffy* *white* cat slept on the mat.");
  tapGrammar("eng-g-m9", "Tap the collective noun.", "The *team* celebrated after the match.");
  tapGrammar("eng-g-m10", "Tap the preposition.", "The keys are *under* the couch.");
  tapGrammar("eng-g-h3", "Tap the relative pronoun.", "The boy *who* lives next door plays guitar.");
  tapGrammar("eng-g-h7", "Tap the subordinating conjunction.", "*Although* she was tired, Mia finished her homework.");
  tapGrammar("eng-p-m2", "Tap the word that should have the first comma after it.", "I like *apples* oranges and pears.");
  tapGrammar("eng-p-h2", "A pair of commas is needed around the extra information. Tap the word that comes right before the first comma.", "The teacher said that *homework* which was due today is cancelled.");
  tapGrammar("eng-p-h4", "This dialogue is missing a comma. Tap the word that comes right before it.", "'I am *hungry*' said Sam.");

  // ------------------------------------------------------------ 2. Diagrams on existing questions
  const DIAGRAMS = {
    // Measurement
    "y7-m1": { type: "rect", w: 9, h: 5, unit: "cm" },
    "y7-m2": { type: "rect", w: 7, h: 6, unit: "cm" },
    "y7-m9": { type: "rect", w: 10, h: 4, unit: "cm" },
    "y7-m32": { type: "rect", w: 8, h: 3, unit: "cm" },
    "y7-m7": { type: "rect", w: 6, h: 6, unit: "cm", square: true },
    "y7-m11": { type: "rect", w: 5, h: 5, unit: "cm", square: true },
    "y7-m34": { type: "rect", w: 7, h: 7, unit: "cm", square: true },
    "y7-m21": { type: "rect", w: 10, h: 5, unit: "cm", wLabel: "?", hLabel: "5 cm", inside: "P = 30 cm" },
    "y7-m39": { type: "rect", w: 8, h: 6, unit: "cm", hLabel: "?", inside: "48 cm²" },
    "y7-m42": { type: "rect", w: 5, h: 4, unit: "m" },
    "y7-m5": { type: "tri", base: 8, height: 5, unit: "cm" },
    "y7-m36": { type: "tri", base: 10, height: 7, unit: "cm" },
    "y7-m14": { type: "para", base: 12, height: 5, unit: "cm" },
    "y7-m30": { type: "para", base: 12, height: 7, unit: "cm", heightLabel: "?" },
    "y7-m40": { type: "trap", a: 6, b: 10, h: 4, unit: "cm" },
    "y7-m15": { type: "circle", d: 14, unit: "cm" },
    "y7-m22": { type: "circle", r: 7, unit: "cm" },
    "y7-m29": { type: "circle", d: 20, unit: "cm" },
    "y7-m41": { type: "circle", r: 5, unit: "cm" },
    "y7-m23": { type: "circle", r: 8, unit: "cm", sector: 90 },
    "y7-m3": { type: "prism", l: 4, w: 3, h: 5, unit: "cm" },
    "y7-m16": { type: "prism", l: 6, w: 2, h: 3, unit: "cm" },
    "y7-m37": { type: "prism", l: 4, w: 4, h: 4, unit: "cm" },
    "y7-m17": { type: "lshape", parts: [{ w: 5, h: 4 }, { w: 5, h: 2 }], unit: "cm" },
    "y7-m45": { type: "lshape", parts: [{ w: 10, h: 4 }, { w: 4, h: 6 }], unit: "cm" },
    "y7-m24": { type: "house", w: 8, h: 5, th: 4, unit: "cm" },
    // Geometry
    "y7-g1": { type: "rightAngles", sizes: [35, 55], labels: ["35°", "?"] },
    "y7-g40": { type: "rightAngles", sizes: [62, 28], labels: ["62°", "?"] },
    "y7-g2": { type: "lineAngles", sizes: [112, 68], labels: ["112°", "?"] },
    "y7-g15": { type: "lineAngles", sizes: [72, 108], labels: ["72°", "x°"] },
    "y7-g44": { type: "lineAngles", sizes: [72, 108], labels: ["2x°", "3x°"] },
    "y7-g36": { type: "pointAngles", sizes: [100, 120, 140], labels: ["100°", "120°", "x°"] },
    "y7-g3": { type: "triangle", angles: ["45°", "75°", "?"] },
    "y7-g9": { type: "triangle", angles: ["50°", "60°", "?"] },
    "y7-g12": { type: "triangle", angles: ["50°", "50°", "?"], equal: "two" },
    "y7-g28": { type: "triangle", angles: ["90°", "35°", "?"] },
    "y7-g34": { type: "triangle", angles: ["90°", "30°", "?"] },
    "y7-g39": { type: "triangle", angles: ["?", "?", "40°"], sizes: [70, 70], equal: "two" },
    "y7-g5": { type: "triangle", angles: ["x°", "", ""], equal: "all" },
    "y7-g23": { type: "parallel", kind: "co-interior", size: 65, labels: ["65°", "?"] },
    "y7-g43": { type: "parallel", kind: "alternate", size: 72, labels: ["72°", "3x°"] },
    "y7-g18": { type: "parallel", kind: "co-interior", size: 60, labels: ["a", "b"] },
    "y7-g17": { type: "parallel", kind: "corresponding", size: 55, labels: ["a", "b"] },
    "y7-g21": { type: "parallel", kind: "alternate", size: 50, labels: ["a", "b"] },
    "y7-g14": { type: "parallel", kind: "vertical", size: 60, labels: ["a", "b"] },
    "y7-g10": { type: "polygon", n: 5 },
    "y7-g11": { type: "polygon", n: 6 },
    "y7-g32": { type: "polygon", n: 8 },
    "y7-g19": { type: "polygon", n: 4 },
    "y7-g20": { type: "polygon", n: 3 },
    "y7-g24": { type: "polygon", n: 6 },
    "y7-g41": { type: "polygon", n: 6 },
    "y7-g25": { type: "polygon", n: 5 },
    "y7-g45": { type: "polygon", n: 5 },
    "y7-g42": { type: "polygon", n: 8 },
    "y7-g29": { type: "polygon", n: 6 },
    "y7-g31": { type: "angle", deg: 120, label: "120°" },
    "y7-g33": { type: "angle", deg: 40, label: "40°" },
    "y7-g6": { type: "angle", deg: 90, label: "?" },
    "y7-g7": { type: "angle", deg: 180, label: "?" },
    // Statistics and probability
    "y7-s3": { type: "marbles", items: [{ color: "red", count: 3 }, { color: "blue", count: 7 }] },
    "y7-s15": { type: "marbles", items: [{ color: "green", count: 4 }, { color: "yellow", count: 6 }] },
    "y7-s23": { type: "marbles", items: [{ color: "red", count: 5 }, { color: "blue", count: 3 }, { color: "green", count: 2 }] },
    "y7-s34": { type: "marbles", items: [{ color: "red", count: 1 }, { color: "blue", count: 3 }] },
    "y7-s17": { type: "spinner", sections: ["1", "2", "3", "4", "5"] },
    "y7-s29": { type: "spinner", sections: ["1", "2", "3", "4", "5", "6", "7", "8"] },
    "y7-s42": { type: "spinner", sections: ["red", "blue", "red", "green", "red", "blue", "yellow", "red", "blue", "green"] },
    "y7-s22": { type: "dotplot", values: [2, 2, 3, 4, 4, 4, 5, 6] },
    // Equations
    "y7-e1": { type: "balance", left: ["x", "9"], right: ["15"] },
    "y7-e7": { type: "balance", left: ["x", "x"], right: ["18"] },
    "y7-e8": { type: "balance", left: ["x", "7"], right: ["20"] },
    "y7-e10": { type: "balance", left: ["x", "x", "x", "x"], right: ["32"] },
    "y7-e13": { type: "balance", left: ["6", "x"], right: ["14"] },
    "y7-e31": { type: "balance", left: ["x", "4"], right: ["11"] },
    "y7-e32": { type: "balance", left: ["x", "x", "x", "x", "x"], right: ["35"] },
    "y7-e35": { type: "balance", left: ["3", "x"], right: ["12"] },
    "y7-e36": { type: "balance", left: ["x", "x", "5"], right: ["17"] },
    // Fractions, decimals and percentages
    "y7-f1": { type: "fraction", parts: 4, shaded: 3 },
    "y7-f7": { type: "fraction", parts: 2, shaded: 1 },
    "y7-f31": { type: "fraction", shape: "circle", parts: 4, shaded: 1 },
    "y7-f11": { type: "fraction", parts: 10, shaded: 3 },
    "y7-f6": { type: "fraction", shape: "circle", parts: 8, shaded: 3 },
    "y7-f10": { type: "fraction", parts: 10, shaded: 4 },
    "y7-f13": { type: "fraction", parts: 8, shaded: 4 },
    "y7-f34": { type: "fraction", shape: "grid", parts: 9, cols: 3, shaded: 6 },
    "y7-f5": { type: "fraction", items: [{ label: "1/2", parts: 2, shaded: 1 }, { label: "1/4", parts: 4, shaded: 1 }] },
    "y7-f40": { type: "fraction", items: [{ label: "3/4", parts: 4, shaded: 3 }, { label: "1/2", parts: 4, shaded: 2 }] },
    "y7-d6": { type: "pv", number: "4.375", highlight: 2 },
    "y7-d8": { type: "numberline", min: 6.4, max: 6.5, step: 0.01, labelEvery: 5, marks: [{ v: 6.42, label: "6.42" }] },
    "y7-d33": { type: "numberline", min: 3.8, max: 3.9, step: 0.01, labelEvery: 5, marks: [{ v: 3.86, label: "3.86" }] },
    "y7-d19": { type: "fraction", shape: "grid", parts: 100, cols: 10, shaded: 40 },
    "y7-d40": { type: "fraction", shape: "grid", parts: 100, cols: 10, shaded: 20 },
    // Number properties and computation
    "y7-n1": { type: "array", rows: 7, cols: 7 },
    "y7-n6": { type: "array", rows: 6, cols: 6 },
    "y7-n31": { type: "array", rows: 8, cols: 8 },
    "y7-c6": { type: "pv", number: "6482", highlight: 0 },
    "y7-c13": { type: "pv", number: "8043", highlight: 2 },
    "y7-c22": { type: "pv", number: "47932", highlight: 1 },
    "y7-c38": { type: "pv", number: "53210", highlight: 1 },
    "y7-c5": { type: "numberline", min: 4800, max: 4900, step: 10, labelEvery: 5, marks: [{ v: 4867, label: "4867" }] },
    "y7-c19": { type: "numberline", min: 27000, max: 28000, step: 100, labelEvery: 5, marks: [{ v: 27456, label: "27 456" }] },
    "y7-c35": { type: "numberline", min: 60, max: 70, step: 1, marks: [{ v: 63, label: "63" }] },
    // Negative numbers
    "y7-neg35": { type: "numberline", min: -5, max: 10, step: 1, labelEvery: 5, marks: [{ v: -2, label: "−2 °C" }] },
  };
  Object.entries(DIAGRAMS).forEach(([id, v]) => { if (byId[id]) byId[id].visual = v; });

  // ------------------------------------------------------------ 3. New interactive questions
  const add = (topicId, prefix, list) => {
    const t = topic(topicId);
    if (!t) return;
    list.forEach((item, i) => {
      const { d, ...rest } = item;
      const q = { id: `${prefix}${i + 1}`, difficulty: d, ...rest };
      if (q.options && q.answerType === undefined) q.answerType = "text";
      if (isVisualInput(q)) q.answer = visualAnswerText(q);
      t.questions.push(q);
    });
  };
  const QUAD = ["1st quadrant", "2nd quadrant", "3rd quadrant", "4th quadrant"];

  add("y7-computation", "y7-c-v", [
    { d: 1, prompt: "Put these numbers in order from smallest to largest.", visual: { type: "order", items: ["209", "290", "902", "920"], first: "Smallest", last: "Largest" }, explanation: "Compare the hundreds first: 2 hundreds is less than 9 hundreds. Then compare the tens: 209 < 290 and 902 < 920." },
    { d: 1, prompt: "Place 700 on the number line.", visual: { type: "place", min: 0, max: 1000, step: 100, labelEvery: 5, target: 700 }, explanation: "Each small mark is 100. Count 7 marks from 0, or 2 marks past 500." },
    { d: 1, prompt: "What is the value of the highlighted digit?", visual: { type: "pv", number: "5384", highlight: 1 }, answer: 300, explanation: "The 3 is in the hundreds column, so it is worth 300." },
    { d: 2, prompt: "Place 4250 on the number line.", visual: { type: "place", min: 4000, max: 5000, step: 100, labelEvery: 5, snap: 50, target: 4250 }, explanation: "Each mark is 100, so 4250 sits halfway between 4200 and 4300." },
    { d: 2, prompt: "Put these numbers in order from smallest to largest.", visual: { type: "order", items: ["3089", "3809", "3890", "3980", "8039"], first: "Smallest", last: "Largest" }, explanation: "Compare place by place from the left: thousands, then hundreds, then tens." },
    { d: 2, prompt: "Match each calculation to its answer.", visual: { type: "match", pairs: [["25 × 4", "100"], ["120 ÷ 6", "20"], ["13 × 3", "39"], ["81 ÷ 9", "9"]] }, explanation: "25 × 4 = 100, 120 ÷ 6 = 20, 13 × 3 = 39 and 81 ÷ 9 = 9." },
    { d: 3, prompt: "Work out each answer, then put them in order from smallest to largest.", visual: { type: "order", items: ["12 − 8 ÷ 4", "2 + 3 × 4", "20 − 4 ÷ 2", "(2 + 3) × 4"], first: "Smallest", last: "Largest" }, explanation: "Using order of operations: 12 − 2 = 10, 2 + 12 = 14, 20 − 2 = 18 and 5 × 4 = 20." },
    { d: 3, prompt: "Match each calculation to its answer. Watch the order of operations!", visual: { type: "match", pairs: [["6 + 4 × 2", "14"], ["(6 + 4) × 2", "20"], ["6 × 4 − 2", "22"], ["6 × (4 − 2)", "12"]] }, explanation: "Brackets first, then × and ÷, then + and −." },
    { d: 3, prompt: "Work out 125 × 8, then place the answer on the number line.", visual: { type: "place", min: 0, max: 2000, step: 250, labelEvery: 2, target: 1000 }, explanation: "125 × 8 = 1000 (125 × 2 = 250, × 2 = 500, × 2 = 1000)." },
  ]);

  add("y7-numberprops", "y7-n-v", [
    { d: 1, prompt: "Tap all the even numbers.", visual: { type: "tapword", text: "3 *8* 11 *14* 17 *20*" }, explanation: "Even numbers end in 0, 2, 4, 6 or 8: 8, 14 and 20." },
    { d: 1, prompt: "This array shows rows of dots. How many dots are there altogether?", visual: { type: "array", rows: 3, cols: 7 }, answer: 21, explanation: "3 rows of 7 dots: 3 × 7 = 21." },
    { d: 1, prompt: "Tap all the multiples of 5.", visual: { type: "tapword", text: "*15* 22 *35* 41 *50* 54" }, explanation: "Multiples of 5 end in 0 or 5: 15, 35 and 50." },
    { d: 2, prompt: "Tap all the prime numbers.", visual: { type: "tapword", text: "*2* 9 *13* 15 *23* 27 *31*" }, explanation: "2, 13, 23 and 31 have exactly two factors. 9 = 3 × 3, 15 = 3 × 5 and 27 = 3 × 9." },
    { d: 2, prompt: "Tap all the factors of 24.", visual: { type: "tapword", text: "*3* 5 *6* 7 *8* 9 *12* 16" }, explanation: "24 = 3 × 8 = 6 × 4 = 12 × 2, so 3, 6, 8 and 12 are factors." },
    { d: 2, prompt: "Work out each value, then put them in order from smallest to largest.", visual: { type: "order", items: ["3²", "2⁴", "5²", "3³"], first: "Smallest", last: "Largest" }, explanation: "3² = 9, 2⁴ = 16, 5² = 25 and 3³ = 27." },
    { d: 3, prompt: "Each shape is made of matchsticks. How many matchsticks are needed for Shape 5?", visual: { type: "pattern", stages: 3 }, answer: 16, explanation: "Shape 1 uses 4 and each new square adds 3: 4, 7, 10, 13, 16." },
    { d: 3, prompt: "How many matchsticks are needed for Shape 6 of this pattern?", visual: { type: "pattern", stages: 3, kind: "triangles" }, answer: 23, explanation: "The pattern goes 3, 7, 11 — adding 4 each time — so Shape 6 needs 3 + 5 × 4 = 23." },
    { d: 3, prompt: "Match each number to its prime factorisation.", visual: { type: "match", pairs: [["12", "2 × 2 × 3"], ["18", "2 × 3 × 3"], ["30", "2 × 3 × 5"], ["20", "2 × 2 × 5"]] }, explanation: "Multiply the primes to check: 2 × 2 × 3 = 12, 2 × 3 × 3 = 18, 2 × 3 × 5 = 30, 2 × 2 × 5 = 20." },
  ]);

  add("y7-fdp", "y7-f-v", [
    { d: 1, prompt: "Shade 3/4 of the bar.", visual: { type: "shade", parts: 4, target: 3 }, explanation: "The bar has 4 equal parts. 3/4 means 3 of those 4 parts." },
    { d: 1, prompt: "Shade 2/5 of the circle.", visual: { type: "shade", shape: "circle", parts: 5, target: 2 }, explanation: "The circle has 5 equal parts, so shade 2 of them." },
    { d: 1, prompt: "What fraction of the bar is shaded?", visual: { type: "fraction", parts: 8, shaded: 3 }, options: ["3/8", "5/8", "3/5", "8/3"], answer: "3/8", explanation: "3 of the 8 equal parts are shaded: 3/8." },
    { d: 2, prompt: "This bar has 8 parts. Shade 1/2 of it.", visual: { type: "shade", parts: 8, target: 4 }, explanation: "1/2 = 4/8, so shade 4 of the 8 parts." },
    { d: 2, prompt: "Place 3/4 on the number line.", visual: { type: "place", min: 0, max: 1, step: 0.125, denom: 8, labels: "ends", target: 0.75 }, explanation: "The line is split into eighths. 3/4 = 6/8, so count 6 marks from 0." },
    { d: 2, prompt: "Shade 30% of the grid.", visual: { type: "shade", shape: "grid", parts: 20, cols: 5, target: 6 }, explanation: "30% of 20 squares = 0.3 × 20 = 6 squares." },
    { d: 3, prompt: "Put these in order from smallest to largest.", visual: { type: "order", items: ["0.3", "2/5", "45%", "1/2"], first: "Smallest", last: "Largest" }, explanation: "As decimals: 0.3, 0.4, 0.45 and 0.5." },
    { d: 3, prompt: "Place 1 3/4 on the number line.", visual: { type: "place", min: 0, max: 3, step: 0.25, denom: 4, labelEvery: 4, target: 1.75 }, explanation: "Each mark is a quarter. Go to 1, then 3 more quarters." },
    { d: 3, prompt: "Match each fraction to its percentage.", visual: { type: "match", pairs: [["1/4", "25%"], ["3/5", "60%"], ["7/10", "70%"], ["1/8", "12.5%"]] }, explanation: "Divide the top by the bottom and × 100: 1/4 = 25%, 3/5 = 60%, 7/10 = 70%, 1/8 = 12.5%." },
  ]);

  add("y7-algebra", "y7-a-v", [
    { d: 1, prompt: "What number comes out of this machine?", visual: { type: "machine", input: "5", steps: ["× 3", "+ 2"], output: "?" }, answer: 17, explanation: "5 × 3 = 15, then 15 + 2 = 17." },
    { d: 1, prompt: "The rule is y = x + 4. What is the missing number?", visual: { type: "table", rows: [["x", 1, 2, 3, 4], ["y", 5, 6, 7, "?"]] }, answer: 8, explanation: "When x = 4, y = 4 + 4 = 8." },
    { d: 1, prompt: "Tap all the terms that are like terms with 3x.", visual: { type: "tapword", text: "*2x* 5y *x* 7 *9x* 4xy" }, explanation: "Like terms have exactly the same letter part: 2x, x and 9x." },
    { d: 2, prompt: "Shape n of this pattern uses 3n + 1 matchsticks. How many matchsticks are in Shape 10?", visual: { type: "pattern", stages: 3 }, answer: 31, explanation: "3 × 10 + 1 = 31." },
    { d: 2, prompt: "Match each expression to its simplified form.", visual: { type: "match", pairs: [["3x + 2x", "5x"], ["7y − 4y", "3y"], ["2a + 3 + a", "3a + 3"], ["4b × 2", "8b"]] }, explanation: "Collect like terms: 3x + 2x = 5x, 7y − 4y = 3y, 2a + a = 3a, and 4b × 2 = 8b." },
    { d: 2, prompt: "The rule is y = x + 1. Plot the point on this rule where x = 3.", visual: { type: "plot", targets: [[3, 4]] }, explanation: "When x = 3, y = 3 + 1 = 4, so plot (3, 4)." },
    { d: 3, prompt: "This machine multiplies by 4, then subtracts 3. The output is 25. What was the input?", visual: { type: "machine", input: "?", steps: ["× 4", "− 3"], output: "25" }, answer: 7, explanation: "Work backwards: 25 + 3 = 28, then 28 ÷ 4 = 7." },
    { d: 3, prompt: "The table follows a rule. What is y when x = 10?", visual: { type: "table", rows: [["x", 1, 2, 3, 4], ["y", 5, 8, 11, 14]] }, answer: 32, explanation: "y goes up by 3 each time and y = 3x + 2. When x = 10, y = 30 + 2 = 32." },
    { d: 3, prompt: "When x = 3, put these from smallest to largest.", visual: { type: "order", items: ["2x − 4", "x + 2", "3x − 2", "x²"], first: "Smallest", last: "Largest" }, explanation: "Substitute x = 3: 2(3) − 4 = 2, 3 + 2 = 5, 3(3) − 2 = 7, 3² = 9." },
  ]);

  add("y7-decimals", "y7-d-v", [
    { d: 1, prompt: "Place 0.7 on the number line.", visual: { type: "place", min: 0, max: 1, step: 0.1, labels: "ends", target: 0.7 }, explanation: "The line is split into tenths. 0.7 is 7 tenths, so count 7 marks from 0." },
    { d: 1, prompt: "Shade 0.6 of the bar.", visual: { type: "shade", parts: 10, target: 6 }, explanation: "The bar has 10 parts (tenths). 0.6 = 6 tenths." },
    { d: 1, prompt: "What is the value of the highlighted digit?", visual: { type: "pv", number: "3.472", highlight: 2 }, answer: 0.07, tolerance: 0.0001, explanation: "The 7 is in the hundredths column, so it's worth 7 hundredths = 0.07." },
    { d: 2, prompt: "Place 1.4 on the number line.", visual: { type: "place", min: 0, max: 2, step: 0.1, labelEvery: 5, target: 1.4 }, explanation: "Each mark is 0.1. Start at 1 and count 4 more marks." },
    { d: 2, prompt: "Put these decimals in order from smallest to largest.", visual: { type: "order", items: ["0.05", "0.5", "0.505", "0.55"], first: "Smallest", last: "Largest" }, explanation: "Compare the tenths first, then the hundredths, then the thousandths." },
    { d: 2, prompt: "What decimal is the arrow pointing to?", visual: { type: "numberline", min: 2, max: 3, step: 0.1, labels: "ends", arrow: 2.6 }, answer: 2.6, explanation: "Each mark is 0.1, and the arrow is 6 marks after 2: 2.6." },
    { d: 3, prompt: "Place 3.15 on the number line.", visual: { type: "place", min: 3, max: 3.5, step: 0.05, labelEvery: 2, target: 3.15 }, explanation: "Each mark is 0.05. 3.15 is halfway between 3.1 and 3.2." },
    { d: 3, prompt: "Put these decimals in order from smallest to largest.", visual: { type: "order", items: ["2.09", "2.1", "2.19", "2.9", "2.91"], first: "Smallest", last: "Largest" }, explanation: "Line up the decimal points: 2.09, 2.10, 2.19, 2.90, 2.91." },
    { d: 3, prompt: "Match each decimal to the fraction it equals.", visual: { type: "match", pairs: [["0.5", "1/2"], ["0.25", "1/4"], ["0.2", "1/5"], ["0.75", "3/4"]] }, explanation: "1 ÷ 2 = 0.5, 1 ÷ 4 = 0.25, 1 ÷ 5 = 0.2 and 3 ÷ 4 = 0.75." },
  ]);

  add("y7-negatives", "y7-neg-v", [
    { d: 1, prompt: "Place −7 on the number line.", visual: { type: "place", min: -10, max: 10, step: 1, labelEvery: 5, target: -7 }, explanation: "−7 is 7 steps to the left of 0 (2 steps right of −10)." },
    { d: 1, prompt: "Put these numbers in order from smallest to largest.", visual: { type: "order", items: ["−8", "−3", "0", "2", "5"], first: "Smallest", last: "Largest" }, explanation: "Numbers further left on the number line are smaller, so −8 is the smallest." },
    { d: 1, prompt: "What number is the arrow pointing to?", visual: { type: "numberline", min: -10, max: 10, step: 1, labelEvery: 5, arrow: -4 }, answer: -4, explanation: "The arrow is 4 steps left of 0, so it points to −4." },
    { d: 2, prompt: "Work out −6 + 9, then place the answer on the number line.", visual: { type: "place", min: -10, max: 10, step: 1, labelEvery: 5, target: 3 }, explanation: "Start at −6 and move 9 to the right: −6 + 9 = 3." },
    { d: 2, prompt: "Which calculation does this jump show?", visual: { type: "numberline", min: -5, max: 5, step: 1, jumps: [{ from: 4, to: -3, label: "−7" }], marks: [{ v: 4, label: "start" }] }, options: ["4 − 7", "4 + 7", "−3 + 4", "7 − 4"], answer: "4 − 7", explanation: "It starts at 4 and moves 7 to the left, so it shows 4 − 7 = −3." },
    { d: 2, prompt: "Plot the point (−4, 3).", visual: { type: "plot", targets: [[-4, 3]] }, explanation: "Go 4 left from the origin, then 3 up." },
    { d: 3, prompt: "Work out each value, then order them from smallest to largest.", visual: { type: "order", items: ["−3 × 2", "−10 + 5", "−8 ÷ 2", "(−2)²"], first: "Smallest", last: "Largest" }, explanation: "−3 × 2 = −6, −10 + 5 = −5, −8 ÷ 2 = −4 and (−2)² = 4." },
    { d: 3, prompt: "Work out −12 ÷ 3 + 9, then place the answer on the number line.", visual: { type: "place", min: -10, max: 10, step: 1, labelEvery: 5, target: 5 }, explanation: "Divide first: −12 ÷ 3 = −4. Then −4 + 9 = 5." },
    { d: 3, prompt: "Plot the point that is 7 units below (2, 3).", visual: { type: "plot", targets: [[2, -4]] }, explanation: "Moving down changes y: 3 − 7 = −4, so the point is (2, −4)." },
  ]);

  add("y7-geometry", "y7-g-v", [
    { d: 1, prompt: "Make an angle of 90° (a right angle).", visual: { type: "angleMake", target: 90 }, explanation: "A right angle is a quarter turn: the arm points straight up." },
    { d: 1, prompt: "What type of angle is this?", visual: { type: "angle", deg: 140 }, options: ["Acute", "Right", "Obtuse", "Reflex"], answer: "Obtuse", explanation: "It is bigger than 90° but less than 180°, so it is obtuse." },
    { d: 1, prompt: "Make any acute angle.", visual: { type: "angleMake", range: [5, 85] }, explanation: "An acute angle is more than 0° but less than 90°." },
    { d: 2, prompt: "Make an angle of 135°.", visual: { type: "angleMake", target: 135 }, explanation: "135° is halfway between 90° and 180°." },
    { d: 2, prompt: "Read the protractor. How many degrees is this angle?", visual: { type: "angle", deg: 65, protractor: true }, answer: 65, explanation: "The arm points between 60° and 70°, exactly at 65°." },
    { d: 2, prompt: "What is the name of this shape?", visual: { type: "polygon", n: 6 }, options: ["Pentagon", "Hexagon", "Heptagon", "Octagon"], answer: "Hexagon", explanation: "It has 6 sides, so it is a hexagon." },
    { d: 3, prompt: "Make a reflex angle of 250°.", visual: { type: "angleMake", target: 250 }, explanation: "250° is more than a half turn (180°): 70° past 180°." },
    { d: 3, prompt: "Two angles on a straight line add to 180°. One of them is 35°. Make the other angle.", visual: { type: "angleMake", target: 145 }, explanation: "180° − 35° = 145°." },
    { d: 3, prompt: "Match each angle to its type.", visual: { type: "match", pairs: [["35°", "Acute"], ["90°", "Right"], ["120°", "Obtuse"], ["180°", "Straight"], ["270°", "Reflex"]] }, explanation: "Acute < 90°, right = 90°, obtuse is between 90° and 180°, straight = 180°, reflex is between 180° and 360°." },
  ]);

  add("y7-statsprob", "y7-s-v", [
    { d: 1, prompt: "How many students chose AFL?", visual: { type: "bars", title: "Favourite sport", labels: ["Soccer", "AFL", "Netball", "Cricket"], values: [8, 12, 5, 3], yLabel: "Students" }, answer: 12, explanation: "The AFL bar reaches 12." },
    { d: 1, prompt: "On this chance scale, 0 means impossible and 1 means certain. Place the chance of a coin landing on heads.", visual: { type: "place", min: 0, max: 1, step: 0.25, denom: 4, labels: "ends", target: 0.5 }, explanation: "Heads is 1 of 2 equally likely outcomes: an even chance, 1/2." },
    { d: 1, prompt: "Which colour is this spinner most likely to land on?", visual: { type: "spinner", sections: ["red", "blue", "red", "green", "red", "blue"] }, options: ["Red", "Blue", "Green"], answer: "Red", explanation: "Red has 3 of the 6 equal sections — more than any other colour." },
    { d: 2, prompt: "What is the difference between the most and least popular fruit?", visual: { type: "bars", title: "Favourite fruit", labels: ["Apple", "Banana", "Grape", "Mango", "Orange"], values: [14, 9, 6, 11, 4], yLabel: "Votes" }, answer: 10, explanation: "Most popular is apple (14), least is orange (4): 14 − 4 = 10." },
    { d: 2, prompt: "Put these from least likely to most likely.", visual: { type: "order", items: ["Rolling a 7 on a normal die", "Flipping a coin and getting heads", "Rolling a number less than 5 on a die", "The sun rising tomorrow"], first: "Least likely", last: "Most likely" }, explanation: "Their chances are 0, 1/2, 4/6 and 1." },
    { d: 2, prompt: "Match each chance word to its probability.", visual: { type: "match", pairs: [["Impossible", "0"], ["Unlikely", "1/10"], ["Even chance", "1/2"], ["Certain", "1"]] }, explanation: "Probabilities go from 0 (impossible) to 1 (certain), with 1/2 an even chance." },
    { d: 3, prompt: "What is the mean number of books read per student?", visual: { type: "bars", title: "Books read this term", labels: ["Ava", "Ben", "Cal", "Dee", "Eli"], values: [4, 7, 5, 8, 6], yLabel: "Books" }, answer: 6, explanation: "Total = 4 + 7 + 5 + 8 + 6 = 30. Mean = 30 ÷ 5 = 6." },
    { d: 3, prompt: "What is the median of the data in this dot plot?", visual: { type: "dotplot", values: [1, 2, 2, 3, 3, 3, 4, 5, 5], xLabel: "Pets per family" }, answer: 3, explanation: "There are 9 values: 1, 2, 2, 3, 3, 3, 4, 5, 5. The middle (5th) value is 3." },
    { d: 3, prompt: "A bag has 3 red and 5 blue marbles. Place the probability of picking red on the scale.", visual: { type: "place", min: 0, max: 1, step: 0.125, denom: 8, labels: "ends", target: 0.375 }, explanation: "3 of the 8 marbles are red, so P(red) = 3/8." },
  ]);

  add("y7-equations", "y7-e-v", [
    { d: 1, prompt: "The scale is balanced. What is x?", visual: { type: "balance", left: ["x", "5"], right: ["12"] }, answer: 7, explanation: "x + 5 = 12, so take 5 from both sides: x = 7." },
    { d: 1, prompt: "The scale is balanced. What is x?", visual: { type: "balance", left: ["x", "x", "x"], right: ["15"] }, answer: 5, explanation: "3x = 15, so divide both sides by 3: x = 5." },
    { d: 1, prompt: "Match each equation to its solution.", visual: { type: "match", pairs: [["x + 3 = 8", "x = 5"], ["x − 2 = 4", "x = 6"], ["2x = 14", "x = 7"], ["x ÷ 3 = 3", "x = 9"]] }, explanation: "Use the inverse operation: 8 − 3 = 5, 4 + 2 = 6, 14 ÷ 2 = 7, 3 × 3 = 9." },
    { d: 2, prompt: "The scale is balanced. What is x?", visual: { type: "balance", left: ["x", "x", "4"], right: ["18"] }, answer: 7, explanation: "2x + 4 = 18. Take 4 from both sides: 2x = 14, so x = 7." },
    { d: 2, prompt: "Put the steps for solving 2x + 3 = 11 in order.", visual: { type: "order", items: ["2x + 3 = 11", "Subtract 3 from both sides: 2x = 8", "Divide both sides by 2", "x = 4"], first: "First", last: "Last" }, explanation: "Undo the + 3 first, then undo the × 2." },
    { d: 2, prompt: "Solve x + 6 = 2, then place x on the number line.", visual: { type: "place", min: -10, max: 10, step: 1, labelEvery: 5, target: -4 }, explanation: "x = 2 − 6 = −4." },
    { d: 3, prompt: "Match each equation to its solution.", visual: { type: "match", pairs: [["3x + 1 = 16", "x = 5"], ["2(x − 1) = 10", "x = 6"], ["x/4 + 2 = 4", "x = 8"], ["5x − 7 = 13", "x = 4"]] }, explanation: "3x = 15 → 5; x − 1 = 5 → 6; x/4 = 2 → 8; 5x = 20 → 4." },
    { d: 3, prompt: "Put the steps for solving 3(x − 2) = 12 in order.", visual: { type: "order", items: ["3(x − 2) = 12", "Divide both sides by 3: x − 2 = 4", "Add 2 to both sides", "x = 6"], first: "First", last: "Last" }, explanation: "Undo the × 3 first, then undo the − 2." },
    { d: 3, prompt: "Solve 3x + 10 = 1, then place x on the number line.", visual: { type: "place", min: -10, max: 10, step: 1, labelEvery: 5, target: -3 }, explanation: "3x = 1 − 10 = −9, so x = −3." },
  ]);

  add("y7-measurement", "y7-m-v", [
    { d: 1, prompt: "How long is the pencil, in centimetres?", visual: { type: "ruler", length: 6.5, max: 10 }, answer: 6.5, explanation: "It starts at 0 and ends halfway between 6 and 7: 6.5 cm." },
    { d: 1, prompt: "Each square is 1 square unit. Shade an area of 6 square units.", visual: { type: "shade", shape: "grid", parts: 12, cols: 4, target: 6 }, explanation: "Area counts the squares inside a shape. Any 6 squares make an area of 6 square units." },
    { d: 1, prompt: "What is the perimeter of this rectangle, in cm?", visual: { type: "rect", w: 7, h: 3, unit: "cm" }, answer: 20, explanation: "Perimeter = 7 + 3 + 7 + 3 = 20 cm." },
    { d: 2, prompt: "How long is the crayon, in millimetres?", visual: { type: "ruler", length: 4.3, max: 10 }, answer: 43, explanation: "It ends 3 small marks after 4 cm: 4.3 cm = 43 mm." },
    { d: 2, prompt: "What is the area of this shape, in cm²?", visual: { type: "lshape", parts: [{ w: 8, h: 3 }, { w: 3, h: 4 }], unit: "cm" }, answer: 36, explanation: "Split it into two rectangles: 8 × 3 = 24 and 3 × 4 = 12. 24 + 12 = 36 cm²." },
    { d: 2, prompt: "What is the volume of this box, in cm³?", visual: { type: "prism", l: 5, w: 2, h: 3, unit: "cm" }, answer: 30, explanation: "Volume = length × width × height = 5 × 2 × 3 = 30 cm³." },
    { d: 3, prompt: "What is the total area of this shape, in cm²?", visual: { type: "house", w: 6, h: 4, th: 3, unit: "cm" }, answer: 33, explanation: "Rectangle: 6 × 4 = 24. Triangle: ½ × 6 × 3 = 9. Total = 33 cm²." },
    { d: 3, prompt: "Using π ≈ 3.14, what is the area of this circle, in cm²? Round to 1 decimal place.", visual: { type: "circle", r: 3, unit: "cm" }, answer: 28.3, tolerance: 0.06, explanation: "A = πr² = 3.14 × 3 × 3 = 28.26 ≈ 28.3 cm²." },
    { d: 3, prompt: "What is the area of this trapezium, in cm²?", visual: { type: "trap", a: 4, b: 8, h: 5, unit: "cm" }, answer: 30, explanation: "A = ½(a + b)h = ½ × (4 + 8) × 5 = 30 cm²." },
  ]);

  // English
  add("eng-punctuation", "eng-p-v", [
    { d: 1, prompt: "Tap the word that needs a capital letter.", visual: { type: "tapword", text: "My best friend *sarah* lives in Perth." }, explanation: "Names of people are proper nouns, so they start with a capital: Sarah." },
    { d: 1, prompt: "Match each punctuation mark to its name.", visual: { type: "match", pairs: [["?", "question mark"], ["!", "exclamation mark"], [",", "comma"], [".", "full stop"]] }, explanation: "? ends a question, ! shows strong feeling, , separates items, . ends a statement." },
    { d: 2, prompt: "There is one dog. Tap the word that needs an apostrophe.", visual: { type: "tapword", text: "The *dogs* bone was buried in the garden." }, explanation: "The bone belongs to the dog, so it should be dog's." },
    { d: 2, prompt: "Tap the two words that need capital letters.", visual: { type: "tapword", text: "Last summer *jack* visited *melbourne* with his family." }, explanation: "Jack (a name) and Melbourne (a place) are proper nouns." },
    { d: 3, prompt: "Match each contraction to its full form.", visual: { type: "match", pairs: [["won't", "will not"], ["they're", "they are"], ["it's", "it is"], ["I'd", "I would"]] }, explanation: "The apostrophe shows where letters have been left out." },
    { d: 3, prompt: "Tap the word that should be followed by a comma.", visual: { type: "tapword", text: "*However* the weather soon turned cold." }, explanation: "Connecting words like 'However' at the start of a sentence are followed by a comma." },
  ]);
  add("eng-spelling", "eng-s-v", [
    { d: 1, prompt: "Tap the word that is spelt wrong.", visual: { type: "tapword", text: "I *recieved* a letter from my aunt." }, explanation: "'I before e, except after c': received." },
    { d: 1, prompt: "Put these words in alphabetical order.", visual: { type: "order", items: ["apple", "banana", "cherry", "grape"], first: "A", last: "Z" }, explanation: "Look at the first letter of each word: a, b, c, g." },
    { d: 2, prompt: "Tap the misspelt word.", visual: { type: "tapword", text: "We went to the *libary* after school." }, explanation: "The correct spelling is library — don't forget the first r." },
    { d: 2, prompt: "Match each word to its plural.", visual: { type: "match", pairs: [["child", "children"], ["mouse", "mice"], ["leaf", "leaves"], ["baby", "babies"]] }, explanation: "Some plurals are irregular (children, mice); leaf → leaves; y after a consonant → ies." },
    { d: 3, prompt: "Tap the two misspelt words.", visual: { type: "tapword", text: "It is *neccessary* to *seperate* the recycling." }, explanation: "Necessary has one c and two s's. Separate has 'a rat' in the middle: sep-a-rat-e." },
    { d: 3, prompt: "Put these words in alphabetical order.", visual: { type: "order", items: ["practice", "precious", "present", "pretend", "prism"], first: "A", last: "Z" }, explanation: "They all start with pr, so compare the third letter, then the fourth: pra, prec, pres, pret, pri." },
  ]);
  const LEO = "Leo grabbed his surfboard and ran down to the beach. He paddled out past the breaking waves and waited. When a big wave rolled in, he stood up and rode it all the way to the shore. Later, tired but happy, he walked home for dinner.";
  const VOLCANO = "The volcano had been quiet for centuries. Then, early one morning, the ground began to shake. Smoke poured from the crater, and by afternoon the villagers were packing their belongings. That night, glowing lava spilled down the mountain's side.";
  add("eng-reading", "eng-r-v", [
    { d: 2, passage: LEO, showPassage: true, prompt: "Put the events in the order they happened.", visual: { type: "order", items: ["Leo ran down to the beach", "He paddled out past the waves", "He rode a big wave to the shore", "He walked home for dinner"], first: "First", last: "Last" }, explanation: "Follow the time words in the passage: first he ran, then paddled, then rode a wave, and later walked home." },
    { d: 2, passage: LEO, showPassage: true, prompt: "Tap the 2 words that tell you how Leo felt at the end.", visual: { type: "tapword", text: "Later, *tired* but *happy*, he walked home for dinner." }, explanation: "The passage says he was 'tired but happy'." },
    { d: 3, passage: VOLCANO, showPassage: true, prompt: "Put the events in the order they happened.", visual: { type: "order", items: ["The volcano was quiet for centuries", "The ground began to shake", "Smoke poured from the crater", "The villagers packed their belongings", "Lava spilled down the mountain"], first: "First", last: "Last" }, explanation: "Time words show the order: for centuries, early one morning, by afternoon, that night." },
    { d: 3, passage: VOLCANO, showPassage: true, prompt: "Tap the adjective that describes the lava.", visual: { type: "tapword", text: "That night, *glowing* lava spilled down the mountain's side." }, explanation: "'Glowing' describes what the lava looked like." },
  ]);
  add("eng-grammar", "eng-g-v", [
    { d: 1, prompt: "Match each word to its word type.", visual: { type: "match", pairs: [["quickly", "adverb"], ["happy", "adjective"], ["jump", "verb"], ["teacher", "noun"]] }, explanation: "Nouns name things, verbs are actions, adjectives describe nouns, adverbs describe verbs." },
    { d: 1, prompt: "Put the words in order to make a sentence.", visual: { type: "order", items: ["The", "cat", "sat", "on", "the", "mat."], first: "Start", last: "End" }, explanation: "A sentence starts with a capital letter and ends with a full stop: The cat sat on the mat." },
    { d: 2, prompt: "Tap all the verbs.", visual: { type: "tapword", text: "The children *laughed* and *played* in the park." }, explanation: "Laughed and played are the actions (verbs)." },
    { d: 3, prompt: "Tap the two pronouns.", visual: { type: "tapword", text: "When Mia saw the puppy, *she* picked *it* up gently." }, explanation: "Pronouns replace nouns: 'she' replaces Mia and 'it' replaces the puppy." },
  ]);
  add("eng-vocab", "eng-v-v", [
    { d: 1, prompt: "Match each word to its opposite.", visual: { type: "match", pairs: [["hot", "cold"], ["up", "down"], ["happy", "sad"], ["early", "late"]] }, explanation: "Antonyms are words with opposite meanings." },
    { d: 2, prompt: "Match each word to a word that means the same.", visual: { type: "match", pairs: [["brave", "courageous"], ["enormous", "gigantic"], ["begin", "commence"], ["angry", "furious"]] }, explanation: "Synonyms are words with the same or similar meanings." },
    { d: 2, prompt: "Tap the word that means 'very tired'.", visual: { type: "tapword", text: "After the long race, Mia felt *exhausted* but proud." }, explanation: "Exhausted means extremely tired." },
    { d: 3, prompt: "Match each prefix to its meaning.", visual: { type: "match", pairs: [["pre-", "before"], ["sub-", "under"], ["mis-", "wrongly"], ["re-", "again"]] }, explanation: "preview (before), submarine (under), misunderstand (wrongly), redo (again)." },
    { d: 3, prompt: "Match each word root to its meaning.", visual: { type: "match", pairs: [["bio", "life"], ["chron", "time"], ["geo", "earth"], ["tele", "far"]] }, explanation: "biology (life), chronological (time), geography (earth), telescope (far)." },
    { d: 3, prompt: "Tap the word that means 'in short supply'.", visual: { type: "tapword", text: "After the drought, fresh water was *scarce* in the town." }, explanation: "Scarce means there isn't enough of something." },
  ]);
  add("eng-figurative", "eng-f-v", [
    { d: 1, prompt: "Tap the word that is onomatopoeia.", visual: { type: "tapword", text: "The bees *buzzed* around the flowers." }, explanation: "'Buzzed' sounds like the noise bees make." },
    { d: 1, prompt: "Match each example to its technique.", visual: { type: "match", pairs: [["as brave as a lion", "simile"], ["The wind howled", "personification"], ["Crash! Bang!", "onomatopoeia"]] }, explanation: "'as … as' is a simile, the wind howling is a human/animal action given to wind, and crash/bang copy sounds." },
    { d: 2, prompt: "Match each example to its technique.", visual: { type: "match", pairs: [["The classroom was a zoo", "metaphor"], ["I've told you a million times", "hyperbole"], ["Silly snakes slither", "alliteration"], ["The sun smiled", "personification"]] }, explanation: "A metaphor says something IS something else; hyperbole exaggerates; alliteration repeats first sounds; personification gives human actions." },
    { d: 2, prompt: "Tap the two words that are personification.", visual: { type: "tapword", text: "The old house *groaned* and *sighed* in the wind." }, explanation: "Houses can't really groan or sigh — these are human actions." },
    { d: 3, prompt: "Match each idiom to its meaning.", visual: { type: "match", pairs: [["Break a leg", "Good luck"], ["A piece of cake", "Very easy"], ["Spill the beans", "Reveal a secret"], ["Under the weather", "Feeling sick"]] }, explanation: "Idioms mean something different from their literal words." },
    { d: 3, prompt: "Match each example to its technique.", visual: { type: "match", pairs: [["deafening silence", "oxymoron"], ["as quiet as a mouse", "simile"], ["Her eyes were diamonds", "metaphor"], ["sizzle", "onomatopoeia"]] }, explanation: "An oxymoron joins opposites; a simile uses as/like; a metaphor says something is something else; sizzle copies a sound." },
  ]);


  // More English questions, so every topic has 15 at each level.
  const mixed = (arr, seed) => {
    let x = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
    const rnd = () => { x = (x + 0x6d2b79f5) >>> 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  };
  const mc = (d, prompt, options, answer, explanation, extra = {}) => ({ d, prompt, options: mixed(options, prompt + (extra.passage || "")), answer, explanation, ...extra });
  const typed = (d, prompt, answer, explanation, extra = {}) => ({ d, prompt, answer, answerType: "text", explanation, ...extra });
  const tw = (d, prompt, text, explanation, extra = {}) => ({ d, prompt, visual: { type: "tapword", text }, explanation, ...extra });
  const mt = (d, prompt, pairs, explanation) => ({ d, prompt, visual: { type: "match", pairs }, explanation });
  const od = (d, prompt, items, first, last, explanation, extra = {}) => ({ d, prompt, visual: { type: "order", items, first, last }, explanation, ...extra });
  const st = (d, prompt, cats, items, explanation, extra = {}) => ({ d, prompt, visual: { type: "sort", cats, items }, explanation, ...extra });

  add("eng-punctuation", "eng-p-x", [
    mc(1, "Which sentence is punctuated correctly?", ["Where is my bag?", "Where is my bag.", "where is my bag?", "Where is my bag!"], "Where is my bag?", "It's a question, so it starts with a capital letter and ends with a question mark."),
    tw(1, "Tap the word that needs a capital letter.", "We went swimming on *monday* afternoon.", "Days of the week are proper nouns, so they need a capital: Monday."),
    tw(1, "Tap the two words that need capital letters.", "*i* think *australia* is a great country.", "The word 'I' is always a capital, and Australia is the name of a country."),
    st(1, "Does each sentence need a question mark or a full stop at the end?", ["?", "."], [["How old are you", 0], ["I am twelve", 1], ["Can we go now", 0], ["The bus is late", 1], ["Why is the sky blue", 0]], "Questions end with a question mark. Statements end with a full stop."),
    mc(1, "Which sentence uses capital letters correctly?", ["My dog Max loves Sydney.", "my dog max loves sydney.", "My Dog Max Loves Sydney.", "My dog max loves Sydney."], "My dog Max loves Sydney.", "Capitals go at the start of a sentence and on names (Max, Sydney), not on every word."),
    tw(1, "Tap the word that should have a comma after it.", "For lunch I had *sandwiches* fruit and juice.", "Commas separate items in a list: sandwiches, fruit and juice."),
    mt(1, "Match each sentence to the mark it needs at the end.", [["What a great goal", "!"], ["Is it lunchtime yet", "?"], ["The shop opens at nine", "."]], "Strong feeling → exclamation mark, question → question mark, statement → full stop."),
    mc(1, "What are quotation marks (speech marks) used for?", ["To show the exact words someone says", "To end a sentence", "To join two sentences", "To separate items in a list"], "To show the exact words someone says", "Speech marks go around the words a person actually says: \"Hello,\" said Ben."),

    mc(2, "Three girls each own a bike. Which sentence is correct?", ["The girls' bikes were red.", "The girls bikes' were red.", "The girl's bike's were red.", "The girls bikes were red."], "The girls' bikes were red.", "For a plural ending in s, the apostrophe goes after the s: girls'."),
    tw(2, "Tap the word that needs an apostrophe because letters are missing.", "I *cant* find my shoes anywhere.", "Can't is short for cannot. The apostrophe shows where letters were left out."),
    mc(2, "Which sentence punctuates the speech correctly?", ["\"Come here,\" said Mum.", "\"Come here\" said Mum.", "Come here, said \"Mum.\"", "\"Come here, said Mum.\""], "\"Come here,\" said Mum.", "Only the spoken words go inside the speech marks, with a comma before the closing mark."),
    mt(2, "Match each contraction to its full form.", [["can't", "cannot"], ["you'll", "you will"], ["we've", "we have"], ["didn't", "did not"]], "The apostrophe replaces the missing letters."),
    mc(2, "Which sentence is correct?", ["The cat licked its paw.", "The cat licked it's paw."], "The cat licked its paw.", "'Its' (no apostrophe) means belonging to it. 'It's' always means 'it is' or 'it has'."),
    tw(2, "Tap the word that needs an apostrophe to show ownership.", "We played at *Toms* house after school.", "The house belongs to Tom, so it's Tom's house."),
    st(2, "Should each gap be 'its' or 'it's'?", ["its", "it's"], [["___ going to rain.", 1], ["The dog wagged ___ tail.", 0], ["___ my turn next.", 1], ["The tree lost ___ leaves.", 0]], "Use it's only if you can say 'it is' or 'it has' instead."),
    mc(2, "Why is there a comma in 'After dinner, we watched a movie'?", ["It comes after an opening phrase", "It separates items in a list", "It shows ownership", "It ends the sentence"], "It comes after an opening phrase", "A comma often follows an opening phrase or clause, before the main part of the sentence."),

    mc(3, "Which sentence uses a colon correctly?", ["You will need three things: a pen, a ruler and a rubber.", "You will need: three things a pen, a ruler and a rubber.", "You: will need three things, a pen a ruler and a rubber.", "You will need three things a pen: a ruler and a rubber."], "You will need three things: a pen, a ruler and a rubber.", "A colon comes after a complete clause to introduce a list or explanation."),
    mc(3, "Which sentence uses a semicolon correctly?", ["It was late; we went home.", "It was; late we went home.", "It was late we; went home.", "It; was late we went home."], "It was late; we went home.", "A semicolon joins two complete, closely related sentences."),
    tw(3, "Tap the word that should be followed by a comma.", "When the bell *rang* everyone ran outside.", "The opening clause 'When the bell rang' needs a comma before the main clause."),
    mc(3, "Which is the correct way to show toys belonging to the children?", ["the children's toys", "the childrens' toys", "the childrens toys", "the children toy's"], "the children's toys", "'Children' is already plural and doesn't end in s, so add 's: children's."),
    od(3, "Put the parts in order to make a correctly punctuated sentence.", ["\"I can't wait,\"", "said Ava,", "\"for the holidays!\""], "Start", "End", "When speech is split, the speaker tag goes in the middle with commas on both sides."),
    mc(3, "What are the brackets doing in 'Our teacher (Mr Lee) is very funny'?", ["Adding extra information", "Showing a question", "Showing speech", "Joining two lists"], "Adding extra information", "Brackets hold extra information. The sentence still makes sense without it."),
    tw(3, "Tap the two words that need apostrophes.", "*Jacks* mum said *theyre* coming at six.", "Jack's shows ownership. They're is short for 'they are'."),
    mc(3, "Which one is a run-on sentence that needs fixing?", ["I love soccer I play every Saturday.", "I love soccer, and I play every Saturday.", "I love soccer. I play every Saturday.", "I love soccer; I play every Saturday."], "I love soccer I play every Saturday.", "Two complete sentences can't just run together. Fix it with a full stop, a semicolon, or a comma plus 'and'."),
  ]);

  add("eng-spelling", "eng-s-x", [
    mc(1, "Which word is spelt correctly?", ["because", "becuase", "becos", "beacause"], "because", "Because: be-cause."),
    tw(1, "Tap the word that is spelt wrong.", "The sunset was *beautyful* tonight.", "The correct spelling is beautiful: the y changes to i before -ful."),
    typed(1, "Spell the plural of 'box'.", ["boxes"], "Words ending in x add -es: boxes."),
    typed(1, "Spell the past tense of 'jump' (yesterday I ___).", ["jumped"], "Add -ed: jumped."),
    mt(1, "Match each word to its meaning.", [["sea", "the ocean"], ["see", "to look"], ["two", "the number 2"], ["too", "also"]], "Homophones sound the same but are spelt differently and mean different things."),
    mc(1, "Choose the correct word: 'I ___ the answer.'", ["know", "no", "now", "knot"], "know", "'Know' (with a silent k) means to have the information."),
    od(1, "Put these words in alphabetical order.", ["dog", "duck", "elephant", "fish"], "A", "Z", "Dog and duck both start with d, so look at the second letter: o comes before u."),
    tw(1, "Tap the misspelt word.", "We went to the beach on *wensday*.", "The correct spelling is Wednesday, with a silent d: Wed-nes-day."),

    mc(2, "Which word is spelt correctly?", ["government", "goverment", "govenment", "guvernment"], "government", "Government comes from 'govern' + 'ment', so keep the n."),
    mt(2, "Match each word to its plural.", [["knife", "knives"], ["tooth", "teeth"], ["potato", "potatoes"], ["city", "cities"]], "f → ves; some plurals are irregular (teeth); some o words add -es; y after a consonant → ies."),
    mc(2, "Choose the correct word: 'The wind ___ the leaves away.'", ["blew", "blue"], "blew", "Blew is the past tense of blow. Blue is a colour."),
    tw(2, "Tap the two misspelt words.", "I *beleive* it will be *wierd* weather.", "Believe follows 'i before e'. Weird is a famous exception: e before i."),
    typed(2, "Add -ing to 'swim'.", ["swimming"], "Short vowel + one consonant: double the consonant, so swimming."),
    typed(2, "Add -ing to 'make'.", ["making"], "Drop the silent e before adding -ing: making."),
    mc(2, "Which is correct?", ["You're welcome.", "Your welcome."], "You're welcome.", "You're = you are. Your = belonging to you."),
    st(2, "Is each word spelt correctly?", ["Correct", "Wrong"], [["tomorrow", 0], ["untill", 1], ["beginning", 0], ["occured", 1], ["surprise", 0]], "Until has one l. Occurred has double c and double r."),

    mc(3, "Which word is spelt correctly?", ["embarrass", "embarass", "embarras", "embaress"], "embarrass", "Embarrass has double r and double s."),
    mc(3, "Choose the correct word: 'The new rule had a big ___ on students.'", ["effect", "affect"], "effect", "Effect is usually a noun (a result). Affect is usually a verb (to change something)."),
    typed(3, "Add the suffix -ful to 'beauty'.", ["beautiful"], "When a word ends in consonant + y, change the y to i: beautiful."),
    tw(3, "Tap the two misspelt words.", "The *restaraunt* was *definately* busy.", "The correct spellings are restaurant and definitely (it has 'finite' in it)."),
    mc(3, "Choose the correct word: 'The ___ of our school gave a speech.'", ["principal", "principle"], "principal", "The principal is the head of a school (think 'pal'). A principle is a rule or belief."),
    mt(3, "Match each prefix and word to the correct spelling.", [["dis + appear", "disappear"], ["mis + spell", "misspell"], ["un + necessary", "unnecessary"], ["im + mature", "immature"]], "Adding a prefix doesn't change the base word, so sometimes you get a double letter (misspell, unnecessary)."),
    mc(3, "Which word is spelt correctly?", ["conscience", "concience", "consience", "conscence"], "conscience", "Conscience is 'con' + 'science'."),
    od(3, "Put these words in alphabetical order.", ["thorough", "though", "thought", "through", "throw"], "A", "Z", "Compare letter by letter: thor, thou, thou-ght (longer than though), thro-u, thro-w."),
  ]);

  const FARM = "Sam's grandma lives on a farm near Ballarat. Every school holidays, Sam visits her. Each morning he feeds the chickens and collects the eggs in a blue basket. In the afternoon, they ride the old tractor down to the dam to check on the sheep. Sam's favourite job is giving the baby lamb its bottle of milk.";
  const LIBRARY = "The school library is getting a makeover. Over the summer, workers painted the walls bright yellow and added new beanbags to the reading corner. There are also six new computers near the front desk. Ms Tran, the librarian, says the best change is the new shelf of graphic novels, which students asked for in a survey last year.";
  const JESS = "Jess stared at the empty page. The story competition closed at midnight, and she still had nothing. She glanced at the clock: 9:45. Sighing, she pushed back her chair and wandered to the window. Outside, a possum was balancing on the fence, tail curled tight, stretching towards the lemon tree. Jess grinned, grabbed her pen and began to write.";
  const PHONES = "Every year, Australians throw away millions of mobile phones. Most end up in drawers or, worse, in landfill, where toxic metals can leak into the soil. Yet phones contain valuable materials such as gold, silver and copper that can be recovered and reused. Recycling a tonne of old phones can recover more gold than mining a tonne of ore. If every household recycled its old devices, we would save resources, protect the environment and even create jobs. Surely that is worth a trip to the drop-off bin.";
  const P = (passage) => ({ passage, showPassage: true });
  add("eng-reading", "eng-r-x", [
    mc(1, "Where does Sam's grandma live?", ["On a farm near Ballarat", "In the city", "By the beach", "In Sydney"], "On a farm near Ballarat", "The first sentence says she lives on a farm near Ballarat.", P(FARM)),
    typed(1, "What colour is the egg basket?", ["blue"], "Sam collects the eggs in a blue basket.", P(FARM)),
    mc(1, "What is Sam's favourite job?", ["Giving the baby lamb its bottle", "Feeding the chickens", "Riding the tractor", "Collecting the eggs"], "Giving the baby lamb its bottle", "The last sentence tells you his favourite job.", P(FARM)),
    od(1, "Put Sam's day in order.", ["He feeds the chickens", "He collects the eggs", "They ride the tractor to the dam"], "Morning", "Afternoon", "Each morning he feeds the chickens and collects eggs; in the afternoon they ride to the dam.", P(FARM)),
    tw(1, "Tap the word that tells you when Sam visits.", "Every school *holidays*, Sam visits her.", "He visits every school holidays.", P(FARM)),
    typed(1, "How many new computers are there?", ["6", "six"], "The passage says there are six new computers near the front desk.", P(LIBRARY)),
    mc(1, "What colour are the library walls now?", ["Bright yellow", "Blue", "White", "Green"], "Bright yellow", "Workers painted the walls bright yellow.", P(LIBRARY)),
    mc(1, "Who is Ms Tran?", ["The librarian", "The principal", "A student", "A painter"], "The librarian", "The passage says 'Ms Tran, the librarian'.", P(LIBRARY)),
    mc(1, "Why did the library add graphic novels?", ["Students asked for them in a survey", "They were cheap", "Ms Tran wrote them", "They were a gift"], "Students asked for them in a survey", "The last sentence says students asked for them in a survey last year.", P(LIBRARY)),

    mc(2, "How does Jess feel at the start of the passage?", ["Stuck and worried", "Excited", "Angry at a friend", "Sleepy and bored"], "Stuck and worried", "She has an empty page, the deadline is close and she has 'nothing'. Those clues suggest she's stuck and worried.", P(JESS)),
    mc(2, "About how long does Jess have before the competition closes?", ["About 2 and a quarter hours", "About 45 minutes", "About 9 hours", "About 12 hours"], "About 2 and a quarter hours", "From 9:45 pm to midnight is 2 hours and 15 minutes.", P(JESS)),
    mc(2, "What gives Jess an idea for her story?", ["A possum on the fence", "The clock", "Her mum", "A book"], "A possum on the fence", "Right after she watches the possum, she grins and starts writing.", P(JESS)),
    tw(2, "Tap the word that shows Jess's mood has changed.", "Jess *grinned*, grabbed her pen and began to write.", "Grinning shows she's now happy and excited, not stuck.", P(JESS)),
    od(2, "Put the events in order.", ["Jess stared at the empty page", "She glanced at the clock", "She wandered to the window", "She saw a possum on the fence", "She began to write"], "First", "Last", "Follow the passage from start to finish.", P(JESS)),
    mc(2, "What does 'Sighing' suggest about Jess?", ["She is frustrated", "She is laughing", "She is asleep", "She is scared"], "She is frustrated", "People often sigh when they're fed up or frustrated.", P(JESS)),
    mc(2, "What is the main idea of the passage?", ["Jess finds inspiration in something ordinary", "Possums like lemons", "Competitions are too hard", "Jess is late for school"], "Jess finds inspiration in something ordinary", "The passage is about Jess getting unstuck when she notices an everyday moment.", P(JESS)),

    mc(3, "What is the writer's main purpose?", ["To persuade readers to recycle old phones", "To explain how phones are made", "To sell new phones", "To tell a story about a phone"], "To persuade readers to recycle old phones", "The writer gives reasons and ends by urging the reader to act, which is persuasive writing.", P(PHONES)),
    mc(3, "Which of these is a fact rather than an opinion?", ["Phones contain gold, silver and copper", "Surely that is worth a trip to the drop-off bin", "Recycling is the best thing you can do", "Old phones are useless"], "Phones contain gold, silver and copper", "A fact can be checked and proven. The others are opinions or judgements.", P(PHONES)),
    tw(3, "Tap the word that shows the writer thinks landfill is the worst place for old phones.", "Most end up in drawers or, *worse*, in landfill.", "'Worse' shows the writer's judgement that landfill is the worst outcome.", P(PHONES)),
    mc(3, "What is the effect of the last sentence, 'Surely that is worth a trip to the drop-off bin'?", ["It uses confident, persuasive language to urge the reader to act", "It describes a sound", "It gives a statistic", "It compares two things using 'like'"], "It uses confident, persuasive language to urge the reader to act", "'Surely' makes it sound obvious, pushing the reader to agree and do something.", P(PHONES)),
    st(3, "Is each statement a fact or an opinion?", ["Fact", "Opinion"], [["Phones contain copper", 0], ["Everyone should recycle their phone", 1], ["Toxic metals can leak into soil", 0], ["Recycling is worth the effort", 1]], "Facts can be checked. Opinions say what someone thinks or believes.", P(PHONES)),
    mc(3, "According to the writer, which of these is NOT a benefit of recycling phones?", ["Making new phones cheaper", "Saving resources", "Protecting the environment", "Creating jobs"], "Making new phones cheaper", "The writer lists saving resources, protecting the environment and creating jobs, but never mentions price.", P(PHONES)),
    mc(3, "What does 'recovered' mean in this passage?", ["Taken back out so it can be used again", "Feeling better after being sick", "Covered up again", "Lost forever"], "Taken back out so it can be used again", "The metals are 'recovered and reused', so here it means taken back out of the old phones.", P(PHONES)),
  ]);

  add("eng-grammar", "eng-g-x", [
    st(1, "Is each word a noun, a verb or an adjective?", ["Noun", "Verb", "Adjective"], [["teacher", 0], ["run", 1], ["green", 2], ["city", 0], ["shout", 1], ["soft", 2]], "Nouns name things, verbs are actions, adjectives describe."),
    mc(1, "Choose the correct word: 'She ___ to school every day.'", ["walks", "walk", "walking", "were walk"], "walks", "With 'she' in the present tense, the verb adds -s: she walks."),
    tw(1, "Tap the proper noun.", "Yesterday *Olivia* went to the shops.", "Proper nouns name a particular person, place or thing, and start with a capital letter."),
    mc(2, "Which sentence is in the past tense?", ["We played cricket after school.", "We play cricket after school.", "We will play cricket after school.", "We are playing cricket after school."], "We played cricket after school.", "'Played' (with -ed) shows it already happened."),
    tw(2, "Tap the two adverbs.", "The dog barked *loudly* and ran *quickly* away.", "Adverbs describe how an action is done. Many end in -ly."),
    mt(2, "Match each sentence to its tense.", [["I ate", "past"], ["I eat", "present"], ["I will eat", "future"]], "Past = already happened, present = now, future = will happen."),
    mc(2, "Choose the correct word: 'This is the ___ cake I've ever tasted.'", ["best", "goodest", "better", "most good"], "best", "Good, better, best. Use 'best' when comparing three or more."),
    mc(3, "Which sentence is complex (a main clause plus a dependent clause)?", ["Although it was cold, we went swimming.", "It was cold.", "It was cold and we went swimming.", "Go swimming!"], "Although it was cold, we went swimming.", "'Although it was cold' can't stand alone. It depends on the main clause."),
    tw(3, "Tap the word that is the subject of the sentence (who did the action).", "The tall *girl* in the red hat won the race.", "The girl is the one who won. 'Tall' and 'in the red hat' just describe her."),
    mc(3, "Which sentence is in the active voice?", ["The dog chased the ball.", "The ball was chased by the dog.", "The ball was chased.", "The ball had been chased by the dog."], "The dog chased the ball.", "In the active voice the subject does the action: the dog chased."),
    st(3, "Is each one a complete sentence or a fragment?", ["Sentence", "Fragment"], [["The bus arrived late.", 0], ["Running down the hall.", 1], ["When we got home.", 1], ["She smiled.", 0]], "A complete sentence needs a subject and a verb and makes sense on its own."),
  ]);

  add("eng-vocab", "eng-v-x", [
    mt(1, "Match each word to a word that means the same.", [["small", "tiny"], ["fast", "quick"], ["shut", "close"], ["glad", "happy"]], "Synonyms have the same or similar meanings."),
    mc(1, "Which word means 'a person who writes books'?", ["author", "actor", "artist", "athlete"], "author", "An author writes books."),
    tw(1, "Tap the word that means 'very big'.", "We saw a *huge* whale near the boat.", "Huge means very big."),
    st(1, "Does each word mean the same as 'happy' or the opposite?", ["Same (synonym)", "Opposite (antonym)"], [["joyful", 0], ["miserable", 1], ["cheerful", 0], ["gloomy", 1]], "Joyful and cheerful are synonyms. Miserable and gloomy are antonyms."),
    mc(2, "'The puppy was timid and hid behind the couch.' What does 'timid' mean?", ["shy and easily scared", "very loud", "hungry", "sleepy"], "shy and easily scared", "Hiding behind the couch is the clue: timid means shy or nervous."),
    mt(2, "Match each suffix to its meaning.", [["-ful", "full of"], ["-less", "without"], ["-er", "a person who"], ["-able", "able to be"]], "hopeful, careless, teacher, washable."),
    tw(2, "Tap the word with a prefix that means 'not'.", "It was *impossible* to finish the test in time.", "Im- means not: impossible = not possible."),
    mc(3, "'Despite his fatigue, the runner persevered to the finish line.' What does 'persevered' mean?", ["kept going despite difficulty", "gave up", "walked slowly", "cheated"], "kept going despite difficulty", "'Despite his fatigue' tells you it was hard, but he still reached the finish."),
    mt(3, "Match each word root to its meaning.", [["aqua", "water"], ["port", "carry"], ["graph", "write"], ["micro", "small"]], "aquarium, transport, autograph, microscope."),
  ]);

  add("eng-figurative", "eng-f-x", [
    st(1, "Is each one a simile or a metaphor?", ["Simile", "Metaphor"], [["as light as a feather", 0], ["He is a shining star", 1], ["She swims like a fish", 0], ["The road is a ribbon", 1]], "Similes use 'like' or 'as'. Metaphors say something IS something else."),
    tw(1, "Tap the word that is onomatopoeia.", "The door slammed with a loud *bang*.", "Bang sounds like the noise it describes."),
    mc(1, "Which is an example of alliteration?", ["Big brown bears bounce", "The cat sat on the mat", "I am so tired", "It was very cold"], "Big brown bears bounce", "Alliteration repeats the same starting sound: b, b, b, b."),
    mt(2, "Match each idiom to its meaning.", [["cold feet", "nervous before something"], ["hit the books", "study hard"], ["once in a blue moon", "very rarely"], ["over the moon", "very happy"]], "Idioms mean something different from their literal words."),
    tw(2, "Tap the two words that personify the car.", "The old car *groaned* up the hill and *coughed* at the top.", "Groaning and coughing are human actions given to the car."),
    mc(2, "'My backpack weighs a million kilos!' Why does the writer exaggerate?", ["To show how heavy it feels", "Because it's true", "To compare it to an animal", "To copy a sound"], "To show how heavy it feels", "Hyperbole exaggerates for effect, here to show how heavy the bag feels."),
    mc(3, "'Hope is a candle in the dark.' What does this metaphor suggest?", ["Hope gives comfort when things are hard", "Candles are dangerous", "It is night time", "Hope is made of wax"], "Hope gives comfort when things are hard", "A candle gives light in darkness, just as hope helps in hard times."),
    st(3, "Which technique is each example?", ["Simile", "Personification", "Hyperbole"], [["The kettle screamed", 1], ["I've waited forever", 2], ["as tall as a giraffe", 0], ["The moon winked at me", 1], ["ran like a rocket", 0], ["a mountain of homework", 2]], "Similes compare with like/as, personification gives human actions, and hyperbole exaggerates."),
    tw(3, "Tap the oxymoron.", "It was an *open secret* that Sam liked Mia.", "'Open secret' joins opposites: something secret that everyone knows."),
  ]);

  // ------------------------------------------------------------ 4. The Cartesian Plane topic
  const cq = [];
  const plot = (d, prompt, targets, extra = {}, explanation = "") => cq.push({ d, prompt, visual: { type: "plot", targets, ...extra }, explanation });
  const read = (d, prompt, pt, label, extra = {}, explanation = "") => cq.push({ d, prompt, visual: { type: "plane", points: [{ x: pt[0], y: pt[1], label }], ...extra }, answerType: "point", point: pt, answer: `(${pt[0]}, ${pt[1]})`.replace(/-/g, "−"), explanation });
  const fmtP = (x, y) => `(${x}, ${y})`.replace(/-/g, "−");
  const path = (x, y) => `${x === 0 ? "Don't move across" : `Go ${Math.abs(x)} ${x > 0 ? "right" : "left"}`}, then ${y === 0 ? "don't move up or down" : `${Math.abs(y)} ${y > 0 ? "up" : "down"}`}.`;

  // Easy
  [[3, 5], [6, 2], [1, 4], [5, 5], [7, 3]].forEach(([x, y]) => plot(1, `Plot the point ${fmtP(x, y)}.`, [[x, y]], { min: 0, max: 8 }, `Start at the origin. ${path(x, y)}`));
  [[[4, 2], "A"], [[2, 6], "B"], [[5, 0], "C"]].forEach(([p, l]) => read(1, `What are the coordinates of point ${l}?`, p, l, { min: 0, max: 8 }, `${l} is ${p[0]} across and ${p[1]} up, so ${l} = ${fmtP(...p)}.`));
  plot(1, "Plot the origin.", [[0, 0]], { min: -5, max: 5 }, "The origin is where the x-axis and y-axis cross: (0, 0).");
  plot(1, "Plot the point (0, 3).", [[0, 3]], { min: 0, max: 8 }, "x = 0, so don't move across. Go 3 up — the point sits on the y-axis.");
  plot(1, "Plot the point (4, 0).", [[4, 0]], { min: 0, max: 8 }, "Go 4 right and don't move up — the point sits on the x-axis.");
  cq.push({ d: 1, prompt: "What is the x-coordinate of point P?", visual: { type: "plane", min: 0, max: 8, points: [{ x: 6, y: 3, label: "P" }] }, answer: 6, explanation: "P = (6, 3). The x-coordinate comes first: 6." });
  cq.push({ d: 1, prompt: "What is the y-coordinate of point Q?", visual: { type: "plane", min: 0, max: 8, points: [{ x: 2, y: 7, label: "Q" }] }, answer: 7, explanation: "Q = (2, 7). The y-coordinate comes second: 7." });
  cq.push({ d: 1, prompt: "Which quadrant is point P in?", visual: { type: "plane", points: [{ x: 3, y: 4, label: "P" }] }, options: QUAD, answer: QUAD[0], explanation: "Both coordinates are positive, so P is in the 1st quadrant (top right)." });
  cq.push({ d: 1, prompt: "Which quadrant is point P in?", visual: { type: "plane", points: [{ x: -3, y: 4, label: "P" }] }, options: QUAD, answer: QUAD[1], explanation: "x is negative and y is positive, so P is in the 2nd quadrant (top left)." });
  // Medium
  [[-3, 4], [2, -5], [-4, -2], [-5, 0], [0, -4]].forEach(([x, y]) => plot(2, `Plot the point ${fmtP(x, y)}.`, [[x, y]], {}, `Start at the origin. ${path(x, y)}`));
  [[[-4, 3], "A"], [[5, -2], "B"], [[-2, -5], "C"], [[0, -3], "D"]].forEach(([p, l]) => read(2, `What are the coordinates of point ${l}?`, p, l, {}, `${path(p[0], p[1])} So ${l} = ${fmtP(...p)}.`));
  cq.push({ d: 2, prompt: "Which quadrant is point P in?", visual: { type: "plane", points: [{ x: -5, y: -2, label: "P" }] }, options: QUAD, answer: QUAD[2], explanation: "Both coordinates are negative, so P is in the 3rd quadrant (bottom left)." });
  cq.push({ d: 2, prompt: "Which quadrant is point P in?", visual: { type: "plane", points: [{ x: 4, y: -6, label: "P" }] }, options: QUAD, answer: QUAD[3], explanation: "x is positive and y is negative, so P is in the 4th quadrant (bottom right)." });
  plot(2, "Point B is 3 units to the left of point A. Plot point B.", [[-1, 3]], { points: [{ x: 2, y: 3, label: "A" }] }, "A = (2, 3). Moving left changes x: 2 − 3 = −1, so B = (−1, 3).");
  plot(2, "Point Q is 4 units below point P. Plot point Q.", [[-3, -2]], { points: [{ x: -3, y: 2, label: "P" }] }, "P = (−3, 2). Moving down changes y: 2 − 4 = −2, so Q = (−3, −2).");
  plot(2, "Plot both points: A(−2, 1) and B(3, −4).", [[-2, 1], [3, -4]], { labels: ["A", "B"] }, "A: 2 left, 1 up. B: 3 right, 4 down.");
  plot(2, "Plot both points: C(4, 4) and D(−4, −4).", [[4, 4], [-4, -4]], { labels: ["C", "D"] }, "C: 4 right, 4 up. D: 4 left, 4 down.");
  // Hard
  plot(3, "ABCD is a rectangle. Plot the missing corner D.", [[-3, -1]], { points: [{ x: -3, y: 2, label: "A" }, { x: 4, y: 2, label: "B" }, { x: 4, y: -1, label: "C" }] }, "D must be below A and level with C: D = (−3, −1).");
  plot(3, "ABCD is a rectangle. Plot the missing corner D.", [[2, -1]], { points: [{ x: -4, y: -1, label: "A" }, { x: -4, y: 3, label: "B" }, { x: 2, y: 3, label: "C" }] }, "D must be level with A and below C: D = (2, −1).");
  plot(3, "ABCD is a square. Plot the missing corner D.", [[-2, 2]], { points: [{ x: -2, y: -2, label: "A" }, { x: 2, y: -2, label: "B" }, { x: 2, y: 2, label: "C" }] }, "D is above A and level with C: D = (−2, 2).");
  plot(3, "Plot the reflection of P in the x-axis.", [[3, -4]], { points: [{ x: 3, y: 4, label: "P" }] }, "Reflecting in the x-axis changes the sign of y: (3, 4) → (3, −4).");
  plot(3, "Plot the reflection of P in the y-axis.", [[2, 5]], { points: [{ x: -2, y: 5, label: "P" }] }, "Reflecting in the y-axis changes the sign of x: (−2, 5) → (2, 5).");
  plot(3, "Plot the reflection of Q in the y-axis.", [[-4, -3]], { points: [{ x: 4, y: -3, label: "Q" }] }, "Reflecting in the y-axis changes the sign of x: (4, −3) → (−4, −3).");
  plot(3, "Plot the point exactly halfway between A and B (the midpoint).", [[-1, 3]], { points: [{ x: -4, y: 1, label: "A" }, { x: 2, y: 5, label: "B" }] }, "Average the coordinates: x = (−4 + 2) ÷ 2 = −1 and y = (1 + 5) ÷ 2 = 3.");
  plot(3, "Plot the midpoint of A and B.", [[1, -1]], { points: [{ x: -3, y: -4, label: "A" }, { x: 5, y: 2, label: "B" }] }, "x = (−3 + 5) ÷ 2 = 1 and y = (−4 + 2) ÷ 2 = −1.");
  plot(3, "The line shows y = x + 2. Plot the point on the line where x = 3.", [[3, 5]], { lines: [{ m: 1, c: 2, label: "y = x + 2" }] }, "When x = 3, y = 3 + 2 = 5, so plot (3, 5).");
  plot(3, "The rule is y = 2x − 1. Plot the point on this rule where x = 2.", [[2, 3]], {}, "When x = 2, y = 2 × 2 − 1 = 3, so plot (2, 3).");
  plot(3, "The rule is y = −x + 1. Plot the point on this rule where x = −3.", [[-3, 4]], {}, "When x = −3, y = 3 + 1 = 4, so plot (−3, 4).");
  cq.push({ d: 3, prompt: "How many units apart are points A and B?", visual: { type: "plane", points: [{ x: -3, y: 2, label: "A" }, { x: 4, y: 2, label: "B" }] }, answer: 7, explanation: "They are on the same horizontal line, so subtract the x-coordinates: 4 − (−3) = 7." });
  cq.push({ d: 3, prompt: "How many units apart are points C and D?", visual: { type: "plane", points: [{ x: 1, y: -4, label: "C" }, { x: 1, y: 2, label: "D" }] }, answer: 6, explanation: "They are on the same vertical line, so subtract the y-coordinates: 2 − (−4) = 6." });
  plot(3, "Point P(−2, 3) moves 5 units right and 4 units down. Plot where it ends up.", [[3, -1]], { points: [{ x: -2, y: 3, label: "P" }] }, "x: −2 + 5 = 3. y: 3 − 4 = −1. New point: (3, −1).");
  plot(3, "Point M(4, −1) moves 6 units left and 3 units up. Plot where it ends up.", [[-2, 2]], { points: [{ x: 4, y: -1, label: "M" }] }, "x: 4 − 6 = −2. y: −1 + 3 = 2. New point: (−2, 2).");

  const cartesian = {
    id: "y7-cartesian", name: "The Cartesian Plane", icon: "📍",
    blurb: "Plotting and reading coordinates in all four quadrants, plus reflections and rules.",
    recap: "Using an (x, y) grid to describe positions: plotting points, reading coordinates and moving points around.",
    example: "Finding a seat in a theatre by its row and number, or a square on a map grid, works just like coordinates.",
    workedExample: {
      1: { question: "Plot the point (4, 2).", walkthrough: "Start at the origin (0, 0). The first number is x, so go 4 to the right. The second number is y, so go 2 up. Put your dot there." },
      2: { question: "What are the coordinates of a point 3 left and 5 down from the origin?", walkthrough: "Left is negative x and down is negative y, so the point is (−3, −5). It is in the 3rd quadrant." },
      3: { question: "Reflect the point (2, −6) in the y-axis.", walkthrough: "Reflecting in the y-axis flips left and right, so only the sign of x changes: (2, −6) becomes (−2, −6)." },
    },
    questions: cq.map((item, i) => {
      const { d, ...rest } = item;
      const q = { id: `y7-cart${i + 1}`, difficulty: d, ...rest };
      if (q.options) q.answerType = "text";
      if (isVisualInput(q)) q.answer = visualAnswerText(q);
      return q;
    }),
  };
  const at = MATHS.findIndex((t) => t.id === "y7-negatives");
  MATHS.splice(at + 1, 0, cartesian);

  if (typeof TOPIC_LESSONS !== "undefined") {
    TOPIC_LESSONS["y7-cartesian"] = [
      { title: "What is the Cartesian plane?",
        text: "It's a grid made from two number lines that cross at right angles. The horizontal one is the x-axis and the vertical one is the y-axis. They cross at the origin, (0, 0).",
        visual: { type: "plane", points: [{ x: 0, y: 0, label: "origin" }, { x: 3, y: 2, label: "(3, 2)" }, { x: -4, y: -3, label: "(−4, −3)" }] } },
      { title: "Coordinates (x, y)",
        points: ["A point's position is written (x, y) — always x first, then y.", "From the origin, go across first (right for positive, left for negative), then up or down.", "(3, −2) means 3 right, then 2 down.", "Memory trick: 'along the corridor, then up the stairs'."],
        tip: "Mixing up x and y is the most common mistake. x is across, y is up." },
      { title: "The four quadrants",
        points: ["1st quadrant (top right): x positive, y positive.", "2nd quadrant (top left): x negative, y positive.", "3rd quadrant (bottom left): both negative.", "4th quadrant (bottom right): x positive, y negative.", "Points on an axis aren't in any quadrant."],
        tip: "The quadrants are numbered anticlockwise, starting at the top right." },
      { title: "Moving and reflecting points",
        points: ["Moving right or left changes x. Moving up or down changes y.", "Reflecting in the x-axis changes the sign of y: (3, 4) → (3, −4).", "Reflecting in the y-axis changes the sign of x: (−2, 5) → (2, 5).", "Two points on the same horizontal line: the distance between them is the difference in x."] },
      { title: "Graphing a rule",
        text: "A rule like y = 2x + 1 gives a straight line. Pick some x values, work out y, then plot each (x, y).",
        points: ["x = 0 → y = 1, so plot (0, 1).", "x = 1 → y = 3, so plot (1, 3).", "x = 2 → y = 5, so plot (2, 5)."],
        visual: { type: "plane", min: -1, max: 6, lines: [{ m: 2, c: 1, label: "y = 2x + 1" }], points: [{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 5 }] } },
    ];
  }
})();
