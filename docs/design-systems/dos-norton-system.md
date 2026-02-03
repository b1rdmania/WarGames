# System A: DOS/Norton operator terminal

## Historical DNA

- Character-cell thinking: strict grids, hard separators, no decorative chrome.
- Function-key command bars: explicit shortcuts and deterministic actions.
- Dense information in bounded regions.

## Brand fit for war.market

Best for degen/operator energy, speed, and "tool not toy" clarity.

## Token direction

- Background: near-black (`#0b0c0e`)
- Panel: dark graphite (`#121417`)
- Primary signal: lime (`#02ff81`)
- Warning: amber (`#f5a524`)
- Loss: red (`#ff5a5a`)
- Text main: light gray (`#d3d7dd`)
- Text secondary: medium gray (`#8a9099`)

## Typography

- UI labels, values, status: mono only
- Long-form copy/help: compact sans fallback
- Uppercase reserved for controls and system states only

## Spatial grammar

- 8px baseline grid
- Hard panel edges (0-2px radius)
- 1px dividers define zones
- Avoid floating cards; prefer docked panes

## Component grammar

- Top: command ribbon (`F1 Help | F2 Markets | F3 Trade | F4 Portfolio`)
- Left: thesis/market list
- Center: market detail and pair composition
- Right: bet slip with one dominant action key
- Bottom: status line ("THESIS ARMED", "EXECUTION ACCEPTED")

## Interaction rules

- Keyboard-first parity with mouse/touch
- Every action has a verb-based label (Arm, Execute, Unwind)
- Disabled states explain why in plain text
- Selection is shown by both color and border marker

## Mobile adaptation

- Replace multi-pane with stacked zones in same order
- Sticky bottom action rail
- Command ribbon becomes segmented control

## Motion and effects

- Minimal transitions (100-150ms)
- No parallax, no hero video
- Optional subtle scanline at <3% opacity

## Anti-patterns

- Rounded everything
- Centered marketing hero as primary interaction
- Decorative iconography without state meaning

## Signature pattern

Persistent command ribbon with keyboard hints mirrored in clickable controls.
