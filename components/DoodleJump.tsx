'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { getSigner } from '@/lib/provider'

const LEADERBOARD_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000').trim()

const LEADERBOARD_ABI = [
  'function submitScore(bytes32 encryptedScore, bytes calldata attestation) external',
  'function getPlayerBestScore(address player) external view returns (bytes32)',
  'function hasPlayerSubmitted(address player) external view returns (bool)',
]

interface Platform {
  x: number
  y: number
  width: number
  type: 'normal' | 'moving'
}

interface Cloud {
  x: number
  y: number
  size: number
}

const GRAVITY = 0.3
const JUMP_STRENGTH = -8
const PLATFORM_WIDTH = 60
const PLATFORM_HEIGHT = 15
const PLAYER_WIDTH = 30
const PLAYER_HEIGHT = 30
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600

// Doodle Jump colors
const SKY_COLOR = '#87CEEB' // Light blue sky
const PLATFORM_COLOR = '#8B4513' // Brown platforms
const PLATFORM_TOP = '#A0522D' // Lighter brown for platform top
const PLAYER_COLOR = '#FFD700' // Gold/yellow player
const PLAYER_EYE = '#000000' // Black eyes
const CLOUD_COLOR = '#FFFFFF' // White clouds
const TEXT_COLOR = '#000000' // Black text for visibility

