'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewFirmPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'prop_firm',
    logo_url: '',
    marquee_logo_url: '',
    show_in_globe: false,
    globe_logo_url: '',
    globe_color: '#00D2FF',
    country: '',
    website_url: '',
    affiliate_url: '',
    cta_text: '',
    payout_custom: '',
    allocation_custom: '',
    profit_split_custom: '',
    discount_label_custom: '',
    coupon_code_custom: '',
    badge_custom: '',
    platform_custom: '',
    max_allocation: '',
    years_active: '',
    platforms: '',
    category: '',
    description: '',
    is_featured: false,
    is_verified: true,
    is_favorite: false,
    is_popular: false,
    show_in_marquee: true,
    circle_crop_logo: false,
    status: 'active',
    logo_frame: 'none',
  })

  // Rules form fields builder (no raw JSON textarea)
  const [rules, setRules] = useState({
    profit_target: '10%',
    max_drawdown: '5%',
    daily_loss: '3%',
    profit_split: '80%',
    steps: '2',
    duration: '60 days',
    re_entry: 'allowed',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleRuleChange = (name: string, value: string) => {
    setRules((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const platformsArr = formData.platforms.split(',').map((p) => p.trim()).filter(Boolean)
      const categoriesArr = formData.category.split(',').map((c) => c.trim()).filter(Boolean)

      const res = await fetch('/api/admin/firms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          platforms: platformsArr,
          category: categoriesArr,
          rules,
        }),
      })

      if (res.ok) {
        router.push('/admin/firms')
      } else {
        alert('Failed to create firm')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating firm')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Back button & Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/firms"
          className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Add New Firm
          </h1>
          <p className="text-text-secondary text-sm">Configure brand parameters and evaluation rules.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        {/* Main Details Panel */}
        <div className="md:col-span-2 space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
              Brand Attributes
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Firm Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. FTMO"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Slug / ID</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ftmo"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                >
                  <option value="prop_firm">Prop Firm</option>
                  <option value="broker">Regulated Broker</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Max Allocation ($)</label>
                <input
                  type="number"
                  name="max_allocation"
                  value={formData.max_allocation}
                  onChange={handleChange}
                  placeholder="e.g. 200000"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Years in Operation</label>
                <input
                  type="number"
                  name="years_active"
                  value={formData.years_active}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Country Code</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. CZ"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors uppercase text-center font-mono"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Logo Border Frame</label>
                <select
                  name="logo_frame"
                  value={formData.logo_frame}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                >
                  <option value="none">No Frame</option>
                  <option value="gold">Gold Trophy Frame</option>
                  <option value="silver">Silver Frame</option>
                  <option value="bronze">Bronze Frame</option>
                  <option value="neon">Neon Cyan Glow</option>
                </select>
              </div>
            </div>

             <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Standard Logo Image</label>
                <div className="flex gap-4 items-start">
                  {formData.logo_url && (
                    <div className="relative w-16 h-16 rounded-xl bg-bg-base border border-border-subtle overflow-hidden flex items-center justify-center p-2 group">
                      <img 
                        src={formData.logo_url} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold text-xs transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleChange}
                      placeholder="https://... or upload below"
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                    />
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-bg-base hover:bg-bg-base/80 border border-border-subtle transition-all">
                        <span>Upload Local Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            
                            const uploaderData = new FormData()
                            uploaderData.append('file', file)
                            
                            try {
                              setIsUploading(true)
                              const res = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: uploaderData,
                              })
                              const result = await res.json()
                              if (result.success && result.url) {
                                setFormData(prev => ({ ...prev, logo_url: result.url }))
                              } else {
                                alert(result.error || 'Upload failed')
                              }
                            } catch (err) {
                              console.error('Upload error:', err)
                              alert('An error occurred during file upload')
                            } finally {
                              setIsUploading(false)
                            }
                          }}
                        />
                      </label>
                      {isUploading && (
                        <span className="text-xs text-accent-cyan font-mono animate-pulse">Uploading...</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 bg-bg-base/35 p-2 rounded-lg border border-border-subtle/50">
                      <input
                        type="checkbox"
                        id="circle_crop_logo"
                        name="circle_crop_logo"
                        checked={formData.circle_crop_logo}
                        onChange={handleChange}
                        className="accent-accent-cyan cursor-pointer w-4 h-4"
                      />
                      <label htmlFor="circle_crop_logo" className="text-xs font-semibold text-text-secondary cursor-pointer select-none">
                        Circle Crop Logo (Cuts off corners of square logos to fit a circle)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Marquee Logo (Optional override)</label>
                <div className="flex gap-4 items-start">
                  {formData.marquee_logo_url && (
                    <div className="relative w-16 h-16 rounded-xl bg-bg-base border border-border-subtle overflow-hidden flex items-center justify-center p-2 group">
                      <img 
                        src={formData.marquee_logo_url} 
                        alt="Marquee preview" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, marquee_logo_url: '' }))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold text-xs transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      name="marquee_logo_url"
                      value={formData.marquee_logo_url}
                      onChange={handleChange}
                      placeholder="https://... or upload below"
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                    />
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-bg-base hover:bg-bg-base/80 border border-border-subtle transition-all">
                        <span>Upload Marquee Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            
                            const uploaderData = new FormData()
                            uploaderData.append('file', file)
                            
                            try {
                              setIsUploading(true)
                              const res = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: uploaderData,
                              })
                              const result = await res.json()
                              if (result.success && result.url) {
                                setFormData(prev => ({ ...prev, marquee_logo_url: result.url }))
                              } else {
                                alert(result.error || 'Upload failed')
                              }
                            } catch (err) {
                              console.error('Upload error:', err)
                              alert('An error occurred during file upload')
                            } finally {
                              setIsUploading(false)
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>


            </div>



            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Website URL</label>
                <input
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Affiliate Tracking URL</label>
                <input
                  type="text"
                  name="affiliate_url"
                  value={formData.affiliate_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* 3D Globe Visual Settings */}
            <div className="space-y-4 pt-4 border-t border-border-subtle/50">
              <h4 className="text-sm font-bold text-text-primary flex items-center justify-between">
                <span>3D Homepage Globe Display</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_in_globe"
                    checked={formData.show_in_globe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-accent-cyan">Enable on 3D Globe</span>
                </label>
              </h4>

              {formData.show_in_globe && (
                <div className="p-4 rounded-xl bg-bg-base/40 border border-border-subtle space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-secondary">Globe Logo Override (Optional)</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          name="globe_logo_url"
                          value={formData.globe_logo_url}
                          onChange={handleChange}
                          placeholder="/uploads/... or image URL"
                          className="flex-1 px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-mono"
                        />
                        <label className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold bg-bg-base border border-border-subtle text-text-secondary hover:text-text-primary">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              const uploaderData = new FormData()
                              uploaderData.append('file', file)
                              try {
                                setIsUploading(true)
                                const res = await fetch('/api/admin/upload', { method: 'POST', body: uploaderData })
                                const result = await res.json()
                                if (result.success && result.url) {
                                  setFormData((prev) => ({ ...prev, globe_logo_url: result.url }))
                                }
                              } finally {
                                setIsUploading(false)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-secondary">Globe Marker Glow Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          name="globe_color"
                          value={formData.globe_color || '#00D2FF'}
                          onChange={handleChange}
                          className="w-10 h-10 rounded border border-border-subtle cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          name="globe_color"
                          value={formData.globe_color || '#00D2FF'}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Custom Button CTA Text</label>
                <input
                  type="text"
                  name="cta_text"
                  value={formData.cta_text}
                  onChange={handleChange}
                  placeholder="Get Funded Now"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Top-Right Custom Badge Label</label>
                <input
                  type="text"
                  name="badge_custom"
                  value={formData.badge_custom}
                  onChange={handleChange}
                  placeholder="e.g. ⚡ High Rating"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Custom Platform Label</label>
                <input
                  type="text"
                  name="platform_custom"
                  value={formData.platform_custom}
                  onChange={handleChange}
                  placeholder="e.g. MT5"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Custom Payout Override</label>
                <input
                  type="text"
                  name="payout_custom"
                  value={formData.payout_custom}
                  onChange={handleChange}
                  placeholder="e.g. $12M+"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Custom Max Allocation Override</label>
                <input
                  type="text"
                  name="allocation_custom"
                  value={formData.allocation_custom}
                  onChange={handleChange}
                  placeholder="e.g. $1,000,000"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Custom Profit Split Override</label>
                <input
                  type="text"
                  name="profit_split_custom"
                  value={formData.profit_split_custom}
                  onChange={handleChange}
                  placeholder="e.g. Up to 100%"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Promo Discount Override (e.g. 30% OFF)</label>
                <input
                  type="text"
                  name="discount_label_custom"
                  value={formData.discount_label_custom}
                  onChange={handleChange}
                  placeholder="e.g. 30% OFF"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Promo Code Override (e.g. FPT)</label>
                <input
                  type="text"
                  name="coupon_code_custom"
                  value={formData.coupon_code_custom}
                  onChange={handleChange}
                  placeholder="e.g. FPT"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Platforms (comma separated)</label>
                <input
                  type="text"
                  name="platforms"
                  value={formData.platforms}
                  onChange={handleChange}
                  placeholder="MT4, MT5, cTrader"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2.5 col-span-1 sm:col-span-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Firm Market Categories / Types</label>
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-bg-base border border-border-subtle">
                  {[
                    { id: 'forex', label: '📈 Forex / CFDs' },
                    { id: 'futures', label: '⚡ Futures' },
                    { id: 'crypto', label: '🪙 Crypto' },
                  ].map((cat) => {
                    const currentArr = formData.category
                      .split(',')
                      .map((c) => c.trim().toLowerCase())
                      .filter(Boolean)
                    const isChecked = currentArr.includes(cat.id)

                    const handleToggle = (e: React.MouseEvent) => {
                      e.preventDefault()
                      let nextArr: string[]
                      if (isChecked) {
                        nextArr = currentArr.filter((c) => c !== cat.id)
                      } else {
                        nextArr = [...currentArr, cat.id]
                      }
                      setFormData((prev) => ({
                        ...prev,
                        category: nextArr.join(', '),
                      }))
                    }

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={handleToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all border ${
                          isChecked
                            ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_12px_rgba(34,211,238,0.3)] scale-105'
                            : 'bg-bg-surface border-white/10 text-text-secondary hover:text-white hover:border-white/30'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isChecked && <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />}
                      </button>
                    )
                  })}
                </div>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="forex, futures, crypto (custom categories comma-separated)"
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none transition-colors mt-1"
                />
                <p className="text-[11px] text-text-muted">
                  Selecting <span className="text-white font-bold">Forex</span> only ensures this firm strictly appears in Forex data across all public pages (Offers, Challenges, Reviews, Compare, etc.).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary of the firm..."
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none"
              />
            </div>
          </AFXCard>
        </div>

        {/* Side Panel - Rules & Switches */}
        <div className="space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
              Rules Configuration
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Profit Target</label>
                <input
                  type="text"
                  value={rules.profit_target}
                  onChange={(e) => handleRuleChange('profit_target', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Max Drawdown</label>
                <input
                  type="text"
                  value={rules.max_drawdown}
                  onChange={(e) => handleRuleChange('max_drawdown', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Daily Loss Limit</label>
                <input
                  type="text"
                  value={rules.daily_loss}
                  onChange={(e) => handleRuleChange('daily_loss', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Profit Split</label>
                <input
                  type="text"
                  value={rules.profit_split}
                  onChange={(e) => handleRuleChange('profit_split', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Steps</label>
                <input
                  type="text"
                  value={rules.steps}
                  onChange={(e) => handleRuleChange('steps', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan text-center"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Duration</label>
                <input
                  type="text"
                  value={rules.duration}
                  onChange={(e) => handleRuleChange('duration', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Re-entry Mode</label>
                <input
                  type="text"
                  value={rules.re_entry}
                  onChange={(e) => handleRuleChange('re_entry', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>
          </AFXCard>

          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
              Visibility & Status
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Verified Account Badge</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="show_in_marquee"
                  checked={formData.show_in_marquee}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Show in Logo Marquee</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_favorite"
                  checked={formData.is_favorite}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Favorite / Popular Firm</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_popular"
                  checked={formData.is_popular}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Is Popular (Top Highlights Panel)</span>
              </label>



              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Publishing Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive / Draft</option>
                </select>
              </div>
            </div>
          </AFXCard>

          <AFXButton
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-2xl"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Firm'}
          </AFXButton>
        </div>
      </form>
    </div>
  )
}
