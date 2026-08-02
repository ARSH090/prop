'use client'

import React, { useState, useEffect } from 'react'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'

interface PropFirmLogoProps {
  name: string
  logoUrl?: string | null
  className?: string
  imgClassName?: string
}

export function PropFirmLogo({
  name,
  logoUrl: propLogoUrl,
  className = 'w-10 h-10 rounded-xl',
  imgClassName = 'w-full h-full object-contain',
}: PropFirmLogoProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  // Resolve logo URL when props change
  useEffect(() => {
    const resolved = getCleanLogoUrl(name, propLogoUrl)
    setImgSrc(resolved)
    setHasError(false)
  }, [name, propLogoUrl])

  // Get initials for fallback (e.g. "FTMO" -> "FT", "The 5%ers" -> "5E")
  const getInitials = (firmName: string) => {
    const clean = firmName.replace(/the\s+/i, '').replace(/[^a-zA-Z0-9\s]/g, '').trim()
    const words = clean.split(/\s+/)
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return clean.substring(0, 2).toUpperCase() || 'PF'
  }

  const isDark = isDarkLogo(name)
  const containerBg = isDark ? 'bg-[#0b121f] border-accent-purple/20' : 'bg-white border-border-subtle'

  if (hasError || !imgSrc) {
    return (
      <div
        className={`${className} border flex items-center justify-center font-bold tracking-wider text-xs select-none shrink-0 bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 text-accent-cyan border-accent-cyan/20`}
        title={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className={`${className} border flex items-center justify-center p-1.5 shrink-0 overflow-hidden ${containerBg}`}>
      <img
        src={imgSrc}
        alt={`${name} Logo`}
        className={imgClassName}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
