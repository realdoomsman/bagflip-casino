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
    <div className="min-h-screen bg-[#09090b]">
      {/* Gradient bg effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-xl">BagFlip</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-white/70 hover:text-white transition">Games</Link>
              <Link href="/how-it-works" className="text-sm text-white/70 hover:text-white transition">How it Works</Link>
              <a href="https://github.com/realdoomsman/bagflip-casino" target="_blank" className="text-sm text-white/70 hover:text-white transition flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            </nav>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live on Solana Mainnet
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Flip. Win. <span className="text-gradient">1.96x</span>
          </h1>
          <p className="text-lg text-white/50 max-w-lg mx-auto">
            Provably fair coin flip on Solana. 50/50 odds, instant payouts, fully on-chain.
          </p>
        </div>

        {/* Game Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'flip', name: 'Coin Flip', icon: '🪙' },
            { id: 'dice', name: 'Dice', icon: '🎲' },
            { id: 'evenodd', name: 'Even/Odd', icon: '🔢' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeGame === g.id
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25'
                  : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Game */}
        <div className="max-w-md mx-auto mb-20">
          {activeGame === 'flip' && <CoinFlip />}
          {activeGame === 'dice' && <DiceGame />}
          {activeGame === 'evenodd' && <EvenOdd />}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '1.96x', label: 'Payout', color: 'text-green-400' },
            { value: '50%', label: 'Win Rate', color: 'text-violet-400' },
            { value: '2%', label: 'House Edge', color: 'text-white' },
            { value: '<1s', label: 'Settlement', color: 'text-indigo-400' },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Instant Results</h3>
            <p className="text-white/40 text-sm">Built on Solana for sub-second transactions. No waiting.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Provably Fair</h3>
            <p className="text-white/40 text-sm">VRF verified randomness. Every result verifiable on-chain.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Open Source</h3>
            <p className="text-white/40 text-sm">Full source code on GitHub. Verify everything yourself.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/30">Built on Solana</div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/realdoomsman/bagflip-casino" target="_blank" className="text-sm text-white/40 hover:text-white transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <Link href="/how-it-works" className="text-sm text-white/40 hover:text-white transition">How it Works</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
