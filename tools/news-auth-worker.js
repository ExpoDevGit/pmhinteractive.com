// Cloudflare Worker for the news editor's "Sign in with GitHub".
//
// After you sign in, GitHub hands the editor a one-time code. Turning that
// code into a token needs the GitHub App's client secret, which can't sit in
// the website's public code, so this Worker holds it and does that one step.
// It stores nothing and can't post anything itself.
//
// Settings → Variables and Secrets on the Worker:
//   GITHUB_CLIENT_ID      (text)    the GitHub App's Client ID
//   GITHUB_CLIENT_SECRET  (secret)  a client secret generated on the GitHub App
//
// Full setup: pmh-interactive/SETUP.md, "Editor sign-in".

const ALLOWED_ORIGINS = [
  'https://pmhinteractive.com',
  'https://www.pmhinteractive.com',
  'http://localhost:8000',
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('Forbidden', { status: 403 });

    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
    const reply = (body, status = 200) => new Response(JSON.stringify(body), {
      status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply({ error: 'Use POST.' }, 405);

    const { code } = await request.json().catch(() => ({}));
    if (typeof code !== 'string' || !/^[\w-]{1,100}$/.test(code)) return reply({ error: 'Missing sign-in code.' }, 400);

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'pmh-news-auth' },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.access_token) {
      return reply({ error: data.error_description || 'GitHub turned the sign-in down. Try again.' }, 400);
    }
    // The refresh token stays behind on purpose: when this one runs out, you sign in again.
    return reply({ access_token: data.access_token, expires_in: data.expires_in });
  },
};
