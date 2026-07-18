'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { Check, MailOpen, MessageSquare, Send, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'resolved'
  admin_reply?: string
  replied_at?: any
  created_at: any
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [sendingReply, setSendingReply] = useState<string | null>(null)

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

  const handleSendReply = async (msg: ContactMessage) => {
    const replyText = replyTexts[msg.id]?.trim()
    if (!replyText) return

    setSendingReply(msg.id)
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: msg.id,
          reply: true,
          replyText,
        }),
      })

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id
              ? { ...m, status: 'resolved', admin_reply: replyText, replied_at: new Date().toISOString() }
              : m
          )
        )
        setReplyTexts((prev) => ({ ...prev, [msg.id]: '' }))
        setExpandedId(null)
        alert(`Reply saved! (Note: To send email notifications, configure an email service like Resend or SendGrid in your API.)`)
      } else {
        alert('Failed to save reply')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSendingReply(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
      case 'read': return 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
      case 'resolved': return 'bg-accent-green/10 text-accent-green border border-accent-green/20'
      default: return 'bg-bg-base text-text-muted border border-border-subtle'
    }
  }

  const newCount = messages.filter((m) => m.status === 'new').length

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Contact Submissions
          </h1>
          <p className="text-text-secondary text-sm">Review message inquiries, mark read, resolve queries, and reply to users.</p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-400/10 border border-amber-400/30 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{newCount} new message{newCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Loading message logs...</div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => {
            const dateStr = msg.created_at
              ? new Date(
                  msg.created_at.seconds ? msg.created_at.seconds * 1000 : msg.created_at
                ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Recent'
            const isExpanded = expandedId === msg.id

            return (
              <AFXCard
                key={msg.id}
                className={`bg-bg-surface border transition-all ${
                  msg.status === 'new'
                    ? 'border-amber-400/30 shadow-sm shadow-amber-400/5'
                    : 'border-border-subtle'
                }`}
              >
                {/* Main Message Header */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap text-xs font-mono font-bold">
                        <span className="text-text-primary">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-accent-cyan hover:underline"
                        >
                          {msg.email}
                        </a>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${getStatusColor(msg.status)}`}>
                          {msg.status}
                        </span>
                      </div>

                      <p className="text-text-secondary text-sm leading-relaxed">{msg.message}</p>
                      <p className="text-[10px] text-text-muted font-mono">{dateStr}</p>

                      {/* Show existing reply */}
                      {msg.admin_reply && (
                        <div className="mt-3 p-3 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl">
                          <p className="text-[10px] text-accent-cyan font-bold uppercase mb-1">Admin Reply</p>
                          <p className="text-text-secondary text-xs leading-relaxed">{msg.admin_reply}</p>
                        </div>
                      )}
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
                      <button
                        onClick={() => {
                          setExpandedId(isExpanded ? null : msg.id)
                          // Auto-mark as read when opening
                          if (!isExpanded && msg.status === 'new') {
                            handleUpdateStatus(msg.id, 'read')
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isExpanded
                            ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30'
                            : 'bg-bg-base text-text-muted border-border-subtle hover:text-accent-cyan'
                        }`}
                        title="Reply"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Panel */}
                {isExpanded && (
                  <div className="border-t border-border-subtle p-6 bg-bg-base/30 space-y-3 animate-fade-in">
                    <p className="text-xs font-semibold text-text-secondary">
                      Reply to <span className="text-accent-cyan">{msg.name}</span> ({msg.email})
                    </p>
                    <textarea
                      rows={4}
                      value={replyTexts[msg.id] || ''}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({ ...prev, [msg.id]: e.target.value }))
                      }
                      placeholder={`Hi ${msg.name},\n\nThank you for reaching out to ANURAJ FX...`}
                      className="w-full px-4 py-3 rounded-xl bg-bg-base border border-border-subtle text-text-primary text-sm focus:border-accent-cyan focus:outline-none transition-colors resize-none placeholder:text-text-muted/50"
                    />
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] text-text-muted">
                        Note: Replies are saved to the database. Configure an email service (Resend/SendGrid) to send automated email notifications.
                      </p>
                      <button
                        onClick={() => handleSendReply(msg)}
                        disabled={!replyTexts[msg.id]?.trim() || sendingReply === msg.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-bg-base text-xs bg-gradient-to-r from-accent-cyan to-accent-blue hover:opacity-90 transition-all disabled:opacity-50 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {sendingReply === msg.id ? 'Saving...' : 'Save Reply'}
                      </button>
                    </div>
                  </div>
                )}
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
