# WAR.MARKET

> Bet on narratives that move markets

A narrative markets platform built for the **Hyperliquid London Community Hackathon** (Jan 16-18, 2026).

## 🎯 What is WAR.MARKET?

WAR.MARKET lets users bet on macro narratives through leveraged pair trades. Instead of traditional trading interfaces, we use betting language and mobile-first UX to target Gen Z users with intuitive position taking on geopolitical and tech trends.

### Example Markets

**Geopolitical:**
- 🇺🇸 Trump 2024 Crypto Impact: BTC vs SPY
- 🇺🇦 Ukraine Reconstruction Boom: EWU vs LMT
- 🌍 Middle East Energy Shift: ICLN vs USO

**Tech/Industry:**
- 🤖 AI vs Crypto: NVDA vs BTC
- ⚛️ Quantum Computing Threat: IBM vs ETH
- 🌐 Decentralized Social Media: LENS vs META

## 🏆 Hackathon Track (submission focus)

### Pear Protocol Track ($3,500)
**Execute pair/basket trades via Pear Execution API**

- Non-custodial agent wallets
- EIP-712 authentication
- Leveraged narrative positions (2–3x)

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Wallet:** wagmi + viem
- **Trading:** Pear Protocol API
- **Settlement:** Hyperliquid (via Pear execution engine)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/b1rdmania/WarGames.git
cd WarGames

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

```env
NEXT_PUBLIC_PEAR_CLIENT_ID=HLHackathon1
NEXT_PUBLIC_NETWORK=mainnet
```

## 📱 User Flow

1. **Connect wallet**
2. **Authenticate** - Sign EIP-712 message with Pear
3. **Agent wallet** - Create + approve agent wallet (required for execution)
4. **Fund trading collateral** - Ensure you have sufficient USDC available for execution (spot/perp balances)
5. **Browse markets** - Pick a narrative
6. **Place bet** - BET UP / BET DOWN
7. **Track positions** - View P&L and close

## 🎨 Design Philosophy

### Betting Language (Gen Z Focus)
- ✅ "BET UP/DOWN" instead of "Long/Short"
- ✅ "PLACE BET" instead of "Execute Position"
- ✅ "BET AMOUNT" instead of "Position Size"

### Terminal Aesthetic
- Neon green (#02FF81) on dark backgrounds
- IBM Plex Mono font
- High contrast, minimal design
- Mobile-first responsive layout

## 🏗️ Architecture

```
User Wallet
    ↓
Pear Agent Wallet → HyperCore Trading
```

### Key Components

- **MarketCard**: Narrative market display with betting UI
- **BetModal**: Position entry with leverage calculation
- **PositionsPanel**: Active positions with P&L tracking

### Integrations

**src/integrations/pear/**
- auth.ts - EIP-712 authentication
- agent.ts - Agent wallet management
- positions.ts - Position execution and tracking
- markets.ts - Market configuration

## 🧪 Testing

```bash
# Run build check
npm run build

# Run development server
npm run dev
```

## 📦 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎥 Demo Video

[Link to 3-minute demo video]

## 🤝 Contributing

Built for Hyperliquid London Community Hackathon 2026.

Team:
- [@b1rdmania](https://github.com/b1rdmania)
- Claude Code (AI pair programmer)

## 📄 License

MIT

## 🔗 Links

- [Hyperliquid](https://hyperliquid.xyz)
- [Pear Protocol](https://pearprotocol.io)
- [GitHub Repo](https://github.com/b1rdmania/WarGames)

---

**Built with ⚡️ for Hyperliquid London Community Hackathon**
