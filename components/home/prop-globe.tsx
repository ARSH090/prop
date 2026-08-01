'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FirmLink } from '@/components/ui/firm-link'
import { getCleanLogoUrl } from '@/lib/utils/logo-url'

interface SlotConfig {
  id: string
  left: string
  top: string
  animDelay: string
  animDuration: string
  pathD: string
  defaultColor: string
  defaultName: string
  defaultFullName: string
  defaultHref: string
  defaultRender: () => React.ReactNode
}

const SLOTS: SlotConfig[] = [
  {
    id: 'slot-gft',
    left: '12%',
    top: '15%',
    animDelay: '0s',
    animDuration: '4.2s',
    pathD: "M 210 210 Q 140 180 95 110",
    defaultColor: '#00D2FF',
    defaultName: 'GFT',
    defaultFullName: 'GFT Funding',
    defaultHref: '/firms/gft-funding',
    defaultRender: () => (
      <span className="text-[17px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 filter drop-shadow-[0_0_6px_#00D2FF] font-sans">
        GFT
      </span>
    )
  },
  {
    id: 'slot-ftmo',
    left: '68%',
    top: '10%',
    animDelay: '0.8s',
    animDuration: '4.6s',
    pathD: "M 290 190 Q 340 130 350 85",
    defaultColor: '#FF4E00',
    defaultName: 'FTMO',
    defaultFullName: 'FTMO',
    defaultHref: '/firms/ftmo',
    defaultRender: () => (
      <div className="flex items-center gap-0.5 filter drop-shadow-[0_0_8px_rgba(255,78,0,0.6)]">
        <span className="text-[10px] text-white">♦</span>
        <span className="text-[13px] font-black tracking-tighter text-white font-mono uppercase">
          FTMO
        </span>
      </div>
    )
  },
  {
    id: 'slot-top1',
    left: '82%',
    top: '46%',
    animDelay: '1.5s',
    animDuration: '5.2s',
    pathD: "M 330 260 Q 400 240 420 245",
    defaultColor: '#FFD700',
    defaultName: 'TOP1',
    defaultFullName: 'Topstep',
    defaultHref: '/firms/topstep',
    defaultRender: () => (
      <span className="text-[14px] font-black tracking-widest text-[#FFD700] filter drop-shadow-[0_0_8px_rgba(255,215,0,0.7)] font-sans">
        TOP<span className="text-white font-black text-[16px]">1</span>
      </span>
    )
  },
  {
    id: 'slot-mff',
    left: '66%',
    top: '78%',
    animDelay: '2.2s',
    animDuration: '4.4s',
    pathD: "M 285 305 Q 330 350 345 395",
    defaultColor: '#FF007F',
    defaultName: 'MFF',
    defaultFullName: 'MyFundedFutures',
    defaultHref: '/firms/myfundedfutures',
    defaultRender: () => (
      <span className="text-[15px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 filter drop-shadow-[0_0_8px_rgba(255,0,127,0.7)] font-sans">
        MFF
      </span>
    )
  },
  {
    id: 'slot-pips',
    left: '24%',
    top: '82%',
    animDelay: '1.2s',
    animDuration: '4.8s',
    pathD: "M 215 310 Q 150 360 155 410",
    defaultColor: '#8A2BE2',
    defaultName: 'PIPS',
    defaultFullName: 'Funding Pips',
    defaultHref: '/firms/funding-pips',
    defaultRender: () => (
      <span className="text-[14px] font-black tracking-wider text-purple-300 filter drop-shadow-[0_0_6px_rgba(138,43,226,0.7)] font-mono">
        PIPS
      </span>
    )
  },
  {
    id: 'slot-e8',
    left: '3%',
    top: '52%',
    animDelay: '0.5s',
    animDuration: '3.8s',
    pathD: "M 175 260 Q 90 280 50 270",
    defaultColor: '#00FF66',
    defaultName: 'E8',
    defaultFullName: 'E8 Markets',
    defaultHref: '/firms/e8-markets',
    defaultRender: () => (
      <span className="text-[18px] font-black tracking-tighter text-[#00FF66] filter drop-shadow-[0_0_8px_rgba(0,255,102,0.7)] font-mono">
        E8
      </span>
    )
  }
]

function getGlowColor(color: string, alpha: number = 0.45) {
  if (color.startsWith('#')) {
    try {
      const cleanHex = color.replace('#', '')
      const r = parseInt(cleanHex.substring(0, 2), 16)
      const g = parseInt(cleanHex.substring(2, 4), 16)
      const b = parseInt(cleanHex.substring(4, 6), 16)
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
    } catch (e) {
      // ignore
    }
  }
  return color
}

