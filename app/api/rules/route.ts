import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('firm_rules').get()
    const rules: any[] = []
    snapshot.forEach((doc: any) => {
      rules.push({ id: doc.id, ...doc.data() })
    })
    // Sort by effective_date DESC
    const sorted = rules.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())
    return NextResponse.json({ data: sorted })
  } catch (error) {
    console.error('Error fetching public rules changelog:', error)
    return NextResponse.json({ error: 'Failed to fetch rules history' }, { status: 500 })
  }
}
