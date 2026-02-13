# Terminal Design System Specification

**Status:** Canonical Reference (Production Default)
**Source:** `src/components/terminal/`
**Last Updated:** 2026-02-13

---

## 1. System Philosophy

Terminal is a **DOS/command-line interface** aesthetic combining:
- Classic terminal/DOS visual language (bright green on pure black, monospace)
- Three-column directory structure (Directory | Console | Ticket)
- Function-key command bar navigation (F1-F10)
- Keyboard-first interaction model

**Core Principle:** Pure information density with terminal clarity. Every element serves data display or action execution.

---

## 2. Layout Anatomy

### Mandatory Three-Column Structure

**ALL production routes MUST use this layout:**

```
┌─────────────────────────────────────────────────────┐
│ Navigation Bar (TerminalNav)                        │ 48px fixed
├─────────────────────────────────────────────────────┤
│ Menu Bar (Optional)                                 │ 32px fixed
├──────────────┬──────────────────┬───────────────────┤
│              │                  │                   │
│ DIRECTORY    │ CONSOLE          │ TICKET/ACTIONS    │ flex: 1
│ (Left)       │ (Center)         │ (Right)           │
│ 280px fixed  │ 1fr flexible     │ 320px fixed       │
│              │                  │                   │
├──────────────┴──────────────────┴───────────────────┤
│ Command Bar (F-key shortcuts)                       │ 32px fixed
├─────────────────────────────────────────────────────┤
│ Status Bar                                          │ 32px fixed
└─────────────────────────────────────────────────────┘
```

**Layout Pattern by Page Type:**

| Page Type | Directory (Left) | Console (Center) | Ticket (Right) |
|-----------|------------------|------------------|----------------|
| Browse (`/markets`) | Market directory | Selected market details | Actions |
| Detail (`/markets/[id]`) | Market intelligence | Index composition | Trade actions |
| Execute (`/trade`) | Market directory | Thesis console | Execution ticket |
| Portfolio (`/portfolio`) | Position directory | Position details | Portfolio summary |
| Intel (`/intel`) | Intelligence feeds | Risk analysis | Execution posture |
| About (`/about`) | Project overview | System specs | Actions |

**The three-column structure is NOT optional.** Every page uses Directory | Console | Ticket.

### Grid Rules

- **Desktop:** `grid-template-columns: 280px 1fr 320px` (directory | console | ticket)
- **Tablet/Mobile:** `grid-template-columns: 1fr` (stack vertically)
- **Breakpoint:** 980px

### Spacing System

| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | Tight gaps |
| `sm` | 8px | Label→value spacing |
| `md` | 12px | Internal padding |
| `lg` | 16px | Panel padding |
| `xl` | 20px | Section gaps |

---

## 3. Component Rules

### TerminalShell

**Anatomy:**
```tsx
<TerminalShell
  menuBar={<TerminalMenuBar items={['FILE', 'EDIT', 'VIEW']} />}
  leftPane={<>Directory content</>}
  centerPane={<>Console content</>}
  rightPane={<>Ticket content</>}
  commandBar={<TerminalCommandBar commands={[...]} />}
  statusBar={<TerminalStatusBar items={[...]} />}
/>
```

**Features:**
- Automatically includes TerminalNav
- Handles 3-column grid layout
- Responsive stacking on mobile

### TerminalNav

**Anatomy:**
```tsx
// Auto-included in TerminalShell, not manually added
```

**Features:**
- Active link detection via usePathname()
- Integrated music controls on right
- Brand on left, links in center

**Styling:**
- Background: `#080a0c`
- Border-bottom: 1px `#1f3e2f`
- Active link: `#02ff81` color

### TerminalPaneTitle

**Anatomy:**
```tsx
<TerminalPaneTitle>SECTION TITLE</TerminalPaneTitle>
```

**Styling:**
- Font: 10px, uppercase, 0.1em tracking
- Color: `#02ff81`
- Margin-bottom: 12px
- Padding-bottom: 8px
- Border-bottom: 1px `#1f3e2f`

### TerminalButton

**Variants:**
1. **Primary:** Green background, black text
2. **Default:** Dark background with green border

**Anatomy:**
```tsx
<TerminalButton variant="primary" fullWidth>
  EXECUTE
</TerminalButton>
```

**Styling:**
- Font: monospace, 12px, uppercase, 0.08em tracking
- Padding: 12px 20px
- Border: 1px solid
- Border-radius: 0 (sharp edges)
- Transition: all 0.15s

**Primary:**
```css
background: #02ff81;
border-color: #02ff81;
color: #080a0c;
```

**Default:**
```css
background: #080a0c;
border-color: #1f3e2f;
color: #dfe9e4;

&:hover {
  border-color: #02ff81;
  color: #02ff81;
}
```

### TerminalKV (Key-Value Pairs)

