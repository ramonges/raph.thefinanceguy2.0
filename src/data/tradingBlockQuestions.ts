import { TradingQuestion, MathQuestion, ProbaQuestion, BehavioralQuestion, MLQuestion } from '@/types'
import { tradingQuestions, mathQuestions, probaQuestions, behavioralQuestions, mlQuestions } from './questions'

// Organize ALL questions by Trading block categories
// This includes ALL questions from the original training page:
// - Mental Calculation: ALL math questions (50 questions)
// - Proba Exercises: ALL probability questions (44 questions)
// - Brainteaser: Brainteaser questions from proba (4 questions: rope, 9 balls, manhole, switches)
// - Trading Intuition: ALL trading/technical questions (38 questions)
// - ML Questions: ALL ML & AI questions (41 questions)
// - Behavioral: ALL behavioral questions (27 questions)
export const tradingBlockQuestions = {
  'behavioral': behavioralQuestions as BehavioralQuestion[], // All 27 behavioral questions
  'mental-calculation': mathQuestions as MathQuestion[], // All 50 math questions
  'proba-exercises': probaQuestions as ProbaQuestion[], // All 44 probability questions
  'brainteaser': [
    // Brainteaser questions from proba (4 questions)
    ...probaQuestions.filter(q => 
      q.id === 41 || // rope burning problem
      q.id === 42 || // 9 balls problem
      q.id === 43 || // manhole covers
      q.id === 44    // 3 switches problem
    ) as ProbaQuestion[],
    // Additional brainteaser questions
    {
      id: 100,
      question: '(Coins) You have 12 coins. One is counterfeit and is either heavier or lighter. Using only 3 weighings on a balance scale, can you identify the counterfeit coin and determine whether it is heavier or lighter?',
      answer: 'Yes. Weigh 4 vs 4 coins. If equal, the counterfeit is in the remaining 4. If unequal, the heavier/lighter group contains it. In the second weighing, narrow down to 2 coins. In the third weighing, identify the counterfeit and whether it\'s heavier or lighter.',
      explanation: [
        'First weighing: Weigh coins 1-4 vs 5-8.',
        'If equal: Counterfeit is in 9-12. Second weighing: Weigh 9,10 vs 11,1 (known good). If 9,10 heavier, either 9 or 10 is heavy. Third weighing: Weigh 9 vs 10 to identify.',
        'If unequal: Say 1-4 heavier. Counterfeit is either heavy in 1-4 or light in 5-8. Second weighing: Weigh 1,2,5 vs 3,6,9 (9 is known good). If 1,2,5 heavier, either 1 or 2 is heavy. Third weighing: Weigh 1 vs 2.',
        'This strategy works for all cases and always identifies the counterfeit in exactly 3 weighings.',
      ],
      hint: 'Divide and conquer: split into groups and use the results to narrow down possibilities',
      difficulty: 'hard',
      targetTime: 180,
    },
    {
      id: 101,
      question: '(Water jugs) You have a 3-liter jug and a 5-liter jug. How can you measure exactly 4 liters?',
      answer: 'Fill the 5L jug. Pour from 5L into 3L until 3L is full (leaving 2L in 5L). Empty 3L. Pour the 2L from 5L into 3L. Fill 5L again. Pour from 5L into 3L until 3L is full (adding 1L, leaving 4L in 5L).',
      explanation: [
        'Step 1: Fill 5L jug (5L full, 3L empty)',
        'Step 2: Pour from 5L to 3L (5L has 2L, 3L has 3L)',
        'Step 3: Empty 3L (5L has 2L, 3L empty)',
        'Step 4: Pour 2L from 5L to 3L (5L empty, 3L has 2L)',
        'Step 5: Fill 5L (5L has 5L, 3L has 2L)',
        'Step 6: Pour from 5L to 3L until 3L is full (5L has 4L, 3L has 3L)',
      ],
      hint: 'Use the difference between jug sizes (5-3=2) to create intermediate amounts',
      difficulty: 'medium',
      targetTime: 90,
    },
    {
      id: 102,
      question: '(Bridge and torch) Four people need to cross a bridge at night with one torch. At most two people can cross at a time. They take 1, 2, 5, and 10 minutes respectively. What is the minimum total time required?',
      answer: '17 minutes. Strategy: 1 and 2 cross (2 min), 1 returns (1 min), 5 and 10 cross (10 min), 2 returns (2 min), 1 and 2 cross again (2 min). Total: 2+1+10+2+2 = 17 minutes.',
      explanation: [
        'Key insight: The slowest people (5 and 10) should cross together to minimize time.',
        'Step 1: Fastest pair (1 and 2) cross together → 2 minutes',
        'Step 2: Fastest (1) returns with torch → 1 minute (total: 3 min)',
        'Step 3: Slowest pair (5 and 10) cross together → 10 minutes (total: 13 min)',
        'Step 4: Second fastest (2) returns with torch → 2 minutes (total: 15 min)',
        'Step 5: Fastest pair (1 and 2) cross together again → 2 minutes (total: 17 min)',
      ],
      hint: 'Minimize time by having slowest people cross together, and fastest people handle torch returns',
      difficulty: 'hard',
      targetTime: 120,
    },
    {
      id: 103,
      question: '(Egg drop) You have 2 eggs and a 100-story building. What is the minimum number of drops needed (in the worst case) to determine the highest floor from which an egg can be dropped without breaking?',
      answer: '14 drops. Strategy: Drop first egg from floors 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99. If it breaks at floor k, test floors k-13 to k-1 with second egg. This minimizes worst-case drops.',
      explanation: [
        'Use a strategy that reduces the search space optimally with each drop.',
        'Drop first egg from floors: 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99.',
        'If first egg breaks at floor k, you know the critical floor is between k-13 and k-1.',
        'Use second egg to test floors k-13, k-12, ..., k-1 sequentially (at most 13 more drops).',
        'Worst case: First egg breaks at floor 99 (11 drops), then test floors 86-98 with second egg (13 drops) = 14 total.',
        'This is optimal: any strategy requires at least 14 drops in worst case.',
      ],
      hint: 'Balance the number of drops of the first egg with the remaining floors to test with the second egg',
      difficulty: 'hard',
      targetTime: 180,
    },
    {
      id: 104,
      question: '(Prisoners and hats) 100 prisoners are lined up. Each prisoner wears either a black or white hat and can see the hats in front of them. Starting from the back, each must guess the color of their own hat. What strategy maximizes the number of correct guesses?',
      answer: '99 correct guesses. The last prisoner counts black hats in front and says "black" if even, "white" if odd. Each subsequent prisoner can deduce their hat color by counting black hats ahead and comparing to the parity established.',
      explanation: [
        'Last prisoner (can see all 99 hats ahead): Counts black hats. If even, says "black"; if odd, says "white". This establishes parity.',
        'Prisoner 99: Sees 98 hats ahead, hears last prisoner\'s answer. Counts black hats ahead. If parity matches, his hat is white; if not, black.',
        'Each subsequent prisoner uses the same logic: count black hats ahead, compare to established parity, deduce own hat color.',
        'All prisoners except the first (who has no information) guess correctly.',
        'This strategy guarantees 99 correct guesses regardless of hat distribution.',
      ],
      hint: 'Use the first guess to encode information (parity) that others can use to deduce their hat color',
      difficulty: 'hard',
      targetTime: 150,
    },
    {
      id: 105,
      question: '(Monty Hall problem) You choose one of three doors. The host opens a door with no prize. Do you switch or stay? What is the probability of winning?',
      answer: 'Switch. Probability of winning if you switch is 2/3. Probability if you stay is 1/3.',
      explanation: [
        'Initial choice: 1/3 probability of choosing the prize.',
        'If you chose correctly (1/3 chance), switching loses.',
        'If you chose incorrectly (2/3 chance), switching wins (host must reveal the other wrong door).',
        'Therefore, switching wins 2/3 of the time.',
        'Staying only wins if your initial choice was correct (1/3 probability).',
      ],
      hint: 'Consider what happens in each of the three possible initial door choices',
      difficulty: 'medium',
      targetTime: 60,
    },
    {
      id: 106,
      question: '(Clocks) A clock gains 5 minutes every hour. How long will it take before the clock shows the correct time again?',
      answer: '12 hours. The clock gains 5 minutes per hour, so it gains 60 minutes (1 full hour) in 12 hours. After 12 hours, it will be 1 hour ahead, which appears correct on a 12-hour clock.',
      explanation: [
        'Clock gains 5 minutes per hour.',
        'To gain 60 minutes (1 full hour), it takes 60/5 = 12 hours.',
        'After 12 hours, the clock shows 1 hour ahead.',
        'On a 12-hour clock, showing 1 hour ahead appears as the correct time (the hour hand is in the same position).',
        'Note: For a 24-hour clock, it would take 12 hours × 12 = 144 hours (6 days) to show correct time again.',
      ],
      hint: 'Calculate when the clock gains exactly one full hour (60 minutes)',
      difficulty: 'easy',
      targetTime: 45,
    },
    {
      id: 107,
      question: '(Bacteria growth) A bacteria culture doubles every minute. It completely fills a jar in 60 minutes. At what minute is the jar half full?',
      answer: '59 minutes. Since the culture doubles every minute, if it\'s full at 60 minutes, it must be half full at 59 minutes.',
      explanation: [
        'The culture doubles every minute.',
        'If the jar is full at minute 60, then at minute 59 it must be half full.',
        'At minute 59: jar is 1/2 full.',
        'At minute 60: jar doubles to 1 full (2 × 1/2 = 1).',
        'This is a classic exponential growth problem with a simple answer.',
      ],
      hint: 'Work backwards from the final state using the doubling property',
      difficulty: 'easy',
      targetTime: 30,
    },
    {
      id: 108,
      question: '(Weighing coins) You have 10 stacks of coins. One stack contains coins weighing 10g each, the others 9g each. You can use a digital scale only once. How do you identify the heavier stack?',
      answer: 'Take 1 coin from stack 1, 2 coins from stack 2, ..., 10 coins from stack 10. Weigh all together. The weight will be 55g × 9g = 495g plus the number of extra grams equals the stack number with heavy coins.',
      explanation: [
        'Take 1 coin from stack 1, 2 from stack 2, ..., 10 from stack 10.',
        'Total coins: 1+2+...+10 = 55 coins.',
        'If all were 9g: total weight = 55 × 9 = 495g.',
        'If stack k has 10g coins: total weight = 495 + k grams.',
        'Weigh all 55 coins. Subtract 495g. The remainder equals the stack number with heavy coins.',
      ],
      hint: 'Take a different number of coins from each stack so the total weight reveals which stack is heavy',
      difficulty: 'medium',
      targetTime: 90,
    },
    {
      id: 109,
      question: '(Boxes and labels) You have three boxes labeled "Apples", "Oranges", and "Apples & Oranges". All labels are incorrect. By taking one fruit from one box, how can you correctly relabel all boxes?',
      answer: 'Take one fruit from the box labeled "Apples & Oranges". If it\'s an apple, this box contains only apples. The box labeled "Oranges" must contain apples & oranges (since all labels are wrong). The box labeled "Apples" contains only oranges.',
      explanation: [
        'All labels are incorrect, so: "Apples & Oranges" box contains either only apples OR only oranges.',
        'Take one fruit from "Apples & Oranges" box.',
        'If it\'s an apple: This box = only apples. "Oranges" label must be on apples & oranges box (can\'t be on only oranges since that label is wrong). "Apples" label must be on only oranges box.',
        'If it\'s an orange: This box = only oranges. "Apples" label must be on apples & oranges box. "Oranges" label must be on only apples box.',
        'One sample is sufficient to determine all three box contents.',
      ],
      hint: 'Since all labels are wrong, the "Apples & Oranges" box must contain only one type of fruit',
      difficulty: 'medium',
      targetTime: 75,
    },
    {
      id: 110,
      question: '(Burning ropes) You have two ropes. Each rope takes exactly 60 minutes to burn but does not burn uniformly. How can you measure exactly 45 minutes?',
      answer: 'Light rope 1 at both ends and rope 2 at one end simultaneously. When rope 1 finishes burning (30 minutes), light the other end of rope 2. When rope 2 finishes burning, 45 minutes have elapsed.',
      explanation: [
        'Light rope 1 at both ends: burns in 30 minutes (half the time).',
        'Simultaneously light rope 2 at one end.',
        'When rope 1 finishes (30 min elapsed), rope 2 has 30 minutes of burn time remaining.',
        'Immediately light the other end of rope 2: it now has 30 minutes of material but burns from both ends, so finishes in 15 minutes.',
        'Total time: 30 + 15 = 45 minutes.',
      ],
      hint: 'Lighting a rope at both ends makes it burn twice as fast',
      difficulty: 'medium',
      targetTime: 90,
    },
    {
      id: 111,
      question: '(Probability – children) A family has two children. You are told that one of them is a boy born on a Tuesday. What is the probability that both children are boys?',
      answer: '13/27 ≈ 0.481. There are 27 equally likely combinations of gender and day of week. 13 have both boys (one born on Tuesday), 14 have one boy and one girl.',
      explanation: [
        'Sample space: Each child can be (Boy/Girl) × (Mon/Tue/Wed/Thu/Fri/Sat/Sun) = 14 possibilities each.',
        'Total combinations: 14 × 14 = 196.',
        'Combinations with at least one boy born on Tuesday: 27 (13 with both boys, 14 with one boy one girl).',
        'Combinations with both boys and at least one born on Tuesday: 13.',
        'Probability = 13/27 ≈ 0.481.',
        'Note: This is different from the simpler "one is a boy" problem (answer 1/3) because the Tuesday constraint provides more information.',
      ],
      hint: 'Count all combinations where at least one child is a boy born on Tuesday',
      difficulty: 'hard',
      targetTime: 120,
    },
    {
      id: 112,
      question: '(Probability – dice) What is the probability of getting at least one 6 when rolling four fair dice?',
      answer: '1 - (5/6)^4 = 1 - 625/1296 = 671/1296 ≈ 0.518 (51.8%)',
      explanation: [
        'Easier to calculate probability of NO 6s, then subtract from 1.',
        'Probability of no 6 on one die: 5/6.',
        'Probability of no 6 on all four dice: (5/6)^4 = 625/1296.',
        'Probability of at least one 6: 1 - 625/1296 = 671/1296 ≈ 0.518.',
      ],
      hint: 'Use the complement: P(at least one 6) = 1 - P(no 6s)',
      difficulty: 'medium',
      targetTime: 60,
    },
    {
      id: 113,
      question: '(Probability – cards) You draw two cards from a standard 52-card deck without replacement. What is the probability of drawing exactly one Ace?',
      answer: '32/221 ≈ 0.145. P = (C(4,1) × C(48,1)) / C(52,2) = (4 × 48) / 1326 = 192/1326 = 32/221',
      explanation: [
        'Total ways to draw 2 cards: C(52,2) = 52×51/2 = 1326.',
        'Ways to draw exactly one Ace: Choose 1 Ace from 4, and 1 non-Ace from 48.',
        'C(4,1) × C(48,1) = 4 × 48 = 192.',
        'Probability = 192/1326 = 32/221 ≈ 0.145.',
      ],
      hint: 'Use combinations: choose 1 Ace and 1 non-Ace',
      difficulty: 'medium',
      targetTime: 60,
    },
    {
      id: 114,
      question: '(Logic – switches) You are in a room with three switches. In another room, there are three light bulbs, each connected to one switch. You may enter the bulb room only once. How do you determine which switch controls which bulb?',
      answer: 'Turn on switch 1 for 5 minutes, then turn it off. Turn on switch 2. Enter the bulb room. The bulb that is on is controlled by switch 2. The bulb that is off but warm is controlled by switch 1. The bulb that is off and cold is controlled by switch 3.',
      explanation: [
        'Turn on switch 1, wait 5 minutes (bulb heats up), then turn it off.',
        'Turn on switch 2, leave it on.',
        'Enter the bulb room:',
        '- Bulb that is ON → controlled by switch 2.',
        '- Bulb that is OFF but WARM → controlled by switch 1 (was on, then turned off).',
        '- Bulb that is OFF and COLD → controlled by switch 3 (never turned on).',
      ],
      hint: 'Use the heat property of light bulbs to identify which was turned on previously',
      difficulty: 'medium',
      targetTime: 75,
    },
    {
      id: 115,
      question: '(Logic – liars and truth-tellers) On an island, some people always tell the truth and others always lie. You meet two people, A and B. A says: "B is a liar." B says: "A and I are of different types." Who is who?',
      answer: 'Both are liars. If A is truthful, then B is a liar. But if B is a liar, then "A and I are of different types" is false, meaning A and B are the same type, contradiction. Therefore A must be a liar, making B truthful. But if B is truthful, then A and B are different types, meaning A is a liar, which is consistent.',
      explanation: [
        'Assume A is truthful: Then B is a liar (A said so).',
        'If B is a liar, then "A and I are of different types" is false, meaning A and B are the same type.',
        'But we assumed A is truthful and B is a liar (different types), contradiction.',
        'Therefore A must be a liar.',
        'If A is a liar, then "B is a liar" is false, meaning B is truthful.',
        'If B is truthful, then "A and I are of different types" is true, meaning A (liar) and B (truthful) are different types, which is consistent.',
        'Conclusion: A is a liar, B is truthful.',
      ],
      hint: 'Use proof by contradiction: assume A is truthful and see if it leads to a contradiction',
      difficulty: 'hard',
      targetTime: 120,
    },
    {
      id: 116,
      question: '(Probability – taxis) In a city, 85% of taxis are blue and 15% are green. A witness identifies a taxi involved in an accident as green. The witness is 80% accurate. What is the probability the taxi was actually green?',
      answer: '12/29 ≈ 0.414 (41.4%). Use Bayes\' theorem: P(Green | Identified Green) = 0.8 × 0.15 / (0.8 × 0.15 + 0.2 × 0.85) = 0.12 / 0.29 = 12/29',
      explanation: [
        'Use Bayes\' theorem: P(Green | Identified Green) = P(Identified Green | Green) × P(Green) / P(Identified Green)',
        'P(Identified Green | Green) = 0.8 (witness accuracy)',
        'P(Green) = 0.15',
        'P(Identified Green) = P(Identified Green | Green) × P(Green) + P(Identified Green | Blue) × P(Blue)',
        'P(Identified Green) = 0.8 × 0.15 + 0.2 × 0.85 = 0.12 + 0.17 = 0.29',
        'P(Green | Identified Green) = 0.8 × 0.15 / 0.29 = 0.12 / 0.29 = 12/29 ≈ 0.414',
      ],
      hint: 'Use Bayes\' theorem, considering both true positives and false positives',
      difficulty: 'medium',
      targetTime: 90,
    },
    {
      id: 117,
      question: '(Game theory – coins) Two players take turns removing 1, 2, or 3 coins from a pile of 21 coins. The player who takes the last coin wins. What is the winning strategy?',
      answer: 'The first player wins by leaving a multiple of 4 coins after each turn. First move: take 1 coin (leaving 20). Then, whatever the opponent takes (1, 2, or 3), take enough to leave a multiple of 4. This guarantees you take the last coin.',
      explanation: [
        'Key insight: If you leave a multiple of 4 coins, you can always force a win.',
        'First move: Take 1 coin, leaving 20 (multiple of 4).',
        'Opponent takes 1, 2, or 3: You take 3, 2, or 1 respectively, leaving 16 (multiple of 4).',
        'Continue this strategy: always leave 12, then 8, then 4, then 0.',
        'Since 21 is not a multiple of 4, the first player can always force this position.',
        'The first player has a winning strategy.',
      ],
      hint: 'Find the "losing positions" (multiples of 4) and force your opponent into them',
      difficulty: 'medium',
      targetTime: 90,
    },
    {
      id: 118,
      question: '(Balls and urns) An urn contains 10 red balls and 10 blue balls. You randomly draw two balls. If they are the same color, you put back one red ball. If they are different colors, you put back one blue ball. You repeat until only one ball remains. What color is the final ball?',
      answer: 'The final ball is always RED. The parity (odd/even) of blue balls is invariant. Initially: 10 blue (even). Same color draw: if both blue, put back red (blue count decreases by 2, stays even). If both red, put back red (blue count unchanged, stays even). Different colors: put back blue (blue count unchanged, stays even). Since we start with even blue balls and parity is preserved, we end with even blue balls. With one ball remaining, even means 0 blue, so the final ball is RED.',
      explanation: [
        'Key insight: The parity of the number of blue balls is invariant under the operations.',
        'Initially: 10 blue balls (even number).',
        'Same color (both blue): Remove 2 blue, add 1 red → blue count decreases by 2 (parity unchanged, still even).',
        'Same color (both red): Remove 2 red, add 1 red → blue count unchanged (still even).',
        'Different colors: Remove 1 blue and 1 red, add 1 blue → blue count unchanged (still even).',
        'Since we start with an even number of blue balls and parity is preserved, we must end with an even number.',
        'With one ball remaining, even means 0 blue balls, so the final ball must be RED.',
        'The invariant is: (number of blue balls) mod 2. This is always 0 (even). With 1 ball remaining, even means the ball is RED.',
      ],
      hint: 'Find an invariant that is preserved by all operations (think about parity)',
      difficulty: 'hard',
      targetTime: 150,
    },
  ] as ProbaQuestion[],
  'trading-intuition': tradingQuestions as TradingQuestion[], // All 38 trading/technical questions
  'ml-questions': mlQuestions as MLQuestion[], // All 41 ML & AI questions
}

export const tradingCategoryLabels: Record<string, string> = {
  'behavioral': 'Behavioral Questions',
  'mental-calculation': 'Mental Calculation',
  'proba-exercises': 'Proba Exercises',
  'brainteaser': 'Brainteaser',
  'trading-intuition': 'Trading Intuition',
  'ml-questions': 'ML Questions',
}

