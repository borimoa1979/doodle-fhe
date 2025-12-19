'use client'

import LeaderboardList from '@/components/LeaderboardList'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-black">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6 pixel-text">
            LEADERBOARD
          </h1>
          <p className="text-lg pixel-text">
            ANONYMOUS ENCRYPTED SCORES ON BLOCKCHAIN
          </p>
        </div>
        <LeaderboardList />
      </div>
    </div>
  )
}

