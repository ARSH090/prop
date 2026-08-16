'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const DATA_DENSE_ROUTES = ['/rules', '/challenges', '/leaderboard', '/payouts', '/admin']

export function CursorGlow() {
  const pathname = usePathname()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)

  // Disable on data-dense pages where scanning speed and zero distraction is vital
  const isDataDensePage = DATA_DENSE_ROUTES.some((route) => pathname.startsWith(route))

  useEffect(() => {
    setIsHydrated(true)
    
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduceMotion(mediaQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches)
    }
    mediaQuery.addEventListener('change', handleMotionChange)

    // Check touch/no-hover device
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsTouchDevice(!hoverQuery.matches)
    const handleHoverChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches)
    }
    hoverQuery.addEventListener('change', handleHoverChange)

    // Mouse move event & interactive element detection
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement | null
      if (target) {
        const interactive = target.closest('button, a, input, select, [role="button"], .afx-card, .tilt-card')
        setIsHoveringInteractive(Boolean(interactive))
      }
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      hoverQuery.removeEventListener('change', handleHoverChange)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isHydrated || shouldReduceMotion || isTouchDevice || isDataDensePage) {
    return null
  }

  const maxFadeScroll = 1200
  const scrollRatio = Math.min(scrollY / maxFadeScroll, 1)
  
  // Dynamic scale & brightness when hovering interactive elements
  const baseSize = 500 - scrollRatio * 200
  const finalSize = isHoveringInteractive ? baseSize * 1.3 : baseSize
  
  const baseOpacity = 0.18 - scrollRatio * 0.12
  const finalOpacity = isHoveringInteractive ? Math.min(baseOpacity * 1.6, 0.35) : baseOpacity

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <div
        className="absolute rounded-full blur-3xl pointer-events-none transition-[width,height,opacity,transform] duration-250 ease-out"
        style={{
          width: `${finalSize}px`,
          height: `${finalSize}px`,
          background: isHoveringInteractive
            ? 'radial-gradient(circle, #22D3EE 0%, #3B82F6 40%, transparent 75%)'
            : 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          opacity: finalOpacity,
          transform: `translate3d(${position.x - finalSize / 2}px, ${position.y - finalSize / 2}px, 0)`,
          left: 0,
          top: 0,
        }}
      />
    </div>
  )
}

export default CursorGlow

