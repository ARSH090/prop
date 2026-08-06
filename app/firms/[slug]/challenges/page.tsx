import React from 'react'
import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFirms, getChallenges } from '@/lib/firebase/server'

export const revalidate = 10

export default async function FirmChallengesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

  let firm: any = null
  if (snapshot.empty) {
    const allMock = await getFirms()
    firm = allMock.find((f: any) => f.slug === slug)
    if (!firm) {
      notFound()
    }
  } else {
    const firmDoc = snapshot.docs[0]
    firm = { id: firmDoc.id, ...firmDoc.data() } as any
  }

  // Fetch challenges
  const allChallenges = await getChallenges()
  const challenges = allChallenges.filter((c: any) => c.firm_id === firm.id && c.is_active !== false)

  const isFutures = firm.category?.map((c: string) => c.toLowerCase()).includes('futures')

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Evaluation Challenge Packages</h2>
        <p className="text-xs text-text-secondary mt-1">Select and compare challenge sizes, drawdown structures, and split margins.</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-subtle rounded-2xl text-text-muted text-sm">
          No challenges found for {firm.name}.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted uppercase text-[10px] font-black tracking-wider">
                <th className="py-3.5 px-3">Account Size</th>
                <th className="py-3.5 px-3">Steps</th>
                {isFutures ? (
                  <>
                    <th className="py-3.5 px-3">Activation Fee</th>
                    <th className="py-3.5 px-3">Max Contracts (Minis/Micros)</th>
                    <th className="py-3.5 px-3">Profit Target</th>
                    <th className="py-3.5 px-3">Max Loss (Type)</th>
                    <th className="py-3.5 px-3">Max Payout</th>
                    <th className="py-3.5 px-3">Consistency Eval</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-3">Profit Target (P1/P2)</th>
                    <th className="py-3.5 px-3">Daily / Max Loss</th>
                  </>
                )}
                <th className="py-3.5 px-3">Profit Split</th>
                <th className="py-3.5 px-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/30 font-mono text-text-secondary">
              {challenges.map((ch: any) => (
                <tr key={ch.id} className="hover:bg-bg-base/30 transition-colors">
                  {/* Account Size */}
                  <td className="py-4 px-3 font-bold text-text-primary text-sm">
                    ${(ch.account_size || 0).toLocaleString()}
                  </td>

                  {/* Steps */}
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-[10px] font-black">
                      {ch.steps}-Step
                    </span>
                  </td>

                  {isFutures ? (
                    <>
                      {/* Futures fields */}
                      <td className="py-4 px-3 text-accent-green">{ch.activation_fee || 'None'}</td>
                      <td className="py-4 px-3">{ch.max_contract_size_minis} Minis / {ch.max_contract_size_micros} Micros</td>
                      <td className="py-4 px-3 font-bold">${(ch.profit_target || 0).toLocaleString()}</td>
                      <td className="py-4 px-3">
                        <span className="font-bold">${(ch.max_loss || 0).toLocaleString()}</span>
                        <span className="text-[10px] text-text-muted ml-1.5 uppercase font-sans">({ch.max_loss_type?.replace('_', ' ') || 'Trailing'})</span>
                      </td>
                      <td className="py-4 px-3">${(ch.max_payout_amount || 15000).toLocaleString()}</td>
                      <td className="py-4 px-3">{ch.consistency_eval_percent || 40}%</td>
                    </>
                  ) : (
                    <>
                      {/* Forex fields */}
                      <td className="py-4 px-3">
                        {ch.profit_target_p1}% / {ch.steps > 1 ? `${ch.profit_target_p2}%` : '—'}
                      </td>
                      <td className="py-4 px-3">
                        {ch.daily_loss_pct}% / {ch.max_loss_pct}%
                      </td>
                    </>
                  )}

                  {/* Profit Split */}
                  <td className="py-4 px-3 font-bold text-text-primary">
                    {ch.profit_split_percent || ch.profit_split_pct || 80}%
                  </td>

                  {/* Price */}
                  <td className="py-4 px-3 text-right">
                    <span className="text-sm font-black text-accent-cyan">${ch.price}</span>
                    {ch.original_price > ch.price && (
                      <span className="text-[10px] text-text-muted line-through block font-medium font-sans">${ch.original_price}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
