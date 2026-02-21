#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, unlinkSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../public/gifs');
const INBOX = path.join(ROOT, 'inbox');
const APPROVED = path.join(ROOT, 'approved');
const REJECTED = path.join(ROOT, 'rejected');
const DECISIONS = path.join(ROOT, 'review.decisions.json');

function ensureDirs() {
  mkdirSync(APPROVED, { recursive: true });
  mkdirSync(REJECTED, { recursive: true });
}

function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function moveSafe(fromAbs, toAbs) {
  try {
    renameSync(fromAbs, toAbs);
    return true;
  } catch {
    try {
      copyFileSync(fromAbs, toAbs);
      unlinkSync(fromAbs);
      return true;
    } catch {
      return false;
    }
  }
}

function resolvePath(dir, id) {
  return path.join(dir, `${id}.gif`);
}

function resolveSource(id, action) {
  const candidates =
    action === 'approve'
      ? [resolvePath(REJECTED, id), resolvePath(INBOX, id)]
      : action === 'reject'
      ? [resolvePath(APPROVED, id), resolvePath(INBOX, id)]
      : [];

  return candidates.find((p) => existsSync(p)) ?? null;
}

function main() {
  ensureDirs();
  const decisions = readJson(DECISIONS, {});
  const entries = Object.entries(decisions);

  if (!entries.length) {
    console.log('No decisions found.');
    return;
  }

  let movedApproved = 0;
  let movedRejected = 0;
  let skipped = 0;

  for (const [id, action] of entries) {
    const source = resolveSource(id, action);
    if (!source) {
      skipped += 1;
      continue;
    }

    const targetDir = action === 'approve' ? APPROVED : action === 'reject' ? REJECTED : null;
    if (!targetDir) {
      skipped += 1;
      continue;
    }

    const target = resolvePath(targetDir, id);
    if (source === target) {
      skipped += 1;
      continue;
    }

    if (existsSync(target)) {
      try {
        unlinkSync(source);
        if (action === 'approve') movedApproved += 1;
        if (action === 'reject') movedRejected += 1;
        continue;
      } catch {
        skipped += 1;
        continue;
      }
    }

    const ok = moveSafe(source, target);
    if (!ok) {
      skipped += 1;
      continue;
    }

    if (action === 'approve') movedApproved += 1;
    if (action === 'reject') movedRejected += 1;
  }

  console.log(`Moved to approved: ${movedApproved}`);
  console.log(`Moved to rejected: ${movedRejected}`);
  console.log(`Skipped: ${skipped}`);
  console.log('Next: run `npm run gifs:review` to regenerate manifest and review queue.');
}

main();
