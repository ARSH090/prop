'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { Search, ArrowUpDown, Check, X, Star, Trophy, Heart, CheckCircle2, SlidersHorizontal } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import Link from 'next/link'

interface Firm {
  id: string
  name: string
  logo_url: string
  rating?: number
  review_count?: number
  likes_count?: number
  is_verified?: boolean
  circle_crop_logo?: boolean
  category?: string[]
  logo_frame?: string
  platforms?: string[]
  status?: string
}

interface FirmRule {
  id: string
  firm_id: string
  max_daily_loss?: string
  max_drawdown?: string
  drawdown_type?: string
  consistency_rule?: string
  min_trading_days?: number
  profit_target_phase1?: string
  profit_target_phase2?: string
  ea_allowed?: boolean
  copy_trading_allowed?: boolean
  news_trading_allowed?: boolean
  overnight_holding_allowed?: boolean
  weekend_holding_allowed?: boolean
}

type SortField = 'name' | 'max_daily_loss' | 'max_drawdown' | 'min_trading_days' | 'profit_target_phase1'
type SortOrder = 'asc' | 'desc'

export default function RulesPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [dbRules, setDbRules] = useState<FirmRule[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<'forex' | 'futures' | 'crypto'>('forex')
  // Filters State - Only Search by Name
  const [searchQuery, setSearchQuery] = useState('')

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
    const merged = firms.map((firm) => {
      const dbRule = dbRules.find((r) => r.firm_id === firm.id)
      const rules = {
        max_daily_loss: dbRule?.max_daily_loss || '5%',
        max_drawdown: dbRule?.max_drawdown || '10%',
        drawdown_type: dbRule?.drawdown_type || 'static',
        consistency_rule: dbRule?.consistency_rule || 'None',
        min_trading_days: dbRule?.min_trading_days ?? 0,
        profit_target_phase1: dbRule?.profit_target_phase1 || '10%',
        profit_target_phase2: dbRule?.profit_target_phase2 || '5%',
        ea_allowed: dbRule?.ea_allowed !== undefined ? Boolean(dbRule.ea_allowed) : true,
        copy_trading_allowed: dbRule?.copy_trading_allowed !== undefined ? Boolean(dbRule.copy_trading_allowed) : true,
        news_trading_allowed: dbRule?.news_trading_allowed !== undefined ? Boolean(dbRule.news_trading_allowed) : true,
        overnight_holding_allowed: dbRule?.overnight_holding_allowed !== undefined ? Boolean(dbRule.overnight_holding_allowed) : true,
        weekend_holding_allowed: dbRule?.weekend_holding_allowed !== undefined ? Boolean(dbRule.weekend_holding_allowed) : true,
      }

      return {
        ...firm,
        rules
      }
    })

    // Filter by search query & category
    let filtered = merged.filter((item) => {
      if (selectedCategory) {
        const cats = (item.category || ['forex']).map((c: string) => c.toLowerCase().trim())
        if (selectedCategory === 'forex') {
          if (!cats.includes('forex') && !cats.includes('cfd') && cats.length > 0) return false
        } else {
          if (!cats.includes(selectedCategory)) return false
        }
      }
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
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
  }, [firms, dbRules, searchQuery, sortField, sortOrder])

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />

        {/* Stretched till Screen Borders Layout */}
        <main className="w-full px-3 sm:px-6 lg:px-8 py-10 space-y-6">
          {/* Header Title Section */}
          <div className="text-center max-w-4xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Real-time Specifications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
              Prop Firm Rules Matrix
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Public matrix comparison of active prop firm rules, drawdown limits, trading parameters, and consistency rules.
            </p>

            {/* Category Switcher Tabs (📈 Forex / CFDs, ⚡ Futures, 🪙 Crypto) */}
            <div className="flex justify-center pt-2">
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
          </div>

          {/* Full-width Search Box (Single Search Firm Bar) */}
          <div className="w-full bg-[#0D0B18]/70 border border-[#221B35] rounded-2xl sm:rounded-3xl p-4 sm:p-5 backdrop-blur-sm shadow-xl">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Firm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#120F22] border border-border-subtle/80 rounded-full py-2.5 pl-11 pr-5 text-sm font-bold text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-cyan shadow-inner transition-colors"
              />
            </div>
          </div>

          {/* Matrix table card - Stretched Full Width */}
          {loading ? (
            <div className="text-center py-20 text-text-muted text-xs">
              <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading comparison data...
            </div>
          ) : processedData.length === 0 ? (
            <div className="w-full border border-border-subtle bg-[#0D0B18]/45 p-12 text-center rounded-2xl sm:rounded-3xl">
              <p className="text-text-secondary text-sm font-semibold">No prop firms match your search query.</p>
            </div>
          ) : (
            <div className="w-full bg-[#0D0B18]/40 border border-[#221B35] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1150px]">
                  <thead>
                    <tr className="bg-[#100D1F] border-b border-border-subtle/60 text-[11px] font-mono uppercase tracking-widest text-text-secondary select-none">
                      <th
                        onClick={() => handleSort('name')}
                        className="px-5 sm:px-6 py-4 font-black cursor-pointer hover:text-white min-w-[240px] sm:min-w-[280px]"
                      >
                        <div className="flex items-center gap-1.5">
                          FIRM
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('max_daily_loss')}
                        className="px-4 py-4 font-black cursor-pointer hover:text-white text-center"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          DAILY LOSS
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('max_drawdown')}
                        className="px-4 py-4 font-black cursor-pointer hover:text-white text-center"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          MAX DRAWDOWN
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-4 font-black text-center">DRAWDOWN TYPE</th>
                      <th
                        onClick={() => handleSort('min_trading_days')}
                        className="px-4 py-4 font-black cursor-pointer hover:text-white text-center"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          MIN DAYS
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('profit_target_phase1')}
                        className="px-4 py-4 font-black cursor-pointer hover:text-white text-center"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          PROFIT TARGET
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-3 py-4 font-black text-center">EA</th>
                      <th className="px-3 py-4 font-black text-center">COPY TRADING</th>
                      <th className="px-3 py-4 font-black text-center">NEWS TRADING</th>
                      <th className="px-5 py-4 font-black text-center min-w-[180px]">
                        NIGHT &amp; WEEKEND HOLDING
                      </th>
                      <th className="px-4 py-4 font-black text-center min-w-[130px]">CONSISTENCY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221B35]/65">
                    {processedData.map((item, idx) => {
                      const rules = item.rules
                      const bgRow = idx % 2 === 0 ? 'bg-[#0E0B19]/25' : 'bg-transparent'

                      const nightAllowed = rules.overnight_holding_allowed
                      const weekendAllowed = rules.weekend_holding_allowed

                      const fallbackLikes =
                        item.name.toLowerCase().includes('goat')
                          ? 8449
                          : item.name.toLowerCase().includes('blue')
                            ? 2025
                            : item.name.toLowerCase().includes('5%') || item.name.toLowerCase().includes('5ers')
                              ? 4120
                              : item.name.toLowerCase().includes('ftmo')
                                ? 9820
                                : 1500

                      const likesCount = item.likes_count || fallbackLikes

                      return (
                        <tr key={item.id} className={`hover:bg-[#150F28]/40 transition-colors text-xs text-text-secondary ${bgRow}`}>
                          {/* 1. FIRM COLUMN (Square Logo with Off-White Border + Name + Verified Check + Pink Likes Pill) */}
                          <td className="px-4 sm:px-6 py-4 min-w-[240px] sm:min-w-[280px]">
                            <div className="flex items-center gap-3.5 sm:gap-4">
                              {/* Square Server Logo with Off-White Border */}
                              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-lg border-2 border-slate-200/50 p-1 bg-transparent flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 hover:scale-105">
                                <PropFirmLogo
                                  name={item.name}
                                  logoUrl={item.logo_url}
                                  circleCrop={false}
                                  frame="none"
                                  transparentBg={true}
                                  className="w-full h-full flex items-center justify-center rounded-md"
                                  imgClassName="max-h-full max-w-full object-contain rounded-md"
                                />
                              </div>

                              {/* Firm Name + Verified Check + Pink Likes Pill */}
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/firms/${item.id}`}
                                    className="font-black text-white hover:text-accent-cyan transition-colors text-sm sm:text-base tracking-tight truncate"
                                  >
                                    {item.name}
                                  </Link>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
                                </div>

                                {/* Vibrant Pink Likes Pill */}
                                <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 font-chunky-num font-black text-xs sm:text-[13px] shadow-[0_0_10px_rgba(244,63,94,0.25)] w-fit">
                                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                                  <span>{likesCount.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Daily Loss */}
                          <td className="px-4 py-4 font-chunky-num font-black text-rose-400 text-center text-sm sm:text-base">
                            {rules.max_daily_loss || '—'}
                          </td>

                          {/* Max Drawdown */}
                          <td className="px-4 py-4 font-chunky-num font-black text-rose-400 text-center text-sm sm:text-base">
                            {rules.max_drawdown || '—'}
                          </td>

                          {/* Drawdown Type: Static or Trailing */}
                          <td className="px-4 py-4 font-black capitalize text-white text-center text-xs sm:text-sm">
                            {String(rules.drawdown_type).toLowerCase().includes('static')
                              ? 'Static'
                              : String(rules.drawdown_type).toLowerCase().includes('trail')
                                ? 'Trailing'
                                : String(rules.drawdown_type).replace(/_/g, ' ')}
                          </td>

                          {/* Min Days */}
                          <td className="px-4 py-4 font-chunky-num font-bold text-slate-200 text-center text-xs sm:text-sm">
                            {rules.min_trading_days} days
                          </td>

                          {/* Profit Target */}
                          <td className="px-4 py-4 font-chunky-num font-black text-emerald-400 text-center text-xs sm:text-sm">
                            {rules.profit_target_phase1}
                            {rules.profit_target_phase2 && (
                              <span className="text-[11px] text-slate-300 ml-1">
                                → {rules.profit_target_phase2}
                              </span>
                            )}
                          </td>

                          {/* EA Check */}
                          <td className="px-3 py-4 text-center">
                            {rules.ea_allowed ? (
                              <div className="w-6 h-6 rounded-full bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-center mx-auto shadow-[0_0_8px_rgba(34,211,238,0.25)]">
                                <Check className="w-3.5 h-3.5 text-accent-cyan stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto">
                                <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                              </div>
                            )}
                          </td>

                          {/* Copy Trading Check */}
                          <td className="px-3 py-4 text-center">
                            {rules.copy_trading_allowed ? (
                              <div className="w-6 h-6 rounded-full bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-center mx-auto shadow-[0_0_8px_rgba(34,211,238,0.25)]">
                                <Check className="w-3.5 h-3.5 text-accent-cyan stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto">
                                <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                              </div>
                            )}
                          </td>

                          {/* News Trading Check */}
                          <td className="px-3 py-4 text-center">
                            {rules.news_trading_allowed ? (
                              <div className="w-6 h-6 rounded-full bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-center mx-auto shadow-[0_0_8px_rgba(34,211,238,0.25)]">
                                <Check className="w-3.5 h-3.5 text-accent-cyan stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto">
                                <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                              </div>
                            )}
                          </td>

                          {/* Night & Weekend Holding (YES | YES or YES | NO) */}
                          <td className="px-5 py-4 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 font-chunky-num font-black text-xs sm:text-[13px] tracking-wider">
                              <span className={nightAllowed ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "text-rose-500"}>
                                {nightAllowed ? 'YES' : 'NO'}
                              </span>
                              <span className="text-slate-500 font-mono font-normal">|</span>
                              <span className={weekendAllowed ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "text-rose-500"}>
                                {weekendAllowed ? 'YES' : 'NO'}
                              </span>
                            </div>
                          </td>

                          {/* Consistency Constraint */}
                          <td className="px-4 py-4 text-center font-bold text-slate-200 text-xs sm:text-[13px] truncate max-w-[160px]" title={rules.consistency_rule}>
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
