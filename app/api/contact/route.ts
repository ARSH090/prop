import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

// GET — returns contact messages for a specific email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    let query: FirebaseFirestore.Query = db.collection('contact_messages')
    if (email) {
      query = query.where('email', '==', email)
    }

    const snap = await query.orderBy('created_at', 'desc').limit(20).get()
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.().toISOString() || null,
      replied_at: doc.data().replied_at?.toDate?.().toISOString() || null,
    }))
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ data: [] })
  }
}

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
