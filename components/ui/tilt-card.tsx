'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxTilt?: number // default 6 degrees
  perspective?: number // default 1000px
  className?: string
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 6,
  perspective = 1000,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
    transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease, box-shadow 250ms ease',
  })
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Normalize cursor position from -1 to 1 relative to center
      const xPct = (mouseX / width - 0.5) * 2
      const yPct = (mouseY / height - 0.5) * 2

      // Calculate tilt angles (rotateX is driven by Y, rotateY by X)
      const rotateX = -yPct * maxTilt
      const rotateY = xPct * maxTilt

      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`,
        transition: 'transform 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease, box-shadow 250ms ease',
        willChange: 'transform',
      })
    },
    [maxTilt, perspective, prefersReducedMotion]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
      transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease, box-shadow 250ms ease',
      willChange: 'auto',
    })
  }, [perspective])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        'group relative rounded-xl border border-white/10 bg-elevation-raised backdrop-blur-md transition-all duration-300',
        'hover:border-accent-cyan/40 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.6),0_0_20px_rgba(34,211,238,0.12)]',
        isHovered && '[&_img]:scale-[1.04] [&_svg]:scale-[1.04]',
        '[&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-[cubic-bezier(0.16,1,0.3,1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
