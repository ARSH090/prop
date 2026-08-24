import React from 'react'
import { cn } from '@/lib/utils'

interface AFXCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'glass' | 'solid' | 'panel' | 'nested'
}

export const AFXCard = React.forwardRef<HTMLDivElement, AFXCardProps>(
  ({ className, variant = 'glass', ...props }, ref) => {
    const variantStyles = {
      glass:
        'bg-[#181d2a]/40 backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_0_16px_rgba(34,211,238,0.03)] rounded-3xl transition-all duration-300',
      solid:
        'bg-[#12131a] border border-white/[0.08] shadow-xl rounded-2xl transition-all duration-300',
      panel:
        'bg-[#181d2a]/60 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-3xl transition-all duration-300',
      nested:
        'bg-[#12131a] hover:bg-[#161822] border border-white/[0.08] hover:border-accent-cyan/30 shadow-lg rounded-2xl transition-all duration-300',
    }

    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], 'p-5 sm:p-6', className)}
        {...props}
      />
    )
  }
)

AFXCard.displayName = 'AFXCard'
