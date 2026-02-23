import { NextRequest } from 'next/server';
import { getSession, addSSEClient, removeSSEClient } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const writer = {
        write: async (data: Uint8Array) => {
          controller.enqueue(data);
        },
        close: () => {
          controller.close();
        },
        abort: (reason: any) => {
          controller.error(reason);
        },
      } as WritableStreamDefaultWriter;

      // Add client to SSE clients
      addSSEClient(writer);

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
        }
      }, 30000);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        removeSSEClient(writer);
        controller.close();
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
