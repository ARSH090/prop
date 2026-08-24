import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms } from '@/lib/firebase/server'
import ReviewsClient from './ReviewsClient'

export const metadata = {
  title: 'Trader Reviews and Audit Testimonials - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function ReviewsPage({
  params,
}: {
  params?: Promise<{ category?: string }>
} = {}) {
  const resolvedParams = params ? await params : null
  const initialCategory = resolvedParams?.category || 'all'
  const firms = await getFirms('prop_firm')
  const activeFirms = firms.filter((f) => f.status !== 'inactive')
  const serializedFirms = JSON.parse(JSON.stringify(activeFirms))

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
          <ReviewsClient firms={serializedFirms} initialCategory={initialCategory} />
        </main>
      </div>
      <Footer />
    </div>
  )
}
