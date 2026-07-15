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
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'prop_firm',
    logo_url: '',
    country: '',
    website_url: '',
    affiliate_url: '',
    max_allocation: '',
    platforms: '',
    category: '',
    description: '',
    is_featured: false,
    is_verified: true,
    status: 'active',
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

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Logo Image URL</label>
              <input
                type="text"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
              />
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

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Categories (comma separated)</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="forex, futures, crypto"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                />
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
