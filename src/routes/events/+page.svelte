<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { labEvents, eventDate } from '$lib/data/events';
	import { pages } from '$lib/data/pages';
	import { sitePath } from '$lib/paths';
	import { googleCalendarUrl, hasHours, icsFile, outlookCalendarUrl, timeRange } from '$lib/calendar';
	import { collectionPage, graph, organizationId } from '$lib/structuredData';

	const { title, description } = pages.events;
	const eventsJsonLd = graph(
		collectionPage(title, '/events/', description),
		{
			'@type': 'ItemList',
			name: 'UW Math AI Lab events',
			itemListElement: labEvents
				.filter((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date))
				.map((event, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Event',
						name: event.title,
						startDate: `${event.date}T${event.startTime}:00${event.utcOffset ?? ''}`,
						endDate: `${event.date}T${event.endTime}:00${event.utcOffset ?? ''}`,
						location: event.location
							? { '@type': 'Place', name: event.location }
							: { '@type': 'VirtualLocation', url: event.sourceUrl ?? 'https://ai.math.uw.edu/events/' },
						eventAttendanceMode:
							!event.location
								? 'https://schema.org/OnlineEventAttendanceMode'
								: 'https://schema.org/OfflineEventAttendanceMode',
						organizer: event.organizer ? { '@type': 'Organization', ...event.organizer } : { '@id': organizationId },
						...(event.abstract ? { description: event.abstract } : {}),
						...(event.sourceUrl ? { url: event.sourceUrl } : {})
					}
				}))
		}
	);

	let query = $state('');
	let type = $state('all');
	let showAllUpcoming = $state(false);
	let showAllPast = $state(false);

	const UPCOMING_LIMIT = 3;
	const PAST_LIMIT = 5;
	const now = new Date();
	const types = ['all', ...Array.from(new Set(labEvents.map((event) => event.type)))];

	function formatDate(value: string) {
		return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const searching = $derived(query.trim() !== '' || type !== 'all');
	const matching = $derived(
		labEvents.filter((event) => {
			const haystack = `${event.title} ${event.speaker ?? ''} ${event.location ?? ''} ${event.abstract ?? ''} ${(event.details ?? []).join(' ')} ${(event.papers ?? []).map((paper) => paper.title).join(' ')}`.toLowerCase();
			return (type === 'all' || event.type === type) && haystack.includes(query.trim().toLowerCase());
		})
	);
	// Soonest first for what is coming up, most recent first for what has passed.
	const upcoming = $derived(
		matching.filter((event) => eventDate(event) >= now).sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime())
	);
	const past = $derived(
		matching.filter((event) => eventDate(event) < now).sort((a, b) => eventDate(b).getTime() - eventDate(a).getTime())
	);
	// A search shows every match; otherwise each list is cut short until "view all" is chosen.
	const shownUpcoming = $derived(searching || showAllUpcoming ? upcoming : upcoming.slice(0, UPCOMING_LIMIT));
	const shownPast = $derived(searching || showAllPast ? past : past.slice(0, PAST_LIMIT));
</script>

<Seo {title} {description} path="/events/" jsonLd={eventsJsonLd} />

