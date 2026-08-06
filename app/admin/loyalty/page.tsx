'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { Plus, Edit2, Calendar, Save, ArrowLeft, Trash2, Key, Users, Diamond } from 'lucide-react'

interface LoyaltyUser {
  id: string
  email: string
  points: number
  tier: number
  unlocked_rewards?: string[]
}

interface LoyaltyCode {
  id: string
  points: number
  used_by: string[]
}

export default function AdminLoyaltyPage() {
  const [users, setUsers] = useState<LoyaltyUser[]>([])
  const [codes, setCodes] = useState<LoyaltyCode[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingCodes, setLoadingCodes] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Form states
  const [newCode, setNewCode] = useState('')
  const [newPoints, setNewPoints] = useState('100')
  const [submittingCode, setSubmittingCode] = useState(false)

  // Edit user points state
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [editPointsVal, setEditPointsVal] = useState('')
  const [updatingPoints, setUpdatingPoints] = useState(false)

  // Edit loyalty code state
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [editCodePointsVal, setEditCodePointsVal] = useState('')
  const [updatingCode, setUpdatingCode] = useState(false)

  useEffect(() => {
    loadUsers()
    loadCodes()
  }, [])

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/loyalty?type=users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadCodes = async () => {
    setLoadingCodes(true)
    try {
      const res = await fetch('/api/admin/loyalty?type=codes')
      if (res.ok) {
        const data = await res.json()
        setCodes(data.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCodes(false)
    }
  }

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim() || !newPoints) return
    setSubmittingCode(true)
    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode, points: newPoints }),
      })
      if (res.ok) {
        setNewCode('')
        setNewPoints('100')
        loadCodes()
        alert('Loyalty promo code created successfully!')
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to create loyalty code')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingCode(false)
    }
  }

  const handleDeleteCode = async (code: string) => {
    if (!confirm(`Are you sure you want to delete code "${code}"?`)) return
    try {
      const res = await fetch(`/api/admin/loyalty?code=${code}`, { method: 'DELETE' })
      if (res.ok) {
        setCodes((prev) => prev.filter((c) => c.id !== code))
      } else {
        alert('Failed to delete code')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdatePoints = async (email: string) => {
    if (!editPointsVal || isNaN(Number(editPointsVal))) {
      alert('Please enter a valid numeric points value.')
      return
    }
    setUpdatingPoints(true)
    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, points: editPointsVal }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === email ? { ...u, points: Number(editPointsVal) } : u))
        )
        setEditingEmail(null)
        setEditPointsVal('')
        alert('User points updated successfully!')
      } else {
        alert('Failed to update points')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingPoints(false)
    }
  }

  const handleUpdateCode = async (code: string) => {
    if (!editCodePointsVal || isNaN(Number(editCodePointsVal))) {
      alert('Please enter a valid numeric points value.')
      return
    }
    setUpdatingCode(true)
    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, points: editCodePointsVal }),
      })
      if (res.ok) {
        setCodes((prev) =>
          prev.map((c) => (c.id === code ? { ...c, points: Number(editCodePointsVal) } : c))
        )
        setEditingCode(null)
        setEditCodePointsVal('')
        alert('Loyalty code points updated successfully!')
      } else {
        alert('Failed to update code points')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingCode(false)
    }
  }

  const filteredUsers = users.filter((u) =>
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Loyalty Panel Admin
          </h1>
          <p className="text-text-secondary text-sm">
            Modify user loyalty balances, inspect unlocked challenges, and issue promo reward codes.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Codes management */}
        <div className="md:col-span-1 space-y-6">
          <form onSubmit={handleCreateCode}>
            <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-accent-cyan" />
                Issue Loyalty Code
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Code Name</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. LOYALTY250"
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary text-xs focus:border-accent-cyan outline-none font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Points Value</label>
                <input
                  type="number"
                  required
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary text-xs focus:border-accent-cyan outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={submittingCode}
                className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base text-xs hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                {submittingCode ? 'Generating...' : 'Issue Code'}
              </button>
            </AFXCard>
          </form>

          {/* List codes */}
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider">
              Issued Promo Codes ({codes.length})
            </h3>
            {loadingCodes ? (
              <p className="text-xs text-text-muted">Loading codes...</p>
            ) : codes.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {codes.map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-3 rounded-xl border border-border-subtle bg-bg-base/40">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-text-primary font-mono">{c.id}</p>
                      {editingCode === c.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editCodePointsVal}
                            onChange={(e) => setEditCodePointsVal(e.target.value)}
                            className="w-16 px-1.5 py-0.5 bg-bg-base border border-border-subtle rounded text-[10px] text-text-primary outline-none"
                          />
                          <button
                            onClick={() => handleUpdateCode(c.id)}
                            disabled={updatingCode}
                            className="p-1 bg-accent-green/20 text-accent-green hover:bg-accent-green/30 rounded border border-accent-green/30 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                          +{c.points} PTS · {c.used_by?.length || 0} times used
                        </p>
                      )}
                    </div>
                    
                    {editingCode !== c.id && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCode(c.id)
                            setEditCodePointsVal(String(c.points))
                          }}
                          className="p-1 rounded-lg border border-border-subtle bg-bg-surface text-text-muted hover:text-accent-cyan hover:border-accent-cyan/35 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCode(c.id)}
                          className="p-1 rounded-lg border border-border-subtle bg-bg-surface text-text-muted hover:text-red-400 hover:border-red-500/25 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">No codes found.</p>
            )}
          </AFXCard>
        </div>

        {/* Users list */}
        <div className="md:col-span-2 space-y-6">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap pb-2 border-b border-border-subtle/50">
              <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-cyan" />
                Loyalty Users Account Register
              </h3>
              
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 bg-bg-base border border-border-subtle rounded-xl text-xs text-text-primary focus:border-accent-cyan outline-none"
              />
            </div>

            {loadingUsers ? (
              <p className="text-xs text-text-muted py-8 text-center">Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-4 divide-y divide-border-subtle/30">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="pt-4 first:pt-0 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-text-primary">{u.id}</p>
                      <div className="flex gap-2 text-[10px] text-text-muted font-mono">
                        <span className="flex items-center gap-0.5">
                          <Diamond className="w-2.5 h-2.5 text-accent-purple" />
                          {u.points} Points
                        </span>
                        <span>· Tier {u.tier || 1}</span>
                        {u.unlocked_rewards && u.unlocked_rewards.length > 0 && (
                          <span>· Unlocked: {u.unlocked_rewards.join(', ')}</span>
                        )}
                      </div>
                    </div>

                    {editingEmail === u.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editPointsVal}
                          onChange={(e) => setEditPointsVal(e.target.value)}
                          className="w-20 px-2 py-1 bg-bg-base border border-border-subtle rounded text-xs text-text-primary outline-none"
                        />
                        <button
                          onClick={() => handleUpdatePoints(u.id)}
                          disabled={updatingPoints}
                          className="p-1.5 bg-accent-green/20 text-accent-green hover:bg-accent-green/30 rounded border border-accent-green/30 transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingEmail(u.id)
                          setEditPointsVal(String(u.points))
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border border-border-subtle rounded-lg bg-bg-base hover:text-accent-cyan hover:border-accent-cyan/30 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Points
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted text-center py-8">No users found.</p>
            )}
          </AFXCard>
        </div>
      </div>
    </div>
  )
}
