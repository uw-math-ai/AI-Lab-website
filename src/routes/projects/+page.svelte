<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import AsciiMap from '$lib/components/AsciiMap.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
		import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { sitePath } from '$lib/paths';
	import { canonicalUrl } from '$lib/seo';

	let query = $state('');

	function searchableProjectText(html: string) {
		return html
			.replace(/<script[\s\S]*?<\/script>/gi, ' ')
			.replace(/<style[\s\S]*?<\/style>/gi, ' ')
			.replace(/<[^>]+>/g, ' ')
			.replace(/&amp;/g, '&')
			.replace(/&nbsp;/g, ' ')
			.replace(/\s+/g, ' ')
			.toLowerCase();
	}

	let filtered = $derived(
		projectQuarters.filter((quarter) => {
			const haystack = `${quarter.label} ${quarter.summary} ${searchableProjectText(quarter.html)}`.toLowerCase();
			return haystack.includes(query.toLowerCase());
		})
	);
</script>

<svelte:head>
	<title>Projects | Math AI Lab</title>
	<link rel="canonical" href={canonicalUrl('/projects/')} />
	<meta property="og:title" content="Projects | Math AI Lab" />
	<meta property="og:url" content={canonicalUrl('/projects/')} />
</svelte:head>

<section class="page-shell hero compact-hero">
	<div>
		<span class="eyebrow">Projects</span>
		<h1>Projects by Quarter</h1>
		<p>
			All {totalProjectCount} Math AI Lab projects by academic quarter, ordered newest to oldest.
		</p>
		<Reveal class="project-total-reveal">
			<div class="project-total interactive-surface">
				<strong><CountUp value={projectQuarters.length} /></strong>
				<span>academic quarters, {projectQuarters.at(-1)?.year}–{projectQuarters[0]?.year}</span>
			</div>
		</Reveal>
	</div>
	<div class="hero-aside"><AsciiMap cols={44} rows={20} /></div>
</section>

<section class="page-shell section">
	<Reveal>
		<div class="filter-row">
			<input bind:value={query} type="search" placeholder="Search project titles, descriptions, or quarters" aria-label="Search projects" />
		</div>

		<div class="quarter-grid">
			{#each filtered as quarter, index}
				<a
					class="card quarter-card interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 3) * 55}ms`}
					href={sitePath(`/projects/${quarter.slug}`)}
				>
					<div class="meta">
						<span class="pill">{quarter.label}</span>
						{#if quarter.status === 'current'}<span class="pill">current</span>{/if}
					</div>
					<h2>{quarter.label}</h2>
					<p>{quarter.summary}</p>
				</a>
			{/each}
		</div>
	</Reveal>
</section>

<style>
	.compact-hero {
		min-height: 24rem;
	}

	.compact-hero :global(.project-total-reveal) {
		width: fit-content;
	}

	.project-total {
		display: inline-flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-top: 1.25rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--line-strong);
	}

	.project-total strong {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: 2rem;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--heading);
	}

	.project-total span {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.filter-row {
		margin-bottom: 0.5rem;
	}

	.filter-row input {
		flex: 1 1 18rem;
		max-width: 38rem;
	}

	.quarter-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		border-top: 1px solid var(--line-strong);
		margin-top: 1rem;
	}

	.quarter-card {
		display: grid;
		grid-template-columns: 11rem minmax(0, 1fr);
		gap: 0.4rem 2rem;
		padding: 1rem 0;
		border: 0;
		border-bottom: 1px solid var(--line);
		border-radius: 0;
		background: transparent;
		text-decoration: none;
		color: var(--text);
	}

	.quarter-card .meta {
		margin: 0;
		align-content: start;
		padding-top: 0.2rem;
	}

	.quarter-card h2 {
		margin: 0;
		font-size: 1.22rem;
		font-weight: 500;
		line-height: 1.3;
		color: var(--heading);
	}

	.quarter-card:hover h2 {
		text-decoration: underline;
	}

	.quarter-card p {
		grid-column: 2;
		margin: 0;
		color: var(--muted);
		font-size: 0.98rem;
		max-width: 72ch;
	}

	@media (max-width: 640px) {
		.quarter-card {
			grid-template-columns: 1fr;
		}

		.quarter-card p {
			grid-column: 1;
		}
	}
</style>
