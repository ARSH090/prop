'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Save, UserPlus, ShieldAlert } from 'lucide-react'

interface AdminUser {
  email: string
  name: string
  role: string
}

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    { name: 'Anuraj Admin', email: 'admin@anurajfx.com', role: 'admin' },
  ])
  const [inviteEmail, setInviteEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAdmins((prev) => [...prev, { name: 'Invited Admin', email: inviteEmail, role: 'admin' }])
      setInviteEmail('')
      alert(`Admin role invitation sent to ${inviteEmail}! 📩`)
    }, 1000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
          System settings
        </h1>
        <p className="text-text-secondary text-sm">Configure administrator roles and platform privileges.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Side: Invite Form */}
        <div className="md:col-span-1 space-y-6">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle/50 pb-2">
              <UserPlus className="w-5 h-5 text-accent-cyan" />
              Invite Admin
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed">
              Add a new administrator by their email. They will receive invitation permissions to manage firms, deals, and builder blocks.
            </p>

            <form onSubmit={handleInvite} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@anurajfx.com"
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent-cyan text-xs font-mono"
                />
              </div>

              <AFXButton
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-2 rounded-xl text-bg-base text-xs"
              >
                {loading ? 'Inviting...' : 'Send Invite'}
              </AFXButton>
            </form>
          </AFXCard>
        </div>

        {/* Right Side: Admins List */}
        <div className="md:col-span-2 space-y-6">
          <AFXCard className="bg-bg-surface border border-border-subtle p-0 overflow-hidden">
            <div className="p-6 border-b border-border-subtle/50">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-accent-purple" />
                Active Administrators
              </h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {admins.map((admin) => (
                <div key={admin.email} className="px-6 py-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-text-primary text-sm">{admin.name}</p>
                    <p className="text-text-secondary font-mono">{admin.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan font-bold uppercase tracking-wider font-mono">
                    {admin.role}
                  </span>
                </div>
              ))}
            </div>
          </AFXCard>
        </div>
      </div>
    </div>
  )
}
