import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import { getFirms } from '@/lib/firebase/server'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Laptop } from 'lucide-react'

export const metadata = {
  title: 'Free Prop Demo Accounts - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function DemoAccountsPage() {
  const firms = await getFirms('prop_firm')
  
  // Filter firms that support demo logins
  const demoFirms = firms.filter((f) => f.status === 'active' && f.has_demo === true)

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading flex items-center gap-2">
            <Laptop className="w-8 h-8 text-accent-cyan" />
            Free Trial & Demo Accounts
          </h1>
          <p className="text-text-secondary text-sm">
            Firms providing risk-free demo accounts to practice and test execution speeds before buying.
          </p>
        </div>

        {demoFirms.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {demoFirms.map((firm) => (
              <AFXCard
                key={firm.id}
                className="bg-bg-surface border border-border-subtle p-6 flex flex-col justify-between hover:border-accent-cyan/40 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bg-base rounded-xl flex items-center justify-center p-2 border border-border-subtle">
                      {firm.logo_url ? (
                        <img
                          src={firm.logo_url}
                          alt={firm.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-accent-cyan">{firm.name[0]}</span>
                      )}
                    </div>
                    <span className="font-bold text-text-primary text-base">{firm.name}</span>
                  </div>

                  <p className="text-text-secondary text-xs leading-relaxed">
                    Test trading platform executions, slippage, spreads, and dashboard telemetry free of charge with {firm.name}.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-subtle/50 mt-5">
                  <a
                    href={firm.demo_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl font-bold text-bg-base text-center hover:opacity-90 transition-opacity bg-gradient-to-r from-accent-cyan to-accent-blue text-xs"
                  >
                    Open Demo Account
                  </a>
                </div>
              </AFXCard>
            ))}
          </div>
        ) : (
          <div className="border border-border-subtle bg-bg-surface/50 p-12 text-center rounded-3xl">
            <p className="text-text-secondary text-sm font-semibold mb-4">No active demo logins currently registered.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
