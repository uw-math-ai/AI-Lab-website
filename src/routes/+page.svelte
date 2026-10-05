<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import ProjectEmbed from '$lib/components/ProjectEmbed.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import NewsList from '$lib/components/NewsList.svelte';
	import { labEvents, eventDate } from '$lib/data/events';
	import { participantCounts } from '$lib/data/people';
	import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { featuredResearch, totalPaperCount } from '$lib/data/research';
	import { labTools } from '$lib/data/tools';
	import { pages } from '$lib/data/pages';
	import { sitePath } from '$lib/paths';
	import { timeRange } from '$lib/calendar';
	import { graph, organization, website } from '$lib/structuredData';

	const fallProjects = projectQuarters.find((quarter) => quarter.slug === 'fall-2026');

	const upcoming = labEvents
		.filter((event) => eventDate(event) >= new Date())
		.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
		.slice(0, 2);

	let selected = $state(0);

	function onTabKeydown(event: KeyboardEvent) {
		const last = labTools.length - 1;
		if (event.key === 'Home') selected = 0;
		else if (event.key === 'End') selected = last;
		else if (event.key === 'ArrowRight') selected = (selected + 1) % labTools.length;
		else if (event.key === 'ArrowLeft') selected = (selected + last) % labTools.length;
		else return;
		event.preventDefault();
		const next = document.getElementById(`tool-tab-${labTools[selected].id}`);
		next?.focus();
	}

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

	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<Seo
	{...pages.home}
	jsonLd={graph(organization, website)}
/>

<section class="page-shell home-hero">
	<div class="hero-copy">
		<h1>Math AI Lab</h1>
		<p class="dek">
			The University of Washington Math AI Lab is a research and education organization focused on using AI
			for math, founded by
			<a href="https://sites.math.washington.edu/~jarod/">Jarod Alper</a> and <a href="https://vilin97.github.io/">Vasily Ilin</a>.
		</p>
		<div class="actions">
			<a class="button primary" href={sitePath('/resources')}>Resources</a>
			<a class="button" href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub</a>
		</div>
	</div>
	<div class="stats" role="group" aria-label="The lab at a glance">
		<div><strong>{fmt(totalPaperCount)}</strong><span>papers</span></div>
		<div><strong>{fmt(totalProjectCount)}</strong><span>projects</span></div>
		<div><strong>{fmt(participantCounts.undergraduate)}</strong><span>undergraduate students</span></div>
		<div><strong>{fmt(participantCounts.graduate)}</strong><span>graduate students</span></div>
		<div><strong>{fmt(participantCounts.professor)}</strong><span>professors</span></div>
	</div>
</section>

