# NORAD iteration brief

## Intent

Push the NORAD direction from "cool control-room vibe" to a coherent operator system:

- clear situational awareness
- explicit action states
- deterministic event telemetry
- high readability under pressure

## Structural upgrades

1. Situation board must show real state, not just decoration.
   - world map grid with active hotspots tied to selected thesis
   - side markers for market regime (LIVE/WATCH/PAUSED)
2. Event log must be severity-scoped.
   - lanes: INFO, ALERT, EXEC, FAIL
   - consistent timestamp width to support scan reading
3. Mission console must enforce mode transitions.
   - idle -> armed -> execute
   - clear blocked/disabled logic with reasons
4. Footer rail stays persistent.
   - mode, bias, data freshness, latency

## Color semantics (locked roles)

- Cyan: telemetry and structural system chrome
- Lime: armed and execute states
- Amber: warning and elevated spread
- Red: fault/fail/critical
- Violet: intelligence/meta channel only (never primary CTA)

## Typography and spacing

- Mono for time, status, logs, and values
- Sans for headlines and narrative text
- 8px spacing rhythm
- Uppercase reserved for system labels and state badges

## Motion and performance

- no cinematic background video in workflow screens
- low-opacity grid/noise only
- transitions 100-150ms, state-first
- keep effects layered lightly for mobile GPU safety

## Accessibility gates

- every state encoded with text + color
- visible focus styles on all interactive controls
- minimum 44px tap targets on mobile
- WCAG AA contrast on body text and critical controls

## Component acceptance criteria

### Situation board
- selected thesis changes hotspots and board state label
- no purely decorative overlays

### Event log
- each entry includes timestamp, severity badge, and message
- severity colors consistent with global role map

### Mission console
- execute disabled until armed
- state label always visible at top of console

### Footer rail
- always visible and updates with mode + freshness

## Implementation sequence

1. lock token roles
2. update NORAD lab visuals
3. implement interaction/state logic
4. test mobile behavior
5. port into `/trade` as production candidate
