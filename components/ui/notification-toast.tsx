'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DollarSign, X, TrendingUp } from 'lucide-react'

interface PayoutNotification {
  id: string
  traderName: string
  amount: number
  firmName: string
  firmLogo?: string
  accountSize: string
  region: string
}

const DEMO_PAYOUTS: PayoutNotification[] = [
  { id: '1', traderName: 'Rahul S.', amount: 3250, firmName: 'FTMO', accountSize: '50K', region: 'India' },
  { id: '2', traderName: 'Arjun K.', amount: 8420, firmName: 'FundedNext', accountSize: '100K', region: 'India' },
  { id: '3', traderName: 'Priya M.', amount: 1875, firmName: '5ers', accountSize: '25K', region: 'Singapore' },
  { id: '4', traderName: 'Ahmed T.', amount: 12500, firmName: 'TopStep', accountSize: '150K', region: 'UAE' },
  { id: '5', traderName: 'Vikram D.', amount: 5600, firmName: 'FTMO', accountSize: '100K', region: 'India' },
  { id: '6', traderName: 'Ankit R.', amount: 2200, firmName: 'FundedNext', accountSize: '50K', region: 'India' },
  { id: '7', traderName: 'Maria L.', amount: 9800, firmName: 'TopStep', accountSize: '100K', region: 'Europe' },
  { id: '8', traderName: 'Karan B.', amount: 4100, firmName: '5ers', accountSize: '50K', region: 'India' },
]

const FIRM_COLORS: Record<string, string> = {
  'FTMO':       'from-blue-500 to-blue-700',
  'FundedNext': 'from-purple-500 to-purple-700',
  '5ers':       'from-cyan-500 to-cyan-700',
  'TopStep':    'from-green-500 to-green-700',
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function NotificationToast({ livePayouts }: { livePayouts?: PayoutNotification[] }) {
  const pool = livePayouts && livePayouts.length > 0 ? livePayouts : DEMO_PAYOUTS
  const [current, setCurrent] = useState<PayoutNotification | null>(null)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [idx, setIdx] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const showNext = useCallback(() => {
    if (dismissed) return
    const next = pool[idx % pool.length]
    setCurrent(next)
    setVisible(true)
    setExiting(false)
    setIdx((i) => i + 1)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setExiting(true)
      setTimeout(() => setVisible(false), 400)
    }, 5000)
  }, [idx, pool, dismissed])

  useEffect(() => {
    if (dismissed) return
    const initial = setTimeout(showNext, 3000)
    return () => clearTimeout(initial)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dismissed) return
    const interval = setInterval(showNext, 9000)
    return () => clearInterval(interval)
  }, [showNext, dismissed])

  if (!visible || !current) return null

  const gradient = FIRM_COLORS[current.firmName] || 'from-cyan-500 to-blue-600'

  return (
    <div
      className={`fixed bottom-6 left-4 z-50 max-w-xs w-full pointer-events-auto ${
        exiting ? 'animate-slide-out-left' : 'animate-slide-in-left'
      }`}
    >
      <div className="relative bg-bg-surface border border-border-subtle rounded-2xl p-4 shadow-2xl shadow-black/40 neon-border-cyan overflow-hidden">
        {/* Gradient accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${gradient}`} />

        <div className="flex items-start gap-3 pl-2">
          {/* Icon */}
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
            <DollarSign className="w-4 h-4 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <TrendingUp className="w-3 h-3 text-accent-green shrink-0" />
              <span className="text-[10px] font-bold text-accent-green uppercase tracking-wider">Live Payout</span>
            </div>
            <p className="text-xs text-text-primary font-semibold leading-tight">
              <span className="text-accent-cyan">{current.traderName}</span> received{' '}
              <span className="text-accent-green font-bold">{formatAmount(current.amount)}</span>
            </p>
            <p className="text-[10px] text-text-muted font-mono mt-0.5">
              {current.firmName} · {current.accountSize} account · {current.region}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => { setDismissed(true); setVisible(false) }}
            className="shrink-0 p-1 rounded-lg hover:bg-bg-base text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
