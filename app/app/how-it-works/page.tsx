'use client'

import Link from 'next/link'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#111]">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="text-white font-semibold text-lg">BagFlip</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-white/50 hover:text-white transition">Games</Link>
              <Link href="/how-it-works" className="text-sm text-white">How it Works</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">How it Works</h1>
        <p className="text-white/50 mb-12">Simple, fair, on-chain gambling on Solana.</p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Connect Wallet</h2>
            <p className="text-white/50">Connect any Solana wallet like Phantom, Solflare, or Backpack.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Choose a Game</h2>
            <p className="text-white/50">Pick from Coin Flip, Dice, or Even/Odd. All games have true 50/50 odds.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. Place Your Bet</h2>
            <p className="text-white/50">Enter your wager in SOL, make your prediction, and confirm.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Win 1.96x</h2>
            <p className="text-white/50">Win and get 1.96x your bet instantly. Results verified on-chain via VRF.</p>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/[0.02]">
          <h3 className="text-lg font-semibold text-white mb-2">Provably Fair</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Every result uses Solana VRF (Verifiable Random Function). Outcomes cannot be manipulated and can be verified on-chain.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium rounded-md transition">
          Start Playing →
        </Link>
      </main>
    </div>
  )
}
