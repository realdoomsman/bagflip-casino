'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
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
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white font-semibold text-lg">BagFlip</Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">Games</Link>
              <Link href="/how-it-works" className="text-sm text-zinc-400 hover:text-white transition">How it Works</Link>
              <a href="https://github.com/realdoomsman/bagflip-casino" target="_blank" rel="noopener" className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            </nav>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Provably Fair Coin Flip</h1>
          <p className="text-zinc-500 max-w-md mx-auto">Simple 50/50 betting on Solana. Pick a side, place your bet, win 1.96x. All results verified on-chain.</p>
        </div>

        {/* Game Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'flip', name: 'Coin Flip' },
            { id: 'dice', name: 'Dice' },
            { id: 'evenodd', name: 'Even/Odd' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeGame === g.id
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Game */}
        <div className="max-w-md mx-auto mb-16">
          {activeGame === 'flip' && <CoinFlip />}
          {activeGame === 'dice' && <DiceGame />}
          {activeGame === 'evenodd' && <EvenOdd />}
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">Instant Results</h3>
            <p className="text-sm text-zinc-500">Built on Solana for sub-second transaction times. No waiting around.</p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">Provably Fair</h3>
            <p className="text-sm text-zinc-500">VRF randomness verified on-chain. Every result can be independently verified.</p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">Open Source</h3>
            <p className="text-sm text-zinc-500">Full source code on GitHub. Verify the smart contracts yourself.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-white">1.96x</div>
            <div className="text-xs text-zinc-500">Payout</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-white">50%</div>
            <div className="text-xs text-zinc-500">Win Rate</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-white">2%</div>
            <div className="text-xs text-zinc-500">House Edge</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-white">&lt;1s</div>
            <div className="text-xs text-zinc-500">Settlement</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">Built on Solana</div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/realdoomsman/bagflip-casino" target="_blank" rel="noopener" className="text-sm text-zinc-500 hover:text-white transition flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <Link href="/how-it-works" className="text-sm text-zinc-500 hover:text-white transition">How it Works</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
