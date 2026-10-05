<script lang="ts">
	import { labNews } from '$lib/data/news';
	import { sitePath } from '$lib/paths';

	// `preview` is the home-page form: a lead story with a large photo beside a column of
	// headlines (small thumbnail when an entry has a photo, text only when it doesn't).
	// The full form, used on the News page, is one ruled column of stories.
	let { limit = undefined, heading = true, preview = false } = $props<{
		limit?: number;
		heading?: boolean;
		preview?: boolean;
	}>();
	const items = $derived(limit ? labNews.slice(0, limit) : labNews);
	const lead = $derived(items.find((item) => item.image) ?? items[0]);
	const rest = $derived(items.filter((item) => item !== lead));

	function formatDate(value: string) {
		return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
			month: 'short', day: 'numeric', year: 'numeric'
		});
	}
</script>

{#snippet photo(item: (typeof items)[number], className: string)}
	{#if item.image}
		<img
			class={className}
			src={sitePath(item.image.src)}
			alt={item.image.alt}
			width={item.image.width}
			height={item.image.height}
			loading="lazy"
			decoding="async"
		/>
	{/if}
{/snippet}

{#if items.length}
	<section class="page-shell section" class:under-title={!heading} aria-labelledby={heading ? 'news-heading' : undefined} aria-label={heading ? undefined : 'News'}>
		{#if heading}
			<div class="section-header">
				<h2 id="news-heading">News</h2>
				<a class="section-link" href={sitePath('/news')}>All news →</a>
			</div>
		{/if}

		{#if preview}
			<div class="news-layout">
				<article class="lead">
					{@render photo(lead, 'lead-image')}
					<h3>{lead.title}</h3>
					<p class="clamp">{lead.summary}</p>
					<a class="read-more" href={sitePath(`/news#${lead.id}`)}>Read more<span class="sr-only">: {lead.title}</span> →</a>
				</article>
				<ul class="river">
					{#each rest as item}
						<li class="story" class:has-image={item.image}>
							<div class="story-text">
								<h3>{item.title}</h3>
								<p class="clamp">{item.summary}</p>
								<a class="read-more" href={sitePath(`/news#${item.id}`)}>Read more<span class="sr-only">: {item.title}</span> →</a>
							</div>
							{@render photo(item, 'thumb')}
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			<ul class="river full">
				{#each items as item}
					<li class="story" class:has-image={item.image} id={item.id}>
						<div class="story-text">
							<time datetime={item.date}>{formatDate(item.date)}</time>
							<h2>{item.title}</h2>
							<p>{item.summary}</p>
							<div class="news-links">
								{#each item.links as link}
									<a href={link.url.startsWith('/') ? sitePath(link.url) : link.url}
										target={link.url.startsWith('http') ? '_blank' : undefined}
										rel={link.url.startsWith('http') ? 'noreferrer' : undefined}>{link.label}</a>
								{/each}
							</div>
						</div>
						{@render photo(item, 'thumb')}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}

<style>
	.news-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
		gap: 2rem 3rem;
		align-items: start;
	}

	.lead {
		display: grid;
		gap: 0.6rem;
	}

	.lead h3 {
		font-size: var(--text-xl);
		line-height: 1.2;
	}

	.lead-image {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		margin-bottom: 0.3rem;
	}

	.river {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Headlines are separated by hairlines; a photo, when there is one, sits to the right. */
	.story {
		display: grid;
		gap: 1.25rem;
		padding: 1.1rem 0;
		border-top: 1px solid var(--line);
		scroll-margin-top: 5rem;
	}

	.story:first-child {
		padding-top: 0;
		border-top: 0;
	}

	.story.has-image {
		grid-template-columns: minmax(0, 1fr) 7rem;
	}

	/* On the News page the list sits right under the page title. */
	.under-title {
		padding-top: 0.5rem;
	}

	.full .story:first-child {
		padding-top: 0;
	}

	.full .story.has-image {
		grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem);
	}

	.story-text {
		display: grid;
		align-content: start;
		gap: 0.4rem;
	}

	.thumb {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		order: 1;
	}

	.full .thumb {
		aspect-ratio: 16 / 10;
	}

	time {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--muted);
	}

	.story-text h2,
	h3 {
		margin: 0;
		font-size: var(--text-lg);
		line-height: 1.3;
	}

	p {
		margin: 0;
		color: var(--muted);
	}

	.clamp {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.news-links,
	.read-more {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.news-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
	}

	.read-more {
		width: fit-content;
		color: var(--purple);
	}

	@media (max-width: 900px) {
		.news-layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.story.has-image,
		.full .story.has-image {
			grid-template-columns: minmax(0, 1fr) 5.5rem;
		}
	}
</style>
