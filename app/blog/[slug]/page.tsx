import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Share2 } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import ReactMarkdown from 'react-markdown'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'

export const revalidate = 10

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { slug } = await params
    const snapshot = await db
      .collection('blog_posts')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (snapshot.empty) return { title: 'Post Not Found' }
    const post = snapshot.docs[0].data()

    return {
      title: `${post.title} | ANURAJ FX Blog`,
      description: post.excerpt,
    }
  } catch (e) {
    return { title: 'ANURAJ FX Blog' }
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const snapshot = await db
    .collection('blog_posts')
    .where('slug', '==', slug)
    .limit(1)
    .get()

  if (snapshot.empty) {
    notFound()
  }

  const postDoc = snapshot.docs[0]
  const post = { id: postDoc.id, ...postDoc.data() } as any

  // Fetch related posts (limit 3)
  let relatedPosts: any[] = []
  try {
    const relatedSnap = await db
      .collection('blog_posts')
      .where('published', '==', true)
      .limit(4)
      .get()
    relatedPosts = relatedSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((p) => p.id !== post.id)
      .slice(0, 3)
  } catch (e) {
    console.warn('Failed to fetch related posts')
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-cyan/80 mb-8 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header Card */}
        <article className="bg-bg-surface border border-border-subtle p-8 mb-12 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
          <div className="relative space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border-subtle text-xs text-text-muted font-mono">
              <div>
                <p className="text-text-primary font-bold">Anuraj FX Editorial</p>
                <p className="text-text-muted mt-0.5">Author</p>
              </div>

              {post.published_at && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  {new Date(
                    post.published_at.seconds ? post.published_at.seconds * 1000 : post.published_at
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Featured Image */}
        {post.cover_image_url && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-border-subtle">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-96 object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="bg-bg-surface border border-border-subtle p-8 mb-12 rounded-3xl prose prose-invert max-w-none">
          <div className="text-text-secondary leading-relaxed space-y-4">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-extrabold text-text-primary mt-8 mb-4 border-b border-border-subtle pb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-text-primary mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold text-text-primary mt-5 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-4 text-text-secondary text-sm md:text-base leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-text-secondary text-sm" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-text-secondary text-sm" {...props} />
                ),
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                code: ({ node, ...props }) => (
                  <code className="bg-bg-base px-2 py-1 rounded text-accent-cyan text-xs font-mono border border-border-subtle/50" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-accent-cyan pl-4 py-2 mb-4 italic text-text-muted bg-bg-base/30 rounded-r-xl" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-accent-cyan hover:underline font-bold" {...props} />
                ),
              }}
            >
              {post.content_md}
            </ReactMarkdown>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const rDateStr = relatedPost.published_at
                  ? new Date(
                      relatedPost.published_at.seconds
                        ? relatedPost.published_at.seconds * 1000
                        : relatedPost.published_at
                    ).toLocaleDateString()
                  : 'Recent'
                return (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <AFXCard className="bg-bg-surface border-border-subtle h-full hover:border-accent-cyan/40 transition-all cursor-pointer group flex flex-col justify-between p-0 overflow-hidden">
                      <div>
                        {relatedPost.cover_image_url && (
                          <div className="overflow-hidden rounded-t-2xl border-b border-border-subtle">
                            <img
                              src={relatedPost.cover_image_url}
                              alt={relatedPost.title}
                              className="w-full h-40 object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-4 space-y-2">
                          <h3 className="font-bold text-text-primary group-hover:text-accent-cyan transition-colors line-clamp-2 text-sm">
                            {relatedPost.title}
                          </h3>
                          <p className="text-text-secondary text-xs line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <span className="text-text-muted text-[10px] font-mono block">
                          {rDateStr}
                        </span>
                      </div>
                    </AFXCard>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-bg-surface border border-accent-cyan/20 bg-accent-cyan/5 p-8 text-center rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
          <div className="relative space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">
              Ready to Start Your Prop Trading Journey?
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Explore our comprehensive directory of prop firms and get exclusive deals on evaluations.
            </p>
            <Link href="/firms" className="inline-block pt-2">
              <AFXButton
                variant="primary"
                className="px-8 py-3 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-opacity"
              >
                Explore Firms →
              </AFXButton>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
