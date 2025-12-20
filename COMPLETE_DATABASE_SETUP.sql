-- ============================================
-- COMPLETE DATABASE SETUP FOR RAPHTHEFINANCEGUY
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This includes all necessary tables and updates

-- ============================================
-- 1. USER PROGRESS TABLE (NEW)
-- ============================================
-- This table tracks the last question the user was at in each section
-- so they can resume where they left off

CREATE TABLE IF NOT EXISTS public.user_section_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Add indexes for faster queries
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

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see and modify their own progress
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_section_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_section_progress_updated_at
  BEFORE UPDATE ON public.user_section_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_section_progress_updated_at();

-- ============================================
-- 2. UPDATE EXISTING TABLES (if not already done)
-- ============================================

-- Update user_answered_questions to include new fields
ALTER TABLE public.user_answered_questions 
ADD COLUMN IF NOT EXISTS block_type text NULL, -- 'sales', 'trading', 'quant'
ADD COLUMN IF NOT EXISTS asset_category text NULL, -- 'equity', 'commodities', 'fixed_income', etc.
ADD COLUMN IF NOT EXISTS strategy_category text NULL; -- 'equity_strategies', 'fixed_income_strategies', etc.

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_answered_questions_block_type 
ON public.user_answered_questions(block_type);

CREATE INDEX IF NOT EXISTS idx_user_answered_questions_asset_category 
ON public.user_answered_questions(asset_category);

CREATE INDEX IF NOT EXISTS idx_user_answered_questions_strategy_category 
ON public.user_answered_questions(strategy_category);

-- Update user_missed_questions to include new fields
ALTER TABLE public.user_missed_questions 
ADD COLUMN IF NOT EXISTS block_type text NULL,
ADD COLUMN IF NOT EXISTS asset_category text NULL,
ADD COLUMN IF NOT EXISTS strategy_category text NULL,
ADD COLUMN IF NOT EXISTS understood boolean NULL DEFAULT false; -- New: mark as understood

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_missed_questions_block_type 
ON public.user_missed_questions(block_type);

CREATE INDEX IF NOT EXISTS idx_user_missed_questions_asset_category 
ON public.user_missed_questions(asset_category);

CREATE INDEX IF NOT EXISTS idx_user_missed_questions_strategy_category 
ON public.user_missed_questions(strategy_category);

CREATE INDEX IF NOT EXISTS idx_user_missed_questions_understood 
ON public.user_missed_questions(understood) WHERE understood = false;

-- ============================================
-- DONE! ✅
-- ============================================
-- Your database is now set up with:
-- 1. user_section_progress table for tracking current position
-- 2. Updated user_answered_questions with block_type, asset_category, strategy_category
-- 3. Updated user_missed_questions with block_type, asset_category, strategy_category, understood
-- 4. All necessary indexes and RLS policies

