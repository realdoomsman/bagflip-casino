# 🎮 BagFlip Casino - Local Testing Guide

## ✅ Current Status

Your local testing environment is **LIVE** and ready for testing!

### Running Services

| Service | Status | URL | Port |
|---------|--------|-----|------|
| Solana Test Validator | ✅ Running | http://localhost:8899 | 8899 |
| Backend API | ✅ Running | http://localhost:3001 | 3001 |
| WebSocket Server | ✅ Running | ws://localhost:8080 | 8080 |
| Frontend (Next.js) | ✅ Running | http://localhost:3003 | 3003 |

### Program Details
- **Program ID**: `HmavNzKbLtzpZPoAVmtAoGUAuJ8FDyL41dTGjD8dEU2J`
- **Network**: Localhost (Test Validator)
- **Wallet Balance**: 500,000,000 SOL (test SOL)

## 🧪 Testing Checklist

### 1. Frontend Testing

Open http://localhost:3003 in your browser and test:

#### Landing Page
- [ ] Hero section displays correctly
- [ ] Game cards are visible (Coin Flip, Dice, Even/Odd)
- [ ] Stats section shows treasury info
- [ ] Live ticker displays recent games
- [ ] Animations work smoothly

#### Wallet Connection
- [ ] Click "Connect Wallet" button
- [ ] Phantom/Solflare wallet connects
- [ ] Wallet address displays correctly
- [ ] Balance shows in UI

#### Game Testing - Coin Flip
1. [ ] Navigate to Coin Flip game
2. [ ] Enter wager amount
3. [ ] Select Heads or Tails
4. [ ] Click "Play" button
5. [ ] Transaction prompts in wallet
6. [ ] Approve transaction
7. [ ] Game result displays
8. [ ] Win/loss animation plays
9. [ ] Balance updates correctly

#### Game Testing - Dice
1. [ ] Navigate to Dice game
2. [ ] Enter wager amount
3. [ ] Select High (51-100) or Low (1-50)
4. [ ] Click "Play" button
5. [ ] Transaction prompts in wallet
6. [ ] Approve transaction
7. [ ] Dice roll animation plays
8. [ ] Result shows correct number
9. [ ] Win/loss determined correctly

#### Game Testing - Even/Odd
1. [ ] Navigate to Even/Odd game
2. [ ] Enter wager amount
3. [ ] Select Even or Odd
4. [ ] Click "Play" button
5. [ ] Transaction prompts in wallet
6. [ ] Approve transaction
7. [ ] Number generation animation
8. [ ] Result displays
9. [ ] Payout calculated correctly

#### PvP Testing
1. [ ] Navigate to PvP section
2. [ ] Create a new room
3. [ ] Set wager and game type
4. [ ] Room appears in lobby
5. [ ] Open second browser/wallet
6. [ ] Join the room
7. [ ] Both players make choices
8. [ ] Game settles automatically
9. [ ] Winner receives payout

#### Leaderboard
- [ ] Leaderboard displays top players
- [ ] Stats update after games
- [ ] Rankings are correct
- [ ] Refresh updates data

#### Live Feed
- [ ] Recent games appear in feed
- [ ] Real-time updates via WebSocket
- [ ] Game details are accurate
- [ ] Feed scrolls properly

### 2. Backend API Testing

Test the API endpoints directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get leaderboard
curl http://localhost:3001/api/leaderboard

# Get live feed
curl http://localhost:3001/api/live-feed

# Get PvP rooms
curl http://localhost:3001/api/pvp/rooms

# Get treasury stats
curl http://localhost:3001/api/treasury/stats
```

Expected responses:
- [ ] All endpoints return 200 OK
- [ ] JSON responses are well-formed
- [ ] Data is accurate
- [ ] No errors in backend logs

### 3. WebSocket Testing

Open browser console on http://localhost:3003 and check:

```javascript
// WebSocket should auto-connect
// Check console for: "WebSocket connected"

// Play a game and watch for real-time updates
// Should see: "New game update" messages
```

- [ ] WebSocket connects automatically
- [ ] Real-time game updates received
- [ ] Live feed updates in real-time
- [ ] No connection errors

### 4. Database Testing

Check the SQLite database:

```bash
# View database file
ls -lh backend/casino.db

