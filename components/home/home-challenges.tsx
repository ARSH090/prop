'use client'

import React from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { Award, ArrowRight, ExternalLink } from 'lucide-react'

interface Challenge {
  id: string
  firm_id: string
  account_size: number
  price: number
  steps: number
  profit_target_p1: number
  profit_target_p2?: number
  max_loss_pct: number
  affiliate_url?: string
  popularity_score?: number
}

interface Firm {
  id: string
  name: string
  logo_url?: string
  affiliate_url?: string
}

interface HomeChallengesProps {
  challenges?: Challenge[]
  firms?: Firm[]
  badge?: string
  title?: string
  subtext?: string
  ctaText?: string
}

export function HomeChallenges({
  challenges = [],
  firms = [],
  badge,
  title,
  subtext,
  ctaText,
}: HomeChallengesProps) {
  if (challenges.length === 0) return null

  const top = challenges.slice(0, 6)

  const getFirm = (firmId: string) => firms.find((f) => f.id === firmId)

  return (
    <section className="py-20 bg-bg-base relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-3">
              <Award className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">{badge || 'Top Challenges'}</span>
            </div>
            <h2 className="text-4xl font-bold text-text-primary afx-gradient-heading">
              {title || 'Popular Challenges'}
            </h2>
            <p className="text-text-secondary text-lg mt-2">
              {subtext || 'Compare the top-rated prop firm evaluation programs ranked by trader popularity.'}
            </p>
          </div>
          <Link
            href="/challenges"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-border-subtle text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/40 transition-all"
          >
            {ctaText || 'View All Challenges'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {top.map((challenge, index) => {
            const firm = getFirm(challenge.firm_id)
            if (!firm) return null
            const rank = index + 1

            return (
              <AFXCard
                key={challenge.id}
                className="bg-bg-surface border border-border-subtle p-5 flex flex-col sm:flex-row items-center gap-5 hover:border-accent-cyan/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-300 group overflow-hidden relative"
              >
                {rank <= 3 && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-cyan to-accent-purple opacity-60" />
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                  rank === 1 ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400' :
                  rank === 2 ? 'bg-gray-400/10 border border-gray-400/30 text-gray-400' :
                  rank === 3 ? 'bg-orange-400/10 border border-orange-400/30 text-orange-400' :
                  'bg-bg-base border border-border-subtle text-text-muted'
                }`}>
                  {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                </div>

                <div className="w-10 h-10 bg-bg-base rounded-xl flex items-center justify-center border border-border-subtle overflow-hidden shrink-0">
                  {firm.logo_url ? (
                    <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <span className="text-accent-cyan font-bold text-sm">{firm.name[0]}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-text-primary group-hover:text-accent-cyan transition-colors">{firm.name}</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-bg-base border border-border-subtle/50">
                      {challenge.steps === 0 ? 'Instant' : `${challenge.steps}-Step`}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">
                    ${(challenge.account_size / 1000).toFixed(0)}K Account • Target: {challenge.profit_target_p1}% • Drawdown: {challenge.max_loss_pct}%
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Price</p>
                    <p className="text-lg font-bold text-accent-cyan font-mono">${challenge.price}</p>
                  </div>
                  <a
                    href={challenge.affiliate_url || firm.affiliate_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-blue text-xs whitespace-nowrap hover:opacity-90 transition-opacity"
                  >
                    Buy Now
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </AFXCard>
            )
          })}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href="/challenges"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base hover:opacity-90 transition-opacity"
          >
            View All Challenges
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeChallenges
