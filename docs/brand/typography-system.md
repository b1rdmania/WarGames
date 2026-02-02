# Typography & Layout System

A comprehensive guide to typography, hierarchy, and layout for war.market content pages.

---

## The Problem We're Solving

The current implementation fails basic typographic hierarchy. When you squint at the page, you should see distinct levels of importance. Instead:

- Section headers (12px, orange, uppercase) **scream** but have no visual weight
- Body text (15px, gray) actually looks more important than headers
- Monospace font on prose text reads like error logs
- Everything is cramped—sections run together
- Amber on every header means nothing stands out

This reads as "hackathon project" not "professional trading platform."

---

## Typography Scale

A proper type scale creates clear visual hierarchy through size, weight, and spacing—not color gimmicks.

| Level | Name | Size | Weight | Line Height | Color | Letter Spacing |
|-------|------|------|--------|-------------|-------|----------------|
| 1 | Page Title | 36px | 600 | 1.1 | Primary | -0.02em |
| 2 | Section Head | 20px | 600 | 1.3 | Primary | -0.01em |
| 3 | Subsection | 16px | 600 | 1.4 | Primary | 0 |
| 4 | Body | 15px | 400 | 1.65 | Secondary | 0 |
| 5 | Label | 12px | 500 | 1.4 | Muted | 0.02em |
| 6 | Caption | 11px | 400 | 1.4 | Muted | 0 |

**Key principle:** Size and weight do the heavy lifting. Color is for semantics (actions, status), not hierarchy.

---

## Font Usage

### Inter (UI Font)

Use for **everything except numeric data**:
- All headings
- All body text
- All labels
- Navigation
- Buttons
- Descriptions in tables

### JetBrains Mono (Data Font)

Use **only** for:
- Prices: `$1,234.56`
- Percentages: `+12.5%`
- Addresses: `0x1234...abcd`
- Timestamps: `2026-02-02`
- Code snippets
- Asset tickers in data contexts: `BTC`, `ETH`

**Never use mono for:**
- Prose descriptions
- Labels
- Button text
- Navigation
- Anything you would read as a sentence

---

## Hierarchy Principles

### 1. Size Creates Importance

The eye goes to larger text first. Our page title (36px) should dominate. Section heads (20px) should be clearly secondary. Body (15px) should recede.

Current problem: Section heads at 12px are smaller than body at 15px.

### 2. Weight Creates Emphasis

Semibold (600) for heads, regular (400) for body. This creates clear delineation without relying on color.

### 3. Space Creates Grouping

Generous space between sections (48px) signals "new topic." Tighter space within sections (16-24px) signals "related content."

Current problem: 22px everywhere—no grouping signal.

### 4. Color Creates Meaning

