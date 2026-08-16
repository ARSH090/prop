'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface FirmTabsProps {
  slug: string
}

export function FirmTabs({ slug }: FirmTabsProps) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Overview', href: `/firms/${slug}` },
    { name: 'Challenges', href: `/firms/${slug}/challenges` },
    { name: 'Reviews', href: `/firms/${slug}/reviews` },
    { name: 'Offers', href: `/firms/${slug}/offers` },
    { name: 'Payouts', href: `/firms/${slug}/payouts` },
    { name: 'Discussions', href: `/firms/${slug}/discussions` },
  ]

  return (
    <div className="relative flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-none gap-2">
      {tabs.map((tab) => {
        const isActive =
          tab.name === 'Overview'
            ? pathname === tab.href
            : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative px-5 py-3.5 text-sm font-bold transition-all duration-200 shrink-0 select-none ${
              isActive
                ? 'text-accent-cyan font-extrabold scale-[1.02]'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-cta rounded-full shadow-[0_0_8px_#22D3EE] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            )}
          </Link>
        )
      })}
    </div>
  )
}

