<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { sitePath } from '$lib/paths';
  import { api, postPath, formatDate, type Post } from '$lib/blog/client';
  let posts: Post[] = $state([]), loading = $state(true), error = $state(''), hasMore = $state(false), search = $state(''), tag = $state('');
  let tags = $state<string[]>([]), request = 0;
  async function load(reset = false) {
    const current = ++request; loading = true; error = '';
    try { const query = new URLSearchParams({ offset: String(reset ? 0 : posts.length), q: search, tag });
      const data = await api<{ posts: Post[]; hasMore: boolean; tags: string[] }>('/posts?' + query);
      if (current !== request) return; posts = reset ? data.posts : [...posts, ...data.posts]; hasMore = data.hasMore; tags = data.tags;
    } catch (e) { if (current === request) error = (e as Error).message; } finally { if (current === request) loading = false; }
  }
  $effect(() => { search; tag; const timer = setTimeout(() => { void load(true); }, 250); return () => clearTimeout(timer); });
</script>
<Seo title="Blog — UW Math AI Lab" description="Research notes, experiments, and work in progress from the University of Washington Math AI Lab." path="/blog/" />
<section class="page-shell blog-header">
  <div><span class="eyebrow">FROM THE LAB</span><h1>Blog</h1><p>Research notes, experiments,<br class="desktop-break" /> and work in progress.</p></div>
  <a class="button primary" href={sitePath('/blog/write/')}>Write a post <span aria-hidden="true">↗</span></a>
</section>
<section class="page-shell blog-index" aria-label="Blog posts">
  <div class="filter-row"><span class="index-label">LATEST WRITING</span><label class="search"><span class="sr-only">Search posts</span><input type="search" placeholder="Search posts…" bind:value={search} /></label></div>
  {#if tags.length}<div class="tag-list" aria-label="Filter by topic"><button class:chosen={!tag} onclick={() => tag = ''}>All topics</button>{#each tags as t}<button class:chosen={tag === t} onclick={() => tag = t}>{t}</button>{/each}</div>{/if}
  {#if error}<div class="empty" role="alert"><h2>We couldn’t load the posts.</h2><p>{error}</p><button class="button" onclick={() => load(true)}>Try again</button></div>
  {:else if loading && !posts.length}<div class="loading" aria-live="polite">Loading posts…<div class="skeleton"></div><div class="skeleton"></div></div>
  {:else if !posts.length && (search || tag)}<div class="empty"><h2>No matching posts.</h2><button class="button" onclick={() => { search = ''; tag = ''; }}>Clear filters</button></div>
  {:else if !posts.length}<div class="empty first"><span class="empty-mark" aria-hidden="true">∀∃</span><h2>A place to share what we’re learning.</h2><p>Posts from lab members will appear here.<br />Approved authors can sign in with GitHub to write.</p><a href={sitePath('/blog/write/')}>Open the editor <span aria-hidden="true">→</span></a></div>
  {:else}<div class="posts">{#each posts as post, i}<article class:featured-post={i === 0 && !search && !tag}><a class="post-link" href={postPath(post.slug)}>{#if post.cover}<img class="cover" src={post.cover} alt={post.cover_alt} loading={i ? 'lazy' : 'eager'} />{/if}<div class="post-copy"><div class="post-meta"><time datetime={new Date(post.published_at).toISOString()}>{formatDate(post.published_at)}</time>{#if post.tags[0]}<span>{post.tags[0]}</span>{/if}</div><h2>{post.title}</h2><p>{post.summary}</p><div class="byline"><span>{post.author.name}</span><span aria-hidden="true">↗</span></div></div></a></article>{/each}</div>{/if}
  {#if hasMore}<button class="button more" onclick={() => load()} disabled={loading}>{loading ? 'Loading…' : 'More posts'}</button>{/if}
</section>
<style>
  .blog-header { padding: 4rem 0 3rem; display: flex; justify-content: space-between; align-items: end; gap: 2rem; }
  .eyebrow,.index-label { font: 600 .8rem var(--font-sans); letter-spacing: .13em; color: var(--purple); }
  h1 { font-size: clamp(3.5rem,7vw,6rem); line-height: 1.05; margin: .7rem 0 1rem; }
  .blog-header p { font-size: 1.35rem; margin: 0; color: var(--muted); line-height: 1.5; }
  .blog-header .button { gap: 2rem; margin-bottom: .3rem; }
  .blog-index { border-top: 1px solid var(--line-strong); }
  .filter-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 0; }
  .index-label { color: var(--muted); }
  .search input { border: 0; border-bottom: 1px solid var(--line); background: transparent; color: var(--text); padding: .6rem .2rem; font: .95rem var(--font-sans); width: min(260px,40vw); }
  .tag-list { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.3rem; }
  .tag-list button { border: 1px solid var(--line); background: transparent; color: var(--muted); font: .85rem var(--font-sans); padding: .45rem .7rem; cursor: pointer; }
  .tag-list button.chosen { background: var(--soft-purple); border-color: var(--purple); color: var(--purple); }
  .posts { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0 2.5rem; }
  article { border-top: 1px solid var(--line); padding: 2rem 0; }
  article.featured-post { grid-column: 1/-1; }
  .post-link { text-decoration: none; display: block; height: 100%; }
  .post-link:hover h2 { color: var(--purple); }
  .cover { aspect-ratio: 16/9; object-fit: cover; width: 100%; margin-bottom: 1.4rem; }
  .featured-post .post-link:has(.cover) { display: grid; grid-template-columns: 1.1fr 1fr; align-items: center; gap: 3rem; }
  .featured-post .cover { margin: 0; }
  .post-meta { display: flex; gap: 1.2rem; font: .8rem var(--font-sans); color: var(--muted); margin-bottom: 1rem; }
  .post-meta span { color: var(--purple); }
  h2 { font-size: 1.8rem; line-height: 1.25; }
  .featured-post h2 { font-size: clamp(2rem,3vw,2.75rem); }
  .post-copy p { color: var(--muted); font-size: 1.1rem; }
  .byline { display: flex; justify-content: space-between; margin-top: 1.5rem; font: .9rem var(--font-sans); }
  .empty { text-align: center; padding: 4rem 1rem 5rem; border-bottom: 1px solid var(--line); }
  .empty-mark { font-size: 4rem; color: var(--purple); letter-spacing: -.12em; display: block; margin-bottom: 1rem; }
  .empty p { color: var(--muted); font-size: 1.15rem; line-height: 1.6; }
  .empty a { display: inline-block; margin-top: .5rem; font-family: var(--font-sans); color: var(--purple); }
  .loading { padding: 2rem 0; color: var(--muted); }
  .skeleton { height: 7rem; margin-top: 1rem; background: var(--soft); border-top: 1px solid var(--line); }
  .more { margin: 2rem auto; display: block; }
  @media(max-width:650px) { .blog-header { align-items: start; flex-direction: column; padding: 2.5rem 0 2rem; gap: 1.5rem; } .posts { grid-template-columns: 1fr; } .featured-post .post-link:has(.cover) { display: block; } .featured-post .cover { margin-bottom: 1.4rem; } .empty h2 { font-size: 1.6rem; } .empty { padding: 3rem .5rem; } }
</style>
