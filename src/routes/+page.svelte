<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
	import { labEvents } from '$lib/data/events';
	import { participantCounts } from '$lib/data/people';
	import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { featuredResearch, totalPaperCount } from '$lib/data/research';
	import { sitePath } from '$lib/paths';
	import { canonicalUrl } from '$lib/seo';

	const applicationAnnouncement = labEvents.find((event) => event.type === 'Announcement');

	const upcoming = labEvents
		.filter(
			(event) =>
				new Date(`${event.date}T${event.startTime}:00`) >= new Date() &&
				event.title !== 'ICML 2026' &&
				event.type !== 'Announcement'
		)
		.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
		.slice(0, 2);

	const latestProjects = projectQuarters.slice(0, 3);

	function eventHref(event: { sourceUrl?: string }) {
		return event.sourceUrl ?? sitePath('/events');
	}

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
	<link rel="canonical" href={canonicalUrl('/')} />
	<meta property="og:title" content="Math AI Lab | University of Washington" />
	<meta property="og:url" content={canonicalUrl('/')} />
	<meta property="og:site_name" content="UW Math AI Lab" />
	<meta property="og:type" content="website" />
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
			for math, founded by
			<a href="https://sites.math.washington.edu/~jarod/">Jarod Alper</a> and <a href="https://vilin97.github.io/">Vasily Ilin</a>.
		</p>
		<div class="actions">
			<a class="button primary" href={sitePath('/projects/fall-2026')}>Fall 2026 Projects</a>
			<a class="button" href={sitePath('/events')}>Event Calendar</a>
			<a class="button" href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub</a>
		</div>
	</div>

</section>

