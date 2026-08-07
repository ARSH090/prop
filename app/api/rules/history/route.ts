import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('firm_rule_history').orderBy('changed_at', 'desc').get()
    const history: any[] = []
    
    snapshot.forEach((doc: any) => {
      const data = doc.data()
      history.push({
        id: doc.id,
        ...data,
        changed_at: data.changed_at?.toDate() ? data.changed_at.toDate().toISOString() : new Date().toISOString(),
      })
    })

    return NextResponse.json({ success: true, data: history })
  } catch (error) {
    console.error('Error fetching public rules history:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch rules history' }, { status: 500 })
  }
}
