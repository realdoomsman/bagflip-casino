'use client'

import { useState, useEffect } from 'react'
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
  const [liveWins, setLiveWins] = useState([
    { user: 'Hx4k...9fD2', amount: 0.5, won: true },
    { user: '7Bm2...kL9x', amount: 1.2, won: false },
    { user: 'Qp8n...3mWz', amount: 0.25, won: true },
    { user: 'Yt6j...8nKp', amount: 2.0, won: true },
    { user: 'Mn3x...5vBq', amount: 0.1, won: false },
  ])

  return (
    <div className="min-h-screen bg-[#0d0d12]">
      {/* Top Bar */}
      <header className="h-14 bg-[#12121a] border-b border-white/5">
        <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b4a] to-[#ff9f43] flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-lg">BagFlip</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-white bg-white/5 rounded-lg">Games</Link>
              <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white rounded-lg transition">How it Works</Link>
            </nav>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      {/* Live Wins Ticker */}
      <div className="bg-[#12121a] border-b border-white/5 py-3 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/50 font-medium">Live Wins</span>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              {liveWins.map((win, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24] rounded-lg flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  <span className="text-xs text-white/60">{win.user}</span>
                  <span className={`text-xs font-bold ${win.won ? 'text-green-400' : 'text-red-400'}`}>
                    {win.won ? '+' : '-'}{win.amount} SOL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto flex">
        {/* Left Sidebar - Chat */}
        <aside className="hidden xl:flex flex-col w-72 border-r border-white/5 bg-[#12121a] min-h-[calc(100vh-112px)]">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Chat</span>
              <span className="text-xs text-white/30">24 online</span>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {[
              { user: 'CryptoKing', msg: 'just hit 5x on dice lets go', color: 'from-blue-500 to-cyan-500' },
              { user: 'SolanaWhale', msg: 'gg bro', color: 'from-purple-500 to-pink-500' },
              { user: 'DegenerateGambler', msg: 'whos tryna run it up', color: 'from-orange-500 to-red-500' },
              { user: 'LuckyFlip', msg: 'this site is actually fair wow', color: 'from-green-500 to-emerald-500' },
            ].map((chat, i) => (
              <div key={i} className="flex gap-2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${chat.color} flex-shrink-0`} />
                <div>
                  <span className="text-xs font-medium text-[#ff6b4a]">{chat.user}</span>
                  <p className="text-xs text-white/60">{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/5">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full px-3 py-2 bg-[#1a1a24] border border-white/5 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff6b4a]/50"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Hero Section */}
          {!connected && (
            <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-[#1a1a24] to-[#12121a] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b4a]/10 rounded-full blur-3xl" />
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  <span className="gradient-text">BagFlip</span> Casino
                </h1>
                <p className="text-white/50 mb-6 max-w-md">
                  Provably fair gambling on Solana. Win up to 1.96x on coin flips, dice, and more.
                </p>
                <WalletMultiButton />
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Wagered', value: '142,847 SOL', icon: '📊' },
              { label: 'Games Played', value: '89,234', icon: '🎮' },
              { label: 'Total Users', value: '12,847', icon: '👥' },
              { label: 'Online Now', value: '247', icon: '🟢' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-[#12121a] rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span>{stat.icon}</span>
                  <span className="text-xs text-white/40">{stat.label}</span>
                </div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Game Selection */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-white/40 mr-2">Games</span>
            {[
              { id: 'flip', name: 'Coin Flip', icon: '🪙' },
              { id: 'dice', name: 'Dice', icon: '🎲' },
              { id: 'evenodd', name: 'Even/Odd', icon: '🔢' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeGame === g.id
                    ? 'bg-[#ff6b4a] text-white'
                    : 'bg-[#1a1a24] text-white/60 hover:bg-[#22222e] hover:text-white'
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Game Area */}
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGame}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {!connected ? (
                  <div className="bg-[#12121a] rounded-2xl border border-white/5 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ff6b4a]/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#ff6b4a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Connect Wallet to Play</h2>
                    <p className="text-white/40 text-sm mb-6">Connect your Solana wallet to start gambling</p>
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
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#12121a] border-t border-white/5 flex items-center justify-around z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#ff6b4a]">
          <span className="text-lg">🎮</span>
          <span className="text-[10px] font-medium">Games</span>
        </Link>
        <Link href="/how-it-works" className="flex flex-col items-center gap-1 text-white/40">
          <span className="text-lg">ℹ️</span>
          <span className="text-[10px] font-medium">Info</span>
        </Link>
      </nav>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
