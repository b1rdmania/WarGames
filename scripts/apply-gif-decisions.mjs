#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, renameSync } from 'fs';
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
    return false;
  }
}

function resolveInboxGifPath(id) {
  return path.join(INBOX, `${id}.gif`);
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
    const source = resolveInboxGifPath(id);
    if (!existsSync(source)) {
      skipped += 1;
      continue;
    }

    const targetDir = action === 'approve' ? APPROVED : action === 'reject' ? REJECTED : null;
    if (!targetDir) {
      skipped += 1;
      continue;
    }

    const target = path.join(targetDir, `${id}.gif`);
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
