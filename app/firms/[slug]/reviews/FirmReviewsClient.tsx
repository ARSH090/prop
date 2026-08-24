'use client'

import React, { useState, useEffect } from 'react'
import { Star, MessageSquare, ShieldCheck, Check, ArrowRight, X, AlertCircle, CheckCircle2, ThumbsUp, Edit3 } from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { openAuthModal } from '@/lib/utils/auth-modal'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Review {
  id: string
  firm_id: string
  rating?: number
  trading_conditions?: number
  customer_care?: number
  user_friendliness?: number
  payout_process?: number
  title?: string
  body?: string
  comment?: string
  full_name?: string
  user_name?: string
  is_verified_trader?: boolean
  upvotes?: number
  created_at?: any
}

interface FirmReviewsClientProps {
  firm: {
    id: string
    name: string
    slug?: string
    logo_url?: string | null
    rating?: number
    review_count?: number
  }
  initialReviews: Review[]
}

export default function FirmReviewsClient({ firm, initialReviews }: FirmReviewsClientProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewStep, setReviewStep] = useState<1 | 2 | 3 | 4>(1)
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
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(
      (user: any) => {
        setCurrentUser(user)
      },
      (err: any) => {
        console.warn('Auth state observation warning:', err?.message || err)
      }
    )
    return unsub
  }, [])

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      openAuthModal('signin')
      return
    }
    setIsReviewModalOpen(true)
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
    setIsReviewModalOpen(false)
    setReviewStep(1)
    setValidationError(null)
  }

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
      setValidationError('Please write your review feedback.')
      return
    }
    setValidationError(null)
    setReviewStep(3)
  }

  const handleSubmitReview = async () => {
    if (!currentUser || submitting) return
    setSubmitting(true)
    setValidationError(null)

    try {
      const payload = {
        user_id: currentUser.uid,
        firm_id: firm.id,
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
        const json = await res.json()
        const newRev: Review = json.review || {
          id: json.id || `rev-${Date.now()}`,
          firm_id: firm.id,
          rating: reviewData.overall_rating,
          trading_conditions: reviewData.trading_conditions,
          customer_care: reviewData.customer_care,
          user_friendliness: reviewData.user_friendliness,
          payout_process: reviewData.payout_process,
          title: reviewData.title.trim() || 'Trader Experience Review',
          body: reviewData.body.trim(),
          full_name: payload.full_name,
          is_verified_trader: true,
          created_at: new Date().toISOString(),
        }

        setReviewsList((prev: any) => [newRev, ...prev])
        setReviewStep(4)
      } else {
        const errJson = await res.json().catch(() => ({}))
        setValidationError(errJson.error || 'Failed to submit review.')
      }
    } catch (err) {
      console.error(err)
      setValidationError('Failed to connect to review server.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvote = async (reviewId: string) => {
    if (upvotedReviews[reviewId]) return
    setUpvotedReviews((prev: any) => ({ ...prev, [reviewId]: true }))
    setReviewsList((prev: any) =>
      prev.map((r: any) => (r.id === reviewId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r))
    )
    try {
      await fetch(`/api/reviews/${reviewId}/upvote`, { method: 'POST' })
    } catch (err) {
      console.warn('Upvote failed:', err)
    }
  }

  const getScoreBadgeClass = (score: number) => {
    if (score >= 4.5) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30'
    if (score >= 4.0) return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
    return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
  }

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 md:p-8 rounded-3xl space-y-8 shadow-xl">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-text-primary">
              Trader Reviews & Experiences
            </h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
              {reviewsList.length} {reviewsList.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real feedback and multi-criteria evaluations submitted by active prop challenge traders.
          </p>
        </div>

        {/* Give Review Action Button (Image 4 Gradient Texture) */}
        <button
          onClick={handleOpenReviewModal}
          className="px-6 py-3 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#FF1E88] via-[#A855F7] to-[#3B82F6] hover:opacity-95 shadow-[0_0_20px_rgba(255,30,136,0.4)] hover:shadow-[0_0_25px_rgba(255,30,136,0.65)] transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer active:scale-95 uppercase tracking-wider"
        >
          <Edit3 className="w-4 h-4 text-white stroke-[2.5]" />
          <span>Write A Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsList.map((rev: any, revIdx: number) => {
          const dateStr = rev.created_at
            ? new Date(
                rev.created_at.seconds ? rev.created_at.seconds * 1000 : rev.created_at
              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recent'

          const textContent = rev.body || rev.comment || ''
          const ratingVal = rev.rating || 5
          const authorName = rev.full_name || rev.user_name || 'Verified Trader'
          const hasCategoryRatings =
            rev.trading_conditions || rev.customer_care || rev.user_friendliness || rev.payout_process
          const uniqueRevKey = `firm-rev-${rev.id || 'idx'}-${revIdx}`

          return (
            <div
              key={uniqueRevKey}
              className="p-6 rounded-2xl bg-bg-base/50 border border-border-subtle hover:border-accent-cyan/20 transition-all space-y-4 shadow-md"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-text-primary text-base">
                    {rev.title || 'Trader Experience Review'}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono">
                    <span className="flex items-center gap-1 text-accent-cyan font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {authorName}
                    </span>
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Overall Rating Stars */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`rev-header-star-${rev.id || revIdx}-${i}`}
                        className={`w-4 h-4 ${
                          i < ratingVal ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-xs text-yellow-400 ml-1">
                    {ratingVal.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Multi-Criteria Pills (if present) */}
              {hasCategoryRatings && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-1">
                  {rev.trading_conditions && (
                    <div className="px-3 py-1.5 rounded-xl bg-bg-surface/80 border border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted font-semibold">Trading:</span>
                      <span className={`font-mono font-bold px-1.5 py-0.2 rounded border ${getScoreBadgeClass(rev.trading_conditions)}`}>
                        {rev.trading_conditions}.0 ★
                      </span>
                    </div>
                  )}
                  {rev.customer_care && (
                    <div className="px-3 py-1.5 rounded-xl bg-bg-surface/80 border border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted font-semibold">Customer Care:</span>
                      <span className={`font-mono font-bold px-1.5 py-0.2 rounded border ${getScoreBadgeClass(rev.customer_care)}`}>
                        {rev.customer_care}.0 ★
                      </span>
                    </div>
                  )}
                  {rev.user_friendliness && (
                    <div className="px-3 py-1.5 rounded-xl bg-bg-surface/80 border border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted font-semibold">UI Ease:</span>
                      <span className={`font-mono font-bold px-1.5 py-0.2 rounded border ${getScoreBadgeClass(rev.user_friendliness)}`}>
                        {rev.user_friendliness}.0 ★
                      </span>
                    </div>
                  )}
                  {rev.payout_process && (
                    <div className="px-3 py-1.5 rounded-xl bg-bg-surface/80 border border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted font-semibold">Payout:</span>
                      <span className={`font-mono font-bold px-1.5 py-0.2 rounded border ${getScoreBadgeClass(rev.payout_process)}`}>
                        {rev.payout_process}.0 ★
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {textContent}
              </p>

              {/* Footer Row: Upvote action */}
              <div className="flex items-center justify-between pt-3 border-t border-border-subtle/40 text-xs">
                <button
                  onClick={() => handleUpvote(rev.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    upvotedReviews[rev.id]
                      ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan'
                      : 'bg-bg-surface border-border-subtle text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30'
                  }`}
                  title="Helpful review"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{rev.upvotes || 0} Helpful</span>
                </button>

                <span className="text-[10px] font-mono text-text-muted">Verified Trader Submission</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Review Submission Modal (Liquid Glass) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-6">
            <button
              onClick={closeReviewModal}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-14 h-14 rounded-xl border border-white/20 bg-white/95 p-1 flex items-center justify-center shrink-0">
                <PropFirmLogo name={firm.name} logoUrl={firm.logo_url} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400">
                  Write A Review
                </span>
                <h3 className="text-xl font-extrabold text-white">{firm.name}</h3>
              </div>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: CATEGORY RATINGS */}
            {reviewStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Step 1: Rate Category Performance</h4>
                  <p className="text-xs text-slate-300">Score each category from 1 to 5 stars.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'trading_conditions', label: 'Trading Conditions', desc: 'Spreads, execution, slippage', color: 'accent-cyan' },
                    { key: 'customer_care', label: 'Customer Care', desc: 'Support response speed and quality', color: 'pink-400' },
                    { key: 'user_friendliness', label: 'User Friendliness', desc: 'Dashboard usability and rules', color: 'purple-400' },
                    { key: 'payout_process', label: 'Payout Process', desc: 'Payout approval and transfer speed', color: 'emerald-400' },
                  ].map((cat) => (
                    <div key={`modal-cat-${cat.key}`} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200">{cat.label}</span>
                        <span className="text-xs font-mono font-bold text-yellow-400">
                          {(reviewData as any)[cat.key] ? `${(reviewData as any)[cat.key]}.0 ★` : 'Not Rated'}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={`modal-star-${cat.key}-${s}`}
                            type="button"
                            onClick={() => setReviewData((p: any) => ({ ...p, [cat.key]: s }))}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= (reviewData as any)[cat.key] ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500 font-extrabold text-sm text-slate-950 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Overall Rating & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: OVERALL RATING & TEXT */}
            {reviewStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Step 2: Overall Score & Review Text</h4>
                  <p className="text-xs text-slate-300">Provide overall stars and write your review.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <label className="text-xs font-bold text-slate-200">Overall Rating</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={`step2-overall-star-${s}`}
                          type="button"
                          onClick={() => setReviewData((p: any) => ({ ...p, overall_rating: s }))}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              s <= reviewData.overall_rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="font-mono font-bold text-sm text-yellow-400 ml-2">
                        {reviewData.overall_rating}.0 ★
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200">Review Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Excellent challenge parameters & fast support"
                      value={reviewData.title}
                      onChange={(e) => setReviewData((p: any) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200">Review Details</label>
                    <textarea
                      rows={4}
                      placeholder="Share details about your challenge evaluation, payout clearance, or platform execution..."
                      value={reviewData.body}
                      onChange={(e) => setReviewData((p: any) => ({ ...p, body: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewStep(1)}
                    className="w-1/3 py-3 rounded-2xl border border-white/20 bg-white/5 text-slate-300 font-bold text-xs"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple font-extrabold text-sm text-slate-950"
                  >
                    Preview Summary →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUMMARY & SUBMIT */}
            {reviewStep === 3 && (
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-white">Step 3: Review Preview</h4>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/15 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-300 pb-2 border-b border-white/10">
                    <div>Trading: <strong className="text-accent-cyan">{reviewData.trading_conditions}.0★</strong></div>
                    <div>Care: <strong className="text-pink-400">{reviewData.customer_care}.0★</strong></div>
                    <div>UI Ease: <strong className="text-purple-400">{reviewData.user_friendliness}.0★</strong></div>
                    <div>Payout: <strong className="text-[#10B981]">{reviewData.payout_process}.0★</strong></div>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{reviewData.title || 'Trader Review'}</h5>
                    <p className="text-slate-300 italic mt-1 bg-black/20 p-2.5 rounded-lg">"{reviewData.body}"</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setReviewStep(2)}
                    className="w-1/3 py-3 rounded-2xl border border-white/20 bg-white/5 text-slate-300 font-bold text-xs"
                  >
                    ← Edit
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitReview}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500 font-extrabold text-sm text-slate-950 flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit Public Review'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {reviewStep === 4 && (
              <div className="py-6 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-accent-green/20 border border-accent-green/40 flex items-center justify-center mx-auto text-accent-green">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white">Review Submitted Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Your review has been published publicly and is now live on this firm's reviews tab.
                </p>
                <button
                  onClick={closeReviewModal}
                  className="px-6 py-2.5 rounded-xl bg-accent-cyan font-bold text-xs text-slate-950"
                >
                  Close & View Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
