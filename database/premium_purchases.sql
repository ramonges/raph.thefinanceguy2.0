-- Create premium_purchases table to track Stripe purchases
CREATE TABLE IF NOT EXISTS premium_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  block_type TEXT CHECK (block_type IN ('sales', 'trading', 'quant')),
  trading_desk TEXT,
  company_type TEXT CHECK (company_type IN ('bank', 'hedge-fund')),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_premium_purchases_user_id ON premium_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_purchases_stripe_session_id ON premium_purchases(stripe_session_id);

-- Enable Row Level Security
ALTER TABLE premium_purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own purchases
CREATE POLICY "Users can view their own purchases"
  ON premium_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can insert purchases (for API)
CREATE POLICY "Service role can insert purchases"
  ON premium_purchases
  FOR INSERT
  WITH CHECK (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_premium_purchases_updated_at
  BEFORE UPDATE ON premium_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();