- **Primary text** (#e8e6ed): Important content, headings
- **Secondary text** (#a8a3b3): Body, supporting content
- **Muted text** (#6b6879): Labels, metadata
- **Amber** (#f97316): Actions only—buttons, links

Current problem: Amber on section headers. This makes every section feel like a call-to-action.

---

## Spacing System

### Vertical Rhythm

All vertical spacing should follow the base unit of 8px:

| Context | Spacing |
|---------|---------|
| After page title | 8px |
| After subtitle/lede | 32px (before rule) |
| Between major sections | 48px |
| After section header | 20px |
| Between subsections | 32px |
| After subsection header | 12px |
| Between paragraphs | 16px |
| Between list items | 8px |
| Between KV rows | 16px |

### Horizontal Rhythm

| Context | Value |
|---------|-------|
| Page max-width | 900px |
| Content padding (desktop) | 48px |
| Content padding (mobile) | 24px |
| KV label column | 160px |
| KV gap | 32px |

---

## Component Patterns

### Page Header

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Page Title                          ← 36px, 600   │
│  Subtitle or context line            ← 15px, 400   │
│                                                     │
│  ─────────────────────────────────   ← Rule        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Page title: 36px, semibold, primary color
- Subtitle: 15px, regular, secondary color
- Space after title: 8px
- Space after subtitle: 32px
- Rule: 1px, border color

### Section

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Section heading                     ← 20px, 600   │
│                                                     │
│  Body text body text body text       ← 15px, 400   │
│  body text body text body text                      │
│  body text.                                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Section head: 20px, semibold, primary color, sentence case
- Space after head: 20px
- Body: 15px, regular, secondary color

### Section with Subsections

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Section heading                     ← 20px, 600   │
│                                                     │
│  Subsection heading                  ← 16px, 600   │
│                                                     │
│  Body text body text body text       ← 15px, 400   │
│                                                     │
│  Subsection heading                  ← 16px, 600   │
│                                                     │
│  Body text body text body text       ← 15px, 400   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Subsection head: 16px, semibold, primary color
- Space above subsection: 32px
- Space after subsection head: 12px

### Key-Value List

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  LABEL          Value text that can wrap to        │
│                 multiple lines if needed            │
│  ───────────────────────────────────────────────── │
│  LABEL          Another value                       │
│  ───────────────────────────────────────────────── │
│  LABEL          Third value                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Layout: CSS Grid with fixed label column (160px)
- Label: 12px, medium weight, uppercase, muted color
- Value: 15px, regular, primary color, **Inter not mono**
- Row padding: 16px vertical
- Row separator: 1px border-subtle

### Bullet List

```
→ First item
→ Second item
→ Third item
```

- Bullet: Arrow (→) in muted color
- Text: 15px, secondary color
- Item spacing: 8px

---

## Color Usage

### Text Hierarchy

| Element | Color | Hex |
|---------|-------|-----|
| Page title | Primary | #e8e6ed |
| Section head | Primary | #e8e6ed |
| Subsection head | Primary | #e8e6ed |
| Body text | Secondary | #a8a3b3 |
| Labels | Muted | #6b6879 |
| Emphasis in body | Primary | #e8e6ed |

### Semantic Color

| Element | Color | Hex |
|---------|-------|-----|
| Links | Amber | #f97316 |
| Primary buttons | Amber | #f97316 |
| Positive values | Profit | #22c55e |
| Negative values | Loss | #ef4444 |

### What Amber Is Not For

- Section headers
- Labels
- Decorative elements
- Emphasis within body text

---

## Implementation Classes

### Updated CSS Classes

```css
/* Page title */
.tp-title {
  font-size: 36px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Subtitle */
.tp-lede {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 8px;
}

/* Section header */
.tp-h {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.3;
  margin-bottom: 20px;
}

/* Subsection header */
.tp-h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-top: 32px;
  margin-bottom: 12px;
}

/* Body text */
.tp-body {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* Key-value container */
.tp-kv {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Key-value row */
.tp-kv-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 32px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
  align-items: baseline;
}

.tp-kv-row:last-child {
  border-bottom: none;
}

/* Key (label) */
.tp-kv-k {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--text-muted);
}

/* Value (content) - INTER NOT MONO */
.tp-kv-v {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.5;
}

/* Section spacing */
.tp-section {
  margin-top: 48px;
}

/* Rule/divider */
.tp-rule {
  height: 1px;
  background: var(--border);
  margin: 48px 0;
}
```

---

## Before/After

### Before (Current)

- 12px orange uppercase headers
- Monospace for all values
- 22px section spacing
- Flat hierarchy
- Everything screams

### After (Fixed)

- 20px white sentence-case headers
- Inter for all prose, mono only for data
- 48px section spacing
- Clear 4-level hierarchy
- Clean, professional, readable

---

## Checklist for New Pages

1. [ ] Page title is 36px semibold
2. [ ] Section heads are 20px semibold, sentence case
3. [ ] Subsection heads are 16px semibold
4. [ ] Body text is 15px regular in secondary color
5. [ ] Labels are 12px medium in muted color
6. [ ] Monospace only for numeric data
7. [ ] Amber only for links and buttons
8. [ ] 48px between major sections
9. [ ] KV values use Inter, not mono
10. [ ] No uppercase except single-word labels
