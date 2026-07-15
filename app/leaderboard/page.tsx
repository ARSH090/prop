import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getPayouts, getFirms } from '@/lib/firebase/server'
import LeaderboardClient from './LeaderboardClient'

export const metadata = {
  title: 'Funded Traders Payout Leaderboard - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const [payouts, firms] = await Promise.all([getPayouts(), getFirms()])

  const verifiedPayouts = payouts.filter((p) => p.is_verified)
  const activeFirms = firms.filter((f) => f.status === 'active')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Payout Leaderboard
          </h1>
          <p className="text-text-secondary text-sm">
            Rankings of top prop traders based on total verified payouts checks compiled by Anuraj FX.
          </p>
        </div>

        <LeaderboardClient payouts={verifiedPayouts} firms={activeFirms} />
      </main>
      <Footer />
    </div>
  )
}
