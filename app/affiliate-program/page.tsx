import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'Affiliate & Referrals - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function AffiliateProgramPage() {
  const content = await getSiteContent('affiliate_program')
  const headline = content.headline || 'Affiliate Referral Program'
  const body =
    content.body ||
    `Invite other traders to use our evaluation comparison directories and earn referral commissions.
    
    Referrers get 15% of evaluation commissions generated when accounts use their codes or links, tracked directly in the trader analytics dashboard.`

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
