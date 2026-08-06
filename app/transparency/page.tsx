import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { ShieldCheck, Eye, Scale, Users, Flame, Landmark } from 'lucide-react'

export const metadata = {
  title: 'Transparency & Verification Audits - ANURAJ FX',
  description: 'Our verification protocols and operational parameters ensure complete neutrality, audited reviews, and verified discount data.',
}

export const dynamic = 'force-dynamic'

export default async function TransparencyPage() {
  const content = await getSiteContent('transparency')
  const headline = content.headline || 'Transparency & Verification'

  const pillars = [
    {
      title: 'Audited Trader Reviews',
      desc: 'All ratings and review submissions are validated against actual prop firm accounts. We flag and reject spam or compensated evaluations.',
      icon: Users,
      color: 'text-accent-cyan'
    },
    {
      title: 'Real-Time Spread Audits',
      desc: 'We fetch real-time bid/ask quotes and commission rates directly from active broker feeds to show you actual spreads, not marketing numbers.',
      icon: Eye,
      color: 'text-accent-blue'
    },
    {
      title: 'Verified Payout Logs',
      desc: 'Payout proofs uploaded by the community undergo manual admin inspection of transaction receipts to ensure authentic success rates.',
      icon: ShieldCheck,
      color: 'text-accent-green'
    }
  ]

  const declarations = [
    {
      title: 'Complete Editorial Independence',
      desc: 'We do not accept payments to artificially boost rankings, ratings, or positions in our comparison tables. Rankings are driven strictly by popularity scores, prices, and user ratings.',
      icon: Scale
    },
    {
      title: 'Conflict of Interest Prevention',
      desc: 'Anuraj FX team members are prohibited from managing operations of any listed prop firm. We act solely as a neutral aggregator and information provider.',
      icon: ShieldCheck
    }
  ]

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-grow space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/25 text-[10px] font-bold text-accent-green uppercase tracking-widest font-mono">
            Platform Protocol
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight afx-gradient-heading">
            {headline}
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            At ANURAJ FX, trust is our core currency. We audit every challenge param, verify user payouts, and reject artificial placement bids to protect the trading community.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <AFXCard 
                key={p.title}
                className="bg-bg-surface/50 border border-border-subtle p-6 rounded-2xl space-y-4 hover:border-accent-cyan/20 transition-all duration-300 animate-fade-in"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center border border-border-subtle/60">
                  <Icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="text-base font-extrabold text-text-primary">{p.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{p.desc}</p>
              </AFXCard>
            )
          })}
        </div>

        {/* Statements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {declarations.map((d, index) => {
            const Icon = d.icon
            return (
              <AFXCard 
                key={index}
                className="bg-bg-surface/30 border border-border-subtle/80 p-8 rounded-2xl space-y-3"
              >
                <h3 className="text-base font-black text-text-primary flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-accent-cyan" />
                  {d.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed">{d.desc}</p>
              </AFXCard>
            )
          })}
        </div>

        {/* Regulatory/Risk Warning */}
        <div className="bg-[#120F1D]/80 border border-[#231A32] rounded-3xl p-8 space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
          <h2 className="text-sm font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            High Risk Disclaimer
          </h2>
          <p className="text-[11px] text-text-secondary leading-relaxed font-mono">
            Proprietary evaluation programs, CFDs, futures, and currency trading involve significant capital loss risks. Anuraj FX functions strictly as a comparison aggregator. We do not provide financial advisory services, manage funds, or hold client deposits. All activities listed are demo/mock challenges. Please verify regional regulatory standards (such as SEBI guidelines) before purchasing services.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
