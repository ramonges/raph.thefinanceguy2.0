export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MathQuestion {
  id: number
  question: string
  answer: string
  hint: string
  difficulty: Difficulty
  targetTime: number
}

export interface ProbaQuestion {
  id: number
  question: string
  answer: string
  explanation: string[]
  hint: string
  difficulty: Difficulty
  targetTime: number
}

export interface TradingQuestion {
  id: number
  question: string
  answer: string
  explanation: string[]
  hint: string
  difficulty: Difficulty
  targetTime: number
}

export interface BehavioralQuestion {
  id: number
  prompt: string
  tags: string[]
  starChecks: string[]
}

export interface MLQuestion {
  id: number
  question: string
  answer: string
  explanation: string[]
  hint: string
  difficulty: Difficulty
  targetTime: number
}

export type Question = MathQuestion | ProbaQuestion | TradingQuestion | BehavioralQuestion | MLQuestion

export type Category = 'mental-maths' | 'proba' | 'trading' | 'behavioral' | 'ml-ai'

export interface UserProgress {
  id: string
  user_id: string
  section: string
  question_id: string
  response: 'got_it' | 'dont_know' | 'didnt_get_it'
  created_at: string
}

export interface UserAnsweredQuestion {
  id: string
  user_id: string
  section: string
  question_number: number
  was_correct: boolean
  time_spent: number
  created_at: string
}

export interface UserMissedQuestion {
  id: string
  user_id: string
  section: string
  question_number: number
  question_text: string
  correct_answer: string
  user_attempted_at: string
  reviewed: boolean
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  auth_provider: string | null
  last_sign_in_at: string | null
  sign_in_count: number | null
  created_at: string
  updated_at: string
}

export interface CategoryStats {
  total: number
  correct: number
  wrong: number
  percentage: number
}

export interface UserStats {
  overall: CategoryStats
  byCategory: Record<Category, CategoryStats>
}

