// Początek logowania: przekierowanie do GitHuba z losowym `state` (ciasteczko HttpOnly).
import {
  OAUTH_SCOPE,
  getAllowedOrigins,
  isOAuthConfigured,
  popupResponse,
  randomState,
  stateCookie,
  type Context,
} from './oauth';

export const handleAuth = ({ request, env }: Context): Response => {
  const url = new URL(request.url);
  const allowedOrigins = getAllowedOrigins(env, request);
  const fail = (error: string, errorCode: string) =>
    popupResponse({ error, errorCode }, allowedOrigins);

  if (url.searchParams.get('provider') !== 'github') {
    return fail('Nieobsługiwany dostawca logowania.', 'UNSUPPORTED_BACKEND');
  }
  const allowedHosts = allowedOrigins.map((origin) => new URL(origin).hostname);
  if (!allowedHosts.includes(url.searchParams.get('site_id') ?? '')) {
    return fail(
      'Ta domena nie ma prawa korzystać z logowania.',
      'UNSUPPORTED_DOMAIN',
    );
  }
  if (!isOAuthConfigured(env)) {
    return fail(
      'Logowanie nie jest skonfigurowane po stronie serwera.',
      'MISCONFIGURED_CLIENT',
    );
  }

  const state = randomState();
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/api/callback`,
    scope: OAUTH_SCOPE, // zakres zawsze stały; parametr `scope` z żądania jest ignorowany
    state,
    allow_signup: 'false',
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Set-Cookie': stateCookie(state),
      'Cache-Control': 'no-store',
    },
  });
};
