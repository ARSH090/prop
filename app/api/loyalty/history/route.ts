import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const snapshot = await db
      .collection('loyalty_history')
      .where('email', '==', email.toLowerCase())
      .orderBy('created_at', 'desc')
      .get()

    const list: any[] = []
    snapshot.forEach((doc: any) => {
      const data = doc.data()
      list.push({
        id: doc.id,
        action: data.action,
        points: data.points,
        created_at: data.created_at?.toDate() ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      })
    })

    return NextResponse.json({ data: list })
  } catch (error) {
    console.error('Error fetching loyalty history logs:', error)
    return NextResponse.json({ data: [] })
  }
}
