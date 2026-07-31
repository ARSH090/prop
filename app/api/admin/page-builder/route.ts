import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SITE_CONTENT } from '@/lib/firebase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || 'home'

    const snapshot = await db.collection('site_content').where('page', '==', page).get()

    const dbItemsMap = new Map()
    snapshot.forEach((doc: any) => {
      const data = doc.data()
      dbItemsMap.set(data.section_key, { id: doc.id, ...data })
    })

    const pageDefaults = MOCK_SITE_CONTENT[page] || {}
    const items: any[] = []

    // Ensure all default keys exist
    for (const key of Object.keys(pageDefaults)) {
      if (dbItemsMap.has(key)) {
        items.push(dbItemsMap.get(key))
      } else {
        const val = pageDefaults[key]
        const contentType = Array.isArray(val) || typeof val === 'object' ? 'json' : 'text'
        items.push({
          id: `temp-${page}-${key}`,
          page,
          section_key: key,
          content_type: contentType,
          value: contentType === 'json' ? JSON.stringify(val) : String(val),
          is_active: true,
        })
      }
    }

    // Add any database keys not in defaults
    dbItemsMap.forEach((item, key) => {
      if (!pageDefaults.hasOwnProperty(key)) {
        items.push(item)
      }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching page builder configuration:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
