/* More topics from the Victorian Curriculum: Mathematics Level 7, English Level 7 and Science Levels 7–8.
   Each has a lesson, worked examples and questions at all three levels. Runs after bank.js, before app.js.
   Questions use the same shapes as the rest of the bank: tap-a-choice (mc), typed number (num), match and order. */
(function () {
  "use strict";
  const MATHS = YEAR_LEVELS[0].topics;

  // Choices are shuffled into a fixed order (based on the question text), so the answer isn't always first.
  const mix = (arr, seed) => {
    let x = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 11);
    const out = [...arr];
    const rnd = () => { x = (x + 0x6d2b79f5) >>> 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  };
  // The answer is always the first choice listed; it gets shuffled.
  const mc = (d, prompt, options, explanation) => ({ d, prompt, options: mix(options, prompt), answer: options[0], answerType: "text", explanation });
  const num = (d, prompt, answer, explanation, tolerance) => ({ d, prompt, answer, explanation, ...(tolerance ? { tolerance } : {}) });
  const match = (d, prompt, pairs, explanation) => ({ d, prompt, visual: { type: "match", pairs }, explanation });
  const order = (d, prompt, items, first, last, explanation) => ({ d, prompt, visual: { type: "order", items, first, last }, explanation });
  const build = (prefix, list) => list.map((item, i) => {
    const { d, ...rest } = item;
    const q = { id: `${prefix}${i + 1}`, difficulty: d, ...rest };
    if (isVisualInput(q)) q.answer = visualAnswerText(q);
    return q;
  });
  const make = (id, name, icon, info, list) => ({ id, name, icon, ...info, questions: build(`${id}-`, list) });
  window.__moreTopicTools = { mc, num, match, order, build };

  // ================================================================ Maths (Level 7)
  const maths = [
    make("y7-ratios", "Ratios and Rates", "🍹", {
      blurb: "Simplifying ratios, sharing in a ratio, rates, best buys and scale.",
      recap: "Comparing quantities with ratios, sharing amounts in a given ratio, and working with rates like speed and price per kilogram.",
      example: "Mixing cordial 1 : 4 with water, or working out which size of cereal box is the best value.",
      workedExample: {
        1: { question: "Simplify 18 : 24.", walkthrough: "Find the highest common factor of 18 and 24, which is 6. Divide both parts by 6: 18 ÷ 6 = 3 and 24 ÷ 6 = 4. So 18 : 24 = 3 : 4." },
        2: { question: "Share $50 in the ratio 2 : 3.", walkthrough: "Add the parts: 2 + 3 = 5 parts. One part is $50 ÷ 5 = $10. So the shares are 2 × $10 = $20 and 3 × $10 = $30. Check: $20 + $30 = $50." },
        3: { question: "A car travels 120 km in 1.5 hours. What is its average speed?", walkthrough: "Speed = distance ÷ time = 120 ÷ 1.5 = 80. The units are km per hour, so the speed is 80 km/h." },
      },
    }, [
      mc(1, "Write 10 : 15 in simplest form.", ["2 : 3", "10 : 15", "3 : 2", "1 : 5"], "The highest common factor of 10 and 15 is 5. 10 ÷ 5 = 2 and 15 ÷ 5 = 3, so 10 : 15 = 2 : 3."),
      mc(1, "Write 12 : 8 in simplest form.", ["3 : 2", "2 : 3", "6 : 4", "4 : 3"], "The HCF of 12 and 8 is 4. 12 ÷ 4 = 3 and 8 ÷ 4 = 2, so 12 : 8 = 3 : 2. (6 : 4 is equal, but not in simplest form.)"),
      num(1, "A class has 12 boys and 18 girls. Written in simplest form, boys : girls = 2 : x. What is x?", 3, "12 : 18 — divide both by their HCF, 6: 12 ÷ 6 = 2 and 18 ÷ 6 = 3. So boys : girls = 2 : 3, and x = 3."),
      mc(1, "A recipe uses 2 cups of flour for every 1 cup of sugar. What is the ratio of sugar to flour?", ["1 : 2", "2 : 1", "1 : 3", "3 : 1"], "Order matters in a ratio. Sugar comes first: 1 cup of sugar to 2 cups of flour, so sugar : flour = 1 : 2."),
      num(1, "A car travels 240 km in 3 hours. What is its average speed, in km/h?", 80, "Speed = distance ÷ time = 240 km ÷ 3 h = 80 km/h."),
      num(1, "Apples cost $6 for 3 kg. What is the price per kilogram, in dollars?", 2, "Price per kg = total price ÷ kilograms = $6 ÷ 3 = $2 per kg."),
      mc(1, "Which of these is a rate (it compares two different kinds of quantity)?", ["60 km per hour", "3 boys to 4 girls", "2 cups to 3 cups", "A 1 : 5 scale"], "A rate compares different units, like kilometres and hours. The others compare the same kind of thing, so they're ratios."),
      num(1, "The ratio of red to blue marbles in a bag is 3 : 5. There are 9 red marbles. How many blue marbles are there?", 15, "Red went from 3 to 9, which is × 3. Do the same to blue: 5 × 3 = 15 blue marbles."),

      num(2, "Share $60 in the ratio 1 : 2. How much is the larger share, in dollars?", 40, "Total parts = 1 + 2 = 3. One part = $60 ÷ 3 = $20. The larger share is 2 parts = $40."),
      num(2, "Share 35 lollies in the ratio 3 : 4. How many lollies are in the smaller share?", 15, "Total parts = 3 + 4 = 7. One part = 35 ÷ 7 = 5. The smaller share is 3 parts = 3 × 5 = 15 lollies."),
      num(2, "A map has a scale of 1 : 50 000. A distance of 4 cm on the map is how many kilometres in real life?", 2, "Real distance = 4 × 50 000 = 200 000 cm. 200 000 cm ÷ 100 = 2000 m, and 2000 m ÷ 1000 = 2 km."),
      mc(2, "Write 1.5 : 2.5 as a ratio of whole numbers in simplest form.", ["3 : 5", "15 : 25", "1 : 2", "5 : 3"], "Multiply both parts by 2 to remove the decimals: 3 : 5. 3 and 5 have no common factor except 1, so that's simplest form."),
      num(2, "A tap fills a 20 L bucket in 4 minutes. At this rate, how many litres does it pour in 10 minutes?", 50, "The rate is 20 L ÷ 4 min = 5 L per minute. In 10 minutes: 5 × 10 = 50 L."),
      mc(2, "Which is the better buy?", ["500 g for $4.00", "750 g for $6.30"], "Compare the price per 100 g. 500 g for $4.00 → $4.00 ÷ 5 = $0.80 per 100 g. 750 g for $6.30 → $6.30 ÷ 7.5 = $0.84 per 100 g. The 500 g pack is cheaper per gram."),
      num(2, "Cordial is mixed with water in the ratio 1 : 4. How many mL of cordial are needed to make 1 litre (1000 mL) of drink?", 200, "Total parts = 1 + 4 = 5. One part = 1000 mL ÷ 5 = 200 mL. Cordial is 1 part, so 200 mL (and 800 mL of water)."),
      mc(2, "Write 40 cm : 2 m in simplest form.", ["1 : 5", "20 : 1", "40 : 2", "1 : 50"], "First use the same units: 2 m = 200 cm. So 40 : 200. Divide both by 40: 1 : 5."),

      num(3, "Three friends share $180 in the ratio 2 : 3 : 4. How much is the largest share, in dollars?", 80, "Total parts = 2 + 3 + 4 = 9. One part = $180 ÷ 9 = $20. The largest share is 4 parts = 4 × $20 = $80."),
      num(3, "The ratio of boys to girls in a club is 4 : 5. There are 36 members. How many are girls?", 20, "Total parts = 4 + 5 = 9. One part = 36 ÷ 9 = 4 people. Girls = 5 parts = 5 × 4 = 20."),
      num(3, "The ratio of cats to dogs at a shelter is 5 : 3. There are 10 more cats than dogs. How many cats and dogs are there altogether?", 40, "The difference between cats and dogs is 5 − 3 = 2 parts, and that's 10 animals, so 1 part = 5. Altogether there are 5 + 3 = 8 parts = 8 × 5 = 40 animals."),
      num(3, "A runner covers 5 km in 25 minutes. What is their average speed, in km/h?", 12, "25 minutes = 25 ÷ 60 hours. Speed = 5 ÷ (25/60) = 5 × 60 ÷ 25 = 12 km/h. (Or: 5 km in 25 min is 1 km every 5 min, so 12 km in 60 min.)"),
      num(3, "A plane flies at 840 km/h. How many minutes does it take to fly 210 km?", 15, "Time = distance ÷ speed = 210 ÷ 840 = 0.25 hours. 0.25 × 60 = 15 minutes."),
      num(3, "Concrete is made from cement, sand and gravel in the ratio 1 : 2 : 3. How many kg of sand are needed for 90 kg of concrete?", 30, "Total parts = 1 + 2 + 3 = 6. One part = 90 ÷ 6 = 15 kg. Sand is 2 parts = 30 kg."),
      num(3, "A model car is built to a scale of 1 : 18. The model is 25 cm long. How long is the real car, in metres?", 4.5, "Real length = 25 × 18 = 450 cm. 450 cm ÷ 100 = 4.5 m."),
      num(3, "Petrol costs $1.95 per litre and a car uses 8 L per 100 km. What does the petrol cost to drive 250 km, in dollars?", 39, "250 km is 2.5 lots of 100 km, so it uses 8 × 2.5 = 20 L. Cost = 20 × $1.95 = $39."),
    ]),

    make("y7-money", "Money and Percentages", "💰", {
      blurb: "Discounts, GST, profit and loss, budgets and best buys.",
      recap: "Using percentages and decimals to solve real money problems: sales, GST, wages, profit, budgets and comparing prices.",
      example: "Working out the sale price of shoes at 30% off, or whether a bigger pack is really cheaper.",
      workedExample: {
        1: { question: "A $40 shirt has 25% off. What is the sale price?", walkthrough: "Discount = 25% of $40 = 0.25 × 40 = $10. Sale price = $40 − $10 = $30. (Shortcut: you pay 75%, and 0.75 × 40 = 30.)" },
        2: { question: "A game costs $60 before GST. What is the price with 10% GST?", walkthrough: "GST = 10% of $60 = $6. Price with GST = $60 + $6 = $66. (Shortcut: multiply by 1.1.)" },
        3: { question: "A shop sold a TV for $480, a 20% loss on what it paid. What did it pay?", walkthrough: "A 20% loss means the selling price is 80% of the cost. So 0.8 × cost = $480, and cost = $480 ÷ 0.8 = $600." },
      },
    }, [
      num(1, "A $40 T-shirt is on sale with 10% off. How much is the discount, in dollars?", 4, "10% of $40 = $40 ÷ 10 = $4."),
      num(1, "A $40 T-shirt is on sale with 25% off. What is the sale price, in dollars?", 30, "25% of $40 = $10 discount. Sale price = $40 − $10 = $30."),
      num(1, "In Australia, GST is 10%. How much GST is added to a $50 item?", 5, "10% of $50 = $50 ÷ 10 = $5."),
      num(1, "A café buys a muffin for $1.50 and sells it for $4.00. What is the profit, in dollars?", 2.5, "Profit = selling price − cost price = $4.00 − $1.50 = $2.50."),
      num(1, "You get $12 a week pocket money. How many weeks will it take to save $96?", 8, "$96 ÷ $12 per week = 8 weeks."),
      mc(1, "How do you write 15% as a decimal?", ["0.15", "1.5", "15.0", "0.015"], "Per cent means 'out of 100', so 15% = 15 ÷ 100 = 0.15."),
      num(1, "What is 20% of $85, in dollars?", 17, "10% of $85 is $8.50, so 20% is 2 × $8.50 = $17."),
      num(1, "A phone plan costs $35 a month. How much is that for a year, in dollars?", 420, "There are 12 months in a year: 12 × $35 = $420."),

      num(2, "A $120 jacket is marked down by 35%. What is the sale price, in dollars?", 78, "You pay 100% − 35% = 65%. 0.65 × $120 = $78."),
      num(2, "A game costs $60 before GST. What does it cost with 10% GST added, in dollars?", 66, "GST = 10% of $60 = $6. Total = $60 + $6 = $66 (or $60 × 1.1)."),
      num(2, "A shop buys a bike for $200 and sells it for $250. What is the profit as a percentage of the cost price?", 25, "Profit = $250 − $200 = $50. As a percentage of cost: 50 ÷ 200 × 100 = 25%."),
      num(2, "Rent goes up from $400 to $420 a week. What is the percentage increase?", 5, "Increase = $20. Percentage increase = 20 ÷ 400 × 100 = 5%."),
      mc(2, "Which is the cheapest per can?", ["Pack of 6 for $5.40", "Pack of 4 for $3.80", "Pack of 10 for $9.50", "Single can for $1.00"], "Price per can: 6 for $5.40 → $0.90. 4 for $3.80 → $0.95. 10 for $9.50 → $0.95. Single → $1.00. The pack of 6 is cheapest per can."),
      num(2, "A price including 10% GST is $55. What was the price before GST, in dollars?", 50, "The price with GST is 110% of the original, so original = $55 ÷ 1.1 = $50. (Check: $50 + $5 GST = $55.)"),
      num(2, "Mia earns $18.50 an hour and works 12 hours. How much does Mia earn, in dollars?", 222, "12 × $18.50 = $222. (12 × $18 = $216, plus 12 × $0.50 = $6.)"),
      num(2, "A $64 restaurant bill has a 10% public holiday surcharge added. What is the total bill, in dollars?", 70.4, "Surcharge = 10% of $64 = $6.40. Total = $64 + $6.40 = $70.40."),

      num(3, "A $250 bike is discounted by 20%, then there's a further 10% off the sale price. What is the final price, in dollars?", 180, "After 20% off: 0.8 × $250 = $200. Then 10% off $200: 0.9 × $200 = $180. (Note: that's 28% off overall, not 30%.)"),
      num(3, "A shop sold a TV for $480, which was a 20% loss on what it paid. How much did the shop pay, in dollars?", 600, "Selling at a 20% loss means $480 is 80% of the cost. Cost = $480 ÷ 0.8 = $600."),
      num(3, "Sam earns $600 a month and spends 40% on rent, 25% on food and 15% on transport. How much is left each month, in dollars?", 120, "Spent: 40% + 25% + 15% = 80%, so 20% is left. 20% of $600 = $120."),
      num(3, "A $90 item is increased by 10%, then the new price is decreased by 10%. What is the final price, in dollars?", 89.1, "Up 10%: $90 × 1.1 = $99. Down 10%: $99 × 0.9 = $89.10. It doesn't return to $90 because the 10% decrease is taken from a bigger amount."),
      num(3, "Which costs less per 100 g: 375 g for $4.50, or 1 kg for $11.00? Give the cheaper price per 100 g, in dollars.", 1.1, "375 g for $4.50 → $4.50 ÷ 3.75 = $1.20 per 100 g. 1 kg (1000 g) for $11 → $11 ÷ 10 = $1.10 per 100 g. The 1 kg bag is cheaper: $1.10.", 0.01),
      num(3, "A worker earns $25 an hour for a normal 38-hour week, and time-and-a-half for overtime. How much do they earn in a week with 4 hours of overtime, in dollars?", 1100, "Normal pay: 38 × $25 = $950. Overtime rate: 1.5 × $25 = $37.50, so 4 hours = $150. Total = $950 + $150 = $1100."),
      num(3, "A school fundraiser sells 150 chocolates at $3 each. Each chocolate cost the school $1.20. What is the total profit, in dollars?", 270, "Profit per chocolate = $3.00 − $1.20 = $1.80. Total = 150 × $1.80 = $270."),
      num(3, "Prices rose by 4% this year. A basket of groceries cost $150 last year. What does it cost now, in dollars?", 156, "4% of $150 = 0.04 × 150 = $6. New cost = $150 + $6 = $156."),
    ]),

    make("y7-linear", "Linear Relationships and Graphs", "📉", {
      blurb: "Rules, tables of values, growing patterns, straight-line graphs and distance–time graphs.",
      recap: "Finding rules from patterns and tables, using rules like y = 2x + 1, and reading what straight-line and distance–time graphs tell you.",
      example: "A taxi fare that starts at $4 and adds $2 per kilometre makes a straight-line graph.",
      workedExample: {
        1: { question: "Using y = 3x + 2, find y when x = 4.", walkthrough: "Substitute x = 4: y = 3 × 4 + 2 = 12 + 2 = 14." },
        2: { question: "Find the rule for the table x: 0, 1, 2, 3 and y: 1, 4, 7, 10.", walkthrough: "y goes up by 3 each time x goes up by 1, so the rule starts y = 3x. When x = 0, y = 1, so add 1: y = 3x + 1. Check x = 2: 3 × 2 + 1 = 7 ✓." },
        3: { question: "2 hours of plumbing costs $190 and 5 hours costs $370. Find the call-out fee.", walkthrough: "3 extra hours cost $370 − $190 = $180, so the hourly rate is $180 ÷ 3 = $60. For 2 hours: 2 × $60 = $120, so the call-out fee is $190 − $120 = $70." },
      },
    }, [
      num(1, "Using the rule y = x + 4, what is y when x = 3?", 7, "Substitute x = 3: y = 3 + 4 = 7."),
      num(1, "Using the rule y = 3x, what is y when x = 5?", 15, "3x means 3 × x. y = 3 × 5 = 15."),
      mc(1, "A table has x: 1, 2, 3, 4 and y: 4, 5, 6, 7. Which rule fits?", ["y = x + 3", "y = 4x", "y = x + 4", "y = 3x + 1"], "Each y is 3 more than its x: 1 + 3 = 4, 2 + 3 = 5 and so on. So y = x + 3. (y = 3x + 1 gives 4 then 7, which doesn't fit.)"),
      mc(1, "Which point lies on the line y = 2x?", ["(3, 6)", "(6, 3)", "(2, 5)", "(1, 3)"], "For a point to be on y = 2x, its y must be double its x. Only (3, 6) works: 2 × 3 = 6."),
      num(1, "A table follows the rule y = 2x + 1. What is y when x = 4?", 9, "y = 2 × 4 + 1 = 8 + 1 = 9."),
      mc(1, "On a distance–time graph, a flat (horizontal) section means the object is…", ["Not moving", "Moving fast", "Speeding up", "Moving backwards"], "Flat means time passes but the distance doesn't change, so the object has stopped."),
      num(1, "A taxi charges $4 to start plus $2 per km: C = 2k + 4. What does a 6 km trip cost, in dollars?", 16, "C = 2 × 6 + 4 = 12 + 4 = $16."),
      mc(1, "In the rule y = 5x + 2, how much does y go up each time x goes up by 1?", ["5", "2", "7", "10"], "The number multiplying x tells you the step. Each time x goes up by 1, y goes up by 5."),

      mc(2, "A table has x: 0, 1, 2, 3 and y: 1, 4, 7, 10. Which rule fits?", ["y = 3x + 1", "y = x + 3", "y = 4x", "y = 3x"], "y goes up by 3 each step, so it's 3x plus something. When x = 0, y = 1, so the rule is y = 3x + 1."),
      num(2, "A row of triangles made from matches uses 3 matches for 1 triangle, 5 for 2 and 7 for 3. How many matches are needed for 10 triangles?", 21, "Each new triangle adds 2 matches, and there's 1 extra to start: m = 2n + 1. For n = 10: 2 × 10 + 1 = 21."),
      num(2, "Using y = 2x − 3, what is x when y = 11?", 7, "11 = 2x − 3. Add 3 to both sides: 14 = 2x. Divide by 2: x = 7."),
      mc(2, "Which line is the steepest?", ["y = 4x + 1", "y = 2x + 5", "y = x + 10", "y = 3x"], "Steepness depends on the number multiplying x (the gradient), not the number added. 4 is the biggest, so y = 4x + 1 is steepest."),
      num(2, "A candle is 20 cm tall and burns 2 cm every hour: h = 20 − 2t. How tall is it after 6 hours, in cm?", 8, "h = 20 − 2 × 6 = 20 − 12 = 8 cm."),
      num(2, "Using the candle rule h = 20 − 2t, after how many hours does it burn out (h = 0)?", 10, "0 = 20 − 2t, so 2t = 20 and t = 10 hours."),
      mc(2, "Where does the line y = 2x + 3 cross the y-axis?", ["(0, 3)", "(3, 0)", "(0, 2)", "(2, 3)"], "On the y-axis x = 0, so y = 2 × 0 + 3 = 3. The point is (0, 3)."),
      mc(2, "A distance–time graph is a straight line from (0 h, 0 km) to (2 h, 100 km). What is the speed?", ["50 km/h", "100 km/h", "200 km/h", "2 km/h"], "Speed = distance ÷ time = 100 km ÷ 2 h = 50 km/h."),

      num(3, "Phone plan A: $20 a month plus $0.10 per text. Plan B: $30 a month with unlimited texts. How many texts make the two plans cost the same?", 100, "Set them equal: 20 + 0.1t = 30. So 0.1t = 10 and t = 100 texts."),
      num(3, "The point (k, 13) lies on the line y = 3x − 2. What is k?", 5, "Substitute y = 13: 13 = 3k − 2. Add 2: 15 = 3k. Divide by 3: k = 5."),
      num(3, "A linear rule gives y = 9 when x = 2, and y = 18 when x = 5. What is y when x = 10?", 33, "x went up by 3 and y went up by 9, so y goes up 3 for each 1: y = 3x + c. Using (2, 9): 9 = 6 + c, so c = 3. When x = 10: y = 30 + 3 = 33."),
      mc(3, "Which rule matches the straight line through (0, −1) and (2, 3)?", ["y = 2x − 1", "y = x − 1", "y = 2x + 1", "y = −x + 2"], "From x = 0 to x = 2, y rises from −1 to 3, which is 4 up for 2 across: a gradient of 2. It crosses the y-axis at −1, so y = 2x − 1."),
      num(3, "A plumber charges a call-out fee plus an hourly rate. 2 hours costs $190 and 5 hours costs $370. What is the call-out fee, in dollars?", 70, "3 extra hours cost $180, so the rate is $60 an hour. 2 hours of work = $120, so the call-out fee = $190 − $120 = $70."),
      mc(3, "Alex walks to a shop, stays there a while, then walks home faster than on the way there. Which describes the distance-from-home graph?", ["Line going up, flat line, then a steeper line coming down", "Line going up, line coming down, then a flat line", "Flat line, line up, then line down", "Steep line up, flat line, then a gentler line down"], "Walking away: distance rises. At the shop: flat. Walking home faster: distance falls more quickly, so the line down is steeper than the line up."),
      num(3, "The pattern 5, 9, 13, 17, … continues. What is the 20th term?", 81, "It goes up by 4 each time, so term = 4n + 1 (check n = 1: 5 ✓). The 20th term = 4 × 20 + 1 = 81."),
      num(3, "A tank holds 500 L and leaks 15 L a day. After how many full days will it first hold less than 300 L?", 14, "It needs to lose more than 200 L. 200 ÷ 15 = 13.3…, so after 13 days it still has 305 L, and after 14 days it has 500 − 210 = 290 L. Answer: 14 days."),
    ]),

    make("y7-transform", "Transformations and Symmetry", "🔄", {
      blurb: "Translations, reflections, rotations on the Cartesian plane, and line and rotational symmetry.",
      recap: "Sliding, flipping and turning shapes and points on the Cartesian plane, and finding lines of symmetry and the order of rotational symmetry.",
      example: "Tiles, logos and flags often use reflections and rotations to make patterns.",
      workedExample: {
        1: { question: "Translate (2, 3) right 4 and down 1.", walkthrough: "Right changes x: 2 + 4 = 6. Down changes y: 3 − 1 = 2. The new point is (6, 2)." },
        2: { question: "Reflect (4, −2) in the x-axis.", walkthrough: "Reflecting in the x-axis flips up and down, so x stays the same and y changes sign: (4, −2) → (4, 2)." },
        3: { question: "Rotate (2, 5) by 90° anticlockwise about the origin.", walkthrough: "A 90° anticlockwise turn about the origin sends (x, y) to (−y, x). So (2, 5) → (−5, 2). Check: the point moved from the 1st quadrant to the 2nd, a quarter-turn anticlockwise." },
      },
    }, [
      mc(1, "Which transformation slides a shape without turning or flipping it?", ["Translation", "Reflection", "Rotation", "Enlargement"], "A translation slides every point the same distance in the same direction."),
      mc(1, "Which transformation flips a shape over a line, like a mirror?", ["Reflection", "Translation", "Rotation", "Enlargement"], "A reflection flips a shape over a mirror line."),
      num(1, "How many lines of symmetry does a square have?", 4, "A square has 4: one vertical, one horizontal and two diagonals."),
      num(1, "How many lines of symmetry does an equilateral triangle have?", 3, "One line from each corner to the middle of the opposite side: 3 lines."),
      num(1, "How many lines of symmetry does a rectangle (that isn't a square) have?", 2, "One vertical and one horizontal. The diagonals are NOT lines of symmetry for a rectangle."),
      mc(1, "Translate the point (2, 3) right 4 units. Where does it end up?", ["(6, 3)", "(2, 7)", "(−2, 3)", "(6, 7)"], "Moving right adds to x: 2 + 4 = 6. y doesn't change. New point: (6, 3)."),
      mc(1, "Which capital letter has a vertical line of symmetry?", ["A", "F", "J", "R"], "A can be folded down the middle so both halves match. F, J and R can't."),
      num(1, "What is the order of rotational symmetry of a regular hexagon?", 6, "A regular hexagon looks the same 6 times in one full turn (every 60°)."),

      mc(2, "Reflect the point (4, −2) in the x-axis.", ["(4, 2)", "(−4, −2)", "(−4, 2)", "(2, 4)"], "Reflecting in the x-axis keeps x and changes the sign of y: (4, −2) → (4, 2)."),
      mc(2, "Reflect the point (−3, 5) in the y-axis.", ["(3, 5)", "(−3, −5)", "(3, −5)", "(5, −3)"], "Reflecting in the y-axis keeps y and changes the sign of x: (−3, 5) → (3, 5)."),
      mc(2, "Translate (−1, 4) by 3 units left and 5 units down.", ["(−4, −1)", "(2, −1)", "(−4, 9)", "(2, 9)"], "Left 3: −1 − 3 = −4. Down 5: 4 − 5 = −1. New point: (−4, −1)."),
      mc(2, "Rotate the point (3, 1) by 180° about the origin.", ["(−3, −1)", "(3, −1)", "(−3, 1)", "(1, 3)"], "A half-turn about the origin changes the sign of both coordinates: (3, 1) → (−3, −1)."),
      num(2, "What is the order of rotational symmetry of a parallelogram that isn't a rectangle or rhombus?", 2, "It looks the same after a half-turn (180°) and a full turn, so its order is 2. It has no lines of symmetry."),
      mc(2, "A shape is rotated 90° clockwise four times. Where does it end up?", ["Back where it started", "Upside down", "Flipped over", "Facing left"], "4 × 90° = 360°, a full turn, so it's back to the start."),
      num(2, "A point moves from (1, 2) to (6, −1). How many units did it move to the right?", 5, "Only x tells you left/right: 6 − 1 = 5 units right. (It also moved 3 down.)"),
      mc(2, "Which transformations keep a shape exactly the same size and shape?", ["Translations, reflections and rotations", "Only translations", "Only enlargements", "None of them"], "Translations, reflections and rotations only move a shape. Enlargements change its size."),

      mc(3, "Rotate the point (2, 5) by 90° anticlockwise about the origin.", ["(−5, 2)", "(5, −2)", "(−2, −5)", "(2, −5)"], "90° anticlockwise about the origin: (x, y) → (−y, x). So (2, 5) → (−5, 2)."),
      mc(3, "Rotate the point (4, 1) by 90° clockwise about the origin.", ["(1, −4)", "(−1, 4)", "(−4, −1)", "(4, −1)"], "90° clockwise about the origin: (x, y) → (y, −x). So (4, 1) → (1, −4)."),
      mc(3, "Triangle A(1, 1), B(4, 1), C(1, 3) is reflected in the y-axis. Where does B end up?", ["(−4, 1)", "(4, −1)", "(−4, −1)", "(1, 4)"], "Reflecting in the y-axis changes the sign of x only: B(4, 1) → (−4, 1)."),
      mc(3, "The point (3, −2) is reflected in the x-axis, then translated 4 units left. Where does it end up?", ["(−1, 2)", "(7, 2)", "(−1, −2)", "(3, 6)"], "Reflect in the x-axis: (3, −2) → (3, 2). Then 4 left: 3 − 4 = −1. Final point: (−1, 2)."),
      num(3, "How many lines of symmetry does a regular octagon have?", 8, "A regular polygon with n sides has n lines of symmetry, so an octagon has 8."),
      mc(3, "Which letter has rotational symmetry of order 2 but no lines of symmetry?", ["S", "H", "A", "T"], "S looks the same upside down (order 2) but can't be folded onto itself. H has order 2 but also has lines of symmetry; A and T have a line but no rotational symmetry."),
      mc(3, "A point is reflected in the x-axis, then the result is reflected in the y-axis. This is the same as…", ["A rotation of 180° about the origin", "A translation", "A reflection in the x-axis", "No change at all"], "Both reflections together change the sign of both coordinates: (x, y) → (x, −y) → (−x, −y). That's exactly a 180° rotation about the origin."),
      num(3, "A square has corners (1, 1), (3, 1), (3, 3) and (1, 3). It is translated so that (1, 1) moves to (−2, 4). What is the new y-coordinate of the corner that started at (3, 3)?", 6, "(1, 1) → (−2, 4) means 3 left and 3 up. So (3, 3) → (0, 6). Its y-coordinate is 6."),
    ]),

    make("y7-3d", "3D Objects and Nets", "🧊", {
      blurb: "Faces, edges and vertices, prisms and pyramids, nets, views and Euler's formula.",
      recap: "Describing 3D objects by their faces, edges and vertices, drawing nets and views, and using Euler's formula F + V − E = 2.",
      example: "A cereal box unfolds into a net of six rectangles — designers use nets to plan packaging.",
      workedExample: {
        1: { question: "How many faces, edges and vertices does a triangular prism have?", walkthrough: "It has 2 triangular ends and 3 rectangular sides: 5 faces. Each triangle has 3 edges (6 total) plus 3 edges joining them: 9 edges. Each triangle has 3 corners: 6 vertices." },
        2: { question: "Check Euler's formula for a cube.", walkthrough: "A cube has F = 6, V = 8, E = 12. F + V − E = 6 + 8 − 12 = 2 ✓. This works for every polyhedron." },
        3: { question: "A prism has 24 edges. How many faces does it have?", walkthrough: "A prism with an n-sided end has 3n edges (n on each end plus n joining them). 3n = 24, so n = 8. Faces = 2 ends + 8 sides = 10." },
      },
    }, [
      num(1, "How many faces does a cube have?", 6, "A cube has 6 square faces: top, bottom, front, back, left and right."),
      num(1, "How many edges does a cube have?", 12, "4 around the top, 4 around the bottom and 4 upright ones: 12 edges."),
      num(1, "How many vertices (corners) does a square-based pyramid have?", 5, "4 corners on the square base plus 1 at the top (the apex): 5 vertices."),
      mc(1, "Which of these is a prism (same cross-section all the way through)?", ["Triangular prism", "Cone", "Sphere", "Square pyramid"], "A triangular prism has the same triangle shape all the way along. Pyramids and cones come to a point; a sphere is round."),
      mc(1, "A net made of 6 equal squares folds into which shape?", ["Cube", "Square pyramid", "Triangular prism", "Cylinder"], "A cube has 6 equal square faces, so its net is 6 squares."),
      mc(1, "Which object has one curved surface and two flat circular faces?", ["Cylinder", "Cone", "Sphere", "Cube"], "A cylinder (like a can) has two circles joined by one curved surface."),
      num(1, "How many faces does a triangular prism have?", 5, "2 triangles (the ends) + 3 rectangles (the sides) = 5 faces."),
      match(1, "Match each object to its faces.", [["Cube", "6 squares"], ["Square pyramid", "1 square and 4 triangles"], ["Triangular prism", "2 triangles and 3 rectangles"], ["Tetrahedron", "4 triangles"]], "Prisms have two matching ends joined by rectangles; pyramids have one base with triangles meeting at a point."),

      num(2, "Euler's formula is F + V − E = 2. A shape has 8 faces and 12 vertices. How many edges does it have?", 18, "E = F + V − 2 = 8 + 12 − 2 = 18."),
      num(2, "How many edges does a pentagonal prism have?", 15, "5 edges on each pentagon end (10) plus 5 edges joining them: 15."),
      num(2, "How many vertices does a hexagonal pyramid have?", 7, "6 corners on the hexagon base plus 1 apex: 7 vertices."),
      mc(2, "The view looking straight down on an object is called the…", ["Plan view (top view)", "Front view", "Side view", "Net"], "The plan is the bird's-eye view from directly above."),
      mc(2, "What does a square-based pyramid look like from directly above?", ["A square with lines from each corner to the centre", "A triangle", "A circle", "A plain rectangle"], "From above you see the square base, with the four sloping edges meeting at the apex in the middle."),
      num(2, "How many faces does an octagonal prism have?", 10, "2 octagon ends + 8 rectangular sides = 10 faces."),
      mc(2, "Which of these is NOT a polyhedron (a solid with only flat faces)?", ["Cylinder", "Cube", "Triangular prism", "Square pyramid"], "A cylinder has a curved surface, so it isn't a polyhedron."),
      num(2, "A cube is built from 1 cm cubes: 3 long, 3 wide and 3 high. How many small cubes is that?", 27, "3 × 3 × 3 = 27 small cubes."),

      num(3, "A prism has 24 edges. How many faces does it have?", 10, "A prism with n-sided ends has 3n edges, so 3n = 24 and n = 8. Faces = 2 ends + 8 sides = 10."),
      num(3, "A pyramid has 10 edges. How many vertices does it have?", 6, "A pyramid with an n-sided base has 2n edges, so n = 5. Vertices = 5 base corners + 1 apex = 6."),
      num(3, "A polyhedron has 12 faces and 30 edges. How many vertices does it have?", 20, "F + V − E = 2, so V = 2 − F + E = 2 − 12 + 30 = 20."),
      num(3, "The outside of a 3 × 3 × 3 cube made of small cubes is painted. How many small cubes have paint on exactly 3 faces?", 8, "Only the corner cubes show 3 faces, and a cube has 8 corners."),
      num(3, "The same painted 3 × 3 × 3 cube: how many small cubes have no paint at all?", 1, "Only the single cube right in the centre is hidden on every side."),
      num(3, "A rectangular prism is 5 cm × 4 cm × 3 cm. Its net has 2 rectangles of each size. What is its total surface area, in cm²?", 94, "Face areas: 5 × 4 = 20, 5 × 3 = 15, 4 × 3 = 12. Each appears twice: 2 × (20 + 15 + 12) = 2 × 47 = 94 cm²."),
      num(3, "A cube has a surface area of 54 cm². What is its side length, in cm?", 3, "6 equal faces, so each face = 54 ÷ 6 = 9 cm². The side is √9 = 3 cm."),
      num(3, "How many faces meet at each vertex of a cube?", 3, "At every corner of a cube, 3 square faces meet (e.g. top, front and side)."),
    ]),
  ];
  maths.forEach((t) => MATHS.push(t));

  // ================================================================ English (Level 7)
  const english = [
    make("eng-poetry", "Poetry", "🎼", {
      blurb: "Rhyme, rhythm, stanzas, poetic devices, forms like haiku and limericks, and mood.",
      recap: "How poets use sound, rhythm, imagery and form to create meaning and mood, and how to describe a poem's rhyme scheme and devices.",
      example: "Song lyrics are poems set to music — they use rhyme, rhythm and repetition (the chorus) on purpose.",
      workedExample: {
        1: { question: "Is 'Silly snakes slide slowly' alliteration or onomatopoeia?", walkthrough: "The words start with the same 's' sound, so it's alliteration. Onomatopoeia is a word that sounds like its meaning (buzz, crash)." },
        2: { question: "Find the rhyme scheme: sea / high / me / sky.", walkthrough: "Give the first ending sound A (sea). 'High' is new: B. 'Me' rhymes with sea: A. 'Sky' rhymes with high: B. So the rhyme scheme is ABAB." },
        3: { question: "Explain the effect of 'The ocean is a hungry, roaring beast'.", walkthrough: "It's a metaphor (the ocean IS a beast) with personification (hungry, roaring). It makes the sea seem dangerous and alive, creating a threatening mood." },
      },
    }, [
      mc(1, "A group of lines in a poem (like a paragraph) is called a…", ["Stanza", "Chapter", "Caption", "Heading"], "A stanza is a group of lines in a poem, separated by a blank line."),
      mc(1, "Which pair of words rhymes?", ["Light and night", "Light and lamp", "Night and day", "Moon and star"], "Rhyming words have the same ending sound: l-ight, n-ight."),
      mc(1, "'Buzz', 'sizzle' and 'crash' are examples of…", ["Onomatopoeia", "Alliteration", "Metaphor", "Rhyme"], "Onomatopoeia: words that sound like the noise they describe."),
      mc(1, "'Silly snakes slide slowly' uses…", ["Alliteration", "Onomatopoeia", "Simile", "Personification"], "Alliteration repeats the first consonant sound — here 's'."),
      num(1, "A haiku has three lines. How many syllables are in its first line?", 5, "A traditional haiku follows 5–7–5 syllables, so the first line has 5."),
      num(1, "How many syllables does a whole traditional haiku have?", 17, "5 + 7 + 5 = 17 syllables."),
      mc(1, "A poem without a regular rhyme or rhythm is called…", ["Free verse", "A limerick", "A sonnet", "A haiku"], "Free verse has no fixed pattern of rhyme or rhythm."),
      num(1, "How many syllables are in the word 'butterfly'?", 3, "but-ter-fly: 3 syllables (clap it out)."),

      mc(2, "What is the rhyme scheme? 'The cat sat on the mat / It wore a purple hat / It looked up at the moon / And sang a happy tune'", ["AABB", "ABAB", "ABBA", "ABCD"], "mat/hat rhyme (A, A), then moon/tune rhyme (B, B): AABB."),
      mc(2, "What is the rhyme scheme? 'I wandered by the sea / The waves were rolling high / A gull flew over me / And vanished in the sky'", ["ABAB", "AABB", "ABBA", "AAAA"], "sea (A), high (B), me (A), sky (B): ABAB."),
      num(2, "How many lines does a limerick have?", 5, "A limerick has 5 lines and is usually funny."),
      mc(2, "What is a limerick's rhyme scheme?", ["AABBA", "ABABA", "AABB", "ABCDE"], "Lines 1, 2 and 5 rhyme (A); the short lines 3 and 4 rhyme with each other (B): AABBA."),
      mc(2, "'The wind whispered through the trees' uses…", ["Personification", "Onomatopoeia", "Simile", "Hyperbole"], "Wind can't really whisper — giving it a human action is personification."),
      mc(2, "The feeling a poem creates in the reader is its…", ["Mood", "Rhyme", "Stanza", "Meter"], "Mood is the atmosphere or feeling the reader gets (e.g. eerie, joyful)."),
      mc(2, "The poet's attitude towards the subject (e.g. angry, playful) is the…", ["Tone", "Setting", "Plot", "Rhyme scheme"], "Tone is the writer's attitude; mood is the reader's feeling."),
      num(2, "How many lines does a sonnet have?", 14, "A sonnet is a 14-line poem, often about love."),

      mc(3, "Why might a poet repeat a line at the end of every stanza (a refrain)?", ["To emphasise a key idea and create rhythm", "To make the poem shorter", "Because they ran out of ideas", "To show a new speaker"], "A refrain hammers home the main idea and gives the poem a song-like rhythm."),
      mc(3, "'Hope is the thing with feathers' (Emily Dickinson) is an example of…", ["Metaphor", "Simile", "Onomatopoeia", "Alliteration"], "Hope is described as if it IS a bird — a metaphor (no 'like' or 'as')."),
      mc(3, "In 'The dark, damp, dreary dungeon', the alliteration mainly helps to…", ["Create a gloomy, heavy mood", "Make the reader laugh", "Show the time of day", "Introduce a character"], "The heavy repeated 'd' sounds and gloomy words build a dark, oppressive mood."),
      mc(3, "Short lines, hard sounds like 'k', 't' and 'b', and lots of full stops would most likely make a poem feel…", ["Tense and abrupt", "Calm and flowing", "Sleepy", "Romantic"], "Short, choppy lines and harsh consonants speed up the reading and create tension."),
      mc(3, "Enjambment is when…", ["A sentence runs on from one line to the next without a pause", "A line ends with a full stop", "Two lines rhyme", "A poem has no title"], "With enjambment the sentence carries over the line break, pulling the reader forward."),
      mc(3, "Which line uses assonance (repeated vowel sounds)?", ["The rain in Spain stays mainly on the plain", "Crack! went the whip", "Bang, crash, thud", "Big brown bears"], "The repeated long 'ay' vowel sound (rain, Spain, stays, mainly, plain) is assonance."),
      mc(3, "'The ocean is a hungry, roaring beast' uses which two techniques?", ["Metaphor and personification", "Simile and onomatopoeia", "Alliteration and rhyme", "Hyperbole and simile"], "The ocean IS a beast (metaphor), and it's hungry and roaring (personification)."),
      mc(3, "A poem about a lost dog uses slow rhythm, long vowel sounds and words like 'empty' and 'grey'. What is its mood?", ["Sad and lonely", "Excited", "Funny", "Angry"], "Slow rhythm, long sounds and bleak words create a sad, lonely mood."),
    ]),

    make("eng-narrative", "Character, Plot and Point of View", "🎬", {
      blurb: "Narrative structure, characters, conflict, setting, point of view and theme.",
      recap: "How stories are built — orientation, complication, climax and resolution — and how authors use characters, conflict, setting and point of view to create meaning.",
      example: "Most films follow the same structure as a narrative: meet the hero, a problem hits, a big showdown, then a resolution.",
      workedExample: {
        1: { question: "'I opened the door and screamed.' What point of view is this?", walkthrough: "The narrator uses 'I', so it's first person — the story is told by a character in it." },
        2: { question: "'Jack's hands shook as he reached for the letter.' How is Jack feeling?", walkthrough: "The writer doesn't name the feeling — they show it through an action (shaking hands). Shaking suggests Jack is nervous or scared. This is 'show, don't tell'." },
        3: { question: "What is the theme of a story where a selfish girl loses her friends, then learns to share?", walkthrough: "Theme is the big message about life, not the plot. Here it's something like 'kindness and sharing build real friendships'." },
      },
    }, [
      mc(1, "The main character in a story is the…", ["Protagonist", "Antagonist", "Narrator", "Author"], "The protagonist is the main character the story follows."),
      mc(1, "The character or force working against the main character is the…", ["Antagonist", "Protagonist", "Setting", "Theme"], "The antagonist creates conflict for the protagonist."),
      mc(1, "Where and when a story takes place is the…", ["Setting", "Plot", "Climax", "Theme"], "Setting = place + time."),
      mc(1, "'I opened the door and screamed.' This is told in…", ["First person", "Second person", "Third person", "No person"], "'I' shows a first-person narrator."),
      mc(1, "'She opened the door and screamed.' This is told in…", ["Third person", "First person", "Second person", "No person"], "'She' shows a third-person narrator outside the story."),
      mc(1, "The problem the characters face is the…", ["Complication", "Resolution", "Orientation", "Setting"], "The complication is the problem that drives the story."),
      mc(1, "The part where the problem is solved is the…", ["Resolution", "Orientation", "Climax", "Complication"], "The resolution ties things up after the climax."),
      order(1, "Put the parts of a narrative in order.", ["Orientation", "Complication", "Rising action", "Climax", "Resolution"], "Start", "End", "Introduce characters and setting, then a problem, tension builds, the big moment, and finally the problem is solved."),

      mc(2, "'Jack's hands shook as he reached for the letter.' This shows Jack is…", ["Nervous", "Bored", "Happy", "Sleepy"], "Shaking hands suggest nerves — the writer shows the feeling instead of naming it."),
      mc(2, "Showing a character's feelings through actions instead of naming them is called…", ["Show, don't tell", "Foreshadowing", "Flashback", "Dialogue"], "'Her fists clenched' shows anger; 'she was angry' tells it."),
      mc(2, "A hint early in a story about something that will happen later is…", ["Foreshadowing", "Flashback", "Resolution", "Setting"], "Foreshadowing builds suspense by hinting at the future."),
      mc(2, "A scene that jumps back to an earlier time is a…", ["Flashback", "Foreshadowing", "Climax", "Cliffhanger"], "A flashback shows past events to explain the present."),
      mc(2, "A narrator who knows the thoughts and feelings of every character is…", ["Third person omniscient", "First person", "Third person limited", "Second person"], "Omniscient means 'all-knowing'."),
      mc(2, "The most exciting, tense turning point of a story is the…", ["Climax", "Orientation", "Resolution", "Introduction"], "The climax is the peak of tension, just before things start to resolve."),
      mc(2, "A character who changes and learns something during the story is a…", ["Dynamic character", "Static character", "Narrator", "Minor character"], "Dynamic characters change; static characters stay the same."),
      mc(2, "A character battling their own fear is an example of which conflict?", ["Character vs self", "Character vs nature", "Character vs society", "Character vs character"], "Inner struggles (fear, guilt, a hard choice) are character vs self."),

      mc(3, "The message or big idea about life a story explores is the…", ["Theme", "Plot", "Setting", "Genre"], "Theme is the deeper message (e.g. 'courage means acting despite fear'), not what happens."),
      mc(3, "Why might an author tell a story in first person?", ["To let readers share the narrator's thoughts and feelings closely", "To show every character's thoughts equally", "To turn it into a poem", "To avoid having a main character"], "First person puts us inside one character's head, making it personal — but we only see what they know."),
      mc(3, "A first-person narrator who can't be fully trusted (they lie or misunderstand) is…", ["An unreliable narrator", "An omniscient narrator", "A protagonist's antagonist", "A static character"], "An unreliable narrator makes readers question what's really happening."),
      mc(3, "A survivor stranded on an island battles hunger and wild storms. What is the main conflict?", ["Character vs nature", "Character vs society", "Character vs self", "Character vs technology"], "The struggle is against the natural world: weather and survival."),
      mc(3, "'The old house groaned in the wind, its broken windows staring like empty eyes.' The setting mainly…", ["Builds an eerie, tense mood", "Gives a weather forecast", "Shows a theme of friendship", "Resolves the story"], "Personification (groaned) and the simile (like empty eyes) make the house creepy, building suspense."),
      mc(3, "Which ending is a cliffhanger?", ["The phone rang. Mia stared at the name on the screen and froze.", "Everyone went home and lived happily.", "The team won the final and celebrated.", "Tom said sorry and they became friends again."], "A cliffhanger stops at a moment of suspense, leaving the reader desperate to know what happens."),
      mc(3, "An author gives the villain a sad backstory. The most likely purpose is to…", ["Make readers feel some sympathy and make the villain more complex", "Make the story shorter", "Describe the setting", "Explain the rules of a game"], "A backstory makes a character more believable and complicates how we judge them."),
      mc(3, "A character always says 'It's not my fault!', but in the last chapter says 'I messed up.' This shows…", ["Character development", "A flashback", "Foreshadowing", "A change of setting"], "Taking responsibility at the end shows the character has grown — character development."),
    ]),

    make("eng-persuasive", "Persuasive Language", "📣", {
      blurb: "Contentions, persuasive techniques, fact and opinion, audience, evidence and bias.",
      recap: "How writers and speakers try to convince an audience, the techniques they use, and how to judge whether an argument is strong.",
      example: "Ads, election posters, opinion columns and even school captain speeches all use persuasive techniques.",
      workedExample: {
        1: { question: "Is 'Melbourne is the best city in the world' a fact or an opinion?", walkthrough: "'Best' is a judgement that people can disagree on, and it can't be proven. So it's an opinion. A fact can be checked, e.g. 'Melbourne is in Victoria'." },
        2: { question: "Name the technique: 'It's cheap, it's easy and it's fun!'", walkthrough: "Three ideas in a row with the same pattern — the rule of three (a triple). It sounds complete and is easy to remember." },
        3: { question: "Which is stronger evidence for 'Schools should start later'?", walkthrough: "'A study of 9000 students found later starts improved grades' beats 'My friend hates mornings'. The study is large, relevant and checkable; the friend is one personal opinion." },
      },
    }, [
      mc(1, "'Don't we all want a safer school?' is an example of…", ["A rhetorical question", "A statistic", "An expert opinion", "An anecdote"], "A rhetorical question isn't meant to be answered — the answer ('yes!') is obvious, so the audience agrees."),
      mc(1, "The main argument or position in a persuasive text is the…", ["Contention", "Conclusion", "Caption", "Character"], "The contention is the writer's main point of view."),
      mc(1, "Which is a fact?", ["Melbourne is in Victoria.", "Melbourne is the best city in the world.", "Summer is the nicest season.", "Footy is boring."], "A fact can be checked and proven true. The others are opinions."),
      mc(1, "Which is an opinion?", ["Chocolate is the tastiest food.", "Water boils at 100 °C at sea level.", "There are 7 days in a week.", "Canberra is Australia's capital."], "'Tastiest' is a personal judgement — people disagree."),
      mc(1, "Words like 'we', 'us' and 'our' that make the reader feel part of a group are…", ["Inclusive language", "Emotive language", "Statistics", "Repetition"], "Inclusive language makes the audience feel they're on the writer's side."),
      mc(1, "'Innocent, helpless puppies are being abandoned every day.' Which technique is used?", ["Emotive language", "Statistics", "Rhetorical question", "Inclusive language"], "'Innocent' and 'helpless' are chosen to stir up strong feelings."),
      mc(1, "'9 out of 10 dentists recommend…' uses…", ["Statistics", "Rhetorical question", "Alliteration", "Anecdote"], "Numbers and data make a claim sound proven."),
      mc(1, "The main purpose of a persuasive text is to…", ["Convince the reader to agree or act", "Tell a made-up story", "Give step-by-step instructions", "Retell events in order"], "Persuasive texts aim to change what people think or do."),

      mc(2, "'According to Professor Lee, a sleep scientist, teenagers need 9 hours of sleep.' This is…", ["Expert opinion", "Anecdote", "Hyperbole", "Inclusive language"], "Quoting an expert adds authority to an argument."),
      mc(2, "'Last year my cousin broke her arm on that playground.' This short personal story is an…", ["Anecdote", "Expert opinion", "Statistic", "Rhetorical question"], "An anecdote is a brief real-life story used as evidence."),
      mc(2, "'It's cheap, it's easy and it's fun!' uses…", ["The rule of three", "Statistics", "Expert opinion", "A rhetorical question"], "Three matching ideas in a row is a 'triple' — memorable and convincing."),
      mc(2, "'This homework is taking a million years!' is…", ["Hyperbole", "Statistics", "Expert opinion", "Inclusive language"], "Hyperbole is deliberate exaggeration for effect."),
      mc(2, "Who is the most likely audience for an ad saying 'Pester your parents for the new SuperSlide today!'?", ["Children", "Retired people", "Business owners", "Teachers"], "It tells the reader to pester their parents, so it targets kids."),
      mc(2, "Which word is the most emotive way to describe a large crowd at a protest?", ["Mob", "Group", "Gathering", "Number of people"], "'Mob' suggests danger and disorder — a loaded word."),
      mc(2, "Which sentence has the most formal register for a letter to the council?", ["I am writing to express my concern about the lack of bike paths.", "Hey, the bike paths around here are pretty rubbish.", "OMG we need bike paths!!!", "Bike paths, yeah? Sort it out."], "Formal letters use polite, complete sentences and no slang."),
      mc(2, "A writer says 'Some people say uniforms are expensive', then explains why that isn't a good reason. This is…", ["A rebuttal", "Hyperbole", "An anecdote", "Inclusive language"], "A rebuttal answers the other side's argument, making your own case stronger."),

      mc(3, "Why might a speaker open with a rhetorical question?", ["To make the audience think and agree with the answer the speaker wants", "To get the audience to put their hands up", "To give exact facts", "To end the speech"], "It hooks the audience and leads them to the speaker's answer."),
      mc(3, "An article about a new freeway only quotes the company building it. This suggests the article may be…", ["Biased", "Balanced", "Fictional", "Procedural"], "Using only one side's voices shows bias — other views are missing."),
      mc(3, "'If we don't ban phones in class, students will fail, schools will close and our future will be ruined.' What's wrong with this argument?", ["It exaggerates a chain of consequences without evidence", "It uses too many statistics", "It is too formal", "It quotes an expert"], "This 'slippery slope' jumps to extreme outcomes without proof."),
      mc(3, "Which is the strongest evidence for 'Schools should start later'?", ["A study of 9000 students found later starts improved grades and attendance.", "My friend hates getting up early.", "Everyone knows mornings are bad.", "Starting later would be awesome."], "Large, relevant research is far stronger than one opinion or a vague claim."),
      mc(3, "A charity ad shows a shivering, wet dog looking at the camera. The image mainly aims to make readers feel…", ["Sympathy and guilt, so they donate", "Excited to buy a dog", "Angry at the photographer", "Hungry"], "Images are persuasive too — this one tugs at emotions to prompt a donation."),
      mc(3, "'Some may call it a small change, but for our town's children it is a lifeline.' The word 'lifeline' mainly…", ["Makes the change sound vital and urgent", "Gives a statistic", "Describes the setting", "Shows the writer is unsure"], "'Lifeline' is a metaphor suggesting survival depends on it — powerful emotive language."),
      mc(3, "Which connective best introduces an opposing point in a persuasive essay?", ["However,", "Firstly,", "In addition,", "For example,"], "'However' signals a contrast — perfect for raising (and then rebutting) the other side."),
      mc(3, "Which is the best contention for an essay on homework?", ["Primary students should have no more than 30 minutes of homework a night.", "Homework.", "Some people do homework.", "I did my homework yesterday."], "A good contention is a clear, arguable position — not just a topic or a fact."),
    ]),

    make("eng-texttypes", "Text Types, Purpose and Audience", "🗂️", {
      blurb: "Narratives, recounts, procedures, reports, explanations and persuasive texts — and who they're for.",
      recap: "Recognising text types by their purpose, structure and language features, and choosing language to suit an audience.",
      example: "A recipe, a news article and a movie review are written very differently because they have different jobs.",
      workedExample: {
        1: { question: "What text type is a recipe, and how can you tell?", walkthrough: "It's a procedure: it has a goal (the dish), a list of ingredients, and numbered steps that start with command verbs like 'mix' and 'bake'." },
        2: { question: "Why are recounts usually in past tense?", walkthrough: "A recount retells events that already happened (an excursion, a diary entry), so it uses past tense and time connectives like 'first', 'then' and 'afterwards'." },
        3: { question: "How would you change a science explanation for Year 2 students?", walkthrough: "Think about the audience: use simpler words, shorter sentences, everyday examples and pictures, and explain any special terms." },
      },
    }, [
      mc(1, "A recipe is which text type?", ["Procedure", "Narrative", "Persuasive", "Recount"], "Procedures tell you how to do something, step by step."),
      mc(1, "A diary entry about what you did on the weekend is a…", ["Recount", "Procedure", "Report", "Persuasive text"], "A recount retells real events in time order."),
      mc(1, "A fairy tale is a…", ["Narrative", "Procedure", "Report", "Explanation"], "Narratives tell a story with characters and a plot, mainly to entertain."),
      mc(1, "An encyclopedia entry about sharks is an…", ["Information report", "Narrative", "Recount", "Persuasive text"], "Information reports give facts about a topic."),
      mc(1, "The main purpose of a procedure is to…", ["Tell the reader how to do something", "Entertain with a story", "Argue a point of view", "Describe past events"], "Procedures instruct."),
      mc(1, "The people a text is written for are its…", ["Audience", "Author", "Publisher", "Characters"], "The audience is the intended reader or listener."),
      mc(1, "Steps in a procedure usually start with…", ["Command verbs, like 'Mix' or 'Cut'", "Past-tense verbs", "Questions", "Names of people"], "Command (imperative) verbs tell the reader exactly what to do."),
      mc(1, "The words under a picture that explain it are a…", ["Caption", "Heading", "Glossary", "Index"], "A caption explains an image."),

      mc(2, "Recounts are usually written in…", ["Past tense, in time order", "Future tense, in random order", "Command verbs", "Questions only"], "They retell what happened, in the order it happened."),
      mc(2, "Which connective shows time order?", ["Afterwards", "However", "Because", "Although"], "'Afterwards' tells you when something happened."),
      mc(2, "Which connective shows cause and effect?", ["Therefore", "Meanwhile", "Firstly", "Similarly"], "'Therefore' links a cause to its result."),
      mc(2, "An explanation text (e.g. 'How volcanoes erupt') mainly…", ["Explains how or why something happens", "Tells a funny story", "Gives an opinion", "Lists ingredients"], "Explanations describe processes and causes."),
      mc(2, "Which register best suits a science report?", ["Formal and objective", "Chatty with slang", "Full of emojis", "Rhyming"], "Reports should be formal, factual and impersonal."),
      mc(2, "A list at the back of a book explaining special words is a…", ["Glossary", "Contents page", "Caption", "Blurb"], "A glossary defines key terms."),
      mc(2, "Which feature would you NOT normally find in an information report?", ["A villain", "Headings", "Facts", "Diagrams"], "Villains belong in narratives, not factual reports."),
      mc(2, "Who is the most likely audience for a picture book about colours?", ["Young children", "University students", "Scientists", "Lawyers"], "Simple topics with pictures suit young readers."),

      mc(3, "Texts that combine two or more text types (e.g. a story with a recipe in it) are…", ["Hybrid texts", "Procedures", "Glossaries", "Reports"], "Hybrid texts mix types to suit their purpose."),
      mc(3, "A national park website has a map, opening hours, a short history and photos. Its main purpose is to…", ["Inform visitors", "Tell a fictional story", "Argue against parks", "Give a personal recount"], "Everything on it helps visitors plan and learn — it informs."),
      mc(3, "Which sentence best suits a news report?", ["Firefighters battled a blaze in Bendigo on Tuesday night.", "Once upon a time, there was a fire.", "You won't believe how awesome this fire was!!!", "Mix the flour and water."], "News reports state who, what, where and when, clearly and objectively."),
      mc(3, "Why do news articles put the most important facts in the first paragraph?", ["Readers may not read to the end, so key facts come first", "To make it a mystery", "Because it's a rule of poetry", "To hide the facts"], "This 'inverted pyramid' gives readers the main facts straight away."),
      mc(3, "Rewriting a science explanation for Year 2 students, you should mostly…", ["Use simpler words, shorter sentences and pictures", "Use more technical terms", "Make it longer", "Remove all examples"], "Match the language to the audience."),
      mc(3, "Which pair of ideas is best joined with 'whereas'?", ["Frogs have smooth skin / toads have bumpy skin", "It rained / we stayed inside", "First boil the water / then add pasta", "I like dogs / dogs are animals"], "'Whereas' shows contrast between two things."),
      mc(3, "Pronouns like 'it' and 'they' that refer back to earlier nouns help a text…", ["Stick together (cohesion)", "Rhyme", "Become persuasive", "Use the past tense"], "Referring back links sentences together, so the text flows."),
      mc(3, "A text uses 'you should', 'must', strong adjectives, and ends with 'Act now!' It is most likely…", ["Persuasive", "A procedure", "A recount", "A narrative"], "Modal words (should, must), strong language and a call to action are signs of persuasion."),
    ]),
  ];
  english.forEach((t) => ENGLISH_TOPICS.push(t));

  // ================================================================ Science (Levels 7–8)
  const science = [
    make("sci-cells", "Cells", "🦠", {
      blurb: "Cell theory, cell parts, plant and animal cells, and using a microscope.",
      recap: "All living things are made of cells. Learn the parts of plant and animal cells, what they do, and how to use and calculate with a microscope.",
      example: "Doctors look at blood cells under a microscope to check whether someone is healthy.",
      workedExample: {
        1: { question: "Name two parts found in plant cells but not animal cells.", walkthrough: "Plant cells have a cell wall (for support) and chloroplasts (for photosynthesis). They also usually have a large permanent vacuole." },
        2: { question: "Eyepiece 10×, objective 40×. What is the total magnification?", walkthrough: "Multiply the two lenses: 10 × 40 = 400×. The cell looks 400 times bigger than it really is." },
        3: { question: "At 400×, a cell looks 20 mm wide. What is its real size?", walkthrough: "Real size = image size ÷ magnification = 20 ÷ 400 = 0.05 mm. In micrometres: 0.05 × 1000 = 50 µm." },
      },
    }, [
      mc(1, "What is the basic unit of all living things?", ["The cell", "The atom", "The organ", "The tissue"], "Cells are the smallest units that can carry out the processes of life."),
      mc(1, "Which part of a cell controls its activities and contains DNA?", ["Nucleus", "Cell membrane", "Cytoplasm", "Vacuole"], "The nucleus is the control centre and holds the genetic instructions (DNA)."),
      mc(1, "Which part controls what enters and leaves a cell?", ["Cell membrane", "Nucleus", "Chloroplast", "Cell wall"], "The cell membrane is a thin, flexible barrier that lets some substances in and out."),
      mc(1, "The jelly-like fluid where most of the cell's chemical reactions happen is the…", ["Cytoplasm", "Nucleus", "Cell wall", "Vacuole"], "Cytoplasm fills the cell; many reactions happen in it."),
      mc(1, "What equipment do we use to see cells?", ["A microscope", "A telescope", "A thermometer", "A beaker"], "Most cells are too small to see with the naked eye, so we magnify them."),
      mc(1, "Which part is found in plant cells but NOT animal cells?", ["Cell wall", "Nucleus", "Cell membrane", "Cytoplasm"], "Plant cells have a rigid cell wall made of cellulose for support."),
      mc(1, "Chloroplasts are where plants…", ["Make food using sunlight (photosynthesis)", "Store water", "Get rid of waste", "Divide in two"], "Chloroplasts contain green chlorophyll, which captures light energy to make glucose."),
      match(1, "Match each cell part to its job.", [["Nucleus", "Controls the cell"], ["Cell membrane", "Lets substances in and out"], ["Cytoplasm", "Where reactions happen"], ["Cell wall", "Supports a plant cell"]], "Each organelle has a job — like the parts of a factory."),

      num(2, "A microscope has a 10× eyepiece and a 40× objective lens. What is the total magnification (just the number)?", 400, "Total magnification = eyepiece × objective = 10 × 40 = 400×."),
      num(2, "A microscope has a 10× eyepiece and a 4× objective lens. What is the total magnification (just the number)?", 40, "10 × 4 = 40×."),
      mc(2, "Mitochondria release energy from food by…", ["Cellular respiration", "Photosynthesis", "Digestion", "Evaporation"], "In respiration, glucose and oxygen react in the mitochondria to release energy."),
      mc(2, "Which statement is part of cell theory?", ["All living things are made of cells", "All cells are the same size", "Cells are only found in animals", "Cells are made of organs"], "Cell theory: all living things are made of cells, cells are the basic unit of life, and new cells come from existing cells."),
      mc(2, "A large, permanent vacuole full of cell sap is mostly found in…", ["Plant cells", "Animal cells", "Red blood cells", "Nerve cells"], "Plant cells use a big vacuole to store water and keep the cell firm."),
      mc(2, "Organisms made of just one cell, like bacteria, are…", ["Unicellular", "Multicellular", "Tissues", "Organs"], "'Uni' means one."),
      mc(2, "When using a microscope, you should start with…", ["The lowest-power objective lens", "The highest-power lens", "The light turned off", "The slide upside down"], "Low power gives a wide view so you can find the specimen, then you zoom in."),
      mc(2, "Why are leaf cells green?", ["They contain chloroplasts with chlorophyll", "They have cell walls", "They have a nucleus", "They are full of water"], "Chlorophyll, inside chloroplasts, is a green pigment."),

      num(3, "Under a 400× microscope, a cell's image is 20 mm wide. What is its real width, in mm?", 0.05, "Real size = image size ÷ magnification = 20 ÷ 400 = 0.05 mm.", 0.001),
      num(3, "1 mm = 1000 micrometres (µm). How many µm is 0.05 mm?", 50, "0.05 × 1000 = 50 µm."),
      mc(3, "Plant root cells have no chloroplasts. The best explanation is…", ["Roots are underground with no light, so they can't photosynthesise", "Roots are dead cells", "Roots are animal cells", "Chloroplasts are only in flowers"], "Chloroplasts only help where there's light, so root cells don't need them."),
      mc(3, "Red blood cells have no nucleus. What is an advantage of this?", ["More room to carry oxygen", "They can divide faster", "They can photosynthesise", "They live forever"], "Without a nucleus there's more space for haemoglobin, which carries oxygen."),
      mc(3, "Muscle cells contain lots of mitochondria because…", ["They need lots of energy to contract", "They store water", "They make food", "They need cell walls"], "Mitochondria release energy; muscles use a lot of it."),
      mc(3, "A cell has a cell wall, a nucleus and a large vacuole but no chloroplasts. It is most likely…", ["A plant root cell", "A human cheek cell", "A red blood cell", "A leaf cell"], "The cell wall and vacuole show it's a plant cell; no chloroplasts means it's from a part without light, like a root."),
      mc(3, "Why do scientists add a stain, like iodine, to a microscope slide?", ["To make parts of the cell easier to see", "To magnify it more", "To make it smell", "To keep it warm"], "Stains colour parts such as the nucleus so they stand out."),
      order(3, "Put these in order from smallest to largest.", ["Atom", "Cell", "Tissue", "Organ", "Organism"], "Smallest", "Largest", "Atoms make up cells; cells group into tissues; tissues form organs; organs work together in an organism."),
    ]),

    make("sci-body", "Body Systems", "🫀", {
      blurb: "How cells, tissues, organs and systems work together: digestive, circulatory, respiratory and more.",
      recap: "Multicellular organisms are organised into cells, tissues, organs and systems. Learn what the main human body systems do and how they work together.",
      example: "When you sprint, your respiratory, circulatory and muscular systems all speed up together.",
      workedExample: {
        1: { question: "What does the circulatory system do?", walkthrough: "The heart pumps blood through blood vessels to carry oxygen and nutrients to every cell, and to carry wastes like carbon dioxide away." },
        2: { question: "Why does your heart rate go up when you exercise?", walkthrough: "Working muscles need more energy, so they need more oxygen and glucose for respiration. The heart pumps faster to deliver them, and breathing speeds up to take in more oxygen." },
        3: { question: "At 72 beats per minute and 70 mL per beat, how much blood does the heart pump per minute?", walkthrough: "72 × 70 = 5040 mL per minute. Divide by 1000 to get litres: about 5.04 L — roughly all your blood, every minute!" },
      },
    }, [
      mc(1, "Which organ pumps blood around the body?", ["Heart", "Lungs", "Stomach", "Brain"], "The heart is a muscular pump at the centre of the circulatory system."),
      mc(1, "Which system takes in oxygen and gets rid of carbon dioxide?", ["Respiratory system", "Digestive system", "Skeletal system", "Excretory system"], "The respiratory system includes the lungs, trachea and diaphragm."),
      mc(1, "Which system breaks food down into nutrients?", ["Digestive system", "Circulatory system", "Nervous system", "Respiratory system"], "The digestive system breaks food into small molecules the body can absorb."),
      mc(1, "The brain, spinal cord and nerves make up the…", ["Nervous system", "Muscular system", "Circulatory system", "Digestive system"], "The nervous system sends electrical messages around the body."),
      mc(1, "What does the skeleton do?", ["Supports and protects the body and helps it move", "Pumps blood", "Digests food", "Makes oxygen"], "Bones support the body, protect organs (like the skull protecting the brain) and work with muscles to move."),
      mc(1, "Which organs filter waste from the blood to make urine?", ["Kidneys", "Lungs", "Heart", "Stomach"], "The kidneys are part of the excretory system."),
      match(1, "Match each organ to its body system.", [["Heart", "Circulatory system"], ["Lungs", "Respiratory system"], ["Stomach", "Digestive system"], ["Brain", "Nervous system"]], "Each organ belongs to a system with a shared job."),
      mc(1, "Blood vessels that carry blood AWAY from the heart are…", ["Arteries", "Veins", "Capillaries", "Nerves"], "Arteries carry blood away; veins carry it back. (Memory trick: A for Away.)"),

      order(2, "Put the levels of organisation in order.", ["Cell", "Tissue", "Organ", "Organ system", "Organism"], "Simplest", "Most complex", "Cells form tissues, tissues form organs, organs form systems, and systems make up an organism."),
      order(2, "Put these in the order food passes through them.", ["Mouth", "Oesophagus", "Stomach", "Small intestine", "Large intestine"], "First", "Last", "Food is chewed in the mouth, swallowed down the oesophagus, churned in the stomach, absorbed in the small intestine, and water is absorbed in the large intestine."),
      mc(2, "Where are most nutrients absorbed into the blood?", ["Small intestine", "Stomach", "Large intestine", "Mouth"], "The small intestine is long and lined with villi, giving a huge area for absorption."),
      mc(2, "Gas exchange in the lungs happens in tiny air sacs called…", ["Alveoli", "Villi", "Capillaries", "Bronchi"], "Oxygen passes from the alveoli into the blood; carbon dioxide passes out."),
      mc(2, "Which blood vessels are so thin that substances pass through their walls?", ["Capillaries", "Arteries", "Veins", "Tendons"], "Capillary walls are one cell thick, so oxygen and nutrients can reach cells."),
      mc(2, "Why does your breathing rate increase when you exercise?", ["Muscles need more oxygen for respiration", "To cool the lungs", "Because the heart stops", "To digest food faster"], "More respiration means more oxygen needed and more carbon dioxide to remove."),
      mc(2, "Which two systems work together to get oxygen to the muscles?", ["Respiratory and circulatory", "Digestive and skeletal", "Nervous and excretory", "Skeletal and excretory"], "The lungs take in oxygen, and the blood carries it to the muscles."),
      mc(2, "Villi in the small intestine increase the…", ["Surface area for absorption", "Length of the stomach", "Number of teeth", "Speed of breathing"], "Millions of tiny finger-like villi give more surface to absorb nutrients."),

      num(3, "A person's heart beats 72 times per minute. How many times does it beat in an hour?", 4320, "72 × 60 = 4320 beats per hour."),
      num(3, "Each heartbeat pumps 70 mL of blood. At 72 beats per minute, how many litres are pumped in 1 minute?", 5.04, "72 × 70 = 5040 mL. 5040 ÷ 1000 = 5.04 L per minute.", 0.01),
      mc(3, "A blocked artery stops blood reaching part of the heart muscle. Why is this dangerous?", ["Those heart muscle cells don't get oxygen and glucose, so they can die", "The lungs fill with food", "The kidneys stop making bones", "The stomach becomes too acidic"], "Cells need oxygen and glucose for respiration; without them, heart tissue is damaged (a heart attack)."),
      mc(3, "Smoking damages the alveoli. How would this affect a person?", ["Less oxygen gets into the blood, so they get out of breath easily", "They digest food faster", "Their bones grow longer", "Their heart beats less often"], "Damaged alveoli give less surface for gas exchange."),
      mc(3, "Which systems are mainly involved when you pull your hand away from a hot stove?", ["Nervous and muscular", "Digestive and excretory", "Respiratory and digestive", "Circulatory and excretory"], "Nerves detect the heat and send a signal; muscles contract to move your hand — a reflex."),
      mc(3, "Why do veins have valves?", ["To stop blood flowing backwards", "To filter the blood", "To make blood cells", "To carry oxygen into the lungs"], "Blood in veins is at low pressure, so valves keep it flowing towards the heart."),
      mc(3, "Hormones such as insulin and adrenaline are made by the…", ["Endocrine system", "Skeletal system", "Respiratory system", "Excretory system"], "The endocrine system uses glands to release hormones into the blood."),
      mc(3, "Why is the stomach called an organ?", ["It is made of different tissues working together to do one job", "It is a single cell", "It is a whole body system", "It has no cells"], "Organs are made of several tissue types (muscle, lining, nerves) working together."),
    ]),

    make("sci-energy", "Energy", "⚡", {
      blurb: "Forms of energy, energy transfers and transformations, heat transfer and efficiency.",
      recap: "Energy can't be created or destroyed, only transferred or transformed. Learn the forms of energy, how heat moves, and how efficient devices are.",
      example: "A solar panel changes light energy into electrical energy that can charge your phone.",
      workedExample: {
        1: { question: "What energy changes happen in a torch?", walkthrough: "Chemical energy in the battery → electrical energy in the circuit → light energy (plus some wasted thermal energy) in the globe." },
        2: { question: "A ball is dropped. What happens to its energy?", walkthrough: "At the top it has gravitational potential energy. As it falls, that changes into kinetic energy. When it hits the ground, some becomes sound and heat." },
        3: { question: "A globe uses 100 J and gives out 20 J of light. How efficient is it?", walkthrough: "Efficiency = useful output ÷ total input × 100 = 20 ÷ 100 × 100 = 20%. The other 80 J is wasted, mostly as heat." },
      },
    }, [
      mc(1, "The energy of a moving object is…", ["Kinetic energy", "Chemical energy", "Sound energy", "Elastic energy"], "Anything moving has kinetic energy."),
      mc(1, "Food and batteries store…", ["Chemical energy", "Kinetic energy", "Light energy", "Sound energy"], "Chemical energy is stored in the bonds between atoms."),
      mc(1, "A stretched rubber band stores…", ["Elastic potential energy", "Light energy", "Thermal energy", "Electrical energy"], "Stretched or squashed objects store elastic potential energy."),
      mc(1, "A book on a high shelf has…", ["Gravitational potential energy", "Sound energy", "Light energy", "Electrical energy"], "Objects raised up store gravitational potential energy."),
      mc(1, "The unit of energy is the…", ["Joule (J)", "Watt (W)", "Newton (N)", "Metre (m)"], "Energy is measured in joules; force in newtons."),
      mc(1, "A light globe mainly changes electrical energy into…", ["Light and thermal energy", "Chemical energy", "Kinetic energy only", "Sound only"], "Globes give out light — and some heat."),
      mc(1, "Energy cannot be created or destroyed, only…", ["Transformed or transferred", "Deleted", "Made from nothing", "Stored forever"], "This is the law of conservation of energy."),
      mc(1, "Which is a renewable energy source?", ["Solar", "Coal", "Oil", "Natural gas"], "Sunlight won't run out; coal, oil and gas take millions of years to form."),

      mc(2, "What energy change happens in a solar panel?", ["Light → electrical", "Chemical → light", "Sound → kinetic", "Electrical → chemical"], "Solar cells turn light energy into electrical energy."),
      mc(2, "When you rub your hands together, kinetic energy changes into…", ["Thermal energy", "Light energy", "Chemical energy", "Nuclear energy"], "Friction turns movement into heat."),
      mc(2, "As a dropped ball falls, gravitational potential energy changes into…", ["Kinetic energy", "Chemical energy", "Elastic energy", "Light energy"], "It loses height (GPE) and gains speed (kinetic energy)."),
      mc(2, "Heat travelling along a metal spoon in hot soup is…", ["Conduction", "Convection", "Radiation", "Evaporation"], "Conduction passes heat through a solid by particles bumping into each other."),
      mc(2, "Heat from the Sun reaches Earth through space by…", ["Radiation", "Conduction", "Convection", "Insulation"], "Space is empty, so heat can't be conducted or convected — it travels as radiation."),
      mc(2, "Warm air rising and cool air sinking in a room is…", ["Convection", "Conduction", "Radiation", "Reflection"], "Convection currents move heat through liquids and gases."),
      num(2, "A kettle uses 2000 J of electrical energy, and 1800 J goes into heating the water. How many joules are wasted?", 200, "Wasted = total in − useful = 2000 − 1800 = 200 J (lost as heat to the air and sound)."),
      mc(2, "Which material is the best thermal insulator?", ["Wool", "Copper", "Aluminium", "Iron"], "Wool traps air, a poor conductor. Metals are good conductors."),

      num(3, "A light globe uses 100 J of electrical energy and gives out 20 J of light. What is its efficiency, as a percentage?", 20, "Efficiency = useful ÷ total × 100 = 20 ÷ 100 × 100 = 20%."),
      num(3, "An LED uses 100 J and gives out 80 J of light. How many more joules of light is that than the 20%-efficient globe using the same 100 J?", 60, "The globe gives 20 J of light; the LED gives 80 J. 80 − 20 = 60 J more."),
      mc(3, "A bouncing ball bounces a little lower each time. Where does the 'missing' energy go?", ["Into heat and sound", "It is destroyed", "Into chemical energy in the ball", "Back into the Sun"], "Energy isn't destroyed — each bounce transfers some to heat and sound."),
      mc(3, "Why do saucepans often have plastic or wooden handles?", ["They are poor conductors, so the handle stays cool", "They conduct heat well", "They are heavier", "They make the pan heat faster"], "Insulating handles stop heat conducting to your hand."),
      num(3, "A roller coaster car has 50 000 J of gravitational potential energy at the top. Ignoring friction, how much kinetic energy does it have at the bottom, in J?", 50000, "With no energy lost, all 50 000 J of GPE turns into kinetic energy."),
      mc(3, "In real life the car's kinetic energy at the bottom is less than 50 000 J because…", ["Some energy is transferred to heat and sound by friction and air resistance", "Energy is destroyed", "Gravity switches off", "It gains chemical energy"], "Energy is conserved, but some is transferred to the surroundings as heat and sound."),
      order(3, "Put the energy changes for a wind-up toy car in order.", ["Chemical energy in your muscles", "Elastic energy in the wound spring", "Kinetic energy of the moving car"], "First", "Last", "Your muscles use chemical energy to wind the spring, which stores elastic energy, which is released as movement."),
      mc(3, "Which energy source is renewable AND produces no greenhouse gases while running?", ["Wind", "Coal", "Natural gas", "Petrol"], "Wind turbines use moving air, which is renewable and doesn't burn fuel."),
    ]),

    make("sci-rocks", "Rocks and the Rock Cycle", "🪨", {
      blurb: "Igneous, sedimentary and metamorphic rocks, weathering, erosion and the rock cycle.",
      recap: "How the three types of rock form, how weathering and erosion break them down, and how the rock cycle keeps changing one type into another.",
      example: "Victoria's Twelve Apostles are limestone stacks carved by waves, and the Grampians are made of sandstone.",
      workedExample: {
        1: { question: "How does sedimentary rock form?", walkthrough: "Rocks are weathered into small bits, eroded (carried away) by water or wind, and deposited in layers. Over time the layers are compacted (squashed) and cemented together." },
        2: { question: "Why does granite have bigger crystals than basalt?", walkthrough: "Granite's magma cooled slowly deep underground, giving crystals time to grow. Basalt's lava cooled quickly on the surface, so its crystals are tiny." },
        3: { question: "Sediment builds up 2 mm a year. How long for a 1 m layer?", walkthrough: "1 m = 1000 mm. 1000 ÷ 2 = 500 years." },
      },
    }, [
      mc(1, "Rocks formed when magma or lava cools are…", ["Igneous", "Sedimentary", "Metamorphic", "Fossils"], "'Igneous' comes from the Latin for fire."),
      mc(1, "Rocks formed from layers of sediment pressed together are…", ["Sedimentary", "Igneous", "Metamorphic", "Volcanic"], "Sediment (sand, mud, shells) builds up in layers and hardens."),
      mc(1, "Rocks changed by heat and pressure, without melting, are…", ["Metamorphic", "Igneous", "Sedimentary", "Molten"], "'Metamorphic' means 'changed form'."),
      mc(1, "Fossils are most often found in…", ["Sedimentary rocks", "Igneous rocks", "Lava", "Magma"], "Remains get buried in sediment; heat would destroy them in igneous rock."),
      mc(1, "Melted rock underground is called…", ["Magma", "Lava", "Sediment", "Marble"], "Magma is underground; once it erupts onto the surface it's called lava."),
      mc(1, "Breaking rock into smaller pieces (by wind, water, ice or plant roots) is…", ["Weathering", "Erosion", "Deposition", "Melting"], "Weathering breaks rock down where it is."),
      mc(1, "Carrying bits of rock away (by water, wind or ice) is…", ["Erosion", "Weathering", "Compaction", "Cooling"], "Erosion moves the weathered pieces."),
      match(1, "Match each rock to its type.", [["Granite", "Igneous"], ["Sandstone", "Sedimentary"], ["Marble", "Metamorphic"]], "Granite cools from magma, sandstone is cemented sand grains, and marble is limestone changed by heat and pressure."),

      mc(2, "Granite has large crystals, but basalt has tiny ones. Why?", ["Granite cooled slowly underground; basalt cooled quickly on the surface", "Granite is younger", "Basalt is sedimentary", "Granite was squashed"], "Slow cooling gives crystals time to grow."),
      mc(2, "Limestone changes into which metamorphic rock?", ["Marble", "Slate", "Granite", "Pumice"], "Heat and pressure turn limestone into marble."),
      mc(2, "Shale (mudstone) changes into which metamorphic rock?", ["Slate", "Marble", "Basalt", "Sandstone"], "Shale becomes slate, which splits into flat sheets."),
      mc(2, "Pumice can float on water because…", ["It is full of gas bubbles trapped as lava cooled fast", "It is made of wood", "It is metamorphic", "It has huge crystals"], "Frothy lava cools so fast that gas bubbles are trapped, making it very light."),
      order(2, "Put the steps that form sedimentary rock in order.", ["Weathering", "Erosion", "Deposition", "Compaction", "Cementation"], "First", "Last", "Rock is broken down, carried away, dropped in layers, squashed, then glued together."),
      mc(2, "Water seeps into a crack, freezes and expands, splitting the rock. This is…", ["Physical weathering (freeze–thaw)", "Chemical weathering", "Deposition", "Melting"], "Ice takes up more space than water, so it wedges the crack open."),
      mc(2, "Acid rain slowly dissolving a limestone statue is…", ["Chemical weathering", "Physical weathering", "Compaction", "Metamorphism"], "The acid reacts with the rock, changing it chemically."),
      mc(2, "Victoria's Twelve Apostles (limestone stacks) were mainly shaped by…", ["Erosion by ocean waves", "Volcanic eruptions", "Glaciers", "Earthquakes"], "Waves wore away the softer cliffs, leaving stacks standing in the sea."),

      mc(3, "Can a sedimentary rock become an igneous rock?", ["Yes — if it's buried deep enough to melt into magma, which then cools", "No, never", "Only if it is weathered", "Only on the Moon"], "In the rock cycle, any rock can melt and then cool into igneous rock."),
      mc(3, "A rock has layers and contains a shell fossil. What type is it, and why?", ["Sedimentary — fossils and layers form as sediment builds up", "Igneous — it cooled from lava", "Metamorphic — fossils form in heat", "Igneous — shells melt into magma"], "Layers and fossils are clues to sedimentary rock."),
      mc(3, "A rock has bands of flattened, lined-up crystals. It is most likely…", ["Metamorphic", "Sedimentary", "Igneous", "A fossil"], "Pressure lines the minerals up in bands — a sign of metamorphic rock."),
      mc(3, "In undisturbed layers of sedimentary rock, which layer is usually oldest?", ["The bottom layer", "The top layer", "The middle layer", "They're all the same age"], "Layers are laid down one on top of another, so the lowest came first."),
      num(3, "Sediment builds up at 2 mm per year. How many years does it take to form a 1 m layer?", 500, "1 m = 1000 mm. 1000 ÷ 2 = 500 years."),
      mc(3, "Why does the rock cycle never really end?", ["Rocks keep changing type through weathering, melting, heat and pressure", "Rocks get destroyed", "New rocks only come from space", "Rocks stop changing after 100 years"], "It's a cycle: every rock type can become every other type over time."),
      mc(3, "Which is an intrusive igneous rock (it cooled underground)?", ["Granite", "Basalt", "Pumice", "Obsidian"], "Granite cooled slowly underground; the others cooled at the surface."),
      mc(3, "Obsidian is a glassy igneous rock with no visible crystals. This tells us it…", ["Cooled extremely quickly", "Cooled very slowly", "Formed from sediment", "Was squashed for millions of years"], "Very fast cooling gives crystals no time to form, making glass."),
    ]),

    make("sci-change", "Physical and Chemical Change", "🧪", {
      blurb: "Physical vs chemical change, signs of a reaction, elements and compounds, word equations and conservation of mass.",
      recap: "In a physical change no new substance forms; in a chemical change new substances are made. Learn the signs, the language of reactions and how mass is conserved.",
      example: "Baking a cake is a chemical change — you can't un-bake it back into flour and eggs.",
      workedExample: {
        1: { question: "Is melting chocolate a physical or chemical change?", walkthrough: "It's still chocolate — just liquid — and it can set again. No new substance forms, so it's a physical change." },
        2: { question: "Name the reactants and product: magnesium + oxygen → magnesium oxide.", walkthrough: "Reactants are on the left (what you start with): magnesium and oxygen. The product is on the right (what's made): magnesium oxide." },
        3: { question: "24 g of magnesium reacts with 16 g of oxygen. What mass of product forms?", walkthrough: "Mass is conserved — atoms are rearranged, not created or destroyed. 24 + 16 = 40 g of magnesium oxide." },
      },
    }, [
      mc(1, "Melting ice is a…", ["Physical change", "Chemical change"], "It's still water, just a different state — no new substance."),
      mc(1, "Burning wood is a…", ["Chemical change", "Physical change"], "Burning makes new substances (ash, smoke, carbon dioxide) and can't be reversed."),
      mc(1, "Which is a sign that a chemical change has happened?", ["Bubbles of gas appear when two substances are mixed", "Something changes shape", "Something is cut in half", "Ice melts"], "A new gas forming is a clue that a reaction happened."),
      mc(1, "Which is a physical change?", ["Dissolving sugar in water", "Rusting iron", "Cooking an egg", "Burning paper"], "Dissolved sugar is still sugar — evaporate the water and it's back."),
      mc(1, "A substance made of only one type of atom is an…", ["Element", "Compound", "Mixture", "Solution"], "Elements, like oxygen and iron, are listed on the periodic table."),
      mc(1, "The new substances made in a chemical reaction are the…", ["Products", "Reactants", "Solvents", "Elements"], "Reactants → products."),
      mc(1, "The substances you start with in a reaction are the…", ["Reactants", "Products", "Mixtures", "Results"], "Reactants are on the left of a word equation."),
      mc(1, "Which is a chemical change?", ["Baking a cake", "Chopping carrots", "Boiling water", "Freezing juice"], "Baking forms new substances; the others only change shape or state."),

      mc(2, "Water (H₂O) is a compound because…", ["It contains two or more different elements chemically joined", "It is a liquid", "It can be poured", "It has only one type of atom"], "Water is hydrogen and oxygen chemically bonded together."),
      mc(2, "Which is a mixture, not a compound?", ["Salt water", "Water", "Carbon dioxide", "Table salt"], "Salt water is salt and water mixed, not bonded — you can separate them by evaporation."),
      mc(2, "In 'magnesium + oxygen → magnesium oxide', the product is…", ["Magnesium oxide", "Magnesium", "Oxygen", "Magnesium and oxygen"], "The product is on the right of the arrow."),
      mc(2, "For iron to rust it needs…", ["Oxygen and water", "Only heat", "Only salt", "Sunlight"], "Rusting is a reaction between iron, oxygen and water (salt speeds it up)."),
      mc(2, "Physical changes are usually easy to reverse. Which is easy to reverse?", ["Freezing water into ice", "Burning a match", "Baking bread", "Rusting a nail"], "Melt the ice and you have water again."),
      mc(2, "What is the chemical symbol for oxygen?", ["O", "Ox", "Og", "Os"], "Oxygen's symbol is O."),
      mc(2, "What is the chemical symbol for sodium?", ["Na", "So", "S", "Sd"], "Na comes from its Latin name, natrium."),
      mc(2, "Two clear solutions are mixed; they turn yellow and the beaker gets warm. This suggests…", ["A chemical reaction", "Only a physical change", "Nothing happened", "Evaporation"], "A colour change and heat given off are signs of a chemical reaction."),

      num(3, "In a sealed flask, 10 g of baking soda reacts with 50 g of vinegar. What is the total mass of everything in the flask afterwards, in g?", 60, "Mass is conserved in a sealed container: 10 + 50 = 60 g. The atoms are rearranged, not lost."),
      num(3, "24 g of magnesium burns and combines with 16 g of oxygen. What mass of magnesium oxide forms, in g?", 40, "Conservation of mass: 24 + 16 = 40 g."),
      mc(3, "When baking soda and vinegar react in an open beaker, the mass goes down. Why?", ["Carbon dioxide gas escapes into the air", "Mass is destroyed", "The beaker gets lighter", "Vinegar is weightless"], "The gas product leaves the beaker, so the scales can't measure it."),
      num(3, "How many atoms are in one molecule of carbon dioxide (CO₂)?", 3, "1 carbon atom + 2 oxygen atoms = 3 atoms."),
      num(3, "How many hydrogen atoms are in one molecule of methane (CH₄)?", 4, "The small 4 after H means 4 hydrogen atoms."),
      mc(3, "Dissolving salt in water is a physical change because…", ["No new substance forms — you can get the salt back by evaporating the water", "The salt disappears forever", "It gives off a gas", "It changes colour"], "The salt is still there and can be recovered."),
      mc(3, "Which word equation shows respiration?", ["glucose + oxygen → carbon dioxide + water", "carbon dioxide + water → glucose + oxygen", "iron + oxygen → iron oxide", "water → ice"], "Respiration releases energy from glucose. (The second one is photosynthesis.)"),
      mc(3, "Why are chemical changes usually hard to reverse?", ["New substances have formed with different properties", "The atoms are destroyed", "They only happen in labs", "Mass is lost"], "The atoms have rearranged into new substances."),
    ]),
  ];
  science.forEach((t) => SCIENCE_TOPICS.push(t));

  // ================================================================ Lessons
  Object.assign(TOPIC_LESSONS, {
    "y7-ratios": [
      { title: "What is a ratio?", text: "A ratio compares amounts of the same kind, in a set order. 3 : 2 (read '3 to 2') could mean 3 cups of flour for every 2 cups of milk.",
        points: ["Order matters: flour : milk = 3 : 2, but milk : flour = 2 : 3.", "Ratios have no units — make sure both parts use the same unit first (40 cm : 2 m → 40 : 200)."] },
      { title: "Simplifying ratios", text: "Divide every part by the highest common factor (HCF), just like simplifying a fraction.",
        points: ["18 : 24 → HCF is 6 → 3 : 4.", "Remove decimals by multiplying: 1.5 : 2.5 → × 2 → 3 : 5."] },
      { title: "Sharing in a ratio", points: ["1. Add the parts to find the total number of parts.", "2. Divide the amount by the total parts to find one part.", "3. Multiply by each part of the ratio.", "Example: $50 in 2 : 3 → 5 parts → $10 each → $20 and $30."],
        tip: "Always check your shares add back up to the total." },
      { title: "Rates and best buys", text: "A rate compares different kinds of quantity: km/h, $ per kg, litres per minute.",
        points: ["Speed = distance ÷ time.", "Unit price = price ÷ quantity. The lower the unit price, the better the buy.", "Scale 1 : 50 000 means 1 cm on the map is 50 000 cm (500 m) in real life."] },
    ],
    "y7-money": [
      { title: "Percentages of money", points: ["10% = ÷ 10. 5% is half of 10%. 1% = ÷ 100.", "To find 35% of $120: 0.35 × 120 = $42.", "Sale price: if 35% is taken off, you pay 65%: 0.65 × 120 = $78."] },
      { title: "GST", text: "Goods and Services Tax in Australia is 10%.",
        points: ["Adding GST: × 1.1 (e.g. $60 → $66).", "Removing GST from a total: ÷ 1.1 (e.g. $55 → $50).", "GST in a total price = total ÷ 11."] },
      { title: "Profit, loss and percentage change", points: ["Profit = selling price − cost price (a negative profit is a loss).", "Percentage change = change ÷ original × 100.", "Rent $400 → $420: change $20, 20 ÷ 400 × 100 = 5% increase."],
        tip: "Always divide by the ORIGINAL amount, not the new one." },
      { title: "Budgets, wages and best buys", points: ["Hourly wage × hours = pay. Time-and-a-half = 1.5 × the hourly rate.", "A budget lists income and spending; what's left is savings.", "Compare price per item or per 100 g to find the best buy."] },
    ],
    "y7-linear": [
      { title: "Rules and tables", text: "A rule like y = 2x + 1 tells you how to get y from x. Substitute values of x to fill a table.",
        points: ["x = 0 → y = 1; x = 1 → y = 3; x = 2 → y = 5.", "The number multiplying x is how much y goes up each step (the gradient).", "The number added is where the line crosses the y-axis (when x = 0)."] },
      { title: "Finding a rule from a pattern", points: ["Find how much y goes up each time x goes up by 1 — that's the number in front of x.", "Then work out what to add or subtract to make the first value fit.", "Pattern 5, 9, 13, 17 … goes up by 4, so term = 4n + 1."] },
      { title: "Straight-line graphs", text: "Plotting a linear rule always gives a straight line.",
        visual: { type: "plane", min: -1, max: 6, lines: [{ m: 2, c: 1, label: "y = 2x + 1" }], points: [{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 5 }] } },
      { title: "Distance–time graphs", points: ["Line going up: moving away. Steeper = faster.", "Flat line: stopped.", "Line going down: coming back.", "Speed = distance ÷ time, read from the graph."] },
    ],
    "y7-transform": [
      { title: "Translations", text: "Slide every point the same distance and direction. Right/left changes x; up/down changes y.",
        points: ["(2, 3) moved 4 right and 1 down → (6, 2)."] },
      { title: "Reflections", points: ["In the x-axis: (x, y) → (x, −y).", "In the y-axis: (x, y) → (−x, y).", "The image is the same distance from the mirror line, on the other side."] },
      { title: "Rotations about the origin", points: ["180°: (x, y) → (−x, −y).", "90° anticlockwise: (x, y) → (−y, x).", "90° clockwise: (x, y) → (y, −x)."],
        tip: "Check with a quadrant: a 90° anticlockwise turn moves a point from the 1st quadrant to the 2nd." },
      { title: "Symmetry", points: ["Line symmetry: the shape folds onto itself along a mirror line.", "Rotational symmetry: the shape looks the same after a turn of less than 360°. The order is how many times it fits in one full turn.", "A regular polygon with n sides has n lines of symmetry and rotational symmetry of order n."] },
    ],
    "y7-3d": [
      { title: "Faces, edges and vertices", points: ["Face: a flat surface. Edge: where two faces meet. Vertex: a corner.", "Cube: 6 faces, 12 edges, 8 vertices."] },
      { title: "Prisms and pyramids", points: ["Prisms have two identical ends joined by rectangles. An n-sided prism has n + 2 faces, 3n edges and 2n vertices.", "Pyramids have one base and triangles meeting at the apex. An n-sided pyramid has n + 1 faces, 2n edges and n + 1 vertices."] },
      { title: "Euler's formula", text: "For any polyhedron: Faces + Vertices − Edges = 2.", points: ["Cube: 6 + 8 − 12 = 2 ✓"] },
      { title: "Nets and views", points: ["A net is the flat shape that folds up into a 3D object.", "Views: front, side and plan (top). Architects use these to draw buildings.", "Surface area = the total area of the net."] },
    ],
    "eng-poetry": [
      { title: "The building blocks", points: ["Line and stanza: poems are written in lines, grouped into stanzas.", "Rhyme scheme: label ending sounds with letters (AABB, ABAB).", "Rhythm: the beat made by stressed and unstressed syllables."] },
      { title: "Sound devices", points: ["Alliteration: repeated first consonant sounds (silly snakes slide).", "Assonance: repeated vowel sounds (the rain in Spain).", "Onomatopoeia: words that sound like their meaning (buzz, crash).", "Repetition and refrains emphasise key ideas."] },
      { title: "Imagery", points: ["Simile: a comparison using like or as.", "Metaphor: saying something IS something else.", "Personification: giving human qualities to non-human things."] },
      { title: "Forms", points: ["Haiku: 3 lines, 5–7–5 syllables, often about nature.", "Limerick: 5 lines, AABBA, usually funny.", "Sonnet: 14 lines.", "Free verse: no fixed rhyme or rhythm."],
        tip: "When analysing, don't just name a device — explain the effect it has on mood or meaning." },
    ],
    "eng-narrative": [
      { title: "Narrative structure", points: ["Orientation: who, where, when.", "Complication: the problem.", "Rising action: tension builds.", "Climax: the turning point.", "Resolution: the problem is solved (or not!)."] },
      { title: "Characters and conflict", points: ["Protagonist (main character) and antagonist (the opposing force).", "Dynamic characters change; static characters don't.", "Conflict types: character vs character, self, nature, society."] },
      { title: "Point of view", points: ["First person: 'I' — close and personal, but limited.", "Third person limited: 'she/he/they', following one character.", "Third person omniscient: knows everyone's thoughts."] },
      { title: "Craft techniques", points: ["Show, don't tell: reveal feelings through actions and dialogue.", "Foreshadowing hints at what's coming; flashbacks show the past.", "Theme is the big message about life the story explores."] },
    ],
    "eng-persuasive": [
      { title: "Contention and audience", points: ["The contention is the writer's main argument.", "Think about who the audience is and what they care about."] },
      { title: "Persuasive techniques", points: ["Rhetorical questions, inclusive language (we, our), emotive language.", "Evidence: statistics, expert opinion, anecdotes.", "Rule of three, repetition, hyperbole.", "Rebuttal: answering the other side's argument."] },
      { title: "Fact, opinion and bias", points: ["A fact can be proven; an opinion is a judgement.", "Bias: only presenting one side, or using loaded words.", "Strong evidence is relevant, reliable and checkable."],
        tip: "When analysing, explain how a technique makes the audience think or feel — that's the persuasive effect." },
    ],
    "eng-texttypes": [
      { title: "Text types and purposes", points: ["Narrative: entertains with a story.", "Recount: retells real events in time order (past tense).", "Procedure: instructs (command verbs, numbered steps).", "Information report: describes facts about a topic.", "Explanation: explains how or why something happens.", "Persuasive: convinces the reader."] },
      { title: "Audience and register", points: ["Formal register: complete sentences, no slang — for reports, letters to officials.", "Informal register: chatty — for messages to friends.", "Simpler words and more pictures for younger readers."] },
      { title: "Cohesion", points: ["Connectives link ideas: time (then, afterwards), cause (because, therefore), contrast (however, whereas), adding (also, furthermore).", "Pronouns refer back to earlier nouns so the text isn't repetitive."] },
    ],
    "sci-cells": [
      { title: "Cell theory", points: ["All living things are made of one or more cells.", "Cells are the basic unit of life.", "All cells come from existing cells."] },
      { title: "Parts of a cell", points: ["Nucleus: control centre with DNA.", "Cell membrane: controls what goes in and out.", "Cytoplasm: where most reactions happen.", "Mitochondria: release energy (respiration).", "Plant cells also have a cell wall, chloroplasts and a large vacuole."] },
      { title: "Using a microscope", points: ["Total magnification = eyepiece × objective (10 × 40 = 400×).", "Start on the lowest power, focus with the coarse knob, then the fine knob.", "Real size = image size ÷ magnification. 1 mm = 1000 µm."],
        tip: "Stains like iodine or methylene blue make parts of the cell easier to see." },
    ],
    "sci-body": [
      { title: "Levels of organisation", points: ["Cells → tissues → organs → organ systems → organism."] },
      { title: "Key body systems", points: ["Digestive: breaks down food (mouth, oesophagus, stomach, intestines).", "Circulatory: heart and blood vessels transport oxygen, nutrients and waste.", "Respiratory: lungs exchange oxygen and carbon dioxide in the alveoli.", "Excretory: kidneys filter waste into urine.", "Nervous: brain, spinal cord and nerves send messages.", "Skeletal and muscular: support, protection and movement."] },
      { title: "Systems working together", points: ["Exercise: muscles need more energy → breathing and heart rate increase to deliver oxygen and glucose.", "Nutrients absorbed in the small intestine are carried by the blood to every cell."] },
    ],
    "sci-energy": [
      { title: "Forms of energy", points: ["Kinetic (movement), gravitational potential (height), elastic potential (stretch).", "Chemical (food, fuel, batteries), thermal (heat), electrical, light, sound."] },
      { title: "Transfers and transformations", points: ["Energy can't be created or destroyed — it changes form or moves.", "Torch: chemical → electrical → light (+ heat).", "Some energy is always 'wasted', usually as heat and sound."] },
      { title: "Heat transfer", points: ["Conduction: through solids, particle to particle.", "Convection: currents in liquids and gases.", "Radiation: can travel through empty space (sunlight)."] },
      { title: "Efficiency", text: "Efficiency = useful energy out ÷ total energy in × 100%.", points: ["A globe using 100 J to make 20 J of light is 20% efficient. LEDs are much more efficient."] },
    ],
    "sci-rocks": [
      { title: "The three rock types", points: ["Igneous: cooled magma or lava (granite, basalt, pumice).", "Sedimentary: layers of sediment compacted and cemented (sandstone, limestone, shale).", "Metamorphic: changed by heat and pressure (marble from limestone, slate from shale)."] },
      { title: "Weathering and erosion", points: ["Physical weathering: freeze–thaw, wind, plant roots.", "Chemical weathering: acid rain dissolving rock.", "Erosion carries the pieces away; deposition drops them in layers."] },
      { title: "The rock cycle", text: "Any rock type can become any other over time: weathered into sediment, squashed into sedimentary rock, changed by heat into metamorphic rock, or melted and cooled into igneous rock.",
        tip: "Crystal size tells a story: big crystals = slow cooling underground; tiny or none = fast cooling at the surface." },
    ],
    "sci-change": [
      { title: "Physical vs chemical change", points: ["Physical: no new substance (melting, dissolving, cutting). Usually reversible.", "Chemical: new substances form (burning, rusting, cooking). Usually hard to reverse."] },
      { title: "Signs of a chemical change", points: ["Gas produced (bubbles, fizzing).", "Colour change.", "Heat or light given off (or taken in).", "A precipitate (solid) forms when solutions mix."] },
      { title: "Elements, compounds and mixtures", points: ["Element: one type of atom (O, Na, Fe).", "Compound: different elements chemically joined (H₂O, CO₂).", "Mixture: substances mixed but not joined (salt water, air)."] },
      { title: "Word equations and mass", text: "reactants → products, e.g. magnesium + oxygen → magnesium oxide.",
        points: ["Conservation of mass: the total mass of reactants equals the total mass of products.", "If a gas escapes from an open container, the mass seems to drop — but it's just gone into the air."] },
    ],
  });
})();
