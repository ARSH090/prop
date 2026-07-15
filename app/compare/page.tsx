import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms } from '@/lib/firebase/server'
import CompareClient from './CompareClient'

export const metadata = {
  title: 'Compare Prop Firms Side-by-Side - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function ComparePage() {
  const firms = await getFirms('prop_firm')
  const activeFirms = firms.filter((f) => f.status === 'active')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Firms Comparison Dashboard
          </h1>
          <p className="text-text-secondary text-sm">
            Stack evaluation attributes and limits side-by-side to choose the best funded challenge.
          </p>
        </div>

        <CompareClient firms={activeFirms} />
      </main>
      <Footer />
    </div>
  )
}
