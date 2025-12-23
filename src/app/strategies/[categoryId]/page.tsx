'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile, StrategyCategory } from '@/types'
import { detectBlockTypeFromPath } from '@/lib/stats'
import { getStrategySubcategories, getStrategyQuestionCount } from '@/data/strategyQuestions'
import { Loader2, ArrowRight } from 'lucide-react'

const categoryLabels: Record<StrategyCategory, string> = {
  'equity-strategies': 'Equity Strategies',
  'fixed-income-strategies': 'Fixed Income Strategies',
  'alternative-strategies': 'Alternative Strategies',
  'macro-strategies': 'Macro Strategies',
  'quantitative-strategies': 'Quantitative Strategies',
  'income-strategies': 'Income Strategies',
  'multi-asset-strategies': 'Multi-Asset Strategies',
  'volatility-strategies': 'Volatility Strategies',
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
  'carry-vs-convexity': 'Carry vs Convexity',
  'long-vol-vs-short-vol-regimes': 'Long Vol vs Short Vol Regimes',
  'dispersion-trading': 'Dispersion Trading',
  'skew-trading': 'Skew Trading',
  'gamma-scalping': 'Gamma Scalping',
  'relative-value-vol': 'Relative Value Vol',
  'tail-hedging': 'Tail Hedging',
}

export default function StrategySubcategoriesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.categoryId as StrategyCategory
  const supabase = createClient()
  const pathname = `/strategies/${categoryId}`
  const blockType = detectBlockTypeFromPath(pathname)

  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error initializing:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (!categoryId || !categoryLabels[categoryId]) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Strategy category not found</h1>
          <Link href="/strategies" className="text-[#f97316] hover:underline">
            Back to Strategies
          </Link>
        </div>
      </div>
    )
  }

  const subcategories = getStrategySubcategories(categoryId)

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => {}} blockType={blockType} />

      <main className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <Link 
              href="/strategies"
              className="text-[#9ca3af] hover:text-[#f97316] text-sm mb-4 inline-block transition-colors"
            >
              ← Back to Strategies
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {categoryLabels[categoryId]}
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              Select a subcategory to start practicing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {subcategories.map((subcategoryId) => {
              const questionCount = getStrategyQuestionCount(categoryId, subcategoryId)
              const label = subcategoryLabels[subcategoryId] || subcategoryId
              
              return (
                <Link
                  key={subcategoryId}
                  href={`/strategies/${categoryId}/${subcategoryId}`}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#374151] transition-all card-hover group"
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#f9731620' }}
                  >
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: '#f97316' }}
                    />
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-2">{label}</h2>
                  
                  <div className="text-xs sm:text-sm text-[#6b7280] mb-4">
                    {questionCount} question{questionCount !== 1 ? 's' : ''}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all text-[#f97316]">
                    <span>Start Practicing</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

