# Pear Protocol Visual Integration Opportunities

## Research Summary (Jan 17, 2026)

**Goal:** Identify visual elements we can integrate from Pear Protocol API and platform

**Sources Reviewed:**
- Pear Protocol API Specification (docs.pearprotocol.io)
- Pear Dashboard (app.pear.garden/dashboard)
- WebSocket API Documentation
- Position API endpoints

---

## ❌ What's NOT Available

### No Position-Specific Deep Links
**Finding:** Pear does not provide position-specific URLs or deep links.

**Evidence:**
- Dashboard uses tab-based routing: `?tab=overview`, `?tab=airdrop`, etc.
- No `/position/{id}` or similar routes found
- Position pages are client-side rendered without shareable URLs

**Current Workaround:** Link to general dashboard (`app.pear.garden/dashboard`)

**Recommendation:** Keep general dashboard link. If Pear adds position URLs in the future, we can update.

---

## ✅ What We CAN Integrate

### 1. Real-Time Position Updates via WebSocket ⭐ HIGH VALUE

**Endpoint:** `wss://hl-v2.pearprotocol.io/ws`

**Available Channels:**
- `positions` - Real-time position status and P&L changes
- `market-data` - Live price feeds
- `account-summary` - Portfolio balance updates
- `notifications` - Trade alerts

**Implementation:**
```typescript
// Subscribe to real-time position updates
{
  "action": "subscribe",
  "address": "0xUserAddress",
  "channels": ["positions", "market-data", "account-summary"]
}
```

**Visual Impact:**
- Live P&L updates without polling (currently polls every 10s)
- Instant position status changes
- Real-time notifications for fills, stops, take profits
- Live portfolio summary updates

**Effort:** Medium (2-3 hours)
**Demo Value:** HIGH - Shows live trading in action

---

### 2. Enhanced Position Details from API Response

**Available Fields We're NOT Showing:**

From `/positions` response:
- `marginUsed` - Actual collateral deployed
- `stopLoss` / `takeProfit` - Risk parameters
  - `type`: PERCENTAGE, DOLLAR, POSITION_VALUE
  - `value`: The threshold value
- `longAssets[].fundingPaid` - Funding rate costs
- `longAssets[].entryPrice` - Individual asset entry prices
- `shortAssets[]` - Full short leg details

**Visual Additions:**

**A. Risk Management Display:**
```tsx
<div className="risk-indicators">
  <div>
    <label>Stop Loss</label>
    <span className="text-red-400">
      {position.stopLoss?.type === 'PERCENTAGE'
        ? `-${position.stopLoss.value}%`
        : `$${position.stopLoss.value}`}
    </span>
  </div>
  <div>
    <label>Take Profit</label>
    <span className="text-pear-lime">
      {position.takeProfit?.type === 'PERCENTAGE'
        ? `+${position.takeProfit.value}%`
        : `$${position.takeProfit.value}`}
    </span>
  </div>
</div>
```

**B. Margin & Leverage Display:**
```tsx
<div className="margin-info">
  <div>Margin Used: ${position.marginUsed}</div>
  <div>Leverage: {position.longAssets[0].leverage}x</div>
  <div>Funding Paid: ${position.longAssets[0].fundingPaid}</div>
</div>
```

**Effort:** Low (30 min - 1 hour)
**Demo Value:** MEDIUM - Shows professional risk management

---

### 3. Position Ratio Visualization (Entry vs Mark)

**Available Data:**
- `entryRatio` - Ratio when position opened
- `markRatio` - Current market ratio

**Visual Addition:**
A mini chart or ratio indicator showing how the pair ratio has moved:

```tsx
<div className="ratio-movement">
  <div className="ratio-bar">
    <div className="entry-marker" style={{left: `${entryRatioPosition}%`}}>
      Entry: {position.entryRatio.toFixed(4)}
    </div>
    <div className="current-marker" style={{left: `${markRatioPosition}%`}}>
      Mark: {position.markRatio.toFixed(4)}
    </div>
  </div>
  <div className="ratio-change">
    {((position.markRatio - position.entryRatio) / position.entryRatio * 100).toFixed(2)}%
  </div>
</div>
```

**Effort:** Medium (1-2 hours)
**Demo Value:** MEDIUM - Nice visual but not essential

---

### 4. Individual Asset Breakdown

**Available Data:**
```json
{
  "longAssets": [{
    "coin": "ETH",
    "entryPrice": 3210.50,
    "size": 0.5,
    "leverage": 3,
    "fundingPaid": 0.15
  }],
  "shortAssets": [{
    "coin": "BTC",
    "entryPrice": 95420.00,
    "size": 0.02,
    "leverage": 3,
    "fundingPaid": 0.08
  }]
}
```

**Visual Addition:**
Side-by-side asset cards showing:
```tsx
<div className="asset-breakdown">
  <div className="long-leg">
    <h4>LONG: {longAsset.coin}</h4>
    <div>Size: {longAsset.size}</div>
    <div>Entry: ${longAsset.entryPrice}</div>
    <div>Leverage: {longAsset.leverage}x</div>
    <div>Funding: ${longAsset.fundingPaid}</div>
  </div>
  <div className="short-leg">
    <h4>SHORT: {shortAsset.coin}</h4>
    <div>Size: {shortAsset.size}</div>
    <div>Entry: ${shortAsset.entryPrice}</div>
    <div>Leverage: {shortAsset.leverage}x</div>
    <div>Funding: ${shortAsset.fundingPaid}</div>
  </div>
</div>
```

**Effort:** Low (1 hour)
**Demo Value:** MEDIUM - Shows transparency of pair structure

---

### 5. Live Notifications Stream

**WebSocket Channel:** `notifications`

**Visual Addition:**
Toast notifications for:
- Position opened/closed
- Stop loss triggered
- Take profit hit
- Funding rate updates
- System alerts

**Implementation:**
```tsx
// Subscribe to notifications channel
ws.send({
  action: "subscribe",
  address: userAddress,
  channels: ["notifications"]
});

// Show toast on notification
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  toast.info(notification.message, {
    icon: notification.type === 'TRADE_FILLED' ? '✅' : 'ℹ️'
  });
};
```

**Effort:** Medium (1-2 hours)
**Demo Value:** HIGH - Makes app feel alive

---

### 6. Market Data Integration

**WebSocket Channel:** `market-data`

**Potential Uses:**
- Live price feeds for BTC, ETH, SOL, etc. (replace placeholder data in AssetPriceTicker)
- Current spread for pair ratios
- 24h volume and volatility

**Implementation:**
```tsx
// Subscribe to market data
ws.send({
  action: "subscribe",
  channels: ["market-data"]
});

// Update AssetPriceTicker with live prices
```

**Effort:** Medium (1-2 hours)
**Demo Value:** HIGH - Shows real market data

---

## 🎯 Priority Recommendations for Hackathon Demo

### Must Do (Critical for Demo)
1. **WebSocket Live Position Updates** (2-3 hours)
   - Replaces polling with real-time updates
   - Shows live P&L changes
   - Makes demo feel professional

2. **Live Market Data for Asset Ticker** (1-2 hours)
   - Replace placeholder prices with real data
   - Shows we're integrated with live markets

### Should Do (Enhances Polish)
3. **Risk Parameters Display** (30 min)
   - Show stop loss / take profit
   - Add margin used info
   - Professional risk management display

4. **Notifications Toast** (1 hour)
   - Real-time alerts for position events
   - Makes app feel interactive

### Could Do (Nice to Have)
5. **Individual Asset Breakdown** (1 hour)
   - Show detailed leg info
   - Transparency for pair structure

6. **Ratio Visualization** (1-2 hours)
   - Mini chart showing ratio movement
   - Nice visual but not essential

---

## Implementation Plan

### Phase 1: WebSocket Infrastructure (2 hours)
```
1. Create WebSocketProvider context
2. Handle connection/reconnection logic
3. Subscribe to positions + market-data channels
4. Update state on messages
```

### Phase 2: Live Position Updates (1 hour)
```
1. Replace polling with WebSocket updates
2. Animate P&L changes
3. Show "LIVE" indicator
```

### Phase 3: Market Data Integration (1 hour)
```
1. Subscribe to market-data channel
2. Update AssetPriceTicker with real prices
3. Show 24h change from live data
```

### Phase 4: Notifications (1 hour)
```
1. Subscribe to notifications channel
2. Show toast on position events
3. Add sound/animation for important events
```

---

## Code Locations

**Files to Create:**
- `src/contexts/WebSocketContext.tsx` - WebSocket provider
- `src/hooks/useWebSocket.ts` - WebSocket hook
- `src/lib/pear-websocket.ts` - Connection manager

**Files to Update:**
- `src/app/markets/MarketsClient.tsx` - Use WebSocket instead of polling
- `src/components/AssetPriceTicker.tsx` - Use live market data
- `src/components/PositionCard.tsx` - Add risk parameters, asset breakdown
- `src/integrations/pear/types.ts` - Add missing position fields

---

## Conclusion

**Position Deep Links:** ❌ Not available, use dashboard link

**Visual Integrations:** ✅ Many high-value opportunities via:
- WebSocket for real-time updates (HIGHEST VALUE)
- Enhanced position data display
- Live market data
- Real-time notifications

**Recommended Focus for Demo:**
1. WebSocket live updates (game-changer)
2. Real market data (credibility)
3. Risk parameters (professionalism)
4. Notifications (engagement)

**Total Time:** ~6-8 hours for all priority items
**Demo Impact:** HIGH - Shows professional, live trading platform
