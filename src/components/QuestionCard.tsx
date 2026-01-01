'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { MathQuestion, ProbaQuestion, TradingQuestion, BehavioralQuestion, MLQuestion, Category } from '@/types'

type QuestionType = MathQuestion | ProbaQuestion | TradingQuestion | BehavioralQuestion | MLQuestion

interface QuestionCardProps {
  question: QuestionType
  category: Category
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, timeSpent: number) => void
}

function getDifficultyClass(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'difficulty-easy'
    case 'medium':
      return 'difficulty-medium'
    case 'hard':
      return 'difficulty-hard'
    default:
      return ''
  }
}

function isBehavioralQuestion(q: QuestionType): q is BehavioralQuestion {
  return 'prompt' in q && 'starChecks' in q
}

function isMathQuestion(q: QuestionType): q is MathQuestion {
  return 'question' in q && 'hint' in q && !('explanation' in q) && !('prompt' in q)
}

export default function QuestionCard({
  question,
  category,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [timerActive, setTimerActive] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [answerFeedback, setAnswerFeedback] = useState<boolean | null>(null)

  const targetTime = isBehavioralQuestion(question) ? 120 : question.targetTime
  const difficulty = isBehavioralQuestion(question) ? 'medium' : question.difficulty

  // Timer effect
  useEffect(() => {
    if (!timerActive) return

    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive])

  // Reset state when question changes
  useEffect(() => {
    setShowHint(false)
    setShowAnswer(false)
    setTimeSpent(0)
    setTimerActive(true)
    setUserAnswer('')
    setAnswerFeedback(null)
  }, [question.id, category])

  // Helper function to extract numeric value from answer string or user input
  const extractNumericAnswer = useCallback((answerText: string): number | null => {
    if (!answerText || typeof answerText !== 'string') return null
    
    // Clean the input
    const cleaned = answerText.trim()
    
    // Try to find numbers - check fractions first
    // Look for patterns like "3/8", "3/2", "1.5", "37.5%", "2,500,000", "$2.5 million", "≈ 1.806", etc.
    
    // First, try to match fractions (most specific)
    const fractionPattern = /(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/
    const fractionMatch = cleaned.match(fractionPattern)
    if (fractionMatch) {
      const numerator = parseFloat(fractionMatch[1])
      const denominator = parseFloat(fractionMatch[2])
      if (denominator !== 0 && !isNaN(numerator) && !isNaN(denominator)) {
        return numerator / denominator
      }
    }
    
    // Try percentage
    const percentagePattern = /(\d+\.?\d*)\s*%/
    const percentageMatch = cleaned.match(percentagePattern)
    if (percentageMatch) {
      const num = parseFloat(percentageMatch[1])
      if (!isNaN(num)) {
        return num / 100
      }
    }
    
    // Try currency with scale words
    const currencyPattern = /[\$]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|thousand)/i
    const currencyMatch = cleaned.match(currencyPattern)
    if (currencyMatch) {
      const num = parseFloat(currencyMatch[1].replace(/,/g, ''))
      const scale = currencyMatch[2].toLowerCase()
      if (!isNaN(num)) {
        if (scale === 'million') return num * 1000000
        if (scale === 'billion') return num * 1000000000
        if (scale === 'thousand') return num * 1000
      }
    }
    
    // Try approximation symbol
    const approxPattern = /≈\s*(\d+\.?\d*)/
    const approxMatch = cleaned.match(approxPattern)
    if (approxMatch) {
      const num = parseFloat(approxMatch[1].replace(/,/g, ''))
      if (!isNaN(num)) {
        return num
      }
    }
    
    // Try plain number (most general, check last)
    const numberPattern = /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)/
    const numberMatch = cleaned.match(numberPattern)
    if (numberMatch) {
      const num = parseFloat(numberMatch[1].replace(/,/g, ''))
      if (!isNaN(num)) {
        return num
      }
    }
    
    return null
  }, [])

  // Helper function to check if user answer is correct
  const checkAnswer = useCallback((correctAnswer: string, userAnswer: string): boolean => {
    // First try to extract numeric values from both
    const correctNumeric = extractNumericAnswer(correctAnswer)
    const userNumeric = extractNumericAnswer(userAnswer)
    
    // If both are numeric, compare them
    if (correctNumeric !== null && userNumeric !== null) {
      // Allow small tolerance for floating point errors (0.1% or 0.01 absolute, whichever is larger)
      const tolerance = Math.max(Math.abs(correctNumeric) * 0.001, 0.01)
      return Math.abs(userNumeric - correctNumeric) <= tolerance
    }
    
    // If we couldn't extract numbers, do text comparison (case-insensitive, trimmed)
    const correctText = correctAnswer.toLowerCase().trim()
    const userText = userAnswer.toLowerCase().trim()
    
    // Exact match
    if (correctText === userText) {
      return true
    }
    
    // Try to match just the key part (e.g., if answer contains "RED" or "red", accept that)
    // Extract single word answers (like "red", "blue", "8", etc.)
    const singleWordPattern = /\b(red|blue|green|yellow|black|white|\d+)\b/i
    const correctKey = correctText.match(singleWordPattern)?.[0]
    const userKey = userText.match(singleWordPattern)?.[0]
    
    if (correctKey && userKey && correctKey.toLowerCase() === userKey.toLowerCase()) {
      return true
    }
    
    // Final fallback: check if user answer is contained in correct answer or vice versa
    // (useful for answers like "The answer is 8" vs user input "8")
    if (correctText.includes(userText) || userText.includes(correctText)) {
      // But only if the match is substantial (at least 2 characters)
      if (userText.length >= 2) {
        return true
      }
    }
    
    return false
  }, [extractNumericAnswer])

  const handleShowAnswer = useCallback(() => {
    if (isMathQuestion(question) && userAnswer.trim()) {
      // For math questions, check the answer first
      const isCorrect = checkAnswer(question.answer, userAnswer)
      setAnswerFeedback(isCorrect)
      setShowAnswer(true)
      setTimerActive(false)
    } else if (!isMathQuestion(question)) {
      // For non-math questions, just show the answer
      setShowAnswer(true)
      setTimerActive(false)
    }
  }, [question, userAnswer, checkAnswer])

  const handleAnswer = useCallback((correct: boolean) => {
    onAnswer(correct, timeSpent)
  }, [onAnswer, timeSpent])

  const getTimerColor = () => {
    const ratio = timeSpent / targetTime
    if (ratio >= 1) return 'text-red-400 timer-danger'
    if (ratio >= 0.75) return 'text-yellow-400 timer-warning'
    return 'text-[#f97316]'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1f2937] gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#6b7280] text-xs sm:text-sm">
            Q{questionNumber}/{totalQuestions}
          </span>
          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getDifficultyClass(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center gap-1.5 sm:gap-2 font-mono text-base sm:text-lg ${getTimerColor()}`}>
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{formatTime(timeSpent)}</span>
          <span className="text-[#6b7280] text-xs sm:text-sm">/ {formatTime(targetTime)}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-6">
        {isBehavioralQuestion(question) ? (
          // Behavioral Question
          <>
            <p className="text-base sm:text-xl font-medium mb-3 sm:mb-4">{question.prompt}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {question.tags.map((tag) => (
                <span key={tag} className="tag text-xs">{tag}</span>
              ))}
            </div>
            
            {/* Hint Section */}
            {question.hint && (
              <div className="border-t border-[#1f2937] pt-3 sm:pt-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm sm:text-base"
                >
                  {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>Hint</span>
                </button>
                <div className={`hint-content text-[#6b7280] text-sm sm:text-base ${showHint ? 'open' : ''}`}>
                  {question.hint}
                </div>
              </div>
            )}

            {/* Answer Section */}
            {showAnswer && question.answer && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#0a0f1a] rounded-lg sm:rounded-xl border border-[#1f2937] fade-in">
                <h4 className="font-semibold mb-1.5 sm:mb-2 text-[#f97316] text-sm sm:text-base">Answer:</h4>
                <p className="text-base sm:text-lg mb-3 sm:mb-4">{question.answer}</p>
                
                {question.explanation && question.explanation.length > 0 && (
                  <>
                    <h4 className="font-semibold mb-1.5 sm:mb-2 text-[#f97316] mt-3 sm:mt-4 text-sm sm:text-base">Explanation:</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {question.explanation.map((point, i) => (
                        <li key={i} className="text-[#9ca3af] flex items-start gap-2 text-xs sm:text-base">
                          <span className="text-[#6366f1]">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          // Other Questions
          <>
            <p className="text-base sm:text-xl font-medium mb-4 sm:mb-6">{question.question}</p>

            {/* Hint Section */}
            <div className="border-t border-[#1f2937] pt-3 sm:pt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm sm:text-base"
              >
                {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>Hint</span>
              </button>
              <div className={`hint-content text-[#6b7280] text-sm sm:text-base ${showHint ? 'open' : ''}`}>
                {question.hint}
              </div>
            </div>

            {/* Answer Input for Math Questions */}
            {isMathQuestion(question) && !showAnswer && (
              <div className="mt-4 sm:mt-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userAnswer.trim()) {
                        handleShowAnswer()
                      }
                    }}
                    placeholder="Enter your answer..."
                    className="flex-1 bg-[#0a0f1a] border border-[#374151] rounded-lg px-4 py-2.5 sm:py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f97316] transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>
            )}

            {/* Answer Section */}
            {showAnswer && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#0a0f1a] rounded-lg sm:rounded-xl border border-[#1f2937] fade-in">
                {isMathQuestion(question) && answerFeedback !== null && (
                  <div className={`mb-4 flex items-center gap-2 p-3 rounded-lg ${
                    answerFeedback 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    {answerFeedback ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Incorrect</span>
                      </>
                    )}
                  </div>
                )}
                
                <h4 className="font-semibold mb-1.5 sm:mb-2 text-[#f97316] text-sm sm:text-base">Answer:</h4>
                <p className="text-base sm:text-lg mb-3 sm:mb-4">{question.answer}</p>
                
                {'explanation' in question && question.explanation && (
                  <>
                    <h4 className="font-semibold mb-1.5 sm:mb-2 text-[#f97316] mt-3 sm:mt-4 text-sm sm:text-base">Explanation:</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {question.explanation.map((point, i) => (
                        <li key={i} className="text-[#9ca3af] flex items-start gap-2 text-xs sm:text-base">
                          <span className="text-[#6366f1]">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#1f2937]">
        {!showAnswer ? (
          <button
            onClick={handleShowAnswer}
            disabled={isMathQuestion(question) && !userAnswer.trim()}
            className="btn-primary w-full text-sm sm:text-base py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            See if I am right
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {isMathQuestion(question) && answerFeedback !== null ? (
              // For math questions, use the feedback result
              <button
                onClick={() => handleAnswer(answerFeedback)}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base ${
                  answerFeedback
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                }`}
              >
                {answerFeedback ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Continue (Correct)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Continue (Incorrect)
                  </>
                )}
              </button>
            ) : (
              // For non-math questions, let user self-report
              <>
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-green-500/20 transition-colors text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  I was correct
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-red-500/20 transition-colors text-sm sm:text-base"
                >
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  I was wrong
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

