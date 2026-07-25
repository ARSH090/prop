import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getPayouts, getFirms, getDeals } from '@/lib/firebase/server'
import LeaderboardClient from './LeaderboardClient'
import { BarChart2 } from 'lucide-react'

export const metadata = {
  title: 'Prop Firm Payouts Tracker & Trader Leaderboard - ANURAJ FX',
  description: 'Compare payout totals across prop firms, view trader rankings by total payouts, biggest payout, and most frequent payouts.',
}

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  const [payouts, firms, deals] = await Promise.all([
    getPayouts(),
    getFirms(),
    getDeals(),
  ])

  const activeFirms = firms.filter((f: any) => {
    if (f.status !== 'active') return false
    const cats = f.category || []
    return cats.map((c: string) => c.toLowerCase()).includes(category.toLowerCase())
  })
  
  const enrichedFirms = activeFirms.map((firm) => {
    const activeDeal = deals.find((d) => d.firm_id === firm.id && d.status === 'active')
    return { ...firm, activeDeal }
  })

  const verifiedPayouts = payouts.filter((p: any) => p.is_verified && activeFirms.some((f) => f.id === p.firm_id))

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30">
            <BarChart2 className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">Live Rankings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight afx-gradient-heading">
            Prop Firm Payouts Tracker
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Compare payout times, payout totals, and payout history across prop firms.
            View firm-level payout trends and individual trader rankings.
          </p>
        </div>

        <LeaderboardClient payouts={verifiedPayouts} firms={enrichedFirms} category={category} />
      </main>
      <Footer />
    </div>
  )
}
