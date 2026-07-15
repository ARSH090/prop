import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('deals').get()
    const deals: any[] = []
    snapshot.forEach((doc) => {
      deals.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json({ data: deals })
  } catch (error) {
    console.error('Error fetching admin deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, title, discount_label, description, firm_id, is_featured, expires_at, status } = body

    if (!code || !title || !firm_id) {
      return NextResponse.json({ error: 'Code, Title, and Firm ID are required' }, { status: 400 })
    }

    const docId = `deal-${code.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`
    const newDealRef = db.collection('deals').doc(docId)

    await newDealRef.set({
      code,
      title,
      discount_label: discount_label || '',
      description: description || '',
      firm_id,
      is_featured: !!is_featured,
      starts_at: FieldValue.serverTimestamp(),
      expires_at: expires_at ? Timestamp.fromDate(new Date(expires_at)) : null,
      status: status || 'active',
      click_count: 0,
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin deal:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
