import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const doc = await db.collection('site_settings').doc('event_popup').get()
    if (doc.exists) {
      return NextResponse.json(doc.data())
    }
    return NextResponse.json({})
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await db.collection('site_settings').doc('event_popup').set(body, { merge: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
