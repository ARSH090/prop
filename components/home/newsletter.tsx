'use client'

import React, { useState } from 'react'
import { AFXButton } from '@/components/ui/afx-button'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section className="py-20 bg-bg-surface relative overflow-hidden border-t border-border-subtle/50">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary afx-gradient-heading">
          Never Miss a Verified Deal
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto text-sm md:text-base">
          Join our newsletter list to receive weekly comparison reports, broker reviews, and new prop firm codes directly in your inbox.
        </p>

        {status === 'success' ? (
          <div className="bg-accent-green/10 border border-accent-green/20 text-accent-green p-4 rounded-xl max-w-md mx-auto text-sm font-semibold">
            Thank you for subscribing! Check your inbox for updates.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
            />
            <AFXButton
              type="submit"
              variant="primary"
              disabled={status === 'loading'}
              className="bg-gradient-to-r from-accent-cyan to-accent-purple"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </AFXButton>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">Failed to subscribe. Please try again.</p>
        )}
      </div>
    </section>
  )
}
export default Newsletter
