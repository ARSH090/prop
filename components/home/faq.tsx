'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is a prop firm and how does it work?',
    a: 'A prop firm (proprietary trading firm) funds traders with their own capital in exchange for a share of profits. Traders first pass an evaluation challenge to prove their skills, then receive a funded account. Popular firms like FTMO, FundedNext, and Topstep offer accounts up to $400K–$600K.',
  },
  {
    q: 'Can Indian traders legally participate in prop firm challenges?',
    a: 'Yes — Indian traders can legally participate in prop firm challenges and receive payouts abroad, subject to FEMA regulations on foreign remittances. Payouts are typically received via bank wire, Wise, or crypto. Always consult a CA for your specific tax filing requirements under LRS (Liberalised Remittance Scheme).',
  },
  {
    q: 'What is the best prop firm for Indian traders in 2026?',
    a: 'FTMO remains the industry gold standard with the highest transparency. FundedNext and Funding Pips are popular choices for Indian traders because of fast payouts and support for Indian payment methods. For futures, Topstep and Apex Trader Funding are leading options.',
  },
  {
    q: 'What is the difference between a 1-step and 2-step evaluation?',
    a: 'A 1-step evaluation requires traders to hit one profit target before getting funded. A 2-step evaluation has two phases — typically Phase 1 (10% target) and Phase 2 (5% target). 1-step evaluations cost more but are faster to complete. 2-step evaluations generally offer more time and better rules.',
  },
  {
    q: 'How do I use a promo code to get a discount on a prop firm?',
    a: "Visit the firm's website using our affiliate link or enter the promo code at checkout when purchasing your challenge account. Discounts typically range from 10–25% off. All codes listed on Anuraj FX are verified directly with the platform managers monthly.",
  },
  {
    q: 'What is a maximum drawdown limit in a prop firm?',
    a: "Maximum drawdown is the largest allowed loss from your account's peak balance. If your account hits this limit, you're disqualified from the challenge. For example, a 10% max drawdown on a $100K account means you can never lose more than $10,000 from your starting balance.",
  },
  {
    q: 'Which prop firms offer instant funding without an evaluation?',
    a: "Some firms like Instant Funding offer live funded accounts from day one, with no evaluation needed. The tradeoff is lower profit splits (typically 50–70%) and higher fees. These are ideal for experienced traders who don't want to go through the evaluation process.",
  },
]

interface HomeFAQProps {
  badge?: string
  title?: string
  subtext?: string
}

export function HomeFAQ({ badge, title, subtext }: HomeFAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-4">
          <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">{badge || 'FAQ'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
          {title || 'Frequently Asked Questions'}
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {subtext || 'Everything Indian traders need to know about prop firms, evaluation challenges, and funded accounts.'}
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-border-subtle rounded-2xl bg-bg-surface overflow-hidden hover:border-accent-cyan/30 transition-colors"
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left gap-4"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span className="text-sm font-semibold text-text-primary leading-snug">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${open === idx ? 'rotate-180 text-accent-cyan' : ''}`}
              />
            </button>

            <div
              style={{ maxHeight: open === idx ? '200px' : '0', opacity: open === idx ? 1 : 0 }}
              className="overflow-hidden transition-all duration-300 ease-in-out"
            >
              <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border-subtle pt-4">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
