import React from 'react'
import { cn } from '@/lib/utils'

interface AFXButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const AFXButton = React.forwardRef<HTMLButtonElement, AFXButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'font-semibold transition-all duration-200 rounded-[12px] border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary: 'text-white hover:opacity-90',
      secondary: 'bg-transparent border border-border-subtle text-text-primary hover:bg-bg-surface',
      ghost: 'bg-transparent text-text-primary hover:text-accent-cyan',
    }

    const sizeStyles = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    }

    const gradientStyle = variant === 'primary' ? {
      background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
    } : {}

    return (
      <button
        ref={ref}
        style={gradientStyle}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    )
  }
)

AFXButton.displayName = 'AFXButton'
