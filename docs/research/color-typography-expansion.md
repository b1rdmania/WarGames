# Color & Typography Expansion

**Problem:** The current palette is monochrome gray + amber. It's clean but generic—could be any SaaS. Inter everywhere adds to the "template" feel.

---

## Current Palette (Too Limited)

```
Backgrounds:  #0e0e10 → #18171c → #222127 → #2c2a32  (warm grays with purple undertone)
Text:         #e8e6ed → #a8a3b3 → #6b6879           (neutral grays)
Brand:        #f97316 (amber) + #fbbf24 (gold)       (warm accent only)
Functional:   #22c55e (profit) + #ef4444 (loss)     (semantic only)
```

**Issues:**
1. No secondary color for depth and variety
2. Amber does ALL the work—links, buttons, accents, everything
3. Inter is the "default" font of every startup since 2020
4. No visual distinction between content types

---

## Proposed Expansion

### Color Philosophy

WAR.MARKET trades geopolitical stress. The palette should feel:
- **Serious** — like a Bloomberg terminal, not a consumer app
- **Premium** — sophisticated, not startup-y
- **Warm** — the amber brand color brings heat/urgency
- **Cool contrast** — needs a cooler accent to balance the warmth

### New Color Tiers

#### Primary: Amber (unchanged)
The brand color. Heat, urgency, action.
```css
--primary: #f97316;         /* Main CTA, key actions */
--primary-hover: #ea580c;   /* Hover state */
--primary-muted: rgba(249, 115, 22, 0.15); /* Backgrounds */
```

#### Secondary: Slate Violet
A cool accent that complements amber. Derived from the purple undertone already in our backgrounds.
```css
--secondary: #8b8b9e;       /* Cool gray-violet for secondary text, borders */
--secondary-accent: #a78bfa; /* Violet for secondary interactive elements */
--secondary-muted: rgba(167, 139, 250, 0.1); /* Subtle highlight */
```

#### Tertiary: Slate Blue
For information, links within body text, tertiary actions.
```css
--tertiary: #94a3b8;        /* Cool slate for metadata, timestamps */
--tertiary-accent: #60a5fa; /* Blue for info states, external links */
```

#### Extended Neutrals
Adding more variation to the gray scale:
```css
--text-primary: #f0eef5;    /* Slightly warmer white */
--text-secondary: #a8a3b8;  /* Hint of violet */
--text-muted: #6b6879;      /* Existing */
--text-faint: #4a4655;      /* New: very subtle text */
```

### Full Palette

| Tier | Token | Hex | Use |
|------|-------|-----|-----|
| **Primary** | --primary | #f97316 | CTAs, key actions |
| | --primary-hover | #ea580c | Button hover |
| | --primary-soft | rgba(249,115,22,0.12) | Subtle backgrounds |
| **Secondary** | --secondary | #a78bfa | Secondary buttons, accents |
| | --secondary-hover | #8b5cf6 | Hover state |
| | --secondary-soft | rgba(167,139,250,0.1) | Highlight backgrounds |
| **Tertiary** | --tertiary | #60a5fa | Info, links, metadata |
| | --tertiary-soft | rgba(96,165,250,0.1) | Info backgrounds |
| **Neutral** | --text-primary | #f0eef5 | Headlines |
| | --text-secondary | #a8a3b8 | Body |
| | --text-muted | #6b6879 | Labels |
| | --text-faint | #4a4655 | Disabled, hints |
| **Semantic** | --profit | #22c55e | Positive P&L |
| | --loss | #ef4444 | Negative P&L |
| | --warning | #f59e0b | Warnings |

---

## Typography Expansion

### The Inter Problem

Inter is excellent but ubiquitous. Every startup, every SaaS, every "modern" site uses it. It says nothing about WAR.MARKET.

### Options

#### Option A: Keep Inter, Add Display Font
Use a distinctive headline font while keeping Inter for body:

**Headline:** Geist (Vercel's font) or Outfit or Plus Jakarta Sans
**Body:** Inter

Pros: Adds character to headlines while keeping readable body
Cons: Two fonts to load, potential weight mismatch

#### Option B: Switch to a More Distinctive Sans
Replace Inter entirely with something less common:

**Candidates:**
- **Satoshi** — geometric, modern, slightly more character
- **General Sans** — clean but distinctive
- **Instrument Sans** — contemporary, good for fintech
- **Geist** — crisp, technical, modern

Pros: Cohesive, single font family
Cons: Less "safe" choice

#### Option C: Embrace the Terminal Heritage
Use a monospace-influenced or technical font for headlines:

**Headline:** JetBrains Mono or IBM Plex Mono (for titles only)
**Body:** Inter

Pros: Ties to the "terminal" brand heritage, very distinctive
Cons: Could feel too "dev tool", harder to read at large sizes

### Recommendation: Option A with Geist

```css
--font-display: 'Geist', 'Inter', sans-serif;  /* Headlines */
--font-sans: 'Inter', sans-serif;               /* Body */
--font-mono: 'JetBrains Mono', monospace;       /* Data */
```

Geist is:
- Created by Vercel, extremely well-crafted
- More technical/precise feel than Inter
- Great at large sizes for headlines
- Free and widely supported

---

## Implementation Plan

### Phase 1: Colors
1. Add secondary (violet) and tertiary (blue) to globals.css
2. Update tp-* classes to use new colors where appropriate
3. Add utility classes for new colors

### Phase 2: Typography (Optional)
1. Add Geist font import
2. Create --font-display variable
3. Update tp-title and tp-h to use display font
4. Test across all pages

### Phase 3: Application
1. Use secondary color for:
   - Labels in KV tables
   - Secondary buttons
   - Hover states on non-CTA elements
2. Use tertiary for:
   - Metadata (dates, timestamps)
   - External links in body text
   - Info badges

---

## Visual Example

**Before:**
```
GTM Brief                    ← White (Inter)
─────────────────
Lead-in                      ← White (Inter)
WAR.MARKET is the...         ← Gray (Inter)

COMPOSABILITY  Description   ← Gray label, white value (Inter)
```

**After:**
```
GTM Brief                    ← White (Geist, tighter tracking)
─────────────────
Lead-in                      ← White (Geist)
WAR.MARKET is the...         ← Warm gray (Inter)

COMPOSABILITY  Description   ← Violet-gray label, white value
↑ slight color adds depth without distraction
```

---

## Decision Needed

1. **Colors:** Add violet secondary + blue tertiary? (Recommended: Yes)
2. **Display font:** Add Geist for headlines? (Recommended: Yes, but optional)
3. **Scope:** Full site or content pages only? (Recommended: Start with content pages)
