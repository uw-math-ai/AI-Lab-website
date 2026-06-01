<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
	import { labEvents } from '$lib/data/events';
	import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { featuredResearch } from '$lib/data/research';
	import { sitePath } from '$lib/paths';

	const upcoming = labEvents
		.filter((event) => new Date(`${event.date}T${event.startTime}:00`) >= new Date())
		.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
		.slice(0, 3);

	const latestProjects = projectQuarters.slice(0, 3);

	function formatDate(value: string) {
		return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Math AI Lab | University of Washington</title>
</svelte:head>

<section class="page-shell hero home-hero">
	<div>
		<span class="eyebrow">University of Washington</span>
		<div class="hero-title-lockup">
			<img src={sitePath('/logos/math-ai-lab-logo.png')} alt="" />
			<h1>Math AI Lab</h1>
		</div>
		<p>
			The University of Washington Math AI Lab is a research and education organization focused on using AI
			for math, directed by
			<a href="https://vilin97.github.io/">Vasily Ilin</a> and
			<a href="https://sites.math.washington.edu/~jarod/">Jarod Alper</a>.
		</p>
		<div class="actions">
			<a class="button primary" href={sitePath('/projects/spring-2026')}>Ongoing Projects</a>
			<a class="button" href={sitePath('/events')}>Event Calendar</a>
			<a class="button" href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub</a>
		</div>
	</div>

</section>

<section class="page-shell section home-stats-section">
	<Reveal>
		<div class="stats">
			<div>
				<strong><CountUp value={totalProjectCount} /></strong>
				<span>projects</span>
			</div>
			<div>
				<strong><CountUp value={169} /></strong>
				<span>undergraduate students</span>
			</div>
			<div>
				<strong><CountUp value={17} /></strong>
				<span>graduate students</span>
			</div>
			<div>
				<strong><CountUp value={10} /></strong>
				<span>professors</span>
			</div>
		</div>
	</Reveal>
</section>

<section class="page-shell section papers-section">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Research</span>
			<h2>Publications & Preprints</h2>
			<p>Selected recent Math AI Lab papers. The full research page collects the lab's current conference papers, workshop papers, preprints, and essays.</p>
		</div>
		<div class="paper-grid">
			{#each featuredResearch as paper}
				<a class="paper-card" href={paper.url} target="_blank" rel="noreferrer">
					<span>{paper.venue}</span>
					<strong>{paper.title}</strong>
					<p>{paper.abstract}</p>
				</a>
			{/each}
		</div>
		<a class="button research-link" href={sitePath('/research')}>Open Research Page</a>
	</Reveal>
</section>

<section class="banded">
	<div class="page-shell section">
		<Reveal>
			<div class="section-header">
				<span class="eyebrow">Now</span>
				<h2>Events</h2>
				<p>Upcoming events, seminars, and hosted Math AI Lab gatherings.</p>
			</div>
			<div class="event-list">
				<a class="event-card hackathon-home-card" href="https://uw2026leanhackathon.github.io/" target="_blank" rel="noreferrer">
					<img
						src={sitePath('/logos/uw-2026-lean-hackathon-banner.png')}
						alt="UW 2026 Lean Hackathon banner"
					/>
					<span>Hosted event</span>
					<strong>UW 2026 Lean Hackathon</strong>
					<small>We hosted a Lean hackathon bringing together formalization, math, and AI communities.</small>
				</a>
				{#each upcoming as event}
					<a class="event-card" href={event.sourceUrl} target="_blank" rel="noreferrer">
						<span>{formatDate(event.date)}</span>
						<strong>{event.title}</strong>
						<small>{event.speaker} · {event.location}</small>
					</a>
				{:else}
					<a class="event-card" href={sitePath('/events')}>
						<span>Archive</span>
						<strong>Browse past Math AI events</strong>
						<small>The agenda archive is updated from the official UW Math source.</small>
					</a>
				{/each}
			</div>
			<a class="button" href={sitePath('/events')}>Event Calendar</a>
		</Reveal>
	</div>
</section>

<section class="page-shell section">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Projects</span>
			<h2>Recent Quarters</h2>
		</div>
		<div class="grid">
			{#each latestProjects as quarter}
				<a class="card project-card" href={sitePath(`/projects/${quarter.slug}`)}>
					<div class="meta">
						<span class="pill">{quarter.label}</span>
						{#if quarter.status === 'current'}<span class="pill">current</span>{/if}
					</div>
					<h3>{quarter.label} Projects</h3>
					<p>{quarter.summary}</p>
				</a>
			{/each}
		</div>
	</Reveal>
</section>

<section class="page-shell section">
	<Reveal>
		<div class="photo-panel">
			<img src={sitePath('/photos/fall2025.jpg')} alt="Fall 2025 Math AI Lab" />
			<div>
				<span class="eyebrow">Community</span>
				<h2>Math AI Lab Photo from Fall 2025</h2>
				<p>
					Our members during the Fall Quarter of 2025. The Math AI Lab was formerly called the eXperimental Lean Lab (XLL) and hosted through the
					Washington eXperimental Mathematics Lab (WXML).
				</p>
			</div>
		</div>
	</Reveal>
</section>

<style>
	.hero a:not(.button) {
		color: var(--purple);
		font-weight: 750;
	}

	.home-hero {
		grid-template-columns: minmax(0, 1fr);
		min-height: auto;
		padding-bottom: clamp(1rem, 2vw, 1.5rem);
	}

	.home-hero > div {
		max-width: 76rem;
	}

	.actions {
		margin-top: 1.6rem;
	}

	.hero-title-lockup {
		display: flex;
		align-items: center;
		gap: clamp(0.8rem, 2vw, 1.4rem);
		margin: 1.1rem 0;
	}

	.hero-title-lockup img {
		width: clamp(5.8rem, 13vw, 10rem);
		height: clamp(5.8rem, 13vw, 10rem);
		flex: 0 0 auto;
		object-fit: contain;
		border-radius: 0.7rem;
		box-shadow: var(--shadow-soft);
	}

	.hero-title-lockup h1 {
		margin: 0;
		white-space: nowrap;
		font-size: clamp(3rem, 7.6vw, 7rem);
	}

	.home-stats-section {
		padding: clamp(0.75rem, 2vw, 1.25rem) 0 clamp(0.75rem, 2vw, 1.25rem);
	}

	.papers-section {
		padding-top: clamp(1.5rem, 4vw, 2.75rem);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.stats div {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		padding: 1.2rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.stats div:hover,
	.event-card:hover,
	.photo-panel:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--purple) 34%, var(--line));
		box-shadow: var(--shadow);
	}

	.stats strong {
		display: block;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1;
	}

	.stats span {
		color: var(--muted);
		font-weight: 650;
	}

	.banded {
		position: relative;
		background: color-mix(in srgb, var(--soft) 60%, transparent);
	}

	.event-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.event-card,
	.project-card,
	.paper-card {
		text-decoration: none;
	}

	.paper-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.research-link {
		margin-top: 1rem;
	}

	.paper-card {
		display: grid;
		align-content: start;
		gap: 0.65rem;
		min-height: 14rem;
		padding: 1rem;
		background:
			linear-gradient(132deg, color-mix(in srgb, var(--purple) 8%, transparent), transparent 46%),
			var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.paper-card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--purple) 34%, var(--line));
		box-shadow: var(--shadow);
	}

	.paper-card span {
		color: var(--purple);
		font-size: 0.82rem;
		font-weight: 850;
	}

	.paper-card strong {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: 1.14rem;
		line-height: 1.12;
	}

	.paper-card p {
		margin: 0;
		color: var(--muted);
		font-size: 0.94rem;
		line-height: 1.45;
	}

	.event-card {
		display: grid;
		gap: 0.35rem;
		min-height: 11rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		padding: 1rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.event-card span {
		color: var(--purple);
		font-weight: 850;
	}

	.event-card strong {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: 1.15rem;
		line-height: 1.12;
	}

	.event-card small {
		color: var(--muted);
	}

	.hackathon-home-card {
		gap: 0.55rem;
	}

	.hackathon-home-card img {
		display: block;
		width: 100%;
		max-height: 10rem;
		object-fit: contain;
		border: 1px solid var(--line);
		border-radius: calc(var(--radius) - 0.2rem);
		background: white;
	}

	.photo-panel {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
		gap: 1.5rem;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 1rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.photo-panel img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: calc(var(--radius) - 0.2rem);
	}

	.photo-panel h2 {
		font-family: var(--font-display);
		color: var(--heading);
		font-size: clamp(1.8rem, 4vw, 3rem);
		line-height: 1;
	}

	.photo-panel p {
		color: var(--muted);
	}

	@media (max-width: 860px) {
		.stats,
		.paper-grid,
		.event-list,
		.photo-panel {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 861px) and (max-width: 1120px) {
		.paper-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 520px) {
		.hero-title-lockup {
			gap: 0.75rem;
		}

		.hero-title-lockup img {
			width: clamp(4.8rem, 19vw, 5.9rem);
			height: clamp(4.8rem, 19vw, 5.9rem);
		}

		.hero-title-lockup h1 {
			font-size: clamp(2.25rem, 13vw, 3.1rem);
		}
	}
</style>