{#if fallProjects}
	<section class="page-shell section" aria-labelledby="fall-2026-applications-heading">
		<div class="section-header">
			<h2 id="fall-2026-applications-heading">Fall 2026 Projects</h2>
			<a class="section-link" href={sitePath('/projects')}>All {totalProjectCount} projects →</a>
		</div>
		<div class="home-announcement interactive-surface">
			<div>
				<p>We are excited to run {fallProjects.blocks.filter((block) => block.type === 'project').length} projects involving 61 students! Meetings are scheduled for Mondays & Wednesdays from September 30 - December 11. We expect to reopen applications in December for Winter 2027.</p>
			</div>
			<div class="actions">
				<a class="button primary" href={sitePath('/projects/fall-2026')}>Fall 2026 Projects</a>
				<a class="button" href={sitePath('/slides/fall-2026/')}>Inaugural meeting slides</a>
			</div>
		</div>
	</section>
{/if}

<NewsList limit={4} preview />

<section class="page-shell section events-section">
	<Reveal>
		<div class="section-header">
			<h2>Events</h2>
			<a class="section-link" href={sitePath('/events')}>All events →</a>
		</div>

		{#if upcoming.length}
			<ul class="row-list">
				{#each upcoming as event}
					<li data-reveal-item>
						<span class="row-key num">{formatDate(event.date)}</span>
						<a
							class="row-body"
							href={eventHref(event)}
							target={event.sourceUrl ? '_blank' : undefined}
							rel={event.sourceUrl ? 'noreferrer' : undefined}
						>
							<strong>{event.title}</strong>
							{#if timeRange(event) || event.location}
								<small>{[timeRange(event), event.location].filter(Boolean).join(' \u00b7 ')}</small>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty">No events are scheduled right now.</p>
		{/if}
	</Reveal>
</section>

<section class="page-shell section papers-section">
	<Reveal>
		<div class="section-header">
			<h2>Research</h2>
			<a class="section-link" href={sitePath('/research')}>All Research →</a>
		</div>
		<ol class="paper-list">
			{#each featuredResearch as paper, index}
				<li class="paper-card interactive-surface" data-reveal-item style={`--reveal-delay: ${(index % 4) * 45}ms`}>
					<div class="paper-venue">
						{#each paper.venues.filter((venue) => venue.showOnHome !== false) as venue}
							<span class="venue">{venue.name}{#if venue.badge}<em>{venue.badge}</em>{/if}</span>
						{/each}
					</div>
					<div class="paper-body">
						<a href={paper.url} target="_blank" rel="noreferrer">{paper.title}</a>
						<p>{paper.abstract}</p>
					</div>
				</li>
			{/each}
		</ol>
	</Reveal>
</section>

<section class="page-shell section">
	<Reveal>
		<div class="section-header">
			<h2>Community</h2>
			<a class="section-link" href={sitePath('/people')}>People →</a>
		</div>
		<div class="home-photo-grid">
			<figure class="home-photo-card interactive-surface" data-reveal-item style="--reveal-delay: 0ms">
				<img src={sitePath('/photos/spring2026-demo-day-group.jpg')} width="2000" height="1126" alt="Math AI Lab members and project teams standing together at Spring 2026 demo day" loading="lazy" decoding="async" />
				<figcaption>Spring 2026 demo day, June 8, 2026</figcaption>
			</figure>
			<figure class="home-photo-card interactive-surface" data-reveal-item style="--reveal-delay: 45ms">
				<img src={sitePath('/photos/spring2026-demo-day-certificates.jpg')} width="2000" height="1126" alt="Seven Math AI Lab members each holding a certificate of recognition at Spring 2026 demo day" loading="lazy" decoding="async" />
				<figcaption>Certificates of recognition, Spring 2026 demo day</figcaption>
			</figure>
		</div>
	</Reveal>
</section>

<section class="page-shell section tools-section" id="tools">
	<div class="section-header">
		<h2>Tools</h2>
	</div>

	<div class="gallery" id="open-problems-map">
		<div class="gallery-tabs" role="tablist" aria-label="Lab tools">
			{#each labTools as tool, index}
				<button
					type="button"
					role="tab"
					id={`tool-tab-${tool.id}`}
					aria-selected={selected === index}
					aria-controls={`tool-panel-${tool.id}`}
					tabindex={selected === index ? 0 : -1}
					class:selected={selected === index}
					onclick={() => (selected = index)}
					onkeydown={onTabKeydown}
				>
					{tool.name}
				</button>
			{/each}
		</div>

		{#each labTools as tool, index}
			{#if selected === index}
				<div
					class="gallery-panel"
					id={`tool-panel-${tool.id}`}
					role="tabpanel"
					aria-labelledby={`tool-tab-${tool.id}`}
				>
					<div class="gallery-copy">
						<p class="tool-description">{tool.description}</p>
						<div class="tool-links">
							<a class="button" href={tool.url} target="_blank" rel="noreferrer">
								{tool.id === 'theoremsearch' ? 'Open TheoremSearch' : 'Open the map'}
								<span class="arrow">↗</span>
							</a>
							{#each tool.links as link}
								<a class="text-link" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
							{/each}
						</div>
					</div>

					<ProjectEmbed
						src={tool.url}
						title={tool.name}
						poster={tool.poster}
						posterAlt={tool.posterAlt}
						loadLabel={tool.id === 'theoremsearch' ? 'Open TheoremSearch here' : 'Play the growing map'}
					/>
					<p class="credit">{tool.credit}</p>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	/* ---------- Hero ---------- */
	.home-hero {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(15rem, 0.75fr);
		gap: clamp(1.5rem, 5vw, 4rem);
		align-items: end;
		padding: var(--intro-padding);
	}

	.hero-copy h1 {
		font-size: var(--text-display);
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0 0 1.1rem;
	}

	.dek {
		color: var(--muted);
		font-size: var(--text-lead);
		line-height: 1.5;
		max-width: 31rem;
		margin: 0;
	}

	.dek a {
		color: var(--text);
	}

	.hero-copy .actions {
		margin-top: 1.6rem;
	}

	/* ---------- Announcement ---------- */
	.home-announcement {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem 2.5rem;
	}

	.home-announcement p {
		max-width: var(--measure);
		margin: 0;
		color: var(--muted);
		font-size: var(--text-base);
	}

	.home-announcement .actions {
		justify-content: flex-end;
		max-width: 28rem;
	}

	/* ---------- Stats ---------- */
	/* Same vertical rule as the Research page's stats panel. */
	.stats {
		display: grid;
		gap: 0.9rem;
		padding-left: 1.25rem;
		border-left: 1px solid var(--line);
	}

	.stats > div {
		display: grid;
		grid-template-columns: 5rem minmax(0, 1fr);
		align-items: baseline;
		gap: 1rem;
	}

	.stats strong {
		font-family: var(--font-serif);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: var(--text-title);
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--heading);
		text-align: right;
	}

	.stats span {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	/* ---------- Tools ---------- */
	/* Both tools share one frame; the tabs pick which is on show, so the
	   section stays the same height whichever is selected. */
	.gallery {
		display: grid;
		gap: 1.5rem;
	}

	.gallery-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.75rem;
	}

	.gallery-tabs button {
		position: relative;
		border: 0;
		background: none;
		padding: 0 0 0.7rem;
		margin-bottom: -1px;
		font-family: var(--font-serif);
		font-size: var(--text-subtitle);
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--muted);
		cursor: pointer;
		transition: color var(--motion-fast);
	}

	.gallery-tabs button:hover {
		color: var(--text);
	}

	.gallery-tabs button.selected {
		color: var(--heading);
	}

	.gallery-tabs button.selected::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		background: var(--purple);
	}

	.gallery-panel {
		display: grid;
		gap: 1.25rem;
	}

	.tool-description {
		margin: 0;
		max-width: var(--measure);
		font-size: var(--text-base);
		line-height: 1.5;
		color: var(--muted);
	}

	.tool-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.2rem;
		margin-top: 1.1rem;
	}

	.text-link {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--purple);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--purple) 40%, transparent);
	}

	.text-link:hover {
		border-bottom-color: var(--purple);
	}

	.credit {
		margin: 0;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--muted);
	}

	/* ---------- Papers ---------- */
	.paper-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
		gap: 0 3rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.paper-card {
		display: grid;
		gap: 0.5rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
	}

	.paper-venue {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.8rem;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 0.35rem;
	}

	.paper-venue .venue {
		display: grid;
		justify-items: start;
		gap: 0.15rem;
	}

	.paper-venue em {
		font-style: normal;
		color: var(--gold-ink);
	}

	.paper-body a {
		font-size: var(--text-lg);
		line-height: 1.3;
		font-weight: 500;
		color: var(--heading);
		text-decoration: none;
	}

	.paper-body a:hover {
		color: var(--purple);
		text-decoration: underline;
	}

	.paper-body p {
		margin: 0.4rem 0 0;
		font-size: var(--text-base);
		line-height: 1.5;
		color: var(--muted);
		max-width: var(--measure);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ---------- Events ---------- */
	.empty {
		margin: 0;
		color: var(--muted);
	}

	/* ---------- Upcoming events list ---------- */
	.row-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
		gap: 0 3rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.row-list li {
		display: grid;
		grid-template-columns: 8rem minmax(0, 1fr);
		gap: 1.25rem;
		padding: 0.9rem 0;
		border-bottom: 1px solid var(--line);
	}

	.row-key {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 0.3rem;
		line-height: 1.4;
	}

	.row-key.num {
		font-family: var(--font-sans);
		text-transform: none;
		letter-spacing: 0;
	}

	.row-body {
		display: grid;
		gap: 0.2rem;
		text-decoration: none;
		color: var(--text);
	}

	.row-body strong {
		font-weight: 500;
		font-size: var(--text-md);
		line-height: 1.3;
	}

	.row-body:hover strong {
		color: var(--purple);
		text-decoration: underline;
	}

	.row-body small {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--muted);
		line-height: 1.45;
	}

	/* ---------- Photos ---------- */
	/* Photographs keep their own proportions — the panoramic hackathon shot
	   takes a full-width row rather than being cropped to match the others. */
	.home-photo-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem 1.25rem;
	}

	.home-photo-card {
		margin: 0;
		min-width: 0;
	}

	.home-photo-card img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.home-photo-card figcaption {
		margin-top: 0.55rem;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		line-height: 1.45;
		color: var(--muted);
	}

	@media (max-width: 900px) {
		.home-hero {
			grid-template-columns: 1fr;
			align-items: start;
		}

		.stats {
			padding-left: 0;
			border-left: 0;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1rem 1.5rem;
		}

		.stats > div {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}

		.stats strong {
			text-align: left;
		}
	}

	@media (max-width: 1000px) {
	}

	@media (max-width: 640px) {
		/* Nothing smaller than 12px on a phone. */
		.home-photo-grid {
			grid-template-columns: 1fr;
		}

		.credit,
		.home-photo-card figcaption {
			font-size: var(--text-sm);
		}

		.home-announcement {
			grid-template-columns: 1fr;
		}

		.home-announcement .actions {
			justify-content: flex-start;
		}

		.row-list li {
			grid-template-columns: 1fr;
			gap: 0.3rem;
		}
	}
</style>
