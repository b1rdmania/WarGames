# GeoCities Theme Toggle Implementation

## Overview

Implemented a full GeoCities 1998 aesthetic theme toggle for WAR.MARKET as a fun UX experiment. Users can switch between terminal mode and GeoCities mode via a toggle button in the header.

## Implementation Date

2026-02-11 (work lost in rebase conflict with NORAD design system, needs reimplementation)

## Approach

**Hybrid: `data-theme="geocities"` CSS overrides + conditional JSX for GeoCities-specific elements**

- CSS Modules + Tailwind + CSS custom properties
- Since Tailwind colors compile to static hex at build time, used `[data-theme="geocities"]` CSS selectors to override them
- For elements that can't be done with CSS alone (animated GIFs, `<marquee>`, cursor trails), added conditional rendering via a `useTheme()` hook

## Files Created

### Core Infrastructure
- **`src/contexts/ThemeContext.tsx`** - Theme context with `theme`, `toggleTheme()`, `isGeoCities`. Persists to localStorage (`wm_theme`), syncs `data-theme` attribute on `<html>`
- **`src/lib/geocitiesGifs.ts`** - Centralized GIF URL catalog from gifcities.org (Internet Archive). All URLs as named constants: `fire1`, `sparkle1`, `coin`, `trophy`, `computer`, `monitor`, etc.
- **`src/app/geocities.css`** - ~200 lines of CSS overrides all scoped under `[data-theme="geocities"]`. Overrides body (Comic Sans, green text, tiled bg), Tailwind classes, global utilities (`.tm-btn` → 90s beveled, `.tm-box` → green border), typography, scrollbar, links, blink animation
- **`src/components/GeoCitiesEffects.tsx`** - Client component rendering `null`. Attaches cursor trail (red/yellow dots) and right-click protection alert when GeoCities theme active
- **`src/types/marquee.d.ts`** - TypeScript declaration for deprecated `<marquee>` element via React module augmentation

### Static Prototypes (kept separate)
- **`geocities-test/index.html`** - Static GeoCities landing page prototype
- **`geocities-test/taiwan-strait-crisis.html`** - Static GeoCities market detail prototype

## Files Modified

### App Structure
- **`src/app/layout.tsx`** - Added `ThemeProvider` wrapping provider stack, imported `geocities.css`, added `<GeoCitiesEffects />`

### Pages
- **`src/app/markets/MarketsClient.tsx`** - Globe GIFs + Comic Sans "~\*~ MARKETS ~\*~" header, degen browse copy
- **`src/app/trade/TradeClient.tsx`** - Computer GIFs on wallet connect, money bag GIFs on TRADE header, degen copy
- **`src/app/portfolio/PortfolioClient.tsx`** - Gold bar GIFs on PORTFOLIO header, computer GIFs on wallet connect, sparkles on ACTIVE POSITIONS label
- **`src/app/about/page.tsx`** - Extracted to `AboutContent.tsx` client component with full GeoCities variant (colored bordered sections, GIF-decorated roadmap)
- **`src/app/about/AboutContent.tsx`** (new) - Client component with full GeoCities About page

### Components
- **`src/components/RiskShell.tsx`** - Theme toggle button, fire GIF borders (top/bottom), marquee alert ticker, footer extras (under construction, hit counter, awards, badges, webring)
- **`src/components/RiskLanding.tsx`** - Full `GeoCitiesLanding` component with fire borders, spinning globe, Comic Sans welcome, marquee, CTA button, powered-by section, awards, guestbook, webring
- **`src/components/TerminalTopNav.tsx`** - Star GIF sparkles between nav links
- **`src/components/MarketFeed.tsx`** - GIF header ("PICK YOUR BATTLE!!"), NEW badges next to market names
- **`src/components/MarketFeedReadOnly.tsx`** - GIF header ("OUR MARKETS!!"), NEW badges
- **`src/components/MarketDetail.tsx` (via MarketDetailClient)** - TOP SECRET banner, fire GIFs flanking title
- **`src/components/BetSlip.tsx`** - Coin GIFs on SEND IT button
- **`src/components/BetSlipPanel.tsx`** - Coin GIFs on SEND IT button
- **`src/components/PortfolioSummary.tsx`** - Trophy/explosion GIFs on PORTFOLIO header
- **`src/components/PositionCard.tsx`** - Coin/fire GIFs on POSITION header
- **`src/components/PearSetupCard.tsx`** - Monitor/computer GIFs on status labels, tech gear on auth button
- **`src/components/AssetPriceTicker.tsx`** - Sparkle GIF for LIVE indicator, monitor GIF, "~LIVE~" text
- **`src/components/HeaderWalletWidget.tsx`** - Coin GIF on connected state, computer GIF on connect button
- **`src/components/MusicControls.tsx`** - "~TUNES~" label + CSS module overrides
- **`src/components/PortfolioLine.tsx`** - Dollar GIF next to balance

