import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firm_id, trader_display_name, amount, region, account_size, payout_method, concept, proof_image_url } = body

    if (!firm_id || !trader_display_name || !amount) {
      return NextResponse.json({ error: 'Firm ID, Trader Name, and Amount are required' }, { status: 400 })
    }

    const docId = `payout-user-${Date.now()}`
    const ref = db.collection('payouts').doc(docId)

    await ref.set({
      firm_id,
      trader_display_name,
      amount: Number(amount),
      currency: 'USD',
      region: region || 'Global',
      account_size: account_size || '50K',
      payout_method: payout_method || 'Crypto',
      concept: concept || 'Other',
      proof_image_url: proof_image_url || '',
      payout_date: FieldValue.serverTimestamp(),
      is_verified: false, // Enforce admin approval: starts as false
      status: 'pending',
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating user payout proof:', error)
    return NextResponse.json({ error: 'Failed to create payout proof' }, { status: 500 })
  }
}