**Anatomy:**
```tsx
<TerminalKV>
  <TerminalKVRow label="ENGINE" value="PEAR PROTOCOL" />
  <TerminalKVRow label="STATE" value="LIVE" />
</TerminalKV>
```

**Styling:**
- Display: grid, gap 8px
- Label: 10px, uppercase, `#8da294`
- Value: 13px, `#dfe9e4`

### TerminalMarketList / TerminalMarketRow

**Anatomy:**
```tsx
<TerminalMarketList>
  <TerminalMarketRow
    label="TAIWAN STRAIT"
    active={selected === 'taiwan-strait'}
    onClick={() => setSelected('taiwan-strait')}
  />
</TerminalMarketList>
```

**Styling:**
- List: border 1px `#1f3e2f`
- Row: padding 10px 12px, cursor pointer
- Active row: background `#0d1210`, border-left 2px `#02ff81`
- Hover: background `#0d1210`

### TerminalSegment

**Anatomy:**
```tsx
<TerminalSegment>
  <button className={styles.segmentBtn} data-active={side === 'long'}>
    YES (LONG)
  </button>
  <button className={styles.segmentBtn} data-active={side === 'short'}>
    NO (SHORT)
  </button>
</TerminalSegment>
```

**Styling:**
- Container: display flex, border 1px `#1f3e2f`
- Button: flex 1, padding 10px, background `#080a0c`
- Active: background `#0d1210`, color `#02ff81`, border-left 2px `#02ff81`

### TerminalCommandBar

**Anatomy:**
```tsx
<TerminalCommandBar
  commands={[
    { key: 'F1', label: 'HELP' },
    { key: 'F2', label: 'MARKETS' },
    { key: 'F5', label: 'REFRESH' },
  ]}
/>
```

**Styling:**
- Background: `#0d1210`
- Border-top: 1px `#1f3e2f`
- Item: display inline, margin-right 12px
- Key: background `#1f3e2f`, padding 2px 6px, color `#02ff81`
- Label: color `#9bb7a9`

### TerminalStatusBar

**Anatomy:**
```tsx
<TerminalStatusBar
  items={[
    { label: 'MODE', value: 'LIVE' },
    { label: 'STATE', value: 'ARMED' },
  ]}
/>
```

**Styling:**
- Background: `#080a0c`
- Border-top: 1px `#1f3e2f`
- Item: display inline, margin-right 20px
- Label: 10px, color `#8da294`
- Value: 10px, color `#02ff81`

---

## 4. Typography Scale

### Font Families

- **Mono (All Text):** JetBrains Mono, 'SF Mono', 'Courier New', monospace

### Scale

| Purpose | Size | Weight | Tracking | Transform |
|---------|------|--------|----------|-----------|
| Pane Title | 10px | 600 | 0.1em | UPPERCASE |
| Title | 16px | 600 | 0.08em | UPPERCASE |
| Thesis | 13px | 400 | 0 | none |
| KV Label | 10px | 400 | 0.08em | UPPERCASE |
| KV Value | 13px | 400 | 0 | none |
| Button | 12px | 600 | 0.08em | UPPERCASE |
| Market Row | 11px | 500 | 0.06em | UPPERCASE |
| Command Key | 10px | 600 | 0 | UPPERCASE |
| Status Item | 10px | 400 | 0.08em | UPPERCASE |

---

## 5. Color Roles

### Semantic Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--bg-deep` | #080a0c | Page background, deep panels |
| `--bg-surface` | #0d1210 | Elevated panels, hover states |
| `--bg-elevated` | #111 | Input backgrounds |
| `--text-primary` | #dfe9e4 | Primary text |
| `--text-secondary` | #a8b4af | Secondary text |
| `--text-muted` | #8da294 | Labels, muted content |
| `--border` | #1f3e2f | Panel borders, dividers |
| `--primary` | #02ff81 | Accent color (Pear green) |
| `--primary-hover` | #00e070 | Hover states |

