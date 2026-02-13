# Control Room Design System Specification

**Status:** ⚠️ ARCHIVED — Replaced by Terminal System
**Replacement:** See `terminal-system-spec.md`
**Source:** `/public/test-norad-terminal-colors.html`
**Last Updated:** 2026-02-12
**Archived:** 2026-02-13

---

## ⚠️ DEPRECATION NOTICE

**This design system is no longer in use.**

All production routes have been migrated to the **Terminal Design System** (3-column layout with TerminalShell primitives). This Control Room spec remains for historical reference only.

**For current design guidelines, see:** `terminal-system-spec.md`

---

## 1. System Philosophy

Control Room is a **mission control interface** aesthetic combining:
- NORAD command center structure (grid layouts, status rails, event logs)
- Terminal/DOS visual language (bright green accents, pure black, monospace data)
- Military tactical clarity (uppercase labels, condensed spacing, high information density)

**Core Principle:** Every pixel serves operational awareness. No decoration.

---

## 2. Layout Anatomy

### Mandatory Two-Column Structure

**ALL authenticated pages MUST use this layout:**

```
┌─────────────────────────────────────────────────────┐
│ Header: Operations Bar                              │ 48px fixed
├─────────────────────┬───────────────────────────────┤
│                     │                               │
│ SITUATION BOARD     │ MISSION CONSOLE               │ flex: 1
│ (Left: Main Data)   │ (Right: Actions/Details)      │
│ 1fr flexible        │ 400px fixed width             │
│                     │                               │
├─────────────────────┴───────────────────────────────┤
│ Footer: Status Rail                                 │ 40px fixed
└─────────────────────────────────────────────────────┘
```

**Layout Pattern by Page Type:**

| Page Type | Situation Board (Left) | Mission Console (Right) |
|-----------|------------------------|-------------------------|
| Browse (`/markets`) | Market table | Selected market details + "GO TO TRADE" |
| Detail (`/markets/[id]`) | Market info panels | Composition + narrative + actions |
| Execute (`/trade`) | Market table | Trade form + event log |
| Portfolio (`/portfolio`) | Position list | Selected position details + close form |
| Intel (`/intel`) | News feed | Analysis panel |

**The two-column structure is NOT optional.** Every page uses Situation Board | Mission Console. No centered single-panel layouts.

### Grid Rules

- **Desktop:** `grid-template-columns: 1fr 400px` (board | console)
- **Tablet:** `grid-template-columns: 1fr` (stack vertically)
- **Mobile:** Single column, console becomes collapsible drawer

### Spacing System

| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | Icon gaps, tight clusters |
| `sm` | 8px | Label→value, inline spacing |
| `md` | 12px | Section internal padding |
| `lg` | 16px | Panel padding, header padding |
| `xl` | 20px | Console content padding |
| `2xl` | 24px | Board content padding, section gaps |

---

## 3. Component Rules

### Panel

**Anatomy:**
```tsx
<div className="cr-panel">
  <div className="cr-panel-header">
    <div className="cr-panel-title">SECTION TITLE</div>
    <div className="cr-panel-subtitle">Optional subtitle</div>
  </div>
  <div className="cr-panel-content">
    {/* content */}
  </div>
</div>
```

