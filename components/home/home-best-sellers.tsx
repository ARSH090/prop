'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { ArrowRight, TrendingUp, ExternalLink, Copy, Check } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface BestSeller {
  id: string
  firm_id: string
  firm?: {
    id: string
    name: string
    logo_url?: string
    affiliate_url?: string
    coupon_code_custom?: string
  }
  challenge_name?: string
  challenge_type?: string
  steps?: number
  min_account_size?: number
  max_account_size?: number
  account_size: number
  profit_target_p1?: number
  profit_target_p2?: number
  profit_target_p3?: number
  daily_loss_pct?: number
  max_loss_pct?: number
  max_loss_type?: string
  profit_split_pct?: number
  original_price?: number
  price: number
  currency?: string
  coupon_code?: string
  affiliate_url?: string
  popularity_score?: number
}

interface HomeBestSellersProps {
  items?: BestSeller[]
  badge?: string
  title?: string
  subtext?: string
  ctaText?: string
}

export function HomeBestSellers({
  items = [],
  badge,
  title,
  subtext,
  ctaText,
}: HomeBestSellersProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (items.length === 0) return null

  // Limit to exactly 3 top challenges
  const top = items.slice(0, 3)

  const handleCopyCode = (code: string, id: string) => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const formatAccountRange = (item: BestSeller) => {
    const min = item.min_account_size
    const max = item.max_account_size || item.account_size
    if (min && max && min < max) {
      const minStr = min >= 1000 ? `$${(min / 1000).toFixed(0)}K` : `$${min}`
      const maxStr = max >= 1000 ? `$${(max / 1000).toFixed(0)}K` : `$${max}`
      return `${minStr} - ${maxStr}`
    }
    const val = item.account_size || max || 100000
    return val >= 1000 ? `$${(val / 1000).toFixed(0)}K` : `$${val}`
  }

  const getStepTag = (item: BestSeller) => {
    if (item.challenge_type) return item.challenge_type.toUpperCase()
    const steps = item.steps !== undefined ? item.steps : 2
    if (steps === 0) return 'INSTANT'
    if (steps === 1) return '1 STEP'
    if (steps === 3) return '3 STEP'
    return '2 STEP'
  }

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-cyan/5 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-extrabold text-pink-400 uppercase tracking-wider">
                {badge || 'Best Sellers'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary afx-gradient-heading tracking-tight">
              {title || 'Top Selling Challenges'}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-1.5 font-semibold">
              {subtext || 'The most purchased challenge programs by traders this month.'}
            </p>
          </div>
          <Link
            href="/challenges"
            className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-border-subtle text-text-secondary hover:text-pink-400 hover:border-pink-500/40 transition-all bg-bg-surface/40 backdrop-blur-md"
          >
            {ctaText || 'View All'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top.map((item, index) => {
            const rank = index + 1
            const firm = item.firm
            const firmName = firm?.name || 'Prop Firm'
            const stepTag = getStepTag(item)
            const isInstant = stepTag === 'INSTANT'
            const codeToCopy = item.coupon_code || firm?.coupon_code_custom || 'EMPIRIAL'
            const buyDestination = item.affiliate_url || firm?.affiliate_url || '#'

            const frame = rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze'

            // Spot 1: Slight Golden hover glow, Spot 2: Silver hover glow, Spot 3: Pink hover glow
            const rankHoverClass =
              rank === 1
                ? 'hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]'
                : rank === 2
                ? 'hover:border-slate-300/80 hover:shadow-[0_0_30px_rgba(203,213,225,0.3)]'
                : 'hover:border-pink-500/80 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]'

            return (
              <AFXCard
                key={item.id}
                className={`p-6 bg-gradient-to-b from-white/[0.05] via-black/40 to-white/[0.02] border border-white/10 ${rankHoverClass} hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden rounded-2xl flex flex-col justify-between`}
              >
                {/* Visual Glow Highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-40 pointer-events-none" />

                <div>
                  {/* Firm Header & Rank Badge & Step Tag */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3.5">
                      {/* Logo: bigger size (w-14 h-14), minimal round edges (rounded-md), frame preserved */}
                      <PropFirmLogo
                        name={firmName}
                        logoUrl={firm?.logo_url}
                        circleCrop={false}
                        frame={frame}
                        className="w-14 h-14 rounded-md flex items-center justify-center overflow-hidden shrink-0 border border-white/10"
                      />
                      <div>
                        {/* Firm Name: steady white text, no color shine on hover */}
                        <h3 className="font-extrabold text-lg text-white leading-tight select-none">
                          {firmName}
                        </h3>
                        <div className="mt-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-pink-500/15 border border-pink-500/40 text-pink-400 text-[10px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(236,72,153,0.15)] font-sans">
                            {stepTag}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black font-sans px-2 py-0.5 rounded-md shrink-0 ${
                        rank === 1
                          ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                          : rank === 2
                          ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40'
                          : 'bg-amber-600/20 text-amber-500 border border-amber-500/40'
                      }`}
                    >
                      #{rank}
                    </span>
                  </div>

                  {/* 1. Account Size Metric */}
                  <div className="mb-4 pb-3 border-b border-white/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">
                      ACCOUNT SIZE
                    </p>
                    <p className="text-xl font-extrabold text-white tracking-tight font-sans">
                      {formatAccountRange(item)}
                    </p>
                  </div>

                  {/* 2 & 3. Profit Target & Drawdown Row */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-3 border-b border-white/10">
                    {/* PROFIT TARGET (Omitted completely for INSTANT accounts) */}
                    {!isInstant ? (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">
                          PROFIT TARGET
                        </p>
                        <p className="text-base font-extrabold text-accent-green font-sans tracking-tight">
                          {stepTag === '1 STEP'
                            ? `${item.profit_target_p1 || 10}%`
                            : stepTag === '3 STEP'
                            ? `${item.profit_target_p1 || 8}% | ${item.profit_target_p2 || 5}% | ${item.profit_target_p3 || 5}%`
                            : `${item.profit_target_p1 || 8}% | ${item.profit_target_p2 || 5}%`}
                        </p>
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* DRAWDOWN */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">
                        DRAWDOWN
                      </p>
                      <p className="text-base font-extrabold text-red-400 font-sans tracking-tight">
                        {item.daily_loss_pct || 5}% | {item.max_loss_pct || 10}%
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 font-sans">
                        Daily &nbsp;|&nbsp; Max
                      </p>
                    </div>
                  </div>

                  {/* 4 & 5. Max Loss Type & Profit Split Row */}
                  <div className="grid grid-cols-2 gap-3 mb-5 pb-3 border-b border-white/10">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">
                        MAX LOSS TYPE
                      </p>
                      <p className="text-sm font-extrabold text-white font-sans tracking-tight">
                        {(item.max_loss_type || 'STATIC').toUpperCase().includes('TRAIL') ? 'TRAILING' : 'STATIC'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">
                        PROFIT SPLIT
                      </p>
                      <p className="text-sm font-extrabold text-purple-400 font-sans tracking-tight">
                        {item.profit_split_pct || 90}%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Price Row */}
                  <div className="flex items-baseline justify-between mb-5 px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                      PRICE
                    </span>
                    <div className="flex items-baseline gap-2.5 font-sans">
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-xs font-bold text-slate-400 line-through opacity-80">
                          ${item.original_price}
                        </span>
                      )}
                      <span className="text-2xl font-black text-accent-cyan tracking-tight">
                        ${item.price}
                      </span>
                    </div>
                  </div>

                  {/* Dual Side-by-Side Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* LEFT: COPY CODE */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeToCopy, item.id)}
                      className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-extrabold border transition-all font-sans ${
                        copiedId === item.id
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20 hover:border-pink-500/50'
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          COPIED ✓
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-pink-400" />
                          COPY CODE
                        </>
                      )}
                    </button>

                    {/* RIGHT: BUY ACCOUNT */}
                    <a
                      href={buyDestination}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-extrabold text-bg-base bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(34,211,238,0.2)] font-sans"
                    >
                      BUY ACCOUNT
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </AFXCard>
            )
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/challenges"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-pink-500/40 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 transition-all font-sans"
          >
            View All Challenges
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeBestSellers
