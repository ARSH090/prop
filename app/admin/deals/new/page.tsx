'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Firm {
  id: string
  name: string
}

export default function NewDealPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [firms, setFirms] = useState<Firm[]>([])
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    discount_label: '',
    description: '',
    firm_id: '',
    is_featured: false,
    logo_url: '',
    expires_at: '',
    status: 'active',
    deal_type: 'best_value',
  })

  const [tabLabels, setTabLabels] = useState({
    best_value: 'Best Value',
    bogo: 'BOGO Offers',
    cash_back: 'CashBack offers',
    extra_points: 'Extra Points',
  })

  // Load firms and settings for selection dropdown
  useEffect(() => {
    async function loadFirmsAndSettings() {
      try {
        const [firmsRes, settingsRes] = await Promise.all([
          fetch('/api/admin/firms'),
          fetch('/api/admin/settings')
        ])
        if (firmsRes.ok) {
          const data = await firmsRes.json()
          const list = data.data || []
          setFirms(list)
          if (list.length > 0) {
            setFormData((prev) => ({ ...prev, firm_id: list[0].id }))
          }
        }
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setTabLabels({
            best_value: settings.tab_best_value || 'Best Value',
            bogo: settings.tab_bogo || 'BOGO Offers',
            cash_back: settings.tab_cash_back || 'CashBack offers',
            extra_points: settings.tab_extra_points || 'Extra Points',
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadFirmsAndSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/deals')
      } else {
        setError(data.error || 'Failed to create promo deal. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/deals"
          className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Create Promo Code
          </h1>
          <p className="text-text-secondary text-sm">Configure coupon codes, discount labels, and details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Promo Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="e.g. AFX-SUMMIT20"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Discount Label</label>
              <input
                type="text"
                name="discount_label"
                value={formData.discount_label}
                onChange={handleChange}
                placeholder="e.g. 20% OFF / FREE TRIAL"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Prop Firm / Broker</label>
              <select
                name="firm_id"
                value={formData.firm_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
              >
                {firms.map((firm) => (
                  <option key={firm.id} value={firm.id}>
                    {firm.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Deal Type Tab Category</label>
              <select
                name="deal_type"
                value={formData.deal_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
              >
                <option value="best_value">{tabLabels.best_value}</option>
                <option value="bogo">{tabLabels.bogo}</option>
                <option value="cash_back">{tabLabels.cash_back}</option>
                <option value="extra_points">{tabLabels.extra_points}</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Expiration Date</label>
              <input
                type="date"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Campaign Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. 20% Off Summit Challenges"
              className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Custom Deal Logo (Optional override)</label>
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
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide context or instructions on where to apply the code..."
              className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center gap-4 pt-4 border-t border-border-subtle">
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Featured Offer</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-xs font-semibold text-text-secondary">Status:</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="px-2 py-1 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft / Expired</option>
                </select>
              </label>
            </div>

            <AFXButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center gap-2 px-6 py-2.5 rounded-xl text-bg-base text-sm"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Code'}
            </AFXButton>
          </div>
        </AFXCard>
      </form>
    </div>
  )
}
