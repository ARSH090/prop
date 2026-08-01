import React from 'react'
import Link from 'next/link'

interface ChallengeLinkProps {
  challenge?: { firm_slug?: string; firm_id?: string }
  firmSlug?: string
  className?: string
  children?: React.ReactNode
}

export function ChallengeLink({ challenge, firmSlug, className, children }: ChallengeLinkProps) {
  const slug = firmSlug || challenge?.firm_slug || ''
  if (!slug) {
    return <span className={className}>{children}</span>
  }
  return (
    <Link href={`/firms/${slug}/challenges`} className={className}>
      {children}
    </Link>
  )
}
