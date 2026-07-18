'use client'

import React, { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { AFXCard } from '@/components/ui/afx-card'
import { auth } from '@/lib/firebase/client'
import { 
  LayoutGrid, 
  User, 
  LineChart, 
  Shield, 
  Share2, 
  Gift, 
  HelpCircle, 
  MessageSquare, 
  Bookmark, 
  Sparkles, 
  Lock,
  ChevronRight
} from 'lucide-react'

// Custom Diamond SVG Icon matching the screenshot
function DiamondIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 12L12 22L22 12L12 2Z" />
    </svg>
  )
}

export default function LoyaltyPage() {
  const [activeMenu, setActiveMenu] = useState('Overview')
  const [loyaltyTab, setLoyaltyTab] = useState<'Accounts' | 'History'>('Accounts')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [promoCode, setPromoCode] = useState('')

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
    return unsub
  }, [])

  const userDisplayName = currentUser?.displayName || 'Anuraj Barala'
  const userEmail = currentUser?.email || 'anurajkumarjaat@gmail.com'
  const userInitials = userDisplayName.charAt(0).toUpperCase()

  const sidebarMenuItems = [
    { name: 'Overview', icon: LayoutGrid },
    { name: 'My Profile', icon: User },
    { name: 'Analytics', icon: LineChart, badge: 'NEW' },
    { name: 'Account Security', icon: Shield },
    { name: 'Affiliate Program', icon: Share2 },
    { name: 'Weekly Giveaway', icon: Gift, suffix: '✨' },
    { name: 'FAQ & Support', icon: HelpCircle },
    { name: 'My Reviews', icon: MessageSquare },
    { name: 'Pending Reviews', icon: MessageSquare },
    { name: 'Bookmarks', icon: Bookmark },
  ]

  const loyaltyRewards = [
    { size: '5K', points: '2,000' },
    { size: '10K', points: '4,000' },
    { size: '25K', points: '7,000' },
    { size: '50K', points: '10,000' },
    { size: '100K', points: '16,000' },
    { size: '200K', points: '28,000' },
    { size: '300K', points: null },
    { size: '400K', points: null },
    { size: '500K', points: null },
  ]

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim()) {
      alert(`Code "${promoCode}" submitted! This features requires account points audit.`)
      setPromoCode('')
    }
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex flex-col space-y-4">
              
              {/* User details */}
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center font-bold text-lg text-bg-base">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text-primary text-base truncate">{userDisplayName}</h3>
                  <p className="text-text-secondary text-xs truncate">{userEmail}</p>
                </div>
              </div>

              {/* Loyalty Points Card */}
              <div className="bg-[#120F1D] border border-[#271E3A] rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-purple-950/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                <h4 className="text-sm font-extrabold text-white tracking-wide uppercase mb-3">
                  Loyalty Points
                </h4>
                
                {/* Custom purple progress bar */}
                <div className="w-full bg-[#1F192C] h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-accent-purple to-pink-500 h-full rounded-full w-[25%]" />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-white font-bold text-base">
                    <DiamondIcon className="w-4 h-4 text-purple-400" />
                    200
                  </div>
                  <span className="text-xs font-bold text-orange-500 font-mono">
                    0/6
                  </span>
                </div>
              </div>

              {/* Vertical Menu Options */}
              <div className="space-y-1">
                {sidebarMenuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeMenu === item.name
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                        isActive 
                          ? 'bg-bg-surface text-accent-cyan border-l-2 border-accent-cyan pl-4' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : 'text-text-secondary/80'}`} />
                        <span>{item.name} {item.suffix && <span className="ml-1">{item.suffix}</span>}</span>
                      </div>
                      
                      {item.badge && (
                        <span className="bg-[#0e372e] text-[#10b981] font-bold text-[9px] px-2 py-0.5 rounded tracking-wide">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Your Points Balance Card */}
              <div className="md:col-span-2 bg-[#120F1D] border border-[#231A32] rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                
                <div className="space-y-4">
                  <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    Your Points Balance
                    <span className="text-text-muted text-[10px] cursor-help">ⓘ</span>
                  </h3>
                  
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#D946EF]/20 flex items-center justify-center text-purple-400">
                      <DiamondIcon className="w-5 h-5" />
                    </div>
                    <span className="text-4xl font-extrabold text-white tracking-tight font-mono">200</span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-bg-base bg-gradient-to-r from-accent-purple via-pink-500 to-accent-cyan hover:opacity-95 transition-opacity shadow-lg shadow-purple-950/20">
                      Claim
                    </button>
                    <button className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-purple-300 border border-[#8B5CF6]/40 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 transition-colors">
                      Redeem
                    </button>
                  </div>

                  <form onSubmit={handlePromoSubmit} className="pt-2">
                    <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1.5">
                      Extra Loyalty Points Code
                      <span className="text-text-muted text-[9px] ml-1">ⓘ</span>
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        placeholder="Enter a code..."
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-[#1A1526] border border-[#2D233F] rounded-xl py-2.5 pl-4 pr-20 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent-purple transition-colors font-mono"
                      />
                      <button 
                        type="submit"
                        className="absolute right-1.5 py-1.5 px-3 rounded-lg text-[10px] font-bold bg-gradient-to-r from-accent-purple to-pink-500 text-white hover:opacity-90 transition-opacity"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-[#231A32] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">Tier 1</span>
                    <span className="font-mono text-purple-400 font-bold">200 / 2,000</span>
                  </div>
                  <div className="w-full bg-[#1A1526] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-accent-purple to-accent-cyan h-full rounded-full w-[10%]" />
                  </div>
                </div>

              </div>

              {/* Accounts vs Loyalty Points Card */}
              <div className="md:col-span-3 bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <h3 className="text-white text-sm font-bold">
                      Accounts vs. Loyalty Points
                    </h3>
                    
                    {/* Tiny inline tabs */}
                    <div className="flex bg-bg-base/60 border border-border-subtle p-0.5 rounded-xl">
                      <button 
                        onClick={() => setLoyaltyTab('Accounts')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          loyaltyTab === 'Accounts' 
                            ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle' 
                            : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        Accounts
                      </button>
                      <button 
                        onClick={() => setLoyaltyTab('History')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          loyaltyTab === 'History' 
                            ? 'bg-[#1C2030] text-accent-cyan border border-border-subtle' 
                            : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        History
                      </button>
                    </div>
                  </div>

                  {loyaltyTab === 'Accounts' ? (
                    /* Accounts Grid */
                    <div className="grid grid-cols-3 gap-3">
                      {loyaltyRewards.map((reward, i) => (
                        <div 
                          key={i} 
                          className="bg-[#0F1321] border border-border-subtle rounded-xl p-3 flex flex-col justify-between h-20 relative group hover:border-[#8B5CF6]/30 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-white font-extrabold text-xs tracking-wide">
                              {reward.size}
                            </span>
                            <Lock className="w-3 h-3 text-purple-400/50" />
                          </div>
                          
                          <div className="text-[10px] font-bold text-red-500/90 font-mono mt-2">
                            {reward.points ? (
                              <span>{reward.points}</span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 mx-auto text-text-muted" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* History Log */
                    <div className="space-y-2 py-2">
                      {[
                        { action: 'Daily Reward Claimed', points: '+10 PTS', date: 'Today, 10:15 AM' },
                        { action: 'Challenge Registration', points: '+150 PTS', date: '15 Jul 2026' },
                        { action: 'Initial Bonus Points', points: '+40 PTS', date: '10 Jul 2026' }
                      ].map((log, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border-subtle/50 last:border-0">
                          <div>
                            <p className="text-xs font-semibold text-white">{log.action}</p>
                            <p className="text-[10px] text-text-muted">{log.date}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-accent-green">{log.points}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                <p className="text-[10px] text-text-muted mt-4 font-mono">
                  Points can be accumulated and redeemed for free evaluation challenges. Verification rules apply.
                </p>

              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
