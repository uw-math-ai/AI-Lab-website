<script lang="ts">
	import ContentBlocks from '$lib/components/ContentBlocks.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { courses, resources, seminars } from '$lib/data/resources';
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
		<span class="eyebrow">Resources</span>
		<h1>Seminars, Courses, and Resources</h1>
		<p>
			A guide to Math AI background material, UW courses, and related seminar series.
		</p>
	</div>
</section>

<section class="page-shell featured-resource" aria-labelledby="featured-resource-title">
	<Reveal>
		<a
			class="featured-resource-card interactive-surface"
			data-reveal-item
			href="https://ww2.ams.org/journals/bull/2026-63-02/S0273-0979-2025-01879-0/viewer/?t=1780254358590"
			target="_blank"
			rel="noreferrer"
		>
			<div>
				<span class="eyebrow">Featured AMS article</span>
				<h2 id="featured-resource-title">Embracing AI and Formalization</h2>
				<p>
					by Jarod Alper
				</p>
			</div>
			<span class="featured-link">Read at AMS</span>
		</a>
	</Reveal>
</section>

<nav class="page-shell resource-section-nav" aria-label="Resources page sections">
	<a href="#seminars">Seminars</a>
	<a href="#courses">Courses</a>
	<a href="#resources">Resources</a>
</nav>

<section class="page-shell section combined-resource-section" id="seminars">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Seminars</span>
			<h2>Related Seminars</h2>
			<p>Math AI-related colloquia and seminars at the University of Washington.</p>
		</div>
		<ContentBlocks blocks={seminars.blocks} compact flat />
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="courses">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">UW Courses</span>
			<h2>Related Courses</h2>
			<p>Formal methods, AI and machine learning, NLP, optimization, data science, and ethics courses.</p>
		</div>
		<ContentBlocks blocks={courses.blocks} compact flat />
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="resources">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Reading</span>
			<h2>Math AI Resources</h2>
			<p>Background material, Math AI reading, and Lean resources for getting started and getting serious.</p>
		</div>
		<ContentBlocks blocks={resources.blocks} compact flat />
	</Reveal>
</section>

<style>
	.compact-hero {
		min-height: 24rem;
	}

	.featured-resource {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.featured-resource-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1rem 2rem;
		align-items: center;
		padding: 1.2rem 0;
		border-top: 1px solid var(--line-strong);
		border-bottom: 1px solid var(--line);
		color: var(--text);
		text-decoration: none;
	}

	.featured-resource-card h2 {
		margin: 0.25rem 0 0.2rem;
		font-size: 1.5rem;
		line-height: 1.15;
		color: var(--heading);
	}

	.featured-resource-card:hover h2 {
		text-decoration: underline;
	}

	.featured-resource-card p {
		margin: 0;
		color: var(--muted);
		font-size: 1rem;
	}

	.featured-link {
		font-family: var(--font-sans);
		font-size: 0.86rem;
		font-weight: 600;
		white-space: nowrap;
		color: var(--text);
	}

	.featured-link::after {
		content: ' ↗';
		font-family: var(--font-serif);
	}

	.resource-section-nav {
		display: flex;
		gap: 1.6rem;
		align-items: center;
		padding: 0.9rem 0 0;
	}

	.resource-section-nav a {
		font-family: var(--font-sans);
		font-size: 0.86rem;
		font-weight: 600;
		color: var(--muted);
		text-decoration: none;
		padding-bottom: 0.15rem;
		border-bottom: 2px solid transparent;
	}

	.resource-section-nav a:hover {
		color: var(--text);
		border-bottom-color: var(--text);
	}

	.combined-resource-section {
		scroll-margin-top: 7rem;
	}

	.combined-resource-section + .combined-resource-section {
		padding-top: 0;
	}

	@media (max-width: 720px) {
		.featured-resource-card {
			grid-template-columns: 1fr;
		}

		.resource-section-nav {
			overflow-x: auto;
		}

		.resource-section-nav a {
			flex: 0 0 auto;
			white-space: nowrap;
		}
	}
</style>
