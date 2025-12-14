'use client'

import Link from 'next/link'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
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
              <Link href="/" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition">Games</Link>
              <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium text-white bg-white/[0.06] rounded-lg">How it Works</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">How BagFlip Works</h1>
        <p className="text-white/50 mb-10">Fair, transparent, on-chain gambling on Solana</p>

        <div className="space-y-6">
          <div className="bg-[#181818] rounded-xl border border-white/[0.06] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Connect Wallet</h3>
                <p className="text-sm text-white/50">Connect any Solana wallet like Phantom, Solflare, or Backpack.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#181818] rounded-xl border border-white/[0.06] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Choose a Game</h3>
                <p className="text-sm text-white/50">Pick from Coin Flip, Dice, or Even/Odd. All games have true 50/50 odds.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#181818] rounded-xl border border-white/[0.06] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Place Your Bet</h3>
                <p className="text-sm text-white/50">Enter your wager in SOL, make your prediction, and confirm the transaction.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#181818] rounded-xl border border-white/[0.06] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Win 1.96x</h3>
                <p className="text-sm text-white/50">Win and get 1.96x your bet instantly. Results are verified on-chain using VRF.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-[#181818] rounded-xl border border-white/[0.06] p-6">
          <h3 className="font-semibold text-white mb-3">Provably Fair</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            Every result is generated using Solana VRF (Verifiable Random Function). 
            This means outcomes cannot be manipulated by anyone and can be independently verified on-chain.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition">
          Start Playing
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f] border-t border-white/[0.06] flex items-center justify-around px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-white/40">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[10px] font-medium">Games</span>
        </Link>
        <Link href="/how-it-works" className="flex flex-col items-center gap-1 text-blue-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-medium">Info</span>
        </Link>
      </nav>
    </div>
  )
}
