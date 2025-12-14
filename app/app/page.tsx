'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CoinFlip from '@/components/games/CoinFlip'
import DiceGame from '@/components/games/DiceGame'
import EvenOdd from '@/components/games/EvenOdd'
import PvPLobby from '@/components/PvPLobby'
import IntroModal from '@/components/IntroModal'
import AuthModal from '@/components/AuthModal'
import WalletPanel from '@/components/WalletPanel'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'

type GameMode = 'vs-house' | 'pvp'
type GameType = 'coinflip' | 'dice' | 'evenodd'

const generateLastResults = (type: GameType) => {
  const results = []
  for (let i = 0; i < 12; i++) {
    if (type === 'coinflip') results.push(Math.random() > 0.5 ? 'H' : 'T')
    else if (type === 'dice') results.push(Math.random() > 0.5 ? 'HI' : 'LO')
    else results.push(Math.random() > 0.5 ? 'E' : 'O')
  }
  return results
}

export default function Home() {
  const { user, loading, logout } = useAuth()
  const [gameMode, setGameMode] = useState<GameMode>('vs-house')
  const [activeGame, setActiveGame] = useState<GameType>('coinflip')
  const [lastResults, setLastResults] = useState<string[]>([])
  const [showAuth, setShowAuth] = useState(false)
  const [showWallet, setShowWallet] = useState(false)

  useEffect(() => {
    setLastResults(generateLastResults(activeGame))
  }, [activeGame])

  const getBadgeClass = (result: string) => {
    if (result === 'H') return 'heads'
    if (result === 'T') return 'tails'
    if (result === 'HI') return 'high'
    if (result === 'LO') return 'low'
    if (result === 'E') return 'even'
    return 'odd'
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] flex">
      <IntroModal />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <WalletPanel isOpen={showWallet} onClose={() => setShowWallet(false)} />

      {/* Sidebar */}
      <aside className="w-56 bg-[#080c14] border-r border-[#151d2a] flex flex-col">
        <div className="p-5 border-b border-[#151d2a]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative">
              <Image
                src="/logo.svg"
                alt="BagFlip"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight">
                BAGFLIP
              </div>
              <div className="text-[10px] text-[#4a5568] -mt-0.5">
                flip your $BAG
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <div className="text-[10px] text-[#4a5568] uppercase tracking-widest mb-2 px-3">
            Games
          </div>

          {[
            { id: 'coinflip', label: 'Coin Flip', icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
            { id: 'dice', label: 'Dice', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z' },
            { id: 'evenodd', label: 'Even / Odd', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H7v-2h3V7h2v4h3v2h-3v4z' },
          ].map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setGameMode('vs-house')
                setActiveGame(game.id as GameType)
              }}
              className={`nav-item w-full ${gameMode === 'vs-house' && activeGame === game.id ? 'active' : ''}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d={game.icon} />
              </svg>
              <span>{game.label}</span>
            </button>
          ))}

          <div className="text-[10px] text-[#4a5568] uppercase tracking-widest mb-2 px-3 pt-4">
            PvP
          </div>

          <button
            onClick={() => setGameMode('pvp')}
            className={`nav-item w-full ${gameMode === 'pvp' ? 'active' : ''}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span>PvP Lobby</span>
          </button>
        </nav>

        <div className="p-3 border-t border-[#151d2a] space-y-1">
          <Link href="/how-it-works" className="nav-item">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
            <span>How it Works</span>
          </Link>
          <a
            href="https://github.com/realdoomsman/bagflip-casino"
            target="_blank"
            className="nav-item"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 bg-[#080c14] border-b border-[#151d2a] flex items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <h1 className="text-white font-semibold">
              {gameMode === 'pvp'
                ? 'PvP Lobby'
                : activeGame === 'coinflip'
                  ? 'Coin Flip'
                  : activeGame === 'dice'
                    ? 'Dice'
                    : 'Even / Odd'}
            </h1>
            {gameMode === 'vs-house' && (
              <div className="flex items-center gap-2">
                {lastResults.map((result, i) => (
                  <div
                    key={i}
                    className={`flip-badge ${getBadgeClass(result)}`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth/Balance Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 bg-[#151d2a] rounded-lg animate-pulse" />
            ) : user ? (
              <>
                <button
                  onClick={() => setShowWallet(true)}
                  className="h-9 px-4 bg-[#151d2a] hover:bg-[#1e2a3a] rounded-lg flex items-center gap-2 transition"
                >
                  <span className="text-[#f7b32b] font-semibold text-sm">
                    {user.balance.toLocaleString()}
                  </span>
                  <span className="text-[#5a6a7a] text-xs">$BAG</span>
                </button>
                <div className="relative group">
                  <button className="h-9 px-3 bg-[#151d2a] hover:bg-[#1e2a3a] rounded-lg flex items-center gap-2 transition">
                    <svg className="w-4 h-4 text-[#5a6a7a]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="text-white text-sm">{user.username}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[#0d1219] border border-[#151d2a] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={logout}
                      className="w-full px-3 py-2 text-left text-sm text-[#5a6a7a] hover:text-white hover:bg-[#151d2a] rounded-lg transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="h-9 px-5 bg-[#f7b32b] hover:bg-[#e5a320] text-black font-semibold text-sm rounded-lg transition"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Game Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-[#0a0e17] to-[#0d1219]">
          <div className="max-w-lg mx-auto px-6 py-16">
            {gameMode === 'vs-house' ? (
              <div className="flex flex-col items-center">
                {activeGame === 'coinflip' && <CoinFlip />}
                {activeGame === 'dice' && <DiceGame />}
                {activeGame === 'evenodd' && <EvenOdd />}
              </div>
            ) : (
              <PvPLobby />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="h-10 bg-[#080c14] border-t border-[#151d2a] flex items-center justify-center">
          <span className="text-[11px] text-[#3a4556]">
            Provably fair • 2x payout • Built on Solana
          </span>
        </footer>
      </div>
    </div>
  )
}
