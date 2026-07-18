'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { UserPlus, ShieldAlert, Crown, Shield, Headphones, Eye, Trash2, Check } from 'lucide-react'

interface AdminUser {
  email: string
  name: string
  role: 'admin' | 'manager' | 'support' | 'moderator'
}

const ROLES = [
  {
    value: 'admin',
    label: 'Admin',
    icon: Crown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    description: 'Full platform access. Can manage all settings, users, and content.',
    permissions: ['Manage Firms', 'Manage Deals', 'Manage Challenges', 'Blog Editor', 'Admin Roles', 'System Settings'],
  },
  {
    value: 'manager',
    label: 'Manager',
    icon: Shield,
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10 border-accent-cyan/30',
    description: 'Content manager. Can add and edit firms, deals, and challenges.',
    permissions: ['Manage Firms', 'Manage Deals', 'Manage Challenges', 'Blog Editor'],
  },
  {
    value: 'support',
    label: 'Support',
    icon: Headphones,
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10 border-accent-purple/30',
    description: 'Customer support. Can view and reply to contact messages.',
    permissions: ['View Messages', 'Reply to Messages', 'Mark Resolved'],
  },
  {
    value: 'moderator',
    label: 'Moderator',
    icon: Eye,
    color: 'text-accent-green',
    bg: 'bg-accent-green/10 border-accent-green/30',
    description: 'Content moderator. Can verify payout proofs and review submitted content.',
    permissions: ['Verify Payouts', 'View Reports', 'Review Content'],
  },
] as const

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    { name: 'Anuraj Admin', email: 'admin@anurajfx.com', role: 'admin' },
    { name: 'Support Team', email: 'support@anurajfx.com', role: 'support' },
  ])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminUser['role']>('manager')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteName) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAdmins((prev) => [...prev, { name: inviteName, email: inviteEmail, role: inviteRole }])
      setInviteEmail('')
      setInviteName('')
      setSuccess(`${inviteName} (${inviteRole}) has been added as an admin team member.`)
      setTimeout(() => setSuccess(''), 4000)
    }, 1000)
  }

  const handleRemove = (email: string) => {
    if (email === 'admin@anurajfx.com') {
      alert('You cannot remove the primary admin account.')
      return
    }
    if (!confirm('Remove this team member from admin access?')) return
    setAdmins((prev) => prev.filter((a) => a.email !== email))
  }

  const handleRoleChange = (email: string, newRole: AdminUser['role']) => {
    if (email === 'admin@anurajfx.com') {
      alert('Cannot change primary admin role.')
      return
    }
    setAdmins((prev) => prev.map((a) => (a.email === email ? { ...a, role: newRole } : a)))
  }

  const getRoleConfig = (role: string) => ROLES.find((r) => r.value === role)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
          System Settings
        </h1>
        <p className="text-text-secondary text-sm">Configure administrator roles and access levels for the ANURAJ FX platform.</p>
      </div>

      {/* Role Guide */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROLES.map((role) => (
          <AFXCard key={role.value} className={`bg-bg-surface border p-4 space-y-3 ${role.bg.replace('bg-', 'border-').split(' ')[0]}`}>
            <div className={`flex items-center gap-2`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${role.bg}`}>
                <role.icon className={`w-4 h-4 ${role.color}`} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${role.color}`}>{role.label}</span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">{role.description}</p>
            <div className="space-y-1">
              {role.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-1.5">
                  <Check className={`w-3 h-3 shrink-0 ${role.color}`} />
                  <span className="text-[10px] text-text-muted font-mono">{perm}</span>
                </div>
              ))}
            </div>
          </AFXCard>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Invite Form */}
        <div className="md:col-span-1 space-y-6">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-border-subtle/50 pb-2">
              <UserPlus className="w-5 h-5 text-accent-cyan" />
              Add Team Member
            </h3>

            {success && (
              <div className="p-3 bg-accent-green/10 border border-accent-green/30 rounded-xl text-xs text-accent-green font-mono">
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase">Display Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Support Team"
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent-cyan text-xs"
                />
              </div>
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase">Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminUser['role'])}
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent-cyan text-xs"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <AFXButton
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple font-bold py-2 rounded-xl text-bg-base text-xs"
              >
                {loading ? 'Adding...' : 'Add Team Member'}
              </AFXButton>
            </form>
          </AFXCard>
        </div>

        {/* Admins List */}
        <div className="md:col-span-2 space-y-6">
          <AFXCard className="bg-bg-surface border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle/50">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-accent-purple" />
                Admin Team Members
              </h3>
              <p className="text-text-muted text-xs mt-1">{admins.length} team members with panel access</p>
            </div>
            <div className="divide-y divide-border-subtle">
              {admins.map((admin) => {
                const roleConfig = getRoleConfig(admin.role)
                const RoleIcon = roleConfig?.icon || Shield
                return (
                  <div key={admin.email} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${roleConfig?.bg || 'bg-bg-base border-border-subtle'}`}>
                        <RoleIcon className={`w-4 h-4 ${roleConfig?.color || 'text-text-muted'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary text-sm truncate">{admin.name}</p>
                        <p className="text-text-muted text-[10px] font-mono truncate">{admin.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={admin.role}
                        onChange={(e) => handleRoleChange(admin.email, e.target.value as AdminUser['role'])}
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border bg-bg-base focus:outline-none focus:border-accent-cyan ${roleConfig?.color || 'text-text-muted'}`}
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>

                      {admin.email !== 'admin@anurajfx.com' && (
                        <button
                          onClick={() => handleRemove(admin.email)}
                          className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </AFXCard>

          {/* Permissions Reference */}
          <AFXCard className="bg-bg-surface border border-border-subtle p-5">
            <p className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">⚡ Role-Based Access Reference</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pr-3 text-text-muted font-bold">Permission</th>
                    {ROLES.map((r) => (
                      <th key={r.value} className={`text-center py-2 px-3 font-bold ${r.color}`}>{r.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/30">
                  {['Manage Firms', 'Manage Deals', 'Manage Challenges', 'Blog Editor', 'Contact Messages', 'Verify Payouts', 'Admin Roles', 'System Settings'].map((perm) => (
                    <tr key={perm}>
                      <td className="py-2 pr-3 text-text-secondary">{perm}</td>
                      {ROLES.map((r) => (
                        <td key={r.value} className="text-center py-2 px-3">
                          {r.permissions.some((p) => p.toLowerCase().includes(perm.toLowerCase().split(' ')[1] || perm.toLowerCase().split(' ')[0])) || r.value === 'admin' ? (
                            <span className={`${r.color}`}>✓</span>
                          ) : (
                            <span className="text-text-muted opacity-30">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AFXCard>
        </div>
      </div>
    </div>
  )
}
