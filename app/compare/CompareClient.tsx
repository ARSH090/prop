'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { Star, Heart, Check, Copy, ExternalLink, ArrowRight, TrendingUp, ShieldAlert, Sparkles, Activity, Layers, Calendar, MessageSquare, Percent } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import Link from 'next/link'
import {
  getRadarComparisonMetrics,
  extractFirmRuleFlags,
  parseCleanNumber,
  NormalizedMetric,
} from '@/lib/utils/comparison-normalization'

interface Challenge {
  id: string
  firm_id: string
  challenge_name?: string
  challenge_type?: string
  account_size: number
  steps: number | string
  profit_target_p1?: number | string
  profit_target_p2?: number | string
  profit_target_p3?: number | string
  daily_loss_pct?: number | string
  max_loss_pct?: number | string
  pt_dd_ratio?: string
  profit_split_pct?: number | string
  profit_split_percent?: number | string
  payout_freq?: string
  price: number | string
  original_price?: number | string
  currency?: string
  coupon_code?: string
  discount_label?: string
  deal_id?: string
  affiliate_url?: string
  cta_text?: string

  // Futures specific fields
  activation_fee?: string
  max_contract_size_minis?: number
  max_contract_size_micros?: number
  profit_target?: number
  max_loss?: number
  max_loss_type?: string
  max_payout_amount?: number
  min_payout_threshold?: number
  consistency_eval_percent?: number
  min_trading_days?: number
}

interface Firm {
  id: string
  slug?: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  likes_count?: number
  category?: string[]
  type: string
  platforms?: string[]
  cta_text?: string
  affiliate_url?: string
  website_url?: string
  coupon_code_custom?: string
  discount_label_custom?: string
  profit_split_custom?: string
  payout_custom?: string
  circle_crop_logo?: boolean
  logo_frame?: string
  rules?: any
}

interface Deal {
  id: string
  firm_id: string
  code: string
  title?: string
  discount_label?: string
  tag?: string
  description?: string
  is_featured?: boolean
  is_best_offer?: boolean
  is_main_offer?: boolean
  status?: string
}

interface CompareClientProps {
  firms: Firm[]
  challenges: Challenge[]
  deals?: Deal[]
}

const TABS = [
  { id: 'forex', label: 'Forex / CFDs', icon: '📈' },
  { id: 'futures', label: 'Futures', icon: '⚡' },
  { id: 'crypto', label: 'Crypto', icon: '🪙' },
] as const

/**
 * Helper to ensure discount text displays as prominent XX% OFF
 */
function formatDiscountLabel(discount?: string): string {
  if (!discount) return '50% OFF'
  const trimmed = discount.trim()
  if (trimmed.toUpperCase().includes('%')) {
    if (trimmed.toUpperCase().includes('OFF')) return trimmed.toUpperCase()
    return `${trimmed.toUpperCase()} OFF`
  }
  const numMatch = trimmed.match(/\d+/)
  if (numMatch) {
    return `${numMatch[0]}% OFF`
  }
  if (
    trimmed.toUpperCase() === 'SPECIAL' ||
    trimmed.toUpperCase() === 'PROMO' ||
    trimmed.toUpperCase() === 'VERIFIED' ||
    trimmed.toUpperCase() === 'EXCLUSIVE'
  ) {
    return '50% OFF'
  }
  return `${trimmed.toUpperCase()} OFF`
}

/**
 * Small platform badge renderer for supported platforms
 */
