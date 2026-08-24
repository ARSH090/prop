import { NavBar } from '@/components/nav/nav-bar'
import { HeroSection } from '@/components/home/hero'
import { FeaturedFirms } from '@/components/home/featured-firms'
import { TrustStats } from '@/components/home/trust-stats'
import { BlogPreview } from '@/components/home/blog-preview'
import { HomeFAQ } from '@/components/home/faq'
import { Footer } from '@/components/footer'
import { LogoMarquee } from '@/components/home/logo-marquee'
import { CursorGlow } from '@/components/home/cursor-glow'
import { EventPopup } from '@/components/home/event-popup'
import { HomeBestSellers } from '@/components/home/home-best-sellers'
import { HomeFavFirms } from '@/components/home/home-fav-firms'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

import {
  getSiteContent,
  getFirms,
  getDeals,
  getTickers,
  getBlogs,
  getChallenges,
  getEventPopupSettings,
  getGlobeNodes,
} from '@/lib/firebase/server'

export const metadata = {
  title: 'ANURAJ FX - Compare Prop Firms & Broker Commands',
  description: 'The primary command center for Indian prop traders. Compare FTMO, Topstep, and FundedNext, copy verified promo codes, verify payouts, and manage practice accounts.',
  keywords: ['prop firm', 'prop trading', 'forex prop firm', 'futures challenge', 'FTMO review', 'fundednext code', 'india prop trading'],
  openGraph: {
    title: 'ANURAJ FX - Compare Prop Firms & Broker Commands',
    description: 'Compare top prop firms, copy discount codes, and access community tools.',
    url: 'https://anurajfx.com',
    siteName: 'ANURAJ FX',
    images: [
      {
        url: 'https://anurajfx.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANURAJ FX - Compare Prop Firms & Broker Commands',
    description: 'The primary command center for Indian prop traders.',
    images: ['https://anurajfx.com/og-image.png'],
  },
}

export default async function Home({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  // Parallel Firestore query retrieval
  const [homeContent, allFirms, allDeals, tickers, blogs, allChallenges, eventPopup, globeNodes] = await Promise.all([
    getSiteContent('home'),
    getFirms('prop_firm'),
    getDeals(),
    getTickers(),
    getBlogs(),
    getChallenges(),
    getEventPopupSettings(),
    getGlobeNodes(),
  ])

  // Filter firms by active category
  const filteredFirms = allFirms.filter((firm) => {
    const cats = firm.category || []
    return cats.map((c: string) => c.toLowerCase()).includes(category.toLowerCase())
  })

  // Filter deals where the firm matches the category
  const filteredDeals = allDeals.filter((deal) => {
    const firm = allFirms.find((f) => f.id === deal.firm_id)
    if (!firm) return false
    const cats = firm.category || []
    return cats.map((c: string) => c.toLowerCase()).includes(category.toLowerCase())
  })

  // Join active deals to featured prop firms
  const featuredFirms = filteredFirms
    .map((firm) => {
      const activeDeal = filteredDeals.find((d) => d.firm_id === firm.id && d.status === 'active')
      return { ...firm, activeDeal }
    })
    .sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      return (b.rating || 0) - (a.rating || 0)
    })
    .slice(0, 6)

  // Sourced from all firms with show_in_marquee enabled, ordered by rating desc
  const verifiedMarqueeFirms = allFirms
    .filter((f) => f.show_in_marquee !== false)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))

  const verifiedGlobeFirms = globeNodes

  const trustStats = homeContent.trust_stats || []

  // Best sellers for home section (exactly 3 challenges controlled by Admin)
  const allActiveChallenges = allChallenges
    .filter((c) => c.is_active !== false)
    .map((c) => {
      const firm = allFirms.find((f) => f.id === c.firm_id)
      return { ...c, firm }
    })
    .filter((c) => c.firm)

  const topSellingMarked = allActiveChallenges.filter(
    (c) => c.show_on_homepage !== false || c.is_top_selling === true
  )

  const bestSellersForHome = (topSellingMarked.length > 0 ? topSellingMarked : allActiveChallenges)
    .sort((a, b) => {
      const orderA = a.homepage_display_order ?? a.display_order ?? 99
      const orderB = b.homepage_display_order ?? b.display_order ?? 99
      if (orderA !== orderB) return orderA - orderB
      return (b.popularity_score || 0) - (a.popularity_score || 0)
    })
    .slice(0, 3)

  // Fav firms - show top rated featured firms on home
  const favFirmsForHome = allFirms
    .filter((f) => f.is_featured)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6)

  return (
    <main className="min-h-screen bg-transparent relative">
      <NavBar />
      <CursorGlow />
      <EventPopup initialData={eventPopup} />

      {/* Organization Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ANURAJ FX',
            url: 'https://anurajfx.com',
            logo: 'https://anurajfx.com/icon.svg',
            description: homeContent.hero_subtext || 'Compare prop firms, grab verified discount codes, and access our trading community.',
            sameAs: [
              homeContent.discord_url || 'https://discord.gg/empirial',
            ],
          }),
        }}
      />

      {/* 1. HERO SECTION (includes marquee at bottom) */}
      <HeroSection
        headlinePart1={homeContent.hero_headline_part1}
        headlinePart2={homeContent.hero_headline_part2}
        subtext={homeContent.hero_subtext}
        ctaExplore={homeContent.hero_cta_explore}
        ctaBrokers={homeContent.hero_cta_brokers}
        discordUrl={homeContent.discord_url}
        marqueeFirms={verifiedMarqueeFirms}
        globeFirms={verifiedGlobeFirms}
      />

      {/* 9. TRUST STATS (Moved directly above partner logo marquee) */}
      <ScrollReveal>
        <TrustStats stats={trustStats} />
      </ScrollReveal>

      {/* PARTNER LOGO MARQUEE WITH SPACER WRAPPER */}
      <div className="my-10 md:my-16">
        <LogoMarquee
          firms={verifiedMarqueeFirms}
          title="Direct Verified Partners & Trusted Evaluation Programs"
        />
      </div>

      {/* 4. BEST SELLERS */}
      <ScrollReveal>
        <HomeBestSellers
          items={bestSellersForHome}
          badge={homeContent.best_sellers_badge}
          title={homeContent.best_sellers_title}
          subtext={homeContent.best_sellers_subtext}
          ctaText={homeContent.best_sellers_cta}
        />
      </ScrollReveal>

      {/* 5. FEATURED PROP FIRMS */}
      <ScrollReveal>
        <FeaturedFirms
          firms={featuredFirms}
          title={homeContent.featured_firms_title}
          subtext={homeContent.featured_firms_subtext}
        />
      </ScrollReveal>

      {/* 7. FAVORITE FIRMS */}
      <ScrollReveal>
        <HomeFavFirms
          firms={favFirmsForHome}
          badge={homeContent.fav_firms_badge}
          title={homeContent.fav_firms_title}
          subtext={homeContent.fav_firms_subtext}
          ctaText={homeContent.fav_firms_cta}
        />
      </ScrollReveal>

      {/* 10. BLOG PREVIEW */}
      <ScrollReveal>
        <BlogPreview
          posts={blogs}
          title={homeContent.blog_title}
          subtext={homeContent.blog_subtext}
          ctaText={homeContent.blog_cta}
        />
      </ScrollReveal>

      {/* 12. FAQ */}
      <HomeFAQ
        badge={homeContent.faq_badge}
        title={homeContent.faq_title}
        subtext={homeContent.faq_subtext}
      />

      <Footer />
    </main>
  )
}
export const revalidate = 10 // Revalidate page every 10 seconds (ISR)
