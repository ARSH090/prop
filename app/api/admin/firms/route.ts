import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('firms').get()
    const firms: any[] = []
    snapshot.forEach((doc) => {
      firms.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json({ data: firms })
  } catch (error) {
    console.error('Error fetching admin firms:', error)
    return NextResponse.json({ error: 'Failed to fetch firms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slug,
      name,
      type,
      category,
      logo_url,
      country,
      platforms,
      max_allocation,
      website_url,
      affiliate_url,
      is_featured,
      is_verified,
      description,
      rules,
      status,
    } = body

    if (!slug || !name || !type) {
      return NextResponse.json({ error: 'Slug, Name, and Type are required' }, { status: 400 })
    }

    const docId = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const newFirmRef = db.collection('firms').doc(docId)

    await newFirmRef.set({
      slug: docId,
      name,
      type,
      category: category || [],
      logo_url: logo_url || '',
      country: country || '',
      platforms: platforms || [],
      max_allocation: Number(max_allocation) || 0,
      rating: 4.0,
      review_count: 0,
      website_url: website_url || '',
      affiliate_url: affiliate_url || '',
      is_featured: !!is_featured,
      is_verified: !!is_verified,
      description: description || '',
      rules: rules || {},
      status: status || 'active',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin firm:', error)
    return NextResponse.json({ error: 'Failed to create firm' }, { status: 500 })
  }
}
