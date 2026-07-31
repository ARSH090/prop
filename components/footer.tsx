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
    { label: 'About Empirial', href: '/about' },
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
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="EMPIRIAL Logo" className="h-8 w-auto rounded-lg object-contain" />
              <span className="text-lg font-black tracking-tight text-text-primary">
                EMPIRIAL
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-xs">{brandDescription}</p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com/anurajfx" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="w-8 h-8 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.254 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com/@anurajfx" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500/40 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com/anurajfx" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-purple hover:border-accent-purple/40 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://t.me/anurajfx" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-8 h-8 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
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
            <p className="text-text-muted text-xs">© 2026 EMPIRIAL. All rights reserved.</p>
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
