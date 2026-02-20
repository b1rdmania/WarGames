#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(
  decodeURIComponent(path.dirname(new URL(import.meta.url).pathname)),
  '..'
);
const marketsPath = path.join(repoRoot, 'src', 'integrations', 'pear', 'markets.ts');

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function info(message) {
  console.log(`✓ ${message}`);
}

function parseMarketsArray(source) {
  const marker = 'export const MARKETS';
  const markerIdx = source.indexOf(marker);
  if (markerIdx === -1) throw new Error('Could not find MARKETS export');

  const equalsIdx = source.indexOf('=', markerIdx);
  if (equalsIdx === -1) throw new Error('Could not find MARKETS assignment');
  const arrayStart = source.indexOf('[', equalsIdx);
  if (arrayStart === -1) throw new Error('Could not find MARKETS array start');

  let depth = 0;
  let end = -1;
  for (let i = arrayStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '[') depth += 1;
    if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('Could not find MARKETS array end');

  const arrayLiteral = source.slice(arrayStart, end + 1);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${arrayLiteral});`)();
}

function isValidSymbol(symbol) {
  return typeof symbol === 'string' && /^[A-Za-z0-9._:-]{1,24}$/.test(symbol.trim());
}

function isValidWeight(w) {
  return Number.isFinite(w) && w >= 0.01 && w <= 1;
}

function main() {
  const src = fs.readFileSync(marketsPath, 'utf8');
  const markets = parseMarketsArray(src);
  if (!Array.isArray(markets)) throw new Error('MARKETS is not an array');

  let errors = 0;
  const seenIds = new Set();
  const allowedStatuses = new Set(['live', 'paused']);

  for (const m of markets) {
    if (!m?.id || typeof m.id !== 'string') {
      fail('Found market without string id');
      errors += 1;
      continue;
    }

    if (seenIds.has(m.id)) {
      fail(`Duplicate market id: ${m.id}`);
      errors += 1;
    }
    seenIds.add(m.id);

    if (!allowedStatuses.has(m.status)) {
      fail(`Market ${m.id} has invalid status "${m.status}"`);
      errors += 1;
    }

    const hasPairs = Boolean(m.pairs);
    const hasBasket = Boolean(m.basket);
    if (hasPairs === hasBasket) {
      fail(`Market ${m.id} must define exactly one of pairs or basket`);
      errors += 1;
      continue;
    }

    if (hasPairs) {
      const { long, short } = m.pairs;
      if (!isValidSymbol(long) || !isValidSymbol(short)) {
        fail(`Market ${m.id} has invalid pair symbols: ${long} / ${short}`);
        errors += 1;
      }
      continue;
    }

    const longLegs = m.basket?.long ?? [];
    const shortLegs = m.basket?.short ?? [];
    if (!Array.isArray(longLegs) || !Array.isArray(shortLegs) || longLegs.length === 0 || shortLegs.length === 0) {
      fail(`Market ${m.id} basket must have non-empty long and short legs`);
      errors += 1;
      continue;
    }

    let longSum = 0;
    let shortSum = 0;
    for (const leg of longLegs) {
      if (!isValidSymbol(leg.asset)) {
        fail(`Market ${m.id} has invalid long symbol: ${leg.asset}`);
        errors += 1;
      }
      if (!isValidWeight(leg.weight)) {
        fail(`Market ${m.id} has invalid long weight: ${leg.asset}=${leg.weight}`);
        errors += 1;
      }
      longSum += Number(leg.weight || 0);
    }
    for (const leg of shortLegs) {
      if (!isValidSymbol(leg.asset)) {
        fail(`Market ${m.id} has invalid short symbol: ${leg.asset}`);
        errors += 1;
      }
      if (!isValidWeight(leg.weight)) {
        fail(`Market ${m.id} has invalid short weight: ${leg.asset}=${leg.weight}`);
        errors += 1;
      }
      shortSum += Number(leg.weight || 0);
    }

    const total = longSum + shortSum;
    if (Math.abs(total - 1) > 0.001) {
      fail(`Market ${m.id} basket weights must sum to 1.0 total (got ${total.toFixed(4)})`);
      errors += 1;
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Market checks failed with ${errors} issue(s).`);
    process.exit(1);
  }

  info(`Market checks passed (${markets.length} markets validated).`);
}

try {
  main();
} catch (err) {
  console.error(`❌ Failed to run market checks: ${err.message}`);
  process.exit(1);
}
