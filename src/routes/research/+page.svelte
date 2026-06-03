<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import { researchSections } from '$lib/data/research';

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
	<div class="research-index" aria-label="Research sections">
		<strong>{allItems.length}</strong>
		<span>listed works</span>
		{#each researchSections as section}
			<a href={`#${section.id}`}>{section.title}</a>
		{/each}
	</div>
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
				{#each section.items as item}
					<article class="research-card">
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
		<div class="card empty-state">
			<h2>No matching research</h2>
			<p>Try a different title, author, venue, or keyword.</p>
		</div>
	</section>
{/each}

<style>
	.research-hero {
		grid-template-columns: minmax(0, 1fr) minmax(15rem, 0.36fr);
	}

	.research-index {
		display: grid;
		gap: 0.6rem;
		align-self: end;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 1.2rem;
	}

	.research-index strong {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: 3rem;
		line-height: 1;
	}

	.research-index span {
		color: var(--muted);
		font-weight: 750;
	}

	.research-index a {
		color: var(--purple);
		font-weight: 800;
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.18em;
	}

	.research-controls {
		padding-top: 0;
		padding-bottom: 1rem;
	}

	.research-controls label {
		display: grid;
		gap: 0.55rem;
		max-width: 38rem;
		color: var(--muted);
		font-size: 0.86rem;
		font-weight: 850;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.research-controls input {
		width: 100%;
		text-transform: none;
		letter-spacing: 0;
	}

	.research-section {
		scroll-margin-top: 6rem;
	}

	.research-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.research-card {
		display: grid;
		gap: 0.75rem;
		align-content: start;
		min-height: 23rem;
		background:
			linear-gradient(132deg, color-mix(in srgb, var(--purple) 8%, transparent), transparent 48%),
			var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		padding: 1.15rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.research-card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--purple) 34%, var(--line));
		box-shadow: var(--shadow);
	}

	.paper-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		color: var(--purple);
		font-size: 0.82rem;
		font-weight: 850;
	}

	.paper-meta em {
		border: 1px solid color-mix(in srgb, var(--gold) 48%, var(--line));
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 16%, transparent);
		color: var(--heading);
		font-style: normal;
		padding: 0.16rem 0.48rem;
	}

	.research-card h3 {
		margin: 0;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2vw, 1.7rem);
		line-height: 1.08;
	}

	.research-card p {
		margin: 0;
		color: var(--muted);
	}

	.research-card .authors {
		color: var(--text);
		font-weight: 750;
	}

	.empty-state {
		max-width: 40rem;
	}

	.empty-state h2 {
		margin: 0 0 0.4rem;
		color: var(--heading);
		font-family: var(--font-display);
	}

	@media (max-width: 900px) {
		.research-hero,
		.research-grid {
			grid-template-columns: 1fr;
		}

		.research-card {
			min-height: 0;
		}
	}
</style>
