'use client'

import React from 'react'
import Link from 'next/link'
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

  // Ensure enough items are present to fill ultra-wide viewports from border to border seamlessly
  const repeatFactor = Math.max(3, Math.ceil(24 / Math.max(1, firms.length))) * 3
  const items = Array(repeatFactor).fill(firms).flat()

  return (
    <section className="py-4 bg-transparent overflow-hidden relative w-full select-none">
      {/* Marquee Wrapper with subtle edge mask allowing logos to flow continuously from the border */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
        }}
      >
        <div className="animate-marquee flex gap-12 sm:gap-16 md:gap-24 items-center py-4">
          {items.map((firm, idx) => {
            const firmSlug = firm.slug ? (firm.slug.startsWith('/') ? firm.slug : `/firms/${firm.slug}`) : '/firms'
            return (
              <Link
                key={`${firm.id}-${idx}`}
                href={firmSlug}
                title={`View ${firm.name} details`}
                className="flex-shrink-0 group block transition-all duration-300 outline-none"
              >
                {/* Frameless Large Logo with subtle slight edge rounding and generous spacing */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                  <PropFirmLogo
                    name={firm.name}
                    logoUrl={firm.marquee_logo_url || firm.logo_url}
                    frame="none"
                    circleCrop={false}
                    transparentBg={true}
                    className="w-full h-full flex items-center justify-center rounded-[4px]"
                    imgClassName="max-h-full max-w-full object-contain rounded-[4px] transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LogoMarquee
