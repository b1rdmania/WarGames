# Typography Roles (KISS)

This project uses a strict 3-role typography system to avoid inconsistent font drift across pages.

## Roles

- `--font-display`
  - Use for chrome and section headers only.
  - Examples: nav labels, pane titles, section labels, major titles.

- `--font-sans`
  - Use for narrative/body copy and links.
  - Examples: explanatory paragraphs, long-form text blocks.

- `--font-mono`
  - Use for numeric/data/UI control surfaces.
  - Examples: market rows, key-value data, form controls, status bars.

## Current Implementation

- Terminal system primitives: `/src/components/terminal/terminal.module.css`
  - Base page copy defaults to `--font-sans`.
  - Display typography is applied to chrome (`.nav`, `.header`, `.menu`, `.paneTitle`, `.title`).
  - Data/control surfaces use `--font-mono` (`.marketRow`, `.kv > div`, `.segment button`, `.sizeRow button`, `.action`, `.actionPrimary`, `.note`, `.commandBar`, `.statusBar`).

- About page subsection styles: `/src/app/about/about.module.css`
  - Section labels/captions use `--font-display`.
  - Body/link text uses `--font-sans`.

## Rules For New Pages

1. Do not rely on accidental inheritance for typography role-critical blocks.
2. Pick a role (`display`/`sans`/`mono`) per block and set it explicitly.
3. Keep inline styles typography-light:
   - avoid inline `fontFamily` unless there is no class-based path.
4. If a page uses terminal panes, prefer reusing terminal typography classes rather than ad hoc styles.

## Review Checklist

- Headers look distinct from body copy.
- Body copy is readable at normal zoom (desktop + iOS).
- Data rows and controls retain fixed-width predictability.
- No page mixes all three roles randomly in one subsection.
