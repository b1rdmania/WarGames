import { NextResponse } from 'next/server';
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

type Decision = 'approve' | 'reject';

type DecisionMap = Record<string, Decision>;

const decisionsPath = path.join(process.cwd(), 'public', 'gifs', 'review.decisions.json');
const gifsRoot = path.join(process.cwd(), 'public', 'gifs');
const inboxDir = path.join(gifsRoot, 'inbox');
const approvedDir = path.join(gifsRoot, 'approved');
const rejectedDir = path.join(gifsRoot, 'rejected');

function readDecisions(): DecisionMap {
  if (!existsSync(decisionsPath)) return {};
  try {
    const raw = readFileSync(decisionsPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as DecisionMap;
    return {};
  } catch {
    return {};
  }
}

function writeDecisions(decisions: DecisionMap) {
  mkdirSync(path.dirname(decisionsPath), { recursive: true });
  writeFileSync(decisionsPath, JSON.stringify(decisions, null, 2));
}

function moveSafe(fromAbs: string, toAbs: string): boolean {
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

function resolvePath(dir: string, id: string) {
  return path.join(dir, `${id}.gif`);
}

function resolveSource(id: string, action: 'approve' | 'reject') {
  const candidates =
    action === 'approve'
      ? [resolvePath(rejectedDir, id), resolvePath(inboxDir, id)]
      : [resolvePath(approvedDir, id), resolvePath(inboxDir, id)];
  return candidates.find((p) => existsSync(p)) ?? null;
}

function applyFileMove(id: string, action: 'approve' | 'reject') {
  const source = resolveSource(id, action);
  if (!source) return { moved: false, reason: 'source_not_found' };

  const targetDir = action === 'approve' ? approvedDir : rejectedDir;
  mkdirSync(targetDir, { recursive: true });
  const target = resolvePath(targetDir, id);

  if (source === target) return { moved: false, reason: 'already_in_target' };
  if (existsSync(target)) {
    unlinkSync(source);
    return { moved: true, reason: 'source_removed_duplicate' };
  }

  const ok = moveSafe(source, target);
  return { moved: ok, reason: ok ? 'moved' : 'move_failed' };
}

export async function GET() {
  try {
    const decisions = readDecisions();
    return NextResponse.json({ decisions, path: '/gifs/review.decisions.json' });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to read decisions' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = String(body?.id || '').trim();
    const action = String(body?.action || '').trim();

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (!['approve', 'reject', 'clear'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const decisions = readDecisions();
    if (action === 'clear') {
      delete decisions[id];
    } else {
      decisions[id] = action as Decision;
    }

    writeDecisions(decisions);

    let fileAction: { moved: boolean; reason: string } | null = null;
    if (action === 'approve' || action === 'reject') {
      fileAction = applyFileMove(id, action);
    }

    return NextResponse.json({ ok: true, id, action, decisions, fileAction });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update decisions' },
      { status: 500 }
    );
  }
}
