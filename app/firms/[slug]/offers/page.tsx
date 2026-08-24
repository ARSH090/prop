import React from 'react'
import { notFound } from 'next/navigation'
import { getFirms, getDeals, getChallenges } from '@/lib/firebase/server'
import { CopyButton } from '@/components/ui/copy-button'
import { Tag, Award } from 'lucide-react'
import { ChallengeListingTable } from '@/components/challenges/ChallengeListingTable'

export const revalidate = 10

export default async function FirmOffersPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  // Fetch all data in parallel using serialized server fetchers
  const [allFirms, allDeals, allChallenges] = await Promise.all([
    getFirms(),
    getDeals(),
    getChallenges(),
  ])

  const firm = allFirms.find((f: any) => f.slug === slug || f.id === slug)
  if (!firm) {
    notFound()
  }

  const firmDeals = allDeals.filter((d: any) => d.firm_id === firm.id && d.status === 'active')
  const firmChallenges = allChallenges.filter((c: any) => c.firm_id === firm.id && c.is_active !== false)

  // Ensure plain serializable objects are passed to Client Components
  const serializedFirm = JSON.parse(JSON.stringify(firm))
  const serializedDeals = JSON.parse(JSON.stringify(firmDeals))
  const serializedChallenges = JSON.parse(JSON.stringify(firmChallenges))

  return (
    <div id="offers" className="space-y-8 animate-fade-in">
      {/* 1. Active Promo Codes & Discounts Header */}
      <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10.5px] font-black uppercase tracking-wider font-chunky-num">
                Exclusive Deals
              </span>
              <span className="px-3.5 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 text-cyan-300 text-[10.5px] font-black uppercase tracking-wider font-chunky-num">
                Verified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 afx-gradient-heading font-chunky-num">
              <Tag className="w-6 h-6 text-accent-cyan" />
              {serializedFirm.name} Active Special Offers & Promo Codes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
              Copy verified promo codes below and apply them to get instant discounts on challenge purchases.
            </p>
          </div>
        </div>

        {serializedDeals.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border-subtle rounded-2xl text-slate-300 text-sm bg-bg-base/30 font-semibold">
            No active discount deals or coupon codes currently configured for {serializedFirm.name}. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serializedDeals.map((deal: any) => (
              <div
                key={deal.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/15 via-[#1a1324] to-[#12131a] border-2 border-pink-500/40 shadow-lg shadow-pink-500/10 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-pink-500/70 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1 text-[11px] font-black rounded-lg bg-pink-500/25 border border-pink-500/50 text-[#ff77ce] tracking-wider uppercase font-chunky-num">
                      {deal.discount_label || deal.tag || 'SPECIAL OFFER'}
                    </span>
                    {deal.tag && deal.tag !== deal.discount_label && (
                      <span className="px-3 py-0.5 text-[10px] font-black rounded-full bg-accent-cyan/20 border border-accent-cyan/50 text-cyan-300 uppercase font-chunky-num">
                        {deal.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-white text-base leading-snug font-chunky-num">{deal.title}</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">{deal.description}</p>
                  {deal.discord_code && (
                    <p className="text-[11px] text-pink-300 font-mono font-bold">
                      ℹ️ {deal.discord_code}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-pink-500/40 bg-[#0e0a16] text-text-primary text-xs font-mono font-bold flex-grow select-all">
                    <span className="text-white font-black">{deal.code}</span>
                    <CopyButton text={deal.code} />
                  </div>
                  <a
                    href={deal.affiliate_url || serializedFirm.affiliate_url || serializedFirm.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-textured-cta px-4 py-2.5 rounded-xl text-black font-black text-xs text-center transition-all shrink-0 font-chunky-num shadow-md"
                  >
                    Claim &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Unified Account/Challenge Listing Table (Matches Challenges Page Exactly) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 font-chunky-num">
              <Award className="w-5 h-5 text-accent-cyan" />
              Available Challenge Packages for {serializedFirm.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">
              Select your preferred account size, review evaluation parameters, copy the code, and purchase directly.
            </p>
          </div>
          <span className="text-xs font-black text-slate-300 font-chunky-num">
            Total Accounts: <span className="text-accent-cyan">{serializedChallenges.length}</span>
          </span>
        </div>

        <ChallengeListingTable
          challenges={serializedChallenges}
          firms={[serializedFirm]}
          deals={serializedDeals}
          activeFirm={serializedFirm}
          showRankBorders={false}
        />
      </div>
    </div>
  )
}
