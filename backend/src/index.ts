import express from 'express'
import { WebSocketServer } from 'ws'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { VRFService } from './vrf'
import { SettlementEngine } from './settlement'
import { DatabaseService } from './database'
import { PayoutService } from './payout'

dotenv.config()

// Simple password hashing
const hashPassword = (password: string): string => {
  const salt = process.env.PASSWORD_SALT || 'bagflip_salt'
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

const generateDepositAddress = (): string => {
  const keypair = Keypair.generate()
  return keypair.publicKey.toBase58()
}

const app = express()
const PORT = process.env.PORT || 3001

// Security: Request size limit
app.use(express.json({ limit: '10kb' }))

// Security: CORS with specific origin in production
const allowedDomains = [
  'http://localhost:3000',
  'https://bagflip.xyz',
  'https://www.bagflip.xyz',
  'https://bagflip-casino-production.up.railway.app'
]

app.use((req, res, next) => {
  const origin = req.headers.origin
  
  // Check if the origin matches ANY allowed domain
  if (origin && allowedDomains.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else if (origin) {
    // Log unknown origins for debugging
    console.log('[CORS] Blocked origin:', origin)
  }
  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
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

// Auth middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const user = db.getUserBySessionToken(token)
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  
  (req as any).user = user
  next()
}

// ==================== AUTH ROUTES ====================

// Register with username/password
app.post('/api/auth/register', rateLimit(5, 60000), async (req, res) => {
  const { username, email, password } = sanitizeInput(req.body)
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' })
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  
  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const depositAddress = generateDepositAddress()
  
  const user = db.createUserAccount({
    id: userId,
    username,
    email: email || undefined,
    passwordHash: hashPassword(password),
    depositAddress
  })
  
  if (!user) {
    return res.status(400).json({ error: 'Username or email already taken' })
  }
  
  const token = generateToken()
  db.updateSessionToken(userId, token)
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      balance: user.balance,
      depositAddress: user.deposit_address
    }
  })
})

// Login with username/password
app.post('/api/auth/login', rateLimit(10, 60000), async (req, res) => {
  const { username, password } = sanitizeInput(req.body)
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }
  
  const user = db.getUserByUsername(username)
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const token = generateToken()
  db.updateSessionToken(user.id, token)
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      balance: user.balance,
      depositAddress: user.deposit_address
    }
  })
})

// Logout
app.post('/api/auth/logout', authMiddleware, async (req, res) => {
  const user = (req as any).user
  db.clearSessionToken(user.id)
  res.json({ success: true })
})

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = (req as any).user
  res.json({
    id: user.id,
    username: user.username,
    balance: user.balance,
    depositAddress: user.deposit_address,
    walletAddress: user.wallet_address,
    totalDeposited: user.total_deposited,
    totalWithdrawn: user.total_withdrawn
  })
})

// ==================== BALANCE ROUTES ====================

// Get deposit address
app.get('/api/balance/deposit-address', authMiddleware, async (req, res) => {
  const user = (req as any).user
  res.json({ depositAddress: user.deposit_address })
})

// Request withdrawal
app.post('/api/balance/withdraw', authMiddleware, rateLimit(3, 60000), async (req, res) => {
  const user = (req as any).user
  const { amount, destinationAddress } = sanitizeInput(req.body)
  
  if (!amount || !destinationAddress) {
    return res.status(400).json({ error: 'Amount and destination address required' })
  }
  
  if (amount < 1000) {
    return res.status(400).json({ error: 'Minimum withdrawal is 1000 $BAG' })
  }
  
  if (amount > user.balance) {
    return res.status(400).json({ error: 'Insufficient balance' })
  }
  
  // Validate destination address
  try {
    new PublicKey(destinationAddress)
  } catch {
    return res.status(400).json({ error: 'Invalid destination address' })
  }
  
  const withdrawalId = `wd_${Date.now()}_${Math.random().toString(36).slice(2)}`
  
  const success = db.createWithdrawal({
    id: withdrawalId,
    userId: user.id,
    amount,
    destinationAddress
  })
  
  if (!success) {
    return res.status(400).json({ error: 'Withdrawal failed' })
  }
  
  // Process withdrawal async (in production, use a queue)
  processWithdrawal(withdrawalId)
  
  res.json({ success: true, withdrawalId })
})

// Get transaction history
app.get('/api/balance/history', authMiddleware, async (req, res) => {
  const user = (req as any).user
  const deposits = db.getUserDeposits(user.id)
  const withdrawals = db.getUserWithdrawals(user.id)
  
  res.json({ deposits, withdrawals })
})

