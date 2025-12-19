'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile } from '@/types'
import { detectBlockTypeFromPath } from '@/lib/stats'
import { salesBlockQuestions, salesCategoryLabels } from '@/data/salesBlockQuestions'
import { Loader2, ArrowRight, Users, TrendingUp, BookOpen, Briefcase } from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  'behavioral-fit': Users,
  'market-awareness': TrendingUp,
  'product-knowledge': BookOpen,
  'sales-case': Briefcase,
}

export default function SalesPage() {
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

  const categories = Object.keys(salesBlockQuestions) as Array<keyof typeof salesBlockQuestions>

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => {}} blockType={blockType} />

      <main className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <Link 
              href="/select-block"
              className="text-[#9ca3af] hover:text-[#f97316] text-sm mb-4 inline-block transition-colors"
            >
              ← Back to Blocks
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Sales Track
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              Select a category to start practicing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((categoryId) => {
              const Icon = categoryIcons[categoryId]
              const questions = salesBlockQuestions[categoryId]
              const questionCount = Array.isArray(questions) ? questions.length : 0
              
              return (
                <Link
                  key={categoryId}
                  href={`/sales/${categoryId}`}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#374151] transition-all card-hover group"
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#6366f120' }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6366f1]" />
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-2">{salesCategoryLabels[categoryId]}</h2>
                  
                  <div className="text-xs sm:text-sm text-[#6b7280] mb-4">
                    {questionCount} question{questionCount !== 1 ? 's' : ''}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all text-[#6366f1]">
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

