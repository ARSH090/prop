import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'users' or 'codes'

    if (type === 'codes') {
      const snapshot = await db.collection('loyalty_codes').get()
      const codes: any[] = []
      snapshot.forEach((doc: any) => {
        codes.push({ id: doc.id, ...doc.data() })
      })
      return NextResponse.json({ data: codes })
    }

    // Default: fetch users
    const snapshot = await db.collection('loyalty_users').get()
    const users: any[] = []
    snapshot.forEach((doc: any) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: users })
  } catch (error) {
    console.error('Error fetching admin loyalty settings:', error)
    return NextResponse.json({ error: 'Failed to fetch admin loyalty data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, points } = body

    if (!code || !points) {
      return NextResponse.json({ error: 'Promo code and point value are required' }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()
    const codeRef = db.collection('loyalty_codes').doc(cleanCode)

    await codeRef.set({
      points: Number(points),
      used_by: [],
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: cleanCode })
  } catch (error) {
    console.error('Error creating loyalty code:', error)
    return NextResponse.json({ error: 'Failed to create loyalty code' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.code && body.points !== undefined) {
      const { code, points } = body
      const codeRef = db.collection('loyalty_codes').doc(code.toUpperCase())
      await codeRef.update({
        points: Number(points),
      })
      return NextResponse.json({ success: true })
    }

    const { email, points } = body

    if (!email || points === undefined) {
      return NextResponse.json({ error: 'Email and points fields are required' }, { status: 400 })
    }

    const userRef = db.collection('loyalty_users').doc(email.toLowerCase())
    await userRef.update({
      points: Number(points),
    })

    // Log the change in history
    await db.collection('loyalty_history').add({
      email: email.toLowerCase(),
      action: 'Admin Manual Points Adjustment',
      points: `Set to ${points} PTS`,
      created_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adjusting user loyalty points:', error)
    return NextResponse.json({ error: 'Failed to adjust points' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Code name is required' }, { status: 400 })
    }

    await db.collection('loyalty_codes').doc(code.toUpperCase()).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting loyalty code:', error)
    return NextResponse.json({ error: 'Failed to delete loyalty code' }, { status: 500 })
  }
}
