import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time to prevent errors
    // This will never be used at runtime since env vars will be available
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  // createBrowserClient from @supabase/ssr handles cookies for PKCE
  // Explicit cookie handlers ensure compatibility with mobile browsers (especially Safari)
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return []
          return document.cookie.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return {
              name: name.trim(),
              value: rest.length > 0 ? decodeURIComponent(rest.join('=')) : ''
            }
          }).filter(c => c.name)
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookieString = `${name}=${encodeURIComponent(value)}`
            cookieString += `; path=${options?.path || '/'}`
            if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`
            if (options?.domain) cookieString += `; domain=${options.domain}`
            const sameSite = options?.sameSite || 'lax'
            cookieString += `; sameSite=${sameSite}`
            if (options?.secure || (typeof window !== 'undefined' && window.location.protocol === 'https:')) {
              cookieString += '; secure'
            }
            document.cookie = cookieString
          })
        },
      },
    }
  )
}











