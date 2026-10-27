<script lang="ts">
  import { onMount } from 'svelte';
  import Seo from '$lib/components/Seo.svelte';
  import BlogProse from '$lib/components/BlogProse.svelte';
  import { api, formatDate, readingTime, postPath, type Post } from '$lib/blog/client';
  import { sitePath } from '$lib/paths';
  let post: Post | null = $state(null), error = $state(''), copied = $state(false);
  onMount(() => { const slug = new URL(location.href).searchParams.get('slug'); if (!slug) { error = 'Choose a post from the blog.'; return; } api<{ post: Post }>('/posts/' + encodeURIComponent(slug)).then(data => post = data.post).catch(e => error = e.message); });
  async function copy() { try { await navigator.clipboard.writeText(location.href); copied = true; setTimeout(() => copied = false, 2000); } catch { error = 'Copy the address from your browser to share this post.'; } }
</script>
<Seo title={post ? `${post.title} — UW Math AI Lab` : 'Blog post — UW Math AI Lab'} description={post?.summary || 'Writing from the UW Math AI Lab.'} path={post ? postPath(post.slug) : '/blog/post/'} type="article" />
<section class="page-shell reader">
  <a class="back" href={sitePath('/news/?view=blog')}>← All posts</a>
  {#if post}<header><div class="tags">{post.tags.join(' · ')}</div><h1>{post.title}</h1><p class="summary">{post.summary}</p><div class="byline"><a href={'https://github.com/' + post.author.login}>{post.author.name}</a><span>{formatDate(post.published_at)} · {readingTime(post.body)} min read</span></div></header>{#if post.cover}<figure><img src={post.cover} alt={post.cover_alt} /></figure>{/if}<div class="reading"><BlogProse body={post.body} /></div><footer><a href={sitePath('/news/?view=blog')}>← Back to the blog</a><button onclick={copy}>{copied ? 'Link copied' : 'Copy link ↗'}</button></footer>
  {:else if error}<div class="notice" role="alert"><h1>Post unavailable</h1><p>{error}</p><a href={sitePath('/news/?view=blog')}>Browse the blog →</a></div>
  {:else}<p class="notice" aria-live="polite">Loading post…</p>{/if}
</section>
<style>
  .reader { padding-top: 2.5rem; }
  .back { font: .9rem var(--font-sans); text-decoration: none; color: var(--muted); }
  header { max-width: 800px; margin: 3rem auto 2rem; }
  .tags { font: .8rem var(--font-sans); text-transform: uppercase; letter-spacing: .1em; color: var(--purple); margin-bottom: 1rem; }
  h1 { font-size: clamp(2.3rem,4.5vw,3.8rem); line-height: 1.12; }
  .summary { font-size: 1.4rem; line-height: 1.5; color: var(--muted); margin: 1.5rem 0; }
  .byline { display: flex; flex-wrap: wrap; gap: .7rem 2rem; border-top: 1px solid var(--line); padding-top: 1.2rem; font: .9rem var(--font-sans); color: var(--muted); }
  .byline a { color: var(--text); }
  figure { margin: 2.5rem auto; max-width: 900px; } figure img { width: 100%; max-height: 600px; object-fit: contain; }
  .reading { max-width: 720px; margin: 3rem auto; }
  footer { max-width: 720px; margin: 4rem auto 0; display: flex; gap: 1rem; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 1.5rem; font: .9rem var(--font-sans); }
  footer button { background: none; border: none; color: var(--purple); cursor: pointer; }
  .notice { padding: 4rem 0; }
  @media(max-width:600px) { header { margin-top: 2rem; } .summary { font-size: 1.2rem; } }
</style>
