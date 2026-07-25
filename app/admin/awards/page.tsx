import React from 'react'
import { getFirms } from '@/lib/firebase/server'
import AwardsAdminClient from './AwardsAdminClient'

export const metadata = {
  title: 'Awards Admin Control - ANURAJ FX Admin',
}

export const dynamic = 'force-dynamic'

export default async function AwardsAdminPage() {
  const firms = await getFirms()
  const activeFirms = firms.filter((f) => f.status === 'active')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">AFX Awards Admin Dashboard</h1>
        <p className="text-text-secondary text-sm">
          Initialize new award categories, manage candidates (active prop firms), view real-time vote tallies, and reset yearly cycles.
        </p>
      </div>

      <AwardsAdminClient activeFirms={activeFirms} />
    </div>
  )
}
