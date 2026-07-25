import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, category_id, candidates, name, description } = body
    const currentYear = new Date().getFullYear()

    if (action === 'create_or_update') {
      if (!category_id || !name) {
        return NextResponse.json({ error: 'category_id and name are required' }, { status: 400 })
      }
      await db.collection('awards_categories').doc(category_id).set({
        id: category_id,
        name,
        description: description || '',
        candidates: candidates || [],
        track: 'traders_choice',
        year: currentYear
      }, { merge: true })
      return NextResponse.json({ success: true })
    }

    if (action === 'reset_votes') {
      const snap = await db.collection('award_votes').where('year', '==', currentYear).get()
      const batch = db.batch()
      snap.forEach((doc: any) => batch.delete(doc.ref))
      await batch.commit()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in admin awards operation:', error)
    return NextResponse.json({ error: 'Admin operation failed' }, { status: 500 })
  }
}
