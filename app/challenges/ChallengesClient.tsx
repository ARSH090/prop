'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Bookmark, Copy, ExternalLink, HelpCircle, Check, ArrowUpDown, Flame, Trophy, Heart, ChevronDown, Star } from 'lucide-react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'
import { ChallengeLink } from '@/components/ui/challenge-link'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Challenge {
  id: string
  firm_id: string
  account_size: number
  steps: number
  profit_target_p1: number
  profit_target_p2: number
  daily_loss_pct: number
  max_loss_pct: number
  pt_dd_ratio: string
  profit_split_pct: number
  payout_freq: string
  loyalty_points: number
  popularity_score: number
  price: number
  original_price: number
  currency: string
  deal_id: string | null
  affiliate_url: string | null
  is_active: boolean
  logo_url?: string | null
}

interface Firm {
  id: string
  slug: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  affiliate_url: string
  category?: string[]
}

interface Deal {
  id: string
  code: string
  discount_label: string
  firm_id: string
  logo_url?: string | null
  status?: string
  title?: string
  description?: string
  is_featured?: boolean
}

interface ChallengesClientProps {
  initialChallenges: Challenge[]
  firms: Firm[]
  deals: Deal[]
}



const GOLD_TIER_FIRMS = [
  'ftmo',
  'funding pips',
  'fundingpips',
  'the 5%ers',
  '5ers',
  'fundednext',
  'topstep',
  'apex trader funding',
  'apex funding',
  'apex',
  'moneta funded',
  'for traders',
  'aquafunded',
  'aqua funded'
]



