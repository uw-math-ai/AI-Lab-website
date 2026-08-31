<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
		import { labEvents } from '$lib/data/events';
	import { sitePath } from '$lib/paths';
	import { canonicalUrl } from '$lib/seo';

	let query = $state('');
	let type = $state('all');
	let mode = $state('upcoming');

	const types = ['all', ...Array.from(new Set(labEvents.map((event) => event.type)))];
	const icmlEvent = labEvents.find((event) => event.title === 'ICML 2026');

	function eventTime(event: { date: string; startTime: string }) {
		return new Date(`${event.date}T${event.startTime}:00`);
	}

	function formatDate(value: string) {
		return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTime(value: string) {
		const [hour, minute] = value.split(':').map(Number);
		return new Date(2026, 0, 1, hour, minute).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	let visibleEvents = $derived(
		labEvents
			.filter((event) => {
				const isUpcoming = eventTime(event) >= new Date();
				const matchesMode = mode === 'all' || (mode === 'upcoming' ? isUpcoming : !isUpcoming);
				const matchesType = type === 'all' || event.type === type;
				const haystack = `${event.title} ${event.speaker} ${event.location} ${event.abstract ?? ''} ${(event.details ?? []).join(' ')} ${(event.papers ?? []).map((paper) => paper.title).join(' ')}`.toLowerCase();
				return matchesMode && matchesType && haystack.includes(query.toLowerCase());
			})
			.sort((a, b) => {
				const direction = mode === 'upcoming' ? 1 : -1;
				return direction * (eventTime(a).getTime() - eventTime(b).getTime());
			})
	);
</script>

<svelte:head>
	<title>Events | Math AI Lab</title>
	<link rel="canonical" href={canonicalUrl('/events/')} />
	<meta property="og:title" content="Events | Math AI Lab" />
	<meta property="og:url" content={canonicalUrl('/events/')} />
</svelte:head>

<section class="page-shell hero compact-hero single">
	<div>
		<span class="eyebrow">Calendar</span>
		<h1>Events</h1>
		<p>
			Agenda and archive for Math AI Seminar activity at UW. Calendar data lives in the repo so new
			entries are one-object updates.
		</p>
	</div>
</section>

{#if icmlEvent}
	<section class="page-shell section icml-feature" id="icml-2026" aria-labelledby="icml-heading">
		<Reveal class="feature-reveal">
			<article class="icml-card interactive-surface">
				<div class="icml-top">
				<div class="icml-copy" data-reveal-item style="--reveal-delay: 0ms">
					<div>
						<span class="eyebrow">Eight accepted papers at ICML 2026</span>
						<h2 id="icml-heading">Congratulations to our ICML authors</h2>
						<p>{icmlEvent.abstract}</p>
						<div class="meta icml-meta">
							<span class="pill">July 6–11, 2026</span>
							<span class="pill">COEX, Seoul, Korea</span>
						</div>
					</div>
					<a class="button" href={icmlEvent.sourceUrl} target="_blank" rel="noreferrer">ICML 2026</a>
				</div>

				{#if icmlEvent.photos?.length}
					<div class="icml-gallery" aria-label="Photos from ICML 2026 at COEX">
						{#each icmlEvent.photos as photo, index}
							<figure
								class="icml-photo interactive-surface"
								data-reveal-item
								style={`--reveal-delay: ${60 + Math.min(index, 3) * 55}ms`}
							>
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
				</div>

				{#if icmlEvent.papers?.length}
					<div class="icml-papers">
						<div class="icml-papers-heading" data-reveal-item style="--reveal-delay: 120ms">
							<span class="eyebrow">Accepted work</span>
							<h3>Eight papers from across the lab</h3>
						</div>
						<ol class="icml-paper-list">
							{#each icmlEvent.papers as paper, index}
								<li
									class="interactive-surface"
									data-reveal-item
									class:honored={paper.badge}
									style={`--reveal-delay: ${170 + (index % 2) * 60}ms`}
								>
									<a href={paper.url} target="_blank" rel="noreferrer">
										<span>{paper.title}</span>
										{#if paper.badge}<em>{paper.badge}</em>{/if}
									</a>
								</li>
							{/each}
						</ol>
					</div>
				{/if}
			</article>
		</Reveal>
	</section>
{/if}

<section class="page-shell section hackathon-feature" aria-labelledby="hackathon-heading">
	<Reveal>
		<div class="hackathon-card interactive-surface">
			<div class="hackathon-banner">
				<img
					src={sitePath('/logos/uw-2026-lean-hackathon-banner.png')}
					alt="UW 2026 Lean Hackathon banner"
					width="1440"
					height="810"
				/>
			</div>
			<div class="hackathon-copy">
				<div>
					<span class="eyebrow">Hosted by Math AI Lab</span>
					<h2 id="hackathon-heading">UW 2026 Lean Hackathon</h2>
					<p>
						We hosted the Lean Hackathon as a focused gathering for Lean, formalized mathematics, and AI-assisted
						mathematics at the University of Washington.
					</p>
				</div>
				<div class="actions">
					<a class="button primary" href="https://uw2026leanhackathon.github.io/" target="_blank" rel="noreferrer">
						Hackathon site
					</a>
				</div>
			</div>
		</div>
	</Reveal>
</section>

<section class="page-shell section">
	<Reveal>
		<div class="calendar-toolbar">
			<div class="segmented" aria-label="Calendar mode">
				<button class:active={mode === 'upcoming'} type="button" onclick={() => (mode = 'upcoming')}>Upcoming</button>
				<button class:active={mode === 'past'} type="button" onclick={() => (mode = 'past')}>Archive</button>
				<button class:active={mode === 'all'} type="button" onclick={() => (mode = 'all')}>All</button>
			</div>
			<input bind:value={query} type="search" placeholder="Search title, speaker, location" aria-label="Search events" />
			<select bind:value={type} aria-label="Filter event type">
				{#each types as option}
					<option value={option}>{option === 'all' ? 'All types' : option}</option>
				{/each}
			</select>
		</div>

		<div class="event-timeline">
			{#each visibleEvents as event, index}
				<article
					class="event-row"
					data-reveal-item
					style={`--reveal-delay: ${Math.min(index, 3) * 55}ms`}
				>
					<div class="date-block interactive-surface">
						<strong>{formatDate(event.date).split(',')[0]}</strong>
						<span>{formatDate(event.date).replace(/^.*?, /, '')}</span>
					</div>
					<div class="event-body interactive-surface">
						<div class="meta">
							<span class="pill">{event.type}</span>
							{#if event.startTime !== event.endTime}
								<span class="pill">{formatTime(event.startTime)}-{formatTime(event.endTime)}</span>
							{/if}
							<span class="pill">{event.location}</span>
						</div>
						<h2>{event.title}</h2>
						<p class="speaker">{event.speaker}</p>
						{#if event.abstract}
							<div class="abstract">
								{#each event.abstract.split(/\n\s*\n/) as paragraph}
									<p>{paragraph.trim()}</p>
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
						{#if event.sourceUrl || event.links?.length}
							<div class="event-links">
								{#if event.sourceUrl}
									<a class="button" href={event.sourceUrl} target="_blank" rel="noreferrer">{event.sourceLabel ?? 'UW Math source'}</a>
								{/if}
								{#each event.links ?? [] as link}
									{#if link.url.startsWith('/')}
										<a class="button" href={sitePath(link.url)}>{link.label}</a>
									{:else}
										<a class="button" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</article>
			{:else}
				<div class="card interactive-surface">
					<h2>No matching events</h2>
					<p>Try a broader search or switch between upcoming and archive views.</p>
				</div>
			{/each}
		</div>
	</Reveal>
</section>

<style>
	.compact-hero {
		min-height: 24rem;
	}

	.icml-feature,
	.hackathon-feature {
		padding-top: 0;
	}

	.icml-feature {
		scroll-margin-top: 6rem;
	}

	.icml-feature :global(.reveal),
	.hackathon-feature :global(.reveal) {
		display: block;
	}

	.icml-card {
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line);
		padding: clamp(1.5rem, 3vw, 2.5rem) 0;
	}

	.icml-top {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: clamp(1.5rem, 4vw, 3.5rem);
		align-items: start;
	}

	.icml-copy {
		display: grid;
		gap: 1.25rem;
		justify-items: start;
	}

	.icml-copy h2 {
		margin: 0.35rem 0 0.75rem;
		font-size: clamp(1.9rem, 3.6vw, 2.8rem);
		line-height: 1.05;
	}

	.icml-copy p {
		margin: 0;
		max-width: 60ch;
		color: var(--muted);
		font-size: 1.02rem;
	}

	.icml-meta {
		margin: 1rem 0 0;
	}

	.icml-gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.icml-photo {
		margin: 0;
		min-width: 0;
	}

	.icml-photo:first-child {
		grid-column: 1 / -1;
	}

	.icml-photo img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.icml-photo figcaption {
		margin-top: 0.4rem;
		color: var(--muted);
		font-family: var(--font-sans);
		font-size: 0.76rem;
		line-height: 1.4;
	}

	.icml-papers {
		margin-top: clamp(1.5rem, 3vw, 2.5rem);
	}

	.icml-papers-heading h3 {
		margin: 0.3rem 0 0.5rem;
		font-size: clamp(1.4rem, 2.4vw, 1.9rem);
		line-height: 1.1;
	}

	.icml-paper-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 2.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--line-strong);
	}

	.icml-paper-list li {
		min-width: 0;
		border-bottom: 1px solid var(--line);
	}

	.icml-paper-list a {
		display: grid;
		gap: 0.25rem;
		justify-items: start;
		padding: 0.8rem 0;
		color: var(--heading);
		font-size: 1.05rem;
		font-weight: 500;
		line-height: 1.35;
		text-decoration: none;
	}

	.icml-paper-list a:hover span {
		text-decoration: underline;
	}

	.icml-paper-list em {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		font-style: normal;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--gold-ink);
	}

	.hackathon-card {
		display: grid;
		grid-template-columns: minmax(0, 0.6fr) minmax(0, 1.4fr);
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: center;
		border-bottom: 1px solid var(--line);
		padding: clamp(1.5rem, 3vw, 2rem) 0;
	}

	.hackathon-banner img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.hackathon-copy {
		display: grid;
		gap: 1.25rem;
		justify-items: start;
	}

	.hackathon-copy h2 {
		margin: 0.35rem 0 0.5rem;
		font-size: clamp(1.7rem, 3vw, 2.4rem);
		line-height: 1.05;
	}

	.hackathon-copy p {
		margin: 0;
		max-width: 60ch;
		color: var(--muted);
		font-size: 1.02rem;
	}

	.calendar-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.calendar-toolbar input {
		flex: 1 1 18rem;
	}

	.calendar-toolbar select {
		flex: 0 1 12rem;
	}

	.segmented {
		display: inline-flex;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.segmented button {
		border: 0;
		background: transparent;
		color: var(--muted);
		font-family: var(--font-sans);
		font-size: 0.84rem;
		font-weight: 600;
		padding: 0.55rem 0.9rem;
		cursor: pointer;
	}

	.segmented button + button {
		border-left: 1px solid var(--line);
	}

	.segmented button.active {
		background: var(--text);
		color: var(--bg);
	}

	.event-timeline {
		display: grid;
		border-top: 1px solid var(--line-strong);
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
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--heading);
	}

	.date-block span {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		color: var(--muted);
	}

	.event-body .meta {
		margin: 0 0 0.4rem;
	}

	.event-body h2 {
		margin: 0 0 0.25rem;
		font-size: clamp(1.25rem, 2.2vw, 1.6rem);
		line-height: 1.2;
	}

	.event-body p {
		color: var(--muted);
		max-width: 72ch;
		margin: 0 0 0.5rem;
	}

	.event-body .abstract {
		white-space: pre-line;
		font-size: 0.98rem;
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
		font-size: 0.9rem;
	}

	.event-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	@media (max-width: 900px) {
		.icml-top,
		.hackathon-card {
			grid-template-columns: 1fr;
		}

		.icml-paper-list {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.event-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.calendar-toolbar {
			align-items: stretch;
		}

		.segmented,
		.calendar-toolbar input,
		.calendar-toolbar select {
			width: 100%;
		}

		.segmented {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
