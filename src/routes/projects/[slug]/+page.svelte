<script lang="ts">
	import LegacyContent from '$lib/components/LegacyContent.svelte';
	import CodePanel from '$lib/components/CodePanel.svelte';
	import { leanSnippetForQuarter } from '$lib/data/leanSnippets';
	import type { ProjectQuarter } from '$lib/data/projects';
	import { sitePath } from '$lib/paths';

	let { data } = $props<{ data: { quarter: ProjectQuarter } }>();
	let quarter = $derived(data.quarter);
</script>

<svelte:head>
	<title>{quarter.label} Projects | Math AI Lab</title>
</svelte:head>

<section class="page-shell hero quarter-hero">
	<div>
		<span class="eyebrow">{quarter.term} {quarter.year}</span>
		<h1>{quarter.label} Projects</h1>
		<div class="actions">
			<a class="button" href={sitePath('/projects')}>All projects</a>
		</div>
	</div>
	<CodePanel snippet={leanSnippetForQuarter(quarter.slug)} />
</section>

<section class="page-shell section project-content">
	<LegacyContent html={quarter.html} projectSlug={quarter.slug} />
</section>

<style>
	.quarter-hero {
		min-height: auto;
		padding: 2.2rem 0 1rem;
	}

	.quarter-hero h1 {
		font-size: clamp(2.4rem, 6vw, 4.9rem);
	}

	.quarter-hero :global(.code-panel) {
		align-self: stretch;
	}

	.project-content {
		padding-top: 1rem;
	}
</style>
