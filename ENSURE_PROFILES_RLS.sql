-- ============================================
-- ENSURE PROFILES TABLE ALLOWS OAUTH SIGNUPS
-- ============================================
-- This ensures that new users can sign up via OAuth (Google, etc.)
-- and have their profiles created automatically

-- Check if profiles table exists and has RLS enabled
-- If RLS is blocking inserts, we need to ensure proper policies exist

-- ============================================
-- 1. VERIFY PROFILES TABLE STRUCTURE
-- ============================================
-- The profiles table should reference auth.users(id)
-- Run this to check:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'profiles';

-- ============================================
-- 2. ENSURE RLS POLICIES ALLOW PROFILE CREATION
-- ============================================

-- Drop existing INSERT policy if it exists (to recreate it)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Policy 1: Users can insert their own profile (for OAuth signups)
-- This allows the auth callback route to create profiles for new OAuth users
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 2: Allow service role to insert profiles (for server-side operations)
-- This ensures the callback route can create profiles even if RLS is strict
-- Note: This uses the service role key, which bypasses RLS
-- The callback route should already work, but this is a backup

-- ============================================
-- 3. VERIFY EXISTING POLICIES
-- ============================================
-- Run this to see all policies on profiles table:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE tablename = 'profiles';

-- ============================================
-- 4. CHECK IF RLS IS ENABLED
-- ============================================
-- Run this to check RLS status:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename = 'profiles';

-- ============================================
-- NOTES
-- ============================================
-- The auth callback route runs server-side with the service role,
-- so it should be able to insert profiles regardless of RLS policies.
-- However, if you're seeing issues, ensure:
-- 1. The profiles table has an INSERT policy that allows auth.uid() = id
-- 2. The callback route is using the server-side Supabase client (which it does)
-- 3. "Allow new users to sign up" is enabled in Supabase Auth settings
-- 4. Google OAuth provider is properly configured in Supabase

