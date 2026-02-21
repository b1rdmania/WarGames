#!/usr/bin/env node
/**
 * Bulk GIFCities puller.
 * Downloads GIFs into /public/gifs/inbox and records source metadata.
 *
 * Usage:
 *   node scripts/fetch-gifs.mjs --theme warroom --per-query 6
 *   node scripts/fetch-gifs.mjs --queries "missile,radar,ticker" --per-query 8
 *   node scripts/fetch-gifs.mjs --query-file scripts/gif-queries.txt
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GIF_ROOT = path.join(__dirname, '../public/gifs');
const INBOX_DIR = path.join(GIF_ROOT, 'inbox');
const SOURCES_PATH = path.join(INBOX_DIR, 'sources.json');

const THEME_QUERIES = {
  warroom: [
    'missile', 'bomb', 'tank', 'nuclear', 'skull', 'radar', 'target', 'satellite',
    'siren', 'alert', 'countdown', 'warning', 'command center',
  ],
  markets: [
    'ticker', 'stock', 'chart', 'dollar', 'cash', 'coin', 'crash', 'vault', 'bank',
  ],
  intel: [
    'classified', 'secure', 'encrypted', 'terminal', 'fax', 'typewriter', 'map', 'signal',
  ],
  geocities: [
    'under construction', 'new', 'flames', 'web ring', 'guestbook', 'netscape', 'alien', 'ufo',
  ],
};

function parseArgs(argv) {
  const args = {
    perQuery: 5,
    pageSize: 40,
    offset: 0,
    delayMs: 250,
    theme: null,
    queries: [],
    queryFile: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--theme') args.theme = argv[++i] ?? null;
    else if (token === '--queries') args.queries = (argv[++i] ?? '').split(',').map(v => v.trim()).filter(Boolean);
    else if (token === '--query-file') args.queryFile = argv[++i] ?? null;
    else if (token === '--per-query') args.perQuery = Number(argv[++i] ?? 5);
    else if (token === '--page-size') args.pageSize = Number(argv[++i] ?? 40);
    else if (token === '--offset') args.offset = Number(argv[++i] ?? 0);
    else if (token === '--delay-ms') args.delayMs = Number(argv[++i] ?? 250);
  }

  return args;
}

function loadQueries(args) {
  const fromFile = [];
  if (args.queryFile && existsSync(args.queryFile)) {
    const raw = readFileSync(args.queryFile, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const q = line.trim();
      if (!q || q.startsWith('#')) continue;
      fromFile.push(q);
    }
  }

  const fromTheme = args.theme && THEME_QUERIES[args.theme] ? THEME_QUERIES[args.theme] : [];
  return [...new Set([...fromTheme, ...args.queries, ...fromFile])];
}

function ensureDirs() {
  mkdirSync(GIF_ROOT, { recursive: true });
  mkdirSync(INBOX_DIR, { recursive: true });
}

function readSources() {
  if (!existsSync(SOURCES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(SOURCES_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function writeSources(sources) {
  writeFileSync(SOURCES_PATH, JSON.stringify(sources, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'gif';
}

async function fetchSearchResults(query, pageSize, offset) {
  const url = `https://gifcities.org/search?q=${encodeURIComponent(query)}&offset=${offset}&page_size=${pageSize}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; war-markets-gif-fetcher/2.0)' },
  });
  if (!res.ok) throw new Error(`Search HTTP ${res.status}`);
  const html = await res.text();

  const urls = [...html.matchAll(/src="(https:\/\/blob\.gifcities\.org\/gifcities\/[^"\s]+\.gif)"/g)]
    .map(match => match[1]);

  return [...new Set(urls)];
}

function makeFilename(query, sourceUrl) {
  const querySlug = slugify(query);
  const idMatch = sourceUrl.match(/\/gifcities\/([^/.]+)\.gif$/);
  const id = idMatch?.[1] ?? String(Date.now());
  return `${querySlug}-${id}.gif`;
}

async function downloadGif(sourceUrl, filename) {
  const dest = path.join(INBOX_DIR, filename);
  if (existsSync(dest)) return { status: 'exists', filename };

  const res = await fetch(sourceUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; war-markets-gif-fetcher/2.0)' },
  });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
  return { status: 'downloaded', filename };
}

function printUsage() {
  console.log('Usage: node scripts/fetch-gifs.mjs [--theme <warroom|markets|intel|geocities>] [--queries "q1,q2"] [--query-file path] [--per-query N] [--page-size N] [--offset N] [--delay-ms N]');
}

async function main() {
  ensureDirs();
  const args = parseArgs(process.argv.slice(2));
  const queries = loadQueries(args);

  if (!queries.length) {
    printUsage();
    console.error('No queries provided. Use --theme, --queries, or --query-file.');
    process.exit(1);
  }

  const sources = readSources();
  const summary = {
    downloaded: 0,
    skipped: 0,
    failed: 0,
  };

  console.log(`Fetching from GIFCities: ${queries.length} queries, ${args.perQuery} GIFs/query`);

  for (const query of queries) {
    process.stdout.write(`- ${query}: `);
    try {
      const urls = await fetchSearchResults(query, args.pageSize, args.offset);
      if (!urls.length) {
        console.log('no results');
        continue;
      }

      let took = 0;
      for (const sourceUrl of urls) {
        if (took >= args.perQuery) break;
        const filename = makeFilename(query, sourceUrl);
        try {
          const result = await downloadGif(sourceUrl, filename);
          if (result.status === 'downloaded') {
            summary.downloaded += 1;
            took += 1;
            sources[filename] = {
              filename,
              query,
              sourceUrl,
              fetchedAt: new Date().toISOString(),
              folder: 'inbox',
            };
          } else {
            summary.skipped += 1;
          }
        } catch {
          summary.failed += 1;
        }
        await sleep(args.delayMs);
      }

      console.log(`added ${took}`);
    } catch (error) {
      summary.failed += 1;
      console.log(`error (${error.message})`);
    }
  }

  writeSources(sources);

  console.log('');
  console.log(`Downloaded: ${summary.downloaded}`);
  console.log(`Skipped:    ${summary.skipped}`);
  console.log(`Failed:     ${summary.failed}`);
  console.log(`Inbox:      ${INBOX_DIR}`);
  console.log(`Sources:    ${SOURCES_PATH}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
