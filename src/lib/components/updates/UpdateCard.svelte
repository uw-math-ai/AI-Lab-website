<script lang="ts">
  import type { Update } from '$lib/updates';
  import { displayDay } from '$lib/updates';
  import { sitePath } from '$lib/paths';
  import { postPath, formatDate } from '$lib/blog/client';
  import { timeRange } from '$lib/calendar';
  import EventDetails from './EventDetails.svelte';
  let { item, first = false }: { item: Update; first?: boolean } = $props();
  const image = $derived(item.kind === 'news' ? item.news.image : item.kind === 'blog' && item.post.cover ? { src: item.post.cover, alt: item.post.cover_alt } : undefined);
  const href = $derived(item.kind === 'blog' ? postPath(item.post.slug) : item.kind === 'news' ? item.news.links[0]?.url : undefined);
  const link = (url: string) => url.startsWith('/') ? sitePath(url) : url;
</script>
<article id={item.id} class="update-card interactive-surface" class:first data-kind={item.kind}>
  <div class="update-meta"><span>{item.kind === 'events' ? item.event.type : item.kind === 'blog' ? 'Blog' : 'News'}</span><time datetime={item.kind === 'news' ? item.news.date : new Date(item.timestamp).toISOString()}>{item.kind === 'blog' ? formatDate(item.timestamp) : displayDay(item.kind === 'news' ? item.news.date : item.event.date)}</time></div>
  <div class="update-content" class:illustrated={!!image}>
    <div class="update-copy">
      <h3>{#if href}<a href={link(href)}>{item.title}</a>{:else}{item.title}{/if}</h3>
      {#if item.kind === 'news'}<p>{item.news.summary}</p><div class="update-links">{#each item.news.links as source}<a href={link(source.url)} target={source.url.startsWith('http') ? '_blank' : undefined} rel={source.url.startsWith('http') ? 'noreferrer' : undefined}>{source.label} <span aria-hidden="true">↗</span></a>{/each}</div>
      {:else if item.kind === 'blog'}<p>{item.post.summary}</p><div class="post-byline"><span>{item.post.author.name}</span><a href={postPath(item.post.slug)}>Read post <span aria-hidden="true">→</span></a></div>{#if item.post.tags.length}<div class="post-topics">{item.post.tags.join(' · ')}</div>{/if}
      {:else}{#if item.event.speaker}<p class="speaker">{item.event.speaker}</p>{/if}<p class="event-meta">{[timeRange(item.event), item.event.location].filter(Boolean).join(' · ')}</p><EventDetails event={item.event} />{/if}
    </div>
    {#if image}<a class="update-image" href={href ? link(href) : '#' + item.id} tabindex="-1"><img src={image.src.startsWith('/') ? sitePath(image.src) : image.src} alt={image.alt} loading="lazy" decoding="async" /></a>{/if}
  </div>
</article>
<style>
  .update-card { padding: 1.8rem 0; border-bottom: 1px solid var(--line); scroll-margin-top: 6rem; }
  .update-card:first-child { padding-top: 0; }
  .update-meta { display: flex; flex-wrap: wrap; gap: .4rem 1rem; font: .8rem/1.5 var(--font-sans); margin-bottom: .65rem; }
  .update-meta>span { color: var(--purple); font-weight: 600; } time { color: var(--muted); }
  .update-content { display: grid; gap: 1.5rem; } .update-content.illustrated { grid-template-columns: minmax(0,1fr) 170px; }
  .update-copy { min-width: 0; } h3 { margin: 0 0 .7rem; font-size: 1.65rem; line-height: 1.22; text-wrap: pretty; }
  .first h3 { font-size: clamp(1.8rem,2.5vw,2.2rem); } h3 a { color: var(--heading); text-decoration: none; } h3 a:hover { color: var(--purple); }
  p { margin: 0 0 1rem; font-size: 1.08rem; line-height: 1.6; color: var(--muted); }
  .event-meta { font: .88rem/1.65 var(--font-sans); margin: .5rem 0; } .speaker { color: var(--text); margin: .5rem 0; }
  .update-links,.post-byline { display: flex; flex-wrap: wrap; gap: .5rem 1.2rem; font: .85rem/1.6 var(--font-sans); }
  .update-links a,.post-byline a { color: var(--purple); font-weight: 600; } .post-byline { justify-content: space-between; }
  .post-topics { color: var(--muted); font: .78rem/1.6 var(--font-sans); margin-top: .65rem; }
  .update-image { align-self: start; display: block; } .update-image img { width: 100%; height: auto; aspect-ratio: 4/3; object-fit: cover; display: block; }
  @media(max-width:600px) { .update-content.illustrated { grid-template-columns: 1fr; gap: 1rem; } .update-image { grid-row: 1; } .update-image img { aspect-ratio: 16/9; } h3 { font-size: 1.55rem; } p { font-size: 1.04rem; } .update-card { padding: 1.5rem 0; } }
</style>
