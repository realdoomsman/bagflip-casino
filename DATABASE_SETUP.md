# 🗄️ DATABASE SETUP GUIDE

## Overview

BagFlip Casino supports two database options:
- **SQLite** - For development and small deployments
- **PostgreSQL** - For production and scalability

---

## 📊 DATABASE SCHEMA

### Tables

#### 1. `games`
Stores all treasury mode game records.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (unique game ID) |
| player | TEXT | Player wallet address |
| game_type | TEXT | CoinFlip, Dice, or EvenOdd |
| wager | BIGINT | Wager amount in lamports |
| player_choice | INTEGER | Player's choice (0 or 1) |
| result | INTEGER | Game result value |
| won | BOOLEAN | Whether player won |
| settled | BOOLEAN | Whether game is settled |
| timestamp | BIGINT | Unix timestamp |
| created_at | TIMESTAMP | Database timestamp |

**Indexes:**
- `idx_games_player` on `player`
- `idx_games_timestamp` on `timestamp DESC`

#### 2. `pvp_rooms`
Stores PvP room information.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (unique room ID) |
| creator | TEXT | Creator wallet address |
| opponent | TEXT | Opponent wallet address (nullable) |
| wager | BIGINT | Wager amount |
| game_type | TEXT | Game type |
| creator_choice | INTEGER | Creator's choice |
| opponent_choice | INTEGER | Opponent's choice |
| winner | TEXT | Winner address (nullable) |
| settled | BOOLEAN | Settlement status |
| created_at | BIGINT | Creation timestamp |
| expires_at | BIGINT | Expiration timestamp |
| status | TEXT | waiting/playing/finished |

**Indexes:**
- `idx_pvp_rooms_status` on `status`
- `idx_pvp_rooms_expires` on `expires_at`

#### 3. `user_stats`
Aggregated player statistics.

| Column | Type | Description |
|--------|------|-------------|
| player | TEXT | Primary key (wallet address) |
| total_games | INTEGER | Total games played |
| total_wins | INTEGER | Total wins |
| total_losses | INTEGER | Total losses |
| total_wagered | BIGINT | Total amount wagered |
| total_won | BIGINT | Total amount won |
| total_lost | BIGINT | Total amount lost |
| biggest_win | BIGINT | Biggest single win |
| biggest_loss | BIGINT | Biggest single loss |
| last_played | BIGINT | Last game timestamp |
| updated_at | TIMESTAMP | Last update time |

#### 4. `treasury_stats`
Global treasury statistics (single row).

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (always 1) |
| treasury_balance | BIGINT | Current treasury balance |
| total_wagered | BIGINT | Total wagered all-time |
| total_paid | BIGINT | Total paid out |
| house_wins | INTEGER | House win count |
| house_losses | INTEGER | House loss count |
| last_updated | BIGINT | Last update timestamp |
| updated_at | TIMESTAMP | Database timestamp |

#### 5. `live_feed_events`
Recent game events for live feed (last 100).

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (event ID) |
| player | TEXT | Player address |
| game_type | TEXT | Game type |
| wager | BIGINT | Wager amount |
| won | BOOLEAN | Win/loss |
| timestamp | BIGINT | Event timestamp |
| created_at | TIMESTAMP | Database timestamp |

**Indexes:**
- `idx_live_feed_timestamp` on `timestamp DESC`

#### 6. `leaderboard_cache`
Cached leaderboard rankings.

| Column | Type | Description |
|--------|------|-------------|
| player | TEXT | Primary key (wallet address) |
| total_won | BIGINT | Total winnings |
| total_games | INTEGER | Games played |
| win_rate | REAL | Win percentage |
| rank | INTEGER | Leaderboard rank |
| updated_at | TIMESTAMP | Last update |

**Indexes:**
- `idx_leaderboard_rank` on `rank`

---

## 🚀 SETUP INSTRUCTIONS

### Option 1: SQLite (Development)

#### Installation
```bash
cd backend
npm install better-sqlite3 @types/better-sqlite3
```

#### Configuration
```env
# backend/.env
DB_TYPE=sqlite
DB_PATH=./casino.db
```

#### Usage
The database file will be created automatically on first run.

```bash
npm run dev
```

**Pros:**
- ✅ Zero configuration
- ✅ No external dependencies
- ✅ Perfect for development
- ✅ Fast for small datasets

**Cons:**
- ⚠️ Single file (no distributed)
- ⚠️ Limited concurrency
- ⚠️ Not ideal for production scale

---

### Option 2: PostgreSQL (Production)

#### Installation

**Local Development:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql

# Create database
createdb bagflip_casino
```

**Production (Hosted):**
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - PostgreSQL addon
- [Render](https://render.com) - Managed PostgreSQL
- [AWS RDS](https://aws.amazon.com/rds/) - Enterprise

#### Configuration
```env
# backend/.env
DB_TYPE=postgres
DATABASE_URL=postgresql://user:password@localhost:5432/bagflip_casino

# Or for hosted services:
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

