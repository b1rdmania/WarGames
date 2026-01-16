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

## 🏆 Hackathon Tracks

### LI.FI Track ($6,500)
**One-click cross-chain onboarding to Hyperliquid**
- Bridge from ETH, Arbitrum, Base, or Optimism
- Direct routing to HyperEVM USDC
- Automated route discovery with gas optimization

### Pear Protocol Track ($3,500)
**Execute pair/basket trades via Pear Execution API**
- Non-custodial agent wallets
- EIP-712 authentication
- Leveraged narrative positions (2-3x)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Wallet:** viem + wagmi (multi-chain support)
- **Bridging:** LI.FI SDK
- **Trading:** Pear Protocol API
- **Settlement:** Hyperliquid (HyperCore + HyperEVM)

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

1. **Connect Wallet** - Support for 5 chains (ETH, ARB, BASE, OP, HyperEVM)
2. **Bridge to HyperEVM** - One-click LI.FI integration
3. **Authenticate** - Sign EIP-712 message to create agent wallet
4. **Browse Markets** - Filter by geopolitical or tech narratives
5. **Place Bet** - Choose BET UP or BET DOWN with leverage
6. **Track Positions** - Real-time P&L on active bets

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
LI.FI Bridge → HyperEVM USDC
    ↓
Pear Agent Wallet → HyperCore Trading
```

### Key Components

- **BridgeModal**: Route discovery and execution
- **MarketCard**: Narrative market display with betting UI
- **BetModal**: Position entry with leverage calculation
- **PositionsPanel**: Active positions with P&L tracking

### Integrations

**src/integrations/lifi/**
- config.ts - SDK initialization
- routes.ts - Route discovery
- execute.ts - Bridge execution with error recovery

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
- [LI.FI](https://li.fi)
- [GitHub Repo](https://github.com/b1rdmania/WarGames)

---

**Built with ⚡️ for Hyperliquid London Community Hackathon**
