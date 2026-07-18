import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('contact_messages').orderBy('created_at', 'desc').get()
    const messages: any[] = []
    snapshot.forEach((doc: any) => {
      messages.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: messages })
  } catch (error) {
    console.error('Error fetching admin contact messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, reply, replyText } = body

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const ref = db.collection('contact_messages').doc(id)

    const updateData: any = {
      updated_at: FieldValue.serverTimestamp(),
    }

    if (status) {
      updateData.status = status
    }

    // If a reply is being saved
    if (reply && replyText) {
      updateData.admin_reply = replyText
      updateData.replied_at = FieldValue.serverTimestamp()
      updateData.status = 'resolved'
    }

    await ref.update(updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin contact message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}
