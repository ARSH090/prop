'use client'

import React from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { Star, ArrowRight, TrendingUp, ExternalLink } from 'lucide-react'

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
    <section className="py-20 bg-bg-surface relative overflow-hidden">
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
            <p className="text-text-secondary text-lg mt-2">
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

            return (
              <AFXCard
                key={item.id}
                className="bg-bg-card border border-border-subtle p-5 hover:border-accent-purple/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300 group relative overflow-hidden"
              >
                {/* Rank badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${
                    rank === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' :
                    rank === 2 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30' :
                    rank === 3 ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30' :
                    'bg-bg-base text-text-muted border border-border-subtle'
                  }`}>
                    #{rank}
                  </span>
                </div>

                {/* Firm header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bg-base rounded-xl flex items-center justify-center border border-border-subtle overflow-hidden shrink-0">
                    {firm.logo_url ? (
                      <img src={firm.logo_url} alt={firm.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-accent-purple font-bold text-lg">{firm.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary group-hover:text-accent-purple transition-colors">{firm.name}</h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                      {item.steps === 0 ? 'Instant Funding' : `${item.steps}-Step Challenge`}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-border-subtle/50 text-xs">
                  <div>
                    <p className="text-text-muted font-bold uppercase tracking-wider text-[9px]">Account Size</p>
                    <p className="font-bold text-text-primary font-mono">${(item.account_size / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-text-muted font-bold uppercase tracking-wider text-[9px]">Profit Target</p>
                    <p className="font-bold text-accent-green font-mono">{item.profit_target_p1}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted font-bold uppercase tracking-wider text-[9px]">Max Drawdown</p>
                    <p className="font-bold text-red-400 font-mono">{item.max_loss_pct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted font-bold uppercase tracking-wider text-[9px]">Price</p>
                    <p className="font-bold text-accent-cyan font-mono">${item.price}</p>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={item.affiliate_url || firm.affiliate_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-purple to-accent-blue text-xs hover:opacity-90 transition-opacity"
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
