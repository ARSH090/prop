import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const snapshot = await db.collection('firm_contract_specs').where('firm_id', '==', id).get()
    const specs: any[] = []
    snapshot.forEach((doc: any) => {
      specs.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: specs })
  } catch (error) {
    console.error('Error fetching contract specs:', error)
    return NextResponse.json({ error: 'Failed to fetch contract specs' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await request.json()
    const { specs } = body

    if (!Array.isArray(specs)) {
      return NextResponse.json({ error: 'specs must be an array' }, { status: 400 })
    }

    const batch = db.batch()

    // Delete old specs
    const snapshot = await db.collection('firm_contract_specs').where('firm_id', '==', id).get()
    snapshot.forEach((doc: any) => {
      batch.delete(doc.ref)
    })

    // Insert new specs
    specs.forEach((spec: any) => {
      const ref = db.collection('firm_contract_specs').doc()
      batch.set(ref, {
        firm_id: id,
        contract_symbol: spec.contract_symbol || '',
        margin_requirement: Number(spec.margin_requirement) || 0,
        tick_value: Number(spec.tick_value) || 0,
        notes: spec.notes || '',
        created_at: new Date().toISOString()
      })
    })

    await batch.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving contract specs:', error)
    return NextResponse.json({ error: 'Failed to save contract specs' }, { status: 500 })
  }
}
