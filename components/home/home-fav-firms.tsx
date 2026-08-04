'use client'

import React from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { Heart, ArrowRight, Star } from 'lucide-react'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface FavFirm {
  id: string
  slug: string
  name: string
  logo_url?: string
  rating?: number
  review_count?: number
  description?: string
  is_featured?: boolean
  circle_crop_logo?: boolean
}

interface HomeFavFirmsProps {
  firms?: FavFirm[]
  badge?: string
  title?: string
  subtext?: string
  ctaText?: string
}

export function HomeFavFirms({
  firms = [],
  badge,
  title,
  subtext,
  ctaText,
}: HomeFavFirmsProps) {
  // Show top 6 featured/highest rated firms as "community favorites"
  const top = firms.slice(0, 6)

  if (top.length === 0) return null

  return (
    <section className="py-20 bg-bg-base relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 rounded-full opacity-5 blur-3xl bottom-0 right-0"
          style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 mb-3">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">{badge || 'Favorite Firms'}</span>
            </div>
            <h2 className="text-4xl font-bold text-text-primary afx-gradient-heading">
              {title || 'Community Favorites'}
            </h2>
            <p className="text-text-secondary text-lg mt-2">
              {subtext || 'The most loved prop firms in the ANURAJ FX community—sign in to save your own favorites.'}
            </p>
          </div>
          <Link
            href="/favorites"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-border-subtle text-text-secondary hover:text-pink-400 hover:border-pink-400/40 transition-all"
          >
            {ctaText || 'My Favorites'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.map((firm) => {
            const logoUrl = getCleanLogoUrl(firm.name, firm.logo_url)
            const darkLogo = isDarkLogo(firm.name)
            return (
              <Link
                key={firm.id}
                href={`/firms/${firm.slug}`}
                className="block"
              >
                <AFXCard className="bg-bg-surface border border-border-subtle p-5 hover:border-pink-400/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] transition-all duration-300 group h-full">
                  <div className="flex items-start gap-4">
                    <PropFirmLogo
                      name={firm.name}
                      logoUrl={firm.logo_url}
                      circleCrop={firm.circle_crop_logo}
                      className="w-14 h-14 rounded-2xl group-hover:border-pink-400/30 transition-colors"
                    />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary group-hover:text-pink-400 transition-colors truncate">{firm.name}</h3>
                    {firm.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-text-secondary font-mono">{firm.rating.toFixed(1)}</span>
                        {firm.review_count && (
                          <span className="text-[10px] text-text-muted">({firm.review_count} reviews)</span>
                        )}
                      </div>
                    )}
                    {firm.description && (
                      <p className="text-text-muted text-xs mt-1.5 line-clamp-2">{firm.description}</p>
                    )}
                  </div>
                  <Heart className="w-4 h-4 text-pink-400/40 group-hover:text-pink-400 group-hover:fill-pink-400 transition-all shrink-0 mt-0.5" />
                </div>
              </AFXCard>
            </Link>
          )})}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-pink-400/30 text-pink-400 hover:bg-pink-400/10 transition-all md:hidden"
          >
            My Favorites
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeFavFirms
