'use client'

import React from 'react'
import Link from 'next/link'

interface MarqueeFirm {
  id: string
  slug: string
  name: string
  logo_url: string
}

interface LogoMarqueeProps {
  firms: MarqueeFirm[]
  title?: string
}

export function LogoMarquee({ firms, title = 'Also Verified Prop Firms' }: LogoMarqueeProps) {
  if (firms.length === 0) return null

  // Duplicate items for seamless looping
  const items = [...firms, ...firms, ...firms, ...firms]

  return (
    <section className="py-12 bg-bg-surface border-y border-border-default overflow-hidden relative w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <h3 className="text-center text-sm font-bold tracking-widest text-text-muted uppercase">
          {title}
        </h3>
      </div>
      
      <div className="relative w-full overflow-hidden flex">
        {/* Soft fading edges for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-surface to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee flex gap-8 items-center py-2">
          {items.map((firm, idx) => (
            <Link
              key={`${firm.id}-${idx}`}
              href={`/firms/${firm.slug}`}
              className="flex-shrink-0 group block relative"
            >
              <div className="h-16 w-32 bg-bg-base border border-border-default hover:border-accent-cyan/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] rounded-2xl flex items-center justify-center p-3 transition-all duration-300">
                {firm.logo_url ? (
                  <img
                    src={firm.logo_url}
                    alt={`${firm.name} logo`}
                    className="max-h-full max-w-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                ) : (
                  <span className="text-sm font-bold text-text-muted group-hover:text-accent-cyan transition-colors">
                    {firm.name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
export default LogoMarquee
