#!/usr/bin/env node
/**
 * Catalog and triage GIF assets.
 *
 * Usage:
 *   node scripts/catalog-gifs.mjs --scope inbox --organize
 *   node scripts/catalog-gifs.mjs --scope all
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GIF_ROOT = path.join(__dirname, '../public/gifs');
const INBOX_DIR = path.join(GIF_ROOT, 'inbox');
const APPROVED_DIR = path.join(GIF_ROOT, 'approved');
const REJECTED_DIR = path.join(GIF_ROOT, 'rejected');
const MANIFEST_PATH = path.join(GIF_ROOT, 'catalog.manifest.json');
const REVIEW_PATH = path.join(GIF_ROOT, 'REVIEW.md');
const SOURCES_PATH = path.join(INBOX_DIR, 'sources.json');
const DECISIONS_PATH = path.join(GIF_ROOT, 'review.decisions.json');

function parseArgs(argv) {
  const args = {
    scope: 'inbox',
    organize: false,
    maxKb: 1536,
    rejectAspect: 5,
    reviewAspect: 3.6,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--scope') args.scope = argv[++i] ?? 'inbox';
    else if (token === '--organize') args.organize = true;
    else if (token === '--max-kb') args.maxKb = Number(argv[++i] ?? 1536);
    else if (token === '--reject-aspect') args.rejectAspect = Number(argv[++i] ?? 6);
    else if (token === '--review-aspect') args.reviewAspect = Number(argv[++i] ?? 4);
  }

  return args;
}

function ensureDirs() {
  mkdirSync(GIF_ROOT, { recursive: true });
  mkdirSync(INBOX_DIR, { recursive: true });
  mkdirSync(APPROVED_DIR, { recursive: true });
  mkdirSync(REJECTED_DIR, { recursive: true });
}

function walkFiles(root) {
  if (!existsSync(root)) return [];
  const out = [];
  const entries = readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(abs));
    else out.push(abs);
  }
  return out;
}

function listGifFiles(scope) {
  const pools = [];
  if (scope === 'inbox') pools.push(INBOX_DIR);
  if (scope === 'all') pools.push(GIF_ROOT);

  const files = [];
  for (const pool of pools) {
    for (const abs of walkFiles(pool)) {
      if (!abs.toLowerCase().endsWith('.gif')) continue;
      if (abs.includes(`${path.sep}.`)) continue;
      files.push(abs);
    }
  }

  return [...new Set(files)];
}

function readSources() {
  if (!existsSync(SOURCES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(SOURCES_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function readDecisions() {
  if (!existsSync(DECISIONS_PATH)) return {};
  try {
    return JSON.parse(readFileSync(DECISIONS_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function skipColorTable(packedByte) {
  const hasColorTable = (packedByte & 0x80) !== 0;
  if (!hasColorTable) return 0;
  const sizeValue = packedByte & 0x07;
  return 3 * (2 ** (sizeValue + 1));
}

function parseGif(buffer) {
  if (buffer.length < 14) return { valid: false, error: 'too_small' };
  const signature = buffer.toString('ascii', 0, 6);
  if (signature !== 'GIF87a' && signature !== 'GIF89a') {
    return { valid: false, error: 'bad_signature' };
  }

  const width = buffer.readUInt16LE(6);
  const height = buffer.readUInt16LE(8);

  let cursor = 13;
  cursor += skipColorTable(buffer[10]);

  let frames = 0;
  let trailerFound = false;

  const maxGuard = buffer.length + 16;
  let guard = 0;

  while (cursor < buffer.length && guard < maxGuard) {
    guard += 1;
    const blockType = buffer[cursor];

    if (blockType === 0x3b) {
      trailerFound = true;
      break;
    }

    if (blockType === 0x2c) {
      frames += 1;
      if (cursor + 9 >= buffer.length) return { valid: false, error: 'short_image_descriptor', width, height, frames };
      const packed = buffer[cursor + 9];
      cursor += 10;
      cursor += skipColorTable(packed);
      if (cursor >= buffer.length) return { valid: false, error: 'truncated_lzw', width, height, frames };
      cursor += 1; // LZW min code size

      while (cursor < buffer.length) {
        const subLen = buffer[cursor];
        cursor += 1;
        if (subLen === 0) break;
        cursor += subLen;
      }
      continue;
    }

    if (blockType === 0x21) {
      if (cursor + 1 >= buffer.length) return { valid: false, error: 'bad_extension_header', width, height, frames };
      cursor += 2; // extension introducer + label
      while (cursor < buffer.length) {
        const subLen = buffer[cursor];
        cursor += 1;
        if (subLen === 0) break;
        cursor += subLen;
      }
      continue;
    }

    return { valid: false, error: `unknown_block_0x${blockType.toString(16)}`, width, height, frames };
  }

  if (!trailerFound) return { valid: false, error: 'missing_trailer', width, height, frames };

  return {
    valid: true,
    width,
    height,
    frames,
  };
}

function inferTheme(filename) {
  const name = filename.toLowerCase();
  const rules = [
    { theme: 'trade', words: ['ticker', 'stock', 'chart', 'dollar', 'cash', 'coin', 'vault', 'bank', 'crash'] },
    { theme: 'intel', words: ['radar', 'satellite', 'signal', 'classified', 'secure', 'terminal', 'map', 'reticle'] },
    { theme: 'threat', words: ['missile', 'bomb', 'nuclear', 'tank', 'alert', 'warning', 'siren', 'explosion', 'skull'] },
    { theme: 'retro-web', words: ['new', 'guestbook', 'netscape', 'construction', 'web', 'flame', 'alien', 'ufo'] },
  ];

  const themes = [];
  for (const rule of rules) {
    if (rule.words.some(word => name.includes(word))) themes.push(rule.theme);
  }
  return themes.length ? themes : ['misc'];
}

function inferMood(themes) {
  if (themes.includes('threat')) return 'threat';
  if (themes.includes('intel')) return 'signal';
  if (themes.includes('trade')) return 'reward';
  if (themes.includes('retro-web')) return 'absurd';
  return 'neutral';
}

function statusFrom(reasons, explicitDecision) {
  if (explicitDecision === 'reject') return 'reject';
  if (explicitDecision === 'approve') return 'auto_accept';
  if (reasons.some(reason => ['invalid', 'duplicate', 'too_large', 'banner_ratio_reject'].includes(reason.code))) return 'reject';
  if (reasons.length > 0) return 'needs_review';
  return 'auto_accept';
}

function formatReason(reason) {
  return `${reason.code}${reason.value !== undefined ? `:${reason.value}` : ''}`;
}

function moveFileSafe(fromAbs, toAbs) {
  if (fromAbs === toAbs) return;
  mkdirSync(path.dirname(toAbs), { recursive: true });
  try {
    renameSync(fromAbs, toAbs);
  } catch {
    copyFileSync(fromAbs, toAbs);
    unlinkSync(fromAbs);
  }
}

function toWebPath(absPath) {
  const rel = path.relative(GIF_ROOT, absPath).split(path.sep).join('/');
  return `/gifs/${rel}`;
}

function relativeFromRoot(absPath) {
  return path.relative(GIF_ROOT, absPath).split(path.sep).join('/');
}

function buildReviewMarkdown(entries) {
  const reviewEntries = entries.filter(entry => entry.status === 'needs_review');
  const lines = [
    '# GIF Review Queue',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
  ];

  if (!reviewEntries.length) {
    lines.push('No GIFs need manual review.');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('| File | Size KB | WxH | Frames | Themes | Reasons |');
  lines.push('|---|---:|---:|---:|---|---|');

  for (const entry of reviewEntries) {
    lines.push(`| ${entry.path} | ${entry.sizeKb} | ${entry.width}x${entry.height} | ${entry.frames} | ${entry.themes.join(',')} | ${entry.reasons.map(formatReason).join(', ')} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function updateSourcesFolder(sources, filename, folder) {
  if (!sources[filename]) return;
  sources[filename].folder = folder;
  sources[filename].updatedAt = new Date().toISOString();
}

function main() {
  ensureDirs();
  const args = parseArgs(process.argv.slice(2));
  const files = listGifFiles(args.scope);
  const sources = readSources();
  const decisions = readDecisions();

  const hashSeen = new Set();
  const entries = [];

  for (const absPath of files) {
    const raw = readFileSync(absPath);
    const stats = statSync(absPath);
    const sizeKb = Math.round((stats.size / 1024) * 10) / 10;
    const filename = path.basename(absPath);
    const hash = crypto.createHash('sha1').update(raw).digest('hex');
    const meta = parseGif(raw);
    const reasons = [];

    if (!meta.valid) reasons.push({ code: 'invalid', value: meta.error });
    if (hashSeen.has(hash)) reasons.push({ code: 'duplicate' });
    if (sizeKb > args.maxKb) reasons.push({ code: 'too_large', value: `${sizeKb}kb` });

    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const frames = meta.frames ?? 0;

    if (meta.valid) {
      const aspect = height > 0 ? width / height : 0;
      if (frames < 2) reasons.push({ code: 'static_like', value: frames });
      if (width > 900 || height > 900) reasons.push({ code: 'oversized_dimensions', value: `${width}x${height}` });
      if (width < 18 || height < 18) reasons.push({ code: 'tiny_dimensions', value: `${width}x${height}` });
      if (aspect > args.rejectAspect || aspect < (1 / args.rejectAspect)) {
        reasons.push({ code: 'banner_ratio_reject', value: aspect.toFixed(2) });
      } else if (aspect > args.reviewAspect || aspect < (1 / args.reviewAspect)) {
        reasons.push({ code: 'banner_ratio', value: aspect.toFixed(2) });
      }
    }

    const id = filename.replace(/\.gif$/i, '');
    const status = statusFrom(reasons, decisions[id]);
    const themes = inferTheme(filename);

    hashSeen.add(hash);

    entries.push({
      id,
      filename,
      path: relativeFromRoot(absPath),
      webPath: toWebPath(absPath),
      status,
      reasons,
      sizeKb,
      width,
      height,
      frames,
      hash,
      themes,
      mood: inferMood(themes),
      source: sources[filename]?.sourceUrl ?? null,
      query: sources[filename]?.query ?? null,
      fetchedAt: sources[filename]?.fetchedAt ?? null,
    });
  }

  if (args.organize) {
    for (const entry of entries) {
      const currentAbs = path.join(GIF_ROOT, entry.path);
      const baseName = path.basename(currentAbs);
      let targetDir = null;

      if (entry.path.startsWith('inbox/')) {
        if (entry.status === 'auto_accept') targetDir = APPROVED_DIR;
        else if (entry.status === 'reject') targetDir = REJECTED_DIR;
      }

      if (!targetDir) continue;
      const nextAbs = path.join(targetDir, baseName);
      moveFileSafe(currentAbs, nextAbs);

      const nextRel = relativeFromRoot(nextAbs);
      entry.path = nextRel;
      entry.webPath = toWebPath(nextAbs);
      updateSourcesFolder(sources, entry.filename, nextRel.split('/')[0]);
    }

    writeFileSync(SOURCES_PATH, JSON.stringify(sources, null, 2));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    scope: args.scope,
    thresholds: {
      maxKb: args.maxKb,
      rejectAspect: args.rejectAspect,
      reviewAspect: args.reviewAspect,
    },
    counts: {
      total: entries.length,
      autoAccept: entries.filter(entry => entry.status === 'auto_accept').length,
      needsReview: entries.filter(entry => entry.status === 'needs_review').length,
      rejected: entries.filter(entry => entry.status === 'reject').length,
    },
    entries: entries
      .sort((a, b) => a.path.localeCompare(b.path))
      .map(entry => ({
        id: entry.id,
        path: entry.path,
        webPath: entry.webPath,
        status: entry.status,
        reasons: entry.reasons.map(formatReason),
        sizeKb: entry.sizeKb,
        width: entry.width,
        height: entry.height,
        frames: entry.frames,
        themes: entry.themes,
        mood: entry.mood,
        source: entry.source,
        query: entry.query,
        fetchedAt: entry.fetchedAt,
      })),
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  writeFileSync(REVIEW_PATH, buildReviewMarkdown(entries));

  console.log(`Scanned: ${manifest.counts.total}`);
  console.log(`Auto-accept: ${manifest.counts.autoAccept}`);
  console.log(`Needs review: ${manifest.counts.needsReview}`);
  console.log(`Rejected: ${manifest.counts.rejected}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log(`Review queue: ${REVIEW_PATH}`);
}

main();
