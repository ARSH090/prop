'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
  { id: 'challenges', label: 'Challenges Page' },
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
  return (
    <Suspense fallback={<div className="text-center py-20 text-text-secondary">Loading page builder...</div>}>
      <PageBuilderContent />
    </Suspense>
  )
}

function PageBuilderContent() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get('page')

  const [selectedPage, setSelectedPage] = useState<string>('home')
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Sync selectedPage state when URL query page changes (e.g. from sidebar clicks)
  useEffect(() => {
    if (pageParam && pageList.some((p) => p.id === pageParam)) {
      setSelectedPage(pageParam)
    }
  }, [pageParam])

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
  const [uploadingType, setUploadingType] = useState<'logo' | 'image'>('logo')

  const geoPresets = [
    { label: 'Prague, CZ', lat: 50.0755, lng: 14.4378 },
    { label: 'Chicago, US', lat: 41.8781, lng: -87.6298 },
    { label: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
    { label: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { label: 'Dallas, US', lat: 32.7767, lng: -96.797 },
    { label: 'New York, US', lat: 40.7128, lng: -74.006 },
    { label: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { label: 'Tokyo, JP', lat: 35.6762, lng: 139.6503 },
    { label: 'Sydney, AU', lat: -33.8688, lng: 151.2093 },
    { label: 'Frankfurt, DE', lat: 50.1109, lng: 8.6821 },
    { label: 'Sao Paulo, BR', lat: -23.5505, lng: -46.6333 },
    { label: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
    { label: 'Delhi, IN (HQ)', lat: 28.6139, lng: 77.209 },
  ]

  const handleFieldChange = (index: number, key: string, val: any) => {
    const updated = [...list]
    updated[index] = { ...updated[index], [key]: val }
    onChange(updated)
  }

  const handleGeoSelect = (index: number, presetLabel: string) => {
    const preset = geoPresets.find((p) => p.label === presetLabel)
    if (!preset) return
    const updated = [...list]
    updated[index] = {
      ...updated[index],
      sublabel: preset.label,
      lat: preset.lat,
      lng: preset.lng,
    }
    onChange(updated)
  }

  const handleAddNode = () => {
    const nextIdx = list.length + 1
    const preset = geoPresets[(nextIdx - 1) % geoPresets.length]
    const newNode = {
      id: `slot-custom-${Date.now()}`,
      name: `FIRM ${nextIdx}`,
      full_name: `Prop Firm ${nextIdx}`,
      href: `https://example.com/affiliate-${nextIdx}`,
      affiliate_url: `https://example.com/affiliate-${nextIdx}`,
      color: '#22D3EE',
      logo_url: '',
      firm_image_url: '',
      lat: preset.lat,
      lng: preset.lng,
      sublabel: preset.label,
      is_active: true,
      display_order: nextIdx,
    }
    onChange([...list, newNode])
  }

  const handleDeleteNode = (index: number) => {
    if (confirm('Are you sure you want to delete this Globe firm entry?')) {
      onChange(list.filter((_, i) => i !== index))
    }
  }

  const handleFileUpload = async (index: number, file: File, type: 'logo' | 'image') => {
    setUploadingIdx(index)
    setUploadingType(type)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        const targetField = type === 'logo' ? 'logo_url' : 'firm_image_url'
        handleFieldChange(index, targetField, data.url)
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
      <div className="flex justify-between items-center bg-bg-base/40 p-4 rounded-2xl border border-border-subtle">
        <div>
          <h4 className="text-sm font-bold text-text-primary">3D Globe Prop Firm Nodes ({list.length})</h4>
          <p className="text-xs text-text-secondary">Configure dynamic logos, affiliate tracking links, and global sphere positions.</p>
        </div>
        <button
          onClick={handleAddNode}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Globe Firm Node
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {list.map((node, idx) => (
          <div
            key={node.id || idx}
            className={`p-5 rounded-2xl bg-bg-base/30 border transition-all flex flex-col space-y-4 ${
              node.is_active !== false ? 'border-border-subtle' : 'border-red-500/30 opacity-60'
            }`}
          >
            <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent-cyan tracking-wider uppercase">
                  Slot {idx + 1}
                </span>
                <span className="text-[10px] text-text-muted font-mono font-bold uppercase">({node.id})</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={node.is_active !== false}
                    onChange={(e) => handleFieldChange(idx, 'is_active', e.target.checked)}
                    className="w-3.5 h-3.5 accent-accent-cyan cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-text-secondary">Active</span>
                </label>
                <button
                  onClick={() => handleDeleteNode(idx)}
                  className="p-1 text-text-muted hover:text-red-400 transition-colors"
                  title="Delete Globe Node"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Firm Short Name</label>
                <input
                  type="text"
                  value={node.name || ''}
                  placeholder="e.g. FTMO"
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
              <label className="text-[10px] font-bold text-text-secondary uppercase">Full Title / Sublabel</label>
              <input
                type="text"
                value={node.full_name || ''}
                placeholder="e.g. FTMO Evaluation Program"
                onChange={(e) => handleFieldChange(idx, 'full_name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Affiliate Link Target URL</label>
              <input
                type="text"
                value={node.affiliate_url || node.href || ''}
                placeholder="https://partner.com?ref=empirial"
                onChange={(e) => {
                  handleFieldChange(idx, 'affiliate_url', e.target.value)
                  handleFieldChange(idx, 'href', e.target.value)
                }}
                className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* Geographic position preset */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Geographic Region Preset</label>
                <select
                  value={geoPresets.find((p) => p.lat === node.lat && p.lng === node.lng)?.label || 'Custom'}
                  onChange={(e) => handleGeoSelect(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors"
                >
                  <option value="Custom">Custom Coordinates</option>
                  {geoPresets.map((preset) => (
                    <option key={preset.label} value={preset.label}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Lat</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={node.lat !== undefined && node.lat !== null ? node.lat : ''}
                    onChange={(e) => handleFieldChange(idx, 'lat', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Lng</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={node.lng !== undefined && node.lng !== null ? node.lng : ''}
                    onChange={(e) => handleFieldChange(idx, 'lng', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-mono text-center"
                  />
                </div>
              </div>
            </div>

            {/* Logo Image Upload element */}
            <div className="space-y-2 pt-2 border-t border-border-subtle/50">
              <label className="text-[10px] font-bold text-text-secondary uppercase block">Prop Firm Logo Image</label>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center relative overflow-hidden shrink-0"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 60%, rgba(0,0,0,0.6) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 10px ${node.color || '#00D2FF'}50`,
                  }}
                >
                  {node.logo_url ? (
                    <img
                      src={node.logo_url}
                      alt="Logo Preview"
                      className="w-[82%] h-[82%] rounded-xl object-contain filter brightness-110"
                    />
                  ) : (
                    <span
                      className="text-[10px] font-black uppercase"
                      style={{ color: node.color || '#00D2FF' }}
                    >
                      {node.name ? node.name.substring(0, 4) : 'LOGO'}
                    </span>
                  )}
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-bg-base hover:bg-bg-surface border border-border-subtle text-[11px] font-bold text-text-secondary transition-all">
                      {uploadingIdx === idx && uploadingType === 'logo' ? 'Uploading...' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(idx, file, 'logo')
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
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={node.logo_url || ''}
                    placeholder="/uploads/... or https://..."
                    onChange={(e) => handleFieldChange(idx, 'logo_url', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-bg-base border border-border-subtle/50 text-[10px] text-text-muted font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Optional Firm Image Upload */}
            <div className="space-y-2 pt-2 border-t border-border-subtle/50">
              <label className="text-[10px] font-bold text-text-secondary uppercase block">Firm Banner / Image (Optional)</label>
              <div className="flex items-center gap-4">
                {node.firm_image_url ? (
                  <img
                    src={node.firm_image_url}
                    alt="Firm Image Preview"
                    className="w-12 h-12 rounded-xl border border-border-subtle object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl border border-border-subtle bg-bg-base flex items-center justify-center shrink-0 text-[9px] text-text-muted font-mono">
                    NO IMG
                  </div>
                )}

                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-bg-base hover:bg-bg-surface border border-border-subtle text-[11px] font-bold text-text-secondary transition-all">
                      {uploadingIdx === idx && uploadingType === 'image' ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(idx, file, 'image')
                        }}
                        className="hidden"
                        disabled={uploadingIdx !== null}
                      />
                    </label>
                    {node.firm_image_url && (
                      <button
                        onClick={() => handleFieldChange(idx, 'firm_image_url', '')}
                        className="px-2 py-1.5 rounded-lg border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[11px] font-bold transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={node.firm_image_url || ''}
                    placeholder="/uploads/... or image URL"
                    onChange={(e) => handleFieldChange(idx, 'firm_image_url', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-bg-base border border-border-subtle/50 text-[10px] text-text-muted font-mono"
                  />
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
