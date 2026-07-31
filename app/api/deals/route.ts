import { db } from '@/lib/firebase/admin'
import { getDeals, getFirms } from '@/lib/firebase/server'
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

    let deals: any[] = []

    if (dealsSnap.empty) {
      // Fall back to mock data
      const [mockDeals, mockFirms] = await Promise.all([getDeals(), getFirms()])
      const firmsMap = new Map(mockFirms.map((f: any) => [f.id, { name: f.name, slug: f.slug }]))
      deals = mockDeals.map((d: any) => ({
        ...d,
        firm: firmsMap.get(d.firm_id) || null,
      }))
    } else {
      const firmsMap = new Map()
      firmsSnap.forEach((doc: any) => {
        const data = doc.data()
        firmsMap.set(doc.id, { name: data.name, slug: data.slug })
      })

      dealsSnap.forEach((doc: any) => {
        const data = doc.data()
        const firm = firmsMap.get(data.firm_id) || null
        deals.push({ id: doc.id, ...data, firm })
      })
    }

    // Sort by is_featured desc, created_at desc
    deals.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      const timeA = a.created_at?.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at || 0).getTime()
      const timeB = b.created_at?.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at || 0).getTime()
      return timeB - timeA
    })

    if (featured) {
      deals = deals.filter((deal) => deal.is_featured)
    }

    const total = deals.length
    const paginatedDeals = deals.slice(offset, offset + limit)

    return NextResponse.json({
      deals: paginatedDeals,   // primary key for client-side code
      data: paginatedDeals,    // legacy key for compatibility
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching public deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

