import React from 'react'
import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { RatingBadge } from '@/components/ui/rating-badge'
import { getFirms } from '@/lib/firebase/server'
import { FirmTabs } from '@/components/ui/firm-tabs'
import { getCleanLogoUrl, isDarkLogo } from '@/lib/utils/logo-url'
import { PropFirmLogo } from '@/components/ui/prop-firm-logo'

export const revalidate = 10

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams
    const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

    let firm: any = null
    if (snapshot.empty) {
      const allMock = await getFirms()
      firm = allMock.find((f: any) => f.slug === slug)
    } else {
      firm = snapshot.docs[0].data()
    }

    if (!firm) return { title: 'Firm Not Found' }

    return {
      title: `${firm.name} - Prop Firm Reviews & Rules | ANURAJ FX`,
      description: firm.description || `View ${firm.name} challenge options, rules, and audited payouts.`,
      keywords: [firm.name, `${firm.name} review`, `${firm.name} rules`, `${firm.name} coupon`],
      openGraph: {
        title: `${firm.name} - Prop Firm Reviews & Rules | ANURAJ FX`,
        description: firm.description || `View ${firm.name} challenge options, rules, and audited payouts.`,
        url: `https://anurajfx.com/firms/${firm.slug}`,
        siteName: 'ANURAJ FX',
        images: [{ url: firm.logo_url || 'https://anurajfx.com/og-image.png' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${firm.name} - Prop Firm Reviews & Rules | ANURAJ FX`,
        description: firm.description || `View ${firm.name} challenge options, rules, and audited payouts.`,
        images: [firm.logo_url || 'https://anurajfx.com/og-image.png'],
      }
    }
  } catch (err) {
    return { title: 'ANURAJ FX' }
  }
}

export default async function FirmDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

  let firm: any = null
  if (snapshot.empty) {
    const docSnap = await db.collection('firms').doc(slug).get()
    if (docSnap.exists) {
      firm = { id: docSnap.id, ...docSnap.data() }
    } else {
      const allMock = await getFirms()
      firm = allMock.find((f: any) => f.slug === slug || f.id === slug)
      if (!firm) {
        notFound()
      }
    }
  } else {
    const firmDoc = snapshot.docs[0]
    firm = { id: firmDoc.id, ...firmDoc.data() } as any
  }

  const logoUrl = getCleanLogoUrl(firm.name, firm.logo_url)
  const avgRating = firm.rating || 4.5

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Firm Header */}
          <div className="bg-bg-surface border border-border-subtle mb-8 p-8 rounded-3xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
              <div className="flex-shrink-0">
                <PropFirmLogo
                  name={firm.name}
                  logoUrl={firm.logo_url}
                  circleCrop={firm.circle_crop_logo}
                  className="w-24 h-24 rounded-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary">
                    {firm.name}
                  </h1>
                  {firm.is_verified && (
                    <CheckCircle className="w-6 h-6 text-accent-cyan" />
                  )}
                </div>

                <div className="mb-4">
                  <RatingBadge rating={avgRating} reviewCount={firm.review_count} fontVariant="sans" />
                </div>

                <p className="text-text-secondary text-sm md:text-base mb-6 max-w-2xl leading-relaxed">
                  {firm.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {firm.category?.map((cat: string) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded bg-bg-base border border-border-subtle text-[10px] font-mono font-bold text-text-secondary tracking-widest uppercase"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={firm.affiliate_url || firm.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl font-bold text-bg-base flex items-center gap-2 hover:opacity-90 transition-opacity bg-gradient-to-r from-accent-cyan to-accent-blue text-sm"
                  >
                    Visit {firm.name}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto min-w-[240px]">
                <div className="bg-bg-base/50 border border-border-subtle/50 p-4 rounded-2xl">
                  <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
                    Max Allocation
                  </p>
                  <p className="text-text-primary font-bold font-mono text-base">
                    ${firm.max_allocation ? (firm.max_allocation / 1000).toFixed(0) : '400'}K
                  </p>
                </div>

                <div className="bg-bg-base/50 border border-border-subtle/50 p-4 rounded-2xl">
                  <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
                    Platforms
                  </p>
                  <p className="text-text-primary font-bold font-mono text-xs truncate max-w-[100px]" title={firm.platforms?.join(', ')}>
                    {firm.platforms?.join(', ') || 'cTrader, MT5'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <FirmTabs slug={slug} />

          {/* Dynamic children tab page contents */}
          <div className="min-h-[400px]">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
