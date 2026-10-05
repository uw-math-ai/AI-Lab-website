<script lang="ts">
	import ContentBlocks from '$lib/components/ContentBlocks.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { ProjectQuarter } from '$lib/data/projects';
	import { sitePath } from '$lib/paths';
	import { breadcrumbs, collectionPage, graph } from '$lib/structuredData';

	let { data } = $props<{ data: { quarter: ProjectQuarter } }>();
	let quarter = $derived(data.quarter);
	let title = $derived(`${quarter.label} Projects — UW Math AI Lab`);

	function projectDescription(projectQuarter: ProjectQuarter) {
		const summary = `${projectQuarter.label} research projects at the University of Washington Math AI Lab: ${projectQuarter.summary}`;
		const expanded =
			summary.length < 120
				? `${summary} Explore the project archive, participants, and research links.`
				: summary;
		if (expanded.length <= 158) return expanded;
		return `${expanded.slice(0, 157).replace(/\s+\S*$/, '')}…`;
	}

	let description = $derived(projectDescription(quarter));
	let jsonLd = $derived(
		graph(
			collectionPage(title, `/projects/${quarter.slug}/`, description),
			breadcrumbs([
				{ name: 'Home', path: '/' },
				{ name: 'Projects', path: '/projects/' },
				{ name: quarter.label, path: `/projects/${quarter.slug}/` }
			])
		)
	);
</script>

<Seo {title} {description} path={`/projects/${quarter.slug}/`} {jsonLd} />

<section class="page-shell hero quarter-hero">
	<div>
		<a class="back-link" href={sitePath('/projects')}><span aria-hidden="true">←</span> All projects</a>
		<h1>{quarter.label} Projects</h1>
		{#if quarter.slug === 'fall-2026'}
			<div class="actions">
				<a class="button primary" href={sitePath('/slides/fall-2026/')}>Inaugural meeting slides</a>
			</div>
		{/if}
	</div>
</section>

<section class="page-shell section project-content">
	<Reveal>
		<ContentBlocks blocks={quarter.blocks} projectSlug={quarter.slug} />
	</Reveal>
</section>

<style>
	.quarter-hero h1 {
		font-size: var(--text-display);
	}

</style>
