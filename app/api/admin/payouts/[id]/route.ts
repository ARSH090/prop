import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = db.collection('payouts').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin payout details:', error)
    return NextResponse.json({ error: 'Failed to fetch payout' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('payouts').doc(id)

    const updated: any = { ...body }
    if (body.amount !== undefined) updated.amount = Number(body.amount)
    if (body.payout_amount !== undefined) updated.payout_amount = Number(body.payout_amount)
    if (body.account_size !== undefined) updated.account_size = Number(body.account_size)
    if (body.payout_date !== undefined) {
      updated.payout_date = Timestamp.fromDate(new Date(body.payout_date))
    }

    await docRef.update({
      ...updated,
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin payout details:', error)
    return NextResponse.json({ error: 'Failed to update payout' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = db.collection('payouts').doc(id)
    await docRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin payout:', error)
    return NextResponse.json({ error: 'Failed to delete payout' }, { status: 500 })
  }
}
