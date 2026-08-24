'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FirmLink } from '@/components/ui/firm-link'
import { Filter, Search, CheckCircle, Tag, Globe, Heart, Trophy, Flame, Check, Copy, Sparkles } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

const COUNTRY_FLAGS: Record<string, string> = {
  CZ: '🇨🇿', US: '🇺🇸', IL: '🇮🇱', AE: '🇦🇪', GB: '🇬🇧',
  IN: '🇮🇳', AU: '🇦🇺', CY: '🇨🇾', HU: '🇭🇺', EU: '🇪🇺',
  CH: '🇨🇭', ES: '🇪🇸', MX: '🇲🇽', CA: '🇨🇦', SG: '🇸🇬',
  DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', NL: '🇳🇱', BR: '🇧🇷',
}

const COUNTRY_NAMES: Record<string, string> = {
  CZ: 'Czech Republic', US: 'United States', IL: 'Israel', AE: 'UAE', GB: 'United Kingdom',
  IN: 'India', AU: 'Australia', CY: 'Cyprus', HU: 'Hungary', EU: 'Europe',
  CH: 'Switzerland', ES: 'Spain', MX: 'Mexico', CA: 'Canada', SG: 'Singapore',
  DE: 'Germany', FR: 'France', IT: 'Italy', NL: 'Netherlands', BR: 'Brazil',
}

interface Firm {
  id: string
  slug: string
  name: string
  type: string
  category: string[]
  logo_url: string | null
  rating: number
  review_count: number
  is_featured: boolean
  is_verified: boolean
  country: string | null
  platforms: string[]
  max_allocation: number | null
  description: string
  website_url: string | null
  years_active?: number
  circle_crop_logo?: boolean
}

