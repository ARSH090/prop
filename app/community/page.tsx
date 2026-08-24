import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { WatchlistWidget } from '@/components/ui/watchlist-widget'
import { Users } from 'lucide-react'
import { CommunityClient } from './CommunityClient'
import { db } from '@/lib/firebase/admin'

export const metadata = {
  title: 'Trader Community Hub - ANURAJ FX',
  description: 'Discuss prop firm conditions, ask questions, share setups, and keep track of your favorite prop firms in your custom watchlist.',
}

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  let announcements: any[] = []
  try {
    const snap = await db.collection('announcements').orderBy('created_at', 'desc').limit(5).get()
    snap.forEach((doc: any) => {
      const data = doc.data()
      announcements.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        created_at: data.created_at?.toDate() ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      })
    })
  } catch (err) {
    console.warn('Failed to load announcements for community board page:', err)
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="w-full max-w-full px-4 md:px-8 lg:px-12 py-8 space-y-6">
          <CommunityClient announcements={announcements} />
        </main>
      </div>

      <Footer />
    </div>
  )
}
