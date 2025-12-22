# Supabase OAuth Configuration Guide

## Project URL
Your Supabase project: `https://juagumizjdcxcyjvqpqd.supabase.co`

## Environment Variables Required

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://juagumizjdcxcyjvqpqd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=https://raphthefinanceguy.com
```

To find your `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/juagumizjdcxcyjvqpqd
2. Navigate to Settings → API
3. Copy the "anon public" key

## OAuth Configuration in Supabase Dashboard

To enable Google OAuth login, you need to configure it in your Supabase dashboard:

### Step 1: Enable Google Provider
1. Go to: https://supabase.com/dashboard/project/juagumizjdcxcyjvqpqd/auth/providers
2. Click on "Google" provider
3. Enable it

### Step 2: Configure Google OAuth Credentials
You'll need to:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (OAuth client ID)
5. Add authorized redirect URIs:
   - `https://juagumizjdcxcyjvqpqd.supabase.co/auth/v1/callback`
   - `https://raphthefinanceguy.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)
6. Copy the Client ID and Client Secret
7. Paste them into Supabase dashboard under Google provider settings

### Step 3: Configure Redirect URLs in Supabase
1. Go to: https://supabase.com/dashboard/project/juagumizjdcxcyjvqpqd/auth/url-configuration
2. Add these Site URLs:
   - `https://raphthefinanceguy.com`
   - `http://localhost:3000` (for local development)
3. Add these Redirect URLs:
   - `https://raphthefinanceguy.com/auth/callback`
   - `http://localhost:3000/auth/callback`

### Step 4: Verify Environment Variables in Vercel
If deploying on Vercel:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://juagumizjdcxcyjvqpqd.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
   - `NEXT_PUBLIC_SITE_URL` = `https://raphthefinanceguy.com`
4. Redeploy your application

## Testing OAuth

After configuration:
1. Make sure all environment variables are set
2. Restart your development server if running locally
3. Try logging in with Google
4. Check browser console and Supabase logs for any errors

## Common Issues

### "PKCE code verifier not found"
- This is usually resolved by using `@supabase/ssr` package (already installed)
- Make sure cookies are enabled in your browser
- Check that the Supabase client is using cookie-based storage

### "Redirect URI mismatch"
- Verify all redirect URLs are added in both Google Cloud Console and Supabase dashboard
- Make sure the URLs match exactly (including http/https and trailing slashes)

### "Could not authenticate user"
- Check Supabase logs in the dashboard
- Verify Google OAuth credentials are correct
- Ensure the redirect URL in code matches what's configured in Supabase

