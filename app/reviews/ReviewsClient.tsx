'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AFXCard } from '@/components/ui/afx-card'
import {
  Star,
  MessageSquare,
  Check,
  ShieldCheck,
  Heart,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle,
  Edit3
} from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { openAuthModal } from '@/lib/utils/auth-modal'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Firm {
  id: string
  name: string
  slug?: string
  rating?: number
  review_count?: number
  logo_url?: string | null
  likes_count?: number
  category?: string[]
  is_verified?: boolean
  rating_trading_conditions?: number
  rating_customer_care?: number
  rating_user_friendliness?: number
  rating_payout_process?: number
}

interface ReviewsClientProps {
  firms: Firm[]
  initialCategory?: string
}

type SortField =
  | 'rank'
  | 'reviews'
  | 'trading_conditions'
  | 'customer_care'
  | 'user_friendliness'
  | 'payout_process'
  | 'likes'

export default function ReviewsClient({ firms: initialFirms, initialCategory = 'all' }: ReviewsClientProps) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [firmsList, setFirmsList] = useState<Firm[]>(initialFirms)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [filterRating, setFilterRating] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortField>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [minReviews, setMinReviews] = useState<number>(0)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  // Like animations tracking
  const [likedFirms, setLikedFirms] = useState<Record<string, boolean>>({})

  // Review Submission Modal State
  const [selectedFirmForReview, setSelectedFirmForReview] = useState<Firm | null>(null)
  const [pendingFirmAfterAuth, setPendingFirmAfterAuth] = useState<Firm | null>(null)
  const [reviewStep, setReviewStep] = useState<1 | 2 | 3 | 4>(1) // 1: Categories, 2: Overall & Text, 3: Summary, 4: Success
  const [reviewData, setReviewData] = useState({
    trading_conditions: 0,
    customer_care: 0,
    user_friendliness: 0,
    payout_process: 0,
    overall_rating: 5,
    title: '',
    body: '',
  })
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(
      (user: any) => {
        setCurrentUser(user)
        // If user just logged in and had a pending review firm, open the review modal for them
        if (user && pendingFirmAfterAuth) {
          setSelectedFirmForReview(pendingFirmAfterAuth)
          setPendingFirmAfterAuth(null)
        }
      },
      (err: any) => {
        console.warn('Auth state observation note:', err?.message || err)
      }
    )
    return unsub
  }, [pendingFirmAfterAuth])

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedFirmForReview) closeReviewModal()
        if (showVerifyModal) setShowVerifyModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedFirmForReview, showVerifyModal])

  // Handle Like action
  const handleLikeFirm = async (firm: Firm, e: React.MouseEvent) => {
    e.stopPropagation()
    const firmId = firm.id
    if (likedFirms[firmId]) return

    setLikedFirms((prev) => ({ ...prev, [firmId]: true }))
    setFirmsList((prev) =>
      prev.map((f) =>
        f.id === firmId ? { ...f, likes_count: (f.likes_count || 1200) + 1 } : f
      )
    )

    try {
      await fetch(`/api/firms/${firmId}/like`, { method: 'POST' })
    } catch (err) {
      console.warn('Like API call skipped/offline:', err)
    }
  }

  // Handle Give Review Click
  const handleStartReview = (firm: Firm) => {
    if (!currentUser) {
      setPendingFirmAfterAuth(firm)
      openAuthModal('signin')
      return
    }

    setSelectedFirmForReview(firm)
    setReviewStep(1)
    setValidationError(null)
    setReviewData({
      trading_conditions: 0,
      customer_care: 0,
      user_friendliness: 0,
      payout_process: 0,
      overall_rating: 5,
      title: '',
      body: '',
    })
  }

  const closeReviewModal = () => {
    setSelectedFirmForReview(null)
    setReviewStep(1)
    setValidationError(null)
    setSubmitting(false)
  }

  // Multi-step validation & progression
  const handleProceedToStep2 = () => {
    const { trading_conditions, customer_care, user_friendliness, payout_process } = reviewData
    if (!trading_conditions || !customer_care || !user_friendliness || !payout_process) {
      setValidationError('Please rate all 4 categories before proceeding.')
      return
    }
    setValidationError(null)
    setReviewStep(2)
  }

  const handleProceedToStep3 = () => {
    if (!reviewData.overall_rating || reviewData.overall_rating < 1) {
      setValidationError('Please select an overall rating (1-5 stars).')
      return
    }
    if (!reviewData.body.trim()) {
      setValidationError('Please write a few words about your experience.')
      return
    }
    setValidationError(null)
    setReviewStep(3)
  }

  const handleSubmitFinalReview = async () => {
    if (!currentUser || !selectedFirmForReview || submitting) return

    setSubmitting(true)
    setValidationError(null)

    try {
      const payload = {
        user_id: currentUser.uid,
        firm_id: selectedFirmForReview.id,
        full_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Verified Trader',
        rating: reviewData.overall_rating,
        trading_conditions: reviewData.trading_conditions,
        customer_care: reviewData.customer_care,
        user_friendliness: reviewData.user_friendliness,
        payout_process: reviewData.payout_process,
        title: reviewData.title.trim() || 'Trader Experience Review',
        body: reviewData.body.trim(),
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        // Increment local firm review count
        setFirmsList((prev) =>
          prev.map((f) => {
            if (f.id === selectedFirmForReview.id) {
              const currentCount = f.review_count || 0
              const currentRating = f.rating || 4.5
              const newCount = currentCount + 1
              const newRating = Number(((currentRating * currentCount + reviewData.overall_rating) / newCount).toFixed(1))
              return {
                ...f,
                review_count: newCount,
                rating: newRating,
              }
            }
            return f
          })
        )
        setReviewStep(4) // Success step
      } else {
        const errorData = await res.json().catch(() => ({}))
        setValidationError(errorData.error || 'Failed to submit review. Please try again.')
      }
    } catch (err: any) {
      console.error('Submit review error:', err)
      setValidationError('Network error. Please verify connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Helper score color mapper: Green (#00E599) for 4.5+, Yellow (#FBBF24) for 4.0-4.4, Red (#EF4444) for <4.0
  const getScoreBadgeClass = (score: number) => {
    if (score >= 4.5) return 'text-[#00E599] border-white/20 bg-white/[0.04]'
    if (score >= 4.0) return 'text-[#FBBF24] border-white/20 bg-white/[0.04]'
    return 'text-[#EF4444] border-white/20 bg-white/[0.04]'
  }

  const getStarRatingLabel = (score: number) => {
    if (score === 5) return '5.0 - Outstanding'
    if (score === 4) return '4.0 - Great'
    if (score === 3) return '3.0 - Average'
    if (score === 2) return '2.0 - Poor'
    if (score === 1) return '1.0 - Terrible'
    return 'Select rating'
  }

  // Max reviews for proportional density bar calculation
  const maxReviews = useMemo(() => {
    return Math.max(...firmsList.map((f) => f.review_count || 100), 2000)
  }, [firmsList])

  // Total reviews count across all firms
  const totalReviewsCount = useMemo(() => {
    return firmsList.reduce((acc, f) => acc + (f.review_count || 0), 0)
  }, [firmsList])

  // Filter and sort firms
  const filteredFirms = useMemo(() => {
    return firmsList
      .filter((f) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          if (!f.name.toLowerCase().includes(q)) return false
        }

        // Category filter
        if (selectedCategory) {
          const cats = (f.category || ['forex']).map((c: string) => c.toLowerCase().trim())
          if (selectedCategory === 'forex') {
            if (!cats.includes('forex') && !cats.includes('cfd') && cats.length > 0) return false
          } else {
            if (!cats.includes(selectedCategory.toLowerCase())) return false
          }
        }

        // Star rating filter
        if (filterRating !== 'all') {
          const minStar = Number(filterRating)
          if ((f.rating || 4.5) < minStar) return false
        }

        // Min reviews threshold
        if ((f.review_count || 0) < minReviews) return false

        return true
      })
      .sort((a, b) => {
        let valA = 0
        let valB = 0

        switch (sortBy) {
          case 'rank':
            valA = a.rating || 4.5
            valB = b.rating || 4.5
            break
          case 'reviews':
            valA = a.review_count || 0
            valB = b.review_count || 0
            break
          case 'trading_conditions':
            valA = a.rating_trading_conditions ?? a.rating ?? 4.5
            valB = b.rating_trading_conditions ?? b.rating ?? 4.5
            break
          case 'customer_care':
            valA = a.rating_customer_care ?? a.rating ?? 4.5
            valB = b.rating_customer_care ?? b.rating ?? 4.5
            break
          case 'user_friendliness':
            valA = a.rating_user_friendliness ?? a.rating ?? 4.5
            valB = b.rating_user_friendliness ?? b.rating ?? 4.5
            break
          case 'payout_process':
            valA = a.rating_payout_process ?? a.rating ?? 4.5
            valB = b.rating_payout_process ?? b.rating ?? 4.5
            break
          case 'likes':
            valA = a.likes_count || 0
            valB = b.likes_count || 0
            break
        }

        if (sortOrder === 'asc') {
          return valA - valB
        } else {
          return valB - valA
        }
      })
  }, [firmsList, searchQuery, selectedCategory, filterRating, minReviews, sortBy, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Centered Title */}
      <div className="flex flex-col items-center justify-center text-center py-4 gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text-primary afx-gradient-heading text-center">
          Trader Feedback Directory
        </h1>

        {/* Category Switcher Tabs (📈 Forex / CFDs, ⚡ Futures, 🪙 Crypto) */}
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
                onClick={() => setSelectedCategory(cat.id)}
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

      {/* 2. Control Center: Search & Filter Toolbar */}
      <AFXCard className="w-full bg-bg-surface/80 backdrop-blur-xl border border-white/15 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Search */}
          <div className="relative lg:col-span-3">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search prop firm by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-bg-base/90 border border-white/15 rounded-xl text-xs sm:text-sm text-text-primary placeholder-text-muted focus:border-accent-cyan focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3.5 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Star Filter */}
          <div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3.5 py-3 bg-bg-base/90 border border-white/15 rounded-xl text-xs sm:text-sm text-text-primary focus:border-accent-cyan focus:outline-none cursor-pointer font-bold"
            >
              <option value="all">Any Rating</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="w-full px-3.5 py-3 bg-bg-base/90 border border-white/15 rounded-xl text-xs sm:text-sm text-text-primary focus:border-accent-cyan focus:outline-none cursor-pointer font-bold"
            >
              <option value="rank">Sort: Overall Rank</option>
              <option value="reviews">Sort: Most Reviews</option>
              <option value="trading_conditions">Sort: Trading Conditions</option>
              <option value="payout_process">Sort: Payout Process</option>
              <option value="customer_care">Sort: Customer Care</option>
              <option value="likes">Sort: Most Likes</option>
            </select>
          </div>
        </div>

        {/* Min Reviews Slider */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
            <SlidersHorizontal className="w-4 h-4 text-accent-cyan" />
            <span className="font-bold">Minimum Review Count Filter:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-mono font-black text-xs">
              {minReviews === 0 ? 'ALL' : `${minReviews}+ Reviews`}
            </span>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={minReviews}
              onChange={(e) => setMinReviews(Number(e.target.value))}
              className="w-full h-2 bg-[#120F22] rounded-full appearance-none cursor-pointer afx-range-slider"
            />
            <div className="flex justify-between text-[10px] font-bold text-text-muted mt-1 select-none font-mono">
              <span>ALL</span>
              <span>250+</span>
              <span>500+</span>
              <span>750+</span>
              <span>1000+</span>
            </div>
          </div>
        </div>
      </AFXCard>

      {/* 3. Main Directory Table (Desktop Layout >= 1024px) - Stretched Full Width */}
      <div className="hidden lg:block w-full">
        <div className="w-full bg-bg-surface/70 backdrop-blur-2xl border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-white/15 bg-bg-base/80 text-[11px] font-mono font-black text-accent-cyan/90 uppercase tracking-wider select-none">
                  <th
                    onClick={() => toggleSort('rank')}
                    className="py-5 px-6 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>FIRM</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th
                    onClick={() => toggleSort('reviews')}
                    className="py-5 px-6 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>NUMBER OF REVIEWS</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th
                    onClick={() => toggleSort('trading_conditions')}
                    className="py-5 px-4 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>TRADING CONDITIONS</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th
                    onClick={() => toggleSort('customer_care')}
                    className="py-5 px-4 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>CUSTOMER CARE</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th
                    onClick={() => toggleSort('user_friendliness')}
                    className="py-5 px-4 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>USER FRIENDLINESS</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th
                    onClick={() => toggleSort('payout_process')}
                    className="py-5 px-4 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>PAYOUT PROCESS</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th
                    onClick={() => toggleSort('rank')}
                    className="py-5 px-6 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>RANK</span>
                      <span className="text-[10px] opacity-70">↕</span>
                    </div>
                  </th>

                  <th className="py-5 px-6 text-right">
                    <span>ACTIONS</span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/10 text-sm">
                {filteredFirms.length > 0 ? (
                  filteredFirms.map((f) => {
                    const firmSlug = f.slug || f.id
                    const overallRating = f.rating || 4.5
                    const reviewCount = f.review_count || 0
                    const likes = f.likes_count ?? (reviewCount ? reviewCount * 8 + 1240 : 1240)
                    const isLiked = likedFirms[f.id]

                    // Calculate category ratings (with fallback derived from overall rating)
                    const tradingScore = f.rating_trading_conditions ?? Number((overallRating - 0.1).toFixed(1))
                    const customerScore = f.rating_customer_care ?? overallRating
                    const userScore = f.rating_user_friendliness ?? overallRating
                    const payoutScore = f.rating_payout_process ?? Number((overallRating - 0.1).toFixed(1))

                    // Progress bar ratio
                    const densityPct = Math.min(Math.max((reviewCount / maxReviews) * 100, 10), 100)

                    return (
                      <tr
                        key={f.id}
                        className="group hover:bg-white/[0.04] transition-all duration-200"
                      >
                        {/* 1. FIRM COLUMN (Image 1 Style: Square rounded logo + bold name + red/pink heart likes) */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-4">
                            {/* Prominent Square Logo Container */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:border-accent-cyan/50 transition-all">
                              <PropFirmLogo
                                name={f.name}
                                logoUrl={f.logo_url}
                                className="w-full h-full object-contain rounded-xl"
                              />
                            </div>

                            <div className="space-y-1 min-w-0">
                              <Link
                                href={`/firms/${firmSlug}`}
                                className="font-black text-base sm:text-lg text-white hover:text-accent-cyan transition-colors tracking-tight truncate block"
                              >
                                {f.name}
                              </Link>

                              {/* Likes pill with pink/red heart icon (Image 1 style) */}
                              <button
                                onClick={(e) => handleLikeFirm(f, e)}
                                className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#FF2E79] hover:opacity-80 transition-opacity cursor-pointer group/like"
                                title="Like this firm"
                              >
                                <Heart
                                  className={`w-4 h-4 text-[#FF2E79] transition-all ${isLiked ? 'fill-[#FF2E79] scale-110 animate-heart-pop' : 'fill-[#FF2E79]/20 group-hover/like:scale-110 group-hover/like:fill-[#FF2E79]'
                                    }`}
                                />
                                <span className="font-numeric tracking-wide">{likes.toLocaleString()}</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 2. NUMBER OF REVIEWS COLUMN (Only number, bar removed) */}
                        <td className="py-5 px-6 text-center">
                          <span className="font-numeric font-black text-lg sm:text-xl text-white tracking-normal drop-shadow-sm">
                            {reviewCount.toLocaleString()}
                          </span>
                        </td>

                        {/* 3. TRADING CONDITIONS (Pill + Stars underneath) */}
                        <td className="py-5 px-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span
                              className={`inline-flex items-center justify-center min-w-[62px] px-3.5 py-1 rounded-full font-numeric font-black text-sm sm:text-base border ${getScoreBadgeClass(
                                tradingScore
                              )}`}
                            >
                              {tradingScore.toFixed(1)}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.round(tradingScore)
                                      ? (tradingScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                                      : 'text-white/15 fill-transparent'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* 4. CUSTOMER CARE (Pill + Stars underneath) */}
                        <td className="py-5 px-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span
                              className={`inline-flex items-center justify-center min-w-[62px] px-3.5 py-1 rounded-full font-numeric font-black text-sm sm:text-base border ${getScoreBadgeClass(
                                customerScore
                              )}`}
                            >
                              {customerScore.toFixed(1)}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.round(customerScore)
                                      ? (customerScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                                      : 'text-white/15 fill-transparent'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* 5. USER FRIENDLINESS (Pill + Stars underneath) */}
                        <td className="py-5 px-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span
                              className={`inline-flex items-center justify-center min-w-[62px] px-3.5 py-1 rounded-full font-numeric font-black text-sm sm:text-base border ${getScoreBadgeClass(
                                userScore
                              )}`}
                            >
                              {userScore.toFixed(1)}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.round(userScore)
                                      ? (userScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                                      : 'text-white/15 fill-transparent'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* 6. PAYOUT PROCESS (Pill + Stars underneath) */}
                        <td className="py-5 px-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span
                              className={`inline-flex items-center justify-center min-w-[62px] px-3.5 py-1 rounded-full font-numeric font-black text-sm sm:text-base border ${getScoreBadgeClass(
                                payoutScore
                              )}`}
                            >
                              {payoutScore.toFixed(1)}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.round(payoutScore)
                                      ? (payoutScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                                      : 'text-white/15 fill-transparent'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* 7. RANK COLUMN (Image 2 Style: Number pill + Yellow stars below) */}
                        <td className="py-5 px-6 text-center">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span className="min-w-[64px] px-4 py-1 rounded-full font-numeric font-black text-sm sm:text-base text-white bg-white/[0.08] border border-white/20 shadow-inner text-center">
                              {overallRating.toFixed(1)}
                            </span>
                            {/* Yellow Stars (Image 2 Style) */}
                            <div className="flex text-[#FBBF24] gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < Math.round(overallRating)
                                      ? 'fill-[#FBBF24] text-[#FBBF24]'
                                      : 'text-white/20 fill-transparent'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* 8. ACTIONS: VIEW REVIEWS (Blue Image 3 Texture) + GIVE REVIEW (Pink-Cyan Image 4 Texture) */}
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {/* View Reviews Button -> (Image 3 Texture) */}
                            <Link
                              href={`/firms/${firmSlug}/reviews`}
                              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-white bg-[#0066FF] hover:bg-[#0052CC] border border-[#3884FF] shadow-[0_0_15px_rgba(0,102,255,0.45)] hover:shadow-[0_0_22px_rgba(0,102,255,0.7)] transition-all cursor-pointer whitespace-nowrap active:scale-95 uppercase tracking-wider text-center"
                            >
                              View Reviews
                            </Link>

                            {/* Give Review Button -> (Image 4 Texture) */}
                            <button
                              onClick={() => handleStartReview(f)}
                              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#FF1E88] via-[#A855F7] to-[#3B82F6] hover:opacity-95 shadow-[0_0_20px_rgba(255,30,136,0.4)] hover:shadow-[0_0_25px_rgba(255,30,136,0.65)] transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-2 uppercase tracking-wider"
                            >
                              <Edit3 className="w-4 h-4 text-white stroke-[2.5]" />
                              <span>Give Review</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-text-secondary text-base font-bold">
                      No prop firms match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Mobile & Tablet Card Layout (< 1024px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden w-full">
        {filteredFirms.length > 0 ? (
          filteredFirms.map((f) => {
            const firmSlug = f.slug || f.id
            const overallRating = f.rating || 4.5
            const reviewCount = f.review_count || 0
            const likes = f.likes_count ?? (reviewCount ? reviewCount * 8 + 1240 : 1240)
            const isLiked = likedFirms[f.id]

            const tradingScore = f.rating_trading_conditions ?? Number((overallRating - 0.1).toFixed(1))
            const customerScore = f.rating_customer_care ?? overallRating
            const userScore = f.rating_user_friendliness ?? overallRating
            const payoutScore = f.rating_payout_process ?? Number((overallRating - 0.1).toFixed(1))

            return (
              <div
                key={f.id}
                className="bg-bg-surface/80 backdrop-blur-xl border border-white/15 rounded-2xl p-5 space-y-4 shadow-xl hover:border-accent-cyan/40 transition-all"
              >
                {/* Top Card Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-md">
                      <PropFirmLogo name={f.name} logoUrl={f.logo_url} className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/firms/${firmSlug}`}
                        className="font-black text-base sm:text-lg text-white hover:text-accent-cyan truncate block"
                      >
                        {f.name}
                      </Link>
                      <button
                        onClick={(e) => handleLikeFirm(f, e)}
                        className="flex items-center gap-1.5 text-xs font-black text-[#FF2E79] hover:opacity-80 mt-1"
                      >
                        <Heart className={`w-3.5 h-3.5 text-[#FF2E79] ${isLiked ? 'fill-[#FF2E79]' : 'fill-[#FF2E79]/20'}`} />
                        <span className="font-numeric">{likes.toLocaleString()}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rank Badge & Yellow Stars */}
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="px-3.5 py-1 rounded-full font-numeric font-black text-sm text-white bg-white/10 border border-white/20">
                      {overallRating.toFixed(1)}
                    </span>
                    <div className="flex text-[#FBBF24] gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(overallRating) ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-white/20 fill-transparent'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Count (Bar removed) */}
                <div className="flex justify-between items-center bg-bg-base/70 p-3.5 rounded-xl border border-white/10">
                  <span className="text-text-muted font-bold text-xs sm:text-sm">Total Reviews:</span>
                  <span className="font-numeric font-black text-white text-base sm:text-lg">{reviewCount.toLocaleString()}</span>
                </div>

                {/* Category 4-Grid with Stars */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-bg-base/50 border border-white/10 flex flex-col items-center gap-1 text-center">
                    <span className="text-[11px] text-text-muted font-bold uppercase">Trading Conditions</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-numeric font-black text-xs border ${getScoreBadgeClass(tradingScore)}`}>
                      {tradingScore.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.round(tradingScore)
                              ? (tradingScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                              : 'text-white/15 fill-transparent'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-bg-base/50 border border-white/10 flex flex-col items-center gap-1 text-center">
                    <span className="text-[11px] text-text-muted font-bold uppercase">Customer Care</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-numeric font-black text-xs border ${getScoreBadgeClass(customerScore)}`}>
                      {customerScore.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.round(customerScore)
                              ? (customerScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                              : 'text-white/15 fill-transparent'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-bg-base/50 border border-white/10 flex flex-col items-center gap-1 text-center">
                    <span className="text-[11px] text-text-muted font-bold uppercase">User Friendliness</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-numeric font-black text-xs border ${getScoreBadgeClass(userScore)}`}>
                      {userScore.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.round(userScore)
                              ? (userScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                              : 'text-white/15 fill-transparent'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-bg-base/50 border border-white/10 flex flex-col items-center gap-1 text-center">
                    <span className="text-[11px] text-text-muted font-bold uppercase">Payout Process</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-numeric font-black text-xs border ${getScoreBadgeClass(payoutScore)}`}>
                      {payoutScore.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.round(payoutScore)
                              ? (payoutScore >= 4.5 ? 'fill-[#00E599] text-[#00E599]' : 'fill-[#FBBF24] text-[#FBBF24]')
                              : 'text-white/15 fill-transparent'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: View Reviews (Image 3 Texture) + Give Review (Image 4 Texture) */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <Link
                    href={`/firms/${firmSlug}/reviews`}
                    className="w-full py-3 rounded-full text-xs sm:text-sm font-black text-center text-white bg-[#0066FF] hover:bg-[#0052CC] border border-[#3884FF] shadow-[0_0_15px_rgba(0,102,255,0.45)] uppercase tracking-wider"
                  >
                    View Reviews
                  </Link>
                  <button
                    onClick={() => handleStartReview(f)}
                    className="w-full py-3 rounded-full text-xs sm:text-sm font-black text-center text-white bg-gradient-to-r from-[#FF1E88] via-[#A855F7] to-[#3B82F6] hover:opacity-95 shadow-[0_0_20px_rgba(255,30,136,0.4)] flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Edit3 className="w-4 h-4 text-white stroke-[2.5]" />
                    <span>Give Review</span>
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-16 text-center text-text-secondary text-sm">
            No prop firms match the selected filters.
          </div>
        )}
      </div>

      {/* 5. MULTI-STEP REVIEW SUBMISSION MODAL (Liquid Glass) */}
      {selectedFirmForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-6">
            {/* Background Glows */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={closeReviewModal}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Close review modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Selected Firm */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-14 h-14 rounded-xl border border-white/20 bg-white/95 p-1 flex items-center justify-center shrink-0 shadow-md">
                <PropFirmLogo
                  name={selectedFirmForReview.name}
                  logoUrl={selectedFirmForReview.logo_url}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400">
                    Trader Review Submission
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30">
                    Step {reviewStep} of {reviewStep === 4 ? '4' : '3'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                  {selectedFirmForReview.name}
                </h3>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: CATEGORY RATINGS */}
            {reviewStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">1. Rate Required Categories</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Please score all 4 key parameters based on your active challenge and payout experience.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Category 1: Trading Conditions */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Trading Conditions
                      </label>
                      <span className="text-[11px] font-mono font-bold text-accent-cyan">
                        {getStarRatingLabel(reviewData.trading_conditions)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Spreads, slippage, execution speed, server stability.</p>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewData((prev) => ({ ...prev, trading_conditions: s }))}
                          aria-label={`Trading Conditions: ${s} out of 5 stars`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-transform hover:scale-125 ${s <= reviewData.trading_conditions
                                ? 'fill-accent-cyan text-accent-cyan'
                                : 'text-slate-500'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Customer Care */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Customer Care
                      </label>
                      <span className="text-[11px] font-mono font-bold text-pink-400">
                        {getStarRatingLabel(reviewData.customer_care)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Live chat response time, helpfulness, ticket resolution.</p>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewData((prev) => ({ ...prev, customer_care: s }))}
                          aria-label={`Customer Care: ${s} out of 5 stars`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-transform hover:scale-125 ${s <= reviewData.customer_care
                                ? 'fill-pink-400 text-pink-400'
                                : 'text-slate-500'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 3: User Friendliness */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        User Friendliness
                      </label>
                      <span className="text-[11px] font-mono font-bold text-purple-400">
                        {getStarRatingLabel(reviewData.user_friendliness)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Dashboard clarity, rule tracking, account onboarding.</p>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewData((prev) => ({ ...prev, user_friendliness: s }))}
                          aria-label={`User Friendliness: ${s} out of 5 stars`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-transform hover:scale-125 ${s <= reviewData.user_friendliness
                                ? 'fill-purple-400 text-purple-400'
                                : 'text-slate-500'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 4: Payout Process */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Payout Process
                      </label>
                      <span className="text-[11px] font-mono font-bold text-[#10B981]">
                        {getStarRatingLabel(reviewData.payout_process)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Speed of approval, payment methods (Crypto/Bank), reliability.</p>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewData((prev) => ({ ...prev, payout_process: s }))}
                          aria-label={`Payout Process: ${s} out of 5 stars`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-transform hover:scale-125 ${s <= reviewData.payout_process
                                ? 'fill-[#10B981] text-[#10B981]'
                                : 'text-slate-500'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500 font-extrabold text-sm text-slate-950 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
                >
                  <span>Next: Overall Score & Review Text</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: OVERALL RATING + WRITTEN REVIEW */}
            {reviewStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">2. Overall Rating & Your Review</h4>
                  <p className="text-xs text-slate-300">
                    Provide your final overall verdict and write an authentic review for fellow traders.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Overall Star Rating */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Overall Rating (1 - 5 Stars)
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewData((prev) => ({ ...prev, overall_rating: s }))}
                          aria-label={`Overall Rating: ${s} out of 5 stars`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 transition-transform hover:scale-125 ${s <= reviewData.overall_rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-500'
                              }`}
                          />
                        </button>
                      ))}
                      <span className="font-mono font-bold text-sm text-yellow-400 ml-2">
                        {reviewData.overall_rating}.0 ★
                      </span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">Review Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Fastest payout clearance & smooth MT5 execution"
                      value={reviewData.title}
                      onChange={(e) => setReviewData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 text-xs focus:border-accent-cyan focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Review Body */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">Written Review Text</label>
                    <textarea
                      rows={4}
                      placeholder="Share your experience with this prop firm... e.g. evaluation rules, slippage during news, dashboard responsiveness, and payout approval time."
                      value={reviewData.body}
                      onChange={(e) => setReviewData((prev) => ({ ...prev, body: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 text-xs focus:border-accent-cyan focus:outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewStep(1)}
                    className="w-1/3 py-3 rounded-2xl border border-white/20 bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500 font-extrabold text-sm text-slate-950 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  >
                    <span>Preview & Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW SUMMARY & SUBMIT */}
            {reviewStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">3. Review Summary & Confirmation</h4>
                  <p className="text-xs text-slate-300">
                    Verify your review details below. Upon clicking submit, your review will be published publicly.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/15 space-y-4 text-xs">
                  {/* Category Breakdown */}
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Trading Conditions:</span>
                      <span className="font-mono font-bold text-accent-cyan">{reviewData.trading_conditions}.0 ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Customer Care:</span>
                      <span className="font-mono font-bold text-pink-400">{reviewData.customer_care}.0 ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">User Friendliness:</span>
                      <span className="font-mono font-bold text-purple-400">{reviewData.user_friendliness}.0 ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payout Process:</span>
                      <span className="font-mono font-bold text-[#10B981]">{reviewData.payout_process}.0 ★</span>
                    </div>
                  </div>

                  {/* Overall Rating & Review Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Overall Rating:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-yellow-400">
                        <span>{reviewData.overall_rating}.0</span>
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      </div>
                    </div>

                    <h5 className="font-bold text-white text-sm">
                      {reviewData.title || 'Trader Experience Review'}
                    </h5>
                    <p className="text-slate-300 leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/5">
                      "{reviewData.body}"
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-accent-cyan font-mono pt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Submitting as: {currentUser?.displayName || currentUser?.email || 'Verified Trader'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setReviewStep(2)}
                    className="w-1/3 py-3.5 rounded-2xl border border-white/20 bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                  >
                    ← Edit
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitFinalReview}
                    className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500 font-extrabold text-sm text-slate-950 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Publish Review Publicly</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION */}
            {reviewStep === 4 && (
              <div className="py-6 text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-accent-green/20 border border-accent-green/40 flex items-center justify-center mx-auto text-accent-green shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-2xl font-extrabold text-white">Review Published!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for contributing to EMPIRIAL. Your review for <strong className="text-white">{selectedFirmForReview.name}</strong> is now publicly visible in the firm's reviews directory.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href={`/firms/${selectedFirmForReview.slug || selectedFirmForReview.id}/reviews`}
                    onClick={closeReviewModal}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple font-bold text-xs text-slate-950 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span>View on Firm Reviews Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={closeReviewModal}
                    className="px-6 py-3 rounded-2xl border border-white/20 bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Close Directory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. HOW WE VERIFY & RANK FIRMS MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-6">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">How We Verify & Rank Prop Firms</h3>
                <p className="text-xs text-slate-400">EMPIRIAL Community Audit Standard</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <h4 className="font-bold text-accent-cyan text-sm">1. Multi-Criteria Scoring</h4>
                <p>
                  We evaluate prop firms across 4 distinct operational vectors: Trading Conditions (spreads & slippage), Customer Care, User Friendliness, and Payout Process.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <h4 className="font-bold text-pink-400 text-sm">2. Anti-Bot & Verified Trader Checks</h4>
                <p>
                  Reviews require authenticated trader accounts. Submissions undergo algorithmic anomaly detection to eliminate duplicate or paid fake testimonials.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <h4 className="font-bold text-purple-400 text-sm">3. Dynamic Community Weighting</h4>
                <p>
                  Rankings are computed with weighted Bayesian algorithms that factor in both the overall score and the density of verified trader reviews.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-3 rounded-2xl bg-white/10 border border-white/20 font-bold text-xs text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
