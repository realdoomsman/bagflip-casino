import express from 'express'
import { WebSocketServer } from 'ws'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import dotenv from 'dotenv'
import { VRFService } from './vrf'
import { SettlementEngine } from './settlement'
import { DatabaseService } from './database'
import { PayoutService } from './payout'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security: Request size limit
app.use(express.json({ limit: '10kb' }))

// Security: CORS with specific origin in production
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']
  const origin = req.headers.origin
  
  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*')
  }
  
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  next()
})

// Security: Rate limiting per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    
    let record = rateLimitMap.get(ip)
    
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs }
      rateLimitMap.set(ip, record)
    }
    
    record.count++
    
    if (record.count > maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      })
    }
    
    next()
  }
}

// Security: Input sanitization
const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.trim().slice(0, 1000) // Max 1000 chars
  }
  if (typeof input === 'number') {
    return isFinite(input) ? input : 0
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key])
      }
    }
    return sanitized
  }
  return input
}

const vrfService = new VRFService(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  process.env.TREASURY_AUTHORITY_KEYPAIR || '',
  process.env.PROGRAM_ID || ''
)

const settlementEngine = new SettlementEngine(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
)

// Initialize payout service
const payoutService = new PayoutService(
  process.env.SOLANA_RPC_URL || 'http://localhost:8899'
)
console.log('[PAYOUT] Service initialized')
console.log('[PAYOUT] Treasury address:', payoutService.getTreasuryAddress())

// Initialize database
const db = new DatabaseService(process.env.DB_PATH || './casino.db')
console.log('[DATABASE] Connected')

// Setup settlement event listeners
settlementEngine.on('treasury_settled', (data: any) => {
  console.log('[EVENT] Treasury game settled:', data)
  stats.treasurySize = settlementEngine.getTreasuryBalance()
  
  // Update database
  db.settleGame(data.gameId, data.result, data.won)
  db.updateUserStats(data.player, data.won, data.wager)
  db.updateTreasuryStats(data.won, data.wager)
  db.addLiveFeedEvent({
    id: data.gameId,
    player: data.player,
    game_type: data.gameType,
    wager: data.wager,
    won: data.won,
    timestamp: data.timestamp
  })
})

settlementEngine.on('pvp_settled', (data: any) => {
  console.log('[EVENT] PvP game settled:', data)
  
  // Update database
  db.settlePvPRoom(data.roomId, data.winner)
  
  // Update stats for both players
  const creatorWon = data.winner === data.creator
  db.updateUserStats(data.creator, creatorWon, data.wager)
  db.updateUserStats(data.opponent, !creatorWon, data.wager)
  
  db.addLiveFeedEvent({
    id: data.roomId,
    player: data.winner,
    game_type: `PvP ${data.gameType}`,
    wager: data.wager,
    won: true,
    timestamp: data.timestamp
  })
})

settlementEngine.on('live_feed', (data: any) => {
  broadcast({
    type: 'game_result',
    event: data
  })
})

// WebSocket will be attached to HTTP server after it starts
let wss: WebSocketServer

// Broadcast to all clients
function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data))
    }
  })
}

// Stats tracking
const stats = {
  treasurySize: 113000000,
  flipsToday: 1247,
  biggestWin: 500000,
  biggestLoss: 250000,
  totalGames: 2500,
  houseWins: 1247,
  houseLosses: 1253,
}

// Security: Prevent replay attacks - track processed game IDs
const processedGames = new Set<string>()
const GAME_ID_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isGameProcessed = (gameId: string): boolean => {
  return processedGames.has(gameId)
}

const markGameProcessed = (gameId: string): void => {
  processedGames.add(gameId)
  
  // Auto-cleanup after expiry
  setTimeout(() => {
    processedGames.delete(gameId)
  }, GAME_ID_EXPIRY)
}

// API Routes
app.get('/api/stats', async (req, res) => {
  const treasuryStats = db.getTreasuryStats()
  const dbStats = db.getStats()
  
  // Get real treasury balance from blockchain
  const realTreasuryBalance = await payoutService.getTreasuryBalance()
  
  res.json({
    treasurySize: `${realTreasuryBalance.toFixed(2)} SOL`,
    flipsToday: dbStats.totalGames,
    biggestWin: dbStats.totalGames > 0 ? `${(stats.biggestWin / 1e9).toFixed(2)} SOL` : '0 SOL',
    biggestLoss: dbStats.totalGames > 0 ? `${(stats.biggestLoss / 1e9).toFixed(2)} SOL` : '0 SOL',
    totalGames: dbStats.totalGames,
    houseWins: treasuryStats.house_wins,
    houseLosses: treasuryStats.house_losses,
    houseWinRate: treasuryStats.house_wins + treasuryStats.house_losses > 0 
      ? ((treasuryStats.house_wins / (treasuryStats.house_wins + treasuryStats.house_losses)) * 100).toFixed(1)
      : '0.0',
  })
})

