'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditFirmPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    badge_custom: '',
    platform_custom: '',
    max_allocation: '',
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
    consistency_rules_content: '',
    firm_rules_content: '',
    commissions_text: '',
    instruments: '',
    payout_programs: [] as any[],
    restricted_countries: [] as string[],
    logo_frame: 'none',
  })

  const [rules, setRules] = useState({
    profit_target: '10%',
    max_drawdown: '5%',
    daily_loss: '3%',
    profit_split: '80%',
    steps: '2',
    duration: '60 days',
    re_entry: 'allowed',
  })

  // Part A & D: State hooks for rules feed, tabs, and contract specifications
  const [activeTab, setActiveTab] = useState<'general' | 'rules' | 'specs' | 'consistency' | 'firm_rules' | 'payout_policy' | 'countries'>('general')
  const [rulesHistory, setRulesHistory] = useState<any[]>([])
  const [newRule, setNewRule] = useState({
    rule_key: 'max_drawdown',
    rule_value: '',
    effective_date: new Date().toISOString().split('T')[0]
  })
  
  const [contractSpecs, setContractSpecs] = useState<any[]>([])
  const [newSpec, setNewSpec] = useState({
    contract_symbol: '',
    margin_requirement: '',
    tick_value: '',
    notes: ''
  })

  // Unified firm rules state
  const [firmRulesData, setFirmRulesData] = useState({
    max_daily_loss: '',
    max_drawdown: '',
    drawdown_type: 'static',
    consistency_rule: '',
    min_trading_days: 0,
    profit_target_phase1: '',
    profit_target_phase2: '',
    ea_allowed: false,
    copy_trading_allowed: false,
    news_trading_allowed: false,
  })
  const [firmRulesHistory, setFirmRulesHistory] = useState<any[]>([])
  const [savingRules, setSavingRules] = useState(false)

  // Load existing firm data
  useEffect(() => {
    async function loadFirm() {
      try {
        const res = await fetch(`/api/admin/firms/${id}`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            type: data.type || 'prop_firm',
            logo_url: data.logo_url || '',
            marquee_logo_url: data.marquee_logo_url || '',
            show_in_globe: !!data.show_in_globe,
            globe_logo_url: data.globe_logo_url || '',
            globe_color: data.globe_color || '#00D2FF',
            country: data.country || '',
            website_url: data.website_url || '',
            affiliate_url: data.affiliate_url || '',
            cta_text: data.cta_text || '',
            payout_custom: data.payout_custom || '',
            allocation_custom: data.allocation_custom || '',
            profit_split_custom: data.profit_split_custom || '',
            badge_custom: data.badge_custom || '',
            platform_custom: data.platform_custom || '',
            max_allocation: data.max_allocation ? String(data.max_allocation) : '',
            platforms: data.platforms ? data.platforms.join(', ') : '',
            category: data.category ? data.category.join(', ') : '',
            description: data.description || '',
            is_featured: !!data.is_featured,
            is_verified: !!data.is_verified,
            is_favorite: !!data.is_favorite,
            is_popular: !!data.is_popular,
            show_in_marquee: data.show_in_marquee !== false,
            circle_crop_logo: !!data.circle_crop_logo,
            status: data.status || 'active',
            consistency_rules_content: data.consistency_rules_content || '',
            firm_rules_content: data.firm_rules_content || '',
            commissions_text: data.commissions_text || '',
            instruments: data.instruments ? (Array.isArray(data.instruments) ? data.instruments.join(', ') : data.instruments) : '',
            payout_programs: data.payout_programs || [],
            restricted_countries: data.restricted_countries || [],
            logo_frame: data.logo_frame || 'none',
          })
          if (data.rules) {
            setRules({
              profit_target: data.rules.profit_target || '10%',
              max_drawdown: data.rules.max_drawdown || '5%',
              daily_loss: data.rules.daily_loss || '3%',
              profit_split: data.rules.profit_split || '80%',
              steps: String(data.rules.steps || '2'),
              duration: data.rules.duration || '60 days',
              re_entry: data.rules.re_entry || 'allowed',
            })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    async function loadRulesHistory() {
      try {
        const res = await fetch('/api/admin/rules')
        if (res.ok) {
          const data = await res.json()
          setRulesHistory((data.data || []).filter((r: any) => r.firm_id === id))
        }
      } catch (err) {
        console.error(err)
      }
    }

    async function loadUnifiedRules() {
      try {
        const rulesRes = await fetch(`/api/admin/rules?firm_id=${id}`)
        if (rulesRes.ok) {
          const rulesJson = await rulesRes.json()
          if (rulesJson.data) {
            setFirmRulesData({
              max_daily_loss: rulesJson.data.max_daily_loss || '',
              max_drawdown: rulesJson.data.max_drawdown || '',
              drawdown_type: rulesJson.data.drawdown_type || 'static',
              consistency_rule: rulesJson.data.consistency_rule || '',
              min_trading_days: Number(rulesJson.data.min_trading_days) || 0,
              profit_target_phase1: rulesJson.data.profit_target_phase1 || '',
              profit_target_phase2: rulesJson.data.profit_target_phase2 || '',
              ea_allowed: !!rulesJson.data.ea_allowed,
              copy_trading_allowed: !!rulesJson.data.copy_trading_allowed,
              news_trading_allowed: !!rulesJson.data.news_trading_allowed,
            })
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    async function loadUnifiedRulesHistory() {
      try {
        const historyRes = await fetch(`/api/rules/history`)
        if (historyRes.ok) {
          const historyJson = await historyRes.json()
          const allHistory = historyJson.data || []
          setFirmRulesHistory(allHistory.filter((h: any) => h.firm_id === id))
        }
      } catch (err) {
        console.error(err)
      }
    }

    async function loadSpecs() {
      try {
        const res = await fetch(`/api/admin/firms/${id}/contract-specs`)
        if (res.ok) {
          const data = await res.json()
          setContractSpecs(data.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (id) {
      loadFirm()
      loadRulesHistory()
      loadUnifiedRules()
      loadUnifiedRulesHistory()
      loadSpecs()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleRuleChange = (name: string, value: string) => {
    setRules((prev) => ({ ...prev, [name]: value }))
  }

  // Part A: Rules Versioning Handler
  const handleSaveUnifiedRules = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingRules(true)
    try {
      const res = await fetch('/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_id: id,
          ...firmRulesData,
        })
      })
      if (res.ok) {
        alert('Rules updated — now live on Key Rules, Rule Changes, and EA/Copy Trading pages')
        const historyRes = await fetch('/api/rules/history')
        if (historyRes.ok) {
          const historyJson = await historyRes.json()
          const allHistory = historyJson.data || []
          setFirmRulesHistory(allHistory.filter((h: any) => h.firm_id === id))
        }
      } else {
        alert('Failed to update rules')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating rules')
    } finally {
      setSavingRules(false)
    }
  }

  // Part D: Contract Specifications Handlers for Futures Category
  const handleAddSpec = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSpec.contract_symbol) return
    setContractSpecs(prev => [
      ...prev,
      {
        contract_symbol: newSpec.contract_symbol,
        margin_requirement: Number(newSpec.margin_requirement) || 0,
        tick_value: Number(newSpec.tick_value) || 0,
        notes: newSpec.notes
      }
    ])
    setNewSpec({ contract_symbol: '', margin_requirement: '', tick_value: '', notes: '' })
  }

  const handleDeleteSpec = (idx: number) => {
    setContractSpecs(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSaveSpecs = async () => {
    try {
      const res = await fetch(`/api/admin/firms/${id}/contract-specs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specs: contractSpecs })
      })
      if (res.ok) {
        alert('Contract specifications saved successfully!')
      } else {
        alert('Failed to save specifications')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving specifications')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const platformsArr = formData.platforms.split(',').map((p) => p.trim()).filter(Boolean)
      const categoriesArr = formData.category.split(',').map((c) => c.trim()).filter(Boolean)
      const instrumentsArr = formData.instruments ? formData.instruments.split(',').map((i) => i.trim()).filter(Boolean) : []

      const res = await fetch(`/api/admin/firms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          platforms: platformsArr,
          category: categoriesArr,
          instruments: instrumentsArr,
          rules,
        }),
      })

      if (res.ok) {
        router.push('/admin/firms')
      } else {
        alert('Failed to save firm details')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-text-secondary">Loading firm details...</div>
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
            Edit Firm details: {formData.name}
          </h1>
          <p className="text-text-secondary text-sm">Update company description, links, and evaluation settings.</p>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="flex items-center gap-2 border-b border-border-subtle/50 pb-px mb-6 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'general'
              ? 'border-accent-cyan text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          General Attributes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'rules'
              ? 'border-accent-cyan text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Rules Changelog Feed
        </button>
        {formData.category.toLowerCase().includes('futures') && (
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'specs'
                ? 'border-accent-cyan text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Contract Specifications
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('consistency')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'consistency'
              ? 'border-accent-cyan text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Consistency Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('firm_rules')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'firm_rules'
              ? 'border-accent-cyan text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Firm Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payout_policy')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'payout_policy'
              ? 'border-accent-cyan text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Payout Policy Builder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('countries')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'countries'
              ? 'border-accent-cyan text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Restricted Countries
        </button>
      </div>

      {activeTab === 'general' && (
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
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-muted text-sm focus:outline-none opacity-50 cursor-not-allowed font-mono"
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
                        onChange={(e) => setFormData((prev) => ({ ...prev, circle_crop_logo: e.target.checked }))}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors font-mono"
                />
              </div>
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

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Platforms (comma separated)</label>
                <input
                  type="text"
                  name="platforms"
                  value={formData.platforms}
                  onChange={handleChange}
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
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none"
              />
            </div>
          </AFXCard>
        </div>

        {/* Side Panel - Rules & Status */}
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
            disabled={saving}
            variant="primary"
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-2xl"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Details'}
          </AFXButton>
        </div>
      </form>
      )}

      {/* Rules versioning history tab */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveUnifiedRules} className="space-y-6 max-w-4xl mx-auto">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Unified Prop Firm Rules Configuration</h3>
              <p className="text-xs text-text-muted mt-1">Configure active evaluation rules. Saving updates Key Rules, Rule Changes, and Automation pages instantly.</p>
            </div>

            {/* Group 1: Risk & Trading Rules */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-accent-cyan uppercase tracking-wider border-b border-border-subtle/50 pb-2">
                Risk & Trading Rules
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Max Daily Loss</label>
                  <input
                    type="text"
                    placeholder="e.g. 5%"
                    value={firmRulesData.max_daily_loss}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, max_daily_loss: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Max Drawdown</label>
                  <input
                    type="text"
                    placeholder="e.g. 10%"
                    value={firmRulesData.max_drawdown}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, max_drawdown: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Drawdown Type</label>
                  <select
                    value={firmRulesData.drawdown_type}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, drawdown_type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  >
                    <option value="static">Static Drawdown</option>
                    <option value="trailing">Trailing Drawdown</option>
                    <option value="eod_trailing">End of Day (EOD) Trailing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Consistency Rule Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 30% max single day profit rule"
                    value={firmRulesData.consistency_rule}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, consistency_rule: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Minimum Trading Days</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={firmRulesData.min_trading_days || ''}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, min_trading_days: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Profit Target (Phase 1)</label>
                  <input
                    type="text"
                    placeholder="e.g. 8%"
                    value={firmRulesData.profit_target_phase1}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, profit_target_phase1: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-text-secondary">Profit Target (Phase 2 - Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 5% (Leave blank if single-phase)"
                    value={firmRulesData.profit_target_phase2 || ''}
                    onChange={(e) => setFirmRulesData(prev => ({ ...prev, profit_target_phase2: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Group 2: Automation & Policy */}
            <div className="space-y-4 pt-4 border-t border-border-subtle/50">
              <h4 className="text-xs font-bold text-accent-purple uppercase tracking-wider border-b border-border-subtle/50 pb-2">
                Automation & Policy
              </h4>
              <div className="grid sm:grid-cols-3 gap-6">
                
                {/* EA Switch */}
                <div className="flex items-center justify-between p-4 bg-bg-base/40 rounded-2xl border border-border-subtle">
                  <div>
                    <p className="text-xs font-bold text-white">EA Allowed</p>
                    <p className="text-[10px] text-text-muted">Expert Advisor bots</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFirmRulesData(prev => ({ ...prev, ea_allowed: !prev.ea_allowed }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      firmRulesData.ea_allowed ? 'bg-accent-cyan' : 'bg-bg-base border-border-subtle'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      firmRulesData.ea_allowed ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Copy Trading Switch */}
                <div className="flex items-center justify-between p-4 bg-bg-base/40 rounded-2xl border border-border-subtle">
                  <div>
                    <p className="text-xs font-bold text-white">Copy Trading</p>
                    <p className="text-[10px] text-text-muted">Account mirroring</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFirmRulesData(prev => ({ ...prev, copy_trading_allowed: !prev.copy_trading_allowed }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      firmRulesData.copy_trading_allowed ? 'bg-accent-cyan' : 'bg-bg-base border-border-subtle'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      firmRulesData.copy_trading_allowed ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* News Trading Switch */}
                <div className="flex items-center justify-between p-4 bg-bg-base/40 rounded-2xl border border-border-subtle">
                  <div>
                    <p className="text-xs font-bold text-white">News Trading</p>
                    <p className="text-[10px] text-text-muted">Trading during events</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFirmRulesData(prev => ({ ...prev, news_trading_allowed: !prev.news_trading_allowed }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      firmRulesData.news_trading_allowed ? 'bg-accent-cyan' : 'bg-bg-base border-border-subtle'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      firmRulesData.news_trading_allowed ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>
            </div>

            <AFXButton
              type="submit"
              disabled={savingRules}
              variant="primary"
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-black py-3 rounded-2xl flex items-center justify-center gap-2"
            >
              {savingRules ? 'Saving Configuration...' : 'Save Rules Configuration'}
            </AFXButton>
          </AFXCard>

          {/* Collapsed Rules Changelog History Accordion */}
          <details className="group border border-border-subtle bg-bg-surface rounded-3xl overflow-hidden shadow-lg transition-all duration-300">
            <summary className="flex items-center justify-between p-5 font-bold text-sm text-text-primary cursor-pointer hover:bg-bg-base/20 select-none">
              <span>View Rule Change History (Last 5 Changes)</span>
              <span className="text-xs text-text-muted transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-5 border-t border-border-subtle/50 space-y-3 bg-[#0C0916]">
              {firmRulesHistory.length === 0 ? (
                <p className="text-xs text-text-muted font-mono">No previous modifications logged in history.</p>
              ) : (
                firmRulesHistory.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-accent-cyan uppercase">{String(log.rule_field).replace(/_/g, ' ')}</span>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Changed from <span className="text-red-400 line-through">{log.old_value}</span> to <span className="text-green-400 font-bold">{log.new_value}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      {new Date(log.changed_at).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </details>
        </form>
      )}

      {/* Contract Specs tab */}
      {activeTab === 'specs' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
                <h3 className="text-lg font-bold text-text-primary">
                  Futures Contract Specifications
                </h3>
                <AFXButton
                  type="button"
                  onClick={handleSaveSpecs}
                  variant="secondary"
                  className="text-xs font-bold px-4 py-1.5 rounded-lg border border-border-subtle hover:bg-bg-base transition-colors"
                >
                  Save All Changes
                </AFXButton>
              </div>

              {contractSpecs.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm">
                  No contracts defined. Add one using the form on the right.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-text-primary">
                    <thead>
                      <tr className="border-b border-border-subtle text-text-muted font-semibold text-xs">
                        <th className="py-2 px-3">Contract Symbol</th>
                        <th className="py-2 px-3">Margin Requirement ($)</th>
                        <th className="py-2 px-3">Tick Value ($)</th>
                        <th className="py-2 px-3">Notes</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/50">
                      {contractSpecs.map((spec, idx) => (
                        <tr key={idx} className="hover:bg-bg-base/30">
                          <td className="py-2.5 px-3 font-mono">{spec.contract_symbol}</td>
                          <td className="py-2.5 px-3 font-mono">${spec.margin_requirement}</td>
                          <td className="py-2.5 px-3 font-mono">${spec.tick_value}</td>
                          <td className="py-2.5 px-3 text-text-secondary">{spec.notes || '—'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteSpec(idx)}
                              className="text-red-400 hover:text-red-300 font-semibold text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </AFXCard>
          </div>

          <div className="space-y-6">
            <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-4">
              <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
                Add Contract Row
              </h3>
              <form onSubmit={handleAddSpec} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Contract Symbol</label>
                  <input
                    type="text"
                    value={newSpec.contract_symbol}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, contract_symbol: e.target.value }))}
                    placeholder="e.g. ES, NQ, CL"
                    required
                    className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Margin Requirement ($)</label>
                  <input
                    type="number"
                    value={newSpec.margin_requirement}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, margin_requirement: e.target.value }))}
                    placeholder="e.g. 50"
                    required
                    className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Tick Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSpec.tick_value}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, tick_value: e.target.value }))}
                    placeholder="e.g. 12.50"
                    required
                    className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Notes</label>
                  <input
                    type="text"
                    value={newSpec.notes}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g. E-mini S&P 500"
                    className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <AFXButton
                  type="submit"
                  variant="primary"
                  className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-2.5 rounded-xl"
                >
                  Add Contract Row
                </AFXButton>
              </form>
            </AFXCard>
          </div>
        </div>
      )}

      {/* Consistency Rules tab */}
      {activeTab === 'consistency' && (
        <div className="space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Consistency Target Rules</h3>
                <p className="text-xs text-text-secondary mt-0.5">Input rules description as HTML or raw text.</p>
              </div>
              <AFXButton type="button" onClick={handleSubmit} disabled={saving} variant="primary" className="text-xs font-bold px-4 py-2">
                {saving ? 'Saving...' : 'Save Consistency Rules'}
              </AFXButton>
            </div>
            <textarea
              value={formData.consistency_rules_content}
              onChange={(e) => setFormData(prev => ({ ...prev, consistency_rules_content: e.target.value }))}
              placeholder="e.g. <h2>Rules</h2><ul><li>Rule 1</li></ul>"
              className="w-full h-96 p-4 text-xs font-mono bg-bg-base border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent-cyan"
            />
          </AFXCard>
        </div>
      )}

      {/* Firm Rules tab */}
      {activeTab === 'firm_rules' && (
        <div className="space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
              <div>
                <h3 className="text-lg font-bold text-text-primary">General Firm Rules</h3>
                <p className="text-xs text-text-secondary mt-0.5">Input general evaluation constraints as HTML or raw text.</p>
              </div>
              <AFXButton type="button" onClick={handleSubmit} disabled={saving} variant="primary" className="text-xs font-bold px-4 py-2">
                {saving ? 'Saving...' : 'Save General Rules'}
              </AFXButton>
            </div>
            <textarea
              value={formData.firm_rules_content}
              onChange={(e) => setFormData(prev => ({ ...prev, firm_rules_content: e.target.value }))}
              placeholder="e.g. <h2>Rules</h2><ul><li>Rule 1</li></ul>"
              className="w-full h-96 p-4 text-xs font-mono bg-bg-base border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent-cyan"
            />
          </AFXCard>
        </div>
      )}

      {/* Payout Policy tab */}
      {activeTab === 'payout_policy' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Payout Programs Builder</h3>
              <p className="text-xs text-text-secondary mt-0.5">Configure program models, minimum limits, and size tier tables.</p>
            </div>
            <div className="flex gap-2">
              <AFXButton
                type="button"
                onClick={() => {
                  const newProg = {
                    id: `prog-${Date.now()}`,
                    program_name: 'New Program',
                    minimum_payout: 250,
                    payout_frequency_days: 14,
                    trading_days_rule_content: '<p>Trading days profit rules description...</p>',
                    display_order: formData.payout_programs.length + 1,
                    tiers: [] as any[]
                  }
                  setFormData(prev => ({ ...prev, payout_programs: [...prev.payout_programs, newProg] }))
                }}
                variant="secondary"
                className="text-xs font-bold border border-border-subtle"
              >
                + Add Program
              </AFXButton>
              <AFXButton type="button" onClick={handleSubmit} disabled={saving} variant="primary" className="text-xs font-bold">
                {saving ? 'Saving...' : 'Save Payout Config'}
              </AFXButton>
            </div>
          </div>

          {formData.payout_programs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-subtle rounded-2xl text-text-muted text-sm bg-bg-surface">
              No payout programs added. Click "+ Add Program" to start configuring.
            </div>
          ) : (
            <div className="space-y-6">
              {formData.payout_programs.map((prog: any, progIdx: number) => (
                <AFXCard key={prog.id} className="bg-bg-surface border-border-subtle p-6 space-y-6 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.payout_programs.filter((_, idx) => idx !== progIdx)
                      setFormData(prev => ({ ...prev, payout_programs: filtered }))
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300 font-bold text-xs"
                  >
                    Delete Program
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary">Program Name</label>
                      <input
                        type="text"
                        value={prog.program_name}
                        onChange={(e) => {
                          const updated = [...formData.payout_programs]
                          updated[progIdx].program_name = e.target.value
                          setFormData(prev => ({ ...prev, payout_programs: updated }))
                        }}
                        className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary">Min Payout ($)</label>
                      <input
                        type="number"
                        value={prog.minimum_payout}
                        onChange={(e) => {
                          const updated = [...formData.payout_programs]
                          updated[progIdx].minimum_payout = Number(e.target.value)
                          setFormData(prev => ({ ...prev, payout_programs: updated }))
                        }}
                        className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary">Frequency (Days)</label>
                      <input
                        type="number"
                        value={prog.payout_frequency_days}
                        onChange={(e) => {
                          const updated = [...formData.payout_programs]
                          updated[progIdx].payout_frequency_days = Number(e.target.value)
                          setFormData(prev => ({ ...prev, payout_programs: updated }))
                        }}
                        className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-secondary">Display Order</label>
                      <input
                        type="number"
                        value={prog.display_order}
                        onChange={(e) => {
                          const updated = [...formData.payout_programs]
                          updated[progIdx].display_order = Number(e.target.value)
                          setFormData(prev => ({ ...prev, payout_programs: updated }))
                        }}
                        className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary">Trading Days Explanation Paragraph (HTML/text)</label>
                    <textarea
                      value={prog.trading_days_rule_content}
                      onChange={(e) => {
                        const updated = [...formData.payout_programs]
                        updated[progIdx].trading_days_rule_content = e.target.value
                        setFormData(prev => ({ ...prev, payout_programs: updated }))
                      }}
                      className="w-full h-24 p-3 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary font-mono"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-text-primary">Size limit Tiers Table</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.payout_programs]
                          updated[progIdx].tiers.push({
                            account_size: 50000,
                            min_profit_per_day: 200,
                            max_payout_per_cycle: 2500
                          })
                          setFormData(prev => ({ ...prev, payout_programs: updated }))
                        }}
                        className="text-[10px] font-black text-accent-cyan hover:underline"
                      >
                        + Add Size Tier Row
                      </button>
                    </div>

                    {prog.tiers.length === 0 ? (
                      <p className="text-[10px] text-text-muted">No size tiers added yet.</p>
                    ) : (
                      <div className="overflow-x-auto text-[10px]">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border-subtle text-text-muted text-left">
                              <th className="py-1">Account Size ($)</th>
                              <th className="py-1">Min Profit / Day ($)</th>
                              <th className="py-1">Max Payout / Cycle ($)</th>
                              <th className="py-1 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle/30 font-mono">
                            {prog.tiers.map((t: any, tIdx: number) => (
                              <tr key={tIdx}>
                                <td className="py-1.5 pr-2">
                                  <input
                                    type="number"
                                    value={t.account_size}
                                    onChange={(e) => {
                                      const updated = [...formData.payout_programs]
                                      updated[progIdx].tiers[tIdx].account_size = Number(e.target.value)
                                      setFormData(prev => ({ ...prev, payout_programs: updated }))
                                    }}
                                    className="w-24 px-2 py-1 bg-bg-base border border-border-subtle rounded text-text-primary text-[10px]"
                                  />
                                </td>
                                <td className="py-1.5 pr-2">
                                  <input
                                    type="number"
                                    value={t.min_profit_per_day}
                                    onChange={(e) => {
                                      const updated = [...formData.payout_programs]
                                      updated[progIdx].tiers[tIdx].min_profit_per_day = Number(e.target.value)
                                      setFormData(prev => ({ ...prev, payout_programs: updated }))
                                    }}
                                    className="w-24 px-2 py-1 bg-bg-base border border-border-subtle rounded text-text-primary text-[10px]"
                                  />
                                </td>
                                <td className="py-1.5 pr-2">
                                  <input
                                    type="number"
                                    value={t.max_payout_per_cycle}
                                    onChange={(e) => {
                                      const updated = [...formData.payout_programs]
                                      updated[progIdx].tiers[tIdx].max_payout_per_cycle = Number(e.target.value)
                                      setFormData(prev => ({ ...prev, payout_programs: updated }))
                                    }}
                                    className="w-24 px-2 py-1 bg-bg-base border border-border-subtle rounded text-text-primary text-[10px]"
                                  />
                                </td>
                                <td className="py-1.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.payout_programs]
                                      updated[progIdx].tiers = updated[progIdx].tiers.filter((_: any, idx: number) => idx !== tIdx)
                                      setFormData(prev => ({ ...prev, payout_programs: updated }))
                                    }}
                                    className="text-red-400 hover:text-red-300 font-bold"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </AFXCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Restricted Countries tab */}
      {activeTab === 'countries' && (
        <div className="space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Restricted Countries Config</h3>
                <p className="text-xs text-text-secondary mt-0.5">Toggle country restrictions. The system fetches flags automatically.</p>
              </div>
              <AFXButton type="button" onClick={handleSubmit} disabled={saving} variant="primary" className="text-xs font-bold">
                {saving ? 'Saving...' : 'Save Exclusions'}
              </AFXButton>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Object.entries({
                CZ: 'Czech Republic', US: 'United States', IL: 'Israel', AE: 'UAE', GB: 'United Kingdom',
                IN: 'India', AU: 'Australia', CY: 'Cyprus', HU: 'Hungary', EU: 'Europe',
                AF: 'Afghanistan', BY: 'Belarus', IR: 'Iran', IQ: 'Iraq', KP: 'North Korea',
                RU: 'Russia', SY: 'Syria', YE: 'Yemen'
              }).map(([code, name]) => {
                const isChecked = formData.restricted_countries.includes(code)
                return (
                  <label
                    key={code}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-red-500/50 bg-red-500/10 text-text-primary'
                        : 'border-border-subtle/50 bg-bg-base/20 text-text-secondary hover:bg-bg-base/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.restricted_countries, code]
                          : formData.restricted_countries.filter(c => c !== code)
                        setFormData(prev => ({ ...prev, restricted_countries: updated }))
                      }}
                      className="hidden"
                    />
                    <img
                      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
                      alt={name}
                      className="w-6 h-4 object-cover rounded"
                    />
                    <span className="text-[10px] font-bold truncate max-w-[80px]">{name}</span>
                  </label>
                )
              })}
            </div>
          </AFXCard>
        </div>
      )}
    </div>
  )
}
