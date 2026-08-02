'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Check, X, ArrowRight, Star, RefreshCw, Layers } from 'lucide-react'
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
        // Sort by size asc
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

  // Value highlight comparison helpers
  const getCompareColor = (leftVal: number, rightVal: number, lowerIsBetter = false) => {
    if (leftVal === rightVal) return 'text-text-primary'
    const isLeftBetter = lowerIsBetter ? leftVal < rightVal : leftVal > rightVal
    return isLeftBetter ? 'text-accent-green font-extrabold' : 'text-text-secondary'
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-bg-surface/50 border border-border-subtle/50 rounded-2xl max-w-md mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-text-primary shadow-lg'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Selectors Grid (VS Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 items-center max-w-4xl mx-auto">
        {/* Left Selector Panel */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-bg-surface border border-border-subtle/60 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Select Firm</label>
            <select
              value={leftFirmId}
              onChange={(e) => handleLeftFirmChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors"
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
              className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {leftChallenges.length === 0 ? (
                <option value="">No packages available</option>
              ) : (
                leftChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    ${(c.account_size).toLocaleString()} Package (${c.price} {c.currency || 'USD'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* VS Divider Text */}
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 flex items-center justify-center font-black text-xs text-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.25)] animate-pulse">
            VS
          </div>
        </div>

        {/* Right Selector Panel */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-bg-surface border border-border-subtle/60 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Select Firm</label>
            <select
              value={rightFirmId}
              onChange={(e) => handleRightFirmChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors"
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
              className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rightChallenges.length === 0 ? (
                <option value="">No packages available</option>
              ) : (
                rightChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    ${(c.account_size).toLocaleString()} Package (${c.price} {c.currency || 'USD'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Side Program details */}
        {leftChallenge && leftFirm ? (
          <AFXCard className="relative overflow-hidden bg-bg-surface border border-border-subtle p-6 space-y-6 flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(34,211,238,0.06)] hover:border-accent-cyan/20">
            {/* Glossy sheen reflection */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              {/* Card Header details */}
              <div className="flex items-center gap-4 pb-4 border-b border-border-subtle/50">
                <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center p-2.5 border border-border-subtle shrink-0">
                  <img
                    src={getCleanLogoUrl(leftFirm.name, leftFirm.logo_url)}
                    alt={leftFirm.name}
                    className="max-h-full max-w-full object-contain filter brightness-110"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-text-primary">{leftFirm.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current text-accent-yellow" />
                    <span className="text-xs font-mono font-bold text-text-secondary">{leftFirm.rating}/5</span>
                    <span className="text-[10px] text-text-muted">({leftFirm.review_count} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Challenge main attributes */}
              <div className="text-center p-4 rounded-2xl bg-bg-base/40 border border-border-subtle/30 space-y-1">
                <p className="text-2xl font-black text-text-primary tracking-tight">
                  ${(leftChallenge.account_size).toLocaleString()} Challenge
                </p>
                <p className="text-sm font-bold text-accent-cyan font-mono">
                  {leftChallenge.steps}-Step Evaluation
                </p>
              </div>

              {/* Specs detailed listings */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Evaluation Price</span>
                  <span className="font-mono font-black text-text-primary">
                    ${leftChallenge.price} {leftChallenge.currency || 'USD'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Profit Target (Phase 1 / 2)</span>
                  <span className="font-mono font-bold text-text-primary">
                    {leftChallenge.profit_target_p1 || '8'}% / {leftChallenge.profit_target_p2 || '5'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Daily Loss Limit</span>
                  <span className="font-mono font-bold text-red-400">
                    {leftChallenge.daily_loss_pct || '5'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Maximum Loss Allowed</span>
                  <span className="font-mono font-bold text-red-400">
                    {leftChallenge.max_loss_pct || '10'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Profit Split Share</span>
                  <span className="font-mono font-bold text-accent-green">
                    {leftChallenge.profit_split_pct || '80'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Payout Frequency Cycle</span>
                  <span className="font-semibold text-text-primary">
                    {leftChallenge.payout_freq || 'Bi-weekly'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-text-muted font-semibold">Reward/Risk Ratio (PT/DD)</span>
                  <span className="font-mono font-semibold text-accent-cyan">
                    {leftChallenge.pt_dd_ratio || '1:1'}
                  </span>
                </div>
              </div>
            </div>

            {/* redirect URL button */}
            <div className="pt-6">
              <Link href={leftChallenge.affiliate_url || leftFirm.logo_url || '/'} target="_blank" className="w-full">
                <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:scale-[1.02]">
                  <span>Get Funded Now</span>
                  <ArrowRight className="w-4 h-4" />
                </AFXButton>
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-border-subtle/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <span className="text-4xl mb-2">👈</span>
            <p className="text-sm font-bold text-text-secondary">Select a program on the left</p>
            <p className="text-xs text-text-muted mt-1">Choose a firm and challenge size to populate specifications.</p>
          </div>
        )}

        {/* Right Side Program details */}
        {rightChallenge && rightFirm ? (
          <AFXCard className="relative overflow-hidden bg-bg-surface border border-border-subtle p-6 space-y-6 flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.06)] hover:border-accent-purple/20">
            {/* Glossy sheen reflection */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              {/* Card Header details */}
              <div className="flex items-center gap-4 pb-4 border-b border-border-subtle/50">
                <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center p-2.5 border border-border-subtle shrink-0">
                  <img
                    src={getCleanLogoUrl(rightFirm.name, rightFirm.logo_url)}
                    alt={rightFirm.name}
                    className="max-h-full max-w-full object-contain filter brightness-110"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-text-primary">{rightFirm.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current text-accent-yellow" />
                    <span className="text-xs font-mono font-bold text-text-secondary">{rightFirm.rating}/5</span>
                    <span className="text-[10px] text-text-muted">({rightFirm.review_count} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Challenge main attributes */}
              <div className="text-center p-4 rounded-2xl bg-bg-base/40 border border-border-subtle/30 space-y-1">
                <p className="text-2xl font-black text-text-primary tracking-tight">
                  ${(rightChallenge.account_size).toLocaleString()} Challenge
                </p>
                <p className="text-sm font-bold text-accent-purple font-mono">
                  {rightChallenge.steps}-Step Evaluation
                </p>
              </div>

              {/* Specs detailed listings */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Evaluation Price</span>
                  <span className="font-mono font-black text-text-primary">
                    ${rightChallenge.price} {rightChallenge.currency || 'USD'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Profit Target (Phase 1 / 2)</span>
                  <span className="font-mono font-bold text-text-primary">
                    {rightChallenge.profit_target_p1 || '8'}% / {rightChallenge.profit_target_p2 || '5'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Daily Loss Limit</span>
                  <span className="font-mono font-bold text-red-400">
                    {rightChallenge.daily_loss_pct || '5'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Maximum Loss Allowed</span>
                  <span className="font-mono font-bold text-red-400">
                    {rightChallenge.max_loss_pct || '10'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Profit Split Share</span>
                  <span className="font-mono font-bold text-accent-green">
                    {rightChallenge.profit_split_pct || '80'}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-border-subtle/30">
                  <span className="text-text-muted font-semibold">Payout Frequency Cycle</span>
                  <span className="font-semibold text-text-primary">
                    {rightChallenge.payout_freq || 'Bi-weekly'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-text-muted font-semibold">Reward/Risk Ratio (PT/DD)</span>
                  <span className="font-mono font-semibold text-accent-cyan">
                    {rightChallenge.pt_dd_ratio || '1:1'}
                  </span>
                </div>
              </div>
            </div>

            {/* redirect URL button */}
            <div className="pt-6">
              <Link href={rightChallenge.affiliate_url || rightFirm.logo_url || '/'} target="_blank" className="w-full">
                <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:scale-[1.02]">
                  <span>Get Funded Now</span>
                  <ArrowRight className="w-4 h-4" />
                </AFXButton>
              </Link>
            </div>
          </AFXCard>
        ) : (
          <div className="border-2 border-dashed border-border-subtle/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <span className="text-4xl mb-2">👉</span>
            <p className="text-sm font-bold text-text-secondary">Select a program on the right</p>
            <p className="text-xs text-text-muted mt-1">Choose a firm and challenge size to populate specifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
