import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reviewRef = db.collection('reviews').doc(id)
    const doc = await reviewRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }
    await reviewRef.update({
      upvotes: FieldValue.increment(1)
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review upvote error:', error)
    return NextResponse.json({ error: 'Failed to upvote review' }, { status: 500 })
  }
}
