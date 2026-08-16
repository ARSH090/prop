'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
  showTextLabel?: boolean
}

export function CopyButton({ text, className, showTextLabel = true }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none',
        copied
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 scale-[1.08] shadow-[0_0_16px_rgba(34,197,94,0.35)]'
          : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/20 hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      title="Copy code"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-50 duration-150" />
          {showTextLabel && <span className="font-extrabold animate-in fade-in duration-150">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {showTextLabel && <span>Copy Code</span>}
        </>
      )}
    </button>
  )
}
export default CopyButton

