'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const ASSET_TABS = [
  { id: 'all',     label: 'All',     color: 'text-text-primary' },
  { id: 'forex',   label: 'Forex',   color: 'text-orange-400' },
  { id: 'futures', label: 'Futures', color: 'text-accent-cyan' },
  { id: 'crypto',  label: 'Crypto',  color: 'text-accent-purple', badge: 'NEW' },
]

interface AssetFilterBarProps {
  onAssetChange?: (asset: string) => void
  className?: string
}

export function AssetFilterBar({ onAssetChange, className = '' }: AssetFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(searchParams.get('asset') || 'all')

  useEffect(() => {
    const param = searchParams.get('asset') || 'all'
    setActive(param)
  }, [searchParams])

  const handleSelect = (id: string) => {
    setActive(id)
    onAssetChange?.(id)
    const params = new URLSearchParams(searchParams.toString())
    if (id === 'all') {
      params.delete('asset')
    } else {
      params.set('asset', id)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <div className="flex items-center gap-1 bg-bg-surface border border-border-subtle rounded-full p-1 shadow-lg shadow-black/20">
        {ASSET_TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive
                  ? tab.id === 'all'
                    ? 'bg-text-primary text-bg-base shadow-md'
                    : tab.id === 'forex'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    : tab.id === 'futures'
                    ? 'bg-gradient-to-r from-accent-cyan to-blue-500 text-bg-base shadow-md shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-accent-purple to-violet-600 text-white shadow-md shadow-purple-500/20'
                  : `text-text-muted hover:text-text-primary hover:bg-bg-base/60`
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
