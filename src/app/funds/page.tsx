'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile } from '@/types'
import { fundsData, Fund } from '@/data/funds'
import { Search, ExternalLink, Building2, MapPin, Loader2, X } from 'lucide-react'

export default function FundsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch profile
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

  // Filter funds based on search query
  const filteredData = fundsData.map(region => ({
    ...region,
    cities: region.cities
      .map(city => ({
        ...city,
        funds: city.funds.filter(fund =>
          fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.region.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(city => city.funds.length > 0)
  })).filter(region => region.cities.length > 0)

  const handleFundClick = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => {}} />

      <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Funds</h1>
            <p className="text-sm sm:text-base text-[#9ca3af]">
              Explore trading firms and hedge funds by location
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none transition-colors group-focus-within:text-[#f97316]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by fund name, city, or region..."
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-[#111827] border border-[#1f2937] rounded-xl text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all duration-200 text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#1f2937] transition-colors text-[#6b7280] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Funds List */}
          {filteredData.length === 0 ? (
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-12 text-center">
              <Search className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No funds found</h2>
              <p className="text-[#9ca3af]">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {filteredData.map((region) => (
                <div key={region.region} className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#f97316]" />
                    {region.region}
                  </h2>

                  <div className="space-y-6 sm:space-y-8">
                    {region.cities.map((city) => (
                      <div key={city.city} className="border-l-2 border-[#1f2937] pl-4 sm:pl-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366f1]" />
                          {city.city}
                          <span className="text-sm text-[#6b7280] font-normal">
                            ({city.funds.length})
                          </span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          {city.funds.map((fund) => (
                            <button
                              key={`${fund.city}-${fund.name}`}
                              onClick={() => handleFundClick(fund.website)}
                              className="group flex items-center justify-between p-3 sm:p-4 bg-[#0a0f1a] border border-[#1f2937] rounded-lg hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
                            >
                              <span className="text-sm sm:text-base text-[#e8eaed] group-hover:text-white transition-colors pr-2 flex-1">
                                {fund.name}
                              </span>
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280] group-hover:text-[#f97316] transition-colors flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {searchQuery === '' && (
            <div className="mt-8 text-center text-sm text-[#6b7280]">
              {fundsData.reduce((total, region) => 
                total + region.cities.reduce((cityTotal, city) => cityTotal + city.funds.length, 0), 0
              )} funds across {fundsData.reduce((total, region) => total + region.cities.length, 0)} cities
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

