# Testing Guide for $FLIP Casino

## Quick Test (5 minutes)

### 1. Start the Application

```bash
# Terminal 1: Backend
npm run dev --prefix backend

# Terminal 2: Frontend  
npm run dev --prefix app
```

### 2. Open Browser

Visit: http://localhost:3000

### 3. Test UI (No Wallet Required)

You can explore the UI without connecting a wallet:
- View the home page with stats
- See all 4 game cards
- Check the live feed section

### 4. Test with Wallet

1. **Install Phantom Wallet** (if not already installed)
   - Chrome extension: https://phantom.app/

2. **Connect Wallet**
   - Click "Select Wallet" button
   - Choose Phantom
   - Approve connection

3. **Switch to Devnet**
   - Open Phantom settings
   - Change network to "Devnet"

4. **Get Test SOL**
   ```bash
   solana airdrop 2 <YOUR_WALLET_ADDRESS>
   ```

5. **Play Games**
   - Click any game card (Coin Flip, Dice, Even/Odd)
   - Enter wager amount
   - Select your choice
   - Click PLAY
   - Watch the animation!

## API Testing

### Test Stats Endpoint
```bash
curl http://localhost:3001/api/stats
```

Expected response:
```json
{
  "treasurySize": "10.5M",
  "flipsToday": 1247,
  "biggestWin": "500K",
  "biggestLoss": "250K"
}
```

### Test VRF Request
```bash
curl -X POST http://localhost:3001/api/game/request-vrf \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "test-game-123",
    "gameType": "CoinFlip",
    "player": "TestPlayer123"
  }'
```

Expected response:
```json
{
  "success": true,
  "gameId": "test-game-123",
  "vrfResult": {
    "won": true,
    "value": 42
  }
}
```

### Test PvP Rooms
```bash
curl http://localhost:3001/api/pvp/rooms
```

Expected response:
```json
[]
```

## WebSocket Testing

### Using wscat
```bash
npm install -g wscat
wscat -c ws://localhost:8080
```

You should see:
```json
{"type":"connected"}
```

## Component Testing

### Test Each Game

1. **Coin Flip**
   - Choose Heads or Tails
   - Enter wager
   - Click PLAY
   - Watch coin flip animation
   - See result (WIN/LOSE)

2. **Dice High/Low**
   - Choose LOW (1-50) or HIGH (51-100)
   - Enter wager
   - Click PLAY
   - Watch number roll animation
   - See result with final number

3. **Even/Odd**
   - Choose EVEN or ODD
   - Enter wager
   - Click PLAY
   - Watch number animation
   - See result with parity

4. **PvP Lobby**
   - Click "PvP LOBBY" card
   - See empty lobby (no active rooms)
   - "CREATE ROOM" button visible

### Test Mode Switching

Each game has 3 modes:
- Treasury (default, active)
- PvP (clickable)
- Bot (clickable)

Click each to see the UI update.

## Performance Testing

### Load Test Backend
```bash
# Install Apache Bench
brew install httpd  # macOS

# Test stats endpoint
ab -n 1000 -c 10 http://localhost:3001/api/stats
```

### Check Memory Usage
```bash
# Backend
ps aux | grep "ts-node"

# Frontend
ps aux | grep "next"
```

## Browser Testing

Test in multiple browsers:
- ✅ Chrome/Brave (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Mobile Testing

1. Get your local IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Update Next.js to allow external connections:
   ```bash
   npm run dev --prefix app -- -H 0.0.0.0
   ```

3. Visit from mobile: `http://<YOUR_IP>:3000`

## Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -i :3001
lsof -i :8080

# Kill process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Clear Next.js cache
rm -rf app/.next
```

### Wallet won't connect
- Make sure you're on Devnet
- Refresh the page
- Try disconnecting and reconnecting
- Check browser console for errors

### Games not working
- Check browser console for errors
- Verify backend is running
- Check network tab for API calls
- Make sure you entered a wager amount

## Automated Testing (Future)

To add automated tests:

```bash
# Frontend tests
cd app
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm test

# Backend tests
cd backend
npm install --save-dev jest @types/jest ts-jest
npm test

# E2E tests
npm install --save-dev playwright
npx playwright test
```

## Demo Video Recording

To record a demo:

1. Open http://localhost:3000
2. Use screen recording software
3. Show:
   - Home page with stats
   - Wallet connection
   - Playing each game
   - Animations
   - Win/lose results
   - PvP lobby
   - Live feed

## Success Criteria

✅ Backend starts without errors  
✅ Frontend starts without errors  
✅ All API endpoints respond  
✅ WebSocket connects  
✅ Wallet connects successfully  
✅ All 3 games load  
✅ Animations play smoothly  
✅ Results display correctly  
✅ No console errors  
✅ Responsive on mobile  

---

**Happy Testing! 🎰**