### CSS Modules (appended `:global([data-theme="geocities"])` blocks)
- **`src/components/RiskShell.module.css`** - Hide scan line/noise/map, restyle header, footer, title
- **`src/components/RiskLanding.module.css`** - Hide video hero effects, restyle logo/tagline/buttons
- **`src/components/MarketFeed.module.css`** - Table/header/row/button overrides, `.gcHeader` class
- **`src/components/MarketDetail.module.css`** - Hero/title/section/composition overrides, `.gcTopSecret` class
- **`src/components/TerminalTopNav.module.css`** - Comic Sans links, bright colors, `.gcStar` class
- **`src/components/MusicControls.module.css`** - Beveled gray buttons, Comic Sans, red active state

## Visual Design

### Color Palette
- **Background:** Black with tiled GIF pattern
- **Text:** Bright green (#00FF00), yellow (#FFFF00), cyan (#00FFFF), red (#FF0000)
- **Borders:** Red (#FF0000), green (#00FF00), yellow (#FFFF00), gray (#666)
- **Fonts:** Comic Sans MS, Times New Roman, Courier New

### Key Elements
- Fire GIF borders (top/bottom of pages)
- Scrolling `<marquee>` alert ticker
- Animated sparkle/star GIFs
- Beveled 90s-style buttons (outset/inset borders)
- "NEW!" animated badges
- Hit counter (random 4-digit number)
- Under construction banners
- Award badges (Best in Netscape, Made with Notepad, Cool Site Award)
- Cursor trail (red/yellow dots)
- Right-click protection alert

## TypeScript Quirk

React 19 with `react-jsx` transform requires `<marquee>` type declaration via module augmentation:

```typescript
import 'react';
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          behavior?: string;
          direction?: string;
          scrollamount?: string;
        },
        HTMLElement
      >;
    }
  }
}
```

## Testing Notes

- Build passed with zero errors
- Dev server confirmed working at localhost:3000
- All navigation routes tested (Markets, Trade, Portfolio, About)
- Theme toggle persists across page refreshes via localStorage
- No hydration errors (data-theme set client-side only)

## Reimplementation Notes (Post-NORAD Merge)

The GeoCities implementation was lost in a rebase conflict with the NORAD design system merge (56 commits ahead). To reimplement:

1. **Check for conflicts with NORAD design:**
   - NORAD uses different color tokens (`--norad-telemetry`, `--norad-signal`, etc.)
   - Trade/Portfolio pages now use `NoradTradeSurface` and `NoradPortfolioSurface` components
   - Many components have new `.module.css` files for NORAD styling
   - `/intel` page added (War Room intelligence dashboard)

2. **Reimplementation strategy:**
   - Keep GeoCities as a separate theme mode alongside NORAD
   - ThemeContext should support 3 themes: `terminal`, `norad`, `geocities`
   - OR: Create a separate `/geocities` route with its own layout
   - OR: Add GeoCities as a lab demo in `/labs/geocities`

3. **Priority decision:**
   - If GeoCities is for fun/easter egg → `/labs/geocities` demo route
   - If GeoCities is for serious UX test → Full theme toggle with NORAD compat
   - If GeoCities is for marketing → Standalone route `/retro` or `/1998`

## Reference URLs

All GIFs sourced from gifcities.org (Internet Archive):
- `https://blob.gifcities.org/gifcities/[hash].gif`

See `src/lib/geocitiesGifs.ts` for full catalog.

## Credits

- Inspired by the geocities-skill Claude skill repo: https://github.com/b1rdmania/geocities-skill
- GIF archive: gifcities.org (Internet Archive)
- Reference: 1998 GeoCities web design aesthetic
