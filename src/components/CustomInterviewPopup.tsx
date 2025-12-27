'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'

export default function CustomInterviewPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem('custom-interview-popup-shown')
    
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShow(true)
        sessionStorage.setItem('custom-interview-popup-shown', 'true')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-[#9ca3af] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f97316]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#f97316]" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            Custom finance interview questions for your next interview
          </h2>
          
          <p className="text-[#9ca3af] mb-6">
            Get personalized questions tailored to your target role, trading desk, and company type. Perfect for your upcoming interview preparation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/custom-interview"
              onClick={() => setShow(false)}
              className="btn-primary flex-1 text-center"
            >
              Get Started
            </Link>
            <button
              onClick={() => setShow(false)}
              className="btn-secondary flex-1"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

