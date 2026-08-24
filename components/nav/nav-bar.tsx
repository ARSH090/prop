'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { AFXButton } from '@/components/ui/afx-button'
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  Star,
  Building2,
  Award,
  BarChart3,
  Zap,
  BookOpen,
  Trophy,
  Calendar,
  ArrowUpDown,
  DollarSign,
  Globe,
  Percent,
  Home,
  Users,
  Search,
  Bell,
  User,
  MessageSquare,
} from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { signOut } from 'firebase/auth'
import { LoginPopup } from '@/components/ui/login-popup'

interface NavLink {
  label: string
  href: string
}

interface NavBarProps {
  links?: NavLink[]
}

const toolsLinks = [
  { label: 'Community Hub', href: '/community', icon: Users },
  { label: 'Payout Proofs', href: '/payouts', icon: DollarSign },
  { label: 'Payout Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Trader Reviews', href: '/reviews', icon: MessageSquare },
  { label: 'Industry Awards', href: '/awards', icon: Award },
  { label: 'Demo Accounts', href: '/demo-accounts', icon: Globe },
]

const subNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Propfirms', href: '/firms' },
  { label: 'Offers', href: '/deals' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'PropFirm RULES', href: '/rules' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'COMMUNITY', href: '/community' },
  { label: 'Compare Firms', href: '/compare' },
]

const mobileMenuCategories = [
  {
    title: 'DISCOVER',
    links: [
      { label: 'Home', href: '/', icon: Home },
      { label: 'Prop Firms', href: '/firms', icon: Building2 },
      { label: 'Challenges', href: '/challenges', icon: Award },
      { label: 'Trader Reviews', href: '/reviews', icon: MessageSquare },
      { label: 'Compare Firms', href: '/compare', icon: BarChart3 },
    ],
  },
  {
    title: 'TOOLS',
    links: [
      { label: 'Community Hub', href: '/community', icon: Users },
      { label: 'Payout Proofs', href: '/payouts', icon: DollarSign },
      { label: 'Payout Leaderboard', href: '/leaderboard', icon: Trophy },
      { label: 'Industry Awards', href: '/awards', icon: Award },
      { label: 'Demo Accounts', href: '/demo-accounts', icon: Globe },
    ],
  },
  {
    title: 'COMMUNITY',
    links: [
      { label: 'Discussions Hub', href: '/community', icon: Users },
      { label: 'Blog & Guides', href: '/blog', icon: BookOpen },
      { label: 'Events', href: '/events', icon: Calendar },
    ],
  },
]