# Query games (requires sqlite3)
sqlite3 backend/casino.db "SELECT * FROM games LIMIT 5;"

# Query user stats
sqlite3 backend/casino.db "SELECT * FROM user_stats LIMIT 5;"

# Query PvP rooms
sqlite3 backend/casino.db "SELECT * FROM pvp_rooms LIMIT 5;"
```

- [ ] Database file exists
- [ ] Tables are created
- [ ] Data is being stored
- [ ] Queries return results

### 5. Smart Contract Testing

Test on-chain interactions:

```bash
# Check program is deployed
solana program show HmavNzKbLtzpZPoAVmtAoGUAuJ8FDyL41dTGjD8dEU2J

# View recent transactions
solana transaction-history $(solana address)

# Check account balance
solana balance
```

- [ ] Program is deployed
- [ ] Transactions are processing
- [ ] Accounts are created correctly
- [ ] No transaction failures

### 6. Error Handling Testing

Test error scenarios:

#### Insufficient Balance
- [ ] Try to wager more than wallet balance
- [ ] Error message displays
- [ ] Transaction doesn't proceed

#### Invalid Input
- [ ] Enter negative wager
- [ ] Enter zero wager
- [ ] Enter non-numeric values
- [ ] Proper validation messages

#### Network Issues
- [ ] Disconnect wallet mid-game
- [ ] Proper error handling
- [ ] User can recover

#### Rate Limiting
- [ ] Make rapid API requests
- [ ] Rate limit kicks in
- [ ] 429 status returned
- [ ] Proper error message

### 7. Performance Testing

Monitor performance:

- [ ] Page load time < 2 seconds
- [ ] Game transactions < 5 seconds
- [ ] Smooth animations (60fps)
- [ ] No memory leaks
- [ ] WebSocket stays connected

### 8. Mobile Responsiveness

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] All elements visible
- [ ] Touch interactions work

## 🐛 Common Issues & Solutions

### Issue: Wallet won't connect
**Solution**: 
- Make sure Phantom/Solflare is installed
- Switch wallet network to "Localhost"
- Refresh the page

### Issue: Transaction fails
**Solution**:
- Check wallet has sufficient SOL
- Verify program is deployed: `solana program show HmavNzKbLtzpZPoAVmtAoGUAuJ8FDyL41dTGjD8dEU2J`
- Check validator logs: `tail -f /tmp/solana-test-validator.log`

### Issue: Backend not responding
**Solution**:
- Check backend is running: `lsof -i:3001`
- View backend logs in terminal
- Restart: `pkill -f "ts-node src/index.ts" && cd backend && npm run dev`

### Issue: Frontend not loading
**Solution**:
- Check Next.js is running: `lsof -i:3003`
- Clear Next.js cache: `rm -rf app/.next`
- Restart: `cd app && npm run dev`

### Issue: Database errors
**Solution**:
- Delete and recreate: `rm backend/casino.db`
- Restart backend to recreate tables

## 📊 Monitoring Commands

### View Logs
```bash
# Validator logs
tail -f /tmp/solana-test-validator.log

# Backend logs (in terminal where it's running)

# Frontend logs (in terminal where it's running)
```

### Check Processes
```bash
# Check what's running on ports
lsof -i:8899  # Validator
lsof -i:3001  # Backend
lsof -i:8080  # WebSocket
lsof -i:3003  # Frontend
```

### Stop Everything
```bash
# Stop validator
pkill solana-test-validator

# Stop backend
pkill -f "ts-node src/index.ts"

# Stop frontend
pkill -f "next dev"
```

### Restart Everything
```bash
# Run the setup script again
./scripts/test-local.sh

# Then start backend and frontend manually
cd backend && npm run dev &
cd app && npm run dev &
```

## ✅ Testing Complete?

Once you've completed all tests:

1. Document any bugs found
2. Note performance issues
3. List UX improvements needed
4. Prepare for mainnet deployment

## 🚀 Next Steps

After local testing is successful:

1. **Deploy to Devnet** - Test on public Solana devnet
2. **Security Audit** - Review smart contracts
3. **Load Testing** - Test with multiple users
4. **Mainnet Deployment** - Go live!

---

**Happy Testing! 🎮**

If you find any issues, document them and we'll fix them before mainnet launch.
