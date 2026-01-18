# Vault Wallet (Firecrawl extract)

Source: `https://docs.pearprotocol.io/api-integration/api-specification/vault-wallet`

---

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/vault-wallet\#get-vault-wallet-balances)    Get spot and perp account balances

get

https://hl-v2.pearprotocol.io/vault-wallet/balances

Retrieve balances for both spot and perp accounts

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Responses

chevron-right

200

Balances retrieved successfully

application/json

Responseobject

Show propertiesplus

chevron-right

401

Unauthorized - invalid or missing token

get

/vault-wallet/balances

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
GET /vault-wallet/balances HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Accept: */*
```

Test it

200

Balances retrieved successfully

chevron-down

Copy

```
{
  "spotBalances": {
    "USDC": "100.0",
    "ETH": "0.1",
    "SOL": "2.5"
  },
  "perpBalances": {
    "USDC": "50.0",
    "BTC": "0.01"
  },
  "totalValue": "150.0"
}
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/vault-wallet\#post-vault-wallet-spot-to-perp)    Transfer USDC from spot to perp account

post

https://hl-v2.pearprotocol.io/vault-wallet/spot-to-perp

Transfer USDC directly from spot account to perp account for trading

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Body

application/jsonchevron-down

application/json

amountstring · min: 0.01Required

Amount of USDC to transfer from spot to perp account

Example: `100.0`

assetstringOptional

Asset to transfer (default: USDC)

Default:`USDC`Example: `USDC`

Responses

chevron-right

200

Transfer completed successfully

application/json

Responseobject

Show propertiesplus

chevron-right

400

Invalid transfer amount or insufficient balance

chevron-right

401

Unauthorized - invalid or missing token

post

/vault-wallet/spot-to-perp

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
POST /vault-wallet/spot-to-perp HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Content-Type: application/json
Accept: */*
Content-Length: 33

{
  "amount": "100.0",
  "asset": "USDC"
}
```

Test it

200

Transfer completed successfully

chevron-down

Copy

```
{
  "success": true,
  "amount": "100.0",
  "asset": "USDC",
  "direction": "SPOT_TO_PERP",
  "message": "Transfer completed successfully"
}
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/vault-wallet\#post-vault-wallet-perp-to-spot)    Transfer USDC from perp to spot account

post

https://hl-v2.pearprotocol.io/vault-wallet/perp-to-spot

Transfer USDC directly from perp account to spot account

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Body

application/jsonchevron-down

application/json

amountstring · min: 0.01Required

Amount of USDC to transfer from perp to spot account

Example: `100.0`

assetstringOptional

Asset to transfer (default: USDC)

Default:`USDC`Example: `USDC`

Responses

chevron-right

200

Transfer completed successfully

application/json

Responseobject

Show propertiesplus

chevron-right

400

Invalid transfer amount or insufficient balance

chevron-right

401

Unauthorized - invalid or missing token

post

/vault-wallet/perp-to-spot

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
POST /vault-wallet/perp-to-spot HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Content-Type: application/json
Accept: */*
Content-Length: 33

{
  "amount": "100.0",
  "asset": "USDC"
}
```

