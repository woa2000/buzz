import { NextRequest } from 'next/server';
import { getSession, addSSEClient, removeSSEClient } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Add client to SSE clients - pass controller directly
      addSSEClient(controller);

      // Send initial state
      const initialMessage = JSON.stringify({
        type: 'session-update',
        data: getSession(),
      });
      controller.enqueue(encoder.encode(`data: ${initialMessage}\n\n`));

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
          removeSSEClient(controller);
        }
      }, 30000);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        removeSSEClient(controller);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
