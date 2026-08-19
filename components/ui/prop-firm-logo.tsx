'use client'

import React, { useState, useEffect } from 'react'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'

interface PropFirmLogoProps {
  name: string
  logoUrl?: string | null
  className?: string
  imgClassName?: string
  circleCrop?: boolean
  frame?: string | null
  transparentBg?: boolean
}

export function PropFirmLogo({
  name,
  logoUrl: propLogoUrl,
  className = 'w-10 h-10 rounded-xl',
  imgClassName = 'max-w-full max-h-full object-contain',
  circleCrop = false,
  frame = 'offwhite',
  transparentBg = false,
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
  const containerBg = transparentBg 
    ? 'bg-transparent border-transparent' 
    : (isDark ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-white/90 border-white/10 shadow-sm')

  const forceCircleCrop = circleCrop

  const computedClassName = forceCircleCrop
    ? className.replace(/rounded-(xl|lg|md|sm|2xl|3xl)/g, '').trim() + ' rounded-full p-0'
    : className;

  const computedImgClassName = forceCircleCrop
    ? 'w-full h-full object-cover rounded-full'
    : 'w-full h-full object-cover';

  // Frame classes logic
  let frameClass = ''
  if (frame === 'gold') {
    frameClass = '!border-[3px] !border-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.7)] scale-[1.05] ring-2 ring-yellow-400/30'
  } else if (frame === 'silver') {
    frameClass = '!border-[3px] !border-slate-300 shadow-[0_0_10px_rgba(148,163,184,0.6)] scale-[1.03] ring-2 ring-slate-400/20'
  } else if (frame === 'bronze') {
    frameClass = '!border-[3px] !border-amber-700 shadow-[0_0_8px_rgba(180,83,9,0.6)] scale-[1.02] ring-2 ring-amber-700/20'
  } else if (frame === 'neon') {
    frameClass = '!border-[3px] !border-accent-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-[1.05]'
  } else if (frame === 'offwhite') {
    frameClass = '!border-[3px] !border-white/15 shadow-[0_0_8px_rgba(255,255,255,0.08)]'
  }

  if (hasError || !imgSrc) {
    const fallbackClassName = forceCircleCrop
      ? className.replace(/rounded-(xl|lg|md|sm|2xl|3xl)/g, '').trim() + ' rounded-full p-0'
      : className;
    return (
      <div
        className={`${fallbackClassName} border flex items-center justify-center font-bold tracking-wider text-xs select-none shrink-0 bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 text-accent-cyan border-accent-cyan/20 ${frameClass}`}
        title={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className={`${computedClassName} flex items-center justify-center shrink-0 overflow-hidden ${containerBg} p-0 ${frameClass}`}>
      <img
        src={imgSrc}
        alt={`${name} Logo`}
        className={computedImgClassName}
        onError={() => setHasError(true)}
      />
    </div>
  )
}

export default PropFirmLogo
