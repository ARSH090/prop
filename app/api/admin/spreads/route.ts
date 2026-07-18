import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('broker_spreads').get()
    const spreads: any[] = []
    snapshot.forEach((doc: any) => {
      spreads.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: spreads })
  } catch (error) {
    console.error('Error fetching admin broker spreads:', error)
    return NextResponse.json({ error: 'Failed to fetch spreads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firm_id, instrument, spread_pips, commission_note } = body

    if (!firm_id || !instrument || spread_pips === undefined) {
      return NextResponse.json({ error: 'Firm ID, Instrument, and Spread are required' }, { status: 400 })
    }

    const docId = `sp-${firm_id}-${instrument.toLowerCase()}-${Date.now()}`
    const ref = db.collection('broker_spreads').doc(docId)

    await ref.set({
      firm_id,
      instrument: instrument.toUpperCase(),
      spread_pips: Number(spread_pips),
      commission_note: commission_note || '',
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin broker spread:', error)
    return NextResponse.json({ error: 'Failed to create spread' }, { status: 500 })
  }
}
