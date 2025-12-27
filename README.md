# 🦖 Doodle Jump FHE

```
                       __
                      / _)
           _/\/\/\_/ /  
         _|         /   
       _|  (  | (  |    
      /__.-'|_|--|_|    
      
      JUMP HIGH! ENCRYPT SCORES!
```

Classic Doodle Jump game with anonymous encrypted leaderboard using Zama FHEVM technology. Jump on platforms, reach for the sky, and submit your encrypted scores to the blockchain!

---

## 🎮 What is this?

A nostalgic Doodle Jump game where you can submit your scores to the blockchain anonymously. Your scores are encrypted using Fully Homomorphic Encryption (FHE), so no one can see your actual score until you decide to reveal it. Jump higher, score more, encrypt everything!

---

## 🚀 Live Demo

**Play Now:** [Live Demo](https://doodlejumpfhe.vercel.app/)

**Contract:** `0x6da26f78b7bec773d93d3521450625ff3e8e26ea`  

**Network:** Sepolia Testnet  

**Etherscan:** [View Contract](https://sepolia.etherscan.io/address/0x6da26f78b7bec773d93d3521450625ff3e8e26ea)

---

## 🎯 Features

- **Classic Doodle Jump Gameplay** - Nostalgic platform jumping mechanics
- **Encrypted Score Submission** - Scores encrypted using Zama FHEVM before blockchain storage
- **Anonymous Leaderboard** - Your scores stay private until you reveal them
- **Bright & Colorful Design** - Just like the original Doodle Jump
- **On-Chain Storage** - All encrypted scores stored on Ethereum Sepolia testnet

---

## 🎲 How to Play

1. **Connect Your Wallet** - MetaMask or any Web3 wallet
2. **Click "START GAME"** - Begin your jumping adventure
3. **Use Arrow Keys or A/D** - Move left and right to stay on platforms
4. **Jump Higher!** - Land on platforms to climb up and score points
5. **Submit Your Score** - After game over, encrypt and submit to the leaderboard

```
     🦖
     /\
    /  \
   /    \
  /______\
     ||
     ||
   [____]  ← You are here, jumping up!
```

---

## 🏗️ Architecture

```
┌─────────────┐
│   Player    │
│   Browser   │
└──────┬──────┘
       │
       │ 1. Play game, get score
       ▼
┌─────────────────────┐
│  Game Component     │
│  (DoodleJump.tsx)   │
└──────┬──────────────┘
       │
       │ 2. Encrypt score with Zama FHE Relayer
       ▼
┌─────────────────────┐
│  Zama FHE Relayer   │
│  SDK                │
└──────┬──────────────┘
       │
       │ 3. Send encrypted handle (bytes32) + attestation
       ▼
┌─────────────────────┐
│  Leaderboard        │
│  Smart Contract     │
│  (Sepolia)          │
└──────┬──────────────┘
       │
       │ 4. Store encrypted score on-chain
       ▼
┌─────────────────────┐
│  Ethereum Blockchain│
│  (Sepolia Testnet)  │
└─────────────────────┘
```

---

## 🔐 FHE Implementation

### Score Encryption Process

1. **Player scores points** during gameplay (0-65535, uint16)
2. **Score encrypted client-side** using Zama FHEVM Relayer SDK
3. **Encrypted handle converted** to bytes32 hex string format
4. **Handle + attestation** sent to smart contract
5. **Contract stores** encrypted score handle (bytes32)
6. **Score remains private** - no one can see actual score value

### Why FHE for Leaderboards?

Traditional leaderboards reveal all scores, enabling:
- Score manipulation strategies
- Unfair competition based on visible scores
- Privacy concerns

With FHE encryption:
- Scores encrypted before blockchain submission
- Only encrypted handles stored (unreadable)
- Privacy maintained until player reveals
- Fair, anonymous competition

---

## 📋 Smart Contract

### Leaderboard Contract

**Address:** `0x6da26f78b7bec773d93d3521450625ff3e8e26ea`

**Key Functions:**
- `submitScore(bytes32 encryptedScore, bytes attestation)` - Submit encrypted score
- `getScoreCount()` - Get total number of scores
- `getEncryptedScore(uint256 index)` - Get score entry by index
- `getPlayerBestScore(address player)` - Get player's best encrypted score
- `hasPlayerSubmitted(address player)` - Check if player submitted
- `getRecentScores(uint256 count)` - Get recent score entries

**Storage:**
- `ScoreEntry[] scores` - Array of encrypted score entries
- `mapping(address => bytes32) playerBestScore` - Player's best encrypted score
- `mapping(address => bool) hasSubmitted` - Track submissions

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain:** Ethereum Sepolia, Hardhat, Ethers.js, Wagmi, RainbowKit
- **FHE:** Zama FHEVM Relayer SDK v0.3.0-6
- **Game Engine:** HTML5 Canvas with React hooks

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone repository
git clone <repository-url>
cd wallet-12

# Install dependencies
npm install
```

### Environment Setup

Create `.env.local`:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.drpc.org
NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS=0x6da26f78b7bec773d93d3521450625ff3e8e26ea
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Run Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start jumping!

### Build for Production

```bash
npm run build
npm start
```

---

## 📦 Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:leaderboard
```

---

## 📁 Project Structure

```
wallet-12/
├── app/
│   ├── about/              # About page
│   ├── leaderboard/        # Leaderboard page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main game page
│   └── providers.tsx       # Wagmi/RainbowKit providers
├── components/
│   ├── DoodleJump.tsx      # Main game component (FHE integration)
│   ├── LeaderboardList.tsx # Leaderboard display
│   └── Navigation.tsx      # Navigation component
├── contracts/
│   └── Leaderboard.sol     # Leaderboard smart contract
├── scripts/
│   └── deploy-leaderboard.ts # Deployment script
└── lib/
    └── provider.ts         # Ethereum provider utilities
```

---

## 🎮 Game Controls

- **Left Arrow / A** - Move left
- **Right Arrow / D** - Move right
- **Space** - (Future feature: special jump)
- **Mouse/Touch** - (Future feature: touch controls)

---

## 🔒 Security & Privacy

- **Client-side Encryption** - All scores encrypted before blockchain submission
- **FHE Technology** - Fully Homomorphic Encryption via Zama FHEVM
- **Attestation Proofs** - Each encrypted score includes attestation from relayer
- **Private Scores** - Encrypted handles cannot be decrypted by other users
- **Anonymous Leaderboard** - Submit scores without revealing actual values

**Note:** This is a testnet deployment for demonstration. Do not use for production without security audit.

---

## 🐛 Troubleshooting

**Game not loading?**
- Check browser console for errors
- Ensure wallet is connected to Sepolia testnet
- Verify contract address in environment variables

**Score submission failing?**
- Ensure you have Sepolia testnet ETH for gas
- Check FHE relayer is initialized (see browser console logs)
- Verify network is set to Sepolia (chain ID: 11155111)

**Relayer not initializing?**
- Check internet connection (relayer needs network access)
- Look for [FHE] logs in browser console
- Try refreshing the page

---

## 📚 Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Relayer SDK](https://github.com/zama-ai/fhevm-relayer-sdk)
- [Ethereum Sepolia Testnet](https://sepolia.dev/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

- **Zama** for FHEVM and Relayer SDK technology
- **Ethereum Foundation** for Sepolia testnet
- Original Doodle Jump game inspiration
- Open source community

---

```
        🦖
       /  \
      /    \
     /      \
    /________\
      || ||
      || ||
      || ||
      
    JUMP HIGHER!
    ENCRYPT SCORES!
    HAVE FUN! 🎮
```

**Made with 🦖 and FHE encryption**
