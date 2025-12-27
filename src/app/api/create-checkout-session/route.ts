import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { blockType, tradingDesk, companyType } = body

    if (!blockType || !companyType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For trading, tradingDesk is required
    if (blockType === 'trading' && !tradingDesk) {
      return NextResponse.json({ error: 'Trading desk is required for trading role' }, { status: 400 })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Premium Mock Interview - ${blockType.charAt(0).toUpperCase() + blockType.slice(1)}${tradingDesk ? ` - ${tradingDesk}` : ''}`,
              description: `Customized interview questions for ${blockType} role${tradingDesk ? ` at ${tradingDesk} desk` : ''} at ${companyType === 'bank' ? 'Bank' : 'Hedge Fund'}`,
            },
            unit_amount: 4900, // $49.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.raphthefinanceguy.com'}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.raphthefinanceguy.com'}/premium/cancel`,
      metadata: {
        user_id: user.id,
        block_type: blockType,
        trading_desk: tradingDesk || '',
        company_type: companyType,
      },
      customer_email: user.email || undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    )
  }
}

