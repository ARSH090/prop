'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AFXButton } from '@/components/ui/afx-button'
import { ChevronDown } from 'lucide-react'

interface NavLink {
  label: string
  href: string
}

interface NavBarProps {
  links?: NavLink[]
}

const defaultNavLinks = [
  { label: 'Firms', href: '/firms' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Offers', href: '/deals' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Compare', href: '/compare' },
  { label: 'Favorites', href: '/favorites' },
]

const toolsLinks = [
  { label: 'Rules Comparison', href: '/rules' },
  { label: 'Broker Spreads', href: '/spreads' },
  { label: 'Payout Proofs', href: '/payouts' },
  { label: 'Payout Leaderboard', href: '/leaderboard' },
  { label: 'Demo Accounts', href: '/demo-accounts' },
]

export function NavBar({ links = defaultNavLinks }: NavBarProps) {
  const [toolsOpen, setToolsOpen] = useState(false)

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
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-accent-cyan transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className="flex items-center gap-1 text-text-secondary hover:text-accent-cyan transition-colors text-xs font-semibold uppercase tracking-wider focus:outline-none">
                Tools
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {toolsOpen && (
                <div className="absolute top-4 left-0 w-48 bg-bg-surface border border-border-subtle rounded-xl shadow-xl py-2 mt-1 backdrop-blur-md animate-fade-in">
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2.5 text-xs text-text-secondary hover:text-accent-cyan hover:bg-bg-base/50 transition-colors font-medium"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right-side Actions */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <AFXButton variant="ghost" size="sm">
                Sign In
              </AFXButton>
            </Link>
            <Link href="/deals">
              <AFXButton variant="primary" size="sm" className="bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">
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
