<script lang="ts">
	import { labNews } from '$lib/data/news';
	import { sitePath } from '$lib/paths';

	function formatDate(value: string) {
		return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
			month: 'short', day: 'numeric', year: 'numeric'
		});
	}
</script>

{#if labNews.length}
	<section class="page-shell section" aria-labelledby="news-heading">
		<div class="section-header"><h2 id="news-heading">News</h2></div>
		<ul class="news-list">
			{#each labNews as item}
				<li class="news-item interactive-surface" id={item.id}>
					<time datetime={item.date}>{formatDate(item.date)}</time>
					<div>
						<h3>{item.title}</h3>
						<p>{item.summary}</p>
						<div class="news-links">
							{#each item.links as link}
								<a href={link.url.startsWith('/') ? sitePath(link.url) : link.url}
									target={link.url.startsWith('http') ? '_blank' : undefined}
									rel={link.url.startsWith('http') ? 'noreferrer' : undefined}>{link.label}</a>
							{/each}
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.news-list { list-style: none; padding: 0; margin: 0; }
	.news-item { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1rem; padding: 1.25rem 0; border-top: 1px solid var(--line); scroll-margin-top: 5rem; }
	time { font-family: var(--font-sans); font-size: 0.8rem; color: var(--muted); padding-top: 0.3rem; }
	h3 { margin: 0; font-size: 1.2rem; line-height: 1.35; }
	p { margin: 0.4rem 0 0.6rem; color: var(--muted); }
	.news-links { display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; font-family: var(--font-sans); font-size: 0.8rem; }
	@media (max-width: 600px) { .news-item { grid-template-columns: 1fr; gap: 0.5rem; } }
</style>
