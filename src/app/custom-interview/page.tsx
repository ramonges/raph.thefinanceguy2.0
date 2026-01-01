'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile, BlockType, AssetCategory } from '@/types'
import { getInterviewFlow, InterviewFlow } from '@/data/customInterviewQuestions'
import { assetQuestions } from '@/data/assetQuestions'
import { CheckCircle, XCircle } from 'lucide-react'
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
  Sparkles,
  Download,
  FileText
} from 'lucide-react'
import jsPDF from 'jspdf'

type CompanyType = 'bank' | 'hedge-fund'

export default function CustomInterviewPage() {
  const [step, setStep] = useState(1)
  const [blockType, setBlockType] = useState<BlockType | null>(null)
  const [tradingDesk, setTradingDesk] = useState<AssetCategory | null>(null)
  const [companyType, setCompanyType] = useState<CompanyType | null>(null)
  const [interviewFlow, setInterviewFlow] = useState<InterviewFlow | null>(null)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  // State for probability question answers
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [answerFeedback, setAnswerFeedback] = useState<Record<string, boolean | null>>({})
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
    if (step === 4 && blockType && companyType && tradingDesk) {
      setLoading(true)
      // Get the asset category object
      const assetCategory = assetQuestions[tradingDesk] || undefined
      // Get the interview flow based on selections
      const flow = getInterviewFlow(blockType, companyType, assetCategory)
      setInterviewFlow(flow)
      setLoading(false)
      // Reset answers when flow changes
      setUserAnswers({})
      setAnswerFeedback({})
    }
  }, [step, blockType, companyType, tradingDesk])

  // Helper function to extract numeric value from answer string or user input
  const extractNumericAnswer = (answerText: string): number | null => {
    if (!answerText || typeof answerText !== 'string') return null
    
    // Clean the input
    const cleaned = answerText.trim()
    
    // Try to find numbers - check fractions first
    // Look for patterns like "3/8", "3/2", "1.5", "37.5%", "2,500,000", "$2.5 million", "≈ 1.806", etc.
    
    // First, try to match fractions (most specific)
    const fractionPattern = /(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/
    const fractionMatch = cleaned.match(fractionPattern)
    if (fractionMatch) {
      const numerator = parseFloat(fractionMatch[1])
      const denominator = parseFloat(fractionMatch[2])
      if (denominator !== 0 && !isNaN(numerator) && !isNaN(denominator)) {
        return numerator / denominator
      }
    }
    
    // Try percentage
    const percentagePattern = /(\d+\.?\d*)\s*%/
    const percentageMatch = cleaned.match(percentagePattern)
    if (percentageMatch) {
      const num = parseFloat(percentageMatch[1])
      if (!isNaN(num)) {
        return num / 100
      }
    }
    
    // Try currency with scale words
    const currencyPattern = /[\$]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|thousand)/i
    const currencyMatch = cleaned.match(currencyPattern)
    if (currencyMatch) {
      const num = parseFloat(currencyMatch[1].replace(/,/g, ''))
      const scale = currencyMatch[2].toLowerCase()
      if (!isNaN(num)) {
        if (scale === 'million') return num * 1000000
        if (scale === 'billion') return num * 1000000000
        if (scale === 'thousand') return num * 1000
      }
    }
    
    // Try approximation symbol
    const approxPattern = /≈\s*(\d+\.?\d*)/
    const approxMatch = cleaned.match(approxPattern)
    if (approxMatch) {
      const num = parseFloat(approxMatch[1].replace(/,/g, ''))
      if (!isNaN(num)) {
        return num
      }
    }
    
    // Try plain number (most general, check last)
    const numberPattern = /(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)/
    const numberMatch = cleaned.match(numberPattern)
    if (numberMatch) {
      const num = parseFloat(numberMatch[1].replace(/,/g, ''))
      if (!isNaN(num)) {
        return num
      }
    }
    
    return null
  }

  // Helper function to check if user answer is correct
  const checkAnswer = (questionId: string, correctAnswer: string, userAnswer: string): boolean => {
    // First try to extract numeric values from both
    const correctNumeric = extractNumericAnswer(correctAnswer)
    const userNumeric = extractNumericAnswer(userAnswer)
    
    // If both are numeric, compare them
    if (correctNumeric !== null && userNumeric !== null) {
      // Allow small tolerance for floating point errors (0.1% or 0.01 absolute, whichever is larger)
      const tolerance = Math.max(Math.abs(correctNumeric) * 0.001, 0.01)
      return Math.abs(userNumeric - correctNumeric) <= tolerance
    }
    
    // If we couldn't extract numbers, do text comparison (case-insensitive, trimmed)
    const correctText = correctAnswer.toLowerCase().trim()
    const userText = userAnswer.toLowerCase().trim()
    
    // Exact match
    if (correctText === userText) {
      return true
    }
    
    // Try to match just the key part (e.g., if answer contains "RED" or "red", accept that)
    // Extract single word answers (like "red", "blue", "8", etc.)
    const singleWordPattern = /\b(red|blue|green|yellow|black|white|\d+)\b/i
    const correctKey = correctText.match(singleWordPattern)?.[0]
    const userKey = userText.match(singleWordPattern)?.[0]
    
    if (correctKey && userKey && correctKey.toLowerCase() === userKey.toLowerCase()) {
      return true
    }
    
    // Final fallback: check if user answer is contained in correct answer or vice versa
    // (useful for answers like "The answer is 8" vs user input "8")
    if (correctText.includes(userText) || userText.includes(correctText)) {
      // But only if the match is substantial (at least 2 characters)
      if (userText.length >= 2) {
        return true
      }
    }
    
    return false
  }

  const handleAnswerSubmit = (questionId: string, correctAnswer: string) => {
    const userAnswer = userAnswers[questionId] || ''
    if (!userAnswer.trim()) return

    const isCorrect = checkAnswer(questionId, correctAnswer, userAnswer)
    setAnswerFeedback({ ...answerFeedback, [questionId]: isCorrect })
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: value })
    // Clear feedback when user types
    if (answerFeedback[questionId] !== null) {
      setAnswerFeedback({ ...answerFeedback, [questionId]: null })
    }
  }

  const handleDownloadPDF = () => {
    if (!interviewFlow) return

    const doc = new jsPDF()
    let yPos = 20

    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(interviewFlow.title, 20, yPos)
    yPos += 10

    // Goal and Mindset
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Goal: ${interviewFlow.goal}`, 20, yPos)
    yPos += 7
    doc.text(`Mindset tested: "${interviewFlow.mindset}"`, 20, yPos)
    yPos += 15

    // Sections
    interviewFlow.sections.forEach((section, sectionIdx) => {
      // Section title
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 20, yPos)
      yPos += 8

      if (section.description) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.text(section.description, 20, yPos)
        yPos += 6
      }

      // Questions
      section.questions.forEach((question, qIdx) => {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        const questionText = `${qIdx + 1}. ${question.question}`
        const questionLines = doc.splitTextToSize(questionText, 170)
        doc.text(questionLines, 20, yPos)
        yPos += questionLines.length * 5 + 3

        if (question.hint) {
          doc.setFontSize(9)
          doc.setFont('helvetica', 'italic')
          doc.text(`Hint: ${question.hint}`, 25, yPos)
          yPos += 5
        }

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const answerLines = doc.splitTextToSize(`Answer: ${question.answer}`, 170)
        doc.text(answerLines, 20, yPos)
        yPos += answerLines.length * 5 + 8
      })

      yPos += 5
    })

    // Save PDF
    const fileName = `${interviewFlow.track}-${interviewFlow.companyType}-interview.pdf`
    doc.save(fileName)
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
        <div className="max-w-5xl mx-auto">
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
          <div className="flex items-center justify-center mb-8 px-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all ${
                    step >= s
                      ? 'bg-[#f97316] text-white'
                      : 'bg-[#1f2937] text-[#6b7280]'
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-8 sm:w-12 md:w-16 h-1 mx-1 sm:mx-2 transition-all ${
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

            {/* Step 2: Asset Selection (for all tracks) */}
            {step === 2 && blockType && (
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-2xl font-bold mb-2">Choose Asset Class</h2>
                <p className="text-[#9ca3af] mb-6">Select the asset class to get targeted interview questions</p>
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

            {/* Step 3: Company Type (for all tracks) */}
            {step === 3 && blockType && tradingDesk && (
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

            {/* Step 4: Interview Flow */}
            {step === 4 && interviewFlow && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                {/* Interview Header */}
                <div className="mb-8 pb-6 border-b border-[#1f2937]">
                  <h2 className="text-3xl font-bold mb-3">{interviewFlow.title}</h2>
                  <div className="space-y-2">
                    <p className="text-[#9ca3af]">
                      <span className="font-semibold text-white">Goal:</span> {interviewFlow.goal}
                    </p>
                    <p className="text-[#9ca3af]">
                      <span className="font-semibold text-white">Mindset tested:</span> "{interviewFlow.mindset}"
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {interviewFlow.sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="bg-[#1f2937] border border-[#374151] rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-[#f97316]">{section.title}</h3>
                        {section.description && (
                          <p className="text-[#9ca3af] mb-4">{section.description}</p>
                        )}
                        
                        <div className="space-y-6">
                          {section.questions.map((question, qIdx) => {
                            const isProbability = question.category === 'probability'
                            const userAnswer = userAnswers[question.id] || ''
                            const feedback = answerFeedback[question.id]
                            const showFeedback = feedback !== null && feedback !== undefined

                            return (
                              <div key={question.id} className="bg-[#0a0f1a] border border-[#374151] rounded-lg p-5">
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center font-bold flex-shrink-0 text-sm">
                                    {qIdx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-3 text-white">{question.question}</h4>
                                    {question.hint && (
                                      <div className="mb-3 p-3 bg-[#1f2937] rounded border-l-2 border-[#6366f1]">
                                        <p className="text-sm text-[#9ca3af]">
                                          <span className="font-medium text-[#6366f1]">Hint:</span> {question.hint}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {isProbability ? (
                                      // Interactive answer input for probability questions
                                      <div className="mt-4 pt-4 border-t border-[#374151]">
                                        <div className="space-y-3">
                                          <div className="flex gap-3">
                                            <input
                                              type="text"
                                              value={userAnswer}
                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  handleAnswerSubmit(question.id, question.answer)
                                                }
                                              }}
                                              placeholder="Enter your answer..."
                                              className="flex-1 bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f97316] transition-colors"
                                            />
                                            <button
                                              onClick={() => handleAnswerSubmit(question.id, question.answer)}
                                              disabled={!userAnswer.trim()}
                                              className="px-6 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              Check
                                            </button>
                                          </div>
                                          
                                          {showFeedback && (
                                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                                              feedback 
                                                ? 'bg-green-500/10 border border-green-500/30' 
                                                : 'bg-red-500/10 border border-red-500/30'
                                            }`}>
                                              {feedback ? (
                                                <>
                                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                                  <span className="text-green-400 font-medium">Correct!</span>
                                                </>
                                              ) : (
                                                <>
                                                  <XCircle className="w-5 h-5 text-red-400" />
                                                  <span className="text-red-400 font-medium">Incorrect. Try again!</span>
                                                </>
                                              )}
                                            </div>
                                          )}

                                          {showFeedback && !feedback && (
                                            <div className="mt-3 p-3 bg-[#1f2937] rounded border-l-2 border-[#6366f1]">
                                              <p className="text-sm text-[#9ca3af]">
                                                <span className="font-medium text-[#6366f1]">Correct Answer:</span> {question.answer}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      // Regular answer display for non-probability questions
                                      <div className="mt-4 pt-4 border-t border-[#374151]">
                                        <p className="text-sm text-[#6b7280] leading-relaxed">
                                          <span className="font-medium text-[#9ca3af]">Answer:</span> {question.answer}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
