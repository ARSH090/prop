import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, category_id, firm_id } = body
    const currentYear = new Date().getFullYear()

    if (!user_id || !category_id || !firm_id) {
      return NextResponse.json({ error: 'Missing userId, categoryId or firmId' }, { status: 400 })
    }

    // Enforce unique voting: 1 vote per user, per category, per year
    const voteId = `${user_id}_${category_id}_${currentYear}`
    const ref = db.collection('award_votes').doc(voteId)
    
    await ref.set({
      user_id,
      category_id,
      firm_id,
      year: currentYear,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording award vote:', error)
    return NextResponse.json({ error: 'Failed to register vote' }, { status: 500 })
  }
}
