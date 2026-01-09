'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import { categoryLabels } from '@/data/questions'
import { Profile, UserMissedQuestion, Category, UserStats } from '@/types'
import { calculateStats, detectBlockTypeFromPath } from '@/lib/stats'
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
  'mental-maths': '#f97316',
  'proba': '#6366f1',
  'trading': '#f59e0b',
  'behavioral': '#8b5cf6',
  'ml-ai': '#ec4899',
}

const emptyStats: UserStats = {
  overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
  byCategory: {}
}

function MissedQuestionCard({ 
  question, 
  expanded, 
  onToggle,
  onMarkReviewed,
  onMarkUnderstood
}: { 
  question: UserMissedQuestion
  expanded: boolean
  onToggle: () => void
  onMarkReviewed: () => void
  onMarkUnderstood: () => void
}) {
  const section = question.section as Category
  const Icon = categoryIcons[section] || Calculator
  const color = categoryColors[section] || '#f97316'

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#374151]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 sm:gap-4 p-3 sm:p-5 text-left"
      >
        <div 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1 flex-wrap">
            <span className="text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
              {categoryLabels[section]}
            </span>
            <span className="text-xs text-[#6b7280]">Q{question.question_number}</span>
            {question.reviewed && (
              <span className="flex items-center gap-0.5 sm:gap-1 text-xs text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Reviewed</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-base text-[#e8eaed] line-clamp-2 leading-relaxed">{question.question_text}</p>
        </div>

        <div className="flex-shrink-0 ml-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280]" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-[#1f2937] pt-3 sm:pt-4 fade-in">
          <div className="bg-[#0a0f1a] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
            <h4 className="text-xs sm:text-sm font-semibold text-[#f97316] mb-2">Correct Answer:</h4>
            <p className="text-sm sm:text-base text-[#e8eaed] whitespace-pre-wrap">{question.correct_answer}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-[#6b7280]">
              Attempted: {new Date(question.user_attempted_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {!question.reviewed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMarkReviewed()
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#f97316] hover:text-[#ea580c] transition-colors px-2 py-1.5 rounded-lg hover:bg-[#f97316]/10"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Mark as Reviewed</span>
                </button>
              )}
              {!question.understood && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMarkUnderstood()
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-green-400/10"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>I understood</span>
                </button>
              )}
            </div>
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
  const [filterBlockType, setFilterBlockType] = useState<string | 'all'>('all')
  const [filterAssetCategory, setFilterAssetCategory] = useState<string | 'all'>('all')
  const [filterStrategyCategory, setFilterStrategyCategory] = useState<string | 'all'>('all')
  const [showReviewed, setShowReviewed] = useState(true)
  const [showUnderstood, setShowUnderstood] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const blockType = detectBlockTypeFromPath(pathname)

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
          // Calculate stats filtered by block type
          const newStats = calculateStats(answeredQuestions, blockType || undefined)
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

  const handleMarkUnderstood = async (questionId: string) => {
    try {
      await supabase
        .from('user_missed_questions')
        .update({ understood: true })
        .eq('id', questionId)

      setMissedQuestions(prev =>
        prev.filter(q => q.id !== questionId)
      )
    } catch (error) {
      console.error('Error marking as understood:', error)
    }
  }

  const filteredQuestions = missedQuestions.filter(q => {
    if (filterCategory !== 'all' && q.section !== filterCategory) return false
    if (filterBlockType !== 'all' && q.block_type !== filterBlockType) return false
    if (filterAssetCategory !== 'all' && q.asset_category !== filterAssetCategory) return false
    if (filterStrategyCategory !== 'all' && q.strategy_category !== filterStrategyCategory) return false
    if (!showReviewed && q.reviewed) return false
    if (!showUnderstood && q.understood) return false
    return true
  })

  // Get unique filter values
  const blockTypes = Array.from(new Set(missedQuestions.map(q => q.block_type).filter((bt): bt is string => Boolean(bt))))
  const assetCategories = Array.from(new Set(missedQuestions.map(q => q.asset_category).filter((ac): ac is string => Boolean(ac))))
  const strategyCategories = Array.from(new Set(missedQuestions.map(q => q.strategy_category).filter((sc): sc is string => Boolean(sc))))

  const categoryCounts = missedQuestions.reduce((acc, q) => {
    const cat = q.section as Category
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<Category, number>)

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => setShowStats(true)} blockType={blockType} />

      <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Missed Questions</h1>
            <p className="text-sm sm:text-base text-[#9ca3af]">
              Review questions you got wrong to improve your understanding.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            {/* Main Category Filters */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
              <button
                onClick={() => {
                  setFilterCategory('all')
                  setFilterBlockType('all')
                  setFilterAssetCategory('all')
                  setFilterStrategyCategory('all')
                }}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filterCategory === 'all' && filterBlockType === 'all' && filterAssetCategory === 'all' && filterStrategyCategory === 'all'
                    ? 'bg-[#f97316] text-[#0a0f1a]'
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
                    className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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

            {/* Block Type Filters */}
            {blockTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <span className="text-xs text-[#6b7280] self-center whitespace-nowrap mr-0.5 sm:mr-0">Block:</span>
                <button
                  onClick={() => setFilterBlockType('all')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors ${
                    filterBlockType === 'all'
                      ? 'bg-[#6366f1] text-white'
                      : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  All
                </button>
                {blockTypes.map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setFilterBlockType(bt)}
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors capitalize ${
                      filterBlockType === bt
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            )}

            {/* Asset Category Filters */}
            {assetCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <span className="text-xs text-[#6b7280] self-center whitespace-nowrap mr-0.5 sm:mr-0">Asset:</span>
                <button
                  onClick={() => setFilterAssetCategory('all')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors ${
                    filterAssetCategory === 'all'
                      ? 'bg-[#10b981] text-white'
                      : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  All
                </button>
                {assetCategories.map((ac) => (
                  <button
                    key={ac}
                    onClick={() => setFilterAssetCategory(ac)}
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors ${
                      filterAssetCategory === ac
                        ? 'bg-[#10b981] text-white'
                        : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {ac.replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}

            {/* Strategy Category Filters */}
            {strategyCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <span className="text-xs text-[#6b7280] self-center whitespace-nowrap mr-0.5 sm:mr-0">Strategy:</span>
                <button
                  onClick={() => setFilterStrategyCategory('all')}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors ${
                    filterStrategyCategory === 'all'
                      ? 'bg-[#8b5cf6] text-white'
                      : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  All
                </button>
                {strategyCategories.map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setFilterStrategyCategory(sc)}
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium transition-colors break-words ${
                      filterStrategyCategory === sc
                        ? 'bg-[#8b5cf6] text-white'
                        : 'bg-[#1f2937] text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {sc.replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}

            {/* Toggle Options */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 border-t border-[#1f2937]">
              <label className="flex items-center gap-2 cursor-pointer py-1.5 sm:py-0 -mx-1 px-1 sm:mx-0 sm:px-0 rounded-lg sm:rounded-none hover:bg-[#1f2937]/50 sm:hover:bg-transparent transition-colors">
                <input
                  type="checkbox"
                  checked={showReviewed}
                  onChange={(e) => setShowReviewed(e.target.checked)}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded border-[#374151] bg-[#1f2937] text-[#f97316] focus:ring-2 focus:ring-[#f97316] focus:ring-offset-0 cursor-pointer flex-shrink-0"
                />
                <span className="text-sm sm:text-sm text-[#9ca3af] select-none">Show reviewed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer py-1.5 sm:py-0 -mx-1 px-1 sm:mx-0 sm:px-0 rounded-lg sm:rounded-none hover:bg-[#1f2937]/50 sm:hover:bg-transparent transition-colors">
                <input
                  type="checkbox"
                  checked={showUnderstood}
                  onChange={(e) => setShowUnderstood(e.target.checked)}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded border-[#374151] bg-[#1f2937] text-[#f97316] focus:ring-2 focus:ring-[#f97316] focus:ring-offset-0 cursor-pointer flex-shrink-0"
                />
                <span className="text-sm sm:text-sm text-[#9ca3af] select-none">Show understood</span>
              </label>
            </div>
          </div>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-[#f97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {missedQuestions.length === 0 ? (
                  <CheckCircle2 className="w-8 h-8 text-[#f97316]" />
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
            <div className="space-y-2 sm:space-y-3">
              {filteredQuestions.map((question) => (
                <MissedQuestionCard
                  key={question.id}
                  question={question}
                  expanded={expandedId === question.id}
                  onToggle={() => setExpandedId(expandedId === question.id ? null : question.id)}
                  onMarkReviewed={() => handleMarkReviewed(question.id)}
                  onMarkUnderstood={() => handleMarkUnderstood(question.id)}
                />
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {missedQuestions.length > 0 && (
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-[#111827] border border-[#1f2937] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-[#e8eaed]">{missedQuestions.length}</div>
                <p className="text-xs text-[#6b7280] mt-1">Total Missed</p>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {missedQuestions.filter(q => q.reviewed).length}
                </div>
                <p className="text-xs text-[#6b7280] mt-1">Reviewed</p>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-[#f59e0b]">
                  {missedQuestions.filter(q => !q.reviewed).length}
                </div>
                <p className="text-xs text-[#6b7280] mt-1">Pending Review</p>
              </div>
              <div className="bg-[#111827] border border-[#1f2937] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold" style={{ color: categoryColors[filterCategory as Category] || '#f97316' }}>
                  {filteredQuestions.length}
                </div>
                <p className="text-xs text-[#6b7280] mt-1">Showing</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Statistics Modal */}
      {showStats && (
        <Statistics 
          stats={stats} 
          onClose={() => setShowStats(false)} 
          blockType={blockType || undefined}
          userId={profile?.id || null}
          showGlobalStats={true}
        />
      )}
    </div>
  )
}

