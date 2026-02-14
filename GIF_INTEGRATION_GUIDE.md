# GeoCities GIF Integration Guide

## Files with GIF Additions

### 1. Home Page - `src/components/RiskLanding.tsx`

**Import at top:**
```typescript
import { GC } from '@/app/labs/geocities-gifs';
```

**Title section (line ~31):**
```tsx
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
  <img src={GC.fire1} width={40} height={40} alt="" />
  <img src={GC.sparkle1} width={30} height={30} alt="" />
  <img src={GC.explosion} width={35} height={35} alt="" />
  <h1 className={styles.title}>WAR.MARKET</h1>
  <img src={GC.explosion} width={35} height={35} alt="" />
  <img src={GC.sparkle1} width={30} height={30} alt="" />
  <img src={GC.fire1} width={40} height={40} alt="" />
</div>
```

**Tagline section:**
```tsx
<p className={styles.tagline}>
  <img src={GC.globeSmall} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  <img src={GC.missile} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  THE GLOBAL TENSION TERMINAL
  <img src={GC.missile} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
  <img src={GC.globeSmall} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
</p>
```

**CTA buttons:**
```tsx
<Link href="/trade">
  <TerminalButton variant="primary" fullWidth>
    <img src={GC.cash} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
    START TRADING
    <img src={GC.cash} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
  </TerminalButton>
</Link>
<Link href="/markets">
  <TerminalButton fullWidth>
    <img src={GC.signal} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
    BROWSE MARKETS
    <img src={GC.signal} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
  </TerminalButton>
</Link>
```

**Powered by:**
```tsx
<div className={styles.poweredBy}>
  <img src={GC.tech} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  PEAR PROTOCOL EXECUTION · HYPERLIQUID SETTLEMENT
  <img src={GC.tech} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
</div>
```

**Explainer sections (3 panes):**
```tsx
// PICK A THESIS
<div className={styles.explainerTitle}>
  <img src={GC.danger} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  <img src={GC.explosion} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  PICK A THESIS
  <img src={GC.warning} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
</div>

// ONE SIGNATURE
<div className={styles.explainerTitle}>
  <img src={GC.tech} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  <img src={GC.computer} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  ONE SIGNATURE
  <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
</div>

// TRADE YOUR VIEW
<div className={styles.explainerTitle}>
  <img src={GC.cash} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  <img src={GC.coin} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  TRADE YOUR VIEW
  <img src={GC.stock} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
</div>
```

---

### 2. Markets Page - `src/app/markets/MarketsClient.tsx`

**Import at top:**
```typescript
import { GC } from '@/app/labs/geocities-gifs';
```

**Left pane title:**
```tsx
<TerminalPaneTitle>
  <img src={GC.danger} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  <img src={GC.globeSmall} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  MARKET DIRECTORY
  <img src={GC.oilFire} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
</TerminalPaneTitle>
```

**Center pane title:**
```tsx
<TerminalPaneTitle>
  <img src={GC.alert} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  MARKET DETAILS
  <img src={GC.alert} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
</TerminalPaneTitle>
```

**Market title:**
```tsx
<TerminalTitle>
  <img src={GC.blast} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  {selectedMarket.name}
  <img src={GC.blast} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
</TerminalTitle>
```

**Data rows (in TerminalKV):**
```tsx
<TerminalKVRow
  label={<><img src={GC.warning} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />CATEGORY</>}
  value={selectedMarket.category?.toUpperCase() || 'N/A'}
/>
<TerminalKVRow
  label={<><img src={GC.danger} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />LEVERAGE</>}
  value={`${selectedMarket.leverage}x`}
/>
<TerminalKVRow
  label={<><img src={GC.impact} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />STATUS</>}
  value={selectedMarket.isTradable ? 'ACTIVE' : 'INACTIVE'}
/>
```

**Right pane (Actions):**
```tsx
<TerminalPaneTitle>
  <img src={GC.missile} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  <img src={GC.starBurst} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  ACTIONS
  <img src={GC.alert} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
</TerminalPaneTitle>

// Buttons
<Link href={`/markets/${selectedMarket.id}`}>
  <TerminalButton fullWidth>
    <img src={GC.signal} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
    <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
    FULL INTELLIGENCE →
  </TerminalButton>
</Link>
<Link href="/trade">
  <TerminalButton variant="primary" fullWidth>
    <img src={GC.cash} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
    <img src={GC.stock} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
    GO TO TRADE
    <img src={GC.fire1} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
  </TerminalButton>
</Link>
```

---

### 3. About Page - `src/app/about/page.tsx`

**Import at top:**
```typescript
import { GC } from '@/app/labs/geocities-gifs';
```

**Left pane title:**
```tsx
<TerminalPaneTitle>
  <img src={GC.globeSmall} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  PROJECT OVERVIEW
</TerminalPaneTitle>
```

