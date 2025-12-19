'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-black">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 pixel-text">
            ABOUT
          </h1>
          <p className="text-lg pixel-text">
            LEARN MORE ABOUT DOODLE JUMP FHE
          </p>
        </div>

        <div className="space-y-6">
          <div className="pixel-card">
            <h2 className="text-3xl font-black mb-6 pixel-text">WHAT IS THIS?</h2>
            <p className="pixel-text leading-relaxed">
              DOODLE JUMP FHE IS A CLASSIC PLATFORMER GAME WITH AN ANONYMOUS ENCRYPTED LEADERBOARD BUILT ON ETHEREUM USING ZAMA'S FULLY HOMOMORPHIC ENCRYPTION (FHE) TECHNOLOGY. 
              YOUR SCORES ARE ENCRYPTED AND STORED ON THE BLOCKCHAIN, ENSURING COMPLETE PRIVACY.
            </p>
          </div>

          <div className="pixel-card">
            <h2 className="text-3xl font-black mb-6 pixel-text">HOW IT WORKS?</h2>
            <div className="space-y-4">
              <div className="pixel-bg-alt p-4">
                <h3 className="text-xl font-black mb-2 pixel-text">1. PLAY THE GAME</h3>
                <p className="pixel-text text-sm">JUMP ON PLATFORMS, AVOID FALLING. SCORE AS HIGH AS YOU CAN.</p>
              </div>
              <div className="pixel-bg-alt p-4">
                <h3 className="text-xl font-black mb-2 pixel-text">2. ENCRYPT YOUR SCORE</h3>
                <p className="pixel-text text-sm">YOUR SCORE IS ENCRYPTED USING ZAMA'S FHE TECHNOLOGY BEFORE BEING SENT TO THE BLOCKCHAIN.</p>
              </div>
              <div className="pixel-bg-alt p-4">
                <h3 className="text-xl font-black mb-2 pixel-text">3. ANONYMOUS LEADERBOARD</h3>
                <p className="pixel-text text-sm">SCORES ARE STORED ENCRYPTED. NO ONE CAN SEE YOUR ACTUAL SCORE UNTIL YOU DECRYPT IT.</p>
              </div>
            </div>
          </div>

          <div className="pixel-card">
            <h2 className="text-3xl font-black mb-6 pixel-text">TECHNOLOGY</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="pixel-bg-alt p-4">
                <h3 className="text-xl font-black mb-2 pixel-text">ZAMA FHEVM</h3>
                <p className="pixel-text text-sm">
                  FULLY HOMOMORPHIC ENCRYPTION ALLOWS YOUR SCORES TO BE STORED ENCRYPTED ON THE BLOCKCHAIN. 
                  YOUR PRIVACY IS PROTECTED.
                </p>
              </div>
              <div className="pixel-bg-alt p-4">
                <h3 className="text-xl font-black mb-2 pixel-text">ETHEREUM SEPOLIA</h3>
                <p className="pixel-text text-sm">
                  ALL SCORES ARE STORED AS SMART CONTRACTS ON THE SEPOLIA TESTNET. 
                  TRANSPARENT AND IMMUTABLE.
                </p>
              </div>
            </div>
          </div>

          <div className="pixel-card">
            <h2 className="text-3xl font-black mb-6 pixel-text">SMART CONTRACT</h2>
            <div className="pixel-bg-alt p-6">
              <h3 className="text-xl font-black mb-3 pixel-text">LEADERBOARD</h3>
              <p className="pixel-text text-sm mb-4">SMART CONTRACT FOR STORING ENCRYPTED SCORES.</p>
              <div className="space-y-2">
                <p className="pixel-text text-xs">
                  ADDRESS: <code className="pixel-bg px-2 py-1">DEPLOY TO GET ADDRESS</code>
                </p>
                <p className="pixel-text text-xs">
                  NETWORK: SEPOLIA TESTNET
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="pixel-button pixel-text"
            >
              PLAY NOW →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

