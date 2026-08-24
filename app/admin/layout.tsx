'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'
import {
  LayoutDashboard,
  FileText,
  Building2,
  Percent,
  MessageSquare,
  Newspaper,
  TrendingUp,
  Image,
  Settings,
  Menu,
  X,
  LogOut,
  Award,
  ArrowUpDown,
  DollarSign,
  Mail,
  Calendar,
  Globe,
  Zap,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Page Builder', href: '/admin/page-builder', icon: FileText },
  { name: 'Firms', href: '/admin/firms', icon: Building2 },
  { name: 'Challenges', href: '/admin/challenges', icon: Award },
  { name: 'Deals', href: '/admin/deals', icon: Percent },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Blog', href: '/admin/blog', icon: Newspaper },
  { name: 'Market Tickers', href: '/admin/market-ticker', icon: TrendingUp },
  { name: 'Broker Spreads', href: '/admin/spreads', icon: ArrowUpDown },
  { name: 'Payout Proofs', href: '/admin/payouts', icon: DollarSign },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Contact Messages', href: '/admin/messages', icon: Mail },
  { name: 'Loyalty Program', href: '/admin/loyalty', icon: Zap },
  { name: 'Media Library', href: '/admin/media', icon: Image },
  { name: 'Globe Logos', href: '/admin/page-builder?page=globe', icon: Globe },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user: any) => {
      if (user) {
        // Fast-path: check designated admin emails first to avoid Firestore reads/errors
        if (user.email === 'admin@anurajfx.com' || user.email === 'admin@empirial.com') {
          setIsAdmin(true)
          setCheckingAuth(false)
          return
        }

        try {
          const profileDoc = await getDoc(doc(db, 'profiles', user.uid))
          const isUserAdmin = profileDoc.exists() && profileDoc.data()?.role === 'admin'
          
          if (isUserAdmin) {
            setIsAdmin(true)
          } else {
            setIsAdmin(false)
            router.push('/')
          }
        } catch (error) {
          console.warn('Profile document read restricted or unavailable. Access denied.')
          setIsAdmin(false)
          router.push('/')
        } finally {
          setCheckingAuth(false)
        }
      } else {
        setIsAdmin(false)
        setCheckingAuth(false)
        router.push('/auth/login?redirect=' + encodeURIComponent(pathname))
      }
    })
    return unsub
  }, [router, pathname])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-bg-surface border border-border-subtle text-text-primary focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-bg-surface border-r border-border-subtle flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-border-subtle">
            <img src="/logo.png" alt="EMPIRIAL Logo" className="h-8 w-auto rounded-lg object-contain" />
            <span className="text-lg font-black tracking-tight text-text-primary">
              EMPIRIAL
            </span>
            <span className="text-[9px] bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-full font-mono font-bold uppercase shrink-0">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/30 text-accent-cyan'
                      : 'text-text-secondary hover:bg-bg-base hover:text-text-primary border border-transparent'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-accent-cyan' : 'text-text-muted group-hover:text-text-primary'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile / Logout Footer */}
          <div className="p-4 border-t border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Empirial Admin" className="w-9 h-9 rounded-lg object-contain" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-text-primary">Empirial Admin</p>
                <p className="text-[10px] text-text-muted truncate">admin@empirial.com</p>
              </div>
            </div>
            <button
              onClick={() => {
                router.push('/')
              }}
              className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-bg-base transition-all"
              title="Return to Site"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-6 md:p-10 relative overflow-y-auto max-md:pt-20">
        <div className="mx-auto max-w-6xl space-y-8">{children}</div>
      </main>
    </div>
  )
}
export const dynamic = 'force-dynamic'
