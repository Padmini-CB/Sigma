import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data', 'creatives');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

// GET /api/creatives?id=<creativeId>
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const safeId = sanitizeId(id);
  const filePath = path.join(DATA_DIR, `${safeId}.json`);

  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: 'Creative not found' }, { status: 404 });
  }
}

// POST /api/creatives
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, elements, activeSize, perSizeElements, lastModified, clientLastModified } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const safeId = sanitizeId(id);
    const filePath = path.join(DATA_DIR, `${safeId}.json`);
    await ensureDataDir();

    // Conflict detection: check if file was modified by someone else
    let serverLastModified: number | null = null;
    try {
      const existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      serverLastModified = existing.lastModified ?? null;
    } catch {
      // File doesn't exist yet — no conflict
    }

    const now = Date.now();
    const conflict = serverLastModified !== null
      && clientLastModified !== undefined
      && serverLastModified > clientLastModified;

    const creative = {
      id: safeId,
      elements,
      activeSize,
      perSizeElements,
      lastModified: now,
      savedAt: new Date(now).toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(creative, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      lastModified: now,
      conflict,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
