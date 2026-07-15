import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, Email, and Message are required' }, { status: 400 })
    }

    const docId = `msg-${Date.now()}`
    const ref = db.collection('contact_messages').doc(docId)

    await ref.set({
      name,
      email,
      message,
      status: 'new',
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json({ error: 'Failed to submit contact message' }, { status: 500 })
  }
}
