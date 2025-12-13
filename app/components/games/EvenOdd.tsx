'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

const NumberBall = ({ number, type, size = 80 }: { number: number | string, type: 'even' | 'odd' | 'neutral', size?: number }) => {
  const colors = {
    even: { bg: '#06b6d4', shadow: 'rgba(6, 182, 212, 0.4)' },
    odd: { bg: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.4)' },
    neutral: { bg: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.4)' }
  }
  const c = colors[type]
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`ballGrad-${type}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c.bg}/>
        </radialGradient>
        <filter id={`ballShadow-${type}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={c.shadow} floodOpacity="0.6"/>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="45" fill={`url(#ballGrad-${type})`} filter={`url(#ballShadow-${type})`}/>
      <ellipse cx="35" cy="35" rx="12" ry="8" fill="white" opacity="0.3"/>
      <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">{number}</text>
    </svg>
  )
}

const NumberDisplay = ({ number, won }: { number: number, won?: boolean }) => {
  const isEven = number % 2 === 0
  return (
    <div className={`relative w-36 h-36 rounded-full flex items-center justify-center ${
      won === true ? 'bg-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.4)]' : 
      won === false ? 'bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 
      isEven ? 'bg-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.4)]' : 'bg-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.4)]'
    }`}>
      <span className={`text-5xl font-bold ${
        won === true ? 'text-green-400' : won === false ? 'text-red-400' : isEven ? 'text-cyan-400' : 'text-amber-400'
      }`}>{number}</span>
    </div>
  )
}

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
    <div className="card p-8">
      {/* Wager */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-white/50 mb-3">Wager Amount</label>
        <div className="flex gap-3">
          <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00" className="input flex-1" />
          <button onClick={() => setWager(Math.max(0, balance - 0.01).toFixed(2))} className="btn btn-secondary px-5">MAX</button>
        </div>
        <div className="flex gap-2 mt-3">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-3 text-sm font-semibold text-white/40 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30 transition-all">
              {a} SOL
            </button>
          ))}
        </div>
        <div className="text-sm text-white/30 mt-3">Balance: {balance.toFixed(4)} SOL</div>
      </div>

      {/* Choice */}
      {!isRolling && !result && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button onClick={() => setChoice('even')} className={`choice-btn ${choice === 'even' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center gap-1 mb-3">
              <NumberBall number={2} type="even" size={45} />
              <NumberBall number={4} type="even" size={45} />
              <NumberBall number={6} type="even" size={45} />
            </div>
            <div className="text-lg font-bold text-white">Even</div>
          </button>
          <button onClick={() => setChoice('odd')} className={`choice-btn ${choice === 'odd' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center gap-1 mb-3">
              <NumberBall number={1} type="odd" size={45} />
              <NumberBall number={3} type="odd" size={45} />
              <NumberBall number={5} type="odd" size={45} />
            </div>
            <div className="text-lg font-bold text-white">Odd</div>
          </button>
        </div>
      )}

      {/* Animation */}
      <div className="min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 0.2, repeat: Infinity }}>
                <NumberDisplay number={displayNum} />
              </motion.div>
              <div className="text-sm text-white/40 mt-6">Rolling...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
                <NumberDisplay number={result.number} won={result.won} />
              </motion.div>
              <div className={`text-3xl font-bold mt-4 mb-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <div className="text-sm text-white/40 mb-6">{result.number % 2 === 0 ? 'Even' : 'Odd'}</div>
              <button onClick={reset} className="btn btn-secondary">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="flex justify-center gap-2 opacity-30">
                <NumberBall number="?" type="neutral" size={70} />
              </div>
              <div className="text-sm text-white/30 mt-4">Pick even or odd</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play */}
      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading} className="btn btn-primary w-full mt-6">
          {isRolling ? 'Rolling...' : 'Roll Number'}
        </button>
      )}
    </div>
  )
}
