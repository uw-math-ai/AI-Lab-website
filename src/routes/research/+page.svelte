<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { researchSections, searchResearch } from '$lib/data/research';
	import { pages } from '$lib/data/pages';
	import { collectionPage, graph } from '$lib/structuredData';

	const { title, description } = pages.research;
	const researchItems = researchSections.flatMap((section) =>
		section.items.map((item) => ({ ...item, countsAsPaper: section.countsAsPaper }))
	);
	const researchJsonLd = graph(
		collectionPage(title, '/research/', description),
		{
			'@type': 'ItemList',
			name: 'UW Math AI Lab research',
			itemListElement: researchItems.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': item.countsAsPaper ? 'ScholarlyArticle' : 'CreativeWork',
					name: item.title,
					author: item.authors.split(', ').map((name) => ({ '@type': 'Person', name })),
					description: item.abstract,
					isPartOf: item.venues.map((venue) => ({ '@type': 'CreativeWork', name: venue.name })),
					url: item.url,
					sameAs: item.url
				}
			}))
		}
	);

	let query = $state('');
	let expanded = $state(new Set<string>());
	// Abstracts that fit in three lines show in full and get no toggle. Only entries whose
	// text is actually cut off by the clamp are listed here, measured in the browser.
	let clamped = $state(new Set<string>());

	function measureClamp(node: HTMLElement, key: string) {
		const check = () => {
			if (node.classList.contains('open')) return; // expanded: keep the last collapsed result
			const cut = node.scrollHeight > node.clientHeight + 1;
			if (cut !== clamped.has(key)) {
				const next = new Set(clamped);
				if (cut) next.add(key);
				else next.delete(key);
				clamped = next;
			}
		};
		const observer = new ResizeObserver(check);
		observer.observe(node);
		check();
		return { destroy: () => observer.disconnect() };
	}

	function toggle(set: Set<string>, key: string) {
		const next = new Set(set);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		return next;
	}

	const allItems = $derived(researchSections.flatMap((section) => section.items));
	const filteredSections = $derived(searchResearch(query));
</script>

<Seo {title} {description} path="/research/" jsonLd={researchJsonLd} />

<svelte:head>
	<noscript><style>.abstract { display: block !important; }</style></noscript>
</svelte:head>

