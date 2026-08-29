<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import { researchSections } from '$lib/data/research';
	import { canonicalUrl } from '$lib/seo';

	let query = $state('');

	const allItems = $derived(researchSections.flatMap((section) => section.items));
	const filteredSections = $derived(
		researchSections
			.map((section) => ({
				...section,
				items: section.items.filter((item) => {
					const haystack = `${item.venue} ${item.title} ${item.authors} ${item.abstract}`.toLowerCase();
					return haystack.includes(query.trim().toLowerCase());
				})
			}))
			.filter((section) => section.items.length)
	);
</script>

<svelte:head>
	<title>Research | Math AI Lab</title>
	<meta
		name="description"
		content="Publications and preprints from the University of Washington Math AI Lab."
	/>
	<link rel="canonical" href={canonicalUrl('/research/')} />
	<meta property="og:title" content="Research | Math AI Lab" />
	<meta property="og:url" content={canonicalUrl('/research/')} />
</svelte:head>

<section class="page-shell hero research-hero">
	<div>
		<span class="eyebrow">Publications & Preprints</span>
		<h1>UW Math AI Lab Research</h1>
		<p>
			Papers published and in progress by UW Math AI Lab members, spanning AI for mathematics,
			formal verification, plasma physics, and quantum error correction.
		</p>
		<div class="actions">
			<a class="button primary" href="#conference-workshop-papers">Conference Papers</a>
			<a class="button" href="#preprints">Preprints</a>
		</div>
	</div>
	<Reveal class="research-index-reveal">
		<nav class="research-index interactive-surface" aria-label="Research sections">
			<strong>{allItems.length}</strong>
			<span>listed works</span>
			{#each researchSections as section}
				<a href={`#${section.id}`}>{section.title}</a>
			{/each}
		</nav>
	</Reveal>
</section>

<section class="page-shell section research-controls">
	<label>
		<span>Search research</span>
		<input type="search" bind:value={query} placeholder="Title, author, venue, keyword" />
	</label>
</section>

{#each filteredSections as section}
	<section class="page-shell section research-section" id={section.id}>
		<Reveal>
			<div class="section-header">
				<span class="eyebrow">Research</span>
				<h2>{section.title}</h2>
				<p>{section.description}</p>
			</div>

			<div class="research-grid">
				{#each section.items as item, index}
					<article
						class="research-card interactive-surface"
						data-reveal-item
						style={`--reveal-delay: ${(index % 2) * 65}ms`}
					>
						<div class="paper-meta">
							<span>{item.venue}</span>
							{#if item.badge}<em>{item.badge}</em>{/if}
						</div>
						<h3>{item.title}</h3>
						<p class="authors">{item.authors}</p>
						<p>{item.abstract}</p>
						<a class="snippet-source" href={item.url} target="_blank" rel="noreferrer">
							{item.linkLabel}
						</a>
					</article>
				{/each}
			</div>
		</Reveal>
	</section>
{:else}
	<section class="page-shell section">
		<div class="card empty-state interactive-surface">
			<h2>No matching research</h2>
			<p>Try a different title, author, venue, or keyword.</p>
		</div>
	</section>
{/each}

<style>
	.research-hero {
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.32fr);
		align-items: end;
	}

	.research-index {
		display: grid;
		gap: 0.35rem;
		min-width: 0;
		padding-left: 1.25rem;
		border-left: 1px solid var(--line);
	}

	.research-index strong {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: 2.2rem;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--heading);
	}

	.research-index span {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 0.5rem;
	}

	.research-index a {
		font-family: var(--font-sans);
		font-size: 0.86rem;
		color: var(--text);
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	.research-index a:hover {
		text-decoration: underline;
	}

	.research-controls {
		padding-top: 0;
		padding-bottom: 0.5rem;
	}

	.research-controls label {
		display: grid;
		gap: 0.5rem;
		max-width: 38rem;
	}

	.research-controls label span {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.research-controls input {
		width: 100%;
	}

	.research-section {
		scroll-margin-top: 6rem;
	}

	.research-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	.research-card {
		display: grid;
		grid-template-columns: 13rem minmax(0, 1fr);
		gap: 0.35rem 2rem;
		padding: 1.15rem 0;
		border-bottom: 1px solid var(--line);
	}

	.research-card > :global(:not(.paper-meta)) {
		grid-column: 2;
	}

	.paper-meta {
		grid-column: 1;
		grid-row: 1 / span 4;
	}

	.paper-meta {
		display: grid;
		align-content: start;
		gap: 0.3rem;
		padding-top: 0.35rem;
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.paper-meta em {
		font-style: normal;
		color: var(--gold-ink);
	}

	.research-card h3 {
		margin: 0;
		font-size: 1.22rem;
		line-height: 1.3;
		font-weight: 500;
		color: var(--heading);
	}

	.research-card p {
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: 0.98rem;
		max-width: 72ch;
	}

	.research-card .authors {
		font-family: var(--font-sans);
		font-size: 0.84rem;
		color: var(--muted);
	}

	.research-card .snippet-source {
		margin-top: 0.6rem;
	}

	.empty-state {
		max-width: 40rem;
		border: 0;
		border-top: 1px solid var(--line-strong);
		border-radius: 0;
		padding: 1.25rem 0 0;
		background: transparent;
	}

	.empty-state h2 {
		margin: 0 0 0.4rem;
		font-size: 1.4rem;
	}

	@media (max-width: 900px) {
		.research-hero {
			grid-template-columns: 1fr;
		}

		.research-index {
			padding-left: 0;
			border-left: 0;
			border-top: 1px solid var(--line);
			padding-top: 1rem;
		}
	}

	@media (max-width: 640px) {
		.research-card {
			grid-template-columns: 1fr;
		}
	}
</style>
