'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import { categoryLabels } from '@/data/questions'
import { Profile, UserMissedQuestion, Category, UserStats } from '@/types'
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  Brain, 
  TrendingUp, 
  Users, 
  Cpu,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'

const categoryIcons: Record<Category, React.ElementType> = {
  'mental-maths': Calculator,
  'proba': Brain,
  'trading': TrendingUp,
  'behavioral': Users,
  'ml-ai': Cpu,
}

const categoryColors: Record<Category, string> = {
  'mental-maths': '#00d4aa',
  'proba': '#6366f1',
  'trading': '#f59e0b',
  'behavioral': '#8b5cf6',
  'ml-ai': '#ec4899',
}

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

function MissedQuestionCard({ 
  question, 
  expanded, 
  onToggle,
  onMarkReviewed 
}: { 
  question: UserMissedQuestion
  expanded: boolean
  onToggle: () => void
  onMarkReviewed: () => void
}) {
  const section = question.section as Category
  const Icon = categoryIcons[section] || Calculator
  const color = categoryColors[section] || '#00d4aa'

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#374151]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
              {categoryLabels[section]}
            </span>
            <span className="text-xs text-[#6b7280]">Q{question.question_number}</span>
            {question.reviewed && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                Reviewed
              </span>
            )}
          </div>
          <p className="text-[#e8eaed] line-clamp-2">{question.question_text}</p>
        </div>

        <div className="flex-shrink-0">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[#6b7280]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#6b7280]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-[#1f2937] pt-4 fade-in">
          <div className="bg-[#0a0f1a] rounded-xl p-4 mb-4">
            <h4 className="text-sm font-semibold text-[#00d4aa] mb-2">Correct Answer:</h4>
            <p className="text-[#e8eaed] whitespace-pre-wrap">{question.correct_answer}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6b7280]">
              Attempted: {new Date(question.user_attempted_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            {!question.reviewed && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkReviewed()
                }}
                className="flex items-center gap-2 text-sm text-[#00d4aa] hover:text-[#00b894] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Reviewed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MissedQuestionsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [missedQuestions, setMissedQuestions] = useState<UserMissedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [showReviewed, setShowReviewed] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        // Fetch missed questions
        const { data: missedData } = await supabase
          .from('user_missed_questions')
          .select('*')
          .eq('user_id', user.id)
          .order('user_attempted_at', { ascending: false })

        if (missedData) {
          setMissedQuestions(missedData)
        }

        // Fetch stats
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', user.id)

        if (answeredQuestions) {
          const newStats: UserStats = { ...emptyStats }
          newStats.byCategory = { ...emptyStats.byCategory }

          answeredQuestions.forEach((q) => {
            const section = q.section as Category
            if (newStats.byCategory[section]) {
              newStats.byCategory[section].total++
              newStats.overall.total++
              if (q.was_correct) {
                newStats.byCategory[section].correct++
                newStats.overall.correct++
              } else {
                newStats.byCategory[section].wrong++
                newStats.overall.wrong++
              }
            }
          })

          // Calculate percentages
          Object.keys(newStats.byCategory).forEach((cat) => {
            const c = cat as Category
            if (newStats.byCategory[c].total > 0) {
              newStats.byCategory[c].percentage = Math.round(
                (newStats.byCategory[c].correct / newStats.byCategory[c].total) * 100
              )
            }
          })
          if (newStats.overall.total > 0) {
            newStats.overall.percentage = Math.round(
              (newStats.overall.correct / newStats.overall.total) * 100
            )
          }

          setStats(newStats)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error initializing:', error)
        setLoading(false)
      }
    }

    initialize()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkReviewed = async (questionId: string) => {
    try {
      await supabase
        .from('user_missed_questions')
        .update({ reviewed: true })
        .eq('id', questionId)

      setMissedQuestions(prev =>
        prev.map(q => q.id === questionId ? { ...q, reviewed: true } : q)
      )
    } catch (error) {
      console.error('Error marking as reviewed:', error)
    }
  }

  const filteredQuestions = missedQuestions.filter(q => {
    if (filterCategory !== 'all' && q.section !== filterCategory) return false
    if (!showReviewed && q.reviewed) return false
    return true
  })

  const categoryCounts = missedQuestions.reduce((acc, q) => {
    const cat = q.section as Category
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<Category, number>)

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00d4aa]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => setShowStats(true)} />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Missed Questions</h1>
            <p className="text-[#9ca3af]">
              Review questions you got wrong to improve your understanding.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === 'all'
                      ? 'bg-[#00d4aa] text-[#0a0f1a]'
                      : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  All ({missedQuestions.length})
                </button>
                {(Object.keys(categoryLabels) as Category[]).map((cat) => {
                  const count = categoryCounts[cat] || 0
                  if (count === 0) return null
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterCategory === cat
                          ? 'text-[#0a0f1a]'
                          : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                      }`}
                      style={filterCategory === cat ? { backgroundColor: categoryColors[cat] } : {}}
                    >
                      {categoryLabels[cat]} ({count})
                    </button>
                  )
                })}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showReviewed}
                  onChange={(e) => setShowReviewed(e.target.checked)}
                  className="w-4 h-4 rounded border-[#374151] bg-[#1f2937] text-[#00d4aa] focus:ring-[#00d4aa] focus:ring-offset-0"
                />
                <span className="text-sm text-[#9ca3af]">Show reviewed</span>
              </label>
            </div>
          </div>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-[#00d4aa]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {missedQuestions.length === 0 ? (
                  <CheckCircle2 className="w-8 h-8 text-[#00d4aa]" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-[#f59e0b]" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {missedQuestions.length === 0 
                  ? "No missed questions yet!"
                  : "No questions match your filters"
                }
              </h2>
              <p className="text-[#9ca3af]">
                {missedQuestions.length === 0 
                  ? "Start practicing to track your progress. Questions you get wrong will appear here for review."
                  : "Try adjusting your filter settings to see more questions."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <MissedQuestionCard
                  key={question.id}
                  question={question}
                  expanded={expandedId === question.id}
                  onToggle={() => setExpandedId(expandedId === question.id ? null : question.id)}
                  onMarkReviewed={() => handleMarkReviewed(question.id)}
                />
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {missedQuestions.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#e8eaed]">{missedQuestions.length}</div>
                <p className="text-xs text-[#6b7280]">Total Missed</p>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {missedQuestions.filter(q => q.reviewed).length}
                </div>
                <p className="text-xs text-[#6b7280]">Reviewed</p>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#f59e0b]">
                  {missedQuestions.filter(q => !q.reviewed).length}
                </div>
                <p className="text-xs text-[#6b7280]">Pending Review</p>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: categoryColors[filterCategory as Category] || '#00d4aa' }}>
                  {filteredQuestions.length}
                </div>
                <p className="text-xs text-[#6b7280]">Showing</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Statistics Modal */}
      {showStats && (
        <Statistics stats={stats} onClose={() => setShowStats(false)} />
      )}
    </div>
  )
}

