import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { clearServerCache } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'

import { MOCK_FIRMS } from '@/lib/firebase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let paramId = ''
  try {
    const { id } = await params
    paramId = id
    const docRef = db.collection('firms').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      const mockFirm = MOCK_FIRMS.find((f: any) => f.id === id || f.slug === id)
      if (mockFirm) {
        return NextResponse.json(mockFirm)
      }
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching admin firm details:', error)
    const mockFirm = MOCK_FIRMS.find((f: any) => f.id === paramId || f.slug === paramId)
    if (mockFirm) {
      return NextResponse.json(mockFirm)
    }
    return NextResponse.json({ error: 'Failed to fetch firm' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = db.collection('firms').doc(id)

    await docRef.update({
      ...body,
      updated_at: FieldValue.serverTimestamp(),
    })

    clearServerCache()
    // Bust Next.js ISR cache so public firm pages reflect the update immediately
    revalidatePath('/firms', 'layout')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin firm details:', error)
    return NextResponse.json({ error: 'Failed to update firm' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = db.collection('firms').doc(id)
    await docRef.delete()

    clearServerCache()
    revalidatePath('/firms', 'layout')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin firm:', error)
    return NextResponse.json({ error: 'Failed to delete firm' }, { status: 500 })
  }
}
