# Implementation Guide for New Structure

## Database Updates Required

Run the SQL in `DATABASE_SCHEMA_UPDATES.sql` in your Supabase SQL Editor.

## New Pages Created

1. **`/select-block`** - Main selection page for Sales/Trading/Quant
2. **`/assets`** - Asset classes overview page
3. **`/strategies`** - Trading strategies overview page

## Next Steps

### 1. Create Question Data Files

You'll need to create question data files for:
- Sales categories (behavioral-fit, market-awareness, product-knowledge, sales-case)
- Trading categories (already have most, need to organize)
- Quant categories (coding-project, research-discussion are new)
- Asset-specific questions (2 per asset category)
- Strategy-specific questions (2 per strategy category)

### 2. Create Training Pages

For each block/category, create training pages similar to `/training` but with:
- Block type filtering
- Asset category filtering (if applicable)
- Strategy category filtering (if applicable)

### 3. Update Missed Questions Page

The missed questions page needs:
- Filter by block_type
- Filter by asset_category
- Filter by strategy_category
- "I understood" button that sets `understood = true` and hides the question

### 4. Update Navigation

Update `DashboardNav` to include links to:
- `/select-block` (or make this the new landing page)
- `/assets`
- `/strategies`
- `/missed-questions` (with new filters)

## Sample Questions Structure

Each new category needs 2 questions. Format:

```typescript
{
  id: number,
  question: string,
  answer: string,
  hint: string,
  explanation?: string[],
  difficulty: 'easy' | 'medium' | 'hard',
  targetTime: number,
  block_type: 'sales' | 'trading' | 'quant',
  asset_category?: string,
  strategy_category?: string,
}
```

## Quick Start

1. Run database migrations
2. Add sample questions (2 per category)
3. Create training pages for each block
4. Update missed questions page with filters
5. Test the flow

