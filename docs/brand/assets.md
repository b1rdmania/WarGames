# Assets

## Logo

### Mark

The war.market mark is a flame inside a diamond. It represents conflict, energy, and precision.

Colors:
- X strokes: `#4a4752`
- Outer diamond: `#f97316`
- Inner diamond: `#fbbf24`

### Wordmark

The wordmark is "war.market" set in Inter 600.

The dot is part of the name. It's the domain.

### Usage

| Context | Asset |
|---------|-------|
| Favicon | Mark only, 32px or 64px |
| Header | Wordmark or "war.market" text |
| Social | Full wordmark with mark |
| Dark backgrounds | Default colors |
| Light backgrounds | Avoid (dark mode only) |

### Clear space

Minimum 16px around the logo in any direction.

### Don'ts

- Don't change the colors
- Don't rotate or skew
- Don't add effects (shadows, glows)
- Don't use on busy backgrounds
- Don't stretch or distort

## Downloads

::: info Coming soon
Asset downloads will be available here.
:::

## CSS variables

Copy and paste into your project:

```css
:root {
  /* Backgrounds */
  --bg-deep: #0e0e10;
  --bg-warm: #18171c;
  --bg-surface: #222127;
  --bg-elevated: #2c2a32;

  /* Text */
  --text-primary: #e8e6ed;
  --text-secondary: #a8a3b3;
  --text-muted: #6b6879;
  --text-disabled: #3d3a45;

  /* Borders */
  --border: #37343e;
  --border-subtle: #2a2830;
  --border-focus: #f97316;

  /* Brand */
  --amber: #f97316;
  --gold: #fbbf24;
  --mark-gray: #4a4752;

  /* Functional */
  --profit: #22c55e;
  --loss: #ef4444;
  --warning: #eab308;
  --info: #3b82f6;

  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Tailwind config

```js
colors: {
  'war': {
    'deep': '#0e0e10',
    'warm': '#18171c',
    'surface': '#222127',
    'elevated': '#2c2a32',
  },
  'brand': {
    'amber': '#f97316',
    'gold': '#fbbf24',
  },
  'text': {
    'primary': '#e8e6ed',
    'secondary': '#a8a3b3',
    'muted': '#6b6879',
  },
  'status': {
    'profit': '#22c55e',
    'loss': '#ef4444',
  },
}
```
