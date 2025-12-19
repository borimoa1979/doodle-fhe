import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Doodle Jump FHE | Anonymous Leaderboard',
  description: 'Play Doodle Jump and submit your encrypted score anonymously to the blockchain leaderboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof global === 'undefined') {
                window.global = globalThis;
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen`} style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)' }}>
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

