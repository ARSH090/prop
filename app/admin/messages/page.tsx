'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { Check, MailOpen, MessageSquare, Send, ChevronDown, ChevronUp, AlertCircle, Trash2, Bell } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'notifications'>('messages')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [sendingReply, setSendingReply] = useState<string | null>(null)

  // Announcements state
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false)
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')
  const [submittingAnn, setSubmittingAnn] = useState(false)

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMessage, setNotifMessage] = useState('')
  const [submittingNotif, setSubmittingNotif] = useState(false)

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

  useEffect(() => {
    if (activeTab === 'announcements') {
      loadAnnouncements()
    } else if (activeTab === 'notifications') {
      loadNotifications()
    }
  }, [activeTab])

  const loadAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      const res = await fetch('/api/admin/announcements')
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const loadNotifications = async () => {
    setLoadingNotifs(true)
    try {
      const res = await fetch('/api/admin/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingNotifs(false)
    }
  }

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle.trim() || !annContent.trim()) return
    setSubmittingAnn(true)
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: annTitle, content: annContent }),
      })
      if (res.ok) {
        setAnnTitle('')
        setAnnContent('')
        loadAnnouncements()
        alert('Announcement published successfully!')
      } else {
        alert('Failed to publish announcement')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingAnn(false)
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmitNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifTitle.trim() || !notifMessage.trim()) return
    setSubmittingNotif(true)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: notifTitle, message: notifMessage }),
      })
      if (res.ok) {
        setNotifTitle('')
        setNotifMessage('')
        loadNotifications()
        alert('Notification published successfully!')
      } else {
        alert('Failed to publish notification')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingNotif(false)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    try {
      const res = await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

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
        alert(`Reply saved!`)
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
            {activeTab === 'messages' 
              ? 'Contact Submissions' 
              : activeTab === 'announcements'
              ? 'Community Announcements'
              : 'Global Bell Notifications'}
          </h1>
          <p className="text-text-secondary text-sm">
            {activeTab === 'messages'
              ? 'Review message inquiries, mark read, resolve queries, and reply to users.'
              : activeTab === 'announcements'
              ? 'Write and publish official platform announcements shown at the top of the Community forum.'
              : 'Add, beautify, and schedule manual bell notifications delivered to user drop-down modules in real-time.'}
          </p>
        </div>
        {activeTab === 'messages' && newCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-400/10 border border-amber-400/30 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{newCount} new message{newCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Tab interface switcher */}
      <div className="flex bg-bg-surface/50 border border-border-subtle p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle/50'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle/50'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Announcements
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle/50'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'messages' ? (
        loading ? (
          <div className="text-center text-text-secondary py-12">Loading message logs...</div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id
              const msgDate = msg.created_at
                ? new Date(
                    msg.created_at.seconds ? msg.created_at.seconds * 1000 : msg.created_at
                  ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'Recent'

              return (
                <AFXCard
                  key={msg.id}
                  className={`bg-bg-surface border transition-all duration-300 ${
                    isExpanded ? 'border-accent-cyan/30' : 'border-border-subtle hover:border-border-subtle/85'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-text-primary text-base">{msg.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono tracking-widest ${getStatusColor(msg.status)}`}>
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">{msg.email} • {msgDate}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateStatus(msg.id, 'resolved')}
                            className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-secondary hover:text-accent-green hover:border-accent-green/20 transition-all cursor-pointer"
                            title="Mark Resolved"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {msg.status === 'new' && (
                          <button
                            onClick={() => handleUpdateStatus(msg.id, 'read')}
                            className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/20 transition-all cursor-pointer"
                            title="Mark Read"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed bg-bg-base/30 p-4 rounded-2xl border border-border-subtle/40 whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    {msg.admin_reply && (
                      <div className="mt-4 p-4 bg-accent-green/5 border border-accent-green/25 rounded-2xl space-y-2">
                        <p className="text-xs font-bold text-accent-green flex items-center gap-1.5">
                          <span>✓</span> Admin Response
                        </p>
                        <p className="text-xs text-text-secondary whitespace-pre-wrap">{msg.admin_reply}</p>
                      </div>
                    )}

                    <div className="flex justify-end pt-2 border-t border-border-subtle/50">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            isExpanded
                              ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                              : 'bg-bg-base border-border-subtle text-text-secondary hover:text-text-primary'
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
                          Note: Replies are saved to the database.
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
        )
      ) : activeTab === 'announcements' ? (
        /* Announcements view */
        <div className="grid md:grid-cols-3 gap-8">
          {/* Creator Form */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider">
                  Post Announcement
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Server Maintenance Completed"
                    className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary text-xs focus:border-accent-cyan outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Content</label>
                  <textarea
                    required
                    rows={6}
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Write platform announcement content..."
                    className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary text-xs focus:border-accent-cyan outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAnn}
                  className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base text-xs hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {submittingAnn ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </AFXCard>
            </form>
          </div>

          {/* List existing */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-mono font-bold text-text-secondary uppercase tracking-wider">
              Published Announcements ({announcements.length})
            </h3>

            {loadingAnnouncements ? (
              <p className="text-xs text-text-muted">Loading announcements list...</p>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((ann) => {
                  const annDate = ann.created_at
                    ? new Date(
                        ann.created_at.seconds ? ann.created_at.seconds * 1000 : ann.created_at
                      ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recent'
                  return (
                    <AFXCard key={ann.id} className="bg-bg-surface border border-border-subtle p-6 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-extrabold text-text-primary text-base">{ann.title}</h4>
                          <p className="text-[10px] text-text-muted font-mono mt-0.5">{annDate}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-1.5 rounded-lg border border-border-subtle bg-bg-base text-text-muted hover:text-red-400 hover:border-red-500/30 transition-colors"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">{ann.content}</p>
                    </AFXCard>
                  )
                })}
              </div>
            ) : (
              <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
                <p className="text-text-secondary text-xs font-semibold">No announcements published yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Notifications view */
        <div className="grid md:grid-cols-3 gap-8">
          {/* Creator Form */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmitNotification} className="space-y-4">
              <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
                <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent-cyan" />
                  Publish Bell Notification
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Notification Title</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g. 10% OFF Match Promo Active"
                    className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary text-xs focus:border-accent-cyan outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Message Body</label>
                  <textarea
                    required
                    rows={5}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Write direct message body shown to traders..."
                    className="w-full px-3 py-2 bg-bg-base border border-border-subtle rounded-xl text-text-primary text-xs focus:border-accent-cyan outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingNotif}
                  className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base text-xs hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  {submittingNotif ? 'Sending...' : 'Send Notification'}
                </button>
              </AFXCard>
            </form>
          </div>

          {/* List existing */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-mono font-bold text-text-secondary uppercase tracking-wider">
              Sent Notifications List ({notifications.length})
            </h3>

            {loadingNotifs ? (
              <p className="text-xs text-text-muted">Loading notifications feed...</p>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notif) => {
                  const notifDate = notif.created_at
                    ? new Date(
                        notif.created_at.seconds ? notif.created_at.seconds * 1000 : notif.created_at
                      ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recent'
                  return (
                    <AFXCard key={notif.id} className="bg-bg-surface border border-border-subtle p-5 space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                            {notif.title}
                          </h4>
                          <p className="text-[10px] text-text-muted font-mono mt-0.5">{notifDate}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="p-1.5 rounded-lg border border-border-subtle bg-bg-base text-text-muted hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line bg-bg-base/30 p-3 rounded-xl border border-border-subtle/30">{notif.message}</p>
                    </AFXCard>
                  )
                })}
              </div>
            ) : (
              <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
                <p className="text-text-secondary text-xs font-semibold">No notifications dispatched yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export const dynamic = 'force-dynamic'
