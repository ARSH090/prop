import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getPayouts, getFirms } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { CheckCircle, ShieldCheck, DollarSign } from 'lucide-react'

export const metadata = {
  title: 'Trader Payout Proofs Feed - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function PayoutsPage() {
  const [payouts, firms] = await Promise.all([getPayouts(), getFirms()])

  const verifiedPayouts = payouts.filter((p) => p.is_verified)
  
  // Sort by date desc
  verifiedPayouts.sort((a, b) => {
    const timeA = a.payout_date?.seconds ? a.payout_date.seconds * 1000 : new Date(a.payout_date).getTime()
    const timeB = b.payout_date?.seconds ? b.payout_date.seconds * 1000 : new Date(b.payout_date).getTime()
    return timeB - timeA
  })

  const getFirmName = (firmId: string) => {
    const firm = firms.find((f) => f.id === firmId)
    return firm ? firm.name : 'Prop Partner'
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-accent-cyan" />
            Verified Trader Payouts
          </h1>
          <p className="text-text-secondary text-sm">
            Real payout receipts and proofs verified by Anuraj FX auditing team. No fake statements.
          </p>
        </div>

        {verifiedPayouts.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {verifiedPayouts.map((payout) => {
              const dateStr = payout.payout_date
                ? new Date(
                    payout.payout_date.seconds ? payout.payout_date.seconds * 1000 : payout.payout_date
                  ).toLocaleDateString()
                : 'Recent'
              return (
                <AFXCard
                  key={payout.id}
                  className="bg-bg-surface border border-border-subtle p-5 flex flex-col justify-between hover:border-accent-cyan/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border-subtle/50">
                      <div>
                        <p className="font-bold text-text-primary text-sm">
                          {payout.trader_display_name}
                        </p>
                        <p className="text-[10px] text-accent-cyan font-mono uppercase tracking-wider font-bold">
                          {getFirmName(payout.firm_id)}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20 text-[9px] font-bold uppercase tracking-wider font-mono">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <div className="bg-bg-base/40 p-4 rounded-xl text-center border border-border-subtle/50">
                      <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest font-mono mb-1">
                        Payout Amount
                      </p>
                      <p className="text-2xl font-extrabold text-accent-green font-mono flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-accent-green" />
                        {payout.amount.toLocaleString()}
                      </p>
                    </div>

                    {payout.proof_image_url && (
                      <div className="h-40 rounded-lg overflow-hidden border border-border-subtle/50 bg-bg-base">
                        <img
                          src={payout.proof_image_url}
                          alt="Payout receipt confirmation"
                          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border-subtle/50 mt-4 flex justify-between items-center text-[10px] text-text-muted font-mono">
                    <span>Receipt audits successful</span>
                    <span>{dateStr}</span>
                  </div>
                </AFXCard>
              )
            })}
          </div>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold">No payout proof confirmations found.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