#### Install Dependencies
```bash
cd backend
npm install pg @types/pg
```

#### Update Backend Code
```typescript
// backend/src/index.ts
import { PostgresDatabaseService } from './database-postgres'

// Replace DatabaseService with PostgresDatabaseService
const db = new PostgresDatabaseService()
```

**Pros:**
- ✅ Production-ready
- ✅ Excellent concurrency
- ✅ ACID compliance
- ✅ Scalable
- ✅ Backup & replication

**Cons:**
- ⚠️ Requires setup
- ⚠️ External dependency
- ⚠️ Hosting costs (production)

---

## 📝 DATABASE OPERATIONS

### Initialization
Tables are created automatically on first run:
```typescript
const db = new DatabaseService() // SQLite
// or
const db = new PostgresDatabaseService() // PostgreSQL
```

### Common Operations

#### Create Game
```typescript
db.createGame({
  id: 'game_123',
  player: 'wallet_address',
  game_type: 'CoinFlip',
  wager: 10000,
  player_choice: 1,
  result: 0,
  won: false,
  settled: false,
  timestamp: Date.now()
})
```

#### Settle Game
```typescript
db.settleGame('game_123', 1, true) // result=1, won=true
```

#### Update User Stats
```typescript
db.updateUserStats('wallet_address', true, 10000) // won=true, wager=10000
```

#### Get Leaderboard
```typescript
const leaderboard = await db.getLeaderboard(100) // Top 100
```

#### Get Live Feed
```typescript
const feed = await db.getLiveFeed(20) // Last 20 events
```

---

## 🔄 MIGRATION

### SQLite to PostgreSQL

1. **Export SQLite data:**
```bash
sqlite3 casino.db .dump > backup.sql
```

2. **Convert to PostgreSQL format:**
```bash
# Remove SQLite-specific syntax
sed 's/INTEGER PRIMARY KEY AUTOINCREMENT/SERIAL PRIMARY KEY/g' backup.sql > postgres.sql
```

3. **Import to PostgreSQL:**
```bash
psql bagflip_casino < postgres.sql
```

4. **Update environment:**
```env
DB_TYPE=postgres
DATABASE_URL=postgresql://...
```

---

## 🛠️ MAINTENANCE

### Backup (SQLite)
```bash
# Copy database file
cp casino.db casino_backup_$(date +%Y%m%d).db

# Or use SQLite backup command
sqlite3 casino.db ".backup casino_backup.db"
```

### Backup (PostgreSQL)
```bash
# Dump database
pg_dump bagflip_casino > backup_$(date +%Y%m%d).sql

# Restore
psql bagflip_casino < backup.sql
```

### Cleanup Old Data
```sql
-- Remove old settled games (keep last 30 days)
DELETE FROM games 
WHERE settled = TRUE 
AND timestamp < (EXTRACT(EPOCH FROM NOW()) - 2592000) * 1000;

-- Remove old live feed events (keep last 100)
DELETE FROM live_feed_events 
WHERE id NOT IN (
  SELECT id FROM live_feed_events 
  ORDER BY timestamp DESC LIMIT 100
);
```

### Optimize (SQLite)
```bash
sqlite3 casino.db "VACUUM;"
```

### Optimize (PostgreSQL)
```sql
VACUUM ANALYZE;
REINDEX DATABASE bagflip_casino;
```

---

## 📊 MONITORING

### Check Database Size

**SQLite:**
```bash
ls -lh casino.db
```

**PostgreSQL:**
```sql
SELECT pg_size_pretty(pg_database_size('bagflip_casino'));
```

### Check Table Sizes

**PostgreSQL:**
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

### Check Row Counts
```sql
SELECT 
  'games' as table_name, COUNT(*) as rows FROM games
UNION ALL
SELECT 'pvp_rooms', COUNT(*) FROM pvp_rooms
UNION ALL
SELECT 'user_stats', COUNT(*) FROM user_stats
UNION ALL
SELECT 'live_feed_events', COUNT(*) FROM live_feed_events;
```

---

## 🔐 SECURITY

### PostgreSQL Security

1. **Use strong passwords:**
```sql
ALTER USER bagflip_user WITH PASSWORD 'strong_random_password';
```

2. **Limit connections:**
```sql
ALTER USER bagflip_user CONNECTION LIMIT 10;
```

3. **Use SSL in production:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

4. **Restrict permissions:**
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bagflip_user;
```

### SQLite Security

1. **File permissions:**
```bash
chmod 600 casino.db
```

2. **Backup encryption:**
```bash
gpg -c casino_backup.db
```

---

## 🎯 SUMMARY

**Development:** Use SQLite for simplicity  
**Production:** Use PostgreSQL for scale  
**Both:** Fully supported with same API  

The database layer is production-ready with:
- ✅ Automatic table creation
- ✅ Indexes for performance
- ✅ Transaction support
- ✅ Data integrity
- ✅ Easy migration path

---

**Status:** Database system complete and production-ready! 🗄️
