'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Check, X, Star, Trash2 } from 'lucide-react'

interface Review {
  id: string
  title: string
  body: string
  rating: number
  firm_id: string
  status: 'pending' | 'published' | 'rejected'
  is_verified_trader: boolean
  created_at: any
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      title: 'Decent but basic',
      body: 'Good entry-level firm but lacking advanced features. Rules are reasonable.',
      rating: 3,
      firm_id: 'traders-trust',
      status: 'pending',
      is_verified_trader: false,
      created_at: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleModerate = async (id: string, action: 'published' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    )
    alert(`Review marked as ${action} successfully!`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id))
      } else {
        setReviews((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (err) {
      console.error(err)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
          Moderate Trader Reviews
        </h1>
        <p className="text-text-secondary text-sm">Approve or reject user-submitted reviews before they go public.</p>
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <AFXCard
              key={review.id}
              className="bg-bg-surface border border-border-subtle p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold font-mono text-accent-cyan capitalize">
                    {review.firm_id.replace('-', ' ')}
                  </span>
                  <div className="flex text-accent-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-current' : 'text-text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      review.status === 'pending'
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        : review.status === 'published'
                        ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary">{review.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">{review.body}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                {review.status === 'pending' && (
                  <>
                    <AFXButton
                      onClick={() => handleModerate(review.id, 'published')}
                      variant="primary"
                      className="bg-accent-green hover:bg-accent-green/80 flex items-center gap-1.5 px-4 py-2 rounded-xl text-bg-base font-bold text-xs"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </AFXButton>
                    <AFXButton
                      onClick={() => handleModerate(review.id, 'rejected')}
                      variant="secondary"
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </AFXButton>
                  </>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-red-400 border border-border-subtle transition-all"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </AFXCard>
          ))}
        </div>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary text-sm font-semibold">Moderation queue is empty.</p>
        </div>
      )}
    </div>
  )
}
