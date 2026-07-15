'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Star, MessageSquare, Check, ShieldCheck } from 'lucide-react'
import { auth } from '@/lib/firebase/client'

interface Review {
  id: string
  firm_id: string
  rating: number
  title: string
  body: string
  full_name: string
  is_verified_trader: boolean
  created_at: any
}

interface Firm {
  id: string
  name: string
}

interface ReviewsClientProps {
  firms: Firm[]
}

export default function ReviewsClient({ firms }: ReviewsClientProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Filter params
  const [filterFirm, setFilterFirm] = useState('all')
  const [filterRating, setFilterRating] = useState('all')

  // Review Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    firm_id: firms[0]?.id || '',
    rating: '5',
    title: '',
    body: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return unsub
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [filterFirm])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews?firm_id=${filterFirm}`)
      if (res.ok) {
        const json = await res.json()
        setReviews(json.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.uid,
          full_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Trader',
          ...formData,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setFormData({
          firm_id: firms[0]?.id || '',
          rating: '5',
          title: '',
          body: '',
        })
        setTimeout(() => {
          setSuccess(false)
          setShowForm(false)
        }, 3000)
      } else {
        alert('Failed to submit review')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === Number(filterRating))

  const getFirmName = (firmId: string) => {
    return firms.find((f) => f.id === firmId)?.name || 'Unknown Firm'
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Sidebar Controls */}
      <div className="md:col-span-1 space-y-6">
        <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
          <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider">
            Review Filters
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Prop Firm</label>
              <select
                value={filterFirm}
                onChange={(e) => setFilterFirm(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
              >
                <option value="all">All Firms</option>
                {firms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Star Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
              >
                <option value="all">Any Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </AFXCard>

        {currentUser ? (
          <AFXButton
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs"
          >
            <MessageSquare className="w-4 h-4" />
            Write A Review
          </AFXButton>
        ) : (
          <div className="p-4 border border-border-subtle bg-bg-surface/30 rounded-2xl text-center text-xs text-text-muted leading-relaxed">
            Please{' '}
            <a href="/auth/login?redirect=/reviews" className="text-accent-cyan underline hover:text-accent-cyan/85">
              Sign In
            </a>{' '}
            to write trader reviews.
          </div>
        )}
      </div>

      {/* Main Reviews Panel */}
      <div className="md:col-span-2 space-y-6">
        {/* Write form popup/drawer */}
        {showForm && (
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-text-primary">Submit Prop Review</h3>
            {success ? (
              <p className="text-xs text-accent-green font-bold flex items-center gap-1.5 p-3 bg-accent-green/10 rounded-xl border border-accent-green/20">
                <Check className="w-4 h-4" />
                Review submitted successfully! It is pending moderation audit checks.
              </p>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Select Firm</label>
                    <select
                      value={formData.firm_id}
                      onChange={(e) => setFormData({ ...formData, firm_id: e.target.value })}
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
                    <label className="text-[10px] font-bold text-text-muted uppercase">Stars Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">Review Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Excellent Payout speed"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">Review Body</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about platform execution, dashboard delays, rules..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary resize-none"
                  />
                </div>

                <AFXButton
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-2 rounded-xl text-bg-base"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </AFXButton>
              </form>
            )}
          </AFXCard>
        )}

        {loading ? (
          <div className="text-center text-text-secondary py-12">Loading reviews feed...</div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((rev) => {
              const dateStr = rev.created_at
                ? new Date(
                    rev.created_at.seconds ? rev.created_at.seconds * 1000 : rev.created_at
                  ).toLocaleDateString()
                : 'Recent'
              return (
                <AFXCard key={rev.id} className="bg-bg-surface border border-border-subtle p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold font-mono text-accent-cyan uppercase tracking-wider">
                        {getFirmName(rev.firm_id)}
                      </p>
                      <h4 className="font-bold text-text-primary text-base">{rev.title}</h4>
                    </div>

                    <div className="flex text-accent-yellow">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-text-secondary text-xs leading-relaxed">{rev.body}</p>

                  <div className="pt-3 border-t border-border-subtle/50 mt-3 flex items-center justify-between text-[10px] text-text-muted font-mono">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>By {rev.full_name || 'Anonymous'}</span>
                    </div>
                    <span>{dateStr}</span>
                  </div>
                </AFXCard>
              )
            })}
          </div>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold">No verified trader reviews found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
