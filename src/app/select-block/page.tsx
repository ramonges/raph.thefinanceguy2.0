'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile } from '@/types'
import { detectBlockTypeFromPath } from '@/lib/stats'
import { 
  Users, 
  TrendingUp, 
  Calculator,
  ArrowRight,
  Loader2
} from 'lucide-react'

const blocks = [
  {
    id: 'sales',
    title: 'Sales',
    icon: Users,
    color: '#6366f1',
    description: 'Master client relationships and product knowledge',
    categories: [
      { id: 'behavioral-fit', label: 'Behavioral & Fit' },
      { id: 'market-awareness', label: 'Market Awareness' },
      { id: 'product-knowledge', label: 'Product Knowledge' },
      { id: 'sales-case', label: 'Sales Case' },
    ],
    href: '/sales'
  },
  {
    id: 'trading',
    title: 'Trading',
    icon: TrendingUp,
    color: '#f97316',
    description: 'Develop trading intuition and quantitative skills',
    categories: [
      { id: 'behavioral', label: 'Behavioral Questions' },
      { id: 'mental-calculation', label: 'Mental Calculation' },
      { id: 'proba-exercises', label: 'Proba Exercises' },
      { id: 'brainteaser', label: 'Brainteaser' },
      { id: 'trading-intuition', label: 'Trading Intuition' },
      { id: 'ml-questions', label: 'ML Questions' },
    ],
    href: '/trading'
  },
  {
    id: 'quant',
    title: 'Quant',
    icon: Calculator,
    color: '#10b981',
    description: 'Excel in quantitative analysis and coding',
    categories: [
      { id: 'mental-calculations', label: 'Mental Calculations' },
      { id: 'probability-exercises', label: 'Probability Exercises' },
      { id: 'brainteasers', label: 'Brainteasers' },
      { id: 'coding-project', label: 'Coding Project' },
      { id: 'statistics-ml', label: 'Statistics & ML' },
      { id: 'trading-intuition', label: 'Trading Intuition' },
      { id: 'research-discussion', label: 'Research Discussion' },
    ],
    href: '/quant'
  },
]

export default function SelectBlockPage() {
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
  })

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
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Choose Your Path
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg max-w-2xl mx-auto">
              Select a track to start your interview preparation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {blocks.map((block) => {
              const Icon = block.icon
              return (
                <Link
                  key={block.id}
                  href={block.href}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-[#374151] transition-all duration-200 card-hover group"
                >
                  <div 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6"
                    style={{ backgroundColor: `${block.color}20` }}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: block.color }} />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{block.title}</h2>
                  <p className="text-[#9ca3af] text-sm sm:text-base mb-4 sm:mb-6">
                    {block.description}
                  </p>

                  <div className="space-y-2 mb-4 sm:mb-6">
                    {block.categories.map((cat) => (
                      <div 
                        key={cat.id}
                        className="flex items-center gap-2 text-xs sm:text-sm text-[#6b7280]"
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: block.color }}
                        />
                        <span>{cat.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm sm:text-base font-medium group-hover:gap-3 transition-all" style={{ color: block.color }}>
                    <span>Start Practicing</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Additional Links */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              href="/assets"
              className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-[#374151] transition-all card-hover"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2">Asset Classes</h3>
              <p className="text-[#9ca3af] text-sm sm:text-base mb-4">
                Practice questions specific to Equity, Fixed Income, Commodities, FX, Credit, Rates, and Structured Products
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-[#f97316]">
                <span>Explore Assets</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/strategies"
              className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-[#374151] transition-all card-hover"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2">Trading Strategies</h3>
              <p className="text-[#9ca3af] text-sm sm:text-base mb-4">
                Master Equity, Fixed Income, Alternative, Macro, Quantitative, Income, and Multi-Asset strategies
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-[#f97316]">
                <span>Explore Strategies</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

