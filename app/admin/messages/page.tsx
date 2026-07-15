'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { Check, MailOpen, AlertCircle } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'resolved'
  created_at: any
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/messages')
        if (res.ok) {
          const data = await res.json()
          setMessages(data.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: 'read' | 'resolved') => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
          Contact Submissions
        </h1>
        <p className="text-text-secondary text-sm">Review message inquiries, mark read, or resolve queries.</p>
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Loading message logs...</div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => {
            const dateStr = msg.created_at
              ? new Date(
                  msg.created_at.seconds ? msg.created_at.seconds * 1000 : msg.created_at
                ).toLocaleDateString()
              : 'Recent'
            return (
              <AFXCard
                key={msg.id}
                className="bg-bg-surface border border-border-subtle p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap text-xs font-mono font-bold">
                    <span className="text-text-primary">{msg.name}</span>
                    <span className="text-text-muted">{msg.email}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                        msg.status === 'new'
                          ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                          : msg.status === 'read'
                          ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                          : 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">{msg.message}</p>
                  <p className="text-[10px] text-text-muted font-mono">{dateStr}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {msg.status === 'new' && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, 'read')}
                      className="p-2 bg-bg-base hover:bg-bg-base/80 rounded-xl text-text-muted hover:text-accent-cyan border border-border-subtle transition-all"
                      title="Mark Read"
                    >
                      <MailOpen className="w-4 h-4" />
                    </button>
                  )}
                  {msg.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, 'resolved')}
                      className="p-2 bg-bg-base hover:bg-bg-base/80 rounded-xl text-text-muted hover:text-accent-green border border-border-subtle transition-all"
                      title="Mark Resolved"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </AFXCard>
            )
          })}
        </div>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary text-sm font-semibold">No contact submissions found.</p>
        </div>
      )}
    </div>
  )
}
export const dynamic = 'force-dynamic'
