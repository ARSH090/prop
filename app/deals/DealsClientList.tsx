'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Heart, Copy, Check, ArrowRight, TrendingUp, Tag, ShieldCheck, Star } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Deal {
  id: string
  code: string
  title: string
  discount_label: string
  description: string
  firm_id: string
  is_featured?: boolean
  is_bogo?: boolean
  is_best_offer?: boolean
  is_main_offer?: boolean
  tag?: string
  priority?: number
  discord_code?: string
  affiliate_url?: string | null
  expires_at?: any
  deal_type?: string
  status?: string
  firm?: any
  firms?: {
    name: string
    slug: string
    affiliate_url: string
  } | null
}

interface Firm {
  id: string
  slug: string
  name: string
  logo_url?: string | null
  rating?: number
  review_count?: number
  likes_count?: number
  category?: string[]
  circle_crop_logo?: boolean
  affiliate_url?: string
  website_url?: string
  is_popular?: boolean
  coupon_code_custom?: string
  discount_label_custom?: string
}

interface DealsClientListProps {
  initialDeals: Deal[]
  allFirms?: Firm[]
  tabLabels?: {
    best_value?: string
    bogo?: string
    cash_back?: string
    extra_points?: string
  }
}

// Sparkle Star SVG Icon (Exact match to Image 1 & 2)
const BogoSparkleIcon = () => (
  <svg className="w-4 h-4 text-white fill-white shrink-0" viewBox="0 0 24 24">
    <path d="M12 2L14.2 9.2L21.5 11.5L14.2 13.8L12 21L9.8 13.8L2.5 11.5L9.8 9.2L12 2Z" fill="white" />
    <circle cx="19" cy="4" r="1.8" fill="white" />
    <circle cx="4.5" cy="18.5" r="1.5" fill="white" />
  </svg>
)

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        }
        if (i === fullStars && hasHalf) {
          return <Star key={i} className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400" />
        }
        return <Star key={i} className="w-3.5 h-3.5 text-slate-600" />
      })}
    </div>
  )
}

