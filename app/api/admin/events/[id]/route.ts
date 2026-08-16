import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { clearServerCache } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'
import { MOCK_EVENTS } from '@/lib/firebase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let paramId = ''
  try {
    const { id } = await params
    paramId = id
    const docRef = db.collection('events').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      const mockEvt = MOCK_EVENTS.find((e: any) => e.id === id)
      if (mockEvt) {
        return NextResponse.json(mockEvt)
      }
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin event details:', error)
    const mockEvt = MOCK_EVENTS.find((e: any) => e.id === paramId)
    if (mockEvt) {
      return NextResponse.json(mockEvt)
    }
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('events').doc(id)

    await docRef.set({
      ...body,
      updated_at: FieldValue.serverTimestamp(),
    }, { merge: true })

    clearServerCache()
    revalidatePath('/events', 'layout')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin event details:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = db.collection('events').doc(id)
    await docRef.delete()

    clearServerCache()
    revalidatePath('/events', 'layout')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
