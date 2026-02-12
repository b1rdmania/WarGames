# Technical Implementation Specification: Theme Coherence Refactor

## 1. Purpose

Define exact engineering work to establish a coherent three-theme architecture in WAR.MARKET.

Active themes after refactor:

- `terminal`
- `geocities`
- `norad`

## 2. Current Constraints

- Theme naming is inconsistent (`dos-norton` vs `terminal` language).
- `ThemeContext` currently omits `norad`.
- Global CSS contains mixed legacy and NORAD tokens.
- Labs and docs are not synchronized as a single policy surface.

## 3. Target Architecture

## 3.1 Directory Contract

Add and standardize:

```text
src/
  themes/
    index.ts
    terminal/
      tokens.css
      adapter.tsx
    geocities/
      tokens.css
      adapter.tsx
    norad/
      tokens.css
      adapter.tsx
  contexts/
    ThemeContext.tsx
  components/
    theme-runtime/
      ThemeProviderShell.tsx
      ThemeSwitcher.tsx
```

Keep labs:

```text
src/app/labs/terminal
src/app/labs/geocities
src/app/labs/norad
```

Archive (if not active):

```text
src/app/labs/_archive/bloomberg
docs/_archive/design-systems/bloomberg
```

## 3.2 Canonical Theme Registry

File: `src/themes/index.ts`

Required API:

```ts
export type ThemeId = 'terminal' | 'geocities' | 'norad';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  route: `/labs/${string}`;
  status: 'active';
}

export const THEMES: Record<ThemeId, ThemeMeta>;
export const DEFAULT_THEME: ThemeId;
```

Rules:

- No hardcoded theme strings outside this file except test fixtures.
- Labs index and switchers must derive from `THEMES`.

## 4. Refactor Plan

## 4.1 Naming and Routing

1. Rename `dos-norton` lab route to `terminal`.
2. Keep temporary redirect from `/labs/dos-norton` to `/labs/terminal`.
3. Update labels in labs index and docs.

Acceptance:

- `grep` for `dos-norton` returns only archive or redirect references.

## 4.2 ThemeContext Upgrade

Update `src/contexts/ThemeContext.tsx`:

- `Theme = 'terminal' | 'geocities' | 'norad'`
- persisted value validation against registry.
- `setTheme(themeId)` API in addition to toggle.

Acceptance:

- any active theme can be selected and persisted.

## 4.3 Token Isolation

1. Move theme tokens from `globals.css` into per-theme token files.
2. Reduce `globals.css` to:
   - reset
   - spacing/utility primitives not tied to specific brand language.
3. Ensure token names do not conflict cross-theme unless intentionally shared.

Acceptance:

- no active brand tokens duplicated across global and theme files.

## 4.4 Adapter Boundary

Create adapter components that map shared data to theme UI:

- `Terminal*Surface`
- `GeoCities*Surface`
- `Norad*Surface`

Shared core logic remains in:

- hooks,
- state containers,
- domain service layers.

Acceptance:

- same data contract renders in all three themes with no logic fork.

## 4.5 Product Route Policy

Add route-level mapping config:

```ts
export const ROUTE_THEME_POLICY = {
  '/trade': 'norad',
  '/portfolio': 'norad',
  '/intel': 'norad',
  '/labs': 'system-index',
} as const;
```

If experimentation mode is enabled, product route theme may be overridden by query/cookie with explicit fallback.

Acceptance:

- route theme selection is deterministic and documented.

## 4.6 Archive Policy

Archive any non-active systems:

- move code under `_archive`,
- add headers: `DEPRECATED - DO NOT IMPORT`.

Acceptance:

- active code paths have zero imports from archive directories.

## 5. Tooling and Enforcement

## 5.1 ESLint Restrictions

Add `no-restricted-imports` rules:

- disallow imports from `src/_archive/**` and archived labs in active routes.
- disallow importing token files directly except via theme adapter/runtime entrypoint.

## 5.2 CI Guard Script

Add script `scripts/check-theme-coherence.sh`:

- verify only allowed `ThemeId` values used.
- detect forbidden tokens in active files.
- detect archived imports.

Run in CI before tests/build.

## 5.3 PR Checklist

Add to PR template:

- [ ] route has explicit theme ownership.
- [ ] no legacy/archived imports.
- [ ] tokens changed in correct theme file only.
- [ ] screenshot evidence for all three themes if shared component changed.

## 6. Migration Sequencing

## Sprint A: Foundation

1. Add registry.
2. Update context.
3. Rename route and labels.
4. Keep behavior unchanged otherwise.

## Sprint B: Token Split

1. Extract per-theme tokens.
2. Remove conflicting global tokens.
3. Patch component imports.

## Sprint C: Enforcement

1. Add lint restrictions.
2. Add CI checks.
3. Finalize docs and archive policy.

## 7. Validation Checklist

Technical:

- `npm run lint` passes.
- `npm run build` passes.
- CI coherence script passes.

Behavioral:

- `/labs/terminal`, `/labs/geocities`, `/labs/norad` all render.
- Theme switching persists across reload.
- `/trade` and `/portfolio` render expected production theme.

Governance:

- documentation points to one active architecture.
- archived systems are clearly isolated.

## 8. Deliverables

Required commit groups:

1. `theme-registry-and-routing`
2. `theme-context-and-token-split`
3. `archive-and-enforcement`
4. `docs-and-pr-checklist`

Each commit group should be independently buildable.

## 9. Definition of Done

Coherence target is met when:

1. Active theme set is explicit and enforced.
2. Theme logic and domain logic are separated.
3. Naming and routes match product language (`terminal`, `geocities`, `norad`).
4. New developer can follow documented workflow without guessing.

