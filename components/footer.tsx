'use client'

import Link from 'next/link'

const footerLinks = {
  platform: [
    { label: 'Firms', href: '/firms' },
    { label: 'Brokers', href: '/brokers' },
    { label: 'Deals', href: '/deals' },
    { label: 'Reviews', href: '/reviews' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Tools', href: '/tools' },
    { label: 'Community', href: '/community' },
    { label: 'Compare', href: '/compare' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Transparency', href: '/transparency' },
    { label: 'Careers', href: '/careers' },
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
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
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

          {/* Footer Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors text-sm"
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
            <p className="text-text-muted text-sm">© 2026 ANURAJ FX. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-text-muted">
              <Link href="/privacy" className="hover:text-accent-cyan transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent-cyan transition-colors">
                Terms
              </Link>
              <Link href="/disclaimer" className="hover:text-accent-cyan transition-colors">
                Risk Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* India-focused disclaimer */}
        <div className="mt-8 pt-8 border-t border-border-subtle">
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="font-semibold text-text-secondary">Trading Risk Disclaimer:</span>{' '}
            {riskDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
