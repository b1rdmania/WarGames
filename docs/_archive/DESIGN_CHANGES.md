# Design changes (RiskMarkets landing integration)

## Goal
Replace the “marketing-style” landing UX with the **RiskMarkets-style terminal landing** (strong narrative, one CTA), then drop users straight into the existing Pear trading terminal at `/markets`.

## What changed (files)

### New landing implementation
- **`src/components/RiskLanding.tsx`**
  - New full-screen landing composed to mirror the RiskMarkets `archive/RiskMarkets/index.html` structure:
    - map/glow background + scan line + subtle “SCANNING…” label
    - hero section + single CTA
    - minimal explainer strip
    - minimal footer
- **`src/components/RiskLanding.module.css`**
  - Styles for the above landing.
  - **Important isolation detail**: the “rm-*” CSS variables are defined on `.root` (not `:root`) so they **do not leak globally** into `/markets` or other pages.

### Home route now renders the new landing
- **`src/app/page.tsx`**
  - Swapped from the previous `Hero/Features/MarketPreview` layout to:
    - `return <RiskLanding />`

### App chrome (Navbar) hidden on `/`
- **`src/components/Navbar.tsx`**
  - Converted to a client component and added:
    - `if (pathname === '/') return null;`
  - Result: `/` is a clean full-screen landing; `/markets` keeps the navbar + connect button.

## “Does anything conflict with the existing UX?”

### Old landing components
The previous landing components still exist but are **unused**:
- `src/components/Hero.tsx`
- `src/components/Features.tsx`
- `src/components/MarketPreview.tsx`

There are **no imports** of these in `src/app/page.tsx` anymore, so they can’t “render first” unless reintroduced.

### CSS / styling bleed
The RiskMarkets-style CSS is implemented as a **CSS module** (`RiskLanding.module.css`) and is only applied while `RiskLanding` is mounted on `/`.

The only selector that could have caused cross-route issues was `:root` variables (global). This was avoided by scoping the variables to the landing container (`.root`), so `/markets` retains its existing Pear styling.

## UX behavior change summary
- **Before**: `/` showed the Pear-branded landing with multiple sections and wallet CTAs.
- **After**: `/` is a narrative landing with a single “LAUNCH APP” CTA.
- **Flow**: `/` → **LAUNCH APP** → `/markets` (existing trading terminal).

## Known intentional differences vs the archived RiskMarkets landing
- The archived landing uses a full-screen MP4 background and an SVG map overlay asset. We recreated the vibe without bundling those assets into `public/` to keep the deploy lightweight.
- If you want the *exact* video hero, we can add:
  - `public/landing-hero.mp4` (or similar) and render it in `RiskLanding.tsx`.

