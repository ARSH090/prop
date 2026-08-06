import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

// GET user loyalty data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const docId = email.toLowerCase()
    const userRef = db.collection('loyalty_users').doc(docId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      // Create default loyalty account if not present
      const defaultAccount = {
        email: email.toLowerCase(),
        points: 200,
        tier: 1,
        claimed_dates: [],
        unlocked_rewards: [],
        created_at: FieldValue.serverTimestamp(),
      }
      await userRef.set(defaultAccount)
      return NextResponse.json({ data: defaultAccount })
    }

    return NextResponse.json({ data: userDoc.data() })
  } catch (error) {
    console.error('Error fetching loyalty account:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST actions: daily check-in, redeem reward, submit code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action, payload } = body

    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action are required' }, { status: 400 })
    }

    const docId = email.toLowerCase()
    const userRef = db.collection('loyalty_users').doc(docId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User loyalty account not found' }, { status: 404 })
    }

    const userData = userDoc.data() || {}
    let points = userData.points || 0
    let claimedDates = userData.claimed_dates || []
    let unlockedRewards = userData.unlocked_rewards || []

    if (action === 'claim_daily') {
      const todayStr = new Date().toISOString().split('T')[0]
      if (claimedDates.includes(todayStr)) {
        return NextResponse.json({ error: 'Daily reward already claimed today.' }, { status: 400 })
      }

      points += 10
      claimedDates.push(todayStr)

      // Add audit history log
      await db.collection('loyalty_history').add({
        email: email.toLowerCase(),
        action: 'Daily Reward Claimed',
        points: '+10 PTS',
        created_at: FieldValue.serverTimestamp(),
      })

      await userRef.update({
        points,
        claimed_dates: claimedDates,
      })

      return NextResponse.json({ success: true, points, claimed_dates: claimedDates })
    }

    if (action === 'submit_code') {
      const { code } = payload
      if (!code) {
        return NextResponse.json({ error: 'Promo code is required.' }, { status: 400 })
      }

      const cleanCode = code.trim().toUpperCase()
      const codeRef = db.collection('loyalty_codes').doc(cleanCode)
      const codeDoc = await codeRef.get()

      if (!codeDoc.exists) {
        return NextResponse.json({ error: 'Invalid loyalty code.' }, { status: 400 })
      }

      const codeData = codeDoc.data() || {}
      const usedBy = codeData.used_by || []

      if (usedBy.includes(email.toLowerCase())) {
        return NextResponse.json({ error: 'You have already used this loyalty code.' }, { status: 400 })
      }

      const codePoints = Number(codeData.points || 0)
      points += codePoints
      usedBy.push(email.toLowerCase())

      await codeRef.update({ used_by: usedBy })

      // Add audit history log
      await db.collection('loyalty_history').add({
        email: email.toLowerCase(),
        action: `Loyalty Code "${cleanCode}" Used`,
        points: `+${codePoints} PTS`,
        created_at: FieldValue.serverTimestamp(),
      })

      await userRef.update({ points })

      return NextResponse.json({ success: true, points, message: `Success! Added +${codePoints} Points.` })
    }

    if (action === 'redeem_reward') {
      const { size, cost } = payload
      if (!size || !cost) {
        return NextResponse.json({ error: 'Reward size and point cost are required.' }, { status: 400 })
      }

      if (points < cost) {
        return NextResponse.json({ error: 'Insufficient Loyalty Points.' }, { status: 400 })
      }

      if (unlockedRewards.includes(size)) {
        return NextResponse.json({ error: 'Challenge already unlocked.' }, { status: 400 })
      }

      points -= cost
      unlockedRewards.push(size)

      // Add audit history log
      await db.collection('loyalty_history').add({
        email: email.toLowerCase(),
        action: `Unlocked ${size} Challenge Reward`,
        points: `-${cost} PTS`,
        created_at: FieldValue.serverTimestamp(),
      })

      await userRef.update({
        points,
        unlocked_rewards: unlockedRewards,
      })

      return NextResponse.json({ success: true, points, unlocked_rewards: unlockedRewards })
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 })
  } catch (error) {
    console.error('Error handling loyalty action:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
