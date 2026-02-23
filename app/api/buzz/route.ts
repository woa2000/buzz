import { NextRequest, NextResponse } from 'next/server';
import { registerBuzz, addPlayer } from '@/lib/session';
import type { Team } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { team, action, name, playerId } = body;

  if (action === 'join') {
    if (!team || !['Alpha', 'Bravo', 'Charlie', 'Delta'].includes(team)) {
      return NextResponse.json({ error: 'Invalid team' }, { status: 400 });
    }
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const player = addPlayer(team as Team, name.trim());
    return NextResponse.json({ success: true, player });
  }

  if (action === 'buzz') {
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }
    const result = registerBuzz(playerId);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
