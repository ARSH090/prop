'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  delay?: number // ms initial delay
  staggerChildren?: boolean // if true, adds staggered delays to direct children
  staggerDelay?: number // ms stagger step (40-60ms default 50ms)
  maxStaggerCount?: number // cap at 8 items
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  staggerChildren = false,
  staggerDelay = 50,
  maxStaggerCount = 8,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target) // Trigger ONCE per session
        }
      },
      {
        threshold: 0.15, // Trigger at 15% viewport intersection
        rootMargin: '0px 0px -50px 0px',
      }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Apply stagger delay inline to children if enabled
  useEffect(() => {
    if (!staggerChildren || !isVisible || !ref.current) return

    const childElements = Array.from(ref.current.children) as HTMLElement[]
    childElements.forEach((child, index) => {
      const clampedIndex = Math.min(index, maxStaggerCount - 1)
      const childDelay = delay + clampedIndex * staggerDelay
      child.style.transition = `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${childDelay}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${childDelay}ms`
      child.style.opacity = '1'
      child.style.transform = 'translateY(0px)'
    })
  }, [staggerChildren, isVisible, delay, staggerDelay, maxStaggerCount])

  if (staggerChildren) {
    return (
      <div
        ref={ref}
        className={cn(
          '[&>*]:opacity-0',
          !prefersReducedMotion && '[&>*]:translate-y-3',
          '[&>*]:will-change-[transform,opacity]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform',
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0',
        !prefersReducedMotion && !isVisible && 'translate-y-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
