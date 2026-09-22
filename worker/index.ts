// Punkt wejścia Workera: uruchamia się dla każdego żądania (run_worker_first).
// Najpierw HTTP -> HTTPS, potem /api/auth i /api/callback (logowanie OAuth panelu CMS, DEC-009);
// resztę oddaje do statycznych plików (env.ASSETS.fetch).
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
    const url = new URL(request.url);

    // HTTP -> HTTPS: Custom Domain + statyczne pliki omijają Page/Redirect Rules
    // Cloudflare (uruchamiają się poza tą warstwą), więc przekierowanie robimy tutaj.
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const { pathname } = url;

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

    // Wszystko poza /api/* i przekierowaniem HTTPS: zwykłe statyczne pliki.
    return env.ASSETS.fetch(request);
  },
};
