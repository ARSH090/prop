import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { clearServerCache } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'
import { getEvents } from '@/lib/firebase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const events = await getEvents()
    return NextResponse.json({ data: events })
  } catch (error) {
    console.error('Error fetching admin events:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, image_url, description, date, time, format, seats, prize, status, registrationUrl, tags } = body

    if (!title) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 })
    }
    if (!type) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 })
    }

    const docId = `evt-${Date.now()}`
    const ref = db.collection('events').doc(docId)

    await ref.set({
      title,
      type,
      image_url: image_url || '',
      description: description || '',
      date: date || '',
      time: time || '',
      format: format || '',
      seats: seats !== undefined ? seats : null,
      prize: prize || null,
      status: status || 'upcoming',
      registrationUrl: registrationUrl || '#',
      tags: tags || [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    clearServerCache()
    revalidatePath('/events', 'layout')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, id: docId, message: 'Event created successfully!' })
  } catch (error: any) {
    console.error('Error creating admin event:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create event.' }, { status: 500 })
  }
}
