'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Bookmark, Copy, ExternalLink, HelpCircle, Check, ArrowUpDown } from 'lucide-react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { auth } from '@/lib/firebase/client'

interface Challenge {
  id: string
  firm_id: string
  account_size: number
  steps: number
  profit_target_p1: number
  profit_target_p2: number
  daily_loss_pct: number
  max_loss_pct: number
  pt_dd_ratio: string
  profit_split_pct: number
  payout_freq: string
  loyalty_points: number
  popularity_score: number
  price: number
  original_price: number
  currency: string
  deal_id: string | null
  affiliate_url: string | null
  is_active: boolean
}

interface Firm {
  id: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  affiliate_url: string
}

interface Deal {
  id: string
  code: string
  discount_label: string
}

interface ChallengesClientProps {
  initialChallenges: Challenge[]
  firms: Firm[]
  deals: Deal[]
}

export default function ChallengesClient({
  initialChallenges,
  firms,
  deals,
}: ChallengesClientProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Filters & State
  const [search, setSearch] = useState('')
  const [categoryTab, setCategoryTab] = useState('all') // all, forex, futures, crypto
  const [showDrawer, setShowDrawer] = useState(false)
  const [filterFirm, setFilterFirm] = useState('all')
  const [filterSteps, setFilterSteps] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')

  // Toggles
  const [applyDiscount, setApplyDiscount] = useState(false)
  const [sortByPopularity, setSortByPopularity] = useState(false)
  const [viewBookmarksOnly, setViewBookmarksOnly] = useState(false)

  // Sortable headers state
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Buy Code Modal State
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Auth & Bookmarks synchronization
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
        fetchFavorites(user.uid)
      } else {
        setCurrentUser(null)
        setFavorites([])
      }
    })
    return unsub
  }, [])

  const fetchFavorites = async (uid: string) => {
    try {
      const res = await fetch(`/api/favorites?user_id=${uid}`)
      if (res.ok) {
        const json = await res.json()
        setFavorites(json.data?.map((f: any) => f.firm_id) || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleBookmark = async (firmId: string) => {
    if (!currentUser) {
      alert('Please Sign In to bookmark your favorite firms!')
      return
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, firm_id: firmId }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.bookmarked) {
          setFavorites((prev) => [...prev, firmId])
        } else {
          setFavorites((prev) => prev.filter((id) => id !== firmId))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getFirm = (firmId: string) => {
    return firms.find((f) => f.id === firmId)
  }

  const getDealCode = (dealId: string | null) => {
    if (!dealId) return null
    return deals.find((d) => d.id === dealId)
  }

  const handleBuyClick = async (challenge: Challenge) => {
    // Log click count via POST api/deals/id/click or similar
    try {
      await fetch(`/api/deals/${challenge.deal_id || 'challenge'}/click`, { method: 'POST' })
    } catch (e) {
      console.warn(e)
    }

    const linkedDeal = getDealCode(challenge.deal_id)
    if (linkedDeal) {
      setSelectedDeal({
        code: linkedDeal.code,
        label: linkedDeal.discount_label,
        url: challenge.affiliate_url || getFirm(challenge.firm_id)?.affiliate_url || '#',
      })
    } else {
      window.open(challenge.affiliate_url || getFirm(challenge.firm_id)?.affiliate_url || '#', '_blank')
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter & Sort Pipeline
  let challenges = [...initialChallenges]

  // 1. Category Tab Filter
  if (categoryTab !== 'all') {
    challenges = challenges.filter((c) => {
      const f = getFirm(c.firm_id)
      // Check if firm is in category list
      const cats = f?.rating ? ['forex', 'futures', 'crypto'] : [] // fallback placeholder categories
      return categoryTab === 'new' ? c.steps === 1 : true
    })
  }

  // 2. Search Filter (by firm name)
  if (search) {
    challenges = challenges.filter((c) => {
      const f = getFirm(c.firm_id)
      return f?.name.toLowerCase().includes(search.toLowerCase())
    })
  }

  // 3. Bookmarks Only
  if (viewBookmarksOnly) {
    challenges = challenges.filter((c) => favorites.includes(c.firm_id))
  }

  // 4. Drawer Filter (Firm)
  if (filterFirm !== 'all') {
    challenges = challenges.filter((c) => c.firm_id === filterFirm)
  }

  // 5. Drawer Filter (Steps)
  if (filterSteps !== 'all') {
    challenges = challenges.filter((c) => c.steps === Number(filterSteps))
  }

  // 6. Drawer Filter (Account Size)
  if (filterSize !== 'all') {
    challenges = challenges.filter((c) => c.account_size === Number(filterSize))
  }

  // 7. Drawer Filter (Max Price)
  if (filterMaxPrice) {
    challenges = challenges.filter((c) => c.price <= Number(filterMaxPrice))
  }

  // 8. Sorting
  if (sortField) {
    challenges.sort((a: any, b: any) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  } else if (sortByPopularity) {
    challenges.sort((a, b) => b.popularity_score - a.popularity_score)
  } else {
    // Default sorting by popularity_score desc
    challenges.sort((a, b) => b.popularity_score - a.popularity_score)
  }

  // Pagination bounds
  const totalItems = challenges.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedChallenges = challenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleHeaderSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-border-subtle/40">
        {['all', 'forex', 'futures', 'crypto', 'new'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setCategoryTab(tab)
              setCurrentPage(1)
            }}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-mono font-bold uppercase tracking-wider border-t border-x transition-all ${
              categoryTab === tab
                ? 'bg-bg-surface border-border-subtle text-accent-cyan'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab === 'all' ? 'All Challenges' : tab}
          </button>
        ))}
      </div>

      {/* Toolbar Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-bg-surface/50 border border-border-subtle p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Trigger */}
          <AFXButton
            onClick={() => setShowDrawer(!showDrawer)}
            variant="secondary"
            className="flex items-center gap-2 text-xs font-bold font-mono py-2 rounded-xl"
          >
            <Filter className="w-4 h-4 text-accent-cyan" />
            Filters
          </AFXButton>

          {/* Apply Discount Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-bg-base/40 border border-border-subtle/50 px-3 py-2 rounded-xl text-xs font-mono font-bold select-none text-text-secondary hover:text-text-primary transition-all">
            <input
              type="checkbox"
              checked={applyDiscount}
              onChange={() => setApplyDiscount(!applyDiscount)}
              className="w-4 h-4 accent-accent-cyan"
            />
            Apply Discount
          </label>

          {/* Popularity Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-bg-base/40 border border-border-subtle/50 px-3 py-2 rounded-xl text-xs font-mono font-bold select-none text-text-secondary hover:text-text-primary transition-all">
            <input
              type="checkbox"
              checked={sortByPopularity}
              onChange={() => setSortByPopularity(!sortByPopularity)}
              className="w-4 h-4 accent-accent-cyan"
            />
            Sort By Popularity
          </label>

          {/* Bookmarks Toggle Segmented Control */}
          <div className="bg-bg-base/60 border border-border-subtle/80 p-0.5 rounded-xl flex">
            <button
              onClick={() => {
                setViewBookmarksOnly(false)
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !viewBookmarksOnly
                  ? 'bg-bg-surface text-accent-cyan border border-border-subtle/60'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All Programs
            </button>
            <button
              onClick={() => {
                setViewBookmarksOnly(true)
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewBookmarksOnly
                  ? 'bg-bg-surface text-accent-cyan border border-border-subtle/60'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Bookmarks
            </button>
          </div>
        </div>

        {/* Client-side Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search prop firms..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 text-xs bg-bg-base border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
          />
        </div>
      </div>

      {/* Filter Drawer */}
      {showDrawer && (
        <AFXCard className="bg-bg-surface border border-border-subtle p-6 grid md:grid-cols-4 gap-4 animate-fade-in">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase">Prop Firm</label>
            <select
              value={filterFirm}
              onChange={(e) => setFilterFirm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary"
            >
              <option value="all">All Firms</option>
              {firms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase">Steps Count</label>
            <select
              value={filterSteps}
              onChange={(e) => setFilterSteps(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary"
            >
              <option value="all">Any Steps</option>
              <option value="0">Instant Funding (0 Steps)</option>
              <option value="1">1-Step Challenge</option>
              <option value="2">2-Step Challenge</option>
              <option value="3">3-Step Challenge</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase">Account Size ($)</label>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary"
            >
              <option value="all">Any Size</option>
              <option value="10000">10K</option>
              <option value="25000">25K</option>
              <option value="50000">50K</option>
              <option value="100000">100K</option>
              <option value="200000">200K</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase">Max Challenge Price ($)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary"
            />
          </div>
        </AFXCard>
      )}

      {/* Main Comparison Grid / Table */}
      {paginatedChallenges.length > 0 ? (
        <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary select-none font-mono">
                  <th className="px-4 py-4 text-left font-bold w-48">Firm</th>
                  <th className="px-4 py-4 text-center font-bold">
                    <button onClick={() => handleHeaderSort('account_size')} className="flex items-center gap-1 mx-auto hover:text-text-primary">
                      Size <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 text-center font-bold">Steps</th>
                  <th className="px-4 py-4 text-center font-bold">Profit Target</th>
                  <th className="px-4 py-4 text-center font-bold">Daily Loss</th>
                  <th className="px-4 py-4 text-center font-bold">Max Loss</th>
                  <th className="px-4 py-4 text-center font-bold">Ratio</th>
                  <th className="px-4 py-4 text-center font-bold">Split</th>
                  <th className="px-4 py-4 text-center font-bold">Payout</th>
                  <th className="px-4 py-4 text-center font-bold">PTS</th>
                  <th className="px-4 py-4 text-center font-bold">
                    <button onClick={() => handleHeaderSort('price')} className="flex items-center gap-1 mx-auto hover:text-text-primary">
                      Price <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedChallenges.map((ch) => {
                  const firm = getFirm(ch.firm_id)
                  const hasBookmark = favorites.includes(ch.firm_id)

                  // Price calculation based on toggle
                  const deal = getDealCode(ch.deal_id)
                  let displayPrice = ch.price
                  let originalPrice = ch.original_price || ch.price
                  const isDiscounted = applyDiscount && deal

                  if (isDiscounted && deal) {
                    const pctMatch = deal.discount_label.match(/(\d+)%/)
                    if (pctMatch) {
                      const discountPct = parseFloat(pctMatch[1])
                      displayPrice = ch.price * (1 - discountPct / 100)
                    }
                  }

                  return (
                    <tr
                      key={ch.id}
                      className="border-b border-border-subtle hover:bg-bg-base/20 transition-all font-medium text-text-secondary"
                    >
                      {/* Firm Column */}
                      <td className="px-4 py-4 font-bold text-text-primary flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBookmark(ch.firm_id)}
                          className={`p-1 rounded hover:bg-bg-base transition-colors ${
                            hasBookmark ? 'text-accent-cyan' : 'text-text-muted'
                          }`}
                          title="Bookmark firm"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                        {firm?.logo_url ? (
                          <img
                            src={firm.logo_url}
                            alt={firm.name}
                            className="w-7 h-7 object-contain rounded bg-bg-base p-0.5 border border-border-subtle"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-bg-base text-[10px] font-bold rounded flex items-center justify-center text-accent-cyan border border-border-subtle uppercase">
                            {firm?.name[0] || 'P'}
                          </div>
                        )}
                        <div className="flex flex-col text-xs">
                          <span className="text-[13px]">{firm?.name || 'Program'}</span>
                          <span className="text-[10px] text-text-muted font-mono">
                            {firm?.rating || 4.5} ★ ({firm?.review_count || 100})
                          </span>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="px-4 py-4 text-center font-mono font-bold text-text-primary">
                        ${(ch.account_size / 1000).toFixed(0)}K
                      </td>

                      {/* Steps */}
                      <td className="px-4 py-4 text-center text-xs font-bold font-mono">
                        {ch.steps === 0 ? 'Instant' : `${ch.steps}-Step`}
                      </td>

                      {/* Profit Target */}
                      <td className="px-4 py-4 text-center font-mono">
                        {ch.profit_target_p1}%{ch.steps > 1 && ` | ${ch.profit_target_p2}%`}
                      </td>

                      {/* Daily Loss */}
                      <td className="px-4 py-4 text-center font-mono text-red-400">
                        {ch.daily_loss_pct}%
                      </td>

                      {/* Max Loss */}
                      <td className="px-4 py-4 text-center font-mono text-red-400">
                        {ch.max_loss_pct}%
                      </td>

                      {/* Ratio */}
                      <td className="px-4 py-4 text-center font-mono text-xs">
                        {ch.pt_dd_ratio || '1:1'}
                      </td>

                      {/* Split */}
                      <td className="px-4 py-4 text-center font-mono font-bold text-text-primary">
                        {ch.profit_split_pct}%
                      </td>

                      {/* Payout */}
                      <td className="px-4 py-4 text-center text-xs whitespace-nowrap">
                        {ch.payout_freq}
                      </td>

                      {/* Points */}
                      <td className="px-4 py-4 text-center font-mono text-accent-purple text-xs font-bold">
                        +{ch.loyalty_points}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-center font-mono">
                        {isDiscounted ? (
                          <div className="flex flex-col">
                            <span className="line-through text-text-muted text-xs">
                              ${originalPrice}
                            </span>
                            <span className="text-accent-cyan font-bold">${displayPrice.toFixed(0)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-text-primary">${ch.price}</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-center">
                        <AFXButton
                          onClick={() => handleBuyClick(ch)}
                          variant="primary"
                          className="bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold text-xs py-1.5 px-3.5 rounded-lg whitespace-nowrap"
                        >
                          Buy Challenge
                        </AFXButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </AFXCard>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary text-sm font-semibold">No challenges match your filters.</p>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-bg-surface/30 border border-border-subtle p-4 rounded-xl text-xs font-mono">
          <span className="text-text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-base text-text-primary disabled:opacity-50 transition-colors border border-border-subtle"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-base text-text-primary disabled:opacity-50 transition-colors border border-border-subtle"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Info link banner */}
      <div className="text-center text-xs text-text-muted">
        Want to see how we verify lists? Read our{' '}
        <a href="/transparency" className="text-accent-cyan underline hover:text-accent-cyan/80">
          transparency document
        </a>
        .
      </div>

      {/* Buy Discount Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <AFXCard className="bg-bg-surface border border-border-subtle max-w-sm w-full p-6 space-y-6 relative">
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute right-4 top-4 text-text-muted hover:text-text-primary text-sm font-bold font-mono"
            >
              ✕
            </button>
            
            <div className="text-center space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
                {selectedDeal.label} Enabled
              </span>
              <h3 className="text-lg font-bold text-text-primary">Copy Promo Code</h3>
              <p className="text-text-secondary text-xs">
                Copy this code and paste it on the checkout page to activate your discount.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={selectedDeal.code}
                readOnly
                className="w-full px-4 py-3 bg-bg-base border border-border-subtle rounded-xl text-text-primary font-mono text-center text-sm outline-none"
              />
              <button
                onClick={() => handleCopyCode(selectedDeal.code)}
                className="absolute right-2 top-2 p-1.5 hover:bg-bg-surface rounded-lg transition-colors text-accent-cyan"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2">
              <a
                href={selectedDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedDeal(null)}
                className="block w-full py-3 rounded-xl font-bold text-bg-base text-center hover:opacity-95 bg-gradient-to-r from-accent-cyan to-accent-blue text-sm"
              >
                Continue to checkout
              </a>
            </div>
          </AFXCard>
        </div>
      )}
    </div>
  )
}
