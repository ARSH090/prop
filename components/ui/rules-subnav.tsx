'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Landmark, History, Layers } from 'lucide-react'

export function RulesSubNav() {
  const pathname = usePathname()

  const tabs = [
    { label: 'Key Rules', href: '/rules', icon: Landmark, desc: 'Public matrix comparison of active prop firm rules and drawdown metrics.' },
    { label: 'Rule Changes', href: '/rule-changes', icon: History, desc: 'Real-time timeline changelog feed showing updates to parameters.' },
    { label: "EA's, Copy Trading & Platforms", href: '/ea-copy-trading-platforms', icon: Layers, desc: 'Filterable view highlighting bots, mirroring rules, and broker systems.' }
  ]

  const activeTab = tabs.find(t => pathname === t.href) || tabs[0]

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4">
      {/* Pills Container */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base border-transparent shadow-lg shadow-cyan-950/20'
                  : 'bg-[#120F1D] border-[#271E3A] text-text-secondary hover:text-white hover:border-accent-cyan/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Dynamic description below */}
      <p className="text-text-muted text-xs font-mono tracking-tight leading-relaxed max-w-xl">
        {activeTab.desc}
      </p>
    </div>
  )
}
