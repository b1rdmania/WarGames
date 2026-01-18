## WAR.MARKET — Terminal Content Pages Design Spec (About / Deck / Portfolio)

This spec defines **content-page layout primitives** that match the archived RiskMarkets “terminal briefing” vibe:
- Big typographic hierarchy
- Clean section dividers
- “Document-like” spacing
- Asterisk bullets
- Subtle neon-glow borders (not noisy)

Goal: make **About**, **Deck**, and **Portfolio** feel like one system **without touching trading logic**.

---

## Principles

- **One screen = one thought**
  - Hero headline + 1–2 lines of meaning.
  - Avoid long paragraphs; use short, punchy blocks.
- **Terminal document rhythm**
  - Section headers, dividers, then content.
  - Lists > paragraphs.
- **Color semantics**
  - **Lime** = “truth / primary / action”
  - **Red** = “risk / failure mode / SHORT”
  - **Gray** = supporting text
- **Always legible under stress**
  - Favor spacing and hierarchy over ornament.

---

## Layout Primitives (CSS utilities)

These are implemented in `src/app/globals.css`:

- **`.tp-wrap`**
  - Standard page width (max 1200) + horizontal padding.
- **`.tp-frame`**
  - Terminal “document” container (border + dark glass + generous padding).
- **`.tp-hero`**
  - Top region inside frame; title + lede.
- **`.tp-title`**
  - Big lime headline (uppercase + tracking).
- **`.tp-lede`**
  - Larger gray summary line(s).
- **`.tp-rule`**
  - Divider line (subtle lime).
- **`.tp-section`**
  - Section block spacing.
- **`.tp-h`**
  - Section header (lime, tracked).
- **`.tp-body`**
  - Default body text sizing/leading for “terminal prose”.
- **`.tp-bullets`**
  - Asterisk bullet list.
- **`.tp-kv`**
  - Key/value row list for “engine” and “links”.

---

## About Page Pattern

Inside `.tp-frame`:

1) **Hero**
- `.tp-title`: “ABOUT WAR.MARKET”
- `.tp-lede`: 1–2 line tagline

2) **Sections**
- Problem / Response / Markets / How it works
- Use `.tp-bullets` for steps
- Use small callout/kv blocks for Engine + Links

---

## Deck Pattern

Deck is a “classified briefing” variant:

- Same `.tp-frame` but **taller** (`min-height`) and centered
- Top line is kicker + slide counter
- Slide title is `.tp-title` sized per slide
- Content uses `.tp-body` + `.tp-bullets`

---

## Portfolio Pattern (CSS-only)

We don’t change portfolio logic. We apply the look by enhancing shared primitives:

- `tm-box` gets a more “panel” feel (subtle inset glow and top edge highlight).
- Existing `.pear-border bg-black/40` panels should visually match `.tp-frame`.

---

## Do / Don’t

- **Do**: make headers big, keep lines short, use dividers and lists.
- **Don’t**: add more UI chrome, gradients, or extra widgets.

