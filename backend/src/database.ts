import { Database } from 'better-sqlite3'
import sqlite3 from 'better-sqlite3'

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

export class DatabaseService {
  private db: Database

  constructor(dbPath: string = './casino.db') {
    this.db = sqlite3(dbPath)
    this.initializeTables()
  }

  private initializeTables() {
    // Games table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        player TEXT NOT NULL,
        game_type TEXT NOT NULL,
        wager INTEGER NOT NULL,
        player_choice INTEGER NOT NULL,
        result INTEGER,
        won BOOLEAN,
        settled BOOLEAN DEFAULT 0,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // PvP Rooms table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pvp_rooms (
        id TEXT PRIMARY KEY,
        creator TEXT NOT NULL,
        opponent TEXT,
        wager INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        creator_choice INTEGER DEFAULT 0,
        opponent_choice INTEGER DEFAULT 0,
        winner TEXT,
        settled BOOLEAN DEFAULT 0,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        status TEXT DEFAULT 'waiting'
      )
    `)

    // User Stats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_stats (
        player TEXT PRIMARY KEY,
        total_games INTEGER DEFAULT 0,
        total_wins INTEGER DEFAULT 0,
        total_losses INTEGER DEFAULT 0,
        total_wagered INTEGER DEFAULT 0,
        total_won INTEGER DEFAULT 0,
        total_lost INTEGER DEFAULT 0,
        biggest_win INTEGER DEFAULT 0,
        biggest_loss INTEGER DEFAULT 0,
        last_played INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Treasury Stats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS treasury_stats (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        treasury_balance INTEGER DEFAULT 113000000,
        total_wagered INTEGER DEFAULT 0,
        total_paid INTEGER DEFAULT 0,
        house_wins INTEGER DEFAULT 0,
        house_losses INTEGER DEFAULT 0,
        last_updated INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Live Feed Events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS live_feed_events (
        id TEXT PRIMARY KEY,
        player TEXT NOT NULL,
        game_type TEXT NOT NULL,
        wager INTEGER NOT NULL,
        won BOOLEAN NOT NULL,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Leaderboard Cache table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS leaderboard_cache (
        player TEXT PRIMARY KEY,
        total_won INTEGER DEFAULT 0,
        total_games INTEGER DEFAULT 0,
        win_rate REAL DEFAULT 0,
        rank INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_games_player ON games(player);
      CREATE INDEX IF NOT EXISTS idx_games_timestamp ON games(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_pvp_rooms_status ON pvp_rooms(status);
      CREATE INDEX IF NOT EXISTS idx_pvp_rooms_expires ON pvp_rooms(expires_at);
      CREATE INDEX IF NOT EXISTS idx_live_feed_timestamp ON live_feed_events(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_cache(rank);
    `)

    // Initialize treasury stats if not exists
    const treasuryExists = this.db.prepare('SELECT id FROM treasury_stats WHERE id = 1').get()
    if (!treasuryExists) {
      this.db.prepare(`
        INSERT INTO treasury_stats (id, treasury_balance, last_updated)
        VALUES (1, 113000000, ?)
      `).run(Date.now())
    }

    console.log('[DATABASE] Tables initialized')
  }

  // ==================== GAMES ====================

  createGame(game: GameRecord): void {
    this.db.prepare(`
      INSERT INTO games (id, player, game_type, wager, player_choice, settled, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(game.id, game.player, game.game_type, game.wager, game.player_choice, game.settled ? 1 : 0, game.timestamp)
  }

  settleGame(gameId: string, result: number, won: boolean): void {
    this.db.prepare(`
      UPDATE games SET result = ?, won = ?, settled = 1 WHERE id = ?
    `).run(result, won ? 1 : 0, gameId)
  }

  getGame(gameId: string): GameRecord | undefined {
    return this.db.prepare('SELECT * FROM games WHERE id = ?').get(gameId) as GameRecord | undefined
  }

  getRecentGames(limit: number = 20): GameRecord[] {
    return this.db.prepare(`
      SELECT * FROM games WHERE settled = 1 ORDER BY timestamp DESC LIMIT ?
    `).all(limit) as GameRecord[]
  }

  // ==================== PVP ROOMS ====================

  createPvPRoom(room: PvPRoomRecord): void {
    this.db.prepare(`
      INSERT INTO pvp_rooms (id, creator, wager, game_type, created_at, expires_at, status)
      VALUES (?, ?, ?, ?, ?, ?, 'waiting')
    `).run(room.id, room.creator, room.wager, room.game_type, room.created_at, room.expires_at)
  }

  joinPvPRoom(roomId: string, opponent: string): void {
    this.db.prepare(`
      UPDATE pvp_rooms SET opponent = ?, status = 'playing' WHERE id = ?
    `).run(opponent, roomId)
  }

  settlePvPRoom(roomId: string, winner: string): void {
    this.db.prepare(`
      UPDATE pvp_rooms SET winner = ?, settled = 1, status = 'finished' WHERE id = ?
    `).run(winner, roomId)
  }

  cancelPvPRoom(roomId: string): void {
    this.db.prepare(`
      DELETE FROM pvp_rooms WHERE id = ?
    `).run(roomId)
  }

  getActivePvPRooms(): PvPRoomRecord[] {
    const now = Date.now()
    // Remove expired rooms
    this.db.prepare('DELETE FROM pvp_rooms WHERE expires_at < ? AND status = "waiting"').run(now)
    
    // Return active rooms
    return this.db.prepare(`
      SELECT * FROM pvp_rooms WHERE status IN ('waiting', 'playing') ORDER BY created_at DESC
    `).all() as PvPRoomRecord[]
  }

  getPvPRoom(roomId: string): PvPRoomRecord | undefined {
    return this.db.prepare('SELECT * FROM pvp_rooms WHERE id = ?').get(roomId) as PvPRoomRecord | undefined
  }

  // ==================== USER STATS ====================

  updateUserStats(player: string, won: boolean, wager: number): void {
    // Get or create user stats
    let stats = this.db.prepare('SELECT * FROM user_stats WHERE player = ?').get(player) as UserStats | undefined
    
    if (!stats) {
      this.db.prepare(`
        INSERT INTO user_stats (player, total_games, total_wins, total_losses, total_wagered, total_won, total_lost, biggest_win, biggest_loss, last_played)
        VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, ?)
      `).run(player, Date.now())
      stats = this.db.prepare('SELECT * FROM user_stats WHERE player = ?').get(player) as UserStats
    }

    // Update stats
    const totalGames = stats.total_games + 1
    const totalWins = won ? stats.total_wins + 1 : stats.total_wins
    const totalLosses = won ? stats.total_losses : stats.total_losses + 1
    const totalWagered = stats.total_wagered + wager
    const totalWon = won ? stats.total_won + (wager * 2) : stats.total_won
    const totalLost = won ? stats.total_lost : stats.total_lost + wager
    const biggestWin = won && (wager * 2) > stats.biggest_win ? wager * 2 : stats.biggest_win
    const biggestLoss = !won && wager > stats.biggest_loss ? wager : stats.biggest_loss

    this.db.prepare(`
      UPDATE user_stats SET
        total_games = ?,
        total_wins = ?,
        total_losses = ?,
        total_wagered = ?,
        total_won = ?,
        total_lost = ?,
        biggest_win = ?,
        biggest_loss = ?,
        last_played = ?
      WHERE player = ?
    `).run(totalGames, totalWins, totalLosses, totalWagered, totalWon, totalLost, biggestWin, biggestLoss, Date.now(), player)

    // Update leaderboard cache
    this.updateLeaderboardCache(player, totalWon, totalGames)
  }

  getUserStats(player: string): UserStats | undefined {
    return this.db.prepare('SELECT * FROM user_stats WHERE player = ?').get(player) as UserStats | undefined
  }

  // ==================== TREASURY STATS ====================

  updateTreasuryStats(won: boolean, wager: number): void {
    const stats = this.db.prepare('SELECT * FROM treasury_stats WHERE id = 1').get() as TreasuryStats

    const treasuryBalance = won ? stats.treasury_balance - (wager * 2) : stats.treasury_balance + wager
    const totalWagered = stats.total_wagered + wager
    const totalPaid = won ? stats.total_paid + (wager * 2) : stats.total_paid
    const houseWins = won ? stats.house_wins : stats.house_wins + 1
    const houseLosses = won ? stats.house_losses + 1 : stats.house_losses

    this.db.prepare(`
      UPDATE treasury_stats SET
        treasury_balance = ?,
        total_wagered = ?,
        total_paid = ?,
        house_wins = ?,
        house_losses = ?,
        last_updated = ?
      WHERE id = 1
    `).run(treasuryBalance, totalWagered, totalPaid, houseWins, houseLosses, Date.now())
  }

  getTreasuryStats(): TreasuryStats {
    return this.db.prepare('SELECT * FROM treasury_stats WHERE id = 1').get() as TreasuryStats
  }

  // ==================== LIVE FEED ====================

  addLiveFeedEvent(event: LiveFeedEvent): void {
    this.db.prepare(`
      INSERT INTO live_feed_events (id, player, game_type, wager, won, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(event.id, event.player, event.game_type, event.wager, event.won ? 1 : 0, event.timestamp)

    // Keep only last 100 events
    this.db.prepare(`
      DELETE FROM live_feed_events WHERE id NOT IN (
        SELECT id FROM live_feed_events ORDER BY timestamp DESC LIMIT 100
      )
    `).run()
  }

  getLiveFeed(limit: number = 20): LiveFeedEvent[] {
    return this.db.prepare(`
      SELECT * FROM live_feed_events ORDER BY timestamp DESC LIMIT ?
    `).all(limit) as LiveFeedEvent[]
  }

  // ==================== LEADERBOARD ====================

  updateLeaderboardCache(player: string, totalWon: number, totalGames: number): void {
    const winRate = totalGames > 0 ? (totalWon / totalGames) * 100 : 0

    this.db.prepare(`
      INSERT INTO leaderboard_cache (player, total_won, total_games, win_rate)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(player) DO UPDATE SET
        total_won = excluded.total_won,
        total_games = excluded.total_games,
        win_rate = excluded.win_rate,
        updated_at = CURRENT_TIMESTAMP
    `).run(player, totalWon, totalGames, winRate)

    // Update ranks
    this.updateLeaderboardRanks()
  }

  private updateLeaderboardRanks(): void {
    this.db.exec(`
      UPDATE leaderboard_cache SET rank = (
        SELECT COUNT(*) + 1 FROM leaderboard_cache AS l2
        WHERE l2.total_won > leaderboard_cache.total_won
      )
    `)
  }

  getLeaderboard(limit: number = 100): any[] {
    return this.db.prepare(`
      SELECT player, total_won, total_games, win_rate, rank
      FROM leaderboard_cache
      ORDER BY rank ASC
      LIMIT ?
    `).all(limit)
  }

  // ==================== UTILITY ====================

  close(): void {
    this.db.close()
  }

  // Get database stats
  getStats(): any {
    const totalGames = this.db.prepare('SELECT COUNT(*) as count FROM games').get() as { count: number }
    const totalPvPRooms = this.db.prepare('SELECT COUNT(*) as count FROM pvp_rooms').get() as { count: number }
    const totalPlayers = this.db.prepare('SELECT COUNT(*) as count FROM user_stats').get() as { count: number }
    
    return {
      totalGames: totalGames.count,
      totalPvPRooms: totalPvPRooms.count,
      totalPlayers: totalPlayers.count,
      treasuryStats: this.getTreasuryStats()
    }
  }

  // Get daily statistics
  getDailyStats(): any {
    const today = Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours

    // Biggest win today
    const biggestWin = this.db.prepare(`
      SELECT player, wager * 2 as amount, game_type
      FROM games
      WHERE won = 1 AND timestamp > ? AND settled = 1
      ORDER BY wager DESC
      LIMIT 1
    `).get(today) as any

    // Biggest loss today
    const biggestLoss = this.db.prepare(`
      SELECT player, wager as amount, game_type
      FROM games
      WHERE won = 0 AND timestamp > ? AND settled = 1
      ORDER BY wager DESC
      LIMIT 1
    `).get(today) as any

    // Highest wager today
    const highestWager = this.db.prepare(`
      SELECT player, wager as amount, game_type
      FROM games
      WHERE timestamp > ? AND settled = 1
      ORDER BY wager DESC
      LIMIT 1
    `).get(today) as any

    // Calculate win streaks (simplified - just count consecutive wins)
    const players = this.db.prepare(`
      SELECT DISTINCT player FROM games WHERE timestamp > ? AND settled = 1
    `).all(today) as any[]

    let highestStreak = { player: '', streak: 0 }
    
    for (const p of players) {
      const games = this.db.prepare(`
        SELECT won FROM games 
        WHERE player = ? AND timestamp > ? AND settled = 1
        ORDER BY timestamp DESC
      `).all(p.player, today) as any[]

      let currentStreak = 0
      for (const game of games) {
        if (game.won) {
          currentStreak++
        } else {
          break
        }
      }

      if (currentStreak > highestStreak.streak) {
        highestStreak = { player: p.player, streak: currentStreak }
      }
    }

    // House profit/loss today
    const treasuryChange = this.db.prepare(`
      SELECT 
        SUM(CASE WHEN won = 1 THEN -(wager * 2) ELSE wager END) as profit
      FROM games
      WHERE timestamp > ? AND settled = 1
    `).get(today) as any

    return {
      biggest_win_today: biggestWin ? {
        player: biggestWin.player,
        amount: biggestWin.amount,
        game: biggestWin.game_type
      } : null,
      biggest_loss_today: biggestLoss ? {
        player: biggestLoss.player,
        amount: biggestLoss.amount,
        game: biggestLoss.game_type
      } : null,
      highest_win_streak: highestStreak.streak > 0 ? highestStreak : null,
      highest_wager: highestWager ? {
        player: highestWager.player,
        amount: highestWager.amount,
        game: highestWager.game_type
      } : null,
      house_profit_loss: treasuryChange?.profit || 0
    }
  }
}
