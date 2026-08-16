'use client'

import React from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { ArrowRight, TrendingUp, ExternalLink } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface BestSeller {
  id: string
  firm_id: string
  firm?: {
    id: string
    name: string
    logo_url?: string
    affiliate_url?: string
  }
  account_size: number
  price: number
  steps: number
  profit_target_p1: number
  max_loss_pct: number
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
  if (items.length === 0) return null

  const top = items.slice(0, 5)

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/3 to-accent-cyan/3 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-accent-purple" />
              <span className="text-xs font-bold text-accent-purple uppercase tracking-wider">{badge || 'Best Sellers'}</span>
            </div>
            <h2 className="text-4xl font-bold text-text-primary afx-gradient-heading">
              {title || 'Top Selling Challenges'}
            </h2>
            <p className="text-text-secondary text-lg mt-2 font-bold">
              {subtext || 'The most purchased challenge programs by traders this month.'}
            </p>
          </div>
          <Link
            href="/best-sellers"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-border-subtle text-text-secondary hover:text-accent-purple hover:border-accent-purple/40 transition-all"
          >
            {ctaText || 'View All'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.map((item, index) => {
            const rank = index + 1
            const firm = item.firm
            if (!firm) return null

            const frame = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'offwhite'

            return (
              <AFXCard
                key={item.id}
                className="p-6 bg-gradient-to-b from-white/[0.04] to-accent-purple/[0.02] border border-white/5 hover:border-accent-purple/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.18)] hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden rounded-2xl"
              >
                {/* Visual Shiny Highlight overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-40 pointer-events-none" />

                {/* Rank badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md ${
                    rank === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' :
                      rank === 2 ? 'bg-slate-400/20 text-slate-400 border border-slate-400/30' :
                        rank === 3 ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30' :
                          'bg-black/35 text-text-muted border border-white/5'
                  }`}>
                    #{rank}
                  </span>
                </div>

                {/* Firm header & logo details */}
                <div className="flex items-center gap-3 mb-5">
                  <PropFirmLogo
                    name={firm.name}
                    logoUrl={firm.logo_url}
                    circleCrop={false}
                    frame={frame}
                    className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-text-primary group-hover:text-accent-purple transition-colors">{firm.name}</h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                      {item.steps === 0 ? 'Instant Funding' : `${item.steps}-Step Challenge`}
                    </span>
                  </div>
                </div>

                {/* Stats grid section */}
                <div className="grid grid-cols-2 gap-3 mb-5 py-4 border-y border-white/5 text-xs font-bold">
                  <div>
                    <p className="text-text-muted uppercase tracking-wider text-[9px] mb-0.5">Account Size</p>
                    <p className="text-text-primary font-mono text-sm">${(item.account_size / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase tracking-wider text-[9px] mb-0.5">Profit Target</p>
                    <p className="text-accent-green font-mono text-sm">{item.profit_target_p1}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase tracking-wider text-[9px] mb-0.5">Max Drawdown</p>
                    <p className="text-red-400 font-mono text-sm">{item.max_loss_pct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase tracking-wider text-[9px] mb-0.5">Price</p>
                    <p className="text-accent-cyan font-mono text-sm">${item.price}</p>
                  </div>
                </div>

                {/* Buy Button CTA */}
                <a
                  href={item.affiliate_url || firm.affiliate_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-purple to-accent-blue text-xs hover:opacity-90 transition-opacity"
                >
                  Buy Challenge
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </AFXCard>
            )
          })}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href="/best-sellers"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/10 transition-all"
          >
            View All Best Sellers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeBestSellers
