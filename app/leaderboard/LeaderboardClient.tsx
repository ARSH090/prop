'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { DollarSign, Trophy, Medal, Award, Star, Filter, TrendingUp, Crown } from 'lucide-react'

interface Payout {
  id: string
  firm_id: string
  trader_display_name: string
  amount: number
  currency: string
  proof_image_url?: string
  payout_date: any
  is_verified?: boolean
}

interface Firm {
  id: string
  name: string
  logo_url?: string
}

interface LeaderboardClientProps {
  payouts: Payout[]
  firms: Firm[]
}

const RANK_CONFIG = [
  { rank: 1, icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Legend', gradient: 'from-yellow-400/20 to-amber-400/10' },
  { rank: 2, icon: Trophy, color: 'text-slate-300', bg: 'bg-slate-300/10 border-slate-300/30', label: 'Elite', gradient: 'from-slate-300/10 to-slate-400/5' },
  { rank: 3, icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/30', label: 'Pro', gradient: 'from-amber-600/10 to-amber-700/5' },
]

function getRankConfig(rank: number) {
  return RANK_CONFIG.find((r) => r.rank === rank) || null
}

function formatAmount(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export default function LeaderboardClient({ payouts, firms }: LeaderboardClientProps) {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'week'>('all')
  const [filterFirm, setFilterFirm] = useState<string>('all')

  const getFirm = (firmId: string) => firms.find((f) => f.id === firmId)
  const getFirmName = (firmId: string) => getFirm(firmId)?.name || 'Prop Program'

  // Filter payouts by period
  const filtered = payouts.filter((p) => {
    const periodOk = (() => {
      if (filterPeriod === 'all') return true
      const payoutTime = p.payout_date?.seconds
        ? p.payout_date.seconds * 1000
        : new Date(p.payout_date || Date.now()).getTime()
      const cutoff = filterPeriod === 'month'
        ? Date.now() - 30 * 24 * 60 * 60 * 1000
        : Date.now() - 7 * 24 * 60 * 60 * 1000
      return payoutTime >= cutoff
    })()

    const firmOk = filterFirm === 'all' || p.firm_id === filterFirm
    return periodOk && firmOk
  })

  // Group by trader name
  const traderMap = new Map<string, {
    totalAmount: number
    payoutsCount: number
    firm_id: string
    biggestPayout: number
    lastPayout: number
    currency: string
  }>()

  filtered.forEach((p) => {
    const name = p.trader_display_name
    const ts = p.payout_date?.seconds
      ? p.payout_date.seconds * 1000
      : new Date(p.payout_date || Date.now()).getTime()
    const current = traderMap.get(name) || {
      totalAmount: 0,
      payoutsCount: 0,
      firm_id: p.firm_id,
      biggestPayout: 0,
      lastPayout: 0,
      currency: p.currency || 'USD',
    }
    traderMap.set(name, {
      totalAmount: current.totalAmount + p.amount,
      payoutsCount: current.payoutsCount + 1,
      firm_id: p.firm_id,
      biggestPayout: Math.max(current.biggestPayout, p.amount),
      lastPayout: Math.max(current.lastPayout, ts),
      currency: p.currency || 'USD',
    })
  })

  const leaderboardList = Array.from(traderMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.totalAmount - a.totalAmount)

  // Stats
  const totalPaid = filtered.reduce((s, p) => s + p.amount, 0)
  const biggestSingle = filtered.reduce((m, p) => Math.max(m, p.amount), 0)
  const uniqueFirms = new Set(filtered.map((p) => p.firm_id)).size

  // Firm that paid the most
  const firmTotals: Record<string, number> = {}
  filtered.forEach((p) => {
    firmTotals[p.firm_id] = (firmTotals[p.firm_id] || 0) + p.amount
  })
  const topFirmId = Object.entries(firmTotals).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topFirmName = topFirmId ? getFirmName(topFirmId) : 'N/A'

  return (
    <div className="space-y-8">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Verified Payouts', value: formatAmount(totalPaid), icon: DollarSign, color: 'text-accent-green' },
          { label: 'Biggest Single Payout', value: formatAmount(biggestSingle), icon: Trophy, color: 'text-yellow-400' },
          { label: 'Top Paying Firm', value: topFirmName, icon: Award, color: 'text-accent-cyan' },
          { label: 'Traders on Board', value: `${leaderboardList.length}+`, icon: Star, color: 'text-accent-purple' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-2"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-bg-base ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className={`text-base font-bold font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Period Filter */}
        <div className="flex gap-1 bg-bg-surface border border-border-subtle p-1.5 rounded-xl">
          {(['all', 'month', 'week'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterPeriod === p
                  ? 'bg-accent-cyan text-bg-base'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {p === 'all' ? 'All Time' : p === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>

        {/* Firm Filter */}
        {firms.length > 0 && (
          <select
            value={filterFirm}
            onChange={(e) => setFilterFirm(e.target.value)}
            className="px-3 py-2 text-xs bg-bg-surface border border-border-subtle rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none"
          >
            <option value="all">All Firms</option>
            {firms.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Leaderboard */}
      {leaderboardList.length > 0 ? (
        <div className="space-y-3">
          {leaderboardList.map((trader, index) => {
            const rank = index + 1
            const rankConfig = getRankConfig(rank)
            const RankIcon = rankConfig?.icon || TrendingUp

            return (
              <div
                key={trader.name}
                className={`relative rounded-2xl border p-5 flex items-center justify-between gap-4 transition-all overflow-hidden ${
                  rankConfig
                    ? `border-opacity-50 ${rankConfig.bg}`
                    : 'bg-bg-surface border-border-subtle hover:border-border-subtle/80'
                }`}
              >
                {/* Gradient overlay for top 3 */}
                {rankConfig && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${rankConfig.gradient} pointer-events-none`} />
                )}

                <div className="relative flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-bold shrink-0 ${
                    rankConfig ? `${rankConfig.bg}` : 'bg-bg-base border-border-subtle text-text-muted'
                  }`}>
                    {rankConfig ? (
                      <RankIcon className={`w-5 h-5 ${rankConfig.color}`} />
                    ) : (
                      <span className="text-sm font-mono">#{rank}</span>
                    )}
                    {rankConfig && (
                      <span className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${rankConfig.color}`}>
                        {rankConfig.label}
                      </span>
                    )}
                  </div>

                  {/* Trader Info */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-text-primary text-sm">{trader.name}</h3>
                      {rank <= 3 && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${rankConfig?.bg} ${rankConfig?.color}`}>
                          {rankConfig?.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-[11px] text-text-muted font-mono">
                        {getFirmName(trader.firm_id)}
                      </p>
                      <span className="text-[10px] text-text-muted/60">•</span>
                      <p className="text-[11px] text-text-muted font-mono">
                        {trader.payoutsCount} payout{trader.payoutsCount !== 1 ? 's' : ''}
                      </p>
                      <span className="text-[10px] text-text-muted/60">•</span>
                      <p className="text-[11px] text-text-muted font-mono">
                        Best: {formatAmount(trader.biggestPayout, trader.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="relative text-right font-mono shrink-0">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-0.5">
                    Total
                  </span>
                  <span className={`text-lg font-bold ${rankConfig ? rankConfig.color : 'text-accent-green'}`}>
                    {formatAmount(trader.totalAmount, trader.currency)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <Trophy className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary text-sm font-semibold">No verified payouts found for this period.</p>
          <p className="text-text-muted text-xs mt-2">Check back soon as traders submit their proof of payouts.</p>
        </div>
      )}

      <p className="text-center text-xs text-text-muted">
        Only verified payouts are shown. Want to submit yours?{' '}
        <a href="/payouts" className="text-accent-cyan hover:underline">
          Submit payout proof
        </a>
      </p>
    </div>
  )
}
