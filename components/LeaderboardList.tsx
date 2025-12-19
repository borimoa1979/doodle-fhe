'use client'

import { useState, useEffect } from 'react'
import { ethers, JsonRpcProvider } from 'ethers'
import { formatDistanceToNow } from 'date-fns'

const LEADERBOARD_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000').trim()

const LEADERBOARD_ABI = [
  'function getScoreCount() external view returns (uint256)',
  'function getEncryptedScore(uint256 index) external view returns (address player, bytes32 encryptedScore, uint256 timestamp)',
  'function getRecentScores(uint256 count) external view returns (address[] memory players, bytes32[] memory encryptedScores, uint256[] memory timestamps)',
]

interface ScoreEntry {
  player: string
  encryptedScore: string
  timestamp: number
  rank: number
}

export default function LeaderboardList() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLeaderboard()
    const interval = setInterval(loadLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!ethers.isAddress(LEADERBOARD_CONTRACT_ADDRESS) || LEADERBOARD_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        setLoading(false)
        return
      }

      const provider = new JsonRpcProvider('https://sepolia.drpc.org')
      const contract = new ethers.Contract(LEADERBOARD_CONTRACT_ADDRESS, LEADERBOARD_ABI, provider)

      const count = await contract.getScoreCount()
      const totalScores = Number(count)

      if (totalScores === 0) {
        setScores([])
        setLoading(false)
        return
      }

      // Get recent scores (last 50)
      const recentCount = Math.min(50, totalScores)
      const [players, encryptedScores, timestamps] = await contract.getRecentScores(recentCount)

      const entries: ScoreEntry[] = []
      for (let i = 0; i < players.length; i++) {
        entries.push({
          player: players[i],
          encryptedScore: encryptedScores[i],
          timestamp: Number(timestamps[i]),
          rank: totalScores - i,
        })
      }

      // Reverse to show newest first
      entries.reverse()
      setScores(entries)
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard')
      setScores([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && scores.length === 0) {
    return (
      <div className="pixel-card text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="pixel-text">LOADING LEADERBOARD...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pixel-card text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="pixel-text mb-4">ERROR LOADING LEADERBOARD</p>
        <p className="pixel-text text-sm mb-6">{error}</p>
        <button onClick={loadLeaderboard} className="pixel-button pixel-text">
          RETRY
        </button>
      </div>
    )
  }

  if (scores.length === 0) {
    return (
      <div className="pixel-card text-center">
        <div className="text-4xl mb-4">🏆</div>
        <p className="pixel-text text-xl mb-4">NO SCORES YET</p>
        <p className="pixel-text text-sm">BE THE FIRST TO SUBMIT A SCORE!</p>
      </div>
    )
  }

  return (
    <div className="pixel-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black pixel-text">LEADERBOARD</h2>
        <button
          onClick={loadLeaderboard}
          disabled={loading}
          className="pixel-bg-alt pixel-text text-sm px-3 py-1"
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>
      <div className="space-y-2">
        {scores.map((entry, index) => (
          <div
            key={`${entry.player}-${entry.timestamp}`}
            className="pixel-bg-alt p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="pixel-text font-bold w-8">#{entry.rank}</span>
              <span className="pixel-text text-sm">
                {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="pixel-text text-xs">
                🔐 ENCRYPTED
              </span>
              <span className="pixel-text text-xs">
                {formatDistanceToNow(new Date(entry.timestamp * 1000), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="pixel-text text-xs">
          SCORES ARE ENCRYPTED. ONLY PLAYERS CAN DECRYPT THEIR OWN SCORES.
        </p>
      </div>
    </div>
  )
}

