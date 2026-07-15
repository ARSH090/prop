'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        alert('Failed to send contact message. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Error sending message')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AFXCard className="bg-bg-surface border border-border-subtle p-8 text-center space-y-4 max-w-lg mx-auto">
        <CheckCircle className="w-12 h-12 text-accent-green mx-auto" />
        <h3 className="text-xl font-bold text-text-primary">Message Sent Successfully!</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          Thank you for reaching out to ANURAJ FX. Our audit support team will respond to your query shortly.
        </p>
        <AFXButton
          onClick={() => setSubmitted(false)}
          variant="secondary"
          className="mx-auto text-xs font-bold px-5 py-2 rounded-xl"
        >
          Send another message
        </AFXButton>
      </AFXCard>
    )
  }

  return (
    <AFXCard className="bg-bg-surface border border-border-subtle p-8 space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-text-primary afx-gradient-heading">Contact Support</h2>
      <p className="text-text-secondary text-xs leading-relaxed">
        Have questions about payout auditing, custom listings, or exclusive discount partnerships? Write to us below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary">Message</label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Write your details here..."
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none"
          />
        </div>

        <AFXButton
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Sending...' : 'Send Message'}
        </AFXButton>
      </form>
    </AFXCard>
  )
}
