#!/usr/bin/env bash
#
# Theme Coherence Check Script
#
# Validates that the codebase adheres to the three-theme architecture
# defined in docs/design-governance.
#
# Run this in CI before tests/build to catch theme violations early.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "🔍 Checking theme coherence..."
echo ""

ERRORS=0

# ============================================================================
# Check 1: Verify only allowed theme IDs are used
# ============================================================================

echo "✓ Check 1: Validating theme IDs against registry..."

ALLOWED_THEMES=("terminal" "geocities" "norad")
THEME_ID_PATTERN='(data-theme="|ThemeId.*=.*["\x27])(terminal|geocities|norad|dos-norton|bloomberg)(["\x27])'

# Find all theme ID references (excluding node_modules, .next, build artifacts)
THEME_REFS=$(grep -r -E "$THEME_ID_PATTERN" src/ --include="*.ts" --include="*.tsx" --include="*.css" 2>/dev/null || true)

# Check for banned theme IDs
BANNED_REFS=$(echo "$THEME_REFS" | grep -E '(dos-norton|bloomberg)' || true)

if [ -n "$BANNED_REFS" ]; then
  echo "❌ Found references to banned theme IDs (dos-norton, bloomberg):"
  echo "$BANNED_REFS"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✓ All theme IDs are allowed"
fi

echo ""

# ============================================================================
# Check 2: Detect imports from archived paths
# ============================================================================

echo "✓ Check 2: Checking for archived imports..."

# Find imports from _archive directories
ARCHIVED_IMPORTS=$(grep -r "from.*/_archive/" src/ --include="*.ts" --include="*.tsx" 2>/dev/null || true)

if [ -n "$ARCHIVED_IMPORTS" ]; then
  echo "❌ Found imports from archived paths:"
  echo "$ARCHIVED_IMPORTS"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✓ No archived imports detected"
fi

echo ""

# ============================================================================
# Check 3: Verify theme token files exist
# ============================================================================

echo "✓ Check 3: Verifying theme token files..."

MISSING_TOKENS=0
for theme in "${ALLOWED_THEMES[@]}"; do
  TOKEN_FILE="src/themes/$theme/tokens.css"
  if [ ! -f "$TOKEN_FILE" ]; then
    echo "❌ Missing token file: $TOKEN_FILE"
    MISSING_TOKENS=$((MISSING_TOKENS + 1))
  fi
done

if [ $MISSING_TOKENS -eq 0 ]; then
  echo "   ✓ All theme token files present"
else
  ERRORS=$((ERRORS + MISSING_TOKENS))
fi

echo ""

# ============================================================================
# Check 4: Verify theme registry is canonical
# ============================================================================

echo "✓ Check 4: Validating theme registry..."

if [ ! -f "src/themes/index.ts" ]; then
  echo "❌ Theme registry missing: src/themes/index.ts"
  ERRORS=$((ERRORS + 1))
else
  # Check that registry exports required types and constants
  if ! grep -q "export type ThemeId" src/themes/index.ts; then
    echo "❌ Registry missing: export type ThemeId"
    ERRORS=$((ERRORS + 1))
  fi
  if ! grep -q "export const THEMES" src/themes/index.ts; then
    echo "❌ Registry missing: export const THEMES"
    ERRORS=$((ERRORS + 1))
  fi
  if ! grep -q "export const DEFAULT_THEME" src/themes/index.ts; then
    echo "❌ Registry missing: export const DEFAULT_THEME"
    ERRORS=$((ERRORS + 1))
  fi

  if [ $ERRORS -eq 0 ]; then
    echo "   ✓ Theme registry is complete"
  fi
fi

echo ""

# ============================================================================
# Summary
# ============================================================================

if [ $ERRORS -eq 0 ]; then
  echo "✅ Theme coherence checks passed!"
  exit 0
else
  echo "❌ Theme coherence checks failed with $ERRORS error(s)"
  echo ""
  echo "See docs/design-governance for theme architecture guidelines."
  exit 1
fi
