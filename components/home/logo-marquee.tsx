'use client'

import React from 'react'
import { FirmLink } from '../ui/firm-link'
import { PropFirmLogo } from '../ui/prop-firm-logo'

interface MarqueeFirm {
  id: string
  slug: string
  name: string
  logo_url: string | null
  marquee_logo_url?: string | null
  logo_frame?: string
}

interface LogoMarqueeProps {
  firms: MarqueeFirm[]
  title?: string
}

export function LogoMarquee({ firms, title = 'Direct Verified Partners & Trusted Evaluation Programs' }: LogoMarqueeProps) {
  if (firms.length === 0) return null

  // Duplicate items to ensure seamless loop
  const items = [...firms, ...firms, ...firms]

  return (
    <section className="py-10 bg-gradient-to-r from-bg-base/20 via-[#0E0B19]/50 to-bg-base/20 border-y border-[#271E3A] overflow-hidden relative w-full select-none">
      
      {/* Decorative background ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-10 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-10 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <h3 className="text-center text-[10px] font-bold tracking-[0.2em] text-accent-cyan uppercase font-mono">
          {title}
        </h3>
      </div>
      
      <div className="relative w-full overflow-hidden">
        {/* Soft fading edges for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#05070D] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#05070D] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee flex gap-12 items-center py-4">
          {items.map((firm, idx) => {
            return (
              <FirmLink
                key={`${firm.id}-${idx}`}
                firm={firm}
                className="flex-shrink-0 group block transition-transform duration-300 hover:scale-110"
              >
                <PropFirmLogo
                  name={firm.name}
                  logoUrl={firm.marquee_logo_url || firm.logo_url}
                  frame={firm.logo_frame}
                  circleCrop={false}
                  transparentBg={true}
                  className="h-12 w-28 object-contain"
                  imgClassName="max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 mix-blend-screen"
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
