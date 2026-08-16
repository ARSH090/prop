'use client'

import React, { useEffect, useState } from 'react'

interface Star {
  id: number
  top: number
  left: number
  size: number
  duration: number
  delay: number
}

export function SparklingStars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generate 45 random stars with random placements, sizes, delays, and durations
    const generatedStars = Array.from({ length: 45 }).map((_, idx) => ({
      id: idx,
      top: Math.random() * 100, // percentage
      left: Math.random() * 100, // percentage
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 4 + 3, // 3s to 7s
      delay: Math.random() * 5, // 0s to 5s
    }))
    setStars(generatedStars)
  }, [])

  return (
    <div className="sparkling-stars fixed inset-0 pointer-events-none overflow-hidden z-20">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-40 blur-[0.5px] pointer-events-none"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: star.size > 2 ? '0 0 6px rgba(255, 255, 255, 0.8)' : 'none',
            animation: `twinkle ${star.duration}s infinite ease-in-out`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.7);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  )
}

export default SparklingStars
