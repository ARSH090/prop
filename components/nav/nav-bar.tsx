'use client'

import Link from 'next/link'
import { AFXButton } from '@/components/ui/afx-button'

interface NavLink {
  label: string
  href: string
}

interface NavBarProps {
  links?: NavLink[]
}

const defaultNavLinks = [
  { label: 'Prop Firms', href: '/firms' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Deals', href: '/deals' },
  { label: 'Blog', href: '/blog' },
]

export function NavBar({ links = defaultNavLinks }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-text-primary">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-white text-xs">
              A
            </div>
            <span className="text-lg font-bold">
              ANURAJ <span className="text-accent-cyan">FX</span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-accent-cyan transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right-side Actions */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <AFXButton variant="ghost" size="sm">
                Sign In
              </AFXButton>
            </Link>
            <Link href="/deals">
              <AFXButton variant="primary" size="sm">
                Get Codes
              </AFXButton>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default NavBar
