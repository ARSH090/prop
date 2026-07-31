import { db } from '@/lib/firebase/admin'
import { getFirms as getMockFirms } from '@/lib/firebase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'prop_firm'
    const search = searchParams.get('search')
    const categories = searchParams.get('categories')?.split(',').map(c => c.toLowerCase()) || []
    const platforms = searchParams.get('platforms')?.split(',') || []
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const sortBy = searchParams.get('sortBy') || 'rating'

    // Fetch from Firestore
    const snapshot = await db.collection('firms').where('type', '==', type).get()

    let firms: any[] = []

    if (snapshot.empty) {
      // Fall back to mock data when Firestore is empty
      const allMock = await getMockFirms()
      firms = allMock.filter((f: any) => f.type === type && f.status === 'active')
    } else {
      snapshot.forEach((doc: any) => {
        const data = doc.data()
        if (data.status === 'active') {
          firms.push({ id: doc.id, ...data })
        }
      })
    }

    // Search query filtering
    if (search) {
      const queryLower = search.toLowerCase()
      firms = firms.filter(
        (firm) =>
          firm.name?.toLowerCase().includes(queryLower) ||
          firm.description?.toLowerCase().includes(queryLower)
      )
    }

    // Rating filtering
    if (minRating > 0) {
      firms = firms.filter((firm) => (firm.rating || 0) >= minRating)
    }

    // Category filtering
    if (categories.length > 0 && categories[0]) {
      firms = firms.filter((firm) =>
        firm.category?.some((cat: string) => categories.includes(cat.toLowerCase()))
      )
    }

    // Platforms filtering
    if (platforms.length > 0 && platforms[0]) {
      firms = firms.filter((firm) =>
        firm.platforms?.some((plat: string) => platforms.includes(plat))
      )
    }

    // Sorter logic
    switch (sortBy) {
      case 'reviews':
        firms.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
        break
      case 'featured':
        firms.sort((a, b) => {
          if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1
          return (b.rating || 0) - (a.rating || 0)
        })
        break
      case 'newest':
        firms.sort((a, b) => {
          const timeA = a.created_at?.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at || 0).getTime()
          const timeB = b.created_at?.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at || 0).getTime()
          return timeB - timeA
        })
        break
      case 'rating':
      default:
        firms.sort((a, b) => {
          if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0)
          return (b.review_count || 0) - (a.review_count || 0)
        })
    }

    return NextResponse.json({ firms })
  } catch (error) {
    console.error('Error fetching public firms:', error)
    return NextResponse.json({ error: 'Failed to fetch firms' }, { status: 500 })
  }
}
