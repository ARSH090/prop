'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { ArrowRight, Star, Award, TrendingUp, ShieldAlert, Sparkles, Activity, Landmark, Percent, Calendar, Layers } from 'lucide-react'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
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
  profit_split_percent?: number | string
  payout_freq?: string
  price: number | string
  currency?: string
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
}

interface Firm {
  id: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  category?: string[]
  type: string
  platforms?: string[]
  cta_text?: string
  affiliate_url?: string
  website_url?: string
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
  const isFutures = activeTab === 'futures'

  const betterPrice = hasBoth ? getBetterSide(leftChallenge.price, rightChallenge.price, true) : null
  const betterSplit = hasBoth ? getBetterSide(
    leftChallenge.profit_split_percent || leftChallenge.profit_split_pct || 80,
    rightChallenge.profit_split_percent || rightChallenge.profit_split_pct || 80
  ) : null

  // Target comparison (Forex: target % lower is better | Futures: target $ amount lower is better)
  const leftTargetRaw = isFutures 
    ? ((leftChallenge?.profit_target) || (leftChallenge?.account_size || 0) * 0.08)
    : (leftChallenge?.profit_target_p1 || 8)
  const rightTargetRaw = isFutures
    ? ((rightChallenge?.profit_target) || (rightChallenge?.account_size || 0) * 0.08)
    : (rightChallenge?.profit_target_p1 || 8)
  const betterTarget = hasBoth ? getBetterSide(leftTargetRaw, rightTargetRaw, true) : null

