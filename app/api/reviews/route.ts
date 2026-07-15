import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firmId = searchParams.get('firm_id')

    let query: any = db.collection('reviews').where('status', '==', 'published')
    if (firmId && firmId !== 'all') {
      query = query.where('firm_id', '==', firmId)
    }

    const snapshot = await query.get()
    const reviews: any[] = []
    snapshot.forEach((doc: any) => {
      reviews.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json({ data: reviews })
  } catch (error) {
    console.error('Error fetching public reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, firm_id, rating, title, body: reviewBody, full_name } = body

    if (!user_id || !firm_id || !rating || !title || !reviewBody) {
      return NextResponse.json({ error: 'User ID, Firm ID, Rating, Title, and Body are required' }, { status: 400 })
    }

    const docId = `rev-${user_id}-${firm_id}-${Date.now()}`
    const ref = db.collection('reviews').doc(docId)

    await ref.set({
      user_id,
      firm_id,
      rating: Number(rating),
      title,
      body: reviewBody,
      full_name: full_name || 'Anonymous Trader',
      status: 'pending', // pending moderation by default
      is_verified_trader: true,
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error submitting trader review:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
