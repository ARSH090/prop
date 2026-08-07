'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye, 
  Share2, 
  Bookmark, 
  Users, 
  Sparkles, 
  Calendar, 
  ShieldAlert,
  Send,
  PlusCircle,
  X
} from 'lucide-react'
import { CommentsSection } from '@/components/ui/comments-section'

interface Post {
  id: string
  title: string
  body: string
  user_id: string
  user_name: string
  tags: string[]
  hashtags: string[]
  upvotes: number
  downvotes: number
  upvoted_by: string[]
  downvoted_by: string[]
  views: number
  comments_count: number
  created_at: string
}

interface CommunityClientProps {
  announcements: any[]
}

export function CommunityClient({ announcements }: CommunityClientProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Create Post form state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newTag, setNewTag] = useState('General')
  const [newHashtags, setNewHashtags] = useState('')
  const [submittingPost, setSubmittingPost] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  // Comments drawer / modal state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)

  // Load posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community-posts')
      if (res.ok) {
        const json = await res.json()
        setPosts(json.data || [])
      }
    } catch (err) {
      console.error('Error fetching community posts:', err)
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return unsub
  }, [])

  // Handle upvote/downvote
  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!currentUser) {
      alert('Please sign in to upvote/downvote community posts.')
      return
    }

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        let upvotedBy = [...post.upvoted_by]
        let downvotedBy = [...post.downvoted_by]
        const userId = currentUser.uid

        if (voteType === 'up') {
          if (upvotedBy.includes(userId)) {
            upvotedBy = upvotedBy.filter(id => id !== userId)
          } else {
            upvotedBy.push(userId)
            downvotedBy = downvotedBy.filter(id => id !== userId)
          }
        } else {
          if (downvotedBy.includes(userId)) {
            downvotedBy = downvotedBy.filter(id => id !== userId)
          } else {
            downvotedBy.push(userId)
            upvotedBy = upvotedBy.filter(id => id !== userId)
          }
        }

        return {
          ...post,
          upvoted_by: upvotedBy,
          downvoted_by: downvotedBy,
          upvotes: upvotedBy.length,
          downvotes: downvotedBy.length
        }
      })
    )

    try {
      await fetch(`/api/community-posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, voteType })
      })
    } catch (err) {
      console.error('Failed to register vote:', err)
      fetchPosts() // Revert to server state
    }
  }

  // Handle create post submit
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    if (!newTitle.trim() || !newBody.trim()) {
      setPostError('Title and body are required.')
      return
    }

    setSubmittingPost(true)
    setPostError(null)
    try {
      // Parse hashtags (e.g. "#FTMO #PassProof" -> ["#FTMO", "#PassProof"])
      const parsedHashtags = newHashtags
        .split(/\s+/)
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#'))

      const payload = {
        title: newTitle.trim(),
        body: newBody.trim(),
        user_id: currentUser.uid,
        user_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Trader',
        tags: [newTag.toUpperCase()],
        hashtags: parsedHashtags
      }

      const res = await fetch('/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setNewTitle('')
        setNewBody('')
        setNewTag('General')
        setNewHashtags('')
        setShowCreateModal(false)
        fetchPosts() // Reload posts
      } else {
        const errJson = await res.json()
        setPostError(errJson.error || 'Failed to submit post.')
      }
    } catch (err) {
      setPostError('Network error. Please try again.')
    } finally {
      setSubmittingPost(false)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const time = new Date(dateStr).getTime()
    const diff = Date.now() - time
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Discussion Thread (left 2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Create Post Header trigger */}
        <div className="bg-[#120F1D] border border-[#271E3A] p-4 rounded-3xl flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share your funded journey!</h3>
              <p className="text-[10px] text-text-muted">Post challenge proof, payouts, or ask advice.</p>
            </div>
          </div>
          <AFXButton
            onClick={() => currentUser ? setShowCreateModal(true) : alert('Please sign in to publish a community post.')}
            variant="primary"
            className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold text-xs py-2 px-4 flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Create Post
          </AFXButton>
        </div>

        {/* Posts feed */}
        {loadingPosts ? (
          <div className="text-center py-12 text-text-muted text-xs">
            <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading community feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-border-subtle bg-bg-surface/30 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold">No community posts yet.</p>
            <p className="text-text-muted text-xs mt-1 font-mono">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const hasUpvoted = currentUser && post.upvoted_by?.includes(currentUser.uid)
              const hasDownvoted = currentUser && post.downvoted_by?.includes(currentUser.uid)
              const score = (post.upvotes || 0) - (post.downvotes || 0)

              return (
                <div key={post.id} className="bg-[#120F1D] border border-[#271E3A] rounded-3xl overflow-hidden shadow-lg flex">
                  
                  {/* Left Upvote/Downvote panel */}
                  <div className="bg-[#0B0813] w-14 flex flex-col items-center py-5 border-r border-[#271E3A] select-none shrink-0">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        hasUpvoted 
                          ? 'text-accent-cyan bg-accent-cyan/10' 
                          : 'text-text-muted hover:text-white hover:bg-bg-surface/30'
                      }`}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className={`text-xs font-mono font-black my-2.5 ${
                      score > 0 ? 'text-accent-cyan' : score < 0 ? 'text-rose-400' : 'text-text-muted'
                    }`}>
                      {score}
                    </span>
                    <button
                      onClick={() => handleVote(post.id, 'down')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        hasDownvoted 
                          ? 'text-rose-400 bg-rose-400/10' 
                          : 'text-text-muted hover:text-white hover:bg-bg-surface/30'
                      }`}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Right main post details */}
                  <div className="p-6 flex-grow min-w-0 space-y-4">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 text-[10px] text-text-muted font-mono flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs tracking-tight">{post.user_name}</span>
                        <span className="px-2 py-0.5 rounded bg-accent-cyan/10 border border-accent-cyan/20 text-[8px] font-bold text-accent-cyan uppercase tracking-wider">
                          Trader
                        </span>
                        <span>• {formatTimeAgo(post.created_at)}</span>
                      </div>
                      <div className="flex gap-1.5">
                        {post.tags?.map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 rounded bg-bg-base border border-border-subtle/80 text-[8px] font-bold text-accent-purple uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Title & Body */}
                    <div className="space-y-2">
                      <h4 className="text-base font-extrabold text-white leading-snug hover:text-accent-cyan transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
                        {post.body}
                      </p>
                    </div>

                    {/* Hashtags list */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-[10px] text-accent-cyan font-mono">
                        {post.hashtags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer tools */}
                    <div className="pt-4 border-t border-border-subtle/30 flex items-center justify-between text-text-muted text-[10px] font-mono">
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.comments_count || 0} Comments</span>
                        </button>
                        <div className="flex items-center gap-1.5 select-none">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.views || 120} Views</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Share link">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Bookmark post">
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Embedded comments drawer */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-4 pt-4 border-t border-border-subtle/50 animate-fade-in">
                        <CommentsSection communityPostId={post.id} />
                      </div>
                    )}

                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Announcements & Community Stats Sidebar (right col) */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Community Rules card */}
        <AFXCard className="bg-bg-surface border-border-subtle p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Trader Guidelines</h4>
          </div>
          <ol className="list-decimal pl-4 text-[10px] text-text-secondary space-y-2 leading-relaxed">
            <li><strong>Provide verified proofs</strong>: When posting challenge clears or payouts, attach honest parameters.</li>
            <li><strong>No promotions / affiliate links</strong>: Do not post self-referrals or spam.</li>
            <li><strong>Be respectful</strong>: Discuss prop firm conditions constructively.</li>
          </ol>
        </AFXCard>

        {/* Community Announcements */}
        {announcements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
              Latest Announcements
            </h4>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-bg-surface border border-border-subtle/70 p-4 rounded-2xl relative overflow-hidden">
                  <h5 className="font-bold text-white text-xs mb-1">{ann.title}</h5>
                  <p className="text-text-secondary text-[10px] leading-relaxed line-clamp-3">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Create Post Form modal popup */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#120F1D] border border-[#271E3A] rounded-3xl w-full max-w-lg p-6 relative space-y-4 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-surface/30 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-cyan" />
                Publish Community Post
              </h3>
              <p className="text-text-muted text-xs mt-0.5">Share insights or questions with the Anuraj FX community.</p>
            </div>

            {postError && (
              <p className="text-xs text-rose-400 font-bold flex items-center gap-1 bg-rose-400/5 p-2.5 rounded-lg border border-rose-400/10">
                <ShieldAlert className="w-3.5 h-3.5" />
                {postError}
              </p>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My strategy to pass FTMO Q3 challenges"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Topic Category</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
                  >
                    <option value="General">General Info</option>
                    <option value="FTMO">FTMO Clear</option>
                    <option value="Funding">Funding Journey</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Strategy">Strategy Breakdown</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Hashtags</label>
                  <input
                    type="text"
                    placeholder="e.g. #FTMO #PassProof"
                    value={newHashtags}
                    onChange={(e) => setNewHashtags(e.target.value)}
                    className="w-full px-3 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Post Description / Details</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide your strategy breakdowns, lessons learned, or questions here..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full px-3 py-2.5 bg-bg-base border border-[#271E3A] rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#271E3A] text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <AFXButton
                  type="submit"
                  disabled={submittingPost}
                  variant="primary"
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold px-5 flex items-center gap-1.5"
                >
                  {submittingPost ? 'Publishing...' : 'Publish Post'}
                  <Send className="w-3.5 h-3.5" />
                </AFXButton>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
