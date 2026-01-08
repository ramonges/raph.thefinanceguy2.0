import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time to prevent errors
    // This will never be used at runtime since env vars will be available
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        cookies: {
          getAll() {
            return document.cookie.split('; ').map(cookie => {
              const [name, ...rest] = cookie.split('=')
              return { name, value: rest.join('=') }
            })
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set cookie with proper attributes for mobile compatibility
              const cookieString = `${name}=${value}; path=${options?.path || '/'}; ${options?.maxAge ? `max-age=${options.maxAge};` : ''} ${options?.sameSite ? `sameSite=${options.sameSite};` : 'sameSite=lax;'} ${options?.secure || window.location.protocol === 'https:' ? 'secure;' : ''}`
              document.cookie = cookieString
            })
          },
        },
      }
    )
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return document.cookie.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return { name, value: rest.join('=') }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set cookie with proper attributes for mobile compatibility
            // This ensures PKCE code verifier is stored correctly
            const cookieString = `${name}=${value}; path=${options?.path || '/'}; ${options?.maxAge ? `max-age=${options.maxAge};` : ''} ${options?.sameSite ? `sameSite=${options.sameSite};` : 'sameSite=lax;'} ${options?.secure || window.location.protocol === 'https:' ? 'secure;' : ''}`
            document.cookie = cookieString
          })
        },
      },
    }
  )
}











