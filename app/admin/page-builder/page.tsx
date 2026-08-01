'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye } from 'lucide-react'

interface ContentItem {
  id: string
  page: string
  section_key: string
  content_type: 'text' | 'richtext' | 'image_url' | 'json' | 'number' | 'boolean'
  value: string
}

const pageList = [
  { id: 'home', label: 'Homepage Sections' },
  { id: 'nav', label: 'Header Navigation' },
  { id: 'footer', label: 'Footer Content' },
  { id: 'globe', label: '3D Globe Nodes' },
  { id: 'about', label: 'About Us Page' },
  { id: 'transparency', label: 'Transparency Audit Page' },
  { id: 'how_it_works', label: 'How It Works Page' },
  { id: 'loyalty', label: 'Loyalty PTS Program' },
  { id: 'affiliate_program', label: 'Affiliate Referrals' },
  { id: 'privacy_policy', label: 'Privacy Policy' },
  { id: 'terms_conditions', label: 'Terms & Conditions' },
  { id: 'payouts', label: 'Verified Payouts Page' },
  { id: 'spreads', label: 'Live Spreads Page' },
  { id: 'events', label: 'Trading Events Page' },
  { id: 'leaderboard', label: 'Payouts Leaderboard Page' },
] as const

export default function PageBuilder() {
  const [selectedPage, setSelectedPage] = useState<string>('home')
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Fetch content on mount and page switch
  useEffect(() => {
    async function loadContent() {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/page-builder?page=${selectedPage}`)
        if (res.ok) {
          const data = await res.json()
          setItems(data.items || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [selectedPage])

  const handleTextChange = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)))
  }

  // Helper for parsing JSON lists (e.g. Nav links, trust stats, section orders)
  const parseJsonValue = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr)
    } catch {
      return []
    }
  }

  const handleJsonListChange = (id: string, list: any[]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: JSON.stringify(list) } : item))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/page-builder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (res.ok) {
        setToast('Configuration saved and page revalidated successfully! 🚀')
        setTimeout(() => setToast(null), 3000)
      }
    } catch (err) {
      console.error(err)
      setToast('Failed to save configuration ❌')
      setTimeout(() => setToast(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Visual Page Builder
          </h1>
          <p className="text-text-secondary text-sm">
            Modify hardcoded public copies, repeatable links, and structural order.
          </p>
        </div>

        <div className="flex gap-3">
          <AFXButton
            onClick={() => window.open('/?preview=true', '_blank')}
            variant="secondary"
            className="flex items-center gap-2 border-border-subtle text-text-primary"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </AFXButton>
          <AFXButton
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center gap-2 px-6"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </AFXButton>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase font-mono block px-2 mb-2">
            Select Site Area
          </span>
          {pageList.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                selectedPage === page.id
                  ? 'bg-bg-surface border-accent-cyan/30 text-accent-cyan'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Content Form Editor */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-20 text-text-secondary">Loading page attributes...</div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const isJson = item.content_type === 'json'
                const isLongText = item.section_key === 'body' || item.section_key === 'risk_disclaimer'

                return (
                  <AFXCard key={item.id} className="bg-bg-surface border-border-subtle p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-border-subtle/50 pb-3">
                      <span className="text-xs font-mono font-bold text-accent-cyan tracking-wider uppercase">
                        {item.section_key.replace(/_/g, ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-bg-base text-[9px] font-mono text-text-muted font-bold uppercase">
                        {item.content_type}
                      </span>
                    </div>

                    {/* Standard text inputs */}
                    {item.content_type === 'text' && (
                      isLongText ? (
                        <textarea
                          rows={6}
                          value={item.value}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none font-sans leading-relaxed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                        />
                      )
                    )}

                    {/* Repeatable & custom lists editor (JSON types) */}
                    {isJson && item.section_key === 'trust_stats' && (
                      <TrustStatsEditor
                        list={parseJsonValue(item.value)}
                        onChange={(newList) => handleJsonListChange(item.id, newList)}
                      />
                    )}

                    {isJson && item.section_key === 'links' && (
                      <NavLinksEditor
                        list={parseJsonValue(item.value)}
                        onChange={(newList) => handleJsonListChange(item.id, newList)}
                      />
                    )}

                    {isJson && item.section_key === 'section_order' && (
                      <SectionOrderEditor
                        list={parseJsonValue(item.value)}
                        onChange={(newList) => handleJsonListChange(item.id, newList)}
                      />
                    )}

                    {isJson && item.section_key === 'globe_nodes' && (
                      <GlobeNodesEditor
                        list={parseJsonValue(item.value)}
                        onChange={(newList) => handleJsonListChange(item.id, newList)}
                      />
                    )}
                  </AFXCard>
                )
              })}
              {items.length === 0 && (
                <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl text-text-secondary text-sm font-semibold">
                  This page has no customizable layout parameters. Headline and Body will use default static copy.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-bg-surface border border-accent-cyan/40 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span className="text-text-primary text-sm font-semibold font-mono">{toast}</span>
        </div>
      )}
    </div>
  )
}

// Sub-components: TrustStatsEditor
function TrustStatsEditor({ list, onChange }: { list: any[]; onChange: (list: any[]) => void }) {
  const handleItemChange = (index: number, key: string, val: string) => {
    const updated = [...list]
    updated[index] = { ...updated[index], [key]: val }
    onChange(updated)
  }

  const handleDelete = (index: number) => {
    onChange(list.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    onChange([...list, { label: 'New Stat', value: '0+', icon: '✓' }])
  }

  return (
    <div className="space-y-3">
      {list.map((item, idx) => (
        <div key={idx} className="flex gap-3 items-center flex-wrap md:flex-nowrap bg-bg-base/40 p-3 rounded-xl border border-border-subtle/50">
          <input
            type="text"
            placeholder="Label"
            value={item.label}
            onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
            className="px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
            className="px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
          />
          <input
            type="text"
            placeholder="Icon"
            value={item.icon || ''}
            onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
            className="w-16 px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan text-center"
          />
          <button
            onClick={() => handleDelete(idx)}
            className="p-2 text-text-muted hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="text-xs text-accent-cyan flex items-center gap-1.5 hover:underline"
      >
        <Plus className="w-4 h-4" /> Add Stat Item
      </button>
    </div>
  )
}

// Sub-components: NavLinksEditor
function NavLinksEditor({ list, onChange }: { list: any[]; onChange: (list: any[]) => void }) {
  const handleItemChange = (index: number, key: string, val: string) => {
    const updated = [...list]
    updated[index] = { ...updated[index], [key]: val }
    onChange(updated)
  }

  const handleDelete = (index: number) => {
    onChange(list.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    onChange([...list, { label: 'New Link', href: '/' }])
  }

  return (
    <div className="space-y-3">
      {list.map((item, idx) => (
        <div key={idx} className="flex gap-3 items-center bg-bg-base/40 p-3 rounded-xl border border-border-subtle/50">
          <input
            type="text"
            placeholder="Label"
            value={item.label}
            onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
            className="px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
          />
          <input
            type="text"
            placeholder="URL"
            value={item.href}
            onChange={(e) => handleItemChange(idx, 'href', e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
          />
          <button
            onClick={() => handleDelete(idx)}
            className="p-2 text-text-muted hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="text-xs text-accent-cyan flex items-center gap-1.5 hover:underline"
      >
        <Plus className="w-4 h-4" /> Add Navigation Link
      </button>
    </div>
  )
}

// Sub-components: SectionOrderEditor
function SectionOrderEditor({ list, onChange }: { list: string[]; onChange: (list: string[]) => void }) {
  const move = (index: number, direction: 'up' | 'down') => {
    const updated = [...list]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= updated.length) return
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {list.map((section, idx) => (
        <div key={section} className="flex items-center justify-between bg-bg-base/40 px-4 py-3 rounded-xl border border-border-subtle/50">
          <span className="text-xs font-semibold text-text-primary font-mono capitalize">
            {idx + 1}. {section.replace(/_/g, ' ')}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => move(idx, 'up')}
              disabled={idx === 0}
              className="p-1 rounded bg-bg-base hover:bg-bg-surface text-text-muted hover:text-text-primary disabled:opacity-30"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(idx, 'down')}
              disabled={idx === list.length - 1}
              className="p-1 rounded bg-bg-base hover:bg-bg-surface text-text-muted hover:text-text-primary disabled:opacity-30"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Sub-components: GlobeNodesEditor
function GlobeNodesEditor({ list = [], onChange }: { list: any[]; onChange: (list: any[]) => void }) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

  const handleFieldChange = (index: number, key: string, val: any) => {
    const updated = [...list]
    updated[index] = { ...updated[index], [key]: val }
    onChange(updated)
  }

  const handleLogoUpload = async (index: number, file: File) => {
    setUploadingIdx(index)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        handleFieldChange(index, 'logo_url', data.url)
      } else {
        alert('Upload failed')
      }
    } catch (err) {
      console.error(err)
      alert('Upload error')
    } finally {
      setUploadingIdx(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {list.map((node, idx) => (
          <div
            key={node.id || idx}
            className="p-5 rounded-2xl bg-bg-base/30 border border-border-subtle flex flex-col space-y-4"
          >
            <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
              <span className="text-xs font-mono font-bold text-accent-purple tracking-wider uppercase">
                Slot {idx + 1}
              </span>
              <span className="text-[10px] text-text-muted font-bold uppercase">{node.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Label / Initials</label>
                <input
                  type="text"
                  value={node.name || ''}
                  maxLength={6}
                  onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Glow Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={node.color || '#00D2FF'}
                    onChange={(e) => handleFieldChange(idx, 'color', e.target.value)}
                    className="w-8 h-8 rounded border border-border-subtle cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={node.color || '#00D2FF'}
                    onChange={(e) => handleFieldChange(idx, 'color', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Full Name</label>
              <input
                type="text"
                value={node.full_name || ''}
                onChange={(e) => handleFieldChange(idx, 'full_name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Target Link</label>
              <input
                type="text"
                value={node.href || ''}
                onChange={(e) => handleFieldChange(idx, 'href', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* Logo upload element */}
            <div className="space-y-2 pt-2 border-t border-border-subtle/50">
              <label className="text-[10px] font-bold text-text-secondary uppercase block">Node Logo Image</label>
              <div className="flex items-center gap-4">
                {/* 3D glass bubble preview */}
                <div
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden shrink-0"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 60%, rgba(0,0,0,0.6) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 10px ${node.color || '#00D2FF'}50`,
                  }}
                >
                  {node.logo_url ? (
                    <img
                      src={node.logo_url}
                      alt="Globe Preview"
                      className="max-h-[60%] max-w-[60%] object-contain filter brightness-110"
                    />
                  ) : (
                    <span
                      className="text-[10px] font-black uppercase"
                      style={{ color: node.color || '#00D2FF' }}
                    >
                      {node.name ? node.name.substring(0, 4) : 'SLOT'}
                    </span>
                  )}
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-bg-base hover:bg-bg-surface border border-border-subtle text-[11px] font-bold text-text-secondary transition-all">
                      {uploadingIdx === idx ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleLogoUpload(idx, file)
                        }}
                        className="hidden"
                        disabled={uploadingIdx !== null}
                      />
                    </label>
                    {node.logo_url && (
                      <button
                        onClick={() => handleFieldChange(idx, 'logo_url', '')}
                        className="px-2 py-1.5 rounded-lg border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[11px] font-bold transition-all"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] text-text-muted">Requires transparent SVG/PNG.</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