  // Drawdown/Max Loss comparison (Forex: loss % higher is better | Futures: loss $ amount higher is better)
  const leftMaxLossRaw = isFutures
    ? ((leftChallenge?.max_loss) || (leftChallenge?.account_size || 0) * 0.05)
    : (leftChallenge?.max_loss_pct || 10)
  const rightMaxLossRaw = isFutures
    ? ((rightChallenge?.max_loss) || (rightChallenge?.account_size || 0) * 0.05)
    : (rightChallenge?.max_loss_pct || 10)
  const betterMaxLoss = hasBoth ? getBetterSide(leftMaxLossRaw, rightMaxLossRaw) : null

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-bg-surface/30 border border-border-subtle/50 rounded-2xl max-w-md mx-auto backdrop-blur-2xl shadow-inner">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 text-xs font-black rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-text-primary shadow-[0_0_20px_rgba(34,211,238,0.25)]'
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
        <div className="md:col-span-4 p-5 rounded-2xl bg-bg-surface/40 border border-border-subtle/40 space-y-4 backdrop-blur-md hover:border-accent-cyan/40 transition-colors">
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
        <div className="md:col-span-4 p-5 rounded-2xl bg-bg-surface/40 border border-border-subtle/40 space-y-4 backdrop-blur-md hover:border-accent-purple/40 transition-colors">
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
        {/* Left Card */}
        {leftChallenge && leftFirm ? (
          <AFXCard className="relative overflow-hidden bg-gradient-to-b from-bg-surface/85 to-bg-surface/50 border border-white/[0.08] p-6.5 space-y-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.18)] hover:border-accent-cyan/40 rounded-3xl backdrop-blur-2xl">
            {/* Glowing corner blur */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-cyan/15 rounded-full blur-[70px] pointer-events-none" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4.5 border-b border-border-subtle/50">
                <div className="flex items-center gap-4">
                  <PropFirmLogo
                    name={leftFirm.name}
                    logoUrl={leftFirm.logo_url}
                    className="w-16 h-16 rounded-2xl shrink-0 shadow-inner"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{leftFirm.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current text-accent-yellow" />
                      <span className="text-xs font-mono font-black text-text-primary">{leftFirm.rating}/5</span>
                      <span className="text-[10px] text-text-muted font-semibold">({leftFirm.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                {betterSplit === 'left' && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-accent-cyan bg-accent-cyan/10 px-2.5 py-1 rounded-full border border-accent-cyan/25 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    <Award className="w-3 h-3" /> Best Profit Split
                  </span>
                )}
              </div>

              {/* Central Title/Size */}
              <div className="text-center py-5 px-4.5 rounded-2xl bg-gradient-to-tr from-bg-base/60 to-bg-base/20 border border-border-subtle/30 space-y-1 relative shadow-inner">
                <p className="text-2xl font-black text-text-primary tracking-tight drop-shadow-md">
                  ${(leftChallenge.account_size).toLocaleString()} Package
                </p>
                <p className="text-xs font-black text-accent-cyan font-mono uppercase tracking-widest">
                  {leftChallenge.steps}-Step Evaluation
                </p>
              </div>

              {/* Price Tag Box */}
              <div className="flex justify-between items-baseline bg-bg-base/60 p-4.5 rounded-2xl border border-border-subtle/30 shadow-inner">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Evaluation Cost</span>
                <div className="flex items-center gap-2">
                  {betterPrice === 'left' && (
                    <span className="text-[8px] font-black text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded font-mono uppercase tracking-widest">Cheaper</span>
                  )}
                  <span className={`text-2xl font-black font-mono tracking-tight ${betterPrice === 'left' ? 'text-accent-green' : 'text-text-primary'}`}>
                    ${leftChallenge.price} <span className="text-xs font-bold text-text-muted">{leftChallenge.currency || 'USD'}</span>
                  </span>
                </div>
              </div>

              {/* Specification Cards List */}
              <div className="space-y-2.5">
                {isFutures ? (
                  /* Futures layout specs */
                  <>
                    {/* Profit Target */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-accent-cyan" /> Profit Target</span>
                        <div className="flex items-center gap-1.5">
                          {betterTarget === 'left' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Easier Target</span>
                          )}
                          <span className={`font-mono font-black ${betterTarget === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            ${leftChallenge.profit_target ? leftChallenge.profit_target.toLocaleString() : (leftChallenge.account_size * 0.08).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-accent-cyan to-blue-500 h-full rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>

                    {/* Max Loss */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Max Drawdown</span>
                        <div className="flex items-center gap-1.5">
                          {betterMaxLoss === 'left' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">More Drawdown</span>
                          )}
                          <span className={`font-mono font-black ${betterMaxLoss === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            ${leftChallenge.max_loss ? leftChallenge.max_loss.toLocaleString() : (leftChallenge.account_size * 0.05).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    {/* Drawdown Type */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-accent-purple" /> Drawdown Type</span>
                      <span className="font-semibold text-text-primary font-mono capitalize">{leftChallenge.max_loss_type?.replace(/_/g, ' ') || 'Trailing'}</span>
                    </div>

                    {/* Contracts Allowed */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-accent-cyan" /> Contracts Allowed</span>
                      <span className="font-semibold text-text-primary font-mono">{leftChallenge.max_contract_size_minis || 10} Minis / {leftChallenge.max_contract_size_micros || 100} Micros</span>
                    </div>

                    {/* Activation Fee */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5 text-accent-cyan" /> Activation Fee</span>
                      <span className="font-semibold text-text-primary font-mono">{leftChallenge.activation_fee || 'None'}</span>
                    </div>

                    {/* Payout cycle */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-accent-cyan" /> Payout Frequency</span>
                      <span className="font-semibold text-text-primary font-mono">{leftChallenge.payout_freq || '14 Days (Standard)'}</span>
                    </div>
                  </>
                ) : (
                  /* Forex Layout specs */
                  <>
                    {/* Profit Target */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-accent-cyan" /> Profit Target (P1 / P2)</span>
                        <div className="flex items-center gap-1.5">
                          {betterTarget === 'left' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Easier Target</span>
                          )}
                          <span className={`font-mono font-black ${betterTarget === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            {leftChallenge.profit_target_p1 || '8'}% / {leftChallenge.profit_target_p2 || '5'}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-accent-cyan to-blue-500 h-full rounded-full" 
                          style={{ width: `${Math.min(parseNumber(leftChallenge.profit_target_p1 || 8) * 10, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Daily Loss */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Daily Loss Limit</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-text-primary">
                            {leftChallenge.daily_loss_pct || '5'}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" 
                          style={{ width: `${Math.min(parseNumber(leftChallenge.daily_loss_pct || 5) * 15, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Max Loss */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Maximum Drawdown</span>
                        <div className="flex items-center gap-1.5">
                          {betterMaxLoss === 'left' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">More Drawdown</span>
                          )}
                          <span className={`font-mono font-black ${betterMaxLoss === 'left' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            {leftChallenge.max_loss_pct || '10'}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" 
                          style={{ width: `${Math.min(parseNumber(leftChallenge.max_loss_pct || 10) * 10, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Profit Split */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-accent-green" /> Profit Split Share</span>
                      <div className="flex items-center gap-2">
                        {betterSplit === 'left' && (
                          <span className="text-[8px] font-bold text-accent-green bg-accent-green/10 border border-accent-green/20 px-1.5 py-0.5 rounded font-mono uppercase">More Profit</span>
                        )}
                        <span className={`font-mono font-black ${betterSplit === 'left' ? 'text-accent-green' : 'text-text-primary'}`}>
                          {leftChallenge.profit_split_percent || leftChallenge.profit_split_pct || '80'}%
                        </span>
                      </div>
                    </div>

                    {/* Payout cycle */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-accent-cyan" /> Payout Frequency</span>
                      <span className="font-black text-text-primary font-mono">{leftChallenge.payout_freq || 'Bi-weekly'}</span>
                    </div>
                  </>
                )}

                {/* Supported Platforms (ENHANCED: Larger Platform names) */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                  <span className="text-text-muted font-bold flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-accent-cyan" /> Platforms</span>
                  <div className="flex flex-wrap gap-2 justify-end max-w-[260px]">
                    {leftFirm.platforms && leftFirm.platforms.length > 0 ? (
                      leftFirm.platforms.map((p: string) => (
                        <span key={p} className="px-3.5 py-1.5 rounded-xl bg-bg-base/60 border border-border-subtle/35 text-[11px] font-black text-accent-cyan font-mono uppercase tracking-widest shadow-inner">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-text-muted font-mono font-bold text-[11px] uppercase tracking-widest bg-bg-base/50 px-3 py-1 rounded-xl border border-border-subtle/30">Standard</span>
                    )}
                  </div>
                </div>

                {/* Ratio */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                  <span className="text-text-muted font-bold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> Reward/Risk Ratio (PT/DD)</span>
                  <span className="font-black text-text-primary font-mono">{leftChallenge.pt_dd_ratio || '1:1'}</span>
                </div>
              </div>
            </div>

            {/* CTA purchase link linked to admin configs */}
            <div className="pt-6">
              <Link href={leftChallenge.affiliate_url || leftFirm.affiliate_url || leftFirm.website_url || '/'} target="_blank" className="w-full block">
                <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:scale-[1.01]">
                  <span>{leftChallenge.cta_text || leftFirm.cta_text || 'Get Funded Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </AFXButton>
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-border-subtle/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[450px] bg-bg-surface/10">
            <span className="text-4xl mb-3">👈</span>
            <p className="text-sm font-bold text-text-secondary">Select a program on the left</p>
            <p className="text-xs text-text-muted mt-1">Choose a firm and challenge size to populate specifications.</p>
          </div>
        )}

        {/* Right Card */}
        {rightChallenge && rightFirm ? (
          <AFXCard className="relative overflow-hidden bg-gradient-to-b from-bg-surface/85 to-bg-surface/50 border border-white/[0.08] p-6.5 space-y-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.18)] hover:border-accent-purple/40 rounded-3xl backdrop-blur-2xl">
            {/* Glowing corner blur */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/15 rounded-full blur-[70px] pointer-events-none" />

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4.5 border-b border-border-subtle/50">
                <div className="flex items-center gap-4">
                  <PropFirmLogo
                    name={rightFirm.name}
                    logoUrl={rightFirm.logo_url}
                    className="w-16 h-16 rounded-2xl shrink-0 shadow-inner"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{rightFirm.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current text-accent-yellow" />
                      <span className="text-xs font-mono font-black text-text-primary">{rightFirm.rating}/5</span>
                      <span className="text-[10px] text-text-muted font-semibold">({rightFirm.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                {betterSplit === 'right' && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded-full border border-accent-purple/25 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                    <Award className="w-3 h-3" /> Best Profit Split
                  </span>
                )}
              </div>

              {/* Central Title/Size */}
              <div className="text-center py-5 px-4.5 rounded-2xl bg-gradient-to-tr from-bg-base/60 to-bg-base/20 border border-border-subtle/30 space-y-1 relative shadow-inner">
                <p className="text-2xl font-black text-text-primary tracking-tight drop-shadow-md">
                  ${(rightChallenge.account_size).toLocaleString()} Package
                </p>
                <p className="text-xs font-black text-accent-purple font-mono uppercase tracking-widest">
                  {rightChallenge.steps}-Step Evaluation
                </p>
              </div>

              {/* Price Tag Box */}
              <div className="flex justify-between items-baseline bg-bg-base/60 p-4.5 rounded-2xl border border-border-subtle/30 shadow-inner">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Evaluation Cost</span>
                <div className="flex items-center gap-2">
                  {betterPrice === 'right' && (
                    <span className="text-[8px] font-black text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded font-mono uppercase tracking-widest">Cheaper</span>
                  )}
                  <span className={`text-2xl font-black font-mono tracking-tight ${betterPrice === 'right' ? 'text-accent-green' : 'text-text-primary'}`}>
                    ${rightChallenge.price} <span className="text-xs font-bold text-text-muted">{rightChallenge.currency || 'USD'}</span>
                  </span>
                </div>
              </div>

              {/* Specification Cards List */}
              <div className="space-y-2.5">
                {isFutures ? (
                  /* Futures layout specs */
                  <>
                    {/* Profit Target */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-accent-purple" /> Profit Target</span>
                        <div className="flex items-center gap-1.5">
                          {betterTarget === 'right' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Easier Target</span>
                          )}
                          <span className={`font-mono font-black ${betterTarget === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            ${rightChallenge.profit_target ? rightChallenge.profit_target.toLocaleString() : (rightChallenge.account_size * 0.08).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-accent-purple to-purple-500 h-full rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>

                    {/* Max Loss */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Max Drawdown</span>
                        <div className="flex items-center gap-1.5">
                          {betterMaxLoss === 'right' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">More Drawdown</span>
                          )}
                          <span className={`font-mono font-black ${betterMaxLoss === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            ${rightChallenge.max_loss ? rightChallenge.max_loss.toLocaleString() : (rightChallenge.account_size * 0.05).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    {/* Drawdown Type */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-accent-purple" /> Drawdown Type</span>
                      <span className="font-semibold text-text-primary font-mono capitalize">{rightChallenge.max_loss_type?.replace(/_/g, ' ') || 'Trailing'}</span>
                    </div>

                    {/* Contracts Allowed */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-accent-cyan" /> Contracts Allowed</span>
                      <span className="font-semibold text-text-primary font-mono">{rightChallenge.max_contract_size_minis || 10} Minis / {rightChallenge.max_contract_size_micros || 100} Micros</span>
                    </div>

                    {/* Activation Fee */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5 text-accent-cyan" /> Activation Fee</span>
                      <span className="font-semibold text-text-primary font-mono">{rightChallenge.activation_fee || 'None'}</span>
                    </div>

                    {/* Payout cycle */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-accent-cyan" /> Payout Frequency</span>
                      <span className="font-semibold text-text-primary font-mono">{rightChallenge.payout_freq || '14 Days (Standard)'}</span>
                    </div>
                  </>
                ) : (
                  /* Forex Layout specs */
                  <>
                    {/* Profit Target */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-accent-purple" /> Profit Target (P1 / P2)</span>
                        <div className="flex items-center gap-1.5">
                          {betterTarget === 'right' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">Easier Target</span>
                          )}
                          <span className={`font-mono font-black ${betterTarget === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            {rightChallenge.profit_target_p1 || '8'}% / {rightChallenge.profit_target_p2 || '5'}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-accent-purple to-purple-500 h-full rounded-full" 
                          style={{ width: `${Math.min(parseNumber(rightChallenge.profit_target_p1 || 8) * 10, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Daily Loss */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Daily Loss Limit</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-text-primary">
                            {rightChallenge.daily_loss_pct || '5'}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" 
                          style={{ width: `${Math.min(parseNumber(rightChallenge.daily_loss_pct || 5) * 15, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Max Loss */}
                    <div className="p-3.5 rounded-2xl bg-bg-base/30 border border-border-subtle/20 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Maximum Drawdown</span>
                        <div className="flex items-center gap-1.5">
                          {betterMaxLoss === 'right' && (
                            <span className="text-[8px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded font-mono uppercase">More Drawdown</span>
                          )}
                          <span className={`font-mono font-black ${betterMaxLoss === 'right' ? 'text-accent-cyan' : 'text-text-primary'}`}>
                            {rightChallenge.max_loss_pct || '10'}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-bg-base/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" 
                          style={{ width: `${Math.min(parseNumber(rightChallenge.max_loss_pct || 10) * 10, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Profit Split */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-accent-green" /> Profit Split Share</span>
                      <div className="flex items-center gap-2">
                        {betterSplit === 'right' && (
                          <span className="text-[8px] font-bold text-accent-green bg-accent-green/10 border border-accent-green/20 px-1.5 py-0.5 rounded font-mono uppercase">More Profit</span>
                        )}
                        <span className={`font-mono font-black ${betterSplit === 'right' ? 'text-accent-green' : 'text-text-primary'}`}>
                          {rightChallenge.profit_split_percent || rightChallenge.profit_split_pct || '80'}%
                        </span>
                      </div>
                    </div>

                    {/* Payout cycle */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                      <span className="text-text-muted font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-accent-cyan" /> Payout Frequency</span>
                      <span className="font-black text-text-primary font-mono">{rightChallenge.payout_freq || 'Bi-weekly'}</span>
                    </div>
                  </>
                )}

                {/* Supported Platforms (ENHANCED: Larger Platform names) */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                  <span className="text-text-muted font-bold flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-accent-cyan" /> Platforms</span>
                  <div className="flex flex-wrap gap-2 justify-end max-w-[260px]">
                    {rightFirm.platforms && rightFirm.platforms.length > 0 ? (
                      rightFirm.platforms.map((p: string) => (
                        <span key={p} className="px-3.5 py-1.5 rounded-xl bg-bg-base/60 border border-border-subtle/35 text-[11px] font-black text-accent-cyan font-mono uppercase tracking-widest shadow-inner">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-text-muted font-mono font-bold text-[11px] uppercase tracking-widest bg-bg-base/50 px-3 py-1 rounded-xl border border-border-subtle/30">Standard</span>
                    )}
                  </div>
                </div>

                {/* Ratio */}
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-base/20 border border-border-subtle/10 text-xs">
                  <span className="text-text-muted font-bold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> Reward/Risk Ratio (PT/DD)</span>
                  <span className="font-black text-text-primary font-mono">{rightChallenge.pt_dd_ratio || '1:1'}</span>
                </div>
              </div>
            </div>

            {/* CTA purchase link linked to admin configs */}
            <div className="pt-6">
              <Link href={rightChallenge.affiliate_url || rightFirm.affiliate_url || rightFirm.website_url || '/'} target="_blank" className="w-full block">
                <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:scale-[1.01]">
                  <span>{rightChallenge.cta_text || rightFirm.cta_text || 'Get Funded Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </AFXButton>
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-border-subtle/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[450px] bg-bg-surface/10">
            <span className="text-4xl mb-3">👈</span>
            <p className="text-sm font-bold text-text-secondary">Select a program on the right</p>
            <p className="text-xs text-text-muted mt-1">Choose a firm and challenge size to populate specifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
