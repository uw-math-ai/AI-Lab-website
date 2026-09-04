<script lang="ts">
	import { canonicalOrigin, canonicalUrl } from '$lib/seo';

	let {
		title,
		description,
		path,
		image = '/og/default.png',
		type = 'website',
		jsonLd = null
	}: {
		title: string;
		description: string;
		path: string;
		image?: string;
		type?: string;
		jsonLd?: unknown;
	} = $props();

	const url = $derived(canonicalUrl(path));
	const imageUrl = $derived(`${canonicalOrigin}${image}`);
	const ld = $derived(jsonLd ? JSON.stringify(jsonLd).replaceAll('<', '\\u003c') : null);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:site_name" content="UW Math AI Lab" />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="University of Washington Math AI Lab" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if ld}
		{@html `<script type="application/ld+json">${ld}<` + `/script>`}
	{/if}
</svelte:head>
