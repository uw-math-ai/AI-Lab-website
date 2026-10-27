import { sitePath } from '$lib/paths';
export const API = import.meta.env.VITE_BLOG_API || 'https://uw-math-ai-blog-service.zengrf2000.chatgpt.site';
export type BlogUser = { id: number; login: string; name: string; avatar: string; role: 'reader' | 'author' | 'admin' };
export type Post = { id: string; title: string; slug: string; summary: string; body: string; tags: string[]; cover: string; cover_alt: string; author: { id: number; login: string; name: string }; published_at: number; updated_at: number };
export type Draft = Omit<Post, 'author'> & { author_id: number; author_login: string; author_name: string; version: number; created_at: number; published: boolean };
export type Author = { github_id: number; login: string; name: string; avatar: string; role: string };
export class BlogError extends Error { constructor(public status: number, message: string) { super(message); } }
export function token() { return sessionStorage.getItem('math-ai-blog-session') || ''; }
export async function api<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
  const session = typeof sessionStorage !== 'undefined' ? token() : '';
  const response = await fetch(API + path, { method, headers: { ...(session ? { Authorization: 'Bearer ' + session } : {}), ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}) }, ...(data !== undefined ? { body: JSON.stringify(data) } : {}), signal: AbortSignal.timeout(25000) });
  let body; try { body = await response.json(); } catch { throw new BlogError(response.status, 'The blog service could not be reached. Please try again.'); }
  if (!response.ok) { if (response.status === 401) sessionStorage.removeItem('math-ai-blog-session'); throw new BlogError(response.status, body.error || 'The request could not be completed.'); }
  return body;
}
const b64 = (bytes: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export async function signIn() {
  const verifier = b64(crypto.getRandomValues(new Uint8Array(32))), state = b64(crypto.getRandomValues(new Uint8Array(32)));
  sessionStorage.setItem('math-ai-blog-oauth', JSON.stringify({ verifier, state }));
  const challenge = b64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  const url = new URL(API + '/auth/github/start');
  url.search = new URLSearchParams({ challenge, state, return_to: location.origin + sitePath('/blog/write/') }).toString();
  location.assign(url.href);
}
export async function completeSignIn() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (!params.has('code')) return;
  history.replaceState(null, '', location.pathname + location.search);
  const pending = JSON.parse(sessionStorage.getItem('math-ai-blog-oauth') || 'null');
  sessionStorage.removeItem('math-ai-blog-oauth');
  if (!pending || pending.state !== params.get('state')) throw new Error('This sign-in belongs to another browser session. Please sign in again.');
  const result = await api<{ token: string }>('/auth/exchange', 'POST', { code: params.get('code'), verifier: pending.verifier });
  sessionStorage.setItem('math-ai-blog-session', result.token);
}
export async function signOut() { try { await api('/auth/logout', 'POST', {}); } finally { sessionStorage.removeItem('math-ai-blog-session'); } }
export async function uploadImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be smaller than 5 MB.');
  const r = await fetch(API + '/editor/media', { method: 'POST', headers: { Authorization: 'Bearer ' + token(), 'Content-Type': file.type }, body: file, signal: AbortSignal.timeout(45000) });
  const body = await r.json(); if (!r.ok) throw new BlogError(r.status, body.error || 'The image could not be uploaded.'); return body.url;
}
export const postPath = (slug: string) => sitePath('/blog/post/') + '?slug=' + encodeURIComponent(slug);
export const formatDate = (date: number) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' }).format(date);
export const readingTime = (body: string) => Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
export function download(name: string, text: string, type = 'text/markdown') { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
