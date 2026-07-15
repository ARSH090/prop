'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Gift } from 'lucide-react'
import { AFXCard } from '@/components/ui/afx-card'

interface Deal {
  id: string
  code: string
  title: string
  discount_label: string
  description: string
  firm_id: string
  is_featured: boolean
  click_count: number
  status: string
  expires_at?: any
}

interface Firm {
  id: string
  name: string
}

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [dealsRes, firmsRes] = await Promise.all([
          fetch('/api/admin/deals'),
          fetch('/api/admin/firms'),
        ])
        if (dealsRes.ok && firmsRes.ok) {
          const dealsData = await dealsRes.json()
          const firmsData = await firmsRes.json()
          setDeals(dealsData.data || [])
          setFirms(firmsData.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) return

    try {
      const res = await fetch(`/api/admin/deals/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setDeals((prev) => prev.filter((d) => d.id !== id))
      } else {
        alert('Failed to delete deal')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getFirmName = (firmId: string) => {
    const firm = firms.find((f) => f.id === firmId)
    return firm ? firm.name : 'Unknown'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Manage Promo Deals & Codes
          </h1>
          <p className="text-text-secondary text-sm">Create discount codes and track redirect click counts.</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          Create New Code
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Loading deals list...</div>
      ) : deals.length > 0 ? (
        <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/30">
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Code</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Prop Firm</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Discount</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Clicks</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="border-b border-border-subtle hover:bg-bg-base/20 transition-all"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-accent-cyan">{deal.code}</td>
                    <td className="px-6 py-4 font-semibold text-text-primary">
                      {getFirmName(deal.firm_id)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{deal.discount_label}</td>
                    <td className="px-6 py-4 font-mono text-text-secondary">{deal.click_count || 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          deal.status === 'active'
                            ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/deals/${deal.id}`}
                          className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-accent-cyan transition-all border border-border-subtle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(deal.id, deal.code)}
                          className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-red-400 transition-all border border-border-subtle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AFXCard>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary mb-4 text-sm font-semibold">No promotional codes found.</p>
          <Link
            href="/admin/deals/new"
            className="inline-flex px-6 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all"
          >
            Create First Code
          </Link>
        </div>
      )}
    </div>
  )
}
