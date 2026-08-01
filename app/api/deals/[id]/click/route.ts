import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)

    // Insert click record in Firestore
    await db.collection('deal_clicks').add({
      deal_id: id,
      ip_hash: ipHash,
      referrer: request.headers.get('referer') || '',
      user_agent: request.headers.get('user-agent') || '',
      created_at: FieldValue.serverTimestamp(),
    })

    // Increment click_count in the specific deal
    const dealRef = db.collection('deals').doc(id)
    const dealDoc = await dealRef.get()
    if (dealDoc.exists) {
      await dealRef.update({
        click_count: FieldValue.increment(1)
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
