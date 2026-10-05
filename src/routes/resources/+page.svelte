<script lang="ts">
	import ContentBlocks from '$lib/components/ContentBlocks.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { courses, resources, seminars } from '$lib/data/resources';
	import { labTools } from '$lib/data/tools';
	import { pages } from '$lib/data/pages';
	import { breadcrumbs, collectionPage, graph } from '$lib/structuredData';

	const { title, description } = pages.resources;
</script>

<Seo
	{title}
	{description}
	path="/resources/"
	jsonLd={graph(
		collectionPage(title, '/resources/', description),
		breadcrumbs([
			{ name: 'Home', path: '/' },
			{ name: 'Resources', path: '/resources/' }
		])
	)}
/>

<section class="page-shell hero compact-hero single">
	<div>
		<h1>Resources</h1>
		<p>
			Associated UW courses and seminars, and curated articles about AI for math and Lean.
		</p>
	</div>
</section>

<section class="page-shell section combined-resource-section" id="tools">
	<Reveal>
		<div class="section-header">
			<h2>Tools</h2>
		</div>
		<div class="tool-list">
			{#each labTools as tool}
				<article class="tool" data-reveal-item>
					<h3><a href={tool.url} target="_blank" rel="noreferrer">{tool.name}<span class="sr-only"> (opens in new tab)</span></a></h3>
					<p>{tool.description}</p>
					<div class="tool-links">
						<a class="button primary" href={tool.url} target="_blank" rel="noreferrer">Open<span class="sr-only"> {tool.name} (opens in new tab)</span> <span aria-hidden="true">↗</span></a>
						{#each tool.links as link}
							<a class="text-link" href={link.url} target="_blank" rel="noreferrer">{link.label}<span class="sr-only"> (opens in new tab)</span></a>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="seminars">
	<Reveal>
		<div class="section-header">
			<h2>Seminars</h2>
		</div>
		<ContentBlocks blocks={seminars.blocks} compact flat />
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="courses">
	<Reveal>
		<div class="section-header">
			<h2>Courses</h2>
		</div>
		<ContentBlocks blocks={courses.blocks} compact flat />
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="resources">
	<Reveal>
		<div class="section-header">
			<h2>Reading</h2>
		</div>
		<ContentBlocks blocks={resources.blocks} compact flat />
	</Reveal>
</section>

<style>
	.tool-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 32rem), 1fr));
		gap: 2rem 3rem;
	}

	.tool h3 {
		margin: 0 0 0.4rem;
		font-size: var(--text-xl);
		line-height: 1.15;
	}

	.tool h3 a {
		color: var(--heading);
		text-decoration: none;
	}

	.tool h3 a:hover {
		text-decoration: underline;
	}

	.tool p {
		margin: 0 0 1rem;
		max-width: 60ch;
		color: var(--muted);
	}

	.tool-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.1rem;
	}

	.tool-links .text-link {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		white-space: nowrap;
		color: var(--purple);
	}

	/* Sections sit 2.5rem apart, the same gap as between the intro and Tools. */
	.combined-resource-section {
		scroll-margin-top: 7rem;
		padding-bottom: 2.5rem;
	}

	/* The first section follows the intro closely (the section links that sat between them are gone). */
	#tools {
		padding-top: 1.5rem;
	}

	/* The lists take the wide left column and the epigraph sits in a narrower right column, instead of leaving the
	   right half of every section empty. */
	.combined-resource-section :global(.legacy-content > section) {
		display: grid;
		grid-template-columns: minmax(0, 0.68fr) minmax(0, 0.32fr);
		column-gap: clamp(2rem, 5vw, 4rem);
		align-items: start;
	}

	.combined-resource-section :global(.legacy-content > section > *) {
		grid-column: 1;
	}

	/* Hierarchy: bold, larger subtitles; muted lead-in descriptions; plain list entries. */
	.combined-resource-section :global(.legacy-content > section > h3) {
		margin: 2rem 0 0.25rem;
		font-size: var(--text-subtitle);
		font-weight: 600;
		line-height: 1.2;
	}

	.combined-resource-section :global(.legacy-content > section > p) {
		margin: 0 0 1rem;
		max-width: 60ch;
		color: var(--muted);
		font-size: var(--text-md);
		line-height: 1.5;
	}

	.combined-resource-section :global(.legacy-content > section > p strong) {
		color: var(--heading);
	}

	.combined-resource-section :global(.legacy-content > section > ul > li > strong:first-child) {
		display: block;
		margin-bottom: 0.4rem;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.combined-resource-section :global(.legacy-content > section > .title-quote) {
		grid-column: 2;
		grid-row: 1 / span 12;
		margin: 0;
	}

	.combined-resource-section + .combined-resource-section {
		padding-top: 0;
	}

	@media (max-width: 900px) {
		.combined-resource-section :global(.legacy-content > section) {
			display: block;
		}
	}

</style>
