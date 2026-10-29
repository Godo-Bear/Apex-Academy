/* Sub-topic coverage: extra questions so every topic covers all of its parts (e.g. plotting a whole table of
   values and spotting the pattern on the Cartesian plane, not just single points). Runs after challenge.js. */
(function () {
  "use strict";
  const { mc, num, build } = window.__moreTopicTools;
  const all = [...YEAR_LEVELS[0].topics, ...ENGLISH_TOPICS, ...SCIENCE_TOPICS];
  const add = (id, list) => {
    const t = all.find((x) => x.id === id);
    if (t) t.questions.push(...build(`${id}-cov`, list));
  };
  const plot = (d, prompt, targets, extra, explanation) => ({ d, prompt, visual: { type: "plot", targets, ...extra }, explanation });
  const withV = (q, visual) => ({ ...q, visual });
  const pts = (list) => list.map(([x, y]) => ({ x, y }));
  const fmt = (list) => list.map(([x, y]) => `(${x}, ${y})`.replace(/-/g, "−")).join(", ");

  // ---------------------------------------------------------------- Maths
  const T1 = [[-3, -2], [-2, -1], [-1, 0], [0, 1], [1, 2], [2, 3], [3, 4]];
  const T2 = [[-3, 5], [-2, 3], [-1, 1], [0, -1], [1, -3], [2, -5], [3, -7]];
  add("y7-cartesian", [
    { ...plot(1, "Plot the three points in this table.", [[0, 0], [1, 2], [2, 4]], { min: 0, max: 6 }, "Pair each x with the y below it: (0, 0), (1, 2) and (2, 4)."), table: [["x", 0, 1, 2], ["y", 0, 2, 4]] },
    { ...plot(2, "Plot the seven points in this table. Use −3 to 3 on the x-axis and −2 to 4 on the y-axis.", T1, { xmin: -3, xmax: 3, ymin: -2, ymax: 4 }, `Pair each x with its y: ${fmt(T1)}.`), table: [["x", ...T1.map((p) => p[0])], ["y", ...T1.map((p) => p[1])]] },
    withV(mc(2, "These are the seven points from the table x: −3 to 3, y: −2 to 4. What do you notice about them?", ["They lie on a straight line going up — each y is 1 more than its x", "They make a curve", "They are all in one quadrant", "They are scattered randomly"], "Every point moves 1 right and 1 up from the last, so they line up in a straight line. Each y is x + 1."), { type: "plane", xmin: -3, xmax: 3, ymin: -2, ymax: 4, points: pts(T1) }),
    { ...plot(3, "Plot the seven points in this table. Use −3 to 3 on the x-axis and −7 to 5 on the y-axis.", T2, { xmin: -3, xmax: 3, ymin: -7, ymax: 5 }, `Pair each x with its y: ${fmt(T2)}.`), table: [["x", ...T2.map((p) => p[0])], ["y", ...T2.map((p) => p[1])]] },
    withV(mc(3, "These points come from the table x: −3 to 3 and y: 5, 3, 1, −1, −3, −5, −7. What do you notice?", ["They make a straight line going down — y drops by 2 each time x goes up by 1", "They make a straight line going up", "They make a curve", "They are scattered randomly"], "Each step right, the points go down 2, so they form a straight line sloping down."), { type: "plane", xmin: -3, xmax: 3, ymin: -7, ymax: 5, points: pts(T2) }),
    mc(3, "Which rule matches the points (−3, 5), (−2, 3), (−1, 1), (0, −1), (1, −3)?", ["y = −2x − 1", "y = 2x − 1", "y = −x − 2", "y = x + 5"], "y falls by 2 for each 1 across, so the x-term is −2x. At x = 0, y = −1. Check x = 1: −2 − 1 = −3 ✓."),
    withV(mc(2, "Imagine plotting the points in this table. Where would the line through them cross the y-axis?", ["(0, 3)", "(3, 0)", "(0, 1)", "(1, 4)"], "The y-axis is where x = 0, and the table says y = 3 when x = 0."), { type: "table", rows: [["x", 0, 1, 2, 3], ["y", 3, 4, 5, 6]] }),
    mc(3, "The points (1, 2), (2, 4), (3, 6) and (4, 8) are plotted. Which rule do they follow?", ["y = 2x", "y = x + 1", "y = x + 2", "y = 4x"], "Each y is double its x."),
    num(1, "A point sits on the x-axis. What must its y-coordinate be?", 0, "Everything on the x-axis is at height 0, like (5, 0) or (−2, 0)."),
    mc(1, "Which axis is the horizontal one (going across)?", ["The x-axis", "The y-axis"], "x goes across, y goes up — x comes first in (x, y)."),
    mc(2, "Which point lies on the y-axis?", ["(0, −5)", "(−5, 0)", "(5, 5)", "(1, −1)"], "On the y-axis x = 0, so (0, −5)."),
    num(2, "A rectangle has corners (1, 1), (6, 1), (6, 4) and (1, 4). What is its perimeter, in units?", 16, "Width = 6 − 1 = 5, height = 4 − 1 = 3. Perimeter = 2 × (5 + 3) = 16."),
    num(3, "Triangle ABC has A(−2, −1), B(4, −1) and C(4, 3). What is its area, in square units?", 12, "AB is horizontal: 4 − (−2) = 6 long. BC is vertical: 3 − (−1) = 4 high. Area = ½ × 6 × 4 = 12."),
    plot(3, "Plot the point on the rule y = 3 − x where x = 5.", [[5, -2]], {}, "y = 3 − 5 = −2, so plot (5, −2)."),
  ]);

  add("y7-linear", [
    plot(2, "Make a table for y = x − 2 using x = 0, 1, 2, 3, then plot all four points.", [[0, -2], [1, -1], [2, 0], [3, 1]], { xmin: -1, xmax: 4, ymin: -3, ymax: 2 }, "x = 0 → −2, x = 1 → −1, x = 2 → 0, x = 3 → 1. Plot (0, −2), (1, −1), (2, 0) and (3, 1) — they make a straight line."),
    plot(3, "Plot the points for y = 2x + 1 when x = −2, −1, 0, 1 and 2.", [[-2, -3], [-1, -1], [0, 1], [1, 3], [2, 5]], { xmin: -3, xmax: 3, ymin: -4, ymax: 6 }, "Substitute each x: −2 → −3, −1 → −1, 0 → 1, 1 → 3, 2 → 5."),
    withV(mc(1, "Which rule fits this table?", ["y = 2x", "y = x + 2", "y = x + 1", "y = 3x"], "Each y is double its x: 1 → 2, 2 → 4, 3 → 6, 4 → 8."), { type: "table", rows: [["x", 1, 2, 3, 4], ["y", 2, 4, 6, 8]] }),
    mc(2, "Which table is NOT a linear (straight-line) relationship?", ["x: 1, 2, 3, 4 → y: 1, 4, 9, 16", "x: 1, 2, 3, 4 → y: 3, 5, 7, 9", "x: 1, 2, 3, 4 → y: 10, 8, 6, 4", "x: 1, 2, 3, 4 → y: 5, 6, 7, 8"], "In a linear table y changes by the same amount each step. 1, 4, 9, 16 goes up by 3, 5, 7 — not constant, so it curves."),
    mc(2, "On a distance–time graph, which part shows the fastest speed?", ["The steepest section", "The flat section", "The longest section", "The lowest section"], "Steeper means more distance in the same time — faster."),
    num(3, "A car travels 60 km in the first hour, stops for 30 minutes, then travels 90 km in 1.5 hours. What is its average speed for the whole 3-hour trip, in km/h?", 50, "Total distance = 60 + 90 = 150 km. Total time = 1 + 0.5 + 1.5 = 3 h. 150 ÷ 3 = 50 km/h."),
    num(1, "A pattern uses t = 5n tiles for shape n. How many tiles does shape 7 need?", 35, "t = 5 × 7 = 35."),
    mc(3, "A gym charges $50 to join plus $15 a week. Which rule gives the total cost C after w weeks?", ["C = 15w + 50", "C = 50w + 15", "C = 65w", "C = 15 + 50"], "$15 for every week (15w) plus a one-off $50."),
    num(2, "Using C = 15w + 50, what is the gym cost after 8 weeks, in dollars?", 170, "15 × 8 + 50 = 120 + 50 = $170."),
    mc(2, "Which rule gives a straight-line graph?", ["y = 3x + 2", "y = x²", "y = x³", "y = 1 ÷ x"], "Rules of the form y = (number)x + (number) are linear. Squares, cubes and dividing by x make curves."),
  ]);

  add("y7-ratios", [
    mc(1, "Which ratio is equivalent to 2 : 5?", ["6 : 15", "5 : 2", "4 : 7", "2 : 10"], "Multiply both parts by 3: 2 × 3 = 6 and 5 × 3 = 15."),
    num(1, "A recipe for 4 people uses 2 eggs. How many eggs for 12 people?", 6, "12 people is 3 times as many, so 3 × 2 = 6 eggs."),
    num(1, "Write 30 minutes : 2 hours in simplest form as 1 : x. What is x?", 4, "Same units first: 2 hours = 120 minutes. 30 : 120 → divide by 30 → 1 : 4."),
    mc(2, "In a class, boys : girls = 3 : 5. What fraction of the class are girls?", ["5/8", "5/3", "3/5", "3/8"], "There are 3 + 5 = 8 parts, and 5 of them are girls: 5/8."),
    num(2, "A car uses 6 L of petrol to travel 75 km. How many km does it travel per litre?", 12.5, "75 ÷ 6 = 12.5 km per litre."),
    num(2, "A swimmer swims 400 m in 8 minutes. What is their speed in metres per minute?", 50, "400 ÷ 8 = 50 m per minute."),
    num(2, "Time = distance ÷ speed. How many hours does it take to drive 270 km at 90 km/h?", 3, "270 ÷ 90 = 3 hours."),
    num(3, "A recipe for 6 people uses 450 g of pasta. How many grams for 10 people?", 750, "Per person: 450 ÷ 6 = 75 g. For 10: 75 × 10 = 750 g."),
    num(3, "A house plan has a scale of 1 : 200. A room is 6 cm long on the plan. How long is the real room, in metres?", 12, "6 × 200 = 1200 cm = 12 m."),
    num(3, "On a 1 : 25 000 map, how many cm long would a 3 km walk be?", 12, "3 km = 300 000 cm. 300 000 ÷ 25 000 = 12 cm."),
    num(3, "Red and blue paint are mixed 2 : 3. You have 8 L of red. How many litres of blue keep the same shade?", 12, "Red went from 2 to 8 (× 4), so blue = 3 × 4 = 12 L."),
  ]);

  add("y7-money", [
    num(1, "Round $12.678 to the nearest cent.", 12.68, "The third decimal place is 8, so round up: $12.68."),
    num(1, "You buy items costing $4.50, $3.25 and $6.80. What is the total, in dollars?", 14.55, "4.50 + 3.25 = 7.75, and 7.75 + 6.80 = 14.55."),
    num(1, "You pay for a $7.35 sandwich with a $10 note. How much change do you get, in dollars?", 2.65, "10.00 − 7.35 = 2.65."),
    num(2, "A salesperson earns 5% commission on sales. How much commission on $2400 of sales, in dollars?", 120, "5% of 2400 = 0.05 × 2400 = $120."),
    num(2, "A $36 price includes 10% GST. How much of it is GST, to the nearest cent?", 3.27, "The GST in a total is total ÷ 11: 36 ÷ 11 = 3.2727… ≈ $3.27.", 0.01),
    num(2, "Ali saves $15 a week. How many weeks will it take to save for a $240 bike?", 16, "240 ÷ 15 = 16 weeks."),
    num(2, "Electricity costs 30c per kWh. A heater uses 2 kWh a day. What does it cost for 30 days, in dollars?", 18, "2 kWh × 30 days = 60 kWh. 60 × $0.30 = $18."),
    num(3, "A bank account pays 2% interest a year. How much interest does $500 earn in one year, in dollars?", 10, "2% of 500 = 0.02 × 500 = $10."),
    num(3, "A phone was $800 and is now $680. What is the percentage discount?", 15, "Discount = $120. 120 ÷ 800 × 100 = 15%."),
    mc(3, "Which is the best deal on a $60 item?", ["25% off", "$12 off", "Pay 4/5 of the price", "$14 off"], "25% of $60 = $15 off. Paying 4/5 means $48, which is $12 off. So 25% off saves the most."),
  ]);

  add("y7-transform", [
    mc(1, "A pattern of shapes that fit together with no gaps or overlaps is a…", ["Tessellation", "Translation", "Reflection", "Rotation"], "Tessellations cover a surface completely, like floor tiles or a honeycomb."),
    num(1, "How many lines of symmetry does a regular pentagon have?", 5, "A regular polygon with n sides has n lines of symmetry."),
    mc(2, "Which regular shape does NOT tessellate on its own?", ["Regular pentagon", "Square", "Equilateral triangle", "Regular hexagon"], "Pentagon angles are 108°, which don't add to exactly 360° around a point, so gaps appear."),
    mc(2, "Shapes that are exactly the same size and shape are…", ["Congruent", "Similar", "Symmetrical", "Parallel"], "Translations, reflections and rotations always make a congruent image."),
    mc(2, "Point A(2, 1) moves to A′(2, −1). Which transformation is this?", ["Reflection in the x-axis", "Reflection in the y-axis", "Translation 2 right", "Rotation of 90°"], "x stays the same and y changes sign — a reflection in the x-axis."),
    plot(2, "Plot the image of Q(1, 4) after a translation of 3 left and 5 down.", [[-2, -1]], { points: [{ x: 1, y: 4, label: "Q" }] }, "x: 1 − 3 = −2. y: 4 − 5 = −1. Q′ = (−2, −1)."),
    mc(3, "A(1, 3) moves to A′(−3, 1). Which transformation could do this?", ["Rotation 90° anticlockwise about the origin", "Rotation 90° clockwise about the origin", "Reflection in the y-axis", "Translation 3 left and 1 down"], "90° anticlockwise sends (x, y) to (−y, x): (1, 3) → (−3, 1). (3 left and 1 down would give (−2, 2).)"),
    plot(3, "Plot the image of P(−3, 2) after a rotation of 180° about the origin.", [[3, -2]], { points: [{ x: -3, y: 2, label: "P" }] }, "A half-turn changes both signs: (−3, 2) → (3, −2)."),
    num(3, "A shape is rotated 90° clockwise, then another 180° clockwise. What single clockwise rotation, in degrees, gives the same result?", 270, "90 + 180 = 270° clockwise (the same as 90° anticlockwise)."),
  ]);

  add("y7-3d", [
    num(1, "How many squares are in the net of a cube?", 6, "One square for each of the cube's 6 faces."),
    num(1, "How many faces does a square-based pyramid have?", 5, "1 square base + 4 triangles = 5 faces."),
    mc(1, "A solid with 4 triangular faces is a…", ["Tetrahedron (triangular pyramid)", "Cube", "Square pyramid", "Triangular prism"], "Tetra means four: 4 triangle faces."),
    mc(2, "Slice a cylinder parallel to its circular ends. What shape is the cross-section?", ["Circle", "Rectangle", "Triangle", "Square"], "Every slice across a cylinder matches its circular ends."),
    mc(2, "Slice a cylinder straight down through its centre, from top to bottom. What is the cross-section?", ["Rectangle", "Circle", "Triangle", "Oval"], "Cutting lengthways gives a rectangle as tall as the cylinder and as wide as its diameter."),
    mc(2, "Isometric dot paper is used to…", ["Draw 3D objects on flat paper", "Draw circles", "Measure angles", "Draw maps"], "The dots are arranged in triangles so you can draw the three directions of a 3D object."),
    mc(3, "A solid's front view is a rectangle, its side view is a triangle and its plan (top) view is a rectangle. What is it?", ["Triangular prism", "Cylinder", "Square pyramid", "Cone"], "A triangular prism lying on its side shows its triangle end from the side and rectangles from the front and top."),
    mc(3, "A solid's front and side views are triangles, and its plan (top) view is a circle. What is it?", ["Cone", "Cylinder", "Sphere", "Triangular prism"], "From the side a cone looks like a triangle; from above you see its circular base."),
    num(3, "A triangular prism has a cross-section of area 15 cm² and is 8 cm long. What is its volume, in cm³?", 120, "Volume of a prism = cross-section area × length = 15 × 8 = 120 cm³."),
  ]);

  add("y7-computation", [
    num(1, "What is the remainder when 47 is divided by 5?", 2, "5 × 9 = 45, and 47 − 45 = 2 left over."),
    num(1, "Use a mental strategy: 99 + 47 = ?", 146, "Add 100 then take away 1: 47 + 100 = 147, minus 1 = 146."),
    num(2, "Use short division: 864 ÷ 6 = ?", 144, "8 ÷ 6 = 1 r2; 26 ÷ 6 = 4 r2; 24 ÷ 6 = 4. Answer: 144."),
    mc(2, "Which is the best estimate of 612 × 29?", ["18 000", "1800", "180 000", "6000"], "Round to 600 × 30 = 18 000."),
    num(2, "Calculate 2³ × 10².", 800, "2³ = 8 and 10² = 100. 8 × 100 = 800."),
  ]);

  add("y7-numberprops", [
    mc(1, "Which number is composite (has more than two factors)?", ["21", "13", "17", "19"], "21 = 3 × 7, so it has factors 1, 3, 7 and 21. The others are prime."),
    mc(1, "A number is divisible by 3 if…", ["The sum of its digits is divisible by 3", "It ends in 3", "It is odd", "It ends in 0"], "e.g. 123: 1 + 2 + 3 = 6, which is divisible by 3, so 123 is too."),
    mc(2, "Which number is divisible by 9?", ["4365", "4362", "1234", "8002"], "Add the digits: 4 + 3 + 6 + 5 = 18, which is divisible by 9."),
    num(2, "What is the cube root of 27?", 3, "3 × 3 × 3 = 27, so ∛27 = 3."),
    mc(2, "√50 lies between which two whole numbers?", ["7 and 8", "6 and 7", "8 and 9", "25 and 26"], "7² = 49 and 8² = 64, and 50 is between them."),
    num(3, "Triangular numbers go 1, 3, 6, 10, … What is the 5th triangular number?", 15, "Add one more each time: 1, +2 = 3, +3 = 6, +4 = 10, +5 = 15."),
  ]);

  add("y7-fdp", [
    mc(1, "Which fraction is equivalent to 2/3?", ["8/12", "4/9", "3/2", "6/8"], "Multiply top and bottom by 4: 2/3 = 8/12."),
    mc(2, "What is 1/3 as a decimal?", ["0.333… (a recurring decimal)", "0.3", "0.13", "3.0"], "1 ÷ 3 = 0.3333… — the 3 repeats forever."),
    num(2, "Calculate 1½ + 2¾ and give the answer as a decimal.", 4.25, "1.5 + 2.75 = 4.25 (or 3 + 5/4 = 4¼)."),
    num(2, "Calculate ¾ ÷ 3 and give the answer as a decimal.", 0.25, "¾ ÷ 3 = ¾ × ⅓ = 3/12 = ¼ = 0.25."),
    mc(2, "What is the reciprocal of 3/7?", ["7/3", "3/7", "−3/7", "1/7"], "Flip the fraction: the reciprocal of 3/7 is 7/3 (they multiply to 1)."),
    mc(3, "Which fraction is between 1/2 and 3/4?", ["5/8", "1/4", "7/8", "2/5"], "1/2 = 4/8 and 3/4 = 6/8, so 5/8 is in between."),
  ]);

  add("y7-algebra", [
    mc(1, "Write 'five more than n' as an expression.", ["n + 5", "5n", "n − 5", "5 − n"], "'More than' means add: n + 5."),
    mc(1, "How do you write 3 × a × b in algebra?", ["3ab", "3 + a + b", "a3b", "3a + b"], "Leave out the × signs and put the number first: 3ab."),
    mc(2, "Write 'a number doubled, then take away 7'.", ["2n − 7", "7 − 2n", "n² − 7", "2(n − 7)"], "Doubled = 2n, then subtract 7: 2n − 7."),
    mc(2, "Simplify 4a × 3b.", ["12ab", "7ab", "12a + b", "43ab"], "Multiply the numbers (4 × 3 = 12) and the letters (a × b = ab)."),
    mc(3, "Simplify 18xy ÷ 6x.", ["3y", "3xy", "12y", "3x"], "18 ÷ 6 = 3, and the x's cancel, leaving 3y."),
    mc(3, "Sam has n stickers. Ali has 3 more than twice as many. How many does Ali have?", ["2n + 3", "3n + 2", "2(n + 3)", "n + 6"], "Twice as many = 2n, then 3 more: 2n + 3."),
  ]);

  add("y7-decimals", [
    mc(1, "In 6.483, which digit is in the hundredths place?", ["8", "4", "3", "6"], "After the point: 4 tenths, 8 hundredths, 3 thousandths."),
    num(2, "What is 0.007 × 1000?", 7, "Multiplying by 1000 moves the digits 3 places left: 7."),
    mc(2, "Which fraction gives a terminating decimal (one that stops)?", ["3/8 = 0.375", "1/3 = 0.333…", "2/9 = 0.222…", "1/7 = 0.142857…"], "0.375 stops; the others repeat forever (recurring)."),
    num(3, "Three friends share a $47.85 bill equally. How much does each pay, in dollars?", 15.95, "47.85 ÷ 3 = 15.95."),
  ]);

  add("y7-negatives", [
    mc(2, "Which statement is true?", ["−3 > −7", "−3 < −7", "−3 = 3", "−7 > 0"], "On a number line −3 is to the right of −7, so it's bigger."),
    num(2, "The temperature in Mildura is 31 °C and on Mt Hotham it's −4 °C. What is the difference, in °C?", 35, "31 − (−4) = 31 + 4 = 35 °C."),
  ]);

  add("y7-geometry", [
    mc(1, "A triangle with all three sides different lengths is…", ["Scalene", "Isosceles", "Equilateral", "Right-angled"], "Scalene: no equal sides. Isosceles: two. Equilateral: three."),
    mc(1, "A quadrilateral with exactly one pair of parallel sides is a…", ["Trapezium", "Rectangle", "Rhombus", "Square"], "A trapezium has one pair of parallel sides; the others have two pairs."),
    mc(2, "Which quadrilateral has four equal sides but no right angles?", ["Rhombus", "Square", "Rectangle", "Kite"], "A rhombus is like a pushed-over square."),
    mc(2, "In ∠ABC, which point is the vertex of the angle?", ["B", "A", "C", "None of them"], "The middle letter is always the vertex (the corner)."),
    mc(2, "The diagonals of a rectangle are always…", ["Equal in length", "At right angles", "Different lengths", "Parallel"], "A rectangle's diagonals are equal and cut each other in half (but aren't at right angles unless it's a square)."),
    num(3, "An exterior angle of a triangle is 130°. One of the two opposite interior angles is 55°. What is the other, in degrees?", 75, "An exterior angle equals the sum of the two opposite interior angles: 130 − 55 = 75°."),
  ]);

  add("y7-statsprob", [
    mc(1, "Which of these is categorical data?", ["Favourite colour", "Height in cm", "Number of pets", "Time to run 100 m"], "Categorical data is in groups (words); the others are numbers."),
    mc(2, "In a stem-and-leaf plot, 4 | 7 stands for…", ["47", "74", "4 + 7", "4 × 7"], "The stem is the tens digit and the leaf is the ones digit."),
    mc(2, "To find the school's favourite sport, you only ask your best friends. This sample is…", ["Biased — it doesn't represent the whole school", "Random", "A census", "Perfectly fair"], "A fair sample should be chosen randomly from the whole group."),
    num(2, "The probability of rain tomorrow is 0.3. What is the probability it does NOT rain?", 0.7, "Probabilities of 'happens' and 'doesn't happen' add to 1: 1 − 0.3 = 0.7."),
    mc(3, "The data is 3, 4, 4, 5, 50. Which measure best describes a typical value?", ["Median", "Mean", "Range", "None of them"], "The outlier 50 drags the mean up to 13.2. The median (4) is typical."),
    num(3, "You flip a coin and roll a die. How many outcomes are in the sample space?", 12, "2 coin results × 6 die results = 12, e.g. H1, H2 … T6."),
    mc(3, "A survey asks every single student in the school. This is a…", ["Census", "Sample", "Biased sample", "Experiment"], "A census collects data from the whole population."),
  ]);

  add("y7-equations", [
    mc(1, "Is x = 4 a solution of 3x − 2 = 10?", ["Yes", "No"], "Substitute: 3 × 4 − 2 = 10 ✓."),
    mc(2, "Which equation means 'a number plus 8 equals 20'?", ["n + 8 = 20", "8n = 20", "n − 8 = 20", "20 + n = 8"], "Plus 8 → n + 8, equals 20 → = 20."),
    num(3, "A rectangle's perimeter is 50 cm and its length is 3 cm more than its width. What is the width, in cm?", 11, "2w + 2(w + 3) = 50 → 4w + 6 = 50 → 4w = 44 → w = 11."),
    num(3, "A triangle's angles are x, 2x and 3x degrees. What is x?", 30, "x + 2x + 3x = 180 → 6x = 180 → x = 30."),
  ]);

  add("y7-measurement", [
    num(1, "What is 3:45 pm in 24-hour time? Type the four digits, e.g. 0930.", 1545, "Add 12 to the hours after midday: 3 + 12 = 15, so 1545."),
    num(2, "How many cm² are in 1 m²?", 10000, "1 m² is 100 cm × 100 cm = 10 000 cm²."),
    num(2, "Convert 2.5 m² to cm².", 25000, "2.5 × 10 000 = 25 000 cm²."),
    num(2, "A cube has a volume of 125 cm³. How long is each edge, in cm?", 5, "5 × 5 × 5 = 125."),
    num(3, "A fish tank is 60 cm × 30 cm × 40 cm. How many litres does it hold? (1000 cm³ = 1 L)", 72, "60 × 30 × 40 = 72 000 cm³ = 72 L."),
    num(3, "A triangular garden bed has a base of 4 m and a height of 3 m. Soil costs $12 per m². How much does it cost to cover it, in dollars?", 72, "Area = ½ × 4 × 3 = 6 m². 6 × $12 = $72."),
  ]);

  // ---------------------------------------------------------------- English
  add("eng-punctuation", [
    mc(1, "Which book title is capitalised correctly?", ["Harry Potter and the Goblet of Fire", "harry potter and the goblet of fire", "Harry potter And The goblet Of fire", "HARRY potter and the Goblet of fire"], "Capitalise the first word and the main words; small words like 'and', 'the', 'of' stay lower case."),
    mc(2, "Which sentence uses a hyphen correctly?", ["My sister is a well-known author.", "My sister is a well known-author.", "My-sister is well known.", "My sister-is well known."], "A hyphen joins words that work together to describe a noun: well-known author."),
    mc(2, "An ellipsis (…) is usually used to show…", ["A pause, or that words have been left out", "A question", "A list", "Ownership"], "e.g. 'I opened the door and…' builds suspense."),
    mc(3, "Which sentence uses dashes correctly?", ["My best friend — the one with red hair — won the race.", "My best — friend the one with red hair won the race.", "My best friend the one — with red hair won — the race.", "— My best friend won the race —"], "A pair of dashes adds extra information in the middle of a sentence, like brackets."),
  ]);
  add("eng-spelling", [
    mc(1, "Which word follows the rule 'i before e, except after c'?", ["ceiling", "cieling", "recieve", "decieve"], "After c it's 'ei': ceiling, receive, deceive."),
    mc(2, "What is the plural of 'knife'?", ["knives", "knifes", "knifs", "knive"], "Many words ending in -f or -fe change to -ves: knife → knives, leaf → leaves."),
    mc(2, "Which word has a silent letter?", ["knight", "night", "nine", "nice"], "The k in knight isn't pronounced."),
    mc(2, "Add -ed to 'stop'.", ["stopped", "stoped", "stopt", "stoppd"], "Short vowel + one consonant: double the consonant before adding -ed."),
    mc(3, "Which ending completes 'informa___'?", ["tion", "sion", "cian", "shun"], "information — most 'shun' endings after a vowel sound like 'a' are -tion."),
    mc(3, "Which word is spelt correctly?", ["Rhythm", "Rythm", "Rhythym", "Rhytm"], "Rhythm Helps Your Two Hips Move."),
  ]);
  const SLEEP = "Every morning, thousands of Victorian teenagers drag themselves out of bed before 7 am, and many sit through first period barely awake. Sleep scientists explain that during puberty the body clock shifts later, so teenagers naturally fall asleep and wake up later than adults. A study of schools in the United States found that when start times moved from 7:30 am to 8:30 am, attendance rose and car crashes involving teenage drivers fell. Some parents worry that later starts would clash with work hours. However, schools could open their libraries early for students who need to arrive sooner. Starting school an hour later costs almost nothing, yet it could make students healthier, safer and more ready to learn. Isn't that a lesson worth learning?";
  add("eng-reading", [
    mc(2, "What is the writer's main contention?", ["Schools should start later", "Teenagers are lazy", "Parents work too hard", "Libraries should close early"], "Everything in the passage supports the idea that school should start later."),
    mc(2, "According to the passage, why do teenagers naturally wake up later?", ["Their body clock shifts later during puberty", "They use phones at night", "They are lazy", "School is boring"], "The sleep scientists' explanation is about the body clock."),
    mc(2, "'Drag themselves out of bed' suggests teenagers get up…", ["Reluctantly, with effort", "Happily", "Quickly", "Silently"], "'Drag' suggests something heavy and hard to move."),
    mc(3, "Which sentence is a rebuttal (answering the other side)?", ["However, schools could open their libraries early for students who need to arrive sooner.", "Many sit through first period barely awake.", "Every morning, thousands of Victorian teenagers drag themselves out of bed.", "Isn't that a lesson worth learning?"], "It answers the parents' worry about work hours."),
    mc(3, "What is the effect of the final question?", ["It leaves readers agreeing with the writer", "It asks readers to email an answer", "It introduces a new topic", "It shows the writer is unsure"], "A rhetorical question ending makes the answer ('yes!') feel obvious."),
    mc(3, "Which is the best summary of the passage?", ["Later school starts suit teenagers' body clocks and could improve health, safety and learning at little cost.", "Teenagers should go to bed earlier.", "US schools are better than Australian schools.", "Parents must change their work hours."], "A summary gives the main idea and key supporting points in one sentence."),
  ].map((q) => ({ ...q, passage: SLEEP })));
  add("eng-grammar", [
    mc(2, "Which modal verb shows the strongest obligation?", ["must", "might", "could", "may"], "'Must' means it has to happen; 'might', 'could' and 'may' are weaker."),
    mc(2, "In 'the enormous old wooden ship', what is the main noun of the noun group?", ["ship", "enormous", "old", "wooden"], "The adjectives all describe the main noun, 'ship'."),
    mc(2, "Change to reported speech: Mia said, \"I am tired.\"", ["Mia said that she was tired.", "Mia said, I am tired.", "Mia says she will be tired.", "\"Mia said she is tired.\""], "Reported speech drops the speech marks and shifts the tense back: am → was."),
    mc(3, "Which sentence uses nominalisation (turning a verb into a noun)?", ["The destruction of the forest upset the locals.", "They destroyed the forest.", "The forest was destroyed.", "The locals were upset."], "'Destroy' (a verb) becomes 'destruction' (a noun) — common in formal writing."),
    mc(3, "Which sentence keeps its tense consistent?", ["She opened the door and walked inside.", "She opens the door and walked inside.", "She opened the door and walks inside.", "She will open the door and walked inside."], "Both verbs are in the past tense."),
    mc(3, "Which is an adverbial phrase telling WHEN?", ["after lunch", "in the park", "very quickly", "the red ball"], "'After lunch' tells when; 'in the park' tells where; 'very quickly' tells how."),
  ]);
  add("eng-vocab", [
    mc(2, "Which word has the most positive connotation (feeling)?", ["slim", "skinny", "scrawny", "bony"], "They all mean thin, but 'slim' sounds the most positive."),
    mc(2, "'Bat' (the animal) and 'bat' (for cricket) are…", ["Homonyms", "Antonyms", "Synonyms", "Prefixes"], "Homonyms are spelt and said the same but mean different things."),
    mc(3, "Which word is the most formal?", ["commence", "start", "kick off", "get going"], "'Commence' suits formal writing; the others are everyday or casual."),
    mc(3, "'Tele' (as in telephone and television) comes from Greek and means…", ["Far", "Sound", "Write", "Small"], "Telephone = far sound; television = far seeing."),
  ]);
  add("eng-figurative", [
    mc(2, "Which sentence uses imagery that appeals to the sense of smell?", ["The scent of fresh bread drifted from the bakery.", "The bell rang loudly.", "The sky was bright blue.", "The rock felt rough."], "Imagery appeals to the senses — 'scent' is about smell."),
    mc(3, "In stories and art, a dove often symbolises…", ["Peace", "Danger", "Anger", "Wealth"], "A symbol is an object that stands for a bigger idea."),
    mc(3, "'Learning a language is like building a house — you need a strong foundation first.' This is an…", ["Analogy", "Onomatopoeia", "Oxymoron", "Alliteration"], "An analogy compares two things to explain an idea."),
  ]);
  add("eng-poetry", [
    mc(1, "A poem that tells a story, often with a repeated chorus, is a…", ["Ballad", "Haiku", "Limerick", "Sonnet"], "Ballads are story poems, like 'Waltzing Matilda'."),
    mc(2, "Imagery in a poem means…", ["Words that create pictures in the reader's mind using the senses", "Pictures printed beside the poem", "The poem's title", "The number of lines"], "e.g. 'the crunch of frosty grass' helps you hear and feel the scene."),
    mc(2, "In a shape (concrete) poem…", ["The words are arranged to look like the subject", "Every line rhymes", "There are 14 lines", "There are 17 syllables"], "A poem about rain might drip down the page."),
  ]);
  add("eng-narrative", [
    mc(1, "Fantasy, mystery and science fiction are kinds of…", ["Genre", "Setting", "Theme", "Plot"], "A genre is a type of story with typical features."),
    mc(2, "Why do writers use dialogue?", ["To reveal characters and move the plot along", "To list facts", "To give instructions", "To end the story"], "What characters say (and how) shows who they are."),
    mc(3, "A story told using 'you' ('You open the door…') is in…", ["Second person", "First person", "Third person", "Omniscient"], "Second person puts the reader in the story."),
  ]);
  add("eng-persuasive", [
    mc(2, "'Act now to save our parks!' Ending with a direct instruction like this is a…", ["Call to action", "Anecdote", "Statistic", "Rebuttal"], "It tells the audience exactly what to do."),
    mc(2, "Which modal verb sounds the MOST certain?", ["will", "might", "could", "may"], "High-modality words like 'will' and 'must' sound confident and persuasive."),
    mc(3, "Why might a writer use 'we must' rather than 'you should'?", ["It sounds urgent and includes the reader in the group", "It is more polite", "It is a statistic", "It is casual slang"], "Inclusive language plus a strong modal makes action feel shared and necessary."),
  ]);
  add("eng-texttypes", [
    mc(1, "A text that combines words, images and sound (like a website or video) is…", ["Multimodal", "A haiku", "A glossary", "A caption"], "Multi = many; modes = ways of communicating."),
    mc(2, "In a procedure, what usually comes first?", ["The goal and a list of materials", "The conclusion", "An opinion", "A villain"], "You need to know what you're making and what you need before the steps."),
    mc(3, "Why might an information report use subheadings?", ["To organise information so readers find it quickly", "To make it rhyme", "To hide facts", "To tell a story"], "Subheadings break a report into clear sections."),
  ]);

  // ---------------------------------------------------------------- Science
  add("sci-cells", [
    mc(1, "Which living thing is made of just one cell?", ["Bacterium", "Tree", "Dog", "Mushroom"], "Bacteria are unicellular; the others are multicellular."),
    mc(2, "Which cell is specialised to carry messages around the body?", ["Nerve cell (neuron)", "Red blood cell", "Root hair cell", "Muscle cell"], "Long nerve cells carry electrical signals."),
    mc(2, "Root hair cells are long and thin so they can…", ["Absorb more water (more surface area)", "Make food", "Store fat", "Swim"], "The long shape gives more surface touching the soil."),
    mc(3, "New cells are made when an existing cell…", ["Divides into two", "Shrinks", "Joins a tissue", "Dies"], "Cell division lets organisms grow and repair."),
  ]);
  add("sci-body", [
    mc(1, "The place where two bones meet is a…", ["Joint", "Tendon", "Muscle", "Nerve"], "Knees, elbows and hips are joints."),
    mc(2, "Muscles are attached to bones by…", ["Tendons", "Ligaments", "Cartilage", "Veins"], "Tendons join muscle to bone; ligaments join bone to bone."),
    mc(2, "Which organ removes carbon dioxide from the body?", ["Lungs", "Kidneys", "Liver", "Stomach"], "You breathe out carbon dioxide."),
    mc(3, "Why do muscles work in pairs?", ["Muscles can only pull, not push", "Muscles can only push", "One muscle always rests", "Bones need two muscles to grow"], "e.g. the biceps bends your arm and the triceps straightens it."),
  ]);
  add("sci-energy", [
    mc(2, "Which has the most kinetic energy?", ["A truck moving at 60 km/h", "A bicycle moving at 60 km/h", "A parked truck", "A truck moving at 10 km/h"], "Kinetic energy grows with mass and speed — the heavy, fast truck has the most."),
    mc(2, "Sound energy travels as…", ["Vibrations passed between particles", "Light rays", "Electric current", "Heat only"], "Sound is particles vibrating and passing the vibration on."),
    mc(3, "Why can't sound travel through space?", ["There are no particles to vibrate", "It's too cold", "Space is too dark", "Sound is too slow"], "Space is (almost) empty, so there's nothing to carry the vibration."),
    mc(2, "In an electric circuit, the battery transfers energy to…", ["Components like globes and motors", "The wires, which store it", "The switch, which uses it all", "The air"], "Current carries energy from the battery to the components, which transform it."),
  ]);
  add("sci-rocks", [
    mc(1, "Rocks are made of naturally occurring solid substances called…", ["Minerals", "Fossils", "Magma", "Sediments"], "e.g. granite contains quartz, feldspar and mica."),
    mc(2, "How do most fossils form?", ["A dead organism is buried in sediment that slowly turns to rock", "Lava covers a living animal", "Animals turn into metamorphic rock", "Bones melt into magma"], "Layers of sediment harden around the remains over millions of years."),
    mc(2, "Soil forms mainly from…", ["Weathered rock mixed with decaying plant and animal matter", "Pure sand", "Melted rock", "Only leaves"], "Weathering makes the rock particles; humus adds nutrients."),
    mc(3, "Why are fossils rarely found in igneous rock?", ["The heat of molten rock destroys remains", "Igneous rocks are too young", "Animals avoided volcanoes", "Igneous rocks are underwater"], "Fossils need gentle burial in sediment."),
  ]);
  add("sci-change", [
    mc(1, "Which is a physical property?", ["Colour", "Flammability", "Reacting with acid", "Rusting"], "Physical properties can be observed without changing the substance."),
    mc(2, "Two clear solutions are mixed and a cloudy solid appears. The solid is a…", ["Precipitate", "Solvent", "Filtrate", "Element"], "A precipitate is a solid formed by a reaction in solution."),
    mc(2, "Burning (combustion) of a fuel needs…", ["Oxygen", "Nitrogen", "Water", "Salt"], "Fire needs fuel, heat and oxygen."),
    mc(3, "Which word equation shows methane burning?", ["methane + oxygen → carbon dioxide + water", "methane + water → oxygen", "carbon dioxide → methane + oxygen", "methane → carbon + hydrogen"], "Burning a fuel with oxygen makes carbon dioxide and water."),
  ]);
  add("sci-resources", [
    mc(1, "In the water cycle, rain, hail and snow falling are called…", ["Precipitation", "Evaporation", "Condensation", "Transpiration"], "Precipitation is water falling from clouds."),
    mc(2, "Water evaporating from plant leaves is called…", ["Transpiration", "Precipitation", "Condensation", "Runoff"], "Plants release water vapour through tiny holes in their leaves."),
  ]);
})();
