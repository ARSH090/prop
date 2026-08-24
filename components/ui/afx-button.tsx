import React from 'react'
import { cn } from '@/lib/utils'

interface AFXButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'cyan-glass'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const AFXButton = React.forwardRef<HTMLButtonElement, AFXButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles =
      'relative isolate inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] outline-none overflow-hidden'

    const variantStyles = {
      primary:
        'bg-gradient-cta text-black font-black border-0 shadow-[0_0_15px_rgba(34,211,238,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:scale-[1.02] active:scale-[0.98]',
      secondary:
        'bg-white/[0.04] backdrop-blur-lg border border-white/[0.12] text-text-primary hover:border-accent-cyan/50 hover:bg-accent-cyan/10 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]',
      ghost:
        'bg-transparent text-text-primary border border-transparent hover:border-white/10 hover:bg-white/[0.06] hover:text-accent-cyan',
      glass:
        'bg-white/[0.06] backdrop-blur-xl border border-white/[0.18] text-white hover:bg-white/[0.12] hover:border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)]',
      'cyan-glass':
        'bg-accent-cyan/15 backdrop-blur-xl border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/25 hover:border-accent-cyan/60 shadow-[0_0_20px_rgba(34,211,238,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    }

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base',
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
