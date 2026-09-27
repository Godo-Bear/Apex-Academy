/* Curriculum content: topics, questions, diagrams and writing prompts.
   Copied unchanged from the original single-file site. */

const YEAR_LEVELS = [
  { id: "7", shortLabel: "Y7", label: "Year 7", icon: "7",
    blurb: "Based on Essential Mathematics for the Victorian Curriculum 7 (3rd Edition).",
    topics: [
      { id: "y7-computation", name: "Computation with Positive Integers", icon: "🔢",
        blurb: "Place value, adding, subtracting, multiplying, dividing, and order of operations.",
        recap: "Adding, subtracting, multiplying, and dividing whole numbers using place value and efficient written methods.",
        example: "Working out the total cost of groceries by adding several prices together.",
        interactive: "area-model",
        diagram: `<svg width="200" height="90" viewBox="0 0 200 90">
          <rect x="10" y="20" width="50" height="50" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <text x="35" y="50" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16233D">3</text>
          <text x="35" y="80" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#5A6B72">Hundreds</text>
          <rect x="75" y="20" width="50" height="50" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <text x="100" y="50" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16233D">4</text>
          <text x="100" y="80" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#5A6B72">Tens</text>
          <rect x="140" y="20" width="50" height="50" fill="#E3963E" opacity="0.2" stroke="#E3963E" stroke-width="2"/>
          <text x="165" y="50" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#E3963E">7</text>
          <text x="165" y="80" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#5A6B72">Ones</text>
        </svg>`,
        questions: [
          { id: "y7-c1", prompt: "347 + 168 = ?", answer: 515, difficulty: 1, explanation: "347 + 168 = 515." },
          { id: "y7-c2", prompt: "58 × 7 = ?", answer: 406, difficulty: 2, explanation: "58 × 7 = 406." },
          { id: "y7-c3", prompt: "144 ÷ 12 + 9 × 3 = ?", answer: 39, difficulty: 3, explanation: "Following order of operations: 144 ÷ 12 = 12, and 9 × 3 = 27. Then 12 + 27 = 39." },
          { id: "y7-c4", prompt: "900 - 275 = ?", answer: 625, difficulty: 1, explanation: "900 - 275 = 625." },
          { id: "y7-c5", prompt: "Round 4867 to the nearest hundred.", answer: 4900, difficulty: 2, explanation: "The tens digit is 6, so we round up: 4867 rounds to 4900." },
          { id: "y7-c6", prompt: "What is the place value of the digit 6 in the number 6482?", answer: 6000, difficulty: 1, explanation: "The 6 sits in the thousands place, so its value is 6000." },
          { id: "y7-c7", prompt: "In the expanded form of 3725 (3725 = 3000 + ___ + 20 + 5), what number goes in the blank?", answer: 700, difficulty: 2, explanation: "3725 = 3000 + 700 + 20 + 5, so the hundreds term is 700." },
          { id: "y7-c8", prompt: "Written using index notation, 5000 = 5 × 10ⁿ. What is n?", answer: 3, difficulty: 3, explanation: "5000 = 5 × 1000 = 5 × 10³, so n = 3." },
          { id: "y7-c9", prompt: "Which of these numbers is the largest: 482, 428, 824, or 248? Enter just the number.", answer: 824, difficulty: 1, explanation: "Comparing hundreds digits, 824 has the largest (8), making it the biggest number." },
          { id: "y7-c10", prompt: "Using the digits 2, 5, and 8 each exactly once, what is the largest three-digit number you can form?", answer: 852, difficulty: 2, explanation: "To make the largest number, arrange the digits from biggest to smallest: 8, 5, 2 → 852." },
          { id: "y7-c11", prompt: "512 + 289 = ?", answer: 801, difficulty: 1, explanation: "512 + 289 = 801." },
          { id: "y7-c12", prompt: "760 - 340 = ?", answer: 420, difficulty: 1, explanation: "760 - 340 = 420." },
          { id: "y7-c13", prompt: "What is the place value of the digit 4 in the number 8043?", answer: 40, difficulty: 1, explanation: "The 4 sits in the tens place, so its value is 40." },
          { id: "y7-c14", prompt: "9 × 6 = ?", answer: 54, difficulty: 1, explanation: "9 × 6 = 54." },
          { id: "y7-c15", prompt: "84 ÷ 7 = ?", answer: 12, difficulty: 1, explanation: "84 ÷ 7 = 12, since 7 × 12 = 84." },
          { id: "y7-c16", prompt: "Which of these numbers is the smallest: 391, 319, 913, or 139? Enter just the number.", answer: 139, difficulty: 1, explanation: "Comparing hundreds digits, 139 has the smallest (1), making it the smallest number." },
          { id: "y7-c17", prompt: "236 × 4 = ?", answer: 944, difficulty: 2, explanation: "236 × 4 = 944." },
          { id: "y7-c18", prompt: "504 ÷ 8 = ?", answer: 63, difficulty: 2, explanation: "504 ÷ 8 = 63, since 8 × 63 = 504." },
          { id: "y7-c19", prompt: "Round 27456 to the nearest thousand.", answer: 27000, difficulty: 2, explanation: "The hundreds digit is 4, which is less than 5, so we round down: 27456 rounds to 27000." },
          { id: "y7-c20", prompt: "In the expanded form of 6248 (6248 = 6000 + 200 + ___ + 8), what number goes in the blank?", answer: 40, difficulty: 2, explanation: "6248 = 6000 + 200 + 40 + 8, so the tens term is 40." },
          { id: "y7-c21", prompt: "1250 ÷ 25 = ?", answer: 50, difficulty: 2, explanation: "1250 ÷ 25 = 50, since 25 × 50 = 1250." },
          { id: "y7-c22", prompt: "What is the place value of the digit 7 in the number 47932?", answer: 7000, difficulty: 2, explanation: "The 7 sits in the thousands place, so its value is 7000." },
          { id: "y7-c23", prompt: "(18 + 6) × 3 - 20 = ?", answer: 52, difficulty: 3, explanation: "Brackets first: 18 + 6 = 24. Then 24 × 3 = 72. Finally 72 - 20 = 52." },
          { id: "y7-c24", prompt: "250 - 6 × 8 ÷ 4 = ?", answer: 238, difficulty: 3, explanation: "Multiplication and division first: 6 × 8 = 48, then 48 ÷ 4 = 12. Finally 250 - 12 = 238." },
          { id: "y7-c25", prompt: "Written using index notation, 90000 = 9 × 10ⁿ. What is n?", answer: 4, difficulty: 3, explanation: "90000 = 9 × 10000 = 9 × 10⁴, so n = 4." },
          { id: "y7-c26", prompt: "Using the digits 3, 6, and 9 each exactly once, what is the smallest three-digit number you can form?", answer: 369, difficulty: 3, explanation: "To make the smallest number, arrange the digits from smallest to biggest: 3, 6, 9 → 369." },
          { id: "y7-c27", prompt: "17 × 23 = ?", answer: 391, difficulty: 3, explanation: "17 × 23 = 17 × 20 + 17 × 3 = 340 + 51 = 391." },
          { id: "y7-c28", prompt: "936 ÷ 12 = ?", answer: 78, difficulty: 3, explanation: "936 ÷ 12 = 78, since 12 × 78 = 936." },
          { id: "y7-c29", prompt: "(45 - 15) ÷ 6 + 8 × 2 = ?", answer: 21, difficulty: 3, explanation: "Brackets first: 45 - 15 = 30, then 30 ÷ 6 = 5. Also 8 × 2 = 16. Finally 5 + 16 = 21." },
          { id: "y7-c30", prompt: "Round 3652900 to the nearest hundred thousand.", answer: 3700000, difficulty: 3, explanation: "The ten-thousands digit is 5, so we round up: 3652900 rounds to 3700000." },
        ] },
      { id: "y7-numberprops", name: "Number Properties and Patterns", icon: "🔎",
        blurb: "Factors, multiples, primes, squares, and number patterns.",
        recap: "Understanding factors, multiples, prime numbers, squares, and number patterns.",
        example: "Working out how to arrange 24 chairs into equal rows for an assembly.",
        interactive: "multiples-grid",
        diagram: `<svg width="180" height="110" viewBox="0 0 180 110">
          <circle cx="90" cy="20" r="16" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <text x="90" y="25" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16233D">12</text>
          <line x1="90" y1="36" x2="50" y2="65" stroke="#5A6B72" stroke-width="2"/>
          <line x1="90" y1="36" x2="130" y2="65" stroke="#5A6B72" stroke-width="2"/>
          <circle cx="50" cy="80" r="15" fill="#E3963E" opacity="0.2" stroke="#E3963E" stroke-width="2"/>
          <text x="50" y="85" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#E3963E">3</text>
          <circle cx="130" cy="80" r="15" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <text x="130" y="85" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16233D">4</text>
        </svg>`,
        questions: [
          { id: "y7-n1", prompt: "What is 7² (7 squared)?", answer: 49, difficulty: 1, explanation: "7² = 7 × 7 = 49." },
          { id: "y7-n2", prompt: "What is the next number in the pattern: 3, 6, 12, 24, ...?", answer: 48, difficulty: 2, explanation: "Each number doubles the one before it, so 24 × 2 = 48." },
          { id: "y7-n3", prompt: "Express 60 as a product of its prime factors. What is the largest prime factor?", answer: 5, difficulty: 3, explanation: "60 = 2 × 2 × 3 × 5, so the largest prime factor is 5." },
          { id: "y7-n4", prompt: "List the first three multiples of 9 greater than 0. What is the third one?", answer: 27, difficulty: 1, explanation: "The multiples of 9 are 9, 18, 27 — the third is 27." },
          { id: "y7-n5", prompt: "Is 51 a prime number? Enter 1 for yes, 0 for no.", answer: 0, difficulty: 2, explanation: "51 = 3 × 17, so it has factors other than 1 and itself — it is not prime." },
          { id: "y7-n6", prompt: "What is 6² (6 squared)?", answer: 36, difficulty: 1, explanation: "6² = 6 × 6 = 36." },
          { id: "y7-n7", prompt: "List the first four multiples of 4 greater than 0. What is the fourth one?", answer: 16, difficulty: 1, explanation: "The multiples of 4 are 4, 8, 12, 16 — the fourth is 16." },
          { id: "y7-n8", prompt: "What is the smallest factor of any whole number greater than 0?", answer: 1, difficulty: 1, explanation: "Every whole number greater than 0 has 1 as its smallest factor." },
          { id: "y7-n9", prompt: "Is 14 an even number? Enter 1 for yes, 0 for no.", answer: 1, difficulty: 1, explanation: "14 divides evenly by 2, so it is an even number." },
          { id: "y7-n10", prompt: "What is 9² (9 squared)?", answer: 81, difficulty: 1, explanation: "9² = 9 × 9 = 81." },
          { id: "y7-n11", prompt: "List the first five multiples of 3 greater than 0. What is the fifth one?", answer: 15, difficulty: 1, explanation: "The multiples of 3 are 3, 6, 9, 12, 15 — the fifth is 15." },
          { id: "y7-n12", prompt: "What is the largest factor of 40?", answer: 40, difficulty: 1, explanation: "Every number is a factor of itself, so the largest factor of 40 is 40." },
          { id: "y7-n13", prompt: "Is 27 an odd number? Enter 1 for yes, 0 for no.", answer: 1, difficulty: 1, explanation: "27 does not divide evenly by 2, so it is an odd number." },
          { id: "y7-n14", prompt: "What is the next number in the pattern: 2, 6, 18, 54, ...?", answer: 162, difficulty: 2, explanation: "Each number is multiplied by 3, so 54 × 3 = 162." },
          { id: "y7-n15", prompt: "Is 87 a prime number? Enter 1 for yes, 0 for no.", answer: 0, difficulty: 2, explanation: "87 = 3 × 29, so it has factors other than 1 and itself — it is not prime." },
          { id: "y7-n16", prompt: "What is the sum of all the factors of 12?", answer: 28, difficulty: 2, explanation: "The factors of 12 are 1, 2, 3, 4, 6, 12. Adding them: 1+2+3+4+6+12 = 28." },
          { id: "y7-n17", prompt: "How many factors does 16 have in total?", answer: 5, difficulty: 2, explanation: "The factors of 16 are 1, 2, 4, 8, 16 — that's 5 factors." },
          { id: "y7-n18", prompt: "What is the next number in the pattern: 100, 91, 82, 73, ...?", answer: 64, difficulty: 2, explanation: "Each number decreases by 9, so 73 - 9 = 64." },
          { id: "y7-n19", prompt: "What is the highest common factor (HCF) of 18 and 24?", answer: 6, difficulty: 2, explanation: "Factors of 18: 1,2,3,6,9,18. Factors of 24: 1,2,3,4,6,8,12,24. The highest common factor is 6." },
          { id: "y7-n20", prompt: "What is the lowest common multiple (LCM) of 4 and 6?", answer: 12, difficulty: 2, explanation: "Multiples of 4: 4,8,12... Multiples of 6: 6,12... The lowest common multiple is 12." },
          { id: "y7-n21", prompt: "Is 91 a prime number? Enter 1 for yes, 0 for no.", answer: 0, difficulty: 2, explanation: "91 = 7 × 13, so it has factors other than 1 and itself — it is not prime." },
          { id: "y7-n22", prompt: "Express 84 as a product of its prime factors. What is the largest prime factor?", answer: 7, difficulty: 3, explanation: "84 = 2 × 2 × 3 × 7, so the largest prime factor is 7." },
          { id: "y7-n23", prompt: "A number has exactly four factors: 1, 2, 5, and itself. What is the number?", answer: 10, difficulty: 3, explanation: "The factors of 10 are exactly 1, 2, 5, and 10, so the number is 10." },
          { id: "y7-n24", prompt: "What is the highest common factor (HCF) of 36 and 48?", answer: 12, difficulty: 3, explanation: "36 = 2² × 3² and 48 = 2⁴ × 3. The shared factors give an HCF of 2² × 3 = 12." },
          { id: "y7-n25", prompt: "What is the lowest common multiple (LCM) of 8 and 12?", answer: 24, difficulty: 3, explanation: "8 = 2³ and 12 = 2² × 3. The LCM is 2³ × 3 = 24." },
          { id: "y7-n26", prompt: "How many factors does 36 have in total?", answer: 9, difficulty: 3, explanation: "The factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36 — that's 9 factors." },
          { id: "y7-n27", prompt: "Express 90 as a product of its prime factors. What is the largest prime factor?", answer: 5, difficulty: 3, explanation: "90 = 2 × 3 × 3 × 5, so the largest prime factor is 5." },
          { id: "y7-n28", prompt: "A number is both a multiple of 4 and a multiple of 6. What is the smallest such number greater than 0?", answer: 12, difficulty: 3, explanation: "This is asking for the lowest common multiple of 4 and 6, which is 12." },
          { id: "y7-n29", prompt: "What is the sum of the first five prime numbers?", answer: 28, difficulty: 3, explanation: "The first five primes are 2, 3, 5, 7, 11. Adding them: 2+3+5+7+11 = 28." },
          { id: "y7-n30", prompt: "Is 97 a prime number? Enter 1 for yes, 0 for no.", answer: 1, difficulty: 3, explanation: "97 is not divisible by 2, 3, 5, or 7 (the primes up to its square root), so it is prime." },
        ] },
      { id: "y7-fdp", name: "Fractions and Percentages", icon: "➗",
        blurb: "Equivalent fractions, operations with fractions, and percentages.",
        recap: "Understanding different ways to represent parts of a whole and converting between them.",
        example: "Splitting a pizza with 8 slices among friends where 3 slices are eaten (3/8).",
        interactive: "fraction-shader",
        diagram: `<svg width="200" height="100" viewBox="0 0 200 100">
          <circle cx="50" cy="50" r="40" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <path d="M50 50 L50 10 A40 40 0 0 1 90 50 Z" fill="#E3963E" opacity="0.8"/>
          <path d="M50 50 L90 50 A40 40 0 0 1 50 90 Z" fill="#2F6F76" opacity="0.8"/>
          <path d="M50 50 L50 90 A40 40 0 0 1 10 50 Z" fill="#2F6F76" opacity="0.8"/>
          <text x="120" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16233D">3/4 shaded</text>
          <text x="120" y="65" font-family="sans-serif" font-size="12" fill="#5A6B72">= 75% = 0.75</text>
        </svg>`,
        questions: [
          { id: "y7-f1", prompt: "Convert 3/4 to a percentage.", answer: 75, difficulty: 1, explanation: "3 ÷ 4 = 0.75, which is 75%." },
          { id: "y7-f2", prompt: "What is 20% of 150?", answer: 30, difficulty: 2, explanation: "0.20 × 150 = 30." },
          { id: "y7-f3", prompt: "Simplify the fraction 24/36 to its lowest terms and enter the numerator.", answer: 2, difficulty: 3, explanation: "Divide numerator and denominator by 12: 24/36 = 2/3." },
          { id: "y7-f4", prompt: "Convert 0.6 into a simplified fraction numerator (with denominator 5).", answer: 3, difficulty: 1, explanation: "0.6 = 6/10 = 3/5, so the numerator is 3." },
          { id: "y7-f5", prompt: "Evaluate: 1/2 + 1/4 expressed as a percentage.", answer: 75, difficulty: 2, explanation: "1/2 + 1/4 = 3/4 = 75%." },
          { id: "y7-f6", prompt: "A pizza is cut into 8 equal slices, and 3 are eaten. What is the numerator of the fraction eaten (denominator is 8)?", answer: 3, difficulty: 1, explanation: "3 out of 8 slices were eaten, so the fraction is 3/8." },
          { id: "y7-f7", prompt: "Convert 1/2 to a percentage.", answer: 50, difficulty: 1, explanation: "1 ÷ 2 = 0.5, which is 50%." },
          { id: "y7-f8", prompt: "What is 1/4 of 20?", answer: 5, difficulty: 1, explanation: "20 ÷ 4 = 5." },
          { id: "y7-f9", prompt: "Convert 2/5 to a decimal.", answer: 0.4, difficulty: 1, explanation: "2 ÷ 5 = 0.4." },
          { id: "y7-f10", prompt: "A chocolate bar has 10 equal pieces. If 4 are eaten, what is the numerator of the fraction remaining (out of 10)?", answer: 6, difficulty: 1, explanation: "10 - 4 = 6 pieces remain, so the fraction is 6/10." },
          { id: "y7-f11", prompt: "Convert 3/10 to a percentage.", answer: 30, difficulty: 1, explanation: "3 ÷ 10 = 0.3, which is 30%." },
          { id: "y7-f12", prompt: "What is 1/2 of 18?", answer: 9, difficulty: 1, explanation: "18 ÷ 2 = 9." },
          { id: "y7-f13", prompt: "Simplify the fraction 4/8 to its lowest terms and enter the denominator.", answer: 2, difficulty: 1, explanation: "4/8 simplifies to 1/2, so the denominator is 2." },
          { id: "y7-f14", prompt: "What is 35% of 80?", answer: 28, difficulty: 2, explanation: "0.35 × 80 = 28." },
          { id: "y7-f15", prompt: "Convert 7/20 to a percentage.", answer: 35, difficulty: 2, explanation: "7 ÷ 20 = 0.35, which is 35%." },
          { id: "y7-f16", prompt: "A recipe uses 3/4 cup of flour. If you triple the recipe, how many cups of flour are needed?", answer: 2.25, difficulty: 2, explanation: "3/4 × 3 = 9/4 = 2.25 cups." },
          { id: "y7-f17", prompt: "Write the next fraction in the sequence: 1/6, 2/6, 3/6, 4/6, ___. Enter just the numerator.", answer: 5, difficulty: 2, explanation: "The numerators increase by 1 each time, so the next is 5/6." },
          { id: "y7-f18", prompt: "A survey of 40 people found that 1/5 preferred tea. How many people preferred tea?", answer: 8, difficulty: 2, explanation: "40 ÷ 5 = 8 people." },
          { id: "y7-f19", prompt: "What is 3/8 as a decimal?", answer: 0.375, difficulty: 2, explanation: "3 ÷ 8 = 0.375." },
          { id: "y7-f20", prompt: "Convert 0.45 into a fraction with denominator 20. What is the numerator?", answer: 9, difficulty: 2, explanation: "0.45 = 45/100 = 9/20, so the numerator is 9." },
          { id: "y7-f21", prompt: "A class of 25 students has 15 who play sport. What percentage of the class plays sport?", answer: 60, difficulty: 2, explanation: "15 ÷ 25 = 0.6, which is 60%." },
          { id: "y7-f22", prompt: "Simplify the fraction 42/56 to its lowest terms and enter the numerator.", answer: 3, difficulty: 3, explanation: "Divide numerator and denominator by 14: 42/56 = 3/4." },
          { id: "y7-f23", prompt: "A 45km hike is completed over two days. On day one, hikers cover 27km. In simplest form (denominator 5), what is the numerator of the fraction completed on day one?", answer: 3, difficulty: 3, explanation: "27/45 simplifies to 3/5, so the numerator is 3." },
          { id: "y7-f24", prompt: "What is 62.5% of 96?", answer: 60, difficulty: 3, explanation: "0.625 × 96 = 60." },
          { id: "y7-f25", prompt: "Convert 5/8 to a percentage.", answer: 62.5, difficulty: 3, explanation: "5 ÷ 8 = 0.625, which is 62.5%." },
          { id: "y7-f26", prompt: "A vinculum (the fraction bar) represents which operation? Enter 1 for division, 0 for any other operation.", answer: 1, difficulty: 3, explanation: "The vinculum in a fraction represents division — the numerator divided by the denominator." },
          { id: "y7-f27", prompt: "The fractions 6/6 and 9/9 both equal the same whole number. What is that number?", answer: 1, difficulty: 3, explanation: "Any fraction with an equal numerator and denominator equals 1." },
          { id: "y7-f28", prompt: "A recipe needs 5/6 cup of sugar, but you only have 2/3 cup. What is the numerator of the shortfall (out of 6)?", answer: 1, difficulty: 3, explanation: "2/3 = 4/6, and 5/6 - 4/6 = 1/6, so the numerator is 1." },
          { id: "y7-f29", prompt: "Out of a class of 24 students, 9 have visited a particular museum. In simplest form (denominator 8), what is the numerator of the fraction who visited?", answer: 3, difficulty: 3, explanation: "9/24 simplifies to 3/8, so the numerator is 3." },
          { id: "y7-f30", prompt: "What is 1/3 + 1/4 expressed as a percentage, rounded to the nearest whole percent?", answer: 58, difficulty: 3, explanation: "1/3 + 1/4 = 7/12 ≈ 0.5833, which rounds to 58%." },
        ] },
      { id: "y7-algebra", name: "Algebraic Techniques", icon: "📈",
        blurb: "Using pronumerals, simplifying expressions, and substitution.",
        recap: "Using letters to represent unknown numbers and writing simple expressions.",
        example: "Calculating total earnings if you earn $5 per chore plus a $10 bonus (5c + 10).",
        interactive: "function-machine",
        diagram: `<svg width="220" height="90" viewBox="0 0 220 90">
          <rect x="10" y="25" width="80" height="40" rx="4" fill="#F6F3EA" stroke="#C9D4D8" stroke-width="2"/>
          <text x="50" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16233D">5c + 10</text>
          <text x="110" y="50" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2F6F76">=</text>
          <rect x="130" y="25" width="80" height="40" rx="4" fill="#E3963E" opacity="0.2" stroke="#E3963E" stroke-width="2"/>
          <text x="170" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#E3963E">Output</text>
        </svg>`,
        questions: [
          { id: "y7-a1", prompt: "Evaluate 5c + 10 when c = 4.", answer: 30, difficulty: 1, explanation: "5(4) + 10 = 20 + 10 = 30." },
          { id: "y7-a2", prompt: "Simplify: 4x + 3x - 2x. What is the coefficient?", answer: 5, difficulty: 2, explanation: "4x + 3x - 2x = 5x, so the coefficient is 5." },
          { id: "y7-a3", prompt: "Solve for x: 3x - 4 = 11", answer: 5, difficulty: 3, explanation: "Add 4: 3x = 15. Divide by 3: x = 5." },
          { id: "y7-a4", prompt: "Evaluate 2y + 6 when y = 7.", answer: 20, difficulty: 1, explanation: "2(7) + 6 = 14 + 6 = 20." },
          { id: "y7-a5", prompt: "Solve for x: 2(x + 3) = 16", answer: 5, difficulty: 3, explanation: "Divide by 2: x + 3 = 8, so x = 5." },
          { id: "y7-a6", prompt: "Evaluate 3a + 7 when a = 5.", answer: 22, difficulty: 1, explanation: "3(5) + 7 = 15 + 7 = 22." },
          { id: "y7-a7", prompt: "Evaluate 4b - 3 when b = 6.", answer: 21, difficulty: 1, explanation: "4(6) - 3 = 24 - 3 = 21." },
          { id: "y7-a8", prompt: "In the expression 7x + 2, what is the coefficient of x?", answer: 7, difficulty: 1, explanation: "The coefficient is the number multiplying x, which is 7." },
          { id: "y7-a9", prompt: "In the expression 9y - 4, what is the constant term?", answer: -4, difficulty: 1, explanation: "The constant term (the part with no variable) is -4." },
          { id: "y7-a10", prompt: "Simplify: 5x + 2x. What is the coefficient of x?", answer: 7, difficulty: 1, explanation: "5x + 2x = 7x, so the coefficient is 7." },
          { id: "y7-a11", prompt: "Evaluate 10 - 2c when c = 3.", answer: 4, difficulty: 1, explanation: "10 - 2(3) = 10 - 6 = 4." },
          { id: "y7-a12", prompt: "How many terms are in the expression 3x + 5y - 7?", answer: 3, difficulty: 1, explanation: "The terms are 3x, 5y, and -7 — that's 3 terms." },
          { id: "y7-a13", prompt: "Evaluate 6d + 1 when d = 2.", answer: 13, difficulty: 1, explanation: "6(2) + 1 = 12 + 1 = 13." },
          { id: "y7-a14", prompt: "Simplify: 6x + 4x - 3x. What is the coefficient of x?", answer: 7, difficulty: 2, explanation: "6x + 4x - 3x = 7x, so the coefficient is 7." },
          { id: "y7-a15", prompt: "Are 3x + 5 and 5 + 3x equivalent expressions? Enter 1 for yes, 0 for no.", answer: 1, difficulty: 2, explanation: "Addition can be done in any order, so 3x + 5 and 5 + 3x are equivalent." },
          { id: "y7-a16", prompt: "Simplify: 8a - 3a + 2a. What is the coefficient of a?", answer: 7, difficulty: 2, explanation: "8a - 3a + 2a = 7a, so the coefficient is 7." },
          { id: "y7-a17", prompt: "Expand: 3(x + 4). What is the constant term after expanding?", answer: 12, difficulty: 2, explanation: "3(x + 4) = 3x + 12, so the constant term is 12." },
          { id: "y7-a18", prompt: "Evaluate 2p² when p = 3.", answer: 18, difficulty: 2, explanation: "2 × 3² = 2 × 9 = 18." },
          { id: "y7-a19", prompt: "Simplify: 5x + 3y - 2x + y. What is the coefficient of x after simplifying?", answer: 3, difficulty: 2, explanation: "Combining like terms: 5x - 2x = 3x, so the coefficient of x is 3." },
          { id: "y7-a20", prompt: "Expand: 4(y - 2). What is the coefficient of y after expanding?", answer: 4, difficulty: 2, explanation: "4(y - 2) = 4y - 8, so the coefficient of y is 4." },
          { id: "y7-a21", prompt: "Simplify: 12m ÷ 4. What is the coefficient of m?", answer: 3, difficulty: 2, explanation: "12m ÷ 4 = 3m, so the coefficient is 3." },
          { id: "y7-a22", prompt: "Evaluate 3(x + 2) when x = 5.", answer: 21, difficulty: 2, explanation: "3(5 + 2) = 3 × 7 = 21." },
          { id: "y7-a23", prompt: "Solve for x: 4x + 7 = 31", answer: 6, difficulty: 3, explanation: "Subtract 7: 4x = 24. Divide by 4: x = 6." },
          { id: "y7-a24", prompt: "Expand: 5(2x + 3). What is the coefficient of x after expanding?", answer: 10, difficulty: 3, explanation: "5(2x + 3) = 10x + 15, so the coefficient of x is 10." },
          { id: "y7-a25", prompt: "Simplify: 3(x + 2) + 2x. What is the coefficient of x after simplifying?", answer: 5, difficulty: 3, explanation: "3(x + 2) + 2x = 3x + 6 + 2x = 5x + 6, so the coefficient is 5." },
          { id: "y7-a26", prompt: "A rectangle has length (x + 4) and width 5, giving area 5(x + 4). What is the area when x = 3?", answer: 35, difficulty: 3, explanation: "5(3 + 4) = 5 × 7 = 35." },
          { id: "y7-a27", prompt: "Solve for x: 5(x - 2) = 25", answer: 7, difficulty: 3, explanation: "Divide by 5: x - 2 = 5. Add 2: x = 7." },
          { id: "y7-a28", prompt: "Simplify: 7x - 2(x + 3). What is the coefficient of x after simplifying?", answer: 5, difficulty: 3, explanation: "7x - 2(x + 3) = 7x - 2x - 6 = 5x - 6, so the coefficient is 5." },
          { id: "y7-a29", prompt: "Twice a number, plus 9, equals 23. What is the number?", answer: 7, difficulty: 3, explanation: "2n + 9 = 23, so 2n = 14, giving n = 7." },
          { id: "y7-a30", prompt: "Solve for x: 3(x + 1) - 4 = 14", answer: 5, difficulty: 3, explanation: "Expand: 3x + 3 - 4 = 14, so 3x - 1 = 14, giving 3x = 15 and x = 5." },
        ] },
      { id: "y7-decimals", name: "Decimals", icon: "🔟",
        blurb: "Place value, operations, and rounding with decimal numbers.",
        recap: "Understanding place value in decimal numbers and performing operations with them.",
        example: "Working out your change after paying for something with decimal prices, like $7.85.",
        interactive: "decimal-line",
        diagram: `<svg width="220" height="70" viewBox="0 0 220 70">
          <line x1="10" y1="35" x2="210" y2="35" stroke="#16233D" stroke-width="2"/>
          <line x1="60" y1="28" x2="60" y2="42" stroke="#16233D" stroke-width="2"/>
          <text x="60" y="55" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#5A6B72">3.0</text>
          <line x1="160" y1="28" x2="160" y2="42" stroke="#16233D" stroke-width="2"/>
          <text x="160" y="55" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#5A6B72">4.0</text>
          <circle cx="110" cy="35" r="5" fill="#E3963E"/>
          <text x="110" y="20" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#E3963E">3.5</text>
        </svg>`,
        questions: [
          { id: "y7-d1", prompt: "3.45 + 2.6 = ?", answer: 6.05, difficulty: 1, explanation: "3.45 + 2.6 = 6.05." },
          { id: "y7-d2", prompt: "7.2 - 4.85 = ?", answer: 2.35, difficulty: 2, explanation: "7.2 - 4.85 = 2.35." },
          { id: "y7-d3", prompt: "0.6 × 0.4 = ?", answer: 0.24, difficulty: 3, explanation: "0.6 × 0.4 = 0.24." },
          { id: "y7-d4", prompt: "Round 5.278 to 2 decimal places.", answer: 5.28, difficulty: 1, explanation: "The third decimal digit is 8, which rounds the second decimal up: 5.278 → 5.28." },
          { id: "y7-d5", prompt: "8.4 ÷ 0.2 = ?", answer: 42, difficulty: 2, explanation: "8.4 ÷ 0.2 = 42." },
          { id: "y7-d6", prompt: "What is the place value of the digit 7 in the number 4.375?", answer: 0.07, difficulty: 1, explanation: "The 7 sits in the hundredths place, so its value is 0.07." },
          { id: "y7-d7", prompt: "1.25 + 3.4 = ?", answer: 4.65, difficulty: 1, explanation: "1.25 + 3.4 = 4.65." },
          { id: "y7-d8", prompt: "Round 6.42 to 1 decimal place.", answer: 6.4, difficulty: 1, explanation: "The hundredths digit is 2, which rounds down: 6.42 → 6.4." },
          { id: "y7-d9", prompt: "9.8 - 3.5 = ?", answer: 6.3, difficulty: 1, explanation: "9.8 - 3.5 = 6.3." },
          { id: "y7-d10", prompt: "Multiply 2.5 by 10.", answer: 25, difficulty: 1, explanation: "Multiplying by 10 shifts the decimal point one place right: 2.5 × 10 = 25." },
          { id: "y7-d11", prompt: "Convert 0.5 to a fraction with denominator 2. What is the numerator?", answer: 1, difficulty: 1, explanation: "0.5 = 1/2, so the numerator is 1." },
          { id: "y7-d12", prompt: "Which is larger: 0.7 or 0.65? Enter the larger number.", answer: 0.7, difficulty: 1, explanation: "0.7 = 0.70, which is greater than 0.65." },
          { id: "y7-d13", prompt: "Divide 45 by 10.", answer: 4.5, difficulty: 1, explanation: "Dividing by 10 shifts the decimal point one place left: 45 ÷ 10 = 4.5." },
          { id: "y7-d14", prompt: "Round 12.847 to 2 decimal places.", answer: 12.85, difficulty: 2, explanation: "The thousandths digit is 7, which rounds the hundredths up: 12.847 → 12.85." },
          { id: "y7-d15", prompt: "Multiply 3.6 by 100.", answer: 360, difficulty: 2, explanation: "Multiplying by 100 shifts the decimal point two places right: 3.6 × 100 = 360." },
          { id: "y7-d16", prompt: "Divide 250 by 1000.", answer: 0.25, difficulty: 2, explanation: "Dividing by 1000 shifts the decimal point three places left: 250 ÷ 1000 = 0.25." },
          { id: "y7-d17", prompt: "4.75 × 2 = ?", answer: 9.5, difficulty: 2, explanation: "4.75 × 2 = 9.5." },
          { id: "y7-d18", prompt: "Convert 0.75 to a fraction. What is the numerator (with denominator 4)?", answer: 3, difficulty: 2, explanation: "0.75 = 3/4, so the numerator is 3." },
          { id: "y7-d19", prompt: "What is 0.4 expressed as a percentage?", answer: 40, difficulty: 2, explanation: "0.4 = 40/100, which is 40%." },
          { id: "y7-d20", prompt: "6.3 ÷ 3 = ?", answer: 2.1, difficulty: 2, explanation: "6.3 ÷ 3 = 2.1." },
          { id: "y7-d21", prompt: "12.6 - 5.75 = ?", answer: 6.85, difficulty: 2, explanation: "12.6 - 5.75 = 6.85." },
          { id: "y7-d22", prompt: "1.25 × 0.4 = ?", answer: 0.5, difficulty: 3, explanation: "1.25 × 0.4 = 0.5." },
          { id: "y7-d23", prompt: "Divide 7.2 by 0.4.", answer: 18, difficulty: 3, explanation: "7.2 ÷ 0.4 = 18, since 0.4 × 18 = 7.2." },
          { id: "y7-d24", prompt: "Convert 5/8 to a decimal.", answer: 0.625, difficulty: 3, explanation: "5 ÷ 8 = 0.625." },
          { id: "y7-d25", prompt: "What is 0.625 expressed as a percentage?", answer: 62.5, difficulty: 3, explanation: "0.625 = 62.5/100, which is 62.5%." },
          { id: "y7-d26", prompt: "Round 0.0847 to 3 decimal places.", answer: 0.085, difficulty: 3, explanation: "The fourth decimal digit is 7, which rounds the third decimal up: 0.0847 → 0.085." },
          { id: "y7-d27", prompt: "0.75 of a cup, written as a fraction in simplest form, has what denominator?", answer: 4, difficulty: 3, explanation: "0.75 = 3/4, so the denominator is 4." },
          { id: "y7-d28", prompt: "3.5 out of 5 is what percentage?", answer: 70, difficulty: 3, explanation: "3.5 ÷ 5 = 0.7, which is 70%." },
          { id: "y7-d29", prompt: "0.08 × 0.05 = ?", answer: 0.004, difficulty: 3, tolerance: 0.0005, explanation: "0.08 × 0.05 = 0.004." },
          { id: "y7-d30", prompt: "9.6 ÷ 0.03 = ?", answer: 320, difficulty: 3, explanation: "9.6 ÷ 0.03 = 320, since 0.03 × 320 = 9.6." },
        ] },
      { id: "y7-negatives", name: "Negative Numbers", icon: "➖",
        blurb: "Operations with positive and negative integers.",
        recap: "Performing operations with numbers above and below zero.",
        example: "Tracking temperature changes overnight, from 3°C down to -4°C.",
        interactive: "negative-line",
        diagram: `<svg width="220" height="70" viewBox="0 0 220 70">
          <line x1="10" y1="35" x2="210" y2="35" stroke="#16233D" stroke-width="2"/>
          <circle cx="60" cy="35" r="5" fill="#C6564B"/>
          <text x="60" y="20" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#C6564B">-4</text>
          <circle cx="160" cy="35" r="5" fill="#3F8F5F"/>
          <text x="160" y="20" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#3F8F5F">+4</text>
          <text x="110" y="55" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#5A6B72">0</text>
        </svg>`,
        questions: [
          { id: "y7-neg1", prompt: "-8 + 3 = ?", answer: -5, difficulty: 1, explanation: "Starting at -8 and moving up 3 gives -5." },
          { id: "y7-neg2", prompt: "-15 - (-9) = ?", answer: -6, difficulty: 2, explanation: "Subtracting a negative is the same as adding: -15 + 9 = -6." },
          { id: "y7-neg3", prompt: "-6 × (-4) ÷ 2 = ?", answer: 12, difficulty: 3, explanation: "(-6) × (-4) = 24, then 24 ÷ 2 = 12." },
          { id: "y7-neg4", prompt: "7 - 12 = ?", answer: -5, difficulty: 1, explanation: "7 - 12 = -5." },
          { id: "y7-neg5", prompt: "-3 × 5 = ?", answer: -15, difficulty: 2, explanation: "A negative times a positive gives a negative: -3 × 5 = -15." },
          { id: "y7-neg6", prompt: "Which is smaller: -5 or -2? Enter the smaller number.", answer: -5, difficulty: 1, explanation: "On the number line, -5 sits further left than -2, so it is smaller." },
          { id: "y7-neg7", prompt: "-10 + 4 = ?", answer: -6, difficulty: 1, explanation: "-10 + 4 = -6." },
          { id: "y7-neg8", prompt: "What is the opposite (additive inverse) of -7?", answer: 7, difficulty: 1, explanation: "The opposite of a number flips its sign, so the opposite of -7 is 7." },
          { id: "y7-neg9", prompt: "6 - 9 = ?", answer: -3, difficulty: 1, explanation: "6 - 9 = -3." },
          { id: "y7-neg10", prompt: "-2 + 8 = ?", answer: 6, difficulty: 1, explanation: "-2 + 8 = 6." },
          { id: "y7-neg11", prompt: "Which is larger: -3 or -8? Enter the larger number.", answer: -3, difficulty: 1, explanation: "On the number line, -3 sits further right than -8, so it is larger." },
          { id: "y7-neg12", prompt: "-4 - 3 = ?", answer: -7, difficulty: 1, explanation: "-4 - 3 = -7." },
          { id: "y7-neg13", prompt: "What is the opposite (additive inverse) of 5?", answer: -5, difficulty: 1, explanation: "The opposite of a number flips its sign, so the opposite of 5 is -5." },
          { id: "y7-neg14", prompt: "-12 + (-5) = ?", answer: -17, difficulty: 2, explanation: "-12 + (-5) = -17." },
          { id: "y7-neg15", prompt: "8 - (-6) = ?", answer: 14, difficulty: 2, explanation: "Subtracting a negative is the same as adding: 8 + 6 = 14." },
          { id: "y7-neg16", prompt: "-9 - (-9) = ?", answer: 0, difficulty: 2, explanation: "-9 - (-9) = -9 + 9 = 0." },
          { id: "y7-neg17", prompt: "-4 × 6 = ?", answer: -24, difficulty: 2, explanation: "A negative times a positive gives a negative: -4 × 6 = -24." },
          { id: "y7-neg18", prompt: "-20 ÷ 4 = ?", answer: -5, difficulty: 2, explanation: "A negative divided by a positive gives a negative: -20 ÷ 4 = -5." },
          { id: "y7-neg19", prompt: "-7 + 15 - 3 = ?", answer: 5, difficulty: 2, explanation: "-7 + 15 = 8, then 8 - 3 = 5." },
          { id: "y7-neg20", prompt: "On the Cartesian plane, which quadrant number contains the point (3, -2)?", answer: 4, difficulty: 2, explanation: "A positive x and negative y coordinate places the point in Quadrant 4." },
          { id: "y7-neg21", prompt: "-18 ÷ (-3) = ?", answer: 6, difficulty: 2, explanation: "A negative divided by a negative gives a positive: -18 ÷ (-3) = 6." },
          { id: "y7-neg22", prompt: "-5 × (-3) + 2 = ?", answer: 17, difficulty: 3, explanation: "-5 × (-3) = 15, then 15 + 2 = 17." },
          { id: "y7-neg23", prompt: "20 ÷ (-4) - 3 = ?", answer: -8, difficulty: 3, explanation: "20 ÷ (-4) = -5, then -5 - 3 = -8." },
          { id: "y7-neg24", prompt: "-6 - 4 × (-2) = ?", answer: 2, difficulty: 3, explanation: "4 × (-2) = -8, then -6 - (-8) = -6 + 8 = 2." },
          { id: "y7-neg25", prompt: "Evaluate 3x - 5 when x = -4.", answer: -17, difficulty: 3, explanation: "3(-4) - 5 = -12 - 5 = -17." },
          { id: "y7-neg26", prompt: "-8 × 3 ÷ (-4) = ?", answer: 6, difficulty: 3, explanation: "-8 × 3 = -24, then -24 ÷ (-4) = 6." },
          { id: "y7-neg27", prompt: "(-2)² + (-3) = ?", answer: 1, difficulty: 3, explanation: "(-2)² = 4, then 4 + (-3) = 1." },
          { id: "y7-neg28", prompt: "On the Cartesian plane, which quadrant number contains the point (-5, -1)?", answer: 3, difficulty: 3, explanation: "A negative x and negative y coordinate places the point in Quadrant 3." },
          { id: "y7-neg29", prompt: "Evaluate -2y + 7 when y = -3.", answer: 13, difficulty: 3, explanation: "-2(-3) + 7 = 6 + 7 = 13." },
          { id: "y7-neg30", prompt: "-15 + 4 × (-3) - (-6) = ?", answer: -21, difficulty: 3, explanation: "4 × (-3) = -12. Then -15 + (-12) = -27, and -27 - (-6) = -21." },
        ] },
      { id: "y7-geometry", name: "Geometry", icon: "📐",
        blurb: "Classifying angles, measuring degrees, and 2D shapes.",
        recap: "Classifying angles, measuring degrees, and identifying 2D shapes.",
        example: "Finding the angle of a skateboard ramp tilt.",
        interactive: "triangle-angles",
        diagram: `<svg width="180" height="100" viewBox="0 0 180 100">
          <line x1="20" y1="80" x2="160" y2="80" stroke="#16233D" stroke-width="2"/>
          <line x1="20" y1="80" x2="100" y2="20" stroke="#2F6F76" stroke-width="2"/>
          <path d="M 45 80 A 25 25 0 0 0 58 55" fill="none" stroke="#E3963E" stroke-width="2"/>
          <text x="65" y="60" font-family="sans-serif" font-size="12" font-weight="bold" fill="#E3963E">35°</text>
        </svg>`,
        questions: [
          { id: "y7-g1", prompt: "Complementary angles add to 90°. If one is 35°, what is the other in degrees?", answer: 55, difficulty: 1, explanation: "90 - 35 = 55°." },
          { id: "y7-g2", prompt: "Supplementary angles add to 180°. If one is 112°, what is the other in degrees?", answer: 68, difficulty: 2, explanation: "180 - 112 = 68°." },
          { id: "y7-g3", prompt: "A triangle has angles 45° and 75°. What is the third angle in degrees?", answer: 60, difficulty: 3, explanation: "180 - (45 + 75) = 180 - 120 = 60°." },
          { id: "y7-g4", prompt: "What is the sum of interior angles in a quadrilateral in degrees?", answer: 360, difficulty: 1, explanation: "Quadrilaterals split into 2 triangles: 2 × 180° = 360°." },
          { id: "y7-g5", prompt: "An equilateral triangle has one angle measuring x°. What is x?", answer: 60, difficulty: 2, explanation: "All 3 angles are equal: 180° ÷ 3 = 60°." },
          { id: "y7-g6", prompt: "How many degrees are in a right angle?", answer: 90, difficulty: 1, explanation: "A right angle is exactly 90°." },
          { id: "y7-g7", prompt: "How many degrees are in a straight angle?", answer: 180, difficulty: 1, explanation: "A straight angle forms a straight line, which is 180°." },
          { id: "y7-g8", prompt: "How many degrees are in a full rotation (a full circle)?", answer: 360, difficulty: 1, explanation: "A full rotation is 360°." },
          { id: "y7-g9", prompt: "A triangle has angles 50° and 60°. What is the third angle in degrees?", answer: 70, difficulty: 1, explanation: "180 - (50 + 60) = 70°." },
          { id: "y7-g10", prompt: "How many sides does a pentagon have?", answer: 5, difficulty: 1, explanation: "'Penta' means five — a pentagon has 5 sides." },
          { id: "y7-g11", prompt: "How many sides does a hexagon have?", answer: 6, difficulty: 1, explanation: "'Hex' means six — a hexagon has 6 sides." },
          { id: "y7-g12", prompt: "An isosceles triangle has two equal angles of 50° each. What is the third angle in degrees?", answer: 80, difficulty: 1, explanation: "180 - (50 + 50) = 80°." },
          { id: "y7-g13", prompt: "How many vertices (corners) does a triangle have?", answer: 3, difficulty: 1, explanation: "A triangle has 3 vertices." },
          { id: "y7-g14", prompt: "Vertically opposite angles are always equal. Enter 1 for true, 0 for false.", answer: 1, difficulty: 2, explanation: "Vertically opposite angles, formed where two lines cross, are always equal." },
          { id: "y7-g15", prompt: "Two adjacent angles on a straight line are 72° and x°. What is x?", answer: 108, difficulty: 2, explanation: "Angles on a straight line sum to 180°: 180 - 72 = 108°." },
          { id: "y7-g16", prompt: "A quadrilateral has angles 90°, 85°, and 95°. What is the fourth angle in degrees?", answer: 90, difficulty: 2, explanation: "360 - (90 + 85 + 95) = 360 - 270 = 90°." },
          { id: "y7-g17", prompt: "When a transversal crosses two parallel lines, corresponding angles are always equal. Enter 1 for true, 0 for false.", answer: 1, difficulty: 2, explanation: "Corresponding angles formed by a transversal crossing parallel lines are always equal." },
          { id: "y7-g18", prompt: "Co-interior angles between two parallel lines add to how many degrees?", answer: 180, difficulty: 2, explanation: "Co-interior angles are supplementary, summing to 180°." },
          { id: "y7-g19", prompt: "How many lines of symmetry does a square have?", answer: 4, difficulty: 2, explanation: "A square has 4 lines of symmetry — 2 through opposite sides, 2 through opposite corners." },
          { id: "y7-g20", prompt: "How many lines of symmetry does an equilateral triangle have?", answer: 3, difficulty: 2, explanation: "An equilateral triangle has 3 lines of symmetry, one through each vertex." },
          { id: "y7-g21", prompt: "Alternate angles between two parallel lines are always equal. Enter 1 for true, 0 for false.", answer: 1, difficulty: 2, explanation: "Alternate angles formed by a transversal crossing parallel lines are always equal." },
          { id: "y7-g22", prompt: "A triangle has angles in the ratio 2:3:4. What is the largest angle in degrees?", answer: 80, difficulty: 3, explanation: "The ratio has 9 parts, and 180° ÷ 9 = 20° per part. The largest angle is 4 × 20° = 80°." },
          { id: "y7-g23", prompt: "Two parallel lines are cut by a transversal. One co-interior angle is 65°. What is the other, in degrees?", answer: 115, difficulty: 3, explanation: "Co-interior angles are supplementary: 180 - 65 = 115°." },
          { id: "y7-g24", prompt: "A regular hexagon's interior angles sum to how many degrees? (Use (n-2) × 180° with n = 6)", answer: 720, difficulty: 3, explanation: "(6 - 2) × 180° = 4 × 180° = 720°." },
          { id: "y7-g25", prompt: "A regular pentagon's interior angles sum to how many degrees? (Use (n-2) × 180° with n = 5)", answer: 540, difficulty: 3, explanation: "(5 - 2) × 180° = 3 × 180° = 540°." },
          { id: "y7-g26", prompt: "A triangle's exterior angle equals the sum of the two non-adjacent interior angles. If those are 40° and 65°, what is the exterior angle in degrees?", answer: 105, difficulty: 3, explanation: "40° + 65° = 105°." },
          { id: "y7-g27", prompt: "A parallelogram has one angle of 110°. What is its adjacent angle, in degrees? (Adjacent angles in a parallelogram are supplementary.)", answer: 70, difficulty: 3, explanation: "180 - 110 = 70°." },
          { id: "y7-g28", prompt: "A triangle has one angle of 90° and another of 35°. What is the third angle, in degrees?", answer: 55, difficulty: 3, explanation: "180 - (90 + 35) = 55°." },
          { id: "y7-g29", prompt: "How many diagonals does a hexagon have? (Use n(n-3)/2 with n = 6)", answer: 9, difficulty: 3, explanation: "6 × (6 - 3) ÷ 2 = 6 × 3 ÷ 2 = 9 diagonals." },
          { id: "y7-g30", prompt: "A shape is rotated 270° clockwise about a point. How many more degrees would it need to rotate to complete a full 360° turn?", answer: 90, difficulty: 3, explanation: "360° - 270° = 90°." },
        ] },
      { id: "y7-statsprob", name: "Statistics and Probability", icon: "📊",
        blurb: "Collecting data, measures of centre, and simple probability.",
        recap: "Collecting and summarising data, and describing the chance of an event occurring.",
        example: "Working out the average score of your last five test results.",
        interactive: "spinner",
        diagram: `<svg width="160" height="90" viewBox="0 0 160 90">
          <line x1="20" y1="80" x2="150" y2="80" stroke="#16233D" stroke-width="1"/>
          <rect x="30" y="50" width="20" height="30" fill="#2F6F76"/>
          <rect x="65" y="30" width="20" height="50" fill="#E3963E"/>
          <rect x="100" y="60" width="20" height="20" fill="#2F6F76"/>
        </svg>`,
        questions: [
          { id: "y7-s1", prompt: "What is the mean of 4, 8, 6, 10, 2?", answer: 6, difficulty: 1, explanation: "Sum = 4+8+6+10+2 = 30. Divide by 5: 30 ÷ 5 = 6." },
          { id: "y7-s2", prompt: "What is the median of 7, 2, 9, 4, 5?", answer: 5, difficulty: 2, explanation: "Ordered: 2, 4, 5, 7, 9 — the middle value is 5." },
          { id: "y7-s3", prompt: "A bag has 3 red and 7 blue marbles. What is the probability of picking blue, as a percent?", answer: 70, difficulty: 3, explanation: "7 out of 10 marbles are blue: 7/10 = 70%." },
          { id: "y7-s4", prompt: "What is the range of 12, 5, 18, 9?", answer: 13, difficulty: 1, explanation: "Range = highest - lowest = 18 - 5 = 13." },
          { id: "y7-s5", prompt: "A die is rolled once. What is the probability of rolling an even number, as a percent?", answer: 50, difficulty: 2, explanation: "Even numbers are 2, 4, 6 — 3 out of 6 outcomes: 3/6 = 50%." },
          { id: "y7-s6", prompt: "What is the mode of 3, 5, 5, 7, 9?", answer: 5, difficulty: 1, explanation: "5 appears most often, so it is the mode." },
          { id: "y7-s7", prompt: "What is the mean of 10, 20, 30?", answer: 20, difficulty: 1, explanation: "Sum = 10+20+30 = 60. Divide by 3: 60 ÷ 3 = 20." },
          { id: "y7-s8", prompt: "A coin is flipped once. What is the probability of getting heads, as a percent?", answer: 50, difficulty: 1, explanation: "There are 2 equally likely outcomes, so heads has a 1/2 = 50% chance." },
          { id: "y7-s9", prompt: "What is the range of 4, 15, 8, 20, 6?", answer: 16, difficulty: 1, explanation: "Range = highest - lowest = 20 - 4 = 16." },
          { id: "y7-s10", prompt: "What is the median of 1, 3, 5, 7, 9?", answer: 5, difficulty: 1, explanation: "The numbers are already ordered — the middle value is 5." },
          { id: "y7-s11", prompt: "A die is rolled once. How many possible outcomes are there?", answer: 6, difficulty: 1, explanation: "A standard die has 6 faces, so there are 6 possible outcomes." },
          { id: "y7-s12", prompt: "What is the mode of 2, 2, 4, 6, 6, 6?", answer: 6, difficulty: 1, explanation: "6 appears three times, more than any other value, so it is the mode." },
          { id: "y7-s13", prompt: "What is the mean of 5, 5, 5, 5?", answer: 5, difficulty: 1, explanation: "All values are the same, so the mean is also 5." },
          { id: "y7-s14", prompt: "What is the mean of 6, 9, 12, 15, 18?", answer: 12, difficulty: 2, explanation: "Sum = 6+9+12+15+18 = 60. Divide by 5: 60 ÷ 5 = 12." },
          { id: "y7-s15", prompt: "A bag has 4 green and 6 yellow counters. What is the probability of picking green, as a percent?", answer: 40, difficulty: 2, explanation: "4 out of 10 counters are green: 4/10 = 40%." },
          { id: "y7-s16", prompt: "What is the median of 8, 3, 12, 3, 20, 15? (Order the numbers first — with an even count, average the two middle values.)", answer: 10, difficulty: 2, explanation: "Ordered: 3, 3, 8, 12, 15, 20. The two middle values are 8 and 12, averaging to 10." },
          { id: "y7-s17", prompt: "A spinner has 5 equal sections numbered 1 to 5. What is the probability of landing on an odd number, as a percent?", answer: 60, difficulty: 2, explanation: "The odd numbers are 1, 3, 5 — 3 out of 5 sections: 3/5 = 60%." },
          { id: "y7-s18", prompt: "What is the range of 100, 85, 120, 95, 110?", answer: 35, difficulty: 2, explanation: "Range = highest - lowest = 120 - 85 = 35." },
          { id: "y7-s19", prompt: "What is the mode of 7, 8, 8, 9, 9, 9, 10?", answer: 9, difficulty: 2, explanation: "9 appears three times, more than any other value, so it is the mode." },
          { id: "y7-s20", prompt: "A survey of 50 students found 20 prefer maths. What percentage prefer maths?", answer: 40, difficulty: 2, explanation: "20 ÷ 50 = 0.4, which is 40%." },
          { id: "y7-s21", prompt: "What is the mean of 2, 4, 6, 8, 10, 12?", answer: 7, difficulty: 2, explanation: "Sum = 2+4+6+8+10+12 = 42. Divide by 6: 42 ÷ 6 = 7." },
          { id: "y7-s22", prompt: "A dot plot shows these values: 2, 2, 3, 4, 4, 4, 5, 6. What is the mode?", answer: 4, difficulty: 3, explanation: "4 appears three times, more than any other value, so it is the mode." },
          { id: "y7-s23", prompt: "A bag has 5 red, 3 blue, and 2 green marbles. What is the probability of NOT picking red, as a percent?", answer: 50, difficulty: 3, explanation: "Blue and green together make 3 + 2 = 5 out of 10 marbles: 5/10 = 50%." },
          { id: "y7-s24", prompt: "In an experiment, a die was rolled 40 times and landed on 6 a total of 8 times. What is the experimental probability of rolling a 6, as a percent?", answer: 20, difficulty: 3, explanation: "8 ÷ 40 = 0.2, which is 20%." },
          { id: "y7-s25", prompt: "What is the mean of 15, 22, 18, 25, 20?", answer: 20, difficulty: 3, explanation: "Sum = 15+22+18+25+20 = 100. Divide by 5: 100 ÷ 5 = 20." },
          { id: "y7-s26", prompt: "A data set has a mean of 8 and consists of 5 numbers. What is the sum of the numbers?", answer: 40, difficulty: 3, explanation: "Sum = mean × count = 8 × 5 = 40." },
          { id: "y7-s27", prompt: "What is the median of 45, 12, 78, 33, 60, 21? (Order the numbers first — with an even count, average the two middle values.)", answer: 39, difficulty: 3, explanation: "Ordered: 12, 21, 33, 45, 60, 78. The two middle values are 33 and 45, averaging to 39." },
          { id: "y7-s28", prompt: "Two dice are rolled together. What is the total number of possible outcomes?", answer: 36, difficulty: 3, explanation: "Each die has 6 outcomes, so together there are 6 × 6 = 36 possible outcomes." },
          { id: "y7-s29", prompt: "A spinner has 8 equal sections numbered 1 to 8. What is the probability of landing on a multiple of 3, as a percent?", answer: 25, difficulty: 3, explanation: "The multiples of 3 from 1-8 are 3 and 6 — 2 out of 8 sections: 2/8 = 25%." },
          { id: "y7-s30", prompt: "In an experiment, a coin was flipped 60 times and landed on tails 27 times. What is the experimental probability of tails, as a percent?", answer: 45, difficulty: 3, explanation: "27 ÷ 60 = 0.45, which is 45%." },
        ] },
      { id: "y7-equations", name: "Equations", icon: "⚖️",
        blurb: "Solving linear equations using inverse operations.",
        recap: "Solving linear equations by using inverse operations to isolate the unknown.",
        example: "Working out how many weeks of saving it will take to afford a new bike.",
        interactive: "balance-equation",
        diagram: `<svg width="200" height="100" viewBox="0 0 200 100">
          <line x1="100" y1="20" x2="100" y2="50" stroke="#16233D" stroke-width="3"/>
          <line x1="30" y1="50" x2="170" y2="50" stroke="#16233D" stroke-width="3"/>
          <line x1="30" y1="50" x2="30" y2="70" stroke="#5A6B72" stroke-width="2"/>
          <line x1="170" y1="50" x2="170" y2="70" stroke="#5A6B72" stroke-width="2"/>
          <rect x="10" y="70" width="40" height="15" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <text x="30" y="82" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#16233D">2x</text>
          <rect x="150" y="70" width="40" height="15" fill="#E3963E" opacity="0.2" stroke="#E3963E" stroke-width="2"/>
          <text x="170" y="82" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#E3963E">14</text>
        </svg>`,
        questions: [
          { id: "y7-e1", prompt: "Solve for x: x + 9 = 15", answer: 6, difficulty: 1, explanation: "Subtract 9 from both sides: x = 6." },
          { id: "y7-e2", prompt: "Solve for x: 3x - 4 = 20", answer: 8, difficulty: 2, explanation: "Add 4: 3x = 24. Divide by 3: x = 8." },
          { id: "y7-e3", prompt: "Solve for x: 2(x - 5) = 18", answer: 14, difficulty: 3, explanation: "Divide by 2: x - 5 = 9. Add 5: x = 14." },
          { id: "y7-e4", prompt: "Solve for x: x / 4 = 7", answer: 28, difficulty: 1, explanation: "Multiply both sides by 4: x = 28." },
          { id: "y7-e5", prompt: "Solve for x: 5x + 6 = 41", answer: 7, difficulty: 2, explanation: "Subtract 6: 5x = 35. Divide by 5: x = 7." },
          { id: "y7-e6", prompt: "Solve for x: x - 5 = 12", answer: 17, difficulty: 1, explanation: "Add 5 to both sides: x = 17." },
          { id: "y7-e7", prompt: "Solve for x: 2x = 18", answer: 9, difficulty: 1, explanation: "Divide both sides by 2: x = 9." },
          { id: "y7-e8", prompt: "Solve for x by inspection: x + 7 = 20", answer: 13, difficulty: 1, explanation: "Subtract 7 from both sides: x = 13." },
          { id: "y7-e9", prompt: "Solve for x: x / 3 = 6", answer: 18, difficulty: 1, explanation: "Multiply both sides by 3: x = 18." },
          { id: "y7-e10", prompt: "Solve for x: 4x = 32", answer: 8, difficulty: 1, explanation: "Divide both sides by 4: x = 8." },
          { id: "y7-e11", prompt: "Are the equations x + 3 = 8 and x = 5 equivalent? Enter 1 for yes, 0 for no.", answer: 1, difficulty: 1, explanation: "Solving x + 3 = 8 gives x = 5, so the two equations are equivalent." },
          { id: "y7-e12", prompt: "Solve for x: x - 10 = 0", answer: 10, difficulty: 1, explanation: "Add 10 to both sides: x = 10." },
          { id: "y7-e13", prompt: "Solve for x: 6 + x = 14", answer: 8, difficulty: 1, explanation: "Subtract 6 from both sides: x = 8." },
          { id: "y7-e14", prompt: "Solve for x: 4x - 7 = 21", answer: 7, difficulty: 2, explanation: "Add 7: 4x = 28. Divide by 4: x = 7." },
          { id: "y7-e15", prompt: "Solve for x: x/5 + 2 = 9", answer: 35, difficulty: 2, explanation: "Subtract 2: x/5 = 7. Multiply by 5: x = 35." },
          { id: "y7-e16", prompt: "Solve for x: 2x + 9 = 3x - 4", answer: 13, difficulty: 2, explanation: "Rearranging: 9 + 4 = 3x - 2x, so x = 13." },
          { id: "y7-e17", prompt: "Solve for x: 7x + 3 = 4x + 18", answer: 5, difficulty: 2, explanation: "Rearranging: 7x - 4x = 18 - 3, so 3x = 15, giving x = 5." },
          { id: "y7-e18", prompt: "The formula for the perimeter of a square is P = 4s. If P = 36, what is s?", answer: 9, difficulty: 2, explanation: "36 = 4s, so s = 36 ÷ 4 = 9." },
          { id: "y7-e19", prompt: "Solve for x: 3x/4 = 9", answer: 12, difficulty: 2, explanation: "Multiply by 4: 3x = 36. Divide by 3: x = 12." },
          { id: "y7-e20", prompt: "Are 5(x + 2) and 5x + 10 equivalent expressions for all values of x? Enter 1 for yes, 0 for no.", answer: 1, difficulty: 2, explanation: "Expanding 5(x + 2) gives 5x + 10, so the expressions are equivalent for every x." },
          { id: "y7-e21", prompt: "Solve for x: 9 - x = 4", answer: 5, difficulty: 2, explanation: "Rearranging: x = 9 - 4 = 5." },
          { id: "y7-e22", prompt: "Solve for x: 3(x + 4) = 2(x + 10)", answer: 8, difficulty: 3, explanation: "Expand: 3x + 12 = 2x + 20. Rearranging gives x = 8." },
          { id: "y7-e23", prompt: "Solve for x: (x + 5)/3 = 4", answer: 7, difficulty: 3, explanation: "Multiply by 3: x + 5 = 12. Subtract 5: x = 7." },
          { id: "y7-e24", prompt: "Solve for x: 2(x - 3) + 5 = 15", answer: 8, difficulty: 3, explanation: "Expand: 2x - 6 + 5 = 15, so 2x - 1 = 15. Then 2x = 16, giving x = 8." },
          { id: "y7-e25", prompt: "The formula for the area of a triangle is A = (1/2)bh. If A = 24 and b = 8, what is h?", answer: 6, difficulty: 3, explanation: "24 = (1/2)(8)h = 4h, so h = 24 ÷ 4 = 6." },
          { id: "y7-e26", prompt: "Solve for x: 5x - 3 = 2x + 12", answer: 5, difficulty: 3, explanation: "Rearranging: 5x - 2x = 12 + 3, so 3x = 15, giving x = 5." },
          { id: "y7-e27", prompt: "Solve for x: x/2 + x/4 = 9", answer: 12, difficulty: 3, explanation: "Combine over a common denominator: 2x/4 + x/4 = 3x/4 = 9. So 3x = 36, giving x = 12." },
          { id: "y7-e28", prompt: "The formula for converting Celsius to Fahrenheit is F = 1.8C + 32. What is F when C = 10?", answer: 50, difficulty: 3, explanation: "F = 1.8(10) + 32 = 18 + 32 = 50." },
          { id: "y7-e29", prompt: "Solve for x: 4(x - 1) = 3(x + 2)", answer: 10, difficulty: 3, explanation: "Expand: 4x - 4 = 3x + 6. Rearranging gives x = 10." },
          { id: "y7-e30", prompt: "A number, when doubled and then increased by 7, equals 31. What is the number?", answer: 12, difficulty: 3, explanation: "2n + 7 = 31, so 2n = 24, giving n = 12." },
        ] },
      { id: "y7-measurement", name: "Measurement", icon: "📏",
        blurb: "Length, perimeter, area, and volume.",
        recap: "Calculating length, perimeter, area, and volume using standard formulas and units.",
        example: "Working out how much paint is needed to cover a wall.",
        interactive: "rectangle-measure",
        diagram: `<svg width="180" height="100" viewBox="0 0 180 100">
          <rect x="30" y="20" width="100" height="50" fill="#F6F3EA" stroke="#2F6F76" stroke-width="2"/>
          <text x="80" y="15" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#5A6B72">length</text>
          <text x="145" y="48" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#5A6B72">width</text>
        </svg>`,
        questions: [
          { id: "y7-m1", prompt: "A rectangle is 9cm by 5cm. What is its perimeter, in cm?", answer: 28, difficulty: 1, explanation: "Perimeter = 2 × (length + width) = 2 × (9 + 5) = 28cm." },
          { id: "y7-m2", prompt: "A rectangle is 7cm by 6cm. What is its area, in cm²?", answer: 42, difficulty: 2, explanation: "Area = length × width = 7 × 6 = 42cm²." },
          { id: "y7-m3", prompt: "A rectangular prism is 4cm × 3cm × 5cm. What is its volume, in cm³?", answer: 60, difficulty: 3, explanation: "Volume = length × width × height = 4 × 3 × 5 = 60cm³." },
          { id: "y7-m4", prompt: "Convert 3.5 metres to centimetres.", answer: 350, difficulty: 1, explanation: "1 metre = 100cm, so 3.5m = 350cm." },
          { id: "y7-m5", prompt: "A triangle has base 8cm and height 5cm. What is its area, in cm²?", answer: 20, difficulty: 2, explanation: "Area of a triangle = 0.5 × base × height = 0.5 × 8 × 5 = 20cm²." },
          { id: "y7-m6", prompt: "Convert 2.5 kilometres to metres.", answer: 2500, difficulty: 1, explanation: "1 kilometre = 1000m, so 2.5km = 2500m." },
          { id: "y7-m7", prompt: "A square has side length 6cm. What is its perimeter, in cm?", answer: 24, difficulty: 1, explanation: "Perimeter = 4 × side = 4 × 6 = 24cm." },
          { id: "y7-m8", prompt: "Convert 450 centimetres to metres.", answer: 4.5, difficulty: 1, explanation: "1 metre = 100cm, so 450cm = 4.5m." },
          { id: "y7-m9", prompt: "A rectangle is 10cm by 4cm. What is its area, in cm²?", answer: 40, difficulty: 1, explanation: "Area = length × width = 10 × 4 = 40cm²." },
          { id: "y7-m10", prompt: "Convert 3 metres to millimetres.", answer: 3000, difficulty: 1, explanation: "1 metre = 1000mm, so 3m = 3000mm." },
          { id: "y7-m11", prompt: "A square has side length 5cm. What is its area, in cm²?", answer: 25, difficulty: 1, explanation: "Area = side × side = 5 × 5 = 25cm²." },
          { id: "y7-m12", prompt: "Convert 1200 grams to kilograms.", answer: 1.2, difficulty: 1, explanation: "1 kilogram = 1000g, so 1200g = 1.2kg." },
          { id: "y7-m13", prompt: "What is the boiling point of water, in degrees Celsius?", answer: 100, difficulty: 1, explanation: "Water boils at 100°C at standard atmospheric pressure." },
          { id: "y7-m14", prompt: "A parallelogram has base 12cm and height 5cm. What is its area, in cm²?", answer: 60, difficulty: 2, explanation: "Area of a parallelogram = base × height = 12 × 5 = 60cm²." },
          { id: "y7-m15", prompt: "A circle has diameter 14cm. Using π ≈ 22/7, what is its circumference, in cm?", answer: 44, difficulty: 2, explanation: "Circumference = π × diameter = (22/7) × 14 = 44cm." },
          { id: "y7-m16", prompt: "A rectangular prism is 6cm × 2cm × 3cm. What is its volume, in cm³?", answer: 36, difficulty: 2, explanation: "Volume = 6 × 2 × 3 = 36cm³." },
          { id: "y7-m17", prompt: "A composite shape is made of a 5cm × 4cm rectangle joined to a 5cm × 2cm rectangle. What is the total area, in cm²?", answer: 30, difficulty: 2, explanation: "5×4 = 20cm² and 5×2 = 10cm². Total = 20 + 10 = 30cm²." },
          { id: "y7-m18", prompt: "Convert 2.5 litres to millilitres.", answer: 2500, difficulty: 2, explanation: "1 litre = 1000mL, so 2.5L = 2500mL." },
          { id: "y7-m19", prompt: "A triangular prism has a triangular base area of 12cm² and a length of 6cm. What is its volume, in cm³?", answer: 72, difficulty: 2, explanation: "Volume = base area × length = 12 × 6 = 72cm³." },
          { id: "y7-m20", prompt: "What is the freezing point of water, in degrees Celsius?", answer: 0, difficulty: 2, explanation: "Water freezes at 0°C at standard atmospheric pressure." },
          { id: "y7-m21", prompt: "A rectangle has a perimeter of 30cm and a width of 5cm. What is its length, in cm?", answer: 10, difficulty: 2, explanation: "30 = 2(length + 5), so length + 5 = 15, giving length = 10cm." },
          { id: "y7-m22", prompt: "A circle has radius 7cm. Using π ≈ 22/7, what is its circumference, in cm?", answer: 44, difficulty: 3, explanation: "Circumference = 2πr = 2 × (22/7) × 7 = 44cm." },
          { id: "y7-m23", prompt: "A sector has a central angle of 90° in a circle of radius 8cm. Using π ≈ 3.14, what is the arc length in cm, to 1 decimal place?", answer: 12.6, tolerance: 0.1, difficulty: 3, explanation: "Arc length = (90/360) × 2πr = 0.25 × 2 × 3.14 × 8 = 0.25 × 50.24 ≈ 12.6cm." },
          { id: "y7-m24", prompt: "A composite shape is a rectangle (8cm × 5cm) with a triangle (base 8cm, height 4cm) on top. What is the total area, in cm²?", answer: 56, difficulty: 3, explanation: "Rectangle area = 8×5 = 40cm². Triangle area = 0.5×8×4 = 16cm². Total = 40 + 16 = 56cm²." },
          { id: "y7-m25", prompt: "A rectangular prism has volume 120cm³, length 6cm, and width 4cm. What is its height, in cm?", answer: 5, difficulty: 3, explanation: "Height = volume ÷ (length × width) = 120 ÷ 24 = 5cm." },
          { id: "y7-m26", prompt: "A triangular prism has a triangular cross-section with base 6cm and height 4cm, and a length of 10cm. What is its volume, in cm³?", answer: 120, difficulty: 3, explanation: "Triangle area = 0.5×6×4 = 12cm². Volume = 12 × 10 = 120cm³." },
          { id: "y7-m27", prompt: "A tank has a capacity of 5 litres. How many millilitres is this?", answer: 5000, difficulty: 3, explanation: "1 litre = 1000mL, so 5L = 5000mL." },
          { id: "y7-m28", prompt: "Water freezes at 0°C and boils at 100°C. What is the temperature difference, in degrees Celsius?", answer: 100, difficulty: 3, explanation: "100 - 0 = 100°C difference." },
          { id: "y7-m29", prompt: "A circle has diameter 20cm. Using π ≈ 3.14, what is its area, in cm² (radius = diameter ÷ 2)?", answer: 314, difficulty: 3, explanation: "Radius = 10cm. Area = πr² = 3.14 × 100 = 314cm²." },
          { id: "y7-m30", prompt: "A parallelogram has an area of 84cm² and a base of 12cm. What is its height, in cm?", answer: 7, difficulty: 3, explanation: "Height = area ÷ base = 84 ÷ 12 = 7cm." },
        ] },
    ] },
];
function yearMultiplier(yearId) {
  const idx = YEAR_LEVELS.findIndex((y) => y.id === yearId);
  return idx === -1 ? 1 : 1 + idx * 0.1;
}

