#!/usr/bin/env node
/**
 * fetch-gifs.mjs
 * Downloads war/macro-themed GIFs from gifcities.org into /public/gifs/
 *
 * Usage:
 *   node scripts/fetch-gifs.mjs
 *
 * After running, copy the printed lines into src/app/labs/geocities-gifs.ts
 */

import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GIF_DIR = path.join(__dirname, '../public/gifs');

// query → desired filename (no .gif extension)
// Skip queries where we already have an equivalent
const TARGETS = [
  // Military
  { query: 'missile',    filename: 'missile2'   },
  { query: 'bomb',       filename: 'bomb'        },
  { query: 'tank',       filename: 'tank'        },
  { query: 'nuclear',    filename: 'nuclear'     },
  { query: 'skull',      filename: 'skull'       },
  // Intelligence / war room
  { query: 'radar',      filename: 'radar'       },
  { query: 'target',     filename: 'target'      },
  { query: 'satellite',  filename: 'satellite'   },
  // Markets / money
  { query: 'dollar',     filename: 'dollar'      },
  { query: 'chart',      filename: 'chart'       },
  { query: 'crash',      filename: 'crash'       },
  // Geopolitical
  { query: 'eagle',      filename: 'eagle'       },
  { query: 'atom',       filename: 'atom'        },
  // Urgency / drama
  { query: 'siren',      filename: 'siren'       },
  { query: 'lightning',  filename: 'lightning'   },
  { query: 'countdown',  filename: 'countdown'   },
];

async function fetchGifUrl(query) {
  const url = `https://gifcities.org/search?q=${encodeURIComponent(query)}&offset=0&page_size=10`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; war-market-gif-fetcher/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // Extract all blob.gifcities.org URLs from img src attributes
  const matches = [...html.matchAll(/src="(https:\/\/blob\.gifcities\.org\/gifcities\/[^"]+\.gif)"/g)];
  if (!matches.length) throw new Error('No GIFs in results');

  // Prefer a GIF that isn't a banner/divider shape — skip very wide ones by checking dimensions
  // dimensions are in the markup as width="N" height="N" just before the src
  const results = matches.map(m => m[1]);
  return results[0];
}

async function downloadGif(url, filename) {
  const dest = path.join(GIF_DIR, `${filename}.gif`);
  if (existsSync(dest)) return 'skipped';

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; war-market-gif-fetcher/1.0)' },
  });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
  return 'downloaded';
}

async function main() {
  console.log(`\n🔫  Fetching ${TARGETS.length} GIFs from gifcities.org\n`);
  const successes = [];
  const failures = [];

  for (const { query, filename } of TARGETS) {
    try {
      process.stdout.write(`  [${query.padEnd(12)}]  `);
      const gifUrl = await fetchGifUrl(query);
      process.stdout.write(`${filename}.gif  `);
      const result = await downloadGif(gifUrl, filename);
      console.log(result === 'downloaded' ? '✓' : '⏭  already exists');
      if (result === 'downloaded') successes.push(filename);
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failures.push({ query, filename, error: err.message });
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n──────────────────────────────────────');
  console.log(`  Downloaded: ${successes.length}   Failed: ${failures.length}`);

  if (successes.length) {
    console.log('\nAdd to geocities-gifs.ts:\n');
    for (const filename of successes) {
      console.log(`  ${filename.padEnd(14)}: '/gifs/${filename}.gif',`);
    }
  }

  if (failures.length) {
    console.log('\nFailed:');
    for (const { query, error } of failures) {
      console.log(`  "${query}" — ${error}`);
    }
  }

  console.log('');
}

main().catch(console.error);
