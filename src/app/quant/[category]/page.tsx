'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import QuestionCard from '@/components/QuestionCard'
import { quantBlockQuestions, quantCategoryLabels } from '@/data/quantBlockQuestions'
import { UserStats, Profile, Question, Category } from '@/types'
import { Calculator, Loader2 } from 'lucide-react'
import { calculateStats, detectBlockTypeFromPath } from '@/lib/stats'

const emptyStats: UserStats = {
  overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
  byCategory: {
    'mental-maths': { total: 0, correct: 0, wrong: 0, percentage: 0 },
    'proba': { total: 0, correct: 0, wrong: 0, percentage: 0 },
    'trading': { total: 0, correct: 0, wrong: 0, percentage: 0 },
    'behavioral': { total: 0, correct: 0, wrong: 0, percentage: 0 },
    'ml-ai': { total: 0, correct: 0, wrong: 0, percentage: 0 },
  }
}

// Map quant block categories to original category types for stats
const categoryMapping: Record<string, Category> = {
  'mental-calculations': 'mental-maths',
  'probability-exercises': 'proba',
  'brainteasers': 'proba',
  'coding-project': 'behavioral',
  'statistics-ml': 'ml-ai',
  'trading-intuition': 'trading',
  'research-discussion': 'behavioral',
}

export default function QuantCategoryTrainingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const categoryId = params?.category as string
  const supabase = createClient()
  const blockType = detectBlockTypeFromPath(pathname)

  const questions: Question[] = quantBlockQuestions[categoryId as keyof typeof quantBlockQuestions] as Question[] || []
  const categoryLabel = quantCategoryLabels[categoryId] || categoryId
  const originalCategory = categoryMapping[categoryId] || 'trading'

  // Fetch user and their progress
  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        } else {
          // Create profile if doesn't exist
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
              auth_provider: user.app_metadata?.provider || 'email',
            })
            .select()
            .single()
          
          setProfile(newProfile)
        }

        // Fetch answered questions for this quant category
        const sectionId = `quant-${categoryId}`
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', user.id)
          .eq('section', sectionId)
          .eq('block_type', 'quant')

        if (answeredQuestions) {
          // Calculate stats
          const newStats = calculateStats(answeredQuestions, blockType || undefined)
          setStats(newStats)

          // Calculate current question index
          if (answeredQuestions.length > 0) {
            const maxQuestionNumber = Math.max(...answeredQuestions.map(q => q.question_number))
            const totalInCategory = questions.length
            setCurrentQuestionIndex(
              maxQuestionNumber >= totalInCategory 
                ? totalInCategory 
                : maxQuestionNumber
            )
          } else {
            setCurrentQuestionIndex(0)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error initializing:', error)
        setLoading(false)
      }
    }

    if (categoryId && questions.length > 0) {
      initialize()
    }
  }, [categoryId, router, supabase, blockType, questions.length])

  const handleAnswer = useCallback(async (correct: boolean, timeSpent: number) => {
    if (!userId || !categoryId) return

    const question = questions[currentQuestionIndex]

    try {
      const sectionId = `quant-${categoryId}`
      
      // Record the answer
      await supabase.from('user_answered_questions').upsert({
        user_id: userId,
        section: sectionId,
        question_number: currentQuestionIndex + 1,
        was_correct: correct,
        time_spent: timeSpent,
        block_type: 'quant',
      }, {
        onConflict: 'user_id,section,question_number',
      })

      // If wrong, add to missed questions
      if (!correct) {
        const questionText = 'prompt' in question ? question.prompt : question.question
        const answerText = 'answer' in question ? question.answer : (question as any).starChecks?.join(', ') || ''
        
        await supabase.from('user_missed_questions').upsert({
          user_id: userId,
          section: sectionId,
          question_number: currentQuestionIndex + 1,
          question_text: questionText,
          correct_answer: answerText,
          reviewed: false,
          block_type: 'quant',
        }, {
          onConflict: 'user_id,section,question_number',
        })
      } else {
        // If correct and it was previously missed, mark as reviewed
        await supabase
          .from('user_missed_questions')
          .update({ reviewed: true })
          .eq('user_id', userId)
          .eq('section', sectionId)
          .eq('question_number', currentQuestionIndex + 1)
      }

      // Update stats locally
      setStats(prev => {
        const newStats = { ...prev }
        newStats.byCategory = { ...prev.byCategory }
        newStats.byCategory[originalCategory] = { ...prev.byCategory[originalCategory] }
        newStats.overall = { ...prev.overall }

        newStats.byCategory[originalCategory].total++
        newStats.overall.total++

        if (correct) {
          newStats.byCategory[originalCategory].correct++
          newStats.overall.correct++
        } else {
          newStats.byCategory[originalCategory].wrong++
          newStats.overall.wrong++
        }

        return newStats
      })

      // Move to next question
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex)
      } else {
        setCurrentQuestionIndex(questions.length)
      }
    } catch (error) {
      console.error('Error recording answer:', error)
    }
  }, [userId, currentQuestionIndex, questions, categoryId, originalCategory, supabase])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (!categoryId || questions.length === 0) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link href="/quant" className="text-[#f97316] hover:underline">
            Back to Quant Categories
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isComplete = currentQuestionIndex >= questions.length

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => setShowStats(true)} blockType={blockType} />

      <main className="pt-16 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-6">
            <Link 
              href="/select-block"
              className="text-[#9ca3af] hover:text-[#f97316] text-xs sm:text-sm mb-2 inline-block transition-colors"
            >
              Blocks
            </Link>
            <span className="text-[#9ca3af] text-xs sm:text-sm mx-2">/</span>
            <Link 
              href="/quant"
              className="text-[#9ca3af] hover:text-[#f97316] text-xs sm:text-sm mb-2 inline-block transition-colors"
            >
              Quant
            </Link>
            <span className="text-[#9ca3af] text-xs sm:text-sm mx-2">/</span>
            <span className="text-[#f97316] text-xs sm:text-sm font-medium">{categoryLabel}</span>
          </div>

          {/* Question Card */}
          {isComplete ? (
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f97316]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-[#f97316]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                🎉 Category Complete!
              </h2>
              <p className="text-[#9ca3af] mb-4 sm:mb-6 text-sm sm:text-base">
                You&apos;ve completed all {questions.length} questions in {categoryLabel}.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCurrentQuestionIndex(0)}
                  className="btn-primary"
                >
                  Start Over
                </button>
                <Link
                  href="/quant"
                  className="btn-secondary"
                >
                  Back to Categories
                </Link>
              </div>
            </div>
          ) : currentQuestion ? (
            <QuestionCard
              key={`quant-${categoryId}-${currentQuestion.id}`}
              question={currentQuestion}
              category={originalCategory}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />
          ) : null}

          {/* Progress Bar */}
          {!isComplete && (
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-[#6b7280]">Progress in {categoryLabel}</span>
                <span className="text-xs sm:text-sm text-[#6b7280]">
                  {currentQuestionIndex}/{questions.length}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill bg-[#f97316]"
                  style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Statistics Modal */}
      {showStats && (
        <Statistics stats={stats} onClose={() => setShowStats(false)} blockType={blockType || undefined} />
      )}
    </div>
  )
}

