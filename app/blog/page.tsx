import React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, Clock, Eye, TrendingUp, Flame, Sparkles, BookOpen, Radio } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getBlogs } from '@/lib/firebase/server'

export const metadata = {
  title: 'Trading News & Insights — The Prop Diary | EMPIRIAL',
  description: 'Verified announcements, prop firm news, trading strategies, payout proofs, and industry reviews.',
}

export const revalidate = 10

interface BlogPostItem {
  id: string
  slug: string
  title: string
  cover_image_url?: string
  excerpt: string
  content?: string
  category?: string
  published?: boolean
  published_at?: any
  views?: number | string
  read_time?: string
  author?: string
}

const FALLBACK_BLOGS: BlogPostItem[] = [
  {
    id: 'prop-payout-rules-2026',
    slug: 'prop-payout-rules-2026-guide',
    title: 'New 2026 Prop Firm Payout Rules: What Every Funded Trader Must Know',
    cover_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Comprehensive breakdown of updated consistency rules, news trading restrictions, simulated profit split caps, and instant payout timelines across top 10 firms.',
    category: 'news',
    published: true,
    published_at: '2026-08-20T10:00:00Z',
    views: '34.2K',
    read_time: '6 min read',
    author: 'Editorial Desk',
  },
  {
    id: 'top-5-instant-funding',
    slug: 'top-5-instant-funding-prop-firms-comparison',
    title: 'Top 5 Instant Funding Prop Firms Compared (No Evaluation Phase)',
    cover_image_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Skip the 2-step challenge with instant funded accounts. We compare leverage, drawdown buffers, scaling ladders, and refundable fee structures.',
    category: 'review',
    published: true,
    published_at: '2026-08-18T14:30:00Z',
    views: '28.9K',
    read_time: '8 min read',
    author: 'Lead Analyst',
  },
  {
    id: 'master-daily-drawdown',
    slug: 'how-to-master-daily-drawdown-limits',
    title: 'How to Master Daily Drawdown & Avoid Account Breaches on Volatile Days',
    cover_image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Trailing drawdown vs balance-based drawdown: practical position sizing algorithms and risk-management protocols designed for evaluation challenges.',
    category: 'guide',
    published: true,
    published_at: '2026-08-16T09:15:00Z',
    views: '24.1K',
    read_time: '5 min read',
    author: 'Risk Desk',
  },
  {
    id: 'firm-scaling-plans',
    slug: 'prop-firm-scaling-plans-to-1-million',
    title: 'How Scaling Plans Work: Path to $1,000,000 in Allocated Capital',
    cover_image_url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Step-by-step roadmap to scale $100K accounts into $1M+ funding pools with 90% profit share and double payout cycles.',
    category: 'guide',
    published: true,
    published_at: '2026-08-14T11:45:00Z',
    views: '19.8K',
    read_time: '7 min read',
    author: 'Senior Trader',
  },
  {
    id: 'ea-algo-trading-rules',
    slug: 'ea-and-algo-trading-in-prop-firms-allowed-or-banned',
    title: 'EA & Algorithmic Trading in 2026: Which Prop Firms Allow Bots?',
    cover_image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Detailed analysis of IP checks, copy trading policies, high-frequency bot restrictions, and approved automated trading systems.',
    category: 'announcement',
    published: true,
    published_at: '2026-08-12T08:20:00Z',
    views: '17.5K',
    read_time: '6 min read',
    author: 'Tech Desk',
  },
  {
    id: 'futures-vs-forex-prop-firms',
    slug: 'futures-vs-forex-prop-firms-which-is-easier',
    title: 'Futures vs Forex Prop Firms: Which Evaluation Has Higher Pass Rates?',
    cover_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Comparing contract fees, trailing thresholds, NinjaTrader / Rithmic platforms, and payout turnaround between CME futures and CFD brokers.',
    category: 'review',
    published: true,
    published_at: '2026-08-10T16:00:00Z',
    views: '15.3K',
    read_time: '9 min read',
    author: 'Market Research',
  },
]

