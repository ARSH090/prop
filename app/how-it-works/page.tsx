import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getSiteContent } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { Search, Percent, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'How It Works - ANURAJ FX',
  description: 'Learn how to compare prop firms, claim discount codes, and get funded with Anuraj FX.',
}

export const dynamic = 'force-dynamic'

export default async function HowWorksPage() {
  const content = await getSiteContent('how_it_works')
  const headline = content.headline || 'How It Works'

  const steps = [
    {
      num: '01',
      title: 'Search & Filter',
      desc: 'Use our comprehensive interactive directories to filter prop evaluation programs by size, steps, maximum drawdown, and profit split target parameters.',
      icon: Search,
      color: 'from-accent-cyan to-accent-blue',
      glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]',
      link: '/challenges',
      linkText: 'Compare Challenges'
    },
    {
      num: '02',
      title: 'Secure Promo Codes',
      desc: 'Instantly retrieve and copy exclusive, verified discount coupons and promotion codes validated by our platform daily.',
      icon: Percent,
      color: 'from-accent-blue to-accent-purple',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      link: '/deals',
      linkText: 'View Active Deals'
    },
    {
      num: '03',
      title: 'Pass & Get Funded',
      desc: 'Purchase your challenge package, successfully clear the evaluation phases, and scale up to payouts with up to 90% profit splits.',
      icon: ShieldCheck,
      color: 'from-accent-purple to-pink-500',
      glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
      link: '/leaderboard',
      linkText: 'Check Leaderboard'
    }
  ]

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex-grow space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-[10px] font-bold text-accent-cyan uppercase tracking-widest font-mono">
            Process Overview
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight afx-gradient-heading">
            {headline}
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            ANURAJ FX is the ultimate aggregator and companion platform designed to assist modern traders in identifying, evaluating, and purchasing optimal prop trading challenges.
          </p>
        </div>

        {/* 3 Step Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <AFXCard 
                key={step.num}
                className={`relative overflow-hidden bg-bg-surface/60 border border-border-subtle p-8 rounded-3xl space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-cyan/30 ${step.glow}`}
              >
                {/* Accent glow behind step number */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-xl`} />

                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center`}>
                    <div className="w-full h-full rounded-[14px] bg-bg-surface flex items-center justify-center">
                      <Icon className="w-5 h-5 text-text-primary" />
                    </div>
                  </div>
                  <span className="font-mono text-3xl font-black text-text-muted/40">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={step.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-cyan hover:underline group"
                  >
                    {step.linkText}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </AFXCard>
            )
          })}
        </div>

        {/* Interactive Stats Block */}
        <div className="bg-bg-surface border border-border-subtle/80 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-purple/5 to-transparent pointer-events-none" />
          
          <div className="space-y-2 relative z-10 max-w-2xl">
            <h3 className="text-lg font-black text-text-primary">
              Ready to take the next step towards funding?
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed">
              Explore over 1,500+ active challenge structures from top verified prop firms including FTMO, Funding Pips, Topstep, and more.
            </p>
          </div>

          <div className="flex gap-4 relative z-10 w-full md:w-auto">
            <Link
              href="/challenges"
              className="flex-1 md:flex-initial text-center px-6 py-3 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-blue text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Explore Challenges
            </Link>
            <Link
              href="/deals"
              className="flex-1 md:flex-initial text-center px-6 py-3 rounded-xl font-bold text-text-primary border border-border-subtle bg-bg-base hover:bg-bg-surface transition-all text-xs whitespace-nowrap"
            >
              Copy Discount Codes
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
