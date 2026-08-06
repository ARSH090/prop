'use client'

import React, { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { 
  ShieldCheck, 
  Search, 
  HelpCircle, 
  Calendar, 
  SlidersHorizontal,
  CheckCircle2, 
  XCircle, 
  Info,
  ChevronDown
} from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Firm {
  id: string
  name: string
  logo_url: string
  circle_crop_logo?: boolean
  category?: string[]
  rules?: {
    steps?: string
    profit_target?: string
    drawdown_type?: string
    daily_loss?: string
    max_loss?: string
    consistency_rule_percent?: string
    min_trading_days?: string
    ea_allowed?: string
    copy_trading_allowed?: string
    news_trading_allowed?: string
  }
  platforms?: string[]
}

export default function RulesPage() {
  const [activeCategory, setActiveCategory] = useState<'forex' | 'futures' | 'crypto'>('forex')
  const [activeTab, setActiveTab] = useState<'rules-matrix' | 'updates-feed'>('rules-matrix')
  const [firms, setFirms] = useState<Firm[]>([])
  const [changelog, setChangelog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDrawdown, setFilterDrawdown] = useState('all')
  const [onlyNoConsistency, setOnlyNoConsistency] = useState(false)
  const [onlyEAsAllowed, setOnlyEAsAllowed] = useState(false)
  const [onlyNewsAllowed, setOnlyNewsAllowed] = useState(false)

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
          setChangelog(rulesData.data || [])
        }
      } catch (err) {
        console.error('Error loading rules comparison data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter firms by active categories & filter options
  const filteredFirms = React.useMemo(() => {
    return firms.filter((firm) => {
      // 1. Category check
      const cats = firm.category?.map(c => c.toLowerCase()) || []
      if (!cats.includes(activeCategory)) return false

      // 2. Search check
      if (searchQuery && !firm.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      const r = firm.rules || {}

      // 3. Drawdown Type check
      if (filterDrawdown !== 'all') {
        const ddType = r.drawdown_type?.toLowerCase() || ''
        if (filterDrawdown === 'static' && !ddType.includes('static')) return false
        if (filterDrawdown === 'trailing' && !ddType.includes('trailing')) return false
        if (filterDrawdown === 'eod' && !ddType.includes('eod') && !ddType.includes('end of day')) return false
      }

      // 4. No Consistency Rule check
      if (onlyNoConsistency) {
        const hasCons = r.consistency_rule_percent?.toLowerCase() || 'no'
        if (hasCons !== 'no' && hasCons !== 'none' && !hasCons.includes('0%')) return false
      }

      // 5. EAs Allowed check
      if (onlyEAsAllowed) {
        const ea = r.ea_allowed?.toLowerCase() || 'yes'
        if (ea === 'no') return false
      }

      // 6. News Trading check
      if (onlyNewsAllowed) {
        const news = r.news_trading_allowed?.toLowerCase() || 'yes'
        if (news === 'no') return false
      }

      return true
    })
  }, [firms, activeCategory, searchQuery, filterDrawdown, onlyNoConsistency, onlyEAsAllowed, onlyNewsAllowed])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070D] text-text-primary">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-24 text-center text-text-secondary text-sm">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading rules comparison dashboard...
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
            Prop Firm Rules Comparison
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Factual, side-by-side specifications of evaluation drawdowns, daily limits, consistency constraints, and platform support guidelines.
          </p>
        </div>

        {/* Dynamic Category Switcher (Forex, Futures, Crypto Rules) */}
        <div className="flex justify-center border-b border-border-subtle/30 pb-px gap-3">
          {[
            { id: 'forex', label: 'Forex Rules' },
            { id: 'futures', label: 'Futures Rules' },
            { id: 'crypto', label: 'Crypto Rules' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any)
                setActiveTab('rules-matrix')
              }}
              className={`px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'border-accent-cyan text-accent-cyan font-black'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subnav tab switcher: Matrix vs Feed */}
        <div className="flex bg-[#0D0B18] border border-border-subtle/50 p-1 rounded-2xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('rules-matrix')}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'rules-matrix'
                ? 'bg-[#1C1630] text-accent-cyan border border-border-subtle/50 shadow-md shadow-cyan-950/20'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Rules Matrix Table
          </button>
          <button
            onClick={() => setActiveTab('updates-feed')}
            className={`flex-1 text-center py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'updates-feed'
                ? 'bg-[#1C1630] text-accent-cyan border border-border-subtle/50 shadow-md shadow-cyan-950/20'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Rules Updates Feed
          </button>
        </div>

        {activeTab === 'rules-matrix' ? (
          <div className="space-y-6">
            
            {/* Filter toolbar grid */}
            <div className="bg-[#0D0B18]/70 border border-[#221B35] rounded-3xl p-5 backdrop-blur-sm shadow-xl flex flex-wrap items-center justify-between gap-5">
              
              <div className="flex flex-wrap items-center gap-3.5">
                {/* Search */}
                <div className="relative w-52 shrink-0">
                  <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search firms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#120F22] border border-border-subtle/80 rounded-full py-1.5 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                {/* Drawdown Filter */}
                <div className="relative shrink-0">
                  <select
                    value={filterDrawdown}
                    onChange={(e) => setFilterDrawdown(e.target.value)}
                    className="appearance-none bg-[#120F22] border border-border-subtle/80 rounded-full pl-4 pr-9 py-1.5 text-[11px] font-black text-text-secondary cursor-pointer hover:border-accent-cyan/80 transition-all outline-none"
                  >
                    <option value="all">Drawdown: All</option>
                    <option value="static">Static</option>
                    <option value="trailing">Trailing</option>
                    <option value="eod">End of Day (EOD)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-3 h-3 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Toggle Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOnlyNoConsistency(!onlyNoConsistency)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer ${
                    onlyNoConsistency
                      ? 'bg-accent-cyan/15 border-accent-cyan/45 text-accent-cyan shadow-sm'
                      : 'bg-[#120F22] border-border-subtle/80 text-text-secondary hover:text-white'
                  }`}
                >
                  No Consistency Rule
                </button>
                <button
                  onClick={() => setOnlyEAsAllowed(!onlyEAsAllowed)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer ${
                    onlyEAsAllowed
                      ? 'bg-accent-cyan/15 border-accent-cyan/45 text-accent-cyan shadow-sm'
                      : 'bg-[#120F22] border-border-subtle/80 text-text-secondary hover:text-white'
                  }`}
                >
                  EAs Allowed
                </button>
                <button
                  onClick={() => setOnlyNewsAllowed(!onlyNewsAllowed)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer ${
                    onlyNewsAllowed
                      ? 'bg-accent-cyan/15 border-accent-cyan/45 text-accent-cyan shadow-sm'
                      : 'bg-[#120F22] border-border-subtle/80 text-text-secondary hover:text-white'
                  }`}
                >
                  News Allowed
                </button>
              </div>

            </div>

            {/* Core Side-by-Side sticky rules table */}
            {filteredFirms.length > 0 ? (
              <div className="border border-[#221B35] bg-[#0A0714]/80 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full border-collapse text-left text-xs min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-[#221B35] bg-[#0D0B18]/90 text-[10px] font-black uppercase tracking-widest text-text-muted select-none">
                        <th className="px-4 py-4 text-left font-black w-[200px] sticky left-0 bg-[#0D0B18] z-10 border-r border-[#221B35]">Prop Firm</th>
                        <th className="px-3 py-4 text-center font-black">Profit Target</th>
                        <th className="px-3 py-4 text-center font-black">Daily Loss</th>
                        <th className="px-3 py-4 text-center font-black">Max Loss</th>
                        <th className="px-3 py-4 text-center font-black">Drawdown Type</th>
                        <th className="px-3 py-4 text-center font-black">Consistency Rule</th>
                        <th className="px-3 py-4 text-center font-black">EAs Allowed</th>
                        <th className="px-3 py-4 text-center font-black">Copy Trading</th>
                        <th className="px-3 py-4 text-center font-black">News Trading</th>
                        <th className="px-4 py-4 text-left font-black w-[150px]">Platforms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221B35] text-text-secondary font-medium">
                      {filteredFirms.map((firm) => {
                        const r = firm.rules || {}
                        const platformsList = firm.platforms ? firm.platforms.join(', ') : 'MT4, MT5'

                        const isEaAllowed = r.ea_allowed?.toLowerCase() !== 'no'
                        const isCopyAllowed = r.copy_trading_allowed?.toLowerCase() !== 'no'
                        const isNewsAllowed = r.news_trading_allowed?.toLowerCase() !== 'no'
                        const isNoConsistency = r.consistency_rule_percent?.toLowerCase() === 'no' || r.consistency_rule_percent?.toLowerCase() === 'none'

                        return (
                          <tr key={firm.id} className="hover:bg-[#150F28]/35 transition-colors">
                            {/* Sticky Left Column showing Prop Firm name */}
                            <td className="px-4 py-3.5 align-middle sticky left-0 bg-[#0A0714] z-10 font-black text-white flex items-center gap-2.5 border-r border-[#221B35]">
                              <PropFirmLogo
                                name={firm.name}
                                logoUrl={firm.logo_url}
                                circleCrop={firm.circle_crop_logo}
                                className="w-7 h-7 rounded-lg shrink-0 border border-border-subtle/10"
                              />
                              <span className="truncate">{firm.name}</span>
                            </td>

                            {/* Profit Target */}
                            <td className="px-3 py-3.5 text-center align-middle font-mono font-bold text-emerald-400 text-[13px]">
                              {r.profit_target || '10%'}
                            </td>

                            {/* Daily Loss */}
                            <td className="px-3 py-3.5 text-center align-middle font-mono font-bold text-rose-500/90 text-[13px]">
                              {r.daily_loss || '3%'}
                            </td>

                            {/* Max Loss */}
                            <td className="px-3 py-3.5 text-center align-middle font-mono font-bold text-rose-500/90 text-[13px]">
                              {r.max_loss || '5%'}
                            </td>

                            {/* Drawdown Type */}
                            <td className="px-3 py-3.5 text-center align-middle font-mono uppercase text-[10px] tracking-wide text-accent-purple font-bold">
                              {r.drawdown_type || 'static'}
                            </td>

                            {/* Consistency Rule */}
                            <td className="px-3 py-3.5 text-center align-middle">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                isNoConsistency
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {r.consistency_rule_percent || 'No'}
                              </span>
                            </td>

                            {/* EAs Allowed */}
                            <td className="px-3 py-3.5 text-center align-middle">
                              {isEaAllowed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500/80 mx-auto" />
                              )}
                            </td>

                            {/* Copy Trading */}
                            <td className="px-3 py-3.5 text-center align-middle">
                              {isCopyAllowed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500/80 mx-auto" />
                              )}
                            </td>

                            {/* News Trading */}
                            <td className="px-3 py-3.5 text-center align-middle">
                              {isNewsAllowed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500/80 mx-auto" />
                              )}
                            </td>

                            {/* Platforms */}
                            <td className="px-4 py-3.5 text-left align-middle font-mono text-[10px] text-text-primary truncate">
                              {platformsList}
                            </td>

                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
                <p className="text-text-secondary text-sm font-semibold">No prop firm rules match active filter parameters.</p>
              </div>
            )}

          </div>
        ) : (
          /* Recent Rule Updates Feed Timeline */
          <AFXCard className="border border-[#221B35] bg-[#0A0714]/80 p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-border-subtle/50 pb-3">
              <Calendar className="w-5 h-5 text-accent-cyan" />
              <h3 className="text-base font-black text-text-primary uppercase tracking-widest font-mono">Rule Change Log Feed</h3>
            </div>
            
            {changelog.length === 0 ? (
              <div className="text-center py-10 text-text-secondary text-xs">
                No recent rules modifications logged. Policy terms are currently stable.
              </div>
            ) : (
              <div className="relative border-l border-border-subtle/30 ml-4 pl-6 space-y-6">
                {changelog.map((log) => {
                  const firm = firms.find((f) => f.id === log.firm_id)
                  const changeDate = log.effective_date || 'Recent'
                  
                  return (
                    <div key={log.id} className="relative group">
                      {/* Interactive dot indicator */}
                      <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-accent-cyan ring-4 ring-bg-surface group-hover:scale-125 transition-transform" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white group-hover:text-accent-cyan transition-colors">
                            {firm?.name || 'Prop Firm'}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">• {changeDate}</span>
                        </div>
                        
                        <p className="text-xs text-text-secondary">
                          Modifications: <span className="font-bold text-accent-purple font-mono uppercase tracking-wide">{log.rule_key?.replace(/_/g, ' ')}</span>
                        </p>

                        <div className="flex items-center gap-3 text-[11px] bg-[#120F22] border border-[#221B35] px-3 py-1.5 rounded-lg w-max font-mono">
                          {log.previous_value !== null && (
                            <>
                              <span className="text-rose-400 line-through">{log.previous_value}</span>
                              <span className="text-text-muted">➔</span>
                            </>
                          )}
                          <span className="text-emerald-400 font-bold">{log.rule_value}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </AFXCard>
        )}

        {/* Methodology note */}
        <div className="flex gap-4 p-5 bg-[#0D0B18]/70 border border-[#221B35] rounded-2xl text-[11px] leading-relaxed text-text-muted">
          <HelpCircle className="w-5 h-5 text-accent-cyan shrink-0" />
          <p>
            <span className="font-bold text-white uppercase tracking-wider block mb-0.5">Rules Disclaimer</span>
            These specifications represent standard program tiers (e.g. $50,000 challenge or closest tier value). Individual parameters might vary depending on custom account size packages or configurations chosen at checkout. Always verify rules directly on official prop channels.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
