<script lang="ts">
  import type { LabEvent } from '$lib/content/schema';
  import { sitePath } from '$lib/paths';
  let { event }: { event: LabEvent } = $props();
</script>
<details class="event-details">
  <summary>Event details <span aria-hidden="true">＋</span></summary>
  <div class="event-description">
    {#each (event.abstract ?? '').split(/\n\s*\n/).filter(Boolean) as paragraph}<p>{paragraph.trim()}</p>{/each}
    {#if event.details?.length}<ul>{#each event.details as detail}<li>{detail}</li>{/each}</ul>{/if}
    {#if event.papers?.length}<ul>{#each event.papers as paper}<li><a href={paper.url} target="_blank" rel="noreferrer">{paper.title}</a>{#if paper.badge} · {paper.badge}{/if}</li>{/each}</ul>{/if}
    {#if event.photos?.length}<div class="event-photos">{#each event.photos as photo}<figure><img src={sitePath(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" /><figcaption>{photo.caption}</figcaption></figure>{/each}</div>{/if}
    <div class="event-links">
      {#if event.sourceUrl}<a href={event.sourceUrl} target="_blank" rel="noreferrer">{event.sourceLabel ?? 'UW Math source'} ↗</a>{/if}
      {#each event.links ?? [] as link}{#if link.closed}<span class="closed">{link.label} (closed)</span>{:else}<a href={link.url.startsWith('/') ? sitePath(link.url) : link.url} target={link.url.startsWith('http') ? '_blank' : undefined} rel={link.url.startsWith('http') ? 'noreferrer' : undefined}>{link.label} ↗</a>{/if}{/each}
    </div>
  </div>
</details>
<style>
  .event-details { margin-top: .9rem; }
  summary { display: flex; align-items: center; gap: .75rem; width: fit-content; color: var(--purple); cursor: pointer; list-style: none; font: 600 .88rem/1.5 var(--font-sans); }
  summary::-webkit-details-marker { display: none; } summary span { transition: transform .15s; } details[open] summary span { transform: rotate(45deg); }
  .event-description { border-left: 2px solid var(--line); padding: .1rem 0 .1rem 1.2rem; margin-top: 1rem; font-size: 1.05rem; line-height: 1.65; overflow-wrap: anywhere; }
  .event-description p { margin: .4rem 0 1rem; color: var(--muted); }
  ul { padding-left: 1.2rem; } li+li { margin-top: .4rem; }
  .event-links { display: flex; flex-wrap: wrap; gap: .5rem 1.2rem; font: 600 .86rem/1.6 var(--font-sans); }
  a { color: var(--purple); } .closed { color: var(--muted); font-weight: 400; }
  .event-photos { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,240px),1fr)); gap: 1rem; margin: 1rem 0; }
  figure { margin: 0; } img { display: block; width: 100%; height: auto; } figcaption { margin-top: .4rem; font: .8rem/1.5 var(--font-sans); color: var(--muted); }
</style>
