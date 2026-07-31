import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getChallenges, getFirms, getDeals } from '@/lib/firebase/server'
import ChallengesClient from './ChallengesClient'

export const metadata = {
  title: 'Compare the Best Prop Trading Firms of 2026 - EMPIRIAL',
  description: 'Trusted platform to compare prop trading firms using verified data and insights, including reviews, rules, and rankings.',
}

export const dynamic = 'force-dynamic'

export default async function ChallengesPage({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  const [challenges, firms, deals] = await Promise.all([
    getChallenges(),
    getFirms(),
    getDeals(),
  ])

  // Filter active challenges
  const activeFirms = firms.filter((f) => {
    if (f.status !== 'active') return false
    const cats = f.category || []
    return cats.map((c: string) => c.toLowerCase()).includes(category.toLowerCase())
  })
  const activeChallenges = challenges.filter((c) => c.is_active !== false && activeFirms.some((f) => f.id === c.firm_id))
  const activeDeals = deals.filter((d) => d.status === 'active' && activeFirms.some((f) => f.id === d.firm_id))

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title and trust badges matches screenshots */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            Compare the Best Prop Trading Firms of 2026
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
            Trusted platform to compare prop trading firms using verified data and insights, including reviews, rules, and rankings.
          </p>

          {/* Trust stats overlay badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="px-3.5 py-1.5 rounded-full bg-bg-surface border border-border-subtle/50 text-[10px] md:text-xs font-bold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan" />
              60+ Verified Top Prop Firms
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-bg-surface border border-border-subtle/50 text-[10px] md:text-xs font-bold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-purple" />
              1500+ Challenges
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-bg-surface border border-border-subtle/50 text-[10px] md:text-xs font-bold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
              11000+ Real Trader Reviews
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-bg-surface border border-border-subtle/50 text-[10px] md:text-xs font-bold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              4M+ Monthly Website Views
            </span>
          </div>
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