**Note:** Terminal theme uses pure monochrome + single accent color (#02ff81).

### Color Usage Rules

- **Primary accent:** For active states, borders, CTAs, labels
- **Text hierarchy:** #dfe9e4 → #a8b4af → #8da294 (primary → secondary → muted)
- **Backgrounds:** #080a0c → #0d1210 → #111 (deep → surface → elevated)

---

## 6. Interaction States

### Hover

- Market rows: background → `#0d1210`
- Buttons: border → `#02ff81`
- Links: color → `#02ff81`

### Focus

- All interactive elements: `outline: 2px solid #02ff81`, `outline-offset: 2px`

### Active

- Market row: border-left 2px `#02ff81`, background `#0d1210`
- Button: no transform (DOS aesthetic is static)

### Disabled

- Opacity: 0.4
- Cursor: not-allowed

---

## 7. Responsive Behavior

### Breakpoints

- **Desktop:** > 980px (full 3-column layout)
- **Mobile:** < 980px (stack to single column)

### Column Order (Mobile)

1. Directory (left pane)
2. Console (center pane)
3. Ticket (right pane)

---

## 8. Copy Tone

### Voice

- **Uppercase chrome:** All system labels, buttons, section titles
- **Sentence case content:** Descriptions, theses, body text
- **Terminal brevity:** Short, direct labels
- **Operator language:** Same as Control Room (ARMED, STANDBY, EXECUTE)

### Terminology

| Context | Term |
|---------|------|
| Left column | Directory |
| Center column | Console |
| Right column | Ticket |
| Navigation | Command bar |
| Footer | Status bar |

---

## 9. Animation

### Transitions

- **Fast:** 0.15s (hover, focus)
- **Medium:** 0.3s (panel changes)

### Easing

- **Default:** ease

### Effects to Avoid

- No fade-ins (terminal is always on)
- No slide animations (static grid)
- No bounce (terminal is utilitarian)

---

## 10. Component File Structure

```
src/components/terminal/
├── TerminalShell.tsx
├── TerminalNav.tsx
├── TerminalMenuBar.tsx
├── TerminalPaneTitle.tsx
├── TerminalCommandBar.tsx
├── TerminalStatusBar.tsx
├── TerminalButton.tsx
├── TerminalSegment.tsx
├── TerminalSizeRow.tsx
├── TerminalNote.tsx
├── TerminalTitle.tsx
├── TerminalThesis.tsx
├── TerminalKV.tsx
├── TerminalKVRow.tsx
├── TerminalMarketList.tsx
├── TerminalMarketRow.tsx
├── terminal.module.css
└── index.tsx (barrel export)
```

---

## 11. Definition of Done (Per Route)

A route is "Terminal compliant" when:

✅ **Uses mandatory three-column layout** (Directory | Console | Ticket)
✅ Uses `TerminalShell` wrapper (includes TerminalNav automatically)
✅ Provides `menuBar`, `leftPane`, `centerPane`, `rightPane`, `commandBar`, `statusBar` props
✅ All pane titles use `TerminalPaneTitle` component
✅ All buttons use `TerminalButton` component
✅ All key-value pairs use `TerminalKV` / `TerminalKVRow` components
✅ No hardcoded colors (only semantic tokens from terminal.module.css)
✅ Typography uses monospace only (JetBrains Mono / SF Mono)
✅ Uppercase for all chrome labels
✅ Passes accessibility audit (keyboard nav, focus states, contrast)

---

## 12. Reference Implementation

**Compliant Routes:**
- ✅ `/` - Landing (uses TerminalShell with hero layout)
- ✅ `/markets` - Browse (MarketsClient.tsx)
- ✅ `/markets/[marketId]` - Detail (MarketDetailClient.tsx)
- ✅ `/trade` - Execute (TradeClient.tsx)
- ✅ `/portfolio` - Portfolio (PortfolioClient.tsx)
- ✅ `/intel` - Intelligence (IntelClient.tsx)
- ✅ `/about` - About (about/page.tsx)
- ✅ `/gtm` - GTM Brief (gtm/page.tsx)

**Status:** ALL production routes use Terminal system as of 2026-02-13

---

## 13. Anti-Patterns (What NOT to Do)

❌ Using Control Room primitives (ControlRoomTopNav, RiskShell with nav prop)
❌ Per-route custom CSS for layout (use Terminal primitives)
❌ Hardcoded hex colors in component styles
❌ Mixing non-monospace fonts
❌ Lowercase system chrome text (buttons, labels, titles must be uppercase)
❌ Breaking the 3-column grid structure

---

## 14. Migration from Control Room

If migrating a page from Control Room to Terminal:

1. **Replace RiskShell + ControlRoomTopNav** with TerminalShell (nav auto-included)
2. **Map 2-column to 3-column:**
   - Situation Board → Directory (left) + Console (center)
   - Mission Console → Ticket (right)
3. **Replace primitives:**
   - ControlRoomPanel → TerminalPaneTitle + content divs
   - ControlRoomButton → TerminalButton
   - ControlRoomStatusRail → TerminalStatusBar
4. **Update color tokens** from Control Room palette to Terminal palette
5. **Ensure all chrome is uppercase**

---

## 15. Governance

### Current Status

- ✅ All production routes migrated to Terminal system
- ✅ Terminal primitives complete and approved
- ✅ Default theme set to 'terminal' in theme registry

### Maintenance

- [ ] Visual regression tests (Playwright snapshots)
- [ ] Route contract CI check (all routes use TerminalShell)
- [ ] Quarterly design audit
- [ ] New route checklist enforcement

---

**Canonical source:** This spec → Terminal primitives → Production routes
