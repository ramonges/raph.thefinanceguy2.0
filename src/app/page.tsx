'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Calculator, 
  Brain, 
  TrendingUp, 
  Users, 
  Cpu, 
  RefreshCw,
  ChevronRight,
  Sparkles,
  Building2
} from 'lucide-react'

const features = [
  {
    icon: Calculator,
    title: "Mental Math & Quick Calculations",
    description: "Practice rapid calculations with timed questions to build speed and accuracy.",
    color: "#f97316"
  },
  {
    icon: Brain,
    title: "Probability & Brainteasers",
    description: "Master classic quant interview puzzles with detailed step-by-step solutions.",
    color: "#6366f1"
  },
  {
    icon: TrendingUp,
    title: "Trading Intuition & Greeks",
    description: "Learn market-making scenarios, volatility trading, and options Greeks behavior.",
    color: "#f59e0b"
  },
  {
    icon: Cpu,
    title: "ML & AI in Finance",
    description: "Study linear regression, XGBoost, neural networks, and AI trading applications.",
    color: "#ec4899"
  },
  {
    icon: Users,
    title: "Behavioral Interview Prep",
    description: "Practice STAR method with trading-specific behavioral questions.",
    color: "#8b5cf6"
  },
  {
    icon: RefreshCw,
    title: "Spaced Repetition System",
    description: "Track your progress with an intelligent review system for better retention.",
    color: "#06b6d4"
  }
]

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  // Redirect authenticated users to select-block page
  // Also handle OAuth callback code if present in URL
  useEffect(() => {
    async function checkAuth() {
      // Check if there's an OAuth code in the URL
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      
      if (code) {
        // Redirect to callback route to handle the OAuth code
        // Use window.location.href to maintain the current domain
        const next = urlParams.get('next') || '/select-block'
        window.location.href = `/auth/callback?code=${code}&next=${next}`
        return
      }

      // Check if user is already authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/select-block')
      }
    }
    checkAuth()
  }, [router, supabase])

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/80 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="logo text-base sm:text-xl">
            @raph.thefinanceguy
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="btn-secondary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#111827] border border-[#1f2937] mb-6 sm:mb-8 fade-in">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#f97316]" />
            <span className="text-xs sm:text-sm text-[#9ca3af]">Trading Interview Preparation Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 fade-in stagger-1">
            <span className="gradient-text">Master Trading Interviews</span>
            <br />
            <span className="text-[#e8eaed]">with Confidence</span>
          </h1>
          
          <p className="text-base sm:text-xl text-[#9ca3af] max-w-3xl mx-auto mb-8 sm:mb-10 fade-in stagger-2 leading-relaxed px-2">
            Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, 
            and machine learning concepts. Everything you need to ace your trading interview.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 fade-in stagger-3">
            <Link href="/signup" className="btn-primary flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center">
              Start Practicing Free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Built From Experience */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#f97316]" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Built from Top Notch Finance Interviews</h2>
          </div>
          <p className="text-[#9ca3af] text-base sm:text-lg leading-relaxed">
            Every question in the platform comes from real interview experiences of students and junior 
            professionals across <span className="text-[#f97316] font-semibold">top investment banks</span>, 
            <span className="text-[#6366f1] font-semibold"> prop trading firms</span>, and 
            <span className="text-[#f59e0b] font-semibold"> elite hedge funds</span>.
          </p>
          <p className="text-[#6b7280] mt-4 text-sm sm:text-base">
            The focus is on quick questions with sharp, concise answers — exactly what you&apos;ll face in live trading and markets interviews.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-[#111827] border border-[#1f2937] rounded-xl sm:rounded-2xl p-5 sm:p-8 card-hover fade-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}
              >
                <div 
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-[#9ca3af] leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-[#9ca3af] text-base sm:text-lg mb-6 sm:mb-8">
            Join hundreds of aspiring traders preparing for their dream roles.
          </p>
          <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-base sm:text-lg">
            Get Started Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1f2937]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="logo">
            @raph.thefinanceguy
          </Link>
          <p className="text-[#6b7280] text-sm">
            © {new Date().getFullYear()} Raph The Finance Guy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
