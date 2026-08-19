'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  circle_crop_logo?: boolean
  likes_count?: number
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
  category?: string
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
  category = 'forex',
}: ChallengesClientProps) {
  const router = useRouter()
  const [favoriteFirms, setFavoriteFirms] = useState<string[]>([])
  const [localFirms, setLocalFirms] = useState(firms)

  useEffect(() => {
    setLocalFirms(firms)
  }, [firms])

  // Dynamically build most popular prop firms sorted by likes_count or rating
  const popularFirmsList = React.useMemo(() => {
    const all = localFirms
      .map((f) => {
        const deal = deals.find((d) => d.firm_id === f.id && d.status === 'active')
        const estYear = 2026 - (f.years_active || 5)
        const payoutCalculated = f.likes_count ? `$${(f.likes_count * 0.15 + 8).toFixed(0)}M+` : '$12M+'
        const allocCalculated = f.max_allocation 
          ? (f.max_allocation >= 1000000 ? `$${(f.max_allocation / 1000000).toFixed(1)}M` : `$${(f.max_allocation / 1000).toFixed(0)}K`)
          : '$400K'

        return {
          name: f.name,
          rating: f.rating ? f.rating.toFixed(1) : '4.5',
          likes_count: f.likes_count || 0,
          discount: deal?.discount_label || 'Special Offers',
          code: deal?.code || 'ACTIVE',
          ctaText: f.cta_text || 'Visit Review',
          logo: f.logo_url,
          firmSlug: f.slug,
          established: estYear,
          totalPayout: (f as any).payout_custom || payoutCalculated,
          maxAllocation: (f as any).allocation_custom || allocCalculated,
          profitSplit: (f as any).profit_split_custom || 'Up to 90%',
          badgeCustom: (f as any).badge_custom || '',
          platformCustom: (f as any).platform_custom || '',
          is_popular: !!(f as any).is_popular,
        }
      })

    const marked = all.filter(f => f.is_popular)
    if (marked.length > 0) {
      return marked.sort((a, b) => b.likes_count - a.likes_count)
    }
    return all.sort((a, b) => b.likes_count - a.likes_count || parseFloat(b.rating) - parseFloat(a.rating))
  }, [localFirms, deals])

  // Dynamically build top 3 most popular challenges based on firm popularity (likes_count)
  const popularChallengesList = React.useMemo(() => {
    const all = initialChallenges
      .map((c) => {
        const firm = localFirms.find((f) => f.id === c.firm_id)
        if (!firm) return null
        const deal = deals.find((d) => d.id === c.deal_id && d.status === 'active')
        return {
          id: c.id,
          name: `${firm.name} $${c.account_size >= 1000 ? `${(c.account_size / 1000).toFixed(0)}K` : c.account_size}`,
          rating: firm.rating ? firm.rating.toFixed(1) : '4.5',
          discount: deal?.discount_label || 'Promo Active',
          code: (c as any).coupon_code || deal?.code || 'ACTIVE',
          logo: c.logo_url || firm.logo_url,
          likes_count: firm.likes_count || 0,
          is_popular: !!(c as any).is_popular,
          firmSlug: firm.slug,
          buyUrl: c.affiliate_url || firm.affiliate_url || '#',
        }
      })
      .filter(Boolean) as any[]

    const marked = all.filter(c => c.is_popular)
    const listToUse = marked.length > 0 ? marked : all

    return listToUse
      .sort((a, b) => b.likes_count - a.likes_count)
      .slice(0, 3)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
  }, [initialChallenges, localFirms, deals])

  // Auto-swipe page carousel state for popular firms
  const [activePromoPage, setActivePromoPage] = useState(0)
  const promoItemsPerPage = 3
  const totalPromoPages = Math.max(1, Math.ceil(popularFirmsList.length / promoItemsPerPage))

  useEffect(() => {
    if (totalPromoPages <= 1) return
    const timer = setInterval(() => {
      setActivePromoPage((prev) => (prev + 1) % totalPromoPages)
    }, 4000) // Advances every 4 seconds
    return () => clearInterval(timer)
  }, [totalPromoPages])

  const visiblePromoOffers = React.useMemo(() => {
    if (popularFirmsList.length === 0) return []
    const startIdx = activePromoPage * promoItemsPerPage
    return popularFirmsList.slice(startIdx, startIdx + promoItemsPerPage)
  }, [popularFirmsList, activePromoPage])

  // Dynamically extract unique sizes from the full initial challenges list
  const uniqueSizes = Array.from(
    new Set(initialChallenges.map((c) => c.account_size))
  ).sort((a, b) => a - b)

  // Filters & State
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [filterFirm, setFilterFirm] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState<number[]>([])
  const [selectedSteps, setSelectedSteps] = useState<number[]>([])
  const [customSizeActive, setCustomSizeActive] = useState(false)
  const [customMinSize, setCustomMinSize] = useState('')
  const [customMaxSize, setCustomMaxSize] = useState('')
  const [openDropdown, setOpenDropdown] = useState<'size' | 'steps' | null>(null)
  const [filterMaxPrice, setFilterMaxPrice] = useState('')

  // Toggles
  const [applyDiscount, setApplyDiscount] = useState(true)
  const [sortByPopularity, setSortByPopularity] = useState(true)
  const [viewMode, setViewMode] = useState<'all' | 'bookmarks' | 'best_selling'>('all')

  // Sortable headers state
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Buy Code Modal State
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getSizeLabel = () => {
    if (customSizeActive && (customMinSize !== '' || customMaxSize !== '')) {
      if (customMinSize !== '' && customMaxSize !== '') {
        return `Size: $${(Number(customMinSize)/1000).toFixed(0)}K-$${(Number(customMaxSize)/1000).toFixed(0)}K`
      } else if (customMinSize !== '') {
        return `Size: >$${(Number(customMinSize)/1000).toFixed(0)}K`
      } else {
        return `Size: <$${(Number(customMaxSize)/1000).toFixed(0)}K`
      }
    }
    if (selectedSizes.length === 0) return 'Size: All'
    const labels = selectedSizes
      .sort((a, b) => a - b)
      .map((s) => `$${s >= 1000 ? `${(s / 1000).toFixed(0)}K` : s}`)
    if (labels.length <= 2) return `Size: ${labels.join(', ')}`
    return `Size: ${labels.length} Selected`
  }

  const getStepsLabel = () => {
    if (selectedSteps.length === 0) return 'Steps: All'
    const labels = selectedSteps
      .sort((a, b) => a - b)
      .map((st) => st === 0 ? 'Instant' : st === 1 ? '1 Step' : `${st} Steps`)
    if (labels.length <= 2) return `Steps: ${labels.join(', ')}`
    return `Steps: ${labels.length} Selected`
  }

  // Reset pagination to first page when search/filter criteria change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterFirm, filterCategory, selectedSizes, selectedSteps, customSizeActive, customMinSize, customMaxSize, filterMaxPrice, viewMode, sortByPopularity, applyDiscount])

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

  const handleToggleBookmark = async (firmId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isAdding = !favoriteFirms.includes(firmId)
    const updated = isAdding
      ? [...favoriteFirms, firmId]
      : favoriteFirms.filter((id) => id !== firmId)
    setFavoriteFirms(updated)
    localStorage.setItem('afx_favorites', JSON.stringify(updated))
    setOpenDropdown(null)

    // Update local state immediately for instant feedback
    setLocalFirms((prev) =>
      prev.map((f) => {
        if (f.id === firmId) {
          const currentLikes = f.likes_count || 0
          return {
            ...f,
            likes_count: isAdding ? currentLikes + 1 : Math.max(0, currentLikes - 1),
          }
        }
        return f
      })
    )

    // Increment count on database
    try {
      await fetch(`/api/firms/${firmId}/like`, { method: 'POST' })
    } catch (err) {
      console.error('Error ticking like counter:', err)
    }
  }

  const getFirm = (firmId: string) => {
    return localFirms.find((f) => f.id === firmId)
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
    setCopiedCode(code)
    setCopied(true)
    setTimeout(() => {
      setCopiedCode(null)
      setCopied(false)
    }, 2000)
  }

  // Filter & Sort Pipeline
  let challenges = [...initialChallenges]

  if (search) {
    challenges = challenges.filter((c) => {
      const f = getFirm(c.firm_id)
      return f?.name.toLowerCase().includes(search.toLowerCase())
    })
  }

  if (viewMode === 'bookmarks') {
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

  if (selectedSteps.length > 0) {
    challenges = challenges.filter((c) => selectedSteps.includes(c.steps))
  }

  if (selectedSizes.length > 0 || (customSizeActive && (customMinSize !== '' || customMaxSize !== ''))) {
    challenges = challenges.filter((c) => {
      const size = c.account_size

      // Match custom range if active
      if (customSizeActive && (customMinSize !== '' || customMaxSize !== '')) {
        const minVal = customMinSize !== '' ? Number(customMinSize) : 0
        const maxVal = customMaxSize !== '' ? Number(customMaxSize) : Infinity
        if (size >= minVal && size <= maxVal) {
          return true
        }
      }

      // Match standard selections
      if (selectedSizes.includes(size)) {
        return true
      }

      return false
    })
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
  } else if (viewMode === 'best_selling') {
    challenges.sort((a, b) => b.popularity_score - a.popularity_score)
  } else if (sortByPopularity) {
    challenges.sort((a, b) => {
      const firmA = getFirm(a.firm_id)
      const firmB = getFirm(b.firm_id)
      const likesA = firmA ? (firmA.likes_count ?? (firmA.review_count * 8 + 1240)) : 0
      const likesB = firmB ? (firmB.likes_count ?? (firmB.review_count * 8 + 1240)) : 0
      return likesB - likesA
    })
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
                className={`w-[3px] h-full rounded-[1px] transition-colors duration-300 ${isFilled ? 'bg-gradient-to-t from-accent-cyan to-accent-purple' : 'bg-border-subtle/30'
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

        {/* Left Side: Popular Prop Firms */}
        <div className="lg:col-span-8 bg-bg-surface/30 border border-border-subtle/70 rounded-3xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-text-primary flex items-center gap-2 uppercase tracking-wide">
              Most Popular Prop Firms 🔥
            </h2>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPromoPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePromoPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${idx === activePromoPage ? 'bg-accent-cyan scale-125' : 'bg-border-subtle hover:bg-text-secondary'
                    }`}
                  title={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div key={activePromoPage} className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            {visiblePromoOffers.length === 0 ? (
              <div className="col-span-3 text-center py-6 text-xs text-text-muted">
                No popular firms found.
              </div>
            ) : (
              visiblePromoOffers.map((item) => {
                return (
                  <div
                    key={item.name}
                    onClick={() => {
                      router.push(`/firms/${item.firmSlug}`)
                    }}
                    className="group p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-accent-cyan/40 shadow-xl transition-all duration-300 rounded-3xl flex flex-col gap-4 relative backdrop-blur-lg min-h-[300px] cursor-pointer"
                  >
                    {/* Header Row: Logo & Name + Custom Badge */}
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-3">
                        <PropFirmLogo name={item.name} logoUrl={item.logo} className="w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110" />
                        <div className="text-left">
                          <h3 className="text-sm sm:text-base font-black text-text-primary line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="text-[#00b67a] text-xs">★</span>
                            ))}
                            <span className="text-[10px] font-black text-text-secondary ml-1">({item.rating})</span>
                          </div>
                        </div>
                      </div>

                      {/* Top Right Custom Badge */}
                      {item.badgeCustom ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#00b67a] text-[9px] font-black uppercase tracking-wider">
                          {item.badgeCustom}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00b67a]/10 border border-[#00b67a]/20 text-[#00b67a] text-[9px] font-black uppercase tracking-wider">
                          ⚡ High Rating
                        </span>
                      )}
                    </div>

                    {/* Sub-header row: Platform and Coupon badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-text-secondary">
                        📈 {item.platformCustom || 'MT5'}
                      </span>
                      {(item.discount || item.code) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400">
                          🏷️ {item.discount}: {item.code}
                        </span>
                      )}
                    </div>

                    {/* Metrics row: PAYOUT, ALLOCATION, PROFIT SPLIT (Large Fonts) */}
                    <div className="grid grid-cols-3 gap-2 w-full border-t border-b border-white/5 py-4 my-1 text-left">
                      <div>
                        <span className="block text-[9px] text-text-muted font-bold uppercase tracking-wider mb-1">Payout</span>
                        <span className="text-sm sm:text-base font-black text-text-primary font-mono">{item.totalPayout}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-text-muted font-bold uppercase tracking-wider mb-1">Allocation</span>
                        <span className="text-sm sm:text-base font-black text-text-primary font-mono">{item.maxAllocation}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-text-muted font-bold uppercase tracking-wider mb-1">Profit Split</span>
                        <span className="text-sm sm:text-base font-black text-[#00b67a] font-mono">{item.profitSplit}</span>
                      </div>
                    </div>

                    {/* Bottom: Custom CTA Button */}
                    <div className="w-full mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/firms/${item.firmSlug}`)
                        }}
                        className="w-full py-2.5 text-center rounded-xl bg-accent-cyan text-black hover:bg-accent-cyan/90 text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.25)] select-none"
                      >
                        {item.ctaText}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Popular Challenges */}
        <div className="lg:col-span-4 bg-bg-surface/30 border border-border-subtle/70 rounded-3xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-sm font-black text-text-primary flex items-center gap-2 mb-4 uppercase tracking-wide">
            Most Popular Challenges 🏆
          </h2>

          <div className="space-y-2">
            {popularChallengesList.length === 0 ? (
              <div className="text-center py-6 text-xs text-text-muted">
                No popular challenges found.
              </div>
            ) : (
              popularChallengesList.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      router.push(`/firms/${item.firmSlug}`)
                    }}
                    className="group p-3.5 bg-bg-surface/60 border border-border-subtle hover:border-accent-purple/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 rounded-2xl flex items-center justify-between gap-3.5 relative backdrop-blur-md animate-fade-in cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.rank === 1 ? (
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : item.rank === 2 ? (
                        <Trophy className="w-4 h-4 text-slate-300 shrink-0" />
                      ) : (
                        <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                      )}

                      <PropFirmLogo name={item.name} logoUrl={item.logo} className="w-9 h-9 rounded-lg transition-all duration-300 group-hover:scale-110" />

                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-black text-text-primary truncate">{item.name}</h3>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-[#00b67a] text-[10px]">★</span>
                          ))}
                          <span className="text-[9px] font-black text-text-muted ml-1">({item.rating})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Pink/Purple double-box code copy container */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyCode(item.code)
                        }}
                        className="flex flex-col items-center bg-gradient-to-r from-[#d946ef] to-[#a855f7] px-2.5 py-1.5 rounded-xl border border-white/10 select-none shrink-0 w-24 sm:w-[110px] text-center gap-0.5 shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                        title="Click to copy coupon code"
                      >
                        <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-wider leading-none">
                          {item.discount}
                        </span>
                        <div className="w-full flex items-center justify-between bg-black/80 px-2 py-1.5 rounded-lg text-[9.5px] sm:text-[10px] font-black text-white font-mono leading-none mt-1">
                          <span className="truncate max-w-[65px]">{copiedCode === item.code ? 'DONE' : item.code}</span>
                          <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d946ef] shrink-0 ml-1" />
                        </div>
                      </button>

                      {/* Larger BUY Button */}
                      <a
                        href={item.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="inline-flex items-center justify-center text-xs sm:text-sm font-black text-black bg-accent-cyan hover:bg-accent-cyan/80 px-4 py-3 rounded-xl transition-all active:scale-95 shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                      >
                        BUY
                      </a>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      {/* 3. Refactored Toolbar Filters row - Matches screenshot filters exactly */}
      <div className="relative z-30 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-bg-surface/50 border border-border-subtle/50 p-4 rounded-3xl backdrop-blur-sm shadow-xl">
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
              value={category}
              disabled
              className="appearance-none bg-bg-base/70 border border-border-subtle rounded-full pl-4 pr-9 py-2.5 text-xs font-black text-text-muted cursor-not-allowed outline-none shadow-sm"
            >
              {category === 'forex' && <option value="forex">Assets: FX</option>}
              {category === 'futures' && <option value="futures">Assets: Futures</option>}
              {category === 'crypto' && <option value="crypto">Assets: Crypto</option>}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-3 h-3 text-text-muted pointer-events-none" />
          </div>

          {/* Quick Dropdown: Size */}
          <div className="relative shrink-0">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border-subtle bg-bg-base text-xs font-black text-text-secondary hover:text-text-primary hover:border-accent-cyan/80 transition-all shadow-sm cursor-pointer select-none"
            >
              <span>{getSizeLabel()}</span>
              <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${openDropdown === 'size' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'size' && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#120F22] border border-[#2A3348] rounded-3xl p-5 shadow-2xl z-50 animate-fade-in">
                  <h4 className="text-[10px] font-black text-text-primary uppercase tracking-wider mb-4">Select one or multiple options</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '$5K', value: 5000 },
                      { label: '$10K', value: 10000 },
                      { label: '$25K', value: 25000 },
                      { label: '$50K', value: 50000 },
                      { label: '$100K', value: 100000 },
                      { label: '$200K', value: 200000 },
                      { label: '$300K', value: 300000 },
                      { label: '$500K', value: 500000 },
                    ].map((opt) => {
                      const isSelected = selectedSizes.includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedSizes((prev) =>
                              prev.includes(opt.value)
                                ? prev.filter((v) => v !== opt.value)
                                : [...prev, opt.value]
                            )
                          }}
                          className={`py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border-accent-cyan text-text-primary shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                              : 'bg-bg-base/50 border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-secondary/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setCustomSizeActive(!customSizeActive)}
                    className={`w-full mt-4 py-2 rounded-full text-xs font-black transition-all border cursor-pointer ${
                      customSizeActive
                        ? 'bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border-accent-cyan text-text-primary shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                        : 'bg-bg-base/50 border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-secondary/30'
                    }`}
                  >
                    Custom
                  </button>
                  {customSizeActive && (
                    <div className="mt-3 flex gap-2 animate-fade-in">
                      <input
                        type="number"
                        placeholder="Min ($)"
                        value={customMinSize}
                        onChange={(e) => setCustomMinSize(e.target.value)}
                        className="w-1/2 px-3 py-2 bg-bg-base border border-[#2A3348] rounded-xl text-[10px] font-bold text-text-primary outline-none focus:border-accent-cyan"
                      />
                      <input
                        type="number"
                        placeholder="Max ($)"
                        value={customMaxSize}
                        onChange={(e) => setCustomMaxSize(e.target.value)}
                        className="w-1/2 px-3 py-2 bg-bg-base border border-[#2A3348] rounded-xl text-[10px] font-bold text-text-primary outline-none focus:border-accent-cyan"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick Dropdown: Steps */}
          <div className="relative shrink-0">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'steps' ? null : 'steps')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border-subtle bg-bg-base text-xs font-black text-text-secondary hover:text-text-primary hover:border-accent-cyan/80 transition-all shadow-sm cursor-pointer select-none"
            >
              <span>{getStepsLabel()}</span>
              <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${openDropdown === 'steps' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'steps' && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#120F22] border border-[#2A3348] rounded-3xl p-5 shadow-2xl z-50 animate-fade-in">
                  <h4 className="text-[10px] font-black text-text-primary uppercase tracking-wider mb-4">Select one or multiple options</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Instant', value: 0 },
                      { label: '1 Step', value: 1 },
                      { label: '2 Steps', value: 2 },
                      { label: '3 Steps', value: 3 },
                    ].map((opt) => {
                      const isSelected = selectedSteps.includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedSteps((prev) =>
                              prev.includes(opt.value)
                                ? prev.filter((v) => v !== opt.value)
                                : [...prev, opt.value]
                            )
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-black tracking-wider transition-all border text-center cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border-accent-cyan text-text-primary shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                              : 'bg-bg-base/50 border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-secondary/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

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

          {/* View Mode button pills */}
          <button
            onClick={() => { setViewMode('all'); setCurrentPage(1); setOpenDropdown(null); }}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border cursor-pointer shrink-0 hover:scale-105 active:scale-95 duration-200 ${viewMode === 'all'
              ? 'bg-bg-base text-accent-cyan border-accent-cyan/40 shadow-md shadow-accent-cyan/5'
              : 'text-text-secondary border-border-subtle bg-transparent hover:text-text-primary'
              }`}
          >
            All
          </button>
          <button
            onClick={() => { setViewMode('bookmarks'); setCurrentPage(1); setOpenDropdown(null); }}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95 duration-200 ${viewMode === 'bookmarks'
              ? 'bg-bg-base text-accent-cyan border-accent-cyan/40 shadow-md shadow-accent-cyan/5'
              : 'text-text-secondary border-border-subtle bg-transparent hover:text-text-primary'
              }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-accent-cyan fill-accent-cyan" />
            Bookmarks
          </button>
          <button
            onClick={() => { setViewMode('best_selling'); setCurrentPage(1); setOpenDropdown(null); }}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95 duration-200 ${viewMode === 'best_selling'
              ? 'bg-bg-base text-[#EC4899] border-[#EC4899]/40 shadow-md shadow-[#EC4899]/5'
              : 'text-text-secondary border-border-subtle bg-transparent hover:text-text-primary'
              }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#EC4899] fill-[#EC4899]/20 animate-pulse" />
            Best Selling
          </button>
        </div>

        <div className="flex items-center gap-2 self-stretch xl:self-auto justify-between xl:justify-end">
          {/* Search prop challenges input */}
          <div className="relative flex-1 xl:flex-initial xl:w-44 group">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-text-muted group-hover:text-accent-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); setOpenDropdown(null); }}
              onFocus={() => setOpenDropdown(null)}
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

          <div className="space-y-1.5 col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Max Price</label>
              <span className="text-[10px] font-black text-accent-cyan font-mono bg-accent-cyan/10 px-2 py-0.5 rounded-lg border border-accent-cyan/20">
                {filterMaxPrice === '' || Number(filterMaxPrice) >= 2000 ? 'All' : `$${filterMaxPrice}`}
              </span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={filterMaxPrice === '' ? 2000 : filterMaxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setFilterMaxPrice(val >= 2000 ? '' : String(val))
                }}
                className="w-full h-1.5 bg-[#120F22] rounded-full appearance-none cursor-pointer afx-range-slider"
              />
              <div className="flex justify-between text-[8px] font-bold text-text-muted mt-1 select-none font-mono">
                <span>$0</span>
                <span>$500</span>
                <span>$1000</span>
                <span>$1500</span>
                <span>$2000+</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenges Count & Verify Info */}
      <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
        <h3 className="text-sm font-black text-text-primary">
          Challenges <span className="text-accent-cyan font-mono">{challenges.length}</span>
        </h3>
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
                  <th className="px-3 py-3 text-center font-black w-[100px]">Profit Split</th>
                  <th className="px-3 py-3 text-center font-black w-[120px]">Payout Cycle</th>
                  <th className="px-3 py-3 text-center font-black w-[100px]">Price</th>
                  <th className="px-3 py-3 text-center font-black w-[110px]">Promo Code</th>
                  <th className="px-3 py-3 text-right font-black w-[95px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/30">
                {paginatedChallenges.map((ch, idx) => {
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
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx
                  const logoFrame = globalIdx === 0 ? 'gold' : globalIdx === 1 ? 'silver' : globalIdx === 2 ? 'bronze' : 'offwhite'

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

                          {/* Rank Badge */}
                          <div className="w-5 flex items-center justify-center shrink-0">
                            {globalIdx === 0 ? (
                              <Trophy className="w-4 h-4 text-amber-400" />
                            ) : globalIdx === 1 ? (
                              <Trophy className="w-4 h-4 text-slate-300" />
                            ) : globalIdx === 2 ? (
                              <Trophy className="w-4 h-4 text-amber-600" />
                            ) : (
                              <span className="w-4 h-4 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-[9px] font-bold text-text-muted font-mono">
                                {globalIdx + 1}
                              </span>
                            )}
                          </div>

                          {/* Logo with gold tier badge overlap */}
                          <div className="relative shrink-0 transition-all duration-300 group-hover:scale-110">
                            <PropFirmLogo name={firm?.name || 'Challenge'} logoUrl={ch.logo_url || firm?.logo_url || null} circleCrop={false} frame={logoFrame} className="w-12 h-12 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
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
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[12px] bg-[#00b67a]/15 text-[#00b67a] px-1.5 py-0.5 rounded font-black">
                                {firm?.rating.toFixed(1) || '4.5'}
                              </span>
                              <span className="text-[#00b67a] text-[12px] tracking-tighter font-bold">★★★★★</span>
                              <span className="text-[10px] text-text-muted font-bold truncate">
                                ({firm?.review_count || '120'} reviews)
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

                      {/* 9. Profit Split column with bars */}
                      <td className="px-3 py-3 text-center align-middle">
                        <div className="inline-flex justify-center">
                          <ProfitSplitBar pct={ch.profit_split_pct} />
                        </div>
                      </td>

                      {/* Payout Cycle column */}
                      <td className="px-3 py-3 text-center align-middle text-sm font-black text-text-primary">
                        {ch.payout_freq || 'Bi-weekly'}
                      </td>

                      {/* 12. Price column */}
                      <td className="px-3 py-3 text-center align-middle font-mono">
                        {isDiscounted ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="text-accent-cyan text-[16px] font-black">
                              {ch.currency === 'EUR' || ch.currency === 'eur' ? '€' : ch.currency === 'GBP' || ch.currency === 'gbp' ? '£' : '$'}
                              {displayPrice.toFixed(2)}
                            </span>
                            <span className="line-through text-text-muted text-[11px] font-bold">
                              {ch.currency === 'EUR' || ch.currency === 'eur' ? '€' : ch.currency === 'GBP' || ch.currency === 'gbp' ? '£' : '$'}
                              {originalPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="text-[16px] font-black text-text-primary">
                              {ch.currency === 'EUR' || ch.currency === 'eur' ? '€' : ch.currency === 'GBP' || ch.currency === 'gbp' ? '£' : '$'}
                              {ch.price.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Promo Code column */}
                      <td className="px-3 py-3 text-center align-middle">
                        {(ch.coupon_code || deal?.code) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyCode(ch.coupon_code || deal?.code || '')
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-bg-base hover:bg-bg-surface border border-border-subtle/80 text-xs font-mono font-bold text-accent-cyan flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer mx-auto select-none"
                             title="Click to copy coupon code"
                          >
                            <span>{copiedCode === (ch.coupon_code || deal?.code) ? 'COPIED!' : (ch.coupon_code || deal?.code)}</span>
                          </button>
                        ) : (
                          <span className="text-text-muted text-xs font-bold">—</span>
                        )}
                      </td>

                      {/* 13. Buy Action column */}
                      <td className="px-3 py-3 text-right align-middle">
                        <button
                          onClick={() => handleBuyClick(ch)}
                          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple text-xs font-black text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-accent-cyan/10 hover:shadow-lg hover:shadow-accent-cyan/20 cursor-pointer whitespace-nowrap"
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