export default function DoodleJump() {
  const { address, isConnected } = useAccount()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [relayerInstance, setRelayerInstance] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const playerRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 100, velocityY: 0 })
  const platformsRef = useRef<Platform[]>([])
  const cloudsRef = useRef<Cloud[]>([])
  const cameraYRef = useRef(0)
  const gameLoopRef = useRef<number>()
  const keysRef = useRef<Set<string>>(new Set())
  const startYRef = useRef(0) // Starting Y position for score calculation
  const maxHeightRef = useRef(0) // Maximum height reached

  useEffect(() => {
    // Try to initialize relayer even if wallet not connected yet
    // It will be ready when user connects wallet
    if (typeof window !== 'undefined') {
      initRelayer()
    }
  }, [])
  
  useEffect(() => {
    // Re-initialize relayer when wallet connects
    if (isConnected && address && !relayerInstance) {
      initRelayer()
    }
  }, [isConnected, address])

  const initRelayer = async () => {
    if (relayerInstance) return
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('Browser only')
      }

      if (typeof global === 'undefined') {
        (window as any).global = globalThis
      }

      const relayerModule = await import('@zama-fhe/relayer-sdk/web')
      const sdkInitialized = await relayerModule.initSDK()
      if (!sdkInitialized) {
        throw new Error('SDK init failed')
      }
      
      const instance = await relayerModule.createInstance(relayerModule.SepoliaConfig)
      setRelayerInstance(instance)
    } catch {
      // will show error when user tries to submit
    }
  }

  const generatePlatforms = useCallback(() => {
    const platforms: Platform[] = []
    // Start with a platform at the bottom for the player
    platforms.push({
      x: CANVAS_WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      width: PLATFORM_WIDTH,
      type: 'normal',
    })
    // Generate platforms going up
    for (let i = 1; i < 20; i++) {
      const minDistance = 50
      const maxDistance = 80
      const distance = minDistance + Math.random() * (maxDistance - minDistance)
      const lastY = platforms[platforms.length - 1].y
      platforms.push({
        x: Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH),
        y: lastY - distance,
        width: PLATFORM_WIDTH,
        type: Math.random() > 0.85 ? 'moving' : 'normal',
      })
    }
    platformsRef.current = platforms
  }, [])

  const generateClouds = useCallback(() => {
    const clouds: Cloud[] = []
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: 30 + Math.random() * 20,
      })
    }
    cloudsRef.current = clouds
  }, [])

  const startGame = () => {
    generatePlatforms()
    generateClouds()
    const startY = CANVAS_HEIGHT - 100
    playerRef.current = { x: CANVAS_WIDTH / 2, y: startY, velocityY: 0 }
    cameraYRef.current = 0
    startYRef.current = startY
    maxHeightRef.current = startY
    setScore(0)
    setGameState('playing')
  }

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const player = playerRef.current
    const platforms = platformsRef.current
    const keys = keysRef.current

    // Handle movement (slower, more controlled)
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
      player.x = Math.max(0, player.x - 3)
    }
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
      player.x = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, player.x + 3)
    }

    // Wrap player around screen edges
    if (player.x < 0) {
      player.x = CANVAS_WIDTH - PLAYER_WIDTH
    }
    if (player.x > CANVAS_WIDTH - PLAYER_WIDTH) {
      player.x = 0
    }

    // Apply gravity
    player.velocityY += GRAVITY
    player.y += player.velocityY

    // Check platform collisions (using world coordinates)
    let onPlatform = false
    for (const platform of platforms) {
      const platformY = platform.y - cameraYRef.current
      const playerY = player.y - cameraYRef.current
      
      // Only check platforms that are visible
      if (platformY >= -PLATFORM_HEIGHT && platformY <= CANVAS_HEIGHT) {
        // Check collision: player is falling and lands on platform
        if (
          player.velocityY > 0 && // Falling down
          player.x < platform.x + platform.width &&
          player.x + PLAYER_WIDTH > platform.x &&
          playerY + PLAYER_HEIGHT >= platformY &&
          playerY + PLAYER_HEIGHT <= platformY + PLATFORM_HEIGHT + 5 && // Small tolerance
          playerY < platformY + PLATFORM_HEIGHT // Player is above platform
        ) {
          player.velocityY = JUMP_STRENGTH
          player.y = platform.y - PLAYER_HEIGHT
          onPlatform = true
          break
        }
      }
    }

    // Calculate player screen position
    const playerScreenY = player.y - cameraYRef.current

    // Move camera up when player goes high
    if (playerScreenY < 200) {
      cameraYRef.current = player.y - 200
    }

    // Update max height reached (lower Y = higher up)
    if (player.y < maxHeightRef.current) {
      maxHeightRef.current = player.y
    }

    // Calculate score based on how high player has climbed
    // Score = distance climbed from starting position
    const distanceClimbed = startYRef.current - maxHeightRef.current
    const newScore = Math.max(0, Math.floor(distanceClimbed / 5)) // Divide by 5 for reasonable score scaling
    setScore(newScore)

    // Generate new platforms as player goes up
    while (platforms.length > 0 && platforms[0].y > cameraYRef.current + CANVAS_HEIGHT + 50) {
      platforms.shift()
    }
    
    // Add new platforms at the top
    while (platforms.length < 20) {
      const lastY = platforms.length > 0 ? platforms[platforms.length - 1].y : cameraYRef.current
      const minDistance = 50
      const maxDistance = 80
      const distance = minDistance + Math.random() * (maxDistance - minDistance)
      platforms.push({
        x: Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH),
        y: lastY - distance,
        width: PLATFORM_WIDTH,
        type: Math.random() > 0.85 ? 'moving' : 'normal',
      })
    }

    // Check game over - player fell below screen
    if (playerScreenY > CANVAS_HEIGHT + 100) {
      setGameState('gameover')
      if (newScore > highScore) {
        setHighScore(newScore)
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    // Draw sky background
    ctx.fillStyle = SKY_COLOR
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw clouds
    ctx.fillStyle = CLOUD_COLOR
    for (const cloud of cloudsRef.current) {
      const cloudY = cloud.y - (cameraYRef.current * 0.3) % (CANVAS_HEIGHT + 100)
      if (cloudY >= -50 && cloudY <= CANVAS_HEIGHT) {
        ctx.beginPath()
        ctx.arc(cloud.x, cloudY, cloud.size, 0, Math.PI * 2)
        ctx.arc(cloud.x + cloud.size * 0.6, cloudY, cloud.size * 0.8, 0, Math.PI * 2)
        ctx.arc(cloud.x - cloud.size * 0.6, cloudY, cloud.size * 0.8, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw platforms
    for (const platform of platforms) {
      const platformY = platform.y - cameraYRef.current
      if (platformY >= -50 && platformY <= CANVAS_HEIGHT) {
        // Platform shadow
        ctx.fillStyle = '#654321'
        ctx.fillRect(platform.x + 2, platformY + 2, platform.width, PLATFORM_HEIGHT)
        
        // Platform body
        ctx.fillStyle = PLATFORM_COLOR
        ctx.fillRect(platform.x, platformY, platform.width, PLATFORM_HEIGHT)
        
        // Platform top highlight
        ctx.fillStyle = PLATFORM_TOP
        ctx.fillRect(platform.x, platformY, platform.width, 3)
      }
    }

    // Draw player
    const playerY = player.y - cameraYRef.current
    if (playerY >= -PLAYER_HEIGHT && playerY <= CANVAS_HEIGHT) {
      // Player body (yellow/gold)
      ctx.fillStyle = PLAYER_COLOR
      ctx.fillRect(player.x, playerY, PLAYER_WIDTH, PLAYER_HEIGHT)
      
      // Player outline
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeRect(player.x, playerY, PLAYER_WIDTH, PLAYER_HEIGHT)
      
      // Eyes
      ctx.fillStyle = PLAYER_EYE
      ctx.fillRect(player.x + 8, playerY + 8, 4, 4)
      ctx.fillRect(player.x + 18, playerY + 8, 4, 4)
      
      // Simple smile
      ctx.strokeStyle = PLAYER_EYE
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(player.x + PLAYER_WIDTH / 2, playerY + 20, 6, 0, Math.PI)
      ctx.stroke()
    }

    // Draw score with shadow
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px Arial'
    ctx.fillText(`Score: ${newScore}`, 12, 32)
    ctx.fillStyle = TEXT_COLOR
    ctx.fillText(`Score: ${newScore}`, 10, 30)

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, highScore])

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key)
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const submitScore = async () => {
    if (!address || !isConnected || !relayerInstance || score === 0) {
      return
    }

    setSubmitting(true)

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          if (chainId !== '0xaa36a7') {
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
              })
              await new Promise(resolve => setTimeout(resolve, 1000))
            } catch {
              // ignore
            }
          }
        } catch {
          // ignore
        }
      }

      const signer = await getSigner()
      const contract = new ethers.Contract(LEADERBOARD_CONTRACT_ADDRESS, LEADERBOARD_ABI, signer)

      if (!relayerInstance) {
        throw new Error('Relayer not initialized')
      }

      // Encrypt score (euint16 can store 0-65535)
      const scoreValue = Math.min(65535, score)
      
      let encryptedInput
      try {
        const inputBuilder = relayerInstance.createEncryptedInput(LEADERBOARD_CONTRACT_ADDRESS, address)
        inputBuilder.add16(scoreValue)
        encryptedInput = await Promise.race([
          inputBuilder.encrypt(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Encryption timeout')), 30000)
          )
        ]) as any
      } catch (encryptError: any) {
        let errorMessage = encryptError?.message || 'Encryption failed'
        if (errorMessage.includes('JSON') || errorMessage.includes('Bad JSON')) {
          errorMessage = 'Relayer connection issue. Please try again.'
        }
        throw new Error(errorMessage)
      }
      
      if (!encryptedInput?.handles || encryptedInput.handles.length === 0) {
        throw new Error('Encryption failed: no handles returned')
      }
      
      if (!encryptedInput.inputProof) {
        throw new Error('Encryption failed: no proof returned')
      }

      const encryptedHandle = encryptedInput.handles[0]
      const attestation = encryptedInput.inputProof

      const tx = await contract.submitScore(encryptedHandle, attestation)
      await tx.wait()
      
      alert('Score submitted! Your encrypted score is now on the blockchain.')
    } catch (err: any) {
      let errorMessage = 'Failed to submit score'
      if (err.message) {
        errorMessage = err.message
      }
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ 
          imageRendering: 'pixelated',
          border: '3px solid #000',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      />

      {gameState === 'menu' && (
        <div className="mt-8 text-center">
          <h1 className="text-5xl font-black mb-6" style={{ color: '#FFD700', textShadow: '3px 3px 0px #000' }}>
            DOODLE JUMP
          </h1>
          <p className="mb-4 text-xl font-bold" style={{ color: '#000' }}>HIGH SCORE: {highScore}</p>
          <button 
            onClick={startGame} 
            className="px-8 py-4 text-xl font-bold rounded-lg"
            style={{ 
              background: '#FFD700',
              color: '#000',
              border: '3px solid #000',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px #000'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)'
              e.currentTarget.style.boxShadow = '2px 2px 0px #000'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)'
              e.currentTarget.style.boxShadow = '4px 4px 0px #000'
            }}
          >
            START GAME
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="mt-8 text-center">
          <h2 className="text-4xl font-black mb-4" style={{ color: '#FF0000', textShadow: '2px 2px 0px #000' }}>
            GAME OVER
          </h2>
          <p className="mb-2 text-xl font-bold" style={{ color: '#000' }}>SCORE: {score}</p>
          <p className="mb-4 text-xl font-bold" style={{ color: '#000' }}>HIGH SCORE: {highScore}</p>
          <div className="space-y-3">
            <button 
              onClick={startGame} 
              className="px-8 py-4 text-xl font-bold rounded-lg"
              style={{ 
                background: '#FFD700',
                color: '#000',
                border: '3px solid #000',
                cursor: 'pointer',
                boxShadow: '4px 4px 0px #000'
              }}
            >
              PLAY AGAIN
            </button>
            {score > 0 && (
              <div className="space-y-2">
                {!isConnected && (
                  <p className="text-sm font-bold" style={{ color: '#FF0000' }}>
                    CONNECT WALLET TO SUBMIT SCORE
                  </p>
                )}
                {isConnected && !relayerInstance && (
                  <p className="text-sm font-bold" style={{ color: '#FFA500' }}>
                    INITIALIZING RELAYER...
                  </p>
                )}
                <button
                  onClick={submitScore}
                  disabled={submitting || !isConnected || !relayerInstance}
                  className="px-8 py-4 text-xl font-bold rounded-lg disabled:opacity-50"
                  style={{ 
                    background: submitting ? '#888' : (!isConnected || !relayerInstance) ? '#999' : '#4CAF50',
                    color: '#FFF',
                    border: '3px solid #000',
                    cursor: (submitting || !isConnected || !relayerInstance) ? 'not-allowed' : 'pointer',
                    boxShadow: '4px 4px 0px #000'
                  }}
                >
                  {submitting ? 'SUBMITTING...' : '🔐 SUBMIT ENCRYPTED SCORE'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="mt-4 text-center">
          <p className="text-sm font-bold" style={{ color: '#000' }}>USE ARROW KEYS OR A/D TO MOVE</p>
        </div>
      )}
    </div>
  )
}

