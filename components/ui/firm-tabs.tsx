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
    <div className="flex border-b border-border-subtle/50 mb-8 overflow-x-auto scrollbar-none gap-2">
      {tabs.map((tab) => {
        // Active if pathname matches exactly, or for overview if pathname is exactly /firms/[slug]
        const isActive =
          tab.name === 'Overview'
            ? pathname === tab.href
            : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all shrink-0 select-none ${
              isActive
                ? 'border-accent-cyan text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}
