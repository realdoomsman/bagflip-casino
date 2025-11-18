'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameLayout from './GameLayout'
import { useFlipCasino } from '@/hooks/useFlipCasino'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function EvenOdd() {
  const [choice, setChoice] = useState<'even' | 'odd' | null>(null)
  const [wager, setWager] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [displayNumber, setDisplayNumber] = useState(50)
  const [result, setResult] = useState<{ number: number; won: boolean } | null>(null)
  const balance = useWalletBalance()
  const { playEvenOdd, loading } = useFlipCasino()

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 100) + 1)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isRolling])

  const handlePlay = async () => {
    if (!choice || !wager) return
    
    // Client-side validation
    const wagerAmount = parseFloat(wager)
    
    if (isNaN(wagerAmount) || wagerAmount <= 0) {
      alert('Please enter a valid wager amount')
      return
    }
    
    const MIN_WAGER = 0.000001
    const MAX_WAGER = 1000
    
    if (wagerAmount < MIN_WAGER || wagerAmount > MAX_WAGER) {
      alert(`Wager must be between ${MIN_WAGER} and ${MAX_WAGER} $FLIP`)
      return
    }
    
    // Prevent spam
    if (isRolling || loading) {
      return
    }
    
    setIsRolling(true)
    setResult(null)
    
    try {
      // Call real Anchor program (Treasury mode)
      const { vrfResult } = await playEvenOdd(wagerAmount, choice)
      
      // Faster settlement for Treasury mode (1.2s animation)
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Get actual number from VRF
      const roll = (vrfResult.value % 100) + 1
      const won = vrfResult.won
      
      setDisplayNumber(roll)
      setResult({ number: roll, won })
    } catch (error: any) {
      console.error('Error playing:', error)
      alert(error?.message || 'Transaction failed. Please try again.')
    } finally {
      setIsRolling(false)
    }
  }

  return (
    <GameLayout
      title="EVEN/ODD"
      wager={wager}
      setWager={setWager}
      onPlay={handlePlay}
      disabled={!choice || !wager || isRolling || loading}
      balance={balance}
    >
      <div className="w-full">
        {/* Choice Buttons */}
        {!isRolling && !result && (
          <div className="flex gap-6 justify-center mb-12">
            <ChoiceButton
              label="EVEN"
              emoji="2️⃣"
              selected={choice === 'even'}
              onClick={() => setChoice('even')}
              color="neon-purple"
            />
            <ChoiceButton
              label="ODD"
              emoji="1️⃣"
              selected={choice === 'odd'}
              onClick={() => setChoice('odd')}
              color="neon-pink"
            />
          </div>
        )}

        {/* Animation Area */}
        <div className="flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {isRolling ? (
              <motion.div
                key="rolling"
                className="text-center"
              >
                <motion.div
                  className="text-[180px] font-black text-neon-purple"
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    textShadow: '0 0 30px rgba(168, 85, 247, 0.6)'
                  }}
                >
                  {displayNumber}
                </motion.div>
                <div className="text-2xl text-gray-400 font-bold mt-4">
                  Rolling...
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-center w-full"
              >
                {/* Number with Glow */}
                <motion.div 
                  className={`text-[180px] lg:text-[220px] font-black mb-6 ${
                    result.won ? 'text-neon-purple neon-glow' : 'text-red-500'
                  }`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  style={{
                    filter: result.won 
                      ? 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))' 
                      : 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))',
                    textShadow: result.won
                      ? '0 0 20px rgba(168, 85, 247, 1), 0 0 40px rgba(168, 85, 247, 0.8)'
                      : '0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.8)'
                  }}
                >
                  {result.number}
                </motion.div>
                
                {/* Big Result Text */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-6xl lg:text-7xl font-black neon-glow mb-4 ${
                    result.won ? 'text-neon-purple' : 'text-red-500'
                  }`}
                >
                  {result.won ? '🎉 YOU WIN!' : '💀 YOU LOSE'}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl lg:text-3xl text-text-secondary font-bold mb-2"
                >
                  {result.number % 2 === 0 ? 'EVEN' : 'ODD'}
                </motion.div>
                
                <div className="text-xl text-text-secondary">
                  Rolled {result.number}
                </div>
                
                {/* Play Again Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResult(null)}
                  className="mt-8 px-12 py-4 bg-neon-purple text-dark-bg text-xl lg:text-2xl font-black rounded-xl hover:shadow-2xl hover:shadow-neon-purple/50 transition-all"
                >
                  🔁 PLAY AGAIN
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="text-[150px] opacity-30"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🔢
                </motion.div>
                <div className="text-2xl text-text-secondary mt-6">
                  Choose Even or Odd
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameLayout>
  )
}

function ChoiceButton({ label, emoji, selected, onClick, color }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-16 py-8 rounded-2xl text-2xl font-black transition-all ${
        selected 
          ? `bg-${color} text-dark-bg shadow-2xl shadow-${color}/50` 
          : 'glass-panel hover:bg-white/10'
      }`}
    >
      <div className="text-6xl mb-3">{emoji}</div>
      {label}
    </motion.button>
  )
}
