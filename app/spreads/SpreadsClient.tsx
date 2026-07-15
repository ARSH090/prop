'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { TrendingUp, Percent } from 'lucide-react'

interface Spread {
  id: string
  firm_id: string
  instrument: string
  spread_pips: number
  commission_note: string
}

interface Broker {
  id: string
  name: string
  logo_url: string
  platforms: string[]
}

interface SpreadsClientProps {
  spreads: Spread[]
  brokers: Broker[]
}

export default function SpreadsClient({ spreads, brokers }: SpreadsClientProps) {
  const [selectedInstrument, setSelectedInstrument] = useState('all')

  const instruments = Array.from(new Set(spreads.map((s) => s.instrument)))

  const getBroker = (brokerId: string) => {
    return brokers.find((b) => b.id === brokerId)
  }

  const filteredSpreads = selectedInstrument === 'all'
    ? spreads
    : spreads.filter((s) => s.instrument === selectedInstrument)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-bg-surface/50 border border-border-subtle p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-text-secondary uppercase">Instrument:</span>
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent-cyan"
          >
            <option value="all">All Instruments</option>
            {instruments.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSpreads.length > 0 ? (
        <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono">
                  <th className="px-6 py-4 text-left font-bold">Broker</th>
                  <th className="px-6 py-4 text-center font-bold">Instrument</th>
                  <th className="px-6 py-4 text-center font-bold">Spread (pips)</th>
                  <th className="px-6 py-4 text-center font-bold">Commission</th>
                  <th className="px-6 py-4 text-center font-bold">Platform</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpreads.map((spread) => {
                  const broker = getBroker(spread.firm_id)
                  return (
                    <tr
                      key={spread.id}
                      className="border-b border-border-subtle hover:bg-bg-base/20 transition-all font-medium text-text-secondary"
                    >
                      <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2">
                        {broker?.logo_url ? (
                          <img
                            src={broker.logo_url}
                            alt={broker.name}
                            className="w-6 h-6 object-contain rounded"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-bg-base text-[10px] font-bold rounded flex items-center justify-center text-accent-cyan">
                            {broker?.name[0] || 'B'}
                          </div>
                        )}
                        <span>{broker?.name || 'Broker Partner'}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-text-primary">
                        {spread.instrument}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-accent-cyan font-bold">
                        {spread.spread_pips} pips
                      </td>
                      <td className="px-6 py-4 text-center text-xs">
                        {spread.commission_note || 'None'}
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-mono">
                        {broker?.platforms?.join(', ') || 'MT4 / MT5'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </AFXCard>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary text-sm font-semibold">No spreads data found for current filters.</p>
        </div>
      )}
    </div>
  )
}
