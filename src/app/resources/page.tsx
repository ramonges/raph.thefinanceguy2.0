'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import Statistics from '@/components/Statistics'
import { Profile, UserStats } from '@/types'
import { BookOpen, FileText, Mail, TrendingUp, Phone, BookMarked, X, ExternalLink } from 'lucide-react'

const emptyStats: UserStats = {
  overall: { total: 0, correct: 0, wrong: 0, percentage: 0 },
  byCategory: {}
}

export default function ResourcesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<UserStats>(emptyStats)
  const [activePopup, setActivePopup] = useState<string | null>(null)
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

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#f97316] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => setShowStats(true)} blockType={null} />

      <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Resources</h1>
            <p className="text-[#9ca3af]">Essential tools and guides to land your dream internship</p>
          </div>

          {/* Resume Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#f97316]" />
              Resume
            </h2>
            <p className="text-[#9ca3af] mb-6">Have the finance format for your resume</p>

            <button
              onClick={() => handleCardClick('https://financecv.fr')}
              className="w-full sm:w-auto group bg-[#111827] border-2 border-white/20 rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-base sm:text-lg text-white group-hover:text-[#f97316] transition-colors">
                  The best website to make your resume for free in less than 30mns
                </span>
                <ExternalLink className="w-5 h-5 text-[#6b7280] group-hover:text-[#f97316] transition-colors flex-shrink-0" />
              </div>
            </button>
          </div>

          {/* Advice Section */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">The best Advice and techniques to land an internship</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* LinkedIn Hacks */}
              <button
                onClick={() => setActivePopup('linkedin')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <Mail className="w-8 h-8 text-[#f97316] mb-3" />
                <h3 className="text-lg font-semibold text-white group-hover:text-[#f97316] transition-colors">
                  LinkedIn Hacks
                </h3>
              </button>

              {/* Company Domain Patterns */}
              <button
                onClick={() => setActivePopup('domains')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <Mail className="w-8 h-8 text-[#6366f1] mb-3" />
                <h3 className="text-lg font-semibold text-white group-hover:text-[#f97316] transition-colors">
                  Company Domain Patterns
                </h3>
              </button>

              {/* Format Message */}
              <button
                onClick={() => setActivePopup('message')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <FileText className="w-8 h-8 text-[#10b981] mb-3" />
                <h3 className="text-lg font-semibold text-white group-hover:text-[#f97316] transition-colors">
                  Format Message to send
                </h3>
              </button>

              {/* Maximize Response Ratio */}
              <button
                onClick={() => setActivePopup('responses')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <TrendingUp className="w-8 h-8 text-[#f59e0b] mb-3" />
                <h3 className="text-lg font-semibold text-white group-hover:text-[#f97316] transition-colors">
                  Maximize your ratio of responses
                </h3>
              </button>

              {/* Coffee Chats */}
              <button
                onClick={() => setActivePopup('calls')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <Phone className="w-8 h-8 text-[#ec4899] mb-3" />
                <h3 className="text-lg font-semibold text-white group-hover:text-[#f97316] transition-colors">
                  Be ready for calls and coffee chats
                </h3>
              </button>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#f97316]" />
              Books
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Quant Finance Guide */}
              <button
                onClick={() => handleCardClick('https://academyflex.com/wp-content/uploads/2024/03/a-practical-guide-to-quantitative-finance-interviews.pdf')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <BookMarked className="w-8 h-8 text-[#f97316] mb-3" />
                <h3 className="text-base font-semibold text-white group-hover:text-[#f97316] transition-colors mb-2">
                  A practical guide to quantitative finance interviews
                </h3>
                <ExternalLink className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] transition-colors" />
              </button>

              {/* Exotic Options */}
              <button
                onClick={() => handleCardClick('https://onlinelibrary.wiley.com/doi/epdf/10.1002/9781119206965.app1')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <BookMarked className="w-8 h-8 text-[#6366f1] mb-3" />
                <h3 className="text-base font-semibold text-white group-hover:text-[#f97316] transition-colors mb-2">
                  Preparation for exotic desk
                </h3>
                <p className="text-sm text-[#9ca3af] mb-3">
                  Exotic Options and Hybrids: A Guide to Structuring, Pricing and Trading
                </p>
                <ExternalLink className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] transition-colors" />
              </button>

              {/* The Hull */}
              <button
                onClick={() => handleCardClick('http://lib.ysu.am/disciplines_bk/2b66030e0dd4c77b2bda437f6c1e5e66.pdf')}
                className="group bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#f97316] hover:bg-[#1a1f2e] transition-all text-left"
              >
                <BookMarked className="w-8 h-8 text-[#10b981] mb-3" />
                <h3 className="text-base font-semibold text-white group-hover:text-[#f97316] transition-colors mb-2">
                  The Hull aka the finance bible
                </h3>
                <p className="text-sm text-[#9ca3af] mb-3">
                  Options, Futures, and Other Derivatives
                </p>
                <ExternalLink className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Modal */}
      {showStats && (
        <Statistics 
          stats={stats} 
          onClose={() => setShowStats(false)} 
          blockType={undefined}
          userId={profile?.id || null}
          showGlobalStats={true}
        />
      )}

      {/* Popups */}
      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111827] border-b border-[#1f2937] p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {activePopup === 'linkedin' && 'LinkedIn Hacks'}
                {activePopup === 'domains' && 'Company Domain Patterns'}
                {activePopup === 'message' && 'Format Message to send'}
                {activePopup === 'responses' && 'Maximize your ratio of responses'}
                {activePopup === 'calls' && 'Be ready for calls and coffee chats'}
              </h3>
              <button
                onClick={() => setActivePopup(null)}
                className="text-[#6b7280] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* LinkedIn Hacks Popup */}
              {activePopup === 'linkedin' && (
                <div className="space-y-4">
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Free Email Finder Tools</h4>
                    <ul className="space-y-2 text-[#9ca3af]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <span>Kaspr</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <span>Apollo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <span>Hunter.io Google extension</span>
                      </li>
                    </ul>
                    <p className="text-[#9ca3af] mt-4 text-sm">
                      These are free email finder tools. Install them and link them to LinkedIn to get email addresses of professionals.
                    </p>
                  </div>

                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Follow-up Strategy</h4>
                    <p className="text-[#9ca3af] text-sm leading-relaxed">
                      Then reach out to them and don't hesitate every 3 days if no answer to send a follow-up email. 
                      You usually email busy people. So be sure that they saw your email.
                    </p>
                  </div>
                </div>
              )}

              {/* Company Domain Patterns Popup */}
              {activePopup === 'domains' && (
                <div className="space-y-4">
                  <p className="text-[#9ca3af] mb-4">
                    Most banks follow predictable formats. Try these email patterns:
                  </p>
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                    <img 
                      src="/assets/image-3f0eb557-5b87-4851-9263-5040acf2dee0.png"
                      alt="Company domain patterns"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Format Message Popup */}
              {activePopup === 'message' && (
                <div className="space-y-6">
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">Email Structure - 5-7 sentences maximum:</h4>
                    <ul className="space-y-3 text-[#9ca3af]">
                      <li className="flex items-start gap-3">
                        <span className="text-[#f97316] font-semibold">1.</span>
                        <span>Brief introduction</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f97316] font-semibold">2.</span>
                        <span>Who you are + relevant experience</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f97316] font-semibold">3.</span>
                        <span>Why you are interested in the firm</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f97316] font-semibold">4.</span>
                        <span>Why you are personally interested in her/him personally</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f97316] font-semibold">5.</span>
                        <span>Soft request for a 15min call or coffee chat (always prefer to make a Google Meet, it creates a better link than just by phone if you can't meet in real)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Email Templates:</h4>
                    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-4">
                      <img 
                        src="/assets/image-c0f325a8-677c-404a-897e-3033a627bfbb.png"
                        alt="Email template 1"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-4">
                      <img 
                        src="/assets/image-1ea33fd6-e21c-4b22-b600-02200203d2b4.png"
                        alt="Email template 2"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Maximize Responses Popup */}
              {activePopup === 'responses' && (
                <div className="space-y-4">
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-4">
                    <img 
                      src="/assets/image-ed0420c0-1ed5-41d0-b5e2-0a7d6baa99e8.png"
                      alt="Maximize response ratio tips"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Coffee Chats Popup */}
              {activePopup === 'calls' && (
                <div className="space-y-4">
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">Pre-Call Preparation</h4>
                    <div className="space-y-3 text-[#9ca3af] text-sm">
                      <div>
                        <p className="font-semibold text-white mb-2">Research the Person (30-45 Minutes):</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Review LinkedIn thoroughly</li>
                          <li>• Career progression (school → first job → current role)</li>
                          <li>• Coverage group, deal types, specific transactions</li>
                          <li>• Interests and activities outside work</li>
                          <li>• Mutual connections</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold text-white mb-2">Research their bank:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Recent deals and league table rankings</li>
                          <li>• Culture and values (Glassdoor, bank website)</li>
                          <li>• Differentiators vs. competitors</li>
                          <li>• Office locations and structure</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold text-white mb-2">Research their coverage group/deal:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Recent market trends in their sector</li>
                          <li>• Notable transactions their group completed</li>
                          <li>• Key competitors</li>
                          <li>• Regulatory changes or industry challenges</li>
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-[#1f2937]">
                        <p className="font-semibold text-[#f97316]">This preparation enables you to:</p>
                        <ul className="space-y-1 ml-4 mt-2">
                          <li>• Ask intelligent, specific questions</li>
                          <li>• Demonstrate genuine interest (not just job-seeking)</li>
                          <li>• Avoid questions with obvious answers (that you should have researched)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
