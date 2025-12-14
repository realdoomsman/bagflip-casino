'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0f1623] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0f18] border-r border-[#1e2a3a] flex flex-col">
        <div className="p-6 border-b border-[#1e2a3a]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f7b32b] to-[#e5a320] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0f1623]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">BAGFLIP</div>
              <div className="text-xs text-[#4a5568]">flip your $BAG</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <Link href="/" className="sidebar-link mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Play Now</span>
          </Link>
          <div className="sidebar-link active">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">How it Works</span>
          </div>
        </nav>

        <div className="p-4 border-t border-[#1e2a3a]">
          <a href="https://github.com/realdoomsman/bagflip-casino" target="_blank" className="sidebar-link">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="font-medium">GitHub</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="h-16 border-b border-[#1e2a3a] flex items-center justify-between px-6">
          <h1 className="text-[#f7b32b] font-bold text-lg">How it Works</h1>
          <WalletMultiButton />
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12">
          {/* Intro */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Flip Your $BAG</h2>
            <p className="text-[#8a9bb8] text-lg">
              Double or nothing. Flip your $BAG supply against the dev wallet or other players.
            </p>
          </div>

          {/* Game Modes */}
          <div className="mb-10">
            <h3 className="text-[#f7b32b] font-bold text-lg mb-4">Game Modes</h3>
            
            <div className="space-y-4">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white text-lg">VS Dev Wallet</h4>
                </div>
                <p className="text-[#8a9bb8]">
                  Flip against the dev wallet treasury. Win and get 2x your $BAG back. Lose and your $BAG goes to the dev. Simple as that.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white text-lg">PvP Mode</h4>
                </div>
                <p className="text-[#8a9bb8]">
                  Create a room or join one. Flip against other players. Winner takes all. No house edge. Pure degen vs degen action.
                </p>
              </div>
            </div>
          </div>

          {/* Games */}
          <div className="mb-10">
            <h3 className="text-[#f7b32b] font-bold text-lg mb-4">Games</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f7b32b]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <h4 className="font-bold text-white mb-1">Coin Flip</h4>
                <p className="text-xs text-[#8a9bb8]">Heads or Tails</p>
              </div>
              <div className="card p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f7b32b]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                </div>
                <h4 className="font-bold text-white mb-1">Dice</h4>
                <p className="text-xs text-[#8a9bb8]">High or Low</p>
              </div>
              <div className="card p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f7b32b]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M7 20V4m10 16V4M4 12h16" />
                  </svg>
                </div>
                <h4 className="font-bold text-white mb-1">Even/Odd</h4>
                <p className="text-xs text-[#8a9bb8]">Even or Odd</p>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <div className="mb-10">
            <h3 className="text-[#f7b32b] font-bold text-lg mb-4">How to Play</h3>
            
            <div className="space-y-3">
              {[
                { step: '1', title: 'Connect Wallet', desc: 'Connect your Solana wallet with $BAG tokens', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
                { step: '2', title: 'Pick Your Game', desc: 'Choose Coin Flip, Dice, or Even/Odd', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                { step: '3', title: 'Set Your Bet', desc: 'Choose how much $BAG you want to flip', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { step: '4', title: 'Double or Nothing', desc: 'Win = 2x your $BAG. Lose = rekt. LFG', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              ].map((item) => (
                <div key={item.step} className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f7b32b] text-[#0f1623] font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-[#8a9bb8]">{item.desc}</p>
                  </div>
                  <svg className="w-5 h-5 text-[#4a5568]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Provably Fair */}
          <div className="card p-6 border-[#f7b32b] mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-[#f7b32b] text-lg">Provably Fair</h4>
            </div>
            <p className="text-[#8a9bb8] mb-4">
              All results use Solana VRF (Verifiable Random Function). Outcomes cannot be manipulated and can be verified on-chain. Everything is transparent.
            </p>
            <a 
              href="https://github.com/realdoomsman/bagflip-casino" 
              target="_blank"
              className="text-[#f7b32b] hover:underline text-sm inline-flex items-center gap-2"
            >
              View source code on GitHub
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/" className="btn-primary inline-block px-8 py-4 text-lg">
              Start Flipping
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
