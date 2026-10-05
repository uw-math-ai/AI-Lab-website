<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import NewsList from '$lib/components/NewsList.svelte';
	import { pages } from '$lib/data/pages';
	import { collectionPage, graph } from '$lib/structuredData';

	const { title, description } = pages.news;
</script>

<Seo {title} {description} path="/news/" jsonLd={graph(collectionPage(title, '/news/', description))} />

<section class="page-shell hero compact-hero single">
	<div>
		<h1>News</h1>
	</div>
</section>

<NewsList heading={false} />
