'use client'

import React from 'react'
import Link from 'next/link'

import { FirmLink } from '../ui/firm-link'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '../ui/prop-firm-logo'

interface MarqueeFirm {
  id: string
  slug: string
  name: string
  logo_url: string | null
  marquee_logo_url?: string | null
}

interface LogoMarqueeProps {
  firms: MarqueeFirm[]
  title?: string
}

export function LogoMarquee({ firms, title = 'Also Verified Prop Firms' }: LogoMarqueeProps) {
  if (firms.length === 0) return null

  // Duplicate items exactly twice for seamless -50% loop
  const items = [...firms, ...firms]

  return (
    <section className="py-12 bg-transparent overflow-hidden relative w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <h3 className="text-center text-sm font-bold tracking-widest text-text-muted uppercase">
          {title}
        </h3>
      </div>
      
      <div className="relative w-full overflow-hidden">
        {/* Soft fading edges for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee flex gap-8 items-center py-2">
          {items.map((firm, idx) => {
            return (
              <FirmLink
                key={`${firm.id}-${idx}`}
                firm={firm}
                className="flex-shrink-0 group block relative"
              >
                <PropFirmLogo
                  name={firm.name}
                  logoUrl={firm.marquee_logo_url || firm.logo_url}
                  className="h-16 w-32 rounded-2xl cursor-pointer hover:border-accent-cyan/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300"
                  imgClassName="max-h-full max-w-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </FirmLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default LogoMarquee