app.get('/api/live-feed', async (req, res) => {
  const liveFeed = db.getLiveFeed(20)
  res.json(liveFeed)
})

app.get('/api/leaderboard', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 100
  const leaderboard = db.getLeaderboard(limit)
  res.json(leaderboard)
})

app.get('/api/user/:address', async (req, res) => {
  const { address } = req.params
  const userStats = db.getUserStats(address)
  
  if (!userStats) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  res.json(userStats)
})

app.get('/api/daily-stats', async (req, res) => {
  try {
    const dailyStats = db.getDailyStats()
    res.json(dailyStats)
  } catch (error) {
    console.error('[DAILY STATS] Error:', error)
    res.status(500).json({ error: 'Failed to fetch daily stats' })
  }
})

// In-memory storage for demo (use database in production)
const pvpRooms = new Map<string, any>()

app.get('/api/pvp/rooms', async (req, res) => {
  // Get active rooms from database (auto-removes expired)
  const rooms = db.getActivePvPRooms()
  
  // Also sync with in-memory map for backward compatibility
  pvpRooms.clear()
  rooms.forEach(room => {
    // Derive status from room state
    const status = room.settled ? 'completed' : 
                   room.opponent ? 'active' : 'waiting'
    
    pvpRooms.set(room.id, {
      id: room.id,
      creator: room.creator,
      opponent: room.opponent,
      wager: room.wager,
      gameType: room.game_type,
      createdAt: room.created_at,
      expiresAt: room.expires_at,
      status: status as any
    })
  })
  
  res.json(Array.from(pvpRooms.values()))
})

app.post('/api/pvp/create', rateLimit(5, 60000), async (req, res) => {
  const sanitized = sanitizeInput(req.body)
  const { creator, wager, gameType } = sanitized
  
  // Validate inputs
  if (!creator || !wager || !gameType) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  // Validate wager
  const MIN_WAGER = 1000
  const MAX_WAGER = 1_000_000_000_000
  
  if (typeof wager !== 'number' || wager < MIN_WAGER || wager > MAX_WAGER) {
    return res.status(400).json({ error: 'Invalid wager amount' })
  }
  
  // Validate creator address
  try {
    new PublicKey(creator)
  } catch {
    return res.status(400).json({ error: 'Invalid creator address' })
  }
  
  const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const createdAt = Date.now()
  const expiresAt = createdAt + (5 * 60 * 1000) // 5 minutes
  
  const room = {
    id: roomId,
    creator,
    wager,
    gameType,
    createdAt,
    expiresAt,
    status: 'waiting' as const,
  }
  
  // Save to database
  db.createPvPRoom({
    id: roomId,
    creator,
    opponent: null,
    wager,
    game_type: gameType,
    creator_choice: 0,
    opponent_choice: 0,
    winner: null,
    settled: false,
    created_at: createdAt,
    expires_at: expiresAt
  })
  
  pvpRooms.set(roomId, room)
  
  // Broadcast new room to all clients
  broadcast({
    type: 'room_created',
    room,
  })
  
  res.json({ success: true, roomId })
})

app.post('/api/pvp/join', rateLimit(10, 60000), async (req, res) => {
  const sanitized = sanitizeInput(req.body)
  const { roomId, opponent } = sanitized
  
  // Validate inputs
  if (!roomId || !opponent) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  // Validate opponent address
  try {
    new PublicKey(opponent)
  } catch {
    return res.status(400).json({ error: 'Invalid opponent address' })
  }
  
  const room = pvpRooms.get(roomId)
  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }
  
  if (room.status !== 'waiting') {
    return res.status(400).json({ error: 'Room not available' })
  }
  
  // Update room status
  room.opponent = opponent
  room.status = 'playing'
  pvpRooms.set(roomId, room)
  
  // Request VRF for the game
  const vrfResult = await vrfService.requestRandomness(
    new PublicKey('11111111111111111111111111111111'),
    room.gameType
  )
  
  // Determine winner (simplified)
  const resultByte = vrfResult[0]
  let creatorWon = false
  
  if (room.gameType === 'CoinFlip') {
    creatorWon = (resultByte % 2) === 1
  } else if (room.gameType === 'Dice') {
    const roll = (resultByte % 100) + 1
    creatorWon = roll > 50
  } else if (room.gameType === 'EvenOdd') {
    const number = (resultByte % 100) + 1
    creatorWon = (number % 2) === 0
  }
  
  const winner = creatorWon ? room.creator : opponent
  
  // Settle PvP game
  await settlementEngine.settlePvPGame({
    roomId,
    creator: room.creator,
    opponent,
    wager: room.wager,
    winner,
    gameType: room.gameType
  })
  
  // Broadcast result
  broadcast({
    type: 'pvp_result',
    roomId,
    winner,
    result: resultByte,
    wager: room.wager,
    gameType: room.gameType
  })
  
  // Remove room
  pvpRooms.delete(roomId)
  
  res.json({ 
    success: true, 
    winner,
    won: winner === opponent,
    wager: room.wager,
    gameType: room.gameType,
  })
})

