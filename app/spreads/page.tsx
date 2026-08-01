import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getBrokerSpreads, getFirms, getSiteContent } from '@/lib/firebase/server'
import SpreadsClient from './SpreadsClient'

export const metadata = {
  title: 'Live Broker Spreads Comparison - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function SpreadsPage() {
  const [spreads, brokers, siteContent] = await Promise.all([
    getBrokerSpreads(),
    getFirms('broker'),
    getSiteContent('spreads')
  ])

  const headline = siteContent.headline || 'Live Broker Spreads'
  const subtext = siteContent.subtext || 'Compare live bid/ask spreads and execution commission structures across registered broker pools.'

  const activeBrokers = brokers.filter((b) => b.status === 'active')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            {headline}
          </h1>
          <p className="text-text-secondary text-sm">
            {subtext}
          </p>
        </div>

        <SpreadsClient spreads={spreads} brokers={activeBrokers} />
      </main>
      <Footer />
    </div>
  )
}

