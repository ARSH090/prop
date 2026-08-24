'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, TrendingUp } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

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
  'FTMO': 'from-blue-500 to-blue-700',
  'FundedNext': 'from-purple-500 to-purple-700',
  '5ers': 'from-cyan-500 to-cyan-700',
  'TopStep': 'from-green-500 to-green-700',
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function NotificationToast({ livePayouts }: { livePayouts?: PayoutNotification[] }) {
  const [fetchedPayouts, setFetchedPayouts] = useState<PayoutNotification[]>([])

  // Dynamically load listed firms & payouts from API
  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, payoutsRes] = await Promise.all([
          fetch('/api/firms').catch(() => null),
          fetch('/api/admin/payouts').catch(() => null),
        ])

        const activeFirmsMap: Record<string, { name: string; logoUrl?: string }> = {}

        if (firmsRes && firmsRes.ok) {
          const firmsData = await firmsRes.json()
          const list = firmsData.firms || []
          list.forEach((f: any) => {
            if (f.name) {
              const info = { name: f.name, logoUrl: f.logo_url }
              if (f.id) activeFirmsMap[f.id] = info
              activeFirmsMap[f.name.toLowerCase().trim()] = info
            }
          })
        }

        if (payoutsRes && payoutsRes.ok) {
          const payData = await payoutsRes.json()
          const rawPayouts = payData.data || []

          const validPayouts: PayoutNotification[] = []

          rawPayouts.forEach((p: any, idx: number) => {
            if (p.is_verified === false) return

            // Match payout to listed firm (by firm_id or firm name)
            const matchedFirm =
              activeFirmsMap[p.firm_id] ||
              activeFirmsMap[p.firmName?.toLowerCase()?.trim()] ||
              activeFirmsMap[p.firm_name?.toLowerCase()?.trim()]

            // ONLY payouts of listed firms can be shown
            if (!matchedFirm && Object.keys(activeFirmsMap).length > 0) return

            const firmName = matchedFirm?.name || p.firmName || p.firm_name || 'Prop Firm'
            const firmLogo = matchedFirm?.logoUrl || p.firmLogo || p.logo_url

            validPayouts.push({
              id: p.id || `fetched-${idx}`,
              traderName: p.trader_display_name || p.traderName || p.trader_alias || 'Trader',
              amount: Number(p.amount || p.payout_amount || 0),
              firmName,
              firmLogo,
              accountSize: p.account_size
                ? typeof p.account_size === 'number'
                  ? `${p.account_size / 1000}K`
                  : `${p.account_size}`
                : '100K',
              region: p.region || 'India',
            })
          })

          if (validPayouts.length > 0) {
            setFetchedPayouts(validPayouts)
          }
        }
      } catch (err) {
        console.error('NotificationToast fetch error:', err)
      }
    }

    loadData()
  }, [])

  const pool =
    livePayouts && livePayouts.length > 0
      ? livePayouts
      : fetchedPayouts.length > 0
      ? fetchedPayouts
      : DEMO_PAYOUTS

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
      className={`fixed bottom-6 left-4 z-50 max-w-sm sm:max-w-[400px] w-[calc(100%-2rem)] sm:w-full pointer-events-auto ${exiting ? 'animate-slide-out-left' : 'animate-slide-in-left'
        }`}
    >
      <div className="relative bg-bg-surface/95 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 sm:p-5 shadow-2xl shadow-black/60 neon-border-cyan overflow-hidden">
        {/* Gradient accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b ${gradient}`} />

        <div className="flex items-center gap-3.5 sm:gap-4 pl-1.5 sm:pl-2">
          {/* Logo of FIRM with thin frame of very Lite greyish White colour */}
          <div className="shrink-0 p-0.5 rounded-xl border border-slate-200/40 shadow-[0_0_8px_rgba(226,232,240,0.15)] ring-1 ring-slate-200/20 bg-zinc-900/90 overflow-hidden flex items-center justify-center">
            <PropFirmLogo
              name={current.firmName}
              logoUrl={current.firmLogo}
              className="w-11 h-11 rounded-lg"
              frame="thin-lite-grey"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-accent-green shrink-0 animate-pulse" />
              <span className="text-[11px] font-black text-accent-green uppercase tracking-widest">Live Payout</span>
            </div>
            <p className="text-[13.5px] sm:text-sm text-text-primary font-black leading-snug">
              <span className="text-accent-cyan font-black">{current.traderName}</span> received{' '}
              <span className="text-accent-green font-black text-base">{formatAmount(current.amount)}</span>
            </p>
            <p className="text-xs text-slate-100 font-mono mt-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-black">{current.firmName}</span>
              <span className="text-slate-400 font-medium">·</span>
              <span className="text-slate-200">{current.accountSize} ACCOUNT</span>
              <span className="text-slate-400 font-medium">·</span>
              <span className="text-slate-200">{current.region}</span>
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => {
              setDismissed(true)
              setVisible(false)
            }}
            className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors self-start -mr-1"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