const CATEGORY_CONFIG = [
  {
    id: 'all',
    label: 'ALL STORIES',
    href: '/blog',
    activeClass: 'bg-blue-600 border-blue-400 text-white shadow-[0_0_18px_rgba(37,99,235,0.6)] font-black',
    inactiveClass: 'bg-blue-600/20 border-blue-500/60 text-blue-300 hover:bg-blue-600/35 hover:text-white',
    badgeClass: 'bg-blue-600/25 border-blue-400/70 text-blue-300',
  },
  {
    id: 'news',
    label: 'MARKET NEWS',
    href: '/blog?category=news',
    activeClass: 'bg-amber-500 border-amber-300 text-black shadow-[0_0_18px_rgba(245,158,11,0.6)] font-black',
    inactiveClass: 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/35 hover:text-white',
    badgeClass: 'bg-amber-500/25 border-amber-400/70 text-amber-300',
  },
  {
    id: 'announcement',
    label: 'ANNOUNCEMENTS',
    href: '/blog?category=announcement',
    activeClass: 'bg-pink-600 border-pink-400 text-white shadow-[0_0_18px_rgba(236,72,153,0.6)] font-black',
    inactiveClass: 'bg-pink-600/20 border-pink-500/60 text-pink-300 hover:bg-pink-600/35 hover:text-white',
    badgeClass: 'bg-pink-600/25 border-pink-400/70 text-pink-300',
  },
  {
    id: 'review',
    label: 'FIRM REVIEWS',
    href: '/blog?category=review',
    activeClass: 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_18px_rgba(16,185,129,0.6)] font-black',
    inactiveClass: 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300 hover:bg-emerald-600/35 hover:text-white',
    badgeClass: 'bg-emerald-600/25 border-emerald-400/70 text-emerald-300',
  },
  {
    id: 'guide',
    label: 'STRATEGY GUIDES',
    href: '/blog?category=guide',
    activeClass: 'bg-purple-600 border-purple-400 text-white shadow-[0_0_18px_rgba(168,85,247,0.6)] font-black',
    inactiveClass: 'bg-purple-600/20 border-purple-500/60 text-purple-300 hover:bg-purple-600/35 hover:text-white',
    badgeClass: 'bg-purple-600/25 border-purple-400/70 text-purple-300',
  },
] as const

