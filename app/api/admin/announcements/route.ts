import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snapshot = await db.collection('announcements').orderBy('created_at', 'desc').get()
    const list: any[] = []
    snapshot.forEach((doc: any) => {
      list.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: list })
  } catch (error) {
    console.error('Error fetching admin announcements:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const docId = `announcement-${Date.now()}`
    const ref = db.collection('announcements').doc(docId)

    await ref.set({
      title,
      content,
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 })
    }

    await db.collection('announcements').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
  }
}
