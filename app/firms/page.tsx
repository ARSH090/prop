'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FirmLink } from '@/components/ui/firm-link'
import { Filter, Search, CheckCircle, Tag, Globe, Heart, Trophy, Flame } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

const COUNTRY_FLAGS: Record<string, string> = {
  CZ: '🇨🇿', US: '🇺🇸', IL: '🇮🇱', AE: '🇦🇪', GB: '🇬🇧',
  IN: '🇮🇳', AU: '🇦🇺', CY: '🇨🇾', HU: '🇭🇺', EU: '🇪🇺',
}

const COUNTRY_NAMES: Record<string, string> = {
  CZ: 'Czech Republic', US: 'United States', IL: 'Israel', AE: 'UAE', GB: 'United Kingdom',
  IN: 'India', AU: 'Australia', CY: 'Cyprus', HU: 'Hungary', EU: 'Europe',
}

interface Firm {
  id: string
  slug: string
  name: string
  type: string
  category: string[]
  logo_url: string | null
  rating: number
  review_count: number
  is_featured: boolean
  is_verified: boolean
  country: string | null
  platforms: string[]
  max_allocation: number | null
  description: string
  website_url: string | null
  years_active?: number
  circle_crop_logo?: boolean
}

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [deals, setDeals] = useState<Record<string, { code: string; discount: string }>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'popular' | 'favorite' | 'new'>('all')
  const [favoriteFirms, setFavoriteFirms] = useState<string[]>([])
  const [firmType, setFirmType] = useState('prop_firm')

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('afx_favorites')
    if (saved) {
      try {
        setFavoriteFirms(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Fetch firms on state changes
  useEffect(() => {
    fetchFirms()
  }, [searchQuery, activeFilterTab, firmType])

  // Fetch deals on mount
  useEffect(() => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, { code: string; discount: string }> = {}
          ; (data.deals || []).forEach((d: any) => {
            if (d.firm_id && d.code && d.status === 'active') {
              map[d.firm_id] = { code: d.code, discount: d.discount_label || 'Discount' }
            }
          })
        setDeals(map)
      })
      .catch(() => { })
  }, [])

  const fetchFirms = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      params.append('type', firmType)

      // Apply dynamic sorting inside request parameters
      if (activeFilterTab === 'popular') {
        params.append('sortBy', 'rating')
      } else if (activeFilterTab === 'new') {
        params.append('sortBy', 'newest')
      } else {
        params.append('sortBy', 'featured')
      }

      const response = await fetch(`/api/firms?${params}`)
      const result = await response.json()

      let fetchedFirms: Firm[] = result.firms || []

      // Client-side favorites filter if that tab is selected
      if (activeFilterTab === 'favorite') {
        fetchedFirms = fetchedFirms.filter((f) => favoriteFirms.includes(f.id))
      }

      setFirms(fetchedFirms)
    } catch (error) {
      console.error('Failed to fetch firms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (firmId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = favoriteFirms.includes(firmId)
      ? favoriteFirms.filter((id) => id !== firmId)
      : [...favoriteFirms, firmId]
    setFavoriteFirms(updated)
    localStorage.setItem('afx_favorites', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-[#05070D] text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">

        {/* Header section with text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle/30 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight afx-gradient-heading mb-2">
              Prop Firms Directory
            </h1>
            <p className="text-text-secondary text-sm">
              Verify payouts, compare years active, platforms, assets, and allocation sizes.
            </p>
          </div>

          {/* Search bar inside header block */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search FTMO, TopStep..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-border-subtle rounded-xl text-text-primary text-sm focus:border-accent-cyan outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filter pills bar matching PropFirmMatch screenshot */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-bg-surface/50 border border-border-subtle/50 p-3 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-bg-base/80 p-1 rounded-full border border-border-subtle">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeFilterTab === 'all'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilterTab('popular')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeFilterTab === 'popular'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Popular
              </button>
              <button
                onClick={() => setActiveFilterTab('favorite')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeFilterTab === 'favorite'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                Favorite {favoriteFirms.length}/5
              </button>
              <button
                onClick={() => setActiveFilterTab('new')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeFilterTab === 'new'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                New
              </button>
            </div>

            {/* Firm Type quick switch radio */}
            <div className="flex items-center gap-1.5 bg-bg-base/80 px-3 py-1.5 rounded-full border border-border-subtle text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-text-secondary hover:text-text-primary">
                <input
                  type="radio"
                  name="firm_type"
                  checked={firmType === 'prop_firm'}
                  onChange={() => setFirmType('prop_firm')}
                  className="accent-accent-cyan"
                />
                Firms
              </label>
              <span className="text-text-muted">|</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-text-secondary hover:text-text-primary">
                <input
                  type="radio"
                  name="firm_type"
                  checked={firmType === 'broker'}
                  onChange={() => setFirmType('broker')}
                  className="accent-accent-cyan"
                />
                Brokers
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
            <button className="px-4 py-1.5 bg-accent-purple/10 border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/20 transition-all rounded-full text-xs font-bold">
              How We Verify and Rank Firms
            </button>
            <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Data updated 1h ago</span>
            </div>
          </div>
        </div>

        {/* Directory List Container - Using standard HTML table layout for perfect alignment */}
        <div className="border border-border-subtle bg-bg-surface/20 rounded-3xl p-1 overflow-hidden shadow-2xl relative">

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full border-collapse text-left text-xs text-text-secondary table-fixed sm:table-auto">
              <thead>
                <tr className="border-b border-border-subtle/30 bg-bg-surface/40 text-[10px] font-black uppercase tracking-wider text-text-muted select-none">
                  <th className="px-2 sm:px-6 py-4 text-left font-black w-[50%] sm:w-auto">Firm</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black w-[25%] sm:w-auto">Rank / Reviews</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black hidden sm:table-cell">Country</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black hidden lg:table-cell">Years in Operation</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black hidden lg:table-cell">Assets</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black hidden md:table-cell">Platforms</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black hidden sm:table-cell">Max Allocations</th>
                  <th className="px-2 sm:px-6 py-4 text-center font-black hidden md:table-cell">Promo</th>
                  <th className="px-2 sm:px-6 py-4 text-right font-black w-[25%] sm:w-auto">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/30">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-bg-surface shrink-0" />
                          <div className="w-12 h-12 rounded-xl bg-bg-surface shrink-0" />
                          <div className="space-y-1">
                            <div className="w-20 h-4 bg-bg-surface rounded" />
                            <div className="w-12 h-3 bg-bg-surface rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5"><div className="w-12 h-8 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-6 py-5 hidden sm:table-cell"><div className="w-10 h-6 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-6 py-5 hidden lg:table-cell"><div className="w-10 h-10 rounded-full bg-bg-surface mx-auto" /></td>
                      <td className="px-6 py-5 hidden lg:table-cell"><div className="w-24 h-6 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-6 py-5 hidden md:table-cell"><div className="w-16 h-6 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-6 py-5 hidden sm:table-cell"><div className="w-20 h-8 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-6 py-5 hidden md:table-cell"><div className="w-20 h-8 bg-bg-surface rounded mx-auto" /></td>
                      <td className="px-6 py-5"><div className="w-16 h-8 bg-bg-surface rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : firms.length > 0 ? (
                  firms.map((firm, index) => {
                    const flag = COUNTRY_FLAGS[firm.country || ''] || '🌍'
                    const dealInfo = deals[firm.id]
                    const maxK = firm.max_allocation ? `$${(firm.max_allocation / 1000).toFixed(0)}K` : '—'

                    // Compute dynamic allocation percentage for progress bar
                    const allocPct = firm.max_allocation
                      ? Math.min(100, Math.max(20, (firm.max_allocation / 2000000) * 100))
                      : 45

                    // Rank Badge Logic
                    const rank = index + 1
                    const isFav = favoriteFirms.includes(firm.id)

                    // Retrieve clean logo URL using helper function
                    const logoUrl = getCleanLogoUrl(firm.name, firm.logo_url)

                    // Mock dynamic likes count
                    const likesCount = firm.review_count * 8 + 1240

                    return (
                      <tr
                        key={firm.id}
                        className="group hover:bg-bg-surface/20 transition-all duration-300"
                      >
                        {/* 1. FIRM COLUMN (Rank + Logo + Name + Likes) */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 align-middle">
                          <div className="flex items-center gap-2 sm:gap-4">
                            {/* Rank Badge */}
                            <div className="w-5 sm:w-6 flex items-center justify-center shrink-0">
                              {rank === 1 ? (
                                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                              ) : rank === 2 ? (
                                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                              ) : rank === 3 ? (
                                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                              ) : (
                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-text-muted">
                                  {rank}
                                </span>
                              )}
                            </div>

                            {/* Logo with drop cyan glow scaling animation - clicking goes to firm detail */}
                            <FirmLink firm={firm} className="block">
                              <PropFirmLogo
                                name={firm.name}
                                logoUrl={firm.logo_url}
                                circleCrop={firm.circle_crop_logo}
                                className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                              />
                            </FirmLink>

                            {/* Name and Heart toggle */}
                            <div className="min-w-0 flex-1 sm:flex-initial">
                              <div className="flex items-center gap-1.5">
                                <FirmLink firm={firm} className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent-cyan transition-colors truncate block max-w-[120px] sm:max-w-none">
                                  {firm.name}
                                </FirmLink>
                                {firm.is_verified && <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-green flex-shrink-0" />}
                              </div>

                              {/* Heart Likes Button Toggle */}
                              <button
                                onClick={(e) => toggleFavorite(firm.id, e)}
                                className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-text-muted hover:text-red-500 transition-colors focus:outline-none"
                              >
                                <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-105 ${isFav ? 'fill-red-500 text-red-500' : 'text-text-muted hover:fill-red-500/20'
                                  }`} />
                                <span className="font-mono">{likesCount}</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 2. RANK / REVIEWS COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle">
                          <div className="inline-flex flex-col items-center gap-0.5 sm:gap-1">
                            <div className="px-1.5 sm:px-2.5 py-0.5 rounded-lg bg-accent-purple/20 border border-accent-purple/30 text-accent-purple text-[10px] sm:text-xs font-bold">
                              {firm.rating.toFixed(1)}
                            </div>
                            <div className="flex text-amber-400 text-[8px] sm:text-[10px]">★★★★★</div>
                            <div className="text-[8px] sm:text-[10px] text-text-muted font-bold truncate max-w-[70px] sm:max-w-none">
                              {firm.review_count} revs
                            </div>
                          </div>
                        </td>

                        {/* 3. COUNTRY COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle text-xs font-bold text-text-secondary hidden sm:table-cell">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-base">{flag}</span>
                            <span>{COUNTRY_NAMES[firm.country || ''] || firm.country || 'United States'}</span>
                          </div>
                        </td>

                        {/* 4. YEARS IN OPERATION COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle hidden lg:table-cell">
                          <div className="inline-flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border-2 border-accent-cyan/30 flex items-center justify-center text-xs font-bold text-text-primary bg-bg-base/30 relative">
                              <span className="absolute inset-0.5 rounded-full border border-dashed border-accent-cyan/50 animate-pulse" />
                              {firm.years_active || '1'}
                            </div>
                          </div>
                        </td>

                        {/* 5. ASSETS COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 justify-center max-w-[180px] mx-auto">
                            {firm.category?.slice(0, 3).map((cat) => (
                              <span
                                key={cat}
                                className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-bg-base border border-border-subtle text-text-secondary uppercase"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 6. PLATFORMS COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {firm.platforms?.slice(0, 3).map((plat) => (
                              <div
                                key={plat}
                                className="w-6 h-6 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-[8px] font-bold text-text-primary shrink-0"
                                title={plat}
                              >
                                {plat.charAt(0)}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* 7. MAX ALLOCATIONS COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle hidden sm:table-cell">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-xs font-bold text-text-primary">{maxK}</span>

                            {/* Allocations progress bar */}
                            <div className="w-20 h-1 bg-bg-base border border-border-subtle rounded-full overflow-hidden mt-1.5">
                              <div
                                className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full"
                                style={{ width: `${allocPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 8. PROMO COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-center align-middle hidden md:table-cell">
                          {dealInfo ? (
                            <div className="inline-flex flex-col items-center gap-0.5 bg-accent-yellow/10 border border-accent-yellow/30 px-3 py-1 rounded-xl">
                              <span className="text-[10px] font-black text-accent-yellow">{dealInfo.discount}</span>
                              <span className="text-[8px] font-mono text-text-secondary font-bold uppercase tracking-wider">
                                {dealInfo.code}
                              </span>
                            </div>
                          ) : (
                            <span className="text-text-muted text-xs">—</span>
                          )}
                        </td>

                        {/* 9. ACTIONS COLUMN */}
                        <td className="px-2 sm:px-6 py-4 sm:py-5 text-right align-middle">
                          <FirmLink
                            firm={firm}
                            className="px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full border border-border-subtle text-[10px] sm:text-xs font-bold text-text-primary hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all inline-block text-center"
                          >
                            Firm
                          </FirmLink>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="p-12 text-center">
                      <Globe className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-text-secondary text-lg">No firms found</p>
                      <p className="text-text-muted text-sm mt-2">Try adjusting your filters or search query</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
