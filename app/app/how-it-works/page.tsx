'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white font-semibold text-lg">BagFlip</Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">Games</Link>
              <Link href="/how-it-works" className="text-sm text-white">How it Works</Link>
              <a href="https://github.com/realdoomsman/bagflip-casino" target="_blank" rel="noopener" className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            </nav>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">How BagFlip Works</h1>

        <div className="space-y-4 mb-12">
          {[
            { title: '1. Pick your side', desc: 'Choose heads or tails, high or low, even or odd. All games have true 50/50 odds.' },
            { title: '2. Set your bet', desc: 'Enter how much SOL you want to wager. Quick buttons make it easy.' },
            { title: '3. Flip and win', desc: 'Confirm the transaction and watch the result. Win and get 1.96x your bet instantly.' },
          ].map((step, i) => (
            <div key={i} className="p-5 bg-zinc-900 rounded-xl border border-zinc-800">
              <h3 className="text-white font-medium mb-1">{step.title}</h3>
              <p className="text-sm text-zinc-500">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-5 bg-zinc-900 rounded-xl border border-zinc-800 mb-8">
          <h3 className="text-white font-medium mb-2">Provably Fair</h3>
          <p className="text-sm text-zinc-500">All results use Solana VRF (Verifiable Random Function). Outcomes cannot be manipulated and can be verified on-chain by anyone. Check our GitHub for the full source code.</p>
        </div>

        <Link href="/" className="inline-block px-6 py-3 bg-white hover:bg-zinc-200 text-black font-medium rounded-xl transition">
          Start Playing →
        </Link>
      </main>
    </div>
  )
}
