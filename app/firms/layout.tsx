import React from 'react'

export const metadata = {
  title: 'Top Rated Prop Trading Firms 2026 Directory - ANURAJ FX',
  description: 'Explore the complete directory of verified prop trading firms. Compare FTMO, Funding Pips, Topstep, FundedNext, and read real trader reviews.',
  keywords: ['prop firm directory', 'compare prop firms', 'FTMO reviews', 'Funding Pips reviews', 'Topstep', 'best prop firms 2026'],
  openGraph: {
    title: 'Top Rated Prop Trading Firms 2026 Directory - ANURAJ FX',
    description: 'Explore the complete directory of verified prop trading firms. Compare FTMO, Funding Pips, Topstep, FundedNext, and read real trader reviews.',
    url: 'https://anurajfx.com/firms',
    siteName: 'ANURAJ FX',
    images: [{ url: 'https://anurajfx.com/og-image.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Rated Prop Trading Firms 2026 Directory - ANURAJ FX',
    description: 'Explore the complete directory of verified prop trading firms. Compare FTMO, Funding Pips, Topstep, FundedNext, and read real trader reviews.',
    images: ['https://anurajfx.com/og-image.png'],
  }
}

export default function FirmsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
