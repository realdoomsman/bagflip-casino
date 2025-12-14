'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function EvenOdd() {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
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
    if (!connected) { setVisible(true); return }
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
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      {!isRolling && !result && (
        <>
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-3">Pick a type</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setChoice('even')} className={`p-5 rounded-xl border-2 transition ${choice === 'even' ? 'border-white bg-white/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <div className="text-2xl font-bold text-white">2, 4, 6</div>
                <div className="text-sm text-zinc-400">Even</div>
              </button>
              <button onClick={() => setChoice('odd')} className={`p-5 rounded-xl border-2 transition ${choice === 'odd' ? 'border-white bg-white/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <div className="text-2xl font-bold text-white">1, 3, 5</div>
                <div className="text-sm text-zinc-400">Odd</div>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-3">Bet amount (SOL)</label>
            <input type="number" value={wager} onChange={(e) => setWager(e.target.value)} placeholder="0.00"
              className="w-full h-12 bg-zinc-800 border border-zinc-700 rounded-xl px-4 text-white text-lg font-medium focus:outline-none focus:border-zinc-500 transition" />
            <div className="flex gap-2 mt-3">
              {[0.1, 0.5, 1, 5].map((a) => (
                <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">{a}</button>
              ))}
            </div>
            {connected && <div className="text-xs text-zinc-500 mt-3">Balance: {balance.toFixed(4)} SOL</div>}
          </div>
        </>
      )}

      <div className="min-h-[160px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div key="roll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div className="text-6xl font-bold text-white" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>{displayNum}</motion.div>
              <div className="text-zinc-400 mt-3">Rolling...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={`text-6xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.number}</div>
              <div className={`text-2xl font-bold mt-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>{result.won ? 'You Won!' : 'You Lost'}</div>
              <button onClick={reset} className="mt-4 text-sm text-zinc-400 hover:text-white transition">Play Again</button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {!result && (
        <button onClick={handlePlay} disabled={!choice || !wager || isRolling || loading}
          className="w-full h-12 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium rounded-xl transition">
          {!connected ? 'Connect Wallet' : isRolling ? 'Rolling...' : 'Roll Number'}
        </button>
      )}
    </div>
  )
}
