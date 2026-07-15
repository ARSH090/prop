import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'Transparency & Verification Audits - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function TransparencyPage() {
  const content = await getSiteContent('transparency')
  const headline = content.headline || 'Transparency & Verification'
  const body =
    content.body ||
    `We believe in complete transparency. Every discount coupon, prop evaluation parameter, and payout check listed on ANURAJ FX is audited.
    
    We do not accept payments to artificially boost reviews or ratings. Traders deserve accurate parameters, real payout details, and verifiable discount rates.`

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
