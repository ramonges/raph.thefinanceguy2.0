'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import QuestionCard from '@/components/QuestionCard'
import { allQuestions, categoryLabels } from '@/data/questions'
import { Category, UserStats, Profile } from '@/types'
import { Calculator, Brain, TrendingUp, Users, Cpu, Loader2 } from 'lucide-react'
import { calculateStats, detectBlockTypeFromPath } from '@/lib/stats'

const categoryIcons: Record<Category, React.ElementType> = {
  'mental-maths': Calculator,
  'proba': Brain,
  'trading': TrendingUp,
  'behavioral': Users,
  'ml-ai': Cpu,
}

const categories: Category[] = ['mental-maths', 'proba', 'trading', 'behavioral', 'ml-ai']

const emptyStats: UserStats = {
  overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
  byCategory: {}
}

export default function TrainingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('mental-maths')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<Record<Category, number>>({
    'mental-maths': 0,
    'proba': 0,
    'trading': 0,
    'behavioral': 0,
    'ml-ai': 0,
  })
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const blockType = detectBlockTypeFromPath(pathname)

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

        // Fetch answered questions for stats
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', user.id)

        if (answeredQuestions) {
          // Calculate stats filtered by block type
          const newStats = calculateStats(answeredQuestions, blockType || undefined)
          setStats(newStats)

          // Calculate current question index for each category
          const newIndices = { ...currentQuestionIndex }
          categories.forEach((cat) => {
            const categoryAnswers = answeredQuestions.filter(q => q.section === cat)
            const maxQuestionNumber = categoryAnswers.length > 0
              ? Math.max(...categoryAnswers.map(q => q.question_number))
              : 0
            
            const totalInCategory = allQuestions[cat].length
            // If user completed all questions, set to total (shows "Complete" screen)
            // Otherwise, set to max answered (shows next question)
            newIndices[cat] = maxQuestionNumber >= totalInCategory 
              ? totalInCategory 
              : maxQuestionNumber
          })
          setCurrentQuestionIndex(newIndices)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error initializing:', error)
        setLoading(false)
      }
    }

    initialize()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback(async (correct: boolean, timeSpent: number) => {
    if (!userId) return

    const questions = allQuestions[activeCategory]
    const currentIndex = currentQuestionIndex[activeCategory]
    const question = questions[currentIndex]

    try {
      // Record the answer
      await supabase.from('user_answered_questions').upsert({
        user_id: userId,
        section: activeCategory,
        question_number: currentIndex + 1,
        was_correct: correct,
        time_spent: timeSpent,
      }, {
        onConflict: 'user_id,section,question_number',
      })

      // If wrong, add to missed questions
      if (!correct) {
        const questionText = 'prompt' in question ? question.prompt : question.question
        const answerText = 'answer' in question ? question.answer : question.starChecks.join(', ')
        
        await supabase.from('user_missed_questions').upsert({
          user_id: userId,
          section: activeCategory,
          question_number: currentIndex + 1,
          question_text: questionText,
          correct_answer: answerText,
          reviewed: false,
        }, {
          onConflict: 'user_id,section,question_number',
        })
      } else {
        // If correct and it was previously missed, mark as reviewed
        await supabase
          .from('user_missed_questions')
          .update({ reviewed: true })
          .eq('user_id', userId)
          .eq('section', activeCategory)
          .eq('question_number', currentIndex + 1)
      }

      // Update stats locally
      setStats(prev => {
        const newStats = { ...prev }
        newStats.byCategory = { ...prev.byCategory }
        newStats.byCategory[activeCategory] = { ...prev.byCategory[activeCategory] }
        newStats.overall = { ...prev.overall }

        newStats.byCategory[activeCategory].total++
        newStats.overall.total++

        if (correct) {
          newStats.byCategory[activeCategory].correct++
          newStats.overall.correct++
        } else {
          newStats.byCategory[activeCategory].wrong++
          newStats.overall.wrong++
        }

        return newStats
      })

      // Move to next question
      const nextIndex = currentIndex + 1
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(prev => ({
          ...prev,
          [activeCategory]: nextIndex,
        }))
      }
    } catch (error) {
      console.error('Error recording answer:', error)
    }
  }, [userId, activeCategory, currentQuestionIndex, supabase])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  const questions = allQuestions[activeCategory]
  const currentIndex = currentQuestionIndex[activeCategory]
  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => setShowStats(true)} blockType={blockType} />

      <main className="pt-16 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 mb-4 sm:mb-8 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`category-tab flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 sm:px-4 py-1.5 sm:py-3 ${
                      activeCategory === cat ? 'active' : ''
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{categoryLabels[cat]}</span>
                  </button>
                )
              })}
            </div>
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
                You&apos;ve completed all {questions.length} questions in {categoryLabels[activeCategory]}.
              </p>
              <button
                onClick={() => setCurrentQuestionIndex(prev => ({ ...prev, [activeCategory]: 0 }))}
                className="btn-primary"
              >
                Start Over
              </button>
            </div>
          ) : (
            <QuestionCard
              key={`${activeCategory}-${currentQuestion.id}`}
              question={currentQuestion}
              category={activeCategory}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />
          )}

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-[#6b7280]">Progress in {categoryLabels[activeCategory]}</span>
              <span className="text-xs sm:text-sm text-[#6b7280]">
                {currentIndex}/{questions.length}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill bg-[#f97316]"
                style={{ width: `${(currentIndex / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Modal */}
      {showStats && (
        <Statistics stats={stats} onClose={() => setShowStats(false)} blockType={blockType || undefined} />
      )}
    </div>
  )
}