app.delete('/api/pvp/cancel/:roomId', async (req, res) => {
  const { roomId } = req.params
  
  const room = pvpRooms.get(roomId)
  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }
  
  // Delete from database
  db.cancelPvPRoom(roomId)
  
  pvpRooms.delete(roomId)
  
  broadcast({
    type: 'room_cancelled',
    roomId,
  })
  
  res.json({ success: true })
})

app.post('/api/game/request-vrf', rateLimit(10, 60000), async (req, res) => {
  // Sanitize inputs
  const sanitized = sanitizeInput(req.body)
  const { gameId, gameType, player, wager = 1000 } = sanitized
  
  // Validate inputs
  if (!gameId || !gameType || !player) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  // Validate game type
  const validGameTypes = ['CoinFlip', 'DiceHighLow', 'EvenOdd']
  if (!validGameTypes.includes(gameType)) {
    return res.status(400).json({ error: 'Invalid game type' })
  }
  
  // Validate wager
  const MIN_WAGER = 1000
  const MAX_WAGER = 1_000_000_000_000
  
  if (typeof wager !== 'number' || wager < MIN_WAGER || wager > MAX_WAGER) {
    return res.status(400).json({ error: 'Invalid wager amount' })
  }
  
  // Validate player address
  try {
    new PublicKey(player)
  } catch {
    return res.status(400).json({ error: 'Invalid player address' })
  }
  
  try {
    // Security: Prevent replay attacks
    if (isGameProcessed(gameId)) {
      return res.status(400).json({ error: 'Game already processed' })
    }
    
    markGameProcessed(gameId)
    
    // For demo mode, use a placeholder pubkey
    const DEFAULT_PUBKEY = '11111111111111111111111111111111'
    let gamePubkey: PublicKey
    
    try {
      gamePubkey = new PublicKey(gameId)
    } catch {
      gamePubkey = new PublicKey(DEFAULT_PUBKEY)
    }
    
    // Request VRF
    const vrfResult = await vrfService.requestRandomness(gamePubkey, gameType)
    
    // Calculate result
    const resultByte = vrfResult[0]
    let won = false
    let resultValue = 0
    
    if (gameType === 'CoinFlip') {
      won = (resultByte % 2) === 1
      resultValue = won ? 1 : 0
    } else if (gameType === 'DiceHighLow') {
      resultValue = (resultByte % 100) + 1
      won = resultValue > 50
    } else if (gameType === 'EvenOdd') {
      resultValue = (resultByte % 100) + 1
      won = (resultValue % 2) === 0
    }
    
    // Update stats
    stats.totalGames++
    stats.flipsToday++
    if (won) {
      stats.houseLosses++
      stats.treasurySize -= wager
      if (wager > stats.biggestWin) stats.biggestWin = wager
    } else {
      stats.houseWins++
      stats.treasurySize += wager
      if (wager > stats.biggestLoss) stats.biggestLoss = wager
    }
    
    // Settle game with VRF result (async)
    setTimeout(async () => {
      try {
        await vrfService.settleGame(gamePubkey, vrfResult)
        
        // Use settlement engine
        await settlementEngine.settleTreasuryGame({
          gameId,
          player,
          gameType,
          wager,
          won,
          result: resultValue
        })
        
        // Send payout if player won
        if (won) {
          const payoutAmount = (wager / 1e9) * 2 // Convert lamports to SOL and double for win
          console.log(`[GAME] Player won! Sending payout of ${payoutAmount} SOL`)
          const payoutSignature = await payoutService.sendPayout(player, payoutAmount)
          
          if (payoutSignature) {
            console.log(`[GAME] Payout sent: ${payoutSignature}`)
          } else {
            console.error(`[GAME] Failed to send payout to ${player}`)
          }
        }
        
        // Broadcast result to WebSocket clients
        broadcast({
          type: 'treasury_game_result',
          event: {
            id: gameId,
            player,
            game: gameType,
            wager,
            won,
            result: resultValue,
            timestamp: Date.now()
          }
        })
      } catch (error) {
        console.error('Error settling game:', error)
        // Handle error and refund
        await settlementEngine.handleError(gameId, player, wager)
      }
    }, 1500)
    
    res.json({ 
      success: true, 
      gameId,
      vrfResult: {
        won,
        value: resultValue
      }
    })
  } catch (error) {
    console.error('Error requesting VRF:', error)
    res.status(500).json({ error: 'Failed to request VRF' })
  }
})

const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
  console.log(`WebSocket running on same port ${PORT}`)
})

// Attach WebSocket to the same HTTP server
wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Client connected')
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString())
  })
  
  ws.send(JSON.stringify({ type: 'connected' }))
})
