import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const docRef = db.collection('firms').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin firm details:', error)
    return NextResponse.json({ error: 'Failed to fetch firm' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('firms').doc(id)

    await docRef.update({
      ...body,
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin firm details:', error)
    return NextResponse.json({ error: 'Failed to update firm' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const docRef = db.collection('firms').doc(id)
    await docRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin firm:', error)
    return NextResponse.json({ error: 'Failed to delete firm' }, { status: 500 })
  }
}
