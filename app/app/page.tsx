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
const WalletBalance = dynamic(() => import('@/components/WalletBalance'), { ssr: false })

export default function Home() {
  const { connected } = useWallet()
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')

  const games = [
    { id: 'flip', name: 'Coin Flip', icon: '🪙' },
    { id: 'dice', name: 'Dice', icon: '🎲' },
    { id: 'evenodd', name: 'Even/Odd', icon: '🔢' },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="h-16 border-b border-white/[0.06] bg-[#0f0f0f] sticky top-0 z-50">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">BagFlip</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-white bg-white/[0.06] rounded-lg">Games</Link>
              <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition">How it Works</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {connected && <WalletBalance />}
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Game Selection */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">Games</div>
              <div className="space-y-1">
                {games.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGame(g.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      activeGame === g.id
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{g.icon}</span>
                    <span className="text-sm font-medium">{g.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-[#181818] border border-white/[0.06]">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Stats</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Win Rate</span>
                    <span className="text-white font-medium">50%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Multiplier</span>
                    <span className="text-green-400 font-medium">1.96x</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Game Tabs */}
            <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-2">
              {games.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeGame === g.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#181818] text-white/60'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </button>
              ))}
            </div>

            {/* Game Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGame}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {!connected ? (
                  <div className="bg-[#181818] rounded-2xl border border-white/[0.06] p-8 md:p-12 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
                    <p className="text-white/40 text-sm mb-6">Connect a Solana wallet to start playing</p>
                    <WalletMultiButton />
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto lg:mx-0">
                    {activeGame === 'flip' && <CoinFlip />}
                    {activeGame === 'dice' && <DiceGame />}
                    {activeGame === 'evenodd' && <EvenOdd />}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f] border-t border-white/[0.06] flex items-center justify-around px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-blue-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[10px] font-medium">Games</span>
        </Link>
        <Link href="/how-it-works" className="flex flex-col items-center gap-1 text-white/40">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-medium">Info</span>
        </Link>
      </nav>
    </div>
  )
}
