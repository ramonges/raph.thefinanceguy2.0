import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/select-block'

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', {
          message: error.message,
          status: error.status,
          code: error.code,
        })
        
        // Determine error URL
        const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raphthefinanceguy.com'
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const errorUrl = isLocalEnv 
          ? `${origin}/login?error=${encodeURIComponent(error.message || 'Could not authenticate user')}` 
          : `${productionUrl}/login?error=${encodeURIComponent(error.message || 'Could not authenticate user')}`
        return NextResponse.redirect(errorUrl)
      }
      
      // Successfully authenticated
      if (data?.session) {
        // Determine the correct base URL for redirection
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raphthefinanceguy.com'
        
        // Get forwarded host to check if we should use production domain
        const forwardedHost = request.headers.get('x-forwarded-host')
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
        
        let redirectUrl: string
        
        if (isLocalEnv) {
          // Development: use origin
          redirectUrl = `${origin}${next}`
        } else if (forwardedHost && forwardedHost.includes('raphthefinanceguy.com')) {
          // Production: use the custom domain if available
          redirectUrl = `${forwardedProto}://${forwardedHost}${next}`
        } else if (forwardedHost && !forwardedHost.includes('vercel.app')) {
          // Use forwarded host if it's not Vercel (could be another custom domain)
          redirectUrl = `${forwardedProto}://${forwardedHost}${next}`
        } else {
          // Fallback: use production URL from env or default
          redirectUrl = `${productionUrl}${next}`
        }
        
        return NextResponse.redirect(redirectUrl)
      } else {
        // No session returned
        console.error('No session returned after code exchange')
        const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raphthefinanceguy.com'
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const errorUrl = isLocalEnv 
          ? `${origin}/login?error=${encodeURIComponent('Authentication failed: No session created')}` 
          : `${productionUrl}/login?error=${encodeURIComponent('Authentication failed: No session created')}`
        return NextResponse.redirect(errorUrl)
      }
    } catch (err) {
      console.error('Exception in callback route:', err)
      const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raphthefinanceguy.com'
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      const errorUrl = isLocalEnv 
        ? `${origin}/login?error=${encodeURIComponent(errorMessage)}` 
        : `${productionUrl}/login?error=${encodeURIComponent(errorMessage)}`
      return NextResponse.redirect(errorUrl)
    }
  }

  // No code provided, redirect to login
  const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raphthefinanceguy.com'
  const isLocalEnv = process.env.NODE_ENV === 'development'
  const errorUrl = isLocalEnv ? `${origin}/login?error=No authentication code provided` : `${productionUrl}/login?error=No authentication code provided`
  return NextResponse.redirect(errorUrl)
}

