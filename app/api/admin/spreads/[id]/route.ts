import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const docRef = db.collection('broker_spreads').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Spread not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin spread details:', error)
    return NextResponse.json({ error: 'Failed to fetch spread' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('broker_spreads').doc(id)

    const updated: any = { ...body }
    if (body.spread_pips !== undefined) updated.spread_pips = Number(body.spread_pips)

    await docRef.update({
      ...updated,
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin spread details:', error)
    return NextResponse.json({ error: 'Failed to update spread' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const docRef = db.collection('broker_spreads').doc(id)
    await docRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin spread:', error)
    return NextResponse.json({ error: 'Failed to delete spread' }, { status: 500 })
  }
}
