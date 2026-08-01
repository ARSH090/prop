'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Search, X, Check, ArrowRight } from 'lucide-react'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

interface Rules {
  profit_target: string
  daily_loss: string
  max_drawdown: string
  profit_split: string
  steps: number | string
  duration: string
  re_entry: string
}

interface Firm {
  id: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  max_allocation: number
  rules: Rules
}

interface CompareClientProps {
  firms: Firm[]
}

export default function CompareClient({ firms }: CompareClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(['ftmo', 'topstep'])
  const [searchTerm, setSearchTerm] = useState('')

  const selectedFirms = selectedIds
    .map((id) => firms.find((f) => f.id === id))
    .filter(Boolean) as Firm[]

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    } else {
      if (selectedIds.length >= 4) {
        alert('You can select up to 4 firms to compare.')
        return
      }
      setSelectedIds((prev) => [...prev, id])
    }
  }

  const parsePercent = (val: string | undefined) => {
    if (!val) return 0
    return parseFloat(val.replace(/[^0-9.]/g, '')) || 0
  }

  // Find best value helpers
  const getBestAllocation = () => {
    if (selectedFirms.length < 2) return null
    const max = Math.max(...selectedFirms.map((f) => f.max_allocation || 0))
    return max > 0 ? max : null
  }

  const getBestRating = () => {
    if (selectedFirms.length < 2) return null
    const max = Math.max(...selectedFirms.map((f) => f.rating || 0))
    return max > 0 ? max : null
  }

  const getBestSplit = () => {
    if (selectedFirms.length < 2) return null
    const max = Math.max(...selectedFirms.map((f) => parsePercent(f.rules?.profit_split)))
    return max > 0 ? max : null
  }

  const bestAllocation = getBestAllocation()
  const bestRating = getBestRating()
  const bestSplit = getBestSplit()

  const filteredFirms = firms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedIds.includes(f.id)
  )

  return (
    <div className="grid md:grid-cols-4 gap-8">
      {/* Sidebar Selector */}
      <div className="md:col-span-1 space-y-4">
        <AFXCard className="bg-bg-surface border border-border-subtle p-5 space-y-4">
          <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider font-mono">
            Select Prop Program
          </h3>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search firms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {filteredFirms.map((f) => (
              <button
                key={f.id}
                onClick={() => handleSelect(f.id)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-bg-base text-text-secondary hover:text-text-primary transition-all flex items-center justify-between text-xs font-semibold"
              >
                <span>{f.name}</span>
                <span className="text-[10px] text-accent-cyan font-mono">+ Add</span>
              </button>
            ))}
          </div>

          {selectedFirms.length > 0 && (
            <div className="pt-4 border-t border-border-subtle/50 space-y-2">
              <p className="text-[10px] font-bold text-text-muted uppercase font-mono">Comparing:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedFirms.map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-xs text-text-primary"
                  >
                    {f.name}
                    <button
                      onClick={() => handleSelect(f.id)}
                      className="text-text-muted hover:text-red-400 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </AFXCard>
      </div>

      {/* Comparison Matrix Table */}
      <div className="md:col-span-3">
        {selectedFirms.length > 0 ? (
          <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono">
                    <th className="px-6 py-4 text-left font-bold">Metrics</th>
                    {selectedFirms.map((f) => (
                      <th key={f.id} className="px-6 py-4 text-center font-bold w-48">
                        <div className="flex flex-col items-center gap-1.5">
                          <img
                            src={getCleanLogoUrl(f.name, f.logo_url)}
                            alt={f.name}
                            className="w-8 h-8 object-contain bg-bg-base rounded p-1 border border-border-subtle"
                          />
                          <span className="text-text-primary font-bold">{f.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Rating */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Community Rating</td>
                    {selectedFirms.map((f) => {
                      const isBest = bestRating !== null && f.rating === bestRating
                      return (
                        <td
                          key={f.id}
                          className={`px-6 py-4 text-center font-mono font-bold ${
                            isBest ? 'text-accent-green' : 'text-text-primary'
                          }`}
                        >
                          {f.rating}/5 ⭐
                        </td>
                      );
                    })}
                  </tr>

                  {/* Max Allocation */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Max Allocation</td>
                    {selectedFirms.map((f) => {
                      const isBest = bestAllocation !== null && f.max_allocation === bestAllocation
                      return (
                        <td
                          key={f.id}
                          className={`px-6 py-4 text-center font-mono font-bold ${
                            isBest ? 'text-accent-green' : 'text-text-primary'
                          }`}
                        >
                          ${(f.max_allocation / 1000).toFixed(0)}K
                        </td>
                      );
                    })}
                  </tr>

                  {/* Steps */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Steps Structures</td>
                    {selectedFirms.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center font-mono text-xs">
                        {f.rules?.steps || '2'}-Step
                      </td>
                    ))}
                  </tr>

                  {/* Profit Target */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Profit Targets</td>
                    {selectedFirms.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center font-mono text-text-primary">
                        {f.rules?.profit_target || '10%'}
                      </td>
                    ))}
                  </tr>

                  {/* Daily Loss */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Daily Loss Limits</td>
                    {selectedFirms.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center font-mono text-red-400">
                        {f.rules?.daily_loss || '5%'}
                      </td>
                    ))}
                  </tr>

                  {/* Max Loss */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Maximum Loss Allowed</td>
                    {selectedFirms.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center font-mono text-red-400">
                        {f.rules?.max_drawdown || '10%'}
                      </td>
                    ))}
                  </tr>

                  {/* Profit Split */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Profit Split (%)</td>
                    {selectedFirms.map((f) => {
                      const isBest = bestSplit !== null && parsePercent(f.rules?.profit_split) === bestSplit
                      return (
                        <td
                          key={f.id}
                          className={`px-6 py-4 text-center font-mono font-bold ${
                            isBest ? 'text-accent-green' : 'text-text-primary'
                          }`}
                        >
                          {f.rules?.profit_split || '80%'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Trading Period */}
                  <tr className="border-b border-border-subtle hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Trading Duration</td>
                    {selectedFirms.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center text-xs">
                        {f.rules?.duration || 'Unlimited'}
                      </td>
                    ))}
                  </tr>

                  {/* Re-Entry */}
                  <tr className="hover:bg-bg-base/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-secondary">Re-Entry Mode</td>
                    {selectedFirms.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center text-xs capitalize">
                        {f.rules?.re_entry || 'Allowed'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </AFXCard>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold">Select prop firms from the panel to compare.</p>
          </div>
        )}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
