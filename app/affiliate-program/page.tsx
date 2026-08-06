import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { DollarSign, ShieldAlert, Award, Share2, Users, Coins } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Affiliate & Referral Program - ANURAJ FX',
  description: 'Join the Anuraj FX partner network and earn 15% revenue share on referred trader signups and challenge comparisons.',
}

export const dynamic = 'force-dynamic'

export default async function AffiliateProgramPage() {
  const content = await getSiteContent('affiliate_program')
  const headline = content.headline || 'Affiliate Referral Program'

  const features = [
    {
      title: '15% Flat Commission',
      desc: 'Receive 15% of all evaluation commissions generated when traders purchase challenges through your unique codes or tracking links.',
      icon: DollarSign,
      color: 'text-accent-cyan'
    },
    {
      title: 'Advanced Analytics',
      desc: 'Track clicks, referrals, conversions, and accrued payouts in real-time on your personalized partner dashboard.',
      icon: Share2,
      color: 'text-accent-blue'
    },
    {
      title: 'Reliable Payouts',
      desc: 'Withdraw your accumulated earnings directly to your bank account, crypto wallet, or payout card every single month.',
      icon: Coins,
      color: 'text-accent-purple'
    }
  ]

  const tiers = [
    { tier: 'Bronze Partner', range: '1-10 Referrals', split: '10% Share', bonus: 'Standard Perks' },
    { tier: 'Gold Partner (Popular)', range: '11-50 Referrals', split: '15% Share', bonus: 'Exclusive Coupons' },
    { tier: 'Emperor VIP', range: '51+ Referrals', split: '20% Share', bonus: 'Dedicated Account Manager' }
  ]

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-grow space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/25 text-[10px] font-bold text-accent-purple uppercase tracking-widest font-mono">
            Partner Network
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight afx-gradient-heading">
            {headline}
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Partner with the primary prop firm aggregator. Refer traders to top comparison tools, verified reviews, and coupons to unlock recursive monthly payouts.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <AFXCard 
                key={feat.title}
                className="bg-bg-surface/50 border border-border-subtle p-6 rounded-2xl space-y-4 hover:border-accent-cyan/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center border border-border-subtle/60">
                  <Icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-base font-extrabold text-text-primary">{feat.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{feat.desc}</p>
              </AFXCard>
            )
          })}
        </div>

        {/* Payout Tiers Matrix */}
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-3">
            <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-cyan" />
              Partner Scaling Framework
            </h2>
            <p className="text-text-secondary text-xs mt-0.5">Scale your volume and receive increased commission payouts automatically.</p>
          </div>

          <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface/30 p-0 rounded-2xl">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-base/40 text-text-secondary font-mono text-[10px] uppercase">
                    <th className="px-6 py-4 font-bold">Partner Level</th>
                    <th className="px-6 py-4 font-bold text-center">Referrals Count</th>
                    <th className="px-6 py-4 font-bold text-center">Commission Percentage</th>
                    <th className="px-6 py-4 font-bold text-right">Perks & Bonuses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 text-text-secondary">
                  {tiers.map((t, idx) => (
                    <tr key={idx} className="hover:bg-bg-base/20 transition-colors font-medium">
                      <td className="px-6 py-4 font-bold text-text-primary">{t.tier}</td>
                      <td className="px-6 py-4 text-center font-mono">{t.range}</td>
                      <td className="px-6 py-4 text-center font-mono font-black text-accent-cyan">{t.split}</td>
                      <td className="px-6 py-4 text-right text-text-primary/95">{t.bonus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AFXCard>
        </div>

        {/* How to Join */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-purple" />
            How to get started:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-text-secondary">
            <div className="space-y-1">
              <span className="font-mono text-accent-cyan font-black text-sm">Step 1:</span>
              <p className="font-bold text-text-primary">Sign Up for Partner Portal</p>
              <p className="leading-relaxed text-[11px]">Register your partner account profile. Get instant approval and immediate access to your tracking dashboards.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-accent-purple font-black text-sm">Step 2:</span>
              <p className="font-bold text-text-primary">Distribute Your Codes</p>
              <p className="leading-relaxed text-[11px]">Share your exclusive coupon codes, links, or comparison embeds with your network, blog, or community channels.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-accent-purple font-black text-sm">Step 3:</span>
              <p className="font-bold text-text-primary">Collect Monthly Payouts</p>
              <p className="leading-relaxed text-[11px]">Your referred checkouts accumulate point value and raw dollars. Withdraw your commissions securely on the 1st of every month.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border-subtle/50">
            <p className="text-[10px] text-text-muted max-w-xl font-mono leading-relaxed">
              <span className="font-semibold text-text-secondary">Note:</span> Self-referral for purchasing personal evaluation programs is strictly audited and disallowed. Violations will result in payout disqualifications.
            </p>
            <Link
              href="/loyalty"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan via-accent-purple to-pink-500 text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Sign In to Partner Portal
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
