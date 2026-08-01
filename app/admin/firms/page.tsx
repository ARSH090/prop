'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { AFXCard } from '@/components/ui/afx-card'

interface Firm {
  id: string
  slug: string
  name: string
  logo_url?: string
  type: string
  rating: number
  is_featured: boolean
  is_verified: boolean
  status: string
}

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFirms()
  }, [])

  const fetchFirms = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/firms')
      const result = await response.json()
      setFirms(result.data || [])
    } catch (error) {
      console.error('Failed to fetch firms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/firms/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setFirms((prev) => prev.filter((firm) => firm.id !== id))
      } else {
        alert('Failed to delete firm')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting firm')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Manage Firms & Brokers
          </h1>
          <p className="text-text-secondary text-sm">Add, edit, or delete listings and evaluation rules.</p>
        </div>
        <Link
          href="/admin/firms/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </Link>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="text-center text-text-secondary py-12">Loading firms list...</div>
      ) : firms.length > 0 ? (
        <AFXCard className="overflow-hidden border border-border-subtle bg-bg-surface p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-base/30">
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {firms.map((firm) => (
                  <tr
                    key={firm.id}
                    className="border-b border-border-subtle hover:bg-bg-base/20 transition-all"
                  >
                    <td className="px-6 py-4 font-bold text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center p-1 overflow-hidden shrink-0">
                          {firm.logo_url ? (
                            <img src={firm.logo_url} alt={firm.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-accent-cyan">{firm.name[0]}</span>
                          )}
                        </div>
                        <span>{firm.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary capitalize font-mono text-xs">
                      {firm.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-mono">{firm.rating || 4.0} ★</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          firm.status === 'active'
                            ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {firm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/firms/${firm.id}`}
                          className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-accent-cyan transition-all border border-border-subtle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(firm.id, firm.name)}
                          className="p-2 bg-bg-base/50 hover:bg-bg-base rounded-xl text-text-muted hover:text-red-400 transition-all border border-border-subtle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AFXCard>
      ) : (
        <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
          <p className="text-text-secondary mb-4 text-sm font-semibold">No prop firms or brokers found.</p>
          <Link
            href="/admin/firms/new"
            className="inline-flex px-6 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all"
          >
            Create First Listing
          </Link>
        </div>
      )}
    </div>
  )
}
