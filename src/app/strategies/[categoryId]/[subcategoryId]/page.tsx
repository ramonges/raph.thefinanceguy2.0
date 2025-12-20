'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import QuestionCard from '@/components/QuestionCard'
import { getStrategyQuestions } from '@/data/strategyQuestions'
import { UserStats, Profile, StrategyCategory, BehavioralQuestion } from '@/types'
import { Calculator, Loader2 } from 'lucide-react'
import { calculateStats, detectBlockTypeFromPath } from '@/lib/stats'
import { loadUserProgress, saveUserProgress, markQuestionAsWrong } from '@/lib/progress'

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

const categoryLabels: Record<StrategyCategory, string> = {
  'equity-strategies': 'Equity Strategies',
  'fixed-income-strategies': 'Fixed Income Strategies',
  'alternative-strategies': 'Alternative Strategies',
  'macro-strategies': 'Macro Strategies',
  'quantitative-strategies': 'Quantitative Strategies',
  'income-strategies': 'Income Strategies',
  'multi-asset-strategies': 'Multi-Asset Strategies',
}

const subcategoryLabels: Record<string, string> = {
  'momentum': 'Momentum',
  'growth': 'Growth',
  'value': 'Value',
  'quality': 'Quality',
  'dividend-income': 'Dividend / Income',
  'event-driven': 'Event-Driven (M&A, Restructuring)',
  'duration': 'Duration',
  'credit': 'Credit',
  'carry': 'Carry',
  'curve': 'Curve',
  'relative-value': 'Relative Value',
  'long-short-equity': 'Long / Short Equity',
  'market-neutral': 'Market Neutral',
  'merger-arbitrage': 'Merger Arbitrage',
  'convertible-arbitrage': 'Convertible Arbitrage',
  'volatility-arbitrage': 'Volatility Arbitrage',
  'statistical-arbitrage': 'Statistical Arbitrage',
  'global-macro': 'Global Macro',
  'currency-carry': 'Currency Carry',
  'commodity-trend-following': 'Commodity Trend Following',
  'cta': 'CTA (Commodity Trading Advisor)',
  'discretionary-macro': 'Discretionary Macro',
  'factor-investing': 'Factor Investing (Multi-Factor)',
  'mean-reversion': 'Mean Reversion',
  'algorithmic-trading': 'Algorithmic Trading',
  'hft': 'High-Frequency Trading (HFT)',
  'machine-learning': 'Machine Learning-Based',
  'high-yield-dividend': 'High Yield / Dividend Focused',
  'covered-call': 'Covered Call Writing',
  'preferred-securities': 'Preferred Securities',
  'multi-asset-income': 'Multi-Asset Income',
  'risk-parity': 'Risk Parity',
  'tactical-asset-allocation': 'Tactical Asset Allocation',
  'strategic-asset-allocation': 'Strategic Asset Allocation',
  'target-date-target-risk': 'Target Date / Target Risk',
}

export default function StrategySubcategoryTrainingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const categoryId = params?.categoryId as StrategyCategory
  const subcategoryId = params?.subcategoryId as string
  const supabase = createClient()
  const blockType = detectBlockTypeFromPath(pathname)

  const questions: BehavioralQuestion[] = getStrategyQuestions(categoryId, subcategoryId)
  const categoryLabel = categoryLabels[categoryId] || categoryId
  const subcategoryLabel = subcategoryLabels[subcategoryId] || subcategoryId

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

        // Fetch answered questions for this strategy subcategory
        const sectionId = `strategy-${categoryId}-${subcategoryId}`
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', user.id)
          .eq('section', sectionId)

        if (answeredQuestions) {
          // Calculate stats
          const newStats = calculateStats(answeredQuestions, blockType || undefined)
          setStats(newStats)
        }

        // Load user's last position in this section
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

    if (categoryId && subcategoryId && questions.length > 0) {
      initialize()
    }
  }, [categoryId, subcategoryId, router, supabase, blockType, questions.length])

  // Save progress whenever currentQuestionIndex changes (even if user doesn't answer)
  useEffect(() => {
    if (!userId || !categoryId || !subcategoryId || currentQuestionIndex < 0) return

    const sectionId = `strategy-${categoryId}-${subcategoryId}`
    
    // Save immediately
    saveUserProgress(
      supabase,
      userId,
      sectionId,
      currentQuestionIndex,
      null,
      null,
      categoryId
    ).catch(console.error)

    // Also save when component unmounts (user leaves page)
    return () => {
      saveUserProgress(
        supabase,
        userId,
        sectionId,
        currentQuestionIndex,
        null,
        null,
        categoryId
      ).catch(console.error)
    }
  }, [userId, categoryId, subcategoryId, currentQuestionIndex, supabase])

  const handleAnswer = useCallback(async (correct: boolean, timeSpent: number) => {
    if (!userId || !categoryId || !subcategoryId) return

    const question = questions[currentQuestionIndex]

    try {
      const sectionId = `strategy-${categoryId}-${subcategoryId}`
      
      // Record the answer
      await supabase.from('user_answered_questions').upsert({
        user_id: userId,
        section: sectionId,
        question_number: currentQuestionIndex + 1,
        was_correct: correct,
        time_spent: timeSpent,
        strategy_category: categoryId,
      }, {
        onConflict: 'user_id,section,question_number',
      })

      // If wrong, add to missed questions
      if (!correct) {
        const questionText = question.prompt
        const answerText = question.answer || question.starChecks?.join(', ') || ''
        
        await markQuestionAsWrong(
          supabase,
          userId,
          sectionId,
          currentQuestionIndex + 1,
          questionText,
          answerText,
          null,
          null,
          categoryId
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

      // Update stats locally (using 'behavioral' category for strategy questions)
      setStats(prev => {
        const newStats = { ...prev }
        newStats.byCategory = { ...prev.byCategory }
        newStats.byCategory['behavioral'] = { ...prev.byCategory['behavioral'] }
        newStats.overall = { ...prev.overall }

        newStats.byCategory['behavioral'].total++
        newStats.overall.total++

        if (correct) {
          newStats.byCategory['behavioral'].correct++
          newStats.overall.correct++
        } else {
          newStats.byCategory['behavioral'].wrong++
          newStats.overall.wrong++
        }

        return newStats
      })

      // Move to next question
      const nextIndex = currentQuestionIndex + 1
      const finalIndex = nextIndex < questions.length ? nextIndex : questions.length
      setCurrentQuestionIndex(finalIndex)
      
      // Save progress after moving to next question
      await saveUserProgress(
        supabase,
        userId,
        sectionId,
        finalIndex,
        null,
        null,
        categoryId
      )
    } catch (error) {
      console.error('Error recording answer:', error)
    }
  }, [userId, currentQuestionIndex, questions, categoryId, subcategoryId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (!categoryId || !subcategoryId || questions.length === 0) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subcategory not found</h1>
          <Link href={`/strategies/${categoryId}`} className="text-[#f97316] hover:underline">
            Back to {categoryLabel}
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
              href="/strategies"
              className="text-[#9ca3af] hover:text-[#f97316] text-xs sm:text-sm mb-2 inline-block transition-colors"
            >
              Strategies
            </Link>
            <span className="text-[#9ca3af] text-xs sm:text-sm mx-2">/</span>
            <Link 
              href={`/strategies/${categoryId}`}
              className="text-[#9ca3af] hover:text-[#f97316] text-xs sm:text-sm mb-2 inline-block transition-colors"
            >
              {categoryLabel}
            </Link>
            <span className="text-[#9ca3af] text-xs sm:text-sm mx-2">/</span>
            <span className="text-[#f97316] text-xs sm:text-sm font-medium">{subcategoryLabel}</span>
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
                You&apos;ve completed all {questions.length} questions in {subcategoryLabel}.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCurrentQuestionIndex(0)}
                  className="btn-primary"
                >
                  Start Over
                </button>
                <Link
                  href={`/strategies/${categoryId}`}
                  className="btn-secondary"
                >
                  Back to Subcategories
                </Link>
              </div>
            </div>
          ) : currentQuestion ? (
            <QuestionCard
              key={`strategy-${categoryId}-${subcategoryId}-${currentQuestion.id}`}
              question={currentQuestion}
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
                <span className="text-xs sm:text-sm text-[#6b7280]">Progress in {subcategoryLabel}</span>
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

