# System C: NORAD situation room

## Historical DNA

- Mission-control zoning: overview, event stream, action console.
- High-contrast instrument panels with threat/state emphasis.
- Operator workflow centered on situational awareness before action.

## Brand fit for war.market

Best for memorability and "trade global tension" narrative clarity.

## Token direction

- Background: blackened navy (`#0a0f14`)
- Surface: steel blue-black (`#121a22`)
- Grid lines: `#243242`
- Primary signal: electric cyan (`#36d4ff`)
- Active/armed: lime (`#02ff81`)
- Warning: amber (`#f59e0b`)
- Loss/error: red (`#ff5c6a`)
- Text main: `#dbe7f2`
- Text secondary: `#8aa0b5`

## Typography

- Display: condensed sans for headings
- Operational text: mono for logs, values, and statuses
- Sentence case for readability; uppercase reserved for state badges

## Spatial grammar

- Three-zone layout:
  - Situation board (thesis and market map)
  - Event log timeline
  - Execution console
- Sharp outer frames, slightly rounded controls (6px)
- Strong left-edge state markers per module

## Component grammar

- Situation board: active thesis, pair composition, risk regime
- Event log: timestamped operational feed (auth, quote, submit, fill)
- Execution console: YES/NO, size, max risk, execute button
- Footer status bar: mode, latency, data freshness

## Interaction rules

- "Arm before execute" as explicit step
- Every critical action logs a corresponding event
- Critical states require both icon and text label
- Fallback state when data is stale is explicit and blocking

## Mobile adaptation

- Situation board condenses to a thesis card with key metrics
- Event log collapses to latest 3 events + expand
- Execution console stays persistent at bottom

## Motion and effects

- Low-opacity grid/noise only
- No autoplay cinematic background in core workflow
- Alert pulse used only for blocking states

## Anti-patterns

- Fake radar animations with no product meaning
- Excess neon glow reducing legibility
- Animated backgrounds behind input controls

## Signature pattern

Event log and execution console stay visible together so users always see cause and effect.
