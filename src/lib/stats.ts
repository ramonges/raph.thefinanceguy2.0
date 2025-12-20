import { UserStats, CategoryStats } from '@/types'

// Category labels for each track
export const salesCategoryLabels: Record<string, string> = {
  'behavioral-fit': 'Behavioral & Commercial Judgment',
  'market-awareness': 'Market Awareness',
  'product-knowledge': 'Product Knowledge',
  'sales-case': 'Sales Cases',
}

export const tradingCategoryLabels: Record<string, string> = {
  'behavioral': 'Behavioral Questions',
  'mental-calculation': 'Mental Calculation',
  'proba-exercises': 'Proba Exercises',
  'brainteaser': 'Brainteaser',
  'trading-intuition': 'Trading Intuition',
  'ml-questions': 'ML Questions',
}

export const quantCategoryLabels: Record<string, string> = {
  'mental-calculations': 'Mental Calculations',
  'probability-exercises': 'Probability Exercises',
  'brainteasers': 'Brainteasers',
  'coding-project': 'Coding Projects',
  'statistics-ml': 'Statistics & ML',
  'trading-intuition': 'Trading Intuition',
  'research-discussion': 'Research Discussion',
}

// Extract category from section string (e.g., "sales-behavioral-fit" -> "behavioral-fit")
function extractCategory(section: string, blockType: string | null): string | null {
  if (!blockType) return null
  
  const prefix = `${blockType}-`
  if (section.startsWith(prefix)) {
    return section.substring(prefix.length)
  }
  return null
}

export function calculateStats(
  answeredQuestions: Array<{
    section: string
    was_correct: boolean
    block_type?: string | null
  }>,
  blockType?: 'sales' | 'trading' | 'quant' | null
): UserStats {
  const newStats: UserStats = {
    overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
    byCategory: {}
  }

  // Filter by block type if provided
  const filteredQuestions = blockType
    ? answeredQuestions.filter(q => q.block_type === blockType)
    : answeredQuestions

  filteredQuestions.forEach((q) => {
    // Extract category from section (e.g., "sales-behavioral-fit" -> "behavioral-fit")
    const category = extractCategory(q.section, blockType || null)
    if (!category) return

    // Initialize category stats if not exists
    if (!newStats.byCategory[category]) {
      newStats.byCategory[category] = { total: 0, correct: 0, wrong: 0, percentage: 0 }
    }

    // Update stats
    newStats.byCategory[category].total++
    newStats.overall.total++
    
    if (q.was_correct) {
      newStats.byCategory[category].correct++
      newStats.overall.correct++
    } else {
      newStats.byCategory[category].wrong++
      newStats.overall.wrong++
    }
  })

  // Calculate percentages
  Object.keys(newStats.byCategory).forEach((cat) => {
    if (newStats.byCategory[cat].total > 0) {
      newStats.byCategory[cat].percentage = Math.round(
        (newStats.byCategory[cat].correct / newStats.byCategory[cat].total) * 100
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

