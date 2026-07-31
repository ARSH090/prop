import { NavBar } from '@/components/nav/nav-bar'
import { HeroSection } from '@/components/home/hero'
import { ExplainerCards } from '@/components/home/explainer-cards'
import { FeaturedFirms } from '@/components/home/featured-firms'
import { TrustStats } from '@/components/home/trust-stats'
import { LiveTickers } from '@/components/home/live-tickers'
import { FeaturedDeals } from '@/components/home/featured-deals'
import { BlogPreview } from '@/components/home/blog-preview'
import { Newsletter } from '@/components/home/newsletter'
import { HomeFAQ } from '@/components/home/faq'
import { Footer } from '@/components/footer'
import { LogoMarquee } from '@/components/home/logo-marquee'
import { CursorGlow } from '@/components/home/cursor-glow'

import {
  getSiteContent,
  getFirms,
  getDeals,
  getTickers,
  getBlogs,
} from '@/lib/firebase/server'

export const metadata = {
  title: 'ANURAJ FX - Compare Prop Firms & Broker Commands',
  description: 'The primary command center for Indian prop traders. Compare FTMO, Topstep, and FundedNext, copy verified promo codes, verify payouts, and manage practice accounts.',
  keywords: ['prop firm', 'prop trading', 'forex prop firm', 'futures challenge', 'FTMO review', 'fundednext code', 'india prop trading'],
}

export default async function Home({ params }: { params?: Promise<{ category?: string }> }) {
  const resolvedParams = params ? await params : null
  const category = resolvedParams?.category || 'forex'

  // Parallel Firestore query retrieval
  const [homeContent, allFirms, allDeals, tickers, blogs] = await Promise.all([
    getSiteContent('home'),
    getFirms('prop_firm'),
    getDeals(),
    getTickers(),
    getBlogs(),
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

  // Sourced from verified firms in the active category, ordered by rating desc
  const verifiedMarqueeFirms = filteredFirms
    .filter((f) => f.is_verified)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))

  const trustStats = homeContent.trust_stats || []

  // Dynamic Section Reordering ordered by Admin configuration (including marquee)
  const sectionOrder = homeContent.section_order || [
    'hero',
    'explainer_cards',
    'featured_firms',
    'verified_firms',
    'trust_stats',
    'live_tickers',
    'latest_deals',
    'blog_preview',
    'newsletter',
  ]

  return (
    <main className="min-h-screen bg-bg-base relative">
      <NavBar />
      <CursorGlow />

      {sectionOrder.map((section: string) => {
        switch (section) {
          case 'hero':
            return (
              <HeroSection
                key="hero"
                headlinePart1={homeContent.hero_headline_part1}
                headlinePart2={homeContent.hero_headline_part2}
                subtext={homeContent.hero_subtext}
                ctaExplore={homeContent.hero_cta_explore}
                ctaBrokers={homeContent.hero_cta_brokers}
                discordUrl={homeContent.discord_url}
              />
            )
          case 'explainer_cards':
            return <ExplainerCards key="explainer_cards" />
          case 'featured_firms':
            return <FeaturedFirms key="featured_firms" firms={featuredFirms} />
          case 'verified_firms':
            return (
              <LogoMarquee
                key="verified_firms"
                firms={verifiedMarqueeFirms}
                title={homeContent.verified_firms_title || 'Also Verified Prop Firms'}
              />
            )
          case 'trust_stats':
            return <TrustStats key="trust_stats" stats={trustStats} />

          case 'latest_deals':
            return <FeaturedDeals key="latest_deals" deals={filteredDeals} />
          case 'blog_preview':
            return <BlogPreview key="blog_preview" posts={blogs} />
          case 'newsletter':
            return <Newsletter key="newsletter" />
          default:
            return null
        }
      })}

      <HomeFAQ />

      <Footer />
    </main>
  )
}
export const revalidate = 10 // Revalidate page every 10 seconds (ISR)
