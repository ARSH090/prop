'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXBadge } from '@/components/ui/afx-badge'

interface Deal {
  id: string
  code: string
  title: string
  discount_label: string
  description: string
  expires_at: string
  firm_id: string
  is_featured: boolean
}

interface FeaturedDealsProps {
  deals?: Deal[]
  title?: string
  subtext?: string
}

export function FeaturedDeals({ deals = [], title, subtext }: FeaturedDealsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const daysRemaining = (expiresAt: string) => {
    if (!expiresAt) return 30
    const expiryTime = new Date(expiresAt).getTime()
    const days = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  // Slice first 4 featured deals to show on homepage
  const featured = (deals && deals.length > 0 ? deals : [])
    .filter(d => d.is_featured !== false)
    .slice(0, 4)

  if (featured.length === 0) return null

  return (
    <section className="py-20 bg-bg-base border-t border-border-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-4">
              <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">PROMOS</span>
            </div>
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">{title || 'Featured Coupons & Deals'}</h2>
            <p className="text-text-secondary mt-1">{subtext || 'Exclusive verified discount codes updated daily'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((deal) => {
            const daysLeft = daysRemaining(deal.expires_at)
            const isCopied = copiedCode === deal.code

            return (
              <AFXCard key={deal.id} className="group hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/5 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest font-mono mb-1">
                        {deal.firm_id.replace('-', ' ').toUpperCase()}
                      </p>
                      <p className="font-mono text-base font-bold text-accent-cyan group-hover:text-white transition-colors">
                        {deal.code}
                      </p>
                    </div>
                    <AFXBadge variant="code" className="text-xs font-bold font-mono px-2 py-0.5 rounded flex-shrink-0 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                      {deal.discount_label}
                    </AFXBadge>
                  </div>

                  <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{deal.title}</h4>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">{deal.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-5">
                  <span className="text-text-muted text-[10px] font-medium font-mono">
                    {daysLeft > 0 ? `Expires in ${daysLeft}d` : 'Expires today'}
                  </span>
                  <button
                    onClick={() => handleCopyCode(deal.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      isCopied
                        ? 'bg-accent-green/20 text-accent-green'
                        : 'bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20'
                    }`}
                  >
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </AFXCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default FeaturedDeals
