<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { projectQuarters, totalProjectCount } from '$lib/data/projects';
	import { pages } from '$lib/data/pages';
	import { sitePath } from '$lib/paths';
	import { searchableContent } from '$lib/content/text';
	import { breadcrumbs, collectionPage, graph } from '$lib/structuredData';

	const { title, description } = pages.projects;

	// Each card lists the quarter's actual project titles. Older pages also use project blocks for
	// "Faculty mentors" / "Student participants"; those are people, not projects.
	const notAProject = /mentors|participants/i;
	function projectTitles(quarter: (typeof projectQuarters)[number]) {
		return quarter.blocks
			.filter((block) => block.type === 'project' && !notAProject.test(block.title))
			.map((block) => (block as { title: string }).title.replace(/[_*]/g, ''));
	}

	// Show the first few titles and say how many more there are, so no title is cut mid-word.
	function titleLine(titles: string[]) {
		if (titles.length <= 5) return titles.join(' · ');
		return `${titles.slice(0, 4).join(' · ')} · and ${titles.length - 4} more`;
	}

	let query = $state('');

	let filtered = $derived(
		projectQuarters.filter((quarter) => {
			const haystack = `${quarter.label} ${quarter.summary} ${searchableContent(quarter.blocks)}`.toLowerCase();
			return haystack.includes(query.toLowerCase());
		})
	);
</script>

<Seo
	{title}
	{description}
	path="/projects/"
	jsonLd={graph(
		collectionPage(title, '/projects/', description),
		breadcrumbs([
			{ name: 'Home', path: '/' },
			{ name: 'Projects', path: '/projects/' }
		])
	)}
/>

<section class="page-shell hero compact-hero">
	<div>
		<h1>Projects</h1>
		<p>
			All {totalProjectCount} Math AI Lab projects by academic quarter.
		</p>
	</div>
</section>

<section class="page-shell section search-section">
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
					<h2>{quarter.label}</h2>
					{#if projectTitles(quarter).length}
						<p class="count">
							{projectTitles(quarter).length} {projectTitles(quarter).length === 1 ? 'project' : 'projects'}
							{#if quarter.returningProjects !== undefined}
								<span class="breakdown">{projectTitles(quarter).length - quarter.returningProjects} new · {quarter.returningProjects} returning</span>
							{/if}
						</p>
						<p class="titles">{titleLine(projectTitles(quarter))}</p>
					{:else}
						<p class="titles">{quarter.summary}</p>
					{/if}
				</a>
			{/each}
		</div>
	</Reveal>
</section>

<style>




	/* The search box sits close under the page title. */
	.search-section {
		padding-top: 1.5rem;
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
		margin-top: 1rem;
	}

	.quarter-card {
		display: grid;
		gap: 0.3rem;
		padding: 1rem 0;
		border: 0;
		border-bottom: 1px solid var(--line);
		border-radius: 0;
		background: transparent;
		text-decoration: none;
		color: var(--text);
	}

	.quarter-card h2 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: 500;
		line-height: 1.3;
		color: var(--heading);
	}

	.quarter-card:hover h2 {
		text-decoration: underline;
	}

	.quarter-card p {
		margin: 0;
		color: var(--muted);
		font-size: var(--text-base);
		max-width: 72ch;
	}

	.quarter-card .count {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1rem;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
