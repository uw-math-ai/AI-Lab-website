<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import { researchSections } from '$lib/data/research';
	import { canonicalUrl } from '$lib/seo';

	let query = $state('');
	let expanded = $state(new Set<string>());
	let previewing = $state(new Set<string>());

	/** arXiv refuses to be framed at /abs, but serves /pdf without restriction. */
	function arxivId(url: string) {
		return url.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})/)?.[1] ?? null;
	}

	function toggle(set: Set<string>, key: string) {
		const next = new Set(set);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		return next;
	}

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
							{#if previewing.has(item.url)}
								<figure class="paper-preview">
									<a
										class="preview-open"
										href={`https://arxiv.org/pdf/${arxivId(item.url)}`}
										target="_blank"
										rel="noreferrer"
										aria-label={`Open ${item.title} on arXiv`}
									>
										<iframe
											src={`https://arxiv.org/pdf/${arxivId(item.url)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
											title={`First page of ${item.title}`}
											loading="lazy"
											tabindex="-1"
										></iframe>
									</a>
									<figcaption>First page — open on arXiv ↗</figcaption>
								</figure>
							{/if}
						</div>
						<h3>{item.title}</h3>
						<p class="authors">{item.authors}</p>
						<div class="abstract-wrap">
							<p class="abstract" class:open={expanded.has(item.url)}>{item.abstract}</p>
						</div>
						<div class="paper-actions">
							<button
								type="button"
								class="disclose"
								aria-expanded={expanded.has(item.url)}
								onclick={() => (expanded = toggle(expanded, item.url))}
							>
								{expanded.has(item.url) ? 'Less' : 'Read the abstract'}
							</button>
							<a class="snippet-source" href={item.url} target="_blank" rel="noreferrer">
								{item.linkLabel}
							</a>
							{#if arxivId(item.url)}
								<button
									type="button"
									class="disclose"
									aria-expanded={previewing.has(item.url)}
									onclick={() => (previewing = toggle(previewing, item.url))}
								>
									{previewing.has(item.url) ? 'Hide the paper' : 'Preview the paper'}
								</button>
							{/if}
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

	/* All three read as one row of controls. */
	.paper-actions :global(.snippet-source) {
		margin-top: 0;
		font-size: 0.8rem;
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
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--purple);
		cursor: pointer;
		border-bottom: 1px solid color-mix(in srgb, var(--purple) 40%, transparent);
	}

	.disclose:hover {
		border-bottom-color: var(--purple);
	}

	/* A small plate in the margin: the top of page one, cropped. The frame is
	   inert, so the whole thumbnail is one link to the PDF. */
	.paper-preview {
		margin: 0.75rem 0 0;
	}

	.preview-open {
		position: relative;
		display: block;
		aspect-ratio: 1 / 0.78;
		overflow: hidden;
		border: 1px solid var(--line-strong);
		border-radius: 2px;
		background: #fff;
	}

	.preview-open iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		aspect-ratio: 1 / 1.414;
		border: 0;
		pointer-events: none;
	}

	.preview-open:hover {
		border-color: var(--purple);
	}

	.paper-preview figcaption {
		margin-top: 0.35rem;
		font-family: var(--font-sans);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: none;
		color: var(--purple);
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
