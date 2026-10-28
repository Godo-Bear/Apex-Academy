/* Challenge questions: harder, multi-step questions with full worked explanations, added to every existing topic.
   Plus TOPIC_VIDEOS: video searches for each topic, shown on its Learn tab. Runs after topics-more.js, before app.js. */
(function () {
  "use strict";
  const { mc, num, order, build } = window.__moreTopicTools;
  const all = [...YEAR_LEVELS[0].topics, ...ENGLISH_TOPICS, ...SCIENCE_TOPICS];
  const add = (id, list) => {
    const t = all.find((x) => x.id === id);
    if (t) t.questions.push(...build(`${id}-ch`, list));
  };

  // ---------------------------------------------------------------- Maths
  add("y7-computation", [
    num(3, "A school orders 28 boxes of 144 pencils and shares them equally between 32 classes. How many pencils does each class get?", 126, "Total pencils: 28 × 144 = 4032. Shared between 32 classes: 4032 ÷ 32 = 126 pencils each."),
    num(3, "Evaluate 48 ÷ (6 − 2) × 3 + 5².", 61, "Brackets: 6 − 2 = 4. Indices: 5² = 25. Then left to right: 48 ÷ 4 = 12, 12 × 3 = 36. Finally 36 + 25 = 61."),
    num(3, "A concert hall has 46 rows of 38 seats. 1500 tickets are sold. How many seats are empty?", 248, "Seats: 46 × 38 = 1748. Empty: 1748 − 1500 = 248."),
    num(2, "Estimate 398 × 51 by rounding each number to the nearest 10 first. What is the estimate?", 20000, "398 → 400 and 51 → 50. 400 × 50 = 20 000. (The exact answer, 20 298, is close.)"),
    num(3, "A bus holds 52 students. How many buses are needed to take 375 students on an excursion?", 8, "375 ÷ 52 = 7.2… Seven buses only carry 364, so you need to round UP to 8 buses."),
  ]);
  add("y7-numberprops", [
    num(3, "What is the highest common factor (HCF) of 84 and 126?", 42, "84 = 2² × 3 × 7 and 126 = 2 × 3² × 7. Shared primes (lowest powers): 2 × 3 × 7 = 42."),
    num(3, "What is the lowest common multiple (LCM) of 12, 18 and 30?", 180, "12 = 2² × 3, 18 = 2 × 3², 30 = 2 × 3 × 5. Take the highest power of each prime: 2² × 3² × 5 = 180."),
    num(3, "Two lighthouses flash every 12 seconds and every 20 seconds. They flash together now. After how many seconds will they next flash together?", 60, "You need the LCM of 12 and 20. Multiples of 20: 20, 40, 60 … 60 is also a multiple of 12, so 60 seconds."),
    mc(3, "Write 360 as a product of prime factors.", ["2³ × 3² × 5", "2² × 3² × 10", "2³ × 45", "2 × 3 × 5 × 12"], "360 = 2 × 180 = 2 × 2 × 90 = 2 × 2 × 2 × 45 = 2³ × 3 × 15 = 2³ × 3² × 5. Every factor must be prime, so 10, 45 and 12 aren't allowed."),
    num(3, "Calculate √(9 × 16) + 2³.", 20, "9 × 16 = 144 and √144 = 12. 2³ = 8. 12 + 8 = 20."),
  ]);
  add("y7-fdp", [
    num(3, "In a class of 32, 3/8 walk to school, 25% catch the bus and the rest are driven. How many are driven?", 12, "Walk: 3/8 × 32 = 12. Bus: 25% of 32 = 8. Driven: 32 − 12 − 8 = 12."),
    num(3, "What is 2/3 of 3/4 of 120?", 60, "3/4 of 120 = 90. 2/3 of 90 = 60. (Or 2/3 × 3/4 = 1/2, and half of 120 is 60.)"),
    num(2, "A $45 game is reduced by one third. What is the new price, in dollars?", 30, "1/3 of $45 = $15. $45 − $15 = $30."),
    order(3, "Put these in order from smallest to largest.", ["60%", "0.62", "5/8", "2/3"], "Smallest", "Largest", "Change them all to decimals: 60% = 0.6, 0.62, 5/8 = 0.625, 2/3 = 0.666… So 60% < 0.62 < 5/8 < 2/3."),
    num(3, "Calculate 2½ × 1⅗.", 4, "Change to improper fractions: 5/2 × 8/5 = 40/10 = 4."),
  ]);
  add("y7-algebra", [
    num(3, "If a = 3 and b = −2, evaluate 4a² − 3b.", 42, "a² = 9, so 4a² = 36. 3b = 3 × (−2) = −6, and subtracting −6 adds 6: 36 + 6 = 42."),
    mc(2, "Simplify 5x + 3y − 2x + 7y.", ["3x + 10y", "7x + 10y", "3x + 4y", "13xy"], "Collect like terms: 5x − 2x = 3x and 3y + 7y = 10y. You can't add x and y terms together."),
    mc(3, "Expand and simplify 3(2x + 4) − 2(x − 1).", ["4x + 14", "4x + 10", "8x + 14", "4x + 11"], "3(2x + 4) = 6x + 12. −2(x − 1) = −2x + 2 (a negative times a negative is positive). 6x − 2x = 4x and 12 + 2 = 14."),
    mc(3, "Factorise 12x + 18 fully.", ["6(2x + 3)", "3(4x + 6)", "2(6x + 9)", "12(x + 6)"], "The HCF of 12 and 18 is 6: 12x ÷ 6 = 2x and 18 ÷ 6 = 3. The others are only partly factorised (or wrong)."),
    mc(3, "A rectangle has length (x + 5) and width 3. Which expression is its perimeter?", ["2x + 16", "3x + 15", "x + 8", "2x + 13"], "Perimeter = 2 × length + 2 × width = 2(x + 5) + 2 × 3 = 2x + 10 + 6 = 2x + 16."),
  ]);
  add("y7-decimals", [
    num(2, "Calculate 3.6 × 0.25.", 0.9, "0.25 is a quarter, and a quarter of 3.6 is 0.9."),
    num(3, "Calculate 7.2 ÷ 0.08.", 90, "Multiply both numbers by 100 so you divide by a whole number: 720 ÷ 8 = 90."),
    num(3, "Petrol costs $1.879 per litre. How much do 40 litres cost, to the nearest cent?", 75.16, "40 × 1.879 = 75.16. So $75.16."),
    num(2, "Round 12.3456 to 2 decimal places.", 12.35, "Look at the 3rd decimal place: 5, so round up. 12.34|56 → 12.35."),
    num(3, "A 2.4 m board is cut into pieces 0.15 m long. How many pieces are there?", 16, "2.4 ÷ 0.15 = 240 ÷ 15 = 16 pieces."),
  ]);
  add("y7-negatives", [
    num(3, "Calculate −8 − (−15) + (−4).", 3, "Subtracting a negative adds: −8 + 15 = 7. Adding a negative subtracts: 7 − 4 = 3."),
    num(3, "Calculate (−6) × (−4) ÷ (−3).", -8, "(−6) × (−4) = 24 (two negatives make a positive). 24 ÷ (−3) = −8."),
    num(2, "At 5 am it was −7 °C. By 2 pm the temperature had risen by 19 °C. What was it at 2 pm, in °C?", 12, "−7 + 19 = 12 °C."),
    num(3, "Calculate (−2)³ + (−3)².", 1, "(−2)³ = −2 × −2 × −2 = −8. (−3)² = 9. −8 + 9 = 1."),
    num(3, "A submarine is at −120 m. It rises 45 m, then dives 70 m. What is its new position, in metres?", -145, "Rising: −120 + 45 = −75. Diving: −75 − 70 = −145 m."),
  ]);
  add("y7-cartesian", [
    num(3, "What is the area of the rectangle with corners (−2, 1), (4, 1), (4, 5) and (−2, 5), in square units?", 24, "Width: 4 − (−2) = 6. Height: 5 − 1 = 4. Area = 6 × 4 = 24."),
    mc(2, "Three corners of a square are (1, 1), (5, 1) and (5, 5). Where is the fourth corner?", ["(1, 5)", "(5, 9)", "(1, 1)", "(9, 5)"], "The sides are 4 long. Going up 4 from (1, 1) gives (1, 5)."),
    num(2, "What is the distance between (−3, 4) and (6, 4)?", 9, "They're on the same horizontal line, so subtract the x-values: 6 − (−3) = 9."),
    mc(3, "What is the midpoint of (2, 6) and (8, 2)?", ["(5, 4)", "(10, 8)", "(6, 4)", "(5, 3)"], "Average the x-values: (2 + 8) ÷ 2 = 5. Average the y-values: (6 + 2) ÷ 2 = 4."),
    num(3, "A triangle has corners (0, 0), (6, 0) and (0, 4). What is its area, in square units?", 12, "Base along the x-axis = 6, height up the y-axis = 4. Area = ½ × 6 × 4 = 12."),
  ]);
  add("y7-geometry", [
    num(3, "In an isosceles triangle the angle between the two equal sides is 40°. What is each base angle?", 70, "Angles in a triangle add to 180°. 180 − 40 = 140, shared equally between the two base angles: 140 ÷ 2 = 70°."),
    num(3, "What is the sum of the interior angles of a hexagon, in degrees?", 720, "Split it into triangles from one corner: a hexagon makes 6 − 2 = 4 triangles. 4 × 180° = 720°."),
    num(2, "One angle of a parallelogram is 65°. What is the angle next to it?", 115, "Neighbouring angles in a parallelogram are co-interior, so they add to 180°: 180 − 65 = 115°."),
    num(3, "Two parallel lines are cut by a transversal. One angle is 72°. What is the co-interior angle to it?", 108, "Co-interior angles between parallel lines add to 180°: 180 − 72 = 108°."),
    num(3, "Angles around a point are 3x, 2x, 100° and 60°. What is x?", 40, "Angles at a point add to 360°: 5x + 160 = 360, so 5x = 200 and x = 40."),
  ]);
  add("y7-statsprob", [
    num(3, "Five test scores have a mean of 14. Four of them are 12, 15, 10 and 18. What is the fifth score?", 15, "Total = mean × count = 14 × 5 = 70. The four known scores add to 55, so the fifth is 70 − 55 = 15."),
    num(3, "Find the median of 8, 3, 11, 6, 14, 9.", 8.5, "Order them: 3, 6, 8, 9, 11, 14. There are two middle values, 8 and 9, so the median is (8 + 9) ÷ 2 = 8.5."),
    num(3, "A spinner has 8 equal sections: 3 red, 4 blue and 1 green. If it's spun 200 times, how many reds would you expect?", 75, "P(red) = 3/8. Expected reds = 3/8 × 200 = 75."),
    num(2, "What is the range of 23, 17, 31, 9, 26?", 22, "Range = highest − lowest = 31 − 9 = 22."),
    mc(3, "Two coins are tossed. What is the probability of getting two heads?", ["1/4", "1/2", "1/3", "3/4"], "The outcomes are HH, HT, TH, TT — 4 equally likely outcomes, and only 1 is HH. So 1/4."),
  ]);
  add("y7-equations", [
    num(3, "Solve 3(x − 4) = 2x + 5.", 17, "Expand: 3x − 12 = 2x + 5. Subtract 2x: x − 12 = 5. Add 12: x = 17."),
    num(3, "Solve (x + 7) ÷ 3 = 5.", 8, "Multiply both sides by 3: x + 7 = 15. Subtract 7: x = 8."),
    num(2, "I think of a number, multiply it by 4 and subtract 9. The answer is 31. What is my number?", 10, "4n − 9 = 31. Add 9: 4n = 40. Divide by 4: n = 10."),
    num(3, "The sum of three consecutive whole numbers is 72. What is the largest of them?", 25, "Call them n, n + 1, n + 2: 3n + 3 = 72, so 3n = 69 and n = 23. The numbers are 23, 24, 25."),
    num(3, "Solve 5x − 8 = 3x + 14.", 11, "Subtract 3x: 2x − 8 = 14. Add 8: 2x = 22. Divide by 2: x = 11."),
  ]);
  add("y7-measurement", [
    num(3, "A pool is 12 m long, 5 m wide and 1.5 m deep. How many litres does it hold when full? (1 m³ = 1000 L)", 90000, "Volume = 12 × 5 × 1.5 = 90 m³. 90 × 1000 = 90 000 L."),
    num(3, "A circular garden has radius 3 m. Using π ≈ 3.14, how many metres of edging go around it?", 18.84, "Circumference = 2πr = 2 × 3.14 × 3 = 18.84 m.", 0.01),
    num(3, "A room is 4.5 m by 3.2 m. Floor tiles cost $35 per m². What is the cost, in dollars?", 504, "Area = 4.5 × 3.2 = 14.4 m². Cost = 14.4 × 35 = $504."),
    num(3, "How many 50 cm × 50 cm tiles are needed to cover a 3 m × 2 m floor?", 24, "In metres a tile is 0.5 × 0.5. Along 3 m: 3 ÷ 0.5 = 6 tiles. Along 2 m: 2 ÷ 0.5 = 4 tiles. 6 × 4 = 24."),
    num(2, "A trip starts at 9:45 am and ends at 2:10 pm. How many minutes long is it?", 265, "9:45 → 12:45 is 3 hours, 12:45 → 1:45 is 1 hour, and 1:45 → 2:10 is 25 min. 4 h 25 min = 240 + 25 = 265 minutes."),
  ]);

  // ---------------------------------------------------------------- English
  add("eng-punctuation", [
    mc(2, "Which sentence is punctuated correctly?", ["The dog wagged its tail.", "The dog wagged it's tail.", "The dog wagged its' tail.", "The dogs' wagged its tail."], "'Its' (no apostrophe) means 'belonging to it'. 'It's' only ever means 'it is' or 'it has'."),
    mc(3, "Which is correct for 'the toys belonging to the children'?", ["The children's toys", "The childrens' toys", "The childrens toys", "The children toy's"], "'Children' is already plural and doesn't end in s, so add 's: children's."),
    mc(3, "Which uses a semicolon correctly?", ["I was tired; I went to bed early.", "I was; tired I went to bed.", "I; was tired.", "I was tired; and I went to bed."], "A semicolon joins two complete, related sentences. Don't use it with 'and'."),
    mc(3, "Which direct speech is punctuated correctly?", ["\"Where are you going?\" asked Mum.", "\"Where are you going\"? asked Mum.", "\"Where are you going,\" asked Mum?", "Where are you going? \"asked Mum.\""], "The question mark goes inside the speech marks, because it belongs to what was said."),
    mc(3, "Which sentence uses a colon correctly?", ["Bring three things: a hat, water and sunscreen.", "Bring: three things a hat, water and sunscreen.", "Bring three: things a hat.", "Bring three things a hat: water and sunscreen."], "A colon introduces a list after a complete clause ('Bring three things')."),
  ]);
  add("eng-spelling", [
    mc(2, "Which word is spelt correctly?", ["Necessary", "Neccessary", "Necesary", "Neccesary"], "One collar (c), two sleeves (ss): necessary."),
    mc(2, "Which word is spelt correctly?", ["Separate", "Seperate", "Separete", "Seprate"], "There's 'a rat' in sep-a-rate."),
    mc(3, "Which sentence uses the correct word?", ["The weather affected our plans.", "The weather effected our plans.", "The whether affected our plans.", "The weather affected hour plans."], "'Affect' is usually the verb (to influence); 'effect' is usually the noun (a result)."),
    mc(3, "What is the plural of 'crisis'?", ["Crises", "Crisises", "Crisis", "Crisi"], "Words ending in -is often change to -es: crisis → crises, analysis → analyses."),
    mc(3, "Which word is spelt correctly?", ["Embarrass", "Embarass", "Embarras", "Emberrass"], "Double r, double s: embarrass."),
  ]);
  const PLATYPUS = "The platypus is one of the strangest animals on Earth. When British scientists first saw a dried platypus skin in 1798, some believed it was a hoax — a duck's bill sewn onto a beaver's body. Yet the platypus is real, and it is perfectly suited to life in the rivers of eastern Australia. It hunts with its eyes, ears and nostrils closed, finding yabbies and insect larvae using thousands of tiny sensors in its bill that detect electric signals from moving prey. Males have a venomous spur on their back legs, and females lay eggs but feed their young with milk. Today, the platypus is threatened by droughts, dams and litter such as fishing line, so protecting healthy waterways is vital to its survival.";
  add("eng-reading", [
    mc(2, "Why did some scientists think the platypus was a hoax?", ["It looked like parts of different animals sewn together", "It was too small to be real", "It could not swim", "It was found in Britain"], "The passage says some believed it was 'a duck's bill sewn onto a beaver's body'."),
    mc(2, "How does the platypus find food underwater?", ["Sensors in its bill detect electric signals", "It uses its excellent eyesight", "It listens for prey", "It smells the water"], "It hunts with eyes, ears and nostrils closed, using sensors in its bill."),
    mc(3, "In the passage, 'suited' most nearly means…", ["Well matched", "Dressed", "Annoyed", "Hidden"], "'Perfectly suited to life in the rivers' means well matched or well adapted to that life."),
    mc(3, "What is the main purpose of the last sentence?", ["To explain the threats to the platypus and why waterways need protecting", "To describe how it hunts", "To tell a funny story", "To compare it with a beaver"], "It names the threats (droughts, dams, litter) and argues waterways must be protected."),
    mc(3, "What can you infer from the passage?", ["The platypus is unusual because it lays eggs yet feeds its young milk", "The platypus lives in every country", "Platypuses are no longer threatened", "Platypuses hunt with their eyes open"], "Laying eggs AND making milk is a rare mix — part of why it's called one of the strangest animals."),
  ].map((q) => ({ ...q, passage: PLATYPUS })));
  add("eng-grammar", [
    mc(3, "Which is a complex sentence (a main clause plus a dependent clause)?", ["Although it was raining, we played outside.", "We played outside.", "It rained and we played.", "Rain!"], "'Although it was raining' can't stand alone — it depends on the main clause 'we played outside'."),
    mc(2, "In 'The tall girl ran quickly to the shop', which word is an adverb?", ["quickly", "tall", "ran", "shop"], "'Quickly' describes how she ran, so it's an adverb. 'Tall' is an adjective describing the girl."),
    mc(3, "Which sentence is in the passive voice?", ["The window was broken by the ball.", "The ball broke the window.", "The boy kicked the ball.", "We fixed the window."], "In the passive voice the thing acted on (the window) comes first, and the doer comes after 'by'."),
    mc(3, "Choose the verb that agrees: 'The box of chocolates ___ on the table.'", ["is", "are", "were", "be"], "The subject is 'box' (singular), not 'chocolates', so use 'is'."),
    mc(3, "Which sentence uses 'fewer' correctly?", ["There are fewer students in class today.", "There is fewer water in the jug.", "I have fewer time than you.", "She has fewer patience."], "Use 'fewer' for things you can count (students), and 'less' for things you can't (water, time, patience)."),
  ]);
  add("eng-vocab", [
    mc(3, "'Benevolent' most nearly means…", ["Kind and generous", "Angry", "Lazy", "Clever"], "'Bene-' means good; a benevolent person wants good things for others."),
    mc(2, "Which is an antonym (opposite) of 'scarce'?", ["Plentiful", "Rare", "Tiny", "Hidden"], "Scarce means there's not much of it; plentiful means there's lots."),
    mc(3, "The prefix 'bene-' (as in 'benefit') means…", ["Good", "Bad", "Two", "Under"], "Bene comes from Latin for 'well' or 'good'."),
    mc(3, "Choose the best word: 'The scientist was ___ about the results, checking them three times.'", ["meticulous", "careless", "reluctant", "hilarious"], "Meticulous means very careful and precise — it fits checking three times."),
    mc(3, "'Ambiguous' means…", ["Having more than one possible meaning", "Very clear", "Extremely large", "Moving slowly"], "An ambiguous sentence could be read in more than one way."),
  ]);
  add("eng-figurative", [
    mc(3, "'The classroom was a zoo.' What technique is this, and what does it suggest?", ["A metaphor suggesting it was wild and noisy", "A simile suggesting there were animals", "Personification of a zoo", "Hyperbole about its size"], "It says the class WAS a zoo (metaphor), suggesting chaos and noise — not real animals."),
    mc(3, "'Time is a thief' suggests that time…", ["Takes things from us without us noticing", "Is a criminal", "Moves very slowly", "Can be caught"], "Like a thief, time quietly takes away youth, moments and opportunities."),
    mc(3, "Which is an oxymoron (two opposite words together)?", ["Deafening silence", "Fast car", "Bright sun", "Cold ice"], "'Deafening' and 'silence' contradict each other, creating a striking effect."),
    mc(2, "'I've told you a thousand times!' is…", ["Hyperbole", "Simile", "Personification", "Onomatopoeia"], "It's a deliberate exaggeration for emphasis."),
    mc(3, "In 'The city never sleeps', what does the personification suggest?", ["The city is busy at all hours", "The city is tired", "The city has no beds", "The city is quiet at night"], "Giving the city a human trait (never sleeping) shows it's always active."),
  ]);

  // ---------------------------------------------------------------- Science
  add("sci-toolkit", [
    mc(3, "Ella tests whether salt changes how fast ice melts. Which is a controlled variable?", ["The size of the ice cubes", "The amount of salt", "The time taken to melt", "Whether the ice melted"], "Salt is the independent variable (changed); melting time is the dependent variable (measured). Ice cube size must be kept the same — it's controlled."),
    num(2, "Three trials gave 12.4 s, 12.8 s and 12.6 s. What is the average, in seconds?", 12.6, "Add them: 12.4 + 12.8 + 12.6 = 37.8. Divide by 3: 12.6 s."),
    mc(3, "Why should you repeat an experiment several times?", ["To make the results more reliable and spot mistakes", "To make it take longer", "To change the hypothesis", "To use more equipment"], "Repeats show whether results are consistent and help you find outliers."),
    mc(2, "Which graph best shows temperature changing over time?", ["A line graph", "A pie chart", "A pictograph", "No graph"], "Line graphs show how something continuous changes over time."),
    mc(3, "In every trial, plants given more light grew taller. Which is the best conclusion?", ["The more light the plants got, the taller they grew", "Plants are green", "Light is bad for plants", "The experiment didn't work"], "A good conclusion links the independent variable (light) to the dependent variable (height), based on the results."),
  ]);
  add("sci-classify", [
    mc(2, "Whales breathe air, are warm-blooded and feed their young milk. They are…", ["Mammals", "Fish", "Amphibians", "Reptiles"], "Making milk and breathing air with lungs are mammal features — even though whales live in water."),
    mc(3, "Why are scientific names (like Phascolarctos cinereus for the koala) useful?", ["Scientists everywhere use the same name for the same species", "They're shorter", "They're always in English", "They describe the colour"], "Common names differ between languages and places; scientific names are the same worldwide."),
    mc(2, "Which group has a backbone, moist skin and lives both in water and on land?", ["Amphibians", "Reptiles", "Insects", "Birds"], "Amphibians, like frogs, have moist skin and usually start life in water."),
    mc(3, "Spiders are not insects because they have…", ["8 legs and 2 body parts", "6 legs", "Wings", "A backbone"], "Insects have 6 legs and 3 body parts; spiders (arachnids) have 8 legs and 2 body parts."),
    order(3, "Put the classification levels in order from biggest group to smallest.", ["Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"], "Biggest", "Smallest", "Memory trick: King Philip Came Over For Good Soup."),
  ]);
  add("sci-ecosystems", [
    mc(3, "In the food chain grass → rabbit → fox, if the foxes are removed the rabbits will probably…", ["Increase at first", "Decrease straight away", "Stay exactly the same", "Become producers"], "With no predator, more rabbits survive — until they run short of grass."),
    num(3, "About 10% of energy passes to the next level. If the grass has 10 000 J, how much reaches the fox in grass → rabbit → fox, in J?", 100, "Grass → rabbit: 10% of 10 000 = 1000 J. Rabbit → fox: 10% of 1000 = 100 J."),
    mc(2, "Decomposers like fungi are important because they…", ["Break down dead things and return nutrients to the soil", "Make food from sunlight", "Only eat living animals", "Produce oxygen at night"], "Without decomposers, nutrients would stay locked in dead matter."),
    mc(2, "A koala eating gum leaves is a…", ["Primary consumer (herbivore)", "Producer", "Secondary consumer", "Decomposer"], "It eats a producer (plants), so it's a primary consumer."),
    mc(3, "Cane toads were introduced to Australia. Why are they a problem?", ["They're poisonous to native predators and have few natural enemies", "They only eat sugar cane", "They are producers", "They help native animals"], "Native predators that eat them die, and toad numbers explode with nothing to control them."),
  ]);
  add("sci-resources", [
    mc(2, "Which is a non-renewable resource?", ["Coal", "Wind", "Solar", "Plantation timber"], "Coal took millions of years to form and can't be replaced in our lifetime."),
    mc(3, "Why is groundwater only renewable if it's used carefully?", ["It refills very slowly, so overuse can run it dry", "It never refills", "It's made in factories", "It's always salty"], "Rain seeps down to refill aquifers slowly; pumping too fast drains them."),
    mc(2, "Which best describes 'sustainable use'?", ["Using resources so future generations can still have them", "Using as much as possible now", "Never using any resources", "Only using fossil fuels"], "Sustainability balances our needs with the needs of the future."),
    mc(2, "In the water cycle, water vapour cooling to form clouds is…", ["Condensation", "Evaporation", "Precipitation", "Collection"], "Vapour cools and condenses into tiny droplets that make clouds."),
    order(3, "Put the water cycle in order, starting at the ocean.", ["Evaporation", "Condensation", "Precipitation", "Collection (runoff)"], "First", "Last", "The Sun evaporates water, it condenses into clouds, falls as precipitation, then collects and runs back to the sea."),
  ]);
  add("sci-space", [
    mc(3, "Why does Australia have summer in December?", ["The Southern Hemisphere is tilted towards the Sun", "Earth is closest to the Sun", "The Sun is hotter in December", "The Moon blocks the Sun"], "Seasons are caused by Earth's tilt, not its distance from the Sun."),
    num(2, "About how many days does the Moon take to go through all its phases?", 29.5, "A full cycle of phases (new moon to new moon) takes about 29.5 days.", 1),
    mc(3, "A solar eclipse happens when…", ["The Moon passes between the Sun and Earth", "Earth passes between the Sun and Moon", "The Sun passes between Earth and Moon", "The Moon is full"], "The Moon blocks the Sun's light from reaching part of Earth."),
    num(3, "Earth turns 360° in 24 hours. How many degrees does it turn in 1 hour?", 15, "360 ÷ 24 = 15° per hour."),
    mc(3, "Why do we always see the same side of the Moon?", ["It spins once in the same time it takes to orbit Earth", "It doesn't spin", "Earth blocks the other side", "The other side is always dark"], "Its spin and orbit both take about 27 days, so the same face always points at us."),
  ]);
  add("sci-forces", [
    num(2, "A box is pushed with 50 N to the right and 30 N to the left. What is the net force, in N?", 20, "The forces act in opposite directions, so subtract: 50 − 30 = 20 N (to the right)."),
    mc(3, "A box has 50 N pushing right and 30 N pushing left. What happens?", ["It accelerates to the right", "It stays still", "It moves to the left", "It moves up"], "The forces are unbalanced, with a net 20 N to the right, so it speeds up to the right."),
    num(3, "An astronaut has a mass of 70 kg. What is their weight on Earth, in newtons? (g ≈ 10 N/kg)", 700, "Weight = mass × gravity = 70 × 10 = 700 N."),
    num(3, "On the Moon, gravity is about 1.6 N/kg. What is the 70 kg astronaut's weight there, in N?", 112, "70 × 1.6 = 112 N. Their mass is still 70 kg — only their weight changes."),
    mc(2, "Why do car tyres have tread?", ["To increase friction (grip) on the road", "To reduce friction", "To make the car lighter", "To make noise"], "Tread grips the road, especially in the wet, helping the car brake and turn."),
  ]);
  add("sci-particles", [
    mc(3, "Why can gases be compressed but solids can't?", ["Gas particles have large spaces between them", "Gas particles are smaller", "Solid particles move faster", "Gases have no particles"], "Squeezing a gas pushes its particles closer together; solid particles are already packed tightly."),
    mc(2, "When a liquid is heated, its particles…", ["Move faster and spread out more", "Stop moving", "Get bigger", "Disappear"], "Heat gives particles more kinetic energy. (The particles themselves don't grow.)"),
    mc(2, "Why does a smell spread across a room?", ["Gas particles move randomly and spread out (diffusion)", "The air pushes it in a straight line", "Smells are solids", "Particles get heavier"], "Diffusion: particles spread from where there are many to where there are few."),
    mc(3, "Why do power lines sag more on hot days?", ["The metal expands as its particles move more", "The wires melt", "Birds sit on them", "Gravity is stronger"], "Heated particles vibrate more and take up more space, so the wire gets longer."),
    mc(3, "What happens to water particles when water freezes?", ["They slow down and lock into fixed positions", "They speed up", "They disappear", "They get bigger"], "Losing heat energy slows them until they hold in a fixed pattern — a solid."),
  ]);
  add("sci-mixtures", [
    mc(2, "What's the best way to separate sand from water?", ["Filtration", "Evaporation", "Using a magnet", "Distillation"], "Sand doesn't dissolve, so filter paper traps it and lets the water through."),
    mc(2, "What's the best way to get salt back from salt water?", ["Evaporation", "Filtration", "Sieving", "Using a magnet"], "Salt is dissolved, so filtering won't work. Evaporate the water and the salt is left."),
    mc(2, "What's the best way to separate iron filings from sand?", ["Use a magnet", "Filtration", "Evaporation", "Distillation"], "Iron is magnetic; sand isn't."),
    mc(3, "In salt water, the salt is the…", ["Solute", "Solvent", "Solution", "Residue"], "The solute dissolves in the solvent (water) to make a solution."),
    order(3, "Put the steps in order to get pure, dry salt from a mix of sand and salt.", ["Add water and stir to dissolve the salt", "Filter to remove the sand", "Evaporate the water from the filtrate", "Collect the salt crystals"], "First", "Last", "Dissolve the salt, filter out the sand (the residue), then evaporate the water to leave the salt."),
  ]);

  // ---------------------------------------------------------------- Videos
  // Search phrases for short explainer videos on each topic. Each becomes a YouTube search link on the Learn tab,
  // plus a Khan Academy search for the topic.
  window.TOPIC_VIDEOS = {
    "y7-computation": ["order of operations BIDMAS", "long multiplication method", "short division method", "rounding whole numbers"],
    "y7-numberprops": ["prime factorisation factor trees", "HCF and LCM explained", "square numbers and square roots", "index notation powers"],
    "y7-fdp": ["equivalent fractions simplifying", "adding and subtracting fractions", "multiplying and dividing fractions", "converting fractions decimals percentages"],
    "y7-algebra": ["introduction to algebra pronumerals", "substitution in algebra", "collecting like terms", "expanding brackets"],
    "y7-decimals": ["place value with decimals", "multiplying decimals", "dividing by decimals", "rounding decimals"],
    "y7-negatives": ["adding and subtracting negative numbers", "multiplying and dividing negative numbers", "negative numbers on a number line"],
    "y7-cartesian": ["Cartesian plane plotting points", "four quadrants coordinates", "plotting a straight line from a rule"],
    "y7-geometry": ["angles on a straight line and at a point", "parallel lines angles alternate corresponding", "angles in a triangle", "classifying triangles and quadrilaterals"],
    "y7-statsprob": ["mean median mode range", "reading stem and leaf plots", "probability explained basics", "sample space probability"],
    "y7-equations": ["solving one step equations", "solving two step equations", "equations with pronumerals on both sides", "writing equations from word problems"],
    "y7-measurement": ["area of triangles parallelograms and trapeziums", "volume of rectangular prisms", "converting metric units", "circumference and area of a circle"],
    "y7-ratios": ["ratios explained simplifying", "dividing an amount in a ratio", "rates and unit rates best buy", "map scale ratio"],
    "y7-money": ["percentage discount sale price", "GST explained Australia maths", "profit and loss percentage", "percentage increase and decrease"],
    "y7-linear": ["finding the rule from a table of values", "linear relationships graphs", "growing patterns rules", "distance time graphs explained"],
    "y7-transform": ["translation reflection rotation", "rotating points about the origin", "line symmetry and rotational symmetry"],
    "y7-3d": ["faces edges vertices 3D shapes", "nets of 3D shapes", "Euler's formula polyhedra", "plan front and side views"],
    "eng-creative": ["how to write a narrative story", "show don't tell writing", "writing a strong story opening", "descriptive writing techniques"],
    "eng-essay": ["how to write a persuasive essay", "TEEL paragraph structure", "writing an essay introduction", "how to write a conclusion"],
    "eng-punctuation": ["apostrophes for possession and contraction", "how to use commas", "punctuating direct speech", "semicolons and colons"],
    "eng-spelling": ["spelling rules for adding suffixes", "commonly confused words", "plural spelling rules"],
    "eng-reading": ["reading comprehension strategies", "making inferences when reading", "finding the main idea"],
    "eng-grammar": ["parts of speech", "simple compound and complex sentences", "clauses explained", "active and passive voice"],
    "eng-vocab": ["prefixes and suffixes meanings", "synonyms and antonyms", "using context clues for vocabulary"],
    "eng-figurative": ["simile metaphor personification", "figurative language explained", "hyperbole and idioms"],
    "eng-poetry": ["poetic devices explained", "rhyme scheme explained", "how to analyse a poem", "haiku and limerick"],
    "eng-narrative": ["plot structure narrative arc", "point of view first third person", "types of conflict in literature", "theme in a story"],
    "eng-persuasive": ["persuasive techniques", "fact and opinion", "analysing persuasive language", "rhetorical questions and emotive language"],
    "eng-texttypes": ["text types and purposes", "audience and purpose in writing", "connectives cohesion in writing"],
    "sci-toolkit": ["scientific method explained", "independent dependent controlled variables", "how to use a Bunsen burner", "drawing scientific graphs"],
    "sci-classify": ["classification of living things", "dichotomous keys", "vertebrates and invertebrates", "binomial nomenclature"],
    "sci-ecosystems": ["food chains and food webs", "producers consumers decomposers", "energy pyramid 10 percent rule", "Australian ecosystems"],
    "sci-resources": ["renewable and non-renewable resources", "the water cycle", "sustainability explained"],
    "sci-space": ["why do we have seasons", "phases of the Moon", "solar and lunar eclipses", "how tides work"],
    "sci-forces": ["balanced and unbalanced forces", "friction explained", "gravity mass and weight", "force diagrams"],
    "sci-particles": ["particle theory states of matter", "changes of state melting boiling", "diffusion explained", "expansion and contraction particles"],
    "sci-mixtures": ["separating mixtures", "filtration evaporation distillation", "solutions solutes and solvents", "chromatography explained"],
    "sci-cells": ["plant and animal cells", "cell organelles and their functions", "how to use a microscope", "calculating magnification"],
    "sci-body": ["human body systems", "digestive system explained", "circulatory system heart", "respiratory system lungs alveoli"],
    "sci-energy": ["forms of energy", "energy transformations", "conduction convection radiation", "energy efficiency"],
    "sci-rocks": ["the rock cycle", "igneous sedimentary metamorphic rocks", "weathering and erosion"],
    "sci-change": ["physical and chemical changes", "signs of a chemical reaction", "elements compounds and mixtures", "conservation of mass"],
  };
})();
