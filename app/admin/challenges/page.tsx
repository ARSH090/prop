'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AFXCard } from '@/components/ui/afx-card'

interface Challenge {
  id: string
  firm_id: string
  account_size: number
  steps: number
  price: number
  is_active: boolean
  logo_url?: string
}

interface Firm {
  id: string
  name: string
  logo_url?: string
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [chRes, firmsRes] = await Promise.all([
          fetch('/api/admin/challenges'),
          fetch('/api/admin/firms'),
        ])
        if (chRes.ok && firmsRes.ok) {
          const chData = await chRes.json()
          const firmsData = await firmsRes.json()
          setChallenges(chData.data || [])
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge program?')) return

    try {
      const res = await fetch(`/api/admin/challenges/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setChallenges((prev) => prev.filter((c) => c.id !== id))
      } else {
        alert('Failed to delete challenge')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getFirmName = (firmId: string) => {
    return firms.find((f) => f.id === firmId)?.name || 'Unknown Firm'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Manage Challenge Packages
          </h1>
          <p className="text-text-secondary text-sm">Add or edit target limits, profit splits, and parameters.</p>
        </div>
        <Link
          href="/admin/challenges/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          Add Challenge
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Loading challenges...</div>
      ) : challenges.length > 0 ? (
        <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono">
                  <th className="px-6 py-4 text-left font-bold">Prop Firm</th>
                  <th className="px-6 py-4 text-center font-bold">Account Size</th>
                  <th className="px-6 py-4 text-center font-bold">Steps</th>
                  <th className="px-6 py-4 text-center font-bold">Price</th>
                  <th className="px-6 py-4 text-center font-bold">Status</th>
                  <th className="px-6 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border-subtle hover:bg-bg-base/20 transition-all text-text-secondary"
                  >
                    <td className="px-6 py-4 text-left font-bold text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center p-1 overflow-hidden shrink-0">
                          {c.logo_url || firms.find((f) => f.id === c.firm_id)?.logo_url ? (
                            <img 
                              src={c.logo_url || firms.find((f) => f.id === c.firm_id)?.logo_url} 
                              alt={getFirmName(c.firm_id)} 
                              className="w-6 h-6 object-contain" 
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-accent-cyan">{getFirmName(c.firm_id)[0]}</span>
                          )}
                        </div>
                        <span>{getFirmName(c.firm_id)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold">
                      ${(c.account_size / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs">
                      {c.steps}-Step
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-text-primary">
                      ${c.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.is_active
                            ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/challenges/${c.id}`}
                          className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-accent-cyan transition-all border border-border-subtle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id)}
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
          <p className="text-text-secondary mb-4 text-sm font-semibold">No challenge programs found.</p>
          <Link
            href="/admin/challenges/new"
            className="inline-flex px-6 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all"
          >
            Create First Program
          </Link>
        </div>
      )}
    </div>
  )
}
export const dynamic = 'force-dynamic'
