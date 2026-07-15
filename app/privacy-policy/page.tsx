import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'Privacy Policy - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function PrivacyPolicyPage() {
  const content = await getSiteContent('privacy_policy')
  const headline = content.headline || 'Privacy Policy'
  const body =
    content.body ||
    `We respect trader privacy. We do not store financial credentials or private API keys.
    
    1. Data Collection: We collect display names, email subscriptions, and click telemetry.
    2. Data Protection: All database access uses strict HTTPS configurations and firewalls.
    3. Cookies: Used exclusively to maintain login sessions and track referral bookmarks.`

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
