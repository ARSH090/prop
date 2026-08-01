import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

import { getPayouts } from '@/lib/firebase/server'

export async function GET(request: NextRequest) {
  try {
    const payouts = await getPayouts()
    return NextResponse.json({ data: payouts })
  } catch (error) {
    console.error('Error fetching admin payouts:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firm_id, 
      trader_display_name, 
      trader_alias,
      amount, 
      payout_amount,
      account_size,
      payout_method,
      region,
      currency, 
      proof_image_url, 
      payout_date, 
      is_verified 
    } = body

    if (!firm_id || (!trader_display_name && !trader_alias) || (!amount && !payout_amount)) {
      return NextResponse.json({ error: 'Firm ID, Trader Name, and Amount are required' }, { status: 400 })
    }

    const docId = `payout-${firm_id}-${Date.now()}`
    const ref = db.collection('payouts').doc(docId)

    await ref.set({
      firm_id,
      trader_display_name: trader_display_name || trader_alias || 'Trader',
      trader_alias: trader_alias || trader_display_name || 'Trader',
      amount: Number(amount || payout_amount || 0),
      payout_amount: Number(payout_amount || amount || 0),
      account_size: Number(account_size) || 100000,
      payout_method: payout_method || 'Bank Transfer',
      region: region || 'Asia',
      currency: currency || 'USD',
      proof_image_url: proof_image_url || '',
      payout_date: payout_date ? Timestamp.fromDate(new Date(payout_date)) : FieldValue.serverTimestamp(),
      is_verified: is_verified !== false,
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin payout:', error)
    return NextResponse.json({ error: 'Failed to create payout' }, { status: 500 })
  }
}
