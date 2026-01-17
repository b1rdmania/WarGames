# Pear tradable markets (from screenshots)

**Source:** user-provided screenshots of the “tradable markets” list in Pear UI (Jan 2026)  
**Purpose:** seed a market-universe reference so we can later design narrative indices/baskets using only confirmed tradables.

## Notes / limitations

- Some tickers are **visually truncated** with an ellipsis in the UI (e.g. `FART…`, `COPP…`). Those are listed as-is and marked **Needs exact ticker**.
- Some pills show small tag badges like `XYZ`, `FLX`, `KM`, `VNTL`. The screenshots don’t define them; I recorded them where clearly visible as **Tag**.
  - Per your note, these likely correlate with **synthetic markets (HIP-3-backed models)** vs “regular” crypto markets, but **the exact semantics of each tag are not documented in the screenshots**, so they’re treated as labels.
- “What it’s actually trading” here means **the underlying instrument the ticker represents** (coin/token, equity, ETF, index, FX, commodity).
- “Market family” is a practical classification for later index design:
  - **Crypto** = crypto assets/tokens
  - **Synthetic equity (HIP-3?)** = stock-like tickers
  - **Synthetic FX (HIP-3?)** = fiat currency tickers
  - **Synthetic commodity (HIP-3?)** = commodity tickers (e.g., gold/oil)
  - **Synthetic index (HIP-3?)** = index-like tickers (e.g., US500)
  - If uncertain, marked **Unknown/needs confirmation**.

## Ticker catalog

