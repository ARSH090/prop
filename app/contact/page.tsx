import React from 'react'
import { NavBar } from '@/components/nav/nav-bar'
import { Footer } from '@/components/footer'
import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact Support - ANURAJ FX',
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <ContactClient />
      </main>
      <Footer />
    </div>
  )
}