{#snippet eventRow(event: (typeof labEvents)[number], index: number)}
	<article class="event-row" data-reveal-item style={`--reveal-delay: ${Math.min(index, 3) * 55}ms`}>
		<div class="date-block interactive-surface">
			<strong>{formatDate(event.date).split(',')[0]}</strong>
			<span>{formatDate(event.date).replace(/^.*?, /, '')}</span>
		</div>
		<div class="event-body interactive-surface">
			<div class="meta">
				<span class="pill">{event.type}</span>
				{#if timeRange(event)}<span class="pill">{timeRange(event)}</span>{/if}
				{#if event.location}<span class="pill">{event.location}</span>{/if}
			</div>
			<h3>{event.title}</h3>
			{#if event.speaker}<p class="speaker">{event.speaker}</p>{/if}
			{#if event.abstract}
				<div class="abstract">
					{#each event.abstract.split(/\n\s*\n/) as paragraph}
						<p>{paragraph.trim()}</p>
					{/each}
				</div>
			{/if}
			{#if event.photos?.length && !event.papers?.length}
				<div class="event-photos">
					{#each event.photos as photo}
						<figure style={`--ar: ${(photo.width ?? 16) / (photo.height ?? 9)}`}>
							<img
								src={sitePath(photo.src)}
								alt={photo.alt}
								width={photo.width}
								height={photo.height}
								loading="lazy"
								decoding="async"
							/>
							<figcaption>{photo.caption}</figcaption>
						</figure>
					{/each}
				</div>
			{/if}
			{#if event.details?.length}
				<ul class="event-details">
					{#each event.details as detail}
						<li>{detail}</li>
					{/each}
				</ul>
			{/if}
			{#if hasHours(event) && eventDate(event) >= now}
				<p class="add-to-calendar">
					<span>Add to calendar</span>
					<a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer">Google<span class="sr-only"> Calendar (opens in new tab)</span></a>
					<a href={outlookCalendarUrl(event)} target="_blank" rel="noreferrer">Outlook<span class="sr-only"> (opens in new tab)</span></a>
					<a href={icsFile(event).href} download={icsFile(event).filename}>Apple / .ics<span class="sr-only"> file</span></a>
				</p>
			{/if}
			{#if event.sourceUrl || event.links?.length}
				<div class="event-links">
					{#if event.sourceUrl}
						<a class="button" href={event.sourceUrl} target="_blank" rel="noreferrer">{event.sourceLabel ?? 'UW Math source'}</a>
					{/if}
					{#each event.links ?? [] as link}
						{#if link.closed}
							<button type="button" class="button" disabled>{link.label} (closed)</button>
						{:else if link.url.startsWith('/')}
							<a class="button" href={sitePath(link.url)}>{link.label}</a>
						{:else}
							<a class="button" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</article>
{/snippet}

<section class="page-shell hero compact-hero single">
	<div>
		<h1>Events</h1>
		<div class="events-search">
			<label>
				<span>Search events</span>
				<input bind:value={query} type="search" placeholder="Search title, speaker, location" />
			</label>
			<label>
				<span>Type</span>
				<select bind:value={type}>
					{#each types as option}
						<option value={option}>{option === 'all' ? 'All types' : option}</option>
					{/each}
				</select>
			</label>
		</div>
	</div>
</section>

<section class="page-shell section list-start" aria-labelledby="upcoming-heading">
	<Reveal>
		<div class="section-header">
			<h2 id="upcoming-heading">Upcoming</h2>
		</div>
		<div class="event-timeline">
			{#each shownUpcoming as event, index (event.title + event.date)}
				{@render eventRow(event, index)}
			{:else}
				<p class="empty">{searching ? 'No upcoming events match your search.' : 'No upcoming events are scheduled right now.'}</p>
			{/each}
		</div>
		{#if !searching && upcoming.length > UPCOMING_LIMIT}
			<button type="button" class="view-all" aria-expanded={showAllUpcoming} onclick={() => (showAllUpcoming = !showAllUpcoming)}>
				{showAllUpcoming ? 'Show fewer upcoming events' : `View all ${upcoming.length} upcoming events`}
			</button>
		{/if}
	</Reveal>
</section>

<section class="page-shell section" aria-labelledby="past-heading">
	<Reveal>
		<div class="section-header">
			<h2 id="past-heading">Past events</h2>
		</div>
		<div class="event-timeline">
			{#each shownPast as event, index (event.title + event.date)}
				{@render eventRow(event, index)}
			{:else}
				<p class="empty">{searching ? 'No past events match your search.' : 'No past events yet.'}</p>
			{/each}
		</div>
		{#if !searching && past.length > PAST_LIMIT}
			<button type="button" class="view-all" aria-expanded={showAllPast} onclick={() => (showAllPast = !showAllPast)}>
				{showAllPast ? 'Show fewer past events' : `View all ${past.length} past events`}
			</button>
		{/if}
	</Reveal>
</section>

<style>
	/* The first list sits close under the search box. */
	.list-start {
		padding-top: 1.5rem;
	}

	.events-search {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2rem;
	}

	.events-search label {
		display: grid;
		gap: 0.5rem;
	}

	.events-search label:first-child {
		flex: 1 1 18rem;
		max-width: 34rem;
	}

	.events-search label span {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.events-search input {
		width: 100%;
	}

	.empty {
		margin: 0;
		padding: 1.25rem 0;
		color: var(--muted);
	}

	.view-all {
		margin-top: 1rem;
		border: 0;
		border-bottom: 1px solid color-mix(in srgb, var(--purple) 40%, transparent);
		background: none;
		padding: 0 0 0.1rem;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--purple);
		cursor: pointer;
	}

	.view-all:hover {
		border-bottom-color: var(--purple);
	}

	.event-timeline {
		display: grid;
	}

	.event-row {
		display: grid;
		grid-template-columns: 10rem minmax(0, 1fr);
		gap: 2rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--line);
	}

	.date-block {
		display: grid;
		align-content: start;
		gap: 0.25rem;
		padding-top: 0.3rem;
	}

	.date-block strong {
		font-family: var(--font-sans);
		font-variant-numeric: tabular-nums;
		font-size: var(--text-base);
		font-weight: 600;
		line-height: 1.2;
		color: var(--heading);
	}

	.date-block span {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--muted);
	}

	.event-body .meta {
		margin: 0 0 0.4rem;
	}

	.event-body h3 {
		margin: 0 0 0.25rem;
		font-size: var(--text-subtitle);
		line-height: 1.2;
	}

	.event-body p {
		color: var(--muted);
		max-width: 72ch;
		margin: 0 0 0.5rem;
	}

	.event-body .abstract {
		white-space: pre-line;
		font-size: var(--text-base);
	}

	/* Justified row, like the People gallery: equal heights, flush edges, no cropping. */
	.event-photos {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1rem;
	}

	.event-photos::after {
		content: '';
		flex-grow: 999;
	}

	.event-photos figure {
		flex: var(--ar) 1 calc(var(--ar) * 11rem);
		min-width: 0;
		margin: 0;
	}

	.event-photos img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.event-photos figcaption {
		margin-top: 0.4rem;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		line-height: 1.4;
		color: var(--muted);
	}

	.event-body .event-details {
		max-width: 72ch;
		margin: 0.5rem 0 0;
		padding-left: 1.2rem;
		color: var(--muted);
	}

	.event-body .event-details li + li {
		margin-top: 0.3rem;
	}

	.event-body .speaker {
		color: var(--text);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
	}

	.add-to-calendar {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 1rem;
		margin: 0.75rem 0 0;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
	}

	.add-to-calendar span:first-child {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.add-to-calendar a {
		font-weight: 600;
		color: var(--purple);
	}

	.event-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	@media (max-width: 720px) {
		.event-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.events-search label,
		.events-search select {
			width: 100%;
		}
	}
</style>