{#snippet counter(value: number, label: string)}
	<span class="research-stat">
		<strong>{value}</strong>
		<span class="research-stat-label">{label}</span>
	</span>
{/snippet}

<section class="page-shell hero research-hero">
	<div>
		<h1>Research</h1>
		<p>
			Publications, preprints, and Lean formalizations from the Math AI Lab.
		</p>
		<div class="actions">
			<a class="button primary" href="#conference-workshop-papers">Publications</a>
			<a class="button" href="#research-artifacts">Lean Projects</a>
		</div>
		<label class="research-search">
			<span>Search</span>
			<input type="search" bind:value={query} placeholder="Search project titles, descriptions, or authors" />
		</label>
	</div>
	<Reveal class="research-index-reveal">
		<nav class="research-index interactive-surface" aria-label="Research sections">
			{@render counter(allItems.length, 'listed works')}
			<div class="research-index-sections">
				{#each researchSections as section}
					<a href={`#${section.id}`}>
						{@render counter(filteredSections.find((result) => result.id === section.id)?.items.length ?? 0, section.title)}
					</a>
				{/each}
			</div>
		</nav>
	</Reveal>
</section>

{#each filteredSections as section}
	<section class="page-shell section research-section" id={section.id}>
		<Reveal>
			<div class="section-header">
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
							{#each item.venues as venue}
								<span class="venue">{venue.name}{#if venue.badge}<em>{venue.badge}</em>{/if}</span>
							{/each}
						</div>
						<h3>{item.title}</h3>
						<p class="authors">{item.authors}</p>
						<div class="abstract-wrap">
							<p class="abstract" class:open={expanded.has(item.url)} use:measureClamp={item.url}>{item.abstract}</p>
						</div>
						<div class="paper-actions">
							{#if clamped.has(item.url)}
								<button
									type="button"
									class="disclose"
									aria-expanded={expanded.has(item.url)}
									onclick={() => (expanded = toggle(expanded, item.url))}
								>
									{expanded.has(item.url) ? 'Show less' : section.countsAsPaper ? 'Show full abstract' : 'Show full description'}
									<span aria-hidden="true">{expanded.has(item.url) ? '▴' : '▾'}</span>
								</button>
							{/if}
							<a class="snippet-source" href={item.url} target="_blank" rel="noreferrer">
								{item.linkLabel}
							</a>
						</div>
					</article>
				{/each}
			</div>
		</Reveal>
	</section>
{:else}
	<section class="page-shell section">
		<div class="card empty-state interactive-surface">
			<h2>No matching research</h2>
			<p>Try a title, author, topic, status, or reference.</p>
		</div>
	</section>
{/each}

<style>
	/* Top-aligned: the title and the stats start on the same line. */
	.research-hero {
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.32fr);
		align-items: start;
	}

	.research-hero .actions {
		margin-top: 2rem;
	}

	.research-index {
		display: grid;
		gap: 1.25rem;
		min-width: 0;
		padding-left: 1.25rem;
		border-left: 1px solid var(--line);
	}

	.research-stat {
		display: grid;
		gap: 0.5rem;
		align-content: start;
	}

	.research-stat strong {
		font-family: var(--font-serif);
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: var(--text-title);
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--heading);
	}

	.research-stat-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		line-height: 1.5;
	}

	.research-index-sections {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem 1rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--line);
	}

	.research-index a {
		text-decoration: none;
		min-width: 0;
	}

	.research-index a:hover .research-stat-label {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	/* Search lives in the intro, under the buttons, so the title area is one block
	   that is about as tall as the stats beside it. */
	.research-search {
		display: grid;
		gap: 0.5rem;
		max-width: 34rem;
		margin-top: 2rem;
	}

	.research-search span {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.research-search input {
		width: 100%;
	}

	.research-section {
		scroll-margin-top: 6rem;
	}

	.research-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	/* Abstracts run long, so they open on request. The wrapper keeps the
	   paragraph out of the grid, which would otherwise blockify -webkit-box
	   and drop the clamp. */
	.abstract-wrap {
		min-width: 0;
	}

	.abstract {
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.abstract.open {
		display: block;
	}

	.paper-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1.25rem;
		margin-top: 0.6rem;
	}

	/* The disclosure toggle (when shown) and the source link read as one row. */
	.paper-actions :global(.snippet-source) {
		margin-top: 0;
		font-size: var(--text-sm);
		line-height: 1.2;
		border-bottom: 1px solid color-mix(in srgb, var(--purple) 40%, transparent);
	}

	.paper-actions :global(.snippet-source):hover {
		border-bottom-color: var(--purple);
		text-decoration: none;
	}

	.disclose {
		border: 0;
		background: none;
		padding: 0;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		line-height: 1.2;
		color: var(--purple);
		cursor: pointer;
		border-bottom: 1px solid color-mix(in srgb, var(--purple) 40%, transparent);
	}

	.disclose:hover {
		border-bottom-color: var(--purple);
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
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.paper-meta .venue {
		display: grid;
		justify-items: start;
		gap: 0.15rem;
	}

	.paper-meta em {
		font-style: normal;
		color: var(--gold-ink);
	}

	.research-card h3 {
		margin: 0;
		font-size: var(--text-lg);
		line-height: 1.3;
		font-weight: 500;
		color: var(--heading);
	}

	.research-card p {
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: var(--text-base);
		max-width: 72ch;
	}

	.research-card .authors {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--muted);
	}

	.research-card .snippet-source {
		margin-top: 0.6rem;
	}

	.empty-state {
		max-width: 40rem;
		border: 0;
		border-radius: 0;
		padding: 1.25rem 0 0;
		background: transparent;
	}

	.empty-state h2 {
		margin: 0 0 0.4rem;
		font-size: var(--text-xl);
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

		.research-index-sections {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.research-index-sections {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.research-card {
			grid-template-columns: 1fr;
		}

		/* One column: the venue sits above the text, and nothing is pushed into an implicit second column. */
		.research-card > :global(:not(.paper-meta)) {
			grid-column: 1;
		}

		.paper-meta {
			grid-row: auto;
		}
	}
</style>
