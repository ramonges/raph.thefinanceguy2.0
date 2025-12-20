'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CategoryStats, UserStats } from '@/types'
import { salesCategoryLabels, tradingCategoryLabels, quantCategoryLabels, calculateStats } from '@/lib/stats'
import { createClient } from '@/lib/supabase/client'

interface StatisticsProps {
  stats: UserStats
  onClose: () => void
  blockType?: 'sales' | 'trading' | 'quant' | null
  userId?: string | null
  showGlobalStats?: boolean // If true, show global stats with track switching
}

// Color palette for categories (reused cyclically if needed)
const categoryColors = [
  '#f97316', // orange
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // green
  '#06b6d4', // cyan
  '#ef4444', // red
]

function getCategoryColor(categoryIndex: number): string {
  return categoryColors[categoryIndex % categoryColors.length]
}

function StatBar({ label, stats, color }: { label: string; stats: CategoryStats; color: string }) {
  const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-[#9ca3af]">
          {stats.correct}/{stats.total} ({percentage}%)
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}

export default function Statistics({ stats, onClose, blockType, userId, showGlobalStats = false }: StatisticsProps) {
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'sales' | 'trading' | 'quant'>(blockType || 'all')
  const [trackStats, setTrackStats] = useState<Record<string, UserStats>>({})
  const [loadingStats, setLoadingStats] = useState(false)
  const supabase = createClient()

  // Load stats for all tracks if showGlobalStats is true
  useEffect(() => {
    if (!userId || !showGlobalStats) return

    const loadAllStats = async () => {
      setLoadingStats(true)
      try {
        const { data: answeredQuestions } = await supabase
          .from('user_answered_questions')
          .select('*')
          .eq('user_id', userId)

        if (answeredQuestions) {
          // Calculate stats for all tracks
          const allStats = calculateStats(answeredQuestions, null) // null = all tracks
          const salesStats = calculateStats(answeredQuestions, 'sales')
          const tradingStats = calculateStats(answeredQuestions, 'trading')
          const quantStats = calculateStats(answeredQuestions, 'quant')

          setTrackStats({
            all: allStats,
            sales: salesStats,
            trading: tradingStats,
            quant: quantStats,
          })
        }
      } catch (error) {
        console.error('Error loading global stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    loadAllStats()
  }, [userId, showGlobalStats, supabase])

  // Determine which stats to display
  const displayStats: UserStats = showGlobalStats && trackStats[selectedTrack]
    ? trackStats[selectedTrack]
    : stats
  const displayBlockType = showGlobalStats ? (selectedTrack === 'all' ? null : selectedTrack) : blockType

  const overallPercentage = displayStats.overall.total > 0 
    ? Math.round((displayStats.overall.correct / displayStats.overall.total) * 100) 
    : 0

  const blockTypeLabels: Record<string, string> = {
    sales: 'Sales',
    trading: 'Trading',
    quant: 'Quant',
    all: 'All Tracks',
  }

  // Get category labels based on block type
  const getCategoryLabel = (category: string): string => {
    const currentBlockType = displayBlockType || selectedTrack
    if (currentBlockType === 'sales' && salesCategoryLabels[category]) {
      return salesCategoryLabels[category]
    }
    if (currentBlockType === 'trading' && tradingCategoryLabels[category]) {
      return tradingCategoryLabels[category]
    }
    if (currentBlockType === 'quant' && quantCategoryLabels[category]) {
      return quantCategoryLabels[category]
    }
    // Fallback: capitalize and format category name
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // Get categories sorted by total (most answered first)
  const categories = Object.keys(displayStats.byCategory).sort((a, b) => 
    displayStats.byCategory[b].total - displayStats.byCategory[a].total
  )

  return (
    <div className="stats-overlay" onClick={onClose}>
      <div 
        className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-4 sm:p-8 w-full max-w-lg mx-3 sm:mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Your Statistics</h2>
            {showGlobalStats ? (
              <div className="flex gap-2 mt-2">
                {(['all', 'sales', 'trading', 'quant'] as const).map((track) => (
                  <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      selectedTrack === track
                        ? 'bg-[#f97316] text-white'
                        : 'bg-[#1f2937] text-[#9ca3af] hover:bg-[#374151]'
                    }`}
                  >
                    {blockTypeLabels[track]}
                  </button>
                ))}
              </div>
            ) : displayBlockType && (
              <p className="text-sm text-[#6b7280] mt-1">
                {blockTypeLabels[displayBlockType]} Track
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-[#1f2937] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Stats */}
        <div className="bg-[#0a0f1a] rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold mb-1 sm:mb-2" style={{ color: '#f97316' }}>
              {overallPercentage}%
            </div>
            <p className="text-[#9ca3af] text-sm sm:text-base">
              {displayBlockType ? `${blockTypeLabels[displayBlockType]} ` : ''}Overall Accuracy
            </p>
            <p className="text-xs sm:text-sm text-[#6b7280] mt-1 sm:mt-2">
              {displayStats.overall.correct} correct out of {displayStats.overall.total} questions
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        {categories.length > 0 && (
          <>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">By Category</h3>
            
            {categories.map((category, index) => (
              <StatBar
                key={category}
                label={getCategoryLabel(category)}
                stats={displayStats.byCategory[category]}
                color={getCategoryColor(index)}
              />
            ))}
          </>
        )}

        {/* Summary */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[#0a0f1a] rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-[#f97316]">{displayStats.overall.total}</div>
            <p className="text-xs text-[#6b7280]">Total</p>
          </div>
          <div className="bg-[#0a0f1a] rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-500">{displayStats.overall.correct}</div>
            <p className="text-xs text-[#6b7280]">Correct</p>
          </div>
          <div className="bg-[#0a0f1a] rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-red-400">{displayStats.overall.wrong}</div>
            <p className="text-xs text-[#6b7280]">Wrong</p>
          </div>
        </div>

        {loadingStats && (
          <p className="text-center text-[#6b7280] mt-4 sm:mt-6 text-sm">
            Loading statistics...
          </p>
        )}

        {!loadingStats && displayStats.overall.total === 0 && (
          <p className="text-center text-[#6b7280] mt-4 sm:mt-6 text-sm">
            Start practicing to see your statistics!
          </p>
        )}
      </div>
    </div>
  )
}

