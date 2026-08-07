import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { clearServerCache } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firmId = searchParams.get('firm_id')

    if (firmId) {
      // Fetch rules for specific firm
      const docSnap = await db.collection('firm_rules').doc(firmId).get()
      if (docSnap.exists) {
        return NextResponse.json({ success: true, data: { id: docSnap.id, ...docSnap.data() } })
      }
      return NextResponse.json({ success: true, data: null })
    }

    // Fetch all rules
    const snapshot = await db.collection('firm_rules').get()
    const rules: any[] = []
    snapshot.forEach((doc: any) => {
      rules.push({ id: doc.id, ...doc.data() })
    })
    return NextResponse.json({ success: true, data: rules })
  } catch (error) {
    console.error('Error fetching admin rules:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch rules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firm_id,
      max_daily_loss,
      max_drawdown,
      drawdown_type,
      consistency_rule,
      min_trading_days,
      profit_target_phase1,
      profit_target_phase2,
      ea_allowed,
      copy_trading_allowed,
      news_trading_allowed,
    } = body

    if (!firm_id) {
      return NextResponse.json({ error: 'Firm ID is required' }, { status: 400 })
    }

    const ruleRef = db.collection('firm_rules').doc(firm_id)
    const ruleSnap = await ruleRef.get()

    const oldRules = ruleSnap.exists ? (ruleSnap.data() || {}) : {}

    // Fields to compare and log changes for
    const fieldsToTrack: (keyof typeof body)[] = [
      'max_daily_loss',
      'max_drawdown',
      'drawdown_type',
      'consistency_rule',
      'min_trading_days',
      'profit_target_phase1',
      'profit_target_phase2',
      'ea_allowed',
      'copy_trading_allowed',
      'news_trading_allowed',
    ]

    const batch = db.batch()

    fieldsToTrack.forEach((field) => {
      const newValue = body[field] !== undefined ? body[field] : null
      const oldValue = oldRules[field] !== undefined ? oldRules[field] : null

      // Check if values differ (handling string/number/boolean comparisons)
      const isDifferent = String(newValue) !== String(oldValue)

      // Only insert into history if there is an old value to record or it has actually changed
      if (isDifferent) {
        const historyRef = db.collection('firm_rule_history').doc()
        batch.set(historyRef, {
          firm_id,
          rule_field: field,
          old_value: oldValue !== null ? String(oldValue) : 'Not Set',
          new_value: newValue !== null ? String(newValue) : 'Not Set',
          changed_at: FieldValue.serverTimestamp(),
        })
      }
    })

    // Write updated rules
    const updatedRulesData = {
      firm_id,
      max_daily_loss: max_daily_loss || '',
      max_drawdown: max_drawdown || '',
      drawdown_type: drawdown_type || 'static',
      consistency_rule: consistency_rule || '',
      min_trading_days: Number(min_trading_days) || 0,
      profit_target_phase1: profit_target_phase1 || '',
      profit_target_phase2: profit_target_phase2 || null,
      ea_allowed: !!ea_allowed,
      copy_trading_allowed: !!copy_trading_allowed,
      news_trading_allowed: !!news_trading_allowed,
      updated_at: FieldValue.serverTimestamp(),
    }

    batch.set(ruleRef, updatedRulesData, { merge: true })

    // Sync rules parameters to standard firms collection for quick public lookup compatibility
    const firmRef = db.collection('firms').doc(firm_id)
    const firmSnap = await firmRef.get()
    if (firmSnap.exists) {
      const currentRules = firmSnap.data()?.rules || {}
      
      // Map new rules structure back to existing rule parameters to maintain compatibility
      currentRules.daily_loss = max_daily_loss || ''
      currentRules.max_loss = max_drawdown || ''
      currentRules.drawdown_type = drawdown_type || 'static'
      currentRules.consistency_rule_percent = consistency_rule || 'No'
      currentRules.min_trading_days = String(min_trading_days) || '0'
      currentRules.profit_target = profit_target_phase1 || ''
      currentRules.ea_allowed = ea_allowed ? 'Yes' : 'No'
      currentRules.copy_trading_allowed = copy_trading_allowed ? 'Yes' : 'No'
      currentRules.news_trading_allowed = news_trading_allowed ? 'Yes' : 'No'
      
      batch.update(firmRef, {
        rules: currentRules,
        updated_at: FieldValue.serverTimestamp(),
      })
    }

    await batch.commit()

    clearServerCache()
    revalidatePath('/rules', 'layout')
    revalidatePath('/rule-changes', 'layout')
    revalidatePath('/ea-copy-trading-platforms', 'layout')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving admin rules:', error)
    return NextResponse.json({ error: 'Failed to update rules' }, { status: 500 })
  }
}
