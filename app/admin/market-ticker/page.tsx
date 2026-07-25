'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Save, TrendingUp, RefreshCw } from 'lucide-react'

interface Ticker {
  symbol: string
  price: number
  change_pct: number
}

export default function AdminTickerPage() {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [loading, setLoading] = useState(false)
  const [autoUpdating, setAutoUpdating] = useState(false)

  const loadTickers = async () => {
    try {
      const res = await fetch('/api/admin/market-ticker')
      const data = await res.json()
      if (data.success && data.tickers) {
        setTickers(data.tickers)
      }
    } catch (e) {
      console.error('Failed to load tickers', e)
    }
  }

  useEffect(() => {
    loadTickers()
  }, [])

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

  const handleSave = async () => {
    setLoading(true)
    try {
      // Save all overrides in parallel
      await Promise.all(
        tickers.map((t) =>
          fetch('/api/admin/market-ticker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t),
          })
        )
      )
      alert('Pricing overrides saved successfully!')
      loadTickers()
    } catch (e) {
      console.error('Failed to save overrides', e)
      alert('Failed to save overrides. Please check logs.')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoUpdate = async () => {
    setAutoUpdating(true)
    try {
      const res = await fetch('/api/admin/market-ticker/auto-update', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert('Automatic pricing feeds updated successfully from Yahoo Finance!')
        loadTickers()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (e) {
      console.error('Auto update request failed', e)
      alert('Failed to connect to update server.')
    } finally {
      setAutoUpdating(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Live Pricing Override
          </h1>
          <p className="text-text-secondary text-sm">Force override pricing parameters or run live market sync.</p>
        </div>
        <div className="flex gap-3">
          <AFXButton
            onClick={handleAutoUpdate}
            disabled={autoUpdating}
            variant="secondary"
            className="border-accent-cyan/30 hover:border-accent-cyan/60 hover:bg-accent-cyan/10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${autoUpdating ? 'animate-spin' : ''}`} />
            {autoUpdating ? 'Syncing...' : 'Sync Live Prices'}
          </AFXButton>
          
          <AFXButton
            onClick={handleSave}
            disabled={loading || tickers.length === 0}
            variant="primary"
            className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center gap-2 px-6 py-2.5 rounded-xl text-bg-base text-sm"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Overrides'}
          </AFXButton>
        </div>
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
