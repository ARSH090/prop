import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getPayouts, getFirms } from '@/lib/firebase/server'
import { ShieldCheck } from 'lucide-react'
import PayoutsClient from './PayoutsClient'

export const metadata = {
  title: 'Verified Trader Payout Proofs - ANURAJ FX',
  description: 'Browse real payout receipts and proofs verified by the Anuraj FX auditing team. Filter by firm, region, and trading concept.',
}

export const dynamic = 'force-dynamic'

export default async function PayoutsPage() {
  const [payouts, firms] = await Promise.all([getPayouts(), getFirms()])

  const verifiedPayouts = payouts
    .filter((p: any) => p.is_verified)
    .sort((a: any, b: any) => {
      const timeA = a.payout_date?.seconds ? a.payout_date.seconds * 1000 : new Date(a.payout_date).getTime()
      const timeB = b.payout_date?.seconds ? b.payout_date.seconds * 1000 : new Date(b.payout_date).getTime()
      return timeB - timeA
    })

  const activeFirms = firms.filter((f: any) => f.status === 'active')

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

        <PayoutsClient initialPayouts={verifiedPayouts} firms={activeFirms} />
      </main>
      <Footer />
    </div>
  )
}
