# White Paper: Structured Multi-Theme Development for WAR.MARKET

## Abstract

WAR.MARKET is currently operating with both intentional design exploration and unintentional style drift. This white paper proposes a controlled multi-theme model that preserves experimentation (`terminal`, `geocities`, `norad`) while eliminating ambiguity in production implementation. The proposal introduces a hard boundary between domain logic and theme presentation, a canonical theme registry, and policy-driven enforcement through documentation and CI.

## 1. Background

The product evolved through:

- a legacy warm/amber visual layer,
- NORAD-oriented production surfaces,
- lab archetypes (DOS/Norton, Bloomberg, NORAD),
- and newly integrated GeoCities effects and assets.

This growth pattern is normal for hackathon-speed development, but it creates a systems problem: developers cannot reliably infer where to place new UI work, which token system to use, or whether a page is production or exploratory.

## 2. Core Thesis

The issue is not "too many themes." The issue is "no operating model for themes."

A coherent multi-theme system requires:

1. Controlled set of active themes.
2. Shared product core independent of theme.
3. Explicit lifecycle states for themes (active, lab, archived).
4. Enforced boundaries in code and CI.

Without these controls, every new feature compounds design debt.

## 3. Design Governance Model

### 3.1 Theme Lifecycle States

- `active`: supported, buildable, and approved for product/lab use.
- `lab`: experimental, not used by default product routes.
- `archived`: read-only reference, blocked from active imports.

For WAR.MARKET:

- Active set: `terminal`, `geocities`, `norad`.
- Bloomberg should be explicitly retained as lab or moved to archived. It should not remain ambiguous.

### 3.2 Product vs Lab Responsibility

- Product routes prioritize a selected primary theme.
- Lab routes provide comparative prototypes under controlled conditions.
- Product should not accidentally become a lab index unless intentionally configured.

### 3.3 Single Source of Truth

A canonical theme registry is the governance anchor. Every route, context, and UI adapter derives from this registry. If a theme is not in registry, it is not a valid runtime choice.

## 4. Architectural Position

### 4.1 Presentation Adapters

Theme implementations should be adapters over shared domain contracts, not independently evolving screens.

Implication:

- data hooks, pricing, auth, trading state, and validation stay shared.
- only component skin/grammar changes by theme.

### 4.2 Token Ownership

Each active theme owns its token file and component style modules.

Global stylesheet responsibilities:

- reset,
- typography primitives,
- utility classes with no brand meaning.

Global stylesheet should not own competing brand systems.

## 5. Why This Works

This model improves:

1. **Velocity**: developers add one feature once, then expose it via theme adapters.
2. **Quality**: fewer accidental token collisions and route-level visual regressions.
3. **Decision clarity**: experimentation stays measurable because themes use identical data and flows.
4. **Onboarding**: developers get an explicit architecture map.

## 6. Tradeoffs

### Costs

- upfront migration effort,
- temporary friction while splitting tokens and adapters,
- stricter review requirements for theme-related PRs.

### Benefits

- lower long-term maintenance,
- fewer regressions,
- better execution confidence during fast iteration,
- easier transition from experimentation to production standardization.

## 7. Measurement Framework

Coherence should be treated as an engineering KPI:

- percentage of routes with explicit theme ownership.
- count of banned legacy imports in active paths.
- number of duplicate token definitions.
- onboarding time to correct contribution.
- visual regression incidents per release.

## 8. Recommended Outcome

Adopt controlled three-theme development immediately:

- `terminal`, `geocities`, `norad` as active options.
- strict archive policy for non-active systems.
- explicit code boundaries and CI checks.

This keeps your experimentation strategy intact while converting current design sprawl into a manageable architecture.

## 9. Conclusion

WAR.MARKET does not need fewer ideas. It needs stronger structure around those ideas.

The proposed model keeps your three-theme strategy, reduces ambiguity, and gives developers a clear operating system for UI work. With one sprint of migration and governance setup, coherence can move from medium drift to production-grade discipline.