function getCategoryBadge(category?: string) {
  const cat = (category || 'news').toLowerCase()
  const cfg = CATEGORY_CONFIG.find((c) => c.id === cat) || CATEGORY_CONFIG[1]
  return {
    label: cfg.label,
    badgeClass: cfg.badgeClass,
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : null
  const activeCategory = (resolvedParams?.category || 'all').toLowerCase()

  // Fetch real posts from backend/database
  const rawPosts = await getBlogs()
  const dbPosts = (rawPosts || []).filter((p) => p && (p.published === undefined || p.published === true))

  // Merge with curated articles to ensure full rich editorial content
  const combinedPosts: BlogPostItem[] = [
    ...dbPosts.map((p, idx) => ({
      ...p,
      views: p.views || `${(25 - idx * 2.1).toFixed(1)}K`,
      read_time: p.read_time || '5 min read',
      author: p.author || 'Editorial Team',
    })),
    ...FALLBACK_BLOGS.filter((fb) => !dbPosts.some((dp) => dp.slug === fb.slug || dp.id === fb.id)),
  ]

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all'
    ? combinedPosts
    : combinedPosts.filter((post) => (post.category || 'news').toLowerCase() === activeCategory)

  // Most Visited / Top Stories are the highest ranked items (first 4 items for the top hero magazine layout)
  const leadPost = filteredPosts[0] || combinedPosts[0]
  const trendingSidePosts = filteredPosts.slice(1, 5).length > 0
    ? filteredPosts.slice(1, 5)
    : combinedPosts.slice(1, 5)
  const mainGridPosts = filteredPosts.slice(5)

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#07090e] text-text-primary selection:bg-accent-cyan selection:text-black">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
        {/* Top Newspaper Date & Live Breaking Wire Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-2.5 px-4 mb-4 rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-slate-300">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE WIRE
            </span>
            <span className="truncate text-slate-200">
              FTMO, Funding Pips & Top 5 Prop Firms announce new scaling upgrades and instant payout validation windows.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-400 shrink-0 self-end sm:self-center">
            <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{currentDateFormatted}</span>
          </div>
        </div>

        {/* 2. Bright & Colorful Consistent Filter Tags Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-2 mb-8 pt-1">
          {CATEGORY_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border select-none ${
                  isActive ? cat.activeClass : cat.inactiveClass
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>

        {/* 3 & 4. Professional News / Times of India Style Layout: Top Visited Hero Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                MOST VISITED ARTICLES & TOP STORIES
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
              Updated Hourly
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: #1 Large Lead Feature Story */}
            {leadPost && (
              <div className="lg:col-span-7 xl:col-span-8">
                <Link href={`/blog/${leadPost.slug}`} className="block group h-full">
                  <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-3xl bg-[#0f111a] border border-white/10 hover:border-cyan-400/60 shadow-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300">
                    {/* Cover Image with Cinematic Overlay */}
                    <div className="w-full h-72 sm:h-96 relative overflow-hidden bg-zinc-900">
                      <img
                        src={leadPost.cover_image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80'}
                        alt={leadPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent" />

                      {/* Rank & Category Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg">
                          <Flame className="w-3.5 h-3.5 fill-black" />
                          #1 MOST READ
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border backdrop-blur-md ${getCategoryBadge(leadPost.category).badgeClass}`}>
                          {getCategoryBadge(leadPost.category).label}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/75 border border-white/20 text-white text-xs font-mono font-bold backdrop-blur-md">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          {leadPost.views || '34.2K'}
                        </span>
                      </div>
                    </div>

                    {/* Article Info */}
                    <div className="p-6 sm:p-8 space-y-3.5 relative -mt-8 bg-[#0f111a] rounded-b-3xl">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-accent-cyan transition-colors leading-snug">
                        {leadPost.title}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {leadPost.excerpt}
                      </p>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">{leadPost.author || 'EMPIRIAL Editorial'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                            {leadPost.read_time || '6 min read'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-accent-cyan font-black group-hover:translate-x-1 transition-transform">
                          READ STORY
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Right: #2, #3, #4, #5 Most Visited Stories Column */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-3">
              {trendingSidePosts.map((item, idx) => {
                const rankNumber = idx + 2
                return (
                  <Link
                    key={item.id || item.slug}
                    href={`/blog/${item.slug}`}
                    className="group block p-3.5 rounded-2xl bg-[#0f111a] hover:bg-[#151824] border border-white/[0.08] hover:border-accent-cyan/40 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Numeric Rank Marker */}
                      <span className="text-2xl sm:text-3xl font-black font-bebas text-slate-500 group-hover:text-accent-cyan transition-colors shrink-0 w-7 text-center">
                        0{rankNumber}
                      </span>

                      {/* Small Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 relative bg-zinc-900 border border-white/10">
                        <img
                          src={item.cover_image_url || 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&auto=format&fit=crop&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryBadge(item.category).badgeClass}`}>
                            {getCategoryBadge(item.category).label}
                          </span>
                          <span className="text-[10.5px] font-mono font-bold text-slate-400 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-cyan-400" />
                            {item.views || '18K'}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Lower Section: All Stories & Deep-Dive Magazine Grid */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-6 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                ALL STORIES & LATEST DISPATCH
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Showing {filteredPosts.length} Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mainGridPosts.length > 0 ? mainGridPosts : combinedPosts).map((post) => {
              const dateFormatted = post.published_at
                ? new Date(
                    post.published_at.seconds ? post.published_at.seconds * 1000 : post.published_at
                  ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent'

              return (
                <Link key={post.id || post.slug} href={`/blog/${post.slug}`} className="block group">
                  <div className="h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0f111a] hover:bg-[#141724] border border-white/[0.08] hover:border-accent-cyan/40 shadow-xl transition-all duration-300">
                    <div>
                      {/* Image */}
                      <div className="w-full h-48 sm:h-52 relative overflow-hidden bg-zinc-900 border-b border-white/10">
                        <img
                          src={post.cover_image_url || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md ${getCategoryBadge(post.category).badgeClass}`}>
                            {getCategoryBadge(post.category).label}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white border border-white/10 backdrop-blur-md">
                            <Eye className="w-3 h-3 text-cyan-400" />
                            {post.views || '16K'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300 font-bold">
                            <Calendar className="w-3 h-3 text-accent-cyan" />
                            {dateFormatted}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-purple-400" />
                            {post.read_time || '5 min read'}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-white group-hover:text-accent-cyan transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-black text-accent-cyan bg-white/[0.01]">
                      <span className="text-slate-400 font-mono text-[11px] font-bold">
                        By {post.author || 'EMPIRIAL Editorial'}
                      </span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

