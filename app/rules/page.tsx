'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { Search, ChevronDown, ArrowUpDown, Check, X, SlidersHorizontal } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import { RulesSubNav } from '@/components/ui/rules-subnav'
import Link from 'next/link'

interface Firm {
  id: string
  name: string
  logo_url: string
  circle_crop_logo?: boolean
  category?: string[]
  logo_frame?: string
  platforms?: string[]
}

interface FirmRule {
  id: string
  firm_id: string
  max_daily_loss: string
  max_drawdown: string
  drawdown_type: string
  consistency_rule: string
  min_trading_days: number
  profit_target_phase1: string
  profit_target_phase2?: string
  ea_allowed: boolean
  copy_trading_allowed: boolean
  news_trading_allowed: boolean
}

type SortField = 'name' | 'max_daily_loss' | 'max_drawdown' | 'min_trading_days' | 'profit_target_phase1'
type SortOrder = 'asc' | 'desc'

export default function RulesPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [dbRules, setDbRules] = useState<FirmRule[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [activeCategory, setActiveCategory] = useState<'forex' | 'futures' | 'crypto'>('forex')
  const [searchQuery, setSearchQuery] = useState('')
  const [drawdownFilter, setDrawdownFilter] = useState('all')
  const [minTradingDaysLimit, setMinTradingDaysLimit] = useState(30)

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, rulesRes] = await Promise.all([
          fetch('/api/firms?type=prop_firm'),
          fetch('/api/rules')
        ])
        if (firmsRes.ok && rulesRes.ok) {
          const firmsData = await firmsRes.json()
          const rulesData = await rulesRes.json()
          setFirms(firmsData.firms || [])
          setDbRules(rulesData.data || [])
        }
      } catch (err) {
        console.error('Error loading rules comparison data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const processedData = useMemo(() => {
    // Merge firms with their active rules
    const merged = firms.map(firm => {
      // Find rules in active db list
      const rules = dbRules.find(r => r.firm_id === firm.id) || {
        max_daily_loss: '5%',
        max_drawdown: '10%',
        drawdown_type: 'static',
        consistency_rule: 'None',
        min_trading_days: 0,
        profit_target_phase1: '10%',
        profit_target_phase2: '5',
        ea_allowed: true,
        copy_trading_allowed: true,
        news_trading_allowed: true
      }

      return {
        ...firm,
        rules
      }
    })

    // Filter
    let filtered = merged.filter(item => {
      // Category filter
      const cats = item.category?.map(c => c.toLowerCase()) || []
      if (!cats.includes(activeCategory)) return false

      // Search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      // Drawdown Type filter
      if (drawdownFilter !== 'all' && item.rules.drawdown_type !== drawdownFilter) return false

      // Min trading days limit slider
      if (item.rules.min_trading_days > minTradingDaysLimit) return false

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      let valA: any = ''
      let valB: any = ''

      if (sortField === 'name') {
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
      } else {
        const rulesA = a.rules as any
        const rulesB = b.rules as any
        valA = rulesA[sortField] !== undefined ? rulesA[sortField] : ''
        valB = rulesB[sortField] !== undefined ? rulesB[sortField] : ''
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      } else {
        return sortOrder === 'asc'
          ? (valA > valB ? 1 : -1)
          : (valB > valA ? 1 : -1)
      }
    })

    return filtered
  }, [firms, dbRules, activeCategory, searchQuery, drawdownFilter, minTradingDaysLimit, sortField, sortOrder])

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Real-time Specifications</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
              Prop Firm Rules Matrix
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Verify payout metrics, step parameters, day counts, and platform limits side-by-side.
            </p>
          </div>

          {/* Shared Sub Navigation */}
          <RulesSubNav />

          {/* Filters Bar */}
          <div className="bg-[#0D0B18]/70 border border-[#221B35] rounded-3xl p-6 backdrop-blur-sm shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Left group */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search query */}
                <div className="relative w-56">
                  <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#120F22] border border-border-subtle/80 rounded-full py-1.5 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                {/* Drawdown Type selector */}
                <div className="relative">
                  <select
                    value={drawdownFilter}
                    onChange={(e) => setDrawdownFilter(e.target.value)}
                    className="appearance-none bg-[#120F22] border border-border-subtle/80 rounded-full pl-4 pr-9 py-1.5 text-[11px] font-black text-text-secondary cursor-pointer hover:border-accent-cyan/80 transition-all outline-none"
                  >
                    <option value="all">Drawdown: All</option>
                    <option value="static">Static Drawdown</option>
                    <option value="trailing">Trailing Drawdown</option>
                    <option value="eod_trailing">End of Day (EOD) Trailing</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-3 h-3 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Category selector */}
              <div className="flex bg-[#120F22] border border-border-subtle/85 p-0.5 rounded-full">
                {[
                  { id: 'forex', label: 'Forex' },
                  { id: 'futures', label: 'Futures' },
                  { id: 'crypto', label: 'Crypto' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id as any)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${activeCategory === c.id
                        ? 'bg-accent-cyan text-bg-base'
                        : 'text-text-secondary hover:text-white'
                      }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Trading Days range slider */}
            <div className="pt-4 border-t border-border-subtle/30 flex items-center justify-between gap-6 max-w-xl">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">Max Min Trading Days Required</span>
                <p className="text-xs text-text-muted leading-none">Filters out programs requiring more than {minTradingDaysLimit} days.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={minTradingDaysLimit}
                  onChange={(e) => setMinTradingDaysLimit(Number(e.target.value))}
                  className="w-32 accent-accent-cyan cursor-pointer"
                />
                <span className="text-xs font-mono font-black text-white bg-bg-base px-2.5 py-1 rounded border border-border-subtle w-14 text-center">
                  {minTradingDaysLimit}d
                </span>
              </div>
            </div>
          </div>

          {/* Matrix table card */}
          {loading ? (
            <div className="text-center py-12 text-text-muted text-xs">
              <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading comparison data...
            </div>
          ) : processedData.length === 0 ? (
            <div className="border border-border-subtle bg-[#0D0B18]/45 p-12 text-center rounded-3xl">
              <p className="text-text-secondary text-sm font-semibold">No prop firms match your active criteria filters.</p>
            </div>
          ) : (
            <div className="bg-[#0D0B18]/30 border border-[#221B35] rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#100D1F] border-b border-border-subtle/60 text-[10px] font-mono uppercase tracking-widest text-text-secondary select-none">
                      <th
                        onClick={() => handleSort('name')}
                        className="px-6 py-4 font-black cursor-pointer hover:text-white sticky left-0 bg-[#100D1F] z-20 border-r border-[#221B35] min-w-[200px]"
                      >
                        <div className="flex items-center gap-1.5">
                          Prop Firm
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('max_daily_loss')}
                        className="px-6 py-4 font-black cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1.5">
                          Daily Loss
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('max_drawdown')}
                        className="px-6 py-4 font-black cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1.5">
                          Max Drawdown
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-black">Drawdown Type</th>
                      <th
                        onClick={() => handleSort('min_trading_days')}
                        className="px-6 py-4 font-black cursor-pointer hover:text-white text-center"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          Min Days
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('profit_target_phase1')}
                        className="px-6 py-4 font-black cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1.5">
                          Profit Target
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-black text-center">EA</th>
                      <th className="px-6 py-4 font-black text-center">Copy Trading</th>
                      <th className="px-6 py-4 font-black text-center">News Trading</th>
                      <th className="px-6 py-4 font-black">Consistency constraint</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221B35]/65">
                    {processedData.map((item, idx) => {
                      const rules = item.rules
                      const bgRow = idx % 2 === 0 ? 'bg-[#0E0B19]/20' : 'bg-transparent'

                      return (
                        <tr key={item.id} className={`hover:bg-[#150F28]/35 transition-colors text-xs text-text-secondary ${bgRow}`}>
                          {/* Sticky name logo column */}
                          <td className="px-6 py-4 font-bold text-white sticky left-0 bg-[#0A0714] z-10 border-r border-[#221B35] flex items-center gap-3 min-w-[200px]">
                            <PropFirmLogo
                              name={item.name}
                              logoUrl={item.logo_url}
                              circleCrop={item.circle_crop_logo}
                              frame={item.logo_frame}
                              className="w-7 h-7 rounded-lg shrink-0 border border-border-subtle/10"
                            />
                            <Link href={`/firms/${item.id}`} className="hover:text-accent-cyan transition-colors truncate">
                              {item.name}
                            </Link>
                          </td>

                          <td className="px-6 py-4 font-mono font-bold text-red-400">{rules.max_daily_loss || '—'}</td>
                          <td className="px-6 py-4 font-mono font-bold text-red-400">{rules.max_drawdown || '—'}</td>
                          <td className="px-6 py-4 font-bold capitalize text-text-primary">{String(rules.drawdown_type).replace(/_/g, ' ')}</td>
                          <td className="px-6 py-4 font-mono text-center">{rules.min_trading_days} days</td>
                          <td className="px-6 py-4 font-mono font-bold text-green-400">
                            {rules.profit_target_phase1}
                            {rules.profit_target_phase2 && <span className="text-[10px] text-text-muted ml-1">→ {rules.profit_target_phase2}</span>}
                          </td>

                          {/* EA check */}
                          <td className="px-6 py-4 text-center">
                            {rules.ea_allowed ? (
                              <Check className="w-4 h-4 text-accent-cyan mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-rose-500 mx-auto" />
                            )}
                          </td>

                          {/* Copy check */}
                          <td className="px-6 py-4 text-center">
                            {rules.copy_trading_allowed ? (
                              <Check className="w-4 h-4 text-accent-cyan mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-rose-500 mx-auto" />
                            )}
                          </td>

                          {/* News check */}
                          <td className="px-6 py-4 text-center">
                            {rules.news_trading_allowed ? (
                              <Check className="w-4 h-4 text-accent-cyan mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-rose-500 mx-auto" />
                            )}
                          </td>

                          <td className="px-6 py-4 text-text-muted truncate max-w-[200px]" title={rules.consistency_rule}>
                            {rules.consistency_rule || 'None'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
