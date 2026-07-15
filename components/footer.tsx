'use client'

import Link from 'next/link'

const footerLinks = {
  propFirms: [
    { label: 'All Firms', href: '/firms' },
    { label: 'Challenges', href: '/challenges' },
    { label: 'Best Sellers', href: '/best-sellers' },
    { label: 'Favorites', href: '/favorites' },
    { label: 'Rules Comparison', href: '/rules' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Payout Proofs', href: '/payouts' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Demo Accounts', href: '/demo-accounts' },
  ],
  offers: [
    { label: 'Promo Deals', href: '/deals' },
    { label: 'Loyalty PTS Program', href: '/loyalty' },
    { label: 'Affiliate Referrals', href: '/affiliate-program' },
  ],
  resources: [
    { label: 'Trading Insights Blog', href: '/blog' },
  ],
  company: [
    { label: 'About Anuraj FX', href: '/about' },
    { label: 'Transparency Audit', href: '/transparency' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Contact Support', href: '/contact' },
  ],
}

interface FooterProps {
  brandDescription?: string
  riskDisclaimer?: string
}

export function Footer({
  brandDescription = 'Trade intelligence platform for comparing prop firms, brokers, and exclusive deals.',
  riskDisclaimer = 'Trading Risk Disclaimer: Prop firm trading, CFDs, and forex involve high risk. This is not investment advice. ANURAJ FX is a comparison platform only. Please consult regulated advisors and review SEBI guidelines before trading. All participants must be 18+.',
}: FooterProps) {
  return (
    <footer className="bg-bg-surface border-t border-border-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-white text-xs">
                A
              </div>
              <span className="text-lg font-bold text-text-primary">
                ANURAJ <span className="text-accent-cyan">FX</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-xs">{brandDescription}</p>
          </div>

          {/* Prop Firms Column */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-xs font-mono uppercase tracking-wider">Prop Programs</h4>
            <ul className="space-y-2">
              {footerLinks.propFirms.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offers & Resources */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-4 text-xs font-mono uppercase tracking-wider">Offers</h4>
              <ul className="space-y-2">
                {footerLinks.offers.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-accent-cyan transition-colors text-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4 text-xs font-mono uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-accent-cyan transition-colors text-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-xs font-mono uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-xs">© 2026 ANURAJ FX. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-text-muted">
              <Link href="/privacy-policy" className="hover:text-accent-cyan transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-accent-cyan transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/transparency" className="hover:text-accent-cyan transition-colors">
                Audited Transparency
              </Link>
            </div>
          </div>
        </div>

        {/* India-focused disclaimer */}
        <div className="mt-8 pt-8 border-t border-border-subtle">
          <p className="text-[11px] text-text-muted leading-relaxed">
            <span className="font-semibold text-text-secondary">Trading Risk Disclaimer:</span>{' '}
            {riskDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
