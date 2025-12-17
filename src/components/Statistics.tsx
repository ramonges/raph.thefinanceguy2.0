'use client'

import { X } from 'lucide-react'
import { Category, CategoryStats, UserStats } from '@/types'
import { categoryLabels } from '@/data/questions'

interface StatisticsProps {
  stats: UserStats
  onClose: () => void
}

const categoryColors: Record<Category, string> = {
  'mental-maths': '#f97316',
  'proba': '#6366f1',
  'trading': '#f59e0b',
  'behavioral': '#8b5cf6',
  'ml-ai': '#ec4899',
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

export default function Statistics({ stats, onClose }: StatisticsProps) {
  const overallPercentage = stats.overall.total > 0 
    ? Math.round((stats.overall.correct / stats.overall.total) * 100) 
    : 0

  return (
    <div className="stats-overlay" onClick={onClose}>
      <div 
        className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Your Statistics</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Stats */}
        <div className="bg-[#0a0f1a] rounded-xl p-6 mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2" style={{ color: '#f97316' }}>
              {overallPercentage}%
            </div>
            <p className="text-[#9ca3af]">Overall Accuracy</p>
            <p className="text-sm text-[#6b7280] mt-2">
              {stats.overall.correct} correct out of {stats.overall.total} questions
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <h3 className="text-lg font-semibold mb-4">By Category</h3>
        
        {(Object.keys(categoryColors) as Category[]).map((category) => (
          <StatBar
            key={category}
            label={categoryLabels[category]}
            stats={stats.byCategory[category]}
            color={categoryColors[category]}
          />
        ))}

        {/* Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-[#0a0f1a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#f97316]">{stats.overall.total}</div>
            <p className="text-xs text-[#6b7280]">Total Questions</p>
          </div>
          <div className="bg-[#0a0f1a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.overall.correct}</div>
            <p className="text-xs text-[#6b7280]">Correct</p>
          </div>
          <div className="bg-[#0a0f1a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.overall.wrong}</div>
            <p className="text-xs text-[#6b7280]">Wrong</p>
          </div>
        </div>

        {stats.overall.total === 0 && (
          <p className="text-center text-[#6b7280] mt-6">
            Start practicing to see your statistics!
          </p>
        )}
      </div>
    </div>
  )
}

