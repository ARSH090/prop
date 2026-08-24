'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { RatingBadge } from '@/components/ui/rating-badge'
import { cn } from '@/lib/utils'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import {
  DollarSign, Trophy, Medal, Award, Star, TrendingUp, Crown,
  Clock, Users, Filter, BarChart2, ChevronUp, ChevronDown,
  Globe2, CheckCircle
} from 'lucide-react'

interface Payout {
  id: string
  firm_id: string
  trader_display_name: string
  amount: number
  currency: string
  proof_image_url?: string
  payout_date: any
  is_verified?: boolean
  region?: string
  account_size?: string
  payout_method?: string
}

interface Firm {
  id: string
  name: string
  logo_url?: string
  category?: string[]
}

interface LeaderboardClientProps {
  payouts: Payout[]
  firms: Firm[]
  category?: string
}

const RANK_CONFIG = [
  { rank: 1, icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Legend', gradient: 'from-yellow-400/20 to-amber-400/10' },
  { rank: 2, icon: Trophy, color: 'text-slate-300', bg: 'bg-slate-300/10 border-slate-300/30', label: 'Elite', gradient: 'from-slate-300/10 to-slate-400/5' },
  { rank: 3, icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/30', label: 'Pro', gradient: 'from-amber-600/10 to-amber-700/5' },
]

const ASSET_TABS = ['All', 'Forex', 'Futures', 'Crypto'] as const

const REGIONS: Record<string, string> = {
  IN: '🇮🇳', US: '🇺🇸', UK: '🇬🇧', EU: '🇪🇺',
  AE: '🇦🇪', SG: '🇸🇬', AU: '🇦🇺', Asia: '🌏',
  'North America': '🌎', Europe: '🌍', India: '🇮🇳',
  Singapore: '🇸🇬', UAE: '🇦🇪', Global: '🌐',
}

function getRegionFlag(region?: string) {
  if (!region) return '🌐'
  return REGIONS[region] || '🌐'
}

function getRankConfig(rank: number) {
  return RANK_CONFIG.find((r) => r.rank === rank) || null
}

function formatAmount(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

// ── Gauge dial component ──────────────────────────────────────────────────────
function PayoutGauge({ amount, max }: { amount: number; max: number }) {
  const pct = Math.min((amount / max) * 100, 100)
  const r = 20, cx = 28, cy = 28
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const dash = (pct / 100) * arc

  return (
    <div className="flex flex-col items-center">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
          transform={`rotate(135 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22D3EE" strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(135 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }} />
        <text x={cx} y={cy + 5} textAnchor="middle" className="font-mono" fontSize="9"
          fill="#9AA3B2">
          {formatAmount(amount).replace('$', '')}
        </text>
      </svg>
      <span className="text-[9px] text-text-muted font-mono -mt-1">avg</span>
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function PayoutBar({ amount, max }: { amount: number; max: number }) {
  const pct = Math.min((amount / max) * 100, 100)
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-text-primary font-bold font-mono text-sm whitespace-nowrap">
        {formatAmount(amount)}
      </span>
      <div className="flex-1 min-w-16 h-2 bg-bg-base rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — Firm Payouts Table (like Image 3 in screenshots)
// ─────────────────────────────────────────────────────────────────────────────
function FirmPayoutsTab({ payouts, firms, category }: { payouts: Payout[]; firms: any[]; category?: string }) {
  const [assetFilter, setAssetFilter] = useState<string>('All')
  const [period, setPeriod] = useState<'all' | 'month'>('month') // Default is "This Month"
  const [sortBy, setSortBy] = useState<'total' | 'count' | 'biggest'>('total')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  // Synchronize asset filter with global category prop
  useEffect(() => {
    if (category) {
      setAssetFilter(category.charAt(0).toUpperCase() + category.slice(1))
    }
  }, [category])

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      const firm = firms.find((f) => f.id === p.firm_id)
      const assetOk = assetFilter === 'All' || firm?.category?.includes(assetFilter.toLowerCase())
      const now = Date.now()
      const ts = p.payout_date?.seconds ? p.payout_date.seconds * 1000 : new Date(p.payout_date || now).getTime()
      const periodOk = period === 'all' ? true : ts >= now - 30 * 86400000
      return assetOk && periodOk
    })
  }, [payouts, firms, assetFilter, period])

  const firmStats = useMemo(() => {
    const map = new Map<string, { total: number; count: number; biggest: number; lastPayout: number }>()
    filteredPayouts.forEach((p) => {
      const s = map.get(p.firm_id) || { total: 0, count: 0, biggest: 0, lastPayout: 0 }
      map.set(p.firm_id, {
        total: s.total + p.amount,
        count: s.count + 1,
        biggest: Math.max(s.biggest, p.amount),
        lastPayout: Math.max(s.lastPayout, p.payout_date?.seconds ? p.payout_date.seconds * 1000 : new Date(p.payout_date || 0).getTime()),
      })
    })
    const maxTotal = Math.max(...Array.from(map.values()).map((s) => s.total), 1)
    const maxAvg = Math.max(...Array.from(map.values()).map((s) => s.total / Math.max(s.count, 1)), 1)

    return Array.from(map.entries())
      .map(([firmId, stats]) => {
        const firm = firms.find((f) => f.id === firmId)
        const avg = stats.total / Math.max(stats.count, 1)
        return { firmId, firm, ...stats, avg, maxTotal, maxAvg }
      })
      .sort((a, b) => {
        const val = (x: typeof a) => sortBy === 'total' ? x.total : sortBy === 'count' ? x.count : x.biggest
        return sortDir === 'desc' ? val(b) - val(a) : val(a) - val(b)
      })
  }, [filteredPayouts, firms, sortBy, sortDir])

  const toggleSort = (col: 'total' | 'count' | 'biggest') => {
    if (sortBy === col) setSortDir((d) => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const SortIcon = ({ col }: { col: 'total' | 'count' | 'biggest' }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={`w-2.5 h-2.5 -mb-0.5 ${sortBy === col && sortDir === 'asc' ? 'text-accent-cyan' : 'text-text-muted/40'}`} />
      <ChevronDown className={`w-2.5 h-2.5 ${sortBy === col && sortDir === 'desc' ? 'text-accent-cyan' : 'text-text-muted/40'}`} />
    </span>
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Asset tabs */}
        <div className="flex gap-1 bg-bg-surface border border-border-default p-1 rounded-xl">
          {ASSET_TABS.map((tab) => (
            <button key={tab} onClick={() => setAssetFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${assetFilter === tab ? 'bg-accent-cyan text-bg-base' : 'text-text-muted hover:text-text-primary'
                }`}>
              {tab}
            </button>
          ))}
        </div>
        {/* Period toggle */}
        <div className="flex gap-1 bg-bg-surface border border-border-default p-1 rounded-xl">
          {[
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' },
          ].map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${period === p.id ? 'bg-accent-purple text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-accent-green font-bold px-2.5 py-1.5 rounded-xl bg-accent-green/10 border border-accent-green/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Table */}
      <AFXCard className="overflow-hidden border border-border-default bg-bg-surface p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-base/30 text-text-muted text-xs font-mono uppercase tracking-wider">
                <th className="px-5 py-4 text-left">Firm / Rank</th>
                <th className="px-5 py-4 text-right cursor-pointer hover:text-text-primary" onClick={() => toggleSort('total')}>
                  Total Payouts <SortIcon col="total" />
                </th>
                <th className="px-5 py-4 text-right cursor-pointer hover:text-text-primary" onClick={() => toggleSort('count')}>
                  # Payouts <SortIcon col="count" />
                </th>
                <th className="px-5 py-4 text-right cursor-pointer hover:text-text-primary" onClick={() => toggleSort('biggest')}>
                  Largest Single <SortIcon col="biggest" />
                </th>
                <th className="px-5 py-4 text-center">Avg Payout</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {firmStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-text-muted">
                    No payout data for selected filters.
                  </td>
                </tr>
              ) : (
                firmStats.map(({ firmId, firm, total, count, biggest, avg, maxTotal, maxAvg }, idx) => {
                  const isTop3 = idx < 3
                  const rankStyles = cn(
                    "border-b border-border-default transition-all duration-300 hover:bg-bg-base/30",
                    idx === 0 && "bg-gradient-to-r from-yellow-500/15 via-amber-500/5 to-transparent border-l-4 border-l-yellow-400 py-6 md:py-8 text-base shadow-lg shadow-yellow-500/5 border border-yellow-500/40 relative z-10",
                    idx === 1 && "bg-gradient-to-r from-accent-cyan/10 via-cyan-500/5 to-transparent border-l-4 border-l-accent-cyan py-5",
                    idx === 2 && "bg-gradient-to-r from-accent-purple/10 via-purple-500/5 to-transparent border-l-4 border-l-accent-purple py-5"
                  )

                  return (
                    <tr key={firmId} className={rankStyles}>
                      {/* Firm / Rank Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border font-bold shrink-0 ${idx === 0 ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40 shadow-sm shadow-yellow-400/10' :
                              idx === 1 ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40 shadow-sm shadow-cyan-400/10' :
                                idx === 2 ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/40 shadow-sm shadow-purple-400/10' :
                                  'bg-bg-base text-text-muted border-border-default'
                            }`}>
                            {idx === 0 && <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />}
                            {idx === 1 && <Medal className="w-5 h-5 text-accent-cyan" />}
                            {idx === 2 && <Award className="w-5 h-5 text-accent-purple" />}
                            {idx > 2 && <span className="text-xs font-mono">#{idx + 1}</span>}
                          </div>
                          <PropFirmLogo
                            name={firm?.name ?? firmId}
                            logoUrl={firm?.logo_url || null}
                            className="w-10 h-10 rounded-xl"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-text-primary text-sm tracking-tight">{firm?.name ?? firmId}</span>
                              <RatingBadge rating={firm?.rating || 4.5} fontVariant="sans" className="scale-85 origin-left py-0.5 px-1.5 border-0 bg-transparent" />
                              {firm?.activeDeal && (
                                <span className="px-2 py-0.5 rounded-full bg-accent-green/25 border border-accent-green/50 text-[9px] font-bold text-white font-mono shrink-0">
                                  {firm.activeDeal.discount_label}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1 mt-0.5">
                              {firm?.category?.slice(0, 2).map((c: string) => (
                                <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan font-mono uppercase">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Total Payouts */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-accent-green font-mono">{formatAmount(total)}</span>
                          <div className="w-24 h-1.5 bg-bg-base rounded-full overflow-hidden border border-border-default/50">
                            <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full"
                              style={{ width: `${(total / firmStats[0].total) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      {/* Count */}
                      <td className="px-5 py-4 text-right font-mono text-text-primary font-bold">{count.toLocaleString()}</td>
                      {/* Largest Single */}
                      <td className="px-5 py-4 text-right font-mono text-yellow-400 font-bold">{formatAmount(biggest)}</td>
                      {/* Avg Gauge */}
                      <td className="px-5 py-4 text-center">
                        <PayoutGauge amount={avg} max={maxAvg} />
                      </td>
                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <a
                          href={`/firms/${firmId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-border-default bg-bg-base hover:border-accent-cyan/40 hover:text-accent-cyan text-text-secondary transition-all"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </AFXCard>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — Trader Leaderboard (like Image 4 in screenshots)
// ─────────────────────────────────────────────────────────────────────────────
function TraderLeaderboardTab({ payouts, firms }: { payouts: Payout[]; firms: Firm[] }) {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'week'>('all')
  const [filterFirm, setFilterFirm] = useState('all')
  const [sortMode, setSortMode] = useState<'total' | 'biggest' | 'frequency'>('total')

  const [selectedCategory, setSelectedCategory] = useState<'forex' | 'futures' | 'crypto'>('forex')

  const getFirm = (firmId: string) => firms.find((f) => f.id === firmId)
  const getFirmName = (firmId: string) => getFirm(firmId)?.name || 'Prop Program'

  const filtered = useMemo(() => payouts.filter((p) => {
    const firm = getFirm(p.firm_id)
    if (selectedCategory) {
      const cats = (firm?.category || ['forex']).map((c: string) => c.toLowerCase().trim())
      if (selectedCategory === 'forex') {
        if (!cats.includes('forex') && !cats.includes('cfd') && cats.length > 0) return false
      } else {
        if (!cats.includes(selectedCategory)) return false
      }
    }
    const now = Date.now()
    const ts = p.payout_date?.seconds ? p.payout_date.seconds * 1000 : new Date(p.payout_date || now).getTime()
    const periodOk = filterPeriod === 'all' ? true
      : filterPeriod === 'month' ? ts >= now - 30 * 86400000
        : ts >= now - 7 * 86400000
    const firmOk = filterFirm === 'all' || p.firm_id === filterFirm
    return periodOk && firmOk
  }), [payouts, filterPeriod, filterFirm, selectedCategory])

  const traderMap = useMemo(() => {
    const map = new Map<string, { total: number; count: number; firm_id: string; biggest: number; lastPayout: number; currency: string; region?: string; account_size?: string; method?: string }>()
    filtered.forEach((p) => {
      const name = p.trader_display_name
      const ts = p.payout_date?.seconds ? p.payout_date.seconds * 1000 : new Date(p.payout_date || Date.now()).getTime()
      const cur = map.get(name) || { total: 0, count: 0, firm_id: p.firm_id, biggest: 0, lastPayout: 0, currency: 'USD' }
      map.set(name, {
        ...cur,
        total: cur.total + p.amount,
        count: cur.count + 1,
        biggest: Math.max(cur.biggest, p.amount),
        lastPayout: Math.max(cur.lastPayout, ts),
        region: p.region || cur.region,
        account_size: p.account_size || cur.account_size,
        method: p.payout_method || cur.method,
        currency: p.currency || 'USD',
      })
    })
    return map
  }, [filtered])

  const leaderboardList = useMemo(() =>
    Array.from(traderMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) =>
        sortMode === 'total' ? b.total - a.total :
          sortMode === 'biggest' ? b.biggest - a.biggest :
            b.count - a.count
      ),
    [traderMap, sortMode]
  )

  const maxTotal = leaderboardList[0]?.total || 1

  const totalPaid = filtered.reduce((s, p) => s + p.amount, 0)
  const biggestSingle = filtered.reduce((m, p) => Math.max(m, p.amount), 0)
  const uniqueFirms = new Set(filtered.map((p) => p.firm_id)).size
  const firmTotals: Record<string, number> = {}
  filtered.forEach((p) => { firmTotals[p.firm_id] = (firmTotals[p.firm_id] || 0) + p.amount })
  const topFirmId = Object.entries(firmTotals).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topFirmName = topFirmId ? getFirmName(topFirmId) : 'N/A'

  return (
    <div className="space-y-6">
      {/* Category Switcher Tabs (📈 Forex / CFDs, ⚡ Futures, 🪙 Crypto) */}
      <div className="flex justify-center -mt-2 mb-2">
        <div className="bg-[#0B132B]/90 backdrop-blur-xl border border-white/15 p-1.5 rounded-full inline-flex items-center gap-1.5 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
          {[
            { id: 'forex', label: 'Forex / CFDs', icon: '📈' },
            { id: 'futures', label: 'Futures', icon: '⚡' },
            { id: 'crypto', label: 'Crypto', icon: '🪙' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 transition-all duration-300 cursor-pointer select-none ${isActive
                    ? 'bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Verified Payouts', value: formatAmount(totalPaid), icon: DollarSign, color: 'text-accent-green' },
          { label: 'Biggest Single Payout', value: formatAmount(biggestSingle), icon: Trophy, color: 'text-yellow-400' },
          { label: 'Top Paying Firm', value: topFirmName, icon: Award, color: 'text-accent-cyan' },
          { label: 'Traders on Board', value: `${leaderboardList.length}+`, icon: Users, color: 'text-accent-purple' },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-2">
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
        <div className="flex gap-1 bg-bg-surface border border-border-subtle p-1 rounded-xl">
          {(['all', 'month', 'week'] as const).map((p) => (
            <button key={p} onClick={() => setFilterPeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterPeriod === p ? 'bg-accent-cyan text-bg-base' : 'text-text-muted hover:text-text-primary'
                }`}>
              {p === 'all' ? 'All Time' : p === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>

        <select value={filterFirm} onChange={(e) => setFilterFirm(e.target.value)}
          className="px-3 py-2 text-xs bg-bg-surface border border-border-subtle rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none">
          <option value="all">All Firms</option>
          {firms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>

        {/* Sort mode */}
        <div className="flex gap-1 bg-bg-surface border border-border-subtle p-1 rounded-xl ml-auto">
          {([['total', 'Most Total'], ['biggest', 'Biggest Payout'], ['frequency', 'Most Frequent']] as const).map(([mode, label]) => (
            <button key={mode} onClick={() => setSortMode(mode)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${sortMode === mode ? 'bg-accent-purple text-white' : 'text-text-muted hover:text-text-primary'
                }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-base/30 text-text-muted text-xs font-mono uppercase tracking-wider">
                <th className="px-5 py-4 text-left w-16">Rank</th>
                <th className="px-5 py-4 text-left">User / Region</th>
                <th className="px-5 py-4 text-left">Payout</th>
                <th className="px-5 py-4 text-center">Account Size</th>
                <th className="px-5 py-4 text-center">Payout Method</th>
                <th className="px-5 py-4 text-left">Firm</th>
                <th className="px-5 py-4 text-center">Claim</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-text-muted">
                    No verified payouts found for this period.
                  </td>
                </tr>
              ) : leaderboardList.map((trader, index) => {
                const rank = index + 1
                const rankConfig = getRankConfig(rank)
                const RankIcon = rankConfig?.icon || TrendingUp
                const firm = getFirm(trader.firm_id)

                return (
                  <tr key={trader.name}
                    className={`border-b border-border-subtle/50 transition-colors hover:bg-bg-base/20 ${rank <= 3 ? 'bg-gradient-to-r ' + rankConfig?.gradient : ''
                      }`}>
                    {/* Rank */}
                    <td className="px-5 py-4">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border font-bold shrink-0 ${rankConfig ? `${rankConfig.bg}` : 'bg-bg-base border-border-subtle text-text-muted'
                        }`}>
                        {rankConfig ? (
                          <>
                            <RankIcon className={`w-4 h-4 ${rankConfig.color}`} />
                            <span className={`text-[7px] font-bold uppercase mt-0.5 ${rankConfig.color}`}>{rankConfig.label}</span>
                          </>
                        ) : (
                          <span className="text-xs font-mono">#{rank}</span>
                        )}
                      </div>
                    </td>
                    {/* User / Region */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted">
                          <Globe2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-xs">{trader.name}</p>
                          <p className="text-[10px] text-text-muted font-mono">
                            {getRegionFlag(trader.region)} {trader.region || 'Global'}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Payout Bar */}
                    <td className="px-5 py-4 min-w-48">
                      <PayoutBar amount={trader.total} max={maxTotal} />
                      <p className="text-[10px] text-text-muted font-mono mt-1">
                        {trader.count} payout{trader.count !== 1 ? 's' : ''} · Best: {formatAmount(trader.biggest, trader.currency)}
                      </p>
                    </td>
                    {/* Account Size */}
                    <td className="px-5 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-bg-base border border-border-subtle text-xs font-mono font-bold text-text-primary">
                        {trader.account_size || '—'}
                      </span>
                    </td>
                    {/* Payout Method */}
                    <td className="px-5 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-bg-base border border-border-subtle text-xs font-mono text-text-secondary">
                        {trader.method || 'Other'}
                      </span>
                    </td>
                    {/* Firm */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <PropFirmLogo
                          name={firm?.name || trader.firm_id}
                          logoUrl={firm?.logo_url || null}
                          className="w-7 h-7 rounded-lg"
                        />
                        <span className="text-xs font-semibold text-text-primary">{getFirmName(trader.firm_id)}</span>
                      </div>
                    </td>
                    {/* Claim Ownership */}
                    <td className="px-5 py-4 text-center">
                      <button className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-accent-purple to-accent-cyan text-white hover:opacity-90 transition-all shadow-md shadow-purple-500/20">
                        Claim
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </AFXCard>

      <p className="text-center text-xs text-text-muted">
        Only verified payouts are shown. Want to submit yours?{' '}
        <a href="/payouts" className="text-accent-cyan hover:underline">Submit payout proof</a>
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export default function LeaderboardClient({ payouts, firms, category }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<'payouts' | 'traders'>('payouts')

  return (
    <div className="space-y-8">
      {/* Tab switcher */}
      <div className="flex items-center gap-2 bg-bg-surface border border-border-default rounded-2xl p-1.5 w-fit">
        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'payouts'
              ? 'bg-gradient-to-r from-accent-cyan to-blue-500 text-bg-base shadow-md shadow-cyan-500/20'
              : 'text-text-muted hover:text-text-primary'
            }`}
        >
          <BarChart2 className="w-4 h-4" />
          Payouts
        </button>
        <button
          onClick={() => setActiveTab('traders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'traders'
              ? 'bg-gradient-to-r from-accent-purple to-violet-600 text-white shadow-md shadow-purple-500/20'
              : 'text-text-muted hover:text-text-primary'
            }`}
        >
          <Trophy className="w-4 h-4" />
          Trader Leaderboard
        </button>
      </div>

      {activeTab === 'payouts' ? (
        <FirmPayoutsTab payouts={payouts} firms={firms} category={category} />
      ) : (
        <TraderLeaderboardTab payouts={payouts} firms={firms} />
      )}
    </div>
  )
}
