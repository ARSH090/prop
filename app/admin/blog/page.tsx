'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Plus, Edit2, Calendar } from 'lucide-react'

interface Post {
  id: string
  slug: string
  title: string
  published: boolean
  published_at: Date
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'blog-1',
      slug: 'best-prop-firms-2024',
      title: 'Best Prop Firms in 2024: Complete Guide',
      published: true,
      published_at: new Date(),
    },
  ])

  const handleTogglePublish = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Manage Blog Articles
          </h1>
          <p className="text-text-secondary text-sm">Write, edit, and toggle publications of news and articles.</p>
        </div>
        <AFXButton
          onClick={() => alert('New post creation editor coming soon')}
          variant="primary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          Create Article
        </AFXButton>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <AFXCard
            key={post.id}
            className="bg-bg-surface border border-border-subtle p-6 flex items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                {post.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
                <span className="font-semibold text-accent-cyan">slug: {post.slug}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.published_at.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTogglePublish(post.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                  post.published
                    ? 'bg-accent-green/10 text-accent-green border-accent-green/30'
                    : 'bg-bg-base text-text-secondary border-border-subtle hover:text-text-primary'
                }`}
              >
                {post.published ? 'Published' : 'Draft'}
              </button>
              <button
                onClick={() => alert('Editing blog content is enabled on the backend')}
                className="p-2.5 bg-bg-base border border-border-subtle rounded-xl hover:text-accent-cyan transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </AFXCard>
        ))}
      </div>
    </div>
  )
}
