'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Bookmark, Star, ExternalLink, Trash2 } from 'lucide-react'
import { auth } from '@/lib/firebase/client'

interface Firm {
  id: string
  slug: string
  name: string
  logo_url: string
  rating: number
  review_count: number
  description: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [firms, setFirms] = useState<Firm[]>([])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
        loadFavorites(user.uid)
      } else {
        router.push('/auth/login?redirect=/favorites')
      }
    })
    return unsub
  }, [router])

  const loadFavorites = async (uid: string) => {
    try {
      const [favRes, firmsRes] = await Promise.all([
        fetch(`/api/favorites?user_id=${uid}`),
        fetch('/api/admin/firms'),
      ])
      if (favRes.ok && firmsRes.ok) {
        const favData = await favRes.json()
        const firmsData = await firmsRes.json()

        const favIds = favData.data?.map((f: any) => f.firm_id) || []
        const allFirms = firmsData.data || []
        
        setFirms(allFirms.filter((f: any) => favIds.includes(f.id)))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (firmId: string) => {
    if (!currentUser) return

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, firm_id: firmId }),
      })
      if (res.ok) {
        setFirms((prev) => prev.filter((f) => f.id !== firmId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-accent-cyan fill-current" />
            Bookmarked Firms
          </h1>
          <p className="text-text-secondary text-sm">
            Quick access to your saved evaluation parameters and custom comparison settings.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-text-secondary">Verifying trader session...</div>
        ) : firms.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {firms.map((firm) => (
              <AFXCard
                key={firm.id}
                className="bg-bg-surface border border-border-subtle p-6 flex flex-col justify-between hover:border-accent-cyan/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-bg-base rounded-xl flex items-center justify-center p-2 border border-border-subtle">
                      {firm.logo_url ? (
                        <img
                          src={firm.logo_url}
                          alt={firm.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-xl font-extrabold font-mono text-accent-cyan">
                          {firm.name[0]}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveFavorite(firm.id)}
                      className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-red-400 border border-border-subtle transition-all"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                    {firm.name}
                  </h3>

                  <div className="flex items-center gap-1.5 my-2">
                    <div className="flex text-accent-yellow">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(firm.rating) ? 'fill-current' : 'text-text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-text-secondary text-xs font-mono font-bold">
                      {firm.rating || 4.5} ★
                    </span>
                  </div>

                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                    {firm.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-5 border-t border-border-subtle/50 mt-5">
                  <Link href={`/firms/${firm.slug}`}>
                    <AFXButton variant="secondary" className="w-full text-xs font-bold py-2 rounded-xl">
                      View details
                    </AFXButton>
                  </Link>

                  <Link href={`/challenges?firm=${firm.id}`}>
                    <AFXButton variant="primary" className="w-full text-xs font-bold py-2 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base">
                      Challenges
                    </AFXButton>
                  </Link>
                </div>
              </AFXCard>
            ))}
          </div>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold mb-4">No bookmarked firms found.</p>
            <Link href="/challenges">
              <AFXButton variant="primary" className="px-6 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple">
                Find Challenges
              </AFXButton>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
