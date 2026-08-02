'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXBadge } from '@/components/ui/afx-badge'
import { AFXButton } from '@/components/ui/afx-button'
import { RatingBadge } from '@/components/ui/rating-badge'
import { Star, ExternalLink } from 'lucide-react'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'

interface Firm {
  id: string
  slug: string
  name: string
  type: string
  category: string[]
  logo_url: string
  country: string
  platforms: string[]
  max_allocation: number
  rating: number
  review_count: number
  website_url: string
  affiliate_url: string
  is_featured: boolean
  is_verified: boolean
  description: string
  rules: Record<string, any>
  activeDeal?: {
    id: string
    code: string
    title: string
    discount_label: string
  }
}

interface FeaturedFirmsProps {
  firms: Firm[]
  title?: string
  subtext?: string
}

export function FeaturedFirms({ firms, title, subtext }: FeaturedFirmsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleBuyNow = async (firm: Firm) => {
    const deal = firm.activeDeal
    const code = deal ? deal.code : 'AFX-VTX25'

    try {
      await navigator.clipboard.writeText(code)
      setToastMessage(`Your code: ${code} — copied to clipboard ✅`)
      setTimeout(() => setToastMessage(null), 3000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }

    if (deal) {
      fetch(`/api/deals/${deal.id}/click`, { method: 'POST' }).catch((err) =>
        console.error('Click logging failed:', err)
      )
    }

    const url = firm.affiliate_url || firm.website_url
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="py-20 bg-bg-base relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-text-primary mb-2 afx-gradient-heading">
            {title || 'Featured Prop Firms'}
          </h2>
          <p className="text-text-secondary text-lg">
            {subtext || 'Compare premium programs, get exclusive discount codes, and buy with one click.'}
          </p>
        </div>

        {firms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firms.map((firm, i) => (
              <AFXCard
                key={firm.id}
                className={`relative flex flex-col justify-between group overflow-hidden border transition-all duration-500 bg-bg-card/50 hover:-translate-y-2 ${
                  i === 0
                    ? 'neon-border-cyan hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]'
                    : 'border-border-default hover:border-accent-cyan/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]'
                }`}
              >
                {/* Glow Overlay */}
                <div className="absolute -inset-px bg-gradient-to-br from-accent-cyan/0 via-accent-cyan/0 to-accent-purple/0 group-hover:from-accent-cyan/5 group-hover:to-accent-purple/10 rounded-3xl transition-all duration-500 pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-border-default group-hover:border-accent-cyan/30 transition-colors ${isDarkLogo(firm.name) ? 'bg-[#0b121f]' : 'bg-white'}`}>
                        <img
                          src={getCleanLogoUrl(firm.name, firm.logo_url)}
                          alt={`${firm.name} Logo`}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getCleanLogoUrl(firm.name, null)
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                          {firm.name}
                        </h3>
                        <div className="mt-1">
                          <RatingBadge rating={firm.rating} reviewCount={firm.review_count} fontVariant="sans" />
                        </div>
                      </div>
                    </div>
                    {firm.activeDeal && (
                      <AFXBadge variant="live">
                        {firm.activeDeal.discount_label}
                      </AFXBadge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {firm.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-default text-xs">
                    <div>
                      <span className="text-text-muted block mb-1">Max Allocation</span>
                      <span className="font-semibold text-text-primary font-mono">
                        ${firm.max_allocation?.toLocaleString('en-US') || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block mb-1">Platforms</span>
                      <span className="font-semibold text-text-primary">
                        {firm.platforms?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {firm.category?.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded border border-border-default text-[10px] uppercase font-bold tracking-wider bg-bg-base text-text-primary"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 mt-6 border-t border-border-default flex justify-between items-center gap-4">
                  <span className="text-text-primary text-xs font-mono font-bold bg-bg-base/80 border border-border-default px-2.5 py-1 rounded-xl">
                    {firm.activeDeal ? `Code: ${firm.activeDeal.code}` : 'No Active Code'}
                  </span>
                  <AFXButton
                    variant="primary"
                    className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 font-semibold group/btn flex items-center gap-1.5 text-xs py-2 px-4"
                    onClick={() => handleBuyNow(firm)}
                  >
                    Buy Now
                    <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </AFXButton>
                </div>
              </AFXCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-border-default rounded-3xl bg-bg-surface/50">
            <p className="text-text-secondary text-sm font-semibold">No prop firms found for this category.</p>
          </div>
        )}
      </div>

      {/* Copy Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-bg-surface border border-accent-cyan/40 px-5 py-3 rounded-xl shadow-2xl shadow-accent-cyan/10 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-sm font-bold">
            ✓
          </div>
          <span className="text-text-primary text-sm font-semibold font-mono">
            {toastMessage}
          </span>
        </div>
      )}
    </section>
  )
}
export default FeaturedFirms
