import React from 'react'
import { cn } from '@/lib/utils'

interface AFXBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'live' | 'code' | 'info' | 'success'
  children: React.ReactNode
}

export const AFXBadge = React.forwardRef<HTMLDivElement, AFXBadgeProps>(
  ({ className, variant = 'info', ...props }, ref) => {
    const variantStyles = {
      live: 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-green/25 border border-accent-green/50 text-white font-semibold shadow-sm',
      code: 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-cyan/25 border border-accent-cyan/50 text-white font-semibold shadow-sm',
      info: 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-blue/25 border border-accent-blue/50 text-white font-semibold shadow-sm',
      success: 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-green/25 border border-accent-green/50 text-white font-semibold shadow-sm',
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
