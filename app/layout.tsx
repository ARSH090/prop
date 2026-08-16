import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { NotificationToast } from '@/components/ui/notification-toast'
import { SparklingStars } from '@/components/ui/sparkling-stars'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'ANURAJ FX - Prop Firm & Broker Intelligence Platform',
  description: 'Compare prop firms, regulated brokers, and get exclusive discount codes. AFX Trade Intelligence for Indian traders.',
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05070D' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-background font-semibold">
        {/* Background grids (global stars) */}
        <div className="global-stars pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
        
        {/* Sparkling Stars */}
        <SparklingStars />

        {/* Fixed background neon glows on left and right for all pages */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Neon Cyan on the left */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.09] blur-[130px] top-[-100px] left-[-200px]"
            style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)' }}
          />
          {/* Neon Purple on the right */}
          <div 
            className="absolute w-[700px] h-[700px] rounded-full opacity-[0.08] blur-[150px] top-[15%] right-[-250px]"
            style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
          />
          {/* Neon Pink on the left */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[140px] top-[45%] left-[-250px]"
            style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
          />
          {/* Neon Blue on the right */}
          <div 
            className="absolute w-[650px] h-[650px] rounded-full opacity-[0.08] blur-[140px] top-[70%] right-[-200px]"
            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10">
          {children}
        </div>

        <NotificationToast />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
