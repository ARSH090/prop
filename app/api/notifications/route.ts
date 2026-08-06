import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('notifications').orderBy('created_at', 'desc').limit(15).get()
    const list: any[] = []
    snapshot.forEach((doc: any) => {
      list.push({
        id: doc.id,
        ...doc.data()
      })
    })
    return NextResponse.json({ data: list })
  } catch (error) {
    console.error('Error fetching public notifications:', error)
    return NextResponse.json({ data: [] })
  }
}
