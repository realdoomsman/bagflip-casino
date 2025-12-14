'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function IntroModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('bagflip_visited')
    if (!hasVisited) {
      setShow(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('bagflip_visited', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="card p-8 max-w-lg w-full"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 relative">
              <Image src="/logo.svg" alt="BagFlip" fill className="object-contain" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Welcome to BagFlip
          </h2>
          <p className="text-[#8a9bb8] text-center mb-6">
            The degen way to flip your $BAG supply
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Double or Nothing</h3>
                <p className="text-sm text-[#8a9bb8]">Win and get 2x your $BAG. Lose and get rekt. 50/50 odds.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">VS Dev or PvP</h3>
                <p className="text-sm text-[#8a9bb8]">Flip against the dev wallet treasury or challenge other players.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f7b32b]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#f7b32b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Provably Fair</h3>
                <p className="text-sm text-[#8a9bb8]">All results use Solana VRF. Verifiable on-chain. No manipulation.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="btn-primary w-full py-4 text-lg"
          >
            Let's Flip
          </button>

          <p className="text-xs text-[#4a5568] text-center mt-4">
            By continuing, you agree that gambling is risky and you may lose your tokens.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
