'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-text-secondary min-h-[400px]">
      Loading 3D visualization...
    </div>
  ),
})

export function Hero3D() {
  const [shouldRender3D, setShouldRender3D] = useState(false)

  useEffect(() => {
    // 1. Mobile check
    const isMobile = window.innerWidth < 768
    // 2. Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // 3. WebGL capability check
    let hasWebGL = false
    try {
      const canvas = document.createElement('canvas')
      hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
    } catch (e) {
      hasWebGL = false
    }

    if (!isMobile && !prefersReducedMotion && hasWebGL) {
      setShouldRender3D(true)
    }
  }, [])

  if (!shouldRender3D) {
    // Fallback static graphic: sleek gradient blur orb matching the theme
    return (
      <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-accent-cyan/10 to-accent-purple/20 blur-3xl animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full bg-accent-blue/5 blur-2xl" />
        <div className="relative border border-border-subtle/50 bg-bg-card/40 rounded-[24px] p-8 backdrop-blur-md text-center max-w-sm">
          <div className="text-accent-cyan font-bold tracking-wider text-sm mb-2 font-mono">
            ★ INTELLIGENT DECK
          </div>
          <div className="text-text-secondary text-xs">
            Static fallback loaded. Interactive 3D graphics require desktop and WebGL.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Hero3DCanvas />
    </div>
  )
}
