# Typography & Layout Audit

**Date:** 2026-02-02
**Subject:** GTM page and `tp-` class system
**Verdict:** The current implementation contradicts our own FINTECH-V2-GUIDELINES

---

## Critical Issues

### 1. Monospace Abuse

**The guideline says:**
> "Reserve monospace for numeric values only"

**What we're doing:**
```css
.tp-kv-v {
  font-family: var(--font-mono);  /* ← WRONG */
}
```

This applies JetBrains Mono to all key-value descriptions, including prose like:
> "Narrative baskets (Taiwan Strait, Commodities Shock, etc.) live in read-only mode"

**Result:** Descriptive text looks like code output. Unprofessional.

**Fix:** `.tp-kv-v` should use `--font-sans`. Only apply mono to actual numeric values (prices, percentages, IDs).

---

### 2. Section Headers Are Too Small

**The guideline says:**
> Section Head: 18px, 600 weight

**What we're doing:**
```css
.tp-h {
  font-size: 12px;           /* ← WAY TOO SMALL */
  text-transform: uppercase; /* ← GUIDELINES SAY NO */
  color: var(--amber);       /* ← AMBER IS FOR CTAS ONLY */
}
```

**Result:** Section headers (LEAD-IN, WHAT IT IS TODAY) have less visual weight than body text. The hierarchy is inverted.

**Fix:** Section headers should be 18px, semibold, `--text-primary`, no uppercase.

---

### 3. Uppercase Overuse

**The guideline says:**
> "NO uppercase except single-word labels (e.g., 'MARKETS', 'BALANCE')"

**What we're doing:**
- "LEAD-IN" ← fine
- "WHAT IT IS TODAY" ← NOT a single word
- "GTM PLAN (IF WE LAUNCH)" ← definitely not

**Fix:** Multi-word headers should be sentence case: "What it is today", "GTM plan (if we launch)"

---

### 4. Amber Used for Headers

**The guideline says:**
> Amber: "DO: Primary buttons, key CTAs, active nav states"
> "DON'T: Section headers, decorative elements"

**What we're doing:**
```css
.tp-h {
  color: var(--amber);  /* ← VIOLATES GUIDELINES */
}
```

**Result:** Every section header screams for attention. Nothing has priority. The page feels like a wall of warnings.

**Fix:** Section headers should be `--text-primary` (white/off-white). Reserve amber for actual actions.

---

### 5. Flat Sub-header Hierarchy

**The problem:** When we need sub-headers (Quant rationale, Narrative packaging), we're using:
```html
<div className="text-white text-sm font-medium mb-2">Quant rationale</div>
```

This is:
- Ad-hoc (not in the design system)
- 14px, same visual weight as body
- No clear distinction from surrounding text

**Fix:** Define a proper `.tp-h2` or `.tp-subhead` class:
- 15px, semibold
- `--text-primary`
- Proper spacing above/below

---

### 6. Cramped Spacing

**The guideline says:**
> Section spacing: 48px

**What we're doing:**
```css
.tp-section {
  margin-top: 22px;  /* ← HALF THE RECOMMENDED */
}

.tp-kv {
  gap: 8px;  /* ← TOO TIGHT FOR MULTI-LINE CONTENT */
}
```

**Result:** Everything runs together. No room to breathe. Feels rushed and cheap.

**Fix:**
- `.tp-section`: 40-48px margin-top
- `.tp-kv`: 16px gap minimum
- Add more padding in `.tp-kv-row` for multi-line values

---

### 7. Key-Value Alignment Issues

**The problem:** `.tp-kv-row` uses `justify-content: space-between`, which:
- Pushes keys left and values right
- Creates huge gaps when values are short
- Makes multi-line values awkward

**Better approach:** Fixed-width keys column, values flow naturally:
```css
.tp-kv-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 24px;
  align-items: baseline;
}
```

---

### 8. No Defined Type Scale

**The guideline defines a type scale:**
| Use | Size | Weight |
|-----|------|--------|
| Page Title | 32px | 600 |
| Section Head | 18px | 600 |
| Body | 15px | 400 |
| Label | 12px | 500 |

**What we're doing:**
- Page title: ~28-48px (clamp) ← close
- Section head: 12px ← wrong
- Body: 15px ← correct
- Label: 11px ← close

The `.tp-h` class is labeled "section header" but styled like a label. This is the core hierarchy problem.

---

## Proposed Fixes

### New Type Classes

```css
/* Page title - already exists as .tp-title */
.tp-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Section header - the main fix */
.tp-h {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 16px;
  /* NO uppercase, NO amber */
}

/* Sub-header - new class */
.tp-h2 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  margin-top: 24px;
}

/* Label - for key names, metadata */
.tp-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Body text - unchanged */
.tp-body {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

### Fixed Key-Value Layout

```css
.tp-kv {
  display: grid;
  gap: 16px;
}

.tp-kv-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  align-items: baseline;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.tp-kv-row:last-child {
  border-bottom: none;
}

.tp-kv-k {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.tp-kv-v {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-primary);
  font-family: var(--font-sans);  /* ← CRITICAL FIX */
  line-height: 1.5;
}
```

### Fixed Section Spacing

```css
.tp-section {
  margin-top: 40px;
}

.tp-rule {
  height: 1px;
  background: var(--border);
  margin: 40px 0;
}
```

---

## Visual Hierarchy (After Fix)

```
┌─────────────────────────────────────────────┐
│  GTM BRIEF                    ← 40px, 600   │
│  For Pear Protocol            ← 16px, 400   │
├─────────────────────────────────────────────┤
│                                             │
│  Lead-in                      ← 18px, 600   │
│                                             │
│  Body text body text body     ← 15px, 400   │
│  text body text body text.                  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  What it is today             ← 18px, 600   │
│                                             │
│  COMPOSABILITY   Description  ← 12px/15px   │
│  PROOF           text here                  │
│                                             │
│  FULL FUNNEL     Landing →    ← 12px/15px   │
│                  Markets →                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Guidelines Updates Needed

The FINTECH-V2-GUIDELINES.md needs a new section:

### Content Pages

For pages like About, GTM Brief, and other long-form content:

**Structure:**
1. Page title (`.tp-title`) - one per page
2. Subtitle/lede (`.tp-lede`) - optional
3. Section headers (`.tp-h`) - major sections
4. Sub-headers (`.tp-h2`) - within sections
5. Body text (`.tp-body`) - paragraphs
6. Labels (`.tp-label`) - for key-value pairs, metadata

**Key-Value Tables:**
- Keys: 12px, uppercase, muted
- Values: 15px, Inter (not mono), primary text
- Grid layout with fixed key column
- Adequate padding between rows

**Spacing:**
- 40px between major sections
- 24px above sub-headers
- 16px below headers
- 8px between list items

**Typography Rules:**
- Only use monospace for: prices, percentages, addresses, code
- Never use monospace for: descriptions, prose, labels
- Only use uppercase for: single-word labels, abbreviations
- Never use uppercase for: multi-word headers, sentences

---

## Summary

The core problem: We defined good guidelines in FINTECH-V2-GUIDELINES but the `.tp-*` classes predate them and weren't updated. The classes use:
- 12px amber uppercase headers (wrong)
- Monospace for all values (wrong)
- 22px section margins (too tight)

The fix is straightforward: Update the CSS to match the guidelines we wrote.
