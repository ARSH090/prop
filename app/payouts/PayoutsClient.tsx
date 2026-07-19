'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import {
  CheckCircle, ShieldCheck, DollarSign, Filter, Upload,
  MapPin, TrendingUp, Star, X, Send, Globe2, Tag
} from 'lucide-react'
import { auth } from '@/lib/firebase/client'

interface Payout {
  id: string
  firm_id: string
  trader_display_name: string
  amount: number
  currency?: string
  proof_image_url?: string
  payout_date: any
  is_verified?: boolean
  region?: string
  account_size?: string
  payout_method?: string
  concept?: string
}

interface Firm {
  id: string
  name: string
  logo_url?: string
}

const REGIONS = ['All Regions', 'India', 'UAE', 'Singapore', 'North America', 'Europe', 'Asia', 'Global']
const CONCEPTS = ['All Concepts', 'ICT / SMC', 'Price Action', 'Scalping', 'Swing Trading', 'Grid', 'EA / Bot', 'News Trading']
const REGION_FLAGS: Record<string, string> = {
  'India': '🇮🇳', 'UAE': '🇦🇪', 'Singapore': '🇸🇬',
  'North America': '🌎', 'Europe': '🌍', 'Asia': '🌏', 'Global': '🌐',
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface PayoutsClientProps {
  initialPayouts: Payout[]
  firms: Firm[]
}

export default function PayoutsClient({ initialPayouts, firms }: PayoutsClientProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filterFirm, setFilterFirm] = useState('all')
  const [filterRegion, setFilterRegion] = useState('All Regions')
  const [filterConcept, setFilterConcept] = useState('All Concepts')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitForm, setSubmitForm] = useState({
    trader_display_name: '',
    firm_id: firms[0]?.id || '',
    amount: '',
    region: 'India',
    account_size: '50K',
    payout_method: 'Bank Transfer',
    concept: 'ICT / SMC',
    proof_image_url: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => setCurrentUser(user))
    return unsub
  }, [])

  // Filters
  const filtered = useMemo(() => {
    return initialPayouts.filter((p) => {
      const firmOk = filterFirm === 'all' || p.firm_id === filterFirm
      const regionOk = filterRegion === 'All Regions' || p.region === filterRegion
      const conceptOk = filterConcept === 'All Concepts' || p.concept === filterConcept
      return firmOk && regionOk && conceptOk
    })
  }, [initialPayouts, filterFirm, filterRegion, filterConcept])

  // Best performing regions
  const regionStats = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {}
    initialPayouts.forEach((p) => {
      const r = p.region || 'Global'
      if (!map[r]) map[r] = { count: 0, total: 0 }
      map[r].count++
      map[r].total += p.amount
    })
    return Object.entries(map)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
  }, [initialPayouts])

  const getFirmName = (firmId: string) => firms.find((f) => f.id === firmId)?.name || 'Prop Firm'

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submitForm,
          amount: parseFloat(submitForm.amount),
          user_id: currentUser.uid,
          is_verified: false,
          status: 'pending',
        }),
      })
      if (res.ok) {
        setSubmitSuccess(true)
        setTimeout(() => { setSubmitSuccess(false); setShowSubmitModal(false) }, 3000)
      } else {
        alert('Submission failed — please try again.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Best Performing Regions */}
      {regionStats.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-accent-cyan" />
            Best Performing Regions
          </h2>
          <div className="flex flex-wrap gap-3">
            {regionStats.map(([region, stats]) => (
              <button
                key={region}
                onClick={() => setFilterRegion(region === filterRegion ? 'All Regions' : region)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  filterRegion === region
                    ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan neon-border-cyan'
                    : 'bg-bg-surface border-border-subtle text-text-secondary hover:border-accent-cyan/30 hover:text-text-primary'
                }`}
              >
                <span className="text-lg">{REGION_FLAGS[region] || '🌐'}</span>
                <span>{region}</span>
                <span className="text-[10px] font-mono text-text-muted">{stats.count} payouts</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Filter className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider">Filters:</span>
        </div>

        {/* Firm filter */}
        <select value={filterFirm} onChange={(e) => setFilterFirm(e.target.value)}
          className="px-3 py-2 text-xs bg-bg-surface border border-border-subtle rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none">
          <option value="all">All Firms</option>
          {firms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>

        {/* Region filter */}
        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
          className="px-3 py-2 text-xs bg-bg-surface border border-border-subtle rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none">
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>

        {/* Concept filter */}
        <select value={filterConcept} onChange={(e) => setFilterConcept(e.target.value)}
          className="px-3 py-2 text-xs bg-bg-surface border border-border-subtle rounded-xl text-text-primary focus:border-accent-cyan focus:outline-none">
          {CONCEPTS.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Reset */}
        {(filterFirm !== 'all' || filterRegion !== 'All Regions' || filterConcept !== 'All Concepts') && (
          <button onClick={() => { setFilterFirm('all'); setFilterRegion('All Regions'); setFilterConcept('All Concepts') }}
            className="text-xs text-text-muted hover:text-text-primary underline">
            Reset
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-text-muted font-mono">{filtered.length} proofs</span>
          {currentUser ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
            >
              <Upload className="w-3.5 h-3.5" />
              Submit Your Proof
            </button>
          ) : (
            <a href="/auth/sign-in"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-border-subtle text-text-muted hover:text-accent-cyan hover:border-accent-cyan/40 transition-all">
              Sign in to Submit
            </a>
          )}
        </div>
      </div>

      {/* Payout Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((payout) => {
            const dateStr = payout.payout_date
              ? new Date(
                  payout.payout_date.seconds ? payout.payout_date.seconds * 1000 : payout.payout_date
                ).toLocaleDateString('en-US')
              : 'Recent'
            return (
              <AFXCard
                key={payout.id}
                className="bg-bg-surface border border-border-subtle p-5 flex flex-col justify-between hover:border-accent-cyan/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all duration-300 overflow-hidden group"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle/50">
                    <div>
                      <p className="font-bold text-text-primary text-sm">{payout.trader_display_name}</p>
                      <p className="text-[10px] text-accent-cyan font-mono uppercase tracking-wider font-bold">
                        {getFirmName(payout.firm_id)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20 text-[9px] font-bold uppercase tracking-wider font-mono">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="bg-bg-base/40 p-4 rounded-xl text-center border border-border-subtle/50">
                    <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest font-mono mb-1">Payout Amount</p>
                    <p className="text-2xl font-extrabold text-accent-green font-mono flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-accent-green" />
                      {payout.amount.toLocaleString('en-US')}
                    </p>
                  </div>

                  {/* Meta tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {payout.region && (
                      <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-bg-base border border-border-subtle text-text-muted font-mono">
                        <MapPin className="w-2.5 h-2.5" />
                        {payout.region}
                      </span>
                    )}
                    {payout.account_size && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-accent-purple/10 border border-accent-purple/20 text-accent-purple font-mono font-bold">
                        {payout.account_size}
                      </span>
                    )}
                    {payout.concept && (
                      <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-mono">
                        <Tag className="w-2.5 h-2.5" />
                        {payout.concept}
                      </span>
                    )}
                  </div>

                  {/* Proof Image */}
                  {payout.proof_image_url && (
                    <div className="h-40 rounded-lg overflow-hidden border border-border-subtle/50 bg-bg-base group-hover:border-accent-cyan/20 transition-colors">
                      <img
                        src={payout.proof_image_url}
                        alt="Payout receipt confirmation"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border-subtle/50 mt-4 flex justify-between items-center text-[10px] text-text-muted font-mono">
                  <span>Receipt audited ✓</span>
                  <span>{dateStr}</span>
                </div>
              </AFXCard>
            )
          })}
        </div>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <ShieldCheck className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary text-sm font-semibold">No payout proofs match the current filters.</p>
          <button onClick={() => { setFilterFirm('all'); setFilterRegion('All Regions'); setFilterConcept('All Concepts') }}
            className="mt-3 text-accent-cyan text-xs underline hover:no-underline">
            Clear all filters
          </button>
        </div>
      )}

      {/* Submit Proof Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm">
          <AFXCard className="w-full max-w-lg bg-bg-surface border border-border-subtle p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Submit Payout Proof</h2>
                <p className="text-xs text-text-muted mt-0.5">Your submission will be reviewed before appearing publicly.</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-muted hover:text-text-primary transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-12 h-12 text-accent-green mx-auto" />
                <p className="font-bold text-text-primary">Submitted Successfully!</p>
                <p className="text-xs text-text-muted">Our team will verify your proof and publish it shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Display Name</label>
                    <input type="text" required value={submitForm.trader_display_name}
                      onChange={(e) => setSubmitForm((p) => ({ ...p, trader_display_name: e.target.value }))}
                      placeholder="e.g. Rahul S."
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Payout Amount ($)</label>
                    <input type="number" required min="1" value={submitForm.amount}
                      onChange={(e) => setSubmitForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="e.g. 3250"
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Prop Firm</label>
                    <select value={submitForm.firm_id} onChange={(e) => setSubmitForm((p) => ({ ...p, firm_id: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none">
                      {firms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Region</label>
                    <select value={submitForm.region} onChange={(e) => setSubmitForm((p) => ({ ...p, region: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none">
                      {REGIONS.slice(1).map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Account Size</label>
                    <select value={submitForm.account_size} onChange={(e) => setSubmitForm((p) => ({ ...p, account_size: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none">
                      {['10K', '25K', '50K', '100K', '150K', '200K', '400K'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Method</label>
                    <select value={submitForm.payout_method} onChange={(e) => setSubmitForm((p) => ({ ...p, payout_method: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none">
                      {['Bank Transfer', 'Wire Transfer', 'Crypto', 'PayPal', 'Other'].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Concept</label>
                    <select value={submitForm.concept} onChange={(e) => setSubmitForm((p) => ({ ...p, concept: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none">
                      {CONCEPTS.slice(1).map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">Proof Image URL (screenshot)</label>
                  <input type="url" value={submitForm.proof_image_url}
                    onChange={(e) => setSubmitForm((p) => ({ ...p, proof_image_url: e.target.value }))}
                    placeholder="https://... (link to payout screenshot)"
                    className="w-full px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-xs focus:border-accent-cyan focus:outline-none" />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-border-subtle">
                  <p className="text-[10px] text-text-muted">Proofs require admin verification before being shown publicly.</p>
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base hover:opacity-90 transition-all disabled:opacity-50 shrink-0">
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Submit Proof'}
                  </button>
                </div>
              </form>
            )}
          </AFXCard>
        </div>
      )}
    </div>
  )
}
