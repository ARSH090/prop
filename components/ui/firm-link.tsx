import React from 'react'
import Link from 'next/link'

interface FirmLinkProps extends React.HTMLAttributes<HTMLElement> {
  firm: { slug: string; name?: string }
  className?: string
  children?: React.ReactNode
}

export function FirmLink({ firm, className, children, style, onMouseEnter, onMouseLeave, ...rest }: FirmLinkProps) {
  if (!firm || !firm.slug) {
    return (
      <span className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...rest}>
        {children || firm?.name || ''}
      </span>
    )
  }
  
  if (firm.slug.startsWith('/') || firm.slug.startsWith('http')) {
    return (
      <Link href={firm.slug} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...(rest as any)}>
        {children}
      </Link>
    )
  }

  return (
    <Link href={`/firms/${firm.slug}`} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...(rest as any)}>
      {children}
    </Link>
  )
}
