<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import CodePanel from '$lib/components/CodePanel.svelte';
	import { eventsLeanSnippet } from '$lib/data/leanSnippets';
	import { labEvents } from '$lib/data/events';
	import { sitePath } from '$lib/paths';

	let query = $state('');
	let type = $state('all');
	let mode = $state('upcoming');

	const types = ['all', ...Array.from(new Set(labEvents.map((event) => event.type)))];

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
				const haystack = `${event.title} ${event.speaker} ${event.location} ${event.abstract ?? ''}`.toLowerCase();
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

<section class="page-shell section hackathon-feature" aria-labelledby="hackathon-heading">
	<Reveal>
		<div class="hackathon-card">
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
			{#each visibleEvents as event}
				<article class="event-row">
					<div class="date-block">
						<strong>{formatDate(event.date).split(',')[0]}</strong>
						<span>{formatDate(event.date).replace(/^.*?, /, '')}</span>
					</div>
					<div class="event-body">
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
						<a class="button" href={event.sourceUrl} target="_blank" rel="noreferrer">UW Math source</a>
					</div>
				</article>
			{:else}
				<div class="card">
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

	.hackathon-card {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
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

	:root[data-theme='dark'] .hackathon-banner,
	:root[data-theme='dark'] .hackathon-card {
		box-shadow: var(--glow-strong);
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
		box-shadow: var(--shadow-soft);
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

	.event-body .speaker {
		color: var(--text);
		font-weight: 750;
	}

	@media (max-width: 720px) {
		.hackathon-copy {
			align-items: flex-start;
			flex-direction: column;
		}

		.event-row {
			grid-template-columns: 1fr;
		}
	}
</style>
