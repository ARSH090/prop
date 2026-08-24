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
    // Suppress benign IndexedDB connection closing errors during dev HMR/navigation
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason
      const message = typeof reason === 'string' ? reason : reason?.message || ''
      if (
        message.includes('The database connection is closing') ||
        message.includes("Failed to execute 'transaction' on 'IDBDatabase'") ||
        message.includes('IDBDatabase')
      ) {
        event.preventDefault()
      }
    }

    const handleError = (event: ErrorEvent) => {
      const message = event?.message || ''
      if (
        message.includes('The database connection is closing') ||
        message.includes("Failed to execute 'transaction' on 'IDBDatabase'")
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

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

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className="sparkling-stars fixed inset-0 pointer-events-none overflow-hidden z-0">
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
