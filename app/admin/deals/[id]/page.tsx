'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Firm {
  id: string
  name: string
}

export default function EditDealPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    deal_type: 'general',
  })

  // Load firms and details
  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, dealRes] = await Promise.all([
          fetch('/api/admin/firms'),
          fetch(`/api/admin/deals/${id}`),
        ])
        if (firmsRes.ok && dealRes.ok) {
          const firmsData = await firmsRes.json()
          const dealData = await dealRes.json()
          setFirms(firmsData.data || [])

          let dateVal = ''
          if (dealData.expires_at) {
            const timeMs = dealData.expires_at.seconds
              ? dealData.expires_at.seconds * 1000
              : new Date(dealData.expires_at).getTime()
            dateVal = new Date(timeMs).toISOString().split('T')[0]
          }

          setFormData({
            code: dealData.code || '',
            title: dealData.title || '',
            discount_label: dealData.discount_label || '',
            description: dealData.description || '',
            firm_id: dealData.firm_id || '',
            is_featured: !!dealData.is_featured,
            logo_url: dealData.logo_url || '',
            expires_at: dateVal,
            status: dealData.status || 'active',
            deal_type: dealData.deal_type || 'general',
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/deals')
      } else {
        alert('Failed to update deal parameters')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving deal')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-text-secondary">Loading details...</div>
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
            Edit Promo: {formData.code}
          </h1>
          <p className="text-text-secondary text-sm">Update campaign title, code, and visibility.</p>
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
                <option value="" disabled>— Select a Firm —</option>
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
                <option value="exclusive">Exclusive Deal</option>
                <option value="cash_back">CashBack Deal</option>
                <option value="extra_account">Extra Account Deal</option>
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
              className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none"
            />
          </div>

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
              disabled={saving}
              variant="primary"
              className="bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center gap-2 px-6 py-2.5 rounded-xl text-bg-base text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Details'}
            </AFXButton>
          </div>
        </AFXCard>
      </form>
    </div>
  )
}
