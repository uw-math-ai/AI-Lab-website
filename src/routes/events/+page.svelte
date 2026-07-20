<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import CodePanel from '$lib/components/CodePanel.svelte';
	import { eventsLeanSnippet } from '$lib/data/leanSnippets';
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

<section class="page-shell hero compact-hero">
	<div>
		<span class="eyebrow">Calendar</span>
		<h1>Events</h1>
		<p>
			Agenda and archive for Math AI Seminar activity at UW. Calendar data lives in the repo so new
			entries are one-object updates.
		</p>
	</div>
	<CodePanel snippet={eventsLeanSnippet} />
</section>

{#if icmlEvent}
	<section class="page-shell section icml-feature" id="icml-2026" aria-labelledby="icml-heading">
		<Reveal class="feature-reveal">
			<article class="icml-card interactive-surface">
				<div class="icml-copy" data-reveal-item style="--reveal-delay: 0ms">
					<div>
						<span class="eyebrow">Eight accepted papers · ICML 2026</span>
						<h2 id="icml-heading">Congratulations to our ICML authors</h2>
						<p>{icmlEvent.abstract}</p>
						<div class="meta icml-meta">
							<span class="pill">July 6–11, 2026</span>
							<span class="pill">COEX · Seoul, Korea</span>
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
							<span class="pill">{formatTime(event.startTime)}-{formatTime(event.endTime)}</span>
							<span class="pill">{event.location}</span>
						</div>
						<h2>{event.title}</h2>
						<p class="speaker">{event.speaker}</p>
						{#if event.abstract}
							<p class="abstract">{event.abstract}</p>
						{/if}
						{#if event.details?.length}
							<ul class="event-details">
								{#each event.details as detail}
									<li>{detail}</li>
								{/each}
							</ul>
						{/if}
						{#if event.sourceUrl}
							<a class="button" href={event.sourceUrl} target="_blank" rel="noreferrer">{event.sourceLabel ?? 'UW Math source'}</a>
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
		min-height: 28rem;
	}

	.hackathon-feature {
		padding-top: 0;
	}

	.hackathon-feature :global(.reveal) {
		display: block;
	}

	.icml-feature {
		padding-top: 0;
		scroll-margin-top: 6rem;
	}

	.icml-feature :global(.reveal) {
		display: block;
	}

	.icml-card {
		--surface-border-rest: color-mix(in srgb, var(--gold) 38%, var(--line));
		isolation: isolate;
		overflow: visible;
		background:
			linear-gradient(140deg, color-mix(in srgb, var(--purple) 10%, transparent), transparent 42%),
			var(--surface);
		border: 1px solid var(--surface-border-rest);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
	}

	.icml-copy {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1.5rem;
		padding: clamp(1.2rem, 3vw, 2rem);
	}

	.icml-copy > div {
		max-width: 70rem;
	}

	.icml-copy h2 {
		margin: 0.35rem 0 0.75rem;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 4.2rem);
		line-height: 0.98;
	}

	.icml-copy p {
		margin: 0;
		max-width: 76ch;
		color: var(--muted);
		font-size: 1.04rem;
	}

	.icml-meta {
		margin-top: 1rem;
	}

	.icml-gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		background: var(--line);
		border-block: 1px solid var(--line);
	}

	.icml-photo {
		margin: 0;
		min-width: 0;
		overflow: hidden;
		background: var(--surface);
		border: 1px solid transparent;
		border-radius: calc(var(--radius) - 0.2rem);
		box-shadow: var(--surface-shadow-rest);
	}

	.icml-photo:first-child {
		grid-column: 1 / -1;
	}

	.icml-photo img {
		display: block;
		width: 100%;
		height: auto;
		transition: transform var(--motion-fast);
	}

	.icml-photo:hover img {
		transform: scale(1.012);
	}

	.icml-photo figcaption {
		padding: 0.65rem 0.8rem 0.8rem;
		color: var(--muted);
		font-size: 0.84rem;
		font-weight: 700;
	}

	.icml-papers {
		padding: clamp(1.2rem, 3vw, 2rem);
	}

	.icml-papers-heading h3 {
		margin: 0.3rem 0 1rem;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.65rem, 3vw, 2.5rem);
		line-height: 1;
	}

	.icml-paper-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: icml-papers;
	}

	.icml-paper-list li {
		counter-increment: icml-papers;
		min-width: 0;
		border: 1px solid var(--line);
		border-radius: calc(var(--radius) - 0.2rem);
		background: color-mix(in srgb, var(--soft) 44%, var(--surface));
		box-shadow: var(--surface-shadow-rest);
	}

	.icml-paper-list li.honored {
		border-color: color-mix(in srgb, var(--gold) 58%, var(--line));
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--gold) 15%, transparent), transparent 60%),
			var(--surface);
	}

	.icml-paper-list a {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.75rem;
		align-items: start;
		padding: 0.9rem;
		color: var(--heading);
		font-weight: 800;
		text-decoration: none;
	}

	.icml-paper-list a::before {
		content: counter(icml-papers, decimal-leading-zero);
		color: var(--purple);
		font-family: var(--font-display);
		font-size: 0.82rem;
	}

	.icml-paper-list a:hover span {
		color: var(--purple);
	}

	.icml-paper-list em {
		grid-column: 2;
		justify-self: start;
		border: 1px solid color-mix(in srgb, var(--gold) 54%, var(--line));
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 17%, transparent);
		color: var(--heading);
		font-size: 0.76rem;
		font-style: normal;
		padding: 0.2rem 0.48rem;
	}

	.hackathon-card {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
		overflow: hidden;
	}

	.hackathon-banner {
		display: grid;
		align-items: center;
		padding: clamp(0.4rem, 1vw, 0.75rem);
		background: color-mix(in srgb, var(--soft) 38%, var(--surface));
	}

	.hackathon-banner img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: contain;
		border-radius: calc(var(--radius) - 0.15rem);
	}

	.hackathon-copy {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: clamp(1.2rem, 3vw, 2rem);
	}

	.hackathon-copy h2 {
		margin: 0;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.4rem);
		line-height: 0.98;
	}

	.hackathon-copy p {
		margin: 0;
		color: var(--muted);
		font-size: 1.05rem;
	}

	.calendar-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		align-items: center;
	}

	.calendar-toolbar input {
		flex: 1 1 18rem;
	}

	.calendar-toolbar select {
		flex: 0 1 14rem;
	}

	.segmented {
		display: inline-flex;
		padding: 0.25rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
	}

	.segmented button {
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--text);
		font-weight: 800;
		padding: 0.55rem 0.85rem;
		cursor: pointer;
	}

	.segmented button.active {
		background: var(--purple);
		color: white;
	}

	.event-timeline {
		display: grid;
		gap: 1rem;
	}

	.event-row {
		display: grid;
		grid-template-columns: 10rem minmax(0, 1fr);
		gap: 1rem;
		align-items: stretch;
	}

	.date-block,
	.event-body {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
	}

	.date-block {
		display: grid;
		align-content: start;
		gap: 0.35rem;
		padding: 1rem;
		color: var(--purple);
	}

	.date-block strong {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
	}

	.date-block span {
		color: var(--muted);
		font-weight: 700;
	}

	.event-body {
		padding: 1rem;
	}

	.event-body h2 {
		margin: 0.6rem 0 0.25rem;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 2.6vw, 2rem);
		line-height: 1.05;
	}

	.event-body p {
		color: var(--muted);
		max-width: 78ch;
	}

	.event-body .abstract {
		white-space: pre-line;
	}

	.event-body .event-details {
		max-width: 78ch;
		margin: 0.65rem 0 0;
		padding-left: 1.2rem;
		color: var(--muted);
	}

	.event-body .event-details li + li {
		margin-top: 0.35rem;
	}

	.event-body .speaker {
		color: var(--text);
		font-weight: 750;
	}

	@media (max-width: 720px) {
		.icml-copy {
			align-items: flex-start;
			flex-direction: column;
		}

		.icml-copy .button {
			width: 100%;
		}

		.icml-paper-list {
			grid-template-columns: 1fr;
		}

		.hackathon-copy {
			align-items: flex-start;
			flex-direction: column;
		}

		.hackathon-copy .actions,
		.hackathon-copy .button {
			width: 100%;
		}

		.event-row {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.icml-gallery {
			grid-template-columns: 1fr;
		}

		.icml-photo:first-child {
			grid-column: auto;
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

		.segmented button {
			padding: 0.52rem 0.45rem;
		}

		.date-block,
		.event-body {
			padding: 0.9rem;
		}

		.date-block {
			gap: 0.2rem;
		}
	}
</style>
