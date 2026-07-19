import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getPayouts, getFirms } from '@/lib/firebase/server'
import LeaderboardClient from './LeaderboardClient'
import { BarChart2, Trophy } from 'lucide-react'

export const metadata = {
  title: 'Prop Firm Payouts Tracker & Trader Leaderboard - ANURAJ FX',
  description: 'Compare payout totals across prop firms, view trader rankings by total payouts, biggest payout, and most frequent payouts.',
}

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const [payouts, firms] = await Promise.all([getPayouts(), getFirms()])

  const verifiedPayouts = payouts.filter((p: any) => p.is_verified)
  const activeFirms = firms.filter((f: any) => f.status === 'active')

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

        <LeaderboardClient payouts={verifiedPayouts} firms={activeFirms} />
      </main>
      <Footer />
    </div>
  )
}
