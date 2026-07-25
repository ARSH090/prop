'use client'

import React, { useState, useEffect } from 'react'

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

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

    // Mouse move event (clientX/clientY for fixed viewport positioning)
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    // Scroll event - throttled by requestAnimationFrame
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

  if (!isHydrated || shouldReduceMotion || isTouchDevice) {
    return null
  }

  // Calculate intensity based on scroll position (high to low)
  // Strongest in the hero segment (top), then fades to a subtle active trail towards the footer
  const maxFadeScroll = 1200
  const scrollRatio = Math.min(scrollY / maxFadeScroll, 1)
  const currentOpacity = 0.20 - scrollRatio * 0.14 // Fades from 0.20 to a minimum of 0.06
  const currentSize = 600 - scrollRatio * 250 // Size fades from 600px to a minimum of 350px

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <div
        className="absolute rounded-full blur-3xl ease-out pointer-events-none transition-[left,top,opacity,width,height] duration-[500ms]"
        style={{
          width: `${currentSize}px`,
          height: `${currentSize}px`,
          background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          opacity: currentOpacity,
          left: `${position.x - currentSize / 2}px`,
          top: `${position.y - currentSize / 2}px`,
        }}
      />
    </div>
  )
}
export default CursorGlow
