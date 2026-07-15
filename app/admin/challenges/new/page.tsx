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

interface Deal {
  id: string
  code: string
}

export default function NewChallengePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [firms, setFirms] = useState<Firm[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  
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
    is_active: true,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [firmsRes, dealsRes] = await Promise.all([
          fetch('/api/admin/firms'),
          fetch('/api/admin/deals'),
        ])
        if (firmsRes.ok && dealsRes.ok) {
          const firmsData = await firmsRes.json()
          const dealsData = await dealsRes.json()
          const fList = firmsData.data || []
          setFirms(fList)
          setDeals(dealsData.data || [])
          if (fList.length > 0) {
            setFormData((prev) => ({ ...prev, firm_id: fList[0].id }))
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/challenges')
      } else {
        alert('Failed to create challenge')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating challenge')
    } finally {
      setLoading(false)
    }
  }

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
            Add Challenge Package
          </h1>
          <p className="text-text-secondary text-sm">Configure size limits, step bounds, and splits.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <AFXCard className="bg-bg-surface border-border-subtle p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary border-b border-border-subtle/50 pb-2">
              Parameters
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Prop Firm Partner</label>
                <select
                  name="firm_id"
                  value={formData.firm_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none"
                >
                  {firms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Account Size ($)</label>
                <input
                  type="number"
                  name="account_size"
                  value={formData.account_size}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 100000"
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
                  placeholder="e.g. 10"
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
                  placeholder="e.g. 5"
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
                  placeholder="e.g. 5"
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
                  placeholder="e.g. 10"
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
                  placeholder="e.g. 1:1"
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
            disabled={loading}
            variant="primary"
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold flex items-center justify-center gap-2 py-3 rounded-2xl"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Program'}
          </AFXButton>
        </div>
      </form>
    </div>
  )
}
export const dynamic = 'force-dynamic'
