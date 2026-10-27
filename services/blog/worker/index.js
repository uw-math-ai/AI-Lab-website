/* GitHub identity and publishing API for ai.math.uw.edu. */
const enc = new TextEncoder(), DAY = 86400000, MAX_BODY = 150000;
let nextCleanup = 0;
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (status, message) => { throw new HttpError(status, message); };
const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = value => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const random = () => b64(crypto.getRandomValues(new Uint8Array(32)));
const hash = async s => b64(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const query = (env, sql, ...args) => env.DB.prepare(sql).bind(...args);
const rootId = env => Number(env.ROOT_GITHUB_ID || 134547794);
const origin = env => new URL(env.BLOG_SITE_URL).origin;
const apiOrigin = env => new URL(env.SERVICE_URL).origin;
const cookie = (req, name) => req.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(name + '='))?.slice(name.length + 1) || '';
const setCookie = (name, value, age) => `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
const redirect = (url, headers = {}) => new Response(null, { status: 303, headers: { Location: url, 'Cache-Control': 'no-store', ...headers } });
async function fetchGH(env, url, options = {}) {
  const response = await (env.FETCH || fetch)(url, { ...options, headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'UW-Math-AI-Blog', 'X-GitHub-Api-Version': '2022-11-28', ...options.headers }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) fail(502, 'GitHub could not complete this request. Please try again.');
  return response.json();
}
async function encrypt(env, value) {
  const key = await crypto.subtle.importKey('raw', unb64(env.RUNTIME_SECRET), 'AES-GCM', false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return b64(iv) + '.' + b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(value))));
}
async function decrypt(env, value) {
  const [iv, data] = value.split('.');
  const key = await crypto.subtle.importKey('raw', unb64(env.RUNTIME_SECRET), 'AES-GCM', false, ['decrypt']);
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, key, unb64(data))));
}
async function appConfig(env) {
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) return { client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET };
  const row = await query(env, 'SELECT value FROM settings WHERE key=?', 'github_app').first();
  return row ? decrypt(env, row.value) : null;
}
async function readBytes(req, max) {
  if (Number(req.headers.get('content-length')) > max) fail(413, 'This file or post is too large.');
  const reader = req.body?.getReader(); if (!reader) return new Uint8Array();
  const chunks = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > max) { await reader.cancel(); fail(413, 'This file or post is too large.'); } chunks.push(value); }
  const bytes = new Uint8Array(size); let i = 0; for (const chunk of chunks) { bytes.set(chunk, i); i += chunk.length; } return bytes;
}
async function readJson(req, max = MAX_BODY + 20000) {
  if (!(req.headers.get('content-type') || '').startsWith('application/json')) fail(415, 'Send JSON data.');
  const bytes = await readBytes(req, max);
  try { const value = JSON.parse(new TextDecoder().decode(bytes)); if (!value || Array.isArray(value) || typeof value !== 'object') throw 0; return value; } catch { fail(400, 'Invalid JSON data.'); }
}
async function limit(env, key, max, window = 60000) {
  const now = Date.now();
  const row = await query(env, `INSERT INTO rate_limits(key,count,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at<=? THEN 1 ELSE count+1 END, reset_at=CASE WHEN reset_at<=? THEN ? ELSE reset_at END RETURNING count`, key, now + window, now, now, now + window).first();
  if (row.count > max) fail(429, 'Too many requests. Please wait a minute and try again.');
}
async function currentUser(req, env, required = true) {
  const match = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(req.headers.get('authorization') || '');
  if (!match) { if (!required) return null; fail(401, 'Please sign in with GitHub.'); }
  const s = await query(env, 'SELECT * FROM sessions WHERE token_hash=? AND expires_at>?', await hash(match[1]), Date.now()).first();
  if (!s) { if (!required) return null; fail(401, 'Your session has expired. Please sign in again.'); }
  const author = await query(env, 'SELECT role FROM authors WHERE github_id=?', s.github_id).first();
  return { id: s.github_id, login: s.login, name: s.name, avatar: s.avatar, role: s.github_id === rootId(env) ? 'admin' : author?.role || 'reader' };
}
const requireAuthor = user => { if (!['admin', 'author'].includes(user.role)) fail(403, 'Your GitHub account has not been approved to post.'); };
const requireAdmin = user => { if (user.role !== 'admin') fail(403, 'Only administrators can manage authors.'); };
async function ownedPost(env, id, user) {
  const post = await query(env, 'SELECT * FROM posts WHERE id=?', id).first();
  if (!post) fail(404, 'Post not found.');
  if (post.author_id !== user.id && user.role !== 'admin') fail(403, 'You can edit only your own posts.');
  return post;
}
const draft = p => ({ ...p, tags: JSON.parse(p.tags), published: !!p.published_json, published_json: undefined });
function cleanPost(value, env) {
  const result = {};
  for (const [key, max] of Object.entries({ title: 180, slug: 100, summary: 420, body: MAX_BODY, cover: 1000, cover_alt: 300 })) {
    if (typeof value[key] !== 'string' || value[key].length > max) fail(400, `Check the ${key.replace('_', ' ')} field.`);
    result[key] = key === 'body' ? value[key] : value[key].trim();
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.slug)) fail(400, 'Use lowercase letters, numbers, and hyphens in the post URL.');
  if (result.cover && !result.cover.startsWith(apiOrigin(env) + '/media/')) fail(400, 'Upload a cover image using the editor.');
  if (!Array.isArray(value.tags) || value.tags.length > 5 || value.tags.some(x => typeof x !== 'string' || !x.trim() || x.length > 32)) fail(400, 'Use up to five tags of at most 32 characters each.');
  result.tags = JSON.stringify([...new Set(value.tags.map(x => x.trim()))]);
  if (!Number.isInteger(value.version) || value.version < 1) fail(400, 'Missing post version. Reload the editor.');
  result.version = value.version; return result;
}
function htmlPage(title, body, status = 200, headers = {}) {
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escape(title)} · UW Math AI Lab</title><style>body{margin:0;background:#fdfdfb;color:#1b1e23;font:18px/1.65 Georgia,serif}main{max-width:640px;margin:10vh auto;padding:36px;border-top:3px solid #4b2e83}small,button,a{font-family:Arial,sans-serif}small{letter-spacing:.08em}h1{font-weight:400;font-size:38px;line-height:1.2}button{padding:14px 20px;border:0;background:#4b2e83;color:white;font-size:16px;cursor:pointer}a{color:#4b2e83}p{margin:1.2em 0}</style><main><small>UW MATH AI LAB</small><h1>${escape(title)}</h1>${body}</main></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action https://github.com; base-uri 'none'; frame-ancestors 'none'", ...headers } });
}
async function route(req, env) {
  const url = new URL(req.url), path = url.pathname.replace(/\/$/, '') || '/', method = req.method, now = Date.now();
  if (path === '/health' && method === 'GET') return json({ ok: true, githubReady: !!await appConfig(env) });
  if (path === '/' && method === 'GET') return redirect(origin(env) + '/blog/');
  if (path === '/setup' && method === 'GET') {
    if (await appConfig(env)) return htmlPage('GitHub sign-in is connected', `<p>You can sign in and manage authors from the blog.</p><a href="${origin(env)}/blog/write/">Open the editor →</a>`);
    if (!env.SETUP_TOKEN || await hash(url.searchParams.get('token') || '') !== await hash(env.SETUP_TOKEN)) fail(403, 'This setup link is not valid.');
    const state = random();
    await query(env, 'INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', 'setup_state', JSON.stringify({ hash: await hash(state), expires: now + 3600000 })).run();
    const manifest = { name: 'UW Math AI Lab Blog', url: origin(env) + '/blog/', description: 'Sign in to write and publish on the UW Math AI Lab blog. Posting requires approval from the lab.', public: true, redirect_url: apiOrigin(env) + '/setup/complete', callback_urls: [apiOrigin(env) + '/auth/github/callback'], hook_attributes: { url: apiOrigin(env) + '/github/events', active: false }, default_permissions: {}, default_events: [] };
    return htmlPage('Connect GitHub sign-in', `<p>The blog and editor are ready. Register the sign-in application in your <strong>zengrf</strong> GitHub account to enable author access.</p><p>The application uses public GitHub identity only. It requests no repository permissions.</p><form method="post" action="https://github.com/settings/apps/new?state=${state}"><input type="hidden" name="manifest" value="${escape(JSON.stringify(manifest))}"><button>Create GitHub sign-in application</button></form>`, 200, { 'Set-Cookie': setCookie('blog_setup', state, 3600) });
  }
  if (path === '/setup/complete' && method === 'GET') {
    if (await appConfig(env)) fail(409, 'GitHub sign-in is already configured.');
    const row = await query(env, 'SELECT value FROM settings WHERE key=?', 'setup_state').first();
    const saved = row && JSON.parse(row.value), state = url.searchParams.get('state') || '';
    if (!saved || saved.expires < now || saved.hash !== await hash(state) || cookie(req, 'blog_setup') !== state) fail(403, 'This setup session has expired. Open your setup link again.');
    const code = url.searchParams.get('code'); if (!code || !/^[a-zA-Z0-9_-]+$/.test(code)) fail(400, 'Missing GitHub setup code.');
    const app = await fetchGH(env, 'https://api.github.com/app-manifests/' + code + '/conversions', { method: 'POST' });
    if (app.owner?.id !== rootId(env)) fail(403, 'Register this application using the zengrf GitHub account.');
    if (!app.client_id || !app.client_secret) fail(502, 'GitHub did not provide the application credentials.');
    await query(env, 'INSERT INTO settings(key,value) VALUES(?,?)', 'github_app', await encrypt(env, { client_id: app.client_id, client_secret: app.client_secret })).run();
    await query(env, 'DELETE FROM settings WHERE key=?', 'setup_state').run();
    return htmlPage('GitHub sign-in is ready', `<p>Sign in as <strong>zengrf</strong> to write your first post or approve authors.</p><a href="${origin(env)}/blog/write/">Open the editor →</a>`, 200, { 'Set-Cookie': setCookie('blog_setup', '', 0) });
  }
  if (path === '/auth/github/start' && method === 'GET') {
    await limit(env, 'auth:' + (req.headers.get('cf-connecting-ip') || 'unknown'), 30);
    const config = await appConfig(env); if (!config) return htmlPage('Sign-in is being connected', '<p>The blog administrator needs to finish connecting GitHub sign-in. Please try again later.</p>', 503);
    const challenge = url.searchParams.get('challenge') || '', clientState = url.searchParams.get('state') || '';
    const returnTo = url.searchParams.get('return_to') || origin(env) + '/blog/write/';
    if (!/^[A-Za-z0-9_-]{43}$/.test(challenge) || !/^[A-Za-z0-9_-]{43}$/.test(clientState) || returnTo !== origin(env) + '/blog/write/') fail(400, 'Invalid sign-in request.');
    const state = random(), verifier = random();
    await query(env, 'INSERT INTO auth_flows VALUES(?,?,?,?,?,?)', await hash(state), verifier, challenge, clientState, returnTo, now + 600000).run();
    const auth = new URL('https://github.com/login/oauth/authorize');
    for (const [key, value] of Object.entries({ client_id: config.client_id, redirect_uri: apiOrigin(env) + '/auth/github/callback', state, code_challenge: await hash(verifier), code_challenge_method: 'S256' })) auth.searchParams.set(key, value);
    return redirect(auth.href, { 'Set-Cookie': setCookie('blog_oauth', state, 600) });
  }
  if (path === '/auth/github/callback' && method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!state || cookie(req, 'blog_oauth') !== state) fail(403, 'Sign-in could not be verified. Start again from the editor.');
    const flow = await query(env, 'DELETE FROM auth_flows WHERE state_hash=? AND expires_at>? RETURNING *', await hash(state), now).first();
    if (!flow) fail(403, 'This sign-in request has expired or was already used.');
    if (url.searchParams.has('error')) return redirect(flow.return_to + '?signin=cancelled', { 'Set-Cookie': setCookie('blog_oauth', '', 0) });
    const code = url.searchParams.get('code'); if (!code) fail(400, 'Missing GitHub authorization code.');
    const config = await appConfig(env);
    const token = await fetchGH(env, 'https://github.com/login/oauth/access_token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: config.client_id, client_secret: config.client_secret, code, redirect_uri: apiOrigin(env) + '/auth/github/callback', code_verifier: flow.verifier }) });
    if (!token.access_token) fail(401, 'GitHub did not authorize sign-in. Please try again.');
    const user = await fetchGH(env, 'https://api.github.com/user', { headers: { Authorization: 'Bearer ' + token.access_token } });
    if (!Number.isSafeInteger(user.id) || !user.login || user.type !== 'User') fail(401, 'A personal GitHub account is required.');
    // The GitHub token is used for identity only and discarded, never sent to the browser.
    const handoff = random();
    await query(env, 'INSERT INTO handoffs VALUES(?,?,?,?,?,?,?)', await hash(handoff), user.id, user.login, user.name || user.login, user.avatar_url || '', flow.challenge, now + 60000).run();
    return redirect(flow.return_to + '#code=' + handoff + '&state=' + flow.client_state, { 'Set-Cookie': setCookie('blog_oauth', '', 0) });
  }
  if (path === '/auth/exchange' && method === 'POST') {
    const data = await readJson(req, 2000);
    if (typeof data.code !== 'string' || typeof data.verifier !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(data.verifier)) fail(400, 'Invalid sign-in exchange.');
    const flow = await query(env, 'DELETE FROM handoffs WHERE code_hash=? AND challenge=? AND expires_at>? RETURNING *', await hash(data.code), await hash(data.verifier), now).first();
    if (!flow) fail(401, 'This sign-in link has expired. Please sign in again.');
    const session = random();
    await query(env, 'INSERT INTO sessions VALUES(?,?,?,?,?,?)', await hash(session), flow.github_id, flow.login, flow.name, flow.avatar, now + 7 * DAY).run();
    return json({ token: session, expiresAt: now + 7 * DAY });
  }
  if (path === '/auth/session' && method === 'GET') return json({ user: await currentUser(req, env, false), githubReady: !!await appConfig(env) });
  if (path === '/auth/logout' && method === 'POST') {
    const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
    if (token) await query(env, 'DELETE FROM sessions WHERE token_hash=?', await hash(token)).run();
    return json({ ok: true });
  }
  if (path === '/posts' && method === 'GET') {
    const offset = Math.min(100000, Math.max(0, Math.floor(Number(url.searchParams.get('offset')) || 0)));
    const search = (url.searchParams.get('q') || '').slice(0, 200).trim().toLowerCase(), tag = (url.searchParams.get('tag') || '').slice(0, 32);
    const rows = await query(env, `SELECT published_json FROM posts WHERE published_json IS NOT NULL
      AND (?='' OR instr(lower(json_extract(published_json,'$.title') || ' ' || json_extract(published_json,'$.summary') || ' ' || json_extract(published_json,'$.author.name') || ' ' || json_extract(published_json,'$.tags')),?)>0)
      AND (?='' OR EXISTS(SELECT 1 FROM json_each(json_extract(published_json,'$.tags')) WHERE value=?))
      ORDER BY published_at DESC,id DESC LIMIT 25 OFFSET ?`, search, search, tag, tag, offset).all();
    const tags = await query(env, `SELECT DISTINCT value AS tag FROM posts,json_each(json_extract(posts.published_json,'$.tags')) WHERE published_json IS NOT NULL ORDER BY tag`).all();
    const posts = rows.results.map(r => { const p = JSON.parse(r.published_json); return { ...p, body: undefined }; });
    return json({ posts: posts.slice(0, 24), hasMore: posts.length > 24, tags: tags.results.map(r => r.tag) }, 200, { 'Cache-Control': 'public, max-age=15' });
  }
  if (path.startsWith('/posts/') && method === 'GET') {
    const slug = decodeURIComponent(path.slice(7));
    const row = await query(env, 'SELECT published_json FROM posts WHERE slug=? AND published_json IS NOT NULL', slug).first();
    if (!row) fail(404, 'This post is not published.');
    return json({ post: JSON.parse(row.published_json) }, 200, { 'Cache-Control': 'public, max-age=15' });
  }
  if (path.startsWith('/media/') && method === 'GET') {
    const key = path.slice(7); if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(key)) fail(404, 'Image not found.');
    const object = await env.BUCKET.get(key); if (!object) fail(404, 'Image not found.');
    const headers = new Headers({ 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'" });
    object.writeHttpMetadata(headers); headers.set('ETag', object.httpEtag); return new Response(object.body, { headers });
  }
  if (!path.startsWith('/editor/') && !path.startsWith('/admin/')) fail(404, 'Page not found.');
  const user = await currentUser(req, env); requireAuthor(user); await limit(env, 'user:' + user.id, 120);
  if (path === '/editor/posts' && method === 'GET') {
    const rows = user.role === 'admin' ? await query(env, 'SELECT * FROM posts ORDER BY updated_at DESC LIMIT 250').all() : await query(env, 'SELECT * FROM posts WHERE author_id=? ORDER BY updated_at DESC LIMIT 250', user.id).all();
    return json({ posts: rows.results.map(draft) });
  }
  if (path === '/editor/posts' && method === 'POST') {
    const id = crypto.randomUUID();
    await query(env, 'INSERT INTO posts(id,author_id,author_login,author_name,slug,created_at,updated_at) VALUES(?,?,?,?,?,?,?)', id, user.id, user.login, user.name, 'post-' + id.slice(0, 8), now, now).run();
    return json({ post: draft(await ownedPost(env, id, user)) }, 201);
  }
  const match = /^\/editor\/posts\/([a-f0-9-]{36})(?:\/(publish|unpublish))?$/.exec(path);
  if (match) {
    const [, id, action] = match, post = await ownedPost(env, id, user);
    if (!action && method === 'GET') return json({ post: draft(post) });
    if (!action && method === 'PUT') {
      const p = cleanPost(await readJson(req), env);
      if (post.published_at && p.slug !== post.slug) fail(400, 'The URL of a published post cannot be changed.');
      let saved;
      try { saved = await query(env, 'UPDATE posts SET title=?,slug=?,summary=?,body=?,tags=?,cover=?,cover_alt=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING *', p.title, p.slug, p.summary, p.body, p.tags, p.cover, p.cover_alt, now, id, p.version).first(); }
      catch (error) { if (/UNIQUE constraint/i.test(String(error))) fail(409, 'That URL is already used by another post.'); throw error; }
      if (!saved) fail(409, 'This post changed in another window. Download your draft, then reload to avoid overwriting it.');
      return json({ post: draft(saved) });
    }
    const data = await readJson(req, 1000);
    if (data.version !== post.version) fail(409, 'This post changed in another window. Reload before continuing.');
    if (!action && method === 'DELETE') {
      if (post.published_json) fail(409, 'Unpublish this post before deleting it.');
      if (!await query(env, 'DELETE FROM posts WHERE id=? AND version=? RETURNING id', id, data.version).first()) fail(409, 'This post changed in another window.');
      return json({ ok: true });
    }
    if (action && method === 'POST') {
      let snapshot = null;
      if (action === 'publish') {
        if (!post.title.trim() || !post.body.trim() || !post.summary.trim()) fail(400, 'Add a title, summary, and post text before publishing.');
        if (post.cover && !post.cover_alt.trim()) fail(400, 'Add a description for the cover image.');
        snapshot = JSON.stringify({ id, title: post.title, slug: post.slug, summary: post.summary, body: post.body, tags: JSON.parse(post.tags), cover: post.cover, cover_alt: post.cover_alt, author: { id: post.author_id, login: post.author_login, name: post.author_name }, published_at: post.published_at || now, updated_at: now });
      }
      const saved = await query(env, 'UPDATE posts SET published_json=?,published_at=CASE WHEN ? IS NOT NULL THEN COALESCE(published_at,?) ELSE published_at END,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING *', snapshot, snapshot, now, now, id, data.version).first();
      if (!saved) fail(409, 'This post changed in another window.'); return json({ post: draft(saved) });
    }
  }
  if (path === '/editor/media' && method === 'POST') {
    await limit(env, 'uploads:' + user.id, 15);
    const bytes = await readBytes(req, 5 * 1024 * 1024); let ext, mime;
    if (bytes.length > 8 && [137,80,78,71,13,10,26,10].every((b,i) => bytes[i] === b)) { ext = 'png'; mime = 'image/png'; }
    else if (bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) { ext = 'jpg'; mime = 'image/jpeg'; }
    else if (bytes.length > 12 && new TextDecoder().decode(bytes.slice(0,4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8,12)) === 'WEBP') { ext = 'webp'; mime = 'image/webp'; }
    else fail(400, 'Upload a PNG, JPEG, or WebP image.');
    const id = crypto.randomUUID() + '.' + ext;
    await env.BUCKET.put(id, bytes, { httpMetadata: { contentType: mime } });
    await query(env, 'INSERT INTO media VALUES(?,?,?,?,?)', id, user.id, mime, bytes.length, now).run();
    return json({ url: apiOrigin(env) + '/media/' + id }, 201);
  }
  if (path.startsWith('/admin/')) {
    requireAdmin(user);
    if (path === '/admin/authors' && method === 'GET') return json({ authors: (await query(env, 'SELECT * FROM authors ORDER BY login').all()).results, rootId: rootId(env) });
    if (path === '/admin/authors' && method === 'POST') {
      const data = await readJson(req, 1000);
      if (typeof data.login !== 'string' || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(data.login) || !['author','admin'].includes(data.role)) fail(400, 'Enter a GitHub username and role.');
      const person = await fetchGH(env, 'https://api.github.com/users/' + encodeURIComponent(data.login));
      if (person.type !== 'User') fail(400, 'Approve a person’s GitHub account, not an organization.');
      if (person.id === rootId(env)) fail(400, 'The lab owner is already an administrator.');
      if (person.id === user.id && data.role !== 'admin') fail(400, 'You cannot remove your own administrator access.');
      await query(env, 'INSERT INTO authors VALUES(?,?,?,?,?,?) ON CONFLICT(github_id) DO UPDATE SET login=excluded.login,name=excluded.name,avatar=excluded.avatar,role=excluded.role', person.id, person.login, person.name || person.login, person.avatar_url || '', data.role, now).run();
      return json({ ok: true });
    }
    const who = /^\/admin\/authors\/(\d+)$/.exec(path);
    if (who && method === 'DELETE') {
      const id = Number(who[1]); if (id === rootId(env) || id === user.id) fail(400, 'You cannot remove this administrator.');
      await query(env, 'DELETE FROM authors WHERE github_id=?', id).run(); return json({ ok: true });
    }
    if (path === '/admin/export' && method === 'GET') return json({ exportedAt: new Date().toISOString(), posts: (await query(env, 'SELECT * FROM posts ORDER BY created_at').all()).results, authors: (await query(env, 'SELECT * FROM authors ORDER BY login').all()).results });
  }
  fail(404, 'Page not found.');
}
export default {
  async fetch(req, env, ctx) {
    if (ctx?.waitUntil && Date.now() > nextCleanup) {
      const now = Date.now(); nextCleanup = now + 3600000;
      ctx.waitUntil(Promise.all(['sessions','auth_flows','handoffs'].map(table => query(env, `DELETE FROM ${table} WHERE expires_at<?`, now).run()).concat(query(env, 'DELETE FROM rate_limits WHERE reset_at<?', now - DAY).run())).catch(() => { nextCleanup = 0; }));
    }
    const requestOrigin = req.headers.get('origin');
    const allowed = !requestOrigin || requestOrigin === origin(env) || requestOrigin === apiOrigin(env) || (env.LOCAL_PREVIEW === 'true' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(requestOrigin));
    let response;
    try {
      if (!allowed) fail(403, 'This origin is not allowed.');
      if (req.method === 'OPTIONS') response = new Response(null, { status: 204 });
      else { if (!['GET','HEAD','OPTIONS'].includes(req.method) && !requestOrigin) fail(403, 'Missing request origin.'); response = await route(req, env); }
    } catch (error) {
      if (!(error instanceof HttpError)) console.error('Blog request failed:', error?.message || 'unknown error');
      response = json({ error: error instanceof HttpError ? error.message : 'The blog service is temporarily unavailable. Please try again.' }, error.status || 500);
    }
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff'); headers.set('Referrer-Policy', 'no-referrer'); headers.set('Vary', 'Origin');
    if (allowed && requestOrigin) { headers.set('Access-Control-Allow-Origin', requestOrigin); headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type'); headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); headers.set('Access-Control-Max-Age', '600'); }
    return new Response(response.body, { status: response.status, headers });
  }
};
export { hash, cleanPost, encrypt, decrypt };
