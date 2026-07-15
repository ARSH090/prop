import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getChallenges, getFirms, getDeals } from '@/lib/firebase/server'
import ChallengesClient from './ChallengesClient'

export const metadata = {
  title: 'Challenges Comparison Directory - ANURAJ FX',
  description: 'Compare every prop challenge size, profit split, drawdowns, and pricing side-by-side.',
}

export const dynamic = 'force-dynamic'

export default async function ChallengesPage() {
  const [challenges, firms, deals] = await Promise.all([
    getChallenges(),
    getFirms(),
    getDeals(),
  ])

  // Filter active challenges
  const activeChallenges = challenges.filter((c) => c.is_active !== false)
  const activeFirms = firms.filter((f) => f.status === 'active')
  const activeDeals = deals.filter((d) => d.status === 'active')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Prop Trading Challenges
          </h1>
          <p className="text-text-secondary text-sm">
            Find the best evaluation program matching your budget, step preferences, and drawdowns.
          </p>
        </div>

        <ChallengesClient
          initialChallenges={activeChallenges}
          firms={activeFirms}
          deals={activeDeals}
        />
      </main>
      <Footer />
    </div>
  )
}
