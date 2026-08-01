import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { clearServerCache } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

import { getChallenges } from '@/lib/firebase/server'

export async function GET(request: NextRequest) {
  try {
    const challenges = await getChallenges()
    return NextResponse.json({ data: challenges })
  } catch (error) {
    console.error('Error fetching admin challenges:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firm_id,
      account_size,
      steps,
      profit_target_p1,
      profit_target_p2,
      daily_loss_pct,
      max_loss_pct,
      pt_dd_ratio,
      profit_split_pct,
      payout_freq,
      loyalty_points,
      price,
      original_price,
      currency,
      deal_id,
      affiliate_url,
      is_active,
      logo_url,
    } = body

    if (!firm_id || !account_size || !price) {
      return NextResponse.json({ error: 'Firm ID, Account Size, and Price are required' }, { status: 400 })
    }

    const docId = `ch-${firm_id}-${account_size}-${steps}-step-${Date.now()}`
    const ref = db.collection('challenges').doc(docId)

    await ref.set({
      firm_id,
      account_size: Number(account_size),
      steps: Number(steps),
      profit_target_p1: Number(profit_target_p1) || 0,
      profit_target_p2: Number(profit_target_p2) || 0,
      daily_loss_pct: Number(daily_loss_pct) || 0,
      max_loss_pct: Number(max_loss_pct) || 0,
      pt_dd_ratio: pt_dd_ratio || '1:1',
      profit_split_pct: Number(profit_split_pct) || 80,
      payout_freq: payout_freq || 'Bi-weekly',
      loyalty_points: Number(loyalty_points) || 0,
      popularity_score: 0,
      price: Number(price),
      original_price: Number(original_price) || Number(price),
      currency: currency || 'USD',
      deal_id: deal_id || null,
      affiliate_url: affiliate_url || null,
      logo_url: logo_url || null,
      is_active: is_active !== false,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })

    clearServerCache()
    revalidatePath('/challenges', 'layout')
    revalidatePath('/firms', 'layout')
    return NextResponse.json({ success: true, id: docId })
  } catch (error) {
    console.error('Error creating admin challenge:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}
