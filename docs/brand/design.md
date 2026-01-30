# Design system

## Colors

### Backgrounds

| Name | Hex | Use |
|------|-----|-----|
| Deep | `#0e0e10` | Page background |
| Warm | `#18171c` | Cards, panels |
| Surface | `#222127` | Inputs, hover states |
| Elevated | `#2c2a32` | Modals, dropdowns |

### Text

| Name | Hex | Use |
|------|-----|-----|
| Primary | `#e8e6ed` | Headings, important content |
| Secondary | `#a8a3b3` | Body text, descriptions |
| Muted | `#6b6879` | Labels, placeholders |
| Disabled | `#3d3a45` | Disabled states |

### Brand

| Name | Hex | Use |
|------|-----|-----|
| Amber | `#f97316` | Primary CTA only |
| Gold | `#fbbf24` | Secondary accent (rare) |

### Functional

| Name | Hex | Use |
|------|-----|-----|
| Profit | `#22c55e` | Positive P&L |
| Loss | `#ef4444` | Negative P&L |
| Warning | `#eab308` | Alerts |
| Info | `#3b82f6` | Information |

### Borders

| Name | Hex | Use |
|------|-----|-----|
| Default | `#37343e` | Card borders |
| Subtle | `#2a2830` | Dividers within cards |

## Typography

### Fonts

- **UI:** Inter
- **Code/Data:** JetBrains Mono

### Scale

| Use | Size | Weight |
|-----|------|--------|
| Page title | 32px | 600 |
| Section head | 18px | 600 |
| Body | 15px | 400 |
| Label | 12px | 500 |
| Caption | 11px | 500 |

### Rules

- No uppercase except single-word labels
- No letter-spacing on body text
- Line height 1.5–1.6 for body

## Spacing

Base unit: 4px

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

## Components

### Buttons

**Primary (Amber)**
```css
background: #f97316;
color: #0e0e10;
font-weight: 600;
padding: 12px 24px;
border-radius: 6px;
```

**Secondary (Ghost)**
```css
background: transparent;
border: 1px solid #37343e;
color: #e8e6ed;
```

### Cards

```css
background: #18171c;
border: 1px solid #37343e;
border-radius: 8px;
padding: 20px;
```

### Inputs

```css
background: #222127;
border: 1px solid #37343e;
border-radius: 6px;
padding: 12px 16px;
```

Focus state: amber border + subtle glow.

## Do's and don'ts

### Do

- Use whitespace generously
- Let typography create hierarchy
- Keep amber for CTAs only
- Use subtle borders to define areas

### Don't

- Add decorative elements to fill space
- Use multiple accent colors
- Animate things that don't need animation
- Use uppercase for full phrases
