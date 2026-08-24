'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { AFXCard } from './afx-card'
import { AFXButton } from './afx-button'
import { MessageSquare, Calendar, Send, ShieldAlert } from 'lucide-react'

interface Comment {
  id: string
  user_id: string
  user_name: string
  body: string
  created_at: string
}

interface CommentsSectionProps {
  firmId?: string
  blogPostId?: string
  communityPostId?: string
}

export function CommentsSection({ firmId, blogPostId, communityPostId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch comments
  const fetchComments = async () => {
    try {
      let url = ''
      if (firmId) {
        url = `/api/comments?firm_id=${firmId}`
      } else if (blogPostId) {
        url = `/api/comments?blog_post_id=${blogPostId}`
      } else if (communityPostId) {
        url = `/api/comments?community_post_id=${communityPostId}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.data) {
        setComments(data.data)
      }
    } catch (e) {
      console.error('Failed to fetch comments', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    const unsub = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
    })
    return unsub
  }, [firmId, blogPostId, communityPostId])

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setError('You must be signed in to comment.')
      return
    }
    if (!body.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        firm_id: firmId || null,
        blog_post_id: blogPostId || null,
        community_post_id: communityPostId || null,
        user_id: currentUser.uid,
        user_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Trader',
        body: body.trim()
      }

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        setBody('')
        fetchComments() // Reload
      } else {
        setError(data.error || 'Failed to submit comment.')
      }
    } catch (e) {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-accent-cyan" />
        <h3 className="text-xl font-bold text-text-primary">Trader Discussions ({comments.length})</h3>
      </div>

      {/* Form or Auth Gate */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-3 bg-bg-surface border border-border-default p-4 rounded-2xl">
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Write a comment</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Join the discussion... share your experience, ask questions, or discuss trading conditions."
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-xl text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors placeholder:text-text-muted resize-none"
            />
          </div>
          {error && (
            <p className="text-xs text-red-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <AFXButton
              type="submit"
              disabled={submitting || !body.trim()}
              variant="primary"
              className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold text-xs py-2 px-4 flex items-center gap-1.5"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
              <Send className="w-3 h-3" />
            </AFXButton>
          </div>
        </form>
      ) : (
        <div className="p-4 border border-border-default bg-bg-surface/30 rounded-2xl text-center text-xs text-text-muted leading-relaxed">
          Please{' '}
          <a href="/auth/login" className="text-accent-cyan underline hover:text-accent-cyan/85 font-semibold">
            Sign In
          </a>{' '}
          to join the trader community discussion.
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="text-center py-6 text-xs text-text-muted">Loading discussions...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 border border-border-default rounded-2xl bg-bg-surface/20 text-xs text-text-muted">
          No comments yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-bg-surface/40 border border-border-default rounded-2xl flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-border-default flex items-center justify-center text-xs font-bold text-accent-cyan shrink-0">
                {getInitials(comment.user_name)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-xs text-text-primary tracking-tight">{comment.user_name}</span>
                  <span className="text-[9px] text-text-muted font-mono flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {new Date(comment.created_at).toLocaleDateString('en-US')}
                  </span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default CommentsSection
