'use client'

import Link from 'next/link'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white font-bold text-lg">BagFlip</Link>
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/" className="text-sm text-white/40 hover:text-white transition">Play</Link>
              <Link href="/how-it-works" className="text-sm text-white">How it Works</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">How it Works</h1>

        <div className="space-y-6 text-white/60">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">1. Pick a game</h2>
            <p>Choose from Coin Flip, Dice, or Even/Odd. All games have true 50/50 odds.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">2. Enter your bet</h2>
            <p>Enter how much SOL you want to wager and make your prediction.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">3. Connect & play</h2>
            <p>Connect your Solana wallet (Phantom, Solflare, etc.) and confirm the transaction.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">4. Win 1.96x</h2>
            <p>If you win, you get 1.96x your bet instantly. Results are verified on-chain using VRF.</p>
          </div>
        </div>

        <div className="mt-10 p-5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">Provably Fair</h3>
          <p className="text-sm text-white/50">Every result uses Solana VRF. Outcomes cannot be manipulated and can be verified on-chain by anyone.</p>
        </div>

        <Link href="/" className="inline-block mt-8 px-5 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium rounded transition">
          Start Playing →
        </Link>
      </main>
    </div>
  )
}
