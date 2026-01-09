-- ============================================
-- SHARING FEATURE DATABASE SETUP
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This creates tables for the Sharing feature where users can
-- publish articles, like them, and comment on them

-- ============================================
-- 1. ARTICLES TABLE
-- ============================================
-- Stores user-published articles with title, content, category, and optional company type

CREATE TABLE IF NOT EXISTS public.articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('Interview Questions', 'Interview Feedback', 'General Comment', 'Compensation')),
  company_type text NULL CHECK (company_type IN ('bank', 'hedge fund')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  
  -- Ensure company_type is only set for Interview Questions
  CONSTRAINT company_type_only_for_interview_questions 
    CHECK (
      (category = 'Interview Questions' AND company_type IS NOT NULL) OR
      (category != 'Interview Questions' AND company_type IS NULL)
    )
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_user_id 
ON public.articles(user_id);

CREATE INDEX IF NOT EXISTS idx_articles_category 
ON public.articles(category);

CREATE INDEX IF NOT EXISTS idx_articles_company_type 
ON public.articles(company_type) WHERE company_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_created_at 
ON public.articles(created_at DESC);

-- Composite index for common queries (category + date)
CREATE INDEX IF NOT EXISTS idx_articles_category_created_at 
ON public.articles(category, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view articles (public read)
CREATE POLICY "Anyone can view articles"
  ON public.articles
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can create articles
CREATE POLICY "Authenticated users can create articles"
  ON public.articles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own articles
CREATE POLICY "Users can update their own articles"
  ON public.articles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own articles
CREATE POLICY "Users can delete their own articles"
  ON public.articles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();

-- ============================================
-- 2. ARTICLE LIKES TABLE
-- ============================================
-- Tracks which users liked which articles

CREATE TABLE IF NOT EXISTS public.article_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  
  -- Prevent duplicate likes from the same user on the same article
  UNIQUE(article_id, user_id)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id 
ON public.article_likes(article_id);

CREATE INDEX IF NOT EXISTS idx_article_likes_user_id 
ON public.article_likes(user_id);

-- Composite index for checking if user liked an article
CREATE INDEX IF NOT EXISTS idx_article_likes_article_user 
ON public.article_likes(article_id, user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view likes (public read)
CREATE POLICY "Anyone can view likes"
  ON public.article_likes
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can like articles
CREATE POLICY "Authenticated users can like articles"
  ON public.article_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can unlike (delete) their own likes
CREATE POLICY "Users can unlike articles"
  ON public.article_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. ARTICLE COMMENTS TABLE
-- ============================================
-- Stores comments on articles

CREATE TABLE IF NOT EXISTS public.article_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_article_comments_article_id 
ON public.article_comments(article_id);

CREATE INDEX IF NOT EXISTS idx_article_comments_user_id 
ON public.article_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_article_comments_created_at 
ON public.article_comments(created_at DESC);

-- Composite index for fetching comments for an article (ordered by date)
CREATE INDEX IF NOT EXISTS idx_article_comments_article_created 
ON public.article_comments(article_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view comments (public read)
CREATE POLICY "Anyone can view comments"
  ON public.article_comments
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.article_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON public.article_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON public.article_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_article_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_article_comments_updated_at
  BEFORE UPDATE ON public.article_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_article_comments_updated_at();

-- ============================================
-- 4. HELPER FUNCTIONS FOR COUNTS
-- ============================================
-- These functions can be used to get like and comment counts efficiently

-- Function to get like count for an article
CREATE OR REPLACE FUNCTION get_article_like_count(article_uuid uuid)
RETURNS bigint AS $$
  SELECT COUNT(*)::bigint
  FROM public.article_likes
  WHERE article_id = article_uuid;
$$ LANGUAGE sql STABLE;

-- Function to get comment count for an article
CREATE OR REPLACE FUNCTION get_article_comment_count(article_uuid uuid)
RETURNS bigint AS $$
  SELECT COUNT(*)::bigint
  FROM public.article_comments
  WHERE article_id = article_uuid;
$$ LANGUAGE sql STABLE;

-- Function to check if current user liked an article
CREATE OR REPLACE FUNCTION user_liked_article(article_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.article_likes
    WHERE article_id = article_uuid AND user_id = user_uuid
  );
$$ LANGUAGE sql STABLE;

-- ============================================
-- DONE! ✅
-- ============================================
-- Your database is now set up with:
-- 1. articles table - for storing user publications
-- 2. article_likes table - for tracking likes
-- 3. article_comments table - for storing comments
-- 4. All necessary indexes, RLS policies, and helper functions
-- 
-- Categories supported:
-- - "Interview Questions" (requires company_type: "bank" or "hedge fund")
-- - "Interview Feedback"
-- - "General Comment"
-- - "Compensation"
--
-- All tables have proper RLS policies:
-- - Public read access (anyone can view)
-- - Authenticated users can create
-- - Users can only modify their own content


