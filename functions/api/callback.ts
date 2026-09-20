// Powrót z GitHuba: sprawdzenie `state`, wymiana kodu na token, przekazanie tokenu do panelu CMS.
import {
  STATE_COOKIE,
  getAllowedOrigins,
  popupResponse,
  readCookie,
  timingSafeEqual,
  type Context,
} from '../_shared/oauth';

export const onRequestGet = async ({
  request,
  env,
}: Context): Promise<Response> => {
  const url = new URL(request.url);
  const allowedOrigins = getAllowedOrigins(env, request);
  const fail = (error: string, errorCode: string) =>
    popupResponse({ error, errorCode }, allowedOrigins);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = readCookie(request, STATE_COOKIE);
  if (!code || !state || !savedState || !timingSafeEqual(state, savedState)) {
    return fail(
      'Logowanie przerwane lub nieprawidłowy parametr state. Spróbuj ponownie.',
      'CSRF_DETECTED',
    );
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return fail(
      'Logowanie nie jest skonfigurowane po stronie serwera.',
      'MISCONFIGURED_CLIENT',
    );
  }

  let accessToken: unknown;
  try {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/api/callback`,
        }),
      },
    );
    ({ access_token: accessToken } = (await response.json()) as {
      access_token?: unknown;
    });
  } catch {
    return fail(
      'Nie udało się połączyć z GitHubem. Spróbuj ponownie.',
      'TOKEN_REQUEST_FAILED',
    );
  }
  if (typeof accessToken !== 'string' || accessToken === '') {
    return fail(
      'GitHub nie wydał tokenu (kod wygasł lub jest nieprawidłowy). Spróbuj ponownie.',
      'TOKEN_REQUEST_FAILED',
    );
  }

  return popupResponse({ token: accessToken }, allowedOrigins);
};
