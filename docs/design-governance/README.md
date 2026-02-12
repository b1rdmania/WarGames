# Theme Coherence Program

This package defines how WAR.MARKET moves from ad hoc design exploration to controlled multi-theme development.

Documents:

1. `01-program-outline.md` - executive outline, scope, phases, governance.
2. `02-white-paper.md` - rationale, tradeoffs, and operating model.
3. `03-technical-implementation-spec.md` - implementation plan with concrete code changes and acceptance criteria.

Intended audience:

- Product/technical lead choosing the direction.
- Frontend developer implementing the migration.
- Reviewer validating that design coherence has improved.

Target operating model:

- Keep exactly three active themes: `terminal`, `geocities`, `norad`.
- Treat themes as adapters over shared domain logic.
- Keep experimentation structured and comparable.

