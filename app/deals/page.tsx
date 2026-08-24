import React from 'react'
import { Tag } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getDeals, getFirms } from '@/lib/firebase/server'
import { db } from '@/lib/firebase/admin'
import DealsClientList from './DealsClientList'

export const metadata = {
  title: 'Special Prop Firm Offers & Discount Directory - ANURAJ FX',
  description: 'Discover active prop firm special offers, BOGO deals, and verified discount codes. Filter by BOGO, Best Offers, and compare all available promos.',
  keywords: ['prop firm offers', 'prop firm bogo', 'best prop firm discounts', 'FTMO discount', 'FundedNext promo code', 'topstep coupon'],
}

export default async function DealsPage({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  const [deals, firms, settingsDoc] = await Promise.all([
    getDeals(),
    getFirms(),
    db.collection('site_settings').doc('event_popup').get()
  ])

  const settings = settingsDoc.exists ? settingsDoc.data() : {}
  const tabLabels = {
    best_value: settings?.tab_best_value || 'Best Value',
    bogo: settings?.tab_bogo || 'BOGO Offers',
    cash_back: settings?.tab_cash_back || 'CashBack offers',
    extra_points: settings?.tab_extra_points || 'Extra Points',
  }

  // Filter active firms
  const activeFirms = firms.filter((f) => f.status !== 'inactive')

  // Enrich deal records with firm metadata (name, slug, affiliate URL)
  const enrichedDeals = deals
    .filter((deal) => deal.status === 'active' && activeFirms.some((f) => f.id === deal.firm_id))
    .map((deal) => {
      const firm = activeFirms.find((f) => f.id === deal.firm_id)
      return {
        ...deal,
        firm: firm || null,
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
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Header visual layout */}
        <div className="text-center max-w-3xl mx-auto space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-black tracking-wider uppercase font-mono mb-1">
            <Tag className="w-3.5 h-3.5 text-pink-400" />
            Verified Trader Directory
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
            Special Prop Firm Offers
          </h1>
        </div>

        <DealsClientList
          initialDeals={JSON.parse(JSON.stringify(enrichedDeals))}
          allFirms={JSON.parse(JSON.stringify(activeFirms))}
          tabLabels={tabLabels}
        />
      </main>

      <Footer />
    </div>
  )
}
export const revalidate = 10 // ISR: revalidate path every 10 seconds
