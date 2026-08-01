import React from 'react'
import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import { getFirms, getPayouts } from '@/lib/firebase/server'
import { Calendar, DollarSign, ShieldCheck } from 'lucide-react'

export const revalidate = 10

export default async function FirmPayoutsPage({ params }: { params: Promise<{ slug: string }> }) {
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

  // Fetch payouts list
  const allPayouts = await getPayouts()
  const payouts = allPayouts.filter((p: any) => p.firm_id === firm.id)

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Verified Trader Payout Proofs
        </h2>
        <p className="text-xs text-text-secondary mt-1">Payout receipts, bank statements, and dashboard proof images submitted and verified by Anuraj FX auditing team.</p>
      </div>

      {payouts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-subtle rounded-2xl text-text-muted text-sm">
          No verified payouts recorded yet for {firm.name}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {payouts.map((p: any) => (
            <div key={p.id} className="p-4 rounded-2xl bg-bg-base/30 border border-border-subtle/50 flex flex-col justify-between space-y-3.5 hover:border-accent-cyan/30 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-text-muted font-bold block">{p.trader_display_name || 'Anonymous Trader'}</span>
                <div className="flex items-baseline gap-0.5">
                  <DollarSign className="w-4 h-4 text-emerald-400 self-center" />
                  <span className="text-lg font-black text-text-primary font-mono">{p.amount.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-text-muted ml-1 uppercase">{p.currency || 'USD'}</span>
                </div>
              </div>

              {p.proof_image_url && (
                <div className="w-full h-32 rounded-xl bg-bg-surface overflow-hidden border border-border-subtle/50 relative">
                  <img
                    src={p.proof_image_url}
                    alt="Payout proof certificate"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500/90 text-bg-base text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    VERIFIED
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold font-mono">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                <span>{new Date(p.payout_date || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
