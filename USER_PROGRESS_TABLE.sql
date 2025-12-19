-- ============================================
-- USER PROGRESS TABLE FOR TRACKING CURRENT POSITION
-- ============================================
-- This table tracks the last question the user was at in each section
-- so they can resume where they left off

-- Create user_section_progress table
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

