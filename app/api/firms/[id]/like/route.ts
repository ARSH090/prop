import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const firmRef = db.collection('firms').doc(id)
    const doc = await firmRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 })
    }
    await firmRef.update({
      likes_count: FieldValue.increment(1)
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Firm like error:', error)
    return NextResponse.json({ error: 'Failed to like firm' }, { status: 500 })
  }
}
