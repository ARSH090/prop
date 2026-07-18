import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || 'home'

    const snapshot = await db.collection('site_content').where('page', '==', page).get()

    const items: any[] = []
    snapshot.forEach((doc: any) => {
      items.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching page builder configuration:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
