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
  ],
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

