import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const currentYear = new Date().getFullYear()

    // 1. Fetch all categories for the current year
    const catsSnapshot = await db.collection('awards_categories')
      .where('year', '==', currentYear)
      .get()
      
    const categories: any[] = []
    catsSnapshot.forEach((doc: any) => {
      categories.push({ id: doc.id, ...doc.data() })
    })

    // Fallback if no categories are initialized yet
    if (categories.length === 0) {
      // Seed default categories
      const defaultCats = [
        { id: 'best_overall', name: 'Best Overall Prop Firm', description: 'The absolute champion in terms of trading environment, payouts, and customer trust.', track: 'traders_choice', candidates: [] as string[], year: currentYear },
        { id: 'best_support', name: 'Best Customer Support', description: 'Firms that go above and beyond to support their traders 24/7.', track: 'traders_choice', candidates: [] as string[], year: currentYear },
        { id: 'best_execution', name: 'Best Trade Execution', description: 'Lowest latency, slippage, and tightest spreads in live execution.', track: 'traders_choice', candidates: [] as string[], year: currentYear },
        { id: 'best_payouts', name: 'Fastest Payout Processing', description: 'Firms that verify and payout trader gains with zero delay.', track: 'traders_choice', candidates: [] as string[], year: currentYear },
      ]
      
      const activeFirmsSnap = await db.collection('firms').where('status', '==', 'active').get()
      const firmIds: string[] = []
      activeFirmsSnap.forEach((doc: any) => firmIds.push(doc.id))

      for (const cat of defaultCats) {
        cat.candidates = firmIds.slice(0, 5) // Seed first 5 firms
        await db.collection('awards_categories').doc(cat.id).set(cat)
        categories.push(cat)
      }
    }

    // 2. Fetch all votes for the current year
    const votesSnapshot = await db.collection('award_votes')
      .where('year', '==', currentYear)
      .get()

    // Map votes: category_id -> firm_id -> count
    const voteTallies: Record<string, Record<string, number>> = {}
    const userVotes: Record<string, string> = {} // category_id -> voted_firm_id

    votesSnapshot.forEach((doc: any) => {
      const data = doc.data()
      const { category_id, firm_id, user_id } = data

      if (!voteTallies[category_id]) {
        voteTallies[category_id] = {}
      }
      voteTallies[category_id][firm_id] = (voteTallies[category_id][firm_id] || 0) + 1

      if (userId && user_id === userId) {
        userVotes[category_id] = firm_id
      }
    })

    return NextResponse.json({
      data: {
        categories,
        voteTallies,
        userVotes,
      }
    })
  } catch (error) {
    console.error('Error fetching awards metadata:', error)
    return NextResponse.json({ error: 'Failed to retrieve awards data' }, { status: 500 })
  }
}
