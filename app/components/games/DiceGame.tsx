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
    <div className="bg-[#12121a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎲</span>
          <h2 className="font-semibold text-white">Dice Roll</h2>
        </div>
        <div className="px-2 py-1 bg-green-500/10 rounded text-xs font-bold text-green-400">1.96x</div>
      </div>
      
      <div className="p-5">
        {/* Bet Amount */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Bet Amount</label>
            <span className="text-xs text-white/30">{balance.toFixed(4)} SOL</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00"
                className="w-full h-12 bg-[#1a1a24] border border-white/10 rounded-xl px-4 pr-24 text-white text-lg font-semibold focus:outline-none focus:border-[#ff6b4a] transition" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button onClick={() => setWager((parseFloat(wager || '0') / 2).toString())} className="px-2 py-1 text-xs font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">½</button>
                <button onClick={() => setWager((parseFloat(wager || '0') * 2).toString())} className="px-2 py-1 text-xs font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">2×</button>
                <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="px-2 py-1 text-xs font-bold text-[#ff6b4a] bg-[#ff6b4a]/10 hover:bg-[#ff6b4a]/20 rounded transition">MAX</button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[0.1, 0.25, 0.5, 1, 5].map((a) => (
              <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-xs font-medium text-white/50 hover:text-white bg-[#1a1a24] hover:bg-[#22222e] border border-white/5 rounded-lg transition">{a}</button>
            ))}
          </div>
        </div>

        {/* Pick Range */}
        {!isRolling && !result && (
          <div className="mb-5">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3 block">Pick Range</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setChoice('low')} className={`p-5 rounded-xl border-2 transition-all ${choice === 'low' ? 'bg-[#ff6b4a]/10 border-[#ff6b4a]' : 'bg-[#1a1a24] border-white/5 hover:border-white/20'}`}>
                <div className="text-3xl font-black text-white mb-1">1-50</div>
                <div className="text-sm text-white/50">Low</div>
              </button>
              <button onClick={() => setChoice('high')} className={`p-5 rounded-xl border-2 transition-all ${choice === 'high' ? 'bg-[#ff6b4a]/10 border-[#ff6b4a]' : 'bg-[#1a1a24] border-white/5 hover:border-white/20'}`}>
                <div className="text-3xl font-black text-white mb-1">51-100</div>
                <div className="text-sm text-white/50">High</div>
              </button>
            </div>
          </div>
        )}

        {/* Result Area */}
        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isRolling ? (
              <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div className="text-7xl font-black text-[#ff6b4a]" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>
                  {displayNum}
                </motion.div>
                <div className="text-sm text-white/40 mt-3">Rolling...</div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className={`text-7xl font-black ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.number}</div>
                <div className={`text-3xl font-bold mt-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.won ? 'You Won!' : 'You Lost'}</div>
                <div className="text-sm text-white/40 mt-1">{result.number > 50 ? 'High' : 'Low'}</div>
                <button onClick={reset} className="mt-5 px-6 py-2.5 text-sm font-semibold text-[#ff6b4a] bg-[#ff6b4a]/10 hover:bg-[#ff6b4a]/20 rounded-xl transition">Play Again</button>
              </motion.div>
            ) : (
              <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="text-6xl font-black text-white/10">?</div>
                <div className="text-sm text-white/30 mt-3">Pick high or low</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!result && (
          <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading}
            className="w-full h-14 bg-gradient-to-r from-[#ff6b4a] to-[#ff9f43] hover:from-[#ff5533] hover:to-[#ff8c2a] disabled:from-[#1a1a24] disabled:to-[#1a1a24] disabled:text-white/20 text-white font-bold text-lg rounded-xl transition disabled:cursor-not-allowed shadow-lg shadow-[#ff6b4a]/20 disabled:shadow-none">
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        )}
      </div>
    </div>
  )
}
