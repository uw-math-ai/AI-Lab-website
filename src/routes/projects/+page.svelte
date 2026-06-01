<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import CodePanel from '$lib/components/CodePanel.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
	import { projectIndexLeanSnippet } from '$lib/data/leanSnippets';
	import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { sitePath } from '$lib/paths';

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
</svelte:head>

<section class="page-shell hero compact-hero">
	<div>
		<span class="eyebrow">Projects</span>
		<h1>Projects by Quarter</h1>
		<p>
			All {totalProjectCount} Math AI Lab projects by academic quarter, ordered newest to oldest.
		</p>
		<div class="project-total">
			<strong><CountUp value={totalProjectCount} /></strong>
			<span>projects across {projectQuarters.length} quarters</span>
		</div>
	</div>
	<CodePanel snippet={projectIndexLeanSnippet} />
</section>

<section class="page-shell section">
	<Reveal>
		<div class="filter-row">
			<input bind:value={query} type="search" placeholder="Search project titles, descriptions, or quarters" aria-label="Search projects" />
		</div>

		<div class="quarter-grid">
			{#each filtered as quarter}
				<a class="card quarter-card" href={sitePath(`/projects/${quarter.slug}`)}>
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
		min-height: 26rem;
	}

	.project-total {
		display: inline-grid;
		gap: 0.1rem;
		margin-top: 1.25rem;
		padding: 0.9rem 1.05rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
	}

	.project-total strong {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		line-height: 1;
	}

	.project-total span {
		color: var(--muted);
		font-weight: 750;
	}

	.filter-row {
		margin-bottom: 1.2rem;
	}

	.filter-row input {
		flex: 1 1 18rem;
	}

	.quarter-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.quarter-card {
		text-decoration: none;
		min-height: 14rem;
		transition:
			transform 180ms ease,
			box-shadow 180ms ease;
	}

	.quarter-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow);
	}

	.quarter-card h2 {
		font-family: var(--font-display);
		color: var(--heading);
		margin: 0 0 0.55rem;
	}

	@media (max-width: 920px) {
		.quarter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.quarter-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
