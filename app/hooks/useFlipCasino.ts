import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js'

export function useFlipCasino() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)

  const playCoinFlip = async (wager: number, choice: boolean) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    try {
      console.log('Playing Coin Flip:', { wager, choice })
      
      // Treasury wallet - this is where wagers are sent
      const treasuryWallet = new PublicKey('GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7')
      
      // Convert wager to lamports
      const wagerLamports = Math.floor(wager * LAMPORTS_PER_SOL)
      
      // Create transaction to send wager to treasury
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: treasuryWallet,
          lamports: wagerLamports,
        })
      )
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey
      
      // Sign and send transaction
      const signed = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature)
      
      console.log('Wager sent to treasury:', signature)
      
      // Request VRF from backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/game/request-vrf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: signature,
          gameType: 'CoinFlip',
          player: wallet.publicKey.toString(),
          wager: wagerLamports,
          choice,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to request VRF')
      }
      
      const { vrfResult, won } = await response.json()
      
      // If player won, send payout from treasury back to player
      if (won) {
        const payoutLamports = wagerLamports * 2 // 2x payout for win
        
        // Note: This requires the treasury wallet to sign
        // For testing, we'll just log it
        console.log(`Player won! Should receive ${payoutLamports / LAMPORTS_PER_SOL} SOL`)
        // In production, the backend would handle the payout transaction
      }
      
      return { 
        tx: signature, 
        gamePDA: wallet.publicKey, 
        vrfResult,
        won 
      }
    } catch (error) {
      console.error('Error playing coin flip:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const playDiceGame = async (wager: number, choice: 'low' | 'high') => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    try {
      console.log('Playing Dice:', { wager, choice })
      
      // Treasury wallet
      const treasuryWallet = new PublicKey('GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7')
      const wagerLamports = Math.floor(wager * LAMPORTS_PER_SOL)
      
      // Send wager to treasury
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: treasuryWallet,
          lamports: wagerLamports,
        })
      )
      
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey
      
      const signed = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature)
      
      console.log('Wager sent to treasury:', signature)
      
      // Request VRF
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/game/request-vrf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: signature,
          gameType: 'DiceHighLow',
          player: wallet.publicKey.toString(),
          wager: wagerLamports,
          choice,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to request VRF')
      }
      
      const { vrfResult, won } = await response.json()
      
      return { 
        tx: signature, 
        gamePDA: wallet.publicKey, 
        vrfResult,
        won 
      }
    } catch (error) {
      console.error('Error playing dice:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const playEvenOdd = async (wager: number, choice: 'even' | 'odd') => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    try {
      console.log('Playing Even/Odd:', { wager, choice })
      
      // Treasury wallet
      const treasuryWallet = new PublicKey('GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7')
      const wagerLamports = Math.floor(wager * LAMPORTS_PER_SOL)
      
      // Send wager to treasury
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: treasuryWallet,
          lamports: wagerLamports,
        })
      )
      
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey
      
      const signed = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature)
      
      console.log('Wager sent to treasury:', signature)
      
      // Request VRF
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(backendUrl + '/api/game/request-vrf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: signature,
          gameType: 'EvenOdd',
          player: wallet.publicKey.toString(),
          wager: wagerLamports,
          choice,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to request VRF')
      }
      
      const { vrfResult, won } = await response.json()
      
      return { 
        tx: signature, 
        gamePDA: wallet.publicKey, 
        vrfResult,
        won 
      }
    } catch (error) {
      console.error('Error playing even/odd:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getTreasuryStats = async () => {
    if (!wallet.publicKey) return null
    
    try {
      // Mock treasury stats for local testing
      return {
        totalWagered: '1000000000',
        totalPaid: '950000000',
      }
    } catch (error) {
      console.error('Error fetching treasury:', error)
      return null
    }
  }

  return {
    playCoinFlip,
    playDiceGame,
    playEvenOdd,
    getTreasuryStats,
    loading,
  }
}
