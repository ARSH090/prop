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
  category?: string[]
  logo_url?: string
}

interface Deal {
  id: string
  code: string
  discount_label?: string
}

export default function EditChallengePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [firms, setFirms] = useState<Firm[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    firm_id: '',
    account_size: '',
    steps: '2',
    profit_target_p1: '',
    profit_target_p2: '',
    daily_loss_pct: '',
    max_loss_pct: '',
    pt_dd_ratio: '1:1',
    profit_split_pct: '80',
    payout_freq: 'Bi-weekly',
    loyalty_points: '',
    price: '',
    original_price: '',
    currency: 'USD',
    deal_id: '',
    affiliate_url: '',
    logo_url: '',
    is_active: true,
    activation_fee: '',
    max_contract_size_minis: '',
    max_contract_size_micros: '',
    profit_target: '',
    max_loss: '',
    max_loss_type: 'eod_trailing',
    max_payout_amount: '',
    min_payout_threshold: '',
    consistency_eval_percent: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, dealsRes, chRes] = await Promise.all([
          fetch('/api/admin/firms'),
          fetch('/api/admin/deals'),
          fetch(`/api/admin/challenges/${id}`),
        ])
        if (firmsRes.ok && dealsRes.ok && chRes.ok) {
          const firmsData = await firmsRes.json()
          const dealsData = await dealsRes.json()
          const chData = await chRes.json()
          
          setFirms(firmsData.data || [])
          setDeals(dealsData.data || [])

          setFormData({
            firm_id: chData.firm_id || '',
            account_size: chData.account_size ? String(chData.account_size) : '',
            steps: chData.steps ? String(chData.steps) : '2',
            profit_target_p1: chData.profit_target_p1 ? String(chData.profit_target_p1) : '',
            profit_target_p2: chData.profit_target_p2 ? String(chData.profit_target_p2) : '',
            daily_loss_pct: chData.daily_loss_pct ? String(chData.daily_loss_pct) : '',
            max_loss_pct: chData.max_loss_pct ? String(chData.max_loss_pct) : '',
            pt_dd_ratio: chData.pt_dd_ratio || '1:1',
            profit_split_pct: chData.profit_split_pct ? String(chData.profit_split_pct) : '80',
            payout_freq: chData.payout_freq || 'Bi-weekly',
            loyalty_points: chData.loyalty_points ? String(chData.loyalty_points) : '',
            price: chData.price ? String(chData.price) : '',
            original_price: chData.original_price ? String(chData.original_price) : '',
            currency: chData.currency || 'USD',
            deal_id: chData.deal_id || '',
            affiliate_url: chData.affiliate_url || '',
            logo_url: chData.logo_url || '',
            is_active: chData.is_active !== false,
            activation_fee: chData.activation_fee || '',
            max_contract_size_minis: chData.max_contract_size_minis ? String(chData.max_contract_size_minis) : '',
            max_contract_size_micros: chData.max_contract_size_micros ? String(chData.max_contract_size_micros) : '',
            profit_target: chData.profit_target ? String(chData.profit_target) : '',
            max_loss: chData.max_loss ? String(chData.max_loss) : '',
            max_loss_type: chData.max_loss_type || 'eod_trailing',
            max_payout_amount: chData.max_payout_amount ? String(chData.max_payout_amount) : '',
            min_payout_threshold: chData.min_payout_threshold ? String(chData.min_payout_threshold) : '',
            consistency_eval_percent: chData.consistency_eval_percent ? String(chData.consistency_eval_percent) : '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Numeric validations
    const accountSizeNum = Number(formData.account_size)
    const priceNum = Number(formData.price)
    const originalPriceNum = formData.original_price ? Number(formData.original_price) : priceNum
    const p1TargetNum = Number(formData.profit_target_p1 || 0)
    const p2TargetNum = Number(formData.profit_target_p2 || 0)
    const dailyLossNum = Number(formData.daily_loss_pct || 0)
    const maxLossNum = Number(formData.max_loss_pct || 0)

    if (accountSizeNum <= 0) {
      alert('Account size must be a positive number!')
      return
    }
    if (priceNum < 0 || originalPriceNum < 0) {
      alert('Price values cannot be negative!')
      return
    }
    if (p1TargetNum < 0 || p2TargetNum < 0 || dailyLossNum < 0 || maxLossNum < 0) {
      alert('Metric targets/limits cannot be negative!')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/challenges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/challenges')
      } else {
        alert('Failed to update challenge')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating challenge')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-text-secondary">Loading details...</div>
  }

  const selectedFirm = firms.find(f => f.id === formData.firm_id)
  const isFutures = selectedFirm?.category?.map(c => c.toLowerCase()).includes('futures')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/challenges"
          className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Edit Challenge Parameters
          </h1>
          <p className="text-text-secondary text-sm">Update step rules, drawdown limits, or pricing attributes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
              Parameters
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <label className="text-xs font-semibold text-text-secondary">Prop Firm Partner</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search partner firm..."
                    value={searchTerm || (firms.find(f => f.id === formData.firm_id)?.name || '')}
                    onFocus={() => {
                      setShowDropdown(true)
                      setSearchTerm('')
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none"
                  />
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border-subtle bg-bg-surface shadow-2xl z-50 py-1">
                      {firms
                        .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, firm_id: f.id }))
                              setSearchTerm(f.name)
                              setShowDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-accent-cyan/10 transition-colors flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded bg-white border border-border-subtle flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                              {f.logo_url ? (
                                <img src={f.logo_url} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-[10px] font-bold text-accent-cyan">{f.name[0]}</span>
                              )}
                            </div>
                            <span>{f.name}</span>
                          </button>
                        ))
                      }
                      {firms.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <p className="text-xs text-text-secondary p-3 text-center">No firms found</p>
                      )}
                    </div>
                  )}
                </div>
                {showDropdown && (
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                )}
                
                {/* Visual Live Preview of Selected Partner */}
                {formData.firm_id && (
                  <div className="mt-2 p-2.5 rounded-xl bg-bg-base/50 border border-border-subtle/50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-border-subtle flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                      {firms.find(f => f.id === formData.firm_id)?.logo_url ? (
                        <img 
                          src={firms.find(f => f.id === formData.firm_id)?.logo_url || ''} 
                          alt="" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold text-accent-cyan">
                          {firms.find(f => f.id === formData.firm_id)?.name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Partner Preview</p>
                      <p className="text-xs font-black text-text-primary">
                        {firms.find(f => f.id === formData.firm_id)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Account Size ($)</label>
                <input
                  type="number"
                  name="account_size"
                  value={formData.account_size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Steps Structures</label>
                <select
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none"
                >
                  <option value="0">Instant (0 Step)</option>
                  <option value="1">1-Step</option>
                  <option value="2">2-Step</option>
                  <option value="3">3-Step</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">P1 Target (%)</label>
                <input
                  type="number"
                  name="profit_target_p1"
                  value={formData.profit_target_p1}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">P2 Target (%)</label>
                <input
                  type="number"
                  name="profit_target_p2"
                  value={formData.profit_target_p2}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Daily Loss (%)</label>
                <input
                  type="number"
                  name="daily_loss_pct"
                  value={formData.daily_loss_pct}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Max Loss (%)</label>
                <input
                  type="number"
                  name="max_loss_pct"
                  value={formData.max_loss_pct}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">PT:DD Ratio</label>
                <input
                  type="text"
                  name="pt_dd_ratio"
                  value={formData.pt_dd_ratio}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Profit Split (%)</label>
                <input
                  type="number"
                  name="profit_split_pct"
                  value={formData.profit_split_pct}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Payout Frequency</label>
                <input
                  type="text"
                  name="payout_freq"
                  value={formData.payout_freq}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Loyalty PTS</label>
                <input
                  type="number"
                  name="loyalty_points"
                  value={formData.loyalty_points}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                />
              </div>
            </div>

            {isFutures && (
              <div className="space-y-4 pt-4 border-t border-border-subtle/50">
                <h4 className="text-xs font-black text-accent-cyan uppercase tracking-wider">Futures Specifications</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Activation Fee ($)</label>
                    <input
                      type="text"
                      name="activation_fee"
                      value={formData.activation_fee || ''}
                      onChange={handleChange}
                      placeholder="e.g. None, or 150"
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Max Minis Contracts</label>
                    <input
                      type="number"
                      name="max_contract_size_minis"
                      value={formData.max_contract_size_minis || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Max Micros Contracts</label>
                    <input
                      type="number"
                      name="max_contract_size_micros"
                      value={formData.max_contract_size_micros || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Profit Target ($)</label>
                    <input
                      type="number"
                      name="profit_target"
                      value={formData.profit_target || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Max Drawdown ($)</label>
                    <input
                      type="number"
                      name="max_loss"
                      value={formData.max_loss || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Max Loss Type</label>
                    <select
                      name="max_loss_type"
                      value={formData.max_loss_type || 'eod_trailing'}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none"
                    >
                      <option value="eod_trailing">EOD Trailing</option>
                      <option value="intraday_trailing">Intraday Trailing</option>
                      <option value="static">Static</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Max Payout Amount ($)</label>
                    <input
                      type="number"
                      name="max_payout_amount"
                      value={formData.max_payout_amount || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Min Payout Threshold ($)</label>
                    <input
                      type="number"
                      name="min_payout_threshold"
                      value={formData.min_payout_threshold || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary">Consistency Eval (%)</label>
                    <input
                      type="number"
                      name="consistency_eval_percent"
                      value={formData.consistency_eval_percent || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border-subtle/50">
              <label className="text-xs font-semibold text-text-secondary">Custom Challenge Logo Override (Optional)</label>
              <div className="flex gap-4 items-start">
                {formData.logo_url && (
                  <div className="relative w-12 h-12 rounded-lg bg-bg-base border border-border-subtle overflow-hidden flex items-center justify-center p-1.5 group shrink-0">
                    <img 
                      src={formData.logo_url} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold text-[10px] transition-opacity"
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
                      <span className="text-xs text-accent-cyan font-mono animate-pulse">Uploading file...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AFXCard>
        </div>

        <div className="space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
              Pricing & Code
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Actual Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Strikethrough Price ($)</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Linked Discount Deal</label>
                <select
                  name="deal_id"
                  value={formData.deal_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan"
                >
                  <option value="">No Coupon Linked</option>
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} ({d.discount_label})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Affiliate Link Override</label>
                <input
                  type="text"
                  name="affiliate_url"
                  value={formData.affiliate_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-bg-base border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan font-mono"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle bg-bg-base text-accent-cyan focus:ring-0"
                />
                <span className="text-xs font-semibold text-text-primary">Publish Active</span>
              </label>
            </div>
          </AFXCard>

          <AFXButton
            type="submit"
            disabled={saving}
            variant="primary"
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-2xl"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Parameters'}
          </AFXButton>
        </div>
      </form>
    </div>
  )
}
export const dynamic = 'force-dynamic'
