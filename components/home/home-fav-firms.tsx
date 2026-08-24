'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { Heart, ArrowRight, Star, PenSquare } from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { openAuthModal } from '@/lib/utils/auth-modal'

interface FavFirm {
  id: string
  slug: string
  name: string
  logo_url?: string
  rating?: number
  review_count?: number
  likes_count?: number
  description?: string
  years_active?: number
  is_featured?: boolean
  circle_crop_logo?: boolean
}

interface HomeFavFirmsProps {
  firms?: FavFirm[]
  badge?: string
  title?: string
  subtext?: string
  ctaText?: string
}

export function HomeFavFirms({
  firms = [],
  badge,
  title,
  subtext,
  ctaText,
}: HomeFavFirmsProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [likedFirms, setLikedFirms] = useState<Set<string>>(new Set())
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({})
  const [animatingFirmId, setAnimatingFirmId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  // Initialize likes counts map
  useEffect(() => {
    const counts: Record<string, number> = {}
    firms.forEach((f) => {
      counts[f.id] = f.likes_count ?? (f.review_count ? f.review_count * 8 + 1240 : 1240)
    })
    setLikesCounts(counts)
  }, [firms])

  const handleLikeClick = (e: React.MouseEvent, firmId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!currentUser) {
      openAuthModal('signup')
      return
    }

    setAnimatingFirmId(firmId)
    setTimeout(() => {
      setAnimatingFirmId((prev) => (prev === firmId ? null : prev))
    }, 600)

    const isCurrentlyLiked = likedFirms.has(firmId)
    setLikedFirms((prev) => {
      const next = new Set(prev)
      if (isCurrentlyLiked) {
        next.delete(firmId)
      } else {
        next.add(firmId)
      }
      return next
    })

    setLikesCounts((prev) => {
      const current = prev[firmId] || 1240
      return {
        ...prev,
        [firmId]: isCurrentlyLiked ? Math.max(0, current - 1) : current + 1,
      }
    })

    fetch(`/api/firms/${firmId}/like`, { method: 'POST' }).catch((err) =>
      console.error('Error liking firm:', err)
    )
  }

  const handleWriteReviewClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault()
      openAuthModal('signup')
    }
  }

  // Show top 7 featured/highest rated firms in moving loop
  const top = firms.slice(0, 7)

  if (top.length === 0) return null

  // Duplicate 3x to ensure 100% seamless marquee loop
  const marqueeItems = [...top, ...top, ...top]

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl bottom-0 right-0"
          style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative mb-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 mb-3">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">{badge || 'Favorite Firms'}</span>
            </div>
            <h2 className="text-4xl font-bold text-text-primary afx-gradient-heading">
              {title || 'Community Favorites'}
            </h2>
            <p className="text-text-secondary text-lg mt-2">
              {subtext || 'The most loved prop firms in the ANURAJ FX community—sign in to save your own favorites.'}
            </p>
          </div>
          <Link
            href="/firms"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-border-subtle text-text-secondary hover:text-pink-400 hover:border-pink-400/40 transition-all"
          >
            {ctaText || 'Explore All Firms'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Moving Motion Loop (Right to Left Marquee) */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        <div className="animate-marquee flex gap-6 items-stretch">
          {marqueeItems.map((firm, idx) => {
            const firmDetailUrl = `/firms/${firm.slug || firm.id}`
            const yearsText = firm.years_active
              ? `Operating since ${firm.years_active} Years`
              : 'Operating since 2 Years'
            const isLiked = likedFirms.has(firm.id)
            const currentLikes = likesCounts[firm.id] ?? (firm.review_count ? firm.review_count * 8 + 1240 : 1240)

            return (
              <Link
                key={`${firm.id}-${idx}`}
                href={firmDetailUrl}
                className="w-[340px] sm:w-[380px] shrink-0 block group h-full"
              >
                <AFXCard className="bg-[#0B132B]/50 backdrop-blur-md border border-pink-500/30 rounded-xl p-5 hover:border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start gap-4">
                      {/* Prop Firm Logo */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-sm bg-black/40 flex items-center justify-center p-1">
                        {firm.logo_url ? (
                          <img
                            src={firm.logo_url}
                            alt={firm.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                            {firm.name.substring(0, 2)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white truncate leading-tight">{firm.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                          <span className="text-sm font-bold text-white font-mono">{(firm.rating || 4.7).toFixed(1)}</span>
                          <span className="text-sm font-semibold text-slate-200 ml-0.5">({firm.review_count || 900} reviews)</span>
                        </div>
                      </div>

                      {/* Interactive Heart Icon + Live Glowing Bold Likes Count */}
                      <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                        <button
                          type="button"
                          onClick={(e) => handleLikeClick(e, firm.id)}
                          className={`relative p-1.5 rounded-full transition-all duration-300 group/heart cursor-pointer flex items-center justify-center hover:bg-pink-500/20 active:scale-90 ${
                            animatingFirmId === firm.id ? 'animate-heart-pop' : ''
                          }`}
                          title={isLiked ? "Unlike this firm" : "Like this firm"}
                        >
                          {/* Animated Burst Ring on Click */}
                          {animatingFirmId === firm.id && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-pink-500/50 pointer-events-none" />
                          )}
                          <Heart
                            className={`w-6 h-6 transition-all duration-300 transform-gpu ${
                              isLiked
                                ? 'fill-pink-400 text-pink-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.9)] scale-110'
                                : 'text-pink-400/80 group-hover/heart:text-pink-400 group-hover/heart:fill-pink-400/50 group-hover/heart:scale-125 group-hover/heart:-rotate-12'
                            }`}
                          />
                        </button>
                        <div
                          className={`flex items-center gap-1 mt-0.5 select-none transition-all duration-300 transform-gpu ${
                            animatingFirmId === firm.id ? 'scale-125 text-pink-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'scale-100'
                          }`}
                        >
                          <span className="text-xs font-black text-white font-mono tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                            {currentLikes.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-black uppercase text-accent-cyan font-mono tracking-wider">
                            Likes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2 Tags: Operating since X Years & VIEW FIRM */}
                  <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/10">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-semibold select-none truncate">
                      {yearsText}
                    </span>
                    <span className="px-3 py-1 rounded-md bg-pink-500/20 border border-pink-500/40 text-pink-300 group-hover:bg-pink-500/30 group-hover:border-pink-500/80 text-xs font-extrabold uppercase tracking-wider transition-all select-none shrink-0">
                      VIEW FIRM
                    </span>
                  </div>
                </AFXCard>
              </Link>
            )
          })}
        </div>
      </div>

      {/* BIG Button: WRITE A REVIEW (Requires Auth) */}
      <div className="mt-10 text-center relative z-20">
        <Link
          href="/reviews"
          onClick={handleWriteReviewClick}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-accent-cyan shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all hover:scale-105 select-none"
        >
          <PenSquare className="w-5 h-5 text-white" />
          WRITE A REVIEW
        </Link>
      </div>
    </section>
  )
}

export default HomeFavFirms



