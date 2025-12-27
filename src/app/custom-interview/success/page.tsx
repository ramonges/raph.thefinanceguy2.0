'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DashboardNav from '@/components/DashboardNav'
import { Profile } from '@/types'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const sessionId = searchParams.get('session_id')

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

        // Verify payment and store purchase
        if (sessionId) {
          try {
            const response = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sessionId }),
            })

            const data = await response.json()
            if (data.success) {
              // Payment verified, purchase stored
              console.log('Payment verified successfully')
            }
          } catch (error) {
            console.error('Error verifying payment:', error)
          }
        }

        setVerifying(false)
      } catch (error) {
        console.error('Error initializing:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [router, supabase, sessionId])

  if (loading || !profile) {
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 text-center">
            {verifying ? (
              <div className="py-12">
                <Loader2 className="w-12 h-12 animate-spin text-[#f97316] mx-auto mb-4" />
                <p className="text-[#9ca3af]">Verifying your payment...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-[#9ca3af] mb-8">
                  Thank you for your purchase. Your custom interview questions are now available.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/custom-interview"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    View Questions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/select-block"
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CustomInterviewSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

