'use client'

import React from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { Calendar, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  cover_image_url: string
  excerpt: string
  published_at?: any
}

interface BlogPreviewProps {
  posts: BlogPost[]
  title?: string
  subtext?: string
  ctaText?: string
}

export function BlogPreview({ posts, title, subtext, ctaText }: BlogPreviewProps) {
  return (
    <section className="py-20 bg-bg-base border-t border-border-subtle/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-text-primary mb-2 afx-gradient-heading">
              {title || 'Latest Articles'}
            </h2>
            <p className="text-text-secondary">
              {subtext || 'Trading guidelines, review logs, and industry insights for prop traders.'}
            </p>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-accent-cyan hover:underline text-sm font-semibold transition-all group"
          >
            {ctaText || 'View All Posts'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.slice(0, 2).map((post) => {
            const dateStr = post.published_at
              ? new Date(
                post.published_at.seconds ? post.published_at.seconds * 1000 : post.published_at
              ).toLocaleDateString('en-US')
              : 'Recent'
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <AFXCard className="relative h-full flex flex-col justify-between overflow-hidden border border-border-subtle group-hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/5 transition-all duration-300 bg-bg-card/30 p-0">
                  <div>
                    <div className="w-full h-48 overflow-hidden relative">
                      <img
                        src={post.cover_image_url || 'https://via.placeholder.com/600x300'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center text-xs text-text-muted gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 text-accent-cyan text-sm font-semibold flex items-center gap-1">
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AFXCard>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default BlogPreview
