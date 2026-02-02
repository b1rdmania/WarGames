# Design system

## Color Tiers

### Primary: Amber
Heat, urgency, action. Use for CTAs and key interactive elements.

| Token | Hex | Use |
|-------|-----|-----|
| `--primary` | `#f97316` | Primary buttons, key CTAs |
| `--primary-hover` | `#ea580c` | Hover states |
| `--primary-soft` | `rgba(249,115,22,0.12)` | Subtle backgrounds |

### Secondary: Violet
Depth and sophistication. Use for labels, secondary accents, metadata.

| Token | Hex | Use |
|-------|-----|-----|
| `--secondary` | `#a78bfa` | Secondary buttons, accents |
| `--secondary-hover` | `#8b5cf6` | Hover states |
| `--secondary-muted` | `#8b8b9e` | Labels, subtle text |
| `--secondary-soft` | `rgba(167,139,250,0.1)` | Highlight backgrounds |

### Tertiary: Slate Blue
Information and metadata. Use for timestamps, info states, subtle accents.

| Token | Hex | Use |
|-------|-----|-----|
| `--tertiary` | `#60a5fa` | Info states, links |
| `--tertiary-muted` | `#94a3b8` | Metadata, captions |
| `--tertiary-soft` | `rgba(96,165,250,0.1)` | Info backgrounds |

### Backgrounds

| Token | Hex | Use |
|-------|-----|-----|
| `--bg-deep` | `#0e0e10` | Page background |
| `--bg-warm` | `#18171c` | Cards, panels |
| `--bg-surface` | `#222127` | Inputs, hover states |
| `--bg-elevated` | `#2c2a32` | Modals, dropdowns |

### Text

| Token | Hex | Use |
|-------|-----|-----|
| `--text-primary` | `#f0eef5` | Headlines, key content |
| `--text-secondary` | `#a8a3b8` | Body text |
| `--text-muted` | `#6b6879` | Labels, placeholders |
| `--text-faint` | `#4a4655` | Disabled, hints |

### Semantic

| Token | Hex | Use |
|-------|-----|-----|
| `--profit` | `#22c55e` | Positive P&L |
| `--loss` | `#ef4444` | Negative P&L |
| `--warning` | `#f59e0b` | Alerts |

### Borders

| Token | Hex | Use |
|-------|-----|-----|
| `--border` | `#37343e` | Card borders |
| `--border-subtle` | `#2a2830` | Dividers within cards |

---

## Typography

### Fonts

| Font | Variable | Use |
|------|----------|-----|
| Geist | `--font-display` | Page titles, section heads |
| Inter | `--font-sans` | Body text, labels, UI |
| JetBrains Mono | `--font-mono` | Numeric data only |

### Scale

| Level | Element | Font | Size | Weight |
|-------|---------|------|------|--------|
| 1 | Page title | Geist | 36px | 600 |
| 2 | Section head | Geist | 20px | 600 |
| 3 | Subsection | Geist | 16px | 600 |
| 4 | Body | Inter | 15px | 400 |
| 5 | Label | Inter | 12px | 500 |

### Font Rules

**Geist for:** Headlines, section headers, subsection headers

**Inter for:** Body text, labels, navigation, buttons, table descriptions

**Mono for:** Prices (`$1,234`), percentages (`+12%`), addresses (`0x...`), timestamps

**Never mono for:** Prose, descriptions, or anything read as a sentence

### Case Rules

- **Uppercase:** Single-word labels only (STATUS, BALANCE)
- **Sentence case:** Multi-word headers ("What it is today")
- **Never uppercase:** Full phrases or sentences

---

## Amber Accents

Amber brings warmth and brand identity throughout the interface. Use it strategically:

### Section Headers
4px amber bar before each h2:
```css
.tp-h::before {
  width: 4px;
  height: 20px;
  background: var(--primary);
  border-radius: 2px;
}
```

### Subsection Headers
6px amber dot before each h3:
```css
.tp-h2::before {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
}
```

### Emphasis
`<strong>` text uses amber, not white:
```css
strong { color: var(--primary); }
```

### List Markers
Bullet arrows and list markers in amber:
```css
li::before { color: var(--primary); }
```

### Horizontal Rules
Amber gradient fade on left edge:
```css
hr {
  background: linear-gradient(90deg,
    var(--primary) 0%,
    var(--border) 20%);
}
```

### Key-Value Tables
Amber left border on data tables:
```css
.tp-kv {
  border-left: 2px solid var(--primary);
  padding-left: 20px;
}
```

---

## Spacing

Base unit: 4px

| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Tight gaps |
| sm | 8px | List items |
| md | 16px | Paragraph spacing |
| lg | 24px | Card padding |
| xl | 32px | Section gaps |
| 2xl | 48px | Major sections |

---

## Components

### Buttons

**Primary (Amber)**
```css
background: var(--primary);
color: #0e0e10;
font-weight: 600;
padding: 12px 24px;
border-radius: 6px;
```

**Secondary (Violet)**
```css
background: transparent;
border: 1px solid var(--secondary);
color: var(--secondary);
```

**Ghost**
```css
background: transparent;
border: 1px solid var(--border);
color: var(--text-primary);
```

### Cards

```css
background: var(--bg-warm);
border: 1px solid var(--border);
border-radius: 8px;
padding: 20px;
```

### Inputs

```css
background: var(--bg-surface);
border: 1px solid var(--border);
border-radius: 6px;
padding: 12px 16px;
```

Focus: amber border + subtle glow.

---

## Do's and Don'ts

### Do

- Use Geist for headlines, Inter for body
- Use secondary violet for labels and metadata
- Keep primary amber for CTAs only
- Use generous whitespace (48px between sections)

### Don't

- Use mono for prose text
- Use amber for headers or decoration
- Use uppercase for multi-word phrases
- Cram sections together
