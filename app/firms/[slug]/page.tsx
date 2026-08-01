import React from 'react'
import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFirms, getChallenges } from '@/lib/firebase/server'
import { Star, AlertOctagon } from 'lucide-react'

export const revalidate = 10

const COUNTRY_NAMES: Record<string, string> = {
  CZ: 'Czech Republic', US: 'United States', IL: 'Israel', AE: 'UAE', GB: 'United Kingdom',
  IN: 'India', AU: 'Australia', CY: 'Cyprus', HU: 'Hungary', EU: 'Europe',
  AF: 'Afghanistan', BY: 'Belarus', IR: 'Iran', IQ: 'Iraq', KP: 'North Korea',
  RU: 'Russia', SY: 'Syria', YE: 'Yemen'
}

export default async function FirmOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

  let firm: any = null
  let isFirestoreEmpty = false

  if (snapshot.empty) {
    isFirestoreEmpty = true
    const allMock = await getFirms()
    firm = allMock.find((f: any) => f.slug === slug)
    if (!firm) {
      notFound()
    }
  } else {
    const firmDoc = snapshot.docs[0]
    firm = { id: firmDoc.id, ...firmDoc.data() } as any
  }

  // Fetch challenges for this firm
  const allChallenges = await getChallenges()
  const firmChallenges = allChallenges.filter((c: any) => c.firm_id === firm.id && c.is_active !== false)
  const challengePreview = firmChallenges.slice(0, 3)

  // Fetch similar firms
  const allFirms = await getFirms()
  const relatedFirms = allFirms
    .filter((f: any) => f.type === firm.type && f.id !== firm.id && f.status === 'active')
    .slice(0, 3)

  const isFutures = firm.category?.map((c: string) => c.toLowerCase()).includes('futures')

  const sidebarLinks = [
    { label: 'Firm Overview', id: 'firm-overview' },
    { label: 'Instruments & Assets', id: 'instruments' },
    { label: isFutures ? 'Contract Specs' : 'Leverage', id: 'leverage-specs' },
    { label: 'Commissions', id: 'commissions' },
    { label: 'Consistency Rules', id: 'consistency-rules' },
    { label: 'Firm Rules', id: 'firm-rules' },
    { label: 'Challenges (Preview)', id: 'challenges-preview' },
    { label: 'Payout Policy', id: 'payout-policy' },
    { label: 'Restricted Countries', id: 'restricted-countries' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 1. Left Sidebar Navigation */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-6 bg-bg-surface border border-border-subtle p-5 rounded-2xl space-y-2">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4 font-mono">
            Navigation Sections
          </p>
          <nav className="flex flex-col gap-1.5">
            {sidebarLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-xs font-semibold text-text-secondary hover:text-accent-cyan hover:translate-x-1 transition-all py-1.5 block"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* 2. Main Content Sections */}
      <div className="col-span-1 lg:col-span-3 space-y-12">
        
        {/* Section A: Firm Overview */}
        <section id="firm-overview" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            Firm Overview
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {firm.description || `Welcome to ${firm.name}. Our platform is dedicated to providing high-quality accounts, verified payout models, and raw liquidity connection tools.`}
          </p>
        </section>

        {/* Section B: Instruments & Assets */}
        <section id="instruments" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            Instruments & Assets
          </h2>
          <div className="flex flex-wrap gap-2">
            {(firm.instruments || firm.assets || (isFutures
              ? ['E-mini S&P 500 (ES)', 'E-mini NASDAQ (NQ)', 'E-mini Dow Jones (YM)', 'Crude Oil (CL)', 'Gold (GC)', 'Natural Gas (NG)']
              : ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD (Gold)', 'BTCUSD (Bitcoin)', 'ETHUSD', 'US30 (Dow Jones)']
            )).map((ast: string) => (
              <span key={ast} className="px-3.5 py-1.5 rounded-full bg-bg-base border border-border-subtle/70 text-xs font-bold text-text-primary">
                {ast}
              </span>
            ))}
          </div>
        </section>

        {/* Section C: Leverage & Spec Specifications */}
        <section id="leverage-specs" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            {isFutures ? 'Contract Specifications' : 'Leverage Parameters'}
          </h2>
          {isFutures ? (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-subtle text-text-muted font-bold">
                    <th className="py-2">Contract</th>
                    <th className="py-2">Margin Requirement</th>
                    <th className="py-2 text-right">Tick Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/40 text-text-secondary font-mono">
                  <tr>
                    <td className="py-2 font-bold text-text-primary">ES (S&P 500)</td>
                    <td className="py-2">$50 / Contract</td>
                    <td className="py-2 text-right">$12.50 / 0.25 pt</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-text-primary">NQ (Nasdaq)</td>
                    <td className="py-2">$50 / Contract</td>
                    <td className="py-2 text-right">$5.00 / 0.25 pt</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-text-primary">GC (Gold)</td>
                    <td className="py-2">$100 / Contract</td>
                    <td className="py-2 text-right">$10.00 / 0.10 pt</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-bg-base/40 p-4 rounded-xl border border-border-subtle/50">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Forex Majors</p>
                <p className="text-sm font-black text-accent-cyan font-mono">1:100</p>
              </div>
              <div className="bg-bg-base/40 p-4 rounded-xl border border-border-subtle/50">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Gold & Metals</p>
                <p className="text-sm font-black text-accent-cyan font-mono">1:50</p>
              </div>
              <div className="bg-bg-base/40 p-4 rounded-xl border border-border-subtle/50">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Indices</p>
                <p className="text-sm font-black text-accent-cyan font-mono">1:20</p>
              </div>
              <div className="bg-bg-base/40 p-4 rounded-xl border border-border-subtle/50">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Cryptocurrencies</p>
                <p className="text-sm font-black text-accent-cyan font-mono">1:2</p>
              </div>
            </div>
          )}
        </section>

        {/* Section D: Commissions */}
        <section id="commissions" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            Commissions & Fees
          </h2>
          {firm.commissions_text ? (
            <div
              className="prose prose-invert max-w-none text-text-secondary text-sm prose-sm"
              dangerouslySetInnerHTML={{ __html: firm.commissions_text }}
            />
          ) : (
            <>
              <p className="text-text-secondary text-sm leading-relaxed">
                Standard Raw spreads apply. Commissions vary per execution platform model:
              </p>
              <ul className="list-disc pl-5 text-xs text-text-secondary space-y-1">
                <li><strong>cTrader:</strong> $3.00 per side per 100k traded.</li>
                <li><strong>MT5 (Raw Account):</strong> $3.50 per lot commission.</li>
                <li><strong>Futures (Rithmic/Tradovate):</strong> standard clearing fees plus platform execution costs.</li>
              </ul>
            </>
          )}
        </section>

        {/* Section E: Consistency Rules */}
        <section id="consistency-rules" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            Consistency Rules
          </h2>
          <div
            className="prose prose-invert max-w-none text-text-secondary text-sm prose-sm"
            dangerouslySetInnerHTML={{ __html: firm.consistency_rules_content }}
          />
        </section>

        {/* Section F: Firm Rules */}
        <section id="firm-rules" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            General Firm Rules
          </h2>
          <div
            className="prose prose-invert max-w-none text-text-secondary text-sm prose-sm"
            dangerouslySetInnerHTML={{ __html: firm.firm_rules_content }}
          />
        </section>

        {/* Section G: Challenges Preview */}
        <section id="challenges-preview" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
            <h2 className="text-xl font-bold text-text-primary">
              Evaluation Packages
            </h2>
            <Link
              href={`/firms/${slug}/challenges`}
              className="text-xs font-bold text-accent-cyan hover:underline"
            >
              View All Challenges &rarr;
            </Link>
          </div>

          {challengePreview.length === 0 ? (
            <p className="text-xs text-text-muted">No active evaluation packages found for this firm.</p>
          ) : (
            <div className="space-y-3.5">
              {challengePreview.map((ch: any) => (
                <div key={ch.id} className="flex justify-between items-center bg-bg-base/40 border border-border-subtle/60 p-4 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-extrabold text-text-primary">${(ch.account_size || 0).toLocaleString()} Challenge</h4>
                    <p className="text-[10px] text-text-muted font-bold font-mono mt-0.5">{ch.steps}-step evaluation • Profit split: {ch.profit_split_percent || ch.profit_split_pct || 80}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-accent-cyan font-mono">${ch.price}</p>
                    <Link
                      href={`/firms/${slug}/challenges`}
                      className="text-[10px] font-bold text-text-muted hover:text-text-primary transition-colors underline"
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section H: Payout Policy & Tiers */}
        <section id="payout-policy" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-8">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2">
            Payout Policy & Limit Tiers
          </h2>

          {firm.payout_programs?.map((prog: any) => (
            <div key={prog.id} className="space-y-4 border border-border-subtle/40 p-5 rounded-2xl bg-bg-base/30">
              <h3 className="text-base font-black text-text-primary flex items-center gap-2">
                <span className="w-1.5 h-3 rounded-full bg-accent-cyan" />
                {prog.program_name} Program
              </h3>
              <ul className="list-disc pl-5 text-xs text-text-secondary space-y-1">
                <li><strong>Minimum Payout Request:</strong> ${prog.minimum_payout}</li>
                <li><strong>Payout Frequency Cycle:</strong> Every {prog.payout_frequency_days} Days</li>
              </ul>

              <div
                className="text-xs text-text-secondary leading-relaxed bg-bg-base/40 p-3 rounded-xl border border-border-subtle/30"
                dangerouslySetInnerHTML={{ __html: prog.trading_days_rule_content }}
              />

              {prog.tiers && prog.tiers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="text-xs font-black text-text-primary mb-2">Trading Days with Profit</h4>
                    <div className="overflow-hidden border border-border-subtle rounded-xl text-[10px]">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-bg-base/50 text-text-muted border-b border-border-subtle">
                            <th className="py-2 px-3 font-semibold">Account Size</th>
                            <th className="py-2 px-3 font-semibold text-right">Min Profit/Day</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle/50 font-mono">
                          {prog.tiers.map((t: any, idx: number) => (
                            <tr key={idx} className="hover:bg-bg-base/20">
                              <td className="py-2 px-3 text-text-primary">${(t.account_size || 0).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right text-accent-cyan">${t.min_profit_per_day || '0'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-text-primary mb-2">Maximum Payout limits per Cycle</h4>
                    <div className="overflow-hidden border border-border-subtle rounded-xl text-[10px]">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-bg-base/50 text-text-muted border-b border-border-subtle">
                            <th className="py-2 px-3 font-semibold">Account Size</th>
                            <th className="py-2 px-3 font-semibold text-right">Max Payout/Cycle</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle/50 font-mono">
                          {prog.tiers.map((t: any, idx: number) => (
                            <tr key={idx} className="hover:bg-bg-base/20">
                              <td className="py-2 px-3 text-text-primary">${(t.account_size || 0).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right text-accent-cyan">
                                {t.max_payout_per_cycle ? `$${t.max_payout_per_cycle.toLocaleString()}` : 'Unlimited'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Section I: Restricted Countries */}
        <section id="restricted-countries" className="scroll-mt-6 bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-border-subtle/50 pb-2 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            Restricted Countries
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Residents or citizens from the following jurisdictions are restricted from purchasing evaluations or managing mock-funded portfolios:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {firm.restricted_countries?.map((code: string) => (
              <div key={code} className="flex items-center gap-2.5 p-2 bg-bg-base/40 border border-border-subtle/40 rounded-xl">
                <img
                  src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
                  alt={COUNTRY_NAMES[code] || code}
                  className="w-6 h-4 object-cover rounded shadow-sm border border-border-subtle/50"
                  onError={(e) => {
                    // Fallback to text box if flag fails
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <span className="text-xs font-bold text-text-secondary font-sans truncate">
                  {COUNTRY_NAMES[code] || code}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Similar Firms Recommendation */}
        {relatedFirms.length > 0 && (
          <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Similar Firms You May Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedFirms.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/firms/${related.slug}`}
                  className="block p-4 bg-bg-base/40 border border-border-subtle/50 rounded-2xl hover:border-accent-cyan/30 transition-all hover:bg-bg-base/80"
                >
                  <p className="text-text-primary font-black text-sm">{related.name}</p>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <div className="flex text-accent-yellow">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(related.rating || 4)
                              ? 'fill-current text-accent-yellow'
                              : 'text-text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-text-muted text-[10px] font-mono font-semibold">
                      ({related.review_count || 0} reviews)
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
