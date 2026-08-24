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
  className = 'w-12 h-12 rounded-xl',
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
  const isFrameless = frame === 'none' || transparentBg
  const containerBg = isFrameless
    ? 'bg-transparent border-0'
    : (isDark ? 'bg-black border-white/20' : 'bg-white border-white/20 shadow-sm')

  const forceCircleCrop = circleCrop

  const computedClassName = forceCircleCrop
    ? className.replace(/rounded-(xl|lg|md|sm|2xl|3xl)/g, '').trim() + ' rounded-full p-0'
    : className;

  const computedImgClassName = forceCircleCrop
    ? 'w-full h-full object-cover rounded-full'
    : (imgClassName || 'w-full h-full object-contain rounded-[4px]');

  // Frame classes logic with bright metallic glows
  let frameClass = ''
  if (frame === 'none' || isFrameless) {
    frameClass = '!border-0 !shadow-none !ring-0'
  } else if (frame === 'gold') {
    frameClass = '!border-2 !border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.55)] ring-1 ring-amber-400/50'
  } else if (frame === 'silver') {
    frameClass = '!border-2 !border-slate-200 shadow-[0_0_15px_rgba(226,232,240,0.55)] ring-1 ring-slate-200/50'
  } else if (frame === 'bronze') {
    frameClass = '!border-2 !border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.55)] ring-1 ring-orange-500/50'
  } else if (frame === 'neon') {
    frameClass = '!border-2 !border-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.75)] ring-1 ring-accent-cyan/40'
  } else if (frame === 'offwhite') {
    frameClass = '!border !border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.12)]'
  } else if (frame === 'litewhite' || frame === 'white' || frame === 'thin-lite-grey') {
    frameClass = '!border !border-slate-200/50 shadow-[0_0_10px_rgba(226,232,240,0.25)] ring-1 ring-slate-200/30'
  }

  if (hasError || !imgSrc) {
    const fallbackClassName = forceCircleCrop
      ? className.replace(/rounded-(xl|lg|md|sm|2xl|3xl)/g, '').trim() + ' rounded-full p-0'
      : className;
    return (
      <div
        className={`${fallbackClassName} flex items-center justify-center font-black tracking-wider text-base sm:text-lg select-none shrink-0 ${
          isFrameless
            ? 'bg-transparent text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
            : 'bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 text-accent-cyan border border-accent-cyan/20'
        } ${frameClass}`}
        title={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className={`${computedClassName} flex items-center justify-center shrink-0 overflow-hidden ${containerBg} p-1 ${frameClass}`}>
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
