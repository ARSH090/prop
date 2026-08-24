import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms, getChallenges, getDeals } from '@/lib/firebase/server'
import CompareClient from './CompareClient'

export const metadata = {
  title: 'Compare Prop Firms Side-by-Side — EMPIRIAL Terminal',
  description:
    'Compare top prop firms side-by-side with dense specification metrics, normalized radar graph analysis, verified coupon discounts, and instant challenge checkout.',
}

export const dynamic = 'force-dynamic'

export default async function ComparePage() {
  const [firms, challenges, deals] = await Promise.all([
    getFirms('prop_firm'),
    getChallenges(),
    getDeals(),
  ])

  const activeFirms = firms.filter((f) => f.status === 'active')
  const activeChallenges = challenges.filter((c) => c.is_active !== false)
  const activeDeals = deals.filter((d) => d.status !== 'inactive')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Header Bar */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">Real-time Terminal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
              Prop Firm Comparison Terminal
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Evaluate risk parameters, trading rules, payout speeds, and discount terms side-by-side with mathematically normalized metric graphs.
            </p>
          </div>

          <CompareClient
            firms={activeFirms}
            challenges={activeChallenges}
            deals={activeDeals}
          />
        </main>
      </div>
      <Footer />
    </div>
  )
}

