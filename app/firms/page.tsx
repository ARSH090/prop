'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Filter, Search, CheckCircle } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'

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
}

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [firmType, setFirmType] = useState('prop_firm')

  useEffect(() => {
    fetchFirms()
  }, [searchQuery, selectedCategories, selectedPlatforms, minRating, sortBy, firmType])

  const fetchFirms = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','))
      if (selectedPlatforms.length > 0) params.append('platforms', selectedPlatforms.join(','))
      if (minRating > 0) params.append('minRating', minRating.toString())
      params.append('sortBy', sortBy)
      params.append('type', firmType)

      const response = await fetch(`/api/firms?${params}`)
      const result = await response.json()
      setFirms(result.firms || [])
    } catch (error) {
      console.error('Failed to fetch firms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const togglePlatform = (plat: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    )
  }

  const categories = ['Forex', 'Futures', 'Crypto']
  const platforms = ['MT4', 'MT5', 'cTrader', 'NinjaTrader']

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Prop Firms Directory</h1>
          <p className="text-text-secondary">{firms.length} firms found • Compare features, rules, and exclusive deals</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Type Selector */}
            <div className="afx-card bg-bg-card p-6">
              <label className="block text-text-primary font-semibold mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Firm Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={firmType === 'prop_firm'}
                    onChange={() => setFirmType('prop_firm')}
                    className="w-4 h-4 accent-accent-cyan"
                  />
                  <span className="text-text-secondary">Prop Firms</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={firmType === 'broker'}
                    onChange={() => setFirmType('broker')}
                    className="w-4 h-4 accent-accent-cyan"
                  />
                  <span className="text-text-secondary">Brokers</span>
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="afx-card bg-bg-card p-6">
              <label className="block text-text-primary font-semibold mb-3">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="FTMO, TopStep..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent-cyan outline-none"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="afx-card bg-bg-card p-6">
              <label className="block text-text-primary font-semibold mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:ring-2 focus:ring-accent-cyan outline-none text-sm"
              >
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="featured">Featured First</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Categories */}
            <div className="afx-card bg-bg-card p-6">
              <label className="block text-text-primary font-semibold mb-3">Categories</label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.toLowerCase())}
                      onChange={() => toggleCategory(cat.toLowerCase())}
                      className="w-4 h-4 rounded bg-bg-base border-border-subtle accent-accent-cyan"
                    />
                    <span className="text-text-secondary text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="afx-card bg-bg-card p-6">
              <label className="block text-text-primary font-semibold mb-3">Platforms</label>
              <div className="space-y-2">
                {platforms.map((plat) => (
                  <label key={plat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(plat)}
                      onChange={() => togglePlatform(plat)}
                      className="w-4 h-4 rounded bg-bg-base border-border-subtle accent-accent-cyan"
                    />
                    <span className="text-text-secondary text-sm">{plat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="afx-card bg-bg-card p-6">
              <label className="block text-text-primary font-semibold mb-3">Min Rating</label>
              <div className="space-y-2">
                {[0, 3, 4, 4.5].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 accent-accent-cyan"
                    />
                    <span className="text-text-secondary text-sm">
                      {rating === 0 ? 'Any Rating' : `${rating}+ ⭐`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Firms Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-text-secondary">Loading firms...</p>
              </div>
            ) : firms.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {firms.map((firm) => (
                  <Link key={firm.id} href={`/firms/${firm.slug}`}>
                    <div className="afx-card bg-bg-card p-6 h-full hover:shadow-lg hover:shadow-accent-cyan/20 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                              {firm.name}
                            </h3>
                            {firm.is_verified && (
                              <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        {firm.is_featured && (
                          <span className="afx-badge-live text-xs">Featured</span>
                        )}
                      </div>

                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">{firm.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(firm.rating)
                                  ? 'fill-accent-cyan text-accent-cyan'
                                  : 'text-text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-text-secondary text-sm">{firm.rating}/5</span>
                        <span className="text-text-muted text-xs">({firm.review_count})</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {firm.category?.slice(0, 2).map((cat) => (
                          <span key={cat} className="afx-badge-code text-xs">
                            {cat.toUpperCase()}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                        <p className="text-text-secondary text-sm">
                          <span className="text-text-primary font-semibold">
                            ${(firm.max_allocation || 50000) / 1000}K
                          </span>{' '}
                          max
                        </p>
                        <span className="text-accent-cyan text-xs font-semibold group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="afx-card bg-bg-card p-12 text-center">
                <p className="text-text-secondary text-lg">No firms found</p>
                <p className="text-text-muted text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
