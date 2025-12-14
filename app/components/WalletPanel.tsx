'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bagflip-casino-production.up.railway.app'

interface WalletPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function WalletPanel({ isOpen, onClose }: WalletPanelProps) {
  const { user, token, refreshUser } = useAuth()
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (user?.depositAddress) {
      navigator.clipboard.writeText(user.depositAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`${API_URL}/api/balance/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseInt(withdrawAmount),
          destinationAddress: withdrawAddress
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Withdrawal submitted!' })
        setWithdrawAmount('')
        setWithdrawAddress('')
        refreshUser()
      } else {
        setMessage({ type: 'error', text: data.error || 'Withdrawal failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="card p-5 w-full max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Wallet</h2>
              <button onClick={onClose} className="text-[#5a6a7a] hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Balance */}
            <div className="bg-[#080c14] rounded-xl p-4 mb-4 text-center">
              <p className="text-[#5a6a7a] text-xs mb-1">Your Balance</p>
              <p className="text-2xl font-bold text-[#f7b32b]">
                {user.balance.toLocaleString()} <span className="text-sm">$BAG</span>
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-[#080c14] p-1 rounded-lg">
              <button
                onClick={() => setTab('deposit')}
                className={`flex-1 py-2 text-sm rounded-md transition ${
                  tab === 'deposit'
                    ? 'bg-[#f7b32b] text-black font-medium'
                    : 'text-[#5a6a7a] hover:text-white'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setTab('withdraw')}
                className={`flex-1 py-2 text-sm rounded-md transition ${
                  tab === 'withdraw'
                    ? 'bg-[#f7b32b] text-black font-medium'
                    : 'text-[#5a6a7a] hover:text-white'
                }`}
              >
                Withdraw
              </button>
            </div>

            {tab === 'deposit' ? (
              <div>
                <p className="text-[#5a6a7a] text-xs mb-2">
                  Send $BAG tokens to this address:
                </p>
                <div className="bg-[#080c14] rounded-lg p-3 flex items-center gap-2">
                  <code className="text-xs text-white flex-1 break-all">
                    {user.depositAddress}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="text-[#f7b32b] hover:text-[#e5a320] shrink-0"
                  >
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[#3a4556] text-[10px] mt-2">
                  Deposits are credited automatically after confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-[#5a6a7a] text-xs mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0"
                      min="1000"
                      max={user.balance}
                      className="w-full h-10 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[#5a6a7a] text-xs mb-1 block">Destination Address</label>
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder="Solana wallet address"
                      className="w-full h-10 bg-[#080c14] border border-[#1e2a3a] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-[#f7b32b] transition"
                      required
                    />
                  </div>
                </div>

                {message && (
                  <p className={`text-xs mb-3 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !withdrawAmount || !withdrawAddress}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
                <p className="text-[#3a4556] text-[10px] mt-2">
                  Min withdrawal: 1,000 $BAG
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
