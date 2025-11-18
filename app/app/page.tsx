'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import LiveTicker from '@/components/LiveTicker'
import GameCard from '@/components/GameCard'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'
import PvPLobby from '@/components/PvPLobby'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

const WalletBalance = dynamic(
  () => import('@/components/WalletBalance'),
  { ssr: false }
)

export default function Home() {
  const { connected } = useWallet()
  const [selectedGame, setSelectedGame] = useState<'flip' | 'dice' | 'evenodd' | 'pvp' | null>(null)
  const [showGameHub, setShowGameHub] = useState(false)

  const handlePlayNow = () => {
    if (!connected) {
      alert('Please connect your wallet first!')
      return
    }
    setShowGameHub(true)
  }

  return (
    <main className="min-h-screen bg-dark-bg">
      {/* Top Bar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold text-neon-green">BagFlip Casino</span>
        </div>
        <div className="flex items-center gap-4">
          {connected && <WalletBalance />}
          <WalletMultiButton />
          <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-sm font-bold rounded-full">
            DEVNET
          </span>
        </div>
      </nav>

      {/* Main Content */}
      {!showGameHub && !selectedGame ? (
        <div className="max-w-7xl mx-auto px-8">
          {/* Hero Section */}
          <Hero onPlayNow={handlePlayNow} />

          {/* Live Stats Ticker */}
          <LiveTicker />

          {/* Game Cards */}
          <div className="py-20">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl font-black text-center mb-12 text-text-primary"
            >
              Choose Your Game
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <GameCard
                title="COIN FLIP"
                subtitle="50/50 pure luck"
                icon="🪙"
                buttonText="PLAY FLIP"
                color="text-neon-green"
                onClick={() => { 
                  if (!connected) {
                    alert('Please connect your wallet first!');
                    return;
                  }
                  setShowGameHub(true); 
                  setSelectedGame('flip'); 
                }}
              />
              <GameCard
                title="DICE"
                subtitle="Roll 1-100. Pick High or Low."
                icon="🎲"
                buttonText="PLAY DICE"
                color="text-neon-blue"
                onClick={() => { 
                  if (!connected) {
                    alert('Please connect your wallet first!');
                    return;
                  }
                  setShowGameHub(true); 
                  setSelectedGame('dice'); 
                }}
              />
              <GameCard
                title="EVEN/ODD"
                subtitle="Odd or Even. Simple."
                icon="🔢"
                buttonText="PLAY NOW"
                color="text-neon-purple"
                onClick={() => { 
                  if (!connected) {
                    alert('Please connect your wallet first!');
                    return;
                  }
                  setShowGameHub(true); 
                  setSelectedGame('evenodd'); 
                }}
              />
            </div>
          </div>

          {/* What is BagFlip Section */}
          <div className="glass-panel rounded-3xl p-12 max-w-4xl mx-auto mb-20">
            <h3 className="text-4xl font-black mb-8 text-center text-neon-green">
              What is BagFlip?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl mb-4">✅</div>
                <div className="text-xl font-bold mb-2">100% VRF Randomness</div>
                <div className="text-text-secondary">Provably fair, verifiable on-chain</div>
              </div>
              <div>
                <div className="text-5xl mb-4">⚖️</div>
                <div className="text-xl font-bold mb-2">50/50 Odds</div>
                <div className="text-text-secondary">Every game is perfectly balanced</div>
              </div>
              <div>
                <div className="text-5xl mb-4">🤝</div>
                <div className="text-xl font-bold mb-2">PvP or Treasury</div>
                <div className="text-text-secondary">Play vs house or challenge players</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-8 py-8">
          <button
            onClick={() => { setSelectedGame(null); setShowGameHub(false); }}
            className="mb-6 px-6 py-3 glass-panel rounded-xl hover:bg-white/10 transition text-lg font-bold"
          >
            ← Back to Home
          </button>
          {selectedGame === 'flip' && <CoinFlip />}
          {selectedGame === 'dice' && <DiceGame />}
          {selectedGame === 'evenodd' && <EvenOdd />}
          {selectedGame === 'pvp' && <PvPLobby />}
        </div>
      )}
    </main>
  )
}
