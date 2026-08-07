import { NavBar } from '@/components/nav/nav-bar'
import { HeroSection } from '@/components/home/hero'
import { ExplainerCards } from '@/components/home/explainer-cards'
import { FeaturedFirms } from '@/components/home/featured-firms'
import { TrustStats } from '@/components/home/trust-stats'
import { FeaturedDeals } from '@/components/home/featured-deals'
import { BlogPreview } from '@/components/home/blog-preview'
import { Newsletter } from '@/components/home/newsletter'
import { HomeFAQ } from '@/components/home/faq'
import { Footer } from '@/components/footer'
import { LogoMarquee } from '@/components/home/logo-marquee'
import { CursorGlow } from '@/components/home/cursor-glow'
import { EventPopup } from '@/components/home/event-popup'
import { HomeChallenges } from '@/components/home/home-challenges'
import { HomeBestSellers } from '@/components/home/home-best-sellers'
import { HomeFavFirms } from '@/components/home/home-fav-firms'

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

  // Top challenges for home section (sorted by popularity, top 6)
  const activeChallengesForHome = allChallenges
    .filter((c) => c.is_active !== false)
    .map((c) => {
      const firm = allFirms.find((f) => f.id === c.firm_id)
      return { ...c, firm }
    })
    .filter((c) => c.firm)
    .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
    .slice(0, 6)

  // Best sellers for home section
  const bestSellersForHome = [...activeChallengesForHome]
    .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
    .slice(0, 5)

  // Fav firms - show top rated featured firms on home
  const favFirmsForHome = allFirms
    .filter((f) => f.is_featured)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6)

  return (
    <main className="min-h-screen bg-bg-base relative">
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

      {/* PARTNER LOGO MARQUEE WITH DETAILS */}
      <div className="py-6 bg-bg-base relative z-10 -mt-6">
        <LogoMarquee 
          firms={verifiedMarqueeFirms} 
          title="Direct Verified Partners & Trusted Evaluation Programs" 
        />
        <div className="max-w-4xl mx-auto text-center px-4 -mt-4 mb-8">
          <p className="text-xs text-text-muted leading-relaxed max-w-2xl mx-auto">
            We partner directly with leading institutional platforms to bring you live spreads, audited payout history, and verified challenge promo keys. Filter by size, step limits, or drawdown types to find your perfect fit.
          </p>
        </div>
      </div>

      {/* 2. EXPLAINER CARDS */}
      <ExplainerCards />

      {/* 3. CHALLENGES - Popular challenges section */}
      <HomeChallenges
        challenges={activeChallengesForHome}
        firms={allFirms}
        badge={homeContent.challenges_badge}
        title={homeContent.challenges_title}
        subtext={homeContent.challenges_subtext}
        ctaText={homeContent.challenges_cta}
      />

      {/* 4. BEST SELLERS */}
      <HomeBestSellers
        items={bestSellersForHome}
        badge={homeContent.best_sellers_badge}
        title={homeContent.best_sellers_title}
        subtext={homeContent.best_sellers_subtext}
        ctaText={homeContent.best_sellers_cta}
      />

      {/* 5. FEATURED PROP FIRMS */}
      <FeaturedFirms
        firms={featuredFirms}
        title={homeContent.featured_firms_title}
        subtext={homeContent.featured_firms_subtext}
      />

      {/* 6. FEATURED DEALS */}
      <FeaturedDeals
        deals={filteredDeals}
        title={homeContent.featured_deals_title}
        subtext={homeContent.featured_deals_subtext}
      />

      {/* 7. FAVORITE FIRMS */}
      <HomeFavFirms
        firms={favFirmsForHome}
        badge={homeContent.fav_firms_badge}
        title={homeContent.fav_firms_title}
        subtext={homeContent.fav_firms_subtext}
        ctaText={homeContent.fav_firms_cta}
      />
      {/* 9. TRUST STATS */}
      <TrustStats stats={trustStats} />

      {/* 10. BLOG PREVIEW */}
      <BlogPreview
        posts={blogs}
        title={homeContent.blog_title}
        subtext={homeContent.blog_subtext}
        ctaText={homeContent.blog_cta}
      />

      {/* 11. NEWSLETTER */}
      <Newsletter
        title={homeContent.newsletter_title}
        subtext={homeContent.newsletter_subtext}
      />

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