// Visual Platform Badge Component with branded styling & micro-logos
function PlatformBadge({ platform }: { platform: string }) {
  const p = platform.toLowerCase()

  if (p.includes('mt4') || p.includes('metatrader 4')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="MetaTrader 4">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/50 flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_6px_rgba(37,99,235,0.4)] group-hover/plat:scale-110 transition-transform">
          4
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">MT4</span>
      </div>
    )
  }
  if (p.includes('mt5') || p.includes('metatrader 5')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="MetaTrader 5">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-cyan-600 border border-indigo-400/50 flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_6px_rgba(99,102,241,0.4)] group-hover/plat:scale-110 transition-transform">
          5
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">MT5</span>
      </div>
    )
  }
  if (p.includes('ctrader')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="cTrader">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-500 to-emerald-700 border border-teal-400/50 flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_6px_rgba(20,184,166,0.4)] group-hover/plat:scale-110 transition-transform">
          c
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">cTrader</span>
      </div>
    )
  }
  if (p.includes('match') || p.includes('matchtrader') || p.includes('match trader')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="Match-Trader">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-400/50 flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_6px_rgba(168,85,247,0.4)] group-hover/plat:scale-110 transition-transform">
          M
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">Match</span>
      </div>
    )
  }
  if (p.includes('dxtrade') || p.includes('dx')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="DXtrade">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/50 flex items-center justify-center font-black text-[9px] text-black shadow-[0_0_6px_rgba(245,158,11,0.4)] group-hover/plat:scale-110 transition-transform">
          DX
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">DXTrade</span>
      </div>
    )
  }
  if (p.includes('tradelocker') || p.includes('locker')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="TradeLocker">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-rose-500 to-pink-600 border border-rose-400/50 flex items-center justify-center font-black text-[9px] text-white shadow-[0_0_6px_rgba(244,63,94,0.4)] group-hover/plat:scale-110 transition-transform">
          TL
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">Locker</span>
      </div>
    )
  }
  if (p.includes('tradingview')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="TradingView">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-blue-700 border border-sky-400/50 flex items-center justify-center font-black text-[9px] text-white shadow-[0_0_6px_rgba(14,165,233,0.4)] group-hover/plat:scale-110 transition-transform">
          TV
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">TV</span>
      </div>
    )
  }
  if (p.includes('ninjatrader') || p.includes('ninja')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="NinjaTrader">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-600 to-zinc-900 border border-red-500/50 flex items-center justify-center font-black text-[9px] text-white shadow-[0_0_6px_rgba(239,68,68,0.4)] group-hover/plat:scale-110 transition-transform">
          NT
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">Ninja</span>
      </div>
    )
  }
  if (p.includes('bybit')) {
    return (
      <div className="flex flex-col items-center text-center shrink-0 group/plat" title="Bybit">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-yellow-500 to-amber-700 border border-yellow-400/50 flex items-center justify-center font-black text-[10px] text-black shadow-[0_0_6px_rgba(234,179,8,0.4)] group-hover/plat:scale-110 transition-transform">
          B
        </div>
        <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight">Bybit</span>
      </div>
    )
  }

  // Fallback
  const label = platform.substring(0, 2).toUpperCase()
  return (
    <div className="flex flex-col items-center text-center shrink-0 group/plat" title={platform}>
      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-500/50 flex items-center justify-center font-black text-[9px] text-white shadow-xs group-hover/plat:scale-110 transition-transform">
        {label}
      </div>
      <span className="text-[8px] text-slate-300 mt-0.5 font-extrabold uppercase tracking-tight truncate max-w-[42px]">{platform}</span>
    </div>
  )
}

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'forex' | 'futures' | 'crypto'>('forex')
  const [deals, setDeals] = useState<Record<string, { code: string; discount: string }>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'popular' | 'favorite' | 'new'>('all')
  const [favoriteFirms, setFavoriteFirms] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [firmType, setFirmType] = useState('prop_firm')
  const [recentlyLiked, setRecentlyLiked] = useState<string | null>(null)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('afx_favorites')
    if (saved) {
      try {
        setFavoriteFirms(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Fetch firms on state changes
  useEffect(() => {
    fetchFirms()
  }, [searchQuery, activeFilterTab, firmType])

  // Fetch deals on mount
  useEffect(() => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, { code: string; discount: string }> = {}
          ; (data.deals || []).forEach((d: any) => {
            if (d.firm_id && d.code && d.status === 'active') {
              map[d.firm_id] = { code: d.code, discount: d.discount_label || 'Discount' }
            }
          })
        setDeals(map)
      })
      .catch(() => { })
  }, [])

  const fetchFirms = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      params.append('type', firmType)

      // Apply dynamic sorting inside request parameters
      if (activeFilterTab === 'popular') {
        params.append('sortBy', 'rating')
      } else if (activeFilterTab === 'new') {
        params.append('sortBy', 'newest')
      } else {
        params.append('sortBy', 'featured')
      }

      const response = await fetch(`/api/firms?${params}`)
      const result = await response.json()

      let fetchedFirms: Firm[] = result.firms || []

      // Client-side favorites filter if that tab is selected
      if (activeFilterTab === 'favorite') {
        fetchedFirms = fetchedFirms.filter((f) => favoriteFirms.includes(f.id))
      }

      setFirms(fetchedFirms)
    } catch (error) {
      console.error('Failed to fetch firms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (firmId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isAdding = !favoriteFirms.includes(firmId)
    const updated = isAdding
      ? [...favoriteFirms, firmId]
      : favoriteFirms.filter((id) => id !== firmId)
    setFavoriteFirms(updated)
    localStorage.setItem('afx_favorites', JSON.stringify(updated))
    if (isAdding) {
      setRecentlyLiked(firmId)
      setTimeout(() => setRecentlyLiked(null), 550)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2200)
  }

  return (
    <div className="min-h-screen bg-transparent text-text-primary">
      <NavBar />

      <main className="w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 space-y-5">

        {/* Header section with text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle/30 pb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight afx-gradient-heading mb-1.5">
              Prop Firms Directory
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Verify payouts, compare years active, platforms, assets, and allocation sizes.
            </p>
          </div>

          {/* Search bar inside header block */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search FTMO, TopStep..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] backdrop-blur-md border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:border-accent-cyan outline-none transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Category Switcher Tabs (📈 Forex / CFDs, ⚡ Futures, 🪙 Crypto) */}
        <div className="flex justify-center my-4">
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

        {/* Filter pills bar matching Liquid Glass */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center liquid-glass-card p-2.5 rounded-2xl">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-white/[0.04] backdrop-blur-md p-1 rounded-full border border-white/10 shadow-xs">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${activeFilterTab === 'all'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilterTab('popular')}
                className={`px-3.5 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeFilterTab === 'popular'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                  }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Popular
              </button>
              <button
                onClick={() => setActiveFilterTab('favorite')}
                className={`px-3.5 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeFilterTab === 'favorite'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                  }`}
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Favorite {favoriteFirms.length}/5
              </button>
              <button
                onClick={() => setActiveFilterTab('new')}
                className={`px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${activeFilterTab === 'new'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                  }`}
              >
                New
              </button>
            </div>
          </div>
        </div>

        {/* Directory List Container with Liquid Glass */}
        <div className="liquid-glass-card rounded-2xl p-1 overflow-hidden shadow-2xl relative border border-white/10 w-full">

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full border-collapse text-left text-xs table-fixed sm:table-auto">
              <thead>
                <tr className="border-b border-border-subtle/40 bg-bg-surface/50 text-[11px] font-black uppercase tracking-wider text-slate-300 select-none">
                  <th className="px-3 sm:px-5 py-3 text-left font-black w-[40%] sm:w-auto">Firm</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black w-[20%] sm:w-auto">Rank / Reviews</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black hidden sm:table-cell">Country</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black hidden lg:table-cell">Years Active</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black hidden lg:table-cell">Assets</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black hidden md:table-cell">Platforms</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black hidden sm:table-cell">Max Allocation</th>
                  <th className="px-2 sm:px-4 py-3 text-center font-black hidden md:table-cell">Promo</th>
                  <th className="px-3 sm:px-5 py-3 text-right font-black w-[20%] sm:w-auto">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/30">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-bg-surface shrink-0" />
                          <div className="w-10 h-10 rounded-lg bg-bg-surface shrink-0" />
                          <div className="space-y-1">
                            <div className="w-24 h-3.5 bg-bg-surface rounded" />
                            <div className="w-16 h-2.5 bg-bg-surface rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><div className="w-12 h-7 bg-bg-surface rounded-lg mx-auto" /></td>
                      <td className="px-4 py-3.5 hidden sm:table-cell"><div className="w-10 h-6 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><div className="w-8 h-8 rounded-full bg-bg-surface mx-auto" /></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><div className="w-24 h-5 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-4 py-3.5 hidden md:table-cell"><div className="w-20 h-6 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-4 py-3.5 hidden sm:table-cell"><div className="w-16 h-4 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-4 py-3.5 hidden md:table-cell"><div className="w-16 h-6 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-5 py-3.5 text-right"><div className="w-20 h-8 bg-bg-surface rounded-xl ml-auto" /></td>
                    </tr>
                  ))
                ) : firms.length > 0 ? (
                  firms
                    .filter((f) => {
                      const cats = (f.category || ['forex']).map((c: string) => c.toLowerCase().trim())
                      if (selectedCategory === 'forex') {
                        return cats.includes('forex') || cats.includes('cfd') || cats.length === 0
                      } else {
                        return cats.includes(selectedCategory)
                      }
                    })
                    .map((firm, index) => {
                      const flag = COUNTRY_FLAGS[firm.country || ''] || '🌍'
                      const dealInfo = deals[firm.id]
                      // Format Max Allocation consistently as $200K, $300K, $400K
                      const allocVal = firm.max_allocation || 200000
                      const maxK = allocVal >= 1000 ? `$${(allocVal / 1000).toFixed(0)}K` : `$${allocVal}K`

                      // Compute dynamic allocation percentage for progress bar
                      const allocPct = firm.max_allocation
                        ? Math.min(100, Math.max(20, (firm.max_allocation / 2000000) * 100))
                        : 45

                      // Rank Logic
                      const rank = index + 1
                      const isFav = favoriteFirms.includes(firm.id)

                      // Retrieve clean logo URL using helper function
                      const logoUrl = getCleanLogoUrl(firm.name, firm.logo_url)

                      // Dynamic likes count (with bonus when user likes)
                      const baseLikes = (firm.review_count || 100) * 8 + 1240
                      const likesCount = isFav ? baseLikes + 1 : baseLikes

                      // Frame & Row styling according to rank
                      let frameType = 'offwhite'
                      let rowBgClass = 'hover:bg-white/[0.03] transition-all duration-300'

                      if (rank === 1) {
                        frameType = 'gold'
                        rowBgClass = 'bg-gradient-to-r from-amber-500/[0.08] via-amber-950/20 to-transparent hover:from-amber-500/[0.12] transition-all duration-300 border-l-2 border-amber-400'
                      } else if (rank === 2) {
                        frameType = 'silver'
                        rowBgClass = 'bg-gradient-to-r from-slate-400/[0.08] via-slate-900/30 to-transparent hover:from-slate-400/[0.12] transition-all duration-300 border-l-2 border-slate-300'
                      } else if (rank === 3) {
                        frameType = 'bronze'
                        rowBgClass = 'bg-gradient-to-r from-orange-600/[0.08] via-orange-950/20 to-transparent hover:from-orange-600/[0.12] transition-all duration-300 border-l-2 border-orange-500'
                      }

                      return (
                        <tr
                          key={firm.id}
                          className={`group ${rowBgClass}`}
                        >
                          {/* 1. FIRM COLUMN (Trophy/Rank + Big Square Logo with soft edges & metallic frame + Name + Bright Big Likes) */}
                          <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">
                            <div className="flex items-center gap-2.5 sm:gap-3.5">
                              {/* Rank / Trophy Badge */}
                              <div className="flex items-center justify-center shrink-0">
                                {rank === 1 ? (
                                  <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400/25 to-yellow-600/25 border border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center shadow-xs">
                                      1
                                    </span>
                                  </div>
                                ) : rank === 2 ? (
                                  <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-slate-300/25 to-slate-500/25 border border-slate-300/60 shadow-[0_0_12px_rgba(203,213,225,0.4)]">
                                    <Trophy className="w-4 h-4 text-slate-200" />
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-300 text-black text-[9px] font-black flex items-center justify-center shadow-xs">
                                      2
                                    </span>
                                  </div>
                                ) : rank === 3 ? (
                                  <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-600/25 to-amber-700/25 border border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                                    <Trophy className="w-4 h-4 text-orange-400" />
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-black text-[9px] font-black flex items-center justify-center shadow-xs">
                                      3
                                    </span>
                                  </div>
                                ) : (
                                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/[0.05] border border-white/15 flex items-center justify-center text-[11px] sm:text-xs font-black text-slate-300">
                                    {rank}
                                  </span>
                                )}
                              </div>

                              {/* Big Square Logo with Soft Rounded Edges & Metallic Frame */}
                              <div className="relative shrink-0">
                                <FirmLink firm={firm} className="block">
                                  <PropFirmLogo
                                    name={firm.name}
                                    logoUrl={firm.logo_url}
                                    circleCrop={false}
                                    frame={frameType}
                                    className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-xl aspect-square transition-all duration-300 group-hover:scale-105"
                                  />
                                </FirmLink>
                              </div>

                              {/* Firm Name + Bright & Big Likes System */}
                              <div className="min-w-0 flex-1 sm:flex-initial">
                                <div className="flex items-center gap-1.5">
                                  <FirmLink
                                    firm={firm}
                                    className="text-sm sm:text-base font-extrabold text-white group-hover:text-accent-cyan transition-colors truncate block max-w-[140px] sm:max-w-none tracking-tight"
                                  >
                                    {firm.name}
                                  </FirmLink>
                                  {firm.is_verified && (
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                  )}
                                </div>

                                {/* Animated Like System (Shallow when untapped, filled + pop animation when tapped) */}
                                <button
                                  onClick={(e) => toggleFavorite(firm.id, e)}
                                  className={`flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-lg transition-all duration-300 group/heart focus:outline-none cursor-pointer ${isFav
                                      ? 'bg-rose-500/20 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.35)] hover:bg-rose-500/25 hover:border-rose-500/80'
                                      : 'bg-rose-500/[0.05] border border-rose-500/20 hover:bg-rose-500/[0.12] hover:border-rose-500/40 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                                    }`}
                                  title={isFav ? "Remove from favorites" : "Like this firm"}
                                >
                                  <Heart
                                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-200 ${isFav
                                        ? `fill-rose-500 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.95)] ${recentlyLiked === firm.id ? 'animate-heart-pop' : 'scale-100'}`
                                        : 'stroke-[2.2] text-rose-400 fill-transparent group-hover/heart:fill-rose-500/25 group-hover/heart:text-rose-400 group-hover/heart:scale-115'
                                      }`}
                                  />
                                  <span
                                    className={`font-mono text-xs sm:text-sm font-black transition-colors ${isFav
                                        ? 'text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                        : 'text-rose-400/90 group-hover/heart:text-rose-300'
                                      }`}
                                  >
                                    {likesCount.toLocaleString()}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* 2. RANK / REVIEWS COLUMN */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle">
                            <div className="inline-flex flex-col items-center gap-0.5">
                              <div className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-black shadow-xs">
                                {firm.rating.toFixed(1)}
                              </div>
                              <div className="flex text-emerald-400 text-[10px] sm:text-xs gap-0.5">★★★★★</div>
                              <div className="text-[10px] text-slate-300 font-bold truncate max-w-[80px] sm:max-w-none">
                                {firm.review_count} revs
                              </div>
                            </div>
                          </td>

                          {/* 3. COUNTRY COLUMN (Flag + Country Name) */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle hidden sm:table-cell">
                            <div className="flex flex-col items-center gap-0.5 justify-center">
                              <span className="text-xl sm:text-2xl filter drop-shadow select-none">{flag}</span>
                              <div className="flex flex-col items-center">
                                <span className="text-[11px] font-black text-white uppercase tracking-wider">
                                  {firm.country || 'GLOBAL'}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                                  {COUNTRY_NAMES[firm.country || ''] || 'International'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 4. YEARS IN OPERATION COLUMN */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle hidden lg:table-cell">
                            <span className="text-sm sm:text-base font-black text-white font-mono">
                              {firm.years_active || '1'}
                            </span>
                          </td>

                          {/* 5. ASSETS COLUMN */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1 justify-center max-w-[160px] mx-auto">
                              {firm.category?.slice(0, 3).map((cat) => {
                                const c = cat.toLowerCase()
                                let style = 'bg-accent-purple/20 border-accent-purple/40 text-purple-300'
                                if (c.includes('forex')) {
                                  style = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                } else if (c.includes('crypto')) {
                                  style = 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                                } else if (c.includes('futures')) {
                                  style = 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                                }
                                return (
                                  <span
                                    key={cat}
                                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider shadow-xs ${style}`}
                                  >
                                    {cat}
                                  </span>
                                )
                              })}
                            </div>
                          </td>

                          {/* 6. PLATFORMS COLUMN (Platform Logo Badges) */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle hidden md:table-cell">
                            <div className="flex items-center justify-center gap-2 flex-wrap max-w-[160px] mx-auto">
                              {firm.platforms?.slice(0, 3).map((plat) => (
                                <PlatformBadge key={plat} platform={plat} />
                              ))}
                            </div>
                          </td>

                          {/* 7. MAX ALLOCATIONS COLUMN (Bold Sans-Serif Typography matching design) */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle hidden sm:table-cell">
                            <div className="inline-flex flex-col items-center justify-center">
                              <span className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight drop-shadow-[0_1px_8px_rgba(255,255,255,0.25)]">
                                {maxK}
                              </span>
                            </div>
                          </td>

                          {/* 8. PROMO COLUMN (Gradient Header + Dark Copyable Code) */}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center align-middle hidden md:table-cell">
                            {dealInfo ? (
                              <div className="inline-flex flex-col items-stretch overflow-hidden rounded-lg shadow-md border border-pink-500/50 min-w-[100px] max-w-[120px] mx-auto transition-all hover:scale-105 group/promo">
                                {/* Top discount header */}
                                <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-1.5 py-0.5 text-center shadow-inner">
                                  <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider">
                                    {dealInfo.discount}
                                  </span>
                                </div>
                                {/* Bottom code + copy button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCopyCode(dealInfo.code)
                                  }}
                                  className="bg-black/95 hover:bg-zinc-900 px-2 py-1 flex items-center justify-between gap-1 transition-colors text-left cursor-pointer"
                                  title="Click to copy promo code"
                                >
                                  <span className="font-mono text-[11px] font-black text-cyan-300 tracking-wide uppercase truncate">
                                    {dealInfo.code}
                                  </span>
                                  {copiedCode === dealInfo.code ? (
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter shrink-0 flex items-center gap-0.5">
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    </span>
                                  ) : (
                                    <Copy className="w-3 h-3 text-pink-400 shrink-0 group-hover/promo:text-pink-300 transition-colors" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs font-bold">—</span>
                            )}
                          </td>

                          {/* 9. ACTIONS COLUMN (Glowing Neon Pink Button) */}
                          <td className="px-3 sm:px-5 py-3 sm:py-4 text-right align-middle">
                            <FirmLink
                              firm={firm}
                              className="inline-block p-[1.5px] rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 shadow-[0_0_16px_rgba(236,72,153,0.7)] hover:shadow-[0_0_24px_rgba(236,72,153,1)] transition-all duration-300 hover:scale-105 group/btn"
                            >
                              <span className="px-5 py-1.5 sm:px-6 sm:py-2 rounded-full bg-[#070b14] flex items-center justify-center text-xs sm:text-sm font-black text-white tracking-widest uppercase border border-pink-400/50 group-hover/btn:bg-pink-950/40 group-hover/btn:text-pink-100 transition-colors">
                                Firm
                              </span>
                            </FirmLink>
                          </td>
                        </tr>
                      )
                    })
                ) : (
                  <tr>
                    <td colSpan={9} className="p-12 text-center">
                      <Globe className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-white text-lg font-bold">No firms found</p>
                      <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search query</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
