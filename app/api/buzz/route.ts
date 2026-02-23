import { NextRequest, NextResponse } from 'next/server';
import { registerBuzz, addPlayer } from '@/lib/session';
import type { Team } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { team, action, name } = body;

  if (!team || !['Alpha', 'Bravo', 'Charlie', 'Delta'].includes(team)) {
    return NextResponse.json({ error: 'Invalid team' }, { status: 400 });
  }

  if (action === 'join') {
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const player = addPlayer(team as Team, name.trim());
    return NextResponse.json({ success: true, player });
  }

  if (action === 'buzz') {
    const result = registerBuzz(team as Team);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
