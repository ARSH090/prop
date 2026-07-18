import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

const MOCK_DEALS_FALLBACK = [
  {
    id: 'deal-ftmo',
    code: 'AFX-FTMO25',
    title: 'FTMO Challenge 25% Off',
    discount_label: '25% OFF',
    description: 'Get 25% discount on FTMO challenges this month.',
    firm_id: 'ftmo',
    is_featured: true,
    click_count: 142,
    status: 'active',
  },
  {
    id: 'deal-topstep',
    code: 'ANURAJ-TOPSTEP',
    title: 'TopStep Verified Traders',
    discount_label: '20% OFF',
    description: 'Exclusive 20% discount for verified traders.',
    firm_id: 'topstep',
    is_featured: true,
    click_count: 89,
    status: 'active',
  },
]

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('deals').get()
    const deals: any[] = []
    snapshot.forEach((doc: any) => {
      deals.push({ id: doc.id, ...doc.data() })
    })

    if (deals.length === 0) {
      return NextResponse.json({ data: MOCK_DEALS_FALLBACK })
    }

    return NextResponse.json({ data: deals })
  } catch (error) {
    console.error('Error fetching admin deals:', error)
    return NextResponse.json({ data: MOCK_DEALS_FALLBACK })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, title, discount_label, description, firm_id, is_featured, expires_at, status } = body

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: 'Campaign title is required' }, { status: 400 })
    }
    if (!firm_id) {
      return NextResponse.json({ error: 'Please select a prop firm or broker' }, { status: 400 })
    }

    const docId = `deal-${code.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`

    // Check for duplicate code
    const existing = await db.collection('deals').doc(docId).get()
    if (existing.exists) {
      return NextResponse.json({ error: `A deal with code "${code}" already exists. Please use a different code.` }, { status: 409 })
    }

    const newDealRef = db.collection('deals').doc(docId)

    await newDealRef.set({
      code: code.toUpperCase(),
      title,
      discount_label: discount_label || '',
      description: description || '',
      firm_id,
      is_featured: !!is_featured,
      starts_at: FieldValue.serverTimestamp(),
      expires_at: expires_at ? Timestamp.fromDate(new Date(expires_at)) : null,
      status: status || 'active',
      click_count: 0,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: docId, message: 'Deal created successfully!' })
  } catch (error: any) {
    console.error('Error creating admin deal:', error)
    const errorMessage = error?.message || 'Failed to create deal. Please check your Firestore connection.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
