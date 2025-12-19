'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile, AssetCategory } from '@/types'
import { detectBlockTypeFromPath } from '@/lib/stats'
import { 
  TrendingUp,
  BarChart3,
  Coins,
  FileText,
  Globe,
  Percent,
  Layers,
  Loader2,
  ArrowRight
} from 'lucide-react'

const assets: Array<{
  id: AssetCategory
  label: string
  icon: React.ElementType
  color: string
  subcategories: string[]
}> = [
  {
    id: 'equity',
    label: 'Equities',
    icon: TrendingUp,
    color: '#10b981',
    subcategories: [
      'Cash equities (stock trading)',
      'Equity derivatives (options, futures, swaps)',
      'Equity-linked products (convertible bonds)',
      'Prime brokerage',
      'Program trading/algorithmic trading',
    ]
  },
  {
    id: 'fixed-income',
    label: 'Fixed Income',
    icon: BarChart3,
    color: '#6366f1',
    subcategories: [
      'Government bonds (Treasuries, Gilts, Bunds)',
      'Corporate bonds (Investment Grade and High Yield)',
      'Municipal bonds',
      'Mortgage-Backed Securities (MBS)',
      'Asset-Backed Securities (ABS)',
      'Collateralized Loan Obligations (CLOs)',
      'Emerging market debt',
    ]
  },
  {
    id: 'commodities',
    label: 'Commodities',
    icon: Coins,
    color: '#f59e0b',
    subcategories: [
      'Energy (crude oil, natural gas, power)',
      'Precious metals (gold, silver, platinum)',
      'Base metals (copper, aluminum)',
      'Agricultural commodities (wheat, corn, soybeans)',
    ]
  },
  {
    id: 'credit',
    label: 'Credit',
    icon: FileText,
    color: '#ef4444',
    subcategories: [
      'Credit Default Swaps (CDS)',
      'Total return swaps',
      'Credit indices',
      'Structured credit',
    ]
  },
  {
    id: 'foreign-exchange',
    label: 'Foreign Exchange',
    icon: Globe,
    color: '#8b5cf6',
    subcategories: [
      'Spot FX',
      'FX forwards and swaps',
      'FX options',
      'Emerging market currencies',
    ]
  },
  {
    id: 'rates-derivatives',
    label: 'Rates/Interest Rate Derivatives',
    icon: Percent,
    color: '#06b6d4',
    subcategories: [
      'Interest rate swaps',
      'Swaptions',
      'Caps and floors',
      'Inflation products',
    ]
  },
  {
    id: 'structured-products',
    label: 'Structured Products',
    icon: Layers,
    color: '#ec4899',
    subcategories: [
      'Equity-linked notes',
      'Credit-linked notes',
      'Hybrid products',
    ]
  },
]

export default function AssetsPage() {
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
              Asset Classes
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              Practice questions specific to different asset classes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {assets.map((asset) => {
              const Icon = asset.icon
              return (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#374151] transition-all card-hover group"
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${asset.color}20` }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: asset.color }} />
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-2">{asset.label}</h2>
                  
                  <div className="space-y-1.5 mb-4">
                    {asset.subcategories.slice(0, 3).map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#6b7280]">
                        <div 
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="line-clamp-1">{sub}</span>
                      </div>
                    ))}
                    {asset.subcategories.length > 3 && (
                      <div className="text-xs text-[#6b7280]">
                        +{asset.subcategories.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: asset.color }}>
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

