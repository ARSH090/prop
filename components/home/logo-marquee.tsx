'use client'

import React from 'react'
import Link from 'next/link'

interface MarqueeFirm {
  id: string
  slug: string
  name: string
  logo_url: string | null
}

interface LogoMarqueeProps {
  firms: MarqueeFirm[]
  title?: string
}

const getCleanLogoUrl = (name: string, url: string | null) => {
  if (url && url.startsWith('http') && !url.includes('images.unsplash.com') && !url.includes('ftmo.com/wp-content/themes') && !url.includes('the5ers.com/wp-content')) {
    return url
  }
  
  const cleanName = name.toLowerCase().trim();
  
  if (cleanName.includes('5%ers') || cleanName.includes('5ers') || cleanName.includes('the-5ers')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/the-5ers.png'
  }
  if (cleanName.includes('e8')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/e8-funding.png'
  }
  if (cleanName.includes('ftmo')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/ftmo.png'
  }
  if (cleanName.includes('myfundedfutures') || cleanName.includes('mffu')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/myfundedfutures.png'
  }
  if (cleanName.includes('alpha capital')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/alpha-capital-group.png'
  }
  if (cleanName.includes('take profit')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/take-profit-trader.png'
  }
  if (cleanName.includes('goat funded')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/goat-funded-trader.png'
  }
  if (cleanName.includes('apex')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/apex-trader-funding.png'
  }
  if (cleanName.includes('topstep') || cleanName.includes('top step')) {
    return 'https://storage.googleapis.com/prop-firm-match-production-logos/topstep.png'
  }
  
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    
  return `https://storage.googleapis.com/prop-firm-match-production-logos/${slug}.png`
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
          {items.map((firm, idx) => {
            const logoUrl = getCleanLogoUrl(firm.name, firm.logo_url)
            return (
              <Link
                key={`${firm.id}-${idx}`}
                href={`/firms/${firm.slug}`}
                className="flex-shrink-0 group block relative"
              >
                <div className="h-16 w-32 bg-bg-base border border-border-default hover:border-accent-cyan/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] rounded-2xl flex items-center justify-center p-3 transition-all duration-300">
                  <img
                    src={logoUrl}
                    alt={`${firm.name} logo`}
                    className="max-h-full max-w-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    onError={(e) => {
                      // Fallback logo URL format
                      (e.target as HTMLImageElement).src = `https://storage.googleapis.com/prop-firm-match-production-logos/${firm.name.toLowerCase().replace(/\s+/g, '-')}.png`
                    }}
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
