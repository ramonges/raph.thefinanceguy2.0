'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check if user is already logged in and read error from URL
  useEffect(() => {
    // Check for error in URL params (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      // Clean up URL
      window.history.replaceState({}, '', '/signup')
    }

    async function checkSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // User already has a session, redirect to select-block
          router.push('/select-block')
          router.refresh()
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router, supabase])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      // If email confirmation is required
      if (data.user && !data.session) {
        setSuccess(true)
      } else if (data.session) {
        // If no email confirmation needed, redirect
        router.push('/select-block')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use the current origin to ensure OAuth redirect works on all devices (mobile, desktop, preview URLs)
      // Add source=signup to track that this is a signup flow
      const redirectUrl = `${window.location.origin}/auth/callback?next=/select-block&source=signup`
      
      console.log('Initiating Google OAuth signup with redirectTo:', redirectUrl)
      
      // signInWithOAuth automatically creates an account if the user doesn't exist
      // This works for both new signups and existing users
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('OAuth signup error:', error)
        throw error
      }

      // If data.url exists, the redirect will happen automatically
      // No need to set loading to false here as the page will redirect
    } catch (err) {
      console.error('Error in handleGoogleSignup:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during signup. Please try again.')
      setLoading(false)
    }
  }

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="block text-center mb-8">
            <span className="logo text-2xl">@raph.thefinanceguy</span>
          </Link>

          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-[#9ca3af] mb-6">
              We&apos;ve sent a confirmation link to <span className="text-[#f97316]">{email}</span>. 
              Click the link to activate your account.
            </p>
            <Link href="/login" className="btn-secondary inline-block">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <span className="logo text-2xl">@raph.thefinanceguy</span>
        </Link>

        {/* Card */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-[#9ca3af] text-center mb-8">Start your trading interview prep journey</p>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1f2937]"></div>
            <span className="text-[#6b7280] text-sm">or</span>
            <div className="flex-1 h-px bg-[#1f2937]"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none z-10" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pr-4"
                  style={{ paddingLeft: '3.5rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pr-4"
                  style={{ paddingLeft: '3.5rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none z-10" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-4"
                  style={{ paddingLeft: '3.5rem' }}
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-[#6b7280] mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-[#9ca3af] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#f97316] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

