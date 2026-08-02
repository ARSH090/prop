'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { ArrowRight, Star, RefreshCw, Award, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'
import Link from 'next/link'

interface Challenge {
  id: string
  firm_id: string
  account_size: number
  steps: number | string
  profit_target_p1?: number | string
  profit_target_p2?: number | string
  daily_loss_pct?: number | string
  max_loss_pct?: number | string
  pt_dd_ratio?: string
  profit_split_pct?: number | string
  payout_freq?: string
  price: number | string
  currency?: string
  affiliate_url?: string
}

interface Firm {
  id: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  category?: string[]
  type: string
}

interface CompareClientProps {
  firms: Firm[]
  challenges: Challenge[]
}

const TABS = [
  { id: 'forex', label: 'Forex / CFDs', icon: '📈' },
  { id: 'futures', label: 'Futures', icon: '⛓' },
  { id: 'crypto', label: 'Crypto', icon: '🪙' },
] as const

export default function CompareClient({ firms, challenges }: CompareClientProps) {
  const [activeTab, setActiveTab] = useState<'forex' | 'futures' | 'crypto'>('forex')
  
  // Left side selections
  const [leftFirmId, setLeftFirmId] = useState<string>('')
  const [leftChallengeId, setLeftChallengeId] = useState<string>('')
  
  // Right side selections
  const [rightFirmId, setRightFirmId] = useState<string>('')
  const [rightChallengeId, setRightChallengeId] = useState<string>('')

  // Filter firms based on active tab
  const getTabFirms = () => {
    return firms.filter((f) => {
      const cats = f.category?.map((c) => c.toLowerCase()) || []
      if (activeTab === 'forex') {
        return cats.includes('forex') || f.type === 'prop_firm' || cats.length === 0
      }
      return cats.includes(activeTab)
    })
  }

  const tabFirms = getTabFirms()

  // Initialize/Set defaults on mount or tab switch
  useEffect(() => {
    const availableFirms = getTabFirms()
    if (availableFirms.length > 0) {
      // Default left side
      const firstFirm = availableFirms[0]
      setLeftFirmId(firstFirm.id)
      const firstChallenges = challenges.filter((c) => c.firm_id === firstFirm.id)
      if (firstChallenges.length > 0) {
        const sorted = [...firstChallenges].sort((a, b) => a.account_size - b.account_size)
        setLeftChallengeId(sorted[0].id)
      } else {
        setLeftChallengeId('')
      }

      // Default right side
      if (availableFirms.length > 1) {
        const secondFirm = availableFirms[1]
        setRightFirmId(secondFirm.id)
        const secondChallenges = challenges.filter((c) => c.firm_id === secondFirm.id)
        if (secondChallenges.length > 0) {
          const sorted = [...secondChallenges].sort((a, b) => a.account_size - b.account_size)
          setRightChallengeId(sorted[0].id)
        } else {
          setRightChallengeId('')
        }
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
  }, [activeTab])

  // Get active lists
  const leftFirm = firms.find((f) => f.id === leftFirmId)
  const leftChallenges = leftFirmId
    ? challenges.filter((c) => c.firm_id === leftFirmId).sort((a, b) => a.account_size - b.account_size)
    : []
  const leftChallenge = challenges.find((c) => c.id === leftChallengeId)

  const rightFirm = firms.find((f) => f.id === rightFirmId)
  const rightChallenges = rightFirmId
    ? challenges.filter((c) => c.firm_id === rightFirmId).sort((a, b) => a.account_size - b.account_size)
    : []
  const rightChallenge = challenges.find((c) => c.id === rightChallengeId)

  // Handlers
  const handleLeftFirmChange = (firmId: string) => {
    setLeftFirmId(firmId)
    const chList = challenges.filter((c) => c.firm_id === firmId).sort((a, b) => a.account_size - b.account_size)
    if (chList.length > 0) {
      setLeftChallengeId(chList[0].id)
    } else {
      setLeftChallengeId('')
    }
  }

  const handleRightFirmChange = (firmId: string) => {
    setRightFirmId(firmId)
    const chList = challenges.filter((c) => c.firm_id === firmId).sort((a, b) => a.account_size - b.account_size)
    if (chList.length > 0) {
      setRightChallengeId(chList[0].id)
    } else {
      setRightChallengeId('')
    }
  }

  // Parse helper
  const parseNumber = (val: any) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0
  }

  // Highlights calculator (returns better side: 'left' | 'right' | 'equal')
  const getBetterSide = (leftVal: any, rightVal: any, lowerIsBetter = false) => {
    const lNum = parseNumber(leftVal)
    const rNum = parseNumber(rightVal)
    if (lNum === rNum) return 'equal'
    const isLeftBetter = lowerIsBetter ? lNum < rNum : lNum > rNum
    return isLeftBetter ? 'left' : 'right'
  }

  // Compare results if both selected
  const hasBoth = !!(leftChallenge && rightChallenge)
  const betterPrice = hasBoth ? getBetterSide(leftChallenge.price, rightChallenge.price, true) : null
  const betterSteps = hasBoth ? getBetterSide(leftChallenge.steps, rightChallenge.steps, true) : null
  const betterTarget1 = hasBoth ? getBetterSide(leftChallenge.profit_target_p1 || 8, rightChallenge.profit_target_p1 || 8, true) : null
  const betterDailyLoss = hasBoth ? getBetterSide(leftChallenge.daily_loss_pct || 5, rightChallenge.daily_loss_pct || 5) : null
  const betterMaxLoss = hasBoth ? getBetterSide(leftChallenge.max_loss_pct || 10, rightChallenge.max_loss_pct || 10) : null
  const betterSplit = hasBoth ? getBetterSide(leftChallenge.profit_split_pct || 80, rightChallenge.profit_split_pct || 80) : null

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-bg-surface/30 border border-border-subtle/40 rounded-2xl max-w-md mx-auto backdrop-blur-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-text-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Selectors Grid (VS Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 items-center max-w-4xl mx-auto">
        {/* Left Selector Panel */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-bg-surface/50 border border-border-subtle/50 space-y-4 backdrop-blur-md hover:border-accent-cyan/30 transition-colors">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Select Firm</label>
            <select
              value={leftFirmId}
              onChange={(e) => handleLeftFirmChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-semibold focus:border-accent-cyan focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">-- Choose Firm --</option>
              {tabFirms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Select Package Size</label>
            <select
              value={leftChallengeId}
              onChange={(e) => setLeftChallengeId(e.target.value)}
              disabled={!leftFirmId || leftChallenges.length === 0}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-semibold focus:border-accent-cyan focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {leftChallenges.length === 0 ? (
                <option value="">No packages available</option>
              ) : (
                leftChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    ${(c.account_size).toLocaleString()} Challenge (${c.price} {c.currency || 'USD'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* VS Divider Text */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 flex items-center justify-center font-black text-sm text-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.3)] select-none">
            VS
          </div>
        </div>

        {/* Right Selector Panel */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-bg-surface/50 border border-border-subtle/50 space-y-4 backdrop-blur-md hover:border-accent-purple/30 transition-colors">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Select Firm</label>
            <select
              value={rightFirmId}
              onChange={(e) => handleRightFirmChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-semibold focus:border-accent-purple focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">-- Choose Firm --</option>
              {tabFirms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Select Package Size</label>
            <select
              value={rightChallengeId}
              onChange={(e) => setRightChallengeId(e.target.value)}
              disabled={!rightFirmId || rightChallenges.length === 0}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-semibold focus:border-accent-purple focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {rightChallenges.length === 0 ? (
                <option value="">No packages available</option>
              ) : (
                rightChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    ${(c.account_size).toLocaleString()} Challenge (${c.price} {c.currency || 'USD'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Side Card */}
        {leftChallenge && leftFirm ? (
          <AFXCard className="relative overflow-hidden bg-bg-surface border border-border-subtle/80 p-6 space-y-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] hover:border-accent-cyan/30">
            {/* Glossy corner blur */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle/50">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center p-2.5 border border-border-subtle shrink-0">
                    <img
                      src={getCleanLogoUrl(leftFirm.name, leftFirm.logo_url)}
                      alt={leftFirm.name}
                      className="max-h-full max-w-full object-contain filter brightness-110"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text-primary tracking-tight">{leftFirm.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current text-accent-yellow" />
                      <span className="text-xs font-mono font-bold text-text-secondary">{leftFirm.rating}/5</span>
                      <span className="text-[10px] text-text-muted">({leftFirm.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                {betterSplit === 'left' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-cyan bg-accent-cyan/10 px-2.5 py-1 rounded-full border border-accent-cyan/20 uppercase tracking-wide font-mono animate-pulse">
                    <Award className="w-3 h-3" /> Best Profit Split
                  </span>
                )}
              </div>

              {/* Title size badge */}
              <div className="text-center p-4.5 rounded-2xl bg-bg-base/40 border border-border-subtle/30 space-y-1 relative">
                <p className="text-2xl font-black text-text-primary tracking-tight">
                  ${(leftChallenge.account_size).toLocaleString()} Package
                </p>
                <p className="text-xs font-bold text-accent-cyan font-mono uppercase tracking-wide">
                  {leftChallenge.steps}-Step structure
                </p>
              </div>

              {/* Key Specs */}
              <div className="space-y-3.5 text-xs">
                {/* Cost */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-bold">Package Cost</span>
                  <div className="flex items-center gap-2">
                    {betterPrice === 'left' && (
                      <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 border border-accent-green/20 px-1.5 py-0.5 rounded font-mono uppercase">Cheaper</span>
                    )}
                    <span className={`font-mono font-black text-sm ${betterPrice === 'left' ? 'text-accent-green text-base' : 'text-text-primary'}`}>
                      ${leftChallenge.price} {leftChallenge.currency || 'USD'}
                    </span>
                  </div>
                </div>

                {/* Target */}
                <div className="space-y-2 py-2 border-b border-border-subtle/30">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-bold">Profit Target (Phase 1 / 2)</span>
                    <div className="flex items-center gap-2">
                      {betterTarget1 === 'left' && (
                        <span className="text-[9px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Easier Target</span>
                      )}
                      <span className={`font-mono font-bold ${betterTarget1 === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                        {leftChallenge.profit_target_p1 || '8'}% / {leftChallenge.profit_target_p2 || '5'}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full bg-bg-base/60 rounded-full h-1.5 border border-border-subtle/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-accent-cyan to-blue-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(parseNumber(leftChallenge.profit_target_p1 || 8) * 10, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Daily Loss */}
                <div className="space-y-2 py-2 border-b border-border-subtle/30">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-bold">Daily Loss Limit</span>
                    <div className="flex items-center gap-2">
                      {betterDailyLoss === 'left' && (
                        <span className="text-[9px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Safer Limit</span>
                      )}
                      <span className={`font-mono font-bold ${betterDailyLoss === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                        {leftChallenge.daily_loss_pct || '5'}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full bg-bg-base/60 rounded-full h-1.5 border border-border-subtle/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(parseNumber(leftChallenge.daily_loss_pct || 5) * 15, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Max Loss */}
                <div className="space-y-2 py-2 border-b border-border-subtle/30">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-bold">Maximum Drawdown</span>
                    <div className="flex items-center gap-2">
                      {betterMaxLoss === 'left' && (
                        <span className="text-[9px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">More Drawdown</span>
                      )}
                      <span className={`font-mono font-bold ${betterMaxLoss === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                        {leftChallenge.max_loss_pct || '10'}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full bg-bg-base/60 rounded-full h-1.5 border border-border-subtle/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(parseNumber(leftChallenge.max_loss_pct || 10) * 10, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Profit Split */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-bold">Profit Split Share</span>
                  <div className="flex items-center gap-2">
                    {betterSplit === 'left' && (
                      <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 border border-accent-green/20 px-1.5 py-0.5 rounded font-mono uppercase">More Profit</span>
                    )}
                    <span className={`font-mono font-black ${betterSplit === 'left' ? 'text-accent-green text-sm' : 'text-text-primary'}`}>
                      {leftChallenge.profit_split_pct || '80'}%
                    </span>
                  </div>
                </div>

                {/* Payout cycle */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-bold">Payout Frequency</span>
                  <span className="font-bold text-text-primary font-mono">{leftChallenge.payout_freq || 'Bi-weekly'}</span>
                </div>

                {/* Ratio */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted font-bold">Reward/Risk Ratio (PT/DD)</span>
                  <span className="font-mono font-bold text-accent-cyan">{leftChallenge.pt_dd_ratio || '1:1'}</span>
                </div>
              </div>
            </div>

            {/* CTA purchase link */}
            <div className="pt-6">
              <Link href={leftChallenge.affiliate_url || leftFirm.logo_url || '/'} target="_blank" className="w-full block">
                <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-[1.01]">
                  <span>Get Funded Now</span>
                  <ArrowRight className="w-4 h-4" />
                </AFXButton>
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-border-subtle/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] bg-bg-surface/10">
            <span className="text-4xl mb-3">👈</span>
            <p className="text-sm font-bold text-text-secondary">Select a program on the left</p>
            <p className="text-xs text-text-muted mt-1">Choose a firm and challenge size to populate specifications.</p>
          </div>
        )}

        {/* Right Side Card */}
        {rightChallenge && rightFirm ? (
          <AFXCard className="relative overflow-hidden bg-bg-surface border border-border-subtle/80 p-6 space-y-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.12)] hover:border-accent-purple/30">
            {/* Glossy corner blur */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle/50">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center p-2.5 border border-border-subtle shrink-0">
                    <img
                      src={getCleanLogoUrl(rightFirm.name, rightFirm.logo_url)}
                      alt={rightFirm.name}
                      className="max-h-full max-w-full object-contain filter brightness-110"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text-primary tracking-tight">{rightFirm.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current text-accent-yellow" />
                      <span className="text-xs font-mono font-bold text-text-secondary">{rightFirm.rating}/5</span>
                      <span className="text-[10px] text-text-muted">({rightFirm.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                {betterSplit === 'right' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded-full border border-accent-purple/20 uppercase tracking-wide font-mono animate-pulse">
                    <Award className="w-3 h-3" /> Best Profit Split
                  </span>
                )}
              </div>

              {/* Title size badge */}
              <div className="text-center p-4.5 rounded-2xl bg-bg-base/40 border border-border-subtle/30 space-y-1 relative">
                <p className="text-2xl font-black text-text-primary tracking-tight">
                  ${(rightChallenge.account_size).toLocaleString()} Package
                </p>
                <p className="text-xs font-bold text-accent-purple font-mono uppercase tracking-wide">
                  {rightChallenge.steps}-Step structure
                </p>
              </div>

              {/* Key Specs */}
              <div className="space-y-3.5 text-xs">
                {/* Cost */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-bold">Package Cost</span>
                  <div className="flex items-center gap-2">
                    {betterPrice === 'right' && (
                      <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 border border-accent-green/20 px-1.5 py-0.5 rounded font-mono uppercase">Cheaper</span>
                    )}
                    <span className={`font-mono font-black text-sm ${betterPrice === 'right' ? 'text-accent-green text-base' : 'text-text-primary'}`}>
                      ${rightChallenge.price} {rightChallenge.currency || 'USD'}
                    </span>
                  </div>
                </div>

                {/* Target */}
                <div className="space-y-2 py-2 border-b border-border-subtle/30">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-bold">Profit Target (Phase 1 / 2)</span>
                    <div className="flex items-center gap-2">
                      {betterTarget1 === 'right' && (
                        <span className="text-[9px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Easier Target</span>
                      )}
                      <span className={`font-mono font-bold ${betterTarget1 === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                        {rightChallenge.profit_target_p1 || '8'}% / {rightChallenge.profit_target_p2 || '5'}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full bg-bg-base/60 rounded-full h-1.5 border border-border-subtle/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-accent-purple to-purple-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(parseNumber(rightChallenge.profit_target_p1 || 8) * 10, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Daily Loss */}
                <div className="space-y-2 py-2 border-b border-border-subtle/30">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-bold">Daily Loss Limit</span>
                    <div className="flex items-center gap-2">
                      {betterDailyLoss === 'right' && (
                        <span className="text-[9px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Safer Limit</span>
                      )}
                      <span className={`font-mono font-bold ${betterDailyLoss === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                        {rightChallenge.daily_loss_pct || '5'}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full bg-bg-base/60 rounded-full h-1.5 border border-border-subtle/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(parseNumber(rightChallenge.daily_loss_pct || 5) * 15, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Max Loss */}
                <div className="space-y-2 py-2 border-b border-border-subtle/30">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-bold">Maximum Drawdown</span>
                    <div className="flex items-center gap-2">
                      {betterMaxLoss === 'right' && (
                        <span className="text-[9px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">More Drawdown</span>
                      )}
                      <span className={`font-mono font-bold ${betterMaxLoss === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                        {rightChallenge.max_loss_pct || '10'}%
                      </span>
                    </div>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="w-full bg-bg-base/60 rounded-full h-1.5 border border-border-subtle/20 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(parseNumber(rightChallenge.max_loss_pct || 10) * 10, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Profit Split */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-bold">Profit Split Share</span>
                  <div className="flex items-center gap-2">
                    {betterSplit === 'right' && (
                      <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 border border-accent-green/20 px-1.5 py-0.5 rounded font-mono uppercase">More Profit</span>
                    )}
                    <span className={`font-mono font-black ${betterSplit === 'right' ? 'text-accent-green text-sm' : 'text-text-primary'}`}>
                      {rightChallenge.profit_split_pct || '80'}%
                    </span>
                  </div>
                </div>

                {/* Payout cycle */}
                <div className="flex justify-between items-center py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-bold">Payout Frequency</span>
                  <span className="font-bold text-text-primary font-mono">{rightChallenge.payout_freq || 'Bi-weekly'}</span>
                </div>

                {/* Ratio */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted font-bold">Reward/Risk Ratio (PT/DD)</span>
                  <span className="font-mono font-bold text-accent-cyan">{rightChallenge.pt_dd_ratio || '1:1'}</span>
                </div>
              </div>
            </div>

            {/* CTA purchase link */}
            <div className="pt-6">
              <Link href={rightChallenge.affiliate_url || rightFirm.logo_url || '/'} target="_blank" className="w-full block">
                <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-[1.01]">
                  <span>Get Funded Now</span>
                  <ArrowRight className="w-4 h-4" />
                </AFXButton>
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-border-subtle/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] bg-bg-surface/10">
            <span className="text-4xl mb-3">👉</span>
            <p className="text-sm font-bold text-text-secondary">Select a program on the right</p>
            <p className="text-xs text-text-muted mt-1">Choose a firm and challenge size to populate specifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
