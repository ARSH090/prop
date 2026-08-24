'use client'

import React from 'react'
import { InteractiveGlobe, GlobeMarker, GlobeConnection, DEFAULT_GLOBE_MARKERS, DEFAULT_GLOBE_CONNECTIONS } from '@/components/ui/interactive-globe'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

export interface PropGlobeProps {
  globeFirms?: any[]
  className?: string
  size?: number
}

export function PropGlobe({ globeFirms = [], className, size }: PropGlobeProps) {
  // Map incoming custom globe firms into Globe markers
  let markers: GlobeMarker[] = [...DEFAULT_GLOBE_MARKERS]
  let connections: GlobeConnection[] = [...DEFAULT_GLOBE_CONNECTIONS]

  if (globeFirms && globeFirms.length > 0) {
    // Natural spherical geographic distribution coordinates covering 360° global trading hubs
    const fallbackLats = [
      50.0755, // Prague, CZ
      41.8781, // Chicago, US
      25.2048, // Dubai, UAE
      51.5074, // London, UK
      32.7767, // Dallas, US
      40.7128, // New York, US
      1.3521,  // Singapore
      35.6762, // Tokyo, JP
      -33.8688, // Sydney, AU
      50.1109, // Frankfurt, DE
      -23.5505, // Sao Paulo, BR
      22.3193, // Hong Kong
      -26.2041, // Johannesburg, ZA
    ]
    const fallbackLngs = [
      14.4378,
      -87.6298,
      55.2708,
      -0.1278,
      -96.797,
      -74.006,
      103.8198,
      139.6503,
      151.2093,
      8.6821,
      -46.6333,
      114.1694,
      28.0473,
    ]

    const firmMarkers: GlobeMarker[] = globeFirms
      .filter((f) => f && f.name && f.is_active !== false)
      .map((f, idx) => {
        const lat = typeof f.lat === 'number' ? f.lat : fallbackLats[idx % fallbackLats.length]
        const lng = typeof f.lng === 'number' ? f.lng : fallbackLngs[idx % fallbackLngs.length]
        const affiliateUrl = f.affiliate_url || f.href || f.website_url || `/firms/${f.id || f.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`

        return {
          id: f.id || `globe-firm-${idx}`,
          lat,
          lng,
          name: f.name,
          sublabel: f.full_name || 'Verified Prop Firm',
          logoUrl: f.logo_url || getCleanLogoUrl(f.name, null),
          firmImageUrl: f.firm_image_url || '',
          affiliateUrl,
          color: f.color || f.globe_color || '#22D3EE',
          isActive: f.is_active !== false,
        }
      })

    if (firmMarkers.length > 0) {
      // Retain EMPIRIAL HQ as primary central node
      const empirialHq = DEFAULT_GLOBE_MARKERS.find((m) => m.name === 'EMPIRIAL') || DEFAULT_GLOBE_MARKERS[0]
      markers = [empirialHq, ...firmMarkers]
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <InteractiveGlobe
        className={className}
        size={size}
        markers={markers}
        connections={connections}
      />
    </div>
  )
}

export default PropGlobe

