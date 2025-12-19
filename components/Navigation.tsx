'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="w-full sticky top-0 z-50" style={{ 
      background: '#87CEEB',
      borderBottom: '3px solid #000',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-xl font-black rounded" style={{
            background: '#FFD700',
            border: '2px solid #000',
            boxShadow: '2px 2px 0px #000'
          }}>
            🎮
          </div>
          <span className="text-xl font-black" style={{ color: '#000', textShadow: '1px 1px 0px #FFF' }}>
            DOODLE JUMP FHE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`px-4 py-2 font-bold rounded transition-all ${
              pathname === '/'
                ? 'text-white'
                : 'text-black hover:opacity-80'
            }`}
            style={pathname === '/' ? {
              background: '#FFD700',
              border: '2px solid #000',
              boxShadow: '2px 2px 0px #000'
            } : {
              background: 'transparent',
              border: '2px solid transparent'
            }}
          >
            PLAY
          </Link>
          <Link
            href="/leaderboard"
            className={`px-4 py-2 font-bold rounded transition-all ${
              pathname === '/leaderboard'
                ? 'text-white'
                : 'text-black hover:opacity-80'
            }`}
            style={pathname === '/leaderboard' ? {
              background: '#FFD700',
              border: '2px solid #000',
              boxShadow: '2px 2px 0px #000'
            } : {
              background: 'transparent',
              border: '2px solid transparent'
            }}
          >
            LEADERBOARD
          </Link>
          <Link
            href="/about"
            className={`px-4 py-2 font-bold rounded transition-all ${
              pathname === '/about'
                ? 'text-white'
                : 'text-black hover:opacity-80'
            }`}
            style={pathname === '/about' ? {
              background: '#FFD700',
              border: '2px solid #000',
              boxShadow: '2px 2px 0px #000'
            } : {
              background: 'transparent',
              border: '2px solid transparent'
            }}
          >
            ABOUT
          </Link>
        </nav>

        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

