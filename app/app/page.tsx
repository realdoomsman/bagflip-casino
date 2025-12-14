'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function Home() {
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white font-bold text-lg">BagFlip</Link>
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/" className="text-sm text-white">Play</Link>
              <Link href="/how-it-works" className="text-sm text-white/40 hover:text-white transition">How it Works</Link>
            </nav>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Flip. Win. <span className="text-[#ef4444]">1.96x</span></h1>
          <p className="text-white/50">Provably fair gambling on Solana. 50/50 odds, instant payouts.</p>
        </div>

        {/* Game Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'flip', name: 'Coin Flip' },
            { id: 'dice', name: 'Dice' },
            { id: 'evenodd', name: 'Even/Odd' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                activeGame === g.id
                  ? 'bg-[#ef4444] text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Game - Always visible */}
        <div className="max-w-md">
          {activeGame === 'flip' && <CoinFlip />}
          {activeGame === 'dice' && <DiceGame />}
          {activeGame === 'evenodd' && <EvenOdd />}
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mt-16">
          <div className="p-5 rounded-lg border border-white/10">
            <div className="text-lg mb-2">⚡</div>
            <h3 className="text-white font-medium mb-1">Instant</h3>
            <p className="text-sm text-white/40">Results in seconds on Solana</p>
          </div>
          <div className="p-5 rounded-lg border border-white/10">
            <div className="text-lg mb-2">🔒</div>
            <h3 className="text-white font-medium mb-1">Provably Fair</h3>
            <p className="text-sm text-white/40">VRF verified on-chain</p>
          </div>
          <div className="p-5 rounded-lg border border-white/10">
            <div className="text-lg mb-2">💰</div>
            <h3 className="text-white font-medium mb-1">1.96x Payout</h3>
            <p className="text-sm text-white/40">True 50/50 odds</p>
          </div>
        </div>
      </main>
    </div>
  )
}
