'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Trophy, RefreshCw, Plus, Check, Trash2, HelpCircle, Info } from 'lucide-react'

interface Firm {
  id: string
  name: string
  logo_url: string | null
}

interface AwardCategory {
  id: string
  name: string
  description: string
  candidates: string[]
  track: 'traders_choice' | 'data_awards'
}

interface AwardsAdminClientProps {
  activeFirms: Firm[]
}

export default function AwardsAdminClient({ activeFirms }: AwardsAdminClientProps) {
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [voteTallies, setVoteTallies] = useState<Record<string, Record<string, number>>>({})
  const [loading, setLoading] = useState(true)

  // Edit / Creation state
  const [editingId, setEditingId] = useState<string>('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/awards')
      const data = await res.json()
      if (data.data) {
        setCategories(data.data.categories || [])
        setVoteTallies(data.data.voteTallies || {})
      }
    } catch (e) {
      console.error('Failed to load awards meta', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId.trim() || !name.trim()) {
      setErrorMsg('Category ID and Name are required.')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/admin/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_or_update',
          category_id: editingId.trim().toLowerCase(),
          name: name.trim(),
          description: description.trim(),
          candidates: selectedCandidates,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSuccessMsg('Category saved successfully!')
        // Reset form
        setEditingId('')
        setName('')
        setDescription('')
        setSelectedCandidates([])
        // Refresh data
        await fetchData()
      } else {
        setErrorMsg(data.error || 'Failed to save category.')
      }
    } catch (e) {
      setErrorMsg('An error occurred during submission.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetVotes = async () => {
    const confirmed = window.confirm(
      'WARNING: Are you absolutely sure you want to clear and reset all user votes for the current year? This action is permanent and cannot be undone.'
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_votes' }),
      })
      const data = await res.json()
      if (data.success) {
        alert('All votes have been cleared!')
        await fetchData()
      } else {
        alert(data.error || 'Failed to reset votes.')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const toggleCandidate = (firmId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(firmId) ? prev.filter((id) => id !== firmId) : [...prev, firmId]
    )
  }

  const handleEditClick = (cat: AwardCategory) => {
    setEditingId(cat.id)
    setName(cat.name)
    setDescription(cat.description)
    setSelectedCandidates(cat.candidates || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Category Editor Form (left 1 col) */}
      <div className="xl:col-span-1 space-y-6">
        <AFXCard className="border border-border-default bg-bg-surface p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent-cyan" />
            Manage Category
          </h2>

          <form onSubmit={handleSubmitCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Category ID (unique, slug format)
              </label>
              <input
                type="text"
                placeholder="e.g. best_crypto_firm"
                value={editingId}
                onChange={(e) => setEditingId(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-xl text-text-primary text-sm focus:border-accent-cyan focus:outline-none placeholder:text-text-muted"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Category Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Best Crypto Prop Firm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-xl text-text-primary text-sm focus:border-accent-cyan focus:outline-none placeholder:text-text-muted"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Description
              </label>
              <textarea
                placeholder="Brief summary of what this category recognizes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-xl text-text-primary text-sm focus:border-accent-cyan focus:outline-none placeholder:text-text-muted resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2">
                Select Candidates ({selectedCandidates.length})
              </label>
              <div className="max-h-[220px] overflow-y-auto border border-border-default rounded-xl bg-bg-base p-2.5 space-y-2">
                {activeFirms.map((firm) => {
                  const isChecked = selectedCandidates.includes(firm.id)
                  return (
                    <button
                      type="button"
                      key={firm.id}
                      onClick={() => toggleCandidate(firm.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'border-accent-cyan bg-accent-cyan/10 text-text-primary'
                          : 'border-transparent hover:bg-bg-surface/50 text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {firm.logo_url && (
                          <img src={firm.logo_url} alt="" className="w-5 h-5 object-contain" />
                        )}
                        <span>{firm.name}</span>
                      </div>
                      {isChecked && <Check className="w-4 h-4 text-accent-cyan shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {errorMsg && <p className="text-xs font-semibold text-red-400">{errorMsg}</p>}
            {successMsg && <p className="text-xs font-semibold text-accent-green">{successMsg}</p>}

            <div className="flex justify-end pt-2">
              <AFXButton
                type="submit"
                disabled={submitting}
                variant="primary"
                className="bg-gradient-to-r from-accent-cyan to-accent-blue font-bold py-2 px-5 text-xs text-bg-base"
              >
                {submitting ? 'Saving...' : 'Save Category'}
              </AFXButton>
            </div>
          </form>
        </AFXCard>

        {/* Global actions (reset) */}
        <AFXCard className="border border-red-500/20 bg-bg-surface/30 p-6 space-y-3">
          <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h3>
          <p className="text-text-muted text-xs leading-relaxed">
            Reset all user votes to launch a new yearly cycle or clear test votes.
          </p>
          <button
            onClick={handleResetVotes}
            className="w-full py-2 bg-red-600/25 border border-red-600/40 text-red-400 hover:bg-red-600/45 text-xs font-bold rounded-xl transition-all"
          >
            Reset Yearly Votes
          </button>
        </AFXCard>
      </div>

      {/* Categories & Tallies View (right 2 cols) */}
      <div className="xl:col-span-2 space-y-6">
        <AFXCard className="border border-border-default bg-bg-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Yearly Categories ({categories.length})
            </h2>
            <button
              onClick={fetchData}
              className="p-2 border border-border-default bg-bg-base rounded-xl text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/40 transition-all"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-text-muted">Loading live votes...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-muted">
              No categories configured yet. They will initialize on next load.
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((cat) => {
                const tallies = voteTallies[cat.id] || {}
                const totalVotes = Object.values(tallies).reduce((acc, curr) => acc + curr, 0)

                return (
                  <div
                    key={cat.id}
                    className="p-5 border border-border-default rounded-2xl bg-bg-base/30 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-text-muted font-mono uppercase mt-0.5">
                          ID: {cat.id} • {totalVotes.toLocaleString()} votes cast
                        </p>
                      </div>
                      <AFXButton
                        variant="secondary"
                        onClick={() => handleEditClick(cat)}
                        className="text-[10px] font-bold py-1 px-3 border border-border-default hover:border-accent-cyan/40 text-text-secondary rounded-lg shrink-0"
                      >
                        Edit
                      </AFXButton>
                    </div>

                    <div className="space-y-3">
                      {cat.candidates && cat.candidates.length > 0 ? (
                        cat.candidates.map((firmId) => {
                          const firm = activeFirms.find((f) => f.id === firmId)
                          const count = tallies[firmId] || 0
                          const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0

                          return (
                            <div key={firmId} className="flex items-center justify-between gap-4 text-xs font-semibold">
                              <span className="text-text-secondary truncate">{firm?.name ?? firmId}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-text-muted">({count})</span>
                                <span className="font-mono text-accent-cyan w-10 text-right">
                                  {pct.toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-xs text-text-muted italic flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          No candidates assigned yet.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </AFXCard>
      </div>
    </div>
  )
}
