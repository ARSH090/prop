import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
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

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
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
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} ${jakarta.variable}`}>
      <body className="antialiased bg-gradient-to-b from-[#0b132b] via-[#101b38] to-[#080e20] text-text-primary min-h-screen font-semibold">
        {/* Background grids (global stars) */}
        <div className="global-stars pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

        {/* Sparkling Stars */}
        <SparklingStars />

        {/* Fixed screen-level background glows - vibrant sky-blue ambient aura */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Sky Blue top left */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full opacity-[0.22] blur-[150px] top-[-100px] left-[-150px]"
            style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 65%)' }}
          />
          {/* Electric Sky Blue top right */}
          <div
            className="absolute w-[850px] h-[850px] rounded-full opacity-[0.20] blur-[160px] top-[10%] right-[-150px]"
            style={{ background: 'radial-gradient(circle, #00d8ff 0%, transparent 65%)' }}
          />
          {/* Deep Cyan / Sky Blue middle center */}
          <div
            className="absolute w-[750px] h-[750px] rounded-full opacity-[0.18] blur-[150px] top-[45%] left-[-100px]"
            style={{ background: 'radial-gradient(circle, #0284c7 0%, transparent 65%)' }}
          />
          {/* Sky Blue bottom right */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full opacity-[0.20] blur-[160px] top-[70%] right-[-150px]"
            style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 65%)' }}
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
