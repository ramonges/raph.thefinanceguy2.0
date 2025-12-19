-- ============================================
-- DATABASE SCHEMA UPDATES FOR NEW STRUCTURE
-- ============================================

-- 1. Update user_answered_questions to include new fields
ALTER TABLE public.user_answered_questions 
ADD COLUMN IF NOT EXISTS block_type text NULL, -- 'sales', 'trading', 'quant'
ADD COLUMN IF NOT EXISTS asset_category text NULL, -- 'equity', 'commodities', 'fixed_income', etc.
ADD COLUMN IF NOT EXISTS strategy_category text NULL; -- 'equity_strategies', 'fixed_income_strategies', etc.

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_answered_questions_block_type 
ON public.user_answered_questions(block_type);

CREATE INDEX IF NOT EXISTS idx_user_answered_questions_asset_category 
ON public.user_answered_questions(asset_category);

CREATE INDEX IF NOT EXISTS idx_user_answered_questions_strategy_category 
ON public.user_answered_questions(strategy_category);

-- 2. Update user_missed_questions to include new fields
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

-- 3. Update unique constraint to include new fields (optional - you may want to allow same question in different contexts)
-- Note: You might want to keep the existing constraint and just add these as metadata fields

-- 4. Update user_progress to include new fields
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS block_type text NULL,
ADD COLUMN IF NOT EXISTS asset_category text NULL,
ADD COLUMN IF NOT EXISTS strategy_category text NULL;

-- ============================================
-- MIGRATION NOTES:
-- ============================================
-- 1. Existing questions will have NULL values for new fields
-- 2. You can update existing records to set block_type = 'trading' for current questions
-- 3. The 'understood' field in user_missed_questions allows users to mark questions as understood
-- 4. Consider adding constraints or enums if you want to restrict values

