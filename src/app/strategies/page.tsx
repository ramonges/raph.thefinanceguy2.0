'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile, StrategyCategory } from '@/types'
import { detectBlockTypeFromPath } from '@/lib/stats'
import { 
  TrendingUp,
  BarChart3,
  Zap,
  Globe,
  Calculator,
  DollarSign,
  Layers,
  Loader2,
  ArrowRight
} from 'lucide-react'

const strategies: Array<{
  id: StrategyCategory
  label: string
  icon: React.ElementType
  color: string
  subcategories: string[]
}> = [
  {
    id: 'equity-strategies',
    label: 'Equity Strategies',
    icon: TrendingUp,
    color: '#10b981',
    subcategories: [
      'Momentum (trend-following)',
      'Growth (high-growth companies)',
      'Value (undervalued securities)',
      'Quality (strong fundamentals)',
      'Dividend/Income',
      'Low Volatility/Defensive',
      'Size (Small-cap, Mid-cap, Large-cap)',
      'GARP (Growth at Reasonable Price)',
      'Contrarian',
      'Event-Driven (mergers, restructurings)',
    ]
  },
  {
    id: 'fixed-income-strategies',
    label: 'Fixed Income Strategies',
    icon: BarChart3,
    color: '#6366f1',
    subcategories: [
      'Duration (interest rate positioning)',
      'Credit (spread strategies)',
      'Carry (yield harvesting)',
      'Curve (yield curve positioning)',
      'Relative Value',
      'Barbell/Bullet/Ladder',
      'Inflation-Protected',
    ]
  },
  {
    id: 'alternative-strategies',
    label: 'Alternative Strategies',
    icon: Zap,
    color: '#f59e0b',
    subcategories: [
      'Long/Short Equity',
      'Market Neutral',
      'Merger Arbitrage',
      'Convertible Arbitrage',
      'Volatility Arbitrage',
      'Statistical Arbitrage (StatArb)',
      'Pairs Trading',
    ]
  },
  {
    id: 'macro-strategies',
    label: 'Macro Strategies',
    icon: Globe,
    color: '#8b5cf6',
    subcategories: [
      'Global Macro',
      'Currency Carry',
      'Commodity Trend Following',
      'CTA (Commodity Trading Advisor)',
      'Discretionary Macro',
    ]
  },
  {
    id: 'quantitative-strategies',
    label: 'Quantitative Strategies',
    icon: Calculator,
    color: '#06b6d4',
    subcategories: [
      'Factor Investing (Multi-factor)',
      'Mean Reversion',
      'Algorithmic Trading',
      'High-Frequency Trading (HFT)',
      'Machine Learning-based',
    ]
  },
  {
    id: 'income-strategies',
    label: 'Income Strategies',
    icon: DollarSign,
    color: '#ec4899',
    subcategories: [
      'High Yield/Dividend Focused',
      'Covered Call Writing',
      'Preferred Securities',
      'Multi-Asset Income',
    ]
  },
  {
    id: 'multi-asset-strategies',
    label: 'Multi-Asset Strategies',
    icon: Layers,
    color: '#f97316',
    subcategories: [
      'Risk Parity',
      'Tactical Asset Allocation',
      'Strategic Asset Allocation',
      'Target Date/Target Risk',
      'Balanced/60-40',
    ]
  },
]

export default function StrategiesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => {}} blockType={blockType} />

      <main className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Trading Strategies
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              Master different trading strategies across asset classes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {strategies.map((strategy) => {
              const Icon = strategy.icon
              return (
                <Link
                  key={strategy.id}
                  href={`/strategies/${strategy.id}`}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#374151] transition-all card-hover group"
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${strategy.color}20` }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: strategy.color }} />
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-2">{strategy.label}</h2>
                  
                  <div className="space-y-1.5 mb-4">
                    {strategy.subcategories.slice(0, 3).map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#6b7280]">
                        <div 
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: strategy.color }}
                        />
                        <span className="line-clamp-1">{sub}</span>
                      </div>
                    ))}
                    {strategy.subcategories.length > 3 && (
                      <div className="text-xs text-[#6b7280]">
                        +{strategy.subcategories.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: strategy.color }}>
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

