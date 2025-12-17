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
    return 'text-[#00d4aa]'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
        <div className="flex items-center gap-4">
          <span className="text-[#6b7280] text-sm">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyClass(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 font-mono text-lg ${getTimerColor()}`}>
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeSpent)}</span>
          <span className="text-[#6b7280] text-sm">/ {formatTime(targetTime)}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {isBehavioralQuestion(question) ? (
          // Behavioral Question
          <>
            <p className="text-xl font-medium mb-4">{question.prompt}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            
            {/* STAR Checklist */}
            {showAnswer && (
              <div className="mt-6 fade-in">
                <h4 className="font-semibold mb-3 text-[#00d4aa]">STAR Method Checklist:</h4>
                {question.starChecks.map((check, i) => (
                  <div key={i} className="star-check">
                    <CheckCircle className="w-4 h-4 text-[#00d4aa] flex-shrink-0" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Other Questions
          <>
            <p className="text-xl font-medium mb-6">{question.question}</p>

            {/* Hint Section */}
            <div className="border-t border-[#1f2937] pt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
              >
                {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>Hint</span>
              </button>
              <div className={`hint-content text-[#6b7280] ${showHint ? 'open' : ''}`}>
                {question.hint}
              </div>
            </div>

            {/* Answer Section */}
            {showAnswer && (
              <div className="mt-6 p-4 bg-[#0a0f1a] rounded-xl border border-[#1f2937] fade-in">
                <h4 className="font-semibold mb-2 text-[#00d4aa]">Answer:</h4>
                <p className="text-lg mb-4">{question.answer}</p>
                
                {'explanation' in question && question.explanation && (
                  <>
                    <h4 className="font-semibold mb-2 text-[#00d4aa] mt-4">Explanation:</h4>
                    <ul className="space-y-2">
                      {question.explanation.map((point, i) => (
                        <li key={i} className="text-[#9ca3af] flex items-start gap-2">
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
      <div className="px-6 py-4 border-t border-[#1f2937]">
        {!showAnswer ? (
          <button
            onClick={handleShowAnswer}
            className="btn-primary w-full"
          >
            See if I am right
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold py-3 px-6 rounded-xl hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              I was correct
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-3 px-6 rounded-xl hover:bg-red-500/20 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              I was wrong
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

