'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, Clock, BookOpen } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  cover_image_url: string
  excerpt: string
  published_at?: any
  category?: string
  read_time?: string
}

interface BlogPreviewProps {
  posts: BlogPost[]
  title?: string
  subtext?: string
  ctaText?: string
}

export function BlogPreview({ posts, title, subtext, ctaText }: BlogPreviewProps) {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Background ambient glow seamlessly blending into page */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-64 bg-[#EC4899]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            {/* FULL PINK BOX BADGE */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#d946ef] text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] mb-3">
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span className="text-[10.5px] font-black uppercase tracking-wider font-mono">INSIGHTS & GUIDES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary afx-gradient-heading tracking-tight">
              {title || 'Latest Articles'}
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-1.5 max-w-xl">
              {subtext || 'Trading guidelines, review logs, and industry insights for prop traders.'}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md border border-white/15 hover:border-[#EC4899]/60 text-xs font-black text-white hover:text-pink-300 uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 group"
          >
            {ctaText || 'View All Posts'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.slice(0, 2).map((post) => {
            const dateStr = post.published_at
              ? new Date(
                post.published_at.seconds ? post.published_at.seconds * 1000 : post.published_at
              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recent'
            
            const categoryLabel = post.category || 'PROP TRADING'

            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                {/* Premium Liquid Glass Translucent Article Card */}
                <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-3xl bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 group-hover:border-[#EC4899]/50 shadow-2xl hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-500">
                  
                  <div>
                    {/* 1. ARTICLE IMAGE */}
                    <div className="w-full h-56 sm:h-64 overflow-hidden relative">
                      <img
                        src={post.cover_image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/85 via-transparent to-transparent opacity-90" />
                    </div>

                    <div className="p-6 sm:p-7 space-y-4 relative -mt-6">
                      {/* 2. CATEGORY / TAG BADGE — FULL PINK BOX */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#d946ef] text-white text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                          {categoryLabel}
                        </span>
                        
                        {/* 5. DATE / METADATA */}
                        <div className="flex items-center gap-3 text-[11px] text-text-muted font-mono font-bold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-accent-cyan" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-accent-purple" />
                            {post.read_time || '5 min read'}
                          </span>
                        </div>
                      </div>

                      {/* 3. ARTICLE TITLE */}
                      <h3 className="text-xl sm:text-2xl font-black text-text-primary group-hover:text-pink-300 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      {/* 4. SHORT DESCRIPTION / EXCERPT */}
                      <p className="text-text-secondary text-xs sm:text-sm line-clamp-3 leading-relaxed font-sans">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* 6. READ ARTICLE CTA */}
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 flex items-center justify-between border-t border-white/[0.08] mt-4">
                    <span className="text-xs font-black text-[#EC4899] uppercase tracking-wider flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">
                      EMPIRIAL INSIGHTS
                    </span>
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BlogPreview
