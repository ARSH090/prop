'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, CheckCircle, TrendingUp } from 'lucide-react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'

interface Broker {
  id: string
  slug: string
  name: string
  rating: number
  review_count: number
  country: string
  is_verified: boolean
  is_featured: boolean
  description: string
  rules: any
}

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch('/api/firms?type=broker')
        const data = await response.json()
        setBrokers(data.firms || [])
      } catch (error) {
        console.error('Failed to fetch brokers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBrokers()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Regulated Brokers (India-Focused)</h1>
          <p className="text-text-secondary text-lg">Compare spreads, leverage, and SEBI-regulated brokers for Indian traders</p>
          
          <div className="mt-6 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
            <p className="text-text-secondary text-sm">
              <strong>Disclaimer:</strong> CFD and derivatives trading carries substantial risk of loss. These brokers are SEBI-regulated but trading in leveraged instruments is speculative. Ensure you understand the risks before trading.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading brokers...</p>
          </div>
        ) : brokers.length > 0 ? (
          <>
            {/* Comparison Table */}
            <div className="afx-card bg-bg-card p-6 mb-12 overflow-x-auto">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Broker Comparison</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Broker</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Spreads</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Leverage</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Min Deposit</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Regulation</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {brokers.map((broker) => (
                    <tr key={broker.id} className="border-b border-border-subtle hover:bg-bg-base transition-colors">
                      <td className="py-4 px-4">
                        <Link href={`/firms/${broker.slug}`} className="text-accent-cyan hover:underline font-semibold">
                          {broker.name}
                          {broker.is_verified && <CheckCircle className="w-4 h-4 inline ml-2 text-accent-green" />}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-text-secondary">{broker.rules?.spreads || 'N/A'}</td>
                      <td className="py-4 px-4 text-text-secondary">{broker.rules?.leverage || 'N/A'}</td>
                      <td className="py-4 px-4 text-text-secondary">{broker.rules?.deposit_min || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className="afx-badge-code text-xs">{broker.rules?.regulation || 'SEBI'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(broker.rating) ? 'fill-accent-cyan text-accent-cyan' : 'text-text-muted'}`}
                            />
                          ))}
                          <span className="text-text-secondary text-xs ml-1">{broker.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Broker Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {brokers.map((broker) => (
                <Link key={broker.id} href={`/firms/${broker.slug}`}>
                  <div className="afx-card bg-bg-card p-6 h-full hover:shadow-lg hover:shadow-accent-cyan/20 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                            {broker.name}
                          </h3>
                          {broker.is_verified && <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />}
                        </div>
                      </div>
                      {broker.is_featured && <span className="afx-badge-live text-xs">Featured</span>}
                    </div>

                    <p className="text-text-secondary text-sm mb-4">{broker.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border-subtle">
                      <div>
                        <p className="text-text-muted text-xs">Spreads</p>
                        <p className="text-text-primary font-semibold text-sm">{broker.rules?.spreads || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">Leverage</p>
                        <p className="text-text-primary font-semibold text-sm">{broker.rules?.leverage || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">Min Deposit</p>
                        <p className="text-text-primary font-semibold text-sm">{broker.rules?.deposit_min || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs">Regulation</p>
                        <p className="text-text-primary font-semibold text-sm">{broker.rules?.regulation || 'SEBI'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(broker.rating) ? 'fill-accent-cyan text-accent-cyan' : 'text-text-muted'}`}
                          />
                        ))}
                        <span className="text-text-secondary text-xs ml-2">{broker.rating}/5 ({broker.review_count})</span>
                      </div>
                      <span className="text-accent-cyan text-xs font-semibold">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="afx-card bg-bg-card p-12 text-center">
            <p className="text-text-secondary">No brokers found</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
