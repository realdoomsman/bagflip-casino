import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js'
import fs from 'fs'
import path from 'path'

export class PayoutService {
  private connection: Connection
  private treasuryKeypair: Keypair | null = null

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, 'confirmed')
    this.loadTreasuryKeypair()
  }

  private loadTreasuryKeypair() {
    try {
      const keypairPath = path.join(__dirname, '../treasury-keypair.json')
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
      this.treasuryKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData))
      console.log('[PAYOUT] Treasury wallet loaded:', this.treasuryKeypair.publicKey.toString())
    } catch (error) {
      console.error('[PAYOUT] Failed to load treasury keypair:', error)
    }
  }

  async sendPayout(playerAddress: string, amountSOL: number): Promise<string | null> {
    if (!this.treasuryKeypair) {
      console.error('[PAYOUT] Treasury keypair not loaded')
      return null
    }

    try {
      const playerPubkey = new PublicKey(playerAddress)
      const lamports = Math.floor(amountSOL * LAMPORTS_PER_SOL)

      console.log(`[PAYOUT] Sending ${amountSOL} SOL to ${playerAddress}`)

      // Check treasury balance
      const treasuryBalance = await this.connection.getBalance(this.treasuryKeypair.publicKey)
      console.log(`[PAYOUT] Treasury balance: ${treasuryBalance / LAMPORTS_PER_SOL} SOL`)

      if (treasuryBalance < lamports) {
        console.error('[PAYOUT] Insufficient treasury balance')
        return null
      }

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.treasuryKeypair.publicKey,
          toPubkey: playerPubkey,
          lamports,
        })
      )

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.treasuryKeypair],
        {
          commitment: 'confirmed',
        }
      )

      console.log(`[PAYOUT] Success! Signature: ${signature}`)
      return signature
    } catch (error) {
      console.error('[PAYOUT] Error sending payout:', error)
      return null
    }
  }

  async getTreasuryBalance(): Promise<number> {
    if (!this.treasuryKeypair) {
      return 0
    }

    try {
      const balance = await this.connection.getBalance(this.treasuryKeypair.publicKey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error('[PAYOUT] Error getting treasury balance:', error)
      return 0
    }
  }

  getTreasuryAddress(): string | null {
    return this.treasuryKeypair?.publicKey.toString() || null
  }
}
