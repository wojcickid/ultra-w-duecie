// Punkt wejścia Workera: tylko /api/auth i /api/callback (logowanie OAuth panelu CMS, DEC-009); resztę obsługują statyczne pliki.
import { handleAuth } from './auth';
import { handleCallback } from './callback';
import type { Env } from './oauth';

interface WorkerEnv extends Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const emptyResponse = (status: number, headers: Record<string, string> = {}) =>
  new Response(null, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/api/')) {
      const handler =
        pathname === '/api/auth'
          ? handleAuth
          : pathname === '/api/callback'
            ? handleCallback
            : null;
      if (!handler) return emptyResponse(404);
      if (request.method !== 'GET') {
        return emptyResponse(405, { Allow: 'GET' });
      }
      return handler({ request, env });
    }

    // Zabezpieczenie: zwykle statyczne pliki są serwowane bez udziału Workera (run_worker_first).
    return env.ASSETS.fetch(request);
  },
};
