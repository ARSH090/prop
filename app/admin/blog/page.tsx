'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Plus, Edit2, Calendar, Eye, EyeOff, X, Save, ArrowLeft, Trash2, Globe } from 'lucide-react'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content_md: string
  cover_image_url: string
  author_id: string
  published: boolean
  published_at: string
  tags?: string[]
}

interface BlogEditorProps {
  post?: Partial<Post>
  onSave: (data: Partial<Post>) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

function BlogEditor({ post, onSave, onCancel, isSaving }: BlogEditorProps) {
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content_md: post?.content_md || '',
    cover_image_url: post?.cover_image_url || '',
    published: post?.published ?? false,
    tags: post?.tags?.join(', ') || '',
  })
  const [previewMode, setPreviewMode] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || autoSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    })
  }

  // Simple markdown to HTML for preview
  const renderMarkdown = (md: string) => {
    return md
      .replace(/^# (.+)/gm, '<h1 class="text-2xl font-bold text-text-primary mt-4 mb-2">$1</h1>')
      .replace(/^## (.+)/gm, '<h2 class="text-xl font-bold text-text-primary mt-3 mb-2">$1</h2>')
      .replace(/^### (.+)/gm, '<h3 class="text-lg font-bold text-text-primary mt-2 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-bg-base px-1.5 py-0.5 rounded text-accent-cyan font-mono text-xs">$1</code>')
      .replace(/\n\n/g, '</p><p class="text-text-secondary text-sm leading-relaxed mb-3">')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text-primary">{post?.id ? 'Edit Article' : 'Create New Article'}</h2>
          <p className="text-text-secondary text-xs">Write and publish trading insights for your readers</p>
        </div>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-secondary hover:text-accent-cyan transition-all text-xs font-bold"
        >
          {previewMode ? <Edit2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4 md:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-text-secondary">Article Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g. Best Prop Firms for Indian Traders in 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">URL Slug *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-text-muted text-xs font-mono">/blog/</span>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    placeholder="best-prop-firms-2026"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="cover_image_url"
                    value={form.cover_image_url}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                  {form.cover_image_url && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, cover_image_url: '' }))}
                      className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {/* Image Preview */}
                {form.cover_image_url && (
                  <div className="rounded-xl overflow-hidden border border-border-subtle bg-bg-base relative">
                    <img
                      src={form.cover_image_url}
                      alt="Cover preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-bg-base/80 rounded-lg text-[10px] text-text-muted font-mono border border-border-subtle">
                      Preview · 16:9
                    </div>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-text-secondary">Excerpt / Summary</label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short description shown on blog listing page..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="prop-trading, india, review"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                />
              </div>

              {/* Status */}
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                      form.published ? 'bg-accent-cyan' : 'bg-bg-base border border-border-subtle'
                    }`}
                    onClick={() => setForm((prev) => ({ ...prev, published: !prev.published }))}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                        form.published ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      {form.published ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {form.published ? 'Visible to all readers' : 'Only visible to admins'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </AFXCard>
        </div>

        {/* Content Editor / Preview */}
        <AFXCard className="bg-bg-surface border border-border-subtle overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-border-subtle">
            <label className="text-xs font-semibold text-text-secondary">
              Article Content <span className="text-text-muted">(Markdown supported)</span>
            </label>
            <span className="text-[10px] text-text-muted font-mono">{form.content_md.length} chars</span>
          </div>

          {previewMode ? (
            <div
              className="p-6 prose prose-invert max-w-none min-h-64 text-text-secondary text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<p class="text-text-secondary text-sm leading-relaxed mb-3">${renderMarkdown(form.content_md || '*No content yet...*')}</p>`,
              }}
            />
          ) : (
            <textarea
              name="content_md"
              value={form.content_md}
              onChange={handleChange}
              placeholder={`# Article Title\n\nStart writing your article here. Markdown is supported.\n\n## Section Heading\n\nYour content goes here...\n\n## Key Points\n\n- Point one\n- Point two\n- Point three`}
              className="w-full px-6 py-4 bg-transparent text-text-primary text-sm font-mono focus:outline-none resize-none min-h-80 placeholder:text-text-muted/40 leading-relaxed"
              rows={20}
            />
          )}
        </AFXCard>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <AFXButton
            type="submit"
            disabled={isSaving || !form.title || !form.slug}
            variant="primary"
            className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center gap-2 px-6 py-2.5 rounded-xl text-bg-base text-sm"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : form.published ? 'Publish Article' : 'Save Draft'}
          </AFXButton>
        </div>
      </form>
    </div>
  )
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Partial<Post> | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blog')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.data || [])
      } else {
        // Use mock data fallback
        setPosts([
          {
            id: 'blog-1',
            slug: 'best-prop-firms-2026',
            title: 'Best Prop Firms in 2026: Complete Guide',
            excerpt: 'Discover the top prop firms for forex and futures trading in 2026.',
            content_md: '# Best Prop Firms in 2026\n\nProp trading has exploded in popularity...',
            cover_image_url: '',
            author_id: 'admin',
            published: true,
            published_at: new Date().toISOString(),
          },
        ])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: Partial<Post>) => {
    setIsSaving(true)
    try {
      const method = editingPost?.id ? 'PUT' : 'POST'
      const body = editingPost?.id ? { ...formData, id: editingPost.id } : formData

      const res = await fetch('/api/admin/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        await loadPosts()
        setShowEditor(false)
        setEditingPost(undefined)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save article')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving article')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert('Failed to delete article')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      })
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false)
          setEditingPost(undefined)
        }}
        isSaving={isSaving}
      />
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
          onClick={() => {
            setEditingPost(undefined)
            setShowEditor(true)
          }}
          variant="primary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          Create Article
        </AFXButton>
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Loading articles...</div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => {
            const dateStr = post.published_at
              ? new Date(
                  typeof post.published_at === 'object' && (post.published_at as any).seconds
                    ? (post.published_at as any).seconds * 1000
                    : post.published_at
                ).toLocaleDateString('en-US')
              : 'Draft'
            return (
              <AFXCard
                key={post.id}
                className="bg-bg-surface border border-border-subtle p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        post.published
                          ? 'bg-accent-green/10 text-accent-green border-accent-green/30'
                          : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    {post.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-text-primary truncate">{post.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
                    <span className="text-accent-cyan/80">/blog/{post.slug}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </div>
                  </div>
                  {post.excerpt && (
                    <p className="text-text-secondary text-xs line-clamp-1">{post.excerpt}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2.5 bg-bg-base border border-border-subtle rounded-xl hover:text-accent-cyan text-text-muted transition-all"
                    title="View on site"
                  >
                    <Globe className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                      post.published
                        ? 'bg-accent-green/10 text-accent-green border-accent-green/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-bg-base text-text-secondary border-border-subtle hover:text-text-primary'
                    }`}
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingPost(post)
                      setShowEditor(true)
                    }}
                    className="p-2.5 bg-bg-base border border-border-subtle rounded-xl hover:text-accent-cyan text-text-muted transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2.5 bg-bg-base border border-border-subtle rounded-xl hover:text-red-400 text-text-muted transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </AFXCard>
            )
          })}
        </div>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary mb-4 text-sm font-semibold">No articles yet.</p>
          <AFXButton
            onClick={() => setShowEditor(true)}
            variant="primary"
            className="inline-flex px-6 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all"
          >
            Write First Article
          </AFXButton>
        </div>
      )}
    </div>
  )
}
