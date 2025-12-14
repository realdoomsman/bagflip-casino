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
const WalletBalance = dynamic(() => import('@/components/WalletBalance'), { ssr: false })

// Logo component
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#111"/>
    <path d="M8 8h6l4 6-4 6H8l4-6-4-6z" fill="#00ff88"/>
    <path d="M14 8h6l4 6-4 6h-6l4-6-4-6z" fill="#00ff88" fillOpacity="0.5"/>
    <circle cx="24" cy="16" r="3" fill="#00ff88"/>
  </svg>
)

export default function Home() {
  const { connected } = useWallet()
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'evenodd'>('flip')
  const [recentWins, setRecentWins] = useState<{addr: string, amount: number, won: boolean, game: string}[]>([])

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/live-feed?limit=8`)
        const data = await res.json()
        setRecentWins(data.map((g: any) => ({ addr: g.player1, amount: g.amount, won: g.won, game: g.result || 'Flip' })))
      } catch {}
    }
    fetchRecent()
    const i = setInterval(fetchRecent, 5000)
    return () => clearInterval(i)
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Logo />
                <span className="text-xl font-bold text-white">BagFlip</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-white">Play</Link>
                <Link href="/how-it-works" className="text-sm font-medium text-white/50 hover:text-white transition-colors">How it Works</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {connected && <WalletBalance />}
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left - Game Area */}
        <div className="flex-1 p-6 lg:p-12">
          {/* Game Tabs */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { id: 'flip', label: 'Coin Flip' },
              { id: 'dice', label: 'Dice' },
              { id: 'evenodd', label: 'Even/Odd' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id as any)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeGame === g.id
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Game */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-2xl"
            >
              {!connected ? (
                <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20">
                    <svg className="w-10 h-10 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Connect Wallet</h2>
                  <p className="text-white/40 mb-8">Connect your Solana wallet to start playing</p>
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

        {/* Right - Sidebar */}
        <div className="hidden lg:block w-80 border-l border-white/10 bg-[#0a0a0a] p-6">
          {/* Live Feed */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-sm font-semibold text-white">Live Bets</span>
            </div>
            <div className="space-y-2">
              {recentWins.length === 0 ? (
                <div className="text-sm text-white/30 text-center py-8">No recent bets</div>
              ) : (
                recentWins.map((w, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/60">{w.addr.slice(0,2)}</span>
                      </div>
                      <span className="text-xs text-white/50">{w.addr.slice(0,4)}...{w.addr.slice(-4)}</span>
                    </div>
                    <span className={`text-xs font-bold ${w.won ? 'text-[#00ff88]' : 'text-red-400'}`}>
                      {w.won ? '+' : '-'}{w.amount} SOL
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-6">
            <div className="text-xs text-white/40 mb-3">Game Stats</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Win Rate</span>
                <span className="text-white font-medium">50%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Multiplier</span>
                <span className="text-[#00ff88] font-medium">1.96x</span>
              </div>
            </div>
          </div>

          {/* Provably Fair */}
          <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-[#00ff88]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-[#00ff88]">Provably Fair</span>
            </div>
            <p className="text-xs text-white/40">VRF verified randomness on Solana</p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs text-[#00ff88]">Play</span>
          </Link>
          <Link href="/how-it-works" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-white/40">Info</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
