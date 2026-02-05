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
                    <h4 className="font-semibold text-white mb-3">Free Email Finder Tools - Chrome Extensions</h4>
                    <ul className="space-y-3 text-[#9ca3af]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <a 
                          href="https://chromewebstore.google.com/detail/kaspr-b2b-phone-number-an/kkfgenjfpmoegefcckjklfjieepogfhg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f97316] hover:text-[#fb923c] underline transition-colors flex items-center gap-1"
                        >
                          Kaspr <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <a 
                          href="https://chromewebstore.google.com/detail/apolloio-free-b2b-phone-n/alhgpfoeiimagjlnfekdhkjlkiomcapa?hl=en-US"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f97316] hover:text-[#fb923c] underline transition-colors flex items-center gap-1"
                        >
                          Apollo.io <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <a 
                          href="https://chromewebstore.google.com/detail/hunter-email-finder-exten/hgmhmanijnjhaffoampdlllchpolkdnj"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f97316] hover:text-[#fb923c] underline transition-colors flex items-center gap-1"
                        >
                          Hunter.io <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#f97316] mt-1">•</span>
                        <a 
                          href="https://chromewebstore.google.com/detail/rocketreach-chrome-extens/oiecklaabeielolbliiddlbokpfnmhba?hl=en-US"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f97316] hover:text-[#fb923c] underline transition-colors flex items-center gap-1"
                        >
                          RocketReach <ExternalLink className="w-3 h-3" />
                        </a>
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
                    <h4 className="font-semibold text-white mb-4">Common Email Formats:</h4>
                    <div className="space-y-2 text-[#9ca3af] font-mono text-sm">
                      <p className="text-white font-semibold mb-3">Most banks follow predictable formats:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>firstname.lastname@bank.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Goldman Sachs: @gs.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>JP Morgan: @jpmorgan.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Morgan Stanley: @morganstanley.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Bank of America: @bofa.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Citi: @citi.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Barclays: @barclays.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Nomura: @nomura.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>UBS: @ubs.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Société Générale: @sgcib.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Natixis: @natixis.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Crédit Agricole: @ca-cib.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>RBC: @rbccm.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Jefferies: @jefferies.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Macquarie: @macquarie.com</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>HSBC: @hsbc.fr</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#f97316]">•</span>
                          <span>Commerzbank: @commerzbank.com</span>
                        </li>
                      </ul>
                    </div>
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
                    
                    {/* Template 1: Alumni Approach */}
                    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                      <h5 className="font-semibold text-[#f97316] mb-3">Template 1: Alumni Approach (Same School)</h5>
                      <p className="text-sm text-[#9ca3af] mb-2 italic">Subject: [University] Student — Question About Your Path in [Firm]</p>
                      <div className="space-y-3 text-sm text-[#9ca3af] leading-relaxed">
                        <p className="text-white">Dear [First Name],</p>
                        <p>
                          I'm a [year] student at [University] majoring in [Major] with a strong interest in [specific area: M&A, Sales & Trading, Structuring]. I have completed coursework in [relevant classes] and recently finished [internship/project].
                        </p>
                        <p>
                          I was particularly drawn to [Firm Name] because of your focus on [specific sector/deal type], which aligns with my background in [relevant experience or interest]. I noticed on your profile that you [specific observation about their background].
                        </p>
                        <p>
                          Would you be open to a brief 15-minute call next week to share any advice about breaking into [industry] and your experiences at [Firm]? I'm happy to work around your schedule.
                        </p>
                        <p className="text-white">Thank you for considering my request.</p>
                        <p className="text-white mt-4">
                          Best regards,<br />
                          [Your Name]<br />
                          [Email] | [Phone] | [LinkedIn URL]
                        </p>
                      </div>
                    </div>

                    {/* Template 2: Non-Alumni */}
                    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                      <h5 className="font-semibold text-[#f97316] mb-3">Template 2: Non-Alumni, Personalized Hook</h5>
                      <p className="text-sm text-[#9ca3af] mb-2 italic">Subject: [University] Student Interested in [Coverage Group] at [Firm]</p>
                      <div className="space-y-3 text-sm text-[#9ca3af] leading-relaxed">
                        <p className="text-white">Hi [First Name],</p>
                        <p>
                          I recently came across your post on LinkedIn about [specific topic] and found your perspective on [detail] really insightful. I'm a [year] at [University] exploring opportunities in investment banking, particularly in [sector].
                        </p>
                        <p>
                          I've developed strong analytical skills through [specific experience, internship, project, coursework], and I'm drawn to [Firm] because of [specific reason: deal history, culture, recent transaction].
                        </p>
                        <p>
                          I noticed you also [shared interest: played tennis in college / studied abroad in X / started at a non-target]. I'd love to hear about your journey and any advice you might have for someone looking to break in.
                        </p>
                        <p>
                          Would you be open to a brief call or coffee chat? I'm happy to work around your schedule.
                        </p>
                        <p className="text-white">Thank you for considering my request.</p>
                        <p className="text-white mt-4">
                          Best regards,<br />
                          [Your Name]<br />
                          [Email] | [Phone] | [LinkedIn URL]
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Maximize Responses Popup */}
              {activePopup === 'responses' && (
                <div className="space-y-4">
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">Key Principles for Maximum Response Rate</h4>
                    <div className="space-y-4 text-[#9ca3af]">
                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">1. Timing Matters</h5>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Send emails Tuesday-Thursday, 7-9 AM or 4-6 PM</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Avoid Monday mornings and Friday afternoons</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Follow up after 3-4 business days if no response</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">2. Personalization is Key</h5>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Reference specific deals, articles, or LinkedIn posts</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Mention shared connections, alumni status, or common interests</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Show genuine knowledge about their firm and role</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">3. Keep it Short & Direct</h5>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>5-7 sentences maximum</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Clear subject line that stands out</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Make your ask crystal clear (15-min call, coffee chat)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">4. Volume Strategy</h5>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Expect a 10-20% response rate on cold outreach</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Send 50-100 emails per week during recruiting season</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Track responses in a spreadsheet</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">5. Follow-Up Strategy</h5>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>First follow-up: "Bumping this to the top of your inbox..."</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Second follow-up: Add new information or update</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>Maximum 2-3 follow-ups before moving on</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-6 bg-[#0f172a] border border-[#f97316]/20 rounded-lg p-4">
                        <p className="text-sm text-white font-semibold mb-2">💡 Pro Tip:</p>
                        <p className="text-sm text-[#9ca3af]">
                          People respond better to Google Meet requests than phone calls. It's more personal than phone but more convenient than in-person. Always suggest a video call when possible!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Coffee Chats Popup */}
              {activePopup === 'calls' && (
                <div className="space-y-4">
                  <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">Coffee Chat & Call Preparation Guide</h4>
                    <div className="space-y-4 text-[#9ca3af]">
                      
                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">Before the Call</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Research thoroughly:</strong> LinkedIn profile, recent deals, firm news, sector trends</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Prepare 5-7 smart questions</strong> (avoid asking things easily found on their website)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Have your story ready:</strong> 2-minute pitch about who you are and why finance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Test your tech:</strong> Camera, microphone, internet connection</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">During the Call (15-20 mins)</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">First 2 mins:</strong> Thank them, brief intro, acknowledge their time</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Next 10-12 mins:</strong> Ask your prepared questions, listen actively, show genuine interest</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Last 3-5 mins:</strong> Ask about next steps, application process, or if they can connect you with others</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Energy:</strong> Be enthusiastic but professional, smile (they can hear it!)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">Great Questions to Ask</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"What does a typical day/week look like in your role?"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"What made you choose [Firm] over other offers?"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"What's the most challenging aspect of working in [sector/product]?"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"How has the desk/group culture evolved since you joined?"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"What skills do you think are most important for success in this role?"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"What's one thing you wish you knew before starting in [role]?"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span>"How do you see [specific market trend] affecting your desk?"</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">After the Call</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Send thank you email within 24 hours</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Reference specific topics</strong> you discussed to show you were listening</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Add on LinkedIn</strong> with a personalized note</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Log notes</strong> about what you learned for future reference</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#f97316] mt-1">•</span>
                            <span><strong className="text-white">Stay in touch:</strong> Share relevant articles or updates every few months</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#f97316] pl-4">
                        <h5 className="font-semibold text-white mb-2">What NOT to Do</h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Don't ask for a job directly</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Don't talk more than you listen (80/20 rule: them 80%, you 20%)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Don't ask questions easily answered by Google</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Don't be late or run over time without asking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Don't badmouth other firms or people</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-6 bg-[#0f172a] border border-[#f97316]/20 rounded-lg p-4">
                        <p className="text-sm text-white font-semibold mb-2">🎯 Remember:</p>
                        <p className="text-sm text-[#9ca3af]">
                          These calls are about building genuine relationships, not just checking boxes. Show authentic interest, be memorable, and always follow through on what you say you'll do. The person you speak with today could be the one who refers you for an interview tomorrow.
                        </p>
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
