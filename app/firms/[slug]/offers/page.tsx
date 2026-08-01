import React from 'react'
import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import { getFirms, getDeals } from '@/lib/firebase/server'
import { CopyButton } from '@/components/ui/copy-button'
import { Tag } from 'lucide-react'

export const revalidate = 10

export default async function FirmOffersPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

  let firm: any = null
  let isFirestoreEmpty = false

  if (snapshot.empty) {
    isFirestoreEmpty = true
    const allMock = await getFirms()
    firm = allMock.find((f: any) => f.slug === slug)
    if (!firm) {
      notFound()
    }
  } else {
    const firmDoc = snapshot.docs[0]
    firm = { id: firmDoc.id, ...firmDoc.data() } as any
  }

  // Fetch deals
  let deals: any[] = []
  if (isFirestoreEmpty) {
    const allMockDeals = await getDeals()
    deals = allMockDeals.filter((d: any) => d.firm_id === firm.id && d.status === 'active')
  } else {
    try {
      const dealsSnap = await db
        .collection('deals')
        .where('firm_id', '==', firm.id)
        .where('status', '==', 'active')
        .get()
      deals = dealsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    } catch (e) {
      console.warn('Deals fetch failed')
    }
  }

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Tag className="w-5 h-5 text-accent-cyan" />
          Active Promo Codes & Deals
        </h2>
        <p className="text-xs text-text-secondary mt-1">Copy discount codes and click link to claim savings on checkout.</p>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-subtle rounded-2xl text-text-muted text-sm">
          No active discount deals or coupon codes configured currently for {firm.name}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map((deal: any) => (
            <div key={deal.id} className="p-5 rounded-2xl bg-bg-base/30 border border-border-subtle/50 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="px-2.5 py-1 text-[10px] font-black rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan tracking-wider uppercase inline-block">
                  {deal.discount_label || 'DISCOUNT'}
                </span>
                <h4 className="font-extrabold text-text-primary text-sm">{deal.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{deal.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-border-subtle/80 bg-bg-base/50 text-text-primary text-xs font-mono font-bold flex-grow select-all">
                  <span>{deal.code}</span>
                  <CopyButton text={deal.code} />
                </div>
                <a
                  href={firm.affiliate_url || firm.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-accent-cyan hover:opacity-90 font-bold text-xs text-bg-base text-center transition-all"
                >
                  Apply Deal &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
