import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const snapshot = await db.collection('favorites').where('user_id', '==', userId).get()
    const favorites: any[] = []
    snapshot.forEach((doc: any) => {
      favorites.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json({ data: favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, firm_id } = body

    if (!user_id || !firm_id) {
      return NextResponse.json({ error: 'User ID and Firm ID are required' }, { status: 400 })
    }

    const docId = `${user_id}_${firm_id}`
    const ref = db.collection('favorites').doc(docId)
    const docSnap = await ref.get()

    if (docSnap.exists) {
      // Toggle off
      await ref.delete()
      return NextResponse.json({ success: true, bookmarked: false })
    } else {
      // Toggle on
      await ref.set({
        user_id,
        firm_id,
        created_at: FieldValue.serverTimestamp(),
      })
      return NextResponse.json({ success: true, bookmarked: true })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 })
  }
}
