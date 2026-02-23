import { NextRequest, NextResponse } from 'next/server';
import {
  createSession,
  getSession,
  startAcceptingAnswers,
  stopAcceptingAnswers,
  resetBuzz,
} from '@/lib/session';

export async function GET() {
  const session = getSession();
  return NextResponse.json(session);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  let session;

  switch (action) {
    case 'create':
      session = createSession();
      break;
    case 'start-accepting':
      session = startAcceptingAnswers();
      break;
    case 'stop-accepting':
      session = stopAcceptingAnswers();
      break;
    case 'reset':
      session = resetBuzz();
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json(session);
}
