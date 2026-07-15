import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'How It Works - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function HowItWorksPage() {
  const content = await getSiteContent('how_it_works')
  const headline = content.headline || 'How It Works'
  const body =
    content.body ||
    `Compare and participate in funded evaluations in 3 easy steps:
    
    1. Search & Filter: Use our directory to sort programs by size, steps, drawdown cushion, or split.
    2. Secure Codes: Grab exclusive promo coupons verified daily.
    3. Get Funded: Open your account, pass the challenge, and get verified payouts with up to 90% profit splits.`

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <AFXCard className="bg-bg-surface border border-border-subtle p-8 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight afx-gradient-heading">{headline}</h1>
          <div className="text-text-secondary text-sm md:text-base leading-relaxed whitespace-pre-line">
            {body}
          </div>
        </AFXCard>
      </main>
      <Footer />
    </div>
  )
}
