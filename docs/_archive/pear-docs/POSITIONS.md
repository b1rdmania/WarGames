# Positions (Firecrawl extract)

Source: `https://docs.pearprotocol.io/api-integration/api-specification/positions`

---

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/positions\#get-positions)    List processed open positions

get

https://hl-v2.pearprotocol.io/positions

Returns processed open positions for the authenticated user

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Responses

chevron-right

200

Processed open positions fetched successfully

application/json

Responseobject\[\]

Show propertiesplus

get

/positions

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
GET /positions HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Accept: */*
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/positions\#post-positions)    Create a new pair trading position with order

post

https://hl-v2.pearprotocol.io/positions

Create a pair trading position with various execution types: MARKET (immediate execution), TRIGGER (conditional execution), TWAP (time-weighted average), or LADDER (multiple ratio levels)

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Body

application/jsonchevron-down

application/json

slippagenumber · min: 0.001 · max: 0.1Required

Slippage tolerance percentage (0.01 = 1%)

Example: `0.01`

executionTypestring · enumRequired

Order execution type

Possible values:`SYNC``MARKET``TRIGGER``TWAP``LADDER``TP``SL``SPOT_MARKET``SPOT_LIMIT``SPOT_TWAP`

leveragenumber · min: 1 · max: 100Required

Applied leverage

Example: `10`

usdValuenumber · min: 1Required

Position size in USD

Example: `1000`

longAssetsobject\[\]Optional

Long assets configuration - array of assets to go long on. Can be empty for short-only positions.

Example: `[{\"asset\":\"BTC\",\"weight\":0.6},{\"asset\":\"ETH\",\"weight\":0.4}]`

shortAssetsobject\[\]Optional

Short assets configuration - array of assets to go short on. Can be empty for long-only positions.

Example: `[{\"asset\":\"SOL\",\"weight\":0.7},{\"asset\":\"AVAX\",\"weight\":0.3}]`

Responses

chevron-right

201

Position order created successfully

application/json

post

/positions

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
POST /positions HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Content-Type: application/json
Accept: */*

{
  "slippage": 0.01,
  "executionType": "SYNC",
  "leverage": 10,
  "usdValue": 1000,
  "longAssets": [
    { "asset": "BTC", "weight": 0.6 },
    { "asset": "ETH", "weight": 0.4 }
  ],
  "shortAssets": [
    { "asset": "SOL", "weight": 0.7 },
    { "asset": "AVAX", "weight": 0.3 }
  ]
}
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/positions\#post-positions-positionid-close)    Close an entire position

post

https://hl-v2.pearprotocol.io/positions/{positionId}/close

Close a position using MARKET (immediate execution) or TWAP (time-weighted average) execution type

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

