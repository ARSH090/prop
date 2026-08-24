'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, Trophy, Copy, Check } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

export interface ChallengeItem {
  id: string
  firm_id: string
  challenge_name?: string
  challenge_type?: string
  min_account_size?: number
  max_account_size?: number
  account_size: number
  steps: number
  profit_target_p1: number
  profit_target_p2?: number
  profit_target_p3?: number
  daily_loss_pct: number
  max_loss_pct: number
  max_loss_type?: string
  pt_dd_ratio?: string
  profit_split_pct: number
  payout_freq: string
  loyalty_points?: number
  popularity_score?: number
  price: number
  original_price?: number
  currency?: string
  coupon_code?: string
  deal_id?: string | null
  affiliate_url?: string | null
  is_active?: boolean
  logo_url?: string | null
}

export interface FirmItem {
  id: string
  slug: string
  name: string
  logo_url?: string | null
  rating?: number
  review_count?: number
  affiliate_url?: string
  website_url?: string
  category?: string[]
  circle_crop_logo?: boolean
  likes_count?: number
}

export interface DealItem {
  id: string
  code: string
  discount_label?: string
  firm_id?: string
  title?: string
  status?: string
}

interface ChallengeListingTableProps {
  challenges: ChallengeItem[]
  firms?: FirmItem[]
  deals?: DealItem[]
  activeFirm?: FirmItem | null
  showRankBorders?: boolean
  className?: string
}

// 5-segment Profit Split Circle Component
export const ProfitSplitCircle = ({ pct }: { pct: number }) => {
  const totalSegments = 5
  const filledCount = Math.min(totalSegments, Math.max(1, Math.round((pct / 100) * totalSegments)))
  const radius = 17
  const circumference = 2 * Math.PI * radius
  const segmentLength = (circumference / totalSegments) - 3.8

  return (
    <div className="inline-flex flex-col items-center justify-center gap-1 shrink-0 select-none py-1">
      <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isFilled = idx < filledCount
            const offset = -(idx * (circumference / totalSegments))
            return (
              <circle
                key={idx}
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke={isFilled ? '#c084fc' : 'rgba(255, 255, 255, 0.16)'}
                strokeWidth="3.6"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            )
          })}
        </svg>
        <span className="absolute text-xs font-black text-white font-chunky-num">
          {filledCount}
        </span>
      </div>
      <span className="text-xs sm:text-[13px] font-black text-white font-chunky-num tracking-tight leading-none">
        {pct}%
      </span>
    </div>
  )
}

export const PromoCopyButton = ({
  discount,
  code,
  onCopy,
  isCopied,
  className = ''
}: {
  discount?: string
  code: string
  onCopy: (code: string) => void
  isCopied: boolean
  className?: string
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onCopy(code)
      }}
      className={`flex flex-col items-center justify-center bg-[#12131a] hover:bg-[#161824] border ${
        isCopied
          ? 'border-[#00b67a] bg-[#00b67a]/15 shadow-[0_0_12px_rgba(0,182,122,0.4)]'
          : 'border-pink-500/40 hover:border-pink-400 bg-pink-500/10'
      } px-3 py-1.5 rounded-xl select-none shrink-0 min-w-[90px] text-center gap-0.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${className}`}
      title="Click to copy promo code"
    >
      <span className="text-[10px] sm:text-[10.5px] font-black text-[#ff5eb8] tracking-tight uppercase leading-tight font-chunky-num">
        {isCopied ? 'COPIED!' : (discount || 'PROMO')}
      </span>
      <div className="flex items-center justify-center gap-1 leading-tight">
        <span className="text-[11px] sm:text-[11.5px] font-black text-white font-mono tracking-wide">
          {code}
        </span>
        {isCopied ? (
          <Check className="w-3.5 h-3.5 text-[#00b67a] shrink-0 stroke-[3]" />
        ) : (
          <Copy className="w-3 h-3 text-slate-200 shrink-0" />
        )}
      </div>
    </button>
  )
}

