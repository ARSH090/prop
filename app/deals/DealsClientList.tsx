'use client'

import React, { useState } from 'react'
import { Copy, Clock, TrendingUp, Gift } from 'lucide-react'
import { AFXCard } from '@/components/ui/afx-card'

interface Deal {
  id: string
  code: string
  title: string
  discount_label: string
  description: string
  is_featured: boolean
  expires_at: any
  deal_type?: string
  firms?: {
    name: string
    slug: string
    affiliate_url: string
  } | null
}

interface DealsClientListProps {
  initialDeals: Deal[]
}

const DEAL_TABS = [
  { id: 'all', label: 'All Offers' },
  { id: 'challenge', label: 'Challenge Deals' },
  { id: 'cash_back', label: 'Cash Back Deals' },
  { id: 'extra_account', label: 'Extra Account Deals' },
] as const

export default function DealsClientList({ initialDeals }: DealsClientListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'challenge' | 'cash_back' | 'extra_account'>('all')

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleDealClick = async (dealId: string) => {
    try {
      await fetch(`/api/deals/${dealId}/click`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  const daysRemaining = (expiresAt: any) => {
    if (!expiresAt) return 30
    const expiryTime = expiresAt.seconds ? expiresAt.seconds * 1000 : new Date(expiresAt).getTime()
    const days = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const filteredDeals = initialDeals.filter((deal) => {
    if (activeTab === 'all') return true
    return deal.deal_type === activeTab
  })

  if (initialDeals.length === 0) {
    return (
      <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
        <p className="text-text-secondary text-lg">No active deals right now</p>
        <p className="text-text-muted text-sm mt-2 font-mono">Check back soon for exclusive offers!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 4 Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-border-subtle/50 pb-px">
        {DEAL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-accent-cyan text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredDeals.length === 0 ? (
          <div className="border border-border-subtle bg-bg-surface/30 p-12 text-center rounded-2xl">
            <p className="text-text-secondary text-sm font-semibold">No active promo codes in this category.</p>
          </div>
        ) : (
          filteredDeals.map((deal) => {
          const daysLeft = daysRemaining(deal.expires_at)
          const isExpiring = daysLeft <= 3

          return (
            <div
              key={deal.id}
              className="bg-bg-surface border border-border-subtle hover:border-accent-cyan/40 transition-all duration-300 p-6 rounded-2xl"
            >
              <div className="grid md:grid-cols-4 gap-6 items-center">
                {/* Left Section */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-border-subtle rounded-xl flex items-center justify-center">
                        <Gift className="w-8 h-8 text-accent-cyan" />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest font-mono">
                          {deal.firms?.name || 'Partner Program'}
                        </p>
                        {deal.is_featured && (
                          <span className="px-2 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">{deal.title}</h3>
                      <p className="text-text-secondary text-sm mt-1">{deal.description}</p>
                    </div>
                  </div>
                </div>

                {/* Middle Section */}
                <div className="md:col-span-1">
                  <div className="bg-bg-base/40 p-4 rounded-xl text-center border border-border-subtle/50">
                    <p className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 text-lg font-mono font-bold inline-block">
                      {deal.discount_label}
                    </p>
                    <div className="flex items-center gap-1.5 justify-center text-text-muted text-xs mt-3 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {daysLeft} days {daysLeft === 1 ? 'left' : 'remaining'}
                      </span>
                    </div>
                    {isExpiring && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 font-mono uppercase">
                        Expires Soon!
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className="md:col-span-1 flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={deal.code}
                      readOnly
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-text-primary font-mono text-center text-sm outline-none"
                    />
                    <button
                      onClick={() => handleCopyCode(deal.code)}
                      className="absolute right-2 top-2 p-1 hover:bg-bg-surface rounded-lg transition-colors"
                      title="Copy promo code"
                    >
                      <Copy className="w-4 h-4 text-accent-cyan" />
                    </button>
                  </div>
                  {copiedCode === deal.code && (
                    <p className="text-accent-green text-[10px] text-center font-bold font-mono">
                      COPIED!
                    </p>
                  )}

                  <a
                    href={deal.firms?.affiliate_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDealClick(deal.id)}
                    className="px-4 py-2.5 rounded-xl font-bold text-bg-base text-center text-sm hover:opacity-90 transition-opacity bg-gradient-to-r from-accent-cyan to-accent-blue"
                  >
                    Get Deal →
                  </a>
                </div>
              </div>
            </div>
          )
        })
      )}
      </div>

      {/* Info Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-lg font-bold text-text-primary">Verified Offers</h3>
          </div>
          <p className="text-text-secondary text-sm">
            All codes are updated and tested directly with prop firm managers to prevent expirations.
          </p>
        </div>
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-lg font-bold text-text-primary">Exclusive Access</h3>
          </div>
          <p className="text-text-secondary text-sm">
            Unlock promo codes negotiated specifically for Indian traders to cut evaluation fees.
          </p>
        </div>
        <div className="bg-bg-surface border border-border-subtle p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-lg font-bold text-text-primary">Countdown Alerts</h3>
          </div>
          <p className="text-text-secondary text-sm">
            Watch expiry indicators to secure slots before challenges go off rotation.
          </p>
        </div>
      </div>
    </div>
  )
}
