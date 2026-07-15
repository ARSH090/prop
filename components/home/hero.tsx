'use client'

import { AFXButton } from '@/components/ui/afx-button'
import { AFXBadge } from '@/components/ui/afx-badge'
import Link from 'next/link'
import { Hero3D } from './Hero3D'

interface HeroProps {
  headlinePart1?: string
  headlinePart2?: string
  subtext?: string
  ctaExplore?: string
  ctaBrokers?: string
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
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

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
                  className="bg-gradient-to-r from-accent-cyan to-accent-blue font-bold px-8"
                >
                  {ctaExplore}
                </AFXButton>
              </Link>
              <Link href="/brokers">
                <AFXButton
                  variant="secondary"
                  size="lg"
                  className="border-accent-purple/40 hover:border-accent-purple/80 hover:bg-accent-purple/10 px-8 text-white font-medium"
                >
                  {ctaBrokers}
                </AFXButton>
              </Link>
            </div>
          </div>

          {/* Right Column - Interactive 3D Globe Visual */}
          <div className="h-[400px] md:h-[500px] flex items-center justify-center relative">
            <Hero3D />
          </div>
        </div>
      </div>
    </section>
  )
}
