import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'

interface GameResult {
  gameId: string
  player: string
  gameType: string
  wager: number
  won: boolean
  result: number
}

interface PvPResult {
  roomId: string
  creator: string
  opponent: string
  wager: number
  winner: string
  gameType: string
}

export class SettlementEngine {
  private connection: Connection
  private treasuryBalance: number
  private eventCallbacks: Map<string, Function[]>

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, 'confirmed')
    this.treasuryBalance = 113000000 // Starting balance
    this.eventCallbacks = new Map()
  }

  // Register event listener
  on(event: string, callback: Function) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, [])
    }
    this.eventCallbacks.get(event)!.push(callback)
  }

  // Emit event
  private emit(event: string, data: any) {
    const callbacks = this.eventCallbacks.get(event) || []
    callbacks.forEach(cb => cb(data))
  }

  // Handle Treasury game settlement
  async settleTreasuryGame(result: GameResult): Promise<void> {
    try {
      console.log(`[SETTLEMENT] Treasury game: ${result.gameId}`)
      console.log(`[SETTLEMENT] Player: ${result.player.slice(0, 8)}... Wager: ${result.wager} Won: ${result.won}`)

      if (result.won) {
        // Player wins - Treasury pays out 2x wager
        const payout = result.wager * 2
        this.treasuryBalance -= payout
        
        console.log(`[SETTLEMENT] Treasury pays ${payout} to player`)
        console.log(`[SETTLEMENT] New treasury balance: ${this.treasuryBalance}`)

        // TODO: Execute SPL token transfer from treasury to player
        // await this.transferTokens(treasuryAccount, playerAccount, payout)
      } else {
        // Player loses - Wager stays in treasury
        this.treasuryBalance += result.wager
        
        console.log(`[SETTLEMENT] Treasury receives ${result.wager} from player`)
        console.log(`[SETTLEMENT] New treasury balance: ${this.treasuryBalance}`)
      }

      // Emit settlement event
      this.emit('treasury_settled', {
        ...result,
        treasuryBalance: this.treasuryBalance,
        timestamp: Date.now()
      })

      // Broadcast to live feed
      this.emit('live_feed', {
        id: result.gameId,
        player: result.player,
        game: result.gameType,
        wager: result.wager,
        won: result.won,
        timestamp: Date.now()
      })

    } catch (error) {
      console.error('[SETTLEMENT] Error settling treasury game:', error)
      throw error
    }
  }

  // Handle PvP game settlement
  async settlePvPGame(result: PvPResult): Promise<void> {
    try {
      console.log(`[SETTLEMENT] PvP game: ${result.roomId}`)
      console.log(`[SETTLEMENT] Winner: ${result.winner.slice(0, 8)}... Wager: ${result.wager}`)

      const totalPot = result.wager * 2
      
      // Winner receives entire pot (2x wager)
      console.log(`[SETTLEMENT] Winner receives ${totalPot}`)

      // TODO: Execute SPL token transfer from escrow to winner
      // await this.transferFromEscrow(escrowAccount, winnerAccount, totalPot)

      // Emit settlement event
      this.emit('pvp_settled', {
        ...result,
        payout: totalPot,
        timestamp: Date.now()
      })

      // Broadcast to live feed
      this.emit('live_feed', {
        id: result.roomId,
        player: result.winner,
        game: `PvP ${result.gameType}`,
        wager: result.wager,
        won: true,
        timestamp: Date.now()
      })

    } catch (error) {
      console.error('[SETTLEMENT] Error settling PvP game:', error)
      throw error
    }
  }

  // Get current treasury balance
  getTreasuryBalance(): number {
    return this.treasuryBalance
  }

  // Update treasury balance (for admin/testing)
  setTreasuryBalance(balance: number): void {
    this.treasuryBalance = balance
    console.log(`[SETTLEMENT] Treasury balance updated to: ${balance}`)
  }

  // Execute SPL token transfer (placeholder)
  private async transferTokens(
    from: PublicKey,
    to: PublicKey,
    amount: number
  ): Promise<string> {
    // TODO: Implement actual SPL token transfer
    // 1. Get token accounts
    // 2. Create transfer instruction
    // 3. Sign and send transaction
    // 4. Return transaction signature
    
    console.log(`[TRANSFER] ${amount} tokens from ${from.toString()} to ${to.toString()}`)
    return 'mock-tx-signature'
  }

  // Handle errors and refunds
  async handleError(gameId: string, player: string, wager: number): Promise<void> {
    try {
      console.log(`[SETTLEMENT] Error handling for game ${gameId}`)
      console.log(`[SETTLEMENT] Refunding ${wager} to ${player}`)

      // TODO: Refund wager to player
      // await this.transferTokens(treasuryAccount, playerAccount, wager)

      this.emit('error_handled', {
        gameId,
        player,
        wager,
        refunded: true,
        timestamp: Date.now()
      })

    } catch (error) {
      console.error('[SETTLEMENT] Error handling failed:', error)
      throw error
    }
  }
}
