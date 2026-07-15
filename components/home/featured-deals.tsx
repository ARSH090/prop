'use client'

import { AFXCard } from '@/components/ui/afx-card'
import { AFXBadge } from '@/components/ui/afx-badge'

const deals = [
  {
    id: 1,
    code: 'AFX-VTX25',
    firm: 'Vertex Trading',
    discount: '25% OFF',
    description: 'Challenge discount',
    expires: '14 days',
  },
  {
    id: 2,
    code: 'FTMO-SUMMIT50',
    firm: 'FTMO',
    discount: '50% OFF',
    description: 'Evaluation fee waived',
    expires: '7 days',
  },
  {
    id: 3,
    code: 'FUNDING-MATCH',
    firm: 'Fundednext',
    discount: '30% OFF',
    description: 'Pro account discount',
    expires: '21 days',
  },
  {
    id: 4,
    code: 'ELITE-TRADE100',
    firm: 'Elite Trading',
    discount: 'Free Trial',
    description: '14-day full access',
    expires: '30 days',
  },
]

export function FeaturedDeals() {
  return (
    <section className="py-20 bg-bg-base">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-2">Featured Deals</h2>
          <p className="text-text-secondary">Exclusive verified discount codes updated daily</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <AFXCard key={deal.id} className="group cursor-pointer hover:border-accent-cyan/50 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                      {deal.firm}
                    </p>
                    <p className="font-mono text-lg font-bold text-accent-cyan group-hover:text-white transition-colors">
                      {deal.code}
                    </p>
                  </div>
                  <AFXBadge variant="code">{deal.discount}</AFXBadge>
                </div>

                <p className="text-text-secondary text-sm">{deal.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                  <span className="text-text-muted text-xs">Expires in {deal.expires}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 transition-colors text-xs font-semibold">
                    Copy Code
                  </button>
                </div>
              </div>
            </AFXCard>
          ))}
        </div>
      </div>
    </section>
  )
}