const formatTimeAgo = (timestamp: any) => {
  if (!timestamp) return 'Just now'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NavBar({ links = subNavLinks }: NavBarProps) {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        const list = data.data || []

        let readIds: string[] = []
        if (typeof window !== 'undefined') {
          try {
            readIds = JSON.parse(localStorage.getItem('read_notification_ids') || '[]')
          } catch (e) {
            console.error(e)
          }
        }

        const formatted = list.map((n: any) => {
          let dateObj = new Date()
          if (n.created_at) {
            dateObj = n.created_at.seconds ? new Date(n.created_at.seconds * 1000) : new Date(n.created_at)
          }
          return {
            id: n.id,
            title: n.title || 'Notification',
            message: n.message || '',
            time: formatTimeAgo(dateObj),
            read: readIds.includes(n.id)
          }
        })
        setNotifications(formatted)
      }
    } catch (err) {
      console.error('Error loading notifications:', err)
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [currentUser])

  const toolsCloseTimer = useRef<NodeJS.Timeout | null>(null)
  const userMenuCloseTimer = useRef<NodeJS.Timeout | null>(null)
  const notifCloseTimer = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const isChallengesPage = pathname?.includes('/challenges')
  const navBgClass = 'bg-transparent border-none shadow-none'

  const handleNotifMouseEnter = () => {
    if (notifCloseTimer.current) clearTimeout(notifCloseTimer.current)
    setNotificationsOpen(true)
  }

  const handleNotifMouseLeave = () => {
    notifCloseTimer.current = setTimeout(() => {
      setNotificationsOpen(false)
    }, 300)
  }

  const markAllRead = () => {
    if (typeof window !== 'undefined') {
      try {
        const ids = notifications.map(n => n.id)
        localStorage.setItem('read_notification_ids', JSON.stringify(ids))
      } catch (err) {
        console.error(err)
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setNotificationsOpen(false)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // Determine active category and relative path
  let activeCategory = 'forex'
  let relativePath = pathname

  if (pathname.startsWith('/futures')) {
    activeCategory = 'futures'
    relativePath = pathname.replace('/futures', '') || '/'
  } else if (pathname.startsWith('/crypto')) {
    activeCategory = 'crypto'
    relativePath = pathname.replace('/crypto', '') || '/'
  }

  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath
  }

  const handleCategoryChange = (newCat: string) => {
    let targetPath = ''
    if (newCat === 'forex') {
      targetPath = relativePath
    } else {
      targetPath = `/${newCat}${relativePath === '/' ? '' : relativePath}`
    }
    // Safeguard to redirect home if on a non-category route
    const allowedBasePaths = ['/', '/best-sellers', '/challenges', '/deals', '/leaderboard', '/offers', '/reviews']
    if (!allowedBasePaths.includes(relativePath)) {
      targetPath = newCat === 'forex' ? '/' : `/${newCat}`
    }
    router.push(targetPath)
  }

  const getSubNavLinkHref = (href: string) => {
    if (activeCategory === 'forex') return href
    if (href === '/') return `/${activeCategory}`
    const isGlobalRoute = ['/rules', '/spreads', '/payouts', '/reviews'].includes(href)
    if (isGlobalRoute) return href
    return `/${activeCategory}${href}`
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
    })
    return unsub
  }, [])

  const handleToolsMouseEnter = () => {
    if (toolsCloseTimer.current) clearTimeout(toolsCloseTimer.current)
    setToolsOpen(true)
  }

  const handleToolsMouseLeave = () => {
    toolsCloseTimer.current = setTimeout(() => {
      setToolsOpen(false)
    }, 300)
  }

  const handleUserMenuMouseEnter = () => {
    if (userMenuCloseTimer.current) clearTimeout(userMenuCloseTimer.current)
    setUserMenuOpen(true)
  }

  const handleUserMenuMouseLeave = () => {
    userMenuCloseTimer.current = setTimeout(() => {
      setUserMenuOpen(false)
    }, 300)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUserMenuOpen(false)
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  const getUserInitials = (user: any) => {
    if (!user) return 'U'
    const name = user.displayName || user.email || 'User'
    return name.charAt(0).toUpperCase()
  }

  const getUserDisplayName = (user: any) => {
    if (!user) return 'User'
    return user.displayName || user.email?.split('@')[0] || 'Trader'
  }

  return (
    <>
      <header className="relative z-50 bg-transparent">
        {/* Row 1: Brand Logo, Category Switcher & Main Actions (Non-sticky: scrolls with page) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 border-b-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 text-text-primary shrink-0">
              <img src="/logo.png" alt="EMPIRIAL Logo" className="h-8 w-auto rounded-lg object-contain" />
              <span className="text-2xl md:text-3xl font-black tracking-widest afx-gradient-heading font-bebas">
                EMPIRIAL
              </span>
            </Link>



            {/* Action Buttons & Hamburger Menu */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                /* Logged-in User Menu */
                <div
                  className="relative"
                  onMouseEnter={handleUserMenuMouseEnter}
                  onMouseLeave={handleUserMenuMouseLeave}
                >
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-base border border-border-subtle hover:border-accent-cyan/40 transition-all">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-bg-base">
                      {getUserInitials(currentUser)}
                    </div>
                    <span className="text-xs font-semibold text-text-primary hidden sm:block max-w-[100px] truncate">
                      {getUserDisplayName(currentUser)}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-10 right-0 w-52 bg-[#12131a]/95 border border-white/20 rounded-2xl shadow-2xl py-2 mt-1 backdrop-blur-xl animate-fade-in z-50 overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-white/10 mb-1 bg-white/[0.03]">
                        <p className="text-xs font-black text-white tracking-wide truncate">{getUserDisplayName(currentUser)}</p>
                        <p className="text-[11px] font-bold text-slate-300 truncate mt-0.5">{currentUser.email}</p>
                      </div>
                      <Link
                        href="/loyalty"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-white font-extrabold hover:text-accent-cyan hover:bg-white/10 transition-all tracking-wide"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 text-accent-cyan shrink-0" />
                        VIEW PROFILE
                      </Link>
                      <Link
                        href="/payouts"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-white font-extrabold hover:text-accent-cyan hover:bg-white/10 transition-all tracking-wide"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                        Payout Proofs
                      </Link>
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-extrabold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full text-left tracking-wide"
                        >
                          <LogOut className="w-4 h-4 text-red-400 shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="hidden sm:block">
                    <AFXButton variant="ghost" size="sm">
                      Sign In
                    </AFXButton>
                  </Link>
                  <Link href="/auth/sign-up" className="hidden sm:block">
                    <AFXButton variant="primary" size="sm" className="bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">
                      Sign Up
                    </AFXButton>
                  </Link>
                </>
              )}

              {/* Notification Bell Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleNotifMouseEnter}
                onMouseLeave={handleNotifMouseLeave}
              >
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl bg-bg-base border border-border-subtle text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/40 transition-all focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-extrabold text-[8px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute top-9 right-0 w-80 bg-bg-surface border border-border-subtle rounded-2xl shadow-2xl py-3 mt-1.5 backdrop-blur-md animate-fade-in z-50 space-y-2">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-border-subtle/50">
                      <span className="text-xs font-black text-text-primary uppercase tracking-wider">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[10px] text-accent-cyan hover:underline font-bold bg-transparent cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-[10px] text-red-400 hover:text-red-300 hover:underline font-bold bg-transparent cursor-pointer"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-border-subtle/30 px-2 space-y-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-text-muted text-xs font-semibold">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2.5 rounded-xl transition-colors text-xs ${notif.read ? 'hover:bg-bg-base/30' : 'bg-accent-cyan/[0.03] hover:bg-accent-cyan/[0.06] border-l-2 border-accent-cyan'}`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-0.5">
                              <span className={`font-black ${notif.read ? 'text-text-primary' : 'text-accent-cyan'}`}>
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-text-muted font-mono whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-text-secondary leading-relaxed text-[11px] font-semibold">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="text-center pt-2 border-t border-border-subtle/50">
                      <Link
                        href="/community"
                        className="text-[10px] font-bold text-text-muted hover:text-accent-cyan uppercase tracking-wider transition-colors"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View discussions hub
                      </Link>
                    </div>
                  </div>
                )}
              </div>



              {/* Hamburger Button (Always visible on all screen sizes next to actions) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-primary hover:border-accent-cyan/40 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Row 2: Sticky Sub-navigation pages option pill bar (Exact Screenshot Pink/Purple #b038ff container with matching border depth, Blue BG & White Text for active elements) */}
      <div className="sticky top-0 z-40 py-2 pb-3 flex items-center justify-center bg-transparent pointer-events-none">
        <div
          className="pointer-events-auto flex h-11 items-center justify-center backdrop-blur-md rounded-full px-4 py-1 gap-1.5 md:gap-2 mx-auto max-w-fit overflow-x-auto scrollbar-none border transition-all"
          style={{
            backgroundColor: 'rgba(176, 56, 255, 0.22)',
            borderColor: 'rgba(176, 56, 255, 0.65)',
            boxShadow: '0 8px 32px rgba(176, 56, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 16px rgba(176, 56, 255, 0.25)',
          }}
        >
          {links.map((link) => {
            const resolvedHref = getSubNavLinkHref(link.href)
            const isActive = pathname === resolvedHref
            return (
              <Link
                key={link.href}
                href={resolvedHref}
                className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-black uppercase tracking-wider transition-all whitespace-nowrap border select-none ${isActive
                    ? 'bg-blue-600 text-white border-blue-400/60 shadow-[0_0_14px_rgba(37,99,235,0.6)] font-black'
                    : 'text-white/90 hover:text-white hover:bg-blue-600/30 border-transparent'
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Sidebar */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-80 max-w-[90vw] bg-bg-surface border-l border-border-subtle flex flex-col transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EMPIRIAL Logo" className="h-8 w-auto rounded-lg object-contain" />
            <span className="text-lg font-black tracking-tight text-text-primary">
              EMPIRIAL
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl bg-bg-base border border-border-subtle text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile User Status */}
        {currentUser ? (
          <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-accent-cyan/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-sm font-bold text-bg-base shrink-0">
              {getUserInitials(currentUser)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">{getUserDisplayName(currentUser)}</p>
              <p className="text-xs text-text-muted truncate">{currentUser.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-text-muted hover:text-red-400 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-border-subtle flex gap-3">
            <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
              <AFXButton variant="ghost" className="w-full text-sm">Sign In</AFXButton>
            </Link>
            <Link href="/auth/sign-up" className="flex-1" onClick={() => setMobileOpen(false)}>
              <AFXButton variant="primary" className="w-full text-sm bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">Sign Up</AFXButton>
            </Link>
          </div>
        )}

        {/* Mobile Navigation Categories */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Mobile Category pills switcher */}
          <div className="px-3 mb-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Category</p>
            <div className="flex items-center gap-1 bg-bg-base border border-border-subtle rounded-full p-1 shadow-lg w-full justify-around">
              {['forex', 'futures', 'crypto'].map((tab) => {
                const isActive = activeCategory === tab
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      handleCategoryChange(tab)
                      setMobileOpen(false)
                    }}
                    className={`relative px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 text-center ${isActive
                        ? 'bg-gradient-cta text-bg-base'
                        : 'text-text-secondary hover:text-text-primary bg-transparent'
                      }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {mobileMenuCategories.map((category) => (
            <div key={category.title}>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-3 mb-2">{category.title}</p>
              <div className="space-y-1">
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-cyan hover:bg-bg-base/50 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <link.icon className="w-4 h-4 text-accent-cyan/60 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-border-subtle">
          <Link href="/deals" onClick={() => setMobileOpen(false)}>
            <AFXButton variant="primary" className="w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-base font-bold">
              <Zap className="w-4 h-4 mr-2" />
              Get Exclusive Codes
            </AFXButton>
          </Link>
        </div>
      </div>
      <LoginPopup />
    </>
  )
}

export default NavBar