// Process withdrawal (called async)
async function processWithdrawal(withdrawalId: string) {
  const withdrawals = db.getPendingWithdrawals()
  const withdrawal = withdrawals.find(w => w.id === withdrawalId)
  
  if (!withdrawal) return
  
  try {
    // Convert to SOL (assuming $BAG is 1:1 with lamports for now)
    const amountSol = withdrawal.amount / 1e9
    const txSignature = await payoutService.sendPayout(withdrawal.destination_address, amountSol)
    
    if (txSignature) {
      db.confirmWithdrawal(withdrawalId, txSignature)
      console.log(`[WITHDRAWAL] Completed: ${withdrawalId} - ${txSignature}`)
    } else {
      db.failWithdrawal(withdrawalId)
      console.error(`[WITHDRAWAL] Failed: ${withdrawalId}`)
    }
  } catch (error) {
    console.error(`[WITHDRAWAL] Error: ${withdrawalId}`, error)
    db.failWithdrawal(withdrawalId)
  }
}

// ==================== GAME ROUTES (Updated for account balance) ====================

// Play game with account balance
app.post('/api/game/play', authMiddleware, rateLimit(30, 60000), async (req, res) => {
  const user = (req as any).user
  const { gameType, wager, choice } = sanitizeInput(req.body)
  
  // Validate inputs
  if (!gameType || !wager) {
    return res.status(400).json({ error: 'Game type and wager required' })
  }
  
  const validGameTypes = ['CoinFlip', 'DiceHighLow', 'EvenOdd']
  if (!validGameTypes.includes(gameType)) {
    return res.status(400).json({ error: 'Invalid game type' })
  }
  
  const MIN_WAGER = 100
  const MAX_WAGER = 10_000_000
  
  if (wager < MIN_WAGER || wager > MAX_WAGER) {
    return res.status(400).json({ error: `Wager must be between ${MIN_WAGER} and ${MAX_WAGER}` })
  }
  
  if (wager > user.balance) {
    return res.status(400).json({ error: 'Insufficient balance' })
  }
  
  // Deduct wager from balance
  db.updateUserBalance(user.id, -wager)
  
  const gameId = `game_${Date.now()}_${Math.random().toString(36).slice(2)}`
  
  try {
    // Generate random result
    const vrfResult = await vrfService.requestRandomness(
      new PublicKey('11111111111111111111111111111111'),
      gameType
    )
    
    const resultByte = vrfResult[0]
    let won = false
    let resultValue = 0
    
    if (gameType === 'CoinFlip') {
      resultValue = resultByte % 2
      won = (choice === 'heads' && resultValue === 1) || (choice === 'tails' && resultValue === 0)
    } else if (gameType === 'DiceHighLow') {
      resultValue = (resultByte % 100) + 1
      won = (choice === 'high' && resultValue > 50) || (choice === 'low' && resultValue <= 50)
    } else if (gameType === 'EvenOdd') {
      resultValue = (resultByte % 100) + 1
      won = (choice === 'even' && resultValue % 2 === 0) || (choice === 'odd' && resultValue % 2 === 1)
    }
    
    // Update balance based on result
    if (won) {
      db.updateUserBalance(user.id, wager * 2) // Return wager + winnings
    }
    
    // Update stats
    db.updateUserStats(user.id, won, wager)
    db.updateTreasuryStats(won, wager)
    
    // Add to live feed
    db.addLiveFeedEvent({
      id: gameId,
      player: user.username,
      game_type: gameType,
      wager,
      won,
      timestamp: Date.now()
    })
    
    // Broadcast to websocket
    broadcast({
      type: 'game_result',
      event: {
        id: gameId,
        player: user.username,
        game: gameType,
        wager,
        won,
        result: resultValue,
        timestamp: Date.now()
      }
    })
    
    // Get updated balance
    const updatedUser = db.getUserById(user.id)
    
    res.json({
      success: true,
      gameId,
      won,
      result: resultValue,
      payout: won ? wager * 2 : 0,
      newBalance: updatedUser?.balance || 0
    })
  } catch (error) {
    // Refund on error
    db.updateUserBalance(user.id, wager)
    console.error('Game error:', error)
    res.status(500).json({ error: 'Game failed, wager refunded' })
  }
})

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
  const MIN_WAGER = 100
  const MAX_WAGER = 10_000_000
  
  if (typeof wager !== 'number' || wager < MIN_WAGER || wager > MAX_WAGER) {
    return res.status(400).json({ error: 'Invalid wager amount' })
  }
  
  // Creator can be either a username or a wallet address - just validate it's a non-empty string
  if (typeof creator !== 'string' || creator.length < 1) {
    return res.status(400).json({ error: 'Invalid creator' })
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
  
  // Opponent can be either a username or a wallet address - just validate it's a non-empty string
  if (typeof opponent !== 'string' || opponent.length < 1) {
    return res.status(400).json({ error: 'Invalid opponent' })
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