export function ChallengeListingTable({
  challenges,
  firms = [],
  deals = [],
  activeFirm = null,
  showRankBorders = true,
  className = '',
}: ChallengeListingTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [favoriteFirms, setFavoriteFirms] = useState<string[]>([])

  // Load saved bookmarks
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('afx_favorites')
      if (saved) {
        setFavoriteFirms(JSON.parse(saved))
      }
    } catch (e) {}
  }, [])

  const handleToggleBookmark = (firmId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = favoriteFirms.includes(firmId)
      ? favoriteFirms.filter((id) => id !== firmId)
      : [...favoriteFirms, firmId]
    setFavoriteFirms(updated)
    try {
      localStorage.setItem('afx_favorites', JSON.stringify(updated))
    } catch (e) {}
  }

  const handleCopyCode = (code: string) => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getFirm = (firmId: string) => {
    if (activeFirm && activeFirm.id === firmId) return activeFirm
    return firms.find((f) => f.id === firmId) || activeFirm
  }

  const getDeal = (dealId: string | null | undefined, firmId: string) => {
    if (dealId) {
      const found = deals.find((d) => d.id === dealId)
      if (found) return found
    }
    return deals.find((d) => d.firm_id === firmId && d.status === 'active')
  }

  const handleBuyClick = async (ch: ChallengeItem) => {
    try {
      await fetch(`/api/deals/${ch.deal_id || 'challenge'}/click`, { method: 'POST' })
    } catch (e) {}

    const firm = getFirm(ch.firm_id)
    const targetUrl = ch.affiliate_url || firm?.affiliate_url || firm?.website_url || '#'
    window.open(targetUrl, '_blank')
  }

  if (challenges.length === 0) {
    return (
      <div className="border border-white/10 bg-[#12131a]/60 p-12 text-center rounded-3xl">
        <p className="text-text-secondary text-sm font-semibold">No challenges found matching your selection.</p>
      </div>
    )
  }

  // Format account size in chunky style (e.g. $200K, $100K, $50K)
  const formatAccountSize = (size?: number) => {
    if (!size) return '$100K'
    if (size >= 1000000) return `$${(size / 1000000).toFixed(0)}M`
    if (size >= 1000) return `$${(size / 1000).toFixed(0)}K`
    return `$${size.toLocaleString()}`
  }

  return (
    <div className={`liquid-glass-card rounded-3xl p-1 shadow-2xl relative overflow-hidden ${className}`}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse text-left text-sm text-text-secondary min-w-[950px]">
          <thead>
            <tr className="border-b border-white/[0.12] bg-black/60 text-xs font-black uppercase tracking-wider text-white select-none">
              <th className="px-3.5 py-3.5 text-left font-black w-[240px]">Firm / Package</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[110px]">Account Size</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[80px]">Steps</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[110px]">Profit Target</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[85px]">Daily Loss</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[85px]">Max Loss</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[100px] hidden lg:table-cell">Max Loss Type</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[100px]">Profit Split</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[120px]">Payout Cycle</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[100px]">Price</th>
              <th className="px-3.5 py-3.5 text-center font-black w-[110px]">Promo Code</th>
              <th className="px-3.5 py-3.5 text-right font-black w-[95px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {challenges.map((ch, idx) => {
              const firm = getFirm(ch.firm_id)
              const deal = getDeal(ch.deal_id, ch.firm_id)
              const isBookmarked = firm ? favoriteFirms.includes(firm.id) : false

              // Dynamic row background shading for top ranks
              const rowBgStyle = showRankBorders && idx === 0
                ? "group bg-gradient-to-r from-[#2c2415] via-[#1a1712] to-[#12131a] hover:from-[#362c1a] hover:to-[#181a24] transition-all duration-300 border-b border-amber-500/30 border-l-4 border-l-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.12)]"
                : showRankBorders && idx === 1
                  ? "group bg-gradient-to-r from-[#1c222b] via-[#151920] to-[#12131a] hover:from-[#232b37] hover:to-[#181a24] transition-all duration-300 border-b border-slate-400/30 border-l-4 border-l-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.12)]"
                  : showRankBorders && idx === 2
                    ? "group bg-gradient-to-r from-[#291b15] via-[#1d1512] to-[#12131a] hover:from-[#33221b] hover:to-[#181a24] transition-all duration-300 border-b border-amber-700/30 border-l-4 border-l-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.12)]"
                    : "group bg-[#12131a] hover:bg-[#161824] transition-all duration-300 border-b border-white/[0.08]"

              const logoFrame = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : 'offwhite'
              const firmName = firm?.name || 'Prop Firm'
              const logoUrl = getCleanLogoUrl(firmName, ch.logo_url || firm?.logo_url || null)

              const promoCode = ch.coupon_code || deal?.code || ''
              const discountLabel = (ch as any).discount_label || deal?.discount_label || 'PROMO'

              const offeredPrice = ch.price
              const realPrice = ch.original_price && ch.original_price > ch.price
                ? ch.original_price
                : Math.round(ch.price * 1.28 * 100) / 100
              const currencySymbol = ch.currency === 'EUR' || ch.currency === 'eur' ? '€' : ch.currency === 'GBP' || ch.currency === 'gbp' ? '£' : '$'

              return (
                <tr key={ch.id} className={rowBgStyle}>
                  {/* 1. Firm / Rank column */}
                  <td className="px-3.5 py-3 align-middle relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent-cyan to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2.5 pl-1">
                      {/* Star favorite toggle */}
                      {firm && (
                        <button
                          onClick={(e) => handleToggleBookmark(firm.id, e)}
                          className="p-1 rounded-full text-text-muted hover:text-amber-400 transition-all shrink-0 cursor-pointer"
                          title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
                        >
                          <Star className={`w-4 h-4 transition-transform active:scale-75 ${isBookmarked ? "fill-amber-400 text-amber-400" : "text-text-muted hover:text-text-secondary"}`} />
                        </button>
                      )}

                      {/* Rank Trophy */}
                      {showRankBorders && (
                        <div className="w-4.5 flex items-center justify-center shrink-0">
                          {idx === 0 ? (
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          ) : idx === 1 ? (
                            <Trophy className="w-3.5 h-3.5 text-slate-300" />
                          ) : idx === 2 ? (
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                          ) : null}
                        </div>
                      )}

                      {/* Firm Logo */}
                      <PropFirmLogo
                        name={firmName}
                        logoUrl={logoUrl}
                        circleCrop={firm?.circle_crop_logo}
                        frame={logoFrame}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shadow-sm"
                      />

                      {/* Firm Name & Link */}
                      <div className="min-w-0 flex-1">
                        {firm?.slug ? (
                          <Link
                            href={`/firms/${firm.slug}`}
                            className="font-black text-white text-xs sm:text-[13.5px] hover:text-accent-cyan transition-colors block truncate"
                          >
                            {firmName}
                          </Link>
                        ) : (
                          <span className="font-black text-white text-xs sm:text-[13.5px] block truncate">
                            {firmName}
                          </span>
                        )}
                        {ch.challenge_name && (
                          <span className="text-[10px] text-slate-300 font-bold block truncate font-mono">
                            {ch.challenge_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Account Size (Chunky Numbers Font matching Image 2) */}
                  <td className="px-3.5 py-3 text-center align-middle">
                    <span className="text-sm sm:text-base font-black text-white font-chunky-num tracking-tight block">
                      {formatAccountSize(ch.account_size)}
                    </span>
                  </td>

                  {/* 3. Steps */}
                  <td className="px-3.5 py-3 text-center align-middle">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] sm:text-[11px] font-black text-white uppercase font-chunky-num">
                      {ch.steps}-Step
                    </span>
                  </td>

                  {/* 4. Profit Target */}
                  <td className="px-3.5 py-3 text-center align-middle">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-xs sm:text-sm font-black text-white font-chunky-num">
                        {ch.profit_target_p1}%
                      </span>
                      {ch.steps > 1 && ch.profit_target_p2 !== undefined && (
                        <span className="text-[10px] font-bold text-slate-300 font-chunky-num">
                          / {ch.profit_target_p2}%
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. Daily Loss */}
                  <td className="px-3.5 py-3 text-center align-middle text-xs sm:text-sm font-black text-rose-400 font-chunky-num">
                    {ch.daily_loss_pct}%
                  </td>

                  {/* 6. Max Loss */}
                  <td className="px-3.5 py-3 text-center align-middle text-xs sm:text-sm font-black text-rose-400 font-chunky-num">
                    {ch.max_loss_pct}%
                  </td>

                  {/* 7. Max Loss Type */}
                  <td className="px-3.5 py-3 text-center align-middle text-xs font-black text-white uppercase font-chunky-num truncate hidden lg:table-cell">
                    {ch.max_loss_type || 'Static'}
                  </td>

                  {/* 8. Profit Split */}
                  <td className="px-3.5 py-3 text-center align-middle">
                    <div className="inline-flex justify-center">
                      <ProfitSplitCircle pct={ch.profit_split_pct || 80} />
                    </div>
                  </td>

                  {/* 9. Payout Cycle */}
                  <td className="px-3.5 py-3 text-center align-middle text-xs sm:text-sm font-black text-white font-chunky-num">
                    {ch.payout_freq || 'Bi-weekly'}
                  </td>

                  {/* 10. Price */}
                  <td className="px-3.5 py-3 text-center align-middle">
                    <div className="inline-flex flex-col items-center gap-0.5 select-none">
                      <span className="text-xs sm:text-sm font-black text-white font-chunky-num">
                        {currencySymbol}{offeredPrice.toFixed(2)}
                      </span>
                      <span className="line-through text-slate-400 text-[9.5px] font-bold font-chunky-num">
                        {currencySymbol}{realPrice.toFixed(2)}
                      </span>
                    </div>
                  </td>

                  {/* 11. Promo Code */}
                  <td className="px-3.5 py-3 text-center align-middle">
                    {promoCode ? (
                      <PromoCopyButton
                        discount={discountLabel}
                        code={promoCode}
                        onCopy={handleCopyCode}
                        isCopied={copiedCode === promoCode}
                        className="mx-auto"
                      />
                    ) : (
                      <span className="text-text-muted text-xs font-bold">—</span>
                    )}
                  </td>

                  {/* 12. Buy Action Button */}
                  <td className="px-3.5 py-3 text-right align-middle">
                    <button
                      onClick={() => handleBuyClick(ch)}
                      className="btn-textured-cta px-4 py-2 rounded-full text-xs font-black text-black cursor-pointer whitespace-nowrap shadow-md"
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
  )
}

export default ChallengeListingTable
