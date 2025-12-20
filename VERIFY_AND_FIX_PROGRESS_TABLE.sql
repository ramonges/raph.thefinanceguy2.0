-- ============================================
-- VERIFY AND FIX USER PROGRESS TABLE
-- ============================================
-- Run this script in Supabase SQL Editor to ensure
-- the user_section_progress table exists and is properly configured
-- This will fix the issue where progress is not remembered

-- ============================================
-- 1. CREATE TABLE IF NOT EXISTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_section_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL, -- e.g., "sales-behavioral-fit", "trading-mental-calculation", "asset-equity-equity-analysis"
  current_question_index integer NOT NULL DEFAULT 0, -- 0-indexed question position
  block_type text NULL, -- 'sales', 'trading', 'quant'
  asset_category text NULL, -- 'equity', 'commodities', etc.
  strategy_category text NULL, -- 'equity-strategies', etc.
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  
  -- Unique constraint: one progress record per user per section
  UNIQUE(user_id, section)
);

-- ============================================
-- 2. ADD INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_section_progress_user_id 
ON public.user_section_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_section_progress_section 
ON public.user_section_progress(section);

CREATE INDEX IF NOT EXISTS idx_user_section_progress_block_type 
ON public.user_section_progress(block_type);

CREATE INDEX IF NOT EXISTS idx_user_section_progress_asset_category 
ON public.user_section_progress(asset_category);

CREATE INDEX IF NOT EXISTS idx_user_section_progress_strategy_category 
ON public.user_section_progress(strategy_category);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. DROP EXISTING POLICIES (if any) AND CREATE NEW ONES
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_section_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_section_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_section_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_section_progress;

-- Create new policies
CREATE POLICY "Users can view their own progress"
  ON public.user_section_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_section_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_section_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.user_section_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. CREATE TRIGGER FOR UPDATED_AT
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_section_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_user_section_progress_updated_at ON public.user_section_progress;

-- Create trigger
CREATE TRIGGER update_user_section_progress_updated_at
  BEFORE UPDATE ON public.user_section_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_section_progress_updated_at();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the table exists and has correct structure:

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_section_progress'
);

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'user_section_progress';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_section_progress';

-- ============================================
-- DONE! ✅
-- ============================================
-- The table is now properly set up. Users' progress will be saved
-- and remembered even after logging out and coming back days later.

