'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function Home() {
  const { connected } = useWallet()
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="text-white font-semibold text-lg">BagFlip</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-white">Games</Link>
              <Link href="/how-it-works" className="text-sm text-white/50 hover:text-white transition">How it Works</Link>
            </nav>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              BagFlip;
            </h1>
            <ul className="space-y-3 text-lg text-white/80 mb-8">
              <li>• is <span className="text-red">provably fair</span> with on-chain VRF</li>
              <li>• is <span className="text-red">fast</span> and built on Solana</li>
              <li>• is <span className="text-red">simple</span> with 50/50 odds</li>
              <li>• pays <span className="text-red">1.96x</span> on every win</li>
            </ul>
            <div className="flex items-center gap-3">
              {!connected ? (
                <WalletMultiButton />
              ) : (
                <button 
                  onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-5 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium rounded-md transition flex items-center gap-2"
                >
                  Play Now
                  <span>→</span>
                </button>
              )}
              <Link href="/how-it-works" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-md border border-white/10 transition">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl shadow-red-500/20">
                <span className="text-8xl">🎲</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="text-white font-semibold mb-2">Instant</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Results in seconds. No waiting, no delays. Built on Solana for speed.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-2xl mb-4">🔒</div>
              <h3 className="text-white font-semibold mb-2">Provably Fair</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                VRF verified randomness. Every result can be independently verified on-chain.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-2xl mb-4">💰</div>
              <h3 className="text-white font-semibold mb-2">1.96x Payout</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Win and get 1.96x your bet. True 50/50 odds on all games.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8">Games</h2>
          
          {/* Game Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'flip', name: 'Coin Flip' },
              { id: 'dice', name: 'Dice' },
              { id: 'evenodd', name: 'Even/Odd' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeGame === g.id
                    ? 'bg-[#ef4444] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* Game Area */}
          <div className="max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGame}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {!connected ? (
                  <div className="p-8 rounded-xl border border-white/10 bg-white/[0.02] text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
                    <p className="text-sm text-white/50 mb-6">Connect your Solana wallet to play</p>
                    <WalletMultiButton />
                  </div>
                ) : (
                  <>
                    {activeGame === 'flip' && <CoinFlip />}
                    {activeGame === 'dice' && <DiceGame />}
                    {activeGame === 'evenodd' && <EvenOdd />}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-white/30">
          Built on Solana. Provably fair.
        </div>
      </footer>
    </div>
  )
}
