<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { page } from '$app/stores';
  import { pushState, replaceState } from '$app/navigation';
  import Seo from '$lib/components/Seo.svelte';
  import { labNews } from '$lib/data/news';
  import { labEvents } from '$lib/data/events';
  import { pages } from '$lib/data/pages';
  import { routePath, sitePath } from '$lib/paths';
  import { api, type Post } from '$lib/blog/client';
  import { eventRange } from '$lib/calendar';
  import { collectionPage, graph, organizationId } from '$lib/structuredData';
  import { timeline, matchesUpdate, eventSearchText, type UpdateView } from '$lib/updates';
  import UpdateCard from './UpdateCard.svelte';
  import UpcomingAgenda from './UpcomingAgenda.svelte';

  let { initialView = 'all' }: { initialView?: UpdateView } = $props();
  const views: { value: UpdateView; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'news', label: 'News' }, { value: 'events', label: 'Events' }, { value: 'blog', label: 'Blog' }];
  const types = [...new Set(labEvents.map(event => event.type))];
  const LIMIT = 8;
  let view: UpdateView = $state(untrack(() => initialView)), query = $state(''), type = $state(''), tag = $state('');
  let mounted = $state(false), now = $state(Date.now()), visible = $state(LIMIT);
  let posts: Post[] = $state([]), tags: string[] = $state([]), loading = $state(true), hasMore = $state(false), error = $state('');
  let request = 0;
  const { title, description } = pages.news;
  const jsonLd = graph(collectionPage(title, '/news/', description), {
    '@type': 'ItemList', name: 'UW Math AI Lab events', itemListElement: labEvents.map((event, index) => ({
      '@type': 'ListItem', position: index + 1, item: {
        '@type': 'Event', name: event.title,
        startDate: new Date(eventRange(event).start).toISOString(), endDate: new Date(eventRange(event).end).toISOString(),
        location: event.location ? { '@type': 'Place', name: event.location } : { '@type': 'VirtualLocation', url: event.sourceUrl ?? 'https://ai.math.uw.edu/news/?view=events' },
        eventAttendanceMode: `https://schema.org/${event.location ? 'Offline' : 'Online'}EventAttendanceMode`,
        organizer: event.organizer ? { '@type': 'Organization', ...event.organizer } : { '@id': organizationId },
        ...(event.abstract ? { description: event.abstract } : {}), ...(event.sourceUrl ? { url: event.sourceUrl } : {})
      }
    }))
  });

  // The legacy URLs open the same hub with their corresponding filter. Query parameters
  // are read only in the browser, keeping this page compatible with static hosting.
  $effect(() => {
    if (!mounted) return;
    // Shallow routing updates page state, while page.url remains the loaded route.
    $page;
    const url = new URL(window.location.href);
    const selected = url.searchParams.get('view');
    view = views.some(item => item.value === selected) ? selected as UpdateView : routePath(url.pathname) === '/events' ? 'events' : routePath(url.pathname) === '/blog' ? 'blog' : 'all';
    query = url.searchParams.get('q') ?? '';
    type = types.includes(url.searchParams.get('type') as typeof types[number]) ? url.searchParams.get('type')! : '';
    tag = url.searchParams.get('tag') ?? '';
    visible = LIMIT;
    if (url.hash) void revealAnchor(url.hash);
  });
  onMount(() => {
    mounted = true; now = Date.now();
    const timer = setInterval(() => now = Date.now(), 60000);
    return () => { clearInterval(timer); request++; };
  });

  function setFilters(next: { view?: UpdateView; query?: string; type?: string; tag?: string }, replace = false) {
    const params = new URLSearchParams();
    const selected = next.view ?? view, q = next.query ?? query, eventType = next.type ?? type, topic = next.tag ?? tag;
    if (selected !== 'all') params.set('view', selected);
    if (q.trim()) params.set('q', q);
    if (selected === 'events' && eventType) params.set('type', eventType);
    if (selected === 'blog' && topic) params.set('tag', topic);
    const url = sitePath('/news/') + (params.size ? '?' + params : '');
    if (replace) replaceState(url, {}); else pushState(url, {});
  }
  async function revealAnchor(hash: string) {
    let id: string; try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    visible = Number.MAX_SAFE_INTEGER;
    await tick();
    const target = document.getElementById(id);
    if (!target) return;
    const details = target.querySelector('details'); if (details) details.open = true;
    target.scrollIntoView({ block: 'start' });
  }
  async function load(reset = false) {
    const current = ++request;
    loading = true; error = '';
    try {
      const params = new URLSearchParams({ offset: String(reset ? 0 : posts.length), q: query, tag: view === 'blog' ? tag : '' });
      const data = await api<{ posts: Post[]; hasMore: boolean; tags: string[] }>('/posts?' + params);
      if (current !== request) return;
      posts = reset ? data.posts : [...posts, ...data.posts];
      hasMore = data.hasMore; tags = data.tags;
    } catch (e) { if (current === request) error = (e as Error).message; }
    finally { if (current === request) loading = false; }
  }
  $effect(() => {
    if (!mounted) return;
    query; tag; view;
    request++; posts = []; hasMore = false; error = '';
    loading = showingBlog;
    if (!showingBlog) return;
    const timer = setTimeout(() => { void load(true); }, 200);
    return () => { clearTimeout(timer); request++; };
  });

  const searching = $derived(query.trim().toLowerCase());
  const matching = $derived(timeline(labNews, labEvents, posts, now).filter(item =>
    (view === 'all' || item.kind === view) &&
    (item.kind === 'blog' || matchesUpdate(item, query)) &&
    (view !== 'events' || !type || item.kind === 'events' && item.event.type === type)
  ));
  // Stop at the oldest loaded post until the next blog page is fetched. This keeps
  // older static news from appearing ahead of posts we have not loaded yet.
  const cutoff = $derived(view === 'all' && hasMore && posts.length && !error ? Math.min(...posts.map(post => post.published_at)) : -Infinity);
  const items = $derived(matching.filter(item => item.timestamp >= cutoff));
  const upcoming = $derived(labEvents.filter(event => eventRange(event).end >= now &&
    (!(view === 'all' || view === 'events') || eventSearchText(event).toLowerCase().includes(searching)) &&
    (view !== 'events' || !type || event.type === type)).sort((a,b) => eventRange(a).start - eventRange(b).start));
  const showingBlog = $derived(view === 'all' || view === 'blog');
  const canLoadMore = $derived(visible < items.length || showingBlog && hasMore);
  const sectionTitle = $derived(view === 'events' ? 'Past events' : view === 'news' ? 'Latest news' : view === 'blog' ? 'Blog posts' : 'Latest updates');
  async function more() {
    if (visible >= items.length && hasMore && showingBlog) await load();
    visible = view === 'events' ? items.length : visible + LIMIT;
  }
