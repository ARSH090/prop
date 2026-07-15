import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Prop Firm Rules Comparison - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function RulesPage() {
  const firms = await getFirms('prop_firm')
  const activeFirms = firms.filter((f) => f.status === 'active')

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Prop Evaluation Rules Comparison
          </h1>
          <p className="text-text-secondary text-sm">
            Quick factual specifications of profit target splits, step structures, and drawdown parameters.
          </p>
        </div>

        <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/30 text-text-secondary font-mono">
                  <th className="px-6 py-4 text-left font-bold">Prop Firm</th>
                  <th className="px-6 py-4 text-center font-bold">Steps</th>
                  <th className="px-6 py-4 text-center font-bold">Profit Target</th>
                  <th className="px-6 py-4 text-center font-bold">Daily Drawdown</th>
                  <th className="px-6 py-4 text-center font-bold">Max Drawdown</th>
                  <th className="px-6 py-4 text-center font-bold">Profit Split</th>
                  <th className="px-6 py-4 text-center font-bold">Duration</th>
                  <th className="px-6 py-4 text-center font-bold">Re-Entry</th>
                </tr>
              </thead>
              <tbody>
                {activeFirms.map((firm) => {
                  const rules = firm.rules || {}
                  return (
                    <tr
                      key={firm.id}
                      className="border-b border-border-subtle hover:bg-bg-base/20 transition-all font-medium text-text-secondary"
                    >
                      <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2">
                        {firm.logo_url && (
                          <img
                            src={firm.logo_url}
                            alt={firm.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span>{firm.name}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-xs">
                        {rules.steps || '2'}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-text-primary font-bold">
                        {rules.profit_target || '10%'}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-red-400">
                        {rules.daily_loss || '5%'}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-red-400">
                        {rules.max_drawdown || '10%'}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-text-primary font-bold">
                        {rules.profit_split || '80%'}
                      </td>
                      <td className="px-6 py-4 text-center text-xs">
                        {rules.duration || 'Unlimited'}
                      </td>
                      <td className="px-6 py-4 text-center text-xs capitalize">
                        {rules.re_entry || 'Allowed'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </AFXCard>

        <div className="flex gap-4 p-4 bg-bg-surface border border-border-subtle/50 rounded-2xl text-xs text-text-muted">
          <HelpCircle className="w-5 h-5 text-accent-cyan flex-shrink-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-text-secondary">Methodology Note:</span> These parameters represent standard program sizes ($100,000 challenge or closest tier). Individual challenge listings may vary depending on the target account size chosen.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
