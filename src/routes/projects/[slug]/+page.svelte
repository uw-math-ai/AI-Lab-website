<script lang="ts">
	import ContentBlocks from '$lib/components/ContentBlocks.svelte';
	import AsciiMap from '$lib/components/AsciiMap.svelte';
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
		<span class="eyebrow">{quarter.term} {quarter.year}</span>
		<h1>{quarter.label} Projects</h1>
		<div class="actions">
			<a class="button" href={sitePath('/projects')}>All projects</a>
		</div>
	</div>
	<div class="hero-aside"><AsciiMap cols={44} rows={20} /></div>
</section>

<section class="page-shell section project-content">
	<Reveal>
		<ContentBlocks blocks={quarter.blocks} projectSlug={quarter.slug} />
	</Reveal>
</section>

<style>
	.quarter-hero {
		min-height: auto;
		padding: 2.2rem 0 1rem;
	}

	.quarter-hero h1 {
		font-size: clamp(2.2rem, 5vw, 4rem);
	}

	.project-content {
		padding-top: 1rem;
	}
</style>
