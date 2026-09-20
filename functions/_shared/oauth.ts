// Wspólny kod funkcji OAuth (GitHub) dla panelu CMS. Opis: docs/architecture.md, docs/cms-setup.md.

export interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  // Dozwolone originy panelu (po przecinku), np. https://korona.damianwojcicki.com; domyślnie origin żądania.
  ALLOWED_ORIGIN?: string;
}

export interface Context {
  request: Request;
  env: Env;
}

// Minimalny zakres: zapis w repozytoriach publicznych; nie daje dostępu do prywatnych repozytoriów konta.
export const OAUTH_SCOPE = 'public_repo';
export const STATE_COOKIE = 'oauth_state';
const COOKIE_ATTRS = 'HttpOnly; Secure; SameSite=Lax; Path=/api';

export function getAllowedOrigins(env: Env, request: Request): string[] {
  const configured = (env.ALLOWED_ORIGIN ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .flatMap((value) => {
      try {
        return [new URL(value).origin];
      } catch {
        return [];
      }
    });
  return configured.length > 0 ? configured : [new URL(request.url).origin];
}

export function randomState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie') ?? '';
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=');
  }
  return null;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const stateCookie = (state: string) =>
  `${STATE_COOKIE}=${state}; Max-Age=600; ${COOKIE_ATTRS}`;
const clearedStateCookie = `${STATE_COOKIE}=; Max-Age=0; ${COOKIE_ATTRS}`;

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Bezpieczne osadzenie wartości w <script> (bez zamykania znacznika).
const toScriptLiteral = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\\x3C');

export type PopupResult =
  { token: string } | { error: string; errorCode: string };

// Strona w oknie logowania: przekazuje wynik do panelu (window.opener) tylko dozwolonemu originowi.
// Protokół zgodny z Decap/Sveltia CMS: authorizing:github -> authorization:github:<success|error>:<JSON>.
export function popupResponse(
  result: PopupResult,
  allowedOrigins: string[],
): Response {
  const isError = 'error' in result;
  const payload = isError
    ? { provider: 'github', error: result.error, errorCode: result.errorCode }
    : { provider: 'github', token: result.token };
  const message = `authorization:github:${isError ? 'error' : 'success'}:${JSON.stringify(payload)}`;
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))),
  );
  const text = isError
    ? escapeHtml(result.error)
    : 'Zalogowano. To okno zamknie się automatycznie.';

  const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Logowanie</title></head>
<body><p>${text}</p>
<script nonce="${nonce}">
(() => {
  const allowedOrigins = ${toScriptLiteral(allowedOrigins)};
  const message = ${toScriptLiteral(message)};
  window.addEventListener('message', (event) => {
    if (event.data === 'authorizing:github' && allowedOrigins.includes(event.origin)) {
      window.opener.postMessage(message, event.origin);
    }
  });
  window.opener?.postMessage('authorizing:github', '*');
})();
</script></body></html>`;

  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'`,
  });
  headers.append('Set-Cookie', clearedStateCookie);
  return new Response(html, { headers });
}
