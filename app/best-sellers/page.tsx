import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getChallenges, getFirms } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { Award, TrendingUp } from 'lucide-react'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

export const metadata = {
  title: 'Best Seller Prop Challenges - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function BestSellersPage({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  const [challenges, firms] = await Promise.all([getChallenges(), getFirms()])

  const activeFirms = firms.filter((f) => {
    if (f.status !== 'active') return false
    const cats = f.category || []
    return cats.map((c: string) => c.toLowerCase()).includes(category.toLowerCase())
  })
  const activeChallenges = challenges
    .filter((c) => c.is_active !== false)
    .map((c) => {
      const firm = activeFirms.find((f) => f.id === c.firm_id)
      return { ...c, firm }
    })
    .filter((c) => c.firm)

  // Sort by popularity_score desc
  activeChallenges.sort((a, b) => b.popularity_score - a.popularity_score)

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading flex items-center gap-2">
            <Award className="w-8 h-8 text-accent-cyan" />
            Top Selling Challenges
          </h1>
          <p className="text-text-secondary text-sm">
            Ranked by total trader redirect checkouts and community engagement counts this month.
          </p>
        </div>

        <div className="space-y-4">
          {activeChallenges.map((c, index) => {
            const rank = index + 1
            return (
              <AFXCard
                key={c.id}
                className="bg-bg-surface border border-border-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Popularity Rank Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-accent-cyan/20 to-transparent w-16 h-16 flex items-start justify-end p-2.5">
                  <span className="font-mono text-accent-cyan font-bold text-xs">#{rank}</span>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-bg-base rounded-xl flex items-center justify-center font-extrabold text-accent-cyan border border-border-subtle">
                    {rank}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={getCleanLogoUrl(c.firm.name, c.firm.logo_url)}
                        alt={c.firm.name}
                        className="w-5 h-5 object-contain"
                      />
                      <span className="font-bold text-text-primary">{c.firm?.name}</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-bg-base border border-border-subtle/50">
                        {c.steps === 0 ? 'Instant' : `${c.steps}-Step`}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-text-primary">
                      ${(c.account_size / 1000).toFixed(0)}K account package
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Profit targets: {c.profit_target_p1}%{c.steps > 1 && ` / ${c.profit_target_p2}%`} • Drawdown: {c.max_loss_pct}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right space-y-0.5 font-mono">
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                      Evaluation Price
                    </p>
                    <p className="text-lg font-bold text-accent-cyan">${c.price}</p>
                  </div>
                  <a
                    href={c.affiliate_url || c.firm?.affiliate_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-blue text-xs whitespace-nowrap hover:opacity-90 transition-opacity"
                  >
                    Buy Challenge →
                  </a>
                </div>
              </AFXCard>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
