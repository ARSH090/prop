'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { Check, X, Layers, SlidersHorizontal } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import { RulesSubNav } from '@/components/ui/rules-subnav'
import Link from 'next/link'

interface Firm {
  id: string
  name: string
  logo_url: string
  circle_crop_logo?: boolean
  logo_frame?: string
  platforms?: string[]
}

interface FirmRule {
  id: string
  firm_id: string
  ea_allowed: boolean
  copy_trading_allowed: boolean
  news_trading_allowed: boolean
}

export default function EACopyTradingPlatformsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [dbRules, setDbRules] = useState<FirmRule[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [eaFilter, setEaFilter] = useState('all') // 'all' | 'allowed' | 'blocked'
  const [copyFilter, setCopyFilter] = useState('all') // 'all' | 'allowed' | 'blocked'
  const [selectedPlatform, setSelectedPlatform] = useState('all')

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
        console.error('Error loading EA copy trading page data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // All unique platforms across firms for dropdown selection filter options
  const uniquePlatforms = useMemo(() => {
    const platformsSet = new Set<string>()
    firms.forEach((firm) => {
      firm.platforms?.forEach((plat) => {
        if (plat.trim()) platformsSet.add(plat.trim())
      })
    })
    return Array.from(platformsSet)
  }, [firms])

  const filteredData = useMemo(() => {
    return firms.map((firm) => {
      const rules = dbRules.find(r => r.firm_id === firm.id) || {
        ea_allowed: true,
        copy_trading_allowed: true,
        news_trading_allowed: true
      }
      return { ...firm, rules }
    }).filter((item) => {
      // Search
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      // EA Filter
      if (eaFilter === 'allowed' && !item.rules.ea_allowed) return false
      if (eaFilter === 'blocked' && item.rules.ea_allowed) return false

      // Copy Filter
      if (copyFilter === 'allowed' && !item.rules.copy_trading_allowed) return false
      if (copyFilter === 'blocked' && item.rules.copy_trading_allowed) return false

      // Platform Filter
      if (selectedPlatform !== 'all' && !item.platforms?.includes(selectedPlatform)) return false

      return true
    })
  }, [firms, dbRules, searchQuery, eaFilter, copyFilter, selectedPlatform])

  const getPlatformBadgeColor = (platform: string) => {
    const p = platform.toLowerCase()
    if (p.includes('mt4') || p.includes('meta')) return 'bg-blue-500/10 border-blue-500/35 text-blue-400'
    if (p.includes('mt5')) return 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400'
    if (p.includes('ctrader')) return 'bg-teal-500/10 border-teal-500/35 text-teal-400'
    if (p.includes('dxtrade')) return 'bg-amber-500/10 border-amber-500/35 text-amber-400'
    if (p.includes('match')) return 'bg-purple-500/10 border-purple-500/35 text-purple-400'
    return 'bg-bg-base border-border-subtle text-text-secondary'
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Automation Rules</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
              EAs & Platform Matrix
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Verify compatibility filters for Expert Advisors, mirror trading accounts, news execution windows, and matching broker platforms.
            </p>
          </div>

          {/* Shared Sub Navigation */}
          <RulesSubNav />

          {/* Filter Bar */}
          <div className="bg-[#0D0B18]/70 border border-[#221B35] rounded-3xl p-5 backdrop-blur-sm shadow-xl flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#120F22] border border-border-subtle/80 rounded-full py-1.5 px-4 text-[11px] text-white focus:outline-none focus:border-accent-cyan w-48 transition-colors"
              />

              {/* EA Allowed filter */}
              <select
                value={eaFilter}
                onChange={(e) => setEaFilter(e.target.value)}
                className="bg-[#120F22] border border-border-subtle/80 rounded-full py-1.5 px-4 text-[11px] text-text-secondary hover:border-accent-cyan/85 outline-none cursor-pointer"
              >
                <option value="all">EAs Allowed: All</option>
                <option value="allowed">EAs Allowed Only</option>
                <option value="blocked">EAs Blocked Only</option>
              </select>

              {/* Copy Trading Allowed filter */}
              <select
                value={copyFilter}
                onChange={(e) => setCopyFilter(e.target.value)}
                className="bg-[#120F22] border border-border-subtle/80 rounded-full py-1.5 px-4 text-[11px] text-text-secondary hover:border-accent-cyan/85 outline-none cursor-pointer"
              >
                <option value="all">Copying: All</option>
                <option value="allowed">Copy Trading Allowed Only</option>
                <option value="blocked">Copy Trading Blocked Only</option>
              </select>

              {/* Platform Selector */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-[#120F22] border border-border-subtle/80 rounded-full py-1.5 px-4 text-[11px] text-text-secondary hover:border-accent-cyan/85 outline-none cursor-pointer"
              >
                <option value="all">Platform: All</option>
                {uniquePlatforms.map((plat) => (
                  <option key={plat} value={plat}>{plat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dense visally breathable table */}
          {loading ? (
            <div className="text-center py-12 text-text-muted text-xs">
              <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading automation settings...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="border border-border-subtle bg-[#0D0B18]/45 p-12 text-center rounded-3xl">
              <p className="text-text-secondary text-sm font-semibold">No prop programs match these automation filters.</p>
            </div>
          ) : (
            <div className="bg-[#0D0B18]/30 border border-[#221B35] rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#100D1F] border-b border-border-subtle/60 text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                      <th className="px-6 py-4 font-black sticky left-0 bg-[#100D1F] z-20 border-r border-[#221B35] min-w-[200px]">Prop Firm</th>
                      <th className="px-6 py-4 font-black text-center">EA Allowed</th>
                      <th className="px-6 py-4 font-black text-center">Copy Trading Allowed</th>
                      <th className="px-6 py-4 font-black text-center">News Trading Allowed</th>
                      <th className="px-6 py-4 font-black">Supported Execution Platforms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221B35]/65">
                    {filteredData.map((item, idx) => {
                      const bgRow = idx % 2 === 0 ? 'bg-[#0E0B19]/20' : 'bg-transparent'
                      return (
                        <tr key={item.id} className={`hover:bg-[#150F28]/35 transition-colors text-xs text-text-secondary ${bgRow}`}>
                          {/* Sticky left */}
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

                          {/* EA Check */}
                          <td className="px-6 py-4 text-center">
                            {item.rules.ea_allowed ? (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                          </td>

                          {/* Copy Check */}
                          <td className="px-6 py-4 text-center">
                            {item.rules.copy_trading_allowed ? (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                          </td>

                          {/* News Check */}
                          <td className="px-6 py-4 text-center">
                            {item.rules.news_trading_allowed ? (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                          </td>

                          {/* Platforms inline list */}
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {item.platforms && item.platforms.length > 0 ? (
                                item.platforms.map((plat) => (
                                  <span
                                    key={plat}
                                    className={`px-3 py-1 rounded-full text-[9px] font-bold border font-mono ${getPlatformBadgeColor(plat)}`}
                                  >
                                    {plat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-text-muted font-mono text-[10px]">No info</span>
                              )}
                            </div>
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
