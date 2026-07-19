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

const ASSET_TABS = [
  { id: 'all',     label: 'All',     badge: undefined },
  { id: 'forex',   label: 'Forex',   badge: undefined,  activeClass: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20' },
  { id: 'futures', label: 'Futures', badge: undefined,  activeClass: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-bg-base shadow-md shadow-cyan-500/20' },
  { id: 'crypto',  label: 'Crypto',  badge: 'NEW',      activeClass: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/20' },
]

export function FeaturedFirms({ firms }: FeaturedFirmsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeAsset, setActiveAsset] = useState('all')

  const filteredFirms = activeAsset === 'all'
    ? firms
    : firms.filter((f) => f.category?.includes(activeAsset))

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
            Featured Prop Firms
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Compare premium programs, get exclusive discount codes, and buy with one click.
          </p>

          {/* ── Asset Class Filter Tabs ── */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 bg-bg-surface border border-border-subtle rounded-full p-1 shadow-lg shadow-black/20">
              {ASSET_TABS.map((tab) => {
                const isActive = activeAsset === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAsset(tab.id)}
                    className={`relative flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? tab.id === 'all'
                          ? 'bg-text-primary text-bg-base shadow-md'
                          : tab.activeClass ?? ''
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-base/60'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {filteredFirms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirms.map((firm, i) => (
              <AFXCard
                key={firm.id}
                className={`relative flex flex-col justify-between group overflow-hidden border transition-all duration-300 bg-bg-card/50 hover:-translate-y-1 ${
                  i === 0 && activeAsset === 'all'
                    ? 'neon-border-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                    : 'border-border-subtle hover:border-accent-cyan/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                }`}
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
                          <span className="flex items-center text-yellow-400">
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
                        className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${
                          cat === activeAsset && activeAsset !== 'all'
                            ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                            : 'bg-bg-surface border-border-subtle text-text-muted'
                        }`}
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
        ) : (
          <div className="text-center py-16 border border-border-subtle rounded-3xl bg-bg-surface/50">
            <p className="text-text-secondary text-sm font-semibold">No {activeAsset} firms found.</p>
            <button
              onClick={() => setActiveAsset('all')}
              className="mt-3 text-accent-cyan text-xs underline hover:no-underline"
            >
              Show all firms
            </button>
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
