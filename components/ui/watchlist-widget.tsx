'use client'

import React, { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { Star, Lock, Eye, Trash2 } from 'lucide-react'
import { RatingBadge } from './rating-badge'
import Link from 'next/link'
import { FirmLink } from './firm-link'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'

export function WatchlistWidget() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user: any) => {
      setCurrentUser(user)
      try {
        // Fetch firms
        const firmsRes = await fetch(`/api/admin/firms`)
        const firmsData = await firmsRes.json()
        const allFirms = firmsData.data || []

        // Load local storage favorites as base
        const localSaved = localStorage.getItem('afx_favorites')
        const localIds = localSaved ? JSON.parse(localSaved) : []
        
        let favIds = [...localIds]

        if (user) {
          try {
            // Fetch firestore favorites
            const favRes = await fetch(`/api/favorites?user_id=${user.uid}`)
            const favData = await favRes.json()
            const dbIds = favData.data?.map((f: any) => f.firm_id) || []
            
            // Merge db and local favorites
            favIds = Array.from(new Set([...dbIds, ...localIds]))
            
            // Sync back to local storage
            localStorage.setItem('afx_favorites', JSON.stringify(favIds))
          } catch (e) {
            console.warn('Could not sync Firestore favorites:', e)
          }
        }

        // Enrich with firm details
        const enriched = favIds.map((firmId: string) => {
          const firm = allFirms.find((f: any) => f.id === firmId)
          return firm ? { id: firmId, firm_id: firmId, firm } : null
        }).filter(Boolean) as any[]

        setFavorites(enriched)
      } catch (e) {
        console.error('Error fetching watchlist data', e)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const handleRemoveFavorite = async (firmId: string) => {
    // 1. Remove from local state
    setFavorites((prev) => prev.filter((fav) => fav.firm_id !== firmId))

    // 2. Remove from local storage
    const localSaved = localStorage.getItem('afx_favorites')
    if (localSaved) {
      const localIds = JSON.parse(localSaved) as string[]
      const updated = localIds.filter((id) => id !== firmId)
      localStorage.setItem('afx_favorites', JSON.stringify(updated))
    }

    // 3. Remove from firestore if logged in
    if (currentUser) {
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.uid, firm_id: firmId }),
        })
      } catch (e) {
        console.error('Error removing favorite from DB:', e)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-3xl p-6 text-center text-xs text-text-muted min-h-[180px] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mr-2" />
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
          Bookmark firms to track active payouts and codes.
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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden border border-border-default shrink-0 ${isDarkLogo(firm.name) ? 'bg-[#0b121f]' : 'bg-white'}`}>
                    <img 
                      src={getCleanLogoUrl(firm.name, firm.logo_url)} 
                      alt={firm.name} 
                      className="w-6 h-6 object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCleanLogoUrl(firm.name, null)
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-text-primary truncate">{firm.name}</p>
                    <RatingBadge rating={firm.rating || 4.5} fontVariant="sans" className="scale-75 origin-left border-0 bg-transparent py-0 px-0 -mt-0.5" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {firm.activeDeal && (
                    <span className="text-[9px] font-extrabold text-white bg-accent-green/25 border border-accent-green/50 px-2 py-0.5 rounded-full font-mono hidden xs:inline">
                      {firm.activeDeal.discount_label || 'ACTIVE'}
                    </span>
                  )}
                  <FirmLink
                    firm={firm}
                    className="p-1.5 rounded-lg border border-border-default bg-bg-base hover:border-accent-cyan/40 hover:text-accent-cyan text-text-muted transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </FirmLink>
                  <button
                    onClick={() => handleRemoveFavorite(firm.id)}
                    className="p-1.5 rounded-lg border border-border-default bg-bg-base hover:border-red-400/40 hover:text-red-400 text-text-muted transition-all cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
