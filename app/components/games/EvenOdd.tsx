'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bagflip-casino-production.up.railway.app'

export default function EvenOdd() {
  const { user, token, refreshUser } = useAuth()
  const [choice, setChoice] = useState<'even' | 'odd' | null>(null)
  const [wager, setWager] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [displayNum, setDisplayNum] = useState(50)
  const [result, setResult] = useState<{
    number: number
    won: boolean
    amount: number
  } | null>(null)

  useEffect(() => {
    if (isRolling) {
      const i = setInterval(
        () => setDisplayNum(Math.floor(Math.random() * 100) + 1),
        50
      )
      return () => clearInterval(i)
    }
  }, [isRolling])

  const handlePlay = async () => {
    if (!user || !token || !choice || !wager) return
    const amt = parseInt(wager)
    if (isNaN(amt) || amt <= 0 || amt > user.balance || isRolling) return

    setIsRolling(true)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/game/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: 'EvenOdd',
          wager: amt,
          choice,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        await new Promise((r) => setTimeout(r, 1800))
        setDisplayNum(data.result)
        setResult({ number: data.result, won: data.won, amount: amt })
        refreshUser()
      } else {
        alert(data.error || 'Game failed')
      }
    } catch (error) {
      console.error('Game error:', error)
      alert('Something went wrong')
    } finally {
      setIsRolling(false)
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
      {/* Number Display */}
      <div className="flex justify-center mb-8">
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              className="w-32 h-32 rounded-xl bg-[#0d1219] border-2 border-[#f7b32b] flex items-center justify-center"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 0.08, repeat: Infinity }}
            >
              <span className="text-[#f7b32b] text-4xl font-bold tabular-nums">
                {displayNum}
              </span>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-32 h-32 rounded-xl flex items-center justify-center border-2 ${
                result.won
                  ? 'bg-green-900/10 border-green-400/50'
                  : 'bg-red-900/10 border-red-400/50'
              }`}
            >
              <span
                className={`text-4xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}
              >
                {result.number}
              </span>
            </motion.div>
          ) : (
            <div className="w-32 h-32 rounded-xl bg-[#0d1219] border border-[#1e2a3a] flex items-center justify-center">
              <span className="text-[#3a4556] text-4xl font-bold">?</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Status */}
      {isRolling && (
        <div className="text-center mb-6">
          <p className="text-white font-medium mb-1">Rolling...</p>
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
          <p
            className={`text-lg font-semibold ${result.won ? 'text-green-400' : 'text-red-400'}`}
          >
            {result.won
              ? `+${(result.amount * 2).toLocaleString()}`
              : `-${result.amount.toLocaleString()}`}{' '}
            $BAG
          </p>
          <button onClick={reset} className="btn-primary px-6 py-2.5 mt-5">
            Roll Again
          </button>
        </div>
      )}

      {/* Controls */}
      {!isRolling && !result && (
        <div className="card p-5">
          {!user ? (
            <div className="text-center py-4">
              <p className="text-[#5a6a7a] text-sm mb-3">
                Sign in to start playing
              </p>
              <p className="text-[#3a4556] text-xs">
                Create an account, deposit $BAG, and play!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <label className="text-xs text-[#5a6a7a] mb-2 block uppercase tracking-wider">
                  Pick type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setChoice('even')}
                    className={`btn-outline py-3 font-medium ${choice === 'even' ? 'active' : ''}`}
                  >
                    Even
                  </button>
                  <button
                    onClick={() => setChoice('odd')}
                    className={`btn-outline py-3 font-medium ${choice === 'odd' ? 'active' : ''}`}
                  >
                    Odd
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
