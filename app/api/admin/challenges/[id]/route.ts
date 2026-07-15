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
    const docRef = db.collection('challenges').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin challenge details:', error)
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('challenges').doc(id)

    // Normalize types
    const updated: any = { ...body }
    if (body.account_size !== undefined) updated.account_size = Number(body.account_size)
    if (body.steps !== undefined) updated.steps = Number(body.steps)
    if (body.price !== undefined) updated.price = Number(body.price)
    if (body.original_price !== undefined) updated.original_price = Number(body.original_price)
    if (body.profit_target_p1 !== undefined) updated.profit_target_p1 = Number(body.profit_target_p1)
    if (body.profit_target_p2 !== undefined) updated.profit_target_p2 = Number(body.profit_target_p2)
    if (body.daily_loss_pct !== undefined) updated.daily_loss_pct = Number(body.daily_loss_pct)
    if (body.max_loss_pct !== undefined) updated.max_loss_pct = Number(body.max_loss_pct)
    if (body.profit_split_pct !== undefined) updated.profit_split_pct = Number(body.profit_split_pct)
    if (body.loyalty_points !== undefined) updated.loyalty_points = Number(body.loyalty_points)

    await docRef.update({
      ...updated,
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin challenge details:', error)
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const docRef = db.collection('challenges').doc(id)
    await docRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin challenge:', error)
    return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 })
  }
}
