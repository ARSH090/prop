import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'Terms and Conditions - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function TermsAndConditionsPage() {
  const content = await getSiteContent('terms_conditions')
  const headline = content.headline || 'Terms & Conditions'
  const body =
    content.body ||
    `Usage guidelines:
    
    1. Educational Comparison: ANURAJ FX is not an investment firm. All contents are comparison parameters for mock/demo evaluation challenges.
    2. Disclaimer: Prop trading involves loss limits. Please read partner details before enrolling.
    3. Copyright: You may not crawl or copy programmatic parameters without permission.`

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
