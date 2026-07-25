import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms, getChallenges } from '@/lib/firebase/server'
import AwardsClient from './AwardsClient'
import { Trophy } from 'lucide-react'

export const metadata = {
  title: 'ANURAJ FX Prop Trader Awards 2026',
  description: 'Vote for your favorite prop firms in the Traders Choice track and view dynamic Data Awards calculated directly from firm metrics.',
}

export const dynamic = 'force-dynamic'

export default async function AwardsPage() {
  const [firms, challenges] = await Promise.all([
    getFirms(),
    getChallenges(),
  ])

  const activeFirms = firms.filter((f) => f.status === 'active')
  const activeChallenges = challenges.filter((c) => c.is_active !== false)

  // Compute Data Awards dynamically
  // 1. Highest Profit Split
  const sortedByProfitSplit = [...activeChallenges].sort((a, b) => b.profit_split_pct - a.profit_split_pct)
  const bestProfitSplitChallenge = sortedByProfitSplit[0] || null
  const bestProfitSplitFirm = bestProfitSplitChallenge 
    ? activeFirms.find((f) => f.id === bestProfitSplitChallenge.firm_id) || null 
    : null

  // 2. Highest Max Allocation
  const highestAllocFirm = [...activeFirms].sort((a, b) => (b.max_allocation || 0) - (a.max_allocation || 0))[0] || null

  // 3. Fastest Payout Processing
  const getPayoutDays = (freq: string) => {
    const f = (freq || '').toLowerCase()
    if (f.includes('instant')) return 0
    if (f.includes('weekly')) return 7
    if (f.includes('bi-weekly') || f.includes('biweekly')) return 14
    return 30
  }
  const sortedByPayoutFreq = [...activeChallenges].sort((a, b) => getPayoutDays(a.payout_freq) - getPayoutDays(b.payout_freq))
  const fastestPayoutChallenge = sortedByPayoutFreq[0] || null
  const fastestPayoutFirm = fastestPayoutChallenge 
    ? activeFirms.find((f) => f.id === fastestPayoutChallenge.firm_id) || null 
    : null

  // 4. Best Evaluation Price (Cheapest challenge price per dollar size)
  const cheapestRatioChallenge = [...activeChallenges]
    .filter((c) => c.price > 0 && c.account_size > 0)
    .sort((a, b) => (a.price / a.account_size) - (b.price / b.account_size))[0] || null
  const cheapestRatioFirm = cheapestRatioChallenge 
    ? activeFirms.find((f) => f.id === cheapestRatioChallenge.firm_id) || null 
    : null

  const dataAwards = [
    {
      id: 'best_split',
      title: 'Highest Profit Split Award',
      metric: `${bestProfitSplitChallenge?.profit_split_pct || 95}% Profit Split`,
      description: 'Awarded to the firm offering the most generous payouts to successful traders.',
      firm: bestProfitSplitFirm,
    },
    {
      id: 'max_alloc',
      title: 'Highest Capital Scale Award',
      metric: highestAllocFirm?.max_allocation 
        ? `$${(highestAllocFirm.max_allocation / 1000).toLocaleString()}K Max`
        : '$500K Max Allocation',
      description: 'Awarded to the firm providing the largest funding accounts and scale potential.',
      firm: highestAllocFirm,
    },
    {
      id: 'fastest_payout',
      title: 'Fastest Payout Cycle Award',
      metric: fastestPayoutChallenge?.payout_freq 
        ? `${fastestPayoutChallenge.payout_freq} cycle` 
        : 'Instant Payouts',
      description: 'Awarded to the firm with the shortest payout hold and processing times.',
      firm: fastestPayoutFirm,
    },
    {
      id: 'best_price',
      title: 'Best Value Evaluation Award',
      metric: cheapestRatioChallenge 
        ? `$${cheapestRatioChallenge.price} for $${(cheapestRatioChallenge.account_size / 1000).toFixed(0)}K`
        : 'Cheapest Challenge Pricing',
      description: 'Awarded to the firm offering the most affordable challenge registration rates.',
      firm: cheapestRatioFirm,
    },
  ]

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Header Block */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Yearly Awards 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight afx-gradient-heading">
              AFX Prop Industry Awards
            </h1>
            <p className="text-text-secondary text-base leading-relaxed">
              Cast your vote in our community-driven Traders Choice awards or view auto-computed Data Awards recognizing operational excellence.
            </p>
          </div>

          {/* Client Interaction Layer */}
          <AwardsClient initialFirms={activeFirms} dataAwards={dataAwards} />
        </main>
      </div>

      <Footer />
    </div>
  )
}