export default function ChallengesClient({
  initialChallenges,
  firms,
  deals,
}: ChallengesClientProps) {
  const [favoriteFirms, setFavoriteFirms] = useState<string[]>([])

  // Dynamically build active Forex offers from actual Firestore deals and firms
  const dynamicForexOffers = React.useMemo(() => {
    return deals
      .filter((d) => d.status === 'active')
      .map((d) => {
        const firm = firms.find((f) => f.id === d.firm_id)
        if (!firm) return null
        return {
          name: firm.name,
          rating: firm.rating ? firm.rating.toFixed(1) : '4.5',
          discount: d.discount_label || 'Special Promo',
          code: d.code,
          logo: d.logo_url || firm.logo_url,
          firmSlug: firm.slug,
          isFeatured: !!d.is_featured,
        }
      })
      .filter(Boolean) as any[]
  }, [deals, firms])

  // Dynamically build active Futures firms from actual Firestore
  const dynamicFuturesFirms = React.useMemo(() => {
    return firms
      .filter((f) => {
        const cats = f.category?.map(c => c.toLowerCase()) || []
        return cats.includes('futures')
      })
      .map((firm, idx) => {
        const deal = deals.find((d) => d.firm_id === firm.id && d.status === 'active')
        return {
          rank: idx + 1,
          name: firm.name,
          rating: firm.rating ? firm.rating.toFixed(1) : '4.5',
          discount: deal?.discount_label || 'Promo Active',
          code: deal?.code || 'MATCH',
          logo: firm.logo_url,
          firmSlug: firm.slug
        }
      })
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 3)
  }, [firms, deals])

  // Auto-swipe page carousel state for Forex Offers
  const [activePromoPage, setActivePromoPage] = useState(0)
  const promoItemsPerPage = 3
  const totalPromoPages = Math.max(1, Math.ceil(dynamicForexOffers.length / promoItemsPerPage))

  useEffect(() => {
    if (totalPromoPages <= 1) return
    const timer = setInterval(() => {
      setActivePromoPage((prev) => (prev + 1) % totalPromoPages)
    }, 4000) // Advances every 4 seconds
    return () => clearInterval(timer)
  }, [totalPromoPages])

  const visiblePromoOffers = React.useMemo(() => {
    if (dynamicForexOffers.length === 0) return []
    const startIdx = activePromoPage * promoItemsPerPage
    return dynamicForexOffers.slice(startIdx, startIdx + promoItemsPerPage)
  }, [dynamicForexOffers, activePromoPage])

  // Dynamically extract unique sizes from the full initial challenges list
  const uniqueSizes = Array.from(
    new Set(initialChallenges.map((c) => c.account_size))
  ).sort((a, b) => a - b)
  
  // Filters & State
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [filterFirm, setFilterFirm] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSteps, setFilterSteps] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')

  // Toggles
  const [applyDiscount, setApplyDiscount] = useState(true)
  const [sortByPopularity, setSortByPopularity] = useState(true)
  const [viewBookmarksOnly, setViewBookmarksOnly] = useState(false)

  // Sortable headers state
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Buy Code Modal State
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Reset pagination to first page when search/filter criteria change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterFirm, filterCategory, filterSteps, filterSize, filterMaxPrice, viewBookmarksOnly, sortByPopularity, applyDiscount])

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

  const handleToggleBookmark = (firmId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = favoriteFirms.includes(firmId)
      ? favoriteFirms.filter((id) => id !== firmId)
      : [...favoriteFirms, firmId]
    setFavoriteFirms(updated)
    localStorage.setItem('afx_favorites', JSON.stringify(updated))
  }

  const getFirm = (firmId: string) => {
    return firms.find((f) => f.id === firmId)
  }

  const getDealCode = (dealId: string | null) => {
    if (!dealId) return null
    return deals.find((d) => d.id === dealId)
  }

  const handleBuyClick = async (challenge: Challenge) => {
    try {
      await fetch(`/api/deals/${challenge.deal_id || 'challenge'}/click`, { method: 'POST' })
    } catch (e) {
      console.warn(e)
    }

    const linkedDeal = getDealCode(challenge.deal_id)
    if (linkedDeal) {
      setSelectedDeal({
        code: linkedDeal.code,
        label: linkedDeal.discount_label,
        url: challenge.affiliate_url || getFirm(challenge.firm_id)?.affiliate_url || '#',
      })
    } else {
      window.open(challenge.affiliate_url || getFirm(challenge.firm_id)?.affiliate_url || '#', '_blank')
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter & Sort Pipeline
  let challenges = [...initialChallenges]

  if (search) {
    challenges = challenges.filter((c) => {
      const f = getFirm(c.firm_id)
      return f?.name.toLowerCase().includes(search.toLowerCase())
    })
  }

  if (viewBookmarksOnly) {
    challenges = challenges.filter((c) => favoriteFirms.includes(c.firm_id))
  }

  if (filterFirm !== 'all') {
    challenges = challenges.filter((c) => c.firm_id === filterFirm)
  }

  if (filterCategory !== 'all') {
    challenges = challenges.filter((c) => {
      const f = getFirm(c.firm_id)
      return f?.category?.map((cat: string) => cat.toLowerCase()).includes(filterCategory.toLowerCase())
    })
  }

  if (filterSteps !== 'all') {
    challenges = challenges.filter((c) => c.steps === Number(filterSteps))
  }

  if (filterSize !== 'all') {
    challenges = challenges.filter((c) => c.account_size === Number(filterSize))
  }

  if (filterMaxPrice) {
    challenges = challenges.filter((c) => c.price <= Number(filterMaxPrice))
  }

  // Sorting
  if (sortField) {
    challenges.sort((a: any, b: any) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  } else if (sortByPopularity) {
    challenges.sort((a, b) => b.popularity_score - a.popularity_score)
  } else {
    challenges.sort((a, b) => b.popularity_score - a.popularity_score)
  }

  // Pagination bounds
  const totalItems = challenges.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedChallenges = challenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleHeaderSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Helper to draw Profit Split bars
  const ProfitSplitBar = ({ pct }: { pct: number }) => {
    const filledBars = Math.round(pct / 10)
    return (
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span className="font-mono font-bold text-text-primary text-xs">{pct}%</span>
        <div className="flex gap-[2px] items-center h-2.5 justify-center">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isFilled = idx < filledBars
            return (
              <div
                key={idx}
                className={`w-[3px] h-full rounded-[1px] transition-colors duration-300 ${
                  isFilled ? 'bg-gradient-to-t from-accent-cyan to-accent-purple' : 'bg-border-subtle/30'
                }`}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Promotional dual boxes grid matches screenshot */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Side: Exclusive July Offers */}
        <div className="lg:col-span-8 bg-bg-surface/30 border border-border-subtle/70 rounded-3xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-text-primary flex items-center gap-2 uppercase tracking-wide">
              Exclusive July Forex Offers 🩸
            </h2>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPromoPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePromoPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    idx === activePromoPage ? 'bg-accent-cyan scale-125' : 'bg-border-subtle hover:bg-text-secondary'
                  }`}
                  title={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div key={activePromoPage} className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
            {visiblePromoOffers.length === 0 ? (
              <div className="col-span-3 text-center py-6 text-xs text-text-muted">
                No active Forex deals. Admin can configure deals in the admin panel.
              </div>
            ) : (
              visiblePromoOffers.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="group p-3 bg-bg-base border border-border-subtle hover:border-accent-cyan/40 transition-all rounded-2xl flex items-center gap-3 relative"
                  >
                    <PropFirmLogo name={item.name} logoUrl={item.logo} className="w-9 h-9 rounded-xl transition-all duration-300 group-hover:scale-110" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[11px] font-black text-text-primary truncate">{item.name}</h3>
                      <p className="text-[9px] text-text-muted mt-0.5 font-bold truncate">★ {item.rating}</p>
                    </div>
                    
                    {/* Discount Code Badging */}
                    <div className="text-right shrink-0">
                      <span className="block text-[10px] font-black text-[#EC4899]">{item.discount}</span>
                      <span className="inline-block text-[8px] font-mono text-text-secondary bg-border-subtle/50 px-1 py-0.5 rounded font-black tracking-wider uppercase">
                        {item.code}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Popular Futures Firms */}
        <div className="lg:col-span-4 bg-bg-surface/30 border border-border-subtle/70 rounded-3xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-sm font-black text-text-primary flex items-center gap-2 mb-4 uppercase tracking-wide">
            Most Popular Futures Prop Firms 🏆
          </h2>

          <div className="space-y-2">
            {dynamicFuturesFirms.length === 0 ? (
              <div className="text-center py-6 text-xs text-text-muted">
                No active Futures firms. Add 'futures' category to firms in the admin panel.
              </div>
            ) : (
              dynamicFuturesFirms.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="group p-2.5 bg-bg-base border border-border-subtle hover:border-accent-purple/40 transition-all rounded-2xl flex items-center justify-between gap-3 animate-fade-in"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.rank === 1 ? (
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : item.rank === 2 ? (
                        <Trophy className="w-4 h-4 text-slate-300 shrink-0" />
                      ) : (
                        <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      
                      <PropFirmLogo name={item.name} logoUrl={item.logo} className="w-7 h-7 rounded-lg transition-all duration-300 group-hover:scale-110" />

                      <div className="min-w-0">
                        <h3 className="text-[11px] font-black text-text-primary truncate">{item.name}</h3>
                        <p className="text-[8px] text-text-muted mt-0.5 font-bold">★ {item.rating}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-[10px] font-black text-accent-cyan">{item.discount}</span>
                      <span className="inline-block text-[8px] font-mono text-text-secondary bg-border-subtle/50 px-1 py-0.5 rounded font-black tracking-wider uppercase">
                        {item.code}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      {/* 2. Selection Sub-menu tabs bar matches PFM screenshot navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-b border-border-subtle/30 pb-4">
        {[
          { label: 'Firms', href: '/firms', active: false },
          { label: 'Challenges', href: '/challenges', active: true },
          { label: 'Offers', href: '/deals', active: false },
          { label: 'Reviews', href: '/reviews', active: false },
          { label: 'Futures Firms', href: '/futures', active: false, badge: 'Trending' }
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 border border-border-subtle/60 ${
              tab.active
                ? 'bg-text-primary text-bg-base border-text-primary shadow-lg shadow-white/5'
                : 'text-text-secondary hover:text-text-primary bg-bg-surface/50'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none">
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* 3. Refactored Toolbar Filters row - Matches screenshot filters exactly */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-bg-surface/50 border border-border-subtle/50 p-4 rounded-3xl backdrop-blur-sm shadow-xl">
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Filters Drawer Trigger */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle bg-bg-base text-xs font-black text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/50 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-accent-cyan" />
            Filter
          </button>

          {/* Quick Dropdown: Assets */}
          <div className="relative shrink-0 group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-bg-base border border-border-subtle rounded-full pl-4 pr-9 py-2.5 text-xs font-black text-text-secondary cursor-pointer hover:border-accent-cyan/80 group-hover:scale-[1.03] transition-all outline-none shadow-sm"
            >
              <option value="all">Assets: All</option>
              <option value="forex">Assets: FX</option>
              <option value="futures">Assets: Futures</option>
              <option value="crypto">Assets: Crypto</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-3 h-3 text-text-muted pointer-events-none group-hover:text-accent-cyan transition-colors" />
          </div>

          {/* Quick Dropdown: Size */}
          <div className="relative shrink-0 group">
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="appearance-none bg-bg-base border border-border-subtle rounded-full pl-4 pr-9 py-2.5 text-xs font-black text-text-secondary cursor-pointer hover:border-accent-cyan/80 group-hover:scale-[1.03] transition-all outline-none shadow-sm"
            >
              <option value="all">Size: All</option>
              {uniqueSizes.map((size) => (
                <option key={size} value={size}>
                  Size: ${size >= 1000000 ? `${(size / 1000000).toFixed(1).replace('.0', '')}M` : `${(size / 1000).toFixed(0)}K`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-3 h-3 text-text-muted pointer-events-none group-hover:text-accent-cyan transition-colors" />
          </div>

          {/* Quick Dropdown: Steps */}
          <div className="relative shrink-0 group">
            <select
              value={filterSteps}
              onChange={(e) => setFilterSteps(e.target.value)}
              className="appearance-none bg-bg-base border border-border-subtle rounded-full pl-4 pr-9 py-2.5 text-xs font-black text-text-secondary cursor-pointer hover:border-accent-cyan/80 group-hover:scale-[1.03] transition-all outline-none shadow-sm"
            >
              <option value="all">Steps: All</option>
              <option value="0">Steps: Instant</option>
              <option value="1">Steps: 1 Step</option>
              <option value="2">Steps: 2 Steps</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-3 h-3 text-text-muted pointer-events-none group-hover:text-accent-cyan transition-colors" />
          </div>

          {/* Apply Discount Custom Toggle Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none shrink-0 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={applyDiscount}
                onChange={() => setApplyDiscount(!applyDiscount)}
                className="sr-only"
              />
              <div className={`w-9 h-5 rounded-full transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(236,72,153,0.4)] ${applyDiscount ? 'bg-[#EC4899]' : 'bg-bg-base border border-border-subtle'}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${applyDiscount ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="text-xs font-black text-text-secondary group-hover:text-text-primary transition-colors">Apply Discount</span>
          </label>

          {/* Popularity Custom Toggle Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none shrink-0 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={sortByPopularity}
                onChange={() => setSortByPopularity(!sortByPopularity)}
                className="sr-only"
              />
              <div className={`w-9 h-5 rounded-full transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(236,72,153,0.4)] ${sortByPopularity ? 'bg-[#EC4899]' : 'bg-bg-base border border-border-subtle'}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${sortByPopularity ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="text-xs font-black text-text-secondary group-hover:text-text-primary transition-colors">Popularity</span>
          </label>

          {/* Bookmarks Toggle button pills */}
          <button
            onClick={() => { setViewBookmarksOnly(false); setCurrentPage(1); }}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border cursor-pointer shrink-0 hover:scale-105 active:scale-95 duration-200 ${
              !viewBookmarksOnly
                ? 'bg-bg-base text-accent-cyan border-accent-cyan/40 shadow-md shadow-accent-cyan/5'
                : 'text-text-secondary border-border-subtle bg-transparent hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setViewBookmarksOnly(true); setCurrentPage(1); }}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95 duration-200 ${
              viewBookmarksOnly
                ? 'bg-bg-base text-accent-cyan border-accent-cyan/40 shadow-md shadow-accent-cyan/5'
                : 'text-text-secondary border-border-subtle bg-transparent hover:text-text-primary'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-accent-cyan fill-accent-cyan" />
            Bookmarks
          </button>
        </div>

        <div className="flex items-center gap-2 self-stretch xl:self-auto justify-between xl:justify-end">
          {/* Customize columns */}
          <button className="px-5 py-2.5 rounded-full border border-border-subtle bg-bg-base text-xs font-black text-text-secondary hover:text-text-primary hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shrink-0 shadow-sm cursor-pointer">
            <span>🎛️</span> Customize
          </button>

          {/* Search prop challenges input */}
          <div className="relative flex-1 xl:flex-initial xl:w-44 group">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-text-muted group-hover:text-accent-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border-subtle rounded-full text-xs font-extrabold text-text-primary focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      {showDrawer && (
        <div className="bg-bg-surface/30 border border-border-subtle p-5 rounded-2xl grid md:grid-cols-4 gap-4 animate-fade-in text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Prop Firm</label>
            <select
              value={filterFirm}
              onChange={(e) => setFilterFirm(e.target.value)}
              className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary outline-none"
            >
              <option value="all">All Firms</option>
              {firms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Max Price ($)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary outline-none"
            />
          </div>
        </div>
      )}

      {/* Challenges Count & Verify Info */}
      <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
        <h3 className="text-sm font-black text-text-primary">
          Challenges <span className="text-accent-cyan font-mono">{challenges.length}</span>
        </h3>
        <button className="text-xs font-bold text-accent-purple hover:underline bg-transparent">
          How We Verify and Rank Firms
        </button>
      </div>

      {/* 4. 13-Column Comparison Table Container - Using standard HTML table layout for pixel-perfect columns */}
      {paginatedChallenges.length > 0 ? (
        <div className="border border-border-subtle bg-bg-surface/20 rounded-3xl p-1 overflow-hidden shadow-2xl relative">
          
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-left text-sm text-text-secondary min-w-[950px]">
              <thead>
                <tr className="border-b border-border-subtle/30 bg-bg-surface/40 text-xs font-black uppercase tracking-wider text-text-muted select-none">
                  <th className="px-3 py-3 text-left font-black w-[240px]">Firm / Rank</th>
                  <th className="px-3 py-3 text-center font-black w-[100px]">Account Size</th>
                  <th className="px-3 py-3 text-center font-black w-[80px]">Steps</th>
                  <th className="px-3 py-3 text-center font-black w-[110px]">Profit Target</th>
                  <th className="px-3 py-3 text-center font-black w-[85px]">Daily Loss</th>
                  <th className="px-3 py-3 text-center font-black w-[85px]">Max Loss</th>
                  <th className="px-3 py-3 text-center font-black w-[100px] hidden lg:table-cell">Max Loss Type</th>
                  <th className="px-3 py-3 text-center font-black w-[75px] hidden xl:table-cell">PT:DD</th>
                  <th className="px-3 py-3 text-center font-black w-[100px]">Profit Split</th>
                  <th className="px-3 py-3 text-center font-black w-[100px] hidden lg:table-cell">Payout Freq.</th>
                  <th className="px-3 py-3 text-center font-black w-[90px] hidden xl:table-cell">Loyalty Pts</th>
                  <th className="px-3 py-3 text-center font-black w-[100px]">Price</th>
                  <th className="px-3 py-3 text-right font-black w-[95px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/30">
                {paginatedChallenges.map((ch) => {
                  const firm = getFirm(ch.firm_id)
                  const isGoldTier = firm && GOLD_TIER_FIRMS.includes(firm.name.toLowerCase().trim())

                  // Price calculations
                  const deal = getDealCode(ch.deal_id)
                  let displayPrice = ch.price
                  let originalPrice = ch.original_price || ch.price
                  const isDiscounted = applyDiscount && deal

                  if (isDiscounted && deal) {
                    const pctMatch = deal.discount_label.match(/(\d+)%/)
                    if (pctMatch) {
                      const discountPct = parseFloat(pctMatch[1])
                      displayPrice = ch.price * (1 - discountPct / 100)
                    }
                  }

                  // Retrieve clean logo URL using helper function, respecting overrides
                  const logoUrl = getCleanLogoUrl(firm?.name || 'challenge', ch.logo_url || firm?.logo_url || null)

                  return (
                    <tr
                      key={ch.id}
                      className="group hover:bg-bg-surface/30 hover:scale-[1.01] hover:shadow-[0_4px_25px_rgba(34,211,238,0.15)] transition-all duration-300 border-b border-border-subtle/30"
                    >
                      {/* 1. Firm / Rank column */}
                      <td className="px-3 py-3 align-middle relative">
                        {/* Hover left accent glow bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent-cyan to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex items-center gap-2 pl-1.5">
                          {/* Star favorite toggle */}
                          <button
                            onClick={(e) => handleToggleBookmark(ch.firm_id, e)}
                            className="p-1 rounded-full text-text-muted hover:text-amber-400 transition-all shrink-0 cursor-pointer"
                            title={favoriteFirms.includes(ch.firm_id) ? "Remove from Bookmarks" : "Add to Bookmarks"}
                          >
                            <Star className={`w-4 h-4 transition-transform active:scale-75 ${favoriteFirms.includes(ch.firm_id) ? "fill-amber-400 text-amber-400" : "text-text-muted hover:text-text-secondary"}`} />
                          </button>

                          {/* Logo with gold tier badge overlap */}
                          <div className="relative shrink-0 transition-all duration-300 group-hover:scale-110">
                            <PropFirmLogo name={firm?.name || 'Challenge'} logoUrl={ch.logo_url || firm?.logo_url || null} className="w-10 h-10 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                            {isGoldTier && (
                              <div className="absolute -bottom-1.5 -right-1.5 w-4.5 h-4.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full border border-bg-surface flex items-center justify-center shadow-md shadow-black/40" title="Gold Tier Verified">
                                <span className="text-[10px] text-bg-surface font-black leading-none">★</span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <ChallengeLink
                              firmSlug={firm?.slug || ''}
                              className="block text-[15px] font-black text-text-primary truncate hover:text-accent-cyan transition-colors"
                            >
                              {firm?.name || 'Challenge'}
                            </ChallengeLink>
                            
                            {/* Rating block under title */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] bg-accent-purple/20 text-accent-purple px-1 rounded font-bold">
                                {firm?.rating.toFixed(1) || '4.5'}
                              </span>
                              <span className="text-amber-400 text-[8px] tracking-tighter">★★★★★</span>
                              <span className="text-[10px] text-text-muted font-bold truncate">
                                {firm?.review_count || '120'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Account Size column */}
                      <td className="px-3 py-3 text-center align-middle text-[17px] font-black text-accent-cyan font-mono">
                        ${(ch.account_size / 1000).toFixed(0)}K
                      </td>

                      {/* 3. Steps count column */}
                      <td className="px-3 py-3 text-center align-middle text-[15px] font-bold text-text-secondary">
                        {ch.steps === 0 ? 'Instant' : `${ch.steps} Steps`}
                      </td>

                      {/* 4. Profit Target column */}
                      <td className="px-3 py-3 text-center align-middle text-[17px] font-black text-emerald-400 font-mono">
                        {ch.profit_target_p1}% {ch.steps > 1 ? `| ${ch.profit_target_p2}%` : ''}
                      </td>

                      {/* 5. Daily Loss column */}
                      <td className="px-3 py-3 text-center align-middle text-[17px] font-black text-rose-500/90 font-mono">
                        {ch.daily_loss_pct}%
                      </td>

                      {/* 6. Max Loss column */}
                      <td className="px-3 py-3 text-center align-middle text-[17px] font-black text-rose-500/90 font-mono">
                        {ch.max_loss_pct}%
                      </td>

                      {/* 7. Max Loss Type column */}
                      <td className="px-3 py-3 text-center align-middle text-[15px] font-bold text-text-secondary truncate hidden lg:table-cell">
                        Static
                      </td>

                      {/* 8. PT:DD column */}
                      <td className="px-3 py-3 text-center align-middle text-[15px] font-bold text-text-secondary font-mono hidden xl:table-cell">
                        {ch.pt_dd_ratio || '1:1'}
                      </td>

                      {/* 9. Profit Split column with bars */}
                      <td className="px-3 py-3 text-center align-middle">
                        <div className="inline-flex justify-center">
                          <ProfitSplitBar pct={ch.profit_split_pct} />
                        </div>
                      </td>

                      {/* 10. Payout Freq column */}
                      <td className="px-3 py-3 text-center align-middle text-sm font-bold text-text-secondary truncate hidden lg:table-cell" title={ch.payout_freq}>
                        {ch.payout_freq}
                      </td>

                      {/* 11. Loyalty Points column */}
                      <td className="px-3 py-3 text-center align-middle text-[17px] font-black text-accent-purple hidden xl:table-cell">
                        <div className="inline-flex items-center gap-1">
                          <span>💎</span>
                          <span className="font-mono">{ch.loyalty_points || '180'}</span>
                        </div>
                      </td>

                      {/* 12. Price column */}
                      <td className="px-3 py-3 text-center align-middle font-mono">
                        {isDiscounted ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="line-through text-text-muted text-[12px] font-bold">
                              ${originalPrice.toFixed(2)}
                            </span>
                            <span className="text-accent-cyan text-[17px] font-black">
                              ${displayPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[17px] font-black text-text-primary">
                            ${ch.price.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* 13. Buy Action column */}
                      <td className="px-3 py-3 text-right align-middle">
                        <button
                          onClick={() => handleBuyClick(ch)}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple text-[15px] font-black text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-accent-cyan/10 hover:shadow-lg hover:shadow-accent-cyan/20 cursor-pointer whitespace-nowrap"
                        >
                          Buy
                        </button>
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
          <p className="text-text-secondary text-sm font-semibold">No challenges match your filters.</p>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-bg-surface/30 border border-border-subtle p-4 rounded-2xl text-xs font-mono">
          <span className="text-text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1.5 rounded-full bg-bg-surface hover:bg-bg-base text-text-primary disabled:opacity-50 transition-colors border border-border-subtle font-bold"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 rounded-full bg-bg-surface hover:bg-bg-base text-text-primary disabled:opacity-50 transition-colors border border-border-subtle font-bold"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Buy Discount Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <AFXCard className="bg-bg-surface border border-border-subtle max-w-sm w-full p-6 space-y-6 relative rounded-3xl">
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute right-4 top-4 text-text-muted hover:text-text-primary text-sm font-bold font-mono"
            >
              ✕
            </button>
            
            <div className="text-center space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
                {selectedDeal.label} Enabled
              </span>
              <h3 className="text-lg font-bold text-text-primary">Copy Promo Code</h3>
              <p className="text-text-secondary text-xs">
                Copy this code and paste it on the checkout page to activate your discount.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={selectedDeal.code}
                readOnly
                className="w-full px-4 py-3 bg-bg-base border border-border-subtle rounded-xl text-text-primary font-mono text-center text-sm outline-none"
              />
              <button
                onClick={() => handleCopyCode(selectedDeal.code)}
                className="absolute right-2 top-2 p-1.5 hover:bg-bg-surface rounded-lg transition-colors text-accent-cyan"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2">
              <a
                href={selectedDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedDeal(null)}
                className="block w-full py-3 rounded-xl font-bold text-bg-base text-center hover:opacity-95 bg-gradient-to-r from-accent-cyan to-accent-blue text-sm"
              >
                Continue to checkout
              </a>
            </div>
          </AFXCard>
        </div>
      )}

    </div>
  )
}
