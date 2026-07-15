'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Trash2, Plus, Check } from 'lucide-react'

interface Payout {
  id: string
  firm_id: string
  trader_display_name: string
  amount: number
  currency: string
  proof_image_url: string
  is_verified: boolean
}

interface Firm {
  id: string
  name: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newPayout, setNewPayout] = useState({
    firm_id: '',
    trader_display_name: '',
    amount: '',
    currency: 'USD',
    proof_image_url: '',
    is_verified: true,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [payRes, firmsRes] = await Promise.all([
          fetch('/api/admin/payouts'),
          fetch('/api/admin/firms'),
        ])
        if (payRes.ok && firmsRes.ok) {
          const payData = await payRes.json()
          const firmsData = await firmsRes.json()
          setPayouts(payData.data || [])
          const fList = (firmsData.data || []).filter((f: any) => f.type === 'prop_firm')
          setFirms(fList)
          if (fList.length > 0) {
            setNewPayout((prev) => ({ ...prev, firm_id: fList[0].id }))
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
    if (!confirm('Are you sure you want to delete this payout record?')) return

    try {
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setPayouts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPayout.firm_id || !newPayout.trader_display_name || !newPayout.amount) return

    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayout),
      })
      if (res.ok) {
        const result = await res.json()
        setPayouts((prev) => [
          ...prev,
          {
            id: result.id,
            firm_id: newPayout.firm_id,
            trader_display_name: newPayout.trader_display_name,
            amount: Number(newPayout.amount),
            currency: newPayout.currency,
            proof_image_url: newPayout.proof_image_url,
            is_verified: newPayout.is_verified,
          },
        ])
        setNewPayout({
          firm_id: firms[0]?.id || '',
          trader_display_name: '',
          amount: '',
          currency: 'USD',
          proof_image_url: '',
          is_verified: true,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getFirmName = (firmId: string) => {
    return firms.find((f) => f.id === firmId)?.name || 'Prop Partner'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
          Audited Payout Proofs
        </h1>
        <p className="text-text-secondary text-sm">Create anonymized payout confirmations and verify invoice receipts.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Payout Form */}
        <div className="md:col-span-1">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary border-b border-border-subtle/50 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-accent-cyan" />
              Add Payout Proof
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Prop Program</label>
                <select
                  value={newPayout.firm_id}
                  onChange={(e) => setNewPayout({ ...newPayout, firm_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                >
                  {firms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Trader Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul S."
                  value={newPayout.trader_display_name}
                  onChange={(e) => setNewPayout({ ...newPayout, trader_display_name: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Payout Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={newPayout.amount}
                  onChange={(e) => setNewPayout({ ...newPayout, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Receipt Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newPayout.proof_image_url}
                  onChange={(e) => setNewPayout({ ...newPayout, proof_image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                />
              </div>

              <AFXButton
                type="submit"
                variant="primary"
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-2 rounded-xl text-bg-base"
              >
                Add Payout
              </AFXButton>
            </form>
          </AFXCard>
        </div>

        {/* Payouts Table */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="text-center text-text-secondary py-12">Loading payouts database...</div>
          ) : payouts.length > 0 ? (
            <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono">
                      <th className="px-6 py-4 text-left font-bold">Trader</th>
                      <th className="px-6 py-4 text-center font-bold">Program</th>
                      <th className="px-6 py-4 text-center font-bold">Amount</th>
                      <th className="px-6 py-4 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border-subtle hover:bg-bg-base/20 transition-all text-text-secondary"
                      >
                        <td className="px-6 py-4 text-left font-bold text-text-primary">
                          {p.trader_display_name}
                        </td>
                        <td className="px-6 py-4 text-center text-xs">
                          {getFirmName(p.firm_id)}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-accent-green font-bold">
                          ${p.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(p.id)}
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
              <p className="text-text-secondary text-sm font-semibold">No payout proof confirmations loaded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
