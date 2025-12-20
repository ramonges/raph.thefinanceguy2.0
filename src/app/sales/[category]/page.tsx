'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import QuestionCard from '@/components/QuestionCard'
import { salesBlockQuestions, salesCategoryLabels } from '@/data/salesBlockQuestions'
import { UserStats, Profile, BehavioralQuestion, Question } from '@/types'
import { Calculator, Loader2 } from 'lucide-react'
import { calculateStats, detectBlockTypeFromPath } from '@/lib/stats'
import { loadUserProgress, saveUserProgress, markQuestionAsWrong } from '@/lib/progress'

const emptyStats: UserStats = {
  overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
  byCategory: {}
}

export default function SalesCategoryTrainingPage() {
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

  const questions: BehavioralQuestion[] = (salesBlockQuestions[categoryId as keyof typeof salesBlockQuestions] || []) as unknown as BehavioralQuestion[]
  const categoryLabel = salesCategoryLabels[categoryId] || categoryId

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

        // Fetch ALL answered questions for the Sales track (not just this category)
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', user.id)
          .eq('block_type', 'sales')

        if (answeredQuestions) {
          // Calculate stats for all Sales categories
          const newStats = calculateStats(answeredQuestions, 'sales')
          setStats(newStats)
        }

        // Load user's last position in this section
        const sectionId = `sales-${categoryId}`
        const lastQuestionIndex = await loadUserProgress(supabase, user.id, sectionId)
        const totalInCategory = questions.length
        
        // If user completed all questions, show completion screen
        // Otherwise, resume from last position
        if (lastQuestionIndex >= totalInCategory) {
          setCurrentQuestionIndex(totalInCategory)
        } else {
          setCurrentQuestionIndex(lastQuestionIndex)
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

  // Save progress whenever currentQuestionIndex changes (even if user doesn't answer)
  // This ensures progress is saved even if user navigates away without answering
  useEffect(() => {
    if (!userId || !categoryId || currentQuestionIndex < 0 || loading) return

    const sectionId = `sales-${categoryId}`
    
    // Save immediately with current index
    saveUserProgress(
      supabase,
      userId,
      sectionId,
      currentQuestionIndex,
      'sales',
      null,
      null
    ).catch((err) => {
      console.error('Error saving progress in useEffect:', err)
    })

    // Also save when component unmounts (user leaves page)
    return () => {
      saveUserProgress(
        supabase,
        userId,
        sectionId,
        currentQuestionIndex,
        'sales',
        null,
        null
      ).catch((err) => {
        console.error('Error saving progress on unmount:', err)
      })
    }
  }, [userId, categoryId, currentQuestionIndex, supabase, loading])

  const handleAnswer = useCallback(async (correct: boolean, timeSpent: number) => {
    if (!userId || !categoryId) return

    const question = questions[currentQuestionIndex]

    try {
      const sectionId = `sales-${categoryId}`
      
      // Record the answer
      await supabase.from('user_answered_questions').upsert({
        user_id: userId,
        section: sectionId,
        question_number: currentQuestionIndex + 1,
        was_correct: correct,
        time_spent: timeSpent,
        block_type: 'sales',
      }, {
        onConflict: 'user_id,section,question_number',
      })

      // If wrong, add to missed questions
      if (!correct) {
        const questionText = question.prompt
        const answerText = question.answer || question.starChecks.join(', ')
        await markQuestionAsWrong(
          supabase,
          userId,
          sectionId,
          currentQuestionIndex + 1,
          questionText,
          answerText,
          'sales',
          null,
          null
        )
      } else {
        // If correct and it was previously missed, mark as reviewed
        await supabase
          .from('user_missed_questions')
          .update({ reviewed: true })
          .eq('user_id', userId)
          .eq('section', sectionId)
          .eq('question_number', currentQuestionIndex + 1)
      }

      // Reload stats from database to get accurate stats across all categories
      const { data: answeredQuestions } = await supabase
        .from('user_answered_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('block_type', 'sales')

      if (answeredQuestions) {
        const newStats = calculateStats(answeredQuestions, 'sales')
        setStats(newStats)
      }

      // Move to next question
      const nextIndex = currentQuestionIndex + 1
      const finalIndex = nextIndex < questions.length ? nextIndex : questions.length
      
      // Save progress BEFORE updating state to ensure it's saved
      await saveUserProgress(
        supabase,
        userId,
        sectionId,
        finalIndex,
        'sales',
        null,
        null
      )
      
      // Update state after saving
      setCurrentQuestionIndex(finalIndex)
    } catch (error) {
      console.error('Error recording answer:', error)
    }
  }, [userId, currentQuestionIndex, questions, categoryId, supabase])

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
          <Link href="/sales" className="text-[#f97316] hover:underline">
            Back to Sales Categories
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
              href="/sales"
              className="text-[#9ca3af] hover:text-[#f97316] text-xs sm:text-sm mb-2 inline-block transition-colors"
            >
              Sales
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
                  href="/sales"
                  className="btn-secondary"
                >
                  Back to Categories
                </Link>
              </div>
            </div>
          ) : currentQuestion ? (
            <QuestionCard
              key={`sales-${categoryId}-${currentQuestion.id}`}
              question={currentQuestion as Question}
              category="behavioral"
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

