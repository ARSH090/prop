'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface MeshPoint {
  x: number
  y: number
  z: number
}

interface RingPoint {
  x: number
  y: number
  z: number
}

const generateMeshPoints = (): MeshPoint[] => {
  const points: MeshPoint[] = []
  const latCount = 10
  const lonCount = 28
  for (let i = 1; i < latCount; i++) {
    const lat = (i / latCount) * Math.PI - Math.PI / 2
    const sinLat = Math.sin(lat)
    const cosLat = Math.cos(lat)
    for (let j = 0; j < lonCount; j++) {
      const lon = (j / lonCount) * 2 * Math.PI
      const x = cosLat * Math.cos(lon)
      const z = cosLat * Math.sin(lon)
      const y = sinLat
      points.push({ x, y, z })
    }
  }
  return points
}

const generateRingPoints = (tiltX: number, tiltY: number): RingPoint[] => {
  const points: RingPoint[] = []
  const count = 64
  const cosTX = Math.cos(tiltX)
  const sinTX = Math.sin(tiltX)
  const cosTY = Math.cos(tiltY)
  const sinTY = Math.sin(tiltY)

  for (let i = 0; i <= count; i++) {
    const angle = (i / count) * 2 * Math.PI
    const cx = Math.cos(angle)
    const cy = Math.sin(angle)
    const cz = 0

    // Tilt around X
    const y1 = cy * cosTX - cz * sinTX
    const z1 = cy * sinTX + cz * cosTX

    // Tilt around Y
    const rx = cx * cosTY + z1 * sinTY
    const ry = y1
    const rz = -cx * sinTY + cz * cosTY

    points.push({ x: rx, y: ry, z: rz })
  }
  return points
}

interface FirmNode {
  id: string
  name: string
  logo_url?: string
  website_url?: string
  affiliate_url?: string
  // 3D coordinates on unit sphere
  x: number
  y: number
  z: number
  // Rotated coordinates
  rx: number
  ry: number
  rz: number
  // Screen projected coordinates
  sx: number
  sy: number
  // Indices of connected nodes
  connections: number[]
}

// Fallback firms to populate the globe if the database does not have enough active listings
const FALLBACK_FIRMS = [
  { id: 'ftmo', name: 'FTMO', logo_url: 'https://ftmo.com/wp-content/themes/ftmo-theme/images/ftmo_logo.svg' },
  { id: 'funding-pips', name: 'Funding Pips', logo_url: 'https://fundingpips.com/wp-content/uploads/2023/10/Logo.svg' },
  { id: 'gft-funding', name: 'GFT Funding', logo_url: '' },
  { id: 'topstep', name: 'Topstep', logo_url: 'https://www.topstep.com/wp-content/themes/topstep/assets/images/ts-logo-white.svg' },
  { id: '5ers', name: 'The 5%ers', logo_url: 'https://the5ers.com/wp-content/themes/the5ers/img/logo.svg' },
  { id: 'fundednext', name: 'FundedNext', logo_url: 'https://fundednext.com/wp-content/uploads/2023/07/fn-logo.svg' },
  { id: 'alpha-capital', name: 'Alpha Capital', logo_url: '' },
  { id: 'e8-funding', name: 'E8 Markets', logo_url: '' },
  { id: 'myfundedfx', name: 'MyFundedFX', logo_url: '' },
  { id: 'blue-guardian', name: 'Blue Guardian', logo_url: '' },
  { id: 'instant-funding', name: 'Instant Funding', logo_url: '' },
  { id: 'funded-trading-plus', name: 'Funded Trading Plus', logo_url: '' },
  { id: 'apex-trader', name: 'Apex Funding', logo_url: '' },
  { id: 'funded-academy', name: 'Funded Academy', logo_url: '' },
  { id: 'goat-funded', name: 'Goat Funded', logo_url: '' }
]

