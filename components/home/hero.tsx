'use client'

import { AFXButton } from '@/components/ui/afx-button'
import { AFXBadge } from '@/components/ui/afx-badge'
import Link from 'next/link'
import { FirmLink } from '@/components/ui/firm-link'
import { useEffect, useRef, useState } from 'react'
import { InteractiveGlobe } from '@/components/ui/interactive-globe'
import { PropGlobe } from '@/components/home/prop-globe'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

interface HeroProps {
  headlinePart1?: string
  headlinePart2?: string
  subtext?: string
  ctaExplore?: string
  ctaBrokers?: string
  discordUrl?: string
  marqueeFirms?: any[]
  globeFirms?: any[]
}

// Neon cursor-aware glow background component
function NeonBackground() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl animate-pulse top-1/4 left-1/4"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
      />
      <div className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl animate-pulse bottom-1/4 right-1/4"
        style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', animationDelay: '1s' }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neon-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neon-grid)" />
        </svg>
      </div>

      {/* Floating neon particles */}
      {isHydrated && [...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 3 === 0 ? '#22D3EE' : i % 3 === 1 ? '#8B5CF6' : '#3B82F6',
            left: `${10 + (i * 7.3) % 80}%`,
            top: `${10 + (i * 5.7) % 80}%`,
            opacity: 0.4 + (i % 3) * 0.2,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + (i % 3)}s`,
            boxShadow: `0 0 ${4 + i}px currentColor`,
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection({
  headlinePart1 = 'EMPIRIAL',
  headlinePart2 = 'Building Empires',
  subtext = 'Compare prop firms, grab verified discount codes, and access our trading community—all in one command center for Indian traders.',
  ctaExplore = 'Explore Firms',
  ctaBrokers = 'Join Discord',
  discordUrl = 'https://discord.gg/empirial',
  marqueeFirms = [],
  globeFirms = [],
}: HeroProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-[auto] md:min-h-screen bg-transparent overflow-hidden pt-28 pb-24 md:pb-24 flex items-center">
      {/* Dynamic Neon Background with subtle parallax */}
      <div style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }} className="absolute inset-0 pointer-events-none">
        <NeonBackground />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="afx-gradient-heading">{headlinePart1}</span>
              <br />
              <span className="text-white">{headlinePart2}</span>
            </h1>

            <p className="text-text-secondary text-lg md:text-xl max-w-md leading-relaxed">
              {subtext}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/firms">
                <AFXButton
                  variant="primary"
                  size="lg"
                  className="font-black px-8 py-3.5 text-base shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                >
                  {ctaExplore}
                </AFXButton>
              </Link>
              <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                <AFXButton
                  variant="glass"
                  size="lg"
                  className="px-8 font-extrabold text-white bg-white/[0.08] backdrop-blur-xl border border-white/20 hover:border-[#EC4899] hover:bg-[#EC4899]/20 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  {ctaBrokers}
                </AFXButton>
              </a>
            </div>

            {/* Quick Stats with Full Pink Box Cards suited for Blue BG */}
            <div className="grid grid-cols-3 gap-3.5 pt-4 max-w-md">
              {[
                { label: 'Prop Firms', value: '60+', bg: 'bg-gradient-to-br from-[#EC4899] to-[#c026d3]' },
                { label: 'Active Codes', value: '150+', bg: 'bg-gradient-to-br from-[#d946ef] to-[#9333ea]' },
                { label: 'Traders', value: '50K+', bg: 'bg-gradient-to-br from-[#EC4899] to-[#06b6d4]' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`text-center p-3.5 rounded-2xl ${stat.bg} text-white shadow-[0_4px_20px_rgba(236,72,153,0.3)] border border-white/20 hover:scale-105 transition-all duration-300 group`}
                >
                  <p className="text-2xl font-black font-numeric text-white group-hover:scale-105 transition-transform drop-shadow-md">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-white/90 font-black uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - 21st.dev 3D Interactive Globe Visual with subtle parallax */}
          <div
            style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
            className="h-[320px] xs:h-[360px] sm:h-[420px] md:h-[500px] lg:h-[540px] flex items-center justify-center relative transition-transform duration-75 ease-out w-full"
          >
            <div className="relative w-full h-full max-w-[500px] max-h-[500px] flex items-center justify-center">
              {/* Outer neon ring */}
              <div className="absolute w-72 h-72 rounded-full border border-accent-cyan/20 animate-spin pointer-events-none" style={{ animationDuration: '25s' }} />
              <div className="absolute w-56 h-56 rounded-full border border-accent-purple/20 animate-spin pointer-events-none" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />

              {/* Glow orbs */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-accent-cyan/15 via-accent-purple/15 to-transparent blur-3xl animate-pulse pointer-events-none" />

              {/* 21st.dev Interactive Globe Component */}
              <InteractiveGlobe className="w-full h-full z-10" globeFirms={globeFirms} />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