export default function DealsClientList({
  initialDeals,
  allFirms = [],
  tabLabels = {},
}: DealsClientListProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<'forex' | 'futures' | 'crypto'>('forex')
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BOGO' | 'BEST_OFFERS' | 'CASHBACK'>('ALL')
  const [search, setSearch] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [favoriteFirms, setFavoriteFirms] = useState<string[]>([])
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({})
  const [popHeartId, setPopHeartId] = useState<string | null>(null)
  const [expandedFirmId, setExpandedFirmId] = useState<string | null>(null)

  // Load saved bookmarks & initialize like counts
  useEffect(() => {
    try {
      const saved = localStorage.getItem('afx_favorites')
      if (saved) {
        setFavoriteFirms(JSON.parse(saved))
      }
    } catch (e) { }

    const initialLikes: Record<string, number> = {}
    allFirms.forEach((f) => {
      initialLikes[f.id] = f.likes_count || (f.review_count ? f.review_count * 15 + 1200 : 1500)
    })
    setLikesCounts(initialLikes)
  }, [allFirms])

  const handleToggleLike = (firmId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const isLiked = favoriteFirms.includes(firmId)
    let newFavorites: string[]

    if (isLiked) {
      newFavorites = favoriteFirms.filter((id) => id !== firmId)
      setLikesCounts((prev) => ({
        ...prev,
        [firmId]: Math.max(0, (prev[firmId] || 1500) - 1),
      }))
    } else {
      newFavorites = [...favoriteFirms, firmId]
      setPopHeartId(firmId)
      setTimeout(() => setPopHeartId(null), 600)
      setLikesCounts((prev) => ({
        ...prev,
        [firmId]: (prev[firmId] || 1500) + 1,
      }))
    }

    setFavoriteFirms(newFavorites)
    try {
      localStorage.setItem('afx_favorites', JSON.stringify(newFavorites))
    } catch (err) { }
  }

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleTrackDealClick = async (dealId: string) => {
    try {
      await fetch(`/api/deals/${dealId}/click`, { method: 'POST' })
    } catch (error) { }
  }

  const formatLikes = (count?: number) => {
    if (!count) return '1.5K'
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toLocaleString()
  }

  // 1. Group active deals by Firm, filtered strictly by selectedCategory
  const firmOfferGroups = React.useMemo(() => {
    const firmMap = new Map<string, Firm>()
    allFirms.forEach((f) => {
      const cats = (f.category || ['forex']).map((c: string) => c.toLowerCase().trim())
      let matches = false
      if (selectedCategory === 'forex') {
        matches = cats.includes('forex') || cats.includes('cfd') || cats.length === 0
      } else {
        matches = cats.includes(selectedCategory)
      }
      if (matches) {
        firmMap.set(f.id, f)
      }
    })

    initialDeals.forEach((deal) => {
      if (deal.firm && !firmMap.has(deal.firm_id)) {
        const cats = (deal.firm.category || ['forex']).map((c: string) => c.toLowerCase().trim())
        let matches = false
        if (selectedCategory === 'forex') {
          matches = cats.includes('forex') || cats.includes('cfd') || cats.length === 0
        } else {
          matches = cats.includes(selectedCategory)
        }
        if (matches) {
          firmMap.set(deal.firm_id, deal.firm)
        }
      }
    })

    const groups: {
      firm: Firm
      mainDeal: Deal
      additionalDeals: Deal[]
      allDeals: Deal[]
      hasBogo: boolean
      hasBestOffer: boolean
      hasCashback: boolean
    }[] = []

    firmMap.forEach((firm, firmId) => {
      const dealsForFirm = initialDeals.filter((d) => d.firm_id === firmId)

      let dealsList = dealsForFirm
      if (dealsList.length === 0 && firm.coupon_code_custom) {
        dealsList = [
          {
            id: `deal-auto-${firm.id}`,
            code: firm.coupon_code_custom,
            title: `${firm.name} Exclusive Discount`,
            discount_label: firm.discount_label_custom || 'EXCLUSIVE DEAL',
            tag: firm.discount_label_custom || 'SPECIAL OFFER',
            description: `Exclusive discount on all evaluation packages`,
            firm_id: firm.id,
            is_featured: true,
            is_best_offer: true,
            deal_type: 'best_value',
            status: 'active',
          },
        ]
      }

      if (dealsList.length === 0) return

      // Sort deals: is_main_offer first, then priority DESC, then is_featured DESC
      const sortedDeals = [...dealsList].sort((a, b) => {
        if (a.is_main_offer && !b.is_main_offer) return -1
        if (!a.is_main_offer && b.is_main_offer) return 1
        const pA = a.priority || 0
        const pB = b.priority || 0
        if (pA !== pB) return pB - pA
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        return 0
      })

      const mainDeal = sortedDeals[0]
      const additionalDeals = sortedDeals.slice(1)

      const hasBogo = dealsList.some(
        (d) =>
          d.is_bogo === true ||
          d.deal_type === 'bogo' ||
          d.tag?.toLowerCase().includes('bogo') ||
          d.discount_label?.toLowerCase().includes('bogo') ||
          d.title?.toLowerCase().includes('bogo')
      )

      const hasBestOffer =
        firm.is_popular === true ||
        dealsList.some(
          (d) =>
            d.is_best_offer === true ||
            d.deal_type === 'best_value' ||
            d.is_featured === true ||
            d.tag?.toLowerCase().includes('best')
        )

      const hasCashback = dealsList.some(
        (d) =>
          d.deal_type === 'cash_back' ||
          d.tag?.toLowerCase().includes('cash') ||
          d.tag?.toLowerCase().includes('refund') ||
          d.discount_label?.toLowerCase().includes('cash') ||
          d.title?.toLowerCase().includes('cash')
      )

      groups.push({
        firm,
        mainDeal,
        additionalDeals,
        allDeals: dealsList,
        hasBogo,
        hasBestOffer,
        hasCashback,
      })
    })

    // Sort groups so popular firms like Goat Funded Trader, Blue Guardian, FTMO appear at the top
    return groups.sort((a, b) => {
      const pA = (a.firm.is_popular ? 10 : 0) + (a.mainDeal.priority || 0)
      const pB = (b.firm.is_popular ? 10 : 0) + (b.mainDeal.priority || 0)
      return pB - pA
    })
  }, [initialDeals, allFirms, selectedCategory])

  // 2. Filter firms according to active tag & search
  const filteredGroups = React.useMemo(() => {
    return firmOfferGroups.filter((group) => {
      if (activeFilter === 'BOGO' && !group.hasBogo) return false
      if (activeFilter === 'BEST_OFFERS' && !group.hasBestOffer) return false
      if (activeFilter === 'CASHBACK' && !group.hasCashback) return false

      if (search.trim()) {
        const query = search.toLowerCase()
        const firmMatch =
          group.firm.name.toLowerCase().includes(query) ||
          (group.firm.slug || '').toLowerCase().includes(query)
        const dealMatch = group.allDeals.some(
          (d) =>
            d.code.toLowerCase().includes(query) ||
            d.title.toLowerCase().includes(query) ||
            (d.discount_label || '').toLowerCase().includes(query) ||
            (d.tag || '').toLowerCase().includes(query)
        )
        if (!firmMatch && !dealMatch) return false
      }

      return true
    })
  }, [firmOfferGroups, activeFilter, search])

  return (
    <div className="space-y-8">
      {/* Category Switcher Tabs (Matching Image 2: Forex / CFDs, Futures, Crypto) */}
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
      {/* Smooth Filter Tags in ONE LINE + Search Input (Matching Images 3, 4, 5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 liquid-glass-card p-3.5 sm:p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1">
          {/* BOGO Button (Image 3 Magenta Gradient Texture) */}
          <button
            onClick={() => setActiveFilter('BOGO')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none shrink-0 font-chunky-num transition-all duration-300 ${activeFilter === 'BOGO'
                ? 'btn-pill-bogo scale-105 shadow-[0_0_24px_rgba(236,72,153,0.9)]'
                : 'bg-gradient-to-r from-[#e879f9]/40 via-[#d946ef]/40 to-[#f43f5e]/40 border-2 border-[#f472b6]/70 text-white hover:scale-105 hover:border-[#f472b6]'
              }`}
          >
            <BogoSparkleIcon />
            <span className="text-white drop-shadow-md font-black">BOGO</span>
          </button>

          {/* BEST OFFERS Button (Image 5 Sky Blue Gradient Texture) */}
          <button
            onClick={() => setActiveFilter('BEST_OFFERS')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none shrink-0 font-chunky-num transition-all duration-300 ${activeFilter === 'BEST_OFFERS'
                ? 'btn-pill-best scale-105 shadow-[0_0_24px_rgba(56,189,248,0.9)]'
                : 'bg-gradient-to-r from-[#0ea5e9]/40 to-[#0284c7]/40 border-2 border-[#7dd3fc]/70 text-white hover:scale-105 hover:border-[#7dd3fc]'
              }`}
          >
            <Star className="w-4 h-4 fill-white text-white shrink-0" />
            <span className="text-white drop-shadow-md font-black">BEST OFFERS</span>
          </button>

          {/* CASHBACK Button (Smooth Emerald Green Gradient Texture) */}
          <button
            onClick={() => setActiveFilter('CASHBACK')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none shrink-0 font-chunky-num transition-all duration-300 ${activeFilter === 'CASHBACK'
                ? 'btn-pill-cashback scale-105 shadow-[0_0_24px_rgba(52,211,153,0.9)]'
                : 'bg-gradient-to-r from-[#10b981]/40 to-[#059669]/40 border-2 border-[#34d399]/70 text-white hover:scale-105 hover:border-[#34d399]'
              }`}
          >
            <TrendingUp className="w-4 h-4 text-white shrink-0" />
            <span className="text-white drop-shadow-md font-black">CASHBACK</span>
          </button>

          {/* ALL OFFERS Button (Image 4 Purple/Violet Gradient Texture) */}
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none shrink-0 font-chunky-num transition-all duration-300 ${activeFilter === 'ALL'
                ? 'btn-pill-all scale-105 shadow-[0_0_24px_rgba(168,85,247,0.9)]'
                : 'bg-gradient-to-r from-[#a855f7]/40 to-[#6366f1]/40 border-2 border-[#c084fc]/70 text-white hover:scale-105 hover:border-[#c084fc]'
              }`}
          >
            <Tag className="w-4 h-4 text-white shrink-0" />
            <span className="text-white drop-shadow-md font-black">ALL OFFERS</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted group-hover:text-accent-cyan transition-colors" />
          <input
            type="text"
            placeholder="Search firms or promo codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#12131a] border border-white/15 rounded-full text-xs font-mono font-bold text-white focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Summary Header */}
      <div className="flex items-center justify-between border-b border-white/[0.1] pb-3">
        <h2 className="text-sm font-black text-white uppercase tracking-wider font-chunky-num flex items-center gap-2">
          <span>Active Prop Firm Directories:</span>
          <span className="text-accent-cyan font-chunky-num font-black text-base">{filteredGroups.length} Firms</span>
        </h2>
        {activeFilter !== 'ALL' && (
          <span className="text-xs font-black text-pink-400 font-chunky-num tracking-wide px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/40">
            FILTER: {activeFilter.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Grid: EXACTLY 3 FIRMS PER ROW */}
      {filteredGroups.length === 0 ? (
        <div className="border border-white/10 bg-[#12131a]/60 p-16 text-center rounded-3xl space-y-3">
          <p className="text-white text-lg font-black font-chunky-num">No active offers found for this selection.</p>
          <button
            onClick={() => {
              setActiveFilter('ALL')
              setSearch('')
            }}
            className="btn-pill-all px-6 py-2 mt-2 rounded-full text-xs font-black text-white font-chunky-num hover:scale-105 transition-all"
          >
            Show All Offers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
          {filteredGroups.map(({ firm, mainDeal, additionalDeals, allDeals }) => {
            const isLiked = favoriteFirms.includes(firm.id)
            const isPopping = popHeartId === firm.id
            const likesCount = likesCounts[firm.id] || (firm.review_count ? firm.review_count * 15 + 1200 : 1500)
            const firmRating = firm.rating || 4.7
            const firmSlug = firm.slug || firm.id
            const displayTag =
              mainDeal.tag ||
              (mainDeal.deal_type === 'bogo'
                ? 'BOGO'
                : mainDeal.deal_type === 'best_value'
                  ? 'BEST OFFER'
                  : mainDeal.discount_label || 'SPECIAL OFFER')

            const isExpanded = expandedFirmId === firm.id
            const visibleAdditional = isExpanded ? additionalDeals : additionalDeals.slice(0, 2)
            const remainingCount = additionalDeals.length - 2

            return (
              <div
                key={firm.id}
                className="liquid-glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-start relative group hover:border-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-300 space-y-4"
              >
                {/* 1. TOP: Firm Categories & Heart Like Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {firm.category?.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-wider font-chunky-num text-white"
                      >
                        {cat}
                      </span>
                    ))}
                    {mainDeal.is_featured && (
                      <span className="px-2.5 py-1 rounded-md bg-accent-cyan/20 border border-accent-cyan/50 text-cyan-300 text-[10px] font-black uppercase tracking-wider font-chunky-num shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Bright & Big Animated Like Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(firm.id, e)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer select-none ${isLiked
                        ? 'bg-pink-500/25 border-pink-500/60 text-pink-300 shadow-[0_0_14px_rgba(236,72,153,0.5)] scale-105'
                        : 'bg-[#12131a] border-white/20 text-slate-200 hover:text-pink-400 hover:border-pink-400/50'
                      }`}
                    title={isLiked ? 'Unlike' : 'Like this firm'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${isLiked ? 'fill-[#ff5eb8] text-[#ff5eb8]' : 'text-slate-300'
                        } ${isPopping ? 'animate-heart-pop' : ''}`}
                    />
                    <span className="text-xs font-black font-chunky-num text-white">
                      {formatLikes(likesCount)}
                    </span>
                  </button>
                </div>

                {/* 2. MIDDLE BRANDING: Square Firm Logo (Thin Off-White Frame) + Firm Name + Rating Stars */}
                <div className="text-center space-y-2.5 py-1">
                  <div className="flex justify-center">
                    <div className="p-1 rounded-2xl bg-white/[0.05] border border-slate-200/50 shadow-xl shadow-black/50 inline-flex items-center justify-center">
                      <PropFirmLogo
                        name={firm.name}
                        logoUrl={firm.logo_url}
                        circleCrop={false}
                        frame="offwhite"
                        className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl"
                        imgClassName="max-w-[85%] max-h-[85%] object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/firms/${firmSlug}`}
                      className="text-lg sm:text-xl font-black text-white hover:text-accent-cyan transition-colors block truncate drop-shadow-sm font-chunky-num"
                    >
                      {firm.name}
                    </Link>
                  </div>

                  {/* Rating Stars & Count */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <RatingStars rating={firmRating} />
                    <span className="text-xs sm:text-sm font-black text-white font-chunky-num">{firmRating.toFixed(1)}</span>
                    <span className="text-[11px] text-slate-300 font-bold font-chunky-num">
                      ({firm.review_count || 120} reviews)
                    </span>
                  </div>
                </div>

                {/* 3. MIDDLE PINK BOX: Main Offer + Code + BLUE Admin Tag downside */}
                <div className="bg-gradient-to-b from-pink-500/20 via-[#1f1325] to-[#12131a] border-2 border-pink-500/40 hover:border-pink-500/70 rounded-2xl p-4 text-center space-y-3 shadow-[0_0_24px_rgba(236,72,153,0.15)] relative transition-all">
                  {/* Top discount headline in Pink Box */}
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-[#ff77ce] tracking-tight leading-tight uppercase font-chunky-num drop-shadow-sm">
                      {mainDeal.discount_label || 'EXCLUSIVE OFFER'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-white font-bold leading-relaxed line-clamp-2">
                    {mainDeal.title}
                  </p>

                  {mainDeal.discord_code && (
                    <p className="text-[11px] text-pink-300 font-mono font-bold">
                      💬 {mainDeal.discord_code}
                    </p>
                  )}

                  {/* Promo Code Copy bar inside Pink Box */}
                  <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-[#0e0a16] border border-pink-500/40 rounded-xl shadow-inner">
                    <span className="text-xs sm:text-[13px] font-mono font-black text-white tracking-wider truncate select-all">
                      {mainDeal.code}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(mainDeal.code, e)}
                      className="px-3 py-1 rounded-lg bg-pink-500/30 hover:bg-pink-500/50 text-[10.5px] font-black text-white flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm font-chunky-num"
                    >
                      {copiedCode === mainDeal.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent-green stroke-[3]" />
                          <span className="text-accent-green font-black">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-pink-200" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Downside of the Pink Box: BLUE ADMIN TAG */}
                  <div className="pt-1">
                    <span className="px-4 py-1 rounded-full bg-accent-cyan/20 border-2 border-accent-cyan/70 text-cyan-300 text-[10.5px] sm:text-[11px] font-black uppercase font-chunky-num tracking-wider shadow-[0_0_12px_rgba(34,211,238,0.35)] inline-block">
                      [ {displayTag} ]
                    </span>
                  </div>
                </div>

                {/* 4. UNDER THE PINK BOX: Other Offers list (Bright & Big Colour Boxes, Image 3 Style) */}
                {additionalDeals.length > 0 && (
                  <div className="pt-2 pb-1 space-y-2 border-t border-white/10">
                    <span className="text-[11px] font-black uppercase tracking-wider font-chunky-num text-slate-300 block">
                      OTHER AVAILABLE OFFERS ({allDeals.length} TOTAL):
                    </span>
                    <div className="space-y-2">
                      {visibleAdditional.map((deal) => (
                        <div
                          key={deal.id}
                          onClick={() => handleCopyCode(deal.code)}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#181d30] border-2 border-cyan-500/40 hover:border-cyan-400 hover:bg-[#20263f] hover:shadow-[0_0_14px_rgba(34,211,238,0.3)] transition-all cursor-pointer select-none group/extra shadow-sm"
                          title="Click to copy promo code"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse" />
                            <span className="font-black text-white text-xs sm:text-sm font-chunky-num uppercase tracking-wider truncate">
                              {deal.discount_label || deal.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 font-mono text-xs sm:text-sm font-black text-cyan-300">
                            <span className="tracking-wider">{deal.code}</span>
                            {copiedCode === deal.code ? (
                              <Check className="w-4 h-4 text-accent-green stroke-[3]" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-300 group-hover/extra:text-cyan-300 transition-colors" />
                            )}
                          </div>
                        </div>
                      ))}

                      {remainingCount > 0 && !isExpanded && (
                        <button
                          type="button"
                          onClick={() => setExpandedFirmId(firm.id)}
                          className="text-xs font-black font-chunky-num text-accent-cyan hover:underline pt-1 block cursor-pointer"
                        >
                          +{remainingCount} More Offers
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. BOTTOM CTA: GET OFFER Button -> Routes to /firms/[slug]/offers */}
                <div className="pt-1">
                  <Link
                    href={`/firms/${firmSlug}/offers`}
                    onClick={() => handleTrackDealClick(mainDeal.id)}
                    className="btn-textured-cta w-full py-3.5 px-4 rounded-xl text-black font-black uppercase tracking-wider text-xs sm:text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 active:scale-95 cursor-pointer select-none font-chunky-num"
                  >
                    <span>GET OFFER</span>
                    <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Highlights Banner */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-2.5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 border-2 border-accent-cyan/60 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              <ShieldCheck className="w-5 h-5 text-accent-cyan" />
            </div>
            <h3 className="text-base font-black text-white font-chunky-num">Direct Verified Codes</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-semibold">
            All promo codes and discount rates are verified daily with partner platform managers to prevent expired checkout attempts.
          </p>
        </div>

        <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-2.5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border-2 border-pink-500/60 flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              <BogoSparkleIcon />
            </div>
            <h3 className="text-base font-black text-white font-chunky-num">BOGO & Free Accounts</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-semibold">
            Quickly filter Buy-One-Get-One packages and free account promotions to maximize your capital evaluation opportunities.
          </p>
        </div>

        <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-2.5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-accent-purple/20 border-2 border-accent-purple/60 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)]">
              <Tag className="w-5 h-5 text-accent-purple" />
            </div>
            <h3 className="text-base font-black text-white font-chunky-num">Seamless Checkout Flow</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-semibold">
            Click GET OFFER on any firm to land directly in their Offers section, review all available challenge accounts, and apply codes instantly.
          </p>
        </div>
      </div>
    </div>
  )
}
