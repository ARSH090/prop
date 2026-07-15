'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXBadge } from '@/components/ui/afx-badge'
import { AFXButton } from '@/components/ui/afx-button'
import { Star, ExternalLink } from 'lucide-react'

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
}

export function FeaturedFirms({ firms }: FeaturedFirmsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleBuyNow = async (firm: Firm) => {
    const deal = firm.activeDeal
    const code = deal ? deal.code : 'AFX-VTX25'

    // 1. Copy code to clipboard
    try {
      await navigator.clipboard.writeText(code)
      setToastMessage(`Your code: ${code} — copied to clipboard ✅`)
      setTimeout(() => {
        setToastMessage(null)
      }, 3000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }

    // 2. Log click to Firestore (fire-and-forget)
    if (deal) {
      fetch(`/api/deals/${deal.id}/click`, { method: 'POST' }).catch((err) =>
        console.error('Click logging failed:', err)
      )
    }

    // 3. Open affiliate url in a new tab
    const url = firm.affiliate_url || firm.website_url
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="py-20 bg-bg-base relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-2 afx-gradient-heading">
            Featured Prop Firms
          </h2>
          <p className="text-text-secondary text-lg">
            Compare premium programs, get exclusive discount codes, and buy with one click.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firms.map((firm) => (
            <AFXCard
              key={firm.id}
              className="relative flex flex-col justify-between group overflow-hidden border border-border-subtle hover:border-accent-cyan/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:-translate-y-1 transition-all duration-300 bg-bg-card/50"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center overflow-hidden border border-border-subtle group-hover:border-accent-cyan/30 transition-colors">
                      {firm.logo_url ? (
                        <img
                          src={firm.logo_url}
                          alt={`${firm.name} Logo`}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-xl font-bold font-mono text-accent-cyan">
                          {firm.name[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                        {firm.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
                        <span className="flex items-center text-accent-yellow">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold ml-0.5">{firm.rating}</span>
                        </span>
                        <span className="text-text-muted">({firm.review_count} reviews)</span>
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
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-subtle text-xs">
                  <div>
                    <span className="text-text-muted block mb-1">Max Allocation</span>
                    <span className="font-semibold text-text-primary font-mono">
                      ${firm.max_allocation?.toLocaleString() || 'N/A'}
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
                      className="px-2 py-0.5 rounded bg-bg-surface border border-border-subtle text-[10px] uppercase font-bold text-text-muted tracking-wider"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-border-subtle flex justify-between items-center gap-4">
                <span className="text-text-muted text-xs font-mono">
                  {firm.activeDeal ? `Code: ${firm.activeDeal.code}` : 'No Active Code'}
                </span>
                <AFXButton
                  variant="primary"
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 font-semibold group flex items-center gap-1.5"
                  onClick={() => handleBuyNow(firm)}
                >
                  Buy Now
                  <ExternalLink className="w-4 h-4" />
                </AFXButton>
              </div>
            </AFXCard>
          ))}
        </div>
      </div>

      {/* Floating Notification Toast */}
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
