'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { auth } from '@/lib/firebase/client'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Eye,
  Users,
  Sparkles,
  Calendar,
  ShieldAlert,
  Send,
  PlusCircle,
  X,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Clock,
  ExternalLink,
  ImageIcon,
  UserPlus,
  UserCheck,
  Star,
  Upload
} from 'lucide-react'
import { CommentsSection } from '@/components/ui/comments-section'

interface Post {
  id: string
  title: string
  body: string
  user_id: string
  user_name: string
  user_avatar?: string
  is_verified?: boolean
  firm_tag?: string // 'FOREX FIRM' | 'FUTURE FIRM' | 'CRYPTO FIRM'
  category_tag?: string // 'OFFERS' | 'KNOWLEDGE' | 'PSYCHOLOGY' | 'GENERAL'
  image_url?: string
  link_url?: string
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

  // Ranking & Filter State
  const [filterMode, setFilterMode] = useState<'LATEST' | 'POPULAR' | 'OFFERS' | 'KNOWLEDGE' | 'PSYCHOLOGY'>('LATEST')

  // Followed Users Tracking
  const [followedUsers, setFollowedUsers] = useState<string[]>([])

  // Verification & Posting State
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verifyName, setVerifyName] = useState('')
  const [verifyFirmType, setVerifyFirmType] = useState('Forex')
  const [verifyProof, setVerifyProof] = useState('')
  const [verifySocials, setVerifySocials] = useState('')
  const [verifyAchievements, setVerifyAchievements] = useState('')
  const [verifyImages, setVerifyImages] = useState<string[]>([])
  const [verifyImageUrlInput, setVerifyImageUrlInput] = useState('')
  const [uploadingVerifyImage, setUploadingVerifyImage] = useState(false)
  const [submittingVerify, setSubmittingVerify] = useState(false)

  // Create Post Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newFirmTag, setNewFirmTag] = useState<'FOREX FIRM' | 'FUTURE FIRM' | 'CRYPTO FIRM'>('FOREX FIRM')
  const [newCategoryTag, setNewCategoryTag] = useState<'OFFERS' | 'KNOWLEDGE' | 'PSYCHOLOGY' | 'GENERAL'>('KNOWLEDGE')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newHashtags, setNewHashtags] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submittingPost, setSubmittingPost] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  // Active comments drawer tracking
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)

  // Load saved follows & verification on mount
  useEffect(() => {
    try {
      const savedFollows = localStorage.getItem('afx_followed_users')
      if (savedFollows) setFollowedUsers(JSON.parse(savedFollows))

      const savedVerified = localStorage.getItem('afx_user_verified')
      if (savedVerified === 'true') setIsVerifiedUser(true)
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Fetch posts
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
    const unsub = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
    })
    return unsub
  }, [])

  // Handle Image Upload inside Post Creation Modal
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.url) setNewImageUrl(data.url)
      } else {
        alert('Image upload failed. Please try providing an Image URL instead.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle Verification Proof Image Upload
  const handleVerifyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVerifyImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setVerifyImages((prev) => [...prev, data.url])
        }
      } else {
        alert('Image upload failed. Please try typing/pasting an Image URL instead.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingVerifyImage(false)
    }
  }

  const handleAddVerifyImageUrl = () => {
    if (verifyImageUrlInput.trim()) {
      setVerifyImages((prev) => [...prev, verifyImageUrlInput.trim()])
      setVerifyImageUrlInput('')
    }
  }

  // Handle Follow / Unfollow user
  const toggleFollowUser = (userName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = followedUsers.includes(userName)
      ? followedUsers.filter((u) => u !== userName)
      : [...followedUsers, userName]
    setFollowedUsers(updated)
    localStorage.setItem('afx_followed_users', JSON.stringify(updated))
  }

  // Handle Account Verification Submission
  const handleApplyVerification = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingVerify(true)
    setTimeout(() => {
      setIsVerifiedUser(true)
      localStorage.setItem('afx_user_verified', 'true')
      setSubmittingVerify(false)
      setShowVerificationModal(false)
      setShowCreateModal(true) // Direct redirect to create post!
    }, 600)
  }

  // Handle Create Post trigger check
  const handleOpenCreatePost = () => {
    if (!currentUser) {
      alert('Please sign in to publish a community post.')
      return
    }
    if (!isVerifiedUser) {
      setShowVerificationModal(true)
      return
    }
    setShowCreateModal(true)
  }

  // Handle Upvote / Downvote
  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!currentUser) {
      alert('Please sign in to upvote/downvote community posts.')
      return
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        let upvotedBy = [...post.upvoted_by]
        let downvotedBy = [...post.downvoted_by]
        const userId = currentUser.uid

        if (voteType === 'up') {
          if (upvotedBy.includes(userId)) {
            upvotedBy = upvotedBy.filter((id) => id !== userId)
          } else {
            upvotedBy.push(userId)
            downvotedBy = downvotedBy.filter((id) => id !== userId)
          }
        } else {
          if (downvotedBy.includes(userId)) {
            downvotedBy = downvotedBy.filter((id) => id !== userId)
          } else {
            downvotedBy.push(userId)
            upvotedBy = upvotedBy.filter((id) => id !== userId)
          }
        }

        return {
          ...post,
          upvoted_by: upvotedBy,
          downvoted_by: downvotedBy,
          upvotes: upvotedBy.length,
          downvotes: downvotedBy.length,
        }
      })
    )

    try {
      await fetch(`/api/community-posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, voteType }),
      })
    } catch (err) {
      console.error('Failed to register vote:', err)
      fetchPosts()
    }
  }

  // Handle Create Post Submit
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    if (!newTitle.trim() || !newBody.trim()) {
      setPostError('Title and post details are required.')
      return
    }

    setSubmittingPost(true)
    setPostError(null)
    try {
      const parsedHashtags = newHashtags
        .split(/\s+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.startsWith('#'))

      const payload = {
        title: newTitle.trim(),
        body: newBody.trim(),
        user_id: currentUser.uid,
        user_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Trader',
        user_avatar: currentUser.photoURL || null,
        is_verified: true,
        firm_tag: newFirmTag,
        category_tag: newCategoryTag,
        image_url: newImageUrl.trim() || null,
        link_url: newLinkUrl.trim() || null,
        tags: [newCategoryTag, newFirmTag],
        hashtags: parsedHashtags,
      }

      const res = await fetch('/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setNewTitle('')
        setNewBody('')
        setNewImageUrl('')
        setNewLinkUrl('')
        setNewHashtags('')
        setShowCreateModal(false)
        fetchPosts()
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

  // Filter & Sort Posts logic
  const sortedAndFilteredPosts = useMemo(() => {
    let list = [...posts]

    // Category Filter
    if (['OFFERS', 'KNOWLEDGE', 'PSYCHOLOGY'].includes(filterMode)) {
      list = list.filter((p) => {
        const cat = (p.category_tag || 'GENERAL').toUpperCase()
        return cat === filterMode || p.tags?.includes(filterMode)
      })
    }

    // Sort Logic
    list.sort((a, b) => {
      // Prioritize Followed Authors at the top!
      const aFollowed = followedUsers.includes(a.user_name)
      const bFollowed = followedUsers.includes(b.user_name)
      if (aFollowed && !bFollowed) return -1
      if (!aFollowed && bFollowed) return 1

      // Ranking filters
      if (filterMode === 'POPULAR') {
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0)
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0)
        return scoreB - scoreA
      } else {
        // LATEST
        const timeA = new Date(a.created_at || 0).getTime()
        const timeB = new Date(b.created_at || 0).getTime()
        return timeB - timeA
      }
    })

    return list
  }, [posts, filterMode, followedUsers])

  return (
    <div className="w-full max-w-full space-y-6">

      {/* 1. Header Action Control Bar */}
      <div className="bg-[#0B132B]/90 backdrop-blur-xl border border-white/15 p-4 sm:p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-6 h-6 text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">Share Your Funded Journey!</h3>
            <p className="text-xs font-bold text-text-secondary">Post challenge proofs, payout receipts, strategy breakdowns, or ask advice.</p>
          </div>
        </div>

        {/* Right side Buttons: Apply for Verification & Create Post */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowVerificationModal(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isVerifiedUser
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-amber-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifiedUser ? 'Verified Trader' : 'Apply for Verification'}</span>
          </button>

          <AFXButton
            onClick={handleOpenCreatePost}
            variant="primary"
            className="bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple font-black text-xs py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Post</span>
          </AFXButton>
        </div>
      </div>

      {/* 2. Ranking & Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B132B]/60 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'LATEST', label: 'LATEST', icon: Clock },
            { id: 'POPULAR', label: 'POPULAR', icon: Flame },
            { id: 'OFFERS', label: 'OFFERS', icon: Sparkles },
            { id: 'KNOWLEDGE', label: 'KNOWLEDGE', icon: Users },
            { id: 'PSYCHOLOGY', label: 'PSYCHOLOGY', icon: ShieldAlert },
          ].map((tab) => {
            const isActive = filterMode === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-md shadow-cyan-500/20 scale-105'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="text-xs font-black text-text-muted px-3 font-mono">
          Showing {sortedAndFilteredPosts.length} posts
        </div>
      </div>

      {/* 3. Full-width Posts Feed */}
      {loadingPosts ? (
        <div className="text-center py-16 text-text-muted text-sm font-bold">
          <div className="w-10 h-10 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading community discussions...
        </div>
      ) : sortedAndFilteredPosts.length === 0 ? (
        <div className="border border-white/10 bg-[#0B132B]/50 p-16 text-center rounded-3xl space-y-2">
          <p className="text-white text-base font-black">No community posts match this filter.</p>
          <p className="text-text-muted text-xs font-bold">Be the first to create a post in this category!</p>
        </div>
      ) : (
        <div className="space-y-5 w-full">
          {sortedAndFilteredPosts.map((post) => {
            const hasUpvoted = currentUser && post.upvoted_by?.includes(currentUser.uid)
            const hasDownvoted = currentUser && post.downvoted_by?.includes(currentUser.uid)
            const score = (post.upvotes || 0) - (post.downvotes || 0)
            const isFollowed = followedUsers.includes(post.user_name)
            const firmTagLabel = post.firm_tag || 'FOREX FIRM'
            const categoryTagLabel = post.category_tag || 'GENERAL'

            // Color scheme for firm tags
            let firmTagColor = 'bg-orange-500/15 border-orange-500/30 text-orange-400'
            if (firmTagLabel.includes('FUTURE')) {
              firmTagColor = 'bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan'
            } else if (firmTagLabel.includes('CRYPTO')) {
              firmTagColor = 'bg-accent-purple/15 border-accent-purple/30 text-accent-purple'
            }

            return (
              <div
                key={post.id}
                className={`bg-[#0B132B]/90 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 w-full ${
                  isFollowed ? 'border-accent-cyan/50 ring-1 ring-accent-cyan/30' : 'border-white/15 hover:border-white/25'
                }`}
              >
                {/* Followed Author Banner */}
                {isFollowed && (
                  <div className="bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-transparent px-5 py-1.5 border-b border-accent-cyan/20 flex items-center justify-between text-[10px] font-black text-accent-cyan uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-accent-cyan fill-accent-cyan" />
                      Followed Author Post
                    </span>
                    <span className="font-mono">Priority Feed</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row">

                  {/* Left Vote Column */}
                  <div className="bg-[#070D1E] sm:w-16 flex sm:flex-col items-center justify-between sm:justify-center p-3 sm:py-6 border-b sm:border-b-0 sm:border-r border-white/10 select-none shrink-0">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        hasUpvoted
                          ? 'text-accent-cyan bg-accent-cyan/20 scale-110'
                          : 'text-text-muted hover:text-white hover:bg-white/10'
                      }`}
                      title="Upvote post"
                    >
                      <ArrowUp className="w-6 h-6 stroke-[3]" />
                    </button>

                    <span
                      className={`text-sm font-mono font-black my-1 sm:my-3 ${
                        score > 0 ? 'text-accent-cyan' : score < 0 ? 'text-rose-400' : 'text-text-muted'
                      }`}
                    >
                      {score > 0 ? `+${score}` : score}
                    </span>

                    <button
                      onClick={() => handleVote(post.id, 'down')}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        hasDownvoted
                          ? 'text-rose-400 bg-rose-400/20 scale-110'
                          : 'text-text-muted hover:text-white hover:bg-white/10'
                      }`}
                      title="Downvote post"
                    >
                      <ArrowDown className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>

                  {/* Main Post Card Content */}
                  <div className="p-5 sm:p-6 flex-grow min-w-0 space-y-4">

                    {/* Top Row: User Avatar, Username, FOLLOW button, Tags on Left + Category Tag on Right */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">

                      {/* Left: User Profile & Tags */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Profile Logo / Avatar */}
                        {post.user_avatar ? (
                          <img
                            src={post.user_avatar}
                            alt={post.user_name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-md"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple border-2 border-white/20 flex items-center justify-center font-black text-white text-sm shadow-md">
                            {post.user_name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Username & Follow Button */}
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-base sm:text-lg tracking-tight">
                            {post.user_name}
                          </span>

                          <button
                            onClick={(e) => toggleFollowUser(post.user_name, e)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                              isFollowed
                                ? 'bg-accent-cyan text-black font-black hover:bg-accent-cyan/80'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            }`}
                          >
                            {isFollowed ? (
                              <>
                                <UserCheck className="w-3 h-3" />
                                <span>FOLLOWING</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3 h-3 text-accent-cyan" />
                                <span>FOLLOW</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Firm Tag (FOREX FIRM, FUTURE FIRM, CRYPTO FIRM) */}
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${firmTagColor}`}>
                          {firmTagLabel}
                        </span>

                        {/* Verified Badge */}
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>

                        <span className="text-xs font-bold text-text-muted font-mono">
                          • {formatTimeAgo(post.created_at)}
                        </span>
                      </div>

                      {/* Right: Category Tag (OFFERS, KNOWLEDGE, PSYCHOLOGY) */}
                      <span className="px-3 py-1 rounded-full bg-accent-purple/20 border border-accent-purple/40 text-accent-purple font-black text-xs uppercase tracking-wider shadow-xs">
                        {categoryTagLabel}
                      </span>
                    </div>

                    {/* Title & Description Body */}
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight hover:text-accent-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-200 text-sm font-bold leading-relaxed whitespace-pre-line">
                        {post.body}
                      </p>
                    </div>

                    {/* Image Attachment Preview */}
                    {post.image_url && (
                      <div className="pt-2">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full max-h-96 object-cover rounded-2xl border border-white/15 shadow-xl hover:opacity-95 transition-opacity"
                        />
                      </div>
                    )}

                    {/* Link Attachment Card */}
                    {post.link_url && (
                      <a
                        href={post.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 rounded-xl text-xs font-extrabold text-accent-cyan transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        <span className="truncate">{post.link_url}</span>
                      </a>
                    )}

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-accent-cyan">
                        {post.hashtags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions: Comments Count & Views (Removed Bookmark & Share) */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-text-muted text-xs font-bold font-mono">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-white font-black"
                        >
                          <MessageSquare className="w-4 h-4 text-accent-cyan" />
                          <span>{post.comments_count || 0} Comments</span>
                        </button>

                        <div className="flex items-center gap-2 select-none">
                          <Eye className="w-4 h-4 text-text-muted" />
                          <span>{post.views || 140} Views</span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Drawer */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-4 pt-4 border-t border-white/15 animate-fade-in">
                        <CommentsSection communityPostId={post.id} />
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-white/20 rounded-3xl w-full max-w-xl p-6 sm:p-7 relative space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 via-yellow-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Apply for Verified Trader Status</h3>
              <p className="text-xs font-bold text-text-secondary">
                Submit your trading achievements, social pages, and proof screenshots to verify your account and enable posting.
              </p>
            </div>

            <form onSubmit={handleApplyVerification} className="space-y-4 text-xs font-bold">
              {/* Row 1: Alias & Market Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Trader Name / Alias</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AlexTrader_FX"
                    value={verifyName}
                    onChange={(e) => setVerifyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Primary Market Focus</label>
                  <select
                    value={verifyFirmType}
                    onChange={(e) => setVerifyFirmType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                  >
                    <option value="Forex">Forex / CFDs</option>
                    <option value="Futures">Futures</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Achievements & What They Have Done */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary uppercase">
                  Trading Achievements & What You Have Done
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Passed FTMO 100K Challenge, $15K Payout Certificate, 2 Years Profitable Trader..."
                  value={verifyAchievements}
                  onChange={(e) => setVerifyAchievements(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold resize-none"
                />
              </div>

              {/* Row 3: Social Media Pages & Links */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary uppercase">
                  Social Media Pages & Links
                </label>
                <input
                  type="text"
                  placeholder="e.g. twitter.com/alextrader, instagram.com/alex_fx, Discord: Alex#1234"
                  value={verifySocials}
                  onChange={(e) => setVerifySocials(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                />
              </div>

              {/* Row 4: Certificate / Proof Link */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary uppercase">Verification Note / Certificate Link</label>
                <input
                  type="text"
                  placeholder="e.g. Passed FTMO 100K challenge / Account proof URL"
                  value={verifyProof}
                  onChange={(e) => setVerifyProof(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                />
              </div>

              {/* Row 5: Attach Proof Screenshots & Images */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <label className="text-[10px] font-black text-text-secondary uppercase flex items-center justify-between">
                  <span>Attach Proof Screenshots & Certificate Images</span>
                  {uploadingVerifyImage && <span className="text-accent-cyan animate-pulse">Uploading Image...</span>}
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    placeholder="Paste Screenshot Image URL..."
                    value={verifyImageUrlInput}
                    onChange={(e) => setVerifyImageUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddVerifyImageUrl}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-black text-white shrink-0 cursor-pointer"
                  >
                    Add URL
                  </button>

                  <label className="px-3.5 py-2 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/40 rounded-xl cursor-pointer text-xs font-black text-accent-cyan hover:scale-105 transition-all flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleVerifyImageUpload} className="hidden" />
                  </label>
                </div>

                {/* Proof Image Thumbnails Gallery */}
                {verifyImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {verifyImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-white/20 overflow-hidden group">
                        <img src={imgUrl} alt="Proof" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setVerifyImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-rose-400 hover:text-white cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit / Cancel Footer Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-text-secondary hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <AFXButton
                  type="submit"
                  disabled={submittingVerify}
                  variant="primary"
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 font-black text-black px-6 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 transition-all"
                >
                  {submittingVerify ? 'Submitting...' : 'Submit & Enable Posting'}
                </AFXButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Create / Edit Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-white/20 rounded-3xl w-full max-w-xl p-6 relative space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-accent-cyan" />
                Publish Community Post
              </h3>
              <p className="text-xs font-bold text-text-muted mt-0.5">
                Share insights, trade setups, payout proof, or advice with traders.
              </p>
            </div>

            {postError && (
              <p className="text-xs text-rose-400 font-black flex items-center gap-1 bg-rose-400/10 p-3 rounded-xl border border-rose-400/20">
                <ShieldAlert className="w-4 h-4" />
                {postError}
              </p>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary uppercase">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My strategy to pass 100K prop challenge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Firm Tag</label>
                  <select
                    value={newFirmTag}
                    onChange={(e) => setNewFirmTag(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                  >
                    <option value="FOREX FIRM">FOREX FIRM</option>
                    <option value="FUTURE FIRM">FUTURE FIRM</option>
                    <option value="CRYPTO FIRM">CRYPTO FIRM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Category Tag</label>
                  <select
                    value={newCategoryTag}
                    onChange={(e) => setNewCategoryTag(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none font-bold"
                  >
                    <option value="KNOWLEDGE">KNOWLEDGE</option>
                    <option value="OFFERS">OFFERS</option>
                    <option value="PSYCHOLOGY">PSYCHOLOGY</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
              </div>

              {/* Image & Link Attachment Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase flex items-center justify-between">
                    <span>Image URL or Attachment</span>
                    {uploadingImage && <span className="text-accent-cyan animate-pulse">Uploading...</span>}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none text-xs font-bold"
                    />
                    <label className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl cursor-pointer text-white shrink-0" title="Upload Image File">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase">External Link URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary uppercase">Hashtags</label>
                <input
                  type="text"
                  placeholder="e.g. #FTMO #PayoutProof #PassChallenge"
                  value={newHashtags}
                  onChange={(e) => setNewHashtags(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-accent-cyan outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary uppercase">Post Description / Content</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write your detailed post content, rules analysis, or questions here..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-white/15 rounded-xl text-white focus:border-accent-cyan outline-none resize-none font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-text-secondary hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <AFXButton
                  type="submit"
                  disabled={submittingPost}
                  variant="primary"
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple font-black px-6 flex items-center gap-1.5"
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
