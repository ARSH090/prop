'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
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
      className="p-2 hover:bg-bg-surface/50 rounded-xl transition-all border border-border-subtle bg-bg-base/30 text-accent-cyan"
      title="Copy code"
    >
      {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}
export default CopyButton
