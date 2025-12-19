import { UserStats, CategoryStats, Category } from '@/types'
import { categoryLabels } from '@/data/questions'

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

export function calculateStats(
  answeredQuestions: Array<{
    section: string
    was_correct: boolean
    block_type?: string | null
  }>,
  blockType?: 'sales' | 'trading' | 'quant' | null
): UserStats {
  const newStats: UserStats = { ...emptyStats }
  newStats.byCategory = { ...emptyStats.byCategory }

  // Filter by block type if provided
  const filteredQuestions = blockType
    ? answeredQuestions.filter(q => q.block_type === blockType)
    : answeredQuestions

  filteredQuestions.forEach((q) => {
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

  return newStats
}

export function detectBlockTypeFromPath(pathname: string): 'sales' | 'trading' | 'quant' | null {
  if (pathname.startsWith('/sales')) return 'sales'
  if (pathname.startsWith('/trading')) return 'trading'
  if (pathname.startsWith('/quant')) return 'quant'
  return null
}