interface PropGlobeProps {
  globeFirms?: any[]
}

export function PropGlobe({ globeFirms = [] }: PropGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null)

  // 3D rotation variables for the central holographic Earth grid
  const angleRef = useRef({ x: 0.35, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationFrameId: number

    const animate = () => {
      // Rotate the globe continuously
      angleRef.current.y += 0.003
      angleRef.current.x = 0.3 + Math.sin(Date.now() * 0.0005) * 0.1 // subtle oscillation

      const cosX = Math.cos(angleRef.current.x)
      const sinX = Math.sin(angleRef.current.x)
      const cosY = Math.cos(angleRef.current.y)
      const sinY = Math.sin(angleRef.current.y)

      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.28 // sphere radius

      ctx.clearRect(0, 0, w, h)

      // 1. Draw glowing sphere atmospheric core gradient
      const coreGlow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.1)
      coreGlow.addColorStop(0, 'rgba(34, 211, 238, 0.18)')
      coreGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.06)')
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = coreGlow
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.1, 0, 2 * Math.PI)
      ctx.fill()

      // 2. Draw 3D grid lines (Latitude parallels)
      const parallels = 9
      for (let i = 1; i < parallels; i++) {
        ctx.beginPath()
        const latAngle = (i / parallels) * Math.PI - Math.PI / 2
        const cosLat = Math.cos(latAngle)
        const sinLat = Math.sin(latAngle)

        for (let j = 0; j <= 60; j++) {
          const lonAngle = (j / 60) * 2 * Math.PI
          // coordinates on unit sphere
          const x = cosLat * Math.cos(lonAngle)
          const z = cosLat * Math.sin(lonAngle)
          const y = sinLat

          // 3D rotation
          const y1 = y * cosX - z * sinX
          const z1 = y * sinX + z * cosX
          const rx = x * cosY + z1 * sinY
          const ry = y1
          const rz = -x * sinY + z1 * cosY

          // Projection
          const sx = cx + rx * R
          const sy = cy + ry * R

          if (j === 0) {
            ctx.moveTo(sx, sy)
          } else {
            ctx.lineTo(sx, sy)
          }
        }
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.09)'
        ctx.lineWidth = 0.9
        ctx.stroke()
      }

      // 3. Draw 3D grid lines (Longitude meridians)
      const meridians = 12
      for (let i = 0; i < meridians; i++) {
        ctx.beginPath()
        const lonAngle = (i / meridians) * 2 * Math.PI

        for (let j = 0; j <= 40; j++) {
          const latAngle = (j / 40) * Math.PI - Math.PI / 2
          const x = Math.cos(latAngle) * Math.cos(lonAngle)
          const z = Math.cos(latAngle) * Math.sin(lonAngle)
          const y = Math.sin(latAngle)

          const y1 = y * cosX - z * sinX
          const z1 = y * sinX + z * cosX
          const rx = x * cosY + z1 * sinY
          const ry = y1
          const rz = -x * sinY + z1 * cosY

          const sx = cx + rx * R
          const sy = cy + ry * R

          if (j === 0) {
            ctx.moveTo(sx, sy)
          } else {
            ctx.lineTo(sx, sy)
          }
        }
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.09)'
        ctx.lineWidth = 0.9
        ctx.stroke()
      }

      // 4. Draw atmospheric wireframe borders
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Glow atmosphere ring outer
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.05, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Build custom nodes mapped to each slot
  const bubbles = SLOTS.map((slot, index) => {
    const firm = globeFirms[index]
    if (firm) {
      const color = firm.color || firm.globe_color || slot.defaultColor
      const glowColor = getGlowColor(color, 0.45)
      
      const renderLogo = () => {
        const logoUrl = getCleanLogoUrl(firm.name, firm.globe_logo_url || firm.logo_url)
        if (logoUrl) {
          return (
            <img 
              src={logoUrl} 
              alt={firm.name} 
              className="max-h-[60%] max-w-[60%] object-contain filter brightness-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] animate-fade-in"
              onError={(e) => {
                const parent = (e.target as HTMLImageElement).parentElement
                if (parent) {
                  parent.innerHTML = `<span class="text-[14px] font-black tracking-tight text-transparent bg-clip-text filter drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] font-sans uppercase" style="background-image: linear-gradient(to right, ${color}, #ffffff)">${firm.name.substring(0, 4)}</span>`
                }
              }}
            />
          )
        }
        return (
          <span 
            className="text-[14px] font-black tracking-tight text-transparent bg-clip-text filter drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] font-sans uppercase"
            style={{ backgroundImage: `linear-gradient(to right, ${color}, #ffffff)` }}
          >
            {firm.name.substring(0, 4)}
          </span>
        )
      }

      return {
        id: firm.id,
        name: firm.name,
        color,
        glowColor,
        left: slot.left,
        top: slot.top,
        animDelay: slot.animDelay,
        animDuration: slot.animDuration,
        href: `/firms/${firm.slug}`,
        pathD: slot.pathD,
        renderLogo
      }
    } else {
      // Use slot default settings
      const color = slot.defaultColor
      const glowColor = getGlowColor(color, 0.45)
      return {
        id: slot.id,
        name: slot.defaultName,
        color,
        glowColor,
        left: slot.left,
        top: slot.top,
        animDelay: slot.animDelay,
        animDuration: slot.animDuration,
        href: slot.defaultHref,
        pathD: slot.pathD,
        renderLogo: slot.defaultRender
      }
    }
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] xs:h-[360px] sm:h-[420px] md:h-[480px] max-w-[480px] mx-auto select-none flex items-center justify-center overflow-visible"
    >
      {/* 2D Canvas for spinning central Earth grid */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* SVG layer for orbit paths connecting nodes to central globe */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 500">
        <defs>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global orbital rings matching the image structure */}
        <ellipse
          cx="250"
          cy="250"
          rx="210"
          ry="110"
          fill="none"
          stroke="rgba(34, 211, 238, 0.15)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          transform="rotate(-20 250 250)"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="225"
          ry="95"
          fill="none"
          stroke="rgba(139, 92, 246, 0.1)"
          strokeWidth="1"
          transform="rotate(35 250 250)"
        />

        {/* Connective curves to bubble centers */}
        {bubbles.map((b) => (
          <path
            key={`path-${b.id}`}
            d={b.pathD}
            fill="none"
            stroke={hoveredBubble === b.id ? b.color : getGlowColor(b.color, 0.25)}
            strokeWidth={hoveredBubble === b.id ? '1.8' : '1.0'}
            strokeDasharray={hoveredBubble === b.id ? 'none' : '4 4'}
            className="transition-all duration-300"
            filter={hoveredBubble === b.id ? 'url(#glow-cyan)' : undefined}
          />
        ))}
      </svg>

      {/* Interactive float-animated glass spheres */}
      {bubbles.map((b) => {
        return (
          <FirmLink
            key={b.id}
            firm={{ slug: b.href }}
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              animation: `float ${b.animDuration} ease-in-out infinite`,
              animationDelay: b.animDelay,
              zIndex: 30,
            }}
            onMouseEnter={() => setHoveredBubble(b.id)}
            onMouseLeave={() => setHoveredBubble(null)}
            className="group cursor-pointer select-none animate-float"
          >
            {/* Realistic 3D Glass Bubble Container */}
            <div
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 60%, rgba(0, 0, 0, 0.6) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: hoveredBubble === b.id ? `
                  inset 0 12px 18px rgba(255, 255, 255, 0.28),
                  inset -6px -6px 14px rgba(0, 0, 0, 0.5),
                  inset 0 0 4px rgba(255, 255, 255, 0.2),
                  0 0 35px ${b.color}
                ` : `
                  inset 0 12px 18px rgba(255, 255, 255, 0.22),
                  inset -6px -6px 14px rgba(0, 0, 0, 0.5),
                  inset 0 0 4px rgba(255, 255, 255, 0.1),
                  0 0 18px ${b.glowColor}
                `,
              }}
              className="w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-full border border-white/20 hover:border-white/50 flex flex-col items-center justify-center relative transition-all duration-300 group-hover:scale-110"
            >
              {/* Highlight refraction sheen gloss */}
              <div className="absolute top-1.5 left-2.5 w-4 h-2 bg-white/35 rounded-full rotate-[-15deg] blur-[0.4px] pointer-events-none" />
              <div className="absolute bottom-1 right-2.5 w-2 h-1 bg-white/10 rounded-full rotate-[35deg] blur-[0.6px] pointer-events-none" />

              {/* Styled neon brand logo inside */}
              <div className="flex items-center justify-center w-full h-full relative z-10">
                {b.renderLogo()}
              </div>
            </div>

            {/* Glowing neon halo indicator below bubble */}
            <div
              style={{ backgroundColor: b.color }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full opacity-0 group-hover:opacity-60 transition-opacity blur-[1.5px]"
            />
          </FirmLink>
        )
      })}
    </div>
  )
}
