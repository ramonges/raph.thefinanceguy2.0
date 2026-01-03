# Premium Mock Interview Setup Guide

## Overview
The Premium Mock Interview feature allows users to purchase customized interview questions based on:
- **Step 1**: Block Type (Sales, Trading, or Quant)
- **Step 2**: Trading Desk (only for Trading role)
- **Step 3**: Company Type (Bank or Hedge Fund)
- **Step 4**: Preview 4 questions, purchase to unlock all 20 questions

## Setup Instructions

### 1. Environment Variables
Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key (if needed for future features)

# Site URL (should already exist)
NEXT_PUBLIC_SITE_URL=https://www.raphthefinanceguy.com
```

### 2. Database Setup
Run the SQL script to create the `premium_purchases` table:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `database/premium_purchases.sql`

This will create:
- `premium_purchases` table to track purchases
- Indexes for performance
- Row Level Security policies
- Updated_at trigger

### 3. Stripe Configuration

#### Test Mode Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_`)
3. Add it to `.env.local` as `STRIPE_SECRET_KEY`

#### Production Setup
1. Switch to Live mode in Stripe Dashboard
2. Copy your **Secret key** (starts with `sk_live_`)
3. Add it to your production environment variables (Vercel, etc.)

#### Webhook Setup (Optional - for future enhancements)
If you want to handle webhooks for payment confirmations:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://www.raphthefinanceguy.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Testing

#### Test Cards
Use these Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date, any CVC, any ZIP

#### Test Flow
1. Navigate to `/premium`
2. Complete the 4-step wizard
3. Click "Purchase Full Mock Interview - $49"
4. Use test card `4242 4242 4242 4242`
5. Complete checkout
6. Verify redirect to `/premium/success`
7. Check Supabase `premium_purchases` table for the record

## File Structure

```
src/app/
├── premium/
│   ├── page.tsx              # Main premium page with 4-step wizard
│   ├── success/
│   │   └── page.tsx          # Success page after payment
│   └── cancel/
│       └── page.tsx          # Cancel page if payment cancelled
└── api/
    ├── create-checkout-session/
    │   └── route.ts          # Creates Stripe checkout session
    └── verify-payment/
        └── route.ts          # Verifies payment and stores purchase

database/
└── premium_purchases.sql     # Database schema
```

## Features

### Current Implementation
- ✅ 4-step wizard (Block Type → Trading Desk → Company Type → Preview)
- ✅ Question preview (4 visible, rest blurred)
- ✅ Stripe checkout integration
- ✅ Payment verification
- ✅ Purchase tracking in database
- ✅ Success/Cancel pages

### Future Enhancements
- [ ] Store actual customized questions in database
- [ ] Display purchased questions after payment
- [ ] Webhook handling for payment confirmations
- [ ] User dashboard to view purchased interviews
- [ ] Question generation based on selections (currently uses sample data)

## Pricing
Current price: **$49.00** per mock interview

To change the price, update the `unit_amount` in `src/app/api/create-checkout-session/route.ts`:
```typescript
unit_amount: 4900, // $49.00 (amount in cents)
```

## Notes
- The question generation currently uses sample data. You'll need to implement actual question generation based on the user's selections.
- For Sales and Quant roles, the Trading Desk step is skipped.
- All purchases are tracked in the `premium_purchases` table with metadata about the selection.









