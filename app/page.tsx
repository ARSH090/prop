import { NavBar } from '@/components/nav/nav-bar'
import { HeroSection } from '@/components/home/hero'
import { FeaturedFirms } from '@/components/home/featured-firms'
import { TrustStats } from '@/components/home/trust-stats'
import { LiveTickers } from '@/components/home/live-tickers'
import { FeaturedDeals } from '@/components/home/featured-deals'
import { BlogPreview } from '@/components/home/blog-preview'
import { Newsletter } from '@/components/home/newsletter'
import { Footer } from '@/components/footer'

import {
  getSiteContent,
  getFirms,
  getDeals,
  getTickers,
  getBlogs,
} from '@/lib/firebase/server'

export default async function Home() {
  // Parallel Firestore query retrieval
  const [homeContent, allFirms, allDeals, tickers, blogs] = await Promise.all([
    getSiteContent('home'),
    getFirms('prop_firm'),
    getDeals(),
    getTickers(),
    getBlogs(),
  ])

  // Join active deals to featured prop firms
  const featuredFirms = allFirms
    .map((firm) => {
      const activeDeal = allDeals.find((d) => d.firm_id === firm.id && d.status === 'active')
      return { ...firm, activeDeal }
    })
    .sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      return (b.rating || 0) - (a.rating || 0)
    })
    .slice(0, 6)

  const trustStats = homeContent.trust_stats || []

  // Dynamic Section Reordering ordered by Admin configuration
  const sectionOrder = homeContent.section_order || [
    'hero',
    'featured_firms',
    'trust_stats',
    'live_tickers',
    'latest_deals',
    'blog_preview',
    'newsletter',
  ]

  return (
    <main className="min-h-screen bg-bg-base">
      <NavBar />

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
              />
            )
          case 'featured_firms':
            return <FeaturedFirms key="featured_firms" firms={featuredFirms} />
          case 'trust_stats':
            return <TrustStats key="trust_stats" stats={trustStats} />
          case 'live_tickers':
            return <LiveTickers key="live_tickers" tickers={tickers} />
          case 'latest_deals':
            return <FeaturedDeals key="latest_deals" />
          case 'blog_preview':
            return <BlogPreview key="blog_preview" posts={blogs} />
          case 'newsletter':
            return <Newsletter key="newsletter" />
          default:
            return null
        }
      })}

      <Footer />
    </main>
  )
}
export const revalidate = 10 // Revalidate page every 10 seconds (ISR)
