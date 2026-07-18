import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('payouts').get()
    const payouts: any[] = []
    snapshot.forEach((doc: any) => {
      payouts.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: payouts })
  } catch (error) {
    console.error('Error fetching admin payouts:', error)
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firm_id, trader_display_name, amount, currency, proof_image_url, payout_date, is_verified } = body

    if (!firm_id || !trader_display_name || !amount) {
      return NextResponse.json({ error: 'Firm ID, Trader Name, and Amount are required' }, { status: 400 })
    }

    const docId = `payout-${firm_id}-${Date.now()}`
    const ref = db.collection('payouts').doc(docId)

    await ref.set({
      firm_id,
      trader_display_name,
      amount: Number(amount),
      currency: currency || 'USD',
      proof_image_url: proof_image_url || '',
      payout_date: payout_date ? Timestamp.fromDate(new Date(payout_date)) : FieldValue.serverTimestamp(),
      is_verified: !!is_verified,
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin payout:', error)
    return NextResponse.json({ error: 'Failed to create payout' }, { status: 500 })
  }
}
