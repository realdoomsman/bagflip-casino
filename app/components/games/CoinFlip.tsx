'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function CoinFlip() {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null)
  const [wager, setWager] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<{ won: boolean; side: 'heads' | 'tails' } | null>(null)
  const balance = useWalletBalance()
  const { playCoinFlip, loading } = useFlipCasino()

  const handlePlay = async () => {
    if (!connected) {
      setVisible(true)
      return
    }
    if (!choice || !wager) return
    const amt = parseFloat(wager)
    if (isNaN(amt) || amt <= 0 || isFlipping || loading) return
    setIsFlipping(true)
    setResult(null)
    try {
      const { vrfResult } = await playCoinFlip(amt, choice === 'heads')
      await new Promise(r => setTimeout(r, 1800))
      setResult({ won: vrfResult.won, side: vrfResult.won ? choice : choice === 'heads' ? 'tails' : 'heads' })
    } catch (e: any) {
      alert(e?.message || 'Transaction failed')
    } finally {
      setIsFlipping(false)
    }
  }

  const reset = () => { setResult(null); setChoice(null) }

  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
      {/* Amount */}
      <div className="mb-5">
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">Bet Amount</label>
        <input 
          type="number" 
          value={wager} 
          onChange={(e) => setWager(e.target.value)} 
          placeholder="0.00"
          className="w-full h-12 bg-[#111] border border-white/10 rounded-lg px-4 text-white text-lg focus:outline-none focus:border-[#ef4444] transition"
        />
        <div className="flex gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((a) => (
            <button key={a} onClick={() => setWager(a.toString())} className="flex-1 py-1.5 text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded transition">
              {a}
            </button>
          ))}
        </div>
        {connected && <div className="text-xs text-white/30 mt-2">Balance: {balance.toFixed(4)} SOL</div>}
      </div>

      {/* Choice */}
      {!isFlipping && !result && (
        <div className="mb-5">
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">Pick Side</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setChoice('heads')} 
              className={`p-4 rounded-lg border-2 transition ${
                choice === 'heads' ? 'border-[#ef4444] bg-[#ef4444]/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-yellow-900 font-bold">H</span>
              </div>
              <div className="text-white text-sm font-medium">Heads</div>
            </button>
            <button 
              onClick={() => setChoice('tails')} 
              className={`p-4 rounded-lg border-2 transition ${
                choice === 'tails' ? 'border-[#ef4444] bg-[#ef4444]/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-yellow-900 font-bold">T</span>
              </div>
              <div className="text-white text-sm font-medium">Tails</div>
            </button>
          </div>
        </div>
      )}

      {/* Result Area */}
      <div className="min-h-[120px] flex items-center justify-center mb-5">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div 
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center"
                animate={{ rotateY: [0, 360] }} 
                transition={{ duration: 0.4, repeat: Infinity }}
              >
                <span className="text-yellow-900 font-bold text-xl">?</span>
              </motion.div>
              <div className="text-sm text-white/40 mt-3">Flipping...</div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center ${result.won ? 'ring-4 ring-green-500/50' : ''}`}>
                <span className="text-yellow-900 font-bold text-2xl">{result.side === 'heads' ? 'H' : 'T'}</span>
              </div>
              <div className={`text-xl font-bold mt-3 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'You Won!' : 'You Lost'}
              </div>
              <button onClick={reset} className="mt-3 text-sm text-[#ef4444] hover:underline">Play Again</button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Button */}
      {!result && (
        <button 
          onClick={handlePlay} 
          disabled={!choice || !wager || isFlipping || loading}
          className="w-full h-12 bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-white/10 disabled:text-white/30 text-white font-medium rounded-lg transition"
        >
          {!connected ? 'Connect Wallet to Play' : isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      )}
    </div>
  )
}
