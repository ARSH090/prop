'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { History, Calendar, ArrowRight, ShieldAlert } from 'lucide-react'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'
import { RulesSubNav } from '@/components/ui/rules-subnav'
import Link from 'next/link'

interface Firm {
  id: string
  name: string
  logo_url: string
  circle_crop_logo?: boolean
  logo_frame?: string
}

interface RuleHistoryLog {
  id: string
  firm_id: string
  rule_field: string
  old_value: string
  new_value: string
  changed_at: string
}

const FIELD_MAPPINGS: Record<string, { label: string; category: string; badgeColor: string }> = {
  max_daily_loss: { label: 'Max Daily Loss', category: 'Risk Limit', badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
  max_drawdown: { label: 'Max Drawdown', category: 'Risk Limit', badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
  drawdown_type: { label: 'Drawdown Calculation', category: 'Risk Policy', badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  consistency_rule: { label: 'Consistency Constraint', category: 'Trading Guidelines', badgeColor: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
  min_trading_days: { label: 'Min Trading Days', category: 'Trading Target', badgeColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  profit_target_phase1: { label: 'Profit Target Phase 1', category: 'Trading Target', badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  profit_target_phase2: { label: 'Profit Target Phase 2', category: 'Trading Target', badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  ea_allowed: { label: 'EAs Policy', category: 'Automation', badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  copy_trading_allowed: { label: 'Copy Trading Policy', category: 'Automation', badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  news_trading_allowed: { label: 'News Trading Policy', category: 'Automation', badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400' }
}

export default function RuleChangesPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [historyLogs, setHistoryLogs] = useState<RuleHistoryLog[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, historyRes] = await Promise.all([
          fetch('/api/firms?type=prop_firm'),
          fetch('/api/rules/history')
        ])
        if (firmsRes.ok && historyRes.ok) {
          const firmsData = await firmsRes.json()
          const historyData = await historyRes.json()
          setFirms(firmsData.firms || [])
          setHistoryLogs(historyData.data || [])
        }
      } catch (err) {
        console.error('Error fetching rule history logs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const richLogs = useMemo(() => {
    return historyLogs.map(log => {
      const firm = firms.find(f => f.id === log.firm_id)
      const fieldConfig = FIELD_MAPPINGS[log.rule_field] || {
        label: String(log.rule_field).replace(/_/g, ' '),
        category: 'Rule Modify',
        badgeColor: 'bg-bg-base border-border-subtle text-text-secondary'
      }

      return {
        ...log,
        firm,
        fieldConfig
      }
    })
  }, [historyLogs, firms])

  // Pagination bounds
  const totalPages = Math.ceil(richLogs.length / itemsPerPage)
  const paginatedLogs = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return richLogs.slice(startIdx, startIdx + itemsPerPage)
  }, [richLogs, currentPage])

  const formatRuleChangeText = (field: string, oldVal: string, newVal: string) => {
    const isBoolField = field.includes('allowed')
    if (isBoolField) {
      const wasAllowed = oldVal === 'true'
      const isAllowed = newVal === 'true'
      return `Allowed status changed from ${wasAllowed ? 'Allowed' : 'Blocked'} to ${isAllowed ? 'Allowed' : 'Blocked'}`
    }
    return `Changed from "${oldVal}" to "${newVal}"`
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
              <History className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Changelog Feed</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white afx-gradient-heading">
              Evaluation Rule Updates
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Historical modifications feed recording parameters edits, limits tweaks, and model structure adjustments across all prop programs.
            </p>
          </div>

          {/* Shared Sub Navigation */}
          <RulesSubNav />

          {/* Timeline Feed Container */}
          {loading ? (
            <div className="text-center py-12 text-text-muted text-xs">
              <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading history log feed...
            </div>
          ) : richLogs.length === 0 ? (
            <div className="border border-border-subtle bg-[#0D0B18]/45 p-12 text-center rounded-3xl">
              <p className="text-text-secondary text-sm font-semibold">No rules changelog history entries found.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Timeline cards */}
              <div className="relative border-l border-[#271E3A] pl-6 ml-4 space-y-6">
                {paginatedLogs.map((log) => {
                  const firm = log.firm
                  const dateStr = new Date(log.changed_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })

                  return (
                    <div key={log.id} className="relative group">
                      {/* Anchor Timeline bullet */}
                      <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-cyan ring-4 ring-[#05070D] transition-transform group-hover:scale-125" />

                      <div className="bg-[#120F1D] border border-[#271E3A] hover:border-accent-cyan/30 rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap transition-all">
                        {/* Left Details */}
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 pt-0.5">
                            {firm ? (
                              <PropFirmLogo
                                name={firm.name}
                                logoUrl={firm.logo_url}
                                circleCrop={firm.circle_crop_logo}
                                frame={firm.logo_frame}
                                className="w-8 h-8 rounded-lg border border-border-subtle/10"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#271E3A] flex items-center justify-center">
                                <ShieldAlert className="w-4 h-4 text-accent-cyan" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-white">{firm?.name || 'Unknown Firm'}</span>
                              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${log.fieldConfig.badgeColor}`}>
                                {log.fieldConfig.category}
                              </span>
                            </div>
                            <p className="text-xs font-black text-white flex items-center gap-1.5">
                              {log.fieldConfig.label}
                            </p>
                            <p className="text-xs text-text-muted">
                              {formatRuleChangeText(log.rule_field, log.old_value, log.new_value)}
                            </p>
                          </div>
                        </div>

                        {/* Right Date */}
                        <span className="text-[10px] text-text-muted font-mono shrink-0 select-none">
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-[#271E3A] text-xs font-bold text-text-secondary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-mono font-black text-text-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 rounded-xl border border-[#271E3A] text-xs font-bold text-text-secondary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
