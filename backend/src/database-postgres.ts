import { Pool, PoolClient } from 'pg'

export interface GameRecord {
  id: string
  player: string
  game_type: string
  wager: number
  player_choice: number
  result: number
  won: boolean
  settled: boolean
  timestamp: number
}

export interface PvPRoomRecord {
  id: string
  creator: string
  opponent: string | null
  wager: number
  game_type: string
  creator_choice: number
  opponent_choice: number
  winner: string | null
  settled: boolean
  created_at: number
  expires_at: number
}

export interface UserStats {
  player: string
  total_games: number
  total_wins: number
  total_losses: number
  total_wagered: number
  total_won: number
  total_lost: number
  biggest_win: number
  biggest_loss: number
}

export interface TreasuryStats {
  id: number
  treasury_balance: number
  total_wagered: number
  total_paid: number
  house_wins: number
  house_losses: number
  last_updated: number
}

export interface LiveFeedEvent {
  id: string
  player: string
  game_type: string
  wager: number
  won: boolean
  timestamp: number
}

export class PostgresDatabaseService {
  private pool: Pool

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    })
    this.initializeTables()
  }

  private async initializeTables() {
    const client = await this.pool.connect()
    
    try {
      // Games table
      await client.query(`
        CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          player TEXT NOT NULL,
          game_type TEXT NOT NULL,
          wager BIGINT NOT NULL,
          player_choice INTEGER NOT NULL,
          result INTEGER,
          won BOOLEAN,
          settled BOOLEAN DEFAULT FALSE,
          timestamp BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // PvP Rooms table
      await client.query(`
        CREATE TABLE IF NOT EXISTS pvp_rooms (
          id TEXT PRIMARY KEY,
          creator TEXT NOT NULL,
          opponent TEXT,
          wager BIGINT NOT NULL,
          game_type TEXT NOT NULL,
          creator_choice INTEGER DEFAULT 0,
          opponent_choice INTEGER DEFAULT 0,
          winner TEXT,
          settled BOOLEAN DEFAULT FALSE,
          created_at BIGINT NOT NULL,
          expires_at BIGINT NOT NULL,
          status TEXT DEFAULT 'waiting'
        )
      `)

      // User Stats table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_stats (
          player TEXT PRIMARY KEY,
          total_games INTEGER DEFAULT 0,
          total_wins INTEGER DEFAULT 0,
          total_losses INTEGER DEFAULT 0,
          total_wagered BIGINT DEFAULT 0,
          total_won BIGINT DEFAULT 0,
          total_lost BIGINT DEFAULT 0,
          biggest_win BIGINT DEFAULT 0,
          biggest_loss BIGINT DEFAULT 0,
          last_played BIGINT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Treasury Stats table
      await client.query(`
        CREATE TABLE IF NOT EXISTS treasury_stats (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          treasury_balance BIGINT DEFAULT 113000000,
          total_wagered BIGINT DEFAULT 0,
          total_paid BIGINT DEFAULT 0,
          house_wins INTEGER DEFAULT 0,
          house_losses INTEGER DEFAULT 0,
          last_updated BIGINT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Live Feed Events table
      await client.query(`
        CREATE TABLE IF NOT EXISTS live_feed_events (
          id TEXT PRIMARY KEY,
          player TEXT NOT NULL,
          game_type TEXT NOT NULL,
          wager BIGINT NOT NULL,
          won BOOLEAN NOT NULL,
          timestamp BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Leaderboard Cache table
      await client.query(`
        CREATE TABLE IF NOT EXISTS leaderboard_cache (
          player TEXT PRIMARY KEY,
          total_won BIGINT DEFAULT 0,
          total_games INTEGER DEFAULT 0,
          win_rate REAL DEFAULT 0,
          rank INTEGER,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_games_player ON games(player)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_games_timestamp ON games(timestamp DESC)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_pvp_rooms_status ON pvp_rooms(status)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_pvp_rooms_expires ON pvp_rooms(expires_at)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_live_feed_timestamp ON live_feed_events(timestamp DESC)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_cache(rank)')

      // Initialize treasury stats if not exists
      await client.query(`
        INSERT INTO treasury_stats (id, treasury_balance, last_updated)
        VALUES (1, 113000000, $1)
        ON CONFLICT (id) DO NOTHING
      `, [Date.now()])

      console.log('[POSTGRES] Tables initialized')
    } finally {
      client.release()
    }
  }

  // ==================== GAMES ====================

  async createGame(game: GameRecord): Promise<void> {
    await this.pool.query(`
      INSERT INTO games (id, player, game_type, wager, player_choice, settled, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [game.id, game.player, game.game_type, game.wager, game.player_choice, game.settled, game.timestamp])
  }

  async settleGame(gameId: string, result: number, won: boolean): Promise<void> {
    await this.pool.query(`
      UPDATE games SET result = $1, won = $2, settled = TRUE WHERE id = $3
    `, [result, won, gameId])
  }

  async getGame(gameId: string): Promise<GameRecord | null> {
    const result = await this.pool.query('SELECT * FROM games WHERE id = $1', [gameId])
    return result.rows[0] || null
  }

  async getRecentGames(limit: number = 20): Promise<GameRecord[]> {
    const result = await this.pool.query(`
      SELECT * FROM games WHERE settled = TRUE ORDER BY timestamp DESC LIMIT $1
    `, [limit])
    return result.rows
  }

  // ==================== PVP ROOMS ====================

  async createPvPRoom(room: PvPRoomRecord): Promise<void> {
    await this.pool.query(`
      INSERT INTO pvp_rooms (id, creator, wager, game_type, created_at, expires_at, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'waiting')
    `, [room.id, room.creator, room.wager, room.game_type, room.created_at, room.expires_at])
  }

  async joinPvPRoom(roomId: string, opponent: string): Promise<void> {
    await this.pool.query(`
      UPDATE pvp_rooms SET opponent = $1, status = 'playing' WHERE id = $2
    `, [opponent, roomId])
  }

  async settlePvPRoom(roomId: string, winner: string): Promise<void> {
    await this.pool.query(`
      UPDATE pvp_rooms SET winner = $1, settled = TRUE, status = 'finished' WHERE id = $2
    `, [winner, roomId])
  }

  async cancelPvPRoom(roomId: string): Promise<void> {
    await this.pool.query('DELETE FROM pvp_rooms WHERE id = $1', [roomId])
  }

  async getActivePvPRooms(): Promise<PvPRoomRecord[]> {
    const now = Date.now()
    // Remove expired rooms
    await this.pool.query(`DELETE FROM pvp_rooms WHERE expires_at < $1 AND status = 'waiting'`, [now])
    
    // Return active rooms
    const result = await this.pool.query(`
      SELECT * FROM pvp_rooms WHERE status IN ('waiting', 'playing') ORDER BY created_at DESC
    `)
    return result.rows
  }

  async getPvPRoom(roomId: string): Promise<PvPRoomRecord | null> {
    const result = await this.pool.query('SELECT * FROM pvp_rooms WHERE id = $1', [roomId])
    return result.rows[0] || null
  }

  // ==================== USER STATS ====================

  async updateUserStats(player: string, won: boolean, wager: number): Promise<void> {
    // Upsert user stats
    await this.pool.query(`
      INSERT INTO user_stats (player, total_games, total_wins, total_losses, total_wagered, total_won, total_lost, biggest_win, biggest_loss, last_played)
      VALUES ($1, 1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (player) DO UPDATE SET
        total_games = user_stats.total_games + 1,
        total_wins = user_stats.total_wins + $2,
        total_losses = user_stats.total_losses + $3,
        total_wagered = user_stats.total_wagered + $4,
        total_won = user_stats.total_won + $5,
        total_lost = user_stats.total_lost + $6,
        biggest_win = GREATEST(user_stats.biggest_win, $7),
        biggest_loss = GREATEST(user_stats.biggest_loss, $8),
        last_played = $9,
        updated_at = CURRENT_TIMESTAMP
    `, [
      player,
      won ? 1 : 0,
      won ? 0 : 1,
      wager,
      won ? wager * 2 : 0,
      won ? 0 : wager,
      won ? wager * 2 : 0,
      won ? 0 : wager,
      Date.now()
    ])

    // Update leaderboard cache
    const stats = await this.getUserStats(player)
    if (stats) {
      await this.updateLeaderboardCache(player, stats.total_won, stats.total_games)
    }
  }

  async getUserStats(player: string): Promise<UserStats | null> {
    const result = await this.pool.query('SELECT * FROM user_stats WHERE player = $1', [player])
    return result.rows[0] || null
  }

  // ==================== TREASURY STATS ====================

  async updateTreasuryStats(won: boolean, wager: number): Promise<void> {
    await this.pool.query(`
      UPDATE treasury_stats SET
        treasury_balance = treasury_balance + $1,
        total_wagered = total_wagered + $2,
        total_paid = total_paid + $3,
        house_wins = house_wins + $4,
        house_losses = house_losses + $5,
        last_updated = $6
      WHERE id = 1
    `, [
      won ? -(wager * 2) : wager,
      wager,
      won ? wager * 2 : 0,
      won ? 0 : 1,
      won ? 1 : 0,
      Date.now()
    ])
  }

  async getTreasuryStats(): Promise<TreasuryStats> {
    const result = await this.pool.query('SELECT * FROM treasury_stats WHERE id = 1')
    return result.rows[0]
  }

  // ==================== LIVE FEED ====================

  async addLiveFeedEvent(event: LiveFeedEvent): Promise<void> {
    await this.pool.query(`
      INSERT INTO live_feed_events (id, player, game_type, wager, won, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [event.id, event.player, event.game_type, event.wager, event.won, event.timestamp])

    // Keep only last 100 events
    await this.pool.query(`
      DELETE FROM live_feed_events WHERE id NOT IN (
        SELECT id FROM live_feed_events ORDER BY timestamp DESC LIMIT 100
      )
    `)
  }

  async getLiveFeed(limit: number = 20): Promise<LiveFeedEvent[]> {
    const result = await this.pool.query(`
      SELECT * FROM live_feed_events ORDER BY timestamp DESC LIMIT $1
    `, [limit])
    return result.rows
  }

  // ==================== LEADERBOARD ====================

  async updateLeaderboardCache(player: string, totalWon: number, totalGames: number): Promise<void> {
    const winRate = totalGames > 0 ? (totalWon / totalGames) * 100 : 0

    await this.pool.query(`
      INSERT INTO leaderboard_cache (player, total_won, total_games, win_rate)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (player) DO UPDATE SET
        total_won = $2,
        total_games = $3,
        win_rate = $4,
        updated_at = CURRENT_TIMESTAMP
    `, [player, totalWon, totalGames, winRate])

    // Update ranks
    await this.updateLeaderboardRanks()
  }

  private async updateLeaderboardRanks(): Promise<void> {
    await this.pool.query(`
      UPDATE leaderboard_cache SET rank = subquery.rank
      FROM (
        SELECT player, ROW_NUMBER() OVER (ORDER BY total_won DESC) as rank
        FROM leaderboard_cache
      ) AS subquery
      WHERE leaderboard_cache.player = subquery.player
    `)
  }

  async getLeaderboard(limit: number = 100): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT player, total_won, total_games, win_rate, rank
      FROM leaderboard_cache
      ORDER BY rank ASC
      LIMIT $1
    `, [limit])
    return result.rows
  }

  // ==================== UTILITY ====================

  async close(): Promise<void> {
    await this.pool.end()
  }

  async getStats(): Promise<any> {
    const totalGames = await this.pool.query('SELECT COUNT(*) as count FROM games')
    const totalPvPRooms = await this.pool.query('SELECT COUNT(*) as count FROM pvp_rooms')
    const totalPlayers = await this.pool.query('SELECT COUNT(*) as count FROM user_stats')
    
    return {
      totalGames: parseInt(totalGames.rows[0].count),
      totalPvPRooms: parseInt(totalPvPRooms.rows[0].count),
      totalPlayers: parseInt(totalPlayers.rows[0].count),
      treasuryStats: await this.getTreasuryStats()
    }
  }
}