{#if applicationAnnouncement}
	<section class="page-shell home-announcement-section" aria-labelledby="fall-2026-applications-heading">
		<Reveal>
			<div class="home-announcement interactive-surface" data-reveal-item>
				<div class="home-announcement-copy">
					<span class="eyebrow">Applications open · Fall 2026</span>
					<h2 id="fall-2026-applications-heading">Lead a Math AI Lab project this fall</h2>
					<p>
						Apply by Monday, September 7 at 11:59 pm. Earlier applications receive priority, and
						mentors of continuing projects should also apply.
					</p>
				</div>
				<div class="actions">
					{#each applicationAnnouncement.links ?? [] as link, index}
						{#if link.url.startsWith('/')}
							<a class="button" class:primary={index === 0} href={sitePath(link.url)}>{link.label}</a>
						{:else}
							<a class="button" class:primary={index === 0} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
						{/if}
					{/each}
				</div>
			</div>
		</Reveal>
	</section>
{/if}

<section class="page-shell section home-stats-section">
	<Reveal>
		<div class="stats">
			<div class="interactive-surface" data-reveal-item style="--reveal-delay: 0ms">
				<strong><CountUp value={totalPaperCount} /></strong>
				<span>papers</span>
			</div>
			<div class="interactive-surface" data-reveal-item style="--reveal-delay: 45ms">
				<strong><CountUp value={totalProjectCount} /></strong>
				<span>projects</span>
			</div>
			<div class="interactive-surface" data-reveal-item style="--reveal-delay: 90ms">
				<strong><CountUp value={participantCounts.undergraduate} /></strong>
				<span>undergraduate students</span>
			</div>
			<div class="interactive-surface" data-reveal-item style="--reveal-delay: 135ms">
				<strong><CountUp value={participantCounts.graduate} /></strong>
				<span>graduate students</span>
			</div>
			<div class="interactive-surface" data-reveal-item style="--reveal-delay: 180ms">
				<strong><CountUp value={participantCounts.professor} /></strong>
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
			{#each featuredResearch as paper, index}
				<a
					class="paper-card interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 4) * 55}ms`}
					href={paper.url}
					target="_blank"
					rel="noreferrer"
				>
					<div class="paper-card-meta">
						<span>{paper.venue}</span>
						{#if paper.badge}<em>{paper.badge}</em>{/if}
					</div>
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
				<a
					class="event-card hackathon-home-card interactive-surface"
					data-reveal-item
					style="--reveal-delay: 0ms"
					href="https://uw2026leanhackathon.github.io/"
					target="_blank"
					rel="noreferrer"
				>
					<img
						src={sitePath('/logos/uw-2026-lean-hackathon-banner.png')}
						alt="UW 2026 Lean Hackathon banner"
					/>
					<span>Hosted event</span>
					<strong>UW 2026 Lean Hackathon</strong>
					<small>We hosted a Lean hackathon bringing together formalization, math, and AI communities.</small>
				</a>
				<a
					class="event-card featured-event-card interactive-surface"
					data-reveal-item
					style="--reveal-delay: 55ms"
					href={sitePath('/events#icml-2026')}
				>
					<span>Congratulations · ICML 2026</span>
					<strong>We presented 8 papers at ICML 2026</strong>
					<small>Congratulations to our authors! Our work included an oral presentation and a workshop Spotlight in Seoul.</small>
				</a>
				{#each upcoming as event, index}
					<a
						class="event-card interactive-surface"
						data-reveal-item
						style={`--reveal-delay: ${(index + 2) * 55}ms`}
						href={eventHref(event)}
						target={event.sourceUrl ? '_blank' : undefined}
						rel={event.sourceUrl ? 'noreferrer' : undefined}
					>
						<span>{formatDate(event.date)}</span>
						<strong>{event.title}</strong>
						<small>{event.speaker} · {event.location}</small>
					</a>
				{:else}
					<a class="event-card interactive-surface" data-reveal-item href={sitePath('/events')}>
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
			{#each latestProjects as quarter, index}
				<a
					class="card project-card interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${index * 60}ms`}
					href={sitePath(`/projects/${quarter.slug}`)}
				>
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
		<div class="section-header">
			<span class="eyebrow">Community</span>
			<h2>Lab moments</h2>
			<p>Recent gatherings from campus to conferences.</p>
		</div>
		<div class="home-photo-grid">
			<figure class="home-photo-card home-photo-featured interactive-surface" data-reveal-item style="--reveal-delay: 0ms">
				<img src={sitePath('/photos/fall2025.jpg')} alt="Fall 2025 Math AI Lab" loading="lazy" decoding="async" />
				<figcaption>
					<span>Fall 2025</span>
					<strong>Math AI Lab</strong>
					<p>Our lab community during Fall Quarter 2025 at the University of Washington.</p>
				</figcaption>
			</figure>
			<figure class="home-photo-card interactive-surface" data-reveal-item style="--reveal-delay: 55ms">
				<img
					src={sitePath('/photos/icml-2026-coex-2.webp')}
					alt="Math AI Lab group at ICML 2026 in COEX, Seoul"
					width="2720"
					height="1532"
					loading="lazy"
					decoding="async"
				/>
				<figcaption>
					<span>ICML 2026 · Seoul</span>
					<strong>ICML 2026 group photo</strong>
					<p>Math AI Lab members at COEX for eight papers presented across ICML and its workshops.</p>
				</figcaption>
			</figure>
			<figure class="home-photo-card interactive-surface" data-reveal-item style="--reveal-delay: 110ms">
				<img
					src={sitePath('/photos/lean-hackathon.jpg')}
					alt="Participants at the UW 2026 Lean Hackathon"
					loading="lazy"
					decoding="async"
				/>
				<figcaption>
					<span>UW 2026 Lean Hackathon</span>
					<strong>Lean, mathematics, and AI together</strong>
					<p>A focused gathering hosted by the Math AI Lab at the University of Washington.</p>
				</figcaption>
			</figure>
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

	.home-announcement-section {
		padding: 0 0 clamp(1rem, 3vw, 2rem);
	}

	.home-announcement {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: clamp(1.2rem, 4vw, 3rem);
		padding: clamp(1.25rem, 3vw, 2rem);
		background:
			linear-gradient(120deg, color-mix(in srgb, var(--gold) 19%, transparent), transparent 42%),
			linear-gradient(145deg, color-mix(in srgb, var(--purple) 12%, transparent), transparent 58%),
			var(--surface);
		border: 1px solid color-mix(in srgb, var(--gold) 48%, var(--line));
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
	}

	.home-announcement-copy {
		display: grid;
		gap: 0.65rem;
	}

	.home-announcement h2 {
		margin: 0;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.65rem, 4vw, 2.7rem);
		line-height: 1.05;
	}

	.home-announcement p {
		max-width: 68ch;
		margin: 0;
		color: var(--muted);
	}

	.home-announcement .actions {
		justify-content: flex-end;
		margin-top: 0;
	}

	.actions {
		margin-top: 1.6rem;
	}

	.hero-title-lockup {
		display: flex;
		align-items: center;
		gap: clamp(0.8rem, 2vw, 1.4rem);
		margin: 1.1rem 0;
		min-width: 0;
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
		min-width: 0;
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
		grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
		gap: 1rem;
	}

	.stats div {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
		padding: 1.2rem;
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
		box-shadow: var(--surface-shadow-rest);
	}

	.paper-card-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.paper-card-meta span {
		color: var(--purple);
		font-size: 0.82rem;
		font-weight: 850;
	}

	.paper-card-meta em {
		border: 1px solid color-mix(in srgb, var(--gold) 48%, var(--line));
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 16%, transparent);
		color: var(--heading);
		font-size: 0.74rem;
		font-style: normal;
		font-weight: 800;
		padding: 0.15rem 0.42rem;
	}

	.paper-card strong {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: 1.14rem;
		line-height: 1.12;
	}

	.paper-card p {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 6;
		line-clamp: 6;
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
		box-shadow: var(--surface-shadow-rest);
		padding: 1rem;
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

	.featured-event-card {
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--gold) 16%, transparent), transparent 42%),
			linear-gradient(132deg, color-mix(in srgb, var(--purple) 10%, transparent), transparent 50%),
			var(--surface);
		border-color: color-mix(in srgb, var(--gold) 42%, var(--line));
	}

	.featured-event-card span {
		color: color-mix(in srgb, var(--gold) 78%, var(--purple));
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

	.home-photo-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.home-photo-card {
		margin: 0;
		overflow: hidden;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
	}

	.home-photo-card img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		transition: transform var(--motion-fast);
	}

	.home-photo-card:hover img {
		transform: scale(1.012);
	}

	.home-photo-card figcaption {
		display: grid;
		align-content: center;
		gap: 0.35rem;
		padding: 1rem;
	}

	.home-photo-card figcaption span {
		color: var(--purple);
		font-size: 0.78rem;
		font-weight: 850;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.home-photo-card figcaption strong {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 2.3vw, 2rem);
		line-height: 1.08;
	}

	.home-photo-card figcaption p {
		margin: 0;
		color: var(--muted);
	}

	.home-photo-featured {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(17rem, 0.65fr);
		grid-column: 1 / -1;
	}

	.home-photo-featured img {
		height: 100%;
		min-height: 18rem;
		aspect-ratio: auto;
	}

	.home-photo-featured figcaption {
		padding: clamp(1.2rem, 3vw, 2rem);
	}

	@media (max-width: 860px) {
		.home-announcement {
			grid-template-columns: 1fr;
		}

		.home-announcement .actions {
			justify-content: flex-start;
		}

		.paper-grid,
		.event-list,
		.home-photo-grid,
		.home-photo-featured {
			grid-template-columns: 1fr;
		}

		.home-photo-featured {
			grid-column: auto;
		}

		.home-photo-featured img {
			height: auto;
			min-height: 0;
			aspect-ratio: 16 / 9;
		}

		.event-card,
		.paper-card {
			min-height: 0;
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

	@media (max-width: 390px) {
		.hero-title-lockup {
			gap: 0.55rem;
		}

		.hero-title-lockup img {
			width: 4.1rem;
			height: 4.1rem;
		}

		.hero-title-lockup h1 {
			font-size: clamp(1.95rem, 10.5vw, 2.45rem);
		}

		.stats div,
		.event-card,
		.paper-card {
			padding: 0.9rem;
		}
	}
</style>
