# Pull Request

## Description
<!-- Brief description of what this PR does -->

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Theme/design work

## Theme Coherence Checklist
<!-- Required for all PRs that touch themes, styling, or UI components -->

- [ ] **Registry Compliance**: Only use approved theme IDs (`terminal`, `geocities`, `norad`)
- [ ] **No Archived Imports**: Code does not import from `_archive/` directories
- [ ] **Token Isolation**: Theme-specific colors/fonts are in `src/themes/{theme}/tokens.css`, not `globals.css`
- [ ] **Data Attribute Usage**: Theme switching uses `[data-theme="X"]` CSS selectors
- [ ] **Legacy Aliases**: If removing old tokens, checked for usage via grep/search
- [ ] **CI Check Passed**: `npm run check:theme` exits without errors

## Testing
<!-- How has this been tested? -->

- [ ] Local development (npm run dev)
- [ ] Build passes (npm run build)
- [ ] ESLint passes (npm run lint)
- [ ] Theme coherence check passes (npm run check:theme)

## Additional Context
<!-- Add any other context about the PR here -->

---

**Design Governance**: See `docs/design-governance/` for the three-theme coherence program.
