'use client'

import { Compass, Sparkles, Trophy } from 'lucide-react'

const steps = [
  {
    icon: Compass,
    step: '01',
    title: 'Explore & Compare',
    description: 'Filter 60+ verified prop programs by platforms, rules, profit target splits, step structures, and drawdown limits.',
    color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Grab Promos',
    description: 'Copy exclusive discount coupons verified directly with platform managers to save up to 45% off challenge fees.',
    color: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Earn Funded Payouts',
    description: 'Successfully complete the evaluation steps, receive your funded trading account, and retain up to 90% of your gains.',
    color: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
  },
]

export function ExplainerCards() {
  return (
    <section className="py-20 bg-bg-base border-t border-border-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-4 animate-pulse">
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
            Start Trading With Up to $400K+
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Follow these three simple steps to secure institutional funding and start trading with maximum efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="relative bg-bg-surface border border-border-subtle hover:border-accent-cyan/60 p-8 rounded-3xl group hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-cyan/10 transition-all duration-500 flex flex-col overflow-hidden"
              >
                {/* Subtle Hover Glow Gradient */}
                <div className="absolute -inset-px bg-gradient-to-br from-accent-cyan/0 to-accent-purple/0 group-hover:from-accent-cyan/5 group-hover:to-accent-purple/5 rounded-3xl transition-all duration-500 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl border ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-extrabold text-text-muted font-mono leading-none tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-cyan transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed flex-1">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default ExplainerCards
