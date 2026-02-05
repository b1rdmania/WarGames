# WAR.MARKET Design System

> ⚠️ **CANONICAL SOURCE OF TRUTH**
> This document defines the authoritative WAR.MARKET brand and design system. All implementations (trade, portfolio, labs, components) must follow these specifications. Do not modify without explicit approval.

---

## Brand Identity

**WAR.MARKET** — Trade narratives, not tickers.

A NORAD-inspired mission control terminal for geopolitical and macro narrative trading. The aesthetic draws from 1983 WarGames, Cold War command centers, and military telemetry systems.

### Brand Expression

| Context | Format | Notes |
|---------|--------|-------|
| Primary | WAR.MARKET | All caps, period separator |
| Domain | war.market | Lowercase for URLs |
| Tagline | "Trade narratives, not tickers" | — |
| Alt tagline | "The Global Tension Terminal" | Military flavor |

---

## Logo

The WAR.MARKET mark is a geometric diamond/chevron shape suggesting crosshairs, tension, and directional movement.

### Logo Files

```
public/
├── favicon.png          # 32x32 favicon
├── ghimage.png          # OG image (1200x630)
└── warmarket-mark.svg   # Primary mark (if available)
```

### Usage Guidelines

**Do:**
- Use mark on dark backgrounds
- Maintain clear space around mark
- Use at minimum 24px height

**Don't:**
- Place on busy backgrounds
- Stretch or distort
- Add effects (shadows, glows)
- Use on light backgrounds without adaptation

---

## Color Palette

### NORAD Signal Colors

The color system follows military command center conventions: cyan for telemetry, lime for armed/execute states, amber for warnings.

| Role | Token | Hex | RGB | Use |
|------|-------|-----|-----|-----|
| Telemetry | `--norad-telemetry` | #36d4ff | 54, 212, 255 | System chrome, labels, section titles |
| Signal/Execute | `--norad-signal` | #02ff81 | 2, 255, 129 | Armed states, CTAs, success, profit |
| Warning | `--norad-warning` | #f5a623 | 245, 166, 35 | Alerts, caution states |
| Fault | `--norad-fault` | #ff6b6b | 255, 107, 107 | Errors, loss, danger |
| Intel | `--norad-intel` | #cfbeff | 207, 190, 255 | Meta info, intel channel (not CTA) |

### Background Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--norad-bg` | #070d14 | Page background |
| `--norad-surface` | #0e1822 | Panel backgrounds |
| `--norad-panel` | #101c28 | Cards, inputs, nested panels |
| `--norad-grid` | #234055 | Borders, dividers, grid lines |

### Text Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--text-primary` | #f1f8ff | Headings, important text |
| `--text-secondary` | #b8d0e0 | Body text |
| `--text-muted` | #7a9ab0 | Labels, captions |
| `--text-faint` | #4a6578 | Disabled, placeholder |

### CSS Variables

```css
:root {
  /* NORAD Backgrounds */
  --norad-bg: #070d14;
  --norad-surface: #0e1822;
  --norad-panel: #101c28;
  --norad-grid: #234055;

  /* NORAD Signal Colors */
  --norad-telemetry: #36d4ff;
  --norad-signal: #02ff81;
  --norad-warning: #f5a623;
  --norad-fault: #ff6b6b;
  --norad-intel: #cfbeff;

  /* Text */
  --text-primary: #f1f8ff;
  --text-secondary: #b8d0e0;
  --text-muted: #7a9ab0;
  --text-faint: #4a6578;
}
```

---

## Typography

### Fonts

| Use | Font | Weight | Notes |
|-----|------|--------|-------|
| UI / Headings | Inter | 600 | Clean, modern |
| Body | Inter | 400 | — |
| Data / Mono | JetBrains Mono | 400-500 | Timestamps, codes, values |

### Type Scale

| Element | Size | Weight | Tracking | Font |
|---------|------|--------|----------|------|
| Page title | 12px | 600 | 0.09em | Inter |
| Section title | 11px | 500 | 0.1em | JetBrains Mono |
| Body | 13px | 400 | normal | Inter |
| Label | 10-11px | 500 | 0.06-0.08em | JetBrains Mono |
| Data value | 13px | 500 | normal | JetBrains Mono |

