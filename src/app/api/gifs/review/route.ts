import { NextResponse } from 'next/server';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

type Decision = 'approve' | 'reject';

type DecisionMap = Record<string, Decision>;

const decisionsPath = path.join(process.cwd(), 'public', 'gifs', 'review.decisions.json');

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

    return NextResponse.json({ ok: true, id, action, decisions });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update decisions' },
      { status: 500 }
    );
  }
}
