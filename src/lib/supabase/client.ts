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

  // createBrowserClient automatically handles cookies for PKCE flow
  // Explicitly configure cookie handling for mobile browser compatibility
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          // Parse document.cookie into array of { name, value } objects
          if (typeof document === 'undefined') return []
          return document.cookie.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return { name: name.trim(), value: decodeURIComponent(rest.join('=')) }
          }).filter(c => c.name)
        },
        setAll(cookiesToSet) {
          // Set cookies with proper options for mobile browsers
          cookiesToSet.forEach(({ name, value, options }) => {
            if (typeof document === 'undefined') return
            
            const cookieParts = [
              `${name}=${encodeURIComponent(value)}`,
              `path=${options?.path || '/'}`,
            ]
            
            if (options?.maxAge) {
              cookieParts.push(`max-age=${options.maxAge}`)
            }
            
            if (options?.domain) {
              cookieParts.push(`domain=${options.domain}`)
            }
            
            // Use 'lax' as default SameSite for better mobile compatibility
            cookieParts.push(`sameSite=${options?.sameSite || 'lax'}`)
            
            if (options?.secure || (typeof window !== 'undefined' && window.location.protocol === 'https:')) {
              cookieParts.push('secure')
            }
            
            document.cookie = cookieParts.join('; ')
          })
        },
      },
    }
  )
}











