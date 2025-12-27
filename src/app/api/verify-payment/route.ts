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
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Store the purchase in database
    const { error: insertError } = await supabase
      .from('premium_purchases')
      .insert({
        user_id: user.id,
        stripe_session_id: sessionId,
        block_type: session.metadata?.block_type || null,
        trading_desk: session.metadata?.trading_desk || null,
        company_type: session.metadata?.company_type || null,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        status: 'completed',
      })

    if (insertError) {
      console.error('Error storing purchase:', insertError)
      // Don't fail if the purchase already exists
      if (insertError.code !== '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Error storing purchase' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Error verifying payment' },
      { status: 500 }
    )
  }
}

