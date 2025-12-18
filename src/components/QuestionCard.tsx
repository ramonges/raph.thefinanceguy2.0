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
  }, [question.id, category])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setTimerActive(false)
  }, [])

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
            
            {/* STAR Checklist */}
            {showAnswer && (
              <div className="mt-4 sm:mt-6 fade-in">
                <h4 className="font-semibold mb-2 sm:mb-3 text-[#f97316] text-sm sm:text-base">STAR Method Checklist:</h4>
                {question.starChecks.map((check, i) => (
                  <div key={i} className="star-check text-xs sm:text-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#f97316] flex-shrink-0" />
                    <span>{check}</span>
                  </div>
                ))}
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

            {/* Answer Section */}
            {showAnswer && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#0a0f1a] rounded-lg sm:rounded-xl border border-[#1f2937] fade-in">
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
            className="btn-primary w-full text-sm sm:text-base py-2.5 sm:py-3"
          >
            See if I am right
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
          </div>
        )}
      </div>
    </div>
  )
}

