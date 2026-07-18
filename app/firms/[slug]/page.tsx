import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, CheckCircle, ExternalLink } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { CopyButton } from '@/components/ui/copy-button'

export const revalidate = 10 // ISR: revalidate every 10 seconds

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { slug } = await params
    const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

    if (snapshot.empty) return { title: 'Firm Not Found' }
    const firm = snapshot.docs[0].data()

    return {
      title: `${firm.name} - Prop Firm & Broker Details | ANURAJ FX`,
      description: firm.description,
    }
  } catch (err) {
    return { title: 'ANURAJ FX' }
  }
}

export default async function FirmDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const snapshot = await db.collection('firms').where('slug', '==', slug).limit(1).get()

  if (snapshot.empty) {
    notFound()
  }

  const firmDoc = snapshot.docs[0]
  const firm = { id: firmDoc.id, ...firmDoc.data() } as any

  // 1. Fetch published reviews
  let reviews: any[] = []
  try {
    const reviewsSnap = await db
      .collection('reviews')
      .where('firm_id', '==', firm.id)
      .where('status', '==', 'published')
      .get()
    reviews = reviewsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.warn('Reviews fetch failed, using empty list')
  }

  // 2. Fetch active deals
  let deals: any[] = []
  try {
    const dealsSnap = await db
      .collection('deals')
      .where('firm_id', '==', firm.id)
      .where('status', '==', 'active')
      .get()
    deals = dealsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.warn('Deals fetch failed')
  }

  // 3. Fetch similar firms
  let relatedFirms: any[] = []
  try {
    const relatedSnap = await db
      .collection('firms')
      .where('type', '==', firm.type)
      .limit(4)
      .get()
    relatedFirms = relatedSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((f) => f.id !== firm.id)
  } catch (e) {
    console.warn('Related firms fetch failed')
  }

  const rules = firm.rules || {}
  const avgRating = firm.rating || 4.0

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Firm Header */}
        <div className="bg-bg-surface border border-border-subtle mb-12 p-8 rounded-3xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-bg-base border border-border-subtle rounded-2xl flex items-center justify-center p-3">
                {firm.logo_url ? (
                  <img
                    src={firm.logo_url}
                    alt={firm.name}
                    className="w-20 h-20 object-contain rounded"
                  />
                ) : (
                  <span className="text-3xl font-extrabold font-mono text-accent-cyan">
                    {firm.name[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary">
                  {firm.name}
                </h1>
                {firm.is_verified && (
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-accent-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(avgRating) ? 'fill-current' : 'text-text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-text-secondary text-sm font-semibold ml-2">
                    {avgRating.toFixed(1)}/5 ({firm.review_count || 0} reviews)
                  </span>
                </div>
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
                  ${firm.max_allocation ? (firm.max_allocation / 1000).toFixed(0) : '200'}K
                </p>
              </div>
              <div className="bg-bg-base/50 border border-border-subtle/50 p-4 rounded-2xl">
                <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
                  Years Active
                </p>
                <p className="text-text-primary font-bold text-base">
                  {firm.years_active || '5'}+ years
                </p>
              </div>
              <div className="bg-bg-base/50 border border-border-subtle/50 p-4 rounded-2xl">
                <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
                  Regulation
                </p>
                <p className="text-text-primary font-bold font-mono text-base">
                  {firm.country || 'Global'}
                </p>
              </div>
              <div className="bg-bg-base/50 border border-border-subtle/50 p-4 rounded-2xl">
                <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
                  Platforms
                </p>
                <p className="text-text-primary font-bold text-xs truncate">
                  {firm.platforms?.slice(0, 2).join(', ') || 'MT4, MT5'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info Blocks */}
          <div className="md:col-span-2 space-y-8">
            {/* Rules Table */}
            <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Trading Rules</h2>
              <div className="space-y-1">
                {Object.entries(rules).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3.5 border-b border-border-subtle last:border-b-0 text-sm"
                  >
                    <span className="text-text-secondary capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-text-primary font-bold font-mono">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Deals */}
            {deals.length > 0 && (
              <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Active Deals & Promos</h2>
                <div className="space-y-3">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex justify-between items-center p-4 bg-bg-base/50 border border-border-subtle/50 rounded-xl"
                    >
                      <div>
                        <p className="text-text-primary font-bold font-mono text-base">
                          {deal.code}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">{deal.title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan text-xs font-mono font-bold">
                          {deal.discount_label}
                        </span>
                        <CopyButton text={deal.code} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Trader Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-5 bg-bg-base/40 border border-border-subtle/30 rounded-2xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-text-primary font-bold">{review.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-accent-yellow">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating ? 'fill-current' : 'text-text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.is_verified_trader && (
                              <span className="px-2 py-0.5 rounded bg-accent-green/15 text-accent-green text-[10px] font-bold uppercase tracking-wider font-mono">
                                Verified Trader
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{review.body}</p>
                      <p className="text-text-muted text-[10px] mt-3 font-mono font-semibold">
                        by {review.full_name || 'Anonymous'} •{' '}
                        {review.created_at
                          ? new Date(review.created_at.seconds ? review.created_at.seconds * 1000 : review.created_at).toLocaleDateString('en-US')
                          : 'Recent'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-sm">
                  No reviews yet. Be the first to review this firm!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar Panel */}
          <div className="space-y-6">
            {/* CTA Box */}
            <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
              <div className="relative space-y-4">
                <h3 className="text-lg font-bold text-text-primary">Ready to Join?</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Start your trading challenge with {firm.name}. Click below to visit their site and
                  begin your evaluation.
                </p>
                <a
                  href={firm.affiliate_url || firm.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 rounded-xl font-bold text-bg-base text-center hover:opacity-90 transition-opacity bg-gradient-to-r from-accent-cyan to-accent-purple text-sm"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Related Firms */}
            {relatedFirms.length > 0 && (
              <div className="bg-bg-surface border border-border-subtle p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-text-primary mb-4">Similar Firms</h3>
                <div className="space-y-3">
                  {relatedFirms.map((related) => (
                    <Link
                      key={related.id}
                      href={`/firms/${related.slug}`}
                      className="block p-3.5 bg-bg-base/40 border border-border-subtle/50 rounded-xl hover:border-accent-cyan/30 transition-all hover:bg-bg-base/80"
                    >
                      <p className="text-text-primary font-bold text-sm">{related.name}</p>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <div className="flex text-accent-yellow">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.round(related.rating || 4)
                                  ? 'fill-current'
                                  : 'text-text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-text-muted text-[10px] font-mono font-semibold">
                          ({related.review_count || 0})
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