### Text Styling

```css
/* Section titles (SITUATION BOARD, EVENT LOG, etc.) */
.section-title {
  color: var(--norad-telemetry);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Labels */
.label {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Data values */
.value {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
}
```

---

## Structural Grammar

The NORAD interface follows a mission control layout with four key zones:

### 1. Situation Board

The primary intelligence display showing market overview and global stress map.

| Element | Purpose |
|---------|---------|
| World map | Geographic visualization of market themes |
| Hotspots | Pulsing indicators at tension points |
| Market list | Selectable thesis cards |

### 2. Event Log

Real-time operational feed with timestamped entries.

| Level | Color | Use |
|-------|-------|-----|
| INFO | Cyan (#36d4ff) | System status, data sync |
| ALERT | Amber (#f5a623) | Warnings, blocked actions |
| EXEC | Lime (#02ff81) | Armed states, executions |

### 3. Mission Console

Trade execution panel with bias selection and order entry.

| State | Visual |
|-------|--------|
| STANDBY | Neutral borders, muted text |
| ARMED | Lime border glow, active buttons |

### 4. Status Rail

Footer strip showing system status.

```
STATUS: ARMED | OPERATOR: 0xC0D3...087E | MARKET: TAIWANS | DATA AGE: 03s
```

---

## Components

### Page Header

```css
.header {
  border: 1px solid var(--norad-grid);
  background: var(--norad-surface);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  color: var(--norad-telemetry);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}
```

### Cards / Panels

```css
.card {
  border: 1px solid var(--norad-grid);
  background: var(--norad-surface);
}

/* Armed state (green top border) */
.card-armed {
  border-top: 2px solid var(--norad-signal);
}

/* Info state (cyan top border) */
.card-info {
  border-top: 2px solid var(--norad-telemetry);
}
```

### Buttons

| Variant | Background | Text | Border | Use |
|---------|------------|------|--------|-----|
| Primary | #02ff81 | #070d14 | none | Execute, confirm |
| Secondary | transparent | #36d4ff | #36d4ff | Cancel, secondary actions |
| Danger | #ff6b6b | #070d14 | none | Close position, destructive |
| Ghost | transparent | #b8d0e0 | #2b4a60 | Tertiary actions |

```css
.btn-primary {
  background: var(--norad-signal);
  color: var(--norad-bg);
  border: none;
  padding: 12px 24px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.btn-primary:hover {
  background: #00e070;
}

.btn-secondary {
  background: transparent;
  color: var(--norad-telemetry);
  border: 1px solid var(--norad-telemetry);
}

.btn-secondary:hover {
  background: rgba(54, 212, 255, 0.1);
}
```

### Inputs

```css
.input {
  background: var(--norad-panel);
  border: 1px solid var(--norad-grid);
  color: var(--text-primary);
  font-family: var(--font-mono);
  padding: 10px 12px;
}

.input:focus {
  border-color: var(--norad-telemetry);
  outline: none;
}

.input::placeholder {
  color: var(--text-faint);
}
```

### Status Pills

```css
.status-pill {
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid transparent;
}

.status-live {
  color: var(--norad-signal);
  background: rgba(2, 255, 129, 0.1);
  border-color: rgba(2, 255, 129, 0.3);
}

.status-paused {
  color: var(--norad-warning);
  background: rgba(245, 166, 35, 0.1);
  border-color: rgba(245, 166, 35, 0.3);
}

.status-error {
  color: var(--norad-fault);
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}
```

### Hotspots (Map Indicators)

```css
.hotspot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--norad-signal);
  box-shadow:
    0 0 0 4px rgba(2, 255, 129, 0.2),
    0 0 20px rgba(2, 255, 129, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 0 0 4px rgba(2, 255, 129, 0.2),
      0 0 20px rgba(2, 255, 129, 0.4);
  }
  50% {
    box-shadow:
      0 0 0 8px rgba(2, 255, 129, 0.1),
      0 0 30px rgba(2, 255, 129, 0.6);
  }
}
```

---

## Grid & Layout

### Page Grid

```css
.page {
  min-height: 100vh;
  background: radial-gradient(
    circle at 18% -8%,
    rgba(145, 92, 182, 0.24),
    transparent 40%
  ), var(--norad-bg);
  padding: 14px;
}
```

### Three-Column Layout (Trade)

```css
.grid {
  display: grid;
  grid-template-columns: 1.2fr 0.95fr 0.85fr;
  gap: 10px;
}

@media (max-width: 1160px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### Grid Lines (Map Background)

```css
.map {
  background:
    linear-gradient(rgba(54, 212, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(54, 212, 255, 0.08) 1px, transparent 1px),
    var(--norad-bg);
  background-size: 40px 40px;
}
```

---

## iOS & Mobile

### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### Safe Areas

```css
.header {
  padding-top: calc(10px + env(safe-area-inset-top));
}

.footer-rail {
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
}

.page {
  padding-left: max(14px, env(safe-area-inset-left));
  padding-right: max(14px, env(safe-area-inset-right));
}
```

### Touch Targets

All interactive elements must be minimum 44px touch target:

```css
.btn, .market-row, .bias-btn {
  min-height: 44px;
}
```

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| > 1160px | Three-column grid |
| 680-1160px | Single column, status rail 2-col |
| < 680px | Single column, status rail stacked |

---

## Animation

### Principles

- Subtle, functional animations
- No decorative flourishes
- Military precision feel
- 120-150ms for micro-interactions
- 200-300ms for state changes

### Transitions

```css
/* Micro-interactions */
.btn, .input, .market-row {
  transition: all 0.12s ease;
}

/* State changes */
.card, .panel {
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
```

---

## Accessibility

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--norad-signal);
  outline-offset: 2px;
}
```

### Color Contrast

All text meets WCAG AA standards:

| Combination | Ratio |
|-------------|-------|
| Primary text on bg | 15.2:1 |
| Secondary text on bg | 9.8:1 |
| Muted text on bg | 5.4:1 |
| Cyan on bg | 10.1:1 |
| Lime on bg | 12.8:1 |

### Screen Readers

- Use semantic HTML
- Add `aria-label` to icon-only buttons
- Use `role="status"` for live updates

---

## File Locations

```
src/
├── app/
│   ├── globals.css                 # CSS variables, base styles
│   ├── trade/
│   │   └── trade.module.css        # Trade page styles
│   └── portfolio/
│       └── portfolio.module.css    # Portfolio page styles
├── components/
│   ├── NoradTradeSurface.module.css
│   ├── NoradPortfolioSurface.module.css
│   ├── PearSetupCard.module.css
│   └── BetSlipPanel.module.css
docs/
├── design-systems/
│   ├── design.md                   # ← THIS FILE
│   ├── norad-system.md             # NORAD spec details
│   └── norad-iteration-brief.md    # Iteration notes
terminal_ref/
├── War-Room-Film-Set-1983-WarGames.webp
└── [other reference images]
```

---

## Reference

### Inspiration

- **WarGames (1983)** — NORAD command center scenes
- **Bloomberg Terminal** — Dense information display
- **Military telemetry** — Status indicators, grid overlays

### Key Principles

1. **Mission control, not video game** — Serious, functional, not gimmicky
2. **Information density** — Show data, don't hide it
3. **Clear hierarchy** — Cyan for system, lime for action, amber for warning
4. **Quiet confidence** — No flashy animations, no marketing speak
5. **Respect the operator** — Assume competence, don't patronize

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-05 | Initial NORAD design system live |
| 2026-02-05 | PearSetupCard, BetSlipPanel migrated to NORAD |
| 2026-02-05 | World map with Wikimedia + CSS filters |
| 2026-02-03 | Trade/Portfolio pages migrated to NORAD |
| 2026-02-03 | Design System Labs created |
