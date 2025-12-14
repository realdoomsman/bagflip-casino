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
    <div className="bg-[#181818] rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="font-semibold text-white">Even / Odd</h2>
        <span className="text-xs text-green-400 font-medium">1.96x</span>
      </div>
      
      <div className="p-5">
        {/* Wager */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/40">BET AMOUNT</label>
            <span className="text-xs text-white/30">{balance.toFixed(4)} SOL</span>
          </div>
          <div className="relative">
            <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00"
              className="w-full h-12 bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-4 text-white text-lg font-semibold focus:outline-none focus:border-blue-500 transition" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button onClick={() => setWager((parseFloat(wager || '0') / 2).toString())} className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition">½</button>
              <button onClick={() => setWager((parseFloat(wager || '0') * 2).toString())} className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition">2x</button>
              <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="px-2 py-1 text-xs font-medium text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded transition">MAX</button>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[0.1, 0.25, 0.5, 1].map((a) => (
              <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-xs font-medium text-white/40 hover:text-white bg-[#0f0f0f] hover:bg-white/[0.04] border border-white/[0.06] rounded-lg transition">
                {a} SOL
              </button>
            ))}
          </div>
        </div>

        {/* Choice */}
        {!isRolling && !result && (
          <div className="mb-5">
            <label className="text-xs font-medium text-white/40 mb-2 block">PICK TYPE</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setChoice('even')} className={`p-5 rounded-xl border-2 transition-all ${choice === 'even' ? 'bg-blue-500/10 border-blue-500' : 'bg-[#0f0f0f] border-white/[0.06] hover:border-white/20'}`}>
                <div className="text-2xl font-bold text-white mb-1">2, 4, 6...</div>
                <div className="text-sm text-white/50">Even</div>
              </button>
              <button onClick={() => setChoice('odd')} className={`p-5 rounded-xl border-2 transition-all ${choice === 'odd' ? 'bg-blue-500/10 border-blue-500' : 'bg-[#0f0f0f] border-white/[0.06] hover:border-white/20'}`}>
                <div className="text-2xl font-bold text-white mb-1">1, 3, 5...</div>
                <div className="text-sm text-white/50">Odd</div>
              </button>
            </div>
          </div>
        )}

        {/* Animation */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isRolling ? (
              <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div className="text-6xl font-bold text-blue-400" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>
                  {displayNum}
                </motion.div>
                <div className="text-sm text-white/40 mt-3">Rolling...</div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className={`text-6xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.number}</div>
                <div className={`text-2xl font-bold mt-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.won ? 'You Won!' : 'You Lost'}</div>
                <div className="text-sm text-white/40 mt-1">{result.number % 2 === 0 ? 'Even' : 'Odd'}</div>
                <button onClick={reset} className="mt-4 px-6 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition">Play Again</button>
              </motion.div>
            ) : (
              <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="text-5xl font-bold text-white/10">?</div>
                <div className="text-sm text-white/30 mt-3">Pick even or odd</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!result && (
          <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-white/[0.06] disabled:text-white/20 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed">
            {isRolling ? 'Rolling...' : 'Roll Number'}
          </button>
        )}
      </div>
    </div>
  )
}