**Page title:**
```tsx
<TerminalTitle>
  <img src={GC.fire1} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  <img src={GC.sparkle1} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  <img src={GC.explosion} width={22} height={22} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
  WAR.MARKET
  <img src={GC.explosion} width={22} height={22} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
  <img src={GC.sparkle1} width={20} height={20} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
  <img src={GC.fire1} width={24} height={24} alt="" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
</TerminalTitle>
```

**Roadmap (Win hackathon line):**
```tsx
<div style={{ textDecoration: 'line-through', color: '#8da294' }}>
  <img src={GC.trophy} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
  ✓ Win hackathon
</div>
```

**Right pane (Actions):**
```tsx
<TerminalPaneTitle>
  <img src={GC.starBurst} width={16} height={16} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
  ACTIONS
</TerminalPaneTitle>

// Buttons
<Link href="/markets">
  <TerminalButton fullWidth>
    <img src={GC.explosion} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
    BROWSE MARKETS →
  </TerminalButton>
</Link>
<Link href="/trade">
  <TerminalButton variant="primary" fullWidth>
    <img src={GC.coin} width={14} height={14} alt="" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
    OPEN TRADE →
  </TerminalButton>
</Link>
```

---

## GIF Assets

All GIFs are in `/public/gifs/` (32 files, ~450KB total)

**Catalog file:** `src/app/labs/geocities-gifs.ts`

```typescript
export const GC = {
  // Fire / flames
  fire1: '/gifs/fire1.gif',
  fire2: '/gifs/fire2.gif',
  fire3: '/gifs/fire3.gif',
  fireSmall: '/gifs/fireSmall.gif',
  explosion: '/gifs/explosion.gif',

  // Stars / sparkles
  sparkle1: '/gifs/sparkle1.gif',
  sparkle2: '/gifs/sparkle2.gif',
  starBurst: '/gifs/starBurst.gif',

  // Dividers
  dividerChain: '/gifs/dividerChain.gif',
  dividerColor: '/gifs/dividerColor.gif',

  // Under construction
  constructionWorker: '/gifs/constructionWorker.gif',
  newBadge: '/gifs/newBadge.gif',

  // Globe
  globeLarge: '/gifs/globeLarge.gif',
  globeSmall: '/gifs/globeSmall.gif',

  // Money / gold
  coin: '/gifs/coin.gif',
  moneyBag: '/gifs/moneyBag.gif',

  // Awards / trophies
  coolSite: '/gifs/coolSite.gif',
  trophy: '/gifs/trophy.gif',
  goldMedal: '/gifs/goldMedal.gif',

  // Computer / tech
  computer: '/gifs/computer.gif',

  // War themes (aliases)
  blast: '/gifs/blast.gif',
  alert: '/gifs/alert.gif',
  impact: '/gifs/impact.gif',
  danger: '/gifs/danger.gif',
  warning: '/gifs/warning.gif',

  // Market-specific
  energy: '/gifs/energy.gif',
  oilFire: '/gifs/oilFire.gif',
  tech: '/gifs/tech.gif',
  stock: '/gifs/stock.gif',
  cash: '/gifs/cash.gif',
  missile: '/gifs/missile.gif',
  signal: '/gifs/signal.gif',
}
```

---

## Pattern Guide

**Typical usage:**
```tsx
import { GC } from '@/app/labs/geocities-gifs';

// Small icon (12-14px)
<img src={GC.warning} width={12} height={12} alt="" style={{ verticalAlign: 'middle', marginRight: '4px' }} />

// Medium icon (16-20px)
<img src={GC.explosion} width={18} height={18} alt="" style={{ verticalAlign: 'middle', marginRight: '8px' }} />

// Large icon (24-40px)
<img src={GC.fire1} width={40} height={40} alt="" />
```

**Flanking pattern:**
```tsx
<img src={GC.left} ... />
TEXT HERE
<img src={GC.right} ... />
```

**Multi-GIF stack (degen mode):**
```tsx
<img src={GC.big} width={24} ... />
<img src={GC.medium} width={20} ... />
<img src={GC.small} width={16} ... />
TEXT HERE
```

---

## Quick Reintegration Steps

1. Add import: `import { GC } from '@/app/labs/geocities-gifs';`
2. Wrap text/elements with `<img src={GC.gifName} width={X} height={X} alt="" style={{ verticalAlign: 'middle', marginRight/Left: 'Xpx' }} />`
3. Use inline styles for positioning (`verticalAlign`, `margin`)
4. Stack multiple GIFs for maximum degen energy

---

## Files Modified

- ✅ `src/components/RiskLanding.tsx` - home page
- ✅ `src/app/markets/MarketsClient.tsx` - markets page
- ✅ `src/app/about/page.tsx` - about page
- ✅ `src/app/labs/geocities-gifs.ts` - GIF catalog
- ✅ `/public/gifs/` - 32 GIF files

---

**Total GIF count added:** 40+ GIFs across 3 pages
**Aesthetic:** Full degen GeoCities energy 🔥💥✨
