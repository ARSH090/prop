import React from 'react'
import { Gift } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getDeals, getFirms } from '@/lib/firebase/server'
import DealsClientList from './DealsClientList'

export const metadata = {
  title: 'Exclusive Deals & Promo Codes - ANURAJ FX',
}

export default async function DealsPage() {
  const [deals, firms] = await Promise.all([getDeals(), getFirms()])

  // Enrich deal records with firm metadata (name, slug, affiliate URL)
  const enrichedDeals = deals
    .filter((deal) => deal.status === 'active')
    .map((deal) => {
      const firm = firms.find((f) => f.id === deal.firm_id)
      return {
        ...deal,
        firms: firm
          ? {
              name: firm.name,
              slug: firm.slug,
              affiliate_url: firm.affiliate_url || firm.website_url || '#',
            }
          : null,
      }
    })

  return (
    <div className="min-h-screen bg-bg-base">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-text-primary mb-4 flex items-center gap-3 afx-gradient-heading">
            <Gift className="w-8 h-8 text-accent-cyan" />
            Verified Promo Codes
          </h1>
          <p className="text-text-secondary text-lg">
            Compare and grab active discount coupons verified directly with platform managers.
          </p>
        </div>

        <DealsClientList initialDeals={enrichedDeals} />
      </main>

      <Footer />
    </div>
  )
}
export const revalidate = 10 // ISR: revalidate path every 10 seconds
