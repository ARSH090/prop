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
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Header Block */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Trader Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight afx-gradient-heading">
              AFX Community Discussions
            </h1>
            <p className="text-text-secondary text-base leading-relaxed">
              Connect with fellow prop traders, share challenge reviews, flag payout delays, and monitor active firm watchlists in real-time.
            </p>
          </div>

          <CommunityClient announcements={announcements} />
        </main>
      </div>

      <Footer />
    </div>
  )
}
