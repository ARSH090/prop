'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Bookmark, Star, Search, ShieldCheck, Heart, Copy, Check } from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

interface Firm {
  id: string
  slug: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  description: string
  circle_crop_logo?: boolean
}

export default function FavoritesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [allFirms, setAllFirms] = useState<Firm[]>([])
  const [favoriteFirmIds, setFavoriteFirmIds] = useState<string[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
        loadData(user.uid)
      } else {
        setCurrentUser(null)
        setLoading(false)
        router.push('/auth/login?redirect=/favorites')
      }
    })
    return unsub
  }, [router])

  const loadData = async (uid: string) => {
    try {
      const [favRes, firmsRes, dealsRes] = await Promise.all([
        fetch(`/api/favorites?user_id=${uid}`),
        fetch('/api/admin/firms'),
        fetch('/api/deals')
      ])
      
      if (favRes.ok && firmsRes.ok && dealsRes.ok) {
        const favData = await favRes.json()
        const firmsData = await firmsRes.json()
        const dealsData = await dealsRes.json()

        setFavoriteFirmIds(favData.data?.map((f: any) => f.firm_id) || [])
        setAllFirms(firmsData.data || [])
        setDeals(dealsData.deals || dealsData.data || [])
      }
    } catch (err) {
      console.error('Error loading favorites database details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (firmId: string, isFav: boolean) => {
    if (!currentUser) return

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, firm_id: firmId }),
      })
      if (res.ok) {
        if (isFav) {
          setFavoriteFirmIds((prev) => prev.filter((id) => id !== firmId))
          setAllFirms((prev) =>
            prev.map((f) =>
              f.id === firmId ? { ...f, likes_count: Math.max(0, ((f as any).likes_count || 0) - 1) } : f
            )
          )
        } else {
          setFavoriteFirmIds((prev) => [...prev, firmId])
          setAllFirms((prev) =>
            prev.map((f) =>
              f.id === firmId ? { ...f, likes_count: ((f as any).likes_count || 0) + 1 } : f
            )
          )
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredFirms = allFirms.filter((firm) =>
    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Maximum votes to scale the support progress bars
  const maxSupportVotes = 120000

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header visual layout */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-white afx-gradient-heading">
            Favorite Firms List
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Select your Favorite Firm. On this page, you can pick and show support for your favorite
            firm. The pick can be changed at any time here or in your member section.
          </p>
        </div>

        {/* Search, verification details, and count row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-b border-border-subtle/30 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-primary">
              Firms <span className="text-accent-cyan font-mono">{filteredFirms.length}</span>
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12101E] border border-border-subtle/80 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent-purple/50 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-secondary text-xs animate-pulse">
            Loading favorite firms database...
          </div>
        ) : filteredFirms.length > 0 ? (
          <div className="space-y-4">
            {filteredFirms.map((firm, i) => {
              const isFav = favoriteFirmIds.includes(firm.id)
              
              // Real support votes from database
              const supportVotes = (firm as any).likes_count || 0
              const maxLikes = Math.max(1, ...filteredFirms.map((f: any) => (f as any).likes_count || 0))
              const percentage = Math.min(100, (supportVotes / maxLikes) * 100)
              
              // Get active deal or generate mock one matching screenshot styling
              const activeDeal = deals.find(d => d.firm_id === firm.id && d.status === 'active')
              const discountLabel = activeDeal?.discount_label || `${(10 + (i % 3) * 5)}% OFF`
              const promoCode = activeDeal?.code || 'MATCH'

              return (
                <div 
                  key={firm.id}
                  className="bg-[#0A0713]/85 border border-[#1C152B] rounded-2xl p-5 hover:border-[#8B5CF6]/25 transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 relative overflow-hidden group"
                >
                  {/* Left Column: Index Badge + Logo & Basic Details */}
                  <div className="flex items-center gap-4 min-w-[280px]">
                    <div className="w-6 h-6 rounded-full bg-[#1C162E] text-text-secondary text-[11px] font-bold flex items-center justify-center border border-border-subtle/30 shrink-0 font-mono">
                      {i + 1}
                    </div>

                    <div className="flex items-center gap-3">
                      <PropFirmLogo 
                        name={firm.name} 
                        logoUrl={firm.logo_url} 
                        circleCrop={false} 
                        frame="offwhite"
                        className="w-11 h-11 rounded-xl shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-white group-hover:text-accent-cyan transition-colors">
                          {firm.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold text-white font-mono">{firm.rating ? firm.rating.toFixed(1) : '4.5'}</span>
                          <div className="flex text-accent-yellow">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3 h-3 ${
                                  idx < Math.round(firm.rating || 4.5) ? 'fill-current' : 'text-text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="bg-[#1D1630] border border-[#302251]/40 text-[#A78BFA] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                            {firm.review_count || 120}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Supported Progress Bar */}
                  <div className="flex-1 flex flex-col justify-center space-y-1.5 max-w-lg">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                      <span className="flex items-center gap-1 font-mono">
                        <Heart className={`w-3 h-3 text-pink-500 ${isFav ? 'fill-current' : ''}`} />
                        Favorite by: <span className="text-white font-black">{supportVotes.toLocaleString()}</span> Users
                      </span>
                    </div>

                    <div className="w-full bg-[#110D20] h-3 rounded-full overflow-hidden border border-[#231A3C]">
                      <div 
                        className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] h-full rounded-full transition-all duration-700" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Off Coupon Tag + Favorite Action Trigger */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    
                    {/* Coupon Box */}
                    <button 
                      onClick={() => handleCopyCode(promoCode)}
                      className="h-10 px-4 rounded-xl border border-dashed border-[#A78BFA]/30 bg-[#1D1630]/40 flex flex-col justify-center items-center group/coupon hover:border-[#A78BFA]/60 transition-all text-left"
                    >
                      <span className="text-[10px] font-black text-pink-400 uppercase tracking-wider">{discountLabel}</span>
                      <span className="flex items-center gap-1 text-[8px] font-mono text-text-secondary mt-0.5 font-bold">
                        MATCH 
                        {copiedCode === promoCode ? (
                          <span className="text-accent-green">Copied!</span>
                        ) : (
                          <Copy className="w-2.5 h-2.5 group-hover/coupon:text-[#A78BFA] transition-colors" />
                        )}
                      </span>
                    </button>

                    {/* Action Button - 0-indexed ID for E2E testing */}
                    <button
                      id={`fav-btn-${i}`}
                      onClick={() => handleToggleFavorite(firm.id, isFav)}
                      className={`h-10 px-6 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-all ${
                        isFav
                          ? 'bg-gradient-to-r from-accent-purple via-[#EC4899] to-accent-cyan text-bg-base hover:opacity-90 font-extrabold'
                          : 'border border-[#3D2F5F] hover:border-accent-purple/50 bg-[#120F24]/50 text-text-secondary hover:text-white'
                      }`}
                    >
                      {isFav ? 'Remove' : 'Set as Favorite'}
                    </button>

                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold mb-4">No matching firms found.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple"
            >
              Clear Search Query
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
