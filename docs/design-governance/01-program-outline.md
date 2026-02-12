# WAR.MARKET Theme Coherence Program Outline

## 1. Objective

Raise design coherence from mixed-system drift to a controlled multi-theme architecture while preserving active exploration.

Target state:

- Three active themes only: `terminal`, `geocities`, `norad`.
- One shared product core for data, state, and trading flows.
- Theme differences isolated to presentation and interaction grammar.

## 2. Problem Statement

Current repo state mixes:

- legacy amber/warm token system,
- NORAD production surfaces,
- experimental lab systems,
- new GeoCities theme layer.

This creates ambiguity in where new work should be built, increasing drift and slowing development.

## 3. Program Scope

In scope:

- Theme architecture and naming normalization.
- Token ownership and style boundaries.
- Route policy for production vs labs.
- Governance, linting, and CI checks.

Out of scope:

- New product features.
- Trading logic redesign.
- Content strategy changes not required for theme coherence.

## 4. Principles

1. Shared logic, isolated presentation.
2. One source of truth for active themes.
3. Labs are explicit experiments, not de facto production.
4. No silent fallback to legacy styles.
5. Every page declares which theme contract it implements.

## 5. Desired Developer Experience

A new developer should answer in under 5 minutes:

1. What themes are active?
2. Where are tokens defined for each theme?
3. Which routes are production vs experimental?
4. Where can new UI be added without causing drift?

## 6. Workstreams

### W1. Theme Registry and Naming

- Rename DOS/Norton references to `Terminal`.
- Create one canonical `ThemeId` registry.
- Define supported themes and metadata in one place.

### W2. Token and Styling Boundaries

- Move theme tokens into per-theme files.
- Reduce `globals.css` to base/reset/shared primitives only.
- Remove legacy token ambiguity from active paths.

### W3. Route and Surface Policy

- Production routes run on selected primary theme.
- Labs routes host side-by-side experiments.
- Archive non-active themes (example: Bloomberg if not retained).

### W4. Governance and Enforcement

- Add lint restrictions for banned legacy imports.
- Add CI checks for allowed theme IDs only.
- Add documentation guardrails and PR checklist.

## 7. Phases and Milestones

### Phase 0 - Baseline Audit (1 day)

- Inventory all theme usages and token sources.
- Mark each page as production/lab/archive.

Deliverable:

- Theme usage matrix.

### Phase 1 - Architecture Foundation (1-2 days)

- Add `ThemeId` registry.
- Wire `ThemeContext` to canonical theme IDs.
- Add theme routing helper and shared contracts.

Deliverable:

- Build passes with registry integrated.

### Phase 2 - Style System Split (2-3 days)

- Extract tokens into `src/themes/{terminal,geocities,norad}`.
- Remove token duplication from global styles.
- Align NORAD values to canonical doc.

Deliverable:

- No active route imports legacy token aliases.

### Phase 3 - Route Coherence (1-2 days)

- Rename DOS/Norton path and labels to Terminal.
- Ensure labs index reflects only active experimental themes.
- Move archived systems under archive namespace.

Deliverable:

- Clean route map and unambiguous naming.

### Phase 4 - Enforcement and Documentation (1 day)

- Lint/CI policy in place.
- Developer docs and PR checklist shipped.

Deliverable:

- Coherence checks run in CI.

## 8. Success Criteria

1. Only `terminal`, `geocities`, `norad` are active theme IDs.
2. Each active route is mapped to exactly one theme contract.
3. No production route imports archived/legacy theme files.
4. Token definitions are single-sourced per active theme.
5. New developer onboarding time for theme model is under 5 minutes.

## 9. Risks and Mitigations

Risk: migration breaks visual consistency temporarily.
Mitigation: migrate by route group and use visual snapshots per phase.

Risk: experimental velocity drops.
Mitigation: keep labs fully active; enforce only production boundaries.

Risk: hidden legacy dependencies.
Mitigation: add lint and grep-based CI checks before merge.

## 10. Ownership Model

- Technical owner: frontend lead.
- Review owner: product/design lead.
- CI owner: repo maintainer.

Decision protocol:

- Theme additions/removals require design-governance review.
- Route-level theme changes require explicit PR label and checklist completion.

