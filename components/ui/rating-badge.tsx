'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingBadgeProps {
  rating: number
  reviewCount?: number
  fontVariant?: 'mono' | 'serif' | 'sans'
  className?: string
}

export function RatingBadge({
  rating,
  reviewCount,
  fontVariant = 'sans',
  className
}: RatingBadgeProps) {
  const numberFont = {
    mono: 'font-mono font-extrabold tracking-tight',
    serif: 'font-serif font-black italic',
    sans: 'font-sans font-extrabold'
  }[fontVariant]

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border-default bg-bg-base/80 backdrop-blur-sm shadow-sm",
      className
    )}>
      {/* Numeric Score (Most Prominent) */}
      <span className={cn("text-xs text-text-primary", numberFont)}>
        {Number(rating).toFixed(1)}
      </span>

      {/* Star Icon (Secondary) */}
      <Star className="w-3 h-3 text-yellow-400 fill-current shrink-0" />

      {/* Review Count (Tertiary) */}
      {reviewCount !== undefined && (
        <span className="text-[10px] text-text-muted font-sans font-medium whitespace-nowrap">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}

export default RatingBadge
