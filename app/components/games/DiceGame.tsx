'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

const Dice3D = ({ number, size = 100, color = '#8b5cf6' }: { number: number, size?: number, color?: string }) => {
  const dots: { [key: number]: [number, number][] } = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]]
  }
  const displayNum = Math.min(6, Math.max(1, number % 6 || 6))
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="diceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <filter id="diceShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/>
        </filter>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="16" fill="url(#diceGrad)" filter="url(#diceShadow)"/>
      <rect x="12" y="12" width="76" height="76" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
      {dots[displayNum]?.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="white"/>
      ))}
    </svg>
  )
}

const NumberDisplay = ({ number, won }: { number: number, won?: boolean }) => (
  <div className={`relative w-32 h-32 rounded-2xl flex items-center justify-center ${
    won === true ? 'bg-green-500/20 border-2 border-green-500/50' : 
    won === false ? 'bg-red-500/20 border-2 border-red-500/50' : 
    'bg-violet-500/20 border-2 border-violet-500/50'
  }`}>
    <span className={`text-5xl font-bold ${
      won === true ? 'text-green-400' : won === false ? 'text-red-400' : 'text-violet-400'
    }`}>{number}</span>
  </div>
)

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
          <button onClick={() => setChoice('low')} className={`choice-btn ${choice === 'low' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center gap-2 mb-3">
              <Dice3D number={1} size={50} color="#06b6d4" />
              <Dice3D number={3} size={50} color="#06b6d4" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">1-50</div>
            <div className="text-sm text-white/50">Low</div>
          </button>
          <button onClick={() => setChoice('high')} className={`choice-btn ${choice === 'high' ? 'choice-btn-selected' : ''}`}>
            <div className="flex justify-center gap-2 mb-3">
              <Dice3D number={5} size={50} color="#8b5cf6" />
              <Dice3D number={6} size={50} color="#8b5cf6" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">51-100</div>
            <div className="text-sm text-white/50">High</div>
          </button>
        </div>
      )}

      {/* Animation */}
      <div className="min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
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
              <div className="text-sm text-white/40 mb-6">{result.number > 50 ? 'High' : 'Low'}</div>
              <button onClick={reset} className="btn btn-secondary">Play Again</button>
            </motion.div>
          ) : (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="flex justify-center gap-3 opacity-30">
                <Dice3D number={3} size={70} />
                <Dice3D number={4} size={70} />
              </div>
              <div className="text-sm text-white/30 mt-4">Pick high or low</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play */}
      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading} className="btn btn-primary w-full mt-6">
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      )}
    </div>
  )
}
