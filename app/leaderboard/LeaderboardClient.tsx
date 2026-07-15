'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { Award, DollarSign } from 'lucide-react'

interface Payout {
  id: string
  firm_id: string
  trader_display_name: string
  amount: number
  currency: string
  payout_date: any
}

interface LeaderboardClientProps {
  payouts: Payout[]
  firms: Array<{ id: string; name: string }>
}

export default function LeaderboardClient({ payouts, firms }: LeaderboardClientProps) {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month'>('all')

  const getFirmName = (firmId: string) => {
    return firms.find((f) => f.id === firmId)?.name || 'Prop Program'
  }

  // Filter payouts by period
  const filtered = payouts.filter((p) => {
    if (filterPeriod === 'month') {
      const payoutTime = p.payout_date?.seconds ? p.payout_date.seconds * 1000 : new Date(p.payout_date).getTime()
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      return payoutTime >= oneMonthAgo
    }
    return true
  })

  // Group payouts by trader_display_name
  const traderMap = new Map<string, { totalAmount: number; payoutsCount: number; firm_id: string }>()
  filtered.forEach((p) => {
    const name = p.trader_display_name
    const current = traderMap.get(name) || { totalAmount: 0, payoutsCount: 0, firm_id: p.firm_id }
    traderMap.set(name, {
      totalAmount: current.totalAmount + p.amount,
      payoutsCount: current.payoutsCount + 1,
      firm_id: p.firm_id,
    })
  })

  const leaderboardList = Array.from(traderMap.entries())
    .map(([name, data]) => ({
      name,
      ...data,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex gap-2 bg-bg-surface/50 border border-border-subtle p-2 rounded-2xl max-w-xs">
        <button
          onClick={() => setFilterPeriod('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            filterPeriod === 'all'
              ? 'bg-bg-surface text-accent-cyan border border-border-subtle/50'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilterPeriod('month')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            filterPeriod === 'month'
              ? 'bg-bg-surface text-accent-cyan border border-border-subtle/50'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          This Month
        </button>
      </div>

      {leaderboardList.length > 0 ? (
        <div className="space-y-4">
          {leaderboardList.map((trader, index) => {
            const rank = index + 1
            return (
              <AFXCard
                key={trader.name}
                className="bg-bg-surface border border-border-subtle p-5 flex items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-bg-base text-accent-cyan rounded-xl flex items-center justify-center font-bold text-sm border border-border-subtle">
                    #{rank}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-base">{trader.name}</h3>
                    <p className="text-xs text-text-muted font-mono">
                      Partner: {getFirmName(trader.firm_id)} • Payouts: {trader.payoutsCount}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono space-y-0.5">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                    Total Payouts Sum
                  </span>
                  <span className="text-lg font-bold text-accent-green flex items-center justify-end">
                    <DollarSign className="w-4 h-4 text-accent-green" />
                    {trader.totalAmount.toLocaleString()}
                  </span>
                </div>
              </AFXCard>
            )
          })}
        </div>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary text-sm font-semibold">No active traders found for this period.</p>
        </div>
      )}
    </div>
  )
}
