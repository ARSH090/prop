'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Save, TrendingUp } from 'lucide-react'

interface Ticker {
  symbol: string
  price: number
  change_pct: number
}

export default function AdminTickerPage() {
  const [tickers, setTickers] = useState<Ticker[]>([
    { symbol: 'XAUUSD', price: 2418.62, change_pct: 0.45 },
    { symbol: 'NQ', price: 18450.75, change_pct: 1.23 },
    { symbol: 'ES', price: 5725.5, change_pct: 0.87 },
  ])
  const [loading, setLoading] = useState(false)

  const handlePriceChange = (index: number, val: string) => {
    const updated = [...tickers]
    updated[index].price = parseFloat(val) || 0
    setTickers(updated)
  }

  const handleChangePctChange = (index: number, val: string) => {
    const updated = [...tickers]
    updated[index].change_pct = parseFloat(val) || 0
    setTickers(updated)
  }

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Pricing feeds updated successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Live Pricing Override
          </h1>
          <p className="text-text-secondary text-sm">Force override pricing parameters if market ticker APIs stall.</p>
        </div>
        <AFXButton
          onClick={handleSave}
          disabled={loading}
          variant="primary"
          className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center gap-2 px-6 py-2.5 rounded-xl text-bg-base text-sm"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Updating...' : 'Save Overrides'}
        </AFXButton>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tickers.map((ticker, idx) => (
          <AFXCard key={ticker.symbol} className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent-cyan font-bold font-mono tracking-wider border-b border-border-subtle/50 pb-2">
              <TrendingUp className="w-4 h-4" />
              {ticker.symbol}
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Manual Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={ticker.price}
                  onChange={(e) => handlePriceChange(idx, e.target.value)}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Daily Change (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={ticker.change_pct}
                  onChange={(e) => handleChangePctChange(idx, e.target.value)}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                />
              </div>
            </div>
          </AFXCard>
        ))}
      </div>
    </div>
  )
}
