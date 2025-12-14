'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function DiceGame() {
  const [choice, setChoice] = useState<'low' | 'high' | null>(null)
  const [wager, setWager] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [displayNum, setDisplayNum] = useState(50)
  const [result, setResult] = useState<{ number: number; won: boolean } | null>(null)
  const balance = useWalletBalance()
  const { playDiceGame, loading } = useFlipCasino()

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
      const { vrfResult } = await playDiceGame(amt, choice)
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
    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="mb-6">
        <label className="block text-sm text-white/50 mb-2">Amount (SOL)</label>
        <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00"
          className="w-full h-12 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 text-white font-mono text-lg focus:outline-none focus:border-[#ef4444] transition" />
        <div className="flex gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-1.5 text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">{a}</button>
          ))}
          <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="px-3 py-1.5 text-xs text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 rounded transition">MAX</button>
        </div>
      </div>

      {!isRolling && !result && (
        <div className="mb-6">
          <label className="block text-sm text-white/50 mb-2">Pick Range</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setChoice('low')} className={`p-4 rounded-lg border transition ${choice === 'low' ? 'border-[#ef4444] bg-[#ef4444]/10' : 'border-white/10 hover:border-white/20'}`}>
              <div className="text-2xl font-bold text-white">1-50</div>
              <div className="text-sm text-white/50">Low</div>
            </button>
            <button onClick={() => setChoice('high')} className={`p-4 rounded-lg border transition ${choice === 'high' ? 'border-[#ef4444] bg-[#ef4444]/10' : 'border-white/10 hover:border-white/20'}`}>
              <div className="text-2xl font-bold text-white">51-100</div>
              <div className="text-sm text-white/50">High</div>
            </button>
          </div>
        </div>
      )}

      <div className="min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div className="text-5xl font-mono font-bold text-[#ef4444]" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>
                {displayNum}
              </motion.div>
              <div className="text-sm text-white/40 mt-2">Rolling...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={`text-5xl font-mono font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.number}</div>
              <div className={`text-2xl font-bold mt-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.won ? 'You Won!' : 'You Lost'}</div>
              <div className="text-sm text-white/40 mt-1">{result.number > 50 ? 'High' : 'Low'}</div>
              <button onClick={reset} className="mt-4 px-4 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition">Play Again</button>
            </motion.div>
          ) : (
            <div className="text-center text-white/20">
              <div className="text-4xl font-mono font-bold">?</div>
              <div className="text-sm mt-2">Pick a range</div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading}
          className="w-full h-12 bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-white/5 disabled:text-white/20 text-white font-medium rounded-lg transition">
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      )}
    </div>
  )
}
