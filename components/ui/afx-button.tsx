import React from 'react'
import { cn } from '@/lib/utils'

interface AFXButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const AFXButton = React.forwardRef<HTMLButtonElement, AFXButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'font-semibold transition-all duration-200 rounded-[12px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] active:duration-100'

    const variantStyles = {
      primary: 'bg-gradient-cta text-white border-0 shadow-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02]',
      secondary: 'bg-white/[0.03] border border-white/10 text-text-primary hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:text-white',
      ghost: 'bg-transparent text-text-primary border border-transparent hover:border-white/10 hover:bg-white/[0.05] hover:text-accent-cyan',
    }

    const sizeStyles = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    )
  }
)

AFXButton.displayName = 'AFXButton'

