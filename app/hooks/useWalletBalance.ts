import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export function useWalletBalance() {
  const [balance, setBalance] = useState(0)
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    if (!publicKey) {
      setBalance(0)
      return
    }
    
    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey)
        setBalance(lamports / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setBalance(0)
      }
    }
    
    fetchBalance()
    const interval = setInterval(fetchBalance, 5000)
    return () => clearInterval(interval)
  }, [publicKey, connection])

  return balance
}
