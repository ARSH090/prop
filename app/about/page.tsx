import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'About Us - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const content = await getSiteContent('about')
  const headline = content.headline || 'About ANURAJ FX'
  const body =
    content.body ||
    `ANURAJ FX is the ultimate trade intelligence platform built specifically for Indian traders.
    
    Our mission is to bring transparency, verification, and premium discount opportunities to the prop trading community. We audit listings, verify payouts, and ensure you get the absolute best terms for your evaluation challenges.`

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
