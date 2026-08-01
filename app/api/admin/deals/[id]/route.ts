import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { MOCK_DEALS } from '@/lib/firebase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let paramId = ''
  try {
    const { id } = await params
    paramId = id
    const docRef = db.collection('deals').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      const mockDeal = MOCK_DEALS.find((d: any) => d.id === id)
      if (mockDeal) {
        return NextResponse.json(mockDeal)
      }
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin deal details:', error)
    const mockDeal = MOCK_DEALS.find((d: any) => d.id === paramId)
    if (mockDeal) {
      return NextResponse.json(mockDeal)
    }
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('deals').doc(id)

    const updateData = { ...body }
    if (body.expires_at) {
      updateData.expires_at = Timestamp.fromDate(new Date(body.expires_at))
    }

    await docRef.update({
      ...updateData,
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin deal details:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = db.collection('deals').doc(id)
    await docRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin deal:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
