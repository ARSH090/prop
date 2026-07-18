'use client'

import { AFXButton } from '@/components/ui/afx-button'
import { AFXBadge } from '@/components/ui/afx-badge'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface HeroProps {
  headlinePart1?: string
  headlinePart2?: string
  subtext?: string
  ctaExplore?: string
  ctaBrokers?: string
}

// Neon cursor-aware glow background component
function NeonBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient blobs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          left: isHydrated ? `calc(${mousePos.x}% - 300px)` : '-200px',
          top: isHydrated ? `calc(${mousePos.y}% - 300px)` : '-200px',
        }}
      />
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
  headlinePart1 = 'ANURAJ FX',
  headlinePart2 = 'Trade Intelligence',
  subtext = 'Compare prop firms, grab verified discount codes, and access regulated brokers—all in one command center for Indian traders.',
  ctaExplore = 'Explore Firms',
  ctaBrokers = 'Get Broker Links',
}: HeroProps) {
  return (
    <section className="relative min-h-screen bg-bg-base overflow-hidden pt-20 flex items-center">
      {/* Dynamic Neon Background */}
      <NeonBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-flex">
              <AFXBadge variant="live">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse mr-1.5"></span>
                LIVE DESK ACTIVE
              </AFXBadge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
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
                  className="bg-gradient-to-r from-accent-cyan to-accent-blue font-bold px-8 hover:shadow-lg hover:shadow-accent-cyan/20 transition-all"
                >
                  {ctaExplore}
                </AFXButton>
              </Link>
              <Link href="/brokers">
                <AFXButton
                  variant="secondary"
                  size="lg"
                  className="border-accent-purple/40 hover:border-accent-purple/80 hover:bg-accent-purple/10 px-8 text-white font-medium transition-all"
                >
                  {ctaBrokers}
                </AFXButton>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 pt-4">
              {[
                { label: 'Prop Firms', value: '60+' },
                { label: 'Active Codes', value: '150+' },
                { label: 'Traders', value: '50K+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold font-mono text-accent-cyan">{stat.value}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Neon Orb Visual */}
          <div className="h-[400px] md:h-[500px] flex items-center justify-center relative">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Outer neon ring */}
              <div className="absolute w-72 h-72 rounded-full border border-accent-cyan/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute w-56 h-56 rounded-full border border-accent-purple/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

              {/* Glow orbs */}
              <div className="absolute w-60 h-60 rounded-full bg-gradient-to-br from-accent-cyan/15 to-accent-purple/20 blur-2xl animate-pulse" />

              {/* Center card */}
              <div className="relative border border-border-subtle/60 bg-bg-card/60 rounded-3xl p-8 backdrop-blur-xl text-center max-w-xs shadow-2xl shadow-accent-cyan/5">
                <div className="text-accent-cyan font-bold tracking-wider text-sm mb-3 font-mono">
                  ⚡ INTELLIGENCE DECK
                </div>
                <div className="space-y-3 text-left">
                  {[
                    { label: 'XAUUSD', value: '$2,418', change: '+0.45%', up: true },
                    { label: 'NQ Futures', value: '18,450', change: '+1.23%', up: true },
                    { label: 'EURUSD', value: '1.0856', change: '-0.12%', up: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border-subtle/30 last:border-0">
                      <span className="text-xs text-text-muted font-mono">{item.label}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-text-primary font-mono block">{item.value}</span>
                        <span className={`text-[10px] font-mono ${item.up ? 'text-accent-green' : 'text-red-400'}`}>{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[10px] text-text-muted font-mono opacity-60">Powered by ANURAJ FX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
