'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile } from '@/types'
import { detectBlockTypeFromPath } from '@/lib/stats'
import { assetQuestions } from '@/data/assetQuestions'
import { Loader2, ArrowRight } from 'lucide-react'

export default function AssetSubcategoriesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const assetId = params?.assetId as string
  const supabase = createClient()
  const pathname = `/assets/${assetId}`
  const blockType = detectBlockTypeFromPath(pathname)

  const asset = assetQuestions[assetId]

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

  if (!asset) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Asset not found</h1>
          <Link href="/assets" className="text-[#f97316] hover:underline">
            Back to Assets
          </Link>
        </div>
      </div>
    )
  }

  const subcategories = Object.values(asset.subcategories)

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => {}} blockType={blockType} />

      <main className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <Link 
              href="/assets"
              className="text-[#9ca3af] hover:text-[#f97316] text-sm mb-4 inline-block transition-colors"
            >
              ← Back to Assets
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {asset.label}
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              Select a subcategory to start practicing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/assets/${assetId}/${subcategory.id}`}
                className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#374151] transition-all card-hover group"
              >
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${asset.color}20` }}
                >
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: asset.color }}
                  />
                </div>

                <h2 className="text-lg sm:text-xl font-bold mb-2">{subcategory.label}</h2>
                
                <div className="text-xs sm:text-sm text-[#6b7280] mb-4">
                  {subcategory.questions.length} question{subcategory.questions.length !== 1 ? 's' : ''}
                </div>

                <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: asset.color }}>
                  <span>Start Practicing</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

