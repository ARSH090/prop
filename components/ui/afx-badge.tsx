import React from 'react'
import { cn } from '@/lib/utils'

interface AFXBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'live' | 'code' | 'info' | 'success'
  children: React.ReactNode
}

export const AFXBadge = React.forwardRef<HTMLDivElement, AFXBadgeProps>(
  ({ className, variant = 'info', ...props }, ref) => {
    const variantStyles = {
      live: 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green',
      code: 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan',
      info: 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue',
      success: 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green',
    }

    return (
      <div
        ref={ref}
        className={cn('text-xs font-semibold', variantStyles[variant], className)}
        {...props}
      />
    )
  }
)

AFXBadge.displayName = 'AFXBadge'
