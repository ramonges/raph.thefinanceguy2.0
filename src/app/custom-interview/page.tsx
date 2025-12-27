'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile, BlockType, AssetCategory } from '@/types'
import { 
  Users, 
  TrendingUp, 
  Calculator,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building2,
  Briefcase,
  Check,
  Lock,
  Sparkles
} from 'lucide-react'

type CompanyType = 'bank' | 'hedge-fund'

interface CustomQuestion {
  id: number
  question: string
  answer: string
  hint?: string
  explanation?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
}

export default function CustomInterviewPage() {
  const [step, setStep] = useState(1)
  const [blockType, setBlockType] = useState<BlockType | null>(null)
  const [tradingDesk, setTradingDesk] = useState<AssetCategory | null>(null)
  const [companyType, setCompanyType] = useState<CompanyType | null>(null)
  const [questions, setQuestions] = useState<CustomQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
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
      }
    }

    initialize()
  }, [router, supabase])

  useEffect(() => {
    if (step === 4 && blockType && tradingDesk && companyType) {
      generateQuestions()
    }
  }, [step, blockType, tradingDesk, companyType])

  const generateQuestions = async () => {
    setLoading(true)
    // Simulate question generation - in production, this would fetch from your database
    // For now, we'll create sample questions based on selections
    const sampleQuestions: CustomQuestion[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      question: `Customized ${blockType} question for ${tradingDesk} desk at ${companyType === 'bank' ? 'Bank' : 'Hedge Fund'} - Question ${i + 1}`,
      answer: `This is a detailed answer for question ${i + 1} tailored to ${blockType} role in ${tradingDesk} at a ${companyType === 'bank' ? 'bank' : 'hedge fund'}.`,
      hint: `Hint for question ${i + 1}`,
      explanation: [`Explanation point 1 for question ${i + 1}`, `Explanation point 2 for question ${i + 1}`],
      difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard'
    }))
    
    setTimeout(() => {
      setQuestions(sampleQuestions)
      setLoading(false)
    }, 1000)
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockType,
          tradingDesk,
          companyType,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        console.error('Checkout error:', error)
        alert('Error creating checkout session. Please try again.')
        setCheckoutLoading(false)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error creating checkout session. Please try again.')
      setCheckoutLoading(false)
    }
  }

  const tradingDesks: Array<{ id: AssetCategory; label: string; icon: React.ElementType; color: string }> = [
    { id: 'equity', label: 'Equity Trading', icon: TrendingUp, color: '#10b981' },
    { id: 'fixed-income', label: 'Fixed Income', icon: Briefcase, color: '#6366f1' },
    { id: 'commodities', label: 'Commodities', icon: Briefcase, color: '#f59e0b' },
    { id: 'credit', label: 'Credit Trading', icon: Briefcase, color: '#ef4444' },
    { id: 'foreign-exchange', label: 'Foreign Exchange', icon: Briefcase, color: '#8b5cf6' },
    { id: 'rates-derivatives', label: 'Rates Derivatives', icon: Briefcase, color: '#06b6d4' },
    { id: 'structured-products', label: 'Structured Products', icon: Briefcase, color: '#ec4899' },
  ]

  if (!profile) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardNav profile={profile} onOpenStats={() => {}} blockType={null} />

      <main className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#1f2937] border border-[#374151] text-[#f97316] px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Custom Interview</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Custom Interview Questions
            </h1>
            <p className="text-[#9ca3af] text-base sm:text-lg">
              Get personalized questions tailored to your target role and company
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? 'bg-[#f97316] text-white'
                      : 'bg-[#1f2937] text-[#6b7280]'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all ${
                      step > s ? 'bg-[#f97316]' : 'bg-[#1f2937]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 sm:p-8">
            {/* Step 1: Block Type */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Choose Your Track</h2>
                <p className="text-[#9ca3af] mb-6">Select the role you're interviewing for</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'sales' as BlockType, label: 'Sales', icon: Users, color: '#6366f1' },
                    { id: 'trading' as BlockType, label: 'Trading', icon: TrendingUp, color: '#f97316' },
                    { id: 'quant' as BlockType, label: 'Quant', icon: Calculator, color: '#10b981' },
                  ].map((block) => {
                    const Icon = block.icon
                    return (
                      <button
                        key={block.id}
                        onClick={() => {
                          setBlockType(block.id)
                          setTimeout(() => setStep(2), 300)
                        }}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          blockType === block.id
                            ? 'border-[#f97316] bg-[#f97316]/10'
                            : 'border-[#1f2937] hover:border-[#374151]'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${block.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: block.color }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{block.label}</h3>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Trading Desk (only for Trading) */}
            {step === 2 && blockType === 'trading' && (
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-2xl font-bold mb-2">Choose Trading Desk</h2>
                <p className="text-[#9ca3af] mb-6">Select the specific trading desk</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tradingDesks.map((desk) => {
                    const Icon = desk.icon
                    return (
                      <button
                        key={desk.id}
                        onClick={() => {
                          setTradingDesk(desk.id)
                          setTimeout(() => setStep(3), 300)
                        }}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          tradingDesk === desk.id
                            ? 'border-[#f97316] bg-[#f97316]/10'
                            : 'border-[#1f2937] hover:border-[#374151]'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${desk.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: desk.color }} />
                        </div>
                        <h3 className="text-xl font-bold">{desk.label}</h3>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: For Sales and Quant, skip to Step 3 */}
            {step === 2 && (blockType === 'sales' || blockType === 'quant') && (
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-2xl font-bold mb-2">Choose Company Type</h2>
                <p className="text-[#9ca3af] mb-6">Select the type of financial institution</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'bank' as CompanyType, label: 'Bank', icon: Building2, color: '#6366f1' },
                    { id: 'hedge-fund' as CompanyType, label: 'Hedge Fund', icon: Briefcase, color: '#f97316' },
                  ].map((company) => {
                    const Icon = company.icon
                    return (
                      <button
                        key={company.id}
                        onClick={() => {
                          setCompanyType(company.id)
                          setTimeout(() => setStep(4), 300)
                        }}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          companyType === company.id
                            ? 'border-[#f97316] bg-[#f97316]/10'
                            : 'border-[#1f2937] hover:border-[#374151]'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${company.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: company.color }} />
                        </div>
                        <h3 className="text-xl font-bold">{company.label}</h3>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Company Type (only for Trading) */}
            {step === 3 && blockType === 'trading' && (
              <div>
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-2xl font-bold mb-2">Choose Company Type</h2>
                <p className="text-[#9ca3af] mb-6">Select the type of financial institution</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'bank' as CompanyType, label: 'Bank', icon: Building2, color: '#6366f1' },
                    { id: 'hedge-fund' as CompanyType, label: 'Hedge Fund', icon: Briefcase, color: '#f97316' },
                  ].map((company) => {
                    const Icon = company.icon
                    return (
                      <button
                        key={company.id}
                        onClick={() => {
                          setCompanyType(company.id)
                          setTimeout(() => setStep(4), 300)
                        }}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          companyType === company.id
                            ? 'border-[#f97316] bg-[#f97316]/10'
                            : 'border-[#1f2937] hover:border-[#374151]'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${company.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: company.color }} />
                        </div>
                        <h3 className="text-xl font-bold">{company.label}</h3>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Questions Preview */}
            {step === 4 && (
              <div>
                <button
                  onClick={() => setStep(blockType === 'trading' ? 3 : 2)}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-2xl font-bold mb-2">Your Customized Questions</h2>
                <p className="text-[#9ca3af] mb-6">
                  Preview the first 4 questions. Purchase to unlock all {questions.length} questions.
                </p>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {questions.slice(0, 4).map((q, idx) => (
                        <div
                          key={q.id}
                          className="bg-[#1f2937] border border-[#374151] rounded-xl p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{q.question}</h3>
                              {q.hint && (
                                <p className="text-sm text-[#9ca3af] mb-2">
                                  <span className="font-medium">Hint:</span> {q.hint}
                                </p>
                              )}
                              <div className="mt-3 pt-3 border-t border-[#374151]">
                                <p className="text-sm text-[#6b7280]">
                                  <span className="font-medium text-[#9ca3af]">Answer:</span> {q.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Blurred Questions */}
                      {questions.length > 4 && (
                        <div className="relative">
                          <div className="blur-sm space-y-4">
                            {questions.slice(4).map((q, idx) => (
                              <div
                                key={q.id}
                                className="bg-[#1f2937] border border-[#374151] rounded-xl p-6"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-[#6b7280] flex items-center justify-center font-bold flex-shrink-0">
                                    {idx + 5}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold mb-2">{q.question}</h3>
                                    <p className="text-sm text-[#9ca3af]">Answer preview...</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-[#111827]/80 rounded-xl">
                            <div className="text-center">
                              <Lock className="w-12 h-12 text-[#f97316] mx-auto mb-4" />
                              <p className="text-lg font-semibold mb-2">
                                Unlock {questions.length - 4} more questions
                              </p>
                              <p className="text-sm text-[#9ca3af] mb-4">
                                Get the complete mock interview tailored to your role
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg font-semibold"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Purchase Full Custom Interview - $49
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

