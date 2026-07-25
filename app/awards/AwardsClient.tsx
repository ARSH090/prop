'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Trophy, Users, ShieldCheck, Check, Info, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Firm {
  id: string
  name: string
  logo_url: string | null
  slug: string
}

interface DataAward {
  id: string
  title: string
  metric: string
  description: string
  firm: Firm | null
}

interface AwardCategory {
  id: string
  name: string
  description: string
  candidates: string[]
  track: 'traders_choice' | 'data_awards'
}

interface AwardsClientProps {
  initialFirms: Firm[]
  dataAwards: DataAward[]
}

export default function AwardsClient({ initialFirms, dataAwards }: AwardsClientProps) {
  const [activeTrack, setActiveTrack] = useState<'traders_choice' | 'data_awards'>('traders_choice')
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [voteTallies, setVoteTallies] = useState<Record<string, Record<string, number>>>({})
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [votingId, setVotingId] = useState<string | null>(null) // categoryId_firmId when executing vote

  const fetchData = async (userId?: string) => {
    try {
      const url = userId ? `/api/awards?user_id=${userId}` : '/api/awards'
      const res = await fetch(url)
      const data = await res.json()
      if (data.data) {
        setCategories(data.data.categories || [])
        setVoteTallies(data.data.voteTallies || {})
        setUserVotes(data.data.userVotes || {})
      }
    } catch (e) {
      console.error('Failed to fetch awards statistics', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      fetchData(user?.uid)
    })
    return unsub
  }, [])

  const handleVote = async (categoryId: string, firmId: string) => {
    if (!currentUser) {
      window.location.href = `/auth/login?redirect=/awards`
      return
    }

    setVotingId(`${categoryId}_${firmId}`)
    try {
      const res = await fetch('/api/awards/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.uid,
          category_id: categoryId,
          firm_id: firmId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        // Refresh local statistics
        await fetchData(currentUser.uid)
      }
    } catch (e) {
      console.error('Error submitting vote:', e)
    } finally {
      setVotingId(null)
    }
  }

  const getCategoryVotesTotal = (categoryId: string) => {
    const tallies = voteTallies[categoryId] || {}
    return Object.values(tallies).reduce((acc, curr) => acc + curr, 0)
  }

  return (
    <div className="space-y-8">
      {/* Track selector tabs */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-bg-surface border border-border-default rounded-2xl p-1.5 w-fit">
          <button
            onClick={() => setActiveTrack('traders_choice')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
              activeTrack === 'traders_choice'
                ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base shadow-md shadow-cyan-500/20'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Users className="w-4 h-4" />
            Traders Choice (Voted)
          </button>
          <button
            onClick={() => setActiveTrack('data_awards')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
              activeTrack === 'data_awards'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-bg-base shadow-md shadow-yellow-500/20'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Trophy className="w-4 h-4" />
            Data Awards (Metric-driven)
          </button>
        </div>
      </div>

      {activeTrack === 'traders_choice' ? (
        // TRADERS CHOICE TRACK
        loading ? (
          <div className="text-center py-16 text-xs text-text-muted">Loading awards categories...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category) => {
              const totalVotes = getCategoryVotesTotal(category.id)
              const userVotedFirmId = userVotes[category.id]
              const hasVoted = !!userVotedFirmId

              return (
                <div key={category.id} className="bg-bg-surface border border-border-default rounded-3xl p-6 space-y-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">{category.name}</h3>
                    <p className="text-text-secondary text-xs leading-relaxed">{category.description}</p>
                  </div>

                  <div className="space-y-4">
                    {category.candidates.map((candidateId) => {
                      const firm = initialFirms.find((f) => f.id === candidateId)
                      if (!firm) return null

                      const voteCount = voteTallies[category.id]?.[candidateId] || 0
                      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                      const isUserVote = userVotedFirmId === candidateId

                      return (
                        <div
                          key={candidateId}
                          className={cn(
                            "p-4 bg-bg-base/40 border rounded-2xl flex items-center justify-between gap-4 transition-all",
                            isUserVote ? 'border-accent-cyan bg-accent-cyan/5' : 'border-border-default'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-bg-base border border-border-default flex items-center justify-center overflow-hidden shrink-0">
                              {firm.logo_url ? (
                                <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
                              ) : (
                                <span className="text-xs font-bold text-accent-cyan">{firm.name[0]}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                                <span className="truncate pr-2">{firm.name}</span>
                                <span className="font-mono text-text-secondary">
                                  {percentage.toFixed(0)}% ({voteCount})
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden border border-border-default/50">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    isUserVote ? 'bg-accent-cyan' : 'bg-gradient-to-r from-accent-blue to-accent-purple'
                                  )}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isUserVote ? (
                              <div className="px-3 py-1.5 rounded-xl border border-accent-cyan/35 bg-accent-cyan/15 text-accent-cyan font-bold text-[10px] uppercase flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Voted
                              </div>
                            ) : (
                              <AFXButton
                                disabled={!!votingId}
                                onClick={() => handleVote(category.id, candidateId)}
                                className={cn(
                                  "font-bold text-[10px] px-3.5 py-1.5 rounded-xl transition-all border",
                                  hasVoted
                                    ? 'bg-transparent text-text-muted border-border-default cursor-not-allowed opacity-50'
                                    : 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base hover:opacity-90 border-transparent shadow-lg shadow-cyan-500/5'
                                )}
                              >
                                {votingId === `${category.id}_${candidateId}` ? 'Voting...' : 'Vote'}
                              </AFXButton>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 border-t border-border-default flex items-center justify-between text-[10px] text-text-muted font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
                      1 Vote Limit
                    </span>
                    <span>{totalVotes.toLocaleString()} votes cast</span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      ) : (
        // DATA AWARDS TRACK (Dynamic winners)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataAwards.map((award) => (
            <div
              key={award.id}
              className="bg-bg-surface border border-yellow-500/30 hover:border-yellow-500/50 shadow-lg shadow-yellow-500/5 rounded-3xl p-6 flex flex-col justify-between h-[300px] transition-all relative overflow-hidden group"
            >
              {/* Gold overlay reflection */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full filter blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />
              
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                  <Trophy className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-text-primary leading-tight">{award.title}</h3>
                  <p className="text-text-muted text-[10px] leading-relaxed">{award.description}</p>
                </div>
              </div>

              {award.firm ? (
                <div className="space-y-3 pt-4 border-t border-border-default">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-bg-base border border-border-default flex items-center justify-center overflow-hidden shrink-0">
                      {award.firm.logo_url ? (
                        <img src={award.firm.logo_url} alt={award.firm.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-[10px] font-bold text-accent-cyan">{award.firm.name[0]}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-xs text-text-primary truncate">{award.firm.name}</p>
                      <span className="text-[9px] font-bold text-yellow-400 font-mono tracking-wide uppercase bg-yellow-400/10 px-1.5 py-0.5 rounded">
                        {award.metric}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/firms/${award.firm.slug}`}
                    className="block w-full py-2 bg-bg-base border border-border-default hover:border-yellow-400/40 hover:text-yellow-400 text-text-secondary text-center text-xs font-bold rounded-xl transition-all"
                  >
                    View Metrics
                  </a>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-text-muted">No data available</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
