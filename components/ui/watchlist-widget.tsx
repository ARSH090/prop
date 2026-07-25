'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { Star, Lock, Eye } from 'lucide-react'
import { RatingBadge } from './rating-badge'
import Link from 'next/link'

export function WatchlistWidget() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          // Fetch favorites
          const favRes = await fetch(`/api/favorites?user_id=${user.uid}`)
          const favData = await favRes.json()
          
          // Fetch firms
          const firmsRes = await fetch(`/api/admin/firms`)
          const firmsData = await firmsRes.json()

          if (favData.data && firmsData.data) {
            // Enrich favorites with firm details
            const enriched = favData.data.map((fav: any) => {
              const firm = firmsData.data.find((f: any) => f.id === fav.firm_id)
              return { ...fav, firm }
            }).filter((fav: any) => fav.firm)
            setFavorites(enriched)
          }
        } catch (e) {
          console.error('Error fetching watchlist data', e)
        }
      }
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-3xl p-6 text-center text-xs text-text-muted">
        Loading your watchlist...
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="relative overflow-hidden bg-bg-surface border border-border-default rounded-3xl p-6 min-h-[220px]">
        {/* Blurred background preview to entice users */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
        <div className="space-y-4 filter blur-[2px] pointer-events-none select-none opacity-40">
          <div className="flex justify-between items-center py-2 border-b border-border-default">
            <span className="font-bold text-xs">FTMO</span>
            <span className="text-[10px] text-accent-green bg-accent-green/15 border border-accent-green/30 px-2 py-0.5 rounded-full">25% OFF</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border-default">
            <span className="font-bold text-xs">Topstep</span>
            <span className="text-[10px] text-accent-green bg-accent-green/15 border border-accent-green/30 px-2 py-0.5 rounded-full">20% OFF</span>
          </div>
        </div>

        {/* Lock Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-bg-surface/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-accent-purple mb-3">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <h4 className="font-extrabold text-sm text-text-primary mb-1">Locked Watchlist</h4>
          <p className="text-text-secondary text-xs mb-4 leading-relaxed max-w-[200px]">
            Sign in to build your personalized prop firm watchlist and track active discounts.
          </p>
          <a
            href="/auth/login?redirect=/community"
            className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/10"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-text-primary">My Watchlist</h4>
        <span className="text-[10px] bg-bg-base border border-border-default text-text-secondary px-2.5 py-1 rounded-xl font-mono font-bold">
          {favorites.length} saved
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border-default rounded-2xl text-xs text-text-muted leading-relaxed">
          Your watchlist is empty.<br />
          Click the bookmark icon on any firm or challenge page to save firms here!
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => {
            const firm = fav.firm
            return (
              <div
                key={fav.id}
                className="p-3 bg-bg-base/40 border border-border-default rounded-2xl flex items-center justify-between gap-3 hover:border-accent-cyan/20 transition-all group animate-fade-in"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-bg-base border border-border-default flex items-center justify-center overflow-hidden shrink-0">
                    {firm.logo_url ? (
                      <img src={firm.logo_url} alt={firm.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold text-accent-cyan">{firm.name[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-text-primary truncate">{firm.name}</p>
                    <RatingBadge rating={firm.rating || 4.5} fontVariant="sans" className="scale-75 origin-left border-0 bg-transparent py-0 px-0 -mt-0.5" />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {firm.activeDeal && (
                    <span className="text-[9px] font-extrabold text-white bg-accent-green/25 border border-accent-green/50 px-2 py-0.5 rounded-full font-mono">
                      {firm.activeDeal.discount_label || 'ACTIVE'}
                    </span>
                  )}
                  <Link
                    href={`/firms/${firm.slug}`}
                    className="p-1.5 rounded-lg border border-border-default bg-bg-base hover:border-accent-cyan/40 hover:text-accent-cyan text-text-muted transition-all"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default WatchlistWidget
