'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function GlobeWithParticles() {
  const globeRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 0.3,
        y: -(e.clientY / window.innerHeight - 0.5) * 0.3,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create random points inside a sphere representing connections
  const [positions] = useState(() => {
    const arr = new Float32Array(250 * 3)
    for (let i = 0; i < 250; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 1.8 + Math.random() * 0.4
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  })

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08
      // Smooth interpolation for mouse parallax
      globeRef.current.rotation.x = THREE.MathUtils.lerp(globeRef.current.rotation.x, mouse.y, 0.05)
      globeRef.current.rotation.y = THREE.MathUtils.lerp(globeRef.current.rotation.y, globeRef.current.rotation.y + mouse.x * 0.1, 0.05)
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.04
    }
  })

  return (
    <group>
      {/* Wireframe Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.6, 20, 20]} />
        <meshBasicMaterial
          color="#22D3EE"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Orbiting particles */}
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#8B5CF6"
          size={0.07}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  )
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 4.5], fof: 60 } as any}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <GlobeWithParticles />
      </Canvas>
    </div>
  )
}