| Ticker (as shown) | Underlying / what it is | Market family | Tag (if shown) | Notes |
|---|---|---|---|---|
| AAPL | Apple Inc. | Synthetic equity (HIP-3?) | XYZ |  |
| AAVE | Aave | Crypto |  |  |
| ACE | ACE (token) | Crypto |  |  |
| ADA | Cardano | Crypto |  |  |
| ALGO | Algorand | Crypto |  |  |
| ALT | ALT (token) | Crypto |  |  |
| AMD | Advanced Micro Devices | Synthetic equity (HIP-3?) | XYZ |  |
| AMZN | Amazon.com, Inc. | Synthetic equity (HIP-3?) | XYZ |  |
| ANIME | ANIME (token) | Crypto |  |  |
| ANTH… | Truncated ticker | Unknown | VNTL | Needs exact ticker (UI truncation) |
| APE | ApeCoin | Crypto |  |  |
| APEX | ApeX (token) | Crypto |  |  |
| APT | Aptos | Crypto |  |  |
| AR | Arweave | Crypto |  |  |
| ARB | Arbitrum | Crypto |  |  |
| ARK | ARK (ticker shown) | Synthetic equity (HIP-3?) |  | Could be an ETF or equity; confirm exact instrument |
| ASTER | ASTER (token) | Crypto |  |  |
| ATOM | Cosmos | Crypto |  |  |
| AVAX | Avalanche | Crypto |  |  |
| AVNT | AVNT (token) | Crypto |  |  |
| BABA | Alibaba Group | Synthetic equity (HIP-3?) | KM |  |
| BABY | BABY (token) | Crypto |  |  |
| BANANA… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| BERA | Berachain | Crypto |  |  |
| BIGT… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| BLAST | BLAST (token) | Crypto |  |  |
| BLUR | Blur | Crypto |  |  |
| BIO | BIO (token) | Crypto |  |  |
| BNB | BNB | Crypto |  |  |
| BOME | BOOK OF MEME (BOME) | Crypto |  |  |
| BRETT | Brett (Base) | Crypto |  |  |
| BSV | Bitcoin SV | Crypto |  |  |
| BTC | Bitcoin | Crypto |  |  |
| CAKE | PancakeSwap | Crypto |  |  |
| CC | CC (token) | Crypto |  |  |
| CELO | Celo | Crypto |  |  |
| CFX | Conflux | Crypto |  |  |
| CHIL… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| CL | CL (ticker shown) | Synthetic commodity (HIP-3?) | XYZ | Likely crude oil related; confirm exact instrument |
| COIN | Coinbase | Synthetic equity (HIP-3?) | FLX / XYZ | Appears multiple times with different tags |
| COMP | Compound | Crypto |  |  |
| COPP… | Truncated ticker | Unknown | XYZ | Needs exact ticker (UI truncation) |
| CRCL | CRCL (ticker shown) | Synthetic equity (HIP-3?) | FLX / XYZ | Confirm company/instrument name |
| CRV | Curve | Crypto |  |  |
| DOT | Polkadot | Crypto |  |  |
| DOOD | DOOD (token) | Crypto |  |  |
| DYDX | dYdX | Crypto |  |  |
| DYM | Dymension | Crypto |  |  |
| EIGEN | EigenLayer | Crypto |  |  |
| ENA | Ethena | Crypto |  |  |
| ENS | Ethereum Name Service | Crypto |  |  |
| ETC | Ethereum Classic | Crypto |  |  |
| ETHFI | Ether.Fi | Crypto |  |  |
| EUR | Euro (EUR) | Synthetic FX (HIP-3?) | XYZ |  |
| FART… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| FET | Fetch.ai (FET) | Crypto |  |  |
| FIL | Filecoin | Crypto |  |  |
| FOGO | FOGO (token) | Crypto |  |  |
| FTT | FTX Token | Crypto |  |  |
| GAS | GAS (token) | Crypto |  |  |
| GALA | Gala | Crypto |  |  |
| GOAT | GOAT (token) | Crypto |  |  |
| GOLD | Gold | Synthetic commodity (HIP-3?) | FLX / XYZ |  |
| GOOGL | Alphabet Inc. (Class A) | Synthetic equity (HIP-3?) | XYZ |  |
| GRASS | GRASS (token) | Crypto |  |  |
| GRIF… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| GMT | STEPN (GMT) | Crypto |  |  |
| GMX | GMX | Crypto |  |  |
| HBAR | Hedera | Crypto |  |  |
| HEMI | HEMI (token) | Crypto |  |  |
| HMSTR | HMSTR (token) | Crypto |  |  |
| HOOD | Robinhood Markets | Synthetic equity (HIP-3?) | XYZ |  |
| HYPER | HYPER (token) | Crypto |  |  |
| ICP | Internet Computer | Crypto |  |  |
| IMX | Immutable | Crypto |  |  |
| INFO… | Truncated ticker | Unknown | VNTL | Needs exact ticker (UI truncation) |
| INIT | INIT (token) | Crypto |  |  |
| INJ | Injective | Crypto |  |  |
| INTC | Intel | Synthetic equity (HIP-3?) | XYZ |  |
| IO | IO (token) | Crypto |  |  |
| IOTA | IOTA | Crypto |  |  |
| IP | IP (token) | Crypto |  |  |
| JTO | Jito | Crypto |  |  |
| JPY | Japanese Yen (JPY) | Synthetic FX (HIP-3?) | XYZ |  |
| JUP | Jupiter | Crypto |  |  |
| KAITO | KAITO (token) | Crypto |  |  |
| KAS | Kaspa | Crypto |  |  |
| kBONK | BONK (k-prefixed) | Crypto |  | “k” prefix: confirm exact meaning on Pear |
| kFLO… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| kNEI… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| kKPEPE / kPEPE | PEPE (k-prefixed) | Crypto |  | “k” prefix: confirm exact meaning on Pear |
| kLUNC | Terra Luna Classic (k-prefixed) | Crypto |  | “k” prefix: confirm exact meaning on Pear |
| kSHIB | SHIB (k-prefixed) | Crypto |  | “k” prefix: confirm exact meaning on Pear |
| LAYER | LAYER (token) | Crypto |  |  |
| LDO | Lido DAO | Crypto |  |  |
| LINEA | LINEA (token) | Crypto |  |  |
| LINK | Chainlink | Crypto |  |  |
| LIT | LIT (token) | Crypto |  | Could also be an ETF ticker in TradFi; confirm instrument |
| LTC | Litecoin | Crypto |  |  |
| MAV | MAV (token) | Crypto |  |  |
| MAVIA | Heroes of Mavia (MAVIA) | Crypto |  |  |
| ME | ME (token) | Crypto |  | Appears multiple times (also as plain `ME`) |
| MEGA | MEGA (token) | Crypto |  |  |
| MELA… | Truncated ticker | Unknown | VNTL | Needs exact ticker (UI truncation) |
| MEME | Memecoin (MEME) | Crypto |  |  |
| MERL | Merlin Chain (MERL) | Crypto |  |  |
| META | Meta Platforms | Synthetic equity (HIP-3?) | XYZ |  |
| MET | MET (token) | Crypto |  |  |
| MINA | Mina | Crypto |  |  |
| MNT | Mantle | Crypto |  |  |
| MOOD… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| MON | MON (token) | Crypto |  |  |
| MORP… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| MOVE | MOVE (token) | Crypto |  |  |
| MSFT | Microsoft | Synthetic equity (HIP-3?) | XYZ |  |
| MSTR | MicroStrategy | Synthetic equity (HIP-3?) | XYZ |  |
| MU | Micron Technology | Synthetic equity (HIP-3?) | XYZ |  |
| NEO | Neo | Crypto |  |  |
| NEAR | NEAR Protocol | Crypto |  |  |
| NFLX | Netflix | Synthetic equity (HIP-3?) | XYZ |  |
| NIL | NIL (token) | Crypto |  |  |
| NOT | Notcoin | Crypto |  |  |
| NVDA | NVIDIA | Synthetic equity (HIP-3?) | XYZ |  |
| NXPC | NXPC (token) | Crypto |  |  |
| OG | OG Fan Token | Crypto |  |  |
| OIL | Oil | Synthetic commodity (HIP-3?) | FLX |  |
| OM | Mantra (OM) | Crypto |  |  |
| ONDO | Ondo Finance | Crypto |  |  |
| OP | Optimism | Crypto |  |  |
| OPEN… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| ORCL | Oracle | Synthetic equity (HIP-3?) | XYZ |  |
| ORDI | ORDI | Crypto |  |  |
| PAXG | Pax Gold | Crypto |  |  |
| PEOP… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| PEND… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| PENGU | PENGU (token) | Crypto |  |  |
| PLTR | Palantir | Synthetic equity (HIP-3?) | XYZ |  |
| PNUT | PNUT (token) | Crypto |  |  |
| POL | POL (token) | Crypto |  |  |
| POLYX | Polymesh | Crypto |  |  |
| POPC… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| PROVE | PROVE (token) | Crypto |  |  |
| PURR | PURR (token) | Crypto |  |  |
| PUMP | PUMP (token) | Crypto |  |  |
| PYTH | Pyth Network | Crypto |  |  |
| REND… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| RESO… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| REZ | Renzo (REZ) | Crypto |  |  |
| RIVN | Rivian | Synthetic equity (HIP-3?) | XYZ |  |
| ROBOT | ROBOT (token) | Crypto | VNTL |  |
| RSR | Reserve Rights | Crypto |  |  |
| RUNE | THORChain | Crypto |  |  |
| S | S (ticker shown) | Unknown |  | Confirm exact instrument |
| SAGA | Saga | Crypto |  |  |
| SAND | The Sandbox | Crypto |  |  |
| SCR | SCR (token) | Crypto |  |  |
| SEI | Sei | Crypto |  |  |
| SEMIS | Semiconductor basket/index (implied) | Synthetic index (HIP-3?) | VNTL | Confirm exact instrument definition |
| SILV… | Truncated ticker | Unknown | FLX / XYZ | Needs exact ticker (UI truncation) |
| SKY | Sky (token) | Crypto |  |  |
| SMALL… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| SNDK | SanDisk (ticker shown) | Synthetic equity (HIP-3?) | XYZ | Note: SanDisk may trade under a different modern ticker; confirm |
| SNX | Synthetix | Crypto |  |  |
| SOL | Solana | Crypto |  |  |
| SOPH | SOPH (token) | Crypto |  |  |
| SPAC… | Truncated ticker | Unknown | VNTL | Needs exact ticker (UI truncation) |
| SPX | S&P 500 (SPX) | Synthetic index (HIP-3?) |  |  |
| STABL… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| STBL | STBL (token) | Crypto |  |  |
| STX | Stacks | Crypto |  |  |
| STRK | Starknet | Crypto |  |  |
| SUI | Sui | Crypto |  |  |
| SUPER | SuperVerse (SUPER) | Crypto |  |  |
| SUSHI | SushiSwap | Crypto |  |  |
| TAO | Bittensor | Crypto |  |  |
| TIA | Celestia | Crypto |  |  |
| TON | Toncoin | Crypto |  |  |
| TNSR | Tensor | Crypto |  |  |
| TRB | Tellor | Crypto |  |  |
| TRUMP | TRUMP (token) | Crypto |  |  |
| TRX | TRON | Crypto |  |  |
| TSLA | Tesla | Synthetic equity (HIP-3?) | FLX / KM / XYZ | Appears multiple times with different tags |
| TST | TST (token) | Crypto |  |  |
| TURBO | Turbo | Crypto |  |  |
| UNI | Uniswap | Crypto |  |  |
| US500 | S&P 500 (US500) | Synthetic index (HIP-3?) | KM |  |
| USTC | TerraClassicUSD | Crypto |  |  |
| USTE… | Truncated ticker | Unknown | KM | Needs exact ticker (UI truncation) |
| USUAL | USUAL (token) | Crypto |  |  |
| VINE | VINE (token) | Crypto |  |  |
| VIRT… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| VVV | VVV (token) | Crypto |  |  |
| W | W (token) | Crypto |  |  |
| WCT | WCT (token) | Crypto |  |  |
| WIF | dogwifhat (WIF) | Crypto |  |  |
| WLFI | WLFI (token) | Crypto |  |  |
| WLD | Worldcoin | Crypto |  |  |
| XAI | Xai | Crypto |  |  |
| XLM | Stellar | Crypto |  |  |
| XMR | Monero | Crypto |  |  |
| XRP | XRP | Crypto |  |  |
| XPL | XPL (token) | Crypto |  |  |
| YGG | Yield Guild Games | Crypto |  |  |
| YZY | YZY (ticker shown) | Unknown |  | Confirm exact instrument |
| ZEC | Zcash | Crypto |  |  |
| ZEN | Horizen | Crypto |  |  |
| ZERE… | Truncated ticker | Unknown |  | Needs exact ticker (UI truncation) |
| ZETA | ZetaChain | Crypto |  |  |
| ZK | ZK (token) | Crypto |  |  |
| ZORA | Zora | Crypto |  |  |
| ZRO | LayerZero | Crypto |  |  |
| 2Z | 2Z (ticker shown) | Unknown |  | Confirm exact instrument |
| XYZ1… | Truncated ticker | Unknown | XYZ | Needs exact ticker (UI truncation) |

## Next step (to make this “authoritative”)

To remove truncation/ambiguity and confirm what each symbol maps to, we should export directly from Pear:

- Preferably via API discovery endpoints (e.g. `/markets` and `/markets/active`) described in the Pear API spec: [`https://docs.pearprotocol.io/api-integration/api-specification/markets`](https://docs.pearprotocol.io/api-integration/api-specification/markets)

Once we have the full list (untruncated), we can replace the “Needs exact ticker” entries and add a clean taxonomy that’s useful for market/indices design.
