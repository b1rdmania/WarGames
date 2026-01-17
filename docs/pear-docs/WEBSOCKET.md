# Websocket (Firecrawl extract)

Source: `https://docs.pearprotocol.io/api-integration/websocket`

---

Websocket connection are exposed at `wss://hl-v2.pearprotocol.io/ws.`

The following channels are available:

1. open-orders
2. trade-histories
3. positions
4. twap-details
5. notifications
6. account-summary
7. market-data

Each channel provides real-time updates for the respective data type. Clients can subscribe to one or more channels to receive live updates.

Currently we only support one address subscription per websocket connection.

### [hashtag](https://docs.pearprotocol.io/api-integration/websocket\#example-websocket-subscription)    Example Websocket Subscription

Copy

```
{
  "action": "subscribe",
  "address": "0xYourEthereumAddressHere",
  "channels": ["open-orders", "positions"]
}
```