const ENGLISH_TOPICS = [
  { id: "eng-creative", name: "Creative Writing", icon: "✍️",
    blurb: "Pick a prompt and write freely against a timer.",
    recap: "Practising imaginative writing — building a story or description from a starting idea, without a right or wrong answer.",
    example: "Writing a short story inspired by a photo, a 'what if' question, or a strange scenario.",
    special: "creative-writing",
    diagram: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="160" fill="#F6F3EA"/>
      <rect x="90" y="40" width="120" height="90" rx="4" fill="#fff" stroke="#16233D" stroke-width="2"/>
      <line x1="105" y1="60" x2="195" y2="60" stroke="#5A6B72" stroke-width="2"/>
      <line x1="105" y1="78" x2="195" y2="78" stroke="#5A6B72" stroke-width="2"/>
      <line x1="105" y1="96" x2="170" y2="96" stroke="#5A6B72" stroke-width="2"/>
      <text x="150" y="30" font-size="22" text-anchor="middle">✏️</text>
    </svg>`,
    prompts: [
      "Write about a door that appears in your bedroom wall one morning — where does it lead?",
      "You wake up and everyone in the world has swapped voices with someone else. Describe your day.",
      "A stray animal follows you home and turns out to understand everything you say. What happens next?",
      "Write about the last day before your town disappears completely — from anyone's memory, including yours.",
      "You find an old photograph of yourself in a place you've never been. Tell the story behind it.",
      "You discover you can hear one specific object's thoughts — a vending machine, a traffic light, anything. What does it have to say?",
      "Write about the day gravity stopped working properly for exactly one hour.",
      "A letter arrives addressed to you, but it's dated fifty years in the future. What does it say?",
      "You're the last person awake in the entire world for one night. Describe what you do.",
      "Write a story that starts with the line: 'The elevator doors opened onto somewhere they shouldn't.'",
      "Your shadow starts acting independently of you. Write about what happens.",
      "You wake up with a skill you've never had before — but no memory of how you got it.",
      "Write about a market that only opens at midnight and only sells things that don't exist anywhere else.",
      "You find a key that doesn't match any lock you own. Write about where it leads.",
      "Describe a world where colours make sounds and sounds make colours — from the perspective of someone visiting for the first time.",
    ] },
  { id: "eng-essay", name: "Essay Writing", icon: "📝",
    blurb: "Pick a prompt and write a structured essay against a timer.",
    recap: "Practising persuasive and discursive essay writing — building a clear argument with an introduction, body paragraphs, and a conclusion.",
    example: "Writing a persuasive essay arguing whether mobile phones should be allowed in school.",
    special: "essay-writing",
    diagram: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="160" fill="#F6F3EA"/>
      <rect x="80" y="30" width="140" height="100" rx="4" fill="#fff" stroke="#16233D" stroke-width="2"/>
      <line x1="95" y1="48" x2="205" y2="48" stroke="#2F6F76" stroke-width="3"/>
      <line x1="95" y1="66" x2="205" y2="66" stroke="#5A6B72" stroke-width="2"/>
      <line x1="95" y1="80" x2="205" y2="80" stroke="#5A6B72" stroke-width="2"/>
      <line x1="95" y1="94" x2="205" y2="94" stroke="#5A6B72" stroke-width="2"/>
      <line x1="95" y1="108" x2="170" y2="108" stroke="#5A6B72" stroke-width="2"/>
    </svg>`,
    prompts: [
      "Should students be allowed to use mobile phones during school hours? Write a persuasive essay arguing your position.",
      "Is it better to grow up in a city or in the countryside? Write an essay comparing both and give your opinion.",
      "Should homework be banned in schools? Write a persuasive essay arguing your case.",
      "Are video games good or bad for young people? Write a balanced essay discussing both sides before giving your view.",
      "Should school uniforms be compulsory? Write a persuasive essay either for or against.",
      "Is social media doing more harm than good for teenagers? Write a discursive essay exploring both sides.",
      "Should students be allowed to choose all of their own school subjects? Write an essay explaining your view.",
      "Are zoos ethical, or should all animals live in the wild? Write an essay exploring both sides and state your opinion.",
      "Should the school day start later in the morning? Write a persuasive essay arguing your case.",
      "Is it more important to be naturally talented or to work hard? Write an essay discussing both and give your opinion.",
      "Should junk food be banned from being sold near schools? Write a persuasive essay arguing your position.",
      "Should students have to wear a school uniform, or should they be free to choose what they wear? Write a balanced essay.",
    ] },
  { id: "eng-punctuation", name: "Punctuation", icon: "❗",
    blurb: "Correct use of full stops, question marks, commas, and apostrophes.",
    recap: "Understanding how punctuation marks like commas, apostrophes, and question marks change the meaning and clarity of a sentence.",
    example: "Deciding whether to write 'Let's eat, Grandma' or 'Let's eat Grandma' — punctuation can completely change what a sentence means!",
    workedExample: {
      1: { question: "Fix this sentence: 'wheres my backpack'", walkthrough: "This sentence is a question, so it needs a question mark at the end. It's also missing an apostrophe in 'wheres' (short for 'where is'). Corrected: 'Where's my backpack?'" },
      2: { question: "Insert the missing commas: 'I bought milk eggs and bread.'", walkthrough: "Commas separate items in a list. Place one after each item except the last, which uses 'and'. Corrected: 'I bought milk, eggs, and bread.'" },
      3: { question: "Fix the punctuation: 'The dog which was covered in mud ran through the house.'", walkthrough: "'Which was covered in mud' is extra, non-essential information — it needs a comma on both sides. Corrected: 'The dog, which was covered in mud, ran through the house.'" },
    },
    diagram: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="160" fill="#F6F3EA"/>
      <text x="60" y="105" font-size="70" font-weight="700" fill="#E3963E" text-anchor="middle">?</text>
      <text x="150" y="105" font-size="70" font-weight="700" fill="#2F6F76" text-anchor="middle">!</text>
      <text x="230" y="105" font-size="70" font-weight="700" fill="#16233D" text-anchor="middle">,</text>
    </svg>`,
    questions: [
      { id: "eng-p-e1", prompt: "Which punctuation mark should end the sentence: 'What time is it'? Enter the mark.", answer: "?", difficulty: 1, answerType: "text", explanation: "Questions end with a question mark." },
      { id: "eng-p-e2", prompt: "Which punctuation mark shows strong emotion or surprise, like 'Watch out'? Enter the mark.", answer: "!", difficulty: 1, answerType: "text", explanation: "An exclamation mark shows strong feeling or urgency." },
      { id: "eng-p-e3", prompt: "What mark is used to separate items in a list, like 'apples bananas and pears'? Enter the mark.", answer: ",", difficulty: 1, answerType: "text", explanation: "Commas separate items in a list." },
      { id: "eng-p-e4", prompt: "Every sentence should start with what type of letter? Enter 'capital' or 'lowercase'.", answer: "capital", difficulty: 1, answerType: "text", explanation: "Sentences always begin with a capital letter." },
      { id: "eng-p-e5", prompt: "Which mark shows where a sentence ends when it's just a normal statement, like 'The sky is blue'? Enter the mark.", answer: ".", difficulty: 1, answerType: "text", explanation: "A full stop ends a normal statement." },
      { id: "eng-p-m1", prompt: "'Its raining outside.' Which word needs an apostrophe? Enter the corrected word.", answer: ["it's", "its'"], difficulty: 2, answerType: "text", explanation: "'It's' is short for 'it is', so it needs an apostrophe." },
      { id: "eng-p-m2", prompt: "Insert a comma correctly: 'I like apples oranges and pears.' Enter the word that should come right before the first comma.", answer: "apples", difficulty: 2, answerType: "text", explanation: "'I like apples, oranges, and pears.' — the first comma goes after 'apples'." },
      { id: "eng-p-m3", prompt: "What is the possessive form of 'the ball belonging to the dog'? Enter it as two words (e.g. 'dog X').", answer: "dog's", difficulty: 2, answerType: "text", explanation: "Singular possession uses apostrophe + s: the dog's ball." },
      { id: "eng-p-m4", prompt: "If there are TWO dogs and they share one bone, how do you spell 'dogs' + possessive apostrophe? Enter the word.", answer: "dogs'", difficulty: 2, answerType: "text", explanation: "Plural possessive nouns ending in s just add an apostrophe after the s: dogs'." },
      { id: "eng-p-m5", prompt: "Which punctuation mark can join two related complete sentences, like 'I was tired I went to bed'? Enter the mark.", answer: ";", difficulty: 2, answerType: "text", explanation: "A semicolon can join two closely related independent clauses." },
      { id: "eng-p-h1", prompt: "Which is correctly punctuated: 'Lets eat Grandma' or 'Let's eat, Grandma'? Enter 'first' or 'second'.", answer: "second", difficulty: 3, answerType: "text", explanation: "'Let's eat, Grandma' uses the apostrophe and comma correctly — without them it sounds like eating Grandma!" },
      { id: "eng-p-h2", prompt: "'The teacher said that homework which was due today is cancelled.' A pair of commas is needed around the extra information. Enter the word right before where the first comma should go.", answer: "homework", difficulty: 3, answerType: "text", explanation: "'The teacher said that homework, which was due today, is cancelled.'" },
      { id: "eng-p-h3", prompt: "Which is correct: 'Whose coat is this?' or 'Who's coat is this?' Enter 'first' or 'second'.", answer: "first", difficulty: 3, answerType: "text", explanation: "'Whose' shows possession. 'Who's' means 'who is', which doesn't fit here." },
      { id: "eng-p-h4", prompt: "In dialogue: 'I am hungry' said Sam. Enter the word right before the missing comma.", answer: "hungry", difficulty: 3, answerType: "text", explanation: "\"I am hungry,\" said Sam. — a comma goes before the closing quotation mark." },
      { id: "eng-p-h5", prompt: "What is the name of the punctuation mark ' used to show a letter has been left out, as in 'don't'? Enter the word.", answer: "apostrophe", difficulty: 3, answerType: "text", explanation: "An apostrophe shows a missing letter in a contraction or shows possession." },
    ] },

  { id: "eng-spelling", name: "Spelling", icon: "🔤",
    blurb: "Correct spelling of common words, tricky homophones, and spelling patterns.",
    recap: "Understanding common spelling rules, patterns, and frequently confused words (homophones) to spell accurately.",
    example: "Knowing when to use 'their', 'there', or 'they're' in a sentence, or spelling tricky words like 'definitely' correctly.",
    workedExample: {
      1: { question: "Which is correct: 'The two dogs wagged there tails' or 'The two dogs wagged their tails'?", walkthrough: "'Their' shows possession (belonging to someone), 'there' refers to a place, and 'they're' means 'they are'. Since the tails belong to the dogs, 'their' is correct: 'The two dogs wagged their tails.'" },
      2: { question: "Which is correct: 'seperate' or 'separate'?", walkthrough: "This is a commonly misspelled word. A helpful trick: there's 'a rat' hidden inside sep-A-RAT-e. The correct spelling is 'separate'." },
      3: { question: "Which is correct: 'The weather will affect our plans' or 'The weather will effect our plans'?", walkthrough: "'Affect' is usually a verb meaning 'to influence'. 'Effect' is usually a noun meaning 'a result'. Since the weather is doing the influencing here, 'affect' is correct." },
    },
    diagram: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="160" fill="#F6F3EA"/>
      <rect x="60" y="55" width="40" height="50" rx="6" fill="#E3963E"/>
      <text x="80" y="90" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">A</text>
      <rect x="130" y="55" width="40" height="50" rx="6" fill="#2F6F76"/>
      <text x="150" y="90" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">B</text>
      <rect x="200" y="55" width="40" height="50" rx="6" fill="#16233D"/>
      <text x="220" y="90" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">C</text>
    </svg>`,
    questions: [
      { id: "eng-s-e1", prompt: "Spell the plural of 'cat' (more than one cat).", answer: "cats", difficulty: 1, answerType: "text", explanation: "Most plurals just add 's': cat → cats." },
      { id: "eng-s-e2", prompt: "Which is the correct spelling: 'recieve' or 'receive'? Enter the correct one.", answer: "receive", difficulty: 1, answerType: "text", explanation: "'i before e except after c' — receive follows the 'except after c' rule." },
      { id: "eng-s-e3", prompt: "Spell the past tense of 'run' (e.g. 'yesterday I ___').", answer: "ran", difficulty: 1, answerType: "text", explanation: "'Run' is an irregular verb — its past tense is 'ran', not 'runned'." },
      { id: "eng-s-e4", prompt: "Which is correct: 'freind' or 'friend'? Enter the correct spelling.", answer: "friend", difficulty: 1, answerType: "text", explanation: "'Friend' is an exception to the usual 'i before e' pattern." },
      { id: "eng-s-e5", prompt: "Spell the word meaning 'a place where you learn', starting with 's'.", answer: "school", difficulty: 1, answerType: "text", explanation: "S-C-H-O-O-L." },
      { id: "eng-s-m1", prompt: "Choose the correct word: 'I can't believe ___ going to the party.' Enter 'they're', 'their', or 'there' — whichever fits.", answer: "they're", difficulty: 2, answerType: "text", explanation: "'They're' is short for 'they are', which fits: 'I can't believe they are going.'" },
      { id: "eng-s-m2", prompt: "Which is correct: 'definately' or 'definitely'?", answer: "definitely", difficulty: 2, answerType: "text", explanation: "A commonly misspelled word — remember 'finite' is hidden inside 'defINITEly'." },
      { id: "eng-s-m3", prompt: "Spell the plural of 'child'.", answer: "children", difficulty: 2, answerType: "text", explanation: "'Child' has an irregular plural: children, not 'childs'." },
      { id: "eng-s-m4", prompt: "Choose the correct word: 'Please put the book over ___.' Enter 'their', 'there', or 'they're'.", answer: "there", difficulty: 2, answerType: "text", explanation: "'There' refers to a place, which fits here." },
      { id: "eng-s-m5", prompt: "Which is correct: 'seperate' or 'separate'?", answer: "separate", difficulty: 2, answerType: "text", explanation: "Remember: there's 'a rat' in sep-a-rate." },
      { id: "eng-s-h1", prompt: "Fill in the blank: 'The rain will ___ our plans for the picnic.' Enter 'affect' or 'effect'.", answer: "affect", difficulty: 3, answerType: "text", explanation: "'Affect' is usually the verb (to influence); 'effect' is usually the noun (a result)." },
      { id: "eng-s-h2", prompt: "Which is correct: 'accommodate' or 'acommodate'?", answer: "accommodate", difficulty: 3, answerType: "text", explanation: "'Accommodate' has two c's and two m's — a commonly misspelled word." },
      { id: "eng-s-h3", prompt: "Choose the correct word for: 'I wonder ___ going to win.' Enter 'who's' or 'whose'.", answer: "who's", difficulty: 3, answerType: "text", explanation: "'Who's' is short for 'who is', which fits: 'I wonder who is going to win.'" },
      { id: "eng-s-h4", prompt: "Spell the word meaning 'not able to be seen', starting with 'in'.", answer: "invisible", difficulty: 3, answerType: "text", explanation: "I-N-V-I-S-I-B-L-E." },
      { id: "eng-s-h5", prompt: "Which is correct: 'neccessary' or 'necessary'?", answer: "necessary", difficulty: 3, answerType: "text", explanation: "Remember: one collar (c), two sleeves (s) — one 'c', two 's's." },
    ] },

  { id: "eng-reading", name: "Reading Comprehension", icon: "📖",
    blurb: "Reading short passages and answering questions about details, main ideas, and inference.",
    recap: "Understanding written texts by identifying key details, the main idea, and making logical inferences from what is read.",
    example: "Reading a short story and figuring out how a character feels, even when it isn't directly stated.",
    workedExample: {
      1: { question: "Read: 'Ben opened his lunchbox and found his favourite sandwich.' What did Ben find in his lunchbox?", walkthrough: "The answer is stated directly in the passage — his favourite sandwich. Easy comprehension questions usually have the answer written plainly in the text." },
      2: { question: "Read: 'The classroom fell silent the moment the principal walked in.' What can you infer about the students?", walkthrough: "The passage doesn't say how the students felt directly, but sudden silence usually suggests surprise or nervousness. This requires connecting an action (falling silent) to a likely feeling." },
      3: { question: "Read: 'After running the marathon, Aisha collapsed onto the grass, smiling despite her exhaustion.' How did Aisha likely feel?", walkthrough: "The passage gives two clues: she was exhausted (tired), but also smiling. Combining both clues suggests she felt proud or accomplished, even though her body was worn out. Good comprehension answers combine multiple details from the text rather than relying on just one word." },
    },
    diagram: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="160" fill="#F6F3EA"/>
      <path d="M60 50 Q150 30 240 50 L240 120 Q150 100 60 120 Z" fill="#2F6F76"/>
      <line x1="150" y1="42" x2="150" y2="112" stroke="#F6F3EA" stroke-width="3"/>
      <line x1="75" y1="65" x2="130" y2="60" stroke="#F6F3EA" stroke-width="2"/>
      <line x1="75" y1="80" x2="130" y2="75" stroke="#F6F3EA" stroke-width="2"/>
      <line x1="170" y1="60" x2="225" y2="65" stroke="#F6F3EA" stroke-width="2"/>
      <line x1="170" y1="75" x2="225" y2="80" stroke="#F6F3EA" stroke-width="2"/>
    </svg>`,
    questions: [
      { id: "eng-r-e1a", prompt: "Read: 'Maya woke up early on Saturday morning because she was excited about the school fair. She packed her red backpack with a water bottle, a hat, and some coins for the game stalls. Her little brother Tom wanted to come too, so their mum agreed to take them both. When they arrived, the fair was already busy, with music playing and the smell of popcorn drifting through the air.'\n\nPart A: What colour was Maya's backpack? Enter the colour.", answer: "red", difficulty: 1, answerType: "text", explanation: "The passage directly states Maya's backpack was red." },
      { id: "eng-r-e1b", prompt: "Read: 'Maya woke up early on Saturday morning because she was excited about the school fair. She packed her red backpack with a water bottle, a hat, and some coins for the game stalls. Her little brother Tom wanted to come too, so their mum agreed to take them both. When they arrived, the fair was already busy, with music playing and the smell of popcorn drifting through the air.'\n\nPart B: Why was Maya excited on Saturday morning? Enter a short phrase.", answer: ["the school fair", "school fair", "because of the school fair"], difficulty: 1, answerType: "text", explanation: "The passage states she was excited about the school fair." },
      { id: "eng-r-e2a", prompt: "Read: 'Every morning before school, Tom fed his dog Rex and filled his water bowl. Rex would wag his tail happily and follow Tom around the kitchen until breakfast was ready. On the walk to the bus stop, Rex always sat by the front gate and watched until Tom disappeared around the corner.'\n\nPart A: What was the name of Tom's dog? Enter the name.", answer: "Rex", difficulty: 1, answerType: "text", explanation: "The passage names the dog directly: Rex." },
      { id: "eng-r-e2b", prompt: "Read: 'Every morning before school, Tom fed his dog Rex and filled his water bowl. Rex would wag his tail happily and follow Tom around the kitchen until breakfast was ready. On the walk to the bus stop, Rex always sat by the front gate and watched until Tom disappeared around the corner.'\n\nPart B: Where did Rex sit and wait as Tom left for school? Enter the location.", answer: ["gate", "front gate", "the front gate", "the gate"], difficulty: 1, answerType: "text", explanation: "The passage says Rex sat by the front gate to watch Tom leave." },
      { id: "eng-r-e3a", prompt: "Read: 'The old library on Elm Street was usually silent, except for the steady ticking of a large clock on the wall. Sarah loved visiting after school because she could read undisturbed in the corner armchair. One afternoon, the librarian brought out a box of donated books, and Sarah spotted a mystery novel she had been wanting to read for months.'\n\nPart A: What object made a ticking sound in the library? Enter the object.", answer: "clock", difficulty: 1, answerType: "text", explanation: "The passage says the ticking sound came from a clock on the wall." },
      { id: "eng-r-e3b", prompt: "Read: 'The old library on Elm Street was usually silent, except for the steady ticking of a large clock on the wall. Sarah loved visiting after school because she could read undisturbed in the corner armchair. One afternoon, the librarian brought out a box of donated books, and Sarah spotted a mystery novel she had been wanting to read for months.'\n\nPart B: What kind of book had Sarah been wanting to read? Enter the genre.", answer: ["mystery", "mystery novel", "a mystery novel"], difficulty: 1, answerType: "text", explanation: "The passage states Sarah spotted a mystery novel she had wanted to read." },
      { id: "eng-r-m1a", prompt: "Read: 'Ella had studied every night for two weeks before her big science exam, filling notebook after notebook with diagrams and definitions. Her friends invited her to the movies the weekend before the test, but she decided to stay home and revise instead. On the morning of the exam, Ella walked into the classroom with a steady breath and a small smile, ready to show what she had learned.'\n\nPart A: How many weeks did Ella study before her exam? Enter the number.", answer: ["2", "two"], difficulty: 2, answerType: "text", explanation: "The passage states Ella studied every night for two weeks." },
      { id: "eng-r-m1b", prompt: "Read: 'Ella had studied every night for two weeks before her big science exam, filling notebook after notebook with diagrams and definitions. Her friends invited her to the movies the weekend before the test, but she decided to stay home and revise instead. On the morning of the exam, Ella walked into the classroom with a steady breath and a small smile, ready to show what she had learned.'\n\nPart B: What can you infer about how Ella felt walking into the exam? Enter one word.", answer: ["confident", "calm", "prepared", "ready"], difficulty: 2, answerType: "text", explanation: "A steady breath and a small smile after two weeks of study suggest she felt confident and prepared." },
      { id: "eng-r-m2a", prompt: "Read: 'Before setting off into the mountains, the hikers carefully packed extra water bottles, a detailed map, a compass, and a well-stocked first aid kit. They checked the weather forecast twice and told a park ranger exactly which trail they planned to take. Even so, dark clouds began gathering above the peaks just an hour into their hike.'\n\nPart A: What did the hikers check twice before setting off? Enter a short phrase.", answer: ["weather forecast", "the weather forecast", "weather"], difficulty: 2, answerType: "text", explanation: "The passage says they checked the weather forecast twice." },
      { id: "eng-r-m2b", prompt: "Read: 'Before setting off into the mountains, the hikers carefully packed extra water bottles, a detailed map, a compass, and a well-stocked first aid kit. They checked the weather forecast twice and told a park ranger exactly which trail they planned to take. Even so, dark clouds began gathering above the peaks just an hour into their hike.'\n\nPart B: What does their preparation suggest about the hikers? Enter one word.", answer: ["careful", "prepared", "cautious", "responsible"], difficulty: 2, answerType: "text", explanation: "Packing extra supplies and checking the forecast shows the hikers were careful and well-prepared." },
      { id: "eng-r-m3a", prompt: "Read: 'Even though rain poured steadily throughout the afternoon, the football match continued exactly as scheduled. Players slid across the muddy field chasing the ball, their kits soaked through within minutes. Despite the conditions, the crowd stayed until the final whistle, cheering just as loudly as they would on a sunny day.'\n\nPart A: What was happening to the weather during the match? Enter one word.", answer: ["raining", "rain", "rainy"], difficulty: 2, answerType: "text", explanation: "The passage states rain poured steadily throughout the afternoon." },
      { id: "eng-r-m3b", prompt: "Read: 'Even though rain poured steadily throughout the afternoon, the football match continued exactly as scheduled. Players slid across the muddy field chasing the ball, their kits soaked through within minutes. Despite the conditions, the crowd stayed until the final whistle, cheering just as loudly as they would on a sunny day.'\n\nPart B: What can you infer about the crowd's enthusiasm for the game? Enter one word.", answer: ["dedicated", "loyal", "enthusiastic", "passionate"], difficulty: 2, answerType: "text", explanation: "Staying and cheering loudly despite the rain shows the crowd was dedicated and enthusiastic." },
      { id: "eng-r-h1a", prompt: "Read: 'Despite losing the grand final in the final seconds, the team walked off the field with their heads held high, applauding the supporters who had travelled hours to watch them play. Their coach gathered them in a circle afterwards, reminding them that the scoreboard didn't reflect how far they had come since the start of the season. A few players wiped away tears, but there were just as many smiles.'\n\nPart A: How did the team react immediately after losing? Enter a short phrase describing their body language.", answer: ["heads held high", "held their heads high", "walked off with their heads held high"], difficulty: 3, answerType: "text", explanation: "The passage says the team walked off with their heads held high, despite losing." },
      { id: "eng-r-h1b", prompt: "Read: 'Despite losing the grand final in the final seconds, the team walked off the field with their heads held high, applauding the supporters who had travelled hours to watch them play. Their coach gathered them in a circle afterwards, reminding them that the scoreboard didn't reflect how far they had come since the start of the season. A few players wiped away tears, but there were just as many smiles.'\n\nPart B: What does the team's reaction suggest about their attitude toward the loss? Enter one word.", answer: ["proud", "resilient", "positive", "gracious"], difficulty: 3, answerType: "text", explanation: "Holding their heads high and applauding supporters despite losing shows pride and resilience, not shame." },
      { id: "eng-r-h2a", prompt: "Read: 'No one had opened the door of the old house at the end of Marlow Street in years. Ivy crept up the cracked walls, and the windows were thick with dust that let in only a dim, grey light. Inside, sheets covered furniture no one had touched, and the floorboards groaned under even the lightest footstep.'\n\nPart A: What covered the furniture inside the house? Enter the object.", answer: ["sheets", "dust sheets"], difficulty: 3, answerType: "text", explanation: "The passage states sheets covered the furniture inside the house." },
      { id: "eng-r-h2b", prompt: "Read: 'No one had opened the door of the old house at the end of Marlow Street in years. Ivy crept up the cracked walls, and the windows were thick with dust that let in only a dim, grey light. Inside, sheets covered furniture no one had touched, and the floorboards groaned under even the lightest footstep.'\n\nPart B: What can you infer about the house? Enter one word.", answer: ["abandoned", "empty", "deserted", "neglected", "old"], difficulty: 3, answerType: "text", explanation: "Years of dust, ivy, and untouched furniture suggest the house has been abandoned." },
      { id: "eng-r-h3a", prompt: "Read: 'Although her hands trembled slightly as she walked toward the microphone, Priya took a slow breath and began her speech with a steady, clear voice. The audience had no idea that she had barely slept the night before, replaying every sentence in her head. By the final line, she was smiling — not because she had stopped feeling nervous, but because she had pushed through it anyway.'\n\nPart A: What physical sign showed Priya was nervous before speaking? Enter a short phrase.", answer: ["trembled slightly", "hands trembled", "her hands trembled", "trembling hands"], difficulty: 3, answerType: "text", explanation: "The passage says her hands trembled slightly as she walked toward the microphone." },
      { id: "eng-r-h3b", prompt: "Read: 'Although her hands trembled slightly as she walked toward the microphone, Priya took a slow breath and began her speech with a steady, clear voice. The audience had no idea that she had barely slept the night before, replaying every sentence in her head. By the final line, she was smiling — not because she had stopped feeling nervous, but because she had pushed through it anyway.'\n\nPart B: What does the passage suggest Priya achieved by the end of her speech? Enter a short phrase.", answer: ["pushed through it", "pushed through her nerves", "overcame her nervousness", "pushed through it anyway"], difficulty: 3, answerType: "text", explanation: "The passage says she smiled because she had pushed through her nervousness anyway." },
    ] },
];
