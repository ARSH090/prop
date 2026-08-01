import { MetadataRoute } from 'next'
import { getFirms, getBlogs } from '@/lib/firebase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anurajfx.com'

  // Static routes
  const staticRoutes = [
    '',
    '/firms',
    '/offers',
    '/spreads',
    '/rules',
    '/leaderboard',
    '/payouts',
    '/deals',
    '/challenges',
    '/futures/challenges',
    '/crypto/challenges',
    '/how-it-works',
    '/transparency',
    '/community',
    '/loyalty',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic firms routes
  let firmRoutes: any[] = []
  try {
    const firms = await getFirms()
    firmRoutes = firms
      .filter((firm: any) => firm.status === 'active')
      .map((firm: any) => ({
        url: `${baseUrl}/firms/${firm.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
  } catch (err) {
    console.error('Error generating sitemap firms:', err)
  }

  // Dynamic blog routes
  let blogRoutes: any[] = []
  try {
    const blogs = await getBlogs()
    blogRoutes = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (err) {
    console.error('Error generating sitemap blogs:', err)
  }

  return [...staticRoutes, ...firmRoutes, ...blogRoutes]
}
