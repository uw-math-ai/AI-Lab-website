<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import OpenProblemsHero from '$lib/components/OpenProblemsHero.svelte';
	import ProjectEmbed from '$lib/components/ProjectEmbed.svelte';
	import { labEvents } from '$lib/data/events';
	import { participantCounts } from '$lib/data/people';
	import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { featuredResearch, totalPaperCount } from '$lib/data/research';
	import { labTools } from '$lib/data/tools';
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
	const [openProblems, theoremSearch] = labTools;

	let query = $state('');

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

	function searchUrl(q: string) {
		return `https://www.theoremsearch.com/search?q=${encodeURIComponent(q.trim())}`;
	}

	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<svelte:head>
	<title>Math AI Lab | University of Washington</title>
	<link rel="canonical" href={canonicalUrl('/')} />
	<meta property="og:title" content="Math AI Lab | University of Washington" />
	<meta property="og:url" content={canonicalUrl('/')} />
	<meta property="og:site_name" content="UW Math AI Lab" />
	<meta property="og:type" content="website" />
</svelte:head>

<section class="home-hero">
	<div class="hero-field" aria-hidden="false">
		<OpenProblemsHero
			bleed
			caption="Hover any point to read the problem"
			work="The Growing Map of Open Problems"
			author="Simon Kurgan"
			href="https://open-problems-map.pages.dev/"
		/>
	</div>
	<div class="page-shell hero-copy">
		<span class="eyebrow">University of Washington</span>
		<h1>Math AI Lab</h1>
		<p class="dek">
			The University of Washington Math AI Lab is a research and education organization focused on using AI
			for math, founded by
			<a href="https://sites.math.washington.edu/~jarod/">Jarod Alper</a> and <a href="https://vilin97.github.io/">Vasily Ilin</a>.
		</p>
		<div class="actions">
			<a class="button primary" href={sitePath('/projects/fall-2026')}>Fall 2026 Projects</a>
			<a class="button" href={sitePath('/events')}>Event Calendar</a>
			<a class="button" href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub</a>
		</div>
		<a class="hero-jump" href="#open-problems-map">Explore the full map ↓</a>
	</div>
</section>

