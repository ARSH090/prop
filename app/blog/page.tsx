import React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, BookOpen } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getBlogs } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'The Forex Diary — Find Prop Firms That Actually Pay | ANURAJ FX',
  description: 'Announcements, updates, news, and guidelines regarding proprietary trading firms payouts and validations.',
}

const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Posts', href: '/blog' },
  { id: 'announcement', label: 'Announcements', href: '/blog?category=announcement' },
  { id: 'news', label: 'News', href: '/blog?category=news' },
  { id: 'review', label: 'Reviews', href: '/blog?category=review' },
  { id: 'guide', label: 'Guides', href: '/blog?category=guide' },
] as const

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : null
  const activeCategory = resolvedParams?.category || 'all'

  const posts = await getBlogs()
  const publishedPosts = posts.filter((post) => post.published)

  const filteredPosts = activeCategory === 'all'
    ? publishedPosts
    : publishedPosts.filter((post) => post.category?.toLowerCase() === activeCategory)

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-[10px] font-bold text-accent-cyan uppercase tracking-widest font-mono mb-4 inline-block">
            Official Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 afx-gradient-heading flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent-cyan shrink-0" />
            The Forex Diary
          </h1>
          <p className="text-text-secondary text-base max-w-2xl leading-relaxed">
            Find Prop Firms That Actually Pay. Get verified announcements, platform news, trader guides, and reviews.
          </p>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex flex-wrap gap-2 border-b border-border-subtle/50 pb-3 mb-10">
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${activeCategory === cat.id
                  ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan neon-border-cyan'
                  : 'bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>        {filteredPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {filteredPosts[0] && (
              <Link href={`/blog/${filteredPosts[0].slug}`}>
                <div className="bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:border-accent-cyan/40 p-8 mb-12 cursor-pointer transition-all rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
                  <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                    {filteredPosts[0].cover_image_url && (
                      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={filteredPosts[0].cover_image_url}
                          alt={filteredPosts[0].title}
                          className="w-full h-64 object-cover hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="space-y-4">
                      <span className="px-2.5 py-1 rounded-md bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
                        Featured
                      </span>
                      <h2 className="text-3xl font-extrabold text-text-primary leading-tight">
                        {filteredPosts[0].title}
                      </h2>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {filteredPosts[0].excerpt}
                      </p>

                      <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-xs text-text-muted font-mono">
                        <span>Anuraj FX Editorial</span>
                        {filteredPosts[0].published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(
                              filteredPosts[0].published_at.seconds
                                ? filteredPosts[0].published_at.seconds * 1000
                                : filteredPosts[0].published_at
                            ).toLocaleDateString('en-US')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-accent-cyan font-bold text-sm pt-2 group">
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of Posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(1).map((post) => {
                const dateStr = post.published_at
                  ? new Date(
                    post.published_at.seconds ? post.published_at.seconds * 1000 : post.published_at
                  ).toLocaleDateString('en-US')
                  : 'Recent'
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <AFXCard className="bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border-white/10 h-full hover:border-accent-cyan/40 transition-all cursor-pointer group flex flex-col justify-between p-0 overflow-hidden shadow-xl">
                      <div>
                        {post.cover_image_url && (
                          <div className="overflow-hidden rounded-t-2xl border-b border-white/10">
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-text-secondary text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 space-y-4">
                        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-text-muted font-mono">
                          <span>By Anuraj FX</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dateStr}
                          </div>
                        </div>
                      </div>
                    </AFXCard>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-lg">No blog posts found</p>
            <p className="text-text-muted text-sm mt-2">Check back soon for trading insights and guides.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
export const revalidate = 10
