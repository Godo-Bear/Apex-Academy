/* Textbook-style questions for every topic: Problem-solving, Reasoning and Enrichment, beside the everyday
   (Fluency) questions. Multi-part problems share one scenario (shown above the parts, like a reading passage),
   and every question here shows its style as a label. Runs after coverage.js, before app.js. */
(function () {
  "use strict";
  const { mc, num, build } = window.__moreTopicTools;
  const all = [...YEAR_LEVELS[0].topics, ...ENGLISH_TOPICS, ...SCIENCE_TOPICS];
  const add = (id, list) => {
    const t = all.find((x) => x.id === id);
    if (t) t.questions.push(...build(`${id}-pr`, list.flat()));
  };
  // A scenario with several parts, all labelled with one style.
  const set = (style, stem, parts) => parts.map((q) => ({ ...q, style, passage: stem }));
  const one = (style, q) => ({ ...q, style });
  const PS = "Problem-solving", RE = "Reasoning", EN = "Enrichment";
  const plot = (d, prompt, targets, extra, explanation) => ({ d, prompt, visual: { type: "plot", targets, ...extra }, explanation });

  // ================================================================ Maths
  add("y7-computation", [
    set(PS, "A school canteen sells 236 pies a week at $4 each. Each pie costs the canteen $2.50 to buy.", [
      num(2, "How much money does the canteen take from pie sales in a week, in dollars?", 944, "236 × $4 = $944."),
      num(3, "What is the canteen's profit on pies in a week, in dollars?", 354, "Profit per pie = $4 − $2.50 = $1.50. 236 × $1.50 = $354."),
      num(3, "What is the profit over a 40-week school year, in dollars?", 14160, "$354 × 40 = $14 160."),
    ]),
    one(RE, mc(2, "Mia says 20 − 8 ÷ 2 = 6. Is she right?", ["No — divide first: 20 − 4 = 16", "Yes — 12 ÷ 2 = 6", "No — the answer is 14", "Yes — always work left to right"], "Division comes before subtraction (BIDMAS), so 8 ÷ 2 = 4 first, then 20 − 4 = 16.")),
    one(EN, mc(3, "Where do brackets go to make 6 + 4 × 5 − 2 = 48 true?", ["(6 + 4) × 5 − 2", "6 + 4 × (5 − 2)", "6 + (4 × 5) − 2", "(6 + 4 × 5) − 2"], "(6 + 4) × 5 − 2 = 10 × 5 − 2 = 48. The others give 18, 24 and 24.")),
  ]);
  add("y7-numberprops", [
    set(PS, "Two buses leave the station together at 7:00 am. Bus A returns every 15 minutes and bus B every 25 minutes.", [
      num(2, "After how many minutes will both buses next be back at the station together?", 75, "Find the LCM of 15 and 25. Multiples of 25: 25, 50, 75 … 75 is also a multiple of 15."),
      mc(3, "At what time will they next leave together?", ["8:15 am", "7:40 am", "8:00 am", "7:75 am"], "75 minutes = 1 hour 15 minutes after 7:00 am = 8:15 am."),
    ]),
    one(RE, mc(3, "Can the product of two prime numbers ever be prime?", ["No — it will always have those two primes as factors", "Yes, always", "Only for even primes", "Only when both are odd"], "e.g. 3 × 5 = 15 has factors 1, 3, 5 and 15 — more than two, so it's composite.")),
    one(EN, num(3, "How many square numbers lie between 1 and 100 (not counting 1 and 100)?", 8, "4, 9, 16, 25, 36, 49, 64, 81 — that's 8.")),
  ]);
  add("y7-fdp", [
    set(PS, "A class of 30 students voted for a sport: 2/5 chose soccer, 30% chose basketball and the rest chose swimming.", [
      num(1, "How many students chose soccer?", 12, "2/5 of 30 = 30 ÷ 5 × 2 = 12."),
      num(2, "How many students chose basketball?", 9, "30% of 30 = 0.3 × 30 = 9."),
      num(3, "What percentage chose swimming?", 30, "Swimming = 30 − 12 − 9 = 9 students. 9 ÷ 30 × 100 = 30%."),
    ]),
    one(RE, mc(2, "Jo says 1/3 + 1/4 = 2/7. What's wrong?", ["You can't add the denominators — use a common denominator: 4/12 + 3/12 = 7/12", "Nothing, it's right", "It should be 2/12", "It should be 1/7"], "Only add numerators once the denominators match.")),
    one(EN, num(3, "What number is exactly halfway between 1/4 and 1/2? Give it as a decimal.", 0.375, "1/4 = 0.25 and 1/2 = 0.5. Halfway: (0.25 + 0.5) ÷ 2 = 0.375 (that's 3/8).")),
  ]);
  add("y7-algebra", [
    set(PS, "A rectangle has length 2x + 3 and width x.", [
      mc(2, "Which expression gives its perimeter?", ["6x + 6", "3x + 3", "4x + 6", "2x² + 3x"], "2(2x + 3) + 2x = 4x + 6 + 2x = 6x + 6."),
      num(2, "What is the perimeter when x = 4?", 30, "6 × 4 + 6 = 30."),
      num(3, "If the perimeter is 48, what is x?", 7, "6x + 6 = 48 → 6x = 42 → x = 7."),
    ]),
    one(RE, mc(2, "Are 2(x + 3) and 2x + 3 equivalent?", ["No — 2(x + 3) = 2x + 6", "Yes, always", "Only when x = 0", "Only when x = 3"], "The 2 multiplies BOTH terms in the brackets.")),
    one(EN, num(3, "Shape n of a pattern uses 4n + 1 matchsticks. Which shape number uses 81 matchsticks?", 20, "4n + 1 = 81 → 4n = 80 → n = 20.")),
  ]);
  add("y7-decimals", [
    set(PS, "Jade buys 2.5 kg of apples at $3.80 per kg and 1.2 kg of grapes at $6.50 per kg. She pays with a $20 note.", [
      num(2, "How much do the apples cost, in dollars?", 9.5, "2.5 × 3.80 = 9.50."),
      num(2, "How much do the grapes cost, in dollars?", 7.8, "1.2 × 6.50 = 7.80."),
      num(3, "How much change does Jade get, in dollars?", 2.7, "Total = 9.50 + 7.80 = 17.30. Change = 20 − 17.30 = 2.70."),
    ]),
    one(RE, mc(2, "Why is 0.5 × 0.4 smaller than 0.5?", ["Multiplying by a number less than 1 makes the answer smaller", "Decimals always get smaller", "Because 0.4 is even", "It isn't smaller"], "0.5 × 0.4 means 'four-tenths of 0.5', which is 0.2.")),
    one(EN, num(3, "What number is exactly halfway between 2.35 and 2.4?", 2.375, "(2.35 + 2.40) ÷ 2 = 4.75 ÷ 2 = 2.375.")),
  ]);
  add("y7-negatives", [
    set(PS, "One winter morning the temperatures were: Ballarat −3 °C, Mt Buller −8 °C and Melbourne 6 °C.", [
      num(1, "How many degrees warmer was Melbourne than Mt Buller?", 14, "6 − (−8) = 6 + 8 = 14 °C."),
      num(2, "Mt Buller warms by 2 °C each hour. After how many hours does it reach 0 °C?", 4, "It needs to rise 8 °C: 8 ÷ 2 = 4 hours."),
      num(3, "What was the mean (average) of the three temperatures, to 2 decimal places?", -1.67, "(−3 + −8 + 6) ÷ 3 = −5 ÷ 3 = −1.666… ≈ −1.67 °C.", 0.01),
    ]),
    one(RE, mc(3, "Why is (−3)² positive but −3² negative?", ["(−3)² squares −3; −3² squares 3 and then makes it negative", "They're both positive", "They're both negative", "Brackets don't matter"], "(−3)² = (−3) × (−3) = 9, but −3² = −(3 × 3) = −9.")),
    one(EN, num(3, "Two integers add to −2 and multiply to −15. What is the larger one?", 3, "Try factor pairs of −15: 3 and −5 add to −2 ✓. The larger is 3.")),
  ]);
  const T14 = [[-3, -7], [-2, -5], [-1, -3], [0, -1], [1, 1], [2, 3], [3, 5]];
  add("y7-cartesian", [
    set(PS, "Join the points in order to make a shape.", [
      mc(1, "What shape do A(−2, 0), B(0, 3) and C(2, 0) make?", ["Triangle", "Square", "Rectangle", "Parallelogram"], "Three points that aren't in a line make a triangle (this one is isosceles)."),
      mc(2, "What shape do A(−3, −1), B(−3, 2), C(1, 2) and D(1, −1) make?", ["Rectangle", "Square", "Trapezium", "Kite"], "AB and CD are vertical (3 long), BC and AD are horizontal (4 long). Right angles with sides 3 and 4: a rectangle."),
      mc(3, "What shape do A(−4, −1), B(−3, 2), C(2, 2) and D(1, −1) make?", ["Parallelogram", "Rectangle", "Square", "Kite"], "BC and AD are both 5 long and horizontal, and AB and DC slope the same way (1 right, 3 up) — opposite sides parallel and equal, but no right angles."),
    ]),
    set(PS, "The points lie on a straight line.", [
      num(3, "A(−2, 0), B(−1, y) and C(0, 4) lie on a straight line. What is the y-coordinate of B?", 2, "From A to C, x goes up 2 and y goes up 4, so y rises 2 for every 1 across. B is 1 across from A: y = 0 + 2 = 2."),
      num(3, "A(−4, 8), B(−1, y) and C(2, −2) lie on a straight line. What is the y-coordinate of B?", 3, "From A to C, x goes up 6 and y falls 10. B is halfway (3 of the 6 across), so y falls 5: 8 − 5 = 3."),
    ]),
    one(PS, num(3, "Karen's bushwalk starts at (2, 2) on a grid map where each square is 1 km. She walks to (2, −7), then (−4, −7), then (−4, 0), then (2, 0). How far has she walked, in km?", 28, "Each leg is straight along a grid line: 9 + 6 + 7 + 6 = 28 km.")),
    set(RE, "Consider the points A(−2, 5), B(0, 2) and C(3, −2).", [
      mc(2, "Which point is closest to the origin (0, 0)?", ["B", "A", "C"], "B is 2 units straight up from the origin. A and C are further: A is 2 across and 5 up; C is 3 across and 2 down."),
      mc(3, "Which point is furthest from the origin?", ["A", "B", "C"], "A is 2 across and 5 up — the biggest combined distance (√29 ≈ 5.4, compared with C: √13 ≈ 3.6)."),
    ]),
    set(RE, "A point P(a, b) can be in any of the four quadrants.", [
      mc(2, "If a > 0, which quadrants could P be in?", ["1st or 4th", "1st or 2nd", "2nd or 3rd", "3rd or 4th"], "a is the x-coordinate. Positive x means the right-hand side: quadrants 1 and 4."),
      mc(2, "If a > 0 and b < 0, which quadrant is P in?", ["4th", "1st", "2nd", "3rd"], "Right (x positive) and down (y negative): the 4th quadrant."),
      mc(3, "If a < 0 and b < 0, which quadrant is P in?", ["3rd", "2nd", "4th", "1st"], "Left and down: the 3rd quadrant."),
    ]),
    set(EN, "Rules and graphs: the rule is y = 2x − 1.", [
      mc(2, "Complete the table: when x = −3, −2, −1, 0, 1, 2, 3, what are the y values?", ["−7, −5, −3, −1, 1, 3, 5", "−5, −3, −1, 1, 3, 5, 7", "−6, −4, −2, 0, 2, 4, 6", "−7, −4, −1, 0, 1, 4, 7"], "Substitute each x: 2 × (−3) − 1 = −7, 2 × (−2) − 1 = −5 … 2 × 3 − 1 = 5."),
      plot(3, "Plot all seven (x, y) pairs for y = 2x − 1, using x = −3 to 3.", T14, { xmin: -3, xmax: 3, ymin: -7, ymax: 5 }, "The points are (−3, −7), (−2, −5), (−1, −3), (0, −1), (1, 1), (2, 3), (3, 5)."),
      mc(3, "What do you notice about the seven points?", ["They form a straight line rising 2 for every 1 across", "They form a curve", "They are all in the 1st quadrant", "They form a square"], "Every linear rule gives a straight line; the 2 in 2x makes it rise 2 for each step right."),
    ]),
  ]);
  add("y7-geometry", [
    set(PS, "In triangle ABC, angle A is 20° bigger than angle B, and angle C is 70°.", [
      num(2, "What is angle B, in degrees?", 45, "A + B = 180 − 70 = 110. B + 20 + B = 110 → 2B = 90 → B = 45°."),
      num(2, "What is angle A, in degrees?", 65, "A = B + 20 = 65°."),
      mc(3, "What kind of triangle is ABC?", ["Acute-angled and scalene", "Right-angled", "Obtuse-angled", "Equilateral"], "Its angles are 65°, 45° and 70° — all acute and all different, so all sides are different too."),
    ]),
    one(RE, mc(2, "Can a triangle have two obtuse angles?", ["No — two obtuse angles already add to more than 180°", "Yes", "Only if it's isosceles", "Only if it's right-angled"], "Each obtuse angle is over 90°, so two of them would be over 180° — impossible.")),
    one(EN, num(3, "Each exterior angle of a regular polygon is 40°. How many sides does it have?", 9, "Exterior angles of any polygon add to 360°: 360 ÷ 40 = 9 sides.")),
  ]);
  add("y7-statsprob", [
    set(PS, "Seven test scores: 12, 15, 15, 18, 20, 22, 45.", [
      num(2, "What is the mean?", 21, "Total = 147. 147 ÷ 7 = 21."),
      num(2, "What is the median?", 18, "They're already in order; the middle (4th) value is 18."),
      mc(3, "Which better describes a typical score?", ["The median — the 45 is an outlier that drags the mean up", "The mean", "The range", "The mode"], "Six of the seven scores are below the mean of 21, so the median is more typical."),
    ]),
    one(RE, mc(2, "A fair coin lands heads 5 times in a row. What is the chance of heads on the next toss?", ["Still 1/2", "Less than 1/2", "More than 1/2", "0"], "Each toss is independent — the coin has no memory.")),
    one(EN, num(3, "Two dice are rolled and the numbers are added. How many of the 36 outcomes give a total of 7?", 6, "1+6, 2+5, 3+4, 4+3, 5+2, 6+1 — 6 ways, the most of any total.")),
  ]);
  add("y7-equations", [
    set(PS, "A taxi charges $3.50 flagfall plus $2.20 per km. A trip costs $25.50.", [
      mc(2, "Which equation shows this trip (k = kilometres)?", ["2.2k + 3.5 = 25.5", "3.5k + 2.2 = 25.5", "2.2 + 3.5 = 25.5k", "k = 25.5"], "$2.20 for each km (2.2k) plus the $3.50 flagfall."),
      num(3, "How many km was the trip?", 10, "2.2k + 3.5 = 25.5 → 2.2k = 22 → k = 10."),
    ]),
    one(RE, mc(1, "Ben solves x + 5 = 12 and gets x = 17. What did he do wrong?", ["He added 5 instead of subtracting it", "Nothing", "He divided by 5", "He forgot to multiply"], "To undo + 5, subtract 5 from both sides: x = 7.")),
    one(EN, num(3, "I think of a number, add 4, multiply by 3 and get 39. What was my number?", 9, "Work backwards: 39 ÷ 3 = 13, then 13 − 4 = 9.")),
  ]);
  add("y7-measurement", [
    set(PS, "A rectangular backyard is 12 m by 8 m. It contains a 4 m by 3 m shed; the rest is lawn.", [
      num(1, "What is the area of the whole backyard, in m²?", 96, "12 × 8 = 96 m²."),
      num(2, "What is the area of lawn, in m²?", 84, "Shed = 4 × 3 = 12 m². Lawn = 96 − 12 = 84 m²."),
      num(3, "Lawn seed costs $2.50 per m². How much to seed the whole lawn, in dollars?", 210, "84 × $2.50 = $210."),
    ]),
    one(RE, mc(2, "If you double both the length and width of a rectangle, its area…", ["Becomes 4 times as big", "Doubles", "Stays the same", "Triples"], "e.g. 2 × 3 = 6, but 4 × 6 = 24, which is 4 times 6.")),
    one(EN, num(3, "A cube's edges are doubled from 3 cm to 6 cm. How many times bigger is its volume?", 8, "27 cm³ → 216 cm³, and 216 ÷ 27 = 8 (2 × 2 × 2).")),
  ]);
  add("y7-ratios", [
    set(PS, "A fruit punch is made from orange juice, pineapple juice and lemonade in the ratio 3 : 2 : 5.", [
      mc(2, "What fraction of the punch is lemonade?", ["1/2", "5/3", "1/5", "2/5"], "3 + 2 + 5 = 10 parts, and 5 are lemonade: 5/10 = 1/2."),
      num(3, "How many mL of orange juice are needed for 4 L (4000 mL) of punch?", 1200, "One part = 4000 ÷ 10 = 400 mL. Orange = 3 × 400 = 1200 mL."),
    ]),
    one(RE, mc(1, "Is the ratio 4 : 6 the same as 6 : 4?", ["No — order matters in a ratio", "Yes", "Only for fractions", "Only once simplified"], "4 boys : 6 girls is very different from 6 boys : 4 girls.")),
    one(EN, num(3, "A map's scale is 1 : 50 000. A park on the map is 2 cm by 3 cm. What is the park's real area, in km²?", 1.5, "2 cm → 100 000 cm = 1 km. 3 cm → 1.5 km. Area = 1 × 1.5 = 1.5 km².")),
  ]);
  add("y7-money", [
    set(PS, "A shop has 20% off everything. Jess buys shoes marked $120 and a shirt marked $45.", [
      num(1, "What is the total before the discount, in dollars?", 165, "120 + 45 = 165."),
      num(2, "How much is the discount, in dollars?", 33, "20% of 165 = 0.2 × 165 = 33."),
      num(2, "How much does Jess pay, in dollars?", 132, "165 − 33 = 132 (or 0.8 × 165)."),
    ]),
    one(RE, mc(3, "Is 50% off, followed by another 50% off the sale price, the same as getting it free?", ["No — you still pay 25% of the original price", "Yes", "No — you pay 50%", "No — you pay 75%"], "Half of a half is a quarter: $100 → $50 → $25.")),
    one(EN, num(3, "$200 is invested and grows by 10% each year. What is it worth after 2 years, in dollars?", 242, "Year 1: 200 × 1.1 = 220. Year 2: 220 × 1.1 = 242. (The second year earns interest on the interest.)")),
  ]);
  add("y7-linear", [
    set(PS, "A plumber charges C = 40h + 60 dollars for h hours of work.", [
      num(1, "What does a 3-hour job cost, in dollars?", 180, "40 × 3 + 60 = 180."),
      mc(2, "What does the 60 in the rule represent?", ["A fixed call-out fee", "The hourly rate", "The number of hours", "The total cost"], "It's charged no matter how many hours — a one-off fee."),
      num(3, "A job costs $340. How many hours did it take?", 7, "40h + 60 = 340 → 40h = 280 → h = 7."),
    ]),
    one(RE, mc(2, "Why does y = 3x + 1 make a straight-line graph?", ["y goes up by the same amount (3) every time x goes up by 1", "It has a plus sign", "x is never negative", "Because 3 is odd"], "A constant rate of change gives a straight line.")),
    one(EN, plot(3, "Complete a table for y = 4 − x using x = −1, 0, 1, 2, 3 and 4, then plot all six points.", [[-1, 5], [0, 4], [1, 3], [2, 2], [3, 1], [4, 0]], { xmin: -2, xmax: 5, ymin: -1, ymax: 6 }, "y = 5, 4, 3, 2, 1, 0. The points make a straight line sloping down.")),
  ]);
  add("y7-transform", [
    set(PS, "Triangle PQR has corners P(1, 1), Q(4, 1) and R(1, 3).", [
      mc(2, "PQR is reflected in the y-axis. Where does Q end up?", ["(−4, 1)", "(4, −1)", "(−4, −1)", "(1, 4)"], "Reflecting in the y-axis changes the sign of x: (4, 1) → (−4, 1)."),
      mc(2, "PQR is rotated 180° about the origin. Where does R end up?", ["(−1, −3)", "(1, −3)", "(−1, 3)", "(3, 1)"], "A half-turn changes both signs: (1, 3) → (−1, −3)."),
      plot(3, "PQR is translated 2 left and 3 up. Plot where P ends up.", [[-1, 4]], { points: [{ x: 1, y: 1, label: "P" }, { x: 4, y: 1, label: "Q" }, { x: 1, y: 3, label: "R" }] }, "P(1, 1) → (1 − 2, 1 + 3) = (−1, 4)."),
    ]),
    one(RE, mc(1, "Does a reflection change the size of a shape?", ["No — the image is congruent (same size and shape)", "Yes, it doubles", "Yes, it halves", "Only for triangles"], "Reflections, translations and rotations only move a shape.")),
    one(EN, mc(3, "Which capital letter has a line of symmetry AND rotational symmetry of order 2?", ["H", "N", "S", "A"], "H folds both ways and looks the same upside down. N and S only have rotational symmetry; A only has a line.")),
  ]);
  add("y7-3d", [
    set(PS, "A cereal box is a rectangular prism 30 cm tall, 20 cm wide and 8 cm deep.", [
      num(2, "What is its volume, in cm³?", 4800, "30 × 20 × 8 = 4800 cm³."),
      num(3, "How much cardboard is needed (its surface area), in cm²?", 2000, "Faces: 30 × 20 = 600, 30 × 8 = 240, 20 × 8 = 160. Two of each: 2 × 1000 = 2000 cm²."),
    ]),
    one(RE, mc(3, "Could a polyhedron have 6 faces, 8 vertices and 10 edges?", ["No — F + V − E would be 4, not 2", "Yes", "Only if it's a pyramid", "Only if it's a prism"], "Euler's formula says F + V − E = 2 for every polyhedron. 6 + 8 − 10 = 4.")),
    one(EN, num(2, "A classic soccer ball is made of 12 pentagons and 20 hexagons. How many faces is that?", 32, "12 + 20 = 32 faces.")),
  ]);

  // ================================================================ English
  add("eng-punctuation", [
    set(PS, "Fix this sentence: my friend sarah said lets go to the beach on saturday", [
      mc(2, "Which is the correctly punctuated version?", ["My friend Sarah said, \"Let's go to the beach on Saturday.\"", "my friend Sarah said lets go to the beach on Saturday.", "My friend sarah said, \"Lets go to the beach on saturday\"", "My Friend Sarah Said Let's Go To The Beach On Saturday."], "Capitals for the start, names and days; a comma and speech marks around the spoken words; an apostrophe in let's (let us)."),
      num(2, "How many capital letters does the corrected sentence need?", 4, "My, Sarah, Let's and Saturday."),
    ]),
    one(RE, mc(2, "Why does 'the dog's bone' have an apostrophe but 'the dogs barked' doesn't?", ["dog's shows the bone belongs to the dog; dogs is just a plural", "Both should have one", "Neither should have one", "Apostrophes show plurals"], "Apostrophes show ownership or missing letters — never a plain plural.")),
    one(EN, mc(3, "How do the commas change 'I love cooking, my family, and my pets'?", ["They make clear these are three separate things you love", "Nothing changes", "They make it a question", "They show ownership"], "Without commas, 'I love cooking my family and my pets' sounds alarming!")),
  ]);
  add("eng-spelling", [
    set(PS, "Proofread: Yesterday we went to the libary. It was definately the best excursion becuase we recieved free books.", [
      num(2, "How many words are misspelt?", 4, "libary (library), definately (definitely), becuase (because), recieved (received)."),
      mc(2, "What is the correct spelling of 'recieved'?", ["received", "recieved", "receeved", "resieved"], "i before e, except after c: received."),
    ]),
    one(RE, mc(3, "Why is 'hopping' spelt with two p's but 'hoping' with one?", ["Hop has a short vowel, so double the p; hope drops its e before -ing", "There's no reason", "Both have two p's", "Hope ends in p"], "Doubling keeps the short vowel sound: hop → hopping; hope → hoping.")),
    one(EN, mc(3, "'Photograph' comes from Greek 'photo' (light) + 'graph'. What does 'graph' mean?", ["Write or draw", "Far", "Small", "Sound"], "A photograph is 'drawing with light' — also autograph, graphic, paragraph.")),
  ]);
  const DIVE = "Leah stood at the edge of the diving board, toes curled over the rough edge. Below, the water glittered, impossibly far away. Her friends were already splashing in the shallow end, laughing. 'Just jump!' someone yelled. Leah's heart thudded. She thought about climbing back down the ladder — nobody would really care. Then she remembered her promise to her little brother: she would show him it wasn't scary. Leah took a breath, closed her eyes and stepped forward into the air.";
  add("eng-reading", [
    set(PS, DIVE, [
      mc(1, "How does Leah feel at the start?", ["Nervous", "Bored", "Angry", "Sleepy"], "Curled toes and a thudding heart show nerves."),
      mc(2, "What makes Leah finally jump?", ["Remembering her promise to her brother", "Her friends pushing her", "Getting cold", "Being told off"], "The turning point is 'Then she remembered her promise…'."),
      mc(2, "'Impossibly far away' suggests that…", ["The water feels much further down than it really is", "The pool is empty", "The pool is in another town", "Leah can't see"], "It shows how scary the height feels to Leah."),
    ]),
    set(RE, DIVE, [
      mc(3, "What is the main theme?", ["Courage means acting even when you're afraid", "Swimming is fun", "Friends are mean", "Never make promises"], "Leah is still scared but jumps anyway."),
      mc(3, "From what point of view is the story told?", ["Third person, focused on Leah", "First person", "Second person", "Third person omniscient (everyone's thoughts)"], "It uses 'she' and only shows Leah's thoughts."),
    ]),
  ]);
  const BUS = "The excited students quickly packed their bags because the bus had arrived early.";
  add("eng-grammar", [
    set(PS, BUS, [
      mc(1, "Which word is an adverb telling HOW the students packed?", ["quickly", "excited", "bags", "their"], "'Quickly' describes how they packed."),
      mc(2, "Which word is the subordinating conjunction?", ["because", "the", "had", "their"], "'Because' starts the dependent clause explaining why."),
      mc(2, "What type of sentence is it?", ["Complex", "Simple", "Compound", "Command"], "A main clause plus a dependent clause starting with 'because'."),
    ]),
    one(RE, mc(2, "Why is 'Running late for school.' not a complete sentence?", ["It has no subject and no complete verb", "It's too short", "It has no adjective", "It needs a question mark"], "Who is running? 'I was running late for school.' is complete.")),
    one(EN, mc(3, "Rewrite 'The ball was kicked by Sam' in the active voice.", ["Sam kicked the ball.", "The ball kicked Sam.", "Sam was kicked by the ball.", "Kicked, the ball was."], "In the active voice the doer (Sam) comes first.")),
  ]);
  const ARID = "The arid landscape stretched endlessly. Not a single drop of rain had fallen for months, and the few scrawny trees looked parched.";
  add("eng-vocab", [
    set(PS, ARID, [
      mc(2, "'Arid' most nearly means…", ["Very dry", "Very cold", "Crowded", "Beautiful"], "No rain for months gives the clue."),
      mc(2, "'Scrawny' suggests the trees are…", ["Thin and weak-looking", "Tall and strong", "Green and healthy", "Freshly planted"], "Scrawny has a negative connotation — thin in an unhealthy way."),
      mc(3, "'Parched' means…", ["Badly in need of water", "Covered in snow", "Burnt by fire", "Recently cut"], "Parched = extremely dry and thirsty."),
    ]),
    one(RE, mc(2, "Which clue in the passage best helps you work out 'arid'?", ["Not a single drop of rain had fallen for months", "stretched endlessly", "the few trees", "landscape"], "Context clues near a word often explain it.")),
    one(EN, mc(3, "'Bibliophile' = biblio (book) + phile (love). What is a bibliophile?", ["Someone who loves books", "A library", "A book seller", "Someone who hates reading"], "Knowing word parts unlocks new words.")),
  ]);
  const HIGHWAY = "The wind was a torrent of darkness among the gusty trees.\nThe moon was a ghostly galleon tossed upon cloudy seas.\n— from 'The Highwayman' by Alfred Noyes";
  add("eng-figurative", [
    set(PS, HIGHWAY, [
      mc(2, "'The moon was a ghostly galleon' is a…", ["Metaphor", "Simile", "Onomatopoeia", "Hyperbole"], "It says the moon IS a ship, with no 'like' or 'as'."),
      mc(3, "What mood do these lines create?", ["Eerie and wild", "Calm and peaceful", "Funny", "Bored"], "Darkness, gusty wind and a 'ghostly' moon build a spooky, stormy mood."),
      mc(3, "Why does the poet say the moon is 'tossed'?", ["It makes the moon seem to move with the clouds like a ship on rough waves", "The moon fell down", "Someone threw it", "It rhymes with 'lost'"], "The clouds are like seas, so the moon bobs along like a ship."),
    ]),
    one(EN, mc(1, "Which is a simile about a fast runner?", ["She ran like the wind.", "She is the wind.", "The wind ran.", "She ran fast."], "A simile compares using 'like' or 'as'.")),
  ]);
  const SNOWY = "There was movement at the station, for the word had passed around\nThat the colt from old Regret had got away,\nAnd had joined the wild bush horses — he was worth a thousand pound,\nSo all the cracks had gathered to the fray.\n— from 'The Man from Snowy River' by A. B. 'Banjo' Paterson";
  add("eng-poetry", [
    set(PS, SNOWY, [
      mc(2, "What is the rhyme scheme of these four lines?", ["ABAB", "AABB", "ABBA", "AAAA"], "around (A), away (B), pound (A), fray (B)."),
      mc(2, "This poem tells a story. What kind of poem is it?", ["A ballad", "A haiku", "A limerick", "Free verse"], "Ballads are story poems with a strong rhythm and rhyme."),
      mc(3, "'He was worth a thousand pound' tells us the colt is…", ["Very valuable, so everyone wants to catch it", "Very heavy", "Very old", "For sale cheaply"], "That's why 'all the cracks' (the best riders) gather."),
    ]),
    one(RE, mc(3, "Why might Paterson open with 'There was movement at the station'?", ["It hooks readers with action and excitement straight away", "To describe a train station", "To show nothing happens", "To make it rhyme with 'nation'"], "Opening with movement creates energy and curiosity.")),
    one(EN, mc(2, "Which line would fit the 5-syllable first line of a haiku?", ["Autumn moonlight falls", "The cold wind blows", "Gentle rain is falling down", "Sun"], "Au-tumn-moon-light-falls = 5 syllables.")),
  ]);
  const LIGHT = "Sam had lived in the quiet town of Bridgewater his whole life. One stormy night, the power went out and a strange light appeared in the abandoned lighthouse. Sam grabbed his torch and crept towards it, heart pounding. At the top of the stairs he found… his grandfather, fixing the old lamp. 'Someone has to warn the ships,' Grandpa smiled. From then on, Sam helped him every stormy night.";
  add("eng-narrative", [
    set(PS, LIGHT, [
      mc(2, "Which part is the complication?", ["The power goes out and a strange light appears in the lighthouse", "Sam has lived in Bridgewater his whole life", "Sam helps every stormy night", "Grandpa smiles"], "The complication is the problem that starts the action."),
      mc(2, "Which part is the climax?", ["Sam reaches the top of the stairs and finds his grandfather", "Sam lives in a quiet town", "The power goes out", "Sam helps every stormy night"], "The most tense moment, where the mystery is revealed."),
      mc(3, "Why does the writer use an ellipsis in 'he found… his grandfather'?", ["To build suspense before the surprise", "Because words are missing by mistake", "To show a list", "To end the story"], "The pause makes readers wait for the reveal."),
      mc(3, "What is the resolution?", ["Sam helps his grandfather every stormy night", "The power goes out", "Sam grabs a torch", "A light appears"], "The resolution shows how things settle afterwards."),
    ]),
  ]);
  const AD = "Tired of boring lunches? Join thousands of happy Aussie kids who love CrunchBox! Packed with real fruit and 50% less sugar than leading brands, CrunchBox is the smart choice. Mums and dads agree: it's the snack that disappears first. Grab yours today!";
  add("eng-persuasive", [
    set(PS, AD, [
      mc(1, "'Tired of boring lunches?' is a…", ["Rhetorical question", "Statistic", "Call to action", "Anecdote"], "It isn't really asking — it hooks the reader."),
      mc(2, "'50% less sugar than leading brands' is an example of…", ["Statistics", "Hyperbole", "An anecdote", "Inclusive language"], "Numbers make the claim sound proven."),
      mc(2, "'Grab yours today!' is a…", ["Call to action", "Rhetorical question", "Rebuttal", "Fact"], "It tells the audience exactly what to do."),
    ]),
    set(RE, AD, [
      mc(3, "Why could '50% less sugar than leading brands' be misleading?", ["It doesn't say how much sugar the leading brands have — it could still be a lot", "It is a fact", "It is too formal", "It uses inclusive language"], "A comparison without the real amount can hide that the product is still sugary."),
      mc(3, "Who is the ad aimed at?", ["Kids and their parents", "Only teachers", "Elderly people", "Business owners"], "It talks to kids ('happy Aussie kids') and reassures parents ('Mums and dads agree')."),
    ]),
  ]);
  const SLIME = "How to make slime\nYou will need: 1 cup of PVA glue, ½ cup of water, borax solution, a bowl and a spoon.\n1. Pour the glue into the bowl.\n2. Stir in the water.\n3. Slowly add the borax solution, stirring all the time, until the slime forms.";
  add("eng-texttypes", [
    set(PS, SLIME, [
      mc(1, "What text type is this?", ["Procedure", "Narrative", "Recount", "Persuasive text"], "It has a goal, a materials list and numbered steps."),
      mc(2, "Why are the steps numbered?", ["The order matters, and readers can keep their place", "To make it rhyme", "To make it longer", "Because it's a story"], "Procedures must be followed in sequence."),
      mc(2, "Each step starts with which kind of word?", ["A command verb", "A noun", "A question word", "A pronoun"], "Pour, Stir, Add — telling the reader what to do."),
    ]),
    one(EN, mc(3, "Which sentence would fit if you rewrote this as a recount?", ["Yesterday I poured the glue into a bowl.", "Pour the glue into a bowl.", "You should pour the glue!", "Glue is a liquid."], "Recounts retell what happened, in past tense.")),
  ]);

  // ================================================================ Science
  const RAMP = "Ari tests how the height of a ramp affects how far a toy car rolls. Results: 10 cm ramp → 50 cm; 20 cm ramp → 95 cm; 30 cm ramp → 150 cm.";
  add("sci-toolkit", [
    set(PS, RAMP, [
      mc(1, "What is the independent variable (what Ari changes)?", ["The height of the ramp", "How far the car rolls", "The type of car", "The floor"], "Ari chooses the ramp heights."),
      mc(1, "What is the dependent variable (what Ari measures)?", ["How far the car rolls", "The ramp height", "The car's colour", "The time of day"], "The distance depends on the height."),
      mc(2, "What pattern do the results show?", ["The higher the ramp, the further the car rolls", "Higher ramps make the car roll less", "Height makes no difference", "The car always rolls 50 cm"], "Distance increases as height increases."),
      num(3, "Predict how far the car would roll from a 40 cm ramp, in cm.", 200, "The distance goes up about 50 cm for each extra 10 cm of height, so about 200 cm.", 15),
    ]),
    one(RE, mc(2, "Why should Ari use the same car each time?", ["So the only thing changing is the ramp height — a fair test", "To save money", "Because it's faster", "So the results are bigger"], "Keeping other things the same (controlled variables) makes the test fair.")),
    one(EN, mc(3, "Ari's three trials at 20 cm gave 95 cm, 100 cm and 40 cm. What should Ari do?", ["Treat 40 cm as an outlier — check it or repeat that trial", "Average all three", "Use only 40 cm", "Give up"], "40 cm is far from the others, so it's probably a mistake.")),
  ]);
  add("sci-classify", [
    set(PS, "An animal has fur, feeds its young milk, and raises its young in a pouch.", [
      mc(1, "Which vertebrate group does it belong to?", ["Mammals", "Birds", "Reptiles", "Amphibians"], "Fur and milk are mammal features."),
      mc(2, "Which sub-group of mammals?", ["Marsupials", "Monotremes", "Placental mammals", "Primates"], "Marsupials raise their young in a pouch."),
      mc(2, "Which animal could it be?", ["Wombat", "Platypus", "Dolphin", "Emu"], "Wombats are marsupials. Platypuses lay eggs (monotremes)."),
    ]),
    one(RE, mc(2, "Why aren't dolphins fish?", ["They breathe air with lungs and feed their young milk", "They live in water", "They have fins", "They eat fish"], "Classification depends on body features, not where an animal lives.")),
    one(EN, mc(3, "Felis catus (house cat) and Felis silvestris (wildcat) share the name Felis. What does that tell you?", ["They are in the same genus, so they're closely related", "They are the same species", "They live in the same place", "Nothing"], "The first part of a scientific name is the genus.")),
  ]);
  const OCEAN = "An Antarctic food chain: phytoplankton → krill → fish → penguin → leopard seal.";
  add("sci-ecosystems", [
    set(PS, OCEAN, [
      mc(1, "Which is the producer?", ["Phytoplankton", "Krill", "Penguin", "Leopard seal"], "Phytoplankton make food by photosynthesis."),
      mc(2, "Which is a secondary consumer?", ["Fish", "Krill", "Phytoplankton", "None"], "Fish eat krill (the primary consumers)."),
      num(3, "Phytoplankton store 100 000 J. Using the 10% rule, how much energy reaches the penguins, in J?", 100, "100 000 → 10 000 (krill) → 1000 (fish) → 100 J (penguins)."),
      mc(3, "If krill are overfished, what will most likely happen to the penguins?", ["Their numbers fall, because their food (fish) has less to eat", "They increase", "Nothing", "They become producers"], "A change low in a food chain affects everything above it."),
    ]),
    one(EN, mc(3, "Why are top predators, like sharks, important to an ecosystem?", ["They keep prey numbers in balance", "They make oxygen", "They are decomposers", "They aren't important"], "Without them, prey can boom and overeat their own food sources.")),
  ]);
  add("sci-resources", [
    set(PS, "A town gets its electricity from: coal 50%, wind 20%, solar 20% and hydro 10%.", [
      num(1, "What percentage comes from renewable sources?", 50, "Wind + solar + hydro = 20 + 20 + 10 = 50%."),
      mc(2, "Which plan would most reduce the town's greenhouse gas emissions?", ["Replace some coal power with more wind and solar", "Build another coal station", "Use more petrol generators", "Turn off the hydro plant"], "Burning coal releases carbon dioxide; wind and solar don't."),
    ]),
    one(RE, mc(2, "Why is coal called non-renewable?", ["It takes millions of years to form, so we use it much faster than it's made", "It is black", "It burns", "It comes from plants"], "Renewal time decides whether a resource is renewable.")),
    one(EN, mc(3, "A home uses 20 kWh a day, and its solar panels make 25 kWh on a sunny day. What can happen to the extra 5 kWh?", ["It can be stored in a battery or sent to the grid", "It disappears", "It damages the house", "The panels stop working"], "Excess solar power is stored or exported for others to use.")),
  ]);
  add("sci-space", [
    set(PS, "It's 21 December in Melbourne — the longest day of the year.", [
      mc(1, "Which season is it?", ["Summer", "Winter", "Autumn", "Spring"], "December is summer in the Southern Hemisphere."),
      mc(2, "Is the Southern Hemisphere tilted towards or away from the Sun?", ["Towards", "Away", "Neither"], "Tilting towards the Sun gives longer days and more direct sunlight."),
      mc(3, "What season is it in London on the same day?", ["Winter", "Summer", "Spring", "Autumn"], "The Northern Hemisphere is tilted away from the Sun."),
    ]),
    one(RE, mc(3, "Earth is actually a little closer to the Sun in January. Why isn't that the cause of our summer?", ["Seasons are caused by the tilt — the Northern Hemisphere has winter at the same time", "It is the cause", "The Sun is smaller in January", "The Moon blocks it"], "If distance caused seasons, both hemispheres would have summer together.")),
    one(EN, num(3, "The Moon is about 384 000 km away and light travels 300 000 km per second. About how many seconds does moonlight take to reach us?", 1.28, "384 000 ÷ 300 000 = 1.28 seconds.", 0.05)),
  ]);
  add("sci-forces", [
    set(PS, "A 50 kg box is pushed across the floor with a force of 200 N. Friction pushes back with 80 N.", [
      num(2, "What is the net force on the box, in N?", 120, "200 − 80 = 120 N in the direction of the push."),
      mc(2, "What happens to the box?", ["It speeds up in the direction of the push", "It stays still", "It moves backwards", "It moves at a steady speed"], "Unbalanced forces change an object's speed."),
      num(3, "What is the box's weight on Earth, in N? (g ≈ 10 N/kg)", 500, "50 × 10 = 500 N."),
    ]),
    one(RE, mc(2, "Why do you lurch forward when a bus brakes suddenly?", ["Your body keeps moving forward (inertia) while the bus slows", "The bus pushes you", "Gravity gets stronger", "Friction pulls you forward"], "Objects keep moving unless a force stops them.")),
    one(EN, num(3, "A 300 N load is 0.5 m from a lever's fulcrum. The effort is applied 1.5 m from the fulcrum. What effort is needed to balance it, in N?", 100, "Load × distance = effort × distance: 300 × 0.5 = effort × 1.5 → effort = 100 N.")),
  ]);
  add("sci-particles", [
    set(PS, "A sealed syringe full of air has its plunger pushed in.", [
      mc(1, "What happens to the air particles?", ["They are pushed closer together", "They get smaller", "They disappear", "They turn into liquid"], "Gas particles have spaces between them that can be squeezed."),
      mc(2, "What happens to the pressure inside?", ["It increases — particles hit the walls more often", "It decreases", "It stays the same", "It becomes zero"], "Same particles in less space = more collisions."),
      mc(2, "What happens to the mass of the air?", ["It stays the same", "It increases", "It decreases", "It becomes zero"], "No particles enter or leave a sealed syringe."),
    ]),
    one(EN, num(3, "A 120 g object pushes the water in a measuring cylinder up by 40 mL. What is its density, in g/cm³? (1 mL = 1 cm³)", 3, "Density = mass ÷ volume = 120 ÷ 40 = 3 g/cm³ — denser than water, so it sinks.")),
  ]);
  add("sci-mixtures", [
    set(PS, "You have a mixture of sand, salt and iron filings.", [
      mc(2, "What should you do first?", ["Remove the iron filings with a magnet", "Evaporate it", "Boil it", "Distil it"], "The magnet only picks up the iron."),
      mc(2, "Next you add water and stir, then filter. What is left on the filter paper?", ["Sand", "Salt", "Iron", "Nothing"], "Salt dissolves and passes through; sand doesn't."),
      mc(3, "How do you get the salt back?", ["Evaporate the water from the filtrate", "Use a magnet", "Filter again", "Freeze it"], "The salt stays behind as crystals."),
    ]),
    one(EN, mc(3, "Police test the ink from a ransom note against three suspects' pens using chromatography. What are they comparing?", ["The pattern of coloured dyes each ink separates into", "The smell of the ink", "The weight of each pen", "The handwriting"], "Each ink makes its own pattern of dye spots.")),
  ]);
  add("sci-cells", [
    set(PS, "Under a microscope, Jo sees cells with a cell wall, chloroplasts and a large vacuole. The eyepiece is 10× and the objective lens is 10×.", [
      mc(1, "What kind of cells are they?", ["Plant cells", "Animal cells", "Bacteria", "Blood cells"], "Cell walls, chloroplasts and a big vacuole are plant cell features."),
      mc(2, "Which part of the plant did they most likely come from?", ["A leaf", "A root", "Inside a seed", "The bark"], "Chloroplasts are found where there's light — mostly leaves."),
      num(2, "What is the total magnification (just the number)?", 100, "10 × 10 = 100."),
    ]),
    one(RE, mc(3, "Why can't you see a cell membrane clearly in a plant cell under a school microscope?", ["It's very thin and pressed against the cell wall", "Plant cells don't have one", "It's invisible", "It's inside the nucleus"], "Plant cells do have a membrane — it's just hard to tell apart from the wall.")),
  ]);
  add("sci-body", [
    set(PS, "After running 400 m, Kai's heart rate rises from 70 to 150 beats per minute and he breathes much faster.", [
      num(1, "By how many beats per minute did his heart rate increase?", 80, "150 − 70 = 80."),
      mc(2, "Why did his heart rate increase?", ["To deliver more oxygen and glucose to his working muscles", "To cool him down", "To digest his lunch", "Because his bones were growing"], "Working muscles need more energy from respiration."),
      mc(2, "Which two systems are working together here?", ["Circulatory and respiratory", "Digestive and skeletal", "Nervous and excretory", "Skeletal and excretory"], "Lungs take in oxygen; the heart and blood deliver it."),
    ]),
    one(EN, num(3, "Kai breathes 15 times a minute, taking in 0.5 L each breath. How many litres of air is that per minute?", 7.5, "15 × 0.5 = 7.5 L.")),
  ]);
  add("sci-energy", [
    set(PS, "An old 60 W light globe uses 60 J of electrical energy every second and gives out 6 J of light each second.", [
      num(1, "How much electrical energy does it use in 10 seconds, in J?", 600, "60 J × 10 s = 600 J."),
      num(2, "What is its efficiency, as a percentage?", 10, "6 ÷ 60 × 100 = 10%."),
      mc(2, "Where does most of the rest of the energy go?", ["Heat (thermal energy)", "Sound", "Chemical energy", "It's destroyed"], "Old globes get very hot — most energy is wasted as heat."),
    ]),
    one(EN, num(3, "An LED gives the same light using only 8 J per second. How many fewer joules per second does it use than the 60 W globe?", 52, "60 − 8 = 52 J per second saved.")),
  ]);
  add("sci-rocks", [
    set(PS, "A cliff has three layers. The bottom layer is limestone with sea shells in it, the middle is sandstone, and the top is basalt.", [
      mc(1, "Which layer is the oldest?", ["The limestone at the bottom", "The sandstone", "The basalt at the top"], "Layers are laid down one on top of another."),
      mc(2, "What type of rock is the basalt?", ["Igneous", "Sedimentary", "Metamorphic"], "Basalt forms when lava cools quickly."),
      mc(3, "What do the shells in the limestone tell us?", ["The area was once under the sea", "It used to be a desert", "A volcano erupted", "Nothing"], "Fossils give clues about past environments."),
    ]),
    one(EN, num(3, "A 2 m layer of sediment built up at 1 mm per year. How many years did it take?", 2000, "2 m = 2000 mm. 2000 ÷ 1 = 2000 years.")),
  ]);
  add("sci-change", [
    set(PS, "Baking soda and vinegar are mixed in a flask with a balloon stretched over the top. It fizzes and the balloon inflates. The flask and contents weighed 150 g at the start.", [
      mc(1, "What evidence shows a chemical change happened?", ["A gas was produced", "The flask got heavier", "Nothing changed", "The balloon is red"], "Making a new gas is a sign of a chemical reaction."),
      mc(2, "Which gas fills the balloon?", ["Carbon dioxide", "Oxygen", "Hydrogen", "Nitrogen"], "baking soda + vinegar → … + carbon dioxide + water."),
      num(3, "What will the whole set-up weigh at the end, in g?", 150, "The balloon traps the gas, so no mass is lost: 150 g (conservation of mass)."),
    ]),
    one(RE, mc(2, "Melting chocolate is a physical change, but burning toast is a chemical change. Why?", ["Burning toast makes new substances; melted chocolate is still chocolate", "Chocolate is sweeter", "Toast is hotter", "There's no difference"], "Chemical changes make new substances that are hard to reverse.")),
    one(EN, num(3, "Glucose is C₆H₁₂O₆. How many atoms are in one molecule?", 24, "6 carbon + 12 hydrogen + 6 oxygen = 24 atoms.")),
  ]);
})();
