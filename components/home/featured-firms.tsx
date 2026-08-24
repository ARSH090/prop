'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { RatingBadge } from '@/components/ui/rating-badge'
import { ArrowRight, Copy, Check, ExternalLink } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Firm {
  id: string
  slug: string
  name: string
  type: string
  category: string[]
  logo_url: string
  country?: string
  platforms?: string[]
  max_allocation?: number
  rating?: number
  review_count?: number
  website_url?: string
  affiliate_url?: string
  is_featured?: boolean
  is_verified?: boolean
  description?: string
  years_active?: number
  established_year?: number
  coupon_code_custom?: string
  discount_label_custom?: string
  activeDeal?: {
    id: string
    code: string
    title?: string
    discount_label?: string
  }
  circle_crop_logo?: boolean
}

interface FeaturedFirmsProps {
  firms: Firm[]
  title?: string
  subtext?: string
}

function PlatformLogoBadge({ name }: { name: string }) {
  const cleanName = name.trim().toLowerCase()

  if (cleanName.includes('ctrader')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#0066CC] p-1 flex items-center justify-center text-white font-extrabold text-[9px] shadow-sm tracking-tighter shrink-0 select-none"
        title="cTrader"
      >
        cT
      </div>
    )
  }
  if (cleanName.includes('ninjatrader') || cleanName.includes('ninja')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#FF4500] p-1 flex items-center justify-center text-white font-black text-[9px] shadow-sm tracking-tighter shrink-0 select-none"
        title="NinjaTrader"
      >
        NT
      </div>
    )
  }
  if (cleanName.includes('tradelocker')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#00C853] p-1 flex items-center justify-center text-white font-black text-[10px] shadow-sm shrink-0 select-none"
        title="TradeLocker"
      >
        ▲
      </div>
    )
  }
  if (cleanName.includes('matchtrader') || cleanName.includes('match')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#0088FF] p-1 flex items-center justify-center text-white font-black text-[11px] shadow-sm shrink-0 select-none font-sans"
        title="MatchTrader"
      >
        m
      </div>
    )
  }
  if (cleanName.includes('dxtrade') || cleanName.includes('dx')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#536DFE] p-1 flex items-center justify-center text-white font-black text-[9px] shadow-sm shrink-0 select-none"
        title="DXTrade"
      >
        DX
      </div>
    )
  }
  if (cleanName.includes('mt5') || cleanName.includes('metatrader 5')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#1565C0] p-1 flex items-center justify-center text-white font-black text-[9px] shadow-sm shrink-0 select-none"
        title="MetaTrader 5"
      >
        MT5
      </div>
    )
  }
  if (cleanName.includes('mt4') || cleanName.includes('metatrader 4')) {
    return (
      <div
        className="w-7 h-7 rounded-md bg-[#1976D2] p-1 flex items-center justify-center text-white font-black text-[9px] shadow-sm shrink-0 select-none"
        title="MetaTrader 4"
      >
        MT4
      </div>
    )
  }

  return (
    <div
      className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700/80 p-1 flex items-center justify-center text-slate-200 font-bold text-[9px] uppercase tracking-tighter shrink-0 select-none"
      title={name}
    >
      {name.substring(0, 3)}
    </div>
  )
}

export function FeaturedFirms({ firms, title, subtext }: FeaturedFirmsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyCode = (code: string, id: string) => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  return (
    <section className="py-20 bg-transparent relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2 afx-gradient-heading tracking-tight">
              {title || 'Verified PropFirms'}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base font-semibold">
              {subtext || 'Compare premium programs, get exclusive discount codes, and buy with one click.'}
            </p>
          </div>
          <Link
            href="/firms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-border-subtle text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/40 transition-all shrink-0 self-start sm:self-auto"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {firms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firms.map((firm) => {
              const codeToCopy = firm.activeDeal?.code || firm.coupon_code_custom || 'EMPIRIAL'
              const discountLabel = firm.activeDeal?.discount_label || firm.discount_label_custom || '10% OFF'
              const firmDetailUrl = `/firms/${firm.slug || firm.id}`
              const platformsList = firm.platforms && firm.platforms.length > 0
                ? firm.platforms
                : ['MT5', 'cTrader', 'MatchTrader']
              const yearsOp = firm.years_active ? `${firm.years_active} Years` : '5+ Years'
              const maxAlloc = firm.max_allocation
                ? (firm.max_allocation >= 1000000
                    ? `$${(firm.max_allocation / 1000000).toFixed(1)}M`
                    : `$${firm.max_allocation.toLocaleString('en-US')}`)
                : '$200,000'

              return (
                <AFXCard
                  key={firm.id}
                  className="relative flex flex-col justify-between group overflow-hidden border border-white/10 hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] hover:-translate-y-1 transition-all duration-500 bg-black/40 rounded-2xl p-6"
                >
                  {/* Subtle Mild Overlay Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-40 pointer-events-none" />

                  <div className="space-y-5 relative z-10">
                    {/* Header: Bigger Square Logo + Minimal Round Edges + White Frame + Rating */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-3.5 items-center">
                        <PropFirmLogo
                          name={firm.name}
                          logoUrl={firm.logo_url}
                          circleCrop={false}
                          frame="offwhite"
                          className="w-14 h-14 rounded-md flex items-center justify-center overflow-hidden shrink-0 border border-white/20 shadow-sm"
                        />
                        <div>
                          <h3 className="font-extrabold text-lg text-white font-sans leading-tight select-none">
                            {firm.name}
                          </h3>
                          <div className="mt-1.5">
                            <RatingBadge
                              rating={firm.rating || 4.7}
                              reviewCount={firm.review_count || 900}
                              fontVariant="sans"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid (Years in Operation, Assets/Categories, Max Allocation, Platforms) */}
                    <div className="space-y-3 py-3 border-y border-white/10 font-sans">
                      {/* Row 1: Years in Operation & Max Allocation */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                            YEARS IN OPERATION
                          </span>
                          <span className="text-sm font-extrabold text-white tracking-tight">
                            {yearsOp}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                            MAX ALLOCATION
                          </span>
                          <span className="text-sm font-extrabold text-white tracking-tight">
                            {maxAlloc}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Assets / Categories (Grey Tags) */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                          ASSETS
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(firm.category && firm.category.length > 0 ? firm.category : ['FOREX', 'CRYPTO']).map((cat) => (
                            <span
                              key={cat}
                              className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[10px] font-bold uppercase tracking-wider font-sans"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Row 3: Platforms (Mini Platform Logo Badges as shown in Image 3) */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                          PLATFORMS
                        </span>
                        <div className="flex flex-wrap gap-2 items-center">
                          {platformsList.map((plat) => (
                            <PlatformLogoBadge key={plat} name={plat} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row: Copy Promo Code Button + Buy Now Redirect to Firm Details Page */}
                  <div className="pt-4 mt-5 border-t border-white/10 grid grid-cols-2 gap-2.5 relative z-10 font-sans">
                    {/* LEFT: Copy Discount Code Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeToCopy, firm.id)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                        copiedId === firm.id
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20 hover:border-pink-500/50'
                      }`}
                    >
                      {copiedId === firm.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          COPIED ✓
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span className="truncate">{discountLabel}</span>
                        </>
                      )}
                    </button>

                    {/* RIGHT: BUY NOW Redirects to Firm Details Page */}
                    <Link
                      href={firmDetailUrl}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold text-bg-base bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                      Buy Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </AFXCard>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-white/10 rounded-3xl bg-black/20">
            <p className="text-text-secondary text-sm font-semibold">No prop firms found for this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedFirms
