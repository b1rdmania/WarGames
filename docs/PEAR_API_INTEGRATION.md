# Pear Protocol API Integration - REAL SPEC

**Base URL:** `https://hl-v2.pearprotocol.io`

## Authentication Flow (2-Step Process)

### Step 1: Get EIP712 Message
```
GET /auth/eip712-message?address={walletAddress}&clientId={clientId}
```

**Response:**
```json
{
  "domain": {
    "name": "Pear Protocol",
    "version": "1",
    "chainId": 999,
    "verifyingContract": "0x..."
  },
  "types": {
    "Authentication": [
      { "name": "address", "type": "address" },
      { "name": "clientId", "type": "string" },
      { "name": "timestamp", "type": "uint256" },
      { "name": "action", "type": "string" }
    ]
  },
  "primaryType": "Authentication",
  "message": {
    "address": "0x...",
    "clientId": "war-markets",
    "timestamp": 1234567890,
    "action": "login"
  }
}
```

### Step 2: Login with Signature
```
POST /auth/login
```

**Request:**
```json
{
  "method": "eip712",
  "address": "0x...",
  "clientId": "war-markets",
  "details": {
    "signature": "0x...",
    "timestamp": 1234567890
  }
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "address": "0x...",
  "clientId": "war-markets"
}
```

## Agent Wallet

### Check/Create Agent Wallet
```
GET /agentWallet
Authorization: Bearer {accessToken}
```

Returns 200 if exists, 404 if not.

```
POST /agentWallet
Authorization: Bearer {accessToken}
```

Creates agent wallet. Returns 201 with wallet address.

## Positions

### Open Position
```
POST /positions
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "slippage": 0.01,
  "executionType": "MARKET",
  "leverage": 3,
  "usdValue": 100,
  "longAssets": [
    {
      "symbol": "BTC",
      "weight": 1.0
    }
  ],
  "shortAssets": [
    {
      "symbol": "SPY",
      "weight": 1.0
    }
  ]
}
```

**Response:**
```json
{
  "orderId": "order_123",
  "fills": []
}
```

### Get Positions
```
GET /positions
Authorization: Bearer {accessToken}
```

**Response:**
```json
[
  {
    "positionId": "pos_123",
    "address": "0x...",
    "entryRatio": 1.5,
    "markRatio": 1.52,
    "positionValue": 100,
    "unrealizedPnl": 2.5,
    "unrealizedPnlPercentage": 2.5,
    "longAssets": [...],
    "shortAssets": [...],
    "createdAt": "2024-01-16T...",
    "updatedAt": "2024-01-16T..."
  }
]
```

### Close Position
```
POST /positions/{positionId}/close
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "executionType": "MARKET"
}
```

**Response:**
```json
{
  "orderId": "order_456",
  "executionTime": "2024-01-16T...",
  "chunksScheduled": 1
}
```

## Important Notes

- **Tokens expire in 900 seconds (15 minutes)**
- Use refresh token to get new access token
- Agent wallets valid for 180 days with 30-day rotations
- Must approve agent wallet on Hyperliquid after creation
- Minimum position size: $1 USD
- Maximum leverage: 100x (we use 2-3x)
- Slippage: 0.001 to 0.1 (0.01 = 1%)