</script>

<Seo {title} {description} path="/news/" {jsonLd} />
<section class="page-shell updates-heading">
  <div><span class="eyebrow">FROM THE LAB</span><h1>News &amp; Events</h1><p>News, gatherings, and writing from our community.</p></div>
  <a class="button primary write-post" href={sitePath('/blog/write/')}>Write a post <span aria-hidden="true">↗</span></a>
</section>
<section class="page-shell updates-hub" aria-label="News, events, and blog">
  <div class="updates-toolbar">
    <div class="view-filters" role="group" aria-label="Filter updates">{#each views as option}<button aria-pressed={view === option.value} class:selected={view === option.value} onclick={() => setFilters({ view: option.value, type: '', tag: '' })}>{option.label}</button>{/each}</div>
    <label class="updates-search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.8"/><path d="m13 13 4.5 4.5"/></svg><span class="sr-only">Search updates</span><input type="search" value={query} oninput={event => setFilters({ query: event.currentTarget.value }, true)} placeholder="Search updates…" /></label>
  </div>
  {#if view === 'events'}<div class="secondary-filters"><label>Event type <select value={type} onchange={event => setFilters({ type: event.currentTarget.value })}><option value="">All types</option>{#each types as option}<option value={option}>{option}</option>{/each}</select></label></div>
  {:else if view === 'blog' && tags.length}<div class="secondary-filters topics" role="group" aria-label="Filter by topic"><button aria-pressed={!tag} onclick={() => setFilters({ tag: '' })}>All topics</button>{#each tags as topic}<button aria-pressed={tag === topic} onclick={() => setFilters({ tag: topic })}>{topic}</button>{/each}</div>{/if}
  <div class="updates-layout">
    <div class="agenda-column"><UpcomingAgenda events={upcoming} searching={!!searching && (view === 'all' || view === 'events') || view === 'events' && !!type} /></div>
    <section class="feed" aria-labelledby={view === 'events' ? 'past-heading' : 'feed-heading'}>
      <div class="feed-heading"><h2 id={view === 'events' ? 'past-heading' : 'feed-heading'}>{sectionTitle}</h2>{#if searching}<span class="search-status" aria-live="polite">Results for “{query}”</span>{/if}</div>
      {#if showingBlog && error}<div class="blog-error" role="alert"><p>Blog posts couldn’t be loaded. {view === 'all' ? 'News and events are still available.' : 'Please try again.'}</p><button onclick={() => load(posts.length === 0)} disabled={loading}>Try again</button></div>{/if}
      {#if items.length}
        <div class="update-list">{#each items as item, index (item.id)}<div hidden={index >= visible}><UpdateCard {item} first={index === 0} /></div>{/each}</div>
      {:else if view === 'blog' && loading}<p class="loading" role="status">Loading posts…</p>
      {:else if !(view === 'blog' && error)}
        <div class="empty-feed">
          {#if !searching && !tag && !type && view === 'blog'}<span class="empty-mark" aria-hidden="true">∀∃</span><h3>Writing from the lab</h3><p>Research notes, experiments, and work in progress.<br />Our first posts will appear here.</p><a href={sitePath('/blog/write/')}>Sign in with GitHub to write <span aria-hidden="true">→</span></a>
          {:else}<h3>{searching || type || tag ? 'No matching updates.' : view === 'events' ? 'No past events yet.' : 'No updates yet.'}</h3>{#if searching || type || tag}<button class="button" onclick={() => setFilters({ query: '', type: '', tag: '' })}>Clear filters</button>{/if}{/if}
        </div>
      {/if}
      {#if canLoadMore}<button class="button more-updates" onclick={more} disabled={loading && showingBlog}>{loading && showingBlog ? 'Loading posts…' : view === 'events' ? `View all ${items.length} past events` : 'More updates'} <span aria-hidden="true">↓</span></button>{/if}
      {#if showingBlog && loading && items.length}<p class="loading" role="status">Loading blog posts…</p>{/if}
    </section>
  </div>
</section>
<style>
  .updates-heading { display: flex; justify-content: space-between; align-items: end; gap: 2rem; padding: 3.6rem 0 2.6rem; }
  .eyebrow { font: 600 .78rem/1.5 var(--font-sans); color: var(--purple); letter-spacing: .12em; }
  h1 { font-size: clamp(2.8rem,5.5vw,4.6rem); line-height: 1.08; margin: .7rem 0 .8rem; letter-spacing: -.025em; }
  .updates-heading p { font-size: 1.2rem; line-height: 1.5; color: var(--muted); margin: 0; }
  .write-post { gap: 1.8rem; flex-shrink: 0; margin-bottom: .15rem; }
  .updates-toolbar { border-top: 1px solid var(--line-strong); border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; padding: .7rem 0; }
  .view-filters { display: flex; gap: .3rem; }
  .view-filters button { border: 1px solid transparent; background: transparent; color: var(--muted); padding: .6rem 1rem; cursor: pointer; font: 500 .95rem/1.4 var(--font-sans); }
  .view-filters button:hover { color: var(--purple); background: var(--soft-purple); }
  .view-filters button.selected { background: var(--purple); color: var(--bg); border-color: var(--purple); }
  .updates-search { display: flex; align-items: center; gap: .65rem; max-width: 17rem; width: 35%; }
  .updates-search svg { width: 18px; height: 18px; fill: none; stroke: var(--muted); stroke-width: 1.4; flex-shrink: 0; }
  .updates-search input { padding: .6rem .2rem; border: 0; border-bottom: 1px solid transparent; background: transparent; color: var(--text); font: .9rem/1.4 var(--font-sans); width: 100%; min-width: 0; }
  .updates-search input::placeholder { color: var(--muted); opacity: 1; } .updates-search input:focus { border-bottom-color: var(--purple); }
  .secondary-filters { margin-top: 1.1rem; color: var(--muted); font: .85rem/1.5 var(--font-sans); }
  .secondary-filters label { display: flex; align-items: center; gap: .8rem; }
  .secondary-filters select { background: var(--bg); border: 1px solid var(--line); color: var(--text); padding: .5rem; font: inherit; }
  .topics { display: flex; flex-wrap: wrap; gap: .5rem; } .topics button { background: transparent; color: var(--muted); border: 1px solid var(--line); padding: .4rem .7rem; cursor: pointer; font: inherit; }
  .topics button[aria-pressed='true'] { background: var(--soft-purple); color: var(--purple); border-color: var(--purple); }
  .updates-layout { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: clamp(2rem,4vw,3.5rem); margin-top: 2.2rem; align-items: start; }
  .agenda-column { grid-column: 2; grid-row: 1; min-width: 0; }
  .feed { grid-column: 1; grid-row: 1; min-width: 0; }
  .feed-heading { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .7rem; margin-bottom: 1.8rem; }
  .feed-heading h2 { font: 500 .78rem/1.5 var(--font-sans); letter-spacing: .09em; text-transform: uppercase; color: var(--muted); margin: 0; }
  .search-status { font: .8rem/1.5 var(--font-sans); color: var(--muted); overflow-wrap: anywhere; }
  .update-list>div+div { padding-top: 1.8rem; }
  .blog-error { background: var(--soft); border-left: 2px solid var(--purple); padding: 1rem; margin-bottom: 1.5rem; font: .9rem/1.5 var(--font-sans); }
  .blog-error p { margin: 0 0 .5rem; } .blog-error button { border: 0; background: none; color: var(--purple); padding: .25rem 0; text-decoration: underline; cursor: pointer; font: inherit; }
  .loading { font: .85rem/1.5 var(--font-sans); color: var(--muted); padding: 1rem 0; }
  .empty-feed { text-align: center; border: 1px solid var(--line); padding: 3.5rem 1.5rem; background: var(--bg); }
  .empty-mark { font-size: 3rem; color: var(--purple); letter-spacing: -.1em; }
  .empty-feed h3 { font-size: 1.7rem; margin: .5rem 0 .8rem; } .empty-feed p { color: var(--muted); font-size: 1.1rem; line-height: 1.6; }
  .empty-feed a { display: inline-block; font: .9rem/1.5 var(--font-sans); color: var(--purple); margin-top: .7rem; }
  .more-updates { display: flex; justify-content: center; gap: 1.5rem; width: 100%; margin-top: 1.8rem; }
  @media(max-width:1000px) { .updates-layout { grid-template-columns: minmax(0,1fr) 290px; gap: 2rem; } }
  @media(max-width:800px) {
    .updates-heading { padding: 2.5rem 0 2rem; align-items: start; } .updates-heading p { font-size: 1.1rem; } .write-post { gap: .8rem; }
    .updates-layout { grid-template-columns: 1fr; gap: 2rem; margin-top: 1.5rem; }
    .agenda-column,.feed { grid-column: 1; grid-row: auto; }
  }
  @media(max-width:600px) {
    .updates-heading { flex-direction: column; gap: 1.3rem; } h1 { font-size: 2.8rem; }
    .updates-toolbar { flex-wrap: wrap; gap: .5rem; padding: .7rem 0; } .view-filters { width: 100%; justify-content: space-between; }
    .view-filters button { padding: .55rem 1rem; } .updates-search { width: 100%; max-width: none; padding: .2rem .35rem 0; }
    .feed-heading { margin-bottom: 1.5rem; } .update-list>div+div { padding-top: 1.5rem; }
    .empty-feed { padding: 2.5rem 1rem; }
  }
</style>
