'use client'

import Link from 'next/link'
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
    color: "#00d4aa"
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
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/80 border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="logo text-xl">
            @raph.thefinanceguy
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-secondary text-sm py-2 px-5">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-5">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] border border-[#1f2937] mb-8 fade-in">
            <Sparkles className="w-4 h-4 text-[#00d4aa]" />
            <span className="text-sm text-[#9ca3af]">Trading Interview Preparation Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in stagger-1">
            <span className="gradient-text">Master Trading Interviews</span>
            <br />
            <span className="text-[#e8eaed]">with Confidence</span>
          </h1>
          
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto mb-10 fade-in stagger-2 leading-relaxed">
            Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, 
            and machine learning concepts. Everything you need to ace your trading interview.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in stagger-3">
            <Link href="/signup" className="btn-primary flex items-center gap-2 text-lg">
              Start Practicing Free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary flex items-center gap-2 text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Built From Experience */}
      <section className="py-16 px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-[#00d4aa]" />
            <h2 className="text-2xl md:text-3xl font-bold">Built from Top Notch Finance Interviews</h2>
          </div>
          <p className="text-[#9ca3af] text-lg leading-relaxed">
            Every question in the platform comes from real interview experiences of students and junior 
            professionals across <span className="text-[#00d4aa] font-semibold">top investment banks</span>, 
            <span className="text-[#6366f1] font-semibold"> prop trading firms</span>, and 
            <span className="text-[#f59e0b] font-semibold"> elite hedge funds</span>.
          </p>
          <p className="text-[#6b7280] mt-4">
            The focus is on quick questions with sharp, concise answers — exactly what you&apos;ll face in live trading and markets interviews.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 card-hover fade-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#9ca3af] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-[#1f2937]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-[#9ca3af] text-lg mb-8">
            Join hundreds of aspiring traders preparing for their dream roles.
          </p>
          <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-lg">
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
