import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('notifications').orderBy('created_at', 'desc').get()
    const list: any[] = []
    snapshot.forEach((doc: any) => {
      list.push({
        id: doc.id,
        ...doc.data()
      })
    })
    return NextResponse.json({ data: list })
  } catch (error) {
    console.error('Error fetching admin notifications:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message } = body

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and Message are required' }, { status: 400 })
    }

    const docId = `notif-manual-${Date.now()}`
    const ref = db.collection('notifications').doc(docId)

    await ref.set({
      title,
      message,
      created_at: FieldValue.serverTimestamp(),
      read_by: [],
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    await db.collection('notifications').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin notification:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
}
