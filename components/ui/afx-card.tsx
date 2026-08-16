import React from 'react'
import { cn } from '@/lib/utils'

interface AFXCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glass?: boolean
}

export const AFXCard = React.forwardRef<HTMLDivElement, AFXCardProps>(
  ({ className, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md p-6 shadow-2xl transition-all duration-300',
          className
        )}
        {...props}
      />
    )
  }
)

AFXCard.displayName = 'AFXCard'
