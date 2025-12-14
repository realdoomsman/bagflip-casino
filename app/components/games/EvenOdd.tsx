'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function EvenOdd() {
  const [choice, setChoice] = useState<'even' | 'odd' | null>(null)
  const [wager, setWager] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [displayNum, setDisplayNum] = useState(50)
  const [result, setResult] = useState<{ number: number; won: boolean } | null>(null)
  const balance = useWalletBalance()
  const { playEvenOdd, loading } = useFlipCasino()

  useEffect(() => {
    if (isRolling) {
      const i = setInterval(() => setDisplayNum(Math.floor(Math.random() * 100) + 1), 50)
      return () => clearInterval(i)
    }
  }, [isRolling])

  const handlePlay = async () => {
    if (!choice || !wager) return
    const amt = parseFloat(wager)
    if (isNaN(amt) || amt <= 0 || isRolling || loading) return
    setIsRolling(true)
    setResult(null)
    try {
      const { vrfResult } = await playEvenOdd(amt, choice)
      await new Promise(r => setTimeout(r, 1500))
      const roll = (vrfResult.value % 100) + 1
      setDisplayNum(roll)
      setResult({ number: roll, won: vrfResult.won })
    } catch (e: any) {
      alert(e?.message || 'Transaction failed')
    } finally {
      setIsRolling(false)
    }
  }

  const reset = () => { setResult(null); setChoice(null) }

  return (
    <div className="game-card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-white/50">Wager</label>
          <span className="text-xs text-white/30">{balance.toFixed(4)} SOL</span>
        </div>
        <div className="flex gap-2">
          <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00" className="game-input flex-1" />
          <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="quick-amt px-4">MAX</button>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="quick-amt">{a}</button>
          ))}
        </div>
      </div>

      {!isRolling && !result && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setChoice('even')} className={`choice-btn ${choice === 'even' ? 'selected' : ''}`}>
            <div className="text-3xl font-bold text-white mb-1">2, 4, 6</div>
            <div className="text-sm text-white/50">Even</div>
          </button>
          <button onClick={() => setChoice('odd')} className={`choice-btn ${choice === 'odd' ? 'selected' : ''}`}>
            <div className="text-3xl font-bold text-white mb-1">1, 3, 5</div>
            <div className="text-sm text-white/50">Odd</div>
          </button>
        </div>
      )}

      <div className="min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div className="text-6xl font-bold text-emerald-400" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>
                {displayNum}
              </motion.div>
              <div className="text-sm text-white/40 mt-4">Rolling...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={`text-6xl font-bold ${result.won ? 'text-emerald-400' : 'text-red-400'}`}>{result.number}</div>
              <div className={`text-2xl font-bold mt-3 ${result.won ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-sm text-white/40 mt-1 mb-5">{result.number % 2 === 0 ? 'Even' : 'Odd'}</div>
              <button onClick={reset} className="btn-secondary">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="text-6xl font-bold text-white/10">?</div>
              <div className="text-sm text-white/30 mt-4">Pick even or odd</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading} className="btn-play mt-4">
          {isRolling ? 'Rolling...' : 'Roll Number'}
        </button>
      )}
    </div>
  )
}
