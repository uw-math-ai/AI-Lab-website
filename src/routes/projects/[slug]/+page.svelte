<script lang="ts">
	import LegacyContent from '$lib/components/LegacyContent.svelte';
	import AsciiMap from '$lib/components/AsciiMap.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
		import type { ProjectQuarter } from '$lib/data/projects';
	import { sitePath } from '$lib/paths';
	import { canonicalUrl } from '$lib/seo';

	let { data } = $props<{ data: { quarter: ProjectQuarter } }>();
	let quarter = $derived(data.quarter);
</script>

<svelte:head>
	<title>{quarter.label} Projects | Math AI Lab</title>
	<link rel="canonical" href={canonicalUrl(`/projects/${quarter.slug}/`)} />
	<meta property="og:title" content={`${quarter.label} Projects | Math AI Lab`} />
	<meta property="og:url" content={canonicalUrl(`/projects/${quarter.slug}/`)} />
</svelte:head>

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
		<LegacyContent html={quarter.html} projectSlug={quarter.slug} />
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
