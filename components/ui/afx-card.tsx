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
          'rounded-[16px] border border-border-subtle bg-bg-card p-6',
          glass && 'backdrop-blur-sm bg-opacity-80',
          className
        )}
        {...props}
      />
    )
  }
)

AFXCard.displayName = 'AFXCard'
