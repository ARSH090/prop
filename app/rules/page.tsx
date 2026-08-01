'use client'

import React, { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { HelpCircle, Calendar, ShieldCheck, ListFilter } from 'lucide-react'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState<'key-rules' | 'changes' | 'policies'>('key-rules')
  const [firms, setFirms] = useState<any[]>([])
  const [changelog, setChangelog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, rulesRes] = await Promise.all([
          fetch('/api/firms?type=prop_firm'),
          fetch('/api/rules')
        ])
        if (firmsRes.ok && rulesRes.ok) {
          const firmsData = await firmsRes.json()
          const rulesData = await rulesRes.json()
          setFirms(firmsData || [])
          setChangelog(rulesData.data || [])
        }
      } catch (err) {
        console.error('Error loading rules comparison data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-20 text-center text-text-secondary text-sm animate-pulse">
          Loading rules comparison dashboard...
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Prop Evaluation Rules Comparison
          </h1>
          <p className="text-text-secondary text-sm">
            Quick factual specifications of profit targets, drawdowns, platforms, and dated rule updates.
          </p>
        </div>

        {/* 3 Tabs navigation */}
        <div className="flex border-b border-border-subtle/50 pb-px gap-2">
          <button
            onClick={() => setActiveTab('key-rules')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'key-rules'
                ? 'border-accent-cyan text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Key Rules Comparison
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'changes'
                ? 'border-accent-cyan text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Rule Changes Log Feed
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'policies'
                ? 'border-accent-cyan text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Platforms & Policies (EA/Copy)
          </button>
        </div>

        {/* Tab 1: Key Rules */}
        {activeTab === 'key-rules' && (
          <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono text-xs uppercase">
                    <th className="px-6 py-4 font-bold">Prop Firm</th>
                    <th className="px-6 py-4 text-center font-bold">Steps</th>
                    <th className="px-6 py-4 text-center font-bold">Profit Target</th>
                    <th className="px-6 py-4 text-center font-bold">Drawdown Type</th>
                    <th className="px-6 py-4 text-center font-bold">Daily Drawdown</th>
                    <th className="px-6 py-4 text-center font-bold">Max Drawdown</th>
                    <th className="px-6 py-4 text-center font-bold">Consistency Rule</th>
                    <th className="px-6 py-4 text-center font-bold">Min Trading Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 text-text-secondary">
                  {firms.map((firm) => {
                    const r = firm.rules || {}
                    return (
                      <tr
                        key={firm.id}
                        className="hover:bg-bg-base/20 transition-all font-medium"
                      >
                        <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2">
                          <img
                            src={getCleanLogoUrl(firm.name, firm.logo_url)}
                            alt={firm.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span>{firm.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs">
                          {r.steps || '2'}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-text-primary font-bold">
                          {r.profit_target || '10%'}
                        </td>
                        <td className="px-6 py-4 text-center capitalize font-mono text-xs text-accent-purple">
                          {r.drawdown_type || 'static'}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-red-400">
                          {r.daily_loss || '3%'}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-red-400">
                          {r.max_drawdown || '5%'}
                        </td>
                        <td className="px-6 py-4 text-center text-xs">
                          {r.consistency_rule_percent || 'No'}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs">
                          {r.min_trading_days || '0'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </AFXCard>
        )}

        {/* Tab 2: Rule Changes Log */}
        {activeTab === 'changes' && (
          <AFXCard className="border border-border-subtle bg-bg-surface p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-border-subtle/50 pb-3">
              <Calendar className="w-5 h-5 text-accent-cyan" />
              <h3 className="text-lg font-bold text-text-primary">Historical Rules Feed & Updates</h3>
            </div>
            {changelog.length === 0 ? (
              <div className="text-center py-10 text-text-secondary text-sm">
                No recent changes logged. Rules policies are stable.
              </div>
            ) : (
              <div className="relative border-l-2 border-border-subtle/50 ml-4 pl-6 space-y-6">
                {changelog.map((log) => {
                  const firm = firms.find((f) => f.id === log.firm_id)
                  return (
                    <div key={log.id} className="relative group">
                      {/* Circle indicator */}
                      <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent-cyan ring-4 ring-bg-surface transition-transform group-hover:scale-125" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">
                            {firm?.name || 'Prop Firm'}
                          </span>
                          <span className="text-xs text-text-muted font-mono">
                            • {log.effective_date}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Changed: <span className="font-semibold text-accent-purple font-mono uppercase">{log.rule_key.replace(/_/g, ' ')}</span>
                        </p>
                        <div className="flex items-center gap-3 text-xs bg-bg-base border border-border-subtle/40 px-3 py-1.5 rounded-lg w-max">
                          {log.previous_value !== null && (
                            <>
                              <span className="text-red-400 line-through font-medium">{log.previous_value}</span>
                              <span className="text-text-muted">➔</span>
                            </>
                          )}
                          <span className="text-green-400 font-bold">{log.rule_value}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </AFXCard>
        )}

        {/* Tab 3: Policies (EA/Copy/Platforms) */}
        {activeTab === 'policies' && (
          <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono text-xs uppercase">
                    <th className="px-6 py-4 font-bold">Prop Firm</th>
                    <th className="px-6 py-4 text-center font-bold">EAs Allowed</th>
                    <th className="px-6 py-4 text-center font-bold">Copy Trading</th>
                    <th className="px-6 py-4 text-center font-bold">News Trading</th>
                    <th className="px-6 py-4 text-left font-bold">Supported Platforms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 text-text-secondary">
                  {firms.map((firm) => {
                    const r = firm.rules || {}
                    const platformsList = firm.platforms ? firm.platforms.join(', ') : 'MT4, MT5'
                    return (
                      <tr
                        key={firm.id}
                        className="hover:bg-bg-base/20 transition-all font-medium"
                      >
                        <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2">
                          <img
                            src={getCleanLogoUrl(firm.name, firm.logo_url)}
                            alt={firm.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span>{firm.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.ea_allowed?.toLowerCase() === 'no'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {r.ea_allowed || 'Yes'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.copy_trading_allowed?.toLowerCase() === 'no'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {r.copy_trading_allowed || 'Yes'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.news_trading_allowed?.toLowerCase() === 'no'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {r.news_trading_allowed || 'Yes'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left font-mono text-xs text-text-primary">
                          {platformsList}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </AFXCard>
        )}

        <div className="flex gap-4 p-4 bg-bg-surface border border-border-subtle/50 rounded-2xl text-xs text-text-muted">
          <HelpCircle className="w-5 h-5 text-accent-cyan flex-shrink-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-text-secondary">Methodology Note:</span> These parameters represent standard program sizes ($100,000 challenge or closest tier). Individual challenge listings may vary depending on the target account size chosen.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
