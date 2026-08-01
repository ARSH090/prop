import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('firm_rules').get()
    const rules: any[] = []
    snapshot.forEach((doc: any) => {
      rules.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ data: rules })
  } catch (error) {
    console.error('Error fetching admin rules:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firm_id, rule_key, rule_value, effective_date } = body

    if (!firm_id || !rule_key || rule_value === undefined) {
      return NextResponse.json({ error: 'Firm ID, Rule Key, and Rule Value are required' }, { status: 400 })
    }

    // 1. Find previous rule value if any
    const historySnapshot = await db.collection('firm_rules')
      .where('firm_id', '==', firm_id)
      .where('rule_key', '==', rule_key)
      .get()
    
    let previous_value: string | null = null
    let latestDate: Date | null = null

    historySnapshot.forEach((doc: any) => {
      const data = doc.data()
      const effDate = new Date(data.effective_date)
      if (!latestDate || effDate > latestDate) {
        latestDate = effDate
        previous_value = data.rule_value
      }
    })

    const docId = `rule-${firm_id}-${rule_key}-${Date.now()}`
    const ref = db.collection('firm_rules').doc(docId)

    await ref.set({
      firm_id,
      rule_key,
      rule_value: String(rule_value),
      previous_value,
      effective_date: effective_date || new Date().toISOString().split('T')[0],
      created_at: FieldValue.serverTimestamp()
    })

    // Also update current active rules directly on the firm document for quick lookup access
    const firmRef = db.collection('firms').doc(firm_id)
    const firmSnap = await firmRef.get()
    if (firmSnap.exists) {
      const currentRules = firmSnap.data()?.rules || {}
      currentRules[rule_key] = String(rule_value)
      await firmRef.update({
        rules: currentRules,
        updated_at: FieldValue.serverTimestamp()
      })
    }

    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin rule:', error)
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 })
  }
}
