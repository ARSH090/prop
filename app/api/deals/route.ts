import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const featured = searchParams.get('featured') === 'true'

    const [dealsSnap, firmsSnap] = await Promise.all([
      db.collection('deals').where('status', '==', 'active').get(),
      db.collection('firms').get(),
    ])

    const firmsMap = new Map()
    firmsSnap.forEach((doc) => {
      const data = doc.data()
      firmsMap.set(doc.id, { name: data.name, slug: data.slug })
    })

    let deals: any[] = []
    dealsSnap.forEach((doc) => {
      const data = doc.data()
      const firm = firmsMap.get(data.firm_id) || null
      deals.push({
        id: doc.id,
        ...data,
        firm,
      })
    })

    // Sort by is_featured desc, created_at desc
    deals.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      const timeA = a.created_at?.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at).getTime()
      const timeB = b.created_at?.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at).getTime()
      return timeB - timeA
    })

    if (featured) {
      deals = deals.filter((deal) => deal.is_featured)
    }

    const total = deals.length
    const paginatedDeals = deals.slice(offset, offset + limit)

    return NextResponse.json({
      data: paginatedDeals,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching public deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}
