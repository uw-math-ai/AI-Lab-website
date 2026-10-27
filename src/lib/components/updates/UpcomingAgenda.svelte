<script lang="ts">
  import type { LabEvent } from '$lib/content/schema';
  import { displayDay, eventId } from '$lib/updates';
  import { googleCalendarUrl, hasHours, icsFile, outlookCalendarUrl, timeRange } from '$lib/calendar';
  import EventDetails from './EventDetails.svelte';
  let { events, searching = false }: { events: LabEvent[]; searching?: boolean } = $props();
  let expanded = $state(false), showAll = $state(false);
  const shown = $derived(showAll || searching ? events : events.slice(0, 3));
</script>
<aside class="agenda interactive-surface" aria-labelledby="upcoming-heading">
  <div class="agenda-heading"><h2 id="upcoming-heading">Upcoming <span>{events.length}</span></h2><button class="agenda-toggle" aria-expanded={expanded} aria-controls="agenda-list" onclick={() => expanded = !expanded}>{expanded ? 'Hide' : 'Show'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button></div>
  <p class="agenda-note">Times are local to the event.</p>
  {#if !expanded && events[0]}<p class="next-event"><span>{displayDay(events[0].date)}</span> · {events[0].title}</p>{/if}
  <div id="agenda-list" class:expanded>
    {#each shown as event (eventId(event))}
      <article class="agenda-event" id={eventId(event)}>
        <div class="agenda-date" aria-hidden="true"><span>{new Date(event.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}</span><strong>{Number(event.date.slice(-2))}</strong></div>
        <div class="agenda-copy"><span class="sr-only">{displayDay(event.date)}</span><div class="agenda-type">{event.type} · {event.date.slice(0,4)}</div><h3>{event.title}</h3>{#if event.speaker}<p>{event.speaker}</p>{/if}<p class="agenda-place">{#if timeRange(event)}<span>{timeRange(event)}</span>{/if}{#if event.location}<span>{event.location}</span>{/if}</p></div>
        <div class="agenda-actions">
          {#if hasHours(event)}<details class="calendar"><summary>Add to calendar <span aria-hidden="true">＋</span></summary><div class="calendar-links"><a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer">Google</a><a href={outlookCalendarUrl(event)} target="_blank" rel="noreferrer">Outlook</a><a href={icsFile(event).href} download={icsFile(event).filename}>Apple / .ics</a></div></details>{/if}
          {#if event.abstract || event.details?.length || event.links?.length || event.sourceUrl || event.photos?.length || event.papers?.length}<EventDetails {event} />{/if}
        </div>
      </article>
    {:else}<p class="agenda-empty">{searching ? 'No upcoming events match your search.' : 'New dates will appear here when announced.'}</p>{/each}
    {#if events.length > 3 && !searching}<button class="agenda-more" onclick={() => showAll = !showAll}>{showAll ? 'Show fewer events' : `View all ${events.length} upcoming events`}</button>{/if}
  </div>
</aside>
<style>
  .agenda { padding: 1.45rem; border: 1px solid var(--line); border-top: 3px solid var(--purple); background: var(--bg); min-width: 0; }
  .agenda-heading { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  h2 { margin: 0; font-size: 1.45rem; display: flex; align-items: center; gap: .65rem; } h2>span { font: .8rem var(--font-sans); color: var(--muted); }
  .agenda-note { font: .75rem/1.5 var(--font-sans); color: var(--muted); margin: .4rem 0 1.4rem; }
  .agenda-toggle,.next-event { display: none; }
  .agenda-event { display: grid; grid-template-columns: 40px minmax(0,1fr); gap: .65rem 1rem; padding: 1.3rem 0; border-top: 1px solid var(--line); scroll-margin-top: 6rem; }
  .agenda-date { text-align: center; color: var(--purple); } .agenda-date span { display: block; font: .75rem/1.4 var(--font-sans); text-transform: uppercase; letter-spacing: .06em; } .agenda-date strong { display: block; font-size: 2.1rem; line-height: 1.15; font-weight: 500; }
  .agenda-type { font: .73rem/1.5 var(--font-sans); color: var(--muted); margin-bottom: .35rem; }
  h3 { margin: 0 0 .55rem; font-size: 1.25rem; line-height: 1.25; text-wrap: pretty; }
  .agenda-copy p { font-size: 1rem; line-height: 1.45; margin: .3rem 0; }
  .agenda-place { color: var(--muted); } .agenda-place span { display: block; }
  .agenda-actions { grid-column: 1/-1; } .calendar summary { cursor: pointer; list-style: none; color: var(--purple); font: 600 .8rem/1.6 var(--font-sans); display: flex; gap: .6rem; width: fit-content; }
  .calendar summary::-webkit-details-marker { display: none; } .calendar[open] summary span { transform: rotate(45deg); }
  .calendar-links { display: flex; flex-wrap: wrap; gap: .5rem 1rem; margin-top: .6rem; font: .8rem/1.5 var(--font-sans); }
  .calendar-links a { color: var(--purple); } .agenda-actions :global(.event-details) { margin-top: .6rem; }
  .agenda-actions :global(summary) { font-size: .8rem; }
  .agenda-empty { color: var(--muted); margin-bottom: 0; font-size: 1rem; }
  .agenda-more { padding: .5rem 0; border: 0; background: none; color: var(--purple); cursor: pointer; font: .85rem var(--font-sans); }
  @media(max-width:800px) {
    .agenda { padding: 1.15rem; } h2 { font-size: 1.25rem; } .agenda-note { display: none; }
    .agenda-toggle { display: flex; gap: .7rem; border: 0; padding: .4rem 0 .4rem .7rem; background: none; color: var(--purple); cursor: pointer; font: .85rem var(--font-sans); }
    .next-event { display: block; margin: .7rem 0 0; font-size: 1rem; line-height: 1.45; color: var(--muted); } .next-event span { color: var(--text); }
    #agenda-list { display: none; } #agenda-list.expanded { display: block; margin-top: 1rem; }
  }
</style>