export function PropGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [nodes, setNodes] = useState<FirmNode[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Rotation parameters
  const angleRef = useRef({ x: -0.2, y: 0 })
  const rotationSpeedRef = useRef({ x: 0.001, y: 0.003 })
  const dragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 })
  const isHoveredRef = useRef<number | null>(null)

  const meshPointsRef = useRef<MeshPoint[]>([])
  const ringsRef = useRef<RingPoint[][]>([])

  if (meshPointsRef.current.length === 0) {
    meshPointsRef.current = generateMeshPoints()
    ringsRef.current = [
      generateRingPoints(0.6, 0.4),
      generateRingPoints(-0.5, 0.7),
      generateRingPoints(0.3, -0.9)
    ]
  }

  // Fetch firms and build the network
  useEffect(() => {
    async function loadFirms() {
      try {
        const response = await fetch('/api/firms?type=prop_firm')
        const data = await response.json()
        
        let fetchedFirms = data.firms || []
        
        // Remove inactive firms
        fetchedFirms = fetchedFirms.filter((f: any) => f.status === 'active')

        // Combine fetched firms with fallback firms to reach a visually pleasing density (e.g. 15 nodes)
        const combinedFirmsMap = new Map<string, { name: string; logo_url?: string; website_url?: string }>()
        
        fetchedFirms.forEach((f: any) => {
          combinedFirmsMap.set(f.name.toLowerCase(), {
            name: f.name,
            logo_url: f.logo_url,
            website_url: f.affiliate_url || f.website_url
          })
        })

        // Pad with fallbacks if needed
        let fallbackIndex = 0
        while (combinedFirmsMap.size < 15 && fallbackIndex < FALLBACK_FIRMS.length) {
          const fallback = FALLBACK_FIRMS[fallbackIndex]
          if (!combinedFirmsMap.has(fallback.name.toLowerCase())) {
            combinedFirmsMap.set(fallback.name.toLowerCase(), {
              name: fallback.name,
              logo_url: fallback.logo_url,
              website_url: `/firms/${fallback.id}`
            })
          }
          fallbackIndex++
        }

        const finalFirmsList = Array.from(combinedFirmsMap.values())
        const N = finalFirmsList.length

        // Generate Fibonacci sphere points
        const phi = Math.PI * (Math.sqrt(5) - 1) // Golden angle in radians
        const rawNodes: Omit<FirmNode, 'connections'>[] = []

        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2 // Goes from 1 to -1
          const radius = Math.sqrt(1 - y * y) // Radius at y

          const theta = phi * i

          const x = Math.cos(theta) * radius
          const z = Math.sin(theta) * radius

          rawNodes.push({
            id: `firm-${i}`,
            name: finalFirmsList[i].name,
            logo_url: finalFirmsList[i].logo_url,
            website_url: finalFirmsList[i].website_url,
            x,
            y,
            z,
            rx: x,
            ry: y,
            rz: z,
            sx: 0,
            sy: 0
          })
        }

        // Compute 5-6 connections per node (nearest in 3D space)
        const finalNodes: FirmNode[] = rawNodes.map((node, i) => {
          // Calculate 3D distances to all other nodes
          const distances = rawNodes
            .map((other, j) => {
              if (i === j) return { index: j, dist: Infinity }
              const dist = Math.sqrt(
                Math.pow(node.x - other.x, 2) +
                Math.pow(node.y - other.y, 2) +
                Math.pow(node.z - other.z, 2)
              )
              return { index: j, dist }
            })
            .sort((a, b) => a.dist - b.dist)

          // Connect to the 5 nearest neighbors
          const connections = distances.slice(0, 5).map(item => item.index)

          return {
            ...node,
            connections
          }
        })

        setNodes(finalNodes)
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load firms for globe:', error)
      }
    }

    loadFirms()
  }, [])

  // Animation Loop
  useEffect(() => {
    if (!isLoaded || nodes.length === 0) return

    let animationFrameId: number
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set high-DPI canvas resolution
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

    const animate = () => {
      // Rotation logic
      if (!dragRef.current.isDragging) {
        // Slow down when someone is hovering over any node
        const speedMultiplier = isHoveredRef.current !== null ? 0.1 : 1.0
        angleRef.current.y += rotationSpeedRef.current.y * speedMultiplier
        angleRef.current.x += rotationSpeedRef.current.x * speedMultiplier
      }

      const cosX = Math.cos(angleRef.current.x)
      const sinX = Math.sin(angleRef.current.x)
      const cosY = Math.cos(angleRef.current.y)
      const sinY = Math.sin(angleRef.current.y)

      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const cx = width / 2
      const cy = height / 2
      // Sphere radius relative to container size
      const R = Math.min(width, height) * 0.35

      // 1. Rotate & Project all nodes
      const updatedNodes = nodes.map(node => {
        // Rotate around X axis
        const y1 = node.y * cosX - node.z * sinX
        const z1 = node.y * sinX + node.z * cosX

        // Rotate around Y axis
        const rx = node.x * cosY + z1 * sinY
        const ry = y1
        const rz = -node.x * sinY + z1 * cosY

        // Perspective scaling
        const perspective = (rz + 2) / 2
        const sx = cx + rx * R
        const sy = cy + ry * R

        return {
          ...node,
          rx,
          ry,
          rz,
          sx,
          sy
        }
      })

      // Sync state for positioning HTML nodes
      setNodes(updatedNodes)

      // 2. Draw lines on Canvas
      ctx.clearRect(0, 0, width, height)

      // Draw background sphere dotted mesh
      meshPointsRef.current.forEach(pt => {
        // Rotate
        const y1 = pt.y * cosX - pt.z * sinX
        const z1 = pt.y * sinX + pt.z * cosX
        const rx = pt.x * cosY + z1 * sinY
        const ry = y1
        const rz = -pt.x * sinY + z1 * cosY

        // Project
        const sx = cx + rx * R
        const sy = cy + ry * R

        // Depth based opacity
        const depth = (rz + 1) / 2 // 0 to 1
        const opacity = 0.015 + 0.085 * depth

        ctx.fillStyle = `rgba(34, 211, 238, ${opacity})`
        ctx.fillRect(sx, sy, 1.2, 1.2)
      })

      // Draw orbital rings wrapping the sphere
      ringsRef.current.forEach((ring, ringIdx) => {
        ctx.beginPath()
        ring.forEach((pt, idx) => {
          // Rotate
          const y1 = pt.y * cosX - pt.z * sinX
          const z1 = pt.y * sinX + pt.z * cosX
          const rx = pt.x * cosY + z1 * sinY
          const ry = y1
          const rz = -pt.x * sinY + z1 * cosY

          // Project slightly larger than sphere radius
          const sx = cx + rx * R * 1.05
          const sy = cy + ry * R * 1.05

          if (idx === 0) {
            ctx.moveTo(sx, sy)
          } else {
            ctx.lineTo(sx, sy)
          }
        })
        ctx.strokeStyle = ringIdx === 0 
          ? 'rgba(34, 211, 238, 0.08)' // Cyan
          : ringIdx === 1 
          ? 'rgba(139, 92, 246, 0.06)' // Purple
          : 'rgba(59, 130, 246, 0.07)' // Blue
        ctx.lineWidth = 1.0
        ctx.stroke()
      })

      // Draw curved connections between nodes
      updatedNodes.forEach((node, i) => {
        const isNodeHoveredOrConnected = 
          isHoveredRef.current === i || 
          (isHoveredRef.current !== null && node.connections.includes(isHoveredRef.current)) ||
          (isHoveredRef.current !== null && updatedNodes[isHoveredRef.current]?.connections.includes(i))

        node.connections.forEach(targetIdx => {
          // Avoid double drawing
          if (targetIdx < i) return

          const target = updatedNodes[targetIdx]
          if (!target) return

          // Depth based opacity
          const avgZ = (node.rz + target.rz) / 2 // goes from -1 to 1
          let opacity = 0.06 + 0.14 * ((avgZ + 1) / 2) // Front lines are brighter

          // Highlight lines if connected to hovered node
          if (isHoveredRef.current !== null) {
            if (isNodeHoveredOrConnected) {
              opacity = 0.5 + 0.4 * ((avgZ + 1) / 2)
            } else {
              opacity *= 0.2 // fade non-related lines
            }
          }

          // Curved Bezier calculation (bends outwards from sphere center)
          const mx = (node.sx + target.sx) / 2
          const my = (node.sy + target.sy) / 2
          const vx = mx - cx
          const vy = my - cy
          const dist2d = Math.sqrt(Math.pow(node.sx - target.sx, 2) + Math.pow(node.sy - target.sy, 2))
          const len = Math.sqrt(vx * vx + vy * vy)

          const curvature = 0.20 * dist2d
          const ux = len > 0 ? vx / len : 0
          const uy = len > 0 ? vy / len : 0

          const cpx = mx + ux * curvature
          const cpy = my + uy * curvature

          ctx.beginPath()
          ctx.moveTo(node.sx, node.sy)
          ctx.quadraticCurveTo(cpx, cpy, target.sx, target.sy)

          // Line styling
          if (isHoveredRef.current !== null && isNodeHoveredOrConnected) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})` // Cyan
            ctx.lineWidth = 1.5
          } else {
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})` // Purple
            ctx.lineWidth = 0.8
          }

          ctx.stroke()
        })
      })

      // Draw outer atmosphere wireframe circle
      ctx.beginPath()
      ctx.arc(cx, cy, R + 10, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)'
      ctx.lineWidth = 1
      ctx.stroke()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isLoaded, nodes.length])

  // Mouse Drag to Rotate handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return
    const dx = e.clientX - dragRef.current.lastX
    const dy = e.clientY - dragRef.current.lastY

    angleRef.current.y += dx * 0.005
    angleRef.current.x += dy * 0.005

    // Clamp vertical rotation to avoid tumbling upside down
    angleRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, angleRef.current.x))

    dragRef.current.lastX = e.clientX
    dragRef.current.lastY = e.clientY
  }

  const handleMouseUpOrLeave = () => {
    dragRef.current.isDragging = false
  }

  // Handle Touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    dragRef.current = {
      isDragging: true,
      lastX: e.touches[0].clientX,
      lastY: e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.isDragging || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragRef.current.lastX
    const dy = e.touches[0].clientY - dragRef.current.lastY

    angleRef.current.y += dx * 0.005
    angleRef.current.x += dy * 0.005

    angleRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, angleRef.current.x))

    dragRef.current.lastX = e.touches[0].clientX
    dragRef.current.lastY = e.touches[0].clientY
  }

  // Get first letter for fallback badge
  const getAbbreviation = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] max-w-lg mx-auto overflow-visible select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUpOrLeave}
    >
      {/* 2D Canvas for connections */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* HTML elements for nodes */}
      {isLoaded && nodes.map((node, index) => {
        // Map depth rz [-1, 1] to scale and opacity
        const depth = (node.rz + 1) / 2 // 0 (back) to 1 (front)
        const scale = 0.65 + 0.45 * depth
        const opacity = 0.15 + 0.85 * depth
        const zIndex = Math.round(depth * 100) + 10

        const isHovered = index === hoveredIndex
        const isNeighborHovered = hoveredIndex !== null && 
          (node.connections.includes(hoveredIndex) || nodes[hoveredIndex]?.connections.includes(index))

        // Position offset to center node
        const size = 38
        const leftPos = node.sx - size / 2
        const topPos = node.sy - size / 2

        return (
          <a
            key={node.id}
            href={node.website_url}
            target={node.website_url?.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              left: `${leftPos}px`,
              top: `${topPos}px`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `scale(${isHovered ? scale * 1.25 : scale})`,
              opacity: hoveredIndex !== null && !isHovered && !isNeighborHovered ? opacity * 0.4 : opacity,
              zIndex: isHovered ? 200 : zIndex,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
            }}
            className="flex flex-col items-center justify-center"
            onMouseEnter={() => {
              setHoveredIndex(index)
              isHoveredRef.current = index
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
              isHoveredRef.current = null
            }}
          >
            {/* Glowing active outer ring */}
            <div 
              className={`relative rounded-full p-[2px] transition-all duration-300 ${
                isHovered 
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple shadow-[0_0_15px_rgba(34,211,238,0.6)] scale-110' 
                  : isNeighborHovered
                  ? 'bg-accent-purple/50'
                  : 'bg-border-subtle/80 hover:bg-border-subtle'
              }`}
            >
              {/* Node interior circular box */}
              <div className="w-8 h-8 rounded-full bg-[#0D1321] flex items-center justify-center overflow-hidden border border-border-subtle/50">
                {node.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={node.logo_url}
                    alt={node.name}
                    className="w-5 h-5 object-contain filter brightness-95 hover:brightness-100 transition-all"
                    onError={(e) => {
                      // Remove logo URL so it renders fallback abbreviation badge
                      const updated = [...nodes]
                      if (updated[index]) {
                        updated[index].logo_url = undefined
                        setNodes(updated)
                      }
                    }}
                  />
                ) : (
                  <span className="text-[9px] font-bold font-mono tracking-tighter text-accent-cyan">
                    {getAbbreviation(node.name)}
                  </span>
                )}
              </div>
            </div>

            {/* Label below the node */}
            <div 
              className={`absolute top-[42px] whitespace-nowrap px-1.5 py-0.5 rounded bg-bg-base/90 border border-border-subtle/30 text-[8px] font-mono font-bold uppercase tracking-wider text-text-primary transition-all duration-200 pointer-events-none ${
                isHovered 
                  ? 'opacity-100 translate-y-0 scale-105 text-accent-cyan border-accent-cyan/30' 
                  : depth < 0.4
                  ? 'opacity-0' // Hide names of nodes far in the background to avoid clutter
                  : 'opacity-70'
              }`}
            >
              {node.name}
            </div>
          </a>
        )
      })}
    </div>
  )
}
