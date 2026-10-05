<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { labNews } from '$lib/data/news';
	import { sitePath } from '$lib/paths';
	import { collectionPage, graph } from '$lib/structuredData';

	const icml = labNews.find((item) => item.id === 'icml-2026');
	const conferenceLink = icml?.links.find((link) => link.label === 'ICML 2026');
	const title = 'Congratulations to our ICML authors \u2014 UW Math AI Lab';
	const description =
		'Eight UW Math AI Lab papers were accepted to ICML 2026 and its workshops, including an oral presentation and a workshop Spotlight.';
</script>

<Seo {title} {description} path="/news/icml-2026/" jsonLd={graph(collectionPage(title, '/news/icml-2026/', description))} />

{#if icml}
	<section class="page-shell hero compact-hero single" id="icml-2026">
		<div>
			<a class="back-link" href={sitePath('/news')}><span aria-hidden="true">←</span> All news</a>
			<h1>Congratulations to our ICML authors</h1>
			<p>{icml.body}</p>
			<div class="meta icml-meta">
				{#each icml.facts ?? [] as fact}
					<span class="pill">{fact}</span>
				{/each}
			</div>
			<div class="actions">
				{#if conferenceLink}
					<a class="button" href={conferenceLink.url} target="_blank" rel="noreferrer">ICML 2026<span class="sr-only"> (opens in new tab)</span></a>
				{/if}
			</div>
		</div>
	</section>

	{#if icml.photos?.length}
		<section class="page-shell section" aria-label="Photos from ICML 2026 at COEX">
			<Reveal>
				<div class="icml-gallery">
					{#each icml.photos as photo, index}
						<figure
							class="icml-photo interactive-surface"
							data-reveal-item
							style={`--reveal-delay: ${Math.min(index, 3) * 55}ms; --ar: ${(photo.width ?? 16) / (photo.height ?? 9)}`}
						>
							<img
								src={sitePath(photo.src)}
								alt={photo.alt}
								width={photo.width}
								height={photo.height}
								loading="lazy"
								decoding="async"
							/>
							<figcaption>{photo.caption}</figcaption>
						</figure>
					{/each}
				</div>
			</Reveal>
		</section>
	{/if}

	{#if icml.papers?.length}
		<section class="page-shell section" aria-labelledby="icml-papers-heading">
			<Reveal>
				<div class="section-header">
					<h2 id="icml-papers-heading">Accepted papers</h2>
				</div>
				<ol class="icml-paper-list">
					{#each icml.papers as paper, index}
						<li
							class="interactive-surface"
							data-reveal-item
							class:honored={paper.badge}
							style={`--reveal-delay: ${(index % 2) * 60}ms`}
						>
							<a href={paper.url} target="_blank" rel="noreferrer">
								<span>{paper.title}</span>
								{#if paper.badge}<em>{paper.badge}</em>{/if}
							</a>
						</li>
					{/each}
				</ol>
			</Reveal>
		</section>
	{/if}
{/if}

<style>
	.icml-meta {
		margin: 1rem 0 1.25rem;
	}

	/* Justified rows, like the People gallery: equal heights, flush edges, no cropping. */
	.icml-gallery {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.icml-gallery::after {
		content: '';
		flex-grow: 999;
	}

	.icml-photo {
		flex: var(--ar) 1 calc(var(--ar) * 12rem);
		min-width: 0;
		margin: 0;
	}

	.icml-photo img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.icml-photo figcaption {
		margin-top: 0.4rem;
		color: var(--muted);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		line-height: 1.4;
	}

	.icml-paper-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 2.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.icml-paper-list li {
		min-width: 0;
		border-bottom: 1px solid var(--line);
	}

	.icml-paper-list a {
		display: grid;
		gap: 0.25rem;
		justify-items: start;
		padding: 0.8rem 0;
		color: var(--heading);
		font-size: var(--text-base);
		font-weight: 500;
		line-height: 1.35;
		text-decoration: none;
	}

	.icml-paper-list a:hover span {
		text-decoration: underline;
	}

	.icml-paper-list em {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		font-style: normal;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold-ink);
	}

	@media (max-width: 900px) {
		.icml-paper-list {
			grid-template-columns: 1fr;
		}
	}
</style>
