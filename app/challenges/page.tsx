import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getChallenges, getFirms, getDeals, getSiteContent } from '@/lib/firebase/server'
import ChallengesClient from './ChallengesClient'

export const metadata = {
  title: 'Compare the Best Prop Trading Challenges of 2026 - ANURAJ FX',
  description: 'Trusted platform to compare prop trading evaluation challenges using verified data and insights, including size, targets, loss limits, and pricing.',
  keywords: ['prop challenges', 'compare prop challenges', 'best prop evaluation 2026', 'FTMO challenge', 'Funding Pips challenge price'],
  openGraph: {
    title: 'Compare the Best Prop Trading Challenges of 2026 - ANURAJ FX',
    description: 'Trusted platform to compare prop trading evaluation challenges using verified data and insights, including size, targets, loss limits, and pricing.',
    url: 'https://anurajfx.com/challenges',
    siteName: 'ANURAJ FX',
    images: [{ url: 'https://anurajfx.com/og-image.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare the Best Prop Trading Challenges of 2026 - ANURAJ FX',
    description: 'Trusted platform to compare prop trading evaluation challenges using verified data and insights, including size, targets, loss limits, and pricing.',
    images: ['https://anurajfx.com/og-image.png'],
  }
}

export const dynamic = 'force-dynamic'

export default async function ChallengesPage({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  const [challenges, firms, deals, pageContent] = await Promise.all([
    getChallenges(),
    getFirms(),
    getDeals(),
    getSiteContent('challenges'),
  ])

  // Filter active firms & challenges
  const activeFirms = firms.filter((f) => f.status !== 'inactive')
  const activeChallenges = challenges.filter((c) => c.is_active !== false && activeFirms.some((f) => f.id === c.firm_id))
  const activeDeals = deals.filter((d) => d.status === 'active' && activeFirms.some((f) => f.id === d.firm_id))

  return (
    <div className="min-h-screen bg-transparent text-text-primary">
      <NavBar />
      <main className="w-full max-w-full px-4 md:px-8 lg:px-12 py-12 space-y-8">

        {/* Title and trust badges centered perfectly */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto space-y-4 my-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight text-center">
            {pageContent?.hero_headline || 'Find the Right Prop Firm Challenge for You'}
          </h1>

          {/* Trust stats overlay badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-5 py-2.5 rounded-full bg-[#1e202a] border border-slate-700/60 shadow-lg text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              {pageContent?.stat_badge_firms || '60+ Verified Top Prop Firms'}
            </span>
            <span className="px-5 py-2.5 rounded-full bg-[#1e202a] border border-slate-700/60 shadow-lg text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              {pageContent?.stat_badge_challenges || '1500+ Challenges'}
            </span>
          </div>
        </div>

        <ChallengesClient
          initialChallenges={activeChallenges}
          firms={activeFirms}
          deals={activeDeals}
          category={category}
          content={pageContent}
        />
      </main>
      <Footer />
    </div>
  )
}
