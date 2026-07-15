'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Trash2, Save, Plus } from 'lucide-react'

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
}

export default function AdminSpreadsPage() {
  const [spreads, setSpreads] = useState<Spread[]>([])
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newSpread, setNewSpread] = useState({
    firm_id: '',
    instrument: '',
    spread_pips: '',
    commission_note: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [spRes, brokersRes] = await Promise.all([
          fetch('/api/admin/spreads'),
          fetch('/api/admin/firms?type=broker'),
        ])
        if (spRes.ok && brokersRes.ok) {
          const spData = await spRes.json()
          const brokersData = await brokersRes.json()
          setSpreads(spData.data || [])
          const bList = brokersData.firms || []
          setBrokers(bList)
          if (bList.length > 0) {
            setNewSpread((prev) => ({ ...prev, firm_id: bList[0].id }))
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broker spread row?')) return

    try {
      const res = await fetch(`/api/admin/spreads/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSpreads((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSpread.firm_id || !newSpread.instrument || !newSpread.spread_pips) return

    try {
      const res = await fetch('/api/admin/spreads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpread),
      })
      if (res.ok) {
        const result = await res.json()
        setSpreads((prev) => [
          ...prev,
          {
            id: result.id,
            firm_id: newSpread.firm_id,
            instrument: newSpread.instrument.toUpperCase(),
            spread_pips: Number(newSpread.spread_pips),
            commission_note: newSpread.commission_note,
          },
        ])
        setNewSpread({
          firm_id: brokers[0]?.id || '',
          instrument: '',
          spread_pips: '',
          commission_note: '',
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getBrokerName = (brokerId: string) => {
    return brokers.find((b) => b.id === brokerId)?.name || 'Unknown Broker'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
          Manage Broker Spreads
        </h1>
        <p className="text-text-secondary text-sm">Add, remove, or modify instrument pips and commissions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Inline Form */}
        <div className="md:col-span-1">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary border-b border-border-subtle/50 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-accent-cyan" />
              Add Spread Metric
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Broker Partner</label>
                <select
                  value={newSpread.firm_id}
                  onChange={(e) => setNewSpread({ ...newSpread, firm_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                >
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Instrument Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EURUSD / XAUUSD"
                  value={newSpread.instrument}
                  onChange={(e) => setNewSpread({ ...newSpread, instrument: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Spread (pips)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 0.3"
                  value={newSpread.spread_pips}
                  onChange={(e) => setNewSpread({ ...newSpread, spread_pips: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Commission Note</label>
                <input
                  type="text"
                  placeholder="e.g. $2 per lot"
                  value={newSpread.commission_note}
                  onChange={(e) => setNewSpread({ ...newSpread, commission_note: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                />
              </div>

              <AFXButton
                type="submit"
                variant="primary"
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-2 rounded-xl text-bg-base"
              >
                Add Spread
              </AFXButton>
            </form>
          </AFXCard>
        </div>

        {/* Spreads List Table */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="text-center text-text-secondary py-12">Loading spreads database...</div>
          ) : spreads.length > 0 ? (
            <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono">
                      <th className="px-6 py-4 text-left font-bold">Broker</th>
                      <th className="px-6 py-4 text-center font-bold">Instrument</th>
                      <th className="px-6 py-4 text-center font-bold">Spread</th>
                      <th className="px-6 py-4 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spreads.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-border-subtle hover:bg-bg-base/20 transition-all text-text-secondary"
                      >
                        <td className="px-6 py-4 text-left font-bold text-text-primary">
                          {getBrokerName(s.firm_id)}
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold">
                          {s.instrument}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-accent-cyan font-bold">
                          {s.spread_pips} pips
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-red-400 border border-border-subtle transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AFXCard>
          ) : (
            <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
              <p className="text-text-secondary text-sm font-semibold">No spreads data registered.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