function PlatformLogoItem({ name }: { name: string }) {
  const clean = (name || '').trim().toLowerCase()

  if (clean.includes('ctrader')) {
    return (
      <span
        title="cTrader"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0066CC]/25 border border-[#0066CC]/60 text-[#60B5FF] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(0,102,204,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#40A9FF] shadow-[0_0_6px_#40A9FF]" />
        cTrader
      </span>
    )
  }
  if (clean.includes('mt5') || clean.includes('metatrader 5')) {
    return (
      <span
        title="MetaTrader 5"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1565C0]/25 border border-[#1565C0]/60 text-[#90CAF9] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(21,101,192,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#64B5F6] shadow-[0_0_6px_#64B5F6]" />
        MT5
      </span>
    )
  }
  if (clean.includes('mt4') || clean.includes('metatrader 4')) {
    return (
      <span
        title="MetaTrader 4"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1976D2]/25 border border-[#1976D2]/60 text-[#BBDEFB] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(25,118,210,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#90CAF9] shadow-[0_0_6px_#90CAF9]" />
        MT4
      </span>
    )
  }
  if (clean.includes('match') || clean.includes('matchtrader')) {
    return (
      <span
        title="Match-Trader"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#6A1B9A]/25 border border-[#8E24AA]/60 text-[#E1BEE7] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(142,36,170,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#CE93D8] shadow-[0_0_6px_#CE93D8]" />
        Match-Trader
      </span>
    )
  }
  if (clean.includes('dxtrade') || clean.includes('dx')) {
    return (
      <span
        title="DXTrade"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D97706]/25 border border-[#D97706]/60 text-[#FDE68A] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(217,119,6,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#FCD34D] shadow-[0_0_6px_#FCD34D]" />
        DXTrade
      </span>
    )
  }
  if (clean.includes('tradelocker')) {
    return (
      <span
        title="TradeLocker"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#059669]/25 border border-[#059669]/60 text-[#A7F3D0] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(5,150,105,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#6EE7B7] shadow-[0_0_6px_#6EE7B7]" />
        TradeLocker
      </span>
    )
  }
  if (clean.includes('ninja') || clean.includes('ninjatrader')) {
    return (
      <span
        title="NinjaTrader"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#DC2626]/25 border border-[#DC2626]/60 text-[#FECACA] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(220,38,38,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#FCA5A5] shadow-[0_0_6px_#FCA5A5]" />
        NinjaTrader
      </span>
    )
  }
  if (clean.includes('tradingview')) {
    return (
      <span
        title="TradingView"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2563EB]/25 border border-[#2563EB]/60 text-[#BFDBFE] text-xs font-black tracking-tight uppercase font-mono shadow-[0_0_10px_rgba(37,99,235,0.3)]"
      >
        <span className="w-2 h-2 rounded-full bg-[#60A5FA] shadow-[0_0_6px_#60A5FA]" />
        TradingView
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-black tracking-tight uppercase font-mono shadow-sm"
    >
      <span className="w-2 h-2 rounded-full bg-white" />
      {name}
    </span>
  )
}

/**
 * Static Radar Chart Component with exact 5 normalized metrics (CHG-009 Phase 9)
 */
function StaticRadarChart({
  firmName,
  metrics,
  themeColor = 'cyan',
}: {
  firmName: string
  metrics: NormalizedMetric[]
  themeColor?: 'cyan' | 'purple'
}) {
  const center = 135
  const maxR = 72

  // Extract 0-100 scores into 0.2 to 1.0 coordinates
  const coordScores = metrics.map((m) => Math.max(0.18, Math.min(1.0, m.score / 100)))

  // Coordinates helper for pentagon vertices
  const getCoordinates = (index: number, score: number) => {
    const angle = -Math.PI / 2 + index * ((2 * Math.PI) / 5)
    return {
      x: center + maxR * score * Math.cos(angle),
      y: center + maxR * score * Math.sin(angle),
    }
  }

  // Grid levels (100%, 75%, 50%, 25%)
  const grid100 = Array.from({ length: 5 }).map((_, i) => getCoordinates(i, 1.0))
  const grid75 = Array.from({ length: 5 }).map((_, i) => getCoordinates(i, 0.75))
  const grid50 = Array.from({ length: 5 }).map((_, i) => getCoordinates(i, 0.5))
  const grid25 = Array.from({ length: 5 }).map((_, i) => getCoordinates(i, 0.25))

  // Data polygon points
  const dataPoints = coordScores.map((score, i) => getCoordinates(i, score))
  const polygonPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  const accentColor = themeColor === 'cyan' ? '#00D2FF' : '#C084FC'
  const glowShadow = themeColor === 'cyan' ? 'rgba(0,210,255,0.45)' : 'rgba(192,132,252,0.45)'

  // Vertex label positions (placed outside max radius)
  const labelPositions = Array.from({ length: 5 }).map((_, i) => {
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5)
    const labelDist = maxR + 32
    return {
      x: center + labelDist * Math.cos(angle),
      y: center + (labelDist + 4) * Math.sin(angle),
    }
  })

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#0D0B18]/90 to-[#080612]/90 border border-white/[0.08] rounded-3xl backdrop-blur-2xl shadow-2xl flex-1 min-w-[300px] relative overflow-hidden transition-all duration-300 hover:border-white/20">
      {/* Ambient background glow */}
      <div
        className={`absolute -top-12 ${themeColor === 'cyan' ? '-left-12 bg-accent-cyan/10' : '-right-12 bg-purple-500/10'
          } w-36 h-36 rounded-full blur-[60px] pointer-events-none`}
      />

      <h4 className="text-base font-black uppercase tracking-wider text-white mb-1.5 text-center drop-shadow-md">
        {firmName}
      </h4>
      <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest font-mono mb-4">
        Normalized Metric Score
      </span>

      <svg width="270" height="280" className="overflow-visible select-none">
        {/* Concentric grid rings */}
        <polygon points={grid100.map((p) => `${p.x},${p.y}`).join(' ')} className="fill-none stroke-white/15 stroke-1" />
        <polygon points={grid75.map((p) => `${p.x},${p.y}`).join(' ')} className="fill-none stroke-white/10 stroke-1" />
        <polygon points={grid50.map((p) => `${p.x},${p.y}`).join(' ')} className="fill-none stroke-white/5 stroke-1" />
        <polygon points={grid25.map((p) => `${p.x},${p.y}`).join(' ')} className="fill-none stroke-white/5 stroke-1" />

        {/* Radial axis lines */}
        {grid100.map((p, i) => (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} className="stroke-white/10 stroke-1" />
        ))}

        {/* Data polygon */}
        <polygon
          points={polygonPath}
          fill={`${accentColor}25`}
          stroke={accentColor}
          strokeWidth="2.5"
          style={{ filter: `drop-shadow(0 0 8px ${glowShadow})` }}
        />

        {/* Data vertex dots */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill={accentColor}
            className="stroke-white stroke-2 shadow-md"
          />
        ))}

        {/* Vertex Labels with Actual Value + Normalized Score */}
        {labelPositions.map((pos, i) => {
          const anchor = i === 0 ? 'middle' : i === 1 || i === 2 ? 'start' : 'end'
          const metric = metrics[i]
          return (
            <g key={i}>
              <text
                x={pos.x}
                y={pos.y - 7}
                textAnchor={anchor}
                className="text-[11px] font-extrabold fill-slate-200 tracking-tight uppercase"
              >
                {metric.label}
              </text>
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor={anchor}
                className="text-[12.5px] font-black fill-white font-chunky-num tracking-tight"
              >
                {metric.displayValue}{' '}
                <tspan
                  className={`text-[11px] font-black font-chunky-num ${themeColor === 'cyan' ? 'fill-cyan-400' : 'fill-purple-300'
                    }`}
                >
                  ({metric.score})
                </tspan>
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function CompareClient({ firms, challenges, deals = [] }: CompareClientProps) {
  const [activeTab, setActiveTab] = useState<'forex' | 'futures' | 'crypto'>('forex')

  // Left firm & challenge selections
  const [leftFirmId, setLeftFirmId] = useState<string>('')
  const [leftChallengeId, setLeftChallengeId] = useState<string>('')

  // Right firm & challenge selections
  const [rightFirmId, setRightFirmId] = useState<string>('')
  const [rightChallengeId, setRightChallengeId] = useState<string>('')

  // Interactive likes state: { [firmId]: { count: number, liked: boolean } }
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>({})

  // Copy code feedback state: { [code]: boolean }
  const [copiedCodes, setCopiedCodes] = useState<Record<string, boolean>>({})

  // Filter firms by active tab
  const tabFirms = useMemo(() => {
    return firms.filter((f) => {
      const cats = f.category?.map((c) => c.toLowerCase()) || []
      if (activeTab === 'forex') {
        return cats.includes('forex') || f.type === 'prop_firm' || cats.length === 0
      }
      return cats.includes(activeTab)
    })
  }, [firms, activeTab])

  // Initialize defaults on mount or tab change
  useEffect(() => {
    if (tabFirms.length > 0) {
      // Default Left Firm
      const firstFirm = tabFirms[0]
      setLeftFirmId(firstFirm.id)
      const firstChallenges = challenges
        .filter((c) => c.firm_id === firstFirm.id)
        .sort((a, b) => a.account_size - b.account_size)
      setLeftChallengeId(firstChallenges[0]?.id || '')

      // Default Right Firm
      if (tabFirms.length > 1) {
        const secondFirm = tabFirms[1]
        setRightFirmId(secondFirm.id)
        const secondChallenges = challenges
          .filter((c) => c.firm_id === secondFirm.id)
          .sort((a, b) => a.account_size - b.account_size)
        setRightChallengeId(secondChallenges[0]?.id || '')
      } else {
        setRightFirmId('')
        setRightChallengeId('')
      }
    } else {
      setLeftFirmId('')
      setLeftChallengeId('')
      setRightFirmId('')
      setRightChallengeId('')
    }
  }, [activeTab, tabFirms, challenges])

  // Initialize likes from firm models
  useEffect(() => {
    const initial: Record<string, { count: number; liked: boolean }> = {}
    firms.forEach((f) => {
      initial[f.id] = {
        count: f.likes_count ?? (f.review_count ? f.review_count * 15 + 1200 : 1500),
        liked: false,
      }
    })
    setLikesState(initial)
  }, [firms])

  // Active object models
  const leftFirm = firms.find((f) => f.id === leftFirmId)
  const leftChallenges = useMemo(() => {
    return leftFirmId
      ? challenges
        .filter((c) => c.firm_id === leftFirmId)
        .sort((a, b) => a.account_size - b.account_size)
      : []
  }, [challenges, leftFirmId])
  const leftChallenge = challenges.find((c) => c.id === leftChallengeId)

  const rightFirm = firms.find((f) => f.id === rightFirmId)
  const rightChallenges = useMemo(() => {
    return rightFirmId
      ? challenges
        .filter((c) => c.firm_id === rightFirmId)
        .sort((a, b) => a.account_size - b.account_size)
      : []
  }, [challenges, rightFirmId])
  const rightChallenge = challenges.find((c) => c.id === rightChallengeId)

  const isFutures = activeTab === 'futures'

  // Normalization metrics for Radar graph
  const leftRadarMetrics = useMemo(() => {
    if (!leftFirm) return []
    return getRadarComparisonMetrics(leftFirm, leftChallenge, isFutures)
  }, [leftFirm, leftChallenge, isFutures])

  const rightRadarMetrics = useMemo(() => {
    if (!rightFirm) return []
    return getRadarComparisonMetrics(rightFirm, rightChallenge, isFutures)
  }, [rightFirm, rightChallenge, isFutures])

  // Rule flags
  const leftRules = useMemo(() => extractFirmRuleFlags(leftFirm, leftChallenge), [leftFirm, leftChallenge])
  const rightRules = useMemo(() => extractFirmRuleFlags(rightFirm, rightChallenge), [rightFirm, rightChallenge])

  // Deal / Coupon resolvers
  const getFirmOffer = (firm?: Firm, challenge?: Challenge) => {
    if (!firm) return { code: 'EMPIRIAL', discount: 'EXCLUSIVE' }

    // 1. Check challenge specific coupon
    if (challenge?.coupon_code) {
      return {
        code: challenge.coupon_code,
        discount: challenge.discount_label || 'SPECIAL',
      }
    }

    // 2. Check deals collection for best active deal for this firm
    const firmDeals = deals.filter((d) => d.firm_id === firm.id && d.status !== 'inactive')
    const bestDeal = firmDeals.find((d) => d.is_main_offer || d.is_best_offer) || firmDeals[0]
    if (bestDeal && bestDeal.code) {
      return {
        code: bestDeal.code,
        discount: bestDeal.discount_label || 'VERIFIED',
      }
    }

    // 3. Check custom fields on firm
    if (firm.coupon_code_custom) {
      return {
        code: firm.coupon_code_custom,
        discount: firm.discount_label_custom || 'VERIFIED',
      }
    }

    return { code: 'EMPIRIAL', discount: 'PROMO' }
  }

  const leftOffer = useMemo(() => getFirmOffer(leftFirm, leftChallenge), [leftFirm, leftChallenge, deals])
  const rightOffer = useMemo(() => getFirmOffer(rightFirm, rightChallenge), [rightFirm, rightChallenge, deals])

  // Handlers
  const handleLeftFirmSelect = (firmId: string) => {
    setLeftFirmId(firmId)
    const list = challenges
      .filter((c) => c.firm_id === firmId)
      .sort((a, b) => a.account_size - b.account_size)
    setLeftChallengeId(list[0]?.id || '')
  }

  const handleRightFirmSelect = (firmId: string) => {
    setRightFirmId(firmId)
    const list = challenges
      .filter((c) => c.firm_id === firmId)
      .sort((a, b) => a.account_size - b.account_size)
    setRightChallengeId(list[0]?.id || '')
  }

  const handleLikeToggle = async (firmId: string) => {
    const current = likesState[firmId] || { count: 0, liked: false }
    const nextLiked = !current.liked
    const nextCount = nextLiked ? current.count + 1 : Math.max(0, current.count - 1)

    setLikesState((prev) => ({
      ...prev,
      [firmId]: { count: nextCount, liked: nextLiked },
    }))

    try {
      await fetch(`/api/firms/${firmId}/like`, { method: 'POST' })
    } catch (err) {
      console.warn('Like sync failed', err)
    }
  }

  const handleCopyCode = async (code: string) => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodes((prev) => ({ ...prev, [code]: true }))
      setTimeout(() => {
        setCopiedCodes((prev) => ({ ...prev, [code]: false }))
      }, 2500)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  // Comparisons for highlight badges
  const leftPrice = parseCleanNumber(leftChallenge?.price, 0)
  const rightPrice = parseCleanNumber(rightChallenge?.price, 0)
  const isLeftCheaper = leftPrice > 0 && rightPrice > 0 && leftPrice < rightPrice
  const isRightCheaper = leftPrice > 0 && rightPrice > 0 && rightPrice < leftPrice

  const leftSplit = parseCleanNumber(
    leftChallenge?.profit_split_percent || leftChallenge?.profit_split_pct || leftFirm?.profit_split_custom || 80
  )
  const rightSplit = parseCleanNumber(
    rightChallenge?.profit_split_percent || rightChallenge?.profit_split_pct || rightFirm?.profit_split_custom || 80
  )
  const isLeftBetterSplit = leftSplit > rightSplit
  const isRightBetterSplit = rightSplit > leftSplit

  const leftDrawdown = isFutures
    ? parseCleanNumber(leftChallenge?.max_loss, 5000)
    : parseCleanNumber(leftChallenge?.max_loss_pct || leftFirm?.rules?.max_drawdown, 10)
  const rightDrawdown = isFutures
    ? parseCleanNumber(rightChallenge?.max_loss, 5000)
    : parseCleanNumber(rightChallenge?.max_loss_pct || rightFirm?.rules?.max_drawdown, 10)
  const isLeftBetterDrawdown = leftDrawdown > rightDrawdown
  const isRightBetterDrawdown = rightDrawdown > leftDrawdown

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-[#0D0B18]/80 border border-[#221B35] rounded-2xl max-w-md mx-auto backdrop-blur-2xl shadow-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer ${activeTab === tab.id
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                : 'text-text-secondary hover:text-white'
              }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Selectors Grid (VS Selector Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 items-center max-w-5xl mx-auto">
        {/* Left Selector */}
        <div className="md:col-span-4 p-5 rounded-3xl bg-[#0D0B18]/75 border border-[#221B35] space-y-4 backdrop-blur-xl shadow-xl hover:border-accent-cyan/40 transition-colors">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-accent-cyan uppercase tracking-widest block font-mono">
              FIRM 1 (LEFT)
            </label>
            <select
              value={leftFirmId}
              onChange={(e) => handleLeftFirmSelect(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120F22] border border-border-subtle text-white text-xs font-bold focus:border-accent-cyan focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">-- Choose Firm --</option>
              {tabFirms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">
              Challenge / Package Size
            </label>
            <select
              value={leftChallengeId}
              onChange={(e) => setLeftChallengeId(e.target.value)}
              disabled={!leftFirmId || leftChallenges.length === 0}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120F22] border border-border-subtle text-white text-xs font-bold focus:border-accent-cyan focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {leftChallenges.length === 0 ? (
                <option value="">No packages available</option>
              ) : (
                leftChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    ${c.account_size.toLocaleString()} Package (${c.price} {c.currency || 'USD'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Center VS Circle */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0 select-none">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/40 flex items-center justify-center font-black text-sm text-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.35)]">
            VS
          </div>
        </div>

        {/* Right Selector */}
        <div className="md:col-span-4 p-5 rounded-3xl bg-[#0D0B18]/75 border border-[#221B35] space-y-4 backdrop-blur-xl shadow-xl hover:border-purple-500/40 transition-colors">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest block font-mono">
              FIRM 2 (RIGHT)
            </label>
            <select
              value={rightFirmId}
              onChange={(e) => handleRightFirmSelect(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120F22] border border-border-subtle text-white text-xs font-bold focus:border-purple-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">-- Choose Firm --</option>
              {tabFirms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">
              Challenge / Package Size
            </label>
            <select
              value={rightChallengeId}
              onChange={(e) => setRightChallengeId(e.target.value)}
              disabled={!rightFirmId || rightChallenges.length === 0}
              className="w-full px-4 py-2.5 rounded-xl bg-[#120F22] border border-border-subtle text-white text-xs font-bold focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {rightChallenges.length === 0 ? (
                <option value="">No packages available</option>
              ) : (
                rightChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    ${c.account_size.toLocaleString()} Package (${c.price} {c.currency || 'USD'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Static Normalized Radar Chart Comparison Section (Reference Image 2) */}
      {leftFirm && rightFirm && (
        <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto items-stretch justify-center animate-fade-in">
          <StaticRadarChart
            firmName={leftFirm.name}
            metrics={leftRadarMetrics}
            themeColor="cyan"
          />

          <div className="hidden md:flex flex-col justify-center items-center font-bold text-xs text-text-muted select-none px-2">
            <span className="h-10 w-[1px] bg-white/20" />
            <span className="my-3 uppercase tracking-wider text-xs font-black px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white shadow-md">
              METRIC MATCH
            </span>
            <span className="h-10 w-[1px] bg-white/20" />
          </div>

          <StaticRadarChart
            firmName={rightFirm.name}
            metrics={rightRadarMetrics}
            themeColor="purple"
          />
        </div>
      )}

      {/* Dense Side-by-Side Comparison Terminal Cards (Reference Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
        {/* ======================= LEFT FIRM CARD ======================= */}
        {leftChallenge && leftFirm ? (
          <AFXCard className="relative overflow-hidden bg-[#0A0815]/90 border border-white/[0.09] p-6 space-y-5 flex flex-col justify-between rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]">
            {/* Corner accent glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent-cyan/10 rounded-full blur-[65px] pointer-events-none" />

            <div className="space-y-4">
              {/* FIRM HEADER: Large Square Logo, Firm Name, Rating, Likes */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] min-h-[80px]">
                <div className="flex items-center gap-4">
                  {/* Large Square Logo */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-white/20 p-2 shrink-0 bg-black/40 backdrop-blur-md shadow-inner flex items-center justify-center overflow-hidden">
                    <PropFirmLogo
                      name={leftFirm.name}
                      logoUrl={leftFirm.logo_url}
                      circleCrop={false}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                      {leftFirm.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-chunky-num font-black text-white">
                          {leftFirm.rating}/5
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted font-bold font-chunky-num">
                        ({leftFirm.review_count} reviews)
                      </span>
                    </div>
                    {/* Likes system */}
                    <button
                      type="button"
                      onClick={() => handleLikeToggle(leftFirm.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${likesState[leftFirm.id]?.liked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:text-white hover:bg-white/10'
                        }`}
                      title="Click to like firm"
                    >
                      <Heart className={`w-3 h-3 ${likesState[leftFirm.id]?.liked ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                      <span className="font-chunky-num font-black">{(likesState[leftFirm.id]?.count ?? 1500).toLocaleString()} Likes</span>
                    </button>
                  </div>
                </div>

                {isLeftBetterSplit && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-black text-accent-cyan bg-accent-cyan/10 px-2.5 py-1 rounded-full border border-accent-cyan/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                    <Sparkles className="w-3 h-3" /> Best Split
                  </span>
                )}
              </div>

              {/* 1. FUNDED TYPE AND COST (Compact 2-Column Header) */}
              <div className="flex justify-between items-center bg-gradient-to-r from-[#120F22] to-[#15102A] p-4 rounded-2xl border border-white/[0.08] shadow-inner min-h-[70px]">
                <div className="space-y-0.5">
                  <p className="text-base sm:text-lg font-black text-white font-chunky-num tracking-tight">
                    ${leftChallenge.account_size.toLocaleString()} Package
                  </p>
                  <p className="text-[11px] font-black text-accent-cyan font-chunky-num uppercase tracking-wider">
                    {leftChallenge.steps === 0 ? 'INSTANT FUNDED' : `${leftChallenge.steps}-STEP EVALUATION`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isLeftCheaper && (
                      <span className="text-[8.5px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                        Cheaper
                      </span>
                    )}
                    <span className="text-xl sm:text-2xl font-black font-chunky-num text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      ${leftChallenge.price}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted font-mono uppercase">
                    {leftChallenge.currency || 'USD'} Evaluation
                  </span>
                </div>
              </div>

              {/* DENSE ORDERED METRICS ROWS (Aligned Row Heights) */}
              <div className="space-y-2.5 text-sm">
                {/* 2. PROFIT SPLIT % */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Percent className="w-4 h-4 text-accent-cyan shrink-0" /> Profit Split
                  </span>
                  <div className="flex items-center gap-2">
                    {isLeftBetterSplit && (
                      <span className="text-[9px] sm:text-[10px] font-black text-emerald-400 bg-emerald-400/15 border border-emerald-400/40 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
                        More Profit
                      </span>
                    )}
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-chunky-num tracking-tight drop-shadow-[0_0_14px_rgba(52,211,153,0.5)]">
                      {leftChallenge.profit_split_percent || leftChallenge.profit_split_pct || leftFirm.profit_split_custom || '80'}%
                    </span>
                  </div>
                </div>

                {/* 3. DAILY LOSS + MAX LOSS LIMIT (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Daily Loss
                    </span>
                    <span className="font-chunky-num font-black text-white text-base sm:text-lg tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                      {leftChallenge.daily_loss_pct || leftFirm.rules?.daily_loss || '5%'}
                      {!String(leftChallenge.daily_loss_pct || '').includes('%') && '%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Max Loss
                    </span>
                    <span className="font-chunky-num font-black text-white text-base sm:text-lg tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                      {isFutures
                        ? `$${(leftChallenge.max_loss || 5000).toLocaleString()}`
                        : `${leftChallenge.max_loss_pct || leftFirm.rules?.max_drawdown || 10}%`}
                    </span>
                  </div>
                </div>

                {/* 4. LOSS TYPE */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Activity className="w-4 h-4 text-accent-cyan shrink-0" /> Loss Type
                  </span>
                  <span className="font-mono font-black text-accent-cyan text-sm sm:text-base uppercase tracking-wider px-3 py-1 rounded-lg bg-accent-cyan/15 border border-accent-cyan/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                    {leftChallenge.max_loss_type || leftFirm.rules?.drawdown_type || 'STATIC'}
                  </span>
                </div>

                {/* 5. PAYOUT FREQUENCY */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Calendar className="w-4 h-4 text-accent-cyan shrink-0" /> Payout Frequency
                  </span>
                  <span className="font-mono font-black text-amber-300 text-sm sm:text-base uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-400/15 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                    {leftChallenge.payout_freq || leftFirm.payout_custom || 'Bi-weekly'}
                  </span>
                </div>

                {/* 6. PLATFORMS */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[52px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Layers className="w-4 h-4 text-accent-cyan shrink-0" /> Platforms
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[260px]">
                    {leftFirm.platforms && leftFirm.platforms.length > 0 ? (
                      leftFirm.platforms.map((p) => <PlatformLogoItem key={p} name={p} />)
                    ) : (
                      <PlatformLogoItem name="MT5" />
                    )}
                  </div>
                </div>

                {/* 7. CONSISTENCY + MIN TRADING DAYS (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Consistency
                    </span>
                    <span className="font-chunky-num font-black text-amber-300 text-sm sm:text-base tracking-tight truncate ml-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.25)]">
                      {leftChallenge.consistency_eval_percent
                        ? `${leftChallenge.consistency_eval_percent}% Rule`
                        : leftFirm.rules?.consistency_rule || 'No Rule'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Min Days
                    </span>
                    <span className="font-chunky-num font-black text-white text-base sm:text-lg tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                      {leftChallenge.min_trading_days ?? leftFirm.rules?.min_trading_days ?? 0} Days
                    </span>
                  </div>
                </div>

                {/* 8. NEWS TRADING */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    News Trading
                  </span>
                  <span
                    className={`font-mono font-black text-xs sm:text-sm px-3.5 py-1 rounded-full border tracking-wide uppercase shadow-md ${leftRules.newsAllowed
                        ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                        : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                      }`}
                  >
                    {leftRules.newsAllowed ? '✓ YES' : '✕ NO'}
                  </span>
                </div>

                {/* 9. OVERNIGHT + WEEKEND HOLDING (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Overnight
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${leftRules.overnightAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {leftRules.overnightAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Weekend
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${leftRules.weekendAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {leftRules.weekendAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                </div>

                {/* 10. EA + ALGO TRADING (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      EA Trading
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${leftRules.eaAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {leftRules.eaAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Algo Trading
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${leftRules.algoAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {leftRules.algoAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                </div>

                {/* 11. VIEW REVIEWS */}
                <div className="pt-2">
                  <Link
                    href={`/firms/${leftFirm.slug || leftFirm.id}/reviews`}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#db2777] hover:from-[#c026d3] hover:via-[#db2777] hover:to-[#be185d] border border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.55)] text-white text-xs sm:text-sm font-black uppercase tracking-wider font-mono transition-all group active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span>View Reviews & Feedbacks</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 12. BOTTOM CONVERSION AREA (Dual Side-by-Side Action Buttons) */}
            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COPY CODE BUTTON */}
              <button
                type="button"
                onClick={() => handleCopyCode(leftOffer.code)}
                className={`w-full flex flex-col items-center justify-center py-3 px-4 rounded-xl border-2 font-black transition-all duration-200 cursor-pointer shadow-lg active:scale-95 select-none ${copiedCodes[leftOffer.code]
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                    : 'bg-[#0066FF] hover:bg-[#0052CC] border-[#0066FF] hover:border-[#0052CC] text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] hover:shadow-[0_0_25px_rgba(0,102,255,0.55)]'
                  }`}
                title="Click to copy promo code"
              >
                <span className="text-sm sm:text-[15px] text-yellow-300 font-chunky-num font-black uppercase tracking-wider block drop-shadow-sm">
                  {copiedCodes[leftOffer.code] ? 'COPIED ✓' : formatDiscountLabel(leftOffer.discount)}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base sm:text-lg font-chunky-num font-black tracking-wider text-white">
                    {leftOffer.code || 'EMPIRE'}
                  </span>
                  {copiedCodes[leftOffer.code] ? (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyan-100 opacity-90" />
                  )}
                </div>
              </button>

              {/* BUY CHALLENGE BUTTON */}
              <Link
                href={leftChallenge.affiliate_url || leftFirm.affiliate_url || leftFirm.website_url || '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Buy Challenge</span>
                <ExternalLink className="w-4 h-4 text-white" />
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[500px] bg-white/[0.02]">
            <span className="text-4xl mb-3">👈</span>
            <p className="text-base font-bold text-white">Select a firm on the left</p>
            <p className="text-xs text-text-muted mt-1">Choose a prop firm and challenge size to load specifications.</p>
          </div>
        )}

        {/* ======================= RIGHT FIRM CARD ======================= */}
        {rightChallenge && rightFirm ? (
          <AFXCard className="relative overflow-hidden bg-[#0A0815]/90 border border-white/[0.09] p-6 space-y-5 flex flex-col justify-between rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            {/* Corner accent glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-[65px] pointer-events-none" />

            <div className="space-y-4">
              {/* FIRM HEADER: Large Square Logo, Firm Name, Rating, Likes */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] min-h-[80px]">
                <div className="flex items-center gap-4">
                  {/* Large Square Logo */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-white/20 p-2 shrink-0 bg-black/40 backdrop-blur-md shadow-inner flex items-center justify-center overflow-hidden">
                    <PropFirmLogo
                      name={rightFirm.name}
                      logoUrl={rightFirm.logo_url}
                      circleCrop={false}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                      {rightFirm.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-chunky-num font-black text-white">
                          {rightFirm.rating}/5
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted font-bold font-chunky-num">
                        ({rightFirm.review_count} reviews)
                      </span>
                    </div>
                    {/* Likes system */}
                    <button
                      type="button"
                      onClick={() => handleLikeToggle(rightFirm.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${likesState[rightFirm.id]?.liked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:text-white hover:bg-white/10'
                        }`}
                      title="Click to like firm"
                    >
                      <Heart className={`w-3 h-3 ${likesState[rightFirm.id]?.liked ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                      <span className="font-chunky-num font-black">{(likesState[rightFirm.id]?.count ?? 1500).toLocaleString()} Likes</span>
                    </button>
                  </div>
                </div>

                {isRightBetterSplit && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-black text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                    <Sparkles className="w-3 h-3" /> Best Split
                  </span>
                )}
              </div>

              {/* 1. FUNDED TYPE AND COST (Compact 2-Column Header) */}
              <div className="flex justify-between items-center bg-gradient-to-r from-[#120F22] to-[#15102A] p-4 rounded-2xl border border-white/[0.08] shadow-inner min-h-[70px]">
                <div className="space-y-0.5">
                  <p className="text-base sm:text-lg font-black text-white font-chunky-num tracking-tight">
                    ${rightChallenge.account_size.toLocaleString()} Package
                  </p>
                  <p className="text-[11px] font-black text-purple-400 font-chunky-num uppercase tracking-wider">
                    {rightChallenge.steps === 0 ? 'INSTANT FUNDED' : `${rightChallenge.steps}-STEP EVALUATION`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isRightCheaper && (
                      <span className="text-[8.5px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                        Cheaper
                      </span>
                    )}
                    <span className="text-xl sm:text-2xl font-black font-chunky-num text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      ${rightChallenge.price}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted font-mono uppercase">
                    {rightChallenge.currency || 'USD'} Evaluation
                  </span>
                </div>
              </div>

              {/* DENSE ORDERED METRICS ROWS (Aligned Row Heights) */}
              <div className="space-y-2.5 text-sm">
                {/* 2. PROFIT SPLIT % */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Percent className="w-4 h-4 text-purple-400 shrink-0" /> Profit Split
                  </span>
                  <div className="flex items-center gap-2">
                    {isRightBetterSplit && (
                      <span className="text-[9px] sm:text-[10px] font-black text-emerald-400 bg-emerald-400/15 border border-emerald-400/40 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
                        More Profit
                      </span>
                    )}
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-chunky-num tracking-tight drop-shadow-[0_0_14px_rgba(52,211,153,0.5)]">
                      {rightChallenge.profit_split_percent || rightChallenge.profit_split_pct || rightFirm.profit_split_custom || '80'}%
                    </span>
                  </div>
                </div>

                {/* 3. DAILY LOSS + MAX LOSS LIMIT (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Daily Loss
                    </span>
                    <span className="font-chunky-num font-black text-white text-base sm:text-lg tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                      {rightChallenge.daily_loss_pct || rightFirm.rules?.daily_loss || '5%'}
                      {!String(rightChallenge.daily_loss_pct || '').includes('%') && '%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Max Loss
                    </span>
                    <span className="font-chunky-num font-black text-white text-base sm:text-lg tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                      {isFutures
                        ? `$${(rightChallenge.max_loss || 5000).toLocaleString()}`
                        : `${rightChallenge.max_loss_pct || rightFirm.rules?.max_drawdown || 10}%`}
                    </span>
                  </div>
                </div>

                {/* 4. LOSS TYPE */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Activity className="w-4 h-4 text-purple-400 shrink-0" /> Loss Type
                  </span>
                  <span className="font-mono font-black text-purple-300 text-sm sm:text-base uppercase tracking-wider px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                    {rightChallenge.max_loss_type || rightFirm.rules?.drawdown_type || 'STATIC'}
                  </span>
                </div>

                {/* 5. PAYOUT FREQUENCY */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0" /> Payout Frequency
                  </span>
                  <span className="font-mono font-black text-amber-300 text-sm sm:text-base uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-400/15 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                    {rightChallenge.payout_freq || rightFirm.payout_custom || 'Bi-weekly'}
                  </span>
                </div>

                {/* 6. PLATFORMS */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[52px] transition-colors">
                  <span className="text-slate-200 font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    <Layers className="w-4 h-4 text-purple-400 shrink-0" /> Platforms
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[260px]">
                    {rightFirm.platforms && rightFirm.platforms.length > 0 ? (
                      rightFirm.platforms.map((p) => <PlatformLogoItem key={p} name={p} />)
                    ) : (
                      <PlatformLogoItem name="MT5" />
                    )}
                  </div>
                </div>

                {/* 7. CONSISTENCY + MIN TRADING DAYS (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Consistency
                    </span>
                    <span className="font-chunky-num font-black text-amber-300 text-sm sm:text-base tracking-tight truncate ml-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.25)]">
                      {rightChallenge.consistency_eval_percent
                        ? `${rightChallenge.consistency_eval_percent}% Rule`
                        : rightFirm.rules?.consistency_rule || 'No Rule'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Min Days
                    </span>
                    <span className="font-chunky-num font-black text-white text-base sm:text-lg tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                      {rightChallenge.min_trading_days ?? rightFirm.rules?.min_trading_days ?? 0} Days
                    </span>
                  </div>
                </div>

                {/* 8. NEWS TRADING */}
                <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 min-h-[50px] transition-colors">
                  <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                    News Trading
                  </span>
                  <span
                    className={`font-mono font-black text-xs sm:text-sm px-3.5 py-1 rounded-full border tracking-wide uppercase shadow-md ${rightRules.newsAllowed
                        ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                        : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                      }`}
                  >
                    {rightRules.newsAllowed ? '✓ YES' : '✕ NO'}
                  </span>
                </div>

                {/* 9. OVERNIGHT + WEEKEND HOLDING (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Overnight
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${rightRules.overnightAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {rightRules.overnightAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Weekend
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${rightRules.weekendAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {rightRules.weekendAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                </div>

                {/* 10. EA + ALGO TRADING (Side-by-Side) */}
                <div className="grid grid-cols-2 gap-2.5 min-h-[54px]">
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      EA Trading
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${rightRules.eaAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {rightRules.eaAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-slate-200 font-extrabold uppercase tracking-wide text-xs sm:text-[13px] font-mono">
                      Algo Trading
                    </span>
                    <span
                      className={`font-mono font-black text-xs sm:text-sm px-3 py-1 rounded-full border tracking-wide uppercase shadow-md ${rightRules.algoAllowed
                          ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'text-rose-300 bg-rose-400/20 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        }`}
                    >
                      {rightRules.algoAllowed ? '✓ YES' : '✕ NO'}
                    </span>
                  </div>
                </div>

                {/* 11. VIEW REVIEWS */}
                <div className="pt-2">
                  <Link
                    href={`/firms/${rightFirm.slug || rightFirm.id}/reviews`}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#db2777] hover:from-[#c026d3] hover:via-[#db2777] hover:to-[#be185d] border border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.55)] text-white text-xs sm:text-sm font-black uppercase tracking-wider font-mono transition-all group active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span>View Reviews & Feedbacks</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 12. BOTTOM CONVERSION AREA (Dual Side-by-Side Action Buttons) */}
            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COPY CODE BUTTON */}
              <button
                type="button"
                onClick={() => handleCopyCode(rightOffer.code)}
                className={`w-full flex flex-col items-center justify-center py-3 px-4 rounded-xl border-2 font-black transition-all duration-200 cursor-pointer shadow-lg active:scale-95 select-none ${copiedCodes[rightOffer.code]
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                    : 'bg-[#0066FF] hover:bg-[#0052CC] border-[#0066FF] hover:border-[#0052CC] text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] hover:shadow-[0_0_25px_rgba(0,102,255,0.55)]'
                  }`}
                title="Click to copy promo code"
              >
                <span className="text-sm sm:text-[15px] text-yellow-300 font-chunky-num font-black uppercase tracking-wider block drop-shadow-sm">
                  {copiedCodes[rightOffer.code] ? 'COPIED ✓' : formatDiscountLabel(rightOffer.discount)}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base sm:text-lg font-chunky-num font-black tracking-wider text-white">
                    {rightOffer.code || 'EMPIRE'}
                  </span>
                  {copiedCodes[rightOffer.code] ? (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyan-100 opacity-90" />
                  )}
                </div>
              </button>

              {/* BUY CHALLENGE BUTTON */}
              <Link
                href={rightChallenge.affiliate_url || rightFirm.affiliate_url || rightFirm.website_url || '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-accent-pink hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Buy Challenge</span>
                <ExternalLink className="w-4 h-4 text-white" />
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[500px] bg-white/[0.02]">
            <span className="text-4xl mb-3">👈</span>
            <p className="text-base font-bold text-white">Select a firm on the right</p>
            <p className="text-xs text-text-muted mt-1">Choose a prop firm and challenge size to load specifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
