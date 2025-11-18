'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export default function WalletBalance() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) {
      setBalance(null)
      setLoading(false)
      return
    }

    const fetchBalance = async () => {
      try {
        // Get actual SOL balance from wallet
        const lamports = await connection.getBalance(publicKey)
        const solBalance = lamports / LAMPORTS_PER_SOL
        setBalance(solBalance)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setBalance(null)
        setLoading(false)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 5000)
    return () => clearInterval(interval)
  }, [publicKey, connection])

  if (!publicKey) return null

  return (
    <div className="text-center">
      <div className="text-sm text-text-secondary">Your Balance</div>
      <div className="text-xl font-bold text-neon-green">
        {loading ? 'Loading...' : balance !== null ? `${balance.toLocaleString()} SOL` : 'Error'}
      </div>
    </div>
  )
}