{#if applicationAnnouncement}
	<section class="page-shell" aria-labelledby="fall-2026-applications-heading">
		<div class="home-announcement interactive-surface">
			<div>
				<span class="eyebrow">Applications open for Fall 2026</span>
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
	</section>
{/if}

<section class="page-shell section home-stats-section">
	<div class="stats">
		<div class="interactive-surface"><strong>{fmt(totalPaperCount)}</strong><span>papers</span></div>
		<div class="interactive-surface"><strong>{fmt(totalProjectCount)}</strong><span>projects</span></div>
		<div class="interactive-surface"><strong>{fmt(participantCounts.undergraduate)}</strong><span>undergraduate students</span></div>
		<div class="interactive-surface"><strong>{fmt(participantCounts.graduate)}</strong><span>graduate students</span></div>
		<div class="interactive-surface"><strong>{fmt(participantCounts.professor)}</strong><span>professors</span></div>
	</div>
</section>

<section class="page-shell section tools-section" id="tools">
	<div class="section-header">
		<span class="eyebrow">Tools</span>
		<h2>Built in the lab</h2>
		<p>Two public tools from Math AI Lab projects, running live below.</p>
	</div>

	<article class="tool" id={openProblems.id}>
		<Reveal>
			<div class="tool-head" data-reveal-item>
				<div class="tool-copy">
					<h3>{openProblems.name}</h3>
					<p>{openProblems.description}</p>
					<div class="tool-links">
						<a class="button" href={openProblems.url} target="_blank" rel="noreferrer">Open the map <span class="arrow">↗</span></a>
						{#each openProblems.links as link}
							<a class="text-link" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
						{/each}
					</div>
				</div>
				<dl class="tool-stats">
					{#each openProblems.stats as stat}
						<div><dt>{stat.label}</dt><dd class="num">{stat.value}</dd></div>
					{/each}
				</dl>
			</div>
			<div data-reveal-item style="--reveal-delay: 80ms">
				<ProjectEmbed
					src={openProblems.url}
					title={openProblems.name}
					poster={openProblems.poster}
					posterAlt={openProblems.posterAlt}
					loadLabel="Play the growing map"
				/>
			</div>
			<p class="credit">{openProblems.credit}</p>
		</Reveal>
	</article>

	<article class="tool" id={theoremSearch.id}>
		<Reveal>
			<div class="tool-head" data-reveal-item>
				<div class="tool-copy">
					<h3>{theoremSearch.name}</h3>
					<p>{theoremSearch.description}</p>
					<form class="search" action="https://www.theoremsearch.com/search" method="get" target="_blank" rel="noreferrer">
						<input
							type="search"
							name="q"
							bind:value={query}
							placeholder="Describe a result (e.g. The Jones polynomial is link invariant)"
							aria-label="Search TheoremSearch"
						/>
						<button class="button primary" type="submit">Search</button>
					</form>
					<div class="tool-links">
						{#each theoremSearch.links as link}
							<a class="text-link" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
						{/each}
					</div>
				</div>
				<dl class="tool-stats">
					{#each theoremSearch.stats as stat}
						<div><dt>{stat.label}</dt><dd class="num">{stat.value}</dd></div>
					{/each}
				</dl>
			</div>
			<div data-reveal-item style="--reveal-delay: 80ms">
				<ProjectEmbed
					src={query.trim() ? searchUrl(query) : theoremSearch.url}
					title={theoremSearch.name}
					poster={theoremSearch.poster}
					posterAlt={theoremSearch.posterAlt}
					loadLabel="Open TheoremSearch here"
				/>
			</div>
			<p class="credit">{theoremSearch.credit}</p>
		</Reveal>
	</article>
</section>

<section class="page-shell section papers-section">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Research</span>
			<h2>Publications & Preprints</h2>
			<p>Selected recent Math AI Lab papers. The full research page collects the lab's current conference papers, workshop papers, preprints, and essays.</p>
			<a class="section-link" href={sitePath('/research')}>Open Research Page →</a>
		</div>
		<ol class="paper-list">
			{#each featuredResearch as paper, index}
				<li class="paper-card interactive-surface" data-reveal-item style={`--reveal-delay: ${(index % 4) * 45}ms`}>
					<div class="paper-venue">
						<span>{paper.venue}</span>
						{#if paper.badge}<em>{paper.badge}</em>{/if}
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

<section class="page-shell section split-section">
	<Reveal>
		<div class="split">
			<div>
				<div class="section-header">
					<span class="eyebrow">Now</span>
					<h2>Events</h2>
					<p>Upcoming events, seminars, and hosted Math AI Lab gatherings.</p>
					<a class="section-link" href={sitePath('/events')}>Event Calendar →</a>
				</div>
				<ul class="row-list">
					<li class="event-card hackathon-home-card interactive-surface" data-reveal-item>
						<span class="row-key">Hosted event</span>
						<a class="row-body" href="https://uw2026leanhackathon.github.io/" target="_blank" rel="noreferrer">
							<img
								src={sitePath('/logos/uw-2026-lean-hackathon-banner.png')}
								alt="UW 2026 Lean Hackathon banner"
								loading="lazy"
								decoding="async"
							/>
							<strong>UW 2026 Lean Hackathon</strong>
							<small>We hosted a Lean hackathon bringing together formalization, math, and AI communities.</small>
						</a>
					</li>
					<li class="event-card featured-event-card interactive-surface" data-reveal-item style="--reveal-delay: 45ms">
						<span class="row-key">ICML 2026</span>
						<a class="row-body" href={sitePath('/events#icml-2026')}>
							<strong>We presented 8 papers at ICML 2026</strong>
							<small>Congratulations to our authors! Our work included an oral presentation and a workshop Spotlight in Seoul.</small>
						</a>
					</li>
					{#each upcoming as event, index}
						<li class="event-card interactive-surface" data-reveal-item style={`--reveal-delay: ${(index + 2) * 45}ms`}>
							<span class="row-key num">{formatDate(event.date)}</span>
							<a
								class="row-body"
								href={eventHref(event)}
								target={event.sourceUrl ? '_blank' : undefined}
								rel={event.sourceUrl ? 'noreferrer' : undefined}
							>
								<strong>{event.title}</strong>
								<small>{event.speaker}, {event.location}</small>
							</a>
						</li>
					{:else}
						<li class="event-card interactive-surface" data-reveal-item>
							<span class="row-key">Archive</span>
							<a class="row-body" href={sitePath('/events')}>
								<strong>Browse past Math AI events</strong>
								<small>The agenda archive is updated from the official UW Math source.</small>
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="section-header">
					<span class="eyebrow">Projects</span>
					<h2>Recent Quarters</h2>
					<a class="section-link" href={sitePath('/projects')}>All {totalProjectCount} projects →</a>
				</div>
				<ul class="row-list">
					{#each latestProjects as quarter, index}
						<li class="project-card interactive-surface" data-reveal-item style={`--reveal-delay: ${index * 45}ms`}>
							<span class="row-key">
								{quarter.label}
								{#if quarter.status === 'current'}<em>Current</em>{/if}
							</span>
							<a class="row-body" href={sitePath(`/projects/${quarter.slug}`)}>
								<strong>{quarter.label} Projects</strong>
								<small>{quarter.summary}</small>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</Reveal>
</section>

<section class="page-shell section">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Community</span>
			<h2>Lab moments</h2>
			<p>Recent gatherings from campus to conferences.</p>
			<a class="section-link" href={sitePath('/people')}>People →</a>
		</div>
		<div class="home-photo-grid">
			<figure class="home-photo-card home-photo-featured interactive-surface" data-reveal-item style="--reveal-delay: 0ms">
				<img src={sitePath('/photos/fall2025.jpg')} width="3024" height="1702" alt="Fall 2025 Math AI Lab" loading="lazy" decoding="async" />
				<figcaption>
					<span>Fall 2025</span>
					<strong>Math AI Lab</strong>
					<p>Our lab community during Fall Quarter 2025 at the University of Washington.</p>
				</figcaption>
			</figure>
			<figure class="home-photo-card interactive-surface" data-reveal-item style="--reveal-delay: 45ms">
				<img
					src={sitePath('/photos/icml-2026-coex-2.webp')}
					alt="Math AI Lab group at ICML 2026 in COEX, Seoul"
					width="2720"
					height="1532"
					loading="lazy"
					decoding="async"
				/>
				<figcaption>
					<span>ICML 2026, Seoul</span>
					<strong>ICML 2026 group photo</strong>
					<p>Math AI Lab members at COEX for eight papers presented across ICML and its workshops.</p>
				</figcaption>
			</figure>
			<figure class="home-photo-card wide interactive-surface" data-reveal-item style="--reveal-delay: 90ms">
				<img src={sitePath('/photos/lean-hackathon.jpg')} width="2000" height="584" alt="Participants at the UW 2026 Lean Hackathon" loading="lazy" decoding="async" />
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
	/* ---------- Hero ---------- */
	/* The map is the ground; the copy sits on the paper the mask leaves clear. */
	.home-hero {
		position: relative;
		display: grid;
		align-content: center;
		min-height: min(calc(100vh - 3.6rem), 46rem);
		padding: clamp(2rem, 5vw, 4rem) 0 3.5rem;
		overflow: hidden;
	}

	.hero-field {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.hero-copy {
		position: relative;
		z-index: 1;
		max-width: 100%;
		pointer-events: none;
	}

	.hero-copy > * {
		pointer-events: auto;
	}

	.hero-copy h1 {
		font-size: clamp(2.6rem, 5vw, 4.6rem);
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0.7rem 0 1.1rem;
		white-space: nowrap;
	}

	.dek {
		color: var(--muted);
		font-size: clamp(1.02rem, 1.4vw, 1.15rem);
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

	.hero-jump {
		display: inline-block;
		margin-top: 1.5rem;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
		border-bottom: 1px solid var(--line-strong);
		padding-bottom: 0.15rem;
	}

	.hero-jump:hover {
		color: var(--text);
		border-bottom-color: var(--text);
	}

	/* ---------- Announcement ---------- */
	.home-announcement {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem 2.5rem;
		padding: 1.25rem 0;
		margin-top: 1.5rem;
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line);
	}

	.home-announcement h2 {
		font-size: 1.35rem;
		line-height: 1.2;
		margin: 0.3rem 0 0.25rem;
	}

	.home-announcement p {
		max-width: var(--measure);
		margin: 0;
		color: var(--muted);
		font-size: 0.98rem;
	}

	.home-announcement .actions {
		justify-content: flex-end;
	}

	/* ---------- Stats ---------- */
	.home-stats-section {
		padding-top: clamp(1.5rem, 3vw, 2.5rem);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line);
	}

	.stats > div {
		padding: 1.1rem 1rem 1.1rem 0;
		margin-right: 1rem;
		border-right: 1px solid var(--line);
	}

	.stats > div:last-child {
		border-right: 0;
		margin-right: 0;
	}

	.stats strong {
		display: block;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: clamp(1.7rem, 3vw, 2.4rem);
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--heading);
	}

	.stats span {
		display: block;
		margin-top: 0.45rem;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	/* ---------- Tools ---------- */
	.tool {
		padding: clamp(1.5rem, 3vw, 2.5rem) 0 0;
	}

	.tool + .tool {
		margin-top: clamp(2.5rem, 5vw, 4rem);
		border-top: 1px solid var(--line);
	}

	.tool-head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1.5rem 3rem;
		align-items: start;
		margin-bottom: 1.5rem;
	}

	.tool-copy {
		max-width: 44rem;
	}

	.tool-copy h3 {
		font-size: clamp(1.6rem, 2.8vw, 2.1rem);
		line-height: 1.1;
		margin: 0 0 0.6rem;
	}

	.tool-copy p {
		margin: 0;
		font-size: 1.02rem;
		line-height: 1.5;
		color: var(--muted);
		max-width: var(--measure);
	}

	.tool-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1.2rem;
		margin-top: 1.1rem;
	}

	.text-link {
		font-family: var(--font-sans);
		font-size: 0.84rem;
		font-weight: 600;
		color: var(--text);
		text-decoration: none;
		border-bottom: 1px solid var(--line-strong);
	}

	.text-link:hover {
		border-bottom-color: var(--text);
	}

	.tool-stats {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 0.9rem 2.2rem;
		margin: 0.3rem 0 0;
		padding-left: 2rem;
		border-left: 1px solid var(--line);
	}

	.tool-stats div {
		display: grid;
		gap: 0.2rem;
	}

	.tool-stats dt {
		font-family: var(--font-sans);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.tool-stats dd {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 600;
		line-height: 1;
		color: var(--heading);
	}

	.search {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
		margin-top: 1.1rem;
		max-width: 40rem;
	}

	.search input {
		width: 100%;
	}

	.credit {
		margin: 0.6rem 0 0;
		font-family: var(--font-sans);
		font-size: 0.74rem;
		color: var(--muted);
	}

	/* ---------- Papers ---------- */
	.paper-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.paper-card {
		display: grid;
		grid-template-columns: 13rem minmax(0, 1fr);
		gap: 0.5rem 2rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
	}

	.paper-venue {
		display: grid;
		align-content: start;
		gap: 0.3rem;
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 0.35rem;
	}

	.paper-venue em {
		font-style: normal;
		color: var(--gold-ink);
	}

	.paper-body a {
		font-size: 1.2rem;
		line-height: 1.3;
		font-weight: 500;
		color: var(--heading);
		text-decoration: none;
	}

	.paper-body a:hover {
		text-decoration: underline;
	}

	.paper-body p {
		margin: 0.4rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--muted);
		max-width: var(--measure);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ---------- Events + Projects ---------- */
	.split {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 3rem;
		align-items: start;
	}

	.row-list {
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
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 0.3rem;
		line-height: 1.4;
	}

	.row-key em {
		display: block;
		margin-top: 0.2rem;
		font-style: normal;
		color: var(--text);
	}

	.row-key.num {
		font-family: var(--font-mono);
		text-transform: none;
		letter-spacing: 0;
	}

	.row-body {
		display: grid;
		gap: 0.2rem;
		text-decoration: none;
		color: var(--text);
	}

	.row-body img {
		width: 100%;
		max-width: 20rem;
		margin-bottom: 0.5rem;
		border: 1px solid var(--line);
	}

	.row-body strong {
		font-weight: 500;
		font-size: 1.08rem;
		line-height: 1.3;
	}

	.row-body:hover strong {
		text-decoration: underline;
	}

	.row-body small {
		font-family: var(--font-sans);
		font-size: 0.84rem;
		color: var(--muted);
		line-height: 1.45;
	}

	/* ---------- Photos ---------- */
	/* Photographs keep their own proportions — the panoramic hackathon shot
	   takes a full-width row rather than being cropped to match the others. */
	.home-photo-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
		gap: 1.5rem 1.25rem;
	}

	.home-photo-card {
		margin: 0;
		min-width: 0;
	}

	.home-photo-card.wide {
		grid-column: 1 / -1;
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
		font-size: 0.8rem;
		line-height: 1.45;
		color: var(--muted);
	}

	.home-photo-card figcaption span {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.home-photo-card figcaption strong {
		display: block;
		margin-top: 0.15rem;
		font-family: var(--font-serif);
		font-size: 1.02rem;
		font-weight: 500;
		color: var(--text);
	}

	.home-photo-card figcaption p {
		margin: 0.2rem 0 0;
	}

	@media (max-width: 1000px) {
		.home-hero {
			min-height: 0;
			padding-bottom: 0;
		}

		.hero-copy {
			order: -1;
		}

		.hero-field {
			position: static;
			height: 24rem;
			margin-top: 2rem;
			border-top: 1px solid var(--line-strong);
			padding-top: 1rem;
		}

		.hero-copy h1 {
			white-space: normal;
		}

		.tool-head {
			grid-template-columns: 1fr;
		}

		.tool-stats {
			grid-template-columns: repeat(4, auto);
			padding-left: 0;
			border-left: 0;
			border-top: 1px solid var(--line);
			padding-top: 1rem;
		}

		.split {
			grid-template-columns: 1fr;
		}

		.home-photo-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 640px) {
		/* Nothing smaller than 12px on a phone. */
		.tool-stats dt,
		.home-photo-card figcaption span {
			font-size: 0.75rem;
		}

		.credit,
		.home-photo-card figcaption {
			font-size: 0.82rem;
		}

		.home-announcement {
			grid-template-columns: 1fr;
		}

		.home-announcement .actions {
			justify-content: flex-start;
		}

		.hero-copy h1 {
			white-space: normal;
		}

		.paper-card {
			grid-template-columns: 1fr;
		}

		.row-list li {
			grid-template-columns: 1fr;
			gap: 0.3rem;
		}

		.tool-stats {
			grid-template-columns: repeat(2, auto);
		}

		.search {
			grid-template-columns: 1fr;
		}

		.home-photo-grid {
			grid-template-columns: 1fr;
		}

		.stats > div {
			border-right: 0;
			border-bottom: 1px solid var(--line);
			margin-right: 0;
		}

		.stats > div:last-child {
			border-bottom: 0;
		}
	}
</style>