**Styling:**
- Background: `var(--bg-warm)` (#0a0a0a in test, but use semantic token)
- Border: 1px `var(--border)`
- Header padding: 16px 24px (lg xl)
- Content padding: 24px (2xl)
- Title: 12px uppercase, 0.08em tracking, `var(--primary)` color
- Subtitle: 11px monospace, `var(--text-muted)`

### Table

**Anatomy:**
```tsx
<table className="cr-table">
  <thead>
    <tr>
      <th>COLUMN</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Value</td>
    </tr>
  </tbody>
</table>
```

**Styling:**
- Thead: sticky, `var(--bg-surface)` background
- Th: 10px uppercase, 0.1em tracking, `var(--text-muted)`, padding 12px 16px
- Td: 13px, padding 14px 16px, border-bottom 1px `var(--border)`
- Row hover: `var(--bg-surface)` background
- Code column: monospace font, `var(--primary)` color

### Section Header

**Anatomy:**
```tsx
<div className="cr-section-header">
  <div className="cr-section-label">LABEL</div>
  <div className="cr-section-value">Value or content</div>
</div>
```

**Styling:**
- Label: 10px uppercase, 0.1em tracking, `var(--text-muted)`, margin-bottom 8px
- Value: 20px monospace, `var(--text-primary)`, font-weight 500

### Button

**Variants:**
1. **Primary (Execute):** Green background, black text
2. **Secondary (Options):** Dark background, white text, green border on hover
3. **Danger:** Red background, black text

**Styling:**
- All: uppercase, monospace, 12px, 0.08em tracking
- Padding: 14px (vertical + horizontal for full-width)
- Border-radius: 4px
- Transition: all 0.15s
- Focus: `var(--primary)` border, no outline

**Primary:**
```css
background: var(--primary);
border: 1px solid var(--primary);
color: var(--bg-deep);
```

**Secondary:**
```css
background: var(--bg-surface);
border: 1px solid var(--border);
color: var(--text-primary);

&:hover {
  border-color: var(--primary);
  background: var(--bg-elevated);
}
```

### Input

**Styling:**
- Background: `var(--bg-deep)`
- Border: 1px `var(--border)`
- Font: monospace, 14px
- Padding: 12px
- Border-radius: 4px
- Focus: border-color → `var(--primary)`, no outline

### Event Log

**Anatomy:**
```tsx
<div className="cr-event-log">
  <div className="cr-event-item">
    <span className="cr-event-time">14:32:18</span>
    <span className="cr-event-msg success">MESSAGE</span>
  </div>
</div>
```

**Styling:**
- Container: max-height 200px, overflow-y auto, padding 16px 20px
- Item: display flex, gap 12px, font 11px monospace
- Time: `var(--text-muted)`
- Message: `var(--text-secondary)`, or success/warning classes
- Success: `var(--profit)` (#00ff00)
- Warning: `var(--warning)` (#ffff00)

### Status Rail (Footer)

**Anatomy:**
```tsx
<footer className="cr-status-rail">
  <div className="cr-status-group">
    <div className="cr-status-item">
      <span>KEY:</span>
      <span className="cr-status-value">VALUE</span>
    </div>
  </div>
</footer>
```

**Styling:**
- Background: `var(--bg-warm)`
- Border-top: 1px `var(--border)`
- Padding: 10px 24px
- Display: flex, justify-content: space-between
- Font: 11px monospace, uppercase
- Key: `var(--text-muted)`
- Value: `var(--primary)`

---

## 4. Typography Scale

### Font Families

- **Sans (UI Labels):** Inter, -apple-system, sans-serif
- **Mono (Data):** JetBrains Mono, 'Courier New', monospace

### Scale

| Purpose | Font | Size | Weight | Tracking | Transform |
|---------|------|------|--------|----------|-----------|
| Panel Title | Sans | 12px | 600 | 0.08em | UPPERCASE |
| Panel Subtitle | Mono | 11px | 400 | 0 | none |
| Table Header | Sans | 10px | 600 | 0.1em | UPPERCASE |
| Table Cell | Sans | 13px | 400 | 0 | none |
| Table Code | Mono | 13px | 500 | 0 | none |
| Section Label | Sans | 10px | 600 | 0.1em | UPPERCASE |
| Section Value | Mono | 20px | 500 | 0 | none |
| Button | Mono | 12px | 600 | 0.08em | UPPERCASE |
| Input | Mono | 14px | 400 | 0 | none |
| Event Log | Mono | 11px | 400 | 0 | none |
| Footer | Mono | 11px | 400 | 0 | UPPERCASE |

---

## 5. Color Roles

### Semantic Tokens

| Token | Hex (Reference) | Use |
|-------|-----------------|-----|
| `--bg-deep` | #000000 | Page background |
| `--bg-warm` | #0a0a0a | Panel headers, footer |
| `--bg-surface` | #111111 | Table header, elevated panels |
| `--bg-elevated` | #1a1a1a | Button hover, input backgrounds |
| `--text-primary` | #ffffff | Primary text, table values |
| `--text-secondary` | #a0a0a0 | Secondary text, muted content |
| `--text-muted` | #666666 | Labels, timestamps, footer keys |
| `--border` | #1a1a1a | Panel borders, table borders |
| `--primary` | #02ff81 | Accent color, active states, CTAs |
| `--primary-hover` | #00e070 | Hover states |
| `--profit` | #00ff00 | Success, positive P&L |
| `--loss` | #ff0000 | Danger, negative P&L |
| `--warning` | #ffff00 | Caution, alerts |

**Note:** Test uses pure `#00ff00`, but production uses `#02ff81` (slightly cyan-shifted green).

### Color Usage Rules

- **Primary accent:** Only for operational chrome (borders, labels, CTAs). Never for large fills.
- **Profit/Loss:** Only for P&L values, not decorative use.
- **Warning:** Only for alerts requiring user attention.
- **Text hierarchy:** white → gray → dark gray (primary → secondary → muted).

---

## 6. Interaction States

### Hover

- Tables: background → `var(--bg-surface)`
- Buttons: border → `var(--primary)`, background → `var(--bg-elevated)`
- Links: color → `var(--primary)`

### Focus

- All interactive elements: `border-color: var(--primary)`, `outline: none`
- Buttons: no additional effect (hover + focus same state)

### Active

- Buttons: `transform: scale(0.98)` (subtle press effect)
- Table rows: `background: var(--primary-soft)`, `border-left: 2px solid var(--primary)`

### Disabled

- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

---

## 7. Responsive Behavior

### Breakpoints

- **Desktop:** > 1024px (full 2-column layout)
- **Tablet:** 768px - 1024px (console moves below content)
- **Mobile:** < 768px (console becomes collapsible drawer)

### Console Behavior

- Desktop: fixed 400px right rail
- Tablet: full-width section below content
- Mobile: collapsible bottom drawer with toggle button

---

## 8. Copy Tone

### Voice

- **Active, not passive:** "Execute Position" not "Position will be executed"
- **Military brevity:** "PEAR: CONNECTED" not "Connected to Pear Protocol"
- **Operator language:** USER → OPERATOR, STATUS → ARMED/STANDBY
- **Uppercase for system chrome:** Section labels, button text, footer keys
- **Sentence case for content:** Market names, descriptions, event messages

### Terminology

| Don't Say | Say |
|-----------|-----|
| User | Operator |
| Dashboard | Situation Board |
| Settings | Mission Parameters |
| Connected | Armed |
| Disconnected | Standby |
| Success | Executed |
| Failed | Fault |
| Loading | Initializing |

---

## 9. Animation

### Transitions

- **Fast:** 0.15s (hover, focus, state changes)
- **Medium:** 0.3s (panel expand/collapse)
- **Slow:** 0.5s (page transitions)

### Easing

- **Default:** ease (smooth deceleration)
- **Mechanical:** ease-in-out (deliberate, robotic)

### Effects to Avoid

- No fade-ins on initial render (command center is always on)
- No slide animations (elements are fixed in grid)
- No bounce/elastic (not tactical)

---

## 10. Accessibility

### Keyboard Navigation

- All interactive elements: focusable, visible focus ring (primary border)
- Tab order: top → down, left → right
- Enter/Space: activate buttons
- Escape: close modals/drawers

### ARIA

- Tables: `role="table"`, proper thead/tbody structure
- Buttons: descriptive labels, no "click here"
- Status indicators: `aria-live="polite"` for balance/status changes
- Inputs: associated labels via `id`/`for` or `aria-label`

### Color Contrast

- Primary text on dark: 21:1 (WCAG AAA)
- Secondary text: 7:1 (WCAG AA)
- Muted text: 4.5:1 minimum (WCAG AA)

---

## 11. Component File Structure

```
src/components/control-room/
├── ControlRoomPanel.tsx
├── ControlRoomPanel.module.css
├── ControlRoomTable.tsx
├── ControlRoomTable.module.css
├── ControlRoomSectionHeader.tsx
├── ControlRoomSectionHeader.module.css
├── ControlRoomButton.tsx
├── ControlRoomButton.module.css
├── ControlRoomInput.tsx
├── ControlRoomInput.module.css
├── ControlRoomEventLog.tsx
├── ControlRoomEventLog.module.css
├── ControlRoomStatusRail.tsx
├── ControlRoomStatusRail.module.css
└── index.ts (barrel export)
```

---

## 12. Definition of Done (Per Route)

A route is "Control Room compliant" when:

✅ **Uses mandatory two-column layout** (Situation Board | Mission Console)
✅ Uses `RiskShell` + `ControlRoomTopNav`
✅ All panels use `ControlRoomPanel` component
✅ All tables use `ControlRoomTable` component
✅ All buttons use `ControlRoomButton` component
✅ All inputs use `ControlRoomInput` component
✅ Footer uses `ControlRoomStatusRail` component
✅ No hardcoded colors (only semantic tokens)
✅ Typography matches scale (no ad-hoc font sizes)
✅ Copy uses operator terminology
✅ Passes accessibility audit (keyboard nav, ARIA, contrast)

---

## 13. Anti-Patterns (What NOT to Do)

❌ Per-route custom CSS for layout (use primitives)
❌ Hardcoded hex colors in component styles
❌ Mixing fonts (sans + mono must follow grammar)
❌ Consumer language ("user", "dashboard", "settings")
❌ Decorative animations (fade-ins, bounces)
❌ Non-uppercase system chrome text
❌ Primary color used for large fills (only accents)
❌ Breaking the 3-tier grid (header/content/footer)

---

## 14. Reference Implementation

**Source:** `/public/test-norad-terminal-colors.html`
**Compliant Routes:**
- ✅ `/trade` (TradeClient.tsx) - Execute interface with market table + trade form + event log
- ✅ `/markets` (MarketsClient.tsx) - Browse interface with market table + selected market details
- ✅ `/markets/[marketId]` (MarketDetailClient.tsx) - Detail view with market info + composition + actions
- ✅ `/portfolio` (PortfolioClient.tsx) - Portfolio view with position list + selected position details
- ✅ `/intel` (IntelClient.tsx) - Intelligence feeds + risk analysis + execution posture
- ✅ `/about` (about/page.tsx) - Project overview + system specs

**Status:** All authenticated routes now use mandatory two-column Situation Board | Mission Console layout
**Next:** Design review + visual regression tests

---

## 15. Governance

### Pre-Launch

- [ ] Primitives built and approved
- [ ] Pilot route (`/trade`) migrated
- [ ] Design signoff on pilot
- [ ] Visual snapshot baseline captured

### Post-Launch

- [ ] Route contract CI check (all live routes use primitives)
- [ ] Visual regression tests (Playwright snapshots)
- [ ] Quarterly design audit (check for drift)
- [ ] New route checklist (must use Control Room system)

---

**Canonical source:** This spec → Test HTML → Pilot implementation → Roll-out
