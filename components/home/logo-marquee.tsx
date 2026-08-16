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
    <section className="py-6 bg-transparent overflow-hidden relative w-full select-none">

      {/* Decorative background ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-10 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-10 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full overflow-hidden">
        {/* Soft fading edges for premium look using deep slate background variables */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-12 items-center py-4">
          {items.map((firm, idx) => {
            return (
              <FirmLink
                key={`${firm.id}-${idx}`}
                firm={firm}
                className="flex-shrink-0 group block transition-transform duration-300 hover:scale-110 p-2 bg-transparent border-transparent border-0 shadow-none outline-none"
              >
                <PropFirmLogo
                  name={firm.name}
                  logoUrl={firm.marquee_logo_url || firm.logo_url}
                  frame="none"
                  circleCrop={false}
                  transparentBg={true}
                  className="h-16 w-36 object-contain rounded-2xl overflow-hidden"
                  imgClassName="max-h-full max-w-full object-contain transition-all duration-300 rounded-2xl"
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
