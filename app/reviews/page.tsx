import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms } from '@/lib/firebase/server'
import ReviewsClient from './ReviewsClient'

export const metadata = {
  title: 'Trader Reviews and Audit Testimonials - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const firms = await getFirms('prop_firm')
  const activeFirms = firms.filter((f) => f.status === 'active')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Trader Feedback Directory
          </h1>
          <p className="text-text-secondary text-sm">
            Read verified reviews and check scores compiled directly from active prop challenge users.
          </p>
        </div>

        <ReviewsClient firms={activeFirms} />
      </main>
      <Footer />
    </div>
  )
}
