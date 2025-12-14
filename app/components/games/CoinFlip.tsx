'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bagflip-casino-production.up.railway.app'

const GoldCoin = ({
  side,
  won,
}: {
  side?: 'heads' | 'tails'
  won?: boolean
}) => (
  <div
    className={`relative w-32 h-32 rounded-full gold-coin ${won === true ? 'ring-4 ring-green-400/50' : won === false ? 'ring-4 ring-red-400/50' : ''}`}
  >
    <div className="coin-shine" />
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <svg
        className="w-10 h-10 text-[#b8860b] opacity-70"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {side === 'heads' ? (
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        ) : side === 'tails' ? (
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        ) : (
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
        )}
      </svg>
    </div>
  </div>
)

export default function CoinFlip() {
  const { user, token, refreshUser } = useAuth()
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null)
  const [wager, setWager] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<{
    won: boolean
    side: 'heads' | 'tails'
    amount: number
    newBalance: number
  } | null>(null)

  const handlePlay = async () => {
    if (!user || !token || !choice || !wager) return
    const amt = parseInt(wager)
    if (isNaN(amt) || amt <= 0 || amt > user.balance || isFlipping) return

    setIsFlipping(true)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/game/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: 'CoinFlip',
          wager: amt,
          choice,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        await new Promise((r) => setTimeout(r, 2000))
        setResult({
          won: data.won,
          side: data.won ? choice : choice === 'heads' ? 'tails' : 'heads',
          amount: amt,
          newBalance: data.newBalance,
        })
        refreshUser()
      } else {
        alert(data.error || 'Game failed')
      }
    } catch (error) {
      console.error('Game error:', error)
      alert('Something went wrong')
    } finally {
      setIsFlipping(false)
    }
  }

  const reset = () => {
    setResult(null)
    setChoice(null)
    setWager('')
  }

  const presetAmounts = [100, 500, 1000, 5000, 10000, 50000]

  return (
    <div className="w-full max-w-sm">
      {/* Coin */}
      <div className="flex justify-center mb-8">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div
              key="flipping"
              animate={{ y: [0, -50, 0] }}
              transition={{ duration: 0.35, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
              >
                <GoldCoin />
              </motion.div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
            >
              <GoldCoin side={result.side} won={result.won} />
            </motion.div>
          ) : (
            <div className="glow-gold rounded-full">
              <GoldCoin />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Status */}
      {isFlipping && (
        <div className="text-center mb-6">
          <p className="text-white font-medium mb-1">Flipping...</p>
          <p className="text-[#f7b32b] text-sm">
            {choice?.toUpperCase()} for {Number(wager).toLocaleString()} $BAG
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="text-center mb-6">
          <p
            className={`text-2xl font-bold mb-1 ${result.won ? 'text-green-400' : 'text-red-400'}`}
          >
            {result.won ? 'You Won!' : 'Rekt'}
          </p>
          <p className="text-[#8a9bb8] text-sm mb-1">
            {result.side.toUpperCase()}
          </p>
          <p
            className={`text-lg font-semibold ${result.won ? 'text-green-400' : 'text-red-400'}`}
          >
            {result.won
              ? `+${(result.amount * 2).toLocaleString()}`
              : `-${result.amount.toLocaleString()}`}{' '}
            $BAG
          </p>
          <button onClick={reset} className="btn-primary px-6 py-2.5 mt-5">
            Flip Again
          </button>
        </div>
      )}

      {/* Controls */}
      {!isFlipping && !result && (
        <div className="card p-5">
          {!user ? (
            <div className="text-center py-4">
              <p className="text-[#5a6a7a] text-sm mb-3">
                Sign in to start playing
              </p>
              <p className="text-[#3a4556] text-xs">
                Create an account, deposit $BAG, and flip!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <label className="text-xs text-[#5a6a7a] mb-2 block uppercase tracking-wider">
                  Pick side
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setChoice('heads')}
                    className={`btn-outline py-3 font-medium flex items-center justify-center gap-2 ${choice === 'heads' ? 'active' : ''}`}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                    </svg>
                    Heads
                  </button>
                  <button
                    onClick={() => setChoice('tails')}
                    className={`btn-outline py-3 font-medium flex items-center justify-center gap-2 ${choice === 'tails' ? 'active' : ''}`}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Tails
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs text-[#5a6a7a] mb-2 block uppercase tracking-wider">
                  Amount
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWager(amt.toString())}
                      className={`btn-outline py-2 text-xs ${wager === amt.toString() ? 'active' : ''}`}
                    >
                      {amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={wager}
                    onChange={(e) => setWager(e.target.value)}
                    placeholder="Custom"
                    className="flex-1 h-10 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
                  />
                  <span className="text-[#5a6a7a] text-sm">$BAG</span>
                </div>
                <p className="text-[10px] text-[#3a4556] mt-1.5">
                  Balance: {user.balance.toLocaleString()} $BAG
                </p>
              </div>

              <button
                onClick={handlePlay}
                disabled={!choice || !wager || parseInt(wager) > user.balance}
                className="btn-primary w-full py-3 text-sm"
              >
                Double or Nothing
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
