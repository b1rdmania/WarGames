# Agent Wallet (Firecrawl extract)

Source: `https://docs.pearprotocol.io/api-integration/api-specification/agent-wallet`

---

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/agent-wallet\#get-agentwallet)    Get agent wallet status

get

https://hl-v2.pearprotocol.io/agentWallet

Check if an agent wallet exists for the authenticated user and retrieve its status. Agent wallets are used to execute trades on Hyperliquid Exchange on behalf of users and are valid for 180 days with automatic 30-day rotations.

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Responses

chevron-right

200

Agent wallet found

application/json

Responseobject

Show propertiesplus

chevron-right

404

Agent wallet not found

get

/agentWallet

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
GET /agentWallet HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Accept: */*
```

Test it

200

Agent wallet found

chevron-down

Copy

```
{
  "agentWalletAddress": "0xabcdef1234567890abcdef1234567890abcdef12"
}
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/agent-wallet\#post-agentwallet)    Create a new agent wallet

post

https://hl-v2.pearprotocol.io/agentWallet

Create a new agent wallet for the authenticated user. The wallet private key is securely stored and encrypted within Pear Protocol. After creation, the user must approve the wallet through Hyperliquid's agent wallet approval process.

Authorizations

bearerchevron-down

bearer

AuthorizationstringRequired

Bearer authentication header of the form Bearer <token>.

Responses

chevron-right

201

Agent wallet created successfully

application/json

post

/agentWallet

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
POST /agentWallet HTTP/1.1
Host: hl-v2.pearprotocol.io
Authorization: Bearer YOUR_SECRET_TOKEN
Accept: */*
```

Test it

201

Agent wallet created successfully

Copy

```
{
  "agentWalletAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "message": "Please approve this agent wallet on Hyperliquid Exchange to enable trading"
}
```

