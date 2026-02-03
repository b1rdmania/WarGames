# Research framework

## Goal

Define three full design systems for war.market that are visually distinct, historically grounded, and production-usable.

This phase avoids "same UI, different colors."

## Archetypes in scope

1. DOS/Norton operator terminal
2. Bloomberg command grid
3. NORAD situation room

## Method

For each archetype we document:

- information architecture logic
- typography behavior (not just family choice)
- interaction grammar (how actions are discovered and executed)
- state language (idle, armed, executing, failed, settled)
- performance and accessibility constraints

## Shared product constraints (non-negotiable)

- Primary tasks (find thesis, pick side, place trade) stay obvious in under 5 seconds.
- Mobile tap targets are 44px minimum.
- Keyboard focus is always visible.
- Color is never the only state signal.
- Trade action remains one clear step.

## Comparison scorecard

Score each system 1-5 against:

- Identity uniqueness
- Trade clarity
- Mobile usability
- Accessibility confidence
- Build effort
- Long-term maintainability

## Recommended prototype scope

Build the same surfaces in each system for fair comparison:

1. landing first fold
2. trade shell (market feed + bet slip + status line)
3. one position card

Do not prototype extra pages until one system wins.

## Decision rule

Choose the winner that maximizes:

1. instant recognizability from a screenshot
2. fastest reliable path to execution
3. lowest ongoing style drift risk
