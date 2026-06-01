<script lang="ts">
	import { sitePath } from '$lib/paths';
</script>

<svelte:head>
	<title>Seminars | Math AI Lab</title>
	<meta http-equiv="refresh" content={`0; url=${sitePath('/resources#seminars')}`} />
	<link rel="canonical" href={sitePath('/resources#seminars')} />
</svelte:head>

<section class="page-shell section redirect-page">
	<h1>Seminars</h1>
	<p>Seminars are now part of the combined Resources page.</p>
	<a class="button primary" href={sitePath('/resources#seminars')}>Open seminars</a>
</section>

<style>
	.redirect-page {
		min-height: 45vh;
		display: grid;
		align-content: center;
		gap: 1rem;
	}

	.redirect-page h1 {
		margin: 0;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 8vw, 5rem);
		line-height: 1;
	}

	.redirect-page p {
		margin: 0;
		color: var(--muted);
	}
</style>
