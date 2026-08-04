import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { clearServerCache } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const MOCK_FIRMS_FALLBACK = [
  { id: 'ftmo', name: 'FTMO', type: 'prop_firm', category: ['forex', 'futures', 'crypto'], status: 'active' },
  { id: 'topstep', name: 'TopStep Trader', type: 'prop_firm', category: ['futures'], status: 'active' },
  { id: '5ers', name: '5ers', type: 'prop_firm', category: ['forex'], status: 'active' },
  { id: 'zerodha', name: 'Zerodha', type: 'broker', category: ['stocks'], status: 'active' },
]

import { getFirms } from '@/lib/firebase/server'

export async function GET(request: NextRequest) {
  try {
    const firms = await getFirms()
    return NextResponse.json({ data: firms })
  } catch (error) {
    console.error('Error fetching admin firms:', error)
    return NextResponse.json({ data: [] })
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
      marquee_logo_url,
      show_in_marquee,
      show_in_globe,
      globe_logo_url,
      globe_color,
      country,
      platforms,
      max_allocation,
      website_url,
      affiliate_url,
      is_featured,
      is_verified,
      is_favorite,
      circle_crop_logo,
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
      marquee_logo_url: marquee_logo_url || '',
      show_in_marquee: show_in_marquee !== false,
      show_in_globe: !!show_in_globe,
      globe_logo_url: globe_logo_url || '',
      globe_color: globe_color || '#00D2FF',
      country: country || '',
      platforms: platforms || [],
      max_allocation: Number(max_allocation) || 0,
      rating: 4.0,
      review_count: 0,
      website_url: website_url || '',
      affiliate_url: affiliate_url || '',
      is_featured: !!is_featured,
      is_verified: !!is_verified,
      is_favorite: !!is_favorite,
      circle_crop_logo: !!circle_crop_logo,
      description: description || '',
      rules: rules || {},
      status: status || 'active',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    clearServerCache()
    revalidatePath('/firms', 'layout')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin firm:', error)
    return NextResponse.json({ error: 'Failed to create firm' }, { status: 500 })
  }
}
