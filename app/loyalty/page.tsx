import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'Loyalty Rewards Program - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function LoyaltyPage() {
  const content = await getSiteContent('loyalty')
  const headline = content.headline || 'Loyalty Points Program'
  const body =
    content.body ||
    `Every time you sign up for a challenge through ANURAJ FX, you earn loyalty points (PTS).
    
    Accumulated points can be redeemed for evaluation vouchers, exclusive webinars, advanced trading indicator templates, and premium cashback rebates.`

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
