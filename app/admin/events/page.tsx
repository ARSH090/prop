'use client'

import React, { useState, useEffect } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Plus, Pencil, Save, X, Calendar, Image, Upload } from 'lucide-react'

interface EventItem {
  id: string
  title: string
  type: string
  image_url: string
  description: string
  date: string
  time: string
  format: string
  seats: number | null
  prize: string | null
  status: string
  registrationUrl: string
  tags: string[]
}

const EVENT_TYPES = ['tournament', 'bootcamp', 'session', 'gaming', 'webinar']
const EVENT_STATUSES = ['upcoming', 'recurring', 'past']

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  const [form, setForm] = useState<Partial<EventItem>>({
    title: '', type: 'tournament', image_url: '', description: '',
    date: '', time: '', format: 'Online', seats: null, prize: null,
    status: 'upcoming', registrationUrl: '#', tags: [],
  })

  // Fetch events on mount
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/events')
      const data = await res.json()
      if (data.data) {
        setEvents(data.data)
      }
    } catch (err) {
      console.error('Error loading admin events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ev: EventItem) => {
    setEditing(ev.id)
    setForm({ ...ev, tags: [...(ev.tags || [])] })
    setShowAdd(false)
  }

  const handleSave = async () => {
    if (!form.title) {
      alert('Event title is required')
      return
    }
    if (!form.type) {
      alert('Event type is required')
      return
    }

    try {
      setSaving(true)
      if (editing) {
        const res = await fetch(`/api/admin/events/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (res.ok) {
          setEditing(null)
          fetchEvents()
        } else {
          const errData = await res.json()
          alert(errData.error || 'Failed to update event')
        }
      } else {
        const res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (res.ok) {
          setShowAdd(false)
          fetchEvents()
        } else {
          const errData = await res.json()
          alert(errData.error || 'Failed to create event')
        }
      }
      // Reset form
      setForm({
        title: '', type: 'tournament', image_url: '', description: '',
        date: '', time: '', format: 'Online', seats: null, prize: null,
        status: 'upcoming', registrationUrl: '#', tags: []
      })
    } catch (err) {
      console.error('Error saving event:', err)
      alert('An error occurred while saving the event')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchEvents()
      } else {
        alert('Failed to delete event')
      }
    } catch (err) {
      console.error('Error deleting event:', err)
      alert('An error occurred while deleting the event')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const uploaderData = new FormData()
    uploaderData.append('file', file)
    
    try {
      setIsUploading(true)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploaderData,
      })
      const result = await res.json()
      if (result.success && result.url) {
        setForm(prev => ({ ...prev, image_url: result.url }))
      } else {
        alert(result.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('An error occurred during file upload')
    } finally {
      setIsUploading(false)
    }
  }

  const EventForm = () => (
    <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-5">
      <h3 className="text-sm font-bold text-text-primary">{editing ? 'Edit Event' : 'New Event'}</h3>
      <div className="grid md:grid-cols-2 gap-4 text-xs">
        {/* Title */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold text-text-muted uppercase">Event Title</label>
          <input type="text" value={form.title || ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
        {/* Image URL */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1.5">
            <Image className="w-3 h-3" /> Banner Image
          </label>
          <div className="flex gap-4 items-start">
            {form.image_url && (
              <div className="relative w-24 h-16 rounded-xl bg-bg-base border border-border-subtle overflow-hidden flex items-center justify-center p-1 group">
                <img 
                  src={form.image_url} 
                  alt="Banner preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-bold text-[10px] transition-opacity"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input type="url" value={form.image_url || ''} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                placeholder="https://images.unsplash.com/... or upload below"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none font-mono" />
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Type + Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Event Type / Classification</label>
          <select value={form.type || 'tournament'} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none">
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Status</label>
          <select value={form.status || 'upcoming'} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none">
            {EVENT_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        {/* Date + Time */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Date</label>
          <input type="text" value={form.date || ''} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            placeholder="e.g. August 15–29, 2026"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Time</label>
          <input type="text" value={form.time || ''} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            placeholder="e.g. 7:00 PM – 10:00 PM (IST)"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
        {/* Format + Seats */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Format / Venue</label>
          <input type="text" value={form.format || ''} onChange={(e) => setForm((p) => ({ ...p, format: e.target.value }))}
            placeholder="e.g. Online (Zoom)"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Seats (leave blank for unlimited)</label>
          <input type="number" value={form.seats ?? ''} onChange={(e) => setForm((p) => ({ ...p, seats: e.target.value ? Number(e.target.value) : null }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none font-mono" />
        </div>
        {/* Prize */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Prize (leave blank if none)</label>
          <input type="text" value={form.prize ?? ''} onChange={(e) => setForm((p) => ({ ...p, prize: e.target.value || null }))}
            placeholder="e.g. $5,000 Prize Pool"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
        {/* Registration URL */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase">Registration URL</label>
          <input type="url" value={form.registrationUrl || '#'} onChange={(e) => setForm((p) => ({ ...p, registrationUrl: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
        {/* Description */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold text-text-muted uppercase">Description</label>
          <textarea rows={3} value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none resize-none" />
        </div>
        {/* Tags */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold text-text-muted uppercase">Tags (comma separated)</label>
          <input type="text" value={(form.tags || []).join(', ')}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
            placeholder="Forex, Bootcamp, Free"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-text-primary focus:border-accent-cyan focus:outline-none" />
        </div>
      </div>
      <div className="flex gap-3 pt-2 border-t border-border-subtle">
        <AFXButton variant="primary" onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-base">
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Create Event')}
        </AFXButton>
        <button onClick={() => { setEditing(null); setShowAdd(false) }}
          className="px-4 py-2 text-xs rounded-xl border border-border-subtle text-text-muted hover:text-text-primary transition-all">
          Cancel
        </button>
      </div>
    </AFXCard>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight afx-gradient-heading mb-2">Manage Events</h1>
          <p className="text-text-secondary text-sm">Create, edit, and manage trading events. Add banner images for visual appeal.</p>
        </div>
        <AFXButton onClick={() => { setShowAdd(true); setEditing(null) }} variant="primary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple text-sm">
          <Plus className="w-4 h-4" />
          New Event
        </AFXButton>
      </div>

      {(showAdd && !editing) && <EventForm />}

      {loading ? (
        <div className="text-center py-12 text-text-secondary text-sm">Loading events database...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-subtle rounded-2xl text-text-muted text-sm bg-bg-surface/20">
          No events created yet. Click "New Event" to start.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div key={ev.id}>
              {editing === ev.id ? (
                <EventForm />
              ) : (
                <AFXCard className="bg-bg-surface border border-border-subtle flex flex-col md:flex-row gap-4 overflow-hidden relative group">
                  {ev.image_url && (
                    <div className="w-full md:w-36 h-24 shrink-0 overflow-hidden relative">
                      <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 p-4 flex items-center justify-between gap-4 min-w-0">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 font-mono uppercase font-bold">{ev.type}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase border font-bold ${ev.status === 'upcoming' ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' : 'bg-accent-green/10 text-accent-green border-accent-green/20'}`}>{ev.status}</span>
                      </div>
                      <h3 className="font-bold text-text-primary text-sm truncate">{ev.title}</h3>
                      <p className="text-text-muted text-xs font-mono flex items-center gap-1"><Calendar className="w-3 h-3 text-accent-cyan" />{ev.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleEdit(ev)}
                        className="p-2 rounded-xl bg-bg-base border border-border-subtle hover:text-accent-cyan text-text-muted transition-all cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)}
                        className="p-2 rounded-xl bg-bg-base border border-border-subtle hover:text-red-400 text-text-muted transition-all cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </AFXCard>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

