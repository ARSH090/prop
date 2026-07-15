import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 })
    }

    const batch = db.batch()

    for (const item of items) {
      const docRef = db.collection('site_content').doc(item.id)
      batch.update(docRef, {
        value: item.value,
        updated_at: FieldValue.serverTimestamp(),
      })
    }

    await batch.commit()

    // Trigger instant ISR cache revalidation
    revalidatePath('/')
    revalidatePath('/firms')
    revalidatePath('/brokers')
    revalidatePath('/deals')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving page builder items:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
