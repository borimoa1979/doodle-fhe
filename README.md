# Doodle Jump FHE 🎮

Classic Doodle Jump game with anonymous encrypted leaderboard using Zama FHEVM technology.

## What is this?

A fun Doodle Jump game where you can submit your scores to the blockchain anonymously. Your scores are encrypted using Fully Homomorphic Encryption (FHE), so no one can see your actual score until you decide to reveal it.

## Features

- 🎮 Classic Doodle Jump gameplay
- 🔐 Encrypted score submission using Zama FHEVM
- 📊 Anonymous leaderboard on blockchain
- 🎨 Bright, colorful design like the original game
- 🌐 Works on Sepolia testnet

## How to Play

1. Connect your wallet (MetaMask or any Web3 wallet)
2. Click "START GAME"
3. Use arrow keys or A/D to move left and right
4. Jump on platforms to go higher
5. Try to reach the highest score!
6. After game over, submit your encrypted score to the leaderboard

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Sepolia testnet ETH

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run development server
npm run dev
```

### Environment Variables

Create `.env.local` file:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.drpc.org
NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Deploy Contract

```bash
npm run deploy:leaderboard
```

## Project Structure

```
doodle_jump_fhe/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── leaderboard/       # Leaderboard page
│   └── page.tsx           # Main game page
├── components/            # React components
│   ├── DoodleJump.tsx    # Main game component
│   ├── LeaderboardList.tsx
│   └── Navigation.tsx
├── contracts/            # Smart contracts
│   └── Leaderboard.sol   # Leaderboard contract
├── scripts/              # Deployment scripts
│   └── deploy-leaderboard.ts
└── lib/                  # Utilities
    └── provider.ts       # Ethereum provider setup
```

## How It Works

1. **Gameplay**: Classic Doodle Jump mechanics - jump on platforms, go higher, get points
2. **Score Encryption**: When you submit a score, it's encrypted using Zama's FHE relayer
3. **Blockchain Storage**: Encrypted scores are stored on-chain as bytes32 handles
4. **Privacy**: Your actual score remains private until you choose to reveal it

## Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Hardhat, Ethers.js, Wagmi, RainbowKit
- **FHE**: Zama FHEVM Relayer SDK
- **Network**: Sepolia Testnet

## License

MIT

## Links

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Game Live](https://doodlejumpfhe.vercel.app)

