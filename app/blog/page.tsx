import React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getBlogs } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'

export const metadata = {
  title: 'Trading Insights & Guides - ANURAJ FX',
}

export default async function BlogPage() {
  const posts = await getBlogs()
  const publishedPosts = posts.filter((post) => post.published)

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-text-primary mb-4 afx-gradient-heading">
            Trading Insights & Guides
          </h1>
          <p className="text-text-secondary text-lg">
            Expert articles on prop trading, brokers, market analysis, and trading strategies for Indian traders.
          </p>
        </div>

        {publishedPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {publishedPosts[0] && (
              <Link href={`/blog/${publishedPosts[0].slug}`}>
                <div className="bg-bg-surface border border-border-subtle hover:border-accent-cyan/40 p-8 mb-12 cursor-pointer transition-all rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
                  <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                    {publishedPosts[0].cover_image_url && (
                      <div className="hidden md:block overflow-hidden rounded-2xl border border-border-subtle">
                        <img
                          src={publishedPosts[0].cover_image_url}
                          alt={publishedPosts[0].title}
                          className="w-full h-64 object-cover hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="space-y-4">
                      <span className="px-2 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
                        Featured
                      </span>
                      <h2 className="text-3xl font-extrabold text-text-primary leading-tight">
                        {publishedPosts[0].title}
                      </h2>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {publishedPosts[0].excerpt}
                      </p>

                      <div className="flex items-center gap-4 pt-4 border-t border-border-subtle text-xs text-text-muted font-mono">
                        <span>Anuraj FX Editorial</span>
                        {publishedPosts[0].published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(
                              publishedPosts[0].published_at.seconds
                                ? publishedPosts[0].published_at.seconds * 1000
                                : publishedPosts[0].published_at
                            ).toLocaleDateString()}
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
              {publishedPosts.slice(1).map((post) => {
                const dateStr = post.published_at
                  ? new Date(
                      post.published_at.seconds ? post.published_at.seconds * 1000 : post.published_at
                    ).toLocaleDateString()
                  : 'Recent'
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <AFXCard className="bg-bg-surface border-border-subtle h-full hover:border-accent-cyan/40 transition-all cursor-pointer group flex flex-col justify-between p-0 overflow-hidden">
                      <div>
                        {post.cover_image_url && (
                          <div className="overflow-hidden rounded-t-2xl border-b border-border-subtle">
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
                        <div className="flex items-center justify-between pt-4 border-t border-border-subtle text-xs text-text-muted font-mono">
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
